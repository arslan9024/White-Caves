# Document Verification System - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Frontend)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────┐        │
│  │           DocumentVerificationProcessor Component             │        │
│  │  ┌────────────────────────────────────────────────────────┐  │        │
│  │  │  Upload Section                                         │  │        │
│  │  │  - Drag & Drop                                         │  │        │
│  │  │  - File Selection                                      │  │        │
│  │  │  - Preview Display                                     │  │        │
│  │  └────────────────────────────────────────────────────────┘  │        │
│  │  ┌────────────────────────────────────────────────────────┐  │        │
│  │  │  Processing Section                                     │  │        │
│  │  │  - Progress Bar                                        │  │        │
│  │  │  - Status Messages                                     │  │        │
│  │  └────────────────────────────────────────────────────────┘  │        │
│  │  ┌────────────────────────────────────────────────────────┐  │        │
│  │  │  Results Section                                        │  │        │
│  │  │  - Extracted Data Display                              │  │        │
│  │  │  - Validation Status                                   │  │        │
│  │  │  - Risk Score                                          │  │        │
│  │  │  - Download Option                                     │  │        │
│  │  └────────────────────────────────────────────────────────┘  │        │
│  └──────────────────────────────────────────────────────────────┘        │
│                                                                            │
│  ┌──────────────────────────────┐                                        │
│  │   Redux Store                 │                                        │
│  │   (kycAmlSlice)               │                                        │
│  │  ┌────────────────────────┐  │                                        │
│  │  │ Documents State        │  │                                        │
│  │  │ - Status               │  │                                        │
│  │  │ - Metadata             │  │                                        │
│  │  │ - Extracted Data       │  │                                        │
│  │  └────────────────────────┘  │                                        │
│  └──────────────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST with JWT
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  POST   /api/compliance/documents/verify                                 │
│  GET    /api/compliance/documents/:id/status                             │
│  POST   /api/compliance/documents/:id/approve                            │
│  POST   /api/compliance/documents/:id/reject                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
┌───────────────────────┐  ┌─────────────────────┐  ┌──────────────────────┐
│  Express Routes       │  │  Multer Middleware  │  │  Auth Middleware     │
│  complianceRoutes.js  │  │  File Upload        │  │  JWT Verification    │
└───────────────────────┘  └─────────────────────┘  └──────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER (Backend)                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────┐                               │
│  │  DocumentProcessingService            │                               │
│  │  ┌────────────────────────────────┐  │                               │
│  │  │ processDocument()               │  │                               │
│  │  │  ├─ validateImage()             │  │                               │
│  │  │  ├─ enhanceImageQuality()       │  │                               │
│  │  │  ├─ extractTextWithOCR()        │  │                               │
│  │  │  ├─ parseDocumentData()         │  │                               │
│  │  │  └─ validateExtractedData()     │  │                               │
│  │  └────────────────────────────────┘  │                               │
│  └──────────────────────────────────────┘                               │
│                                                                            │
│  ┌──────────────────────────────────────┐                               │
│  │  DocumentValidationService            │                               │
│  │  ┌────────────────────────────────┐  │                               │
│  │  │ validateDocument()              │  │                               │
│  │  │  ├─ validateDataFormat()        │  │                               │
│  │  │  ├─ validateDatesAndExpiry()    │  │                               │
│  │  │  ├─ checkForDuplicates()        │  │                               │
│  │  │  ├─ calculateRiskScore()        │  │                               │
│  │  │  └─ generateRecommendations()   │  │                               │
│  │  ├─ checkSanctionsAndWatchlists()  │  │                               │
│  │  └─ generateComplianceReport()     │  │                               │
│  └──────────────────────────────────────┘                               │
│                                                                            │
│  ┌──────────────────────────────────────┐                               │
│  │  KYCService (Updated)                 │                               │
│  │  ├─ updateDocumentVerification()      │                               │
│  │  ├─ createAuditEntry()                │                               │
│  │  └─ manageDocumentStatus()            │                               │
│  └──────────────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────┬───────────┼──────────┬──────────────────────┐
        │               │           │          │                      │
