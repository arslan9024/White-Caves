# Release and Rollout Notes Template

**Status:** Active  
**Owner:** Delivery Operations  
**Last Updated:** 2026-08-06  
**Purpose:** Standardize how product, delivery, and operations teams record what changed, how it was validated, and what risks or fallback steps exist.

---

## 1) Release summary

- **Feature or wave:**
- **Business outcome:**
- **Owner:**
- **Target release window:**
- **Related business doc:**
- **Related software doc:**
- **Related planning wave:**

## 2) What changed

- Brief bullet list of the delivered change(s)
- Any user-visible behavior changes
- Any operational or compliance impact

## 3) Validation evidence

- Tests run
- Lint/typecheck/build or other validation commands
- Acceptance review notes
- QA or UAT evidence

## 4) Rollout notes

- Rollout method
- Dependencies or prerequisites
- Risk level
- Rollback or fallback plan
- Monitoring or follow-up expectations

## 5) Known issues or follow-ups

- Open issues
- Follow-up tasks
- Owners and dates

---

## 6) Example

```text
Feature: Leasing workflow automation
Business outcome: Faster lease lifecycle handling with less manual follow-up
Validation: npm run plans:validate, npm run typecheck, targeted workflow tests
Rollout: staged rollout behind existing feature flag or release gate
Rollback: disable workflow automation and revert to manual handoff path
```
