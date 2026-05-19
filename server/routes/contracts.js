import express from 'express';
import crypto from 'crypto';
import { Readable } from 'stream';
import { uploadToDrive, createFolder, listFiles } from '../lib/googleDrive.js';
import { Contract, SignatureToken } from '../lib/database.js';
import ContractService from '../services/ContractService.js';
import SignatureService from '../services/SignatureService.js';
import TemplateEngine from '../services/TemplateEngine.js';
import ContractModel from '../models/Contract.js';

const router = express.Router();

// Helper functions
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateContractNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `WC-${year}-${random}`;
}

function normalizeContract(contract) {
  if (!contract) return null;
  const obj = contract.toObject ? contract.toObject() : contract;
  if (obj._id && !obj.id) {
    obj.id = obj._id.toString();
  }
  return obj;
}

function generateContractHtml(data) {
  const formatDate = dateString => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-AE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  const formatCurrency = amount => {
    if (!amount) return '-';
    return `AED ${Number(amount).toLocaleString()}`;
  };

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ejari Unified Tenancy Contract - ${data.contractNumber}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 30px; color: #333; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #D4AF37; padding-bottom: 20px; margin-bottom: 25px; }
    .logo h2 { color: #1a1a2e; margin: 0; font-size: 24px; }
    .logo p { color: #666; margin: 5px 0 0; font-size: 13px; }
    .contract-meta { text-align: right; }
    .contract-number { color: #666; font-size: 13px; margin-bottom: 5px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 15px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .status.fully_signed { background: #d4edda; color: #155724; }
    .status.partially_signed { background: #fff3cd; color: #856404; }
    .status.draft { background: #e9ecef; color: #495057; }
    h1 { text-align: center; margin: 20px 0 5px; font-size: 22px; color: #1a1a2e; }
    .subtitle { text-align: center; color: #666; margin-bottom: 25px; font-size: 14px; }
    .section { background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .section-title { display: flex; justify-content: space-between; color: #D4AF37; font-size: 14px; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .field { background: #fff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 10px 12px; }
    .field-label { display: flex; justify-content: space-between; font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 4px; }
    .field-value { font-size: 14px; font-weight: 500; color: #333; min-height: 20px; }
    .signatures-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 15px; }
    .sig-box { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; text-align: center; }
    .sig-box h4 { color: #666; margin: 0 0 15px; font-size: 13px; }
    .sig-content { min-height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .sig-box img { max-width: 180px; max-height: 70px; }
    .sig-name { font-weight: 600; margin-top: 10px; font-size: 14px; }
    .sig-date { font-size: 11px; color: #888; margin-top: 4px; }
    .pending { color: #999; font-style: italic; font-size: 13px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; }
    .footer p { margin: 5px 0; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo"><h2>White Caves Real Estate LLC</h2><p>Licensed Real Estate Brokerage - Dubai, UAE</p></div>
    <div class="contract-meta"><div class="contract-number">Contract #${data.contractNumber}</div><span class="status ${data.status}">${(data.status || 'draft').replace('_', ' ')}</span></div>
  </div>
  <h1>EJARI UNIFIED TENANCY CONTRACT</h1>
  <p class="subtitle">عقد الإيجار الموحد - إيجاري</p>
  <div class="section">
    <div class="section-title"><span>Owner / Lessor Information</span><span>معلومات المالك / المؤجر</span></div>
    <div class="grid">
      <div class="field"><div class="field-label"><span>Owner's Name</span></div><div class="field-value">${data.ownerName || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Lessor's Name</span></div><div class="field-value">${data.lessorName || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Emirates ID</span></div><div class="field-value">${data.lessorEmiratesId || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Email</span></div><div class="field-value">${data.lessorEmail || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Phone</span></div><div class="field-value">${data.lessorPhone || '-'}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><span>Tenant Information</span><span>معلومات المستأجر</span></div>
    <div class="grid">
      <div class="field"><div class="field-label"><span>Tenant's Name</span></div><div class="field-value">${data.tenantName || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Emirates ID</span></div><div class="field-value">${data.tenantEmiratesId || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Email</span></div><div class="field-value">${data.tenantEmail || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Phone</span></div><div class="field-value">${data.tenantPhone || '-'}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><span>Property Information</span><span>معلومات العقار</span></div>
    <div class="grid">
      <div class="field"><div class="field-label"><span>Property Usage</span></div><div class="field-value">${data.propertyUsage || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Building Name</span></div><div class="field-value">${data.buildingName || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Property Type</span></div><div class="field-value">${data.propertyType || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Location</span></div><div class="field-value">${data.location || '-'}</div></div>
      <div class="field"><div class="field-label"><span>Property Area</span></div><div class="field-value">${data.propertyArea ? data.propertyArea + ' sq.m' : '-'}</div></div>
      <div class="field"><div class="field-label"><span>DEWA Premises No.</span></div><div class="field-value">${data.premisesNo || '-'}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><span>Contract Information</span><span>معلومات العقد</span></div>
    <div class="grid">
      <div class="field"><div class="field-label"><span>Contract Period</span></div><div class="field-value">${formatDate(data.contractPeriodFrom)} - ${formatDate(data.contractPeriodTo)}</div></div>
      <div class="field"><div class="field-label"><span>Annual Rent</span></div><div class="field-value">${formatCurrency(data.annualRent)}</div></div>
      <div class="field"><div class="field-label"><span>Security Deposit</span></div><div class="field-value">${formatCurrency(data.securityDeposit)}</div></div>
      <div class="field"><div class="field-label"><span>Payment Mode</span></div><div class="field-value">${data.modeOfPayment || '-'}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><span>Signatures</span><span>التوقيعات</span></div>
    <div class="signatures-grid">
      <div class="sig-box"><h4>Tenant | المستأجر</h4><div class="sig-content">${data.signatures?.tenant ? `<img src="${data.signatures.tenant.signature}" alt="Signature" /><div class="sig-name">${data.signatures.tenant.signerName || data.tenantName}</div><div class="sig-date">${formatDate(data.signatures.tenant.signedAt)}</div>` : '<div class="pending">Pending</div>'}</div></div>
      <div class="sig-box"><h4>Lessor | المؤجر</h4><div class="sig-content">${data.signatures?.lessor ? `<img src="${data.signatures.lessor.signature}" alt="Signature" /><div class="sig-name">${data.signatures.lessor.signerName || data.lessorName}</div><div class="sig-date">${formatDate(data.signatures.lessor.signedAt)}</div>` : '<div class="pending">Pending</div>'}</div></div>
    </div>
    <div style="margin-top:15px;"><div class="sig-box"><h4>Broker | الوسيط</h4><div class="sig-content">${data.signatures?.broker ? `<img src="${data.signatures.broker.signature}" alt="Signature" /><div class="sig-name">${data.signatures.broker.signerName || data.brokerName}</div><div class="sig-date">${formatDate(data.signatures.broker.signedAt)}</div>` : '<div class="pending">Pending</div>'}</div></div></div>
  </div>
  <div class="footer"><p><strong>White Caves Real Estate LLC</strong></p><p>admin@whitecaves.com | Dubai, UAE</p><p>Generated on ${formatDate(new Date())}</p></div>
</body>
</html>`;
}

// Routes
router.get('/', async (req, res) => {
  try {
    const useDatabase = req.app.locals.useDatabase;
    if (useDatabase) {
      const contracts = await Contract.find().sort({ createdAt: -1 });
      return res.json({ success: true, contracts: contracts.map(normalizeContract) });
    }
    const contracts = req.app.locals.loadContracts();
    res.json({ success: true, contracts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const useDatabase = req.app.locals.useDatabase;
    if (useDatabase) {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }
      return res.json({ success: true, contract: normalizeContract(contract) });
    }
    const contracts = req.app.locals.loadContracts();
    const contract = contracts.find(c => c.id === req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    res.json({ success: true, contract });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const useDatabase = req.app.locals.useDatabase;
    const contractData = req.body;
    const contractNumber = generateContractNumber();

    if (useDatabase) {
      const newContract = new Contract({
        ...contractData,
        contractNumber,
        status: 'draft',
        signatures: { lessor: null, tenant: null, broker: null },
        signatureLinks: { lessor: null, tenant: null },
      });
      await newContract.save();
      return res.json({ success: true, contract: normalizeContract(newContract) });
    }

    const contracts = req.app.locals.loadContracts();
    const newContract = {
      id: crypto.randomUUID(),
      contractNumber,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...contractData,
      signatures: { lessor: null, tenant: null, broker: null },
      signatureLinks: { lessor: null, tenant: null },
    };

    contracts.unshift(newContract);
    req.app.locals.saveContracts(contracts);
    res.json({ success: true, contract: newContract });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const useDatabase = req.app.locals.useDatabase;
    if (useDatabase) {
      const contract = await Contract.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }
      return res.json({ success: true, contract: normalizeContract(contract) });
    }

    const contracts = req.app.locals.loadContracts();
    const index = contracts.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    contracts[index] = { ...contracts[index], ...req.body, updatedAt: new Date().toISOString() };
    req.app.locals.saveContracts(contracts);
    res.json({ success: true, contract: contracts[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/generate-signature-link', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['lessor', 'tenant'].includes(role)) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid role. Must be lessor or tenant.' });
    }

    const useDatabase = req.app.locals.useDatabase;
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
    const baseUrl = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'http://localhost:5000';
    const signatureLink = `${baseUrl}/sign/${token}`;

    if (useDatabase) {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }

      const signatureToken = new SignatureToken({
        token,
        contractId: contract._id,
        role,
        expiresAt,
      });
      await signatureToken.save();

      contract.signatureLinks[role] = {
        token,
        link: signatureLink,
        expiresAt,
        createdAt: new Date(),
      };
      await contract.save();

      return res.json({ success: true, signatureLink, expiresAt, role });
    }

    const contracts = req.app.locals.loadContracts();
    const contract = contracts.find(c => c.id === req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }

    const tokens = req.app.locals.loadTokens();
    tokens[token] = {
      contractId: contract.id,
      role,
      expiresAt: expiresAt.toISOString(),
      used: false,
      createdAt: new Date().toISOString(),
    };
    req.app.locals.saveTokens(tokens);

    const contractIndex = contracts.findIndex(c => c.id === req.params.id);
    contracts[contractIndex].signatureLinks[role] = {
      token,
      link: signatureLink,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };
    req.app.locals.saveContracts(contracts);

    res.json({ success: true, signatureLink, expiresAt, role });
  } catch (error) {
    console.error('Error generating signature link:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/broker-sign', async (req, res) => {
  try {
    const { signature, signerName } = req.body;
    if (!signature) {
      return res.status(400).json({ success: false, error: 'Signature is required' });
    }

    const useDatabase = req.app.locals.useDatabase;
    if (useDatabase) {
      const contract = await Contract.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ success: false, error: 'Contract not found' });
      }
      contract.signatures.broker = { signature, signerName, signedAt: new Date() };
      await contract.save();
      return res.json({ success: true, message: 'Broker signature added successfully' });
    }

    const contracts = req.app.locals.loadContracts();
    const contractIndex = contracts.findIndex(c => c.id === req.params.id);
    if (contractIndex === -1) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    contracts[contractIndex].signatures.broker = {
      signature,
      signerName,
      signedAt: new Date().toISOString(),
    };
    contracts[contractIndex].updatedAt = new Date().toISOString();
    req.app.locals.saveContracts(contracts);
    res.json({ success: true, message: 'Broker signature added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/upload-to-drive', async (req, res) => {
  try {
    const contractData = req.body;
    const contractHtml = generateContractHtml(contractData);
    const fileName = `TenancyContract_${contractData.contractNumber}_${Date.now()}.html`;
    const htmlStream = Readable.from([contractHtml]);
    const result = await uploadToDrive(fileName, htmlStream, 'text/html');

    const useDatabase = req.app.locals.useDatabase;
    if (useDatabase && contractData._id) {
      await Contract.findByIdAndUpdate(contractData._id, {
        driveFileId: result.id,
        driveWebViewLink: result.webViewLink,
      });
    }

    res.json({
      success: true,
      fileId: result.id,
      fileName: result.name,
      webViewLink: result.webViewLink,
    });
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    res
      .status(500)
      .json({
        success: false,
        error: error.message || 'Failed to upload contract to Google Drive',
      });
  }
});

/**
 * NEW STEP 5 ENDPOINTS
 * Contract Generation & E-Signature
 */

// POST /api/contracts/from-template
// Create a contract from a template
router.post('/from-template', async (req, res) => {
  try {
    const { templateId, templateData, partyData } = req.body;

    if (!templateId || !templateData || !partyData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: templateId, templateData, partyData',
      });
    }

    const contract = await ContractService.createFromTemplate(templateId, templateData, partyData);

    res.status(201).json({
      success: true,
      contractId: contract._id,
      contractNumber: contract.contractNumber,
      status: contract.status,
      message: 'Contract created from template',
    });
  } catch (error) {
    console.error('Error creating contract from template:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create contract',
    });
  }
});

// POST /api/contracts/:id/generate-pdf
// Generate PDF for a contract
router.post('/:id/generate-pdf', async (req, res) => {
  try {
    const { id } = req.params;

    const pdfBytes = await ContractService.generatePDF(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="contract-${id}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate PDF',
    });
  }
});

// POST /api/contracts/:id/request-signature
// Request signature from a party
router.post('/:id/request-signature', async (req, res) => {
  try {
    const { id } = req.params;
    const { signerEmail, signerName, signerRole, method } = req.body;

    if (!signerEmail || !signerName || !signerRole) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: signerEmail, signerName, signerRole',
      });
    }

    const result = await ContractService.requestSignature(id, {
      email: signerEmail,
      name: signerName,
      role: signerRole,
      method: method || 'canvas',
    });

    try {
      const { sendEmailTracked, wrapInBrandedTemplate } =
        await import('../services/emailService.js');
      const html = wrapInBrandedTemplate(
        `
          <h2>Signature Request Ready</h2>
          <p>Hello ${signerName}, your signature is requested for contract <strong>${id}</strong>.</p>
          <p>Please open the secure signing link below to review and sign the document.</p>
          <p><a class="cta" href="${result.signingLink}">Review & Sign Contract</a></p>
          <p>If the button does not work, copy and paste this URL into your browser:</p>
          <p><a href="${result.signingLink}">${result.signingLink}</a></p>
        `,
        { preheader: `Signature request for contract ${id}` }
      );

      await sendEmailTracked({
        to: signerEmail,
        subject: `Signature Request: Contract ${id}`,
        html,
        text: `Hello ${signerName}, your signature is requested for contract ${id}. Review and sign: ${result.signingLink}`,
        tags: [
          { name: 'type', value: 'contract_signature_request' },
          { name: 'contractId', value: String(id) },
          { name: 'signerRole', value: signerRole },
        ],
      });
    } catch (emailError) {
      console.error('Failed to send signature request email:', emailError);
    }

    res.json({
      success: true,
      signatureId: result.signatureId,
      signingLink: result.signingLink,
      expiresAt: result.expiresAt,
      message: 'Signature request created',
    });
  } catch (error) {
    console.error('Error requesting signature:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to request signature',
    });
  }
});

// POST /api/contracts/:id/sign
// Record a signature
router.post('/:id/sign', async (req, res) => {
  try {
    const { id } = req.params;
    const { signatureId, signatureData } = req.body;

    if (!signatureId || !signatureData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: signatureId, signatureData',
      });
    }

    const contract = await ContractService.recordSignature(id, signatureId, signatureData);

    res.json({
      success: true,
      contractId: contract._id,
      status: contract.status,
      message: 'Signature recorded successfully',
    });
  } catch (error) {
    console.error('Error recording signature:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to record signature',
    });
  }
});

// GET /api/contracts/:id/signature-status
// Get signature status
router.get('/:id/signature-status', async (req, res) => {
  try {
    const { id } = req.params;

    const status = await ContractService.getSignatureStatus(id);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Error getting signature status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get signature status',
    });
  }
});

// POST /api/contracts/:id/archive
// Archive/finalize a contract
router.post('/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await ContractService.archiveContract(id);

    res.json({
      success: true,
      contractId: contract._id,
      status: contract.status,
      executionDate: contract.executionDate,
      message: 'Contract archived and finalized',
    });
  } catch (error) {
    console.error('Error archiving contract:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to archive contract',
    });
  }
});

// GET /api/contracts/:id/details
// Get contract with all details
router.get('/:id/details', async (req, res) => {
  try {
    const { id } = req.params;

    const details = await ContractService.getContractDetails(id);

    res.json({
      success: true,
      data: details,
    });
  } catch (error) {
    console.error('Error getting contract details:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get contract details',
    });
  }
});

// GET /api/contracts/:id/versions
// Get contract version history
router.get('/:id/versions', async (req, res) => {
  try {
    const { id } = req.params;

    const versions = await ContractService.getContractVersions(id);

    res.json({
      success: true,
      data: versions,
      count: versions.length,
    });
  } catch (error) {
    console.error('Error getting contract versions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get versions',
    });
  }
});

// POST /api/contracts/from-template/validate
// Validate template data before creating contract
router.post('/from-template/validate', async (req, res) => {
  try {
    const { templateId, data } = req.body;

    if (!templateId || !data) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: templateId, data',
      });
    }

    const result = await TemplateEngine.createWithValidation(templateId, data);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error validating template:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Template validation failed',
    });
  }
});

// GET /api/contract-templates
// List available templates
router.get('/', async (req, res) => {
  try {
    const templates = await TemplateEngine.getAvailableTemplates();

    res.json({
      success: true,
      data: templates,
      count: templates.length,
    });
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get templates',
    });
  }
});

export default router;
