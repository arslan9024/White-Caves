---
description: 'TypeScript 5 strict coding standards for White Caves'
applyTo: '**/*.{ts,tsx}'
---

# TypeScript Instructions (White Caves)

Apply repository-wide guidance from `../copilot-instructions.md` and `../../AGENTS.md`.

## Core Rules

- Keep `strict`-safe types; avoid `any` unless unavoidable and documented.
- Prefer explicit interfaces/types for API payloads and shared DTOs.
- Use narrow unions and discriminated unions for status/state values.
- Keep exported function signatures stable and predictable.

## Styling and UI Typing

- For `styled-components`, avoid implicit `unknown` theme access.
- Use typed transient props (`$propName`) for styled conditional logic.
- Keep prop names semantically clear and local to component concerns.

## Async/Errors

- Always handle async errors explicitly in hooks/services.
- Return normalized error messages for UI display.
- Do not swallow exceptions silently.

## Architecture

- Prefer vertical slice updates (hook + page + service) over scattered edits.
- Keep side-effects in hooks/services, not in pure presentational components.

<!-- Inspired by patterns from github/awesome-copilot instructions catalog -->
