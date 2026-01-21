/**
 * Form Validators Utility
 * Provides validation functions for various form fields
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, error: 'Email is required' };
  if (!emailRegex.test(email)) return { valid: false, error: 'Invalid email format' };
  return { valid: true };
};

// Phone number validation (UAE format)
export const validatePhone = (phone) => {
  // Accept formats: +971501234567, 00971501234567, 0501234567
  const phoneRegex = /^(?:\+971|00971|0)(?:5[0-9]|4|2|3|6|7|9)\d{7}$/;
  if (!phone) return { valid: false, error: 'Phone number is required' };
  const cleanPhone = phone.replace(/\s|-/g, '');
  if (!phoneRegex.test(cleanPhone)) return { valid: false, error: 'Invalid UAE phone format' };
  return { valid: true };
};

// Emirates ID validation (784-XXXX-XXXXXXX-X format)
export const validateEmiratesId = (emiratesId) => {
  const emiratesIdRegex = /^784-\d{4}-\d{7}-\d{1}$/;
  if (!emiratesId) return { valid: false, error: 'Emirates ID is required' };
  if (!emiratesIdRegex.test(emiratesId)) {
    return { valid: false, error: 'Invalid format. Use: 784-XXXX-XXXXXXX-X' };
  }
  return { valid: true };
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
export const validatePassword = (password) => {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Password must contain uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Password must contain lowercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Password must contain number' };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Password must contain special character' };
  }
  return { valid: true };
};

// Required field validation
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
};

// Price validation
export const validatePrice = (price) => {
  if (!price) return { valid: false, error: 'Price is required' };
  const priceNum = parseFloat(price);
  if (isNaN(priceNum)) return { valid: false, error: 'Price must be a number' };
  if (priceNum < 0) return { valid: false, error: 'Price cannot be negative' };
  if (priceNum === 0) return { valid: false, error: 'Price must be greater than 0' };
  return { valid: true };
};

// Number range validation
export const validateRange = (value, min, max, fieldName = 'Value') => {
  const num = parseFloat(value);
  if (isNaN(num)) return { valid: false, error: `${fieldName} must be a number` };
  if (num < min) return { valid: false, error: `${fieldName} must be at least ${min}` };
  if (num > max) return { valid: false, error: `${fieldName} cannot exceed ${max}` };
  return { valid: true };
};

// URL validation
export const validateUrl = (url) => {
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
};

// Min length validation
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value) return { valid: false, error: `${fieldName} is required` };
  if (value.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  return { valid: true };
};

// Max length validation
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value.length > maxLength) {
    return { valid: false, error: `${fieldName} cannot exceed ${maxLength} characters` };
  }
  return { valid: true };
};

// Confirm password validation
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }
  return { valid: true };
};

// Date validation
export const validateDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  return { valid: true };
};

// Future date validation
export const validateFutureDate = (dateString) => {
  const dateValidation = validateDate(dateString);
  if (!dateValidation.valid) return dateValidation;
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) {
    return { valid: false, error: 'Date must be in the future' };
  }
  return { valid: true };
};

// Past date validation
export const validatePastDate = (dateString) => {
  const dateValidation = validateDate(dateString);
  if (!dateValidation.valid) return dateValidation;
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date > today) {
    return { valid: false, error: 'Date must be in the past' };
  }
  return { valid: true };
};

/**
 * Get error message from validation result
 * @param {Object} result - Validation result object
 * @returns {string} Error message or empty string
 */
export const getErrorMessage = (result) => {
  return result?.error || '';
};

/**
 * Validate form object against a schema
 * @param {Object} formData - Form data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation results
 */
export const validateForm = (formData, schema) => {
  const errors = {};
  let isValid = true;

  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(formData[field]);
    if (!result.valid) {
      errors[field] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

/**
 * Example usage:
 * 
 * const schema = {
 *   email: (val) => validateEmail(val),
 *   phone: (val) => validatePhone(val),
 *   password: (val) => validatePassword(val),
 *   emiratesId: (val) => validateEmiratesId(val),
 *   price: (val) => validatePrice(val),
 *   confirmPassword: (val) => validatePasswordMatch(formData.password, val)
 * };
 * 
 * const { isValid, errors } = validateForm(formData, schema);
 */
// ============================================================
// Business Logic Validators for Services
// ============================================================

/**
 * Valid opportunity statuses
 */
export const VALID_OPPORTUNITY_STATUSES = [
  'initial_detection',
  'waiting_for_photos',
  'partially_verified',
  'fully_verified',
  'archived',
  'listed'
];

/**
 * Valid property types
 */
export const VALID_PROPERTY_TYPES = [
  'villa',
  'apartment',
  'townhouse',
  'penthouse',
  'duplex',
  'studio',
  'plot',
  'chalet',
  'other'
];

/**
 * Valid ownership types
 */
export const VALID_OWNERSHIP_TYPES = [
  'direct_owner',
  'property_manager',
  'broker',
  'uncertain'
];

/**
 * Validate an opportunity ID
 * @param {string} id - Opportunity ID to validate
 * @returns {boolean}
 */
export function validateOpportunityId(id) {
  return typeof id === 'string' && id.length > 0;
}

/**
 * Validate a verification status
 * @param {string} status - Status to validate
 * @returns {boolean}
 */
export function validateVerificationStatus(status) {
  return typeof status === 'string' && VALID_OPPORTUNITY_STATUSES.includes(status);
}

/**
 * Validate a property type
 * @param {string} type - Property type to validate
 * @returns {boolean}
 */
export function validatePropertyType(type) {
  return typeof type === 'string' && VALID_PROPERTY_TYPES.includes(type);
}

/**
 * Validate an agent ID
 * @param {string} id - Agent ID to validate
 * @returns {boolean}
 */
export function validateAgentId(id) {
  return typeof id === 'string' && id.length > 0;
}

/**
 * Validate a confidence score
 * @param {number} score - Confidence score to validate
 * @returns {boolean}
 */
export function validateConfidenceScore(score) {
  return typeof score === 'number' && score >= 0 && score <= 100;
}

/**
 * Validate ownership type
 * @param {string} type - Ownership type to validate
 * @returns {boolean}
 */
export function validateOwnershipType(type) {
  return typeof type === 'string' && VALID_OWNERSHIP_TYPES.includes(type);
}