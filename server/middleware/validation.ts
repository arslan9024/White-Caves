/**
 * Input Validation Middleware
 * Centralized validation for all inventory and sourcing endpoints
 * Prevents invalid data from reaching the database
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Validation error handler middleware
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const errors: ValidationErrorDetail[] = (req as Request & { _validationErrors?: ValidationErrorDetail[] })._validationErrors || [];
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
  }
  next();
};

/**
 * Property Details Validator Middleware
 */
export const validatePropertyDetails = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: ValidationErrorDetail[] = [];
  const { propertyType, bedrooms, bathrooms, area, price, currency, furnishing, features } = req.body || {};

  if (propertyType && !['villa', 'apartment', 'townhouse', 'penthouse', 'duplex', 'studio', 'plot', 'chalet', 'other'].includes(propertyType)) {
    errors.push({ field: 'propertyType', message: 'Invalid property type', value: propertyType });
  }

  if (bedrooms !== undefined && (typeof bedrooms !== 'number' || bedrooms < 0 || bedrooms > 20)) {
    errors.push({ field: 'bedrooms', message: 'Bedrooms must be between 0 and 20', value: bedrooms });
  }

  if (bathrooms !== undefined && (typeof bathrooms !== 'number' || bathrooms < 0 || bathrooms > 20)) {
    errors.push({ field: 'bathrooms', message: 'Bathrooms must be between 0 and 20', value: bathrooms });
  }

  if (area !== undefined && (typeof area !== 'number' || area < 0 || area > 1000000)) {
    errors.push({ field: 'area', message: 'Area must be a positive number', value: area });
  }

  if (price !== undefined && (typeof price !== 'number' || price < 0 || price > 1000000000)) {
    errors.push({ field: 'price', message: 'Price must be a valid positive number', value: price });
  }

  if (currency && !['AED', 'USD', 'EUR', 'GBP'].includes(currency)) {
    errors.push({ field: 'currency', message: 'Currency must be AED, USD, EUR, or GBP', value: currency });
  }

  if (furnishing && !['furnished', 'semi_furnished', 'unfurnished'].includes(furnishing)) {
    errors.push({ field: 'furnishing', message: 'Furnishing must be furnished, semi_furnished, or unfurnished', value: furnishing });
  }

  if (features !== undefined && !Array.isArray(features)) {
    errors.push({ field: 'features', message: 'Features must be an array', value: features });
  }

  if (errors.length > 0) {
    (req as Request & { _validationErrors?: ValidationErrorDetail[] })._validationErrors = errors;
  }
  next();
};

/**
 * Owner Info Validator Middleware
 */
export const validateOwnerInfo = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: ValidationErrorDetail[] = [];
  const { name, phone, email, ownershipType } = req.body || {};

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100)) {
    errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters', value: name });
  }

  if (phone !== undefined && typeof phone === 'string' && !/^(\+971|0)(\d{9})$/.test(phone.trim())) {
    errors.push({ field: 'phone', message: 'Phone must be valid UAE format (+971XXXXXXXXX or 0XXXXXXXXX)', value: phone });
  }

  if (email !== undefined && typeof email === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push({ field: 'email', message: 'Email must be valid', value: email });
  }

  if (ownershipType && !['direct_owner', 'property_manager', 'broker'].includes(ownershipType)) {
    errors.push({ field: 'ownershipType', message: 'Ownership type must be direct_owner, property_manager, or broker', value: ownershipType });
  }

  if (errors.length > 0) {
    const existing = (req as Request & { _validationErrors?: ValidationErrorDetail[] })._validationErrors || [];
    (req as Request & { _validationErrors?: ValidationErrorDetail[] })._validationErrors = [...existing, ...errors];
  }
  next();
};

/**
 * Opportunity Status Validator Middleware
 */
export const validateOpportunityStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: ValidationErrorDetail[] = [];
  const { status, notes } = req.body || {};

  if (status && !['initial_detection', 'waiting_for_photos', 'partially_verified', 'fully_verified', 'archived', 'listed'].includes(status)) {
    errors.push({ field: 'status', message: 'Invalid verification status', value: status });
  }

  if (notes !== undefined && (typeof notes !== 'string' || notes.length > 1000)) {
    errors.push({ field: 'notes', message: 'Notes must not exceed 1000 characters', value: notes });
  }

  if (errors.length > 0) {
    const existing = (req as Request & { _validationErrors?: ValidationErrorDetail[] })._validationErrors || [];
    (req as Request & { _validationErrors?: ValidationErrorDetail[] })._validationErrors = [...existing, ...errors];
  }
  next();
};

export const validateCreateOpportunity = [validatePropertyDetails, validateOwnerInfo, handleValidationErrors];
export const validateUpdateProperty = [validatePropertyDetails, handleValidationErrors];
export const validateUpdateStatus = [validateOpportunityStatus, handleValidationErrors];
