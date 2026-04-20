/**
 * useEmail — Email Automation Hook for White Caves
 * Phase 3B: Email Automation
 *
 * Provides:
 * - Send custom emails
 * - Send template emails
 * - Fetch available templates
 * - Email statistics
 */

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  sendEmailAPI,
  sendTemplateEmailAPI,
  fetchEmailTemplatesAPI,
  fetchEmailStatsAPI,
} from '../../store/crmDataSlice';
import type { AppDispatch } from '../../store';

// ─── TYPES ──────────────────────────────────────────────────────────────

export interface EmailTemplateInfo {
  name: string;
  description: string;
}

export interface EmailStats {
  sent: number;
  failed: number;
  devMode: number;
  isDevMode: boolean;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  devMode?: boolean;
}

// ─── HOOK ───────────────────────────────────────────────────────────────

export function useEmail() {
  const dispatch = useDispatch<AppDispatch>();

  const [templates, setTemplates] = useState<EmailTemplateInfo[] | null>(null);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SendResult | null>(null);

  /**
   * Send a custom email
   */
  const sendEmail = useCallback(async (
    to: string,
    subject: string,
    text?: string,
    html?: string,
  ): Promise<SendResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(sendEmailAPI({ to, subject, text, html })).unwrap();
      setLastResult(result as SendResult);
      return result as SendResult;
    } catch (err) {
      const errMsg = typeof err === 'string' ? err : 'Failed to send email';
      setError(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Send a predefined template email
   */
  const sendTemplate = useCallback(async (
    template: string,
    to: string,
    params: Record<string, string>,
  ): Promise<SendResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(sendTemplateEmailAPI({ template, to, params })).unwrap();
      setLastResult(result as SendResult);
      return result as SendResult;
    } catch (err) {
      const errMsg = typeof err === 'string' ? err : 'Failed to send template email';
      setError(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Fetch available email templates
   */
  const fetchTemplates = useCallback(async () => {
    try {
      const result = await dispatch(fetchEmailTemplatesAPI()).unwrap();
      setTemplates(result as EmailTemplateInfo[]);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch templates');
    }
  }, [dispatch]);

  /**
   * Fetch email statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      const result = await dispatch(fetchEmailStatsAPI()).unwrap();
      setStats(result as EmailStats);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch stats');
    }
  }, [dispatch]);

  return {
    // State
    templates,
    stats,
    loading,
    error,
    lastResult,

    // Actions
    sendEmail,
    sendTemplate,
    fetchTemplates,
    fetchStats,
  };
}
