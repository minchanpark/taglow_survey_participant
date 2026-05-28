# src/api/participant/model Guide

This directory contains pure participant domain types.

## Responsibilities

- Define `auth.ts`, `publicSurvey.ts`, `section.ts`, `question.ts`, `asset.ts`, `answerDraft.ts`, `submission.ts`, and `commands.ts`.
- Define `ParticipantSession`, `LocalizedText`, `PublicSurvey`, `PublicSurveySection`, `PublicQuestion`, `SurveyAsset`, `AnswerDraft`, `ImageTagPoint`, `SubmissionCommand`, and related command/result types.
- Keep types independent from Supabase row names and transport payloads.
- Prefer readonly object shapes for data passed across the API boundary.
- Model survey status as `published | closed | archived`.
- Model metric type as the DB constraint union: `none | satisfaction | importance | experience`.
- Keep section questions nested in `PublicSurveySection.questions`; keep survey assets in `PublicSurvey.assets`.

## Rules

- No React imports.
- No TanStack Query imports.
- No Supabase imports.
- No localStorage, network, or Date side effects.
- Use stable analytics keys: `metricType`, `topicKey`, `spaceKey`, option values, and ratios.
