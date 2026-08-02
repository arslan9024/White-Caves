# Document Verification System - Implementation Guide

## Overview

This guide covers the complete implementation of the custom document verification system for Emirates ID, Passport, and Visa documents. The system includes OCR processing, data extraction, validation, and compliance checking.

## System Architecture

### Backend Components

#### 1. **DocumentProcessingService.js**
- **Location**: `server/services/compliance/DocumentProcessingService.js`
- **Responsibilities**:
  - Image quality validation and enhancement
  - OCR text extraction using Tesseract
  - Document-specific field parsing (Emirates ID, Passport, Visa)
  - Document status verification (expiry dates, etc.)

**Key Methods**:
```javascript
- processDocument(documentPath, documentType)
- enhanceImageQuality(imageBuffer)
- extractTextWithOCR(imageBuffer, documentType)
- parseDocumentData(text, documentType)
- validateExtractedData(parsedData, documentType)
- verifyDocumentStatus(extractedData, documentType)
```

#### 2. **DocumentValidationService.js**
- **Location**: `server/services/compliance/DocumentValidationService.js`
- **Responsibilities**:
  - Data format validation
  - Duplicate detection
  - Risk scoring
  - Sanctions and watchlist checking
  - Compliance report generation

**Key Methods**:
```javascript
- validateDocument(documentData, userId, documentType)
- validateDataFormat(documentData, validation)
- validateDatesAndExpiry(documentData, validation)
- checkForDuplicates(documentData, userId, documentType, validation)
- calculateRiskScore(documentData, validation)
- checkSanctionsAndWatchlists(documentData)
- generateComplianceReport(...)
```

#### 3. **KYCService.js Updates**
- **New Method**: `updateDocumentVerification(userId, documentData)`
- Stores document verification results in KYC profile
- Creates audit trail entries
- Manages document status and extracted data

### Frontend Components

#### 1. **DocumentVerificationProcessor.jsx**
- **Location**: `src/components/DocumentVerificationProcessor.jsx`
- **Responsibilities**:
  - Drag-and-drop document upload
  - File validation
  - Progress tracking
  - Result display and management
  - OCR result visualization

**Features**:
- Real-time progress bar
- Preview image display
- Raw OCR text viewing
- Extracted data display
- Document status verification
- JSON result download

#### 2. **KYCVerificationStep.jsx Integration**
- Imports DocumentVerificationProcessor
- Manages multi-step KYC process
- Integrates document verification with personal information collection

### API Endpoints

#### Document Verification
```
POST /api/compliance/documents/verify
- Upload and process document
- Perform OCR extraction
- Validate extracted data
- Check sanctions lists
- Return verification result

Request:
{
  "documentType": "emirates_id|passport|visa",
  "userId": "user_id (optional)"
}

Response:
{
  "success": true,
  "data": {
    "documentId": "...",
    "processingResult": {...},
    "validation": {...},
    "screening": {...},
    "compliance": {...},
    "status": "verified|pending_review"
  }
}
```

#### Document Status
```
GET /api/compliance/documents/:documentId/status
- Retrieve document verification status
- View extracted data
- Check validation results
```

#### Document Approval
```
POST /api/compliance/documents/:documentId/approve
- Approve verified document
- Add compliance officer comments
```

#### Document Rejection
```
POST /api/compliance/documents/:documentId/reject
- Reject document verification
- Provide rejection reason
```

## Document Type Specifications

### Emirates ID
**Required Fields**:
- ID Number (11 digits, format: XXX-XXXX-XXXXXXX-X)
- First Name
- Last Name
- Date of Birth
- Nationality
- Expiry Date

**Validation Rules**:
- ID format must match pattern
- Age must be ≥ 18 years
- Document must not be expired
- Duplicate check against existing records

### Passport
**Required Fields**:
- Passport Number (9 characters)
- First Name
- Last Name
- Date of Birth
- Nationality
- Gender
- Expiry Date

**Validation Rules**:
- Passport number format validation
- Age ≥ 18 years
- Not expired
- Duplicate detection

### Visa
**Required Fields**:
- Visa Type (Employment, Visit, Transit, Student, Investor)
- Issue Date
- Expiry Date
- Optional: Residence Number

