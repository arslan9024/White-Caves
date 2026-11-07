# WAVE_04_TEST_ROLLOUT — Compliance Baseline

## Test Objectives

Prove that compliance controls prevent unsafe business actions without breaking valid workflows.

## Test Matrix

### Unit

- permit validation rules
- consent grant/revoke/export logic
- AML result mapping and flag state
- KYC status transition rules

### Integration

- listing publish blocked without permit data
- permit expiry alert path created correctly
- KYC upload/list/review endpoints behave correctly
- transaction creation blocked when KYC is not verified
- consent APIs create/revoke/export/delete correctly

### E2E / Smoke

- reviewer processes KYC document in Laila dashboard
- invalid listing cannot be moved to active/listed state
- consent action is reflected in UI/API state

### Security Negative Tests

- unauthorized user cannot review KYC documents
- unauthorized export/delete access rejected
- invalid upload types/sizes rejected
- AML provider failure does not silently mark client compliant

### Pass Criteria

- compliance blocks and flags work on critical paths
- permission failures return expected 401/403 behavior
- build/type/lint gates pass for touched files
