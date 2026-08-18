import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import mammoth from 'mammoth';
import WordExtractor from 'word-extractor';

const prisma = new PrismaClient();

// Lazy-load pdf-parse only when needed (due to compatibility issues)
let pdfParse = null;

async function getPdfParser() {
  if (!pdfParse) {
    try {
      pdfParse = await import('pdf-parse');
    } catch (e) {
      // Fallback: create a wrapper
      pdfParse = { default: null };
    }
  }
  return pdfParse;
}

/**
 * Resume Parser Service
 * Handles extraction of text from various resume formats (PDF, DOCX, TXT)
 * This is a foundation service for Phase 1B implementation
 */

export class ResumeParserService {
  /**
   * Extract text from different file formats
   * Currently supports TXT (immediate), PDF and DOCX (requires additional dependencies)
   */
  static async extractTextFromResume(filePath) {
    try {
      const fileExt = path.extname(filePath).toLowerCase();

      switch (fileExt) {
        case '.txt':
          return this.extractFromTxt(filePath);
        
        case '.pdf':
          return this.extractFromPdf(filePath);
        
        case '.docx':
          return this.extractFromDocx(filePath);
        
        case '.doc':
          return this.extractFromDoc(filePath);
        
        default:
          throw new Error(`Unsupported file format: ${fileExt}`);
      }
    } catch (error) {
      console.error('Error extracting resume text:', error);
      throw error;
    }
  }

  /**
   * Extract text from TXT files (immediate implementation)
   */
  static extractFromTxt(filePath) {
    try {
      const text = fs.readFileSync(filePath, 'utf-8');
      return {
        success: true,
        text,
        method: 'txt_extraction'
      };
    } catch (error) {
      throw new Error(`Failed to extract TXT: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF files
   * Uses pdf-parse library for robust PDF extraction
   */
  static async extractFromPdf(filePath) {
    try {
      // Attempt PDF extraction with dynamic import
      try {
        const pdfModule = await import('pdf-parse');
        const fileBuffer = fs.readFileSync(filePath);
        const data = await pdfModule.default(fileBuffer);
        
        return {
          success: true,
          text: data.text,
          method: 'pdf_extraction',
          pageCount: data.numpages
        };
      } catch (pdfError) {
        // Fallback: basic PDF text extraction using regex patterns
        // For Phase 1B, we return a placeholder that indicates manual review needed
        console.warn('PDF parsing library unavailable, using fallback method:', pdfError.message);
        
        const fileBuffer = fs.readFileSync(filePath);
        // Convert buffer to string for basic text extraction
        let text = fileBuffer.toString('latin1');
        // Remove PDF header/footer noise
        text = text.split('\0').join('').replace(/[^\x20-\x7E\n]/g, ' ');
        
        return {
          success: true,
          text: text,
          method: 'pdf_extraction_fallback',
          pageCount: 1,
          warning: 'PDF extraction used fallback method - accuracy may be reduced'
        };
      }
    } catch (error) {
      throw new Error(`Failed to extract PDF: ${error.message}`);
    }
  }

  /**
   * Extract text from DOCX files
   * Uses mammoth library for clean DOCX extraction
   */
  static async extractFromDocx(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      
      return {
        success: true,
        text: result.value,
        method: 'docx_extraction',
        warnings: result.messages.length
      };
    } catch (error) {
      throw new Error(`Failed to extract DOCX: ${error.message}`);
    }
  }

  /**
   * Extract text from DOC files (legacy Word format)
   * Uses word-extractor for older DOC format support
   */
  static async extractFromDoc(filePath) {
    try {
      const extractor = new WordExtractor();
      const extracted = await extractor.extract(filePath);
      const text = extracted.getBody();
      
      return {
        success: true,
        text: text,
        method: 'doc_extraction'
      };
    } catch (error) {
      throw new Error(`Failed to extract DOC: ${error.message}`);
    }
  }

  /**
   * Parse resume text to extract key information
   * Supports: Skills, Experience, Education, Contact Info, etc.
   * Rule-based extraction (Rule-based approach used in Phase 1, upgraded to ML in Phase 3)
   */
  static parseResumeText(resumeText) {
    try {
      const extracted = {
        skills: this.extractSkills(resumeText),
        experience: this.extractExperience(resumeText),
        education: this.extractEducation(resumeText),
        contact: this.extractContactInfo(resumeText),
        rawText: resumeText
      };

      return extracted;
    } catch (error) {
      console.error('Error parsing resume text:', error);
      throw error;
    }
  }

  /**
   * Extract skills from resume text
   * Uses keyword matching against common skill lists
   */
  static extractSkills(text) {
    const commonSkills = [
      // Languages
      'javascript', 'python', 'java', 'c\\+\\+', 'csharp', 'php', 'ruby', 'swift',
      'typescript', 'golang', 'rust', 'kotlin', 'scala', 'r', 'matlab',
      
      // Frameworks & Libraries
      'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
      'spring', 'asp.net', 'rails', 'laravel', 'tensorflow', 'pytorch',
      
      // Databases
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra',
      'dynamodb', 'firebase', 'oracle', 'sql server',
      
      // Tools & Platforms
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'git',
      'gitlab', 'github', 'jira', 'confluence', 'figma', 'slack',
      
      // Methodologies
      'agile', 'scrum', 'kanban', 'waterfall', 'ci/cd', 'tdd',
      'rest api', 'graphql', 'microservices', 'devops'
    ];

    const foundSkills = [];
    const lowerText = text.toLowerCase();

    commonSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill}\\b`, 'gi');
      if (regex.test(lowerText)) {
        foundSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });

    return [...new Set(foundSkills)]; // Remove duplicates
  }