**Validation Rules**:
- Not expired
- Issue date before expiry
- Visa type identification

## Risk Scoring System

### Risk Calculation
- **Base Score**: 0-100
- **Risk Levels**: Low (0-25), Medium (26-50), High (51-75), Critical (76-100)

### Risk Factors
```javascript
- Document Expiry: +30 points (expired), +15 points (expires < 30 days)
- Age Issues: +50 points (< 18), +10 points (< 25), +5 points (> 80)
- High-Risk Country: +25 points
- Low OCR Confidence: +20 points (confidence < 60%)
- Suspicious Patterns: +40 points
- Duplicate Document: +50 points
```

### Recommendations by Risk Level
- **Low**: Standard processing
- **Medium**: Request supporting documents
- **High**: Manual compliance officer review
- **Critical**: Enhanced due diligence, escalate to compliance team

## Integration Steps

### 1. Frontend Integration
```javascript
// In parent component
import DocumentVerificationProcessor from './DocumentVerificationProcessor';

<DocumentVerificationProcessor
  documentType="emirates_id"
  userId={user.id}
  token={authToken}
  required={true}
  onSuccess={(result) => {
    console.log('Document verified:', result);
    // Update parent state, move to next step
  }}
  onError={(error) => {
    console.error('Verification failed:', error);
    // Handle error
  }}
/>
```

### 2. Backend Integration
```javascript
// Multer configuration for document upload
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Route handler
router.post('/documents/verify', verifyToken, upload.single('document'), async (req, res) => {
  // Process document using DocumentProcessingService
  // Validate using DocumentValidationService
  // Store in KYC profile using KYCService
});
```

### 3. Redux Integration
**Store slice**: `src/store/slices/kycAmlSlice.js`

**Available thunks**:
- `verifyDocument` - Main document verification thunk

**State structure**:
```javascript
{
  documents: {
    [documentId]: {
      type: 'emirates_id|passport|visa',
      status: 'pending|verified|rejected',
      confidence: 95,
      extractedData: {...},
      validationResult: {...},
      complianceReport: {...}
    }
  }
}
```

## Testing Guide

### Unit Tests

#### 1. DocumentProcessingService Tests
```javascript
describe('DocumentProcessingService', () => {
  test('should process valid Emirates ID image', async () => {
    // Load test image
    // Call processDocument
    // Verify OCR extraction
    // Check parsed data
  });

  test('should detect expired documents', async () => {
    // Load expired document image
    // Verify status verification
  });

  test('should enhance image quality', async () => {
    // Load low-quality image
    // Verify enhancement
  });
});
```

#### 2. DocumentValidationService Tests
```javascript
describe('DocumentValidationService', () => {
  test('should validate Emirates ID format', async () => {
    // Test valid and invalid formats
    // Check error messages
  });

  test('should detect age violations', async () => {
    // Test underage entries
    // Verify error generation
  });

  test('should calculate risk score correctly', () => {
    // Test various risk factors
    // Verify scoring logic
  });
});
```

### Integration Tests

#### 1. Complete Document Verification Flow
```javascript
describe('Document Verification Flow', () => {
  test('should complete full verification for Emirates ID', async () => {
    // 1. Upload document
    // 2. Process and extract
    // 3. Validate
    // 4. Check sanctions
    // 5. Generate report
    // 6. Store in profile
    // Verify all steps complete successfully
  });

  test('should reject invalid document', async () => {
    // Upload invalid document
    // Verify rejection
    // Check error messages
  });

  test('should detect duplicates', async () => {
    // Upload same document twice
    // Verify duplicate detection
  });
});
```

#### 2. API Endpoint Tests
```javascript
describe('Document Verification API', () => {
  test('POST /api/compliance/documents/verify', async () => {
    const formData = new FormData();
    formData.append('document', imageFile);
    formData.append('documentType', 'emirates_id');

    const response = await request(app)
      .post('/api/compliance/documents/verify')
      .set('Authorization', `Bearer ${token}`)
      .send(formData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.validation).toBeDefined();
  });
});
```

### Manual Testing Checklist

