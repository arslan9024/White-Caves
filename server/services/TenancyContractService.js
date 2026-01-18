const PDFDocument = require('pdfkit');
const { PDFPage } = require('pdf-lib');
const pdfLib = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const TenancyContract = require('../models/TenancyContract');
const NotificationService = require('./NotificationService');
const admin = require('firebase-admin');

class TenancyContractService {
  /**
   * Create a draft tenancy contract
   */
  async createDraft(agentId, formData) {
    try {
      const contract = new TenancyContract({
        agentId,
        status: 'Draft',
        propertyInfo: formData.propertyInfo,
        landlordInfo: formData.landlordInfo,
        tenantInfo: formData.tenantInfo,
        contactDetails: formData.contactDetails,
        tenancyTerms: formData.tenancyTerms,
        createdBy: agentId
      });

      await contract.save();
      await this._addAuditEntry(contract._id, 'Draft Created', agentId, 'Contract draft created via form', '');

      return {
        success: true,
        contractId: contract._id,
        referenceNumber: contract.referenceNumber,
        message: 'Draft contract created successfully'
      };
    } catch (error) {
      throw new Error(`Error creating draft: ${error.message}`);
    }
  }

  /**
   * Update draft contract
   */
  async updateDraft(contractId, updatedData) {
    try {
      const contract = await TenancyContract.findById(contractId);
      if (!contract) throw new Error('Contract not found');

      // Update only draft contracts
      if (contract.status !== 'Draft') {
        throw new Error('Only draft contracts can be updated');
      }

      // Update each section
      if (updatedData.propertyInfo) contract.propertyInfo = updatedData.propertyInfo;
      if (updatedData.landlordInfo) contract.landlordInfo = updatedData.landlordInfo;
      if (updatedData.tenantInfo) contract.tenantInfo = updatedData.tenantInfo;
      if (updatedData.contactDetails) contract.contactDetails = updatedData.contactDetails;
      if (updatedData.tenancyTerms) contract.tenancyTerms = updatedData.tenancyTerms;

      await contract.save();
      return { success: true, message: 'Contract updated successfully' };
    } catch (error) {
      throw new Error(`Error updating draft: ${error.message}`);
    }
  }

