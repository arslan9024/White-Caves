import Contract from '../models/Contract.js';
import ContractSignature from '../models/ContractSignature.js';
import ContractVersion from '../models/ContractVersion.js';
import ContractTemplate from '../models/ContractTemplate.js';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import crypto from 'crypto';

class ContractService {
  /**
   * Create a contract from a template
   * @param {String} templateId - Template to use
   * @param {Object} templateData - Data to populate template
   * @param {Object} partyData - Party information (buyer, seller, etc.)
   * @returns {Promise<Object>} Created contract
   */
  async createFromTemplate(templateId, templateData, partyData) {
    try {
      // Get template
      const template = await ContractTemplate.findById(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Populate template variables
      let content = template.content;
      Object.keys(templateData).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, templateData[key]);
      });

      // Create contract
      const contract = new Contract({
        propertyId: templateData.propertyId,
        leadId: templateData.leadId,
        agentId: templateData.agentId,
        template: template.name,
        templateId: templateId,
        ...partyData,
        status: 'draft'
      });

      await contract.save();

      // Create version 1
      await ContractVersion.create({
        contractId: contract._id,
        versionNumber: 1,
        changes: { modified: [], details: 'Initial creation' },
        snapshot: contract.toObject(),
        createdBy: partyData.createdBy
      });

