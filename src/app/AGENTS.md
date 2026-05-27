# src/app Guide

This directory owns the React application shell and routing foundation.

## Expected Files

- `App.tsx`
- `router.tsx`
- `providers.tsx`
- `queryClient.ts`
- `routeGuards.tsx`

## Responsibilities

- Compose global providers: router, query client, participant API runtime/provider, and any app-wide UI providers.
- Define public survey routes exactly as described in the TDD unless a later product decision updates them.
- Implement route guards for survey existence/status, auth, Handong email, and duplicate submission.
- Keep redirects stable for public URL and QR entry.
- Import `src/styles/global.css` once at the app entry or provider shell, never from page/component files.

## Rules

- Do not render question UI here.
- Do not map raw Supabase rows here.
- Do not place survey business logic in routes; route guards should delegate to query/controller abstractions.
- Route guard order should be public survey -> auth -> email domain -> duplicate submission.
