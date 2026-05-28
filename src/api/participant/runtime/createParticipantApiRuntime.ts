import { readEnvConfig } from '../../../utils/envConfig';
import { GatewayBackedParticipantApiController } from '../controller/gatewayBackedParticipantApiController';
import type { ParticipantApiController } from '../controller/participantApiController';
import { HttpParticipantApiGateway } from '../service/gateway/httpParticipantApiGateway';
import type { ParticipantApiGateway } from '../service/gateway/participantApiGateway';
import { createSupabaseParticipantApiGateway } from '../service/gateway/supabaseParticipantApiGateway';
import { ParticipantPayloadMapper } from '../service/mapper/participantPayloadMapper';

export type ParticipantApiRuntime = Readonly<{
  gateway: ParticipantApiGateway;
  mapper: ParticipantPayloadMapper;
  controller: ParticipantApiController;
}>;

let participantApiRuntime: ParticipantApiRuntime | null = null;

export function getParticipantApiRuntime(): ParticipantApiRuntime {
  participantApiRuntime ??= createParticipantApiRuntime();
  return participantApiRuntime;
}

export function createParticipantApiRuntime(): ParticipantApiRuntime {
  const config = readEnvConfig();
  const mapper = new ParticipantPayloadMapper();
  const gateway =
    config.participantApiMode === 'http'
      ? new HttpParticipantApiGateway(config.participantApiBaseUrl ?? '')
      : createSupabaseParticipantApiGateway({
          supabaseUrl: config.supabaseUrl,
          supabaseAnonKey: config.supabaseAnonKey,
        });

  return {
    gateway,
    mapper,
    controller: new GatewayBackedParticipantApiController(gateway, mapper),
  };
}
