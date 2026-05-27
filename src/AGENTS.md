# src Guide

This tree follows the structure in TDD section 4. Keep code organized by responsibility, not by convenience.

## Dependency Direction

Allowed high-level flow:

```text
app -> view -> api/participant/query -> api/participant/controller -> api/participant/service -> external IO
view -> components
view -> store
view -> utils
api/participant/service -> api/participant/model
```

Do not import upward from lower layers. Do not let `components`, `utils`, or `store` import participant views.

## Source Rules

- Put route shell, providers, and guards in `app/`.
- Put participant API boundary code in `api/participant/`.
- Put global client/UI stores in `store/`.
- Put reusable UI primitives in `components/`.
- Put global design tokens and base CSS in `styles/`.
- Put generic pure helpers in `utils/`.
- Put route pages and feature-specific participant UI in `view/participant/`.
- Put test harnesses and fixtures in `test/`.

## Boundary Rules

- Supabase SDK is allowed only in gateway/runtime-style integration files.
- Supabase SDK must not escape `SupabaseParticipantApiGateway`; runtime may only wire dependencies behind that gateway/controller boundary.
- React Hook Form value ownership belongs to survey pages/components, not Zustand.
- Zustand stores hold UI/progress state, not raw server state.
- TanStack Query owns public survey data, duplicate checks, image asset metadata, and submit mutation state.
- UI CSS should consume `src/styles/design-tokens.css` variables instead of hardcoded design values.
