# src/api/participant/service/gateway Guide

This directory owns external IO for participant APIs.

## Expected Files

- `participantApiGateway.ts`
- `supabaseParticipantApiGateway.ts`
- `httpParticipantApiGateway.ts`
- `apiErrors.ts`

## Responsibilities

- Define the `ParticipantApiGateway` interface.
- Fetch published public survey data from `surveys`, `survey_sections`, `questions`, and `survey_assets`.
- Check duplicate submission status.
- Submit one `responses` row and many `answers` rows, preferably through an RPC transaction when available.
- Normalize Supabase/HTTP failures into routeable participant API errors.

## Rules

- Supabase SDK and raw database rows are allowed here.
- Do not export raw rows to views or query hooks.
- Do not delete drafts here; draft cleanup belongs to mutation success handling.
- Keep HTTP gateway parity with the Supabase gateway contract.

