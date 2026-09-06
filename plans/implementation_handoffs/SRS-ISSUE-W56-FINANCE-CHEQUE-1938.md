# SRS — Finance Engine Cheque Registry

- Handoff ID: SRS-ISSUE-W56-FINANCE-CHEQUE-1938
- Issue: #2426
- Parent issue: #1938 (remains open — not closed by this handoff)
- Wave: W56 — Finance Engine hardening

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification defines the functional and non-functional
requirements for the **Cheque Registry** capability of the Finance Engine, a
sub-module responsible for tracking the lifecycle of cheques exchanged between
White Caves and tenants, buyers, owners, and vendors.

### 1.2 Scope

The Cheque Registry:

- Records cheques received (from tenants/buyers) and issued (to owners/vendors).
- Tracks lifecycle status from receipt through clearing, bouncing, or cancellation.
- Exposes query capability for finance dashboards and reconciliation workflows.
- Emits structured errors for invalid input or illegal state transitions.

It does **not**, in this issue:

- Integrate with a bank/clearing-house API.
- Perform automatic reconciliation against bank statements.
- Close parent issue #1938 or any other issue.
- Perform bulk GitHub mutations.
- Execute destructive database operations.
- Rewrite production secrets.

### 1.3 Definitions

- **Cheque**: a negotiable instrument recorded in the registry with a defined
  lifecycle status.
- **Counterparty**: the tenant, buyer, owner, or vendor associated with a cheque.
- **Linked transaction**: an optional reference to a lease, sale, or payment plan
  the cheque is applied against.

## 2. Overall Description

### 2.1 Product Perspective

The Cheque Registry is a sub-module of the broader Finance Engine (parent #1938),
which also covers invoicing, payment plans, and reconciliation. This module is
consumed by:

- CRM finance dashboards (cheque status widgets).
- Payment reconciliation flows (matching cheques to invoices/payment plans).
- Reporting exports (aging/bounced-cheque reports).

### 2.2 User Classes

- **Finance operators**: record received/issued cheques, update status as cheques
  move through the bank clearing process.
- **Finance managers**: query registry for reporting, aging analysis, and
  bounced-cheque follow-up.
- **System integrations**: automated jobs that may later poll bank statements to
  update cheque status (out of scope for this issue; contract must support it).

## 3. Functional Requirements

| ID   | Requirement                                                                                                                 | Priority |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-1 | System SHALL represent each cheque with the fields defined in the module contract.                                          | Must     |
| FR-2 | System SHALL enforce validation rules on cheque number, amount, currency, and date.                                         | Must     |
| FR-3 | System SHALL only allow the lifecycle transitions defined in the contract's transition table.                               | Must     |
| FR-4 | System SHALL reject duplicate active cheque numbers per counterparty/bank pair.                                             | Must     |
| FR-5 | System SHALL support filtering cheques by status, counterparty, date range, and linked transaction.                         | Should   |
| FR-6 | System SHALL return structured error codes for validation failures, illegal transitions, duplicates, and not-found lookups. | Must     |
| FR-7 | System SHALL sort query results by cheque date ascending by default.                                                        | Should   |

## 4. Non-Functional Requirements

| ID    | Requirement                                                                                 |
| ----- | ------------------------------------------------------------------------------------------- |
| NFR-1 | All code implementing this contract MUST use strict TypeScript with no `any` types.         |
| NFR-2 | All monetary amounts MUST be stored/validated as integer minor units, never floats.         |
| NFR-3 | Unit tests MUST use vitest with real behavioral assertions (no placeholder assertions).     |
| NFR-4 | No implementation step in this wave may perform destructive database operations.            |
| NFR-5 | No implementation step in this wave may rewrite production secrets.                         |
| NFR-6 | No implementation step in this wave may perform bulk GitHub mutations or close issue #1938. |

## 5. Acceptance Criteria (traced to issue #2426)

1. Implementation remains within the declared child scope (cheque registry contract
   and planning artifacts only for this pass).
2. Focused tests and required validation commands pass for any code introduced.
3. Completion evidence and a rollback note are recorded (see SDD and README).
4. Parent issue #1938 remains open until all child work under it is reconciled.

## 6. Traceability

- Parent issue: #1938 (Finance Engine).
- This issue: #2426 (Cheque Registry — contract & planning handoff, wave W56).
- Downstream consumers: CRM finance dashboards, reconciliation workflows (future
  child issues).
