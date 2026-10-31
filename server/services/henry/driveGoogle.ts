import { auth as googleAuth, drive, type drive_v3 } from 'googleapis/build/src/apis/drive/index.js';
import type { Credentials, OAuth2Client } from 'google-auth-library';
import { AppError } from '../../middleware/errorHandler.js';
import { maxSourceBytes } from './documentVault.js';

export const driveFolderMime = 'application/vnd.google-apps.folder';
export const driveShortcutMime = 'application/vnd.google-apps.shortcut';
export const driveMimes = ['application/pdf', 'image/jpeg', 'image/png'];
const fields = 'id,name,mimeType,parents,trashed,modifiedTime,version,size,md5Checksum';
export type DriveFile = drive_v3.Schema$File;

export function driveConfigured(): boolean {
  return !!(process.env.GOOGLE_DRIVE_CLIENT_ID && process.env.GOOGLE_DRIVE_CLIENT_SECRET &&
    process.env.GOOGLE_DRIVE_REDIRECT_URI);
}
export function driveOAuth(): OAuth2Client {
  if (!driveConfigured()) throw new AppError('Drive setup required: GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET, GOOGLE_DRIVE_REDIRECT_URI and encrypted vault', 503);
  const redirect = new URL(process.env.GOOGLE_DRIVE_REDIRECT_URI!);
  if (redirect.pathname !== '/henry-drive-callback' || redirect.search || redirect.hash ||
    (redirect.protocol !== 'https:' && !(redirect.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(redirect.hostname))))
    throw new AppError('Drive redirect must be the application /henry-drive-callback URL (HTTPS in production)', 503);
  return new googleAuth.OAuth2(process.env.GOOGLE_DRIVE_CLIENT_ID, process.env.GOOGLE_DRIVE_CLIENT_SECRET, redirect.href);
}
export class DriveGoogle {
  private readonly api;
  constructor(auth: OAuth2Client) {
    this.api = drive({ version: 'v3', auth });
  }
  async identity(): Promise<string> {
    const response = await this.api.about.get({ fields: 'user(permissionId,emailAddress)' }, { timeout: 15000, retry: false });
    const user = response.data.user;
    if (!user?.permissionId) throw new AppError('Drive account identity unavailable', 502);
    // Kept inside the encrypted connection payload only.
    return JSON.stringify({ id: user.permissionId, label: user.emailAddress || 'Connected Google account' });
  }
  async metadata(id: string): Promise<DriveFile> {
    return (await this.api.files.get({ fileId: id, fields, supportsAllDrives: true }, { timeout: 15000, retry: false })).data;
  }
  async children(id: string, pageToken?: string): Promise<{ files: DriveFile[]; next?: string; incomplete: boolean }> {
    const response = await this.api.files.list({
      q: `'${id}' in parents and trashed = false`, fields: `nextPageToken,incompleteSearch,files(${fields})`,
      pageSize: 50, pageToken, supportsAllDrives: true, includeItemsFromAllDrives: true,
    }, { timeout: 15000, retry: false });
    return { files: response.data.files || [], next: response.data.nextPageToken || undefined,
      incomplete: response.data.incompleteSearch === true };
  }
  async content(id: string, mime: string): Promise<Buffer> {
    if (!driveMimes.includes(mime)) throw new AppError('Only existing PDF, PNG and JPEG originals are supported; native Google documents are not exported', 415);
    const response = await this.api.files.get({ fileId: id, alt: 'media', supportsAllDrives: true },
      { responseType: 'stream', timeout: 15000, retry: false });
    const chunks: Buffer[] = [];
    let length = 0;
    for await (const chunk of response.data) {
      const bytes = Buffer.from(chunk);
      length += bytes.length;
      if (length > maxSourceBytes) {
        response.data.destroy();
        throw new AppError('Drive original exceeds 4 MB', 413);
      }
      chunks.push(bytes);
    }
    const bytes = Buffer.concat(chunks);
    const actual = bytes.subarray(0, 5).toString() === '%PDF-' ? 'application/pdf'
      : bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? 'image/png'
      : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'image/jpeg' : '';
    if (!length || actual !== mime) throw new AppError('Drive original signature does not match the supported file type', 415);
    return bytes;
  }
}
export type DriveCredentials = Credentials;
