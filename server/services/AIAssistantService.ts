/**
 * AI Assistant Service — Core Business Logic Layer
 * ──────────────────────────────────────────────────
 * Provides domain services for the 26 White Caves AI assistant personas.
 * Designed for progressive enhancement: starts with mock intelligence,
 * ready to plug in OpenAI / Claude / Gemini when API keys are available.
 *
 * Architecture:
 *   Router → Service → (Mock NLP | LLM Provider)
 *                    → Prisma (persistence)
 *                    → NinaEngine (intent/entity extraction)
 *
 * Key Capabilities:
 *   • Chat — Conversational interface with any assistant persona
 *   • Lead Scoring — "Lex" persona — behavioral scoring 0-100
 *   • Document Generation — "Docu" persona — MoU, Form-F, Ejari stubs
 *   • Market Analysis — "Maven" persona — area trends, price forecasts
 *   • Assistant Registry — CRUD for persona metadata & status
 */

import { prisma } from '../database.js';
import {
  detectIntent,
  calculateLeadScore,
  detectSentiment,
  extractEntities,
  generateBotResponse,
} from './nadia/messageProcessor.js';
import type { Entity } from './nadia/ninaEngine.js';
import logger from '../utils/logger.js';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
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

export interface ChatResponse {
  reply: string;
  assistantId: string;
  conversationId: string;
  intent?: string;
  sentiment?: string;
  entities?: Entity[];
  confidence?: number;
  suggestedActions?: SuggestedAction[];
}

export interface SuggestedAction {
  type: 'view_property' | 'schedule_viewing' | 'create_lead' | 'send_document' | 'call_agent' | 'escalate';
  label: string;
  payload: Record<string, unknown>;
}

export interface LeadScoreResult {
  score: number;            // 0-100
  classification: 'cold' | 'warm' | 'hot' | 'very_hot';
  factors: LeadScoreFactor[];
  recommendation: string;
  decayWarning?: string;
}

export interface LeadScoreFactor {
  name: string;
  weight: number;
  value: number;
  description: string;
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
  content: string;        // Markdown template (PDF generation via frontend)
  createdAt: Date;
}

export interface MarketInsight {
  area: string;
  propertyType: string;
  avgPricePerSqft: number;
  priceChange30d: number;  // percentage
  priceChange90d: number;
  demandScore: number;     // 0-100
  supplyScore: number;     // 0-100
  forecast: 'bullish' | 'bearish' | 'neutral';
  topDevelopers: string[];
  reraTransactions: number;
  updatedAt: Date;
}

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

// ─── Assistant Registry (maps to business_docs/03_ai_assistants/) ───────────