- [ ] Upload valid Emirates ID image
  - [ ] Verify OCR extraction
  - [ ] Check parsed fields (ID, name, DOB, expiry)
  - [ ] Validate data format
  - [ ] View compliance report

- [ ] Upload valid Passport image
  - [ ] Verify passport number extraction
  - [ ] Check nationality detection
  - [ ] Validate expiry status
  - [ ] Check risk scoring

- [ ] Upload valid Visa image
  - [ ] Verify visa type detection
  - [ ] Check expiry date extraction
  - [ ] Validate residence number (if present)

- [ ] Test error scenarios
  - [ ] Invalid image format
  - [ ] File size exceeded
  - [ ] Low image quality
  - [ ] Damaged/unreadable document
  - [ ] Expired document

- [ ] Test UI features
  - [ ] Drag and drop
  - [ ] File preview
  - [ ] Progress bar
  - [ ] Download result
  - [ ] Copy raw text
  - [ ] Clear selection

## Deployment Checklist

### Prerequisites
- [ ] Tesseract.js installed and configured
- [ ] Sharp image processing library installed
- [ ] MongoDB models updated with document schema
- [ ] File upload directory created and writable
- [ ] Environment variables configured

### Environment Variables
```
UPLOAD_DIR=uploads/documents/
MAX_FILE_SIZE=10485760  # 10MB
OCR_CONFIDENCE_THRESHOLD=60
RISK_SCORE_HIGH_THRESHOLD=50
RISK_SCORE_CRITICAL_THRESHOLD=75
```

### Database Setup
```javascript
// Ensure KYCProfile schema includes documents array
documents: [
  {
    type: String,  // emirates_id, passport, visa
    status: String, // pending, verified, rejected
    uploadedAt: Date,
    uploadedBy: ObjectId,
    ocrConfidence: Number,
    extractedData: Mixed,
    validationResult: Mixed,
    complianceReport: Mixed
  }
]
```

## Monitoring and Logging

### Log Levels
- **ERROR**: Failed document processing, validation errors
- **WARN**: Low confidence OCR, potential duplicates
- **INFO**: Document uploaded, processing complete, verification status
- **DEBUG**: Detailed processing steps, extracted data

### Metrics to Track
- Document upload count
- Processing success rate
- OCR confidence average
- Risk score distribution
- Verification status breakdown
- Processing time per document

## Future Enhancements

### Phase 2 (Facial Recognition)
- Facial recognition integration
- Selfie verification
- Liveness detection
- Face matching with ID photo

### Phase 3 (Advanced Features)
- Document authentication verification
- Security feature detection
- 3D document analysis
- Multi-language OCR support

### Phase 4 (API Integrations)
- Third-party sanctions API integration
- Government ID verification services
- Advanced fraud detection ML models
- Real-time watchlist integration

## Troubleshooting

### Common Issues

#### Low OCR Confidence
**Symptoms**: Extracted data has missing fields or low confidence score
**Solutions**:
1. Request clearer document image
2. Ensure good lighting in photo
3. Keep document flat and visible
4. Remove glare or shadows
5. Use high-resolution camera

#### Duplicate Detection Issues
**Symptoms**: System incorrectly flags as duplicate
**Solutions**:
1. Check document number parsing
2. Verify database entries
3. Review duplicate check logic
4. Check date format handling

#### Processing Timeouts
**Symptoms**: Large files or slow processing
**Solutions**:
1. Reduce file size (compress image)
2. Optimize image quality enhancement
3. Increase timeout limits
4. Use image preprocessing

#### Validation Failures
**Symptoms**: Valid documents rejected
**Solutions**:
1. Check parsing rules for document type
2. Review validation error messages
3. Verify date format handling
4. Check field extraction logic

## Support and Maintenance

### Regular Maintenance Tasks
- [ ] Monitor OCR confidence scores
- [ ] Review risk score distribution
- [ ] Update sanctions lists
- [ ] Clean up old uploads
- [ ] Review and update validation rules
- [ ] Update security policies

### Performance Optimization
- Image caching for thumbnails
- Batch processing for multiple documents
- Parallel processing for validation steps
- Database indexing on common queries
- CDN for document storage

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Maintained By**: Compliance Team
