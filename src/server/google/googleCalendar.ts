import { google } from 'googleapis';

interface TokenCredentials {
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
  token_type?: string;
}

interface EventResponse {
  success: boolean;
  eventId?: string;
  htmlLink?: string;
  hangoutLink?: string;
  event?: any;
  error?: string;
}

interface EventUpdate {
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; timeZone?: string };
  end?: { dateTime?: string; timeZone?: string };
  attendees?: Array<{ email: string }>;
  reminders?: { useDefault: boolean; overrides?: Array<{ method: string; minutes: number }> };
  colorId?: string;
  [key: string]: any;
}

interface Attendee {
  email: string;
}

interface CalendarEventInput {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string;
  endDateTime: string;
  attendees?: string[];
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{ method: string; minutes: number }>;
  };
  colorId?: string;
}

interface PropertyViewingEventInput {
  propertyTitle: string;
  propertyAddress: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  agentEmail?: string;
  startDateTime: string;
  duration?: number;
}

interface TaskInput {
  title: string;
  notes?: string;
  dueDate?: string;
  taskListId?: string;
}

interface TaskResponse {
  success: boolean;
  taskId?: string;
  task?: any;
  error?: string;
}

interface FollowUpTaskInput {
  propertyTitle: string;
  clientName: string;
  clientPhone: string;
  agentName: string;
  actionType: string;
  dueDate: string;
}

const getRedirectUri = (): string => {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  const domain = process.env.REPLIT_DOMAINS?.split(',')[0];
  if (domain) {
    return `https://${domain}/api/calendar/callback`;
  }
  return 'http://localhost:3000/api/calendar/callback';
};

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  getRedirectUri()
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
const tasks = google.tasks({ version: 'v1', auth: oauth2Client });

export function setCredentials(tokens: TokenCredentials): void {
  oauth2Client.setCredentials(tokens);
}

export function getAuthUrl(state: string = ''): string {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/tasks',
    'openid',
    'email',
    'profile',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state,
    prompt: 'consent',
  });
}

export async function getTokens(code: string): Promise<TokenCredentials> {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenCredentials> {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
}

export async function createCalendarEvent(
  input: CalendarEventInput
): Promise<EventResponse> {
  const { summary, description, location, startDateTime, endDateTime, attendees = [], reminders, colorId = '11' } = input;

  const event = {
    summary,
    description,
    location,
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Dubai',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Dubai',
    },
    attendees: attendees.map((email) => ({ email })),
    reminders: reminders || {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
    colorId,
    conferenceData: {
      createRequest: {
        requestId: `whitecaves-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event as any,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      hangoutLink: response.data.hangoutLink,
      event: response.data,
    };
  } catch (error: any) {
    console.error('Error creating calendar event:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function createPropertyViewingEvent(input: PropertyViewingEventInput): Promise<EventResponse> {
  const { propertyTitle, propertyAddress, clientName, clientEmail, clientPhone, agentEmail, startDateTime, duration = 60 } = input;

  const endDateTime = new Date(
    new Date(startDateTime).getTime() + duration * 60000
  ).toISOString();

  const description = `
Property Viewing - White Caves Real Estate

Property: ${propertyTitle}
Address: ${propertyAddress}

Client: ${clientName}
Phone: ${clientPhone}
Email: ${clientEmail}

Please arrive 5 minutes before the scheduled time.
Contact our office at +971 4 335 0592 if you need to reschedule.

---
White Caves Real Estate LLC
Office D-72, El-Shaye-4, Port Saeed, Dubai
www.whitecaves.com
  `.trim();

  return createCalendarEvent({
    summary: `Property Viewing: ${propertyTitle}`,
    description,
    location: propertyAddress,
    startDateTime,
    endDateTime,
    attendees: [clientEmail, agentEmail].filter(Boolean),
    colorId: '11',
  });
}

export async function updateCalendarEvent(eventId: string, updates: EventUpdate): Promise<EventResponse> {
  try {
    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      resource: updates as any,
      sendUpdates: 'all',
    });

    return {
      success: true,
      event: response.data,
    };
  } catch (error: any) {
    console.error('Error updating calendar event:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
      sendUpdates: 'all',
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting calendar event:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getUpcomingEvents(maxResults: number = 10): Promise<{ success: boolean; events?: any[]; error?: string }> {
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return {
      success: true,
      events: response.data.items,
    };
  } catch (error: any) {
    console.error('Error fetching calendar events:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function createTask(input: TaskInput): Promise<TaskResponse> {
  const { title, notes, dueDate, taskListId = '@default' } = input;

  const task = {
    title,
    notes,
    due: dueDate ? new Date(dueDate).toISOString() : undefined,
  };

  try {
    const response = await tasks.tasks.insert({
      tasklist: taskListId,
      resource: task as any,
    });

    return {
      success: true,
      taskId: response.data.id,
      task: response.data,
    };
  } catch (error: any) {
    console.error('Error creating task:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function createFollowUpTask(input: FollowUpTaskInput): Promise<TaskResponse> {
  const { propertyTitle, clientName, clientPhone, agentName, actionType, dueDate } = input;

  const taskTitles: Record<string, string> = {
    follow_up_call: `Follow-up call: ${clientName} - ${propertyTitle}`,
    send_documents: `Send documents to ${clientName}`,
    schedule_second_viewing: `Schedule 2nd viewing: ${clientName} - ${propertyTitle}`,
    send_offer: `Prepare offer for ${clientName}`,
    contract_preparation: `Prepare contract: ${propertyTitle}`,
    payment_reminder: `Payment reminder: ${clientName}`,
  };

  const notes = `
Client: ${clientName}
Phone: ${clientPhone}
Property: ${propertyTitle}
Assigned Agent: ${agentName}

Created automatically by White Caves CRM
  `.trim();

  return createTask({
    title: taskTitles[actionType] || `Task: ${clientName} - ${propertyTitle}`,
    notes,
    dueDate,
  });
}

export async function completeTask(taskId: string, taskListId: string = '@default'): Promise<TaskResponse> {
  try {
    const response = await tasks.tasks.patch({
      tasklist: taskListId,
      task: taskId,
      resource: {
        status: 'completed',
      },
    });

    return {
      success: true,
      task: response.data,
    };
  } catch (error: any) {
    console.error('Error completing task:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getTaskLists(): Promise<{ success: boolean; taskLists?: any[]; error?: string }> {
  try {
    const response = await tasks.tasklists.list();
    return {
      success: true,
      taskLists: response.data.items,
    };
  } catch (error: any) {
    console.error('Error fetching task lists:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getTasks(taskListId: string = '@default', showCompleted: boolean = false): Promise<{ success: boolean; tasks?: any[]; error?: string }> {
  try {
    const response = await tasks.tasks.list({
      tasklist: taskListId,
      showCompleted,
      showHidden: false,
    });

    return {
      success: true,
      tasks: response.data.items || [],
    };
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default {
  setCredentials,
  getAuthUrl,
  getTokens,
  refreshAccessToken,
  createCalendarEvent,
  createPropertyViewingEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getUpcomingEvents,
  createTask,
  createFollowUpTask,
  completeTask,
  getTaskLists,
  getTasks,
};
