import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'node:crypto';
import { vaultKey } from './documentVault.js';
import { AppError } from '../../middleware/errorHandler.js';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('HenryDriveCrypto');

export function driveHash(value: string): string {
  return createHmac('sha256', vaultKey()).update(`henry-drive:${value}`).digest('hex');
}
export function sealDrive(value: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(vaultKey(), 'hex'), iv);
  const bytes = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), bytes].map(part => part.toString('base64')).join('.');
}
export function openDrive<T>(value: string): T {
  try {
    const [iv, tag, bytes] = value.split('.').map(part => Buffer.from(part, 'base64'));
    const decipher = createDecipheriv('aes-256-gcm', Buffer.from(vaultKey(), 'hex'), iv);
    decipher.setAuthTag(tag);
    return JSON.parse(Buffer.concat([decipher.update(bytes), decipher.final()]).toString('utf8')) as T;
  } catch {
    log.error('Drive encrypted storage could not be decrypted');
    throw new AppError('Encrypted Drive storage unavailable', 503);
  }
}
