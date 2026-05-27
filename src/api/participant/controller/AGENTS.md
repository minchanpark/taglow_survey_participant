# src/api/participant/controller Guide

This directory exposes the controller contract used by query hooks and runtime providers.

## Expected Files

- `participantApiController.ts`
- `gatewayBackedParticipantApiController.ts`
- `participantApiControllerProvider.tsx`

## Responsibilities

- Define `ParticipantApiController`.
- Implement controller methods by orchestrating gateway and mapper modules.
- Expose a React provider/hook only for controller access, not for business UI.
- Normalize controller-level errors for pages and mutations.

## Rules

- Query hooks may depend on this directory.
- Views should not instantiate controllers directly.
- Do not import Supabase SDK here; inject a gateway from runtime.
- Keep the public contract stable when changing gateway internals.

