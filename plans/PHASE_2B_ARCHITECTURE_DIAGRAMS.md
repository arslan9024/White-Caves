# Phase 2B Architecture Diagrams

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        WHITE CAVES PLATFORM                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     FRONTEND (React)                         │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                              │  │
│  │  ┌─────────────────┐  ┌──────────────────┐                 │  │
│  │  │ Contract        │  │ Contract Signing │                 │  │
│  │  │ Generator Page  │  │ Page (Public)    │                 │  │
│  │  │                 │  │ /sign/:id/:token │                 │  │
│  │  └────────┬────────┘  └────────┬─────────┘                 │  │
│  │           │                    │                            │  │
│  │           ▼                    ▼                            │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │     SignatureCollection Modal                       │  │  │
│  │  │  ┌─────────┐ ┌────────┐ ┌──────────┐ ┌─────────┐  │  │  │
│  │  │  │ Review  │→│ Sign   │→│ Confirm  │→│Complete │  │  │  │
│  │  │  └─────────┘ └────────┘ └──────────┘ └─────────┘  │  │  │
│  │  │                │                                     │  │  │
│  │  │                ▼                                     │  │  │
│  │  │          SignaturePad                               │  │  │
│  │  │          (Canvas Drawing)                           │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                     │                                       │  │
│  └─────────────────────┼───────────────────────────────────────┘  │
│                        │                                          │
│         ┌──────────────▼──────────────┐                          │
│         │     HTTP/REST API           │                          │
│         └──────────────┬──────────────┘                          │
│                        │                                          │
│  ┌─────────────────────▼──────────────────────────────────────┐  │
│  │                  BACKEND (Node.js/Express)               │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │                                                            │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │ Signature Routes (12 endpoints)                  │   │  │
│  │  │ • POST   /request                                │   │  │
│  │  │ • GET    /:contractId/:token                     │   │  │
│  │  │ • POST   /:signatureId/sign                      │   │  │
│  │  │ • GET    /:contractId/status                     │   │  │
│  │  │ • GET    /:contractId/audit                      │   │  │
│  │  │ • (+ 7 more endpoints)                           │   │  │
│  │  └────────────────┬────────────────────────────────┘   │  │
│  │                   │                                       │  │
│  │  ┌────────────────▼────────────────────────────────┐    │  │
│  │  │ SignatureService (22 methods)                   │    │  │
│  │  │ • createSignatureRequest()                      │    │  │
│  │  │ • verifySignatureToken()                        │    │  │
│  │  │ • saveSignature()                               │    │  │
│  │  │ • getSignatureStatus()                          │    │  │
│  │  │ • checkContractSignatureCompletion()            │    │  │
│  │  │ • createAuditLog()                              │    │  │
│  │  │ • (+ 16 more methods)                           │    │  │
│  │  └────────────────┬────────────────────────────────┘    │  │
│  │                   │                                       │  │
│  └───────────────────┼───────────────────────────────────────┘  │
│                      │                                           │
│  ┌───────────────────▼───────────────────────────────────────┐  │
│  │              DATABASE (MongoDB)                          │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │                                                           │  │
│  │  ContractSignature Collection                           │  │
│  │  ├─ _id, contractId, signedBy                           │  │
│  │  ├─ token, status, signatureData                        │  │
│  │  ├─ deviceInfo, method, timestamps                      │  │
│  │  └─ pageViews, expiresAt                               │  │
│  │                                                           │  │
│  │  SignatureAudit Collection                              │  │
│  │  ├─ _id, contractId, actor                              │  │
│  │  ├─ action, details, timestamp                          │  │
│  │  └─ (Audit trail of all activities)                     │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Signature Request Flow

```
┌──────────────────┐
│  Contract        │
│  Generated       │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Trigger Signature Requests           │
│ POST /api/signatures/batch/request   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ SignatureService.                    │
│ createBatchSignatureRequests()       │
│                                      │
│ For each signer:                     │
│ • Generate secure token              │
│ • Create ContractSignature record    │
│ • Set 7-day expiration               │
│ • Log: request_created               │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Send Signature Email                 │
│ - Signing link                       │
│ - Contract details                   │
│ - Deadline (7 days)                  │
│ Log: notification_sent               │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Await Signer Response                │
│ (Pending state in database)          │
└─────────────────────────────────────┘
```

---

## 3. Signature Submission Flow

