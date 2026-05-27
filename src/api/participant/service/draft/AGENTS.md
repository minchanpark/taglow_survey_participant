# src/api/participant/service/draft Guide

This directory owns client-side draft persistence.

## Expected Files

- `draftStorage.ts`
- `localStorageDraftStorage.ts`
- `indexedDbDraftStorage.ts`

## Responsibilities

- Define the `DraftStorage` interface.
- Implement localStorage first.
- Add IndexedDB fallback when payload size or quota requires it.
- Store drafts by survey id and participant user id.
- Support load, save, and remove with safe parse behavior.
- Save on section navigation, 5-10s debounce, `visibilitychange` hidden, and `beforeunload`.
- Use the v2 draft shape: `surveyId`, `participantUserId`, `locale`, `currentSectionId`, `values`, `updatedAt`, `schemaVersion`.

## Rules

- Drafts are never sent to the server before final submit.
- Drafts must never store Supabase service role keys, raw access tokens, raw refresh tokens, or other auth secrets.
- Avoid long-lived localStorage retention of unnecessary personal raw payloads.
- Corrupted drafts should return `null` or a recoverable result, not crash the app.
- Schema version mismatch should be treated as non-restorable unless a deterministic migration exists.
- Do not decide UI restore prompts here; expose data to the view/store layer.
- Do not import React components.
