/**
 * RouteGuard.ts — Route Bounds & Access Control Validator
 *
 * Validates dynamic route parameter formats (UUID, Slugs, View IDs)
 * and guards against invalid route bounds across Sales, Leasing, and Finance.
 */

export interface RouteValidationResult {
  isValid: boolean;
  cleanParam: string;
  errorReason?: string;
}

export function validateViewCode(code: string): RouteValidationResult {
  if (!code) return { isValid: false, cleanParam: 'VIEW-01', errorReason: 'Missing View Code' };
  const cleaned = code.trim().toUpperCase();
  const match = /^VIEW-(0[1-9]|[1-9][0-9]|100)$/.test(cleaned);
  return {
    isValid: match,
    cleanParam: match ? cleaned : 'VIEW-01',
    errorReason: match ? undefined : `Invalid View Code format: ${code}`,
  };
}

export function validateEntityId(id: string): RouteValidationResult {
  if (!id) return { isValid: false, cleanParam: '', errorReason: 'Empty Entity ID' };
  const cleaned = id.trim();
  // Validates standard UUID or numeric ID strings
  const isValid = /^[a-f0-9-]{8,36}$/i.test(cleaned) || /^\d+$/.test(cleaned);
  return {
    isValid,
    cleanParam: cleaned,
    errorReason: isValid ? undefined : 'Entity ID fails format bounds',
  };
}
