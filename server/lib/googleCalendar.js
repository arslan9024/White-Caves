import { google } from 'googleapis';

const getRedirectUri = () => {
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

export function setCredentials(tokens) {
  oauth2Client.setCredentials(tokens);
}

export function getAuthUrl(state = '') {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/tasks',
    'openid',
    'email',
    'profile'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state,
    prompt: 'consent'
  });
}

export async function getTokens(code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
}

export async function refreshAccessToken(refreshToken) {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
}

export async function createCalendarEvent({
  summary,
  description,
  location,
  startDateTime,
  endDateTime,
  attendees = [],
  reminders = { useDefault: false, overrides: [{ method: 'email', minutes: 60 }, { method: 'popup', minutes: 30 }] },
  colorId = '11'
}) {
  const event = {
    summary,
    description,
    location,
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Dubai'
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Dubai'
    },
    attendees: attendees.map(email => ({ email })),
    reminders,
    colorId,
    conferenceData: {
      createRequest: {
        requestId: `whitecaves-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });

    return {
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      hangoutLink: response.data.hangoutLink,
      event: response.data
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function createPropertyViewingEvent({
  propertyTitle,
  propertyAddress,
  clientName,
  clientEmail,
  clientPhone,
  agentEmail,
  startDateTime,
  duration = 60
}) {
  const endDateTime = new Date(new Date(startDateTime).getTime() + duration * 60000).toISOString();

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
    colorId: '11'
  });
}

export async function updateCalendarEvent(eventId, updates) {
  try {
    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      resource: updates,
      sendUpdates: 'all'
    });

    return {
      success: true,
      event: response.data
    };
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function deleteCalendarEvent(eventId) {
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
      sendUpdates: 'all'
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getUpcomingEvents(maxResults = 10) {
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime'
    });

    return {
      success: true,
      events: response.data.items
    };
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function createTask({
  title,
  notes,
  dueDate,
  taskListId = '@default'
}) {
  const task = {
    title,
    notes,
    due: dueDate ? new Date(dueDate).toISOString() : undefined
  };

  try {
    const response = await tasks.tasks.insert({
      tasklist: taskListId,
      resource: task
    });

    return {
      success: true,
      taskId: response.data.id,
      task: response.data
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function createFollowUpTask({
  propertyTitle,
  clientName,
  clientPhone,
  agentName,
  actionType,
  dueDate
}) {
  const taskTitles = {
    'follow_up_call': `Follow-up call: ${clientName} - ${propertyTitle}`,
    'send_documents': `Send documents to ${clientName}`,
    'schedule_second_viewing': `Schedule 2nd viewing: ${clientName} - ${propertyTitle}`,
    'send_offer': `Prepare offer for ${clientName}`,
    'contract_preparation': `Prepare contract: ${propertyTitle}`,
    'payment_reminder': `Payment reminder: ${clientName}`
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
    dueDate
  });
}

export async function completeTask(taskId, taskListId = '@default') {
  try {
    const response = await tasks.tasks.patch({
      tasklist: taskListId,
      task: taskId,
      resource: {
        status: 'completed'
      }
    });

    return {
      success: true,
      task: response.data
    };
  } catch (error) {
    console.error('Error completing task:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getTaskLists() {
  try {
    const response = await tasks.tasklists.list();
    return {
      success: true,
      taskLists: response.data.items
    };
  } catch (error) {
    console.error('Error fetching task lists:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getTasks(taskListId = '@default', showCompleted = false) {
  try {
    const response = await tasks.tasks.list({
      tasklist: taskListId,
      showCompleted,
      showHidden: false
    });

    return {
      success: true,
      tasks: response.data.items || []
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      success: false,
      error: error.message
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
  getTasks
};
