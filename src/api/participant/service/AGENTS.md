# src/api/participant/service Guide

This directory contains implementation details behind the controller.

## Responsibilities

- Gateways perform IO.
- Mappers convert between raw payloads and domain models.
- Draft storage persists client drafts.
- Validation modules provide pure validation and branch logic.

## Rules

- Service modules should not import route pages or reusable UI components.
- Keep side effects in gateway/draft modules; keep mapper/validation modules pure.
- Service errors should be normalized before they reach views.

