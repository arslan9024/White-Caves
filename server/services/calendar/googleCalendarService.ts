import { google } from 'googleapis';

export interface GoogleCalendarTokenSet {
  access_token?: string | null;
  refresh_token?: string | null;
  scope?: string | null;
  token_type?: string | null;
  expiry_date?: number | null;
}

export interface GoogleCalendarEventInput {
  summary: string;
  description?: string;
  location?: string;
  startISO: string;
  endISO: string;
}

const REQUIRED_ENV = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'] as const;

const assertGoogleOauthConfigured = (): void => {
  const missing = REQUIRED_ENV.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Google OAuth not configured. Missing: ${missing.join(', ')}`);
  }
};

const buildOauthClient = () => {
  assertGoogleOauthConfigured();
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

const CALENDAR_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

export const getGoogleCalendarAuthUrl = (state = 'appointments-google-sync'): string => {
  const client = buildOauthClient();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: CALENDAR_SCOPES,
    state,
  });
};

export const exchangeGoogleCalendarCode = async (
  code: string
): Promise<GoogleCalendarTokenSet> => {
  const client = buildOauthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
};

export const createGoogleCalendarEvent = async (
  tokenSet: GoogleCalendarTokenSet,
  event: GoogleCalendarEventInput
): Promise<{ id?: string | null; htmlLink?: string | null }> => {
  const client = buildOauthClient();
  client.setCredentials({
    access_token: tokenSet.access_token ?? undefined,
    refresh_token: tokenSet.refresh_token ?? undefined,
    scope: tokenSet.scope ?? undefined,
    token_type: tokenSet.token_type ?? undefined,
    expiry_date: tokenSet.expiry_date ?? undefined,
  });

  const calendar = google.calendar({ version: 'v3', auth: client });
  const insert = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: { dateTime: event.startISO },
      end: { dateTime: event.endISO },
    },
  });

  return {
    id: insert.data.id,
    htmlLink: insert.data.htmlLink,
  };
};
