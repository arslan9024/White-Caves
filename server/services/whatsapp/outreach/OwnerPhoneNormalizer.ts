/**
 * Normalizes owner phone cells into E.164 digits without '+'.
 * Optimized for UAE numbers (+971).
 */

const PIPE = /^\+?(\d{1,4})\s*\|\s*(.*)$/;

export const DO_NOT_CONTACT =
  /no\s*wh?a?ts?app|wrong|not valid|incorrect|not correct|not in (use|service)|out of service|blocked|need new owner|disconnected|not working/i;

export interface NormalizedPhoneResult {
  ok: boolean;
  digits?: string;
  country?: string;
  error?: string;
}

export function candidateDigits(raw: string | number | null | undefined): string {
  const text = String(raw ?? '').trim();
  if (!text) return '';
  const pipe = PIPE.exec(text);
  if (pipe) {
    const code = pipe[1];
    const national = pipe[2].replace(/\D/g, '').replace(/^0+/, '');
    if (national.length < 6) return '';
    if (national.startsWith(code) && national.length > 10) return national;
    return code + national;
  }
  let digits = text.replace(/\D/g, '');
  if (!digits || /^0+$/.test(digits)) return '';
  if (digits.startsWith('00')) digits = digits.slice(2);
  else if (digits.startsWith('0')) {
    digits = digits.length === 10 || digits.length === 9 ? `971${digits.slice(1)}` : digits.slice(1);
  } else if (digits.length === 9) {
    digits = `971${digits}`;
  }
  return digits;
}

export function normalizeOwnerPhone(raw: string | number | null | undefined): NormalizedPhoneResult {
  const text = String(raw ?? '').trim();
  if (!text) {
    return { ok: false, error: 'Empty phone number' };
  }
  if (DO_NOT_CONTACT.test(text)) {
    return { ok: false, error: 'Marked as DO_NOT_CONTACT' };
  }

  const digits = candidateDigits(text);
  if (!digits || digits.length < 8) {
    return { ok: false, error: 'Insufficient digits' };
  }

  // UAE landline detection: 04, 02, 06, 07, 09
  if (digits.startsWith('971') && (digits.startsWith('9714') || digits.startsWith('9712') || digits.startsWith('9716') || digits.startsWith('9717') || digits.startsWith('9719'))) {
    if (digits.length === 11) {
      return { ok: false, error: 'UAE landline number rejected' };
    }
  }

  // UAE mobile verification: 971 50 / 52 / 54 / 55 / 56 / 58
  if (digits.startsWith('9715') && digits.length === 12) {
    return { ok: true, digits, country: 'AE' };
  }

  // General international mobile
  if (digits.length >= 10 && digits.length <= 15) {
    return { ok: true, digits, country: digits.startsWith('971') ? 'AE' : undefined };
  }

  return { ok: false, error: 'Invalid mobile number format' };
}