  /**
   * Validate all required fields before PDF generation
   */
  validateFormData(contract) {
    const errors = [];

    // Property validation
    if (!contract.propertyInfo?.description) errors.push('Property description is required');
    if (!contract.propertyInfo?.address) errors.push('Property address is required');
    if (!contract.propertyInfo?.unitArea) errors.push('Unit area is required');

    // Landlord validation
    if (!contract.landlordInfo?.name) errors.push('Landlord name is required');
    if (!contract.landlordInfo?.emiratesId && !contract.landlordInfo?.passportNumber) {
      errors.push('Landlord Emirates ID or Passport is required');
    }
    if (!contract.landlordInfo?.email) errors.push('Landlord email is required');

    // Tenant validation
    if (!contract.tenantInfo?.name) errors.push('Tenant name is required');
    if (!contract.tenantInfo?.emiratesId && !contract.tenantInfo?.passportNumber) {
      errors.push('Tenant Emirates ID or Passport is required');
    }
    if (!contract.tenantInfo?.email) errors.push('Tenant email is required');

    // Tenancy terms validation
    if (!contract.tenancyTerms?.leaseStartDate) errors.push('Lease start date is required');
    if (!contract.tenancyTerms?.leaseEndDate) errors.push('Lease end date is required');
    if (!contract.tenancyTerms?.rentAmount) errors.push('Rent amount is required');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate PDF from EJARI template
   */
  async generatePDF(contractId, agentId) {
    try {
      const contract = await TenancyContract.findById(contractId);
      if (!contract) throw new Error('Contract not found');

      // Validate all required fields
      const validation = this.validateFormData(contract);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Load template from file system or remote URL
      const templatePath = path.join(__dirname, '../templates/ejari-template.pdf');
      
      // If template doesn't exist, create a new PDF from scratch
      let pdfBuffer;
      if (!fs.existsSync(templatePath)) {
        pdfBuffer = await this._createPDFFromScratch(contract);
      } else {
        pdfBuffer = await this._fillEJARITemplate(templatePath, contract);
      }

      // Upload to Firebase Storage
      const fileName = `tenancy-contracts/${contract.referenceNumber}-${Date.now()}.pdf`;
      const pdfUrl = await this._uploadPdfToFirebase(pdfBuffer, fileName);

      // Calculate document hash for verification
      const documentHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');

      // Update contract with PDF information
      contract.pdfDocument = {
        generatedAt: new Date(),
        pdfUrl,
        fileName,
        fileSize: pdfBuffer.length,
        documentHash
      };
      contract.status = 'Generated';
      await contract.save();

      await this._addAuditEntry(contractId, 'PDF Generated', agentId, 'Contract PDF generated successfully', '');

      return {
        success: true,
        pdfUrl,
        fileName,
        contractId: contract._id,
        referenceNumber: contract.referenceNumber
      };
    } catch (error) {
      throw new Error(`Error generating PDF: ${error.message}`);
    }
  }

  /**
   * Create PDF from scratch (when no template available)
   */
  async _createPDFFromScratch(contract) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(20).text('TENANCY AGREEMENT', { align: 'center' });
        doc.fontSize(12).text(`Reference: ${contract.referenceNumber}`, { align: 'center' });
        doc.moveDown();

        // Property Section
        doc.fontSize(14).text('PROPERTY INFORMATION', { underline: true });
        doc.fontSize(10);
        doc.text(`Description: ${contract.propertyInfo?.description || 'N/A'}`);
        doc.text(`Address: ${contract.propertyInfo?.address || 'N/A'}`);
        doc.text(`City: ${contract.propertyInfo?.city || 'N/A'}`);
        doc.text(`Area: ${contract.propertyInfo?.unitArea || 'N/A'} sq.ft.`);
        doc.text(`Type: ${contract.propertyInfo?.propertyType || 'N/A'}`);
        doc.moveDown();

        // Landlord Section
        doc.fontSize(14).text('LANDLORD INFORMATION', { underline: true });
        doc.fontSize(10);
        doc.text(`Name: ${contract.landlordInfo?.name || 'N/A'}`);
        doc.text(`ID: ${contract.landlordInfo?.emiratesId || contract.landlordInfo?.passportNumber || 'N/A'}`);
        doc.text(`Email: ${contract.landlordInfo?.email || 'N/A'}`);
        doc.text(`Phone: ${contract.landlordInfo?.phone || 'N/A'}`);
        doc.moveDown();

        // Tenant Section
        doc.fontSize(14).text('TENANT INFORMATION', { underline: true });
        doc.fontSize(10);
        doc.text(`Name: ${contract.tenantInfo?.name || 'N/A'}`);
        doc.text(`ID: ${contract.tenantInfo?.emiratesId || contract.tenantInfo?.passportNumber || 'N/A'}`);
        doc.text(`Email: ${contract.tenantInfo?.email || 'N/A'}`);
        doc.text(`Phone: ${contract.tenantInfo?.phone || 'N/A'}`);
        doc.moveDown();

        // Tenancy Terms
        doc.fontSize(14).text('TENANCY TERMS', { underline: true });
        doc.fontSize(10);
        const startDate = contract.tenancyTerms?.leaseStartDate ? new Date(contract.tenancyTerms.leaseStartDate).toLocaleDateString() : 'N/A';
        const endDate = contract.tenancyTerms?.leaseEndDate ? new Date(contract.tenancyTerms.leaseEndDate).toLocaleDateString() : 'N/A';
        doc.text(`Lease Period: ${startDate} to ${endDate}`);
        doc.text(`Duration: ${contract.tenancyTerms?.leasePeriodMonths || 'N/A'} months`);
        doc.text(`Monthly Rent: AED ${contract.tenancyTerms?.rentAmount || 'N/A'}`);
        doc.text(`Security Deposit: AED ${contract.tenancyTerms?.securityDeposit || 'N/A'}`);
        doc.text(`Payment Method: ${contract.tenancyTerms?.paymentMethod || 'N/A'}`);
        doc.moveDown();

        // Signature section
        doc.fontSize(14).text('SIGNATURES', { underline: true });
        doc.fontSize(10).moveDown();
        doc.text('Landlord Signature: ___________________     Date: ___________');
        doc.moveDown();
        doc.text('Tenant Signature: ___________________     Date: ___________');

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Fill EJARI template with form data
   */
  async _fillEJARITemplate(templatePath, contract) {
    try {
      const existingPdfBytes = fs.readFileSync(templatePath);
      const pdfDoc = await pdfLib.PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();

      // Map contract data to PDF fields
      // These field names should match your EJARI template
      const fieldMappings = {
        // Property fields
        'property_description': contract.propertyInfo?.description,
        'property_address': contract.propertyInfo?.address,
        'property_city': contract.propertyInfo?.city,
        'property_area': contract.propertyInfo?.unitArea?.toString(),
        'property_type': contract.propertyInfo?.propertyType,

        // Landlord fields
        'landlord_name': contract.landlordInfo?.name,
        'landlord_id': contract.landlordInfo?.emiratesId || contract.landlordInfo?.passportNumber,
        'landlord_email': contract.landlordInfo?.email,
        'landlord_phone': contract.landlordInfo?.phone,

        // Tenant fields
        'tenant_name': contract.tenantInfo?.name,
        'tenant_id': contract.tenantInfo?.emiratesId || contract.tenantInfo?.passportNumber,
        'tenant_email': contract.tenantInfo?.email,
        'tenant_phone': contract.tenantInfo?.phone,

        // Terms fields
        'lease_start_date': contract.tenancyTerms?.leaseStartDate?.toLocaleDateString(),
        'lease_end_date': contract.tenancyTerms?.leaseEndDate?.toLocaleDateString(),
        'rent_amount': contract.tenancyTerms?.rentAmount?.toString(),
        'security_deposit': contract.tenancyTerms?.securityDeposit?.toString()
      };

      // Fill form fields
      Object.entries(fieldMappings).forEach(([fieldName, value]) => {
        try {
          const field = form.getField(fieldName);
          if (field && value) {
            field.setText(String(value));
          }
        } catch (e) {
          // Field might not exist in template, skip
        }
      });

      // Flatten form (make it non-editable)
      form.flatten();

      // Save to buffer
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Error filling EJARI template:', error);
      // Fall back to creating from scratch
      return this._createPDFFromScratch(contract);
    }
  }

  /**
   * Upload PDF to Firebase Storage
   */
  async _uploadPdfToFirebase(pdfBuffer, fileName) {
    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(fileName);

      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf'
        }
      });

      // Get public URL
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year
      });

      return url;
    } catch (error) {
      throw new Error(`Error uploading to Firebase: ${error.message}`);
    }
  }

  /**
   * Request signatures from landlord and tenant
   */
  async requestSignatures(contractId, agentId) {
    try {
      const contract = await TenancyContract.findById(contractId);
      if (!contract) throw new Error('Contract not found');

      if (!contract.pdfDocument?.pdfUrl) {
        throw new Error('PDF must be generated before requesting signatures');
      }

      // Generate unique tokens for each party
      const landlordToken = crypto.randomBytes(32).toString('hex');
      const tenantToken = crypto.randomBytes(32).toString('hex');

      // Store tokens in database
      contract.signatures.landlordSignature.signatureToken = landlordToken;
      contract.signatures.tenantSignature.signatureToken = tenantToken;
      contract.status = 'AwaitingSignatures';

      await contract.save();

      // Send signature request emails
      const signatureBaseUrl = process.env.BASE_URL || 'http://localhost:5173';
      const landlordSignUrl = `${signatureBaseUrl}/tenancy-sign/${landlordToken}`;
      const tenantSignUrl = `${signatureBaseUrl}/tenancy-sign/${tenantToken}`;

      // Notify landlord
      await NotificationService.sendEmail(
        contract.landlordInfo?.email,
        'Tenancy Agreement Signature Required',
        this._getSignatureEmailTemplate('Landlord', contract, landlordSignUrl)
      );

      // Notify tenant
      await NotificationService.sendEmail(
        contract.tenantInfo?.email,
        'Tenancy Agreement Signature Required',
        this._getSignatureEmailTemplate('Tenant', contract, tenantSignUrl)
      );

      // Also send via WhatsApp if phone available
      if (contract.landlordInfo?.mobileNumber) {
        await NotificationService.sendWhatsApp(
          contract.landlordInfo.mobileNumber,
          `Dear ${contract.landlordInfo?.name}, please sign your tenancy agreement here: ${landlordSignUrl}`
        );
      }

      if (contract.tenantInfo?.mobileNumber) {
        await NotificationService.sendWhatsApp(
          contract.tenantInfo?.mobileNumber,
          `Dear ${contract.tenantInfo?.name}, please sign your tenancy agreement here: ${tenantSignUrl}`
        );
      }

      await this._addAuditEntry(contractId, 'Signature Requests Sent', agentId, 'Signature links sent to both parties', '');

      return {
        success: true,
        message: 'Signature requests sent successfully',
        landlordSignUrl,
        tenantSignUrl
      };
    } catch (error) {
      throw new Error(`Error requesting signatures: ${error.message}`);
    }
  }

  /**
   * Get signature email template
   */
  _getSignatureEmailTemplate(party, contract, signUrl) {
    return `
      <h2>Tenancy Agreement Signature Request</h2>
      <p>Dear ${party},</p>
      <p>You have been requested to sign the tenancy agreement for the following property:</p>
      <ul>
        <li><strong>Property:</strong> ${contract.propertyInfo?.description}</li>
        <li><strong>Address:</strong> ${contract.propertyInfo?.address}</li>
        <li><strong>Lease Period:</strong> ${new Date(contract.tenancyTerms?.leaseStartDate).toLocaleDateString()} to ${new Date(contract.tenancyTerms?.leaseEndDate).toLocaleDateString()}</li>
        <li><strong>Monthly Rent:</strong> AED ${contract.tenancyTerms?.rentAmount}</li>
        <li><strong>Contract Reference:</strong> ${contract.referenceNumber}</li>
      </ul>
      <p>Please click the link below to review and sign the agreement:</p>
      <a href="${signUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Sign Agreement</a>
      <p>This link will expire in 7 days.</p>
      <p>Best regards,<br>White Caves</p>
    `;
  }

  /**
   * Record signature from landlord or tenant
   */
  async recordSignature(token, signatureData, ipAddress, userAgent) {
    try {
      const contract = await TenancyContract.findOne({
        $or: [
          { 'signatures.landlordSignature.signatureToken': token },
          { 'signatures.tenantSignature.signatureToken': token }
        ]
      });

      if (!contract) throw new Error('Invalid signature token');

      // Determine if this is landlord or tenant signature
      const isLandlord = contract.signatures.landlordSignature.signatureToken === token;

      if (isLandlord) {
        if (contract.signatures.landlordSignature.signed) {
          throw new Error('Landlord has already signed this contract');
        }
        contract.signatures.landlordSignature.signed = true;
        contract.signatures.landlordSignature.signedAt = new Date();
        contract.signatures.landlordSignature.signatureData = signatureData;
        contract.signatures.landlordSignature.ipAddress = ipAddress;
        contract.signatures.landlordSignature.userAgent = userAgent;
      } else {
        if (contract.signatures.tenantSignature.signed) {
          throw new Error('Tenant has already signed this contract');
        }
        contract.signatures.tenantSignature.signed = true;
        contract.signatures.tenantSignature.signedAt = new Date();
        contract.signatures.tenantSignature.signatureData = signatureData;
        contract.signatures.tenantSignature.ipAddress = ipAddress;
        contract.signatures.tenantSignature.userAgent = userAgent;
      }

      // Update contract status
      if (contract.isFullySigned()) {
        contract.status = 'FullySigned';
      } else {
        contract.status = 'PartiallySignedSignatures';
      }

      await contract.save();

      // Clear the token
      if (isLandlord) {
        contract.signatures.landlordSignature.signatureToken = null;
      } else {
        contract.signatures.tenantSignature.signatureToken = null;
      }
      await contract.save();

      // Send confirmation to both parties if both signed
      if (contract.isFullySigned()) {
        await this._notifyFullySignedContract(contract);
      }

      return {
        success: true,
        message: `${isLandlord ? 'Landlord' : 'Tenant'} signature recorded successfully`,
        fullySignedStatus: contract.isFullySigned()
      };
    } catch (error) {
      throw new Error(`Error recording signature: ${error.message}`);
    }
  }

  /**
   * Get contract for signing
   */
  async getContractForSigning(token) {
    try {
      const contract = await TenancyContract.findOne({
        $or: [
          { 'signatures.landlordSignature.signatureToken': token },
          { 'signatures.tenantSignature.signatureToken': token }
        ]
      });

      if (!contract) throw new Error('Invalid or expired signature link');

      // Determine party type
      const isLandlord = contract.signatures.landlordSignature.signatureToken === token;

      return {
        contractId: contract._id,
        referenceNumber: contract.referenceNumber,
        pdfUrl: contract.pdfDocument?.pdfUrl,
        propertyDescription: contract.propertyInfo?.description,
        partyType: isLandlord ? 'Landlord' : 'Tenant',
        partyName: isLandlord ? contract.landlordInfo?.name : contract.tenantInfo?.name,
        leaseStart: contract.tenancyTerms?.leaseStartDate,
        leaseEnd: contract.tenancyTerms?.leaseEndDate,
        rentAmount: contract.tenancyTerms?.rentAmount
      };
    } catch (error) {
      throw new Error(`Error retrieving contract: ${error.message}`);
    }
  }

  /**
   * Get contract status and signature information
   */
  async getContractStatus(contractId) {
    try {
      const contract = await TenancyContract.findById(contractId);
      if (!contract) throw new Error('Contract not found');

      return {
        contractId: contract._id,
        referenceNumber: contract.referenceNumber,
        status: contract.status,
        signatureStatus: contract.getSignatureStatus(),
        pdfUrl: contract.pdfDocument?.pdfUrl,
        createdAt: contract.createdAt,
        generatedAt: contract.pdfDocument?.generatedAt,
        auditTrail: contract.auditTrail
      };
    } catch (error) {
      throw new Error(`Error getting contract status: ${error.message}`);
    }
  }

  /**
   * Notify both parties when contract is fully signed
   */
  async _notifyFullySignedContract(contract) {
    try {
      const message = `Tenancy agreement ${contract.referenceNumber} has been fully signed by both parties. The contract is now official.`;

      // Email to landlord
      if (contract.landlordInfo?.email) {
        await NotificationService.sendEmail(
          contract.landlordInfo?.email,
          'Tenancy Agreement Signed',
          `<p>Dear ${contract.landlordInfo?.name},</p><p>${message}</p><p>Contract Reference: ${contract.referenceNumber}</p>`
        );
      }

      // Email to tenant
      if (contract.tenantInfo?.email) {
        await NotificationService.sendEmail(
          contract.tenantInfo?.email,
          'Tenancy Agreement Signed',
          `<p>Dear ${contract.tenantInfo?.name},</p><p>${message}</p><p>Contract Reference: ${contract.referenceNumber}</p>`
        );
      }

      // WhatsApp notifications
      if (contract.landlordInfo?.mobileNumber) {
        await NotificationService.sendWhatsApp(
          contract.landlordInfo?.mobileNumber,
          `${message}`
        );
      }

      if (contract.tenantInfo?.mobileNumber) {
        await NotificationService.sendWhatsApp(
          contract.tenantInfo?.mobileNumber,
          `${message}`
        );
      }
    } catch (error) {
      console.error('Error notifying parties:', error);
    }
  }

  /**
   * Add audit trail entry
   */
  async _addAuditEntry(contractId, action, performedBy, details, ipAddress) {
    try {
      const contract = await TenancyContract.findById(contractId);
      if (contract) {
        contract.addAuditEntry(action, performedBy, details, ipAddress);
        await contract.save();
      }
    } catch (error) {
      console.error('Error adding audit entry:', error);
    }
  }

  /**
   * Download contract PDF
   */
  async downloadContract(contractId) {
    try {
      const contract = await TenancyContract.findById(contractId);
      if (!contract) throw new Error('Contract not found');

      return {
        pdfUrl: contract.pdfDocument?.pdfUrl,
        fileName: contract.pdfDocument?.fileName,
        referenceNumber: contract.referenceNumber
      };
    } catch (error) {
      throw new Error(`Error downloading contract: ${error.message}`);
    }
  }

  /**
   * List contracts for agent
   */
  async listContractsByAgent(agentId, filters = {}) {
    try {
      const query = { agentId };

      if (filters.status) query.status = filters.status;
      if (filters.propertyId) query['propertyInfo.propertyId'] = filters.propertyId;

      const contracts = await TenancyContract.find(query)
        .select('referenceNumber status propertyInfo landlordInfo tenantInfo tenancyTerms createdAt updatedAt')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50)
        .skip(filters.skip || 0);

      const total = await TenancyContract.countDocuments(query);

      return {
        contracts,
        total,
        page: Math.floor((filters.skip || 0) / (filters.limit || 50)) + 1
      };
    } catch (error) {
      throw new Error(`Error listing contracts: ${error.message}`);
    }
  }
}

module.exports = new TenancyContractService();
