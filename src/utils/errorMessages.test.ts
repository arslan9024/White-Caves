import { describe, it, expect } from 'vitest';
import { ERROR_MESSAGES, getErrorMessage } from './errorMessages';

// ─── ERROR_MESSAGES constant ──────────────────────────────────────
describe('ERROR_MESSAGES', () => {
  describe('top-level messages', () => {
    it('has NETWORK_ERROR', () => {
      expect(ERROR_MESSAGES.NETWORK_ERROR).toContain('connect');
    });

    it('has SERVER_ERROR', () => {
      expect(ERROR_MESSAGES.SERVER_ERROR).toContain('wrong');
    });

    it('has VALIDATION_ERROR', () => {
      expect(ERROR_MESSAGES.VALIDATION_ERROR).toContain('check');
    });

    it('has AUTHENTICATION_REQUIRED', () => {
      expect(ERROR_MESSAGES.AUTHENTICATION_REQUIRED).toContain('sign in');
    });

    it('has UNAUTHORIZED', () => {
      expect(ERROR_MESSAGES.UNAUTHORIZED).toContain('permission');
    });

    it('has NOT_FOUND', () => {
      expect(ERROR_MESSAGES.NOT_FOUND).toContain('not found');
    });

    it('all top-level messages are non-empty strings', () => {
      const topLevel = ['NETWORK_ERROR', 'SERVER_ERROR', 'VALIDATION_ERROR', 'AUTHENTICATION_REQUIRED', 'UNAUTHORIZED', 'NOT_FOUND'] as const;
      topLevel.forEach((key) => {
        expect(typeof ERROR_MESSAGES[key]).toBe('string');
        expect(ERROR_MESSAGES[key].length).toBeGreaterThan(0);
      });
    });
  });

  describe('category structure', () => {
    it.each([
      'AUTH',
      'PROPERTY',
      'APPOINTMENT',
      'PAYMENT',
      'TENANCY',
      'FORM',
      'FILE',
      'DATABASE',
    ] as const)('has %s category with at least one message', (category) => {
      const cat = ERROR_MESSAGES[category];
      expect(typeof cat).toBe('object');
      expect(Object.keys(cat).length).toBeGreaterThan(0);
      Object.values(cat).forEach((msg) => {
        expect(typeof msg).toBe('string');
        expect(msg.length).toBeGreaterThan(0);
      });
    });
  });

  describe('AUTH messages', () => {
    it('has LOGIN_FAILED', () => {
      expect(ERROR_MESSAGES.AUTH.LOGIN_FAILED).toContain('Login failed');
    });
    it('has SIGNUP_FAILED', () => {
      expect(ERROR_MESSAGES.AUTH.SIGNUP_FAILED).toContain('creation failed');
    });
    it('has SESSION_EXPIRED', () => {
      expect(ERROR_MESSAGES.AUTH.SESSION_EXPIRED).toContain('expired');
    });
    it('has INVALID_CREDENTIALS', () => {
      expect(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS).toContain('Invalid');
    });
  });

  describe('PROPERTY messages', () => {
    it('covers full CRUD', () => {
      expect(ERROR_MESSAGES.PROPERTY.LOAD_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.PROPERTY.CREATE_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.PROPERTY.UPDATE_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.PROPERTY.DELETE_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.PROPERTY.NOT_FOUND).toBeDefined();
    });
  });

  describe('FORM messages', () => {
    it('has validation messages', () => {
      expect(ERROR_MESSAGES.FORM.REQUIRED_FIELD).toBeDefined();
      expect(ERROR_MESSAGES.FORM.INVALID_EMAIL).toContain('email');
      expect(ERROR_MESSAGES.FORM.INVALID_PHONE).toContain('phone');
      expect(ERROR_MESSAGES.FORM.PASSWORD_TOO_SHORT).toContain('8 characters');
      expect(ERROR_MESSAGES.FORM.PASSWORDS_DONT_MATCH).toContain('match');
    });
  });

  describe('FILE messages', () => {
    it('has upload, type, and size limits', () => {
      expect(ERROR_MESSAGES.FILE.UPLOAD_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.FILE.INVALID_TYPE).toBeDefined();
      expect(ERROR_MESSAGES.FILE.TOO_LARGE).toContain('5MB');
    });
  });
});

