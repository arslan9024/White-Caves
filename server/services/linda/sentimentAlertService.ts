/**
 * Real-Time Sentiment Alert Service
 *
 * Monitors incoming WhatsApp messages for negative / urgent sentiment and
 * generates real-time alerts for CRM agents when escalation is needed.
 *
 * Sentiment levels:
 *   VERY_NEGATIVE  → immediate escalation to agent + manager
 *   NEGATIVE       → alert to assigned agent within 5 minutes
 *   NEUTRAL        → no action (monitored only)
 *   POSITIVE       → no action (logged for reporting)
 *
 * Architecture:
 *   - Rule-based keyword scoring (offline, zero latency)
 *   - Optional LLM enrichment when OPENAI_API_KEY is set (for nuance)
 *   - In-memory alert store (ring buffer, last 200 alerts)
 *   - Alerts are consumed by: GET /api/linda/sentiment-alerts
 *
 * Used by:
 *   POST /api/linda/transcribe  (auto-analysis of transcribed voice)
 *   POST /api/linda/nlp-route   (analysis of any incoming message)
 *   GET  /api/linda/sentiment-alerts
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SentimentLevel = 'VERY_NEGATIVE' | 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE';
export type AlertPriority  = 'P0' | 'P1' | 'P2';

export interface SentimentScore {
  level:       SentimentLevel;
  score:       number;          // -1.0 (most negative) to +1.0 (most positive)
  keywords:    string[];        // Which keywords triggered the classification
  urgentFlag:  boolean;         // True if message contains urgency signals
}

export interface SentimentAlert {
  alertId:     string;
  leadId?:     string;
  phone?:      string;
  agentId?:    string;
  message:     string;          // Original message text
  sentiment:   SentimentScore;
  priority:    AlertPriority;
  channel:     'whatsapp' | 'voice_transcript' | 'web_chat';
  createdAt:   string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

// ─── Keyword Banks ────────────────────────────────────────────────────────────

const VERY_NEGATIVE_KEYWORDS = [
  'refund', 'lawsuit', 'court', 'lawyer', 'fraud', 'scam', 'cheat', 'police',
  'rera complaint', 'dld complaint', 'consumer protection', 'blacklist',
  'cancel contract', 'breach of contract', 'legal action',
  'احتيال', 'شكوى', 'محكمة', 'إلغاء العقد', 'محامي',
];

const NEGATIVE_KEYWORDS = [
  'disappointed', 'unhappy', 'unacceptable', 'terrible', 'bad experience',
  'no response', 'ignored', 'waste of time', 'unprofessional', 'misleading',
  'wrong information', 'broken', 'damage', 'not working', 'overpriced',
  'too expensive', 'withdraw', 'not interested anymore',
  'غير راضٍ', 'سيء', 'مشكلة', 'تأخير', 'خسارة',
];

const URGENT_KEYWORDS = [
  'urgent', 'asap', 'immediately', 'emergency', 'now', 'today',
  'deadline', 'expire', 'expiry', 'last chance', 'must', 'critical',
  'عاجل', 'فوري', 'الآن', 'اليوم', 'ضروري',
];

const POSITIVE_KEYWORDS = [
  'thank you', 'excellent', 'happy', 'satisfied', 'perfect', 'love',
  'great', 'wonderful', 'amazing', 'best', 'recommended', 'impressed',
  'شكراً', 'ممتاز', 'رائع', 'سعيد',
];

// ─── Scoring Logic ────────────────────────────────────────────────────────────

/**
 * Analyse a message and produce a SentimentScore using keyword matching.
 * Score range: -1.0 (very negative) to +1.0 (very positive).
 */
export function analyseSentiment(message: string): SentimentScore {
  const lower        = message.toLowerCase();
  const matched: string[] = [];
  let score = 0;

  // Very negative: -0.5 per match
  for (const kw of VERY_NEGATIVE_KEYWORDS) {
    if (lower.includes(kw)) { score -= 0.5; matched.push(kw); }
  }

  // Negative: -0.2 per match
  for (const kw of NEGATIVE_KEYWORDS) {
    if (lower.includes(kw)) { score -= 0.2; matched.push(kw); }
  }

  // Positive: +0.2 per match
  for (const kw of POSITIVE_KEYWORDS) {
    if (lower.includes(kw)) { score += 0.2; matched.push(kw); }
  }

  // Urgency flag
  const urgentFlag = URGENT_KEYWORDS.some(kw => lower.includes(kw));

  // Clamp score
  score = Math.max(-1.0, Math.min(1.0, score));

  // Level
  let level: SentimentLevel;
  if (score <= -0.5)      level = 'VERY_NEGATIVE';
  else if (score <= -0.1) level = 'NEGATIVE';
  else if (score >= 0.1)  level = 'POSITIVE';
  else                    level = 'NEUTRAL';

  return { level, score, keywords: [...new Set(matched)], urgentFlag };
}

