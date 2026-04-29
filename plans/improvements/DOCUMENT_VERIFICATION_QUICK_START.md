# Document Verification System - Quick Start Guide

## 📋 Prerequisites

Before getting started, ensure you have:

1. **Node.js** 18.x or higher
2. **MongoDB** connected and running
3. **Required npm packages**:
   ```bash
   npm install tesseract.js sharp multer mongoose
   ```

4. **Environment variables** configured:
   ```
   UPLOAD_DIR=uploads/documents/
   MAX_FILE_SIZE=10485760
   OCR_CONFIDENCE_THRESHOLD=60
   ```

## 🚀 Getting Started (5 Minutes)

### Step 1: Backend Setup

#### 1.1 Create upload directory
```bash
mkdir -p uploads/documents/
chmod 755 uploads/documents/
```

#### 1.2 Verify imports in routes
```javascript
// server/routes/api/complianceRoutes.js should have:
const DocumentProcessingService = require('../../services/compliance/DocumentProcessingService');
const DocumentValidationService = require('../../services/compliance/DocumentValidationService');
const multer = require('multer');
```

#### 1.3 Start backend server
```bash
npm start
# or for development with hot reload
npm run dev
```

### Step 2: Frontend Setup

#### 2.1 Import DocumentVerificationProcessor in your component
```javascript
import DocumentVerificationProcessor from './DocumentVerificationProcessor';
```

#### 2.2 Add component to JSX
```jsx
<DocumentVerificationProcessor
  documentType="emirates_id"
  userId={user.id}
  token={authToken}
  required={true}
  onSuccess={(result) => console.log('Success:', result)}
  onError={(error) => console.error('Error:', error)}
/>
```

#### 2.3 Start frontend dev server
```bash
npm run dev
```

## 📱 Using the Component

### Basic Usage

```jsx
import React, { useState } from 'react';
import DocumentVerificationProcessor from './DocumentVerificationProcessor';

function MyComponent() {
  const [verificationStatus, setVerificationStatus] = useState(null);

  return (
    <div>
      <h1>Verify Your Documents</h1>
      
      <DocumentVerificationProcessor
        documentType="emirates_id"
        userId="user-123"
        token={authToken}
        required={true}
        onSuccess={(result) => {
          console.log('Document verified:', result);
          setVerificationStatus('verified');
        }}
        onError={(error) => {
          console.error('Verification failed:', error);
          setVerificationStatus('failed');
        }}
      />

      {verificationStatus && (
        <p>Status: {verificationStatus}</p>
      )}
    </div>
  );
}
```

### Document Types Supported

| Type | Icon | Required | Fields |
|------|------|----------|--------|
| `emirates_id` | ID Card | Yes | ID Number, Name, DOB, Expiry |
| `passport` | Passport | Yes | Passport Number, Name, DOB |
| `visa` | Document | No | Visa Type, Dates |

## 🔌 API Examples

### Upload and Verify Document

**Request**:
```bash
curl -X POST http://localhost:3000/api/compliance/documents/verify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "document=@emiratesid.jpg" \
  -F "documentType=emirates_id" \
  -F "userId=user-123"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "documentId": "507f1f77bcf86cd799439011",
    "processingResult": {
      "confidence": 92,
      "extractedFields": {
        "idNumber": "78412345678901",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "01/01/1990",
        "expiryDate": "31/12/2030"
      }
    },
    "validation": {
      "isValid": true,
      "errors": [],
      "warnings": [],
      "riskScore": 15,
      "riskLevel": "low"
    },
    "screening": {
      "isClear": true,
      "alerts": []
    },
    "status": "verified"
  }
}
```

### Get Document Status

**Request**:
```bash
curl -X GET http://localhost:3000/api/compliance/documents/507f1f77bcf86cd799439011/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "documentId": "507f1f77bcf86cd799439011",
    "type": "emirates_id",
    "status": "verified",
    "verifiedAt": "2025-01-20T10:30:00Z",
    "verifiedBy": "compliance-officer-1",
    "ocrConfidence": 92,
    "extractedData": {...}
  }
}
```

### Approve Document

**Request**:
```bash
curl -X POST http://localhost:3000/api/compliance/documents/507f1f77bcf86cd799439011/approve \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comments": "Document verified successfully"}'
```

### Reject Document

**Request**:
```bash
curl -X POST http://localhost:3000/api/compliance/documents/507f1f77bcf86cd799439011/reject \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Document quality too low"}'
```

## 🧪 Testing

### Run API Tests
```bash
# Set authentication token
export AUTH_TOKEN="your_jwt_token"

# Run test suite
node test-document-verification-api.js
```

### Manual Testing Steps

#### Test 1: Valid Emirates ID
1. Navigate to the document upload component
2. Click "Select Document" button
3. Choose a clear Emirates ID image
4. Wait for processing (shows progress bar)
5. Verify extracted fields are correct
6. Click "Verify Document"
7. Check results display

#### Test 2: Drag & Drop
1. Drag an image file onto the upload area
2. Verify preview appears
3. Check file size and name
4. Process the document

