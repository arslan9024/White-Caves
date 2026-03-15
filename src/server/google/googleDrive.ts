import { google } from 'googleapis';
import https from 'https';
import { GaxiosResponse } from 'gaxios';

interface ConnectionSettings {
  settings?: {
    access_token?: string;
    expires_at?: string;
    oauth?: {
      credentials?: {
        access_token?: string;
      };
    };
  };
}

interface FileMetadata {
  name: string;
  parents?: string[];
  mimeType?: string;
}

interface GoogleFile {
  id?: string;
  name?: string;
  mimeType?: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

interface GoogleDriveListResponse {
  files?: GoogleFile[];
}

let connectionSettings: ConnectionSettings | null = null;

function fetchJson(
  url: string,
  options: { headers?: Record<string, string> } = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse JSON response'));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function getAccessToken(): Promise<string> {
  if (
    connectionSettings &&
    connectionSettings.settings?.expires_at &&
    new Date(connectionSettings.settings.expires_at).getTime() > Date.now()
  ) {
    return connectionSettings.settings.access_token || '';
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  const data = await fetchJson(
    'https://' +
      hostname +
      '/api/v2/connection?include_secrets=true&connector_names=google-drive',
    {
      headers: {
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  );

  connectionSettings = data.items?.[0];
  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Drive not connected');
  }
  return accessToken;
}

export async function getGoogleDriveClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

export async function uploadToDrive(
  fileName: string,
  fileContent: Buffer | string,
  mimeType: string = 'application/pdf',
  folderId: string | null = null
): Promise<GoogleFile> {
  const drive = await getGoogleDriveClient();

  const fileMetadata: FileMetadata = {
    name: fileName,
    ...(folderId && { parents: [folderId] }),
  };

  const media = {
    mimeType: mimeType,
    body: fileContent,
  };

  const response: GaxiosResponse<GoogleFile> = await drive.files.create({
    requestBody: fileMetadata,
    media: media as any,
    fields: 'id, name, webViewLink, webContentLink',
  });

  return response.data;
}

export async function createFolder(
  folderName: string,
  parentFolderId: string | null = null
): Promise<GoogleFile> {
  const drive = await getGoogleDriveClient();

  const fileMetadata: FileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    ...(parentFolderId && { parents: [parentFolderId] }),
  };

  const response: GaxiosResponse<GoogleFile> = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, webViewLink',
  });

  return response.data;
}

export async function listFiles(
  folderId: string | null = null,
  pageSize: number = 20
): Promise<GoogleFile[] | undefined> {
  const drive = await getGoogleDriveClient();

  let query = 'trashed = false';
  if (folderId) {
    query += ` and '${folderId}' in parents`;
  }

  const response: GaxiosResponse<GoogleDriveListResponse> = await drive.files.list({
    q: query,
    pageSize: pageSize,
    fields: 'files(id, name, mimeType, webViewLink, createdTime, modifiedTime)',
  });

  return response.data.files;
}