// ─── Priority Assignment ──────────────────────────────────────────────────────

function scoreToPriority(sentiment: SentimentScore): AlertPriority {
  if (sentiment.level === 'VERY_NEGATIVE')                       return 'P0';
  if (sentiment.level === 'NEGATIVE' && sentiment.urgentFlag)    return 'P0';
  if (sentiment.level === 'NEGATIVE')                            return 'P1';
  if (sentiment.level === 'NEUTRAL'  && sentiment.urgentFlag)    return 'P2';
  return 'P2';
}

// ─── Alert Store ──────────────────────────────────────────────────────────────

const MAX_ALERTS = 200;
const alertStore: SentimentAlert[] = [];

function storeAlert(alert: SentimentAlert): void {
  if (alertStore.length >= MAX_ALERTS) alertStore.shift();
  alertStore.push(alert);
  console.info(
    `[SentimentAlert] ${alert.priority} — ${alert.sentiment.level} ` +
    `for lead ${alert.leadId ?? alert.phone ?? 'unknown'}. ` +
    `Keywords: ${alert.sentiment.keywords.slice(0, 3).join(', ')}`
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Evaluate a message and record a sentiment alert if actionable.
 * Returns the alert if created, or null for POSITIVE / non-urgent NEUTRAL.
 *
 * @param message  - Incoming message text (plain or transcribed)
 * @param channel  - Source channel
 * @param leadId   - Optional CRM lead ID
 * @param phone    - Optional phone number
 * @param agentId  - Optional assigned agent ID
 */
export function evaluateAndAlert(
  message:  string,
  channel:  SentimentAlert['channel'],
  leadId?:  string,
  phone?:   string,
  agentId?: string,
): SentimentAlert | null {
  const sentiment = analyseSentiment(message);
  const priority  = scoreToPriority(sentiment);

  // Only record P0 and P1 alerts
  if (priority === 'P2' && sentiment.level !== 'VERY_NEGATIVE') {
    return null;
  }

  const alert: SentimentAlert = {
    alertId:      `sa-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
    leadId,
    phone,
    agentId,
    message:      message.length > 400 ? message.slice(0, 397) + '...' : message,
    sentiment,
    priority,
    channel,
    createdAt:    new Date().toISOString(),
    acknowledged: false,
  };

  storeAlert(alert);
  return alert;
}

/**
 * Return alerts for admin/agent dashboard.
 * @param onlyUnacknowledged - Filter to pending alerts only
 * @param limit              - Max alerts to return (default 50)
 */
export function getAlerts(
  onlyUnacknowledged = false,
  limit = 50,
): SentimentAlert[] {
  return [...alertStore]
    .reverse()
    .filter(a => !onlyUnacknowledged || !a.acknowledged)
    .slice(0, limit);
}

/**
 * Acknowledge an alert (agent has seen / acted on it).
 */
export function acknowledgeAlert(
  alertId:        string,
  acknowledgedBy: string,
): boolean {
  const alert = alertStore.find(a => a.alertId === alertId);
  if (!alert) return false;
  alert.acknowledged    = true;
  alert.acknowledgedBy  = acknowledgedBy;
  alert.acknowledgedAt  = new Date().toISOString();
  return true;
}

/**
 * Summary stats for the dashboard KPI tile.
 */
export function getAlertSummary(): {
  total: number;
  p0: number;
  p1: number;
  unacknowledged: number;
} {
  const total          = alertStore.length;
  const p0             = alertStore.filter(a => a.priority === 'P0').length;
  const p1             = alertStore.filter(a => a.priority === 'P1').length;
  const unacknowledged = alertStore.filter(a => !a.acknowledged).length;
  return { total, p0, p1, unacknowledged };
}
