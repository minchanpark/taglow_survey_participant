# src/api/participant/service/mapper Guide

This directory converts raw payloads to participant domain models and commands to persistence payloads.

## Responsibilities

- Map raw survey, section, question, option, and asset rows to `PublicSurvey`.
- Convert `title_ko`/`title_en` and descriptions to `LocalizedText`.
- Parse `questions.config` into question-type config where practical.
- Map `SubmissionCommand` to response and answer insert payloads.
- Extract profile answers into `responses` columns.
- Expand image tag points into separate answer rows.
- Preserve `topicKey`, `spaceKey`, `metricType`, and stable option values for analytics.

## Rules

- Keep mapper functions pure and deterministic.
- Do not import React, TanStack Query, Zustand, or Supabase clients.
- Do not store translated display labels as answer values.
- Cover every question type in mapper tests.
