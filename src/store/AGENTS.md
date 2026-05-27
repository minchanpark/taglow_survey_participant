# src/store Guide

This directory contains Zustand stores for participant UI/client state.

## Expected Files

- `participantProgressStore.ts`
- `participantLocaleStore.ts`
- `participantDraftStore.ts`
- `imageTaggingStore.ts`
- `uiStore.ts`

## Responsibilities

- Track selected locale, current section, completed section ids, draft restore UI state, review entry state, and image tagging UI state.
- Keep state small, serializable where practical, and resettable between surveys.

## Rules

- Do not store server survey data here; TanStack Query owns it.
- Do not make Zustand the source of question form values; React Hook Form owns them.
- Do not import Supabase SDK, gateways, or raw rows.
- Provide explicit reset actions for survey/user changes.

