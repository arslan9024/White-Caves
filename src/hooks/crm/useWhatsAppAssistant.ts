/**
 * useWhatsAppAssistant — Phase 4D
 *
 * Data hook for WhatsApp Assistant intent classification and auto-responses.
 */

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import {
  classifyWhatsAppIntentAPI,
  generateWhatsAppAutoResponseAPI,
  sendWhatsAppAutoResponseAPI,
} from '../../store/crmDataSlice';

interface AssistantClassification {
  intent: string;
  confidence: number;
  sentiment: string;
  entities: string[];
  leadScore: number;
  shouldEscalate: boolean;
  escalationReason: string | null;
}

interface AssistantAutoResponse {
  classification: AssistantClassification;
  response: string;
  responseType: 'bot' | 'escalate_to_agent';
}

export function useWhatsAppAssistant() {
  const dispatch = useDispatch<AppDispatch>();
  const [classification, setClassification] = useState<AssistantClassification | null>(null);
  const [autoResponse, setAutoResponse] = useState<AssistantAutoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classifyIntent = useCallback(async (message: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(classifyWhatsAppIntentAPI({ message })).unwrap();
      setClassification(result as unknown as AssistantClassification);
      return result;
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to classify intent');
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const previewAutoResponse = useCallback(async (message: string, customerName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(generateWhatsAppAutoResponseAPI({ message, customerName })).unwrap();
      setAutoResponse(result as unknown as AssistantAutoResponse);
      setClassification((result as unknown as AssistantAutoResponse).classification);
      return result;
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to preview auto-response');
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const sendAutoResponse = useCallback(async (conversationId: string, message: string, customerName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(sendWhatsAppAutoResponseAPI({ conversationId, message, customerName })).unwrap();
      return result;
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to send auto-response');
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    classification,
    autoResponse,
    loading,
    error,
    classifyIntent,
    previewAutoResponse,
    sendAutoResponse,
  };
}
