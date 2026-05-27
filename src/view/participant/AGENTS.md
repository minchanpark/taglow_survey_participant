# src/view/participant Guide

This directory contains the participant survey experience.

## Responsibilities

- Implement the public URL/QR flow, login gate, survey intro, section answering, review, complete, and system states.
- Keep UX mobile-first, section-based, and bilingual.
- Use the participant API query/mutation hooks for server state.
- Handle already-submitted as its own terminal participant state.

## CSS Ownership

- Participant route pages should import only their own page CSS plus reusable primitive/component CSS through the components they render.
- Keep page-level files paired by name: `ParticipantLoginPage.tsx` / `ParticipantLoginPage.css`, `SurveyCompletePage.tsx` / `SurveyCompletePage.css`.
- Keep participant feature component CSS inside the relevant `components/` folder beside the component.
- If a style is shared across multiple participant pages, promote it to a reusable component or shared CSS primitive instead of reaching across page CSS files.

## Rules

- Do not bypass `ParticipantApiController`.
- Do not import service/gateway/mapper modules directly.
- Do not store translated labels as answers.
- Treat draft restore and final submit as separate flows.
- Route unique-violation submit failures to already-submitted instead of showing a generic error.