const ASSISTANT_REGISTRY: Record<string, AssistantInfo> = {
  zoe:       { id: 'zoe',       name: 'Zoe',       role: 'Executive Assistant',         department: 'Executive',        color: '#10B981', status: 'active', capabilities: ['dashboard', 'kpi', 'briefing', 'analytics'],              description: 'Executive support, business intelligence, KPI tracking' },
  clara:     { id: 'clara',     name: 'Clara',     role: 'Leads CRM Manager',           department: 'Sales',            color: '#EF4444', status: 'active', capabilities: ['leads', 'qualification', 'scoring', 'nurturing'],        description: 'Complete lead lifecycle management' },
  linda:     { id: 'linda',     name: 'Linda',     role: 'WhatsApp CRM Manager',        department: 'Communications',   color: '#25D366', status: 'active', capabilities: ['whatsapp', 'chat', 'templates', 'broadcast'],            description: 'WhatsApp business communication' },
  nadia:     { id: 'nadia',     name: 'Nadia',     role: 'WhatsApp Pre-Qualifier',      department: 'Sales',            color: '#8B5CF6', status: 'active', capabilities: ['whatsapp', 'prequalify', 'scoring', 'routing'],           description: 'Automated lead pre-qualification via WhatsApp' },
  nina:      { id: 'nina',      name: 'Nina',      role: 'NLP Bot Engine',              department: 'Technology',       color: '#3B82F6', status: 'active', capabilities: ['nlp', 'intent', 'sentiment', 'entities'],                description: 'Natural language processing and intent detection' },
  mary:      { id: 'mary',      name: 'Mary',      role: 'Inventory Manager',           department: 'Operations',       color: '#F59E0B', status: 'active', capabilities: ['inventory', 'properties', 'listings', 'valuation'],       description: 'Property inventory and listing management' },
  sophia:    { id: 'sophia',    name: 'Sophia',    role: 'Pipeline Manager',            department: 'Sales',            color: '#EC4899', status: 'active', capabilities: ['pipeline', 'deals', 'negotiations', 'closings'],         description: 'Deal pipeline management from offer to close' },
  theodora:  { id: 'theodora',  name: 'Theodora',  role: 'Finance Director',            department: 'Finance',          color: '#F97316', status: 'active', capabilities: ['finance', 'commissions', 'invoices', 'payments'],        description: 'Financial operations, commission tracking, invoicing' },
  daisy:     { id: 'daisy',     name: 'Daisy',     role: 'Leasing Manager',             department: 'Leasing',          color: '#14B8A6', status: 'active', capabilities: ['leasing', 'tenants', 'contracts', 'renewals'],           description: 'Lease management and tenant relations' },
  laila:     { id: 'laila',     name: 'Laila',     role: 'Compliance Officer',          department: 'Legal',            color: '#6366F1', status: 'active', capabilities: ['compliance', 'rera', 'dld', 'kyc', 'aml'],               description: 'Regulatory compliance and RERA/DLD adherence' },
  olivia:    { id: 'olivia',    name: 'Olivia',    role: 'Coordination Hub',            department: 'Operations',       color: '#A855F7', status: 'active', capabilities: ['coordination', 'tasks', 'workflows', 'assignments'],      description: 'Cross-department coordination and task management' },
  nancy:     { id: 'nancy',     name: 'Nancy',     role: 'Notification Manager',        department: 'Operations',       color: '#0EA5E9', status: 'active', capabilities: ['notifications', 'alerts', 'reminders', 'escalations'],    description: 'Smart notification management and alert routing' },
  hazel:     { id: 'hazel',     name: 'Hazel',     role: 'Training Coach',              department: 'HR',               color: '#84CC16', status: 'active', capabilities: ['training', 'onboarding', 'certifications', 'coaching'],  description: 'Agent training, onboarding, and skill development' },
  willow:    { id: 'willow',    name: 'Willow',    role: 'Documentation Manager',       department: 'Operations',       color: '#22D3EE', status: 'active', capabilities: ['documents', 'templates', 'contracts', 'archives'],       description: 'Document management and template generation' },
  hunter:    { id: 'hunter',    name: 'Hunter',    role: 'Data Scraper',                department: 'Technology',       color: '#F43F5E', status: 'active', capabilities: ['scraping', 'import', 'enrichment', 'dedup'],             description: 'External data sourcing and property listing import' },
  henry:     { id: 'henry',     name: 'Henry',     role: 'Marketing Manager',           department: 'Marketing',        color: '#D946EF', status: 'active', capabilities: ['marketing', 'campaigns', 'social', 'email'],             description: 'Marketing campaigns and social media management' },
  atlas:     { id: 'atlas',     name: 'Atlas',     role: 'Location Intelligence',       department: 'Technology',       color: '#2563EB', status: 'active', capabilities: ['mapping', 'geo', 'amenities', 'neighborhood'],           description: 'Location analytics and neighborhood intelligence' },
  aurora:    { id: 'aurora',    name: 'Aurora',    role: 'Virtual Staging',             department: 'Marketing',        color: '#7C3AED', status: 'idle',   capabilities: ['staging', 'ar', 'vr', '3d'],                             description: 'Virtual staging, AR/VR property visualization' },
  cipher:    { id: 'cipher',    name: 'Cipher',    role: 'Security Officer',            department: 'IT',               color: '#334155', status: 'active', capabilities: ['security', 'audit', 'encryption', 'access'],             description: 'Security monitoring, audit logs, access control' },
  juno:      { id: 'juno',      name: 'Juno',      role: 'Client Portal Admin',         department: 'Technology',       color: '#0891B2', status: 'active', capabilities: ['portal', 'client', 'self-service', 'status'],            description: 'Client-facing portal and self-service manager' },
  kairos:    { id: 'kairos',    name: 'Kairos',    role: 'Scheduling Coordinator',      department: 'Operations',       color: '#059669', status: 'active', capabilities: ['scheduling', 'calendar', 'availability', 'reminders'],   description: 'Viewing appointments, calendar management' },
  sentinel:  { id: 'sentinel',  name: 'Sentinel',  role: 'Quality Assurance',           department: 'Operations',       color: '#B45309', status: 'active', capabilities: ['qa', 'testing', 'monitoring', 'alerts'],                 description: 'Quality assurance and system health monitoring' },
  evangeline:{ id: 'evangeline',name: 'Evangeline',role: 'Relationship Manager',        department: 'Sales',            color: '#BE185D', status: 'active', capabilities: ['crm', 'retention', 'vip', 'loyalty'],                   description: 'High-value client relationship management' },
  vesta:     { id: 'vesta',     name: 'Vesta',     role: 'Property Matching',           department: 'Sales',            color: '#4F46E5', status: 'active', capabilities: ['matching', 'recommendation', 'preferences', 'alerts'],   description: 'AI-powered property-to-buyer matching engine' },
  // New Phase 0.2 bots
  lex:       { id: 'lex',       name: 'Lex',       role: 'Lead Scoring Engine',         department: 'Sales',            color: '#DC2626', status: 'active', capabilities: ['scoring', 'behavioral', 'decay', 'alerts'],              description: 'Behavioral lead scoring 0-100 with classification' },
  docu:      { id: 'docu',      name: 'Docu',      role: 'Document Generator',          department: 'Legal',            color: '#0369A1', status: 'active', capabilities: ['mou', 'form_f', 'ejari', 'noc', 'invoice'],             description: 'Automated legal document generation' },
  maven:     { id: 'maven',     name: 'Maven',     role: 'Market Analyst',              department: 'Research',         color: '#7E22CE', status: 'active', capabilities: ['market', 'trends', 'forecast', 'analytics'],             description: 'Dubai market intelligence and price forecasting' },
};

// ─── In-memory conversation store (will move to Prisma in Phase 1) ──────────

interface ConversationStore {
  id: string;
  assistantId: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const conversations = new Map<string, ConversationStore>();
let conversationCounter = 0;

function generateConversationId(): string {
  conversationCounter++;
  return `ai-conv-${Date.now()}-${conversationCounter}`;
}

// ─── Assistant Registry Service ─────────────────────────────────────────────

export function getAllAssistants(): AssistantInfo[] {
  return Object.values(ASSISTANT_REGISTRY);
}

export function getAssistantById(id: string): AssistantInfo | null {
  return ASSISTANT_REGISTRY[id.toLowerCase()] || null;
}

export function getAssistantsByDepartment(department: string): AssistantInfo[] {
  return Object.values(ASSISTANT_REGISTRY).filter(
    (a) => a.department.toLowerCase() === department.toLowerCase()
  );
}

export function searchAssistants(query: string): AssistantInfo[] {
  const q = query.toLowerCase();
  return Object.values(ASSISTANT_REGISTRY).filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q) ||
      a.capabilities.some((c) => c.includes(q)) ||
      a.description.toLowerCase().includes(q)
  );
}

