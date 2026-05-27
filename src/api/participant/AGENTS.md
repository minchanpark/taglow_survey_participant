# src/api/participant Guide

This directory owns the participant API boundary.

## Required Flow

```text
query hook
  -> ParticipantApiController
  -> ParticipantPayloadMapper
  -> ParticipantApiGateway
```

## Responsibilities

- Define participant domain models.
- Expose controller contracts and runtime provider.
- Implement Supabase-backed gateway now and keep space for HTTP-backed gateway later.
- Provide query hooks for public survey, duplicate submission, and final submit.

## Rules

- Do not import participant views from this directory.
- Do not let query hooks call gateways directly.
- Do not let gateways return raw rows to views.
- Preserve the response/answer persistence model from the PRD/TDD.

