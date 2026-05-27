# src/view/participant/system Guide

This directory contains system and access-state pages.

## Expected Files

- `SurveyNotFoundPage.tsx`
- `SurveyNotFoundPage.css`
- `SurveyClosedPage.tsx`
- `SurveyClosedPage.css`
- `AlreadySubmittedPage.tsx`
- `AlreadySubmittedPage.css`
- `AccessDeniedPage.tsx`
- `AccessDeniedPage.css`

## Responsibilities

- Explain not found, closed/archived, already submitted, access denied, and duplicate-style terminal states.
- Keep messages clear, short, and participant-friendly.
- Provide retry or login-again actions where appropriate.

## CSS Ownership

- Each system page owns a matching page CSS file beside the page component.
- System page CSS should cover only terminal-state layout and page-specific responsive spacing.
- Shared message/button visuals should come from reusable components, not duplicated page CSS.

## Rules

- No data persistence.
- No raw error dumps.
- No Supabase SDK imports.
- Do not expose admin-only details to participants.
- Already-submitted copy should explain that edits require contacting the survey owner.
