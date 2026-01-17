/**
 * Input Validation Middleware
 * Centralized validation for all inventory and sourcing endpoints
 * Prevents invalid data from reaching the database
 */

import { body, param, query, validationResult } from 'express-validator';

// Validation error handler middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Property Details Validators
export const validatePropertyDetails = [
  body('pNumber')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Property number must be a non-empty string'),
  
  body('propertyType')
    .optional()
    .isIn(['villa', 'apartment', 'townhouse', 'penthouse', 'duplex', 'studio', 'plot', 'chalet', 'other'])
    .withMessage('Invalid property type'),
  
  body('location')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Location must be a non-empty string'),
  
  body('bedrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be between 0 and 20'),
  
  body('bathrooms')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Bathrooms must be between 0 and 20'),
  
  body('area')
    .optional()
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('Area must be a positive number'),
  
  body('price')
    .optional()
    .isFloat({ min: 0, max: 100000000 })
    .withMessage('Price must be a valid positive number'),
  
  body('currency')
    .optional()
    .isIn(['AED', 'USD', 'EUR'])
    .withMessage('Currency must be AED, USD, or EUR'),
  
  body('furnishing')
    .optional()
    .isIn(['furnished', 'semi_furnished', 'unfurnished'])
    .withMessage('Furnishing must be furnished, semi_furnished, or unfurnished'),
  
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  
  body('features.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each feature must be a non-empty string'),
];

// Owner/Contact Validators
export const validateOwnerInfo = [
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('phone')
    .optional()
    .matches(/^(\+971|0)(\d{9})$/)
    .withMessage('Phone must be valid UAE format (+971XXXXXXXXX or 0XXXXXXXXX)'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email must be valid'),
  
  body('ownershipType')
    .optional()
    .isIn(['direct_owner', 'property_manager', 'broker'])
    .withMessage('Ownership type must be direct_owner, property_manager, or broker'),
];

// Opportunity/Status Validators
export const validateOpportunityStatus = [
  body('status')
    .isIn(['initial_detection', 'waiting_for_photos', 'partially_verified', 'fully_verified', 'archived', 'listed'])
    .withMessage('Invalid verification status'),
  
  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
];

// ID Validators
export const validateMongoId = [
  param('id')
    .matches(/^[a-f\d]{24}$|^[a-z0-9_]+$/i)
    .withMessage('Invalid ID format'),
];

// Pagination Validators
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Page must be between 1 and 10000'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'price_asc', 'price_desc', 'confidence'])
    .withMessage('Invalid sort option'),
];

// Search Validators
export const validatePropertySearch = [
  query('q')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Search query must be between 1 and 500 characters'),
  
  query('type')
    .optional()
    .isString()
    .trim()
    .withMessage('Type must be a string'),
  
  query('location')
    .optional()
    .isString()
    .trim()
    .withMessage('Location must be a string'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max price must be a positive number'),
  
  query('minArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min area must be a positive number'),
  
  query('maxArea')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max area must be a positive number'),
];

// Conversation/Analysis Validators
export const validateConversation = [
  body('messages')
    .isArray({ min: 1 })
    .withMessage('Messages must be a non-empty array'),
  
  body('messages.*.content')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message content must be between 1 and 5000 characters'),
  
  body('chatId')
    .optional()
    .isString()
    .trim()
    .withMessage('Chat ID must be a string'),
];

// Combined validators for common endpoints
export const validateCreateOpportunity = [
  ...validateConversation,
  ...validatePropertyDetails,
  ...validateOwnerInfo,
];

export const validateUpdateProperty = [
  ...validatePropertyDetails,
  ...validatePagination,
];

export const validatePropertySearch_Combined = [
  ...validatePropertySearch,
  ...validatePagination,
];

export const validateUpdateStatus = [
  ...validateOpportunityStatus,
];
