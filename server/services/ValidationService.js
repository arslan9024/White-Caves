/**
 * Recruitment Data Validation Service
 * Validates candidate, job, and application data before database operations
 */

export class ValidationService {
  /**
   * Validate candidate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (flexible international)
   */
  static isValidPhone(phone) {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate candidate data
   */
  static validateCandidate(data) {
    const errors = [];

    // Required fields
    if (!data.email || typeof data.email !== 'string') {
      errors.push('Email is required and must be a string');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Email format is invalid');
    }

    if (!data.first_name || typeof data.first_name !== 'string') {
      errors.push('First name is required and must be a string');
    } else if (data.first_name.length < 2) {
      errors.push('First name must be at least 2 characters');
    }

    if (!data.last_name || typeof data.last_name !== 'string') {
      errors.push('Last name is required and must be a string');
    } else if (data.last_name.length < 2) {
      errors.push('Last name must be at least 2 characters');
    }

    // Optional fields
    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Phone number format is invalid');
    }

    if (data.linkedin_url) {
      if (!data.linkedin_url.includes('linkedin.com')) {
        errors.push('LinkedIn URL must be a valid LinkedIn profile URL');
      }
    }

    if (data.location && typeof data.location !== 'string') {
      errors.push('Location must be a string');
    }

    if (data.source && !['linkedin', 'indeed', 'manual_upload', 'job_board', 'referral'].includes(data.source)) {
      errors.push('Invalid source. Must be one of: linkedin, indeed, manual_upload, job_board, referral');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate job posting data
   */
  static validateJob(data) {
    const errors = [];

    if (!data.title || typeof data.title !== 'string') {
      errors.push('Job title is required and must be a string');
    } else if (data.title.length < 3) {
      errors.push('Job title must be at least 3 characters');
    }

    if (!data.department || typeof data.department !== 'string') {
      errors.push('Department is required and must be a string');
    }

    if (data.description && typeof data.description !== 'string') {
      errors.push('Description must be a string');
    }

    if (data.location && typeof data.location !== 'string') {
      errors.push('Location must be a string');
    }

    if (data.salary_min !== undefined && data.salary_min !== null) {
      const salaryMin = parseFloat(data.salary_min);
      if (isNaN(salaryMin) || salaryMin < 0) {
        errors.push('Minimum salary must be a positive number');
      }
    }

    if (data.salary_max !== undefined && data.salary_max !== null) {
      const salaryMax = parseFloat(data.salary_max);
      if (isNaN(salaryMax) || salaryMax < 0) {
        errors.push('Maximum salary must be a positive number');
      }
    }

    // Check salary range logic
    if (data.salary_min && data.salary_max) {
      if (parseFloat(data.salary_min) > parseFloat(data.salary_max)) {
        errors.push('Minimum salary cannot be greater than maximum salary');
      }
    }

    if (data.experience_years !== undefined && data.experience_years !== null) {
      const years = parseInt(data.experience_years);
      if (isNaN(years) || years < 0 || years > 100) {
        errors.push('Experience years must be a number between 0 and 100');
      }
    }

    if (data.required_skills && !Array.isArray(data.required_skills)) {
      errors.push('Required skills must be an array');
    }

    if (data.status && !['open', 'closed', 'on_hold'].includes(data.status)) {
      errors.push('Invalid status. Must be one of: open, closed, on_hold');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate application data
   */
  static validateApplication(data) {
    const errors = [];

    if (!data.candidate_id || typeof data.candidate_id !== 'string') {
      errors.push('Candidate ID is required and must be a string');
    }

    if (!data.job_id || typeof data.job_id !== 'string') {
      errors.push('Job ID is required and must be a string');
    }

    if (data.status && !['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'].includes(data.status)) {
      errors.push('Invalid status. Must be one of: applied, screening, interview, offer, hired, rejected');
    }

    if (data.notes && typeof data.notes !== 'string') {
      errors.push('Notes must be a string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate file upload
   */
  static validateFileUpload(file) {
    const errors = [];

    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileExt = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      errors.push(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`);
    }

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      errors.push(`File size exceeds maximum limit of 10MB`);
    }

    if (file.size === 0) {
      errors.push('File is empty');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize candidate data (remove dangerous content)
   */
  static sanitizeCandidate(data) {
    return {
      email: data.email ? String(data.email).trim() : null,
      phone: data.phone ? String(data.phone).trim() : null,
      first_name: data.first_name ? String(data.first_name).trim() : null,
      last_name: data.last_name ? String(data.last_name).trim() : null,
      location: data.location ? String(data.location).trim() : null,
      linkedin_url: data.linkedin_url ? String(data.linkedin_url).trim() : null,
      source: data.source ? String(data.source).toLowerCase().trim() : 'manual_upload',
      notes: data.notes ? String(data.notes).trim() : null
    };
  }

  /**
   * Sanitize job data
   */
  static sanitizeJob(data) {
    return {
      title: data.title ? String(data.title).trim() : null,
      description: data.description ? String(data.description).trim() : null,
      department: data.department ? String(data.department).trim() : null,
      location: data.location ? String(data.location).trim() : null,
      salary_min: data.salary_min ? parseFloat(data.salary_min) : null,
      salary_max: data.salary_max ? parseFloat(data.salary_max) : null,
      experience_years: data.experience_years ? parseInt(data.experience_years) : null,
      required_skills: Array.isArray(data.required_skills) 
        ? data.required_skills.map(s => String(s).trim()) 
        : [],
      status: data.status ? String(data.status).toLowerCase() : 'open'
    };
  }
}

export default ValidationService;
