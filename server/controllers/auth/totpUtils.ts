/**
 * TOTP (RFC 6238) and HOTP (RFC 4226) Cryptographic Utilities
 * Zero external dependencies. Single Purpose: 2FA One-Time Passwords
 */

import crypto from 'node:crypto';

/** Encode a buffer as a base32 string (RFC 4648, no padding). */
export function base32Encode(buf: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';
  for (let i = 0; i < buf.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    value = (value << 8) | buf[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      output += alphabet[(value >>> bits) & 0x1f];
    }
  }
  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 0x1f];
  }
  return output;
}

/** Decode a base32 string to Buffer. */
export function base32Decode(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = encoded.toUpperCase().replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const idx = alphabet.indexOf(char);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >>> bits) & 0xff);
    }
  }
  return Buffer.from(bytes);
}

/**
 * Compute a HOTP value from key + counter (RFC 4226).
 * Returns a 6-digit string.
 */
export function hotpCode(key: Buffer, counter: bigint): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(counter);
  const hmac = crypto.createHmac('sha1', key).update(msg).digest();
  const offset = hmac[19] & 0x0f;
  // Extract 4 bytes at the dynamic offset — safe: offset is 0–15, hmac is 20 bytes
  // eslint-disable-next-line security/detect-object-injection
  const b = [hmac[offset], hmac[offset + 1], hmac[offset + 2], hmac[offset + 3]] as const;
  const code =
    (((b[0] & 0x7f) << 24) | ((b[1] & 0xff) << 16) | ((b[2] & 0xff) << 8) | (b[3] & 0xff)) %
    1_000_000;
  return code.toString().padStart(6, '0');
}

export const TOTP_STEP = 30; // seconds per time step
export const TOTP_WINDOW = 1; // ± 1 step tolerance

/**
 * Verify a TOTP code against a base32-encoded secret.
 * Allows ±TOTP_WINDOW steps of clock drift.
 */
export function verifyTOTP(secret: string, userCode: string): boolean {
  if (!/^\d{6}$/.test(userCode)) return false;
  const key = base32Decode(secret);
  const counter = BigInt(Math.floor(Date.now() / 1000 / TOTP_STEP));
  for (let delta = -TOTP_WINDOW; delta <= TOTP_WINDOW; delta++) {
    if (hotpCode(key, counter + BigInt(delta)) === userCode) return true;
  }
  return false;
}

/** Generate a new TOTP secret (20 random bytes → base32). */
export function generateTOTPSecret(): string {
  return base32Encode(crypto.randomBytes(20));
}

/** Generate N one-time backup codes (8 hex chars each). */
export function generateBackupCodes(n = 8): string[] {
  return Array.from({ length: n }, () => crypto.randomBytes(4).toString('hex').toUpperCase());
}
