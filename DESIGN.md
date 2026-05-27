---
omd: 0.1
brand: Taglow Survey Participant
bootstrapped_from: toss
bootstrapped_at: 2026-05-27T15:45:36Z
mode: inspired
---

# Taglow Survey Participant Design System

This design system is inspired by Toss: clean white surfaces, optimistic blue interaction, plain language, and trust through clarity. It is adapted for a mobile-first student survey flow where the main job is to help participants enter quickly, answer only relevant questions, recover drafts, and submit structured data with confidence.

Use `src/styles/design-tokens.css` as the runtime token source. Treat this document as the human-readable design contract.

## 1. Visual Theme

Taglow should feel calm, direct, and lightweight. The participant should never feel like they opened an admin tool or a long institutional form.

Design direction:

- White or near-white canvas.
- One optimistic blue for primary interaction.
- Warm charcoal text instead of pure black.
- Generous breathing room around important actions.
- Dense only where it helps scanning, such as review summaries.
- No decorative gradients, blobs, heavy shadows, or generic illustration filler.

Primary impression: "I can finish this without effort, and my answer will be handled carefully."

## 2. Color

Use color sparingly. The interface should read as neutral until a participant needs to act.

| Token | Value | Use |
| --- | --- | --- |
| `--color-brand-600` | `#3182f6` | Primary CTA, selected state, progress |
| `--color-brand-700` | `#1b64da` | Pressed primary state |
| `--color-brand-500` | `#4f96ff` | Hover or soft emphasis |
| `--color-brand-100` | `#eaf3ff` | Selected chip background |
| `--color-bg` | `#ffffff` | App canvas |
| `--color-bg-subtle` | `#f7f9fc` | Page bands, system backgrounds |
| `--color-surface` | `#ffffff` | Cards, question surfaces |
| `--color-surface-subtle` | `#f2f5f9` | Input and secondary controls |
| `--color-text` | `#191f28` | Primary text |
| `--color-text-muted` | `#6b7684` | Secondary text |
| `--color-text-subtle` | `#8b95a1` | Helper text |
| `--color-border` | `#e5e8eb` | Default border |
| `--color-border-strong` | `#d1d6db` | Focusable surface border |
| `--color-success` | `#00a86b` | Saved, completed, valid |
| `--color-warning` | `#f59f00` | Needs attention |
| `--color-danger` | `#e03131` | Blocking error |

Rules:

- Use at most two saturated brand-blue elements in one viewport.
- Use blue only for interaction or clear progress, not decoration.
- Error states require text and icon/shape, not red alone.
- Image tagging pins may use brand blue, but selected and error pin states need shape or label differences.

## 3. Typography

Use a Korean-first system stack with Toss-like clarity.

