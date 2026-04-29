# Phase 2B Integration Guide

## Quick Setup & Integration

### 1. Import Routes in Main API File

**server/index.js** or **server/api/index.js**:
```javascript
import signatureRoutes from './routes/signatures.js';

// Add this to your Express app
app.use('/api/signatures', signatureRoutes);
```

### 2. Create Signature Requests in ContractGenerator

**src/components/ContractGeneratorPage.jsx**:
```javascript
// After contract is successfully created
const createSignatureRequests = async (contractId, contractData) => {
  try {
    const signers = [
      {
        email: contractData.tenantEmail,
        role: 'tenant',
        name: contractData.tenantName,
        phone: contractData.tenantPhone
      },
      {
        email: contractData.landlordEmail,
        role: 'landlord',
        name: contractData.landlordName,
        phone: contractData.landlordPhone
      }
    ];

    const response = await fetch('/api/signatures/batch/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractId,
        signers
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log('Signature requests created:', result.data.requests);
      // Show success message
      setMessage('Signature requests sent to signers!');
    }
  } catch (error) {
    console.error('Error creating signature requests:', error);
  }
};

// Call this after contract creation
await createSignatureRequests(newContract._id, formData);
```

### 3. Add Public Route for Signing

**In your React Router config** (e.g., App.jsx or main router):
```javascript
import ContractSigningPage from './components/ContractSigningPage';

// Add this route (PUBLIC - no auth required)
<Route path="/contracts/sign/:contractId/:token" element={<ContractSigningPage />} />
```

### 4. Display Pending Signatures in User Profile

**src/components/UserProfile.jsx**:
```javascript
import { useEffect, useState } from 'react';

function UserProfile({ userEmail }) {
  const [pendingSignatures, setPendingSignatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingSignatures = async () => {
      try {
        const response = await fetch(`/api/signatures/user/${userEmail}/pending`);
        const data = await response.json();
        if (data.success) {
          setPendingSignatures(data.data);
        }
      } catch (error) {
        console.error('Error fetching pending signatures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSignatures();
  }, [userEmail]);

  return (
    <div>
      <h3>Pending Signatures</h3>
      {pendingSignatures.length === 0 ? (
        <p>No pending signatures</p>
      ) : (
        <ul>
          {pendingSignatures.map((sig) => (
            <li key={sig._id}>
              <p>Contract: {sig.contractId.contractNumber}</p>
              <p>Expires: {new Date(sig.expiresAt).toLocaleDateString()}</p>
              <a href={`/contracts/sign/${sig.contractId._id}/${sig.token}`}>
                Sign Now →
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserProfile;
```

### 5. Show Signature Status in Contract Details

**src/components/ContractDetail.jsx**:
```javascript
useEffect(() => {
  const fetchSignatureStatus = async () => {
    try {
      const response = await fetch(`/api/signatures/${contractId}/status`);
      const data = await response.json();
      if (data.success) {
        setSignatureStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching signature status:', error);
    }
  };

  fetchSignatureStatus();
}, [contractId]);

return (
  <div>
    {/* Contract details */}
    
    {/* Signature status */}
    {signatureStatus && (
      <div className="signature-status">
        <h4>Signature Status</h4>
        <p>Signed: {signatureStatus.signed}/{signatureStatus.totalRequired}</p>
        
        {signatureStatus.signatures.map((sig) => (
          <div key={sig.id} className="signature-item">
            <p>{sig.signer} ({sig.role})</p>
            <span className={`status-${sig.status}`}>{sig.status}</span>
            {sig.signedAt && <p>Signed: {new Date(sig.signedAt).toLocaleString()}</p>}
          </div>
        ))}

        {!signatureStatus.complete && (
          <button onClick={() => resendRequest()}>
            Resend Signature Request
          </button>
        )}
      </div>
    )}
  </div>
);
```

### 6. Email Template for Signature Requests

When implementing email service:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #B03737, #B8860B); color: white; padding: 20px; border-radius: 8px; }
    .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
    .button { background: linear-gradient(135deg, #B03737, #B8860B); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 20px 0; }
    .footer { color: #999; font-size: 12px; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Contract Signature Required</h1>
    </div>
    
    <div class="content">
      <p>Dear {{signerName}},</p>
      
      <p>You are requested to sign the following contract:</p>
      <p><strong>Contract #{{contractNumber}}</strong></p>
      <p>Property: {{propertyAddress}}</p>
      <p>Lease Period: {{leasePeriod}}</p>
      
      <p>Please click the button below to sign the contract. This link will expire in 7 days.</p>
      
      <a href="{{signingLink}}" class="button">Sign Contract Now</a>
      
      <p>If you cannot click the link, copy and paste this URL in your browser:<br>
      <code>{{signingLink}}</code></p>
      
      <p>Questions? Contact our support team.</p>
    </div>
    
    <div class="footer">
      <p>White Caves Real Estate | Secure Digital Signature</p>
      <p>Expires: {{expirationDate}}</p>
    </div>
  </div>
</body>
</html>
```

### 7. Implement Email Service

Create **server/services/EmailService.js**:
```javascript
import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    // Configure with your email service
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendSignatureRequest(signatureData) {
    const { signerEmail, signerName, signingLink, expirationDate, contractNumber } = signatureData;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: signerEmail,
      subject: `Contract Signature Required: ${contractNumber}`,
      html: this.getEmailTemplate({
        signerName,
        contractNumber,
        signingLink,
        expirationDate
      })
    };

    return this.transporter.sendMail(mailOptions);
  }

  getEmailTemplate(data) {
    // Return HTML template with variables replaced
    return `<!-- Email template HTML -->`;
  }
}

export default new EmailService();
```

### 8. Environment Variables

Add to **.env**:
```
# Email Service (Optional but recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@whitecaves.com

# Signature Settings
SIGNATURE_TOKEN_EXPIRY_DAYS=7
SIGNATURE_RATE_LIMIT=10
SIGNATURE_RATE_LIMIT_WINDOW=3600000
```

---

## Testing Checklist

### 1. API Testing
```bash
# Create signature request
curl -X POST http://localhost:5000/api/signatures/request \
  -H "Content-Type: application/json" \
  -d '{
    "contractId": "YOUR_CONTRACT_ID",
    "signerEmail": "test@example.com",
    "signerRole": "tenant",
    "signerName": "Test User",
    "signerPhone": "+971501234567"
  }'

# Get signature status
curl http://localhost:5000/api/signatures/YOUR_CONTRACT_ID/status

# Get audit trail
curl http://localhost:5000/api/signatures/YOUR_CONTRACT_ID/audit
```

### 2. Manual Workflow Testing
1. ✅ Create contract
2. ✅ Create signature requests
3. ✅ Check email for signing link (or copy from response)
4. ✅ Click signing link
5. ✅ Verify token on signing page
6. ✅ Draw signature
7. ✅ Review & confirm
8. ✅ Submit signature
9. ✅ Verify success page
10. ✅ Check database for saved signature
11. ✅ Check contract status changed to "executed"
12. ✅ Check audit trail has all entries

### 3. Edge Case Testing
- [ ] Expired token
- [ ] Invalid token
- [ ] Already signed
- [ ] Rapid submissions
- [ ] Rate limiting

---

## Debugging

### Check Signature Records
```javascript
// In MongoDB
db.contractsignatures.findOne({ contractId: 'YOUR_CONTRACT_ID' })
```

### Check Audit Trail
```javascript
db.signatureaudits.find({ contractId: 'YOUR_CONTRACT_ID' }).pretty()
```

### Common Issues

**"Invalid signature token"**
- Check token spelling
- Verify token hasn't expired (7 days)
- Verify signature request exists in DB

**"Contract already signed"**
- User already signed this contract
- Check audit trail for timestamp
- Can only resend from admin

**Rate limit error**
- Too many page reloads in 1 hour
- Wait an hour or modify DB rate limit tracking

---

## Next Integration: PDF Generation

After e-signature is working, add PDF generation:

```javascript
// When all signatures are complete, generate PDF
import PDFDocument from 'pdfkit';

async function generateSignedPDF(contractId) {
  const contract = await Contract.findById(contractId).populate('signatures');
  const doc = new PDFDocument();
  
  // Add contract content
  // Add signature images
  // Save to file storage
  
  return filePath;
}
```

---

**Ready to integrate? Let's get started! 🚀**
