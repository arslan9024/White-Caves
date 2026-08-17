/**
 * UAE PDPL & RERA Compliant PII Masking & Redaction Utility
 * White Caves Real Estate LLC — Data Governance Engine
 */

/**
 * Masks phone numbers keeping country code and last 4 digits
 * e.g., "+971505760056" -> "+971 50 *** 0056"
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length <= 6) return '***';
  
  const prefix = cleaned.slice(0, cleaned.length - 4);
  const suffix = cleaned.slice(-4);
  const maskedPrefix = prefix.length > 4 ? prefix.slice(0, 4) + ' *** ' : '*** ';
  return `${maskedPrefix}${suffix}`;
}

/**
 * Masks emails keeping first character and domain
 * e.g., "arslanmalikgoraha@gmail.com" -> "a***a@gmail.com"
 */
export function maskEmail(email?: string | null): string {
  if (!email || !email.includes('@')) return '';
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  const first = localPart[0];
  const last = localPart[localPart.length - 1];
  return `${first}***${last}@${domain}`;
}

/**
 * Masks Emirates ID (UAE format: 784-YYYY-XXXXXXX-Z)
 * e.g., "784-1990-1234567-1" -> "784-****-*****67-1"
 */
export function maskEmiratesId(eid?: string | null): string {
  if (!eid) return '';
  const digits = eid.replace(/\D/g, '');
  if (digits.length !== 15) {
    return '784-****-*****-*';
  }
  const prefix = digits.slice(0, 3); // 784
  const lastSuffix = digits.slice(-3); // 67-1
  return `${prefix}-****-******${lastSuffix.slice(0, 2)}-${lastSuffix.slice(2)}`;
}

/**
 * Masks UAE IBAN (e.g. AE070331234567890123456)
 */
export function maskIban(iban?: string | null): string {
  if (!iban) return '';
  const cleaned = iban.replace(/\s+/g, '').toUpperCase();
  if (cleaned.length < 10) return 'AE** **** **** ****';
  const prefix = cleaned.slice(0, 4); // AE07
  const suffix = cleaned.slice(-4); // 3456
  return `${prefix} **** **** **** ${suffix}`;
}

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /authorization/i,
  /credit_?card/i,
  /cvv/i,
  /emirates_?id/i,
  /passport/i,
  /iban/i,
];

/**
 * Recursively redacts sensitive keys from log and telemetry payloads
 */
export function redactPiiFromObject<T = unknown>(target: T): T {
  if (target === null || typeof target !== 'object') {
    return target;
  }

  if (Array.isArray(target)) {
    return target.map((item) => redactPiiFromObject(item)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(target as Record<string, unknown>)) {
    const isSensitive = SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));

    if (isSensitive) {
      result[key] = '[REDACTED_PII]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = redactPiiFromObject(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
