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
- Cache current participant session and signed asset URLs through `ParticipantApiController` when implemented.
- Submit survey through `ParticipantApiController`.
- Keep mutation success/failure hooks predictable for draft cleanup and retry UI.

## Rules

- Do not import gateways, mappers, or Supabase SDK.
- Do not perform React Hook Form validation here; call validated commands.
- Keep query keys aligned with TDD v2: session, public survey by slug, duplicate by survey/user, asset URL by asset id.
- `useSubmissionMutation` success deletes draft and navigates to complete; unique violation should route to already-submitted.
