# src/styles Guide

This directory owns global design system CSS.

## Responsibilities

- Keep global tokens in `design-tokens.css`.
- Keep app-wide base styles in `global.css`.
- Keep page-specific CSS under `src/view/**`.
- Keep reusable primitive CSS under `src/components/**`.
- Keep feature component CSS beside the component that owns it.

## Rules

- Update `DESIGN.md` before changing global visual tokens.
- Prefer CSS custom properties from `design-tokens.css` over hardcoded values.
- Do not put route-specific layout in global CSS.
- Do not put component internals in global CSS.
- Keep motion respectful of `prefers-reduced-motion`.

