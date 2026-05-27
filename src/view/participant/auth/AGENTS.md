# src/view/participant/auth Guide

This directory contains participant authentication pages.

## Expected Files

- `ParticipantLoginPage.tsx`
- `ParticipantLoginPage.css`
- `components/`

## Responsibilities

- Show Google login entry for participant surveys.
- Preserve return to the original public survey URL after login.
- Explain the `@handong.ac.kr` restriction clearly.
- Route non-Handong accounts to access denied.

## CSS Ownership

- `ParticipantLoginPage.css` owns only the login page layout and route-specific responsive spacing.
- Auth subcomponents in `components/` should have their own CSS files beside their component files.
- Do not style survey question components from auth page CSS.

## Rules

- Prefer invoking an auth/runtime abstraction instead of importing Supabase SDK directly in the page.
- Keep auth UI separate from survey question UI.
- Do not perform duplicate-submission mapping here; use route guard/query/controller behavior.