┌──────────────┐ ┌────────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
│ Tesseract.js │ │ Sharp      │ │MongoDB │ │ Winston  │ │ File System  │
│ OCR Engine   │ │ Image      │ │ Store  │ │ Logger   │ │ Upload Dir   │
│              │ │ Processing │ │        │ │          │ │              │
└──────────────┘ └────────────┘ └────────┘ └──────────┘ └──────────────┘
```

## Data Flow Diagram

```
User Upload Document
        │
        ▼
    ┌─────────────────────────────────────┐
    │ File Validation                      │
    │  - Check type (JPG/PNG/GIF)         │
    │  - Check size (max 10MB)            │
    │  - Check readability                 │
    └─────────────────────────────────────┘
        │ Valid
        ▼
    ┌─────────────────────────────────────┐
    │ Image Enhancement (Sharp)            │
    │  - Normalize                         │
    │  - Increase saturation              │
    │  - Sharpen                          │
    │  - Convert to greyscale             │
    └─────────────────────────────────────┘
        │
        ▼
    ┌─────────────────────────────────────┐
    │ OCR Processing (Tesseract.js)        │
    │  - Extract text                     │
    │  - Calculate confidence (0-100)     │
    │  - Return raw text                  │
    └─────────────────────────────────────┘
        │
        ▼
    ┌─────────────────────────────────────┐
    │ Data Parsing                        │
    │  - Identify document type           │
    │  - Parse fields (ID, name, DOB)    │
    │  - Normalize data                   │
    └─────────────────────────────────────┘
        │
        ▼
    ┌─────────────────────────────────────┐
    │ Validation                          │
    │  - Format validation                │
    │  - Age verification (18+)           │
    │  - Expiry check                     │
    │  - Duplicate detection              │
    └─────────────────────────────────────┘
        │
        ▼
    ┌─────────────────────────────────────┐
    │ Risk Assessment                     │
    │  - Calculate risk score             │
    │  - Determine risk level             │
    │  - Generate recommendations         │
    └─────────────────────────────────────┘
        │
        ▼
    ┌─────────────────────────────────────┐
    │ Compliance Checking                 │
    │  - Sanctions lists                  │
    │  - Watchlists                       │
    │  - PEP detection                    │
    │  - High-risk countries              │
    └─────────────────────────────────────┘
        │
        ▼
    ┌─────────────────────────────────────┐
    │ Report Generation                   │
    │  - Compile all results              │
    │  - Add recommendations              │
    │  - Create audit trail               │
    └─────────────────────────────────────┘
        │
        ▼
    ┌─────────────────────────────────────┐
    │ Store in Database (MongoDB)          │
    │  - KYC Profile                      │
    │  - Document record                  │
    │  - Audit trail                      │
    └─────────────────────────────────────┘
        │
        ▼
    Return Results to Frontend
```

## Component Communication Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KYCVerificationStep                              │
│                                                                         │
│   ┌───────────────────────────────────────────────────────────────┐   │
│   │  DocumentVerificationProcessor (Tab 1: Emirates ID)            │   │
│   │                                                                │   │
│   │  onSuccess(result) ──────────────────────────────────────┐   │   │
│   │                                                            │   │   │
│   │  onError(error) ───────────────────────────────────────┐ │   │   │
│   └────────────────────────────────────────────────────────┼─┼───┘   │
│                                                             │ │         │
│   ┌───────────────────────────────────────────────────────┬─┼─────┐  │
│   │  DocumentVerificationProcessor (Tab 2: Passport)      │ │     │  │
│   │                                                        │ │     │  │
│   │  onSuccess(result) ────────────────────────────────┐ │ │     │  │
│   │                                                     │ │ │     │  │
│   │  onError(error) ────────────────────────────────┐ │ │ │     │  │
│   └────────────────────────────────────────────────┼─┼─┼─┼─────┘  │
│                                                     │ │ │ │         │
│                                            Results │ │ │ │         │
│                                                   ▼ ▼ ▼ ▼         │
│                                         ┌─────────────────────┐   │
│                                         │ Parent State Update │   │
│                                         │                     │   │
│                                         │ - documentStatus    │   │
│                                         │ - profileComplete   │   │
│                                         │ - nextStep          │   │
│                                         └─────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

## Database Schema Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         KYCProfile (MongoDB)                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  _id: ObjectId                                                       │
│  userId: String                                                      │
│  profileStatus: String (pending, verified, rejected)                │
│  createdAt: Date                                                     │
│  updatedAt: Date                                                     │
│                                                                      │
│  documents: [                                                        │
│    {                                                                 │
│      _id: ObjectId                                                   │
│      type: String (emirates_id, passport, visa)                    │
│      status: String (pending, verified, rejected)                  │
│      ocrConfidence: Number (0-100)                                 │
│      uploadedAt: Date                                               │
│      uploadedBy: ObjectId                                           │
│                                                                      │
│      extractedData: {                                               │
│        idNumber: String                                             │
│        firstName: String                                            │
│        lastName: String                                             │
│        dateOfBirth: Date                                            │
│        nationality: String                                          │
│        expiryDate: Date                                             │
│        ... (type-specific fields)                                   │
│      }                                                              │
│                                                                      │
│      validationResult: {                                            │
│        isValid: Boolean                                             │
│        errors: [String]                                             │
│        warnings: [String]                                           │
│        riskScore: Number                                            │
│        riskLevel: String                                            │
│        recommendations: [String]                                    │
│      }                                                              │
│                                                                      │
│      complianceReport: {                                            │
│        summary: {...}                                               │
│        screening: {...}                                             │
│        nextSteps: [...]                                             │
│      }                                                              │
│                                                                      │
│      verifiedAt: Date                                               │
│      verifiedBy: ObjectId                                           │
│      verificationComments: String                                   │
│                                                                      │
│      rejectedAt: Date                                               │
│      rejectedBy: ObjectId                                           │
│      rejectionReason: String                                        │
│    },                                                                │
│    ...                                                              │
│  ]                                                                   │
│                                                                      │
│  audit: [                                                            │
│    {                                                                 │
│      timestamp: Date                                                │
│      action: String                                                 │
│      actor: ObjectId                                                │
│      changes: Mixed                                                 │
│    }                                                                 │
│  ]                                                                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## API Request/Response Flow

```
                Frontend                              Backend
                   │                                    │
                   │                                    │
                   │  1. POST /documents/verify        │
                   │  (multipart: document + metadata) │
                   ├───────────────────────────────────▶│
                   │                                    │
                   │                              2. Validate
                   │                              3. Process
                   │                              4. Extract
                   │                              5. Validate
                   │                              6. Check
                   │                              7. Report
                   │                                    │
                   │  8. 200 OK (JSON Response)        │
                   │  {                                 │
                   │    success: true,                  │
                   │    data: {                         │
                   │      documentId: "...",           │
                   │      processingResult: {...},     │
                   │      validation: {...},           │
                   │      screening: {...},            │
                   │      compliance: {...},           │
                   │      status: "verified"           │
                   │    }                              │
                   │  }                                │
                   │◀───────────────────────────────────┤
                   │                                    │
                3. Update state & display results      │
