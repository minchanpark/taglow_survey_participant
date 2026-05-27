# src/components Guide

This directory contains reusable UI primitives.

## Expected Files

- `Button.tsx`
- `Select.tsx`
- `ProgressBar.tsx`
- `StepHeader.tsx`
- `Message.tsx`
- `css/`

## Responsibilities

- Provide accessible, reusable building blocks for participant pages.
- Keep components presentation-focused and domain-light.
- Support mobile-first touch targets and visible focus states.

## Rules

- Do not fetch survey data here.
- Do not import participant gateways, controllers, or query hooks.
- Do not encode question-type business rules in primitives.
- Prefer props and composition over global store access.
- Use design tokens from `src/styles/design-tokens.css` for color, spacing, radius, typography, and motion.
