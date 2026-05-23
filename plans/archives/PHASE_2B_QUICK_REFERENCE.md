# Phase 2B Quick Reference Card

## 🎯 One-Page Quick Reference

### API Endpoints Summary

```
POST   /api/signatures/request              → Create signature request
GET    /api/signatures/:contractId/:token   → Verify token & get data
POST   /api/signatures/:signatureId/sign    → Submit signature
GET    /api/signatures/:contractId/status   → Get completion status
GET    /api/signatures/:contractId/stats    → Get statistics
GET    /api/signatures/:contractId/audit    → Get audit trail
POST   /api/signatures/:signatureId/resend  → Resend request
POST   /api/signatures/:signatureId/cancel  → Cancel request
POST   /api/signatures/batch/request        → Create multiple requests
GET    /api/signatures/user/:email/pending  → Get pending for user
POST   /api/signatures/bulk/status          → Bulk status check
```

---

### Service Methods (SignatureService)

| Method                           | Purpose               | Returns                           |
| -------------------------------- | --------------------- | --------------------------------- |
| `createSignatureRequest()`       | Create new request    | {signatureId, token, signingLink} |
| `verifySignatureToken()`         | Verify token          | Token data or error               |
| `saveSignature()`                | Save signed signature | Updated signature                 |
| `getSignatureStatus()`           | Get completion status | {signed, pending, complete}       |
| `getAuditTrail()`                | Get activity log      | Array of audit entries            |
| `createBatchSignatureRequests()` | Create multiple       | Array of requests                 |
| `resendSigningRequest()`         | Regenerate token      | New {token, signingLink}          |
| `cancelSignatureRequest()`       | Cancel request        | Updated signature                 |

---

### React Components

#### SignaturePad

```javascript
<SignaturePad
  onSignatureCapture={data => {
    // data = {imageData, coordinates, timestamp, mimeType}
  }}
  signerName="John Doe"
  signerRole="tenant"
  disabled={false}
  width={800}
  height={300}
/>
```

#### SignatureCollection (Modal)

```javascript
<SignatureCollection
  contractId="507f..."
  signatureId="507f..."
  signerName="John Doe"
  signerRole="tenant"
  signerEmail="john@example.com"
  contractDetails={{}}
  onSignatureComplete={result => {}}
  onCancel={() => {}}
  isOpen={true}
/>
```

#### ContractSigningPage (Public Route)

```javascript
// Route: /contracts/sign/:contractId/:token
<Route path="/contracts/sign/:contractId/:token" element={<ContractSigningPage />} />
```

---

### Common Code Snippets

#### Create Signature Request

```javascript
const response = await fetch('/api/signatures/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractId: '507f...',
    signerEmail: 'john@example.com',
    signerRole: 'tenant',
    signerName: 'John Doe',
    signerPhone: '+971501234567',
  }),
});

const { data } = await response.json();
// Use data.signingLink for email
```

#### Get Signature Status

```javascript
const response = await fetch(`/api/signatures/${contractId}/status`);
const { data } = await response.json();
console.log(data);
// { signed: 1, pending: 1, complete: false, ... }
```

#### Batch Create Requests

```javascript
const response = await fetch('/api/signatures/batch/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractId: '507f...',
    signers: [
      { email: 'tenant@ex.com', role: 'tenant', name: 'John', phone: '+971...' },
      { email: 'landlord@ex.com', role: 'landlord', name: 'Jane', phone: '+971...' },
    ],
  }),
});
```

---

### Error Handling

```javascript
try {
  const response = await fetch('/api/signatures/request', options);

  if (!response.ok) {
    const error = await response.json();
    // error.error = "Error message"
    throw new Error(error.error);
  }

  const { success, data } = await response.json();
  if (!success) throw new Error('Request failed');

  return data;
} catch (error) {
  console.error('Error:', error.message);
  // Handle: "Invalid token", "Token expired", "Already signed", etc.
}
```

---

### Database Queries (MongoDB)

```javascript
// Find signature by contract
db.contractsignatures.findOne({ contractId: ObjectId('507f...') });

// Find all pending for user
db.contractsignatures.find({ 'signedBy.email': 'john@example.com', status: 'pending' });

// Get audit trail
db.signatureaudits.find({ contractId: ObjectId('507f...') }).sort({ timestamp: -1 });

// Check if contract fully signed
db.contractsignatures.aggregate([
  { $match: { contractId: ObjectId('507f...') } },
  { $group: { _id: null, signed: { $sum: { $cond: [{ $eq: ['$status', 'signed'] }, 1, 0] } } } },
]);
```

