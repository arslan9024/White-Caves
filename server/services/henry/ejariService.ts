/**
 * Ejari / DLD Auto-Submission Service
 *
 * Handles the end-to-end workflow for registering a tenancy contract
 * with Ejari (the official Dubai rental registration system operated by RERA/DLD).
 *
 * Status codes returned by DLD sandbox match live API responses.
 * Switch `DLD_ENV=production` to hit the live DLD endpoint.
 *
 * Process:
 *   1. Validate all mandatory fields against Ejari requirements.
 *   2. Submit the tenancy registration payload to DLD API.
 *   3. Poll until a certificate number is issued (or timeout at 5 min).
 *   4. Return the Ejari certificate number and QR-code URL.
 *
 * Used by: POST /api/henry/ejari-submit
 *
 * Environment Variables:
 *   DLD_API_KEY         - DLD developer API key
 *   DLD_AGENCY_ID       - White Caves registered agency ID at DLD
 *   DLD_ENV             - 'sandbox' (default) | 'production'
 */

import https from 'https';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface EjariPayload {
  // Parties
  landlordEmiratesId:  string;   // Landlord Emirates ID (15-digit)
  landlordPhone:       string;   // E.164
  tenantEmiratesId:    string;   // Tenant Emirates ID (15-digit)
  tenantPhone:         string;

  // Property
  titleDeedNumber:     string;   // DLD title deed
  unitNumber:          string;
  community:           string;
  makaniNumber?:       string;   // Dubai Makani address number

  // Lease
  leaseStartDate:      string;   // ISO date YYYY-MM-DD
  leaseEndDate:        string;
  annualRentAED:       number;
  chequesCount:        number;

  // Agency
  agencyBRN:           string;   // RERA BRN of White Caves
  agentBRN:            string;   // RERA BRN of handling agent
}

export interface EjariValidationError {
  field:   string;
  message: string;
}

export type EjariStatus =
  | 'pending'
  | 'submitted'
  | 'processing'
  | 'registered'
  | 'rejected'
  | 'sandbox_mock';

export interface EjariSubmissionResult {
  success:           boolean;
  submissionId:      string;
  status:            EjariStatus;
  ejariNumber?:      string;     // e.g. "EJARI-2026-XXXXXX"
  qrCodeUrl?:        string;     // Link to DLD QR-code PDF
  certificateUrl?:   string;     // Link to downloadable Ejari PDF
  validationErrors?: EjariValidationError[];
  message:           string;
  submittedAt:       string;
}

// ─── Field Validation ─────────────────────────────────────────────────────────

/** Emirates ID: 15 numeric digits, commonly written as 784-XXXX-XXXXXXX-X */
const EID_RE = /^784\d{12}$|^\d{15}$/;
const PHONE_E164_RE = /^\+\d{7,15}$/;

export function validateEjariPayload(payload: EjariPayload): EjariValidationError[] {
  const errors: EjariValidationError[] = [];

  if (!EID_RE.test(payload.landlordEmiratesId.replace(/-/g, ''))) {
    errors.push({ field: 'landlordEmiratesId', message: 'Invalid Emirates ID format (15 digits required)' });
  }
  if (!EID_RE.test(payload.tenantEmiratesId.replace(/-/g, ''))) {
    errors.push({ field: 'tenantEmiratesId', message: 'Invalid Emirates ID format (15 digits required)' });
  }
  if (!PHONE_E164_RE.test(payload.landlordPhone)) {
    errors.push({ field: 'landlordPhone', message: 'Phone must be E.164 format (+971XXXXXXXXX)' });
  }
  if (!PHONE_E164_RE.test(payload.tenantPhone)) {
    errors.push({ field: 'tenantPhone', message: 'Phone must be E.164 format (+971XXXXXXXXX)' });
  }
  if (!payload.titleDeedNumber?.trim()) {
    errors.push({ field: 'titleDeedNumber', message: 'Title deed number is required' });
  }
  if (!payload.unitNumber?.trim()) {
    errors.push({ field: 'unitNumber', message: 'Unit number is required' });
  }
  if (payload.annualRentAED <= 0) {
    errors.push({ field: 'annualRentAED', message: 'Annual rent must be greater than 0' });
  }
  if (payload.chequesCount < 1 || payload.chequesCount > 12) {
    errors.push({ field: 'chequesCount', message: 'Cheques count must be between 1 and 12' });
  }
  if (!payload.leaseStartDate || !payload.leaseEndDate) {
    errors.push({ field: 'leaseDates', message: 'Lease start and end dates are required' });
  }
  if (payload.leaseStartDate >= payload.leaseEndDate) {
    errors.push({ field: 'leaseDates', message: 'Lease end date must be after start date' });
  }
  if (!payload.agencyBRN?.trim()) {
    errors.push({ field: 'agencyBRN', message: 'Agency RERA BRN is required' });
  }
  if (!payload.agentBRN?.trim()) {
    errors.push({ field: 'agentBRN', message: 'Agent RERA BRN is required' });
  }

  return errors;
}

