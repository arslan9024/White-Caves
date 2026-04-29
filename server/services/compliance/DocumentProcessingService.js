import KYCProfile from '../../models/compliance/KYCProfile.js';
import AMLAlert from '../../models/compliance/AMLAlert.js';
import ComplianceAudit from '../../models/compliance/ComplianceAudit.js';
import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import logger from '../../utils/logger.js';

class DocumentProcessingService {
  /**
   * Process uploaded document image
   * - Validate image format and size
   * - Enhance image quality
   * - Extract text using OCR
   * - Validate extracted data
   */
  static async processDocument(documentPath, documentType) {
    try {
      logger.info(`Processing document: ${documentType}`);

      // 1. Validate file exists and is readable
      const imageBuffer = await this.validateAndReadImage(documentPath);

      // 2. Enhance image quality for better OCR
      const enhancedImage = await this.enhanceImageQuality(imageBuffer);

      // 3. Extract text using OCR
      const ocrResult = await this.extractTextWithOCR(enhancedImage, documentType);

      // 4. Parse and validate extracted data
      const parsedData = this.parseDocumentData(ocrResult.text, documentType);
      const validationResult = this.validateExtractedData(parsedData, documentType);

      return {
        success: true,
        documentType,
        rawText: ocrResult.text,
        confidence: ocrResult.confidence,
        parsedData,
        validation: validationResult,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Document processing error for ${documentType}:`, error);
      throw new Error(`Failed to process document: ${error.message}`);
    }
  }

  /**
   * Validate and read image file
   */
  static async validateAndReadImage(documentPath) {
    try {
      const fs = await import('fs').then(m => m.promises);
      const imageBuffer = await fs.readFile(documentPath);

      // Validate image format using magic bytes
      const validFormats = ['FFD8FF', '89504E47', '47494638']; // JPG, PNG, GIF
      const header = imageBuffer.toString('hex', 0, 3).toUpperCase();
      
      if (!validFormats.some(format => header.startsWith(format))) {
        throw new Error('Invalid image format. Only JPG, PNG, and GIF are supported.');
      }

      // Check file size (max 10MB)
      if (imageBuffer.length > 10 * 1024 * 1024) {
        throw new Error('Image size exceeds maximum limit of 10MB');
      }

      return imageBuffer;
    } catch (error) {
      logger.error('Image validation error:', error);
      throw new Error(`Image validation failed: ${error.message}`);
    }
  }

  /**
   * Enhance image quality for OCR using sharp
   */
  static async enhanceImageQuality(imageBuffer) {
    try {
      const enhanced = await sharp(imageBuffer)
        .normalize() // Normalize the image
        .modulate({ saturation: 1.2 }) // Increase saturation slightly
        .sharpen({ sigma: 1.5 }) // Sharpen for better text clarity
        .greyscale() // Convert to greyscale for OCR
        .toBuffer();

      return enhanced;
    } catch (error) {
      logger.error('Image enhancement error:', error);
      throw new Error(`Image enhancement failed: ${error.message}`);
    }
  }

  /**
   * Extract text using Tesseract OCR
   */
  static async extractTextWithOCR(imageBuffer, documentType) {
    try {
      const worker = await Tesseract.createWorker();
      
      const result = await worker.recognize(imageBuffer, 'eng');
      
      const confidence = result.data.confidence;
      const text = result.data.text;

      await worker.terminate();

      return { text, confidence };
    } catch (error) {
      logger.error('OCR extraction error:', error);
      throw new Error(`OCR extraction failed: ${error.message}`);
    }
  }

  /**
   * Parse extracted text based on document type
   */
  static parseDocumentData(text, documentType) {
    const parsedData = {
      documentType,
      extractedFields: {}
    };

    if (documentType === 'emirates_id') {
      parsedData.extractedFields = this.parseEmiratesID(text);
    } else if (documentType === 'passport') {
      parsedData.extractedFields = this.parsePassport(text);
    } else if (documentType === 'visa') {
      parsedData.extractedFields = this.parseVisa(text);
    }

    return parsedData;
  }

  /**
   * Parse Emirates ID specific fields
   */
  static parseEmiratesID(text) {
    const lines = text.split('\n');
    const fields = {
      idNumber: null,
      firstName: null,
      lastName: null,
      dateOfBirth: null,
      nationality: null,
      expiryDate: null,
      issuedDate: null
    };

    // Extract ID number (11 digits)
    const idMatch = text.match(/\d{3}-\d{4}-\d{7}|\d{11}/);
    if (idMatch) fields.idNumber = idMatch[0].replace('-', '');

    // Extract dates (DD/MM/YYYY format)
    const dateMatches = text.match(/\d{2}\/\d{2}\/\d{4}/g) || [];
    if (dateMatches.length >= 1) {
      fields.dateOfBirth = dateMatches[0];
      if (dateMatches.length >= 2) {
        fields.expiryDate = dateMatches[dateMatches.length - 1];
      }
    }

    // Extract name (usually in uppercase)
    const nameLines = lines.filter(line => /^[A-Z\s]+$/.test(line.trim()));
    if (nameLines.length > 0) {
      const nameParts = nameLines[0].split(/\s+/).filter(p => p);
      if (nameParts.length > 0) {
        fields.firstName = nameParts[0];
        fields.lastName = nameParts.slice(1).join(' ') || '';
      }
    }

    // Extract nationality
    const nationalityKeywords = ['UAE', 'EMIRATE', 'UNITED ARAB EMIRATES'];
    fields.nationality = nationalityKeywords.some(kw => text.includes(kw)) ? 'UAE' : null;

    return fields;
  }

  /**
   * Parse Passport specific fields
   */
  static parsePassport(text) {
    const fields = {
      passportNumber: null,
      firstName: null,
      lastName: null,
      dateOfBirth: null,
      nationality: null,
      gender: null,
      expiryDate: null,
      issuedDate: null
    };

    // Extract passport number (usually 9 characters)
    const passportMatch = text.match(/[A-Z]{1,2}\d{6,8}|[A-Z]\d{8}/);
    if (passportMatch) fields.passportNumber = passportMatch[0];

    // Extract dates
    const dateMatches = text.match(/\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2}/g) || [];
    if (dateMatches.length >= 1) {
      fields.dateOfBirth = dateMatches[0];
      if (dateMatches.length >= 2) {
        fields.expiryDate = dateMatches[dateMatches.length - 1];
      }
    }

    // Extract name
    const namePattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/;
    const nameMatch = text.match(namePattern);
    if (nameMatch) {
      fields.firstName = nameMatch[1];
      fields.lastName = nameMatch[2];
    }

    // Extract gender
    if (text.includes('M') && text.match(/MALE|M$/m)) fields.gender = 'M';
    if (text.includes('F') && text.match(/FEMALE|F$/m)) fields.gender = 'F';

    return fields;
  }

  /**
   * Parse Visa specific fields
   */
  static parseVisa(text) {
    const fields = {
      visaNumber: null,
      visaType: null,
      issueDate: null,
      expiryDate: null,
      sponsorName: null,
      residenceNumber: null
    };

    // Extract dates
    const dateMatches = text.match(/\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2}/g) || [];
    if (dateMatches.length >= 1) {
      fields.issueDate = dateMatches[0];
      if (dateMatches.length >= 2) {
        fields.expiryDate = dateMatches[dateMatches.length - 1];
      }
    }

    // Extract visa type (e.g., Employment, Visit, Transit)
    const visaTypes = ['Employment', 'Visit', 'Transit', 'Student', 'Investor'];
    const visaType = visaTypes.find(type => text.includes(type));
    fields.visaType = visaType || null;

    // Extract residence number (optional)
    const resMatch = text.match(/\d{7,}/);
    if (resMatch) fields.residenceNumber = resMatch[0];

    return fields;
  }

  /**
   * Validate extracted data
   */
  static validateExtractedData(parsedData, documentType) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const fields = parsedData.extractedFields;

    if (documentType === 'emirates_id') {
      if (!fields.idNumber || !/^\d{11}$/.test(fields.idNumber.replace('-', ''))) {
        validation.errors.push('Invalid Emirates ID number format');
      }
      if (!fields.dateOfBirth) {
        validation.errors.push('Date of birth not found');
      }
      if (!fields.expiryDate) {
        validation.warnings.push('Expiry date not found');
      }
    } else if (documentType === 'passport') {
      if (!fields.passportNumber) {
        validation.errors.push('Passport number not found');
      }
      if (!fields.dateOfBirth) {
        validation.errors.push('Date of birth not found');
      }
      if (!fields.firstName || !fields.lastName) {
        validation.errors.push('Full name not found');
      }
    } else if (documentType === 'visa') {
      if (!fields.expiryDate) {
        validation.errors.push('Visa expiry date not found');
      }
      if (!fields.visaType) {
        validation.warnings.push('Visa type not identified');
      }
    }

    validation.isValid = validation.errors.length === 0;
    return validation;
  }

  /**
   * Verify document authenticity and expiry
   */
  static async verifyDocumentStatus(extractedData, documentType) {
    try {
      const fields = extractedData.extractedFields;
      const verification = {
        isExpired: false,
        daysUntilExpiry: null,
        messages: []
      };

      if (fields.expiryDate) {
        const expiryDate = new Date(fields.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

        verification.daysUntilExpiry = daysUntilExpiry;
        verification.isExpired = daysUntilExpiry < 0;

        if (verification.isExpired) {
          verification.messages.push(`Document expired ${Math.abs(daysUntilExpiry)} days ago`);
        } else if (daysUntilExpiry < 30) {
          verification.messages.push(`Document expires in ${daysUntilExpiry} days`);
        }
      }

      return verification;
    } catch (error) {
      logger.error('Document status verification error:', error);
      throw new Error(`Document status verification failed: ${error.message}`);
    }
  }
}

export default DocumentProcessingService;