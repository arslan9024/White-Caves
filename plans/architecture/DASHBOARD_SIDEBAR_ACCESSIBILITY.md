# Dashboard Sidebar Reliability Checklist

## Scope

- CRM dashboard searchable selection and keyboard navigation.
- Department overview and subgroup sidebar controls.
- AI assistant/team filter selection consistency.
- Regression tests for keyboard use and team filtering.

## Checklist

- [x] Make searchable options usable by keyboard and preserve focus on close.
- [x] Use semantic buttons and expanded-state attributes for dashboard subgroup controls.
- [x] Keep the selected assistant within the active AI team filter.
- [x] Run focused sidebar tests, lint, client/server typechecks, and production build.

## Validation

- Focused sidebar tests: 3 files, 8 tests passed.
- Changed-file ESLint: passed.
- Client and server TypeScript checks: passed.
- Vite production build: passed.