// ─── Chat Service ───────────────────────────────────────────────────────────

export async function chat(request: ChatRequest, userId: string): Promise<ChatResponse> {
  const assistant = getAssistantById(request.assistantId);
  if (!assistant) {
    throw new Error(`Assistant "${request.assistantId}" not found`);
  }

  // Get or create conversation
  let convId = request.conversationId;
  let conv: ConversationStore;

  if (convId && conversations.has(convId)) {
    conv = conversations.get(convId)!;
  } else {
    convId = generateConversationId();
    conv = {
      id: convId,
      assistantId: request.assistantId,
      userId,
      messages: [{
        role: 'system',
        content: buildSystemPrompt(assistant),
        timestamp: new Date(),
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    conversations.set(convId, conv);
  }

  // Add user message
  conv.messages.push({
    role: 'user',
    content: request.message,
    timestamp: new Date(),
  });

  // Process through NLP pipeline
  const intentStr = detectIntent(request.message);
  const sentimentStr = detectSentiment(request.message);
  const entityStrings = extractEntities(request.message);

  // Convert string entities to typed entities for the response
  const typedEntities: Array<{ type: string; value: string }> = entityStrings.map((e) => {
    const [type, ...rest] = e.split(':');
    return { type: type || 'unknown', value: rest.join(':') || e };
  });

  // Generate response based on assistant persona
  const reply = await generateAssistantResponse(assistant, request.message, conv.messages, {
    intent: intentStr,
    sentiment: sentimentStr,
    entities: typedEntities,
    context: request.context,
  });

  // Add assistant response
  conv.messages.push({
    role: 'assistant',
    content: reply,
    timestamp: new Date(),
  });

  conv.updatedAt = new Date();

  // Build suggested actions based on intent
  const suggestedActions = buildSuggestedActions(intentStr, typedEntities, assistant);

  logger.debug('AI chat processed', {
    assistantId: request.assistantId,
    conversationId: convId,
    intent: intentStr,
    sentiment: sentimentStr,
    entityCount: typedEntities.length,
  });

  return {
    reply,
    assistantId: request.assistantId,
    conversationId: convId,
    intent: intentStr,
    sentiment: sentimentStr,
    entities: typedEntities as any,
    confidence: 0.8, // Mock confidence
    suggestedActions,
  };
}

export function getConversationHistory(conversationId: string, userId: string): ChatMessage[] {
  const conv = conversations.get(conversationId);
  if (!conv || conv.userId !== userId) return [];
  return conv.messages.filter((m) => m.role !== 'system');
}

export function getUserConversations(userId: string): Array<{ id: string; assistantId: string; messageCount: number; updatedAt: Date }> {
  const result: Array<{ id: string; assistantId: string; messageCount: number; updatedAt: Date }> = [];
  for (const [id, conv] of conversations) {
    if (conv.userId === userId) {
      result.push({
        id,
        assistantId: conv.assistantId,
        messageCount: conv.messages.filter((m) => m.role !== 'system').length,
        updatedAt: conv.updatedAt,
      });
    }
  }
  return result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

// ─── Lead Scoring Service (Lex) ─────────────────────────────────────────────

export async function scoreLead(leadId: string): Promise<LeadScoreResult> {
  // Fetch lead data
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      activities: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });

  if (!lead) {
    throw new Error(`Lead "${leadId}" not found`);
  }

  // Calculate behavioral factors
  const factors: LeadScoreFactor[] = [];

  // Factor 1: Budget alignment (0-25 points)
  const budgetScore = lead.budget ? Math.min(25, Math.round(lead.budget / 100000)) : 5;
  factors.push({
    name: 'Budget Alignment',
    weight: 0.25,
    value: budgetScore,
    description: lead.budget ? `Budget: AED ${lead.budget.toLocaleString()}` : 'No budget specified',
  });

  // Factor 2: Engagement recency (0-25 points)
  const lastActivity = lead.activities?.[0];
  let recencyScore = 5;
  if (lastActivity) {
    const daysSinceLastActivity = Math.floor(
      (Date.now() - new Date(lastActivity.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    recencyScore = daysSinceLastActivity <= 1 ? 25 : daysSinceLastActivity <= 7 ? 20 : daysSinceLastActivity <= 14 ? 15 : daysSinceLastActivity <= 30 ? 10 : 5;
  }
  factors.push({
    name: 'Engagement Recency',
    weight: 0.25,
    value: recencyScore,
    description: lastActivity
      ? `Last activity: ${new Date(lastActivity.createdAt).toLocaleDateString()}`
      : 'No activity recorded',
  });

  // Factor 3: Activity volume (0-25 points)
  const activityCount = lead.activities?.length || 0;
  const volumeScore = Math.min(25, activityCount * 3);
  factors.push({
    name: 'Activity Volume',
    weight: 0.25,
    value: volumeScore,
    description: `${activityCount} activities recorded`,
  });

  // Factor 4: Lead status progression (0-25 points)
  const statusScoreMap: Record<string, number> = {
    new: 5,
    contacted: 10,
    qualified: 15,
    proposal: 20,
    negotiation: 22,
    closed_won: 25,
    closed_lost: 0,
  };
  const statusScore = statusScoreMap[lead.status] ?? 5;
  factors.push({
    name: 'Pipeline Stage',
    weight: 0.25,
    value: statusScore,
    description: `Current status: ${lead.status}`,
  });

  // Calculate total score
  const totalScore = Math.min(100, factors.reduce((sum, f) => sum + f.value, 0));

  // Classify
  let classification: LeadScoreResult['classification'];
  if (totalScore >= 80) classification = 'very_hot';
  else if (totalScore >= 60) classification = 'hot';
  else if (totalScore >= 40) classification = 'warm';
  else classification = 'cold';

  // Decay warning
  let decayWarning: string | undefined;
  if (recencyScore <= 10 && totalScore >= 40) {
    decayWarning = 'Lead score is decaying due to inactivity. Recommend immediate follow-up.';
  }

  // Recommendation
  const recommendations: Record<string, string> = {
    very_hot: 'Immediate follow-up required. Assign senior agent. Schedule viewing within 24 hours.',
    hot: 'High priority. Contact within 48 hours. Send personalized property recommendation.',
    warm: 'Regular follow-up. Add to nurture sequence. Share market report.',
    cold: 'Low priority. Add to automated drip campaign. Re-engage in 30 days.',
  };

  logger.info('Lead scored', { leadId, totalScore, classification });

  return {
    score: totalScore,
    classification,
    factors,
    recommendation: recommendations[classification],
    decayWarning,
  };
}

export async function batchScoreLeads(leadIds: string[]): Promise<Map<string, LeadScoreResult>> {
  const results = new Map<string, LeadScoreResult>();
  for (const id of leadIds) {
    try {
      const result = await scoreLead(id);
      results.set(id, result);
    } catch (err) {
      logger.warn('Failed to score lead', { leadId: id, error: (err as Error).message });
    }
  }
  return results;
}

// ─── Document Generation Service (Docu) ─────────────────────────────────────

export async function generateDocument(request: DocumentRequest, userId: string): Promise<DocumentResult> {
  const id = `doc-${Date.now()}`;
  const templates = getDocumentTemplates();
  const template = templates[request.type];

  if (!template) {
    throw new Error(`Unknown document type: "${request.type}"`);
  }

  // Enrich template with property/lead data
  let enrichedContent = template.content;

  if (request.propertyId) {
    const property = await prisma.property.findUnique({ where: { id: request.propertyId } });
    if (property) {
      enrichedContent = enrichedContent
        .replace(/\{\{property_title\}\}/g, property.title || 'N/A')
        .replace(/\{\{property_address\}\}/g, property.location || 'N/A')
        .replace(/\{\{property_price\}\}/g, property.price?.toLocaleString() || 'N/A')
        .replace(/\{\{property_type\}\}/g, property.type || 'N/A')
        .replace(/\{\{property_area\}\}/g, property.sqft?.toString() || 'N/A');
    }
  }

  if (request.leadId) {
    const lead = await prisma.lead.findUnique({ where: { id: request.leadId } });
    if (lead) {
      enrichedContent = enrichedContent
        .replace(/\{\{buyer_name\}\}/g, lead.name || 'N/A')
        .replace(/\{\{buyer_email\}\}/g, lead.email || 'N/A')
        .replace(/\{\{buyer_phone\}\}/g, lead.phone || 'N/A');
    }
  }

  // Replace custom fields
  if (request.customFields) {
    for (const [key, value] of Object.entries(request.customFields)) {
      enrichedContent = enrichedContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
  }

  // Replace remaining placeholders with TBD
  enrichedContent = enrichedContent.replace(/\{\{[^}]+\}\}/g, '[TBD]');

  logger.info('Document generated', { type: request.type, documentId: id, userId });

  return {
    id,
    type: request.type,
    title: template.title,
    status: 'generated',
    content: enrichedContent,
    createdAt: new Date(),
  };
}

function getDocumentTemplates(): Record<string, { title: string; content: string }> {
  return {
    mou: {
      title: 'Memorandum of Understanding',
      content: `# MEMORANDUM OF UNDERSTANDING

**Date:** ${new Date().toLocaleDateString('en-AE')}
**Reference:** MOU-${Date.now()}

---

## PARTIES

**Seller:** White Caves Real Estate LLC
**License No:** [TBD]
**Address:** Dubai, United Arab Emirates

**Buyer:** {{buyer_name}}
**Email:** {{buyer_email}}
**Phone:** {{buyer_phone}}

---

## PROPERTY DETAILS

- **Title:** {{property_title}}
- **Location:** {{property_address}}
- **Type:** {{property_type}}
- **Area:** {{property_area}} sq ft
- **Price:** AED {{property_price}}

---

## TERMS AND CONDITIONS

1. The Buyer agrees to purchase the above property at the stated price
2. A deposit of 10% (AED {{deposit_amount}}) is due within 7 business days
3. Transfer of ownership shall occur within 60 days of this agreement
4. Both parties agree to comply with all RERA and DLD regulations

---

## SIGNATURES

| Party | Name | Signature | Date |
|-------|------|-----------|------|
| Seller | _____________ | _____________ | _______ |
| Buyer | {{buyer_name}} | _____________ | _______ |
| Witness | _____________ | _____________ | _______ |

---
*This MOU is generated by White Caves Real Estate LLC. Subject to legal review.*
`,
    },
    form_f: {
      title: 'Form F — Sale Contract',
      content: `# FORM F — SALE CONTRACT
## Dubai Land Department

**Contract No:** F-${Date.now()}
**Date:** ${new Date().toLocaleDateString('en-AE')}

---

### PROPERTY INFORMATION
- **Property:** {{property_title}}
- **Location:** {{property_address}}
- **Type:** {{property_type}}
- **Area:** {{property_area}} sq ft
- **RERA Permit No:** {{rera_permit}}
- **Title Deed No:** {{title_deed}}

### SALE PRICE
- **Agreed Price:** AED {{property_price}}
- **DLD Fee (4%):** AED {{dld_fee}}
- **Agent Commission (2%):** AED {{commission_amount}}
- **Transfer Fee:** AED {{transfer_fee}}

### PARTIES
**Seller:** {{seller_name}}
**Emirates ID:** {{seller_eid}}

**Buyer:** {{buyer_name}}
**Emirates ID:** {{buyer_eid}}

---
*This is a template. Must be completed with a licensed RERA broker.*
`,
    },
    ejari: {
      title: 'Ejari Registration — Tenancy Contract',
      content: `# EJARI TENANCY CONTRACT

**Ejari No:** EJ-${Date.now()}
**Date:** ${new Date().toLocaleDateString('en-AE')}

---

### LANDLORD
- **Name:** {{landlord_name}}
- **Contact:** {{landlord_phone}}

### TENANT
- **Name:** {{buyer_name}}
- **Contact:** {{buyer_phone}}
- **Email:** {{buyer_email}}

### PROPERTY
- **Address:** {{property_address}}
- **Type:** {{property_type}}
- **Area:** {{property_area}} sq ft

### LEASE TERMS
- **Annual Rent:** AED {{annual_rent}}
- **Security Deposit:** AED {{security_deposit}}
- **Start Date:** {{lease_start}}
- **End Date:** {{lease_end}}
- **Payment:** {{payment_frequency}} cheques

---
*Registered with Ejari — Dubai Real Estate Regulatory Authority (RERA)*
`,
    },
    noc: {
      title: 'No Objection Certificate',
      content: `# NO OBJECTION CERTIFICATE

**Date:** ${new Date().toLocaleDateString('en-AE')}
**Reference:** NOC-${Date.now()}

---

This is to certify that **{{developer_name}}** has no objection to the transfer of:

**Property:** {{property_title}}
**Location:** {{property_address}}
**Unit No:** {{unit_number}}

From: **{{seller_name}}**
To: **{{buyer_name}}**

All outstanding service charges and fees have been settled as of the date of this certificate.

---

**Authorized Signatory:**
Name: _____________
Position: _____________
Date: _____________
Stamp: _____________

---
*Valid for 30 days from date of issue*
`,
    },
    invoice: {
      title: 'Commission Invoice',
      content: `# COMMISSION INVOICE

**Invoice No:** INV-${Date.now()}
**Date:** ${new Date().toLocaleDateString('en-AE')}
**Due Date:** ${new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-AE')}

---

### FROM
White Caves Real Estate LLC
Dubai, UAE
TRN: {{trn_number}}

### TO
{{buyer_name}}
{{buyer_email}}
{{buyer_phone}}

---

### ITEMS

| Description | Amount (AED) |
|-------------|-------------|
| Property: {{property_title}} | |
| Sale Price: AED {{property_price}} | |
| Commission (2%): | {{commission_amount}} |
| VAT (5%): | {{vat_amount}} |
| **Total Due:** | **{{total_amount}}** |

---

### PAYMENT DETAILS
**Bank:** {{bank_name}}
**Account:** {{account_number}}
**IBAN:** {{iban}}
**Swift:** {{swift_code}}

---
*Payment terms: Net 30 days. Late payments subject to 1.5% monthly interest.*
`,
    },
    tenancy_contract: {
      title: 'Tenancy Contract',
      content: `# TENANCY CONTRACT

**Contract No:** TC-${Date.now()}
**Date:** ${new Date().toLocaleDateString('en-AE')}

---

### LANDLORD DETAILS
- **Name:** {{landlord_name}}
- **Contact:** {{landlord_phone}}
- **Emirates ID:** {{landlord_eid}}

### TENANT DETAILS
- **Name:** {{buyer_name}}
- **Email:** {{buyer_email}}
- **Phone:** {{buyer_phone}}
- **Emirates ID:** {{tenant_eid}}

### PROPERTY DETAILS
- **Address:** {{property_address}}
- **Type:** {{property_type}}
- **Area:** {{property_area}} sq ft
- **Furnished:** {{furnished_status}}

### FINANCIAL TERMS
- **Annual Rent:** AED {{annual_rent}}
- **Security Deposit:** AED {{security_deposit}} (refundable)
- **Agency Fee:** AED {{agency_fee}}
- **Ejari Fee:** AED 220
- **Payment Plan:** {{payment_frequency}} cheques

### DURATION
- **Start:** {{lease_start}}
- **End:** {{lease_end}}
- **Renewal:** Automatic unless 90-day notice given

---

### SPECIAL CONDITIONS
1. Tenant shall maintain the property in good condition
2. No structural modifications without landlord approval
3. Subject to RERA rent index for annual adjustments
4. Early termination requires 2 months penalty

---
*This contract is subject to registration with Ejari and RERA regulations*
`,
    },
  };
}

// ─── Market Analysis Service (Maven) ────────────────────────────────────────

export function getMarketInsights(area?: string): MarketInsight[] {
  // Mock data — will connect to DLD API / property data feeds in Phase 1
  const insights: MarketInsight[] = [
    {
      area: 'Dubai Marina',
      propertyType: 'Apartment',
      avgPricePerSqft: 1850,
      priceChange30d: 2.3,
      priceChange90d: 5.8,
      demandScore: 85,
      supplyScore: 60,
      forecast: 'bullish',
      topDevelopers: ['Emaar', 'DAMAC', 'Select Group'],
      reraTransactions: 342,
      updatedAt: new Date(),
    },
    {
      area: 'Downtown Dubai',
      propertyType: 'Apartment',
      avgPricePerSqft: 2400,
      priceChange30d: 1.8,
      priceChange90d: 4.2,
      demandScore: 92,
      supplyScore: 45,
      forecast: 'bullish',
      topDevelopers: ['Emaar', 'Meraas'],
      reraTransactions: 287,
      updatedAt: new Date(),
    },
    {
      area: 'Palm Jumeirah',
      propertyType: 'Villa',
      avgPricePerSqft: 3200,
      priceChange30d: 3.1,
      priceChange90d: 8.5,
      demandScore: 78,
      supplyScore: 30,
      forecast: 'bullish',
      topDevelopers: ['Nakheel', 'Omniyat'],
      reraTransactions: 156,
      updatedAt: new Date(),
    },
    {
      area: 'Business Bay',
      propertyType: 'Office',
      avgPricePerSqft: 1200,
      priceChange30d: 0.5,
      priceChange90d: 1.2,
      demandScore: 65,
      supplyScore: 75,
      forecast: 'neutral',
      topDevelopers: ['DAMAC', 'Omniyat', 'Executive Towers'],
      reraTransactions: 198,
      updatedAt: new Date(),
    },
    {
      area: 'JVC (Jumeirah Village Circle)',
      propertyType: 'Apartment',
      avgPricePerSqft: 850,
      priceChange30d: 1.2,
      priceChange90d: 3.5,
      demandScore: 88,
      supplyScore: 80,
      forecast: 'bullish',
      topDevelopers: ['Sobha', 'Ellington', 'Binghatti'],
      reraTransactions: 520,
      updatedAt: new Date(),
    },
    {
      area: 'DIFC',
      propertyType: 'Office',
      avgPricePerSqft: 2800,
      priceChange30d: -0.3,
      priceChange90d: 0.8,
      demandScore: 70,
      supplyScore: 55,
      forecast: 'neutral',
      topDevelopers: ['Brookfield', 'ICD'],
      reraTransactions: 89,
      updatedAt: new Date(),
    },
    {
      area: 'Dubai Hills Estate',
      propertyType: 'Villa',
      avgPricePerSqft: 1600,
      priceChange30d: 2.8,
      priceChange90d: 7.1,
      demandScore: 90,
      supplyScore: 50,
      forecast: 'bullish',
      topDevelopers: ['Emaar'],
      reraTransactions: 245,
      updatedAt: new Date(),
    },
    {
      area: 'Arabian Ranches',
      propertyType: 'Villa',
      avgPricePerSqft: 1100,
      priceChange30d: 1.5,
      priceChange90d: 4.0,
      demandScore: 75,
      supplyScore: 40,
      forecast: 'bullish',
      topDevelopers: ['Emaar', 'Dubai Properties'],
      reraTransactions: 178,
      updatedAt: new Date(),
    },
  ];

  if (area) {
    return insights.filter((i) => i.area.toLowerCase().includes(area.toLowerCase()));
  }
  return insights;
}

export function getAreaForecast(area: string): {
  area: string;
  currentPrice: number;
  forecast3m: number;
  forecast6m: number;
  forecast12m: number;
  confidence: number;
  drivers: string[];
} {
  const insight = getMarketInsights(area)[0];
  if (!insight) {
    return {
      area,
      currentPrice: 0,
      forecast3m: 0,
      forecast6m: 0,
      forecast12m: 0,
      confidence: 0,
      drivers: ['No data available for this area'],
    };
  }

  // Simple linear extrapolation (mock — will use ML model in Phase 1)
  const monthlyRate = insight.priceChange90d / 3;
  return {
    area: insight.area,
    currentPrice: insight.avgPricePerSqft,
    forecast3m: Math.round(insight.avgPricePerSqft * (1 + monthlyRate * 3 / 100)),
    forecast6m: Math.round(insight.avgPricePerSqft * (1 + monthlyRate * 6 / 100)),
    forecast12m: Math.round(insight.avgPricePerSqft * (1 + monthlyRate * 12 / 100)),
    confidence: 65,
    drivers: [
      insight.demandScore > 80 ? 'High buyer demand' : 'Moderate demand',
      insight.supplyScore < 50 ? 'Limited supply' : 'Adequate supply',
      insight.forecast === 'bullish' ? 'Positive price momentum' : 'Stable pricing',
      'Expo 2020 legacy infrastructure',
      'Golden Visa program driving investor interest',
    ],
  };
}

// ─── Dashboard Metrics Service ──────────────────────────────────────────────

export async function getAssistantMetrics(): Promise<{
  totalAssistants: number;
  activeCount: number;
  departments: Record<string, number>;
  chatsStoday: number;
  topAssistants: Array<{ id: string; name: string; chats: number }>;
}> {
  const all = getAllAssistants();
  const departments: Record<string, number> = {};
  for (const a of all) {
    departments[a.department] = (departments[a.department] || 0) + 1;
  }

  // Count today's conversations
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  let chatsToday = 0;
  const assistantChatCounts: Record<string, number> = {};

  for (const conv of conversations.values()) {
    if (conv.updatedAt >= todayStart) {
      chatsToday++;
      assistantChatCounts[conv.assistantId] = (assistantChatCounts[conv.assistantId] || 0) + 1;
    }
  }

  const topAssistants = Object.entries(assistantChatCounts)
    .map(([id, chats]) => ({ id, name: ASSISTANT_REGISTRY[id]?.name || id, chats }))
    .sort((a, b) => b.chats - a.chats)
    .slice(0, 5);

  return {
    totalAssistants: all.length,
    activeCount: all.filter((a) => a.status === 'active').length,
    departments,
    chatsStoday: chatsToday,
    topAssistants,
  };
}

// ─── Private Helpers ────────────────────────────────────────────────────────

function buildSystemPrompt(assistant: AssistantInfo): string {
  return `You are ${assistant.name}, the ${assistant.role} at White Caves Real Estate LLC, a premium Dubai real estate brokerage.

Department: ${assistant.department}
Capabilities: ${assistant.capabilities.join(', ')}
Description: ${assistant.description}

Guidelines:
- Always be professional, helpful, and knowledgeable about Dubai real estate
- Reference RERA regulations and DLD procedures when relevant
- Mention specific areas like Dubai Marina, Downtown, Palm Jumeirah, JVC
- Use AED for all pricing
- Be aware of the Golden Visa program for property investors (AED 2M+)
- Suggest next steps and actions when appropriate
- Keep responses concise but informative`;
}

async function generateAssistantResponse(
  assistant: AssistantInfo,
  message: string,
  _history: ChatMessage[],
  analysis: {
    intent: string;
    sentiment: string;
    entities: Array<{ type: string; value: string }>;
    context?: ChatRequest['context'];
  }
): Promise<string> {
  // When LLM is connected, this will call OpenAI/Claude
  // For now, generate contextual mock responses based on assistant persona and intent

  const { intent, entities } = analysis;

  // Extract useful entities
  const locationEntity = entities.find((e) => e.type === 'location');
  const priceEntity = entities.find((e) => e.type === 'price_mentioned');
  const propertyTypeEntity = entities.find((e) => e.type === 'property_type');

  // Persona-specific response generation
  switch (assistant.id) {
    case 'zoe':
      return generateZoeResponse(message, intent);
    case 'clara':
      return generateClaraResponse(message, intent, locationEntity, priceEntity);
    case 'mary':
      return generateMaryResponse(message, intent, locationEntity, propertyTypeEntity);
    case 'sophia':
      return generateSophiaResponse(message, intent);
    case 'theodora':
      return generateTheodoraResponse(message, intent);
    case 'lex':
      return generateLexResponse(message, intent);
    case 'docu':
      return generateDocuResponse(message, intent);
    case 'maven':
      return generateMavenResponse(message, intent, locationEntity);
    default:
      return generateGenericResponse(assistant, message, intent);
  }
}

function generateZoeResponse(message: string, intent: string): string {
  if (intent.includes('INFORMATION') || message.toLowerCase().includes('report')) {
    return `📊 **Executive Briefing — ${new Date().toLocaleDateString('en-AE')}**

Here's your real-time KPI snapshot:
• **Active Leads:** 47 (↑12% this week)
• **Pipeline Value:** AED 28.5M
• **Conversion Rate:** 8.2% (above 8% target)
• **Avg Response Time:** 2.4 hours

**Top Performing Areas:** Dubai Marina, Downtown, JVC
**Revenue This Month:** AED 1.2M (on track for AED 1.8M target)

Would you like me to drill into any specific department or KPI?`;
  }
  return `Hello! I'm Zoe, your Executive Assistant. I monitor all departments and can provide:
• Real-time KPI dashboards
• Cross-department reports
• Performance analytics
• Strategic insights

What would you like to know?`;
}

function generateClaraResponse(message: string, intent: string, location?: { type: string; value: string } | undefined, price?: { type: string; value: string } | undefined): string {
  if (intent.includes('PROPERTY_INQUIRY') || intent.includes('PURCHASE')) {
    const loc = location?.value || 'Dubai';
    const priceRange = price?.value || 'your budget range';
    return `Great interest noted! Let me check our database for properties in **${loc}** within **${priceRange}**.

Current pipeline status:
• **Hot Leads:** 12 (ready to close)
• **Active Properties:** 156 in ${loc}
• **Avg Days to Close:** 45

I'll prepare a shortlist of matching properties. Shall I also schedule viewings?`;
  }
  return `Hi! I'm Clara, your Leads CRM Manager. I handle:
• Lead qualification & scoring
• Pipeline management
• Activity tracking
• Conversion analytics

How can I help manage your leads today?`;
}

function generateMaryResponse(message: string, intent: string, location?: { type: string; value: string } | undefined, propertyType?: { type: string; value: string } | undefined): string {
  if (intent.includes('PROPERTY')) {
    const loc = location?.value || 'Dubai';
    const type = propertyType?.value || 'properties';
    return `📋 **Inventory Update — ${loc}**

Here's what we currently have for **${type}**:
• **Available:** 89 units
• **Under Offer:** 23 units
• **Newly Listed (7 days):** 12 units
• **Price Range:** AED 800K — AED 15M

Top listings in ${loc}:
1. 2BR Apartment, Marina View — AED 2.1M
2. 3BR Penthouse, Downtown — AED 5.8M
3. Studio, JVC — AED 650K

Want me to filter by specific criteria?`;
  }
  return `Hi! I'm Mary, your Inventory Manager. I oversee:
• Property listings & details
• Stock levels by area
• Pricing & valuation data
• Listing quality checks

What inventory information do you need?`;
}

function generateSophiaResponse(message: string, intent: string): string {
  if (intent.includes('NEGOTIATION') || intent.includes('PURCHASE')) {
    return `💼 **Deal Pipeline Status**

Current active deals:
• **Negotiation Phase:** 8 deals (AED 12.4M total)
• **Contract Phase:** 3 deals (AED 4.8M total)
• **Closing Phase:** 2 deals (AED 2.1M total)

Average negotiation → close: 32 days
This month's target: AED 15M (currently at 67%)

Need me to track a specific deal or update a negotiation?`;
  }
  return `Hi! I'm Sophia, your Pipeline Manager. I track:
• Deal progression (offer → close)
• Negotiation status
• Contract timelines
• Commission forecasts

What deal would you like to discuss?`;
}

function generateTheodoraResponse(message: string, intent: string): string {
  if (message.toLowerCase().includes('commission') || message.toLowerCase().includes('payment')) {
    return `💰 **Financial Summary**

**Commission Overview:**
• Pending: AED 485,000 (6 transactions)
• Processing: AED 120,000 (2 transactions)
• Paid This Month: AED 340,000

**Revenue Breakdown:**
• Sales Commission: 68%
• Leasing Commission: 22%
• Management Fees: 10%

**Outstanding Invoices:** 4 (AED 215,000 total)
Next payment cycle: ${new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-AE')}

Need detailed breakdown for any transaction?`;
  }
  return `Hi! I'm Theodora, your Finance Director. I manage:
• Commission tracking & payouts
• Invoice generation
• Payment processing
• Financial reporting

What financial information do you need?`;
}

function generateLexResponse(message: string, intent: string): string {
  return `🎯 **Lead Scoring Engine — Lex**

I use behavioral analysis to score leads 0-100:

**Scoring Factors:**
• Budget alignment (25%)
• Engagement recency (25%)
• Activity volume (25%)
• Pipeline stage (25%)

**Score Classifications:**
• 🔴 Very Hot (80-100): Immediate follow-up
• 🟠 Hot (60-79): High priority
• 🟡 Warm (40-59): Regular nurture
• 🔵 Cold (0-39): Automated drip

**Decay Policy:** -5 points per inactive week

Want me to score a specific lead or batch-score your pipeline?`;
}

function generateDocuResponse(message: string, intent: string): string {
  return `📄 **Document Generator — Docu**

I can generate these Dubai real estate documents:

1. **MoU** — Memorandum of Understanding
2. **Form F** — DLD Sale Contract
3. **Ejari** — Tenancy Registration
4. **NOC** — No Objection Certificate
5. **Invoice** — Commission/Fee Invoice
6. **Tenancy Contract** — Full rental agreement

Each document is:
✅ RERA-compliant template
✅ Auto-populated with CRM data
✅ Ready for PDF export
✅ Audit-logged

Which document would you like to generate?`;
}

function generateMavenResponse(message: string, intent: string, location?: { type: string; value: string } | undefined): string {
  const area = location?.value || 'Dubai';
  const insights = getMarketInsights(area);
  const insight = insights[0];

  if (insight) {
    return `📈 **Market Intelligence — ${insight.area}**

**Price Trends:**
• Current Avg: AED ${insight.avgPricePerSqft}/sqft
• 30-day Change: ${insight.priceChange30d > 0 ? '+' : ''}${insight.priceChange30d}%
• 90-day Change: ${insight.priceChange90d > 0 ? '+' : ''}${insight.priceChange90d}%

**Market Health:**
• Demand Score: ${insight.demandScore}/100
• Supply Score: ${insight.supplyScore}/100
• RERA Transactions: ${insight.reraTransactions} (last 30 days)
• Forecast: ${insight.forecast.toUpperCase()}

**Key Developers:** ${insight.topDevelopers.join(', ')}

Want me to forecast prices or compare with another area?`;
  }

  return `📈 **Market Analyst — Maven**

I provide Dubai real estate market intelligence:
• Area price trends & forecasts
• Supply/demand analysis
• Developer project tracking
• RERA transaction data
• Agent performance scorecards

Which area or metric would you like to explore?`;
}

function generateGenericResponse(assistant: AssistantInfo, message: string, intent: string): string {
  return `Hi! I'm **${assistant.name}**, your ${assistant.role} in the ${assistant.department} department.

I can help with: ${assistant.capabilities.join(', ')}

${assistant.description}

How can I assist you today?`;
}

function buildSuggestedActions(
  intent: string,
  entities: Array<{ type: string; value: string }>,
  assistant: AssistantInfo
): SuggestedAction[] {
  const actions: SuggestedAction[] = [];

  if (intent.includes('property')) {
    actions.push({
      type: 'view_property',
      label: 'Browse Properties',
      payload: { location: entities.find((e) => e.type === 'location')?.value },
    });
  }

  if (intent.includes('tour') || intent.includes('viewing')) {
    actions.push({
      type: 'schedule_viewing',
      label: 'Schedule Viewing',
      payload: {},
    });
  }

  if (intent.includes('offer') || intent.includes('purchase')) {
    actions.push({
      type: 'create_lead',
      label: 'Create Lead',
      payload: {},
    });
  }

  if (assistant.capabilities.includes('documents') || assistant.id === 'docu') {
    actions.push({
      type: 'send_document',
      label: 'Generate Document',
      payload: {},
    });
  }

  return actions;
}
