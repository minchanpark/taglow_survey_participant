# src/view/participant/survey Guide

This directory contains participant survey pages.

## Expected Files

- `SurveyEntryPage.tsx`
- `SurveyEntryPage.css`
- `SurveyIntroPage.tsx`
- `SurveyIntroPage.css`
- `SurveySectionPage.tsx`
- `SurveySectionPage.css`
- `SurveyReviewPage.tsx`
- `SurveyReviewPage.css`
- `SurveyCompletePage.tsx`
- `SurveyCompletePage.css`
- `components/`

## Responsibilities

- Load public survey data through query hooks.
- Render intro, language selection/default locale, sections, review, and completion.
- Own React Hook Form setup for question values.
- Coordinate draft autosave/restore with draft storage and stores.
- Submit only validated commands.

## CSS Ownership

- Each survey page owns a matching page CSS file beside the page component.
- Page CSS should handle route shell layout, section/page spacing, and page-specific responsive composition.
- Question and feature component styles belong in `components/<ComponentName>.css`, not in page CSS.
- Do not use a survey page CSS file to reach into another page or component's private class names.

## Rules

- Do not import gateways, mappers, raw rows, or Supabase SDK.
- Do not put reusable primitive styling here when it belongs in `components/`.
- Do not delete draft until submit mutation succeeds.
- Keep network failure behavior retryable and draft-preserving.