#### Test 3: Error Handling
1. Try uploading a non-image file (should fail)
2. Try uploading file > 10MB (should fail)
3. Try uploading blurry/unreadable document
4. Verify error messages display correctly

#### Test 4: Download Results
1. After verification, click "Download Result"
2. Verify JSON file is saved with all data
3. Check JSON structure matches expected format

## 📊 Response Data Structure

### Validation Object
```javascript
{
  isValid: Boolean,           // Overall validation status
  errors: [String],           // Validation errors
  warnings: [String],         // Validation warnings
  riskScore: Number,          // 0-100 risk score
  riskLevel: String,          // low|medium|high|critical
  recommendations: [String]   // Recommended actions
}
```

### Risk Levels
- **Low (0-25)**: Proceed with standard processing
- **Medium (26-50)**: Request supporting documents
- **High (51-75)**: Manual compliance officer review required
- **Critical (76-100)**: Escalate to compliance team immediately

### Extracted Fields by Document Type

**Emirates ID**:
```javascript
{
  idNumber: String,        // 11-digit ID
  firstName: String,
  lastName: String,
  dateOfBirth: String,     // DD/MM/YYYY
  nationality: String,
  expiryDate: String       // DD/MM/YYYY
}
```

**Passport**:
```javascript
{
  passportNumber: String,
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  nationality: String,
  gender: String,          // M|F
  expiryDate: String
}
```

**Visa**:
```javascript
{
  visaType: String,        // Employment|Visit|Transit|etc
  issueDate: String,
  expiryDate: String,
  residenceNumber: String  // Optional
}
```

## 🔒 Security Features

1. **File Validation**
   - Image format validation (JPEG, PNG, GIF only)
   - File size limit (10MB max)
   - Malware scanning (recommended: enable in production)

2. **Data Encryption**
   - Extracted data encrypted at rest
   - HTTPS for data in transit
   - Sensitive fields can be masked in UI

3. **Access Control**
   - JWT token verification
   - Role-based access (compliance_officer, admin)
   - Audit trail logging

4. **Compliance**
   - AML/CFT compliance checks
   - Sanctions list integration
   - PEP (Politically Exposed Person) detection
   - Risk scoring based on regulations

## 🐛 Troubleshooting

### OCR Not Extracting Data
```
Problem: Low confidence or missing fields
Solution:
1. Ensure image is clear and well-lit
2. Remove glare and shadows
3. Keep document flat and square
4. Use high resolution image
5. Check Tesseract is properly installed
```

### File Upload Fails
```
Problem: Upload error message
Solution:
1. Check file size (max 10MB)
2. Verify file format (JPG, PNG, GIF only)
3. Check upload directory permissions
4. Verify disk space available
5. Check multer configuration
```

### Low Confidence Scores
```
Problem: OCR confidence < 60%
Solution:
1. Request user to submit clearer image
2. Check image enhancement settings
3. Verify document quality
4. Consider multiple capture attempts
5. May require manual review
```

### Validation Failures
```
Problem: Document rejected despite valid data
Solution:
1. Check parsing rules for document type
2. Verify date format (should be DD/MM/YYYY)
3. Review validation error messages
4. Check regex patterns for numbers
5. Test with known valid documents
```

## 📝 Example Workflow

### Complete Flow for User
```
1. User navigates to KYC section
2. Component prompts to upload Emirates ID
3. User drags or selects image file
4. Shows preview and file info
5. User clicks "Verify Document"
6. System:
   - Processes image (OCR)
   - Extracts fields
   - Validates data
   - Checks duplicates
   - Calculates risk score
   - Checks sanctions lists
7. Shows results:
   - Extracted data
   - Validation status
   - Risk level
   - Recommendations
8. User can:
   - Download result as JSON
   - View raw OCR text
   - Upload another document
9. Compliance officer can:
   - Review results
   - Approve document
   - Request corrections
   - Reject with reason
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Install all dependencies
- [ ] Configure environment variables
- [ ] Create upload directory with proper permissions
- [ ] Set up MongoDB connection
- [ ] Configure file upload limits
- [ ] Enable HTTPS
- [ ] Set up backup for uploaded documents
- [ ] Configure logging
- [ ] Test complete workflow
- [ ] Set up monitoring and alerts
- [ ] Create disaster recovery plan
- [ ] Document for support team

## 📞 Support Resources

### Common Issues & Solutions
See: `DOCUMENT_VERIFICATION_IMPLEMENTATION_GUIDE.md`

### API Documentation
See: `DOCUMENT_VERIFICATION_API_REFERENCE.md`

### Test Suite
See: `test-document-verification-api.js`

---

**Quick Links**:
- 📖 Full Implementation Guide: `DOCUMENT_VERIFICATION_IMPLEMENTATION_GUIDE.md`
- 🔌 API Reference: Check complianceRoutes.js
- 🧪 Test Suite: `test-document-verification-api.js`
- 📊 Component Props: `DocumentVerificationProcessor.jsx`

**Version**: 1.0  
**Last Updated**: January 2025
