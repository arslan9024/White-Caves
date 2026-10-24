## Summary

<!-- What and why -->

## Department lane

- [ ] 1 Executive & Architecture
- [ ] 2 Research Intelligence
- [ ] 3 Frontend & UX
- [ ] 4 Backend & API
- [ ] 5 Database & Pipelines
- [ ] 6 Security / Compliance / Legal
- [ ] 7 DevOps & Infrastructure
- [ ] 8 Software Quality & Testing
- [ ] 9 Finance & VAT
- [ ] 10 Sales & CRM
- [ ] 11 Communications & Marketing
- [ ] 12 Operations & Facilities

## Four-Way rule (mandatory for UI)

- [ ] New/changed UI uses `View.tsx` + `.logic.ts` + `.style.ts` + `.data.ts`
- [ ] No new business logic in JSX/TSX view files
- [ ] No new raw brand hex outside tokens
- [ ] Legacy file touched → migration started or justified

## Testing (lean SQA)

- [ ] `npm run typecheck` clean
- [ ] Unit tests added/updated for non-trivial logic
- [ ] E2E only if critical path changed

## Checklist

- [ ] Docs updated if behaviour or governance changed
- [ ] No secrets committed
- [ ] Linked issue(s)
