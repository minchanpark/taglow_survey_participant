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

## Rules

- Drafts are never sent to the server before final submit.
- Corrupted drafts should return `null` or a recoverable result, not crash the app.
- Do not decide UI restore prompts here; expose data to the view/store layer.
- Do not import React components.

