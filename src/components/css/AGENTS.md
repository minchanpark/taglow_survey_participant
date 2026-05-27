# src/components/css Guide

This directory contains shared component styles.

## Responsibilities

- Keep reusable CSS for primitives and small shared states.
- Preserve mobile-first layout, readable typography, visible focus, and non-overlapping text.

## Rules

- Do not define page-specific layout here unless it is a reusable primitive pattern.
- Avoid color-only state communication.
- Keep class names stable enough for component tests when needed.
- Use global CSS custom properties from `src/styles/design-tokens.css`; add tokens before hardcoding repeated values.