```
┌─────────────────────────────┐
│ Signer Clicks Email Link    │
│ /contracts/sign/:id/:token  │
└──────────┬──────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Verify Token                             │
│ GET /api/signatures/:contractId/:token   │
└──────────┬───────────────────────────────┘
           │
           ├─ Valid? Continue
           ├─ Expired? Show error
           ├─ Already used? Show error
           ├─ Rate limit? Show error
           └─ Else? Show error
           │
           ▼
┌──────────────────────────────────────────┐
│ Display SignatureCollection Modal        │
│                                          │
│ Step 1: Review                           │
│ • Contract info                          │
│ • Signer details                         │
│                                          │
│ Step 2: Sign                             │
│ • SignaturePad (Canvas)                  │
│ • Draw signature                         │
│                                          │
│ Step 3: Confirm                          │
│ • Preview signature                      │
│ • Accept terms                           │
│                                          │
│ Step 4: Submit                           │
│ • Send signature image                   │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Submit Signature                         │
│ POST /api/signatures/:signatureId/sign   │
│                                          │
│ Body:                                    │
│ {                                        │
│   imageData: base64,                    │
│   coordinates: {...},                    │
│   method: 'canvas',                      │
│   deviceInfo: {...}                      │
│ }                                        │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ SignatureService.saveSignature()         │
│                                          │
│ 1. Verify token still valid              │
│ 2. Calculate SHA256 hash                 │
│ 3. Extract device info (IP, browser)     │
│ 4. Save signature data to DB             │
│ 5. Update status to 'signed'             │
│ 6. Log: 'signed'                         │
│ 7. Check if all signed                   │
│    └─ If yes: Update contract to         │
│       'executed' & log                   │
│       'all_signatures_complete'          │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Return Success Response                  │
│ { success: true, data: {...} }          │
└──────────┬───────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Display Success Screen                   │
│ • Confirmation message                   │
│ • Optional: Download contract            │
│ • Auto-redirect home                     │
└─────────────────────────────────────────┘
```

---

## 4. Component Hierarchy

```
ContractSigningPage (Public Route)
│
├─ Loading State
│  └─ Spinner + "Loading contract..."
│
├─ Error State
│  ├─ Error icon
│  ├─ Error message
│  └─ "Return Home" button
│
├─ Success State
│  ├─ Checkmark icon
│  ├─ "Signature Received"
│  └─ Auto-redirect countdown
│
└─ Signing State
   │
   └─ SignatureCollection Modal
      │
      ├─ Header
      │  ├─ Title: "Digital Signature"
      │  └─ Close button
      │
      ├─ Progress Indicator
      │  ├─ Step 1: Review ○
      │  ├─ Step 2: Sign ◉
      │  ├─ Step 3: Confirm ○
      │  └─ Step 4: Complete ○
      │
      ├─ Content (Dynamic)
      │  │
      │  ├─ Step 1: Review
      │  │  ├─ Contract info
      │  │  ├─ Signer details
      │  │  └─ Terms preview
      │  │
      │  ├─ Step 2: Sign
      │  │  │
      │  │  └─ SignaturePad
      │  │     ├─ Canvas element
      │  │     ├─ Status indicator
      │  │     ├─ Clear button
      │  │     └─ Confirm button
      │  │
      │  ├─ Step 3: Confirm
      │  │  ├─ Signature preview
      │  │  ├─ Legal disclaimer
      │  │  └─ Confirmation checkbox
      │  │
      │  └─ Step 4: Complete
      │     ├─ Success message
      │     └─ Next actions
      │
      └─ Footer
         ├─ Back button
         ├─ Cancel button
         └─ Next/Submit button
```

---

## 5. Data Flow Diagram

```
User Input
    │
    ├─ Draw Signature
    │  └─ onSignaturePad.onCapture()
    │     └─ imageData (base64)
    │
    ├─ Verify Token
    │  └─ GET /api/signatures/:contractId/:token
    │     └─ API queries: ContractSignature
    │        └─ Checks: Validity, Expiry, Rate limit
    │
    └─ Submit Signature
       └─ POST /api/signatures/:signatureId/sign
          │
          ├─ Validate input
          │
          ├─ Call SignatureService.saveSignature()
          │  │
          │  ├─ Verify token
          │  ├─ Hash signature (SHA256)
          │  ├─ Extract device info
          │  ├─ Update database
          │  └─ Return result
          │
          ├─ Check completion
          │  └─ SignatureService.checkContractSignatureCompletion()
          │     ├─ Query all signatures
          │     ├─ Compare with required roles
          │     ├─ If complete:
          │     │  ├─ Update Contract status
          │     │  └─ Create audit log
          │     └─ Return boolean
          │
          └─ Return response

Database Updates
    │
    ├─ ContractSignature collection
    │  ├─ Update status: pending → signed
    │  ├─ Save signatureData
    │  ├─ Save deviceInfo
    │  └─ Set signedAt timestamp
    │
    ├─ SignatureAudit collection
    │  ├─ Log: "signed" action
    │  ├─ Log: actor (email)
    │  ├─ Log: details (device info)
    │  └─ Log: timestamp
    │
    └─ Contract collection
       └─ If all signed:
          ├─ Update status: draft → executed
          └─ Set fullySignedAt timestamp
```

---

## 6. Security Features Map

