# src/api/participant Guide

This directory owns the participant API boundary.

## Required Flow

```text
query hook
  -> ParticipantApiController
  -> ParticipantPayloadMapper
  -> SupabaseParticipantApiGateway or HttpParticipantApiGateway
```

## Responsibilities

- Define participant domain models.
- Expose controller contracts and runtime provider.
- Implement Supabase-backed gateway now and keep space for HTTP-backed gateway later without changing views.
- Provide query hooks for public survey, duplicate submission, final submit, and asset URL caching when needed.
- Keep session/auth use cases on the participant controller so views do not talk to Supabase Auth directly.

## Rules

- Do not import participant views from this directory.
- Do not let query hooks call gateways directly.
- Do not let gateways return raw rows to views.
- Preserve the response/answer persistence model from the PRD/TDD.
- `admin_members` is not part of participant view data access.
