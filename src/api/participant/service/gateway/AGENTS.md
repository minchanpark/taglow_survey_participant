# src/api/participant/service/gateway Guide

This directory owns external IO for participant APIs.

## Expected Files

- `participantApiGateway.ts`
- `supabaseParticipantApiGateway.ts`
- `httpParticipantApiGateway.ts`
- `apiErrors.ts`

## Responsibilities

- Define the `ParticipantApiGateway` interface.
- Provide session/auth IO: `getSession`, `signInWithGoogle`, and `signOut`.
- Fetch published public survey bundles by public slug from `surveys`, `survey_sections`, `questions`, and `survey_assets`.
- Check duplicate submission status.
- Create one `responses` row and many `answers` rows, or call optional `submitSurveyResponse` RPC when available.
- Create signed asset URLs for private storage assets.
- Normalize Supabase/HTTP failures into routeable participant API errors.

## Gateway Contract

Keep the TDD v2 contract in mind:

```ts
getSession(): Promise<RawSession | null>;
signInWithGoogle(redirectTo: string): Promise<void>;
signOut(): Promise<void>;
fetchPublicSurveyBySlug(publicSlug: string): Promise<RawPublicSurveyBundle>;
checkDuplicateSubmission(args): Promise<RawDuplicateSubmissionResult>;
createResponse(payload): Promise<RawResponse>;
createAnswers(payloads): Promise<RawAnswer[]>;
submitSurveyResponse?(payload): Promise<RawSubmitSurveyResult>;
createSignedAssetUrl(args): Promise<string>;
```

## Rules

- Supabase SDK and raw database rows are allowed here.
- Do not export raw rows to views or query hooks.
- Do not delete drafts here; draft cleanup belongs to mutation success handling.
- Keep HTTP gateway parity with the Supabase gateway contract.
- If answers bulk insert fails after response creation, controller/gateway handling must mark the response as discarded or route a recoverable submission failure.
- Map unique submitted-response violations to `ALREADY_SUBMITTED`.
