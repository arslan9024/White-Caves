/**
 * Request Validation Middleware
 * Validates request parameters, body, and query
 */

/**
 * Validate request data
 * @param {string} location - 'body', 'params', or 'query'
 * @param {Object} schema - Validation schema
 */
const validateRequest = (location, schema) => {
  return (req, res, next) => {
    try {
      const data = req[location];

      // Validate each field in schema
      const errors = [];

      Object.keys(schema).forEach((key) => {
        const rule = schema[key];
        const value = data[key];

        // Check if required
        if (rule.required && (value === undefined || value === null || value === '')) {
          errors.push(`${key} is required`);
          return;
        }

        // Skip validation if not required and no value
        if (!rule.required && (value === undefined || value === null)) {
          return;
        }

        // Check type
        if (rule.type) {
          const actualType = Array.isArray(value) ? 'array' : typeof value;
          if (actualType !== rule.type) {
            errors.push(
              `${key} must be of type ${rule.type}, got ${actualType}`
            );
          }
        }

        // Check enum
        if (rule.enum && !rule.enum.includes(value)) {
          errors.push(
            `${key} must be one of: ${rule.enum.join(', ')}`
          );
        }

        // Check minimum length
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(
            `${key} must be at least ${rule.minLength} characters`
          );
        }

        // Check maximum length
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(
            `${key} must be at most ${rule.maxLength} characters`
          );
        }

        // Check minimum value
        if (rule.min !== undefined && value < rule.min) {
          errors.push(`${key} must be at least ${rule.min}`);
        }

        // Check maximum value
        if (rule.max !== undefined && value > rule.max) {
          errors.push(`${key} must be at most ${rule.max}`);
        }
      });

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
          timestamp: new Date().toISOString(),
        });
      }

      next();
    } catch (error) {
      console.error('[ValidationMiddleware] Validation error:', error);

      res.status(500).json({
        success: false,
        error: 'Validation error',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

module.exports = {
  validateRequest,
};