// ─── getErrorMessage ──────────────────────────────────────────────
describe('getErrorMessage', () => {
  describe('falsy / null / undefined input', () => {
    it('returns SERVER_ERROR for null', () => {
      expect(getErrorMessage(null)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('returns SERVER_ERROR for undefined', () => {
      expect(getErrorMessage(undefined)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('returns SERVER_ERROR for empty string', () => {
      expect(getErrorMessage('')).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('returns SERVER_ERROR for 0', () => {
      expect(getErrorMessage(0)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('returns SERVER_ERROR for false', () => {
      expect(getErrorMessage(false)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });
  });

  describe('response with data message', () => {
    it('returns response.data.message when present', () => {
      const error = {
        response: { status: 400, data: { message: 'Custom server message' } },
      };
      expect(getErrorMessage(error)).toBe('Custom server message');
    });

    it('returns response.data.error when no message', () => {
      const error = {
        response: { status: 500, data: { error: 'Internal error detail' } },
      };
      expect(getErrorMessage(error)).toBe('Internal error detail');
    });

    it('prefers message over status code mapping', () => {
      const error = {
        response: { status: 401, data: { message: 'Token expired' } },
      };
      expect(getErrorMessage(error)).toBe('Token expired');
    });
  });

  describe('HTTP status code mapping', () => {
    it('maps 400 to VALIDATION_ERROR', () => {
      const error = { response: { status: 400, data: {} } };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.VALIDATION_ERROR);
    });

    it('maps 401 to AUTHENTICATION_REQUIRED', () => {
      const error = { response: { status: 401, data: {} } };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.AUTHENTICATION_REQUIRED);
    });

    it('maps 403 to UNAUTHORIZED', () => {
      const error = { response: { status: 403, data: {} } };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('maps 404 to NOT_FOUND', () => {
      const error = { response: { status: 404, data: {} } };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.NOT_FOUND);
    });

    it('maps 500 to SERVER_ERROR', () => {
      const error = { response: { status: 500, data: {} } };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('maps unknown status codes to SERVER_ERROR', () => {
      const error = { response: { status: 503, data: {} } };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('maps 422 to SERVER_ERROR (unmapped code)', () => {
      const error = { response: { status: 422, data: {} } };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });
  });

  describe('network errors (request but no response)', () => {
    it('returns NETWORK_ERROR when request exists but no response', () => {
      const error = { request: new XMLHttpRequest() };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.NETWORK_ERROR);
    });

    it('returns NETWORK_ERROR for request object (plain obj)', () => {
      const error = { request: {} };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('errors with message property', () => {
    it('returns error.message for generic Error', () => {
      expect(getErrorMessage(new Error('Something broke'))).toBe('Something broke');
    });

    it('returns error.message for plain object', () => {
      expect(getErrorMessage({ message: 'Custom message' })).toBe('Custom message');
    });
  });

  describe('fallbacks', () => {
    it('returns SERVER_ERROR for unknown object shape', () => {
      expect(getErrorMessage({ foo: 'bar' })).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('returns SERVER_ERROR for number', () => {
      expect(getErrorMessage(42)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('returns SERVER_ERROR for boolean true', () => {
      // truthy → enters function → no .response, no .request, no .message
      expect(getErrorMessage(true)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });
  });

  describe('edge cases', () => {
    it('handles response with no data', () => {
      const error = { response: { status: 404 } };
      // data is undefined, message extraction should not throw
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.NOT_FOUND);
    });

    it('handles response with empty data', () => {
      const error = { response: { status: 400, data: {} } };
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.VALIDATION_ERROR);
    });

    it('handles error with both response and message', () => {
      const error = {
        response: { status: 500, data: { message: 'DB down' } },
        message: 'Axios error',
      };
      // response.data.message takes priority
      expect(getErrorMessage(error)).toBe('DB down');
    });

    it('handles error with response and request properties', () => {
      const error = {
        response: { status: 404, data: {} },
        request: {},
      };
      // response takes priority over request
      expect(getErrorMessage(error)).toBe(ERROR_MESSAGES.NOT_FOUND);
    });
  });
});
