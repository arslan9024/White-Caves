/**
 * Google Drive helper stubs.
 *
 * These helpers are imported by contract routes and server startup.
 * In environments without Drive credentials/integration wiring,
 * they fail gracefully with explicit errors.
 */

const notConfiguredError = operation =>
  new Error(`Google Drive integration is not configured for operation: ${operation}`);

export async function uploadToDrive(_fileName, _stream, _mimeType) {
  throw notConfiguredError('uploadToDrive');
}

export async function createFolder(_folderName, _parentFolderId = null) {
  throw notConfiguredError('createFolder');
}

export async function listFiles(_folderId = null) {
  throw notConfiguredError('listFiles');
}
