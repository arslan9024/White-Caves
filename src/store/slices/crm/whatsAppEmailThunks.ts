/**
 * WhatsApp & Email Automation Thunks
 * Single Purpose: AI WhatsApp intent classification, auto-responses, and template email dispatches.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import type { CRMItem } from './crmTypes';

export const classifyWhatsAppIntentAPI = createAsyncThunk<
  Record<string, unknown>,
  { message: string },
  { rejectValue: string }
>('crmData/classifyWhatsAppIntent', async (payload, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/nadia/assistant/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to classify WhatsApp intent');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to classify WhatsApp intent'));
  }
});

/** Generate auto-response preview — POST /api/nadia/assistant/auto-response */
export const generateWhatsAppAutoResponseAPI = createAsyncThunk<
  Record<string, unknown>,
  { message: string; customerName?: string },
  { rejectValue: string }
>('crmData/generateWhatsAppAutoResponse', async (payload, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/nadia/assistant/auto-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to generate WhatsApp auto-response');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to generate WhatsApp auto-response'));
  }
});

/** Process + persist auto-response in conversation — POST /api/nadia/assistant/respond */
export const sendWhatsAppAutoResponseAPI = createAsyncThunk<
  Record<string, unknown>,
  { conversationId: string; message: string; customerName?: string },
  { rejectValue: string }
>('crmData/sendWhatsAppAutoResponse', async (payload, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/nadia/assistant/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to send WhatsApp auto-response');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to send WhatsApp auto-response'));
  }
});

// ============================================================================
// REPORTING & ANALYTICS THUNKS
// ============================================================================

/** Fetch lead funnel data — GET /api/dashboard/lead-funnel */

export const sendEmailAPI = createAsyncThunk<
  { success: boolean; messageId?: string; devMode?: boolean },
  { to: string; subject: string; text?: string; html?: string },
  { rejectValue: string }
>('crmData/sendEmail', async (payload, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to send email');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to send email'));
  }
});

/** Send a template email — POST /api/email/template */
export const sendTemplateEmailAPI = createAsyncThunk<
  { success: boolean; messageId?: string; template: string },
  { template: string; to: string; params: Record<string, string> },
  { rejectValue: string }
>('crmData/sendTemplateEmail', async (payload, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/email/template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to send template email');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to send template email'));
  }
});

/** Fetch email templates — GET /api/email/templates */
export const fetchEmailTemplatesAPI = createAsyncThunk<
  Array<{ name: string; description: string }>,
  void,
  { rejectValue: string }
>('crmData/fetchEmailTemplates', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/email/templates');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch email templates');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch email templates'));
  }
});

/** Fetch email stats — GET /api/email/stats */
export const fetchEmailStatsAPI = createAsyncThunk<
  { sent: number; failed: number; devMode: number; isDevMode: boolean },
  void,
  { rejectValue: string }
>('crmData/fetchEmailStats', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/email/stats');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch email stats');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch email stats'));
  }
});

// ============================================================================
// SCHEDULING THUNKS (Phase 3C - Calendar/Scheduling)
// ============================================================================

/** Fetch available slots for an agent on a date — GET /api/viewings/slots */
