# src/view Guide

This directory contains route-level user-facing views.

## Responsibilities

- Render page flows using query hooks, stores, reusable components, and form components.
- Keep pages aligned with PRD participant UX principles.

## CSS Ownership

- Every route page under `view/` should keep a page-specific CSS file next to the page file, for example `SurveyIntroPage.tsx` with `SurveyIntroPage.css`.
- Feature components should keep their own CSS next to the component file, usually inside that feature's `components/` directory.
- Page CSS owns page layout, route-level spacing, and page-specific responsive composition.
- Component CSS owns the component's internal layout, states, and variants.
- Do not place component internals in page CSS, and do not place route layout rules in component CSS.
- Page and component CSS must consume design tokens from `src/styles/design-tokens.css`.

## Rules

- Do not import Supabase SDK, gateways, raw rows, or table names.
- Do not perform persistence mapping in views.
- Keep display text separate from stored answer values.
- Prefer feature-local components under the relevant view folder.
