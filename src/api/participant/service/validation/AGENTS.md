# src/api/participant/service/validation Guide

This directory contains pure validation and conditional-branch logic.

## Expected Files

- `answerSchema.ts`
- `submissionSchema.ts`
- `branchEvaluator.ts`
- `attentionCheckValidator.ts`

## Responsibilities

- Validate answer drafts by question type with Zod.
- Validate final submission commands before mapping.
- Evaluate `show_if` / branch rules from question config.
- Enforce low-score follow-up requirements.
- Validate image tag ratios, max tag counts, tag type, severity, and text.
- Validate attention-check expected values and expose pass/fail status for the configured submit policy.

## Rules

- Keep validators pure; no React, storage, network, or router imports.
- Unknown branch operators should fail closed and be covered by tests.
- Return enough location information for the review page to route users back to missing answers.
- Submit validation must confirm duplicate-submission query success before final submit flow proceeds.