      return contract;
    } catch (error) {
      throw new Error(`Failed to create contract from template: ${error.message}`);
    }
  }

  /**
   * Generate PDF from contract
   * @param {String} contractId - Contract ID
   * @returns {Promise<Buffer>} PDF buffer
   */
  async generatePDF(contractId) {
    try {
      const contract = await Contract.findById(contractId);
      if (!contract) {
        throw new Error('Contract not found');
      }

      // Create PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]); // Letter size
      const { width, height } = page.getSize();
      const margin = 50;

      let yPosition = height - margin;
      const lineHeight = 14;
      const fontSize = 11;

      // Helper to add text
      const addText = (text, x = margin, isBold = false) => {
        if (yPosition < margin) {
          pdfDoc.addPage();
          yPosition = height - margin;
        }
        page.drawText(text, {
          x,
          y: yPosition,
          size: fontSize,
          color: rgb(0, 0, 0)
        });
        yPosition -= lineHeight;
      };

      // Title
      addText('LEASE AGREEMENT', margin, true);
      yPosition -= lineHeight;

      // Contract number and date
      addText(`Contract #: ${contract.contractNumber}`);
      addText(`Date: ${new Date().toLocaleDateString('en-AE')}`);
      yPosition -= lineHeight;

      // Property details
      addText('PROPERTY DETAILS:');
      addText(`Address: ${contract.propertyDetails?.address}`);
      addText(`Area: ${contract.propertyDetails?.area} sqft`);
      yPosition -= lineHeight;

      // Parties
      addText('TENANT:');
      addText(`Name: ${contract.tenant?.name}`);
      addText(`Email: ${contract.tenant?.email}`);
      yPosition -= lineHeight;

      addText('LANDLORD:');
      addText(`Name: ${contract.landlord?.name}`);
      addText(`Email: ${contract.landlord?.email}`);
      yPosition -= lineHeight;

      // Terms
      addText('LEASE TERMS:');
      addText(`Monthly Rent: AED ${contract.leaseTerms?.rentAmount}`);
      addText(
        `Duration: ${contract.leaseTerms?.rentalPeriod?.durationMonths} months`
      );
      addText(`Security Deposit: AED ${contract.leaseTerms?.securityDeposit}`);
      yPosition -= lineHeight;

      // Signature section
      addText('SIGNATURES:');
      addText('_________________________     _________________________');
      addText('Tenant Signature          Landlord Signature');
      addText(`Date: _______             Date: _______`);

      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save();

      // Calculate and store hash
      const pdfHash = crypto
        .createHash('sha256')
        .update(pdfBytes)
        .digest('hex');

      // Update contract with PDF info
      contract.pdfUrl = `contracts/${contract._id}.pdf`;
      contract.pdfHash = pdfHash;
      await contract.save();

      return pdfBytes;
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Request signature from a party
   * @param {String} contractId - Contract ID
   * @param {Object} signerInfo - Signer information
   * @returns {Promise<Object>} Signature request data
   */
  async requestSignature(contractId, signerInfo) {
    try {
      const contract = await Contract.findById(contractId);
      if (!contract) {
        throw new Error('Contract not found');
      }

      // Generate signing token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Create signature record
      const signature = await ContractSignature.create({
        contractId,
        signedBy: signerInfo,
        status: 'pending',
        expiresAt,
        method: signerInfo.method || 'canvas'
      });

      // Update contract status
      if (contract.status === 'draft') {
        contract.status = 'pending_signatures';
      }
      await contract.save();

      return {
        signatureId: signature._id,
        contractId,
        signingLink: `/sign/${contractId}/${signature._id}/${token}`,
        expiresAt,
        signerEmail: signerInfo.email
      };
    } catch (error) {
      throw new Error(`Failed to request signature: ${error.message}`);
    }
  }

  /**
   * Record a signature
   * @param {String} contractId - Contract ID
   * @param {String} signatureId - Signature record ID
   * @param {Object} signatureData - Signature data
   * @returns {Promise<Object>} Updated contract
   */
  async recordSignature(contractId, signatureId, signatureData) {
    try {
      const signature = await ContractSignature.findById(signatureId);
      if (!signature) {
        throw new Error('Signature record not found');
      }

      // Validate expiration
      if (new Date() > signature.expiresAt) {
        signature.status = 'expired';
        await signature.save();
        throw new Error('Signature request has expired');
      }

      // Calculate signature hash
      const hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(signatureData))
        .digest('hex');

      // Update signature
      signature.signatureData = {
        imageData: signatureData.imageData,
        mimeType: signatureData.mimeType || 'image/png',
        hash
      };
      signature.deviceInfo = signatureData.deviceInfo;
      signature.status = 'signed';
      signature.signedAt = new Date();
      await signature.save();

      // Get contract and check if all signatures complete
      const contract = await Contract.findById(contractId);
      const allSignatures = await ContractSignature.find({
        contractId,
        status: 'signed'
      });

      // Update contract status
      if (allSignatures.length === 1) {
        contract.status = 'partially_signed';
      } else {
        // Check if all required signatures are complete
        const requiredSignatures = ['buyer', 'seller', 'agent'];
        const signedRoles = allSignatures.map((s) => s.signedBy.role);
        if (requiredSignatures.every((role) => signedRoles.includes(role))) {
          contract.status = 'fully_signed';
        }
      }

      await contract.save();

      return contract;
    } catch (error) {
      throw new Error(`Failed to record signature: ${error.message}`);
    }
  }

  /**
   * Get signature status
   * @param {String} contractId - Contract ID
   * @returns {Promise<Object>} Signature status
   */
  async getSignatureStatus(contractId) {
    try {
      const signatures = await ContractSignature.find({ contractId }).select(
        'signedBy status signedAt'
      );

      const contract = await Contract.findById(contractId);

      return {
        contractId,
        contractStatus: contract.status,
        totalSignatures: signatures.length,
        signedSignatures: signatures.filter((s) => s.status === 'signed').length,
        signatures: signatures.map((s) => ({
          signer: s.signedBy.email,
          role: s.signedBy.role,
          status: s.status,
          signedAt: s.signedAt
        }))
      };
    } catch (error) {
      throw new Error(`Failed to get signature status: ${error.message}`);
    }
  }

  /**
   * Archive/finalize a contract
   * @param {String} contractId - Contract ID
   * @returns {Promise<Object>} Archived contract
   */
  async archiveContract(contractId) {
    try {
      const contract = await Contract.findById(contractId);
      if (!contract) {
        throw new Error('Contract not found');
      }

      // Verify all signatures complete
      const signatures = await ContractSignature.find({
        contractId,
        status: 'signed'
      });

      if (signatures.length === 0) {
        throw new Error('No signatures recorded yet');
      }

      contract.status = 'executed';
      contract.executionDate = new Date();

      // Add to history
      contract.history.push({
        action: 'executed',
        timestamp: new Date(),
        details: 'Contract finalized and archived'
      });

      await contract.save();

      return contract;
    } catch (error) {
      throw new Error(`Failed to archive contract: ${error.message}`);
    }
  }

  /**
   * Get contract with all details
   * @param {String} contractId - Contract ID
   * @returns {Promise<Object>} Complete contract
   */
  async getContractDetails(contractId) {
    try {
      const contract = await Contract.findById(contractId);
      if (!contract) {
        throw new Error('Contract not found');
      }

      const signatures = await ContractSignature.find({
        contractId
      }).select('signedBy status signedAt method');

      return {
        contract,
        signatures,
        signatureStatus: await this.getSignatureStatus(contractId)
      };
    } catch (error) {
      throw new Error(`Failed to get contract details: ${error.message}`);
    }
  }

  /**
   * Get contract versions
   * @param {String} contractId - Contract ID
   * @returns {Promise<Array>} Contract versions
   */
  async getContractVersions(contractId) {
    try {
      const versions = await ContractVersion.find({ contractId }).sort(
        { versionNumber: 1 }
      );
      return versions;
    } catch (error) {
      throw new Error(`Failed to get contract versions: ${error.message}`);
    }
  }

  /**
   * List user's contracts
   * @param {String} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} User's contracts
   */
  async listUserContracts(userId, filters = {}) {
    try {
      const query = {
        $or: [
          { 'tenant._id': userId },
          { 'landlord._id': userId },
          { agentId: userId }
        ]
      };

      if (filters.status) {
        query.status = filters.status;
      }

      const contracts = await Contract.find(query)
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50)
        .skip(filters.skip || 0);

      return contracts;
    } catch (error) {
      throw new Error(`Failed to list contracts: ${error.message}`);
    }
  }
}

export default new ContractService();
