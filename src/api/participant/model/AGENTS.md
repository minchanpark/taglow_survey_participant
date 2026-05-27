# src/api/participant/model Guide

This directory contains pure participant domain types.

## Responsibilities

- Define `Locale`, `PublicSurvey`, `PublicSurveySection`, `PublicQuestion`, `AnswerDraft`, `ImageTagPoint`, `SubmitSurveyCommand`, and related command/result types.
- Keep types independent from Supabase row names and transport payloads.
- Prefer readonly object shapes for data passed across the API boundary.

## Rules

- No React imports.
- No TanStack Query imports.
- No Supabase imports.
- No localStorage, network, or Date side effects.
- Use stable analytics keys: `metricType`, `topicKey`, `spaceKey`, option values, and ratios.

