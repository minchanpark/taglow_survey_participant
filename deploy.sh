#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="frontend-participant"
CONTAINER_NAME="frontend-participant"
IMAGE_REPOSITORY="frontend-participant"
IMAGE_TAG=""
DEPLOY_ROOT="/opt/taglow/frontend-participant"
RELEASE_DIR=""
ARCHIVE_PATH=""
COMPOSE_SOURCE=""
HOST_PORT="3000"
CONTAINER_PORT="3000"
CANDIDATE_PORT=""
HEALTHCHECK_PATH="/healthz"

usage() {
  cat <<'EOF'
Usage:
  deploy.sh \
    --release-dir /tmp/taglow-frontend-participant-<sha> \
    --archive /tmp/taglow-frontend-participant-<sha>/frontend-participant_<sha>.tar.gz \
    --compose-file /tmp/taglow-frontend-participant-<sha>/docker-compose.prod.yml \
    --deploy-root /opt/taglow/frontend-participant \
    --app-name frontend-participant \
    --image-repository frontend-participant \
    --image-tag <sha> \
    --container-name frontend-participant
EOF
}

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

die() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --release-dir)
      RELEASE_DIR="$2"
      shift 2
      ;;
    --archive)
      ARCHIVE_PATH="$2"
      shift 2
      ;;
    --compose-file)
      COMPOSE_SOURCE="$2"
      shift 2
      ;;
    --deploy-root)
      DEPLOY_ROOT="$2"
      shift 2
      ;;
    --app-name)
      APP_NAME="$2"
      shift 2
      ;;
    --image-repository)
      IMAGE_REPOSITORY="$2"
      shift 2
      ;;
    --image-tag)
      IMAGE_TAG="$2"
      shift 2
      ;;
    --container-name)
      CONTAINER_NAME="$2"
      shift 2
      ;;
    --host-port)
      HOST_PORT="$2"
      shift 2
      ;;
    --container-port)
      CONTAINER_PORT="$2"
      shift 2
      ;;
    --candidate-port)
      CANDIDATE_PORT="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

[[ -n "$RELEASE_DIR" ]] || die "--release-dir is required."
[[ -n "$ARCHIVE_PATH" ]] || die "--archive is required."
[[ -n "$IMAGE_TAG" ]] || die "--image-tag is required."

if [[ -z "$COMPOSE_SOURCE" ]]; then
  COMPOSE_SOURCE="$RELEASE_DIR/docker-compose.prod.yml"
fi

[[ -f "$ARCHIVE_PATH" ]] || die "Archive file not found: $ARCHIVE_PATH"
[[ -f "$COMPOSE_SOURCE" ]] || die "Compose file not found: $COMPOSE_SOURCE"

SUDO=()
if [[ "$(id -u)" -ne 0 ]] && command -v sudo >/dev/null 2>&1; then
  SUDO=(sudo)
fi

