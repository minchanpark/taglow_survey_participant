# src/api/participant/query Guide

This directory owns TanStack Query hooks for participant server state.

## Expected Files

- `queryKeys.ts`
- `usePublicSurveyQuery.ts`
- `useSubmissionMutation.ts`
- `useDuplicateSubmissionQuery.ts`

## Responsibilities

- Define stable participant query keys.
- Fetch public survey data through `ParticipantApiController`.
- Check duplicate submission through `ParticipantApiController`.
- Submit survey through `ParticipantApiController`.
- Keep mutation success/failure hooks predictable for draft cleanup and retry UI.

## Rules

- Do not import gateways, mappers, or Supabase SDK.
- Do not perform React Hook Form validation here; call validated commands.
- Keep query keys scoped by public slug, survey id, participant user id, and locale where relevant.