```

## Risk Scoring Logic Diagram

```
                      Start Risk Assessment
                             │
                ┌────────────┴────────────┐
                │                         │
         Check Age               Check Expiry
                │                         │
         < 18 years?          Expired?
         │       │            │       │
       YES NO  YES NO
        │  │    │  │
       +50 0  +30 0
                │
    ┌───────────┼────────────┬──────────────┐
    │           │            │              │
Check Nationality  Check OCR    Check Country  Check Duplicates
    │           │            │              │
  High-risk?  Confidence    High-risk?    Found?
  │    │       < 60%?       │    │        │  │
 YES NO        │   │       YES NO       YES NO
  +25  0      +20  0       +25  0       +50  0
                │
         ┌──────┴──────┬──────────┬──────────┐
         │             │          │          │
    Sum all      25   Low Risk  Medium     High Risk
    points       │     0-25      Risk      51-75
         │      50    26-50       │          │
        100     │      │         │          │
      Critical  │      │         │          │
        76-100  │      │         │          │
                └──────┴──────────┴──────────┘

                 Generate Recommendations
                 Based on Risk Level
```

## Security Layer Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    Request Comes In                       │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  1. Authentication Check (JWT)         │
        │     - Verify token signature           │
        │     - Check token expiry               │
        └───────────────────────────────────────┘
                            │ Valid
                            ▼
        ┌───────────────────────────────────────┐
        │  2. Authorization Check (Role-based)   │
        │     - Check user role                  │
        │     - Verify permissions               │
        └───────────────────────────────────────┘
                            │ Authorized
                            ▼
        ┌───────────────────────────────────────┐
        │  3. File Validation                    │
        │     - Type check (JPEG/PNG/GIF)       │
        │     - Size check (max 10MB)           │
        │     - Header validation                │
        └───────────────────────────────────────┘
                            │ Valid
                            ▼
        ┌───────────────────────────────────────┐
        │  4. Input Sanitization                │
        │     - Trim whitespace                  │
        │     - Validate field values            │
        │     - Escape special characters        │
        └───────────────────────────────────────┘
                            │ Safe
                            ▼
        ┌───────────────────────────────────────┐
        │  5. Processing                        │
        │     - OCR extraction                   │
        │     - Data validation                  │
        │     - Compliance checks                │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  6. Audit Logging                     │
        │     - Log action                       │
        │     - Record user                      │
        │     - Store timestamp                  │
        │     - Encrypt sensitive data           │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  7. Response Preparation              │
        │     - Filter sensitive data           │
        │     - Format response                  │
        │     - Add security headers             │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  Response Sent to Client              │
        └───────────────────────────────────────┘
```

---

This architectural documentation provides a complete visual overview of how all components of the Document Verification System interact with each other.