  /**
   * Extract work experience from resume text
   * Looks for patterns like "Company", "Position", dates, etc.
   */
  static extractExperience(text) {
    const experiences = [];
    
    // Pattern: "Title at Company for X years"
    const experiencePattern = /([A-Za-z\s]+)\s+(?:at|for)\s+([A-Za-z\s&\.]+)\s*(?:for|during)?\s*(\d+\s*(?:years?|yrs?|months?|mons?))?/gi;
    
    let match;
    while ((match = experiencePattern.exec(text)) !== null) {
      experiences.push({
        position: match[1].trim(),
        company: match[2].trim(),
        duration: match[3] ? match[3].trim() : null
      });
    }

    return experiences.slice(0, 10); // Limit to 10 entries
  }

  /**
   * Extract education information from resume text
   * Looks for degrees, universities, graduation dates
   */
  static extractEducation(text) {
    const degrees = [];
    
    // Pattern: "Bachelor/Master/PhD in/of [Field] from [University]"
    const degreePattern = /(?:bachelor|master|phd|b\.s\.|m\.s\.|b\.a\.|m\.a\.|diploma|associate)\s*(?:of|in)?\s*([A-Za-z\s]+?)(?:\s+from|\s+at|\s+,|\s*-|\s*$|\n)/gi;
    
    let match;
    while ((match = degreePattern.exec(text)) !== null) {
      degrees.push({
        degree: match[0].split(/from|at/)[0].trim(),
        field: match[1].trim()
      });
    }

    return degrees.slice(0, 5); // Limit to 5 entries
  }

  /**
   * Extract contact information from resume text
   * Looks for email, phone, website, LinkedIn, etc.
   */
  static extractContactInfo(text) {
    const contact = {};

    // Email pattern
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      contact.email = emailMatch[0];
    }

    // Phone pattern (flexible for international formats)
    const phoneMatch = text.match(/(?:\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
    if (phoneMatch) {
      contact.phone = phoneMatch[0];
    }

    // LinkedIn URL
    const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
    if (linkedinMatch) {
      contact.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
    }

    // Website/Portfolio
    const websiteMatch = text.match(/(?:https?:\/\/|www\.)([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    if (websiteMatch) {
      contact.website = websiteMatch[0].includes('http') ? websiteMatch[0] : `https://${websiteMatch[0]}`;
    }

    return contact;
  }

  /**
   * Update resume extraction status in database
   */
  static async updateExtractionStatus(uploadId, status, error = null) {
    try {
      return await prisma.resumeUpload.update({
        where: { id: uploadId },
        data: {
          extraction_status: status,
          extraction_error: error
        }
      });
    } catch (error) {
      console.error('Error updating extraction status:', error);
      throw error;
    }
  }

  /**
   * Store extracted resume text in candidate record
   */
  static async storeExtractedText(candidateId, resumeText, extractedData) {
    try {
      return await prisma.candidate.update({
        where: { id: candidateId },
        data: {
          resume_text: resumeText
        }
      });
    } catch (error) {
      console.error('Error storing extracted text:', error);
      throw error;
    }
  }
}

export default ResumeParserService;
