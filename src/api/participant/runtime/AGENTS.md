# src/api/participant/runtime Guide

This directory creates the concrete participant API runtime.

## Expected Files

- `createParticipantApiRuntime.ts`
- `participantApiRuntime.tsx`

## Responsibilities

- Instantiate concrete gateways, mappers, controllers, and provider values.
- Centralize environment-driven choice between Supabase and future HTTP gateway.
- Provide the participant API runtime to the React app.

## Rules

- Integration setup belongs here, not in views.
- Supabase client wiring may live here only when it remains hidden behind gateways/controllers.
- Keep runtime creation testable by allowing fake gateways/controllers in tests.

