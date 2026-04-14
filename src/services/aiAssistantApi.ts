/**
 * AI Assistant API — Frontend Service Layer
 * ──────────────────────────────────────────
 * Type-safe HTTP client for the /api/ai-assistant backend.
 * Uses authFetch for automatic JWT injection.
 *
 * Usage:
 *   import { aiAssistantApi } from '@/services/aiAssistantApi';
 *   const assistants = await aiAssistantApi.getAll();
 *   const reply = await aiAssistantApi.chat({ assistantId: 'zoe', message: 'Hello' });
 */

import { Config } from '@/config/constants';
import { authFetch } from '@/utils/authFetch';

const BASE = `${Config.API_URL}/api/ai-assistant`;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AssistantInfo {
  id: string;
  name: string;
  role: string;
  department: string;
  color: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  capabilities: string[];
  description: string;
  avatar?: string;
}

export interface ChatRequest {
  assistantId: string;
  message: string;
  conversationId?: string;
  context?: {
    propertyId?: string;
    leadId?: string;
    transactionId?: string;
  };
}

export interface SuggestedAction {
  type: 'view_property' | 'schedule_viewing' | 'create_lead' | 'send_document' | 'call_agent' | 'escalate';
  label: string;
  payload: Record<string, unknown>;
}

export interface ChatResponse {
  reply: string;
  assistantId: string;
  conversationId: string;
  intent?: string;
  sentiment?: string;
  entities?: Array<{ type: string; value: string; confidence: number }>;
  confidence?: number;
  suggestedActions?: SuggestedAction[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ConversationSummary {
  id: string;
  assistantId: string;
  messageCount: number;
  updatedAt: string;
}

export interface LeadScoreResult {
  score: number;
  classification: 'cold' | 'warm' | 'hot' | 'very_hot';
  factors: Array<{
    name: string;
    weight: number;
    value: number;
    description: string;
  }>;
  recommendation: string;
  decayWarning?: string;
}

export interface DocumentRequest {
  type: 'mou' | 'form_f' | 'ejari' | 'noc' | 'invoice' | 'tenancy_contract';
  propertyId?: string;
  leadId?: string;
  tenantId?: string;
  customFields?: Record<string, string>;
}

export interface DocumentResult {
  id: string;
  type: string;
  title: string;
  status: 'generated' | 'pending_signature' | 'error';
  content: string;
  createdAt: string;
}

export interface DocumentType {
  type: string;
  label: string;
  description: string;
}

export interface MarketInsight {
  area: string;
  propertyType: string;
  avgPricePerSqft: number;
  priceChange30d: number;
  priceChange90d: number;
  demandScore: number;
  supplyScore: number;
  forecast: 'bullish' | 'bearish' | 'neutral';
  topDevelopers: string[];
  reraTransactions: number;
  updatedAt: string;
}

export interface AreaForecast {
  area: string;
  currentPrice: number;
  forecast3m: number;
  forecast6m: number;
  forecast12m: number;
  confidence: number;
  drivers: string[];
}

export interface DashboardMetrics {
  totalAssistants: number;
  activeCount: number;
  departments: Record<string, number>;
  chatsStoday: number;
  topAssistants: Array<{ id: string; name: string; chats: number }>;
}

// ─── API Response Wrapper ───────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

// ─── Generic Fetch Helper ───────────────────────────────────────────────────

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE}${endpoint}`;

  const response = await authFetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { error?: string }).error ||
        `AI Assistant API Error: ${response.status} ${response.statusText}`
    );
  }

  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}

// ─── Exported API Object ────────────────────────────────────────────────────

export const aiAssistantApi = {
  // ── Registry ──────────────────────────────────────────────────────────────

  /** Get all 27 AI assistant personas */
  getAll: (): Promise<AssistantInfo[]> => fetchApi('/'),

  /** Get a single assistant by id (e.g., 'zoe', 'clara') */
  getById: (id: string): Promise<AssistantInfo> => fetchApi(`/${encodeURIComponent(id)}`),

  /** Get assistants grouped by department */
  getDepartments: (): Promise<Record<string, AssistantInfo[]>> =>
    fetchApi<Record<string, AssistantInfo[]>>('/departments'),

  /** Search assistants by name, role, department, or capability */
  search: (query: string): Promise<AssistantInfo[]> =>
    fetchApi(`/search?q=${encodeURIComponent(query)}`),

  /** Get dashboard metrics (counts, today's chats, top assistants) */
  getDashboardMetrics: (): Promise<DashboardMetrics> =>
    fetchApi('/metrics/dashboard'),

  // ── Chat ──────────────────────────────────────────────────────────────────

  /** Send a message to any AI assistant */
  chat: (request: ChatRequest): Promise<ChatResponse> =>
    fetchApi('/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  /** Get the current user's conversations */
  getConversations: (): Promise<ConversationSummary[]> => fetchApi('/conversations'),

  /** Get full message history for a conversation */
  getConversationHistory: (conversationId: string): Promise<ChatMessage[]> =>
    fetchApi(`/conversations/${encodeURIComponent(conversationId)}`),

  // ── Lead Scoring (Lex) ────────────────────────────────────────────────────

  /** Score a single lead (0-100 with classification) */
  scoreLead: (leadId: string): Promise<LeadScoreResult> =>
    fetchApi(`/lead-score/${encodeURIComponent(leadId)}`, { method: 'POST' }),

  /** Batch-score multiple leads (max 100) */
  batchScoreLeads: (leadIds: string[]): Promise<Record<string, LeadScoreResult>> =>
    fetchApi('/lead-score/batch', {
      method: 'POST',
      body: JSON.stringify({ leadIds }),
    }),

  // ── Document Generation (Docu) ────────────────────────────────────────────

  /** Generate a Dubai real estate document */
  generateDocument: (request: DocumentRequest): Promise<DocumentResult> =>
    fetchApi('/documents/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  /** List available document types */
  getDocumentTypes: (): Promise<DocumentType[]> => fetchApi('/documents/types'),

  // ── Market Analysis (Maven) ───────────────────────────────────────────────

  /** Get market insights for all areas or a specific area */
  getMarketInsights: (area?: string): Promise<MarketInsight[]> =>
    fetchApi(`/market/insights${area ? `?area=${encodeURIComponent(area)}` : ''}`),

  /** Get 3/6/12-month price forecast for a specific area */
  getAreaForecast: (area: string): Promise<AreaForecast> =>
    fetchApi(`/market/forecast/${encodeURIComponent(area)}`),
};

export default aiAssistantApi;
