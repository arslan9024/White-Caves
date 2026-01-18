import ContractTemplate from '../models/ContractTemplate.js';

class TemplateEngine {
  /**
   * Populate template with variables
   * @param {Object} template - Template object
   * @param {Object} variables - Variables to inject
   * @returns {String} Populated template content
   */
  populateTemplate(template, variables) {
    try {
      let content = template.content;

      // Replace simple variables
      Object.keys(variables).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        const value = variables[key];
        content = content.replace(regex, this.formatValue(value));
      });

      return content;
    } catch (error) {
      throw new Error(`Failed to populate template: ${error.message}`);
    }
  }

  /**
   * Validate all required variables are present
   * @param {Object} template - Template object
   * @param {Object} data - Data to validate
   * @returns {Object} Validation result
   */
  validateVariables(template, data) {
    try {
      const requiredVars = this.extractVariables(template.content);
      const missingVars = [];

      requiredVars.forEach((varName) => {
        if (!data[varName]) {
          missingVars.push(varName);
        }
      });

      return {
        valid: missingVars.length === 0,
        missingVars,
        requiredVars
      };
    } catch (error) {
      throw new Error(`Failed to validate variables: ${error.message}`);
    }
  }

  /**
   * Extract all variables from template
   * @param {String} content - Template content
   * @returns {Array<String>} Variable names
   */
  extractVariables(content) {
    const regex = /{{(\w+)}}/g;
    const variables = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }

  /**
   * Format value for template
   * @param {*} value - Value to format
   * @returns {String} Formatted value
   */
  formatValue(value) {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      if (value instanceof Date) {
        return value.toLocaleDateString('en-AE');
      }
      return JSON.stringify(value);
    }

    return String(value);
  }

  /**
   * Format clauses based on property type
   * @param {Array} clauses - Available clauses
   * @param {String} propertyType - Type of property
   * @returns {Array} Filtered clauses
   */
  formatClauses(clauses, propertyType) {
    try {
      if (!clauses || clauses.length === 0) {
        return [];
      }

      // Filter clauses applicable to property type
      return clauses.filter((clause) => {
        if (!clause.appliesTo) return true;
        if (Array.isArray(clause.appliesTo)) {
          return (
            clause.appliesTo.includes(propertyType) ||
            clause.appliesTo.includes('all')
          );
        }
        return clause.appliesTo === propertyType || clause.appliesTo === 'all';
      });
    } catch (error) {
      throw new Error(`Failed to format clauses: ${error.message}`);
    }
  }

  /**
   * Generate plain text summary of contract
   * @param {Object} contract - Contract object
   * @returns {String} Plain text summary
   */
  generateSummary(contract) {
    try {
      const summary = `
CONTRACT SUMMARY
===============

Contract Number: ${contract.contractNumber}
Status: ${contract.status}
Created: ${new Date(contract.createdAt).toLocaleDateString('en-AE')}

PROPERTY DETAILS:
- Address: ${contract.propertyDetails?.address}
- Area: ${contract.propertyDetails?.area} sqft
- Type: ${contract.propertyDetails?.propertyType}

TENANT:
- Name: ${contract.tenant?.name}
- Email: ${contract.tenant?.email}
- ID: ${contract.tenant?.emiratesId || contract.tenant?.passport}

LANDLORD:
- Name: ${contract.landlord?.name}
- Email: ${contract.landlord?.email}
- ID: ${contract.landlord?.emiratesId || contract.landlord?.passport}

LEASE TERMS:
- Monthly Rent: AED ${contract.leaseTerms?.rentAmount}
- Duration: ${contract.leaseTerms?.rentalPeriod?.durationMonths} months
- Start Date: ${new Date(contract.leaseTerms?.rentalPeriod?.startDate).toLocaleDateString('en-AE')}
- End Date: ${new Date(contract.leaseTerms?.rentalPeriod?.endDate).toLocaleDateString('en-AE')}
- Security Deposit: AED ${contract.leaseTerms?.securityDeposit}
- Payment Schedule: ${contract.leaseTerms?.paymentSchedule}

ADDITIONAL TERMS:
- Parking Spaces: ${contract.leaseTerms?.parkingSpaces || 0}
- Pets Allowed: ${contract.leaseTerms?.petPolicy || 'No'}
- Maid Room: ${contract.leaseTerms?.maidRoomAllowed ? 'Yes' : 'No'}

CUSTOM CLAUSES: ${contract.customClauses?.length || 0}
${
  contract.customClauses?.map((c) => `- ${c.title}: ${c.content}`).join('\n') ||
  'None'
}
      `.trim();

      return summary;
    } catch (error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }

  /**
   * Get available templates
   * @returns {Promise<Array>} Available templates
   */
  async getAvailableTemplates() {
    try {
      const templates = await ContractTemplate.find({ active: true }).select(
        'name description category variables'
      );
      return templates;
    } catch (error) {
      throw new Error(`Failed to get templates: ${error.message}`);
    }
  }

  /**
   * Get template by category
   * @param {String} category - Template category
   * @returns {Promise<Array>} Templates in category
   */
  async getTemplatesByCategory(category) {
    try {
      const templates = await ContractTemplate.find({
        category,
        active: true
      });
      return templates;
    } catch (error) {
      throw new Error(`Failed to get templates by category: ${error.message}`);
    }
  }

  /**
   * Create contract from template with validation
   * @param {String} templateId - Template ID
   * @param {Object} data - Data to populate
   * @returns {Promise<Object>} Validation and populated template
   */
  async createWithValidation(templateId, data) {
    try {
      const template = await ContractTemplate.findById(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Validate data
      const validation = this.validateVariables(template, data);
      if (!validation.valid) {
        throw new Error(`Missing required fields: ${validation.missingVars.join(', ')}`);
      }

      // Populate template
      const populatedContent = this.populateTemplate(template, data);

      // Generate summary
      const summary = this.generateSummary({
        ...data,
        status: 'draft'
      });

      return {
        templateId,
        template: template.name,
        content: populatedContent,
        summary,
        variables: validation.requiredVars,
        valid: true
      };
    } catch (error) {
      throw new Error(`Failed to create with validation: ${error.message}`);
    }
  }

  /**
   * Merge multiple templates (e.g., main + attachments)
   * @param {String} mainTemplateId - Main template
   * @param {Array<String>} attachmentIds - Attachment template IDs
   * @returns {Promise<String>} Merged content
   */
  async mergeTemplates(mainTemplateId, attachmentIds = []) {
    try {
      const mainTemplate = await ContractTemplate.findById(mainTemplateId);
      if (!mainTemplate) {
        throw new Error('Main template not found');
      }

      let mergedContent = mainTemplate.content;

      // Append attachments
      for (const attachmentId of attachmentIds) {
        const attachment = await ContractTemplate.findById(attachmentId);
        if (attachment) {
          mergedContent += `\n\n---ATTACHMENT: ${attachment.name}---\n${attachment.content}`;
        }
      }

      return mergedContent;
    } catch (error) {
      throw new Error(`Failed to merge templates: ${error.message}`);
    }
  }
}

export default new TemplateEngine();