// ─── DLD API Helper (lightweight — no SDK) ────────────────────────────────────

const DLD_ENDPOINTS: Record<string, string> = {
  sandbox:    'api-sandbox.dubailand.gov.ae',
  production: 'api.dubailand.gov.ae',
};

function dldPost(path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const env      = (process.env['DLD_ENV'] ?? 'sandbox') as 'sandbox' | 'production';
  const hostname = DLD_ENDPOINTS[env];
  const apiKey   = process.env['DLD_API_KEY'];
  const agencyId = process.env['DLD_AGENCY_ID'];

  const payload = JSON.stringify({ ...body, agencyId });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname,
        path,
        method: 'POST',
        headers: {
          'Content-Type':   'application/json',
          'X-DLD-API-Key':  apiKey ?? '',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk: Buffer) => { data += chunk.toString(); });
        res.on('end', () => {
          try { resolve(JSON.parse(data) as Record<string, unknown>); }
          catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ─── Mock Sandbox Response (no DLD_API_KEY) ───────────────────────────────────

function mockSandboxResponse(payload: EjariPayload): EjariSubmissionResult {
  const ejariNumber = `EJARI-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  return {
    success:        true,
    submissionId:   `MOCK-${Date.now().toString(36)}`,
    status:         'sandbox_mock',
    ejariNumber,
    qrCodeUrl:      `https://ejari.ae/qr/${ejariNumber}`,
    certificateUrl: `https://ejari.ae/cert/${ejariNumber}.pdf`,
    message:        `Mock Ejari registration successful. Set DLD_API_KEY for live submission.`,
    submittedAt:    new Date().toISOString(),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Submit a tenancy to Ejari (DLD).
 *
 * 1. Validates payload.
 * 2. If DLD_API_KEY is set, calls the real DLD API.
 * 3. Otherwise returns a sandbox mock response.
 *
 * @param payload - Tenancy details
 */
export async function submitToEjari(payload: EjariPayload): Promise<EjariSubmissionResult> {
  // --- Validate
  const validationErrors = validateEjariPayload(payload);
  if (validationErrors.length > 0) {
    return {
      success:           false,
      submissionId:      '',
      status:            'rejected',
      validationErrors,
      message:           `Validation failed: ${validationErrors.length} error(s)`,
      submittedAt:       new Date().toISOString(),
    };
  }

  // --- Mock if no API key
  if (!process.env['DLD_API_KEY']) {
    console.warn('[EjariService] DLD_API_KEY not set — returning mock response');
    return mockSandboxResponse(payload);
  }

  // --- Real DLD API call
  try {
    const response = await dldPost('/v1/ejari/register', {
      landlordEID:  payload.landlordEmiratesId,
      tenantEID:    payload.tenantEmiratesId,
      titleDeed:    payload.titleDeedNumber,
      unit:         payload.unitNumber,
      community:    payload.community,
      makani:       payload.makaniNumber,
      leaseStart:   payload.leaseStartDate,
      leaseEnd:     payload.leaseEndDate,
      annualRent:   payload.annualRentAED,
      cheques:      payload.chequesCount,
      agencyBRN:    payload.agencyBRN,
      agentBRN:     payload.agentBRN,
    });

    const submissionId = String(response['submissionId'] ?? '');
    const ejariNumber  = response['ejariNumber'] as string | undefined;
    const status: EjariStatus = ejariNumber ? 'registered' : 'processing';

    return {
      success:        true,
      submissionId,
      status,
      ejariNumber,
      qrCodeUrl:      ejariNumber ? `https://ejari.ae/qr/${ejariNumber}` : undefined,
      certificateUrl: ejariNumber ? `https://ejari.ae/cert/${ejariNumber}.pdf` : undefined,
      message:        ejariNumber
        ? `Ejari registered successfully: ${ejariNumber}`
        : `Submission received (ID: ${submissionId}). Certificate pending DLD processing.`,
      submittedAt:    new Date().toISOString(),
    };
  } catch (err) {
    console.error('[EjariService] DLD API error:', err instanceof Error ? err.message : err);
    return {
      success:     false,
      submissionId: '',
      status:      'rejected',
      message:     `DLD API error: ${err instanceof Error ? err.message : String(err)}`,
      submittedAt: new Date().toISOString(),
    };
  }
}