```css
font-family: Pretendard, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

| Token | Size | Line | Weight | Use |
| --- | --- | --- | --- | --- |
| `--font-size-display` | `28px` | `36px` | `700` | Mobile page title, completion title |
| `--font-size-title` | `22px` | `30px` | `700` | Section title |
| `--font-size-heading` | `18px` | `26px` | `700` | Question title |
| `--font-size-body` | `16px` | `24px` | `400` | Main body, option text |
| `--font-size-small` | `14px` | `20px` | `400` | Helper, metadata |
| `--font-size-caption` | `12px` | `16px` | `500` | Labels, counters |

Rules:

- Letter spacing is `0`.
- Do not scale font size with viewport width.
- Body text is not bold by default.
- Use numeric emphasis only for progress, time estimate, and review counts.

## 4. Spacing

Use an 8px spacing base.

| Token | Value |
| --- | --- |
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |

Rules:

- Mobile page padding starts at `20px`.
- Question groups use `24px` vertical separation.
- Sticky bottom actions use `16px` padding and account for safe area.
- Review screens may be tighter, but must keep touch targets at least `44px`.

## 5. Radius

Taglow should be soft, not pill-heavy.

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | `8px` | Small controls, tags |
| `--radius-md` | `12px` | Inputs, choice chips |
| `--radius-lg` | `16px` | Question surfaces |
| `--radius-xl` | `20px` | Bottom sheets, restore prompts |
| `--radius-pill` | `999px` | Segmented chips, progress pills |

Rules:

- Cards and repeated item surfaces should stay at `16px` or less unless they are modal-like.
- Buttons use `12px` radius by default.
- Avoid nested card-on-card compositions.

## 6. Elevation

Use border-first depth. Shadows are rare and subtle.

| Token | Value |
| --- | --- |
| `--shadow-none` | `none` |
| `--shadow-soft` | `0 8px 24px rgba(25, 31, 40, 0.08)` |
| `--shadow-floating` | `0 16px 40px rgba(25, 31, 40, 0.12)` |

Rules:

- Use borders for question surfaces.
- Use `--shadow-soft` only for sticky bottom bars, prompts, or floating pin editors.
- Do not use colored shadows.

## 7. Layout

The app is mobile-first with a comfortable desktop max width.

| Token | Value |
| --- | --- |
| `--layout-mobile-max` | `480px` |
| `--layout-content-max` | `720px` |
| `--layout-review-max` | `840px` |
| `--layout-bottom-action-height` | `80px` |

Rules:

- Participant pages should center content with `max-width: var(--layout-content-max)`.
- Section answering should feel like one focused task at a time.
- Bottom CTAs may be sticky on mobile.
- Desktop should not become a wide admin dashboard; preserve survey focus.

## 8. Components

### Buttons

- Primary: blue background, white text, one per screen.
- Secondary: neutral surface with border.
- Tertiary: text or ghost action for low-risk navigation.
- Disabled: neutral background and muted text; no pointer cursor.
- Focus: visible 2px brand outline with offset.

### Choice Chips

- Use chips for gender, RC, dormitory, room type, scale values, and short options.
- Selected chip: brand-100 background, brand-600 border/text, check icon when helpful.
- Multi-select should show count guidance when min/max exists.

### Inputs and Selects

- Inputs use neutral background, 12px radius, clear label, and specific error text.
- Department search uses combobox behavior and keyboard support.
- Avoid placeholder-only labeling.

### Progress

- Show both section progress and overall progress where it reduces uncertainty.
- Progress color is brand blue; incomplete track is neutral.
- Progress text should be exact and low-pressure.

### Messages

- Info: blue tint.
- Success: green tint.
- Warning: amber tint.
- Error: red tint with corrective action.

## 9. Survey Patterns

### Start Screen

The start screen reduces burden. Show title, purpose, estimated time, login/domain note, privacy/use note, and start CTA.

### Section Screen

Use a clear section title, optional description, progress, and focused question groups. Do not show the entire survey at once.

### Question Screen

Question text should be direct. Helper text should explain only what changes the participant's decision.

### Review Screen

Review should show completion state by section, missing required answers, image tag counts, and a final submit CTA.

### Complete Screen

Completion should confirm that the answer was submitted and explain how it will be used.

## 10. Question Type Patterns

### Profile

Prefer chips and searchable selects. Avoid free text for profile fields unless configured by the survey.

### Experience

Let participants skip irrelevant follow-ups quickly. If they did not experience an item, do not ask satisfaction.

### Scale

Use five large tap targets. Label endpoints clearly. Keep 1 and 5 meanings visible.

### Low Score Follow-up

Scores 1-2 require structured reasons. Score 3 may offer optional reason. Scores 4-5 do not show the follow-up by default.

### Text

Ask category/space/type first when configured. Free text is a supplement, not the first burden.

### Multi-select

Show selected count and min/max guidance. "Other" opens a short text field only when selected.

### Ranking

Use tap-to-rank on mobile. Do not require drag as the only interaction.

### Image/Floorplan Location

Never show the phrase "image tagging" to participants. Use "Tap the place on the photo" or "Select the place on the floorplan." Pins must be editable and removable before submit.

## 11. Voice and Tone

Taglow uses plain, polite language. It should sound like a helpful product, not an institution.

Voice:

- Short sentences.
- Concrete next actions.
- Calm reassurance for auth, draft, and submit errors.
- No hype, no jokes in blocking states, no technical terms.
- Korean copy may use polite `-해주세요` / `-됩니다`; English copy should be concise and direct.

Preferred Korean examples:

- "이전에 작성하던 응답이 있습니다."
- "필수 문항을 먼저 답해주세요."
- "학교 Google 계정으로 다시 로그인해주세요."
- "응답이 제출되었습니다."

Avoid:

- "오류가 발생했습니다" without cause or next step.
- "이미지 태깅을 수행하세요."
- "payload", "cache", "schema", "validation" in participant-facing copy.

## 12. Brand Narrative

Taglow Survey Participant exists to help students leave useful feedback with less effort.

The product promise is simple: enter through a link, answer what applies, recover if interrupted, and submit feedback that can be analyzed responsibly.

Known project facts from PRD/TDD:

- Domain: participant-side survey SPA.
- Audience: Handong University students using `@handong.ac.kr` Google accounts.
- Operators: student councils and student organizations using survey results for improvement priorities and reports.
- Core data: profile filters, section answers, satisfaction/importance scores, structured reasons, text comments, and image/floorplan points.

## 13. Principles

### Clarity before completeness

The participant should always know what to do next. Show only the information needed for the current step.

### Relevance over volume

Do not ask satisfaction about things the participant has not experienced. Branch questions aggressively to reduce fatigue.

### Structure without pressure

Use choices, categories, and chips to create analyzable data. Use free text only where nuance matters.

### Recovery is part of trust

Draft save and restore should feel reliable but honest: same browser, same device, same authenticated participant.

### Data deserves care

Separate display language from stored values. Keep personal information limited, explained, and out of analysis surfaces unless explicitly required.

## 14. Personas

### Busy resident

Wants to finish quickly on mobile. Needs clear progress, large options, and minimal typing.

### Frustrated facility user

Has a specific issue with a place or object. Needs simple photo/floorplan selection, reason chips, severity, and a short explanation field.

### Bilingual participant

May choose Korean or English. Needs fallback text to remain coherent when a translation is missing.

### Survey operator

Does not use this participant UI directly, but depends on structured answers for filtering, heatmaps, averages, and reports.

## 15. Motion

Motion should confirm state changes without adding spectacle.

| Token | Value |
| --- | --- |
| `--motion-fast` | `120ms` |
| `--motion-base` | `180ms` |
| `--motion-slow` | `240ms` |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` |

Rules:

- Use fast transitions for chip selection and button feedback.
- Use base transitions for section changes, banners, and restore prompts.
- Respect `prefers-reduced-motion`.
- Do not use bounce, springy overshoot, or decorative page animation.

## 16. Accessibility

- Minimum touch target is `44px`.
- Focus-visible styles are required on all interactive controls.
- Do not rely on color alone.
- Error messages must identify the field/question and the next action.
- Inputs keep labels visible.
- Text must not overlap controls at mobile widths.
- Image pins need review/edit/delete controls beyond the pin itself.

## 17. Token Change Workflow

To change the design system later:

1. Update this `DESIGN.md` first.
2. Update `src/styles/design-tokens.css` to match token changes.
3. Run or apply the oh-my-design sync guidance so `AGENTS.md`, `CLAUDE.md`, and Cursor rules point to the latest design system.
4. Keep page CSS and component CSS consuming variables instead of hardcoded values.

Do not hardcode brand colors, spacing, radius, typography, or motion values in page/component CSS unless a token does not exist yet. Add a token first.

