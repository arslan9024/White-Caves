import { google } from 'googleapis';

interface GorahaCheckResult {
  isConfigured: boolean;
  isCredentialValid: boolean;
  apiAccessValid: boolean;
  isSaved: boolean;
  matchedContactName?: string;
  matchedPhone?: string;
  error?: string;
}

function normalizePhone(input: string): string {
  return String(input || '').replace(/\D/g, '');
}

function decodeGorahaCredentials(): Record<string, unknown> | null {
  const raw = process.env.GOOGLE_ACCOUNT_GORAHA_KEYS_BASE64;
  if (!raw) return null;

  const normalized = raw
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\s+/g, '');
  const json = Buffer.from(normalized, 'base64').toString('utf-8').trim();
  return JSON.parse(json) as Record<string, unknown>;
}

function phonesMatch(candidate: string, target: string): boolean {
  if (!candidate || !target) return false;
  if (candidate === target) return true;

  const minSuffix = 9;
  if (candidate.length >= minSuffix && target.length >= minSuffix) {
    return candidate.slice(-minSuffix) === target.slice(-minSuffix);
  }

  return false;
}

export async function checkPhoneSavedInGoraha(phoneNumber: string): Promise<GorahaCheckResult> {
  const target = normalizePhone(phoneNumber);
  if (!target) {
    return {
      isConfigured: !!process.env.GOOGLE_ACCOUNT_GORAHA_KEYS_BASE64,
      isCredentialValid: false,
      apiAccessValid: false,
      isSaved: false,
      error: 'Invalid phone number',
    };
  }

  let credentials: Record<string, unknown> | null = null;
  try {
    credentials = decodeGorahaCredentials();
  } catch (error) {
    return {
      isConfigured: true,
      isCredentialValid: false,
      apiAccessValid: false,
      isSaved: false,
      error: `Failed to decode Goraha credentials: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }

  if (!credentials) {
    return {
      isConfigured: false,
      isCredentialValid: false,
      apiAccessValid: false,
      isSaved: false,
      error: 'GOOGLE_ACCOUNT_GORAHA_KEYS_BASE64 is not configured',
    };
  }

  const hasRequiredFields =
    credentials.type === 'service_account' &&
    typeof credentials.client_email === 'string' &&
    typeof credentials.private_key === 'string' &&
    typeof credentials.project_id === 'string';

  if (!hasRequiredFields) {
    return {
      isConfigured: true,
      isCredentialValid: false,
      apiAccessValid: false,
      isSaved: false,
      error: 'Goraha credentials are missing required service-account fields',
    };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/contacts.readonly'],
    });

    const people = google.people({ version: 'v1', auth });
    const searchQueries = Array.from(
      new Set([target, `+${target}`, target.slice(-10), target.slice(-9)].filter(Boolean))
    );

    for (const query of searchQueries) {
      // eslint-disable-next-line no-await-in-loop
      const result = await people.people.searchContacts({
        query,
        readMask: 'names,phoneNumbers',
      });

      const matches = result.data.results || [];
      for (const entry of matches) {
        const person = entry.person;
        const phones = person?.phoneNumbers || [];
        for (const phone of phones) {
          const candidate = normalizePhone(phone.value || '');
          if (phonesMatch(candidate, target)) {
            return {
              isConfigured: true,
              isCredentialValid: true,
              apiAccessValid: true,
              isSaved: true,
              matchedContactName:
                person?.names?.[0]?.displayName || person?.names?.[0]?.givenName || '',
              matchedPhone: phone.value || '',
            };
          }
        }
      }
    }

    return {
      isConfigured: true,
      isCredentialValid: true,
      apiAccessValid: true,
      isSaved: false,
    };
  } catch (error) {
    return {
      isConfigured: true,
      isCredentialValid: true,
      apiAccessValid: false,
      isSaved: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