run_root() {
  if ((${#SUDO[@]} > 0)); then
    "${SUDO[@]}" "$@"
  else
    "$@"
  fi
}

DOCKER=(docker)
if ! docker info >/dev/null 2>&1; then
  if ((${#SUDO[@]} > 0)); then
    DOCKER=(sudo docker)
  else
    die "Docker daemon is not accessible for user $(id -un)."
  fi
fi

docker_cmd() {
  "${DOCKER[@]}" "$@"
}

if ! docker_cmd compose version >/dev/null 2>&1; then
  die "docker compose plugin is required on the EC2 host."
fi

if ! command -v curl >/dev/null 2>&1 && ! command -v wget >/dev/null 2>&1; then
  die "curl or wget is required on the EC2 host for health checks."
fi

http_probe() {
  local url="$1"

  if command -v curl >/dev/null 2>&1; then
    curl -fsS "$url" >/dev/null
  else
    wget -q -O /dev/null "$url"
  fi
}

wait_for_url() {
  local url="$1"
  local attempts="${2:-30}"
  local sleep_seconds="${3:-2}"
  local attempt

  for ((attempt = 1; attempt <= attempts; attempt += 1)); do
    if http_probe "$url"; then
      return 0
    fi
    sleep "$sleep_seconds"
  done

  return 1
}

SHARED_DIR="$DEPLOY_ROOT/shared"
RELEASES_DIR="$DEPLOY_ROOT/releases"
RELEASE_STORE_DIR="$RELEASES_DIR/$IMAGE_TAG"
RUNTIME_ENV="$SHARED_DIR/runtime.env"
COMPOSE_FILE="$DEPLOY_ROOT/docker-compose.prod.yml"
ARCHIVE_STORE_PATH="$RELEASE_STORE_DIR/${IMAGE_REPOSITORY}_${IMAGE_TAG}.tar.gz"
IMAGE_REF="${IMAGE_REPOSITORY}:${IMAGE_TAG}"
HEALTHCHECK_URL="http://127.0.0.1:${HOST_PORT}${HEALTHCHECK_PATH}"
CANDIDATE_HEALTHCHECK_URL="http://127.0.0.1:${CANDIDATE_PORT}${HEALTHCHECK_PATH}"
CANDIDATE_NAME="${CONTAINER_NAME}-candidate-${IMAGE_TAG:0:12}"
PREVIOUS_TAG=""

if [[ -f "$RUNTIME_ENV" ]]; then
  PREVIOUS_TAG="$(awk -F= '/^IMAGE_TAG=/{print $2}' "$RUNTIME_ENV" | tail -n 1)"
fi

cleanup_candidate() {
  docker_cmd rm -f "$CANDIDATE_NAME" >/dev/null 2>&1 || true
}

resolve_candidate_url() {
  local port_mapping
  local resolved_port

  port_mapping="$(docker_cmd port "$CANDIDATE_NAME" "${CONTAINER_PORT}/tcp" | awk -F: 'NR==1 {print $NF}')"
  [[ -n "$port_mapping" ]] || die "Could not determine candidate container host port."

  resolved_port="$port_mapping"
  CANDIDATE_HEALTHCHECK_URL="http://127.0.0.1:${resolved_port}${HEALTHCHECK_PATH}"
}

write_runtime_env() {
  local target_tag="$1"
  local tmp_file

  tmp_file="$(mktemp)"
  cat > "$tmp_file" <<EOF
IMAGE_REPOSITORY=$IMAGE_REPOSITORY
IMAGE_TAG=$target_tag
CONTAINER_NAME=$CONTAINER_NAME
HOST_PORT=$HOST_PORT
CONTAINER_PORT=$CONTAINER_PORT
EOF
  run_root install -m 644 "$tmp_file" "$RUNTIME_ENV"
  rm -f "$tmp_file"
}

compose_cmd() {
  docker_cmd compose -p "$APP_NAME" --env-file "$RUNTIME_ENV" -f "$COMPOSE_FILE" "$@"
}

rollback() {
  if [[ -n "$PREVIOUS_TAG" && "$PREVIOUS_TAG" != "$IMAGE_TAG" ]]; then
    log "Rolling back to image tag ${PREVIOUS_TAG}."
    write_runtime_env "$PREVIOUS_TAG"
    compose_cmd up -d --remove-orphans --force-recreate || true
  fi
}

trap cleanup_candidate EXIT

log "Preparing deployment directories under ${DEPLOY_ROOT}."
run_root install -d -m 755 "$DEPLOY_ROOT" "$SHARED_DIR" "$RELEASES_DIR" "$RELEASE_STORE_DIR"
run_root cp "$COMPOSE_SOURCE" "$COMPOSE_FILE"
run_root cp "$COMPOSE_SOURCE" "$RELEASE_STORE_DIR/docker-compose.prod.yml"
run_root cp "$ARCHIVE_PATH" "$ARCHIVE_STORE_PATH"

log "Loading Docker image ${IMAGE_REF}."
if [[ "$ARCHIVE_STORE_PATH" == *.gz ]]; then
  gzip -dc "$ARCHIVE_STORE_PATH" | docker_cmd load >/dev/null
else
  docker_cmd load -i "$ARCHIVE_STORE_PATH" >/dev/null
fi

cleanup_candidate
if [[ -n "$CANDIDATE_PORT" ]]; then
  log "Starting candidate container on fixed port ${CANDIDATE_PORT}."
  docker_cmd run -d \
    --name "$CANDIDATE_NAME" \
    --pull never \
    --restart no \
    --read-only \
    --tmpfs /var/cache/nginx \
    --tmpfs /var/run \
    --tmpfs /tmp \
    --cap-drop ALL \
    --security-opt no-new-privileges:true \
    -p "127.0.0.1:${CANDIDATE_PORT}:${CONTAINER_PORT}" \
    "$IMAGE_REF" >/dev/null
else
  log "Starting candidate container on an ephemeral loopback port."
  docker_cmd run -d \
    --name "$CANDIDATE_NAME" \
    --pull never \
    --restart no \
    --read-only \
    --tmpfs /var/cache/nginx \
    --tmpfs /var/run \
    --tmpfs /tmp \
    --cap-drop ALL \
    --security-opt no-new-privileges:true \
    -p "127.0.0.1::${CONTAINER_PORT}" \
    "$IMAGE_REF" >/dev/null
  resolve_candidate_url
fi

if [[ -n "$CANDIDATE_PORT" ]]; then
  CANDIDATE_HEALTHCHECK_URL="http://127.0.0.1:${CANDIDATE_PORT}${HEALTHCHECK_PATH}"
fi

docker_cmd inspect "$CANDIDATE_NAME" >/dev/null

if [[ -z "$CANDIDATE_PORT" ]]; then
  log "Candidate health check target: ${CANDIDATE_HEALTHCHECK_URL}"
fi

if ! wait_for_url "$CANDIDATE_HEALTHCHECK_URL" 30 2; then
  docker_cmd logs --tail 100 "$CANDIDATE_NAME" || true
  die "Candidate container failed health check on ${CANDIDATE_HEALTHCHECK_URL}."
fi

cleanup_candidate

log "Updating compose stack to image ${IMAGE_REF}."
write_runtime_env "$IMAGE_TAG"

if ! compose_cmd up -d --remove-orphans --force-recreate; then
  rollback
  die "docker compose up failed."
fi

if ! wait_for_url "$HEALTHCHECK_URL" 30 2; then
  docker_cmd logs --tail 100 "$CONTAINER_NAME" || true
  rollback
  die "Deployed container failed health check on ${HEALTHCHECK_URL}."
fi

log "Deployment succeeded. Pruning stale release bundles and images."
while IFS= read -r old_release; do
  run_root rm -rf "$old_release"
done < <(find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +14 2>/dev/null)

docker_cmd image prune -af \
  --filter "label=com.taglow.service=${APP_NAME}" \
  --filter "until=240h" >/dev/null || true

rm -rf "$RELEASE_DIR"

log "Current deployment is healthy at ${HEALTHCHECK_URL}."
