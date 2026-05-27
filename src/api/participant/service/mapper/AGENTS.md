# src/api/participant/service/mapper Guide

This directory converts raw payloads to participant domain models and commands to persistence payloads.

## Responsibilities

- Map raw survey, section, question, option, and asset rows to `PublicSurvey`.
- Apply locale fallback for rendered text through domain fields when appropriate.
- Map `SubmitSurveyCommand` to a raw submit payload.
- Expand image tag points into separate answer rows.
- Preserve `topicKey`, `spaceKey`, `metricType`, and stable option values for analytics.

## Rules

- Keep mapper functions pure and deterministic.
- Do not import React, TanStack Query, Zustand, or Supabase clients.
- Do not store translated display labels as answer values.
- Cover every question type in mapper tests.

