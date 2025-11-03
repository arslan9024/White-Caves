import { ValidationError } from '../../utils/errors.js';

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
  return true;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phone || !phoneRegex.test(phone)) {
    throw new ValidationError('Invalid phone number format', 'phone');
  }
  return true;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
  return true;
};

export const validateDate = (date, fieldName = 'date') => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new ValidationError(`Invalid ${fieldName}`, fieldName);
  }
  return true;
};

export const validateAmount = (amount, fieldName = 'amount') => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new ValidationError(`Invalid ${fieldName}. Must be a positive number`, fieldName);
  }
  return true;
};

export const validateObjectId = (id, fieldName = 'ID') => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(id)) {
    throw new ValidationError(`Invalid ${fieldName} format`, fieldName);
  }
  return true;
};

export const validateRequestBody = (requiredFields) => {
  return (req, res, next) => {
    try {
      const missingFields = [];
      
      for (const field of requiredFields) {
        if (!req.body[field]) {
          missingFields.push(field);
        }
      }
      
      if (missingFields.length > 0) {
        throw new ValidationError(
          `Missing required fields: ${missingFields.join(', ')}`,
          missingFields[0]
        );
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
