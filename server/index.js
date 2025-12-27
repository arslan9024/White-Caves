import express from 'express';
import cors from 'cors';
import { Readable } from 'stream';
import { uploadToDrive, createFolder, listFiles } from './lib/googleDrive.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/contracts/upload-to-drive', async (req, res) => {
  try {
    const contractData = req.body;
    
    const contractHtml = generateContractHtml(contractData);
    
    const fileName = `TenancyContract_${contractData.contractNumber}_${Date.now()}.html`;
    
    const htmlStream = Readable.from([contractHtml]);
    
    const result = await uploadToDrive(fileName, htmlStream, 'text/html');
    
    res.json({
      success: true,
      fileId: result.id,
      fileName: result.name,
      webViewLink: result.webViewLink
    });
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to upload contract to Google Drive' 
    });
  }
});

app.get('/api/drive/files', async (req, res) => {
  try {
    const { folderId } = req.query;
    const files = await listFiles(folderId || null);
    res.json({ success: true, files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/drive/create-folder', async (req, res) => {
  try {
    const { folderName, parentFolderId } = req.body;
    const result = await createFolder(folderName, parentFolderId);
    res.json({ success: true, folder: result });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

function generateContractHtml(data) {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `AED ${Number(amount).toLocaleString()}`;
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tenancy Contract - ${data.contractNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
    .logo h2 { color: #0a0a0f; margin: 0; }
    .logo p { color: #666; margin: 5px 0 0; font-size: 14px; }
    .contract-number { color: #666; font-size: 14px; }
    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .status.fully_signed { background: #d4edda; color: #155724; }
    .status.partially_signed { background: #fff3cd; color: #856404; }
    .status.draft { background: #f0f0f0; color: #666; }
    h1 { text-align: center; margin: 30px 0 10px; }
    .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
    .section { margin-bottom: 25px; }
    .section h3 { color: #D4AF37; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .item label { display: block; font-size: 11px; color: #999; text-transform: uppercase; }
    .item span { font-size: 14px; font-weight: 500; }
    .terms ol { padding-left: 20px; font-size: 13px; line-height: 1.8; color: #555; }
    .signatures { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 30px; }
    .sig-box { border: 1px solid #eee; padding: 20px; text-align: center; border-radius: 8px; }
    .sig-box h4 { color: #666; margin: 0 0 15px; font-size: 14px; }
    .sig-box img { max-width: 150px; max-height: 60px; }
    .sig-box .name { font-weight: 600; margin-top: 10px; }
    .sig-box .date { font-size: 12px; color: #999; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <h2>White Caves Real Estate LLC</h2>
      <p>Licensed Real Estate Brokerage</p>
    </div>
    <div>
      <div class="contract-number">Contract #${data.contractNumber}</div>
      <span class="status ${data.status}">${data.status.replace('_', ' ').toUpperCase()}</span>
    </div>
  </div>

  <h1>TENANCY CONTRACT</h1>
  <p class="subtitle">Residential Property Lease Agreement</p>

  <div class="section">
    <h3>Property Details</h3>
    <div class="grid">
      <div class="item"><label>Property Address</label><span>${data.propertyAddress || '-'}</span></div>
      <div class="item"><label>Property Type</label><span>${data.propertyType || '-'}</span></div>
    </div>
  </div>

  <div class="section">
    <h3>Landlord Information</h3>
    <div class="grid">
      <div class="item"><label>Full Name</label><span>${data.landlordName || '-'}</span></div>
      <div class="item"><label>Emirates ID</label><span>${data.landlordEmirates || '-'}</span></div>
      <div class="item"><label>Email</label><span>${data.landlordEmail || '-'}</span></div>
      <div class="item"><label>Phone</label><span>${data.landlordPhone || '-'}</span></div>
    </div>
  </div>

  <div class="section">
    <h3>Tenant Information</h3>
    <div class="grid">
      <div class="item"><label>Full Name</label><span>${data.tenantName || '-'}</span></div>
      <div class="item"><label>Emirates ID</label><span>${data.tenantEmirates || '-'}</span></div>
      <div class="item"><label>Email</label><span>${data.tenantEmail || '-'}</span></div>
      <div class="item"><label>Phone</label><span>${data.tenantPhone || '-'}</span></div>
    </div>
  </div>

  <div class="section">
    <h3>Lease Terms</h3>
    <div class="grid">
      <div class="item"><label>Start Date</label><span>${formatDate(data.startDate)}</span></div>
      <div class="item"><label>End Date</label><span>${formatDate(data.endDate)}</span></div>
      <div class="item"><label>Annual Rent</label><span>${formatCurrency(data.rentAmount)}</span></div>
      <div class="item"><label>Security Deposit</label><span>${formatCurrency(data.securityDeposit)}</span></div>
      <div class="item"><label>Payment Frequency</label><span>${data.paymentFrequency || '-'}</span></div>
      <div class="item"><label>Number of Cheques</label><span>${data.numberOfCheques || '-'}</span></div>
    </div>
  </div>

  <div class="section terms">
    <h3>Terms and Conditions</h3>
    <ol>
      <li>The Tenant agrees to pay the rent on time as per the agreed payment schedule.</li>
      <li>The Tenant shall maintain the property in good condition throughout the lease period.</li>
      <li>The Landlord shall ensure the property is habitable and all utilities are functional.</li>
      <li>Either party must provide 90 days written notice before terminating the lease.</li>
      <li>The security deposit shall be refunded within 30 days of lease termination, subject to property inspection.</li>
      <li>Subletting is not permitted without written consent from the Landlord.</li>
      <li>Any disputes shall be resolved under UAE law and Dubai courts jurisdiction.</li>
    </ol>
  </div>

  <div class="section">
    <h3>Broker Information</h3>
    <div class="grid">
      <div class="item"><label>Broker Name</label><span>${data.brokerName || '-'}</span></div>
      <div class="item"><label>License Number</label><span>${data.brokerLicense || '-'}</span></div>
    </div>
  </div>

  <div class="section">
    <h3>Signatures</h3>
    <div class="signatures">
      <div class="sig-box">
        <h4>Landlord</h4>
        ${data.signatures?.landlord ? `
          <img src="${data.signatures.landlord.signature}" alt="Landlord Signature" />
          <div class="name">${data.signatures.landlord.signerName}</div>
          <div class="date">${formatDate(data.signatures.landlord.timestamp)}</div>
        ` : '<div style="color:#999;min-height:60px;display:flex;align-items:center;justify-content:center;">Pending Signature</div>'}
      </div>
      <div class="sig-box">
        <h4>Tenant</h4>
        ${data.signatures?.tenant ? `
          <img src="${data.signatures.tenant.signature}" alt="Tenant Signature" />
          <div class="name">${data.signatures.tenant.signerName}</div>
          <div class="date">${formatDate(data.signatures.tenant.timestamp)}</div>
        ` : '<div style="color:#999;min-height:60px;display:flex;align-items:center;justify-content:center;">Pending Signature</div>'}
      </div>
    </div>
    <div class="signatures" style="margin-top:15px;">
      <div class="sig-box" style="grid-column:1/-1;">
        <h4>Broker / Agent</h4>
        ${data.signatures?.broker ? `
          <img src="${data.signatures.broker.signature}" alt="Broker Signature" />
          <div class="name">${data.signatures.broker.signerName}</div>
          <div class="date">${formatDate(data.signatures.broker.timestamp)}</div>
        ` : '<div style="color:#999;min-height:60px;display:flex;align-items:center;justify-content:center;">Pending Signature</div>'}
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This contract is prepared by White Caves Real Estate LLC</p>
    <p>admin@whitecaves.com | Dubai, UAE</p>
    <p>Generated on ${new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
  </div>
</body>
</html>
  `;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