---

### Security Checklist

- ✅ Token validation on every signing request
- ✅ Check token expiration (7 days)
- ✅ Verify one-time use
- ✅ Rate limit check (max 10/hour)
- ✅ SHA256 hash verification
- ✅ Device info logging
- ✅ IP address capture
- ✅ Audit trail creation
- ✅ Input validation
- ✅ Error message sanitization

---

### Response Format

#### Success Response

```json
{
  "success": true,
  "data": {
    // Endpoint-specific data
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

---

### Status Values

| Status      | Meaning               | Transitions To             |
| ----------- | --------------------- | -------------------------- |
| `pending`   | Waiting for signature | signed, expired, cancelled |
| `signed`    | Signature received    | (final)                    |
| `expired`   | Token expired         | (final)                    |
| `cancelled` | Request cancelled     | (final)                    |

---

### Action Types (Audit)

```
request_created       → Initial request created
request_resent        → Token regenerated
request_cancelled     → Request cancelled
signed                → Signature submitted
all_signatures_complete → All parties signed
notification_sent     → Email notification sent
```

---

### Environment Variables

```bash
# Signature Configuration
SIGNATURE_TOKEN_EXPIRY_DAYS=7
SIGNATURE_RATE_LIMIT=10
SIGNATURE_RATE_LIMIT_WINDOW=3600000  # 1 hour in ms

# Email (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password
EMAIL_FROM=noreply@whitecaves.com

# Database
MONGODB_URI=mongodb://...
```

---

### File Locations

```
Backend
├── server/services/SignatureService.js
├── server/models/ContractSignature.js
├── server/models/SignatureToken.js
├── server/models/SignatureAudit.js
└── server/routes/signatures.js

Frontend
├── src/components/SignaturePad.jsx
├── src/components/SignaturePad.css
├── src/components/SignatureCollection.jsx
├── src/components/SignatureCollection.css
├── src/components/ContractSigningPage.jsx
└── src/components/ContractSigningPage.css

Documentation
├── plans/PHASE_2B_ESIGNATURE_COMPLETE.md
├── plans/PHASE_2B_INTEGRATION_GUIDE.md
└── plans/PHASE_2B_SESSION_SUMMARY.md
```

---

### Key Constants

```javascript
// Token expiry
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Rate limiting
const MAX_PAGE_VIEWS = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Hash algorithm
const HASH_ALGORITHM = 'sha256';

// Signature methods
const SIGNATURE_METHODS = ['canvas', 'upload', 'pad'];

// Signer roles
const SIGNER_ROLES = ['tenant', 'landlord', 'agent', 'witness'];

// Status values
const STATUSES = ['pending', 'signed', 'expired', 'cancelled'];
```

---

### Testing Commands

```bash
# Create test request
curl -X POST http://localhost:5000/api/signatures/request \
  -H "Content-Type: application/json" \
  -d '{"contractId":"507f...","signerEmail":"test@ex.com","signerRole":"tenant","signerName":"Test","signerPhone":"+971..."}'

# Get status
curl http://localhost:5000/api/signatures/507f.../status

# Get audit
curl http://localhost:5000/api/signatures/507f.../audit

# Get pending
curl http://localhost:5000/api/signatures/user/test@ex.com/pending
```

---

### Troubleshooting

| Issue                 | Cause             | Solution                   |
| --------------------- | ----------------- | -------------------------- |
| "Invalid token"       | Wrong token       | Copy from email/response   |
| "Token expired"       | > 7 days old      | Request new token (resend) |
| "Already signed"      | Already submitted | Check audit trail          |
| "Rate limit exceeded" | > 10/hour         | Wait 1 hour                |
| Signature not saving  | Network error     | Check console logs         |
| Email not received    | No email service  | Implement EmailService     |

---

### Performance Tips

- Use batch endpoints when creating multiple requests
- Cache signature status if querying frequently
- Use projection to select only needed fields
- Index contractId and token columns
- Consider caching user's pending signatures

---

**For detailed information, see PHASE_2B_ESIGNATURE_COMPLETE.md**

**Ready to integrate? See PHASE_2B_INTEGRATION_GUIDE.md**
