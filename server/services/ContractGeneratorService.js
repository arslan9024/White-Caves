const mongoose = require('mongoose');
const Contract = require('../models/Contract');
const Offer = require('../models/Offer');
const InventoryProperty = require('../models/InventoryProperty');
const User = require('../models/User');
const Owner = require('../models/Owner');

/**
 * ContractGeneratorService
 * Generates EJARI-compliant tenancy contracts from offers
 */
class ContractGeneratorService {
  /**
   * Generate a contract from an offer
   * @param {string} offerId - The offer to convert to contract
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated contract document
   */
  async generateFromOffer(offerId, options = {}) {
    try {
      // Fetch the offer with all related data
      const offer = await Offer.findById(offerId)
        .populate('propertyId')
        .populate('landlordId')
        .populate('tenantId')
        .populate('agentId');

      if (!offer) {
        throw new Error('Offer not found');
      }

      if (!offer.tenantApproved || !offer.landlordApproved) {
        throw new Error('Both parties must approve the offer before generating contract');
      }

      // Fetch additional property details
      const property = await InventoryProperty.findById(offer.propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Create contract document
      const contractData = {
        offerId: offer._id,
        propertyId: offer.propertyId._id,
        landlordId: offer.landlordId._id,
        tenantId: offer.tenantId._id,
        agentId: offer.agentId._id,

        // Property Details
        propertyDetails: {
          name: offer.propertyId.name || '',
          type: offer.propertyId.type || '',
          location: offer.propertyId.location || '',
          size: offer.propertyId.size || 0,
          bedrooms: offer.propertyId.bedrooms || 0,
          bathrooms: offer.propertyId.bathrooms || 0,
          features: offer.propertyId.features || [],
        },

        // Landlord Details
        landlordDetails: {
          name: offer.landlordId.name || '',
          email: offer.landlordId.email || '',
          phone: offer.landlordId.phone || '',
          nationality: offer.landlordId.nationality || '',
          emiratesId: offer.landlordId.emiratesId || '',
          passportNo: offer.landlordId.passportNo || '',
          address: offer.landlordId.address || '',
        },

        // Tenant Details
        tenantDetails: {
          name: offer.tenantId.name || '',
          email: offer.tenantId.email || '',
          phone: offer.tenantId.phone || '',
          nationality: offer.tenantId.nationality || '',
          emiratesId: offer.tenantId.emiratesId || '',
          passportNo: offer.tenantId.passportNo || '',
          address: offer.tenantId.address || '',
          occupation: offer.tenantId.occupation || '',
          employer: offer.tenantId.employer || '',
        },

        // Agent Details
        agentDetails: {
          name: offer.agentId.name || '',
          email: offer.agentId.email || '',
          phone: offer.agentId.phone || '',
          company: options.companyName || '',
        },

        // Lease Terms
        leaseTerms: {
          startDate: offer.startDate,
          endDate: offer.endDate,
          duration: offer.leaseDuration,
          monthlyRent: offer.monthlyRent,
          securityDeposit: offer.securityDeposit,
          chequeFrequency: offer.chequeFrequency,
          noOfCheques: offer.noOfCheques,
          rentIncreasePercentage: offer.rentIncreasePercentage,
          maintenanceResponsibility: offer.maintenanceResponsibility,
          utilities: offer.utilities,
          specialTerms: offer.specialTerms,
        },

        // Contract Metadata
        contractType: 'tenancy',
        templateVersion: '1.0',
        status: 'draft',
        version: 1,

        // Timestamps
        createdAt: new Date(),
        generatedAt: new Date(),
      };

      // Create contract in database
      const contract = new Contract(contractData);
      await contract.save();

      // Update offer with contract reference
      offer.contractId = contract._id;
      offer.status = 'contract_generated';
      await offer.save();

      // Update property inventory status
      await InventoryProperty.findByIdAndUpdate(property._id, {
        currentContractId: contract._id,
        status: 'contract_generation',
      });

      return contract;
    } catch (error) {
      console.error('Error generating contract:', error);
      throw error;
    }
  }

  /**
   * Get contract preview (HTML for display)
   * @param {string} contractId - The contract to preview
   * @returns {Promise<string>} HTML preview of contract
   */
  async getContractPreview(contractId) {
    try {
      const contract = await Contract.findById(contractId);

      if (!contract) {
        throw new Error('Contract not found');
      }

      const html = this._generateContractHTML(contract);
      return html;
    } catch (error) {
      console.error('Error generating preview:', error);
      throw error;
    }
  }

  /**
   * Generate contract HTML (for preview and PDF)
   * @private
   * @param {Object} contract - The contract document
   * @returns {string} HTML representation of contract
   */
  _generateContractHTML(contract) {
    const {
      propertyDetails,
      landlordDetails,
      tenantDetails,
      agentDetails,
      leaseTerms,
    } = contract;

    const startDate = new Date(leaseTerms.startDate).toLocaleDateString();
    const endDate = new Date(leaseTerms.endDate).toLocaleDateString();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tenancy Contract</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #4caf50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #4caf50;
            font-size: 28px;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section-title {
            background-color: #f0f0f0;
            padding: 12px 15px;
            font-weight: bold;
            font-size: 14px;
            border-left: 4px solid #4caf50;
            margin-bottom: 15px;
        }
        .section-content {
            padding: 0 15px;
        }
        .field-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 12px;
        }
        .field {
            margin-bottom: 12px;
        }
        .field-label {
            font-weight: bold;
            color: #555;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .field-value {
            color: #000;
            padding: 8px;
            background-color: #f9f9f9;
            border-left: 2px solid #ddd;
            font-size: 14px;
        }
        .full-width {
            grid-column: 1 / -1;
        }
        .terms-list {
            list-style-type: none;
            padding-left: 0;
        }
        .terms-list li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            line-height: 1.6;
        }
        .terms-list strong {
            color: #4caf50;
        }
        .signatures {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
        }
        .signature-block {
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 60px;
        }
        .signature-name {
            font-weight: bold;
            margin-top: 10px;
            font-size: 12px;
        }
        .signature-title {
            color: #666;
            font-size: 11px;
            margin-top: 3px;
        }
        @media print {
            body { padding: 0; }
            .page-break { page-break-after: always; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>TENANCY AGREEMENT</h1>
        <p style="margin: 10px 0 0 0; color: #999;">EJARI Compliant</p>
    </div>

    <!-- Property Details Section -->
    <div class="section">
        <div class="section-title">PROPERTY DETAILS</div>
        <div class="section-content">
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Property Name</div>
                    <div class="field-value">${propertyDetails.name || 'N/A'}</div>
                </div>
                <div class="field">
                    <div class="field-label">Property Type</div>
                    <div class="field-value">${propertyDetails.type || 'N/A'}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Location</div>
                    <div class="field-value">${propertyDetails.location || 'N/A'}</div>
                </div>
                <div class="field">
                    <div class="field-label">Size (sqft)</div>
                    <div class="field-value">${propertyDetails.size || 'N/A'}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Bedrooms</div>
                    <div class="field-value">${propertyDetails.bedrooms || 'N/A'}</div>
                </div>
                <div class="field">
                    <div class="field-label">Bathrooms</div>
                    <div class="field-value">${propertyDetails.bathrooms || 'N/A'}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Landlord Section -->
    <div class="section">
        <div class="section-title">LANDLORD INFORMATION</div>
        <div class="section-content">
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Full Name</div>
                    <div class="field-value">${landlordDetails.name}</div>
                </div>
                <div class="field">
                    <div class="field-label">Nationality</div>
                    <div class="field-value">${landlordDetails.nationality}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Emirates ID</div>
                    <div class="field-value">${landlordDetails.emiratesId}</div>
                </div>
                <div class="field">
                    <div class="field-label">Passport No.</div>
                    <div class="field-value">${landlordDetails.passportNo}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Email</div>
                    <div class="field-value">${landlordDetails.email}</div>
                </div>
                <div class="field">
                    <div class="field-label">Phone</div>
                    <div class="field-value">${landlordDetails.phone}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tenant Section -->
    <div class="section">
        <div class="section-title">TENANT INFORMATION</div>
        <div class="section-content">
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Full Name</div>
                    <div class="field-value">${tenantDetails.name}</div>
                </div>
                <div class="field">
                    <div class="field-label">Nationality</div>
                    <div class="field-value">${tenantDetails.nationality}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Emirates ID</div>
                    <div class="field-value">${tenantDetails.emiratesId}</div>
                </div>
                <div class="field">
                    <div class="field-label">Passport No.</div>
                    <div class="field-value">${tenantDetails.passportNo}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Email</div>
                    <div class="field-value">${tenantDetails.email}</div>
                </div>
                <div class="field">
                    <div class="field-label">Phone</div>
                    <div class="field-value">${tenantDetails.phone}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Occupation</div>
                    <div class="field-value">${tenantDetails.occupation || 'N/A'}</div>
                </div>
                <div class="field">
                    <div class="field-label">Employer</div>
                    <div class="field-value">${tenantDetails.employer || 'N/A'}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Lease Terms Section -->
    <div class="section">
        <div class="section-title">LEASE TERMS</div>
        <div class="section-content">
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Lease Start Date</div>
                    <div class="field-value">${startDate}</div>
                </div>
                <div class="field">
                    <div class="field-label">Lease End Date</div>
                    <div class="field-value">${endDate}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Lease Duration</div>
                    <div class="field-value">${leaseTerms.duration} months</div>
                </div>
                <div class="field">
                    <div class="field-label">Monthly Rent (AED)</div>
                    <div class="field-value">${leaseTerms.monthlyRent.toLocaleString()}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Security Deposit (AED)</div>
                    <div class="field-value">${leaseTerms.securityDeposit.toLocaleString()}</div>
                </div>
                <div class="field">
                    <div class="field-label">Cheque Frequency</div>
                    <div class="field-value">${leaseTerms.chequeFrequency}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Number of Cheques</div>
                    <div class="field-value">${leaseTerms.noOfCheques}</div>
                </div>
                <div class="field">
                    <div class="field-label">Annual Rent Increase</div>
                    <div class="field-value">${leaseTerms.rentIncreasePercentage}%</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <div class="field-label">Maintenance Responsibility</div>
                    <div class="field-value">${leaseTerms.maintenanceResponsibility}</div>
                </div>
                <div class="field">
                    <div class="field-label">Utilities Included</div>
                    <div class="field-value">${leaseTerms.utilities || 'As per agreement'}</div>
                </div>
            </div>
            ${
              leaseTerms.specialTerms
                ? `<div class="field full-width">
                    <div class="field-label">Special Terms & Conditions</div>
                    <div class="field-value">${leaseTerms.specialTerms}</div>
                </div>`
                : ''
            }
        </div>
    </div>

    <!-- Key Obligations -->
    <div class="section">
        <div class="section-title">KEY OBLIGATIONS</div>
        <div class="section-content">
            <ul class="terms-list">
                <li><strong>Tenant Obligations:</strong> Pay rent on time, maintain the property, follow building rules, obtain landlord approval for alterations</li>
                <li><strong>Landlord Obligations:</strong> Maintain the property structure, ensure utilities are available, respect tenant's privacy, complete agreed maintenance</li>
                <li><strong>Security Deposit:</strong> Refundable upon lease termination, less any damages or unpaid rent</li>
                <li><strong>Lease Renewal:</strong> Either party may terminate with proper notice as per UAE law</li>
            </ul>
        </div>
    </div>

    <!-- Signature Section -->
    <div class="signatures">
        <div class="signature-block">
            <div class="signature-name">${landlordDetails.name}</div>
            <div class="signature-title">Landlord</div>
        </div>
        <div class="signature-block">
            <div class="signature-name">${tenantDetails.name}</div>
            <div class="signature-title">Tenant</div>
        </div>
        <div class="signature-block">
            <div class="signature-name">${agentDetails.name}</div>
            <div class="signature-title">Agent/Mediator</div>
        </div>
    </div>

    <div style="margin-top: 40px; text-align: center; color: #999; font-size: 11px;">
        <p>This is a digitally generated tenancy agreement. Signatures collected digitally are legally binding under UAE law.</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
    `;
  }

  /**
   * Update contract details
   * @param {string} contractId - The contract to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated contract
   */
  async updateContract(contractId, updates) {
    try {
      const contract = await Contract.findByIdAndUpdate(
        contractId,
        {
          ...updates,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!contract) {
        throw new Error('Contract not found');
      }

      return contract;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  }

  /**
   * Get contract details
   * @param {string} contractId - The contract to fetch
   * @returns {Promise<Object>} Contract document
   */
  async getContract(contractId) {
    try {
      const contract = await Contract.findById(contractId)
        .populate('offerId')
        .populate('propertyId')
        .populate('landlordId')
        .populate('tenantId')
        .populate('agentId');

      if (!contract) {
        throw new Error('Contract not found');
      }

      return contract;
    } catch (error) {
      console.error('Error fetching contract:', error);
      throw error;
    }
  }

  /**
   * List contracts with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of contracts
   */
  async listContracts(filters = {}) {
    try {
      const query = {};

      if (filters.propertyId) query.propertyId = filters.propertyId;
      if (filters.landlordId) query.landlordId = filters.landlordId;
      if (filters.tenantId) query.tenantId = filters.tenantId;
      if (filters.agentId) query.agentId = filters.agentId;
      if (filters.status) query.status = filters.status;

      const contracts = await Contract.find(query)
        .populate('propertyId', 'name location')
        .populate('landlordId', 'name email')
        .populate('tenantId', 'name email')
        .populate('agentId', 'name email')
        .sort({ createdAt: -1 });

      return contracts;
    } catch (error) {
      console.error('Error listing contracts:', error);
      throw error;
    }
  }
}

module.exports = new ContractGeneratorService();