```
Security Layer 1: Token Management
├─ Generation
│  ├─ crypto.randomBytes(32)
│  └─ 256-bit entropy
│
├─ Validation
│  ├─ Check token exists
│  ├─ Check not already used
│  ├─ Check not expired
│  └─ Return valid/invalid
│
├─ Expiration
│  ├─ 7-day window
│  ├─ Auto-mark as expired
│  └─ Prevent reuse
│
└─ One-time Use
   └─ Mark as used after signature

Security Layer 2: Rate Limiting
├─ Per-request tracking
├─ Max 10 page views/hour
├─ Timestamp array tracking
└─ Automatic reset per hour

Security Layer 3: Signature Validation
├─ SHA256 hash calculation
├─ Hash verification on access
└─ Immutable signature data

Security Layer 4: Device Fingerprinting
├─ IP address logging
├─ User agent capture
├─ Platform detection
├─ Browser detection
└─ Timestamp recording

Security Layer 5: Audit Trail
├─ All actions logged
├─ Actor identification
├─ Action type recording
├─ Detailed context capture
└─ Timestamp recording

Security Layer 6: Data Protection
├─ Input validation
├─ Error message sanitization
├─ Required field checking
└─ No sensitive data exposure
```

---

## 7. Sequence Diagram: Complete Workflow

```
Signer      UI           API          Service        Database
│           │            │             │              │
├──────────────────────────────────────────────────────┤
│  1. Contract Created (by admin)                     │
├──────────────────────────────────────────────────────┤
│           │                                          │
│           │ 2. Create Signature Requests            │
│           ├────────────────────────────────────────>│
│           │                                         │
│           │           3. Generate Token            │
│           │           4. Create Record             │
│           │ <─────────────────────────────────────┤
│           │                                        │
│           │ 5. Send Email with Link               │
│           │ (Token in URL)                        │
│           │<─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│           │                                       │
│ 6. Click Link                                      │
├──────────>│                                       │
│           │ 7. GET /:contractId/:token           │
│           ├──────────────────────────────────────>│
│           │                                       │
│           │     8. Verify Token                   │
│           │     9. Rate limit check               │
│           │     10. Check expiration              │
│           │     11. Query ContractSignature       │
│           │     <────────────────────────────────┤
│           │                                       │
│ 12. Verify Page<─────────────────────────────────┤
│    Rendered  │                                    │
│      │      │                                     │
│      │ 13. Draw Signature                         │
│      │      │                                     │
│ 14. Click Confirm                                 │
├──────────>│                                       │
│           │ 15. POST /:signatureId/sign           │
│           │ (imageData, coordinates, deviceInfo) │
│           ├──────────────────────────────────────>│
│           │                                      │
│           │      16. saveSignature()             │
│           │      17. Calculate hash              │
│           │      18. Update database             │
│           │      19. Create audit log            │
│           │      20. Check completion            │
│           │      <───────────────────────────────┤
│           │                                      │
│ 21. Show Success<──────────────────────────────┤
│           │                                      │
│ 22. Auto-Redirect                                │
├──────────>│                                       │
└───────────┴──────────────────────────────────────┘
```

---

## 8. State Management Flow (React)

```
ContractSigningPage
│
├─ State: contract (null | Contract)
├─ State: tokenData (null | TokenData)
├─ State: isLoading (boolean)
├─ State: error (null | string)
└─ State: signatureComplete (boolean)

SignatureCollection Modal
│
├─ State: currentStep (1 | 2 | 3 | 4)
├─ State: isSubmitting (boolean)
├─ State: submissionError (null | string)
├─ State: signatureData (null | SignatureData)
└─ State: confirmationChecked (boolean)

SignaturePad
│
├─ State: isDrawing (boolean)
├─ State: hasSignature (boolean)
└─ State: context (CanvasContext | null)

Data Flow:
User draws sig → SignaturePad → onSignatureCapture(data)
                     ↓
            Pass to SignatureCollection
                     ↓
            Save to signatureData state
                     ↓
            User confirms
                     ↓
            Submit to API
                     ↓
            API returns success
                     ↓
            Update signatureComplete state
                     ↓
            ContractSigningPage shows success
                     ↓
            Auto-redirect after delay
```

---

## 9. Error Handling Flow

```
Try to Verify Token
│
├─ Token Invalid
│  └─ Return 400 + "Invalid signature token"
│     └─ Show Error Page + "Return Home" button
│
├─ Token Expired
│  └─ Return 400 + "Signature request has expired"
│     └─ Show Error Page + "Request new signing link"
│
├─ Already Signed
│  └─ Return 400 + "Already signed by this party"
│     └─ Show Error Page + "Contact admin"
│
├─ Rate Limited
│  └─ Return 400 + "Too many signature requests"
│     └─ Show Error Page + "Try again later"
│
├─ Network Error
│  └─ Catch error
│     └─ Show Error Alert + "Retry" button
│
└─ Unexpected Error
   └─ Return 500 + "Internal server error"
      └─ Show Error Page + Contact support info
```

---

## 10. Database Index Recommendations

```
ContractSignature
├─ Index: contractId
├─ Index: token
├─ Index: signedBy.email
├─ Index: status
├─ Index: createdAt
└─ Index: expiresAt

SignatureAudit
├─ Index: contractId
├─ Index: action
├─ Index: timestamp
└─ Index: actor

Contract
├─ Index: signatureStatus
└─ Index: status
```

---

**These diagrams provide a complete visual understanding of the Phase 2B e-signature system architecture, data flow, and security implementation.**
