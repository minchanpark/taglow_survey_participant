# src/test Guide

This directory contains test harnesses, fake controllers, and fixtures.

## Expected Files

- `setup.ts`
- `renderWithProviders.tsx`
- `fakeParticipantApiController.ts`
- `fixtures/`

## Responsibilities

- Provide reusable render helpers with app providers.
- Provide fake `ParticipantApiController` implementations for view and component tests.
- Keep fixtures representative of PRD/TDD flows.

## Rules

- Prefer fake controllers over mocking Supabase in view tests.
- Tests may import production modules, but production modules must not import from `test/`.
- Cover auth, sections, question types, draft restore, image ratios, submission, and failure states.
- Cover already-submitted routing, signed asset URL failure, attention-check validation, and database policy behavior where Supabase local or staging is available.
