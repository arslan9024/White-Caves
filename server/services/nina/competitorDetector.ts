/**
 * Competitor Property Detector
 *
 * Scans incoming lead messages for mentions of competitor real-estate
 * portals, developers, and agencies operating in the Dubai market.
 *
 * Purpose: When a lead mentions a competitor, the CRM should:
 *   1. Surface an alert to the assigned agent.
 *   2. Tag the lead with `competitor_mention`.
 *   3. Trigger a "why choose White Caves" response template.
 *
 * Architecture: Pure in-process keyword matching + regex — no external API.
 * Extend `COMPETITOR_BANKS` to add new entries as the market evolves.
 *
 * Used by:
 *   - POST /api/nina/competitor-alerts  (scan message)
 *   - GET  /api/nina/competitor-alerts  (list recent alerts)
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type CompetitorCategory =
  | 'portal'        // PropertyFinder, Bayut, Dubizzle
  | 'developer'     // Emaar, Damac, Sobha …
  | 'agency'        // Espace, Better Homes, Betterhomes …
  | 'finance'       // Mortgage brokers, UAE banks
  | 'international' // Overseas portals (Rightmove, Zillow)
  ;

export interface Competitor {
  id:           string;
  displayName:  string;
  category:     CompetitorCategory;
  /** Lower-cased keywords / patterns that trigger detection */
  keywords:     string[];
  /** Recommended counter-template to send the lead */
  counterTemplate: string;
}

export interface CompetitorMention {
  competitor:  Competitor;
  matchedText: string;
}

export interface CompetitorScanResult {
  hasMention:  boolean;
  mentions:    CompetitorMention[];
  leadId?:     string;
  phone?:      string;
  scannedAt:   string;
}

export interface CompetitorAlert extends CompetitorScanResult {
  alertId:     string;
  acknowledged: boolean;
}

// ─── Competitor Database ──────────────────────────────────────────────────────

export const COMPETITORS: Competitor[] = [
  // ── Portals ────────────────────────────────────────────────────────────────
  {
    id: 'propertyfinder',
    displayName: 'Property Finder',
    category: 'portal',
    keywords: ['property finder', 'propertyfinder', 'propertyfinder.ae'],
    counterTemplate: 'wc_exclusive_listings_advantage',
  },
  {
    id: 'bayut',
    displayName: 'Bayut',
    category: 'portal',
    keywords: ['bayut', 'bayut.com'],
    counterTemplate: 'wc_exclusive_listings_advantage',
  },
  {
    id: 'dubizzle',
    displayName: 'Dubizzle',
    category: 'portal',
    keywords: ['dubizzle', 'dubizzle.com', 'olx'],
    counterTemplate: 'wc_exclusive_listings_advantage',
  },
  {
    id: 'houza',
    displayName: 'Houza',
    category: 'portal',
    keywords: ['houza', 'houza.com'],
    counterTemplate: 'wc_exclusive_listings_advantage',
  },

  // ── Developers ─────────────────────────────────────────────────────────────
  {
    id: 'emaar',
    displayName: 'Emaar',
    category: 'developer',
    keywords: ['emaar', 'emaar properties', 'emaar square'],
    counterTemplate: 'wc_developer_comparison_advantage',
  },
  {
    id: 'damac',
    displayName: 'DAMAC',
    category: 'developer',
    keywords: ['damac', 'damac hills', 'damac lagoons', 'damac properties'],
    counterTemplate: 'wc_developer_comparison_advantage',
  },
  {
    id: 'sobha',
    displayName: 'Sobha',
    category: 'developer',
    keywords: ['sobha', 'sobha realty', 'sobha hartland'],
    counterTemplate: 'wc_developer_comparison_advantage',
  },
  {
    id: 'meraas',
    displayName: 'Meraas',
    category: 'developer',
    keywords: ['meraas', 'la mer', 'city walk', 'bluewaters'],
    counterTemplate: 'wc_developer_comparison_advantage',
  },
  {
    id: 'azizi',
    displayName: 'Azizi Developments',
    category: 'developer',
    keywords: ['azizi', 'azizi developments'],
    counterTemplate: 'wc_developer_comparison_advantage',
  },
  {
    id: 'nakheel',
    displayName: 'Nakheel',
    category: 'developer',
    keywords: ['nakheel', 'palm nakheel', 'the world islands', 'jebel ali village'],
    counterTemplate: 'wc_developer_comparison_advantage',
  },
  {
    id: 'reportage',
    displayName: 'Reportage Properties',
    category: 'developer',
    keywords: ['reportage', 'reportage properties', 'rcp'],
    counterTemplate: 'wc_developer_comparison_advantage',
  },

  // ── Agencies ───────────────────────────────────────────────────────────────
  {
    id: 'espace',
    displayName: 'Espace Real Estate',
    category: 'agency',
    keywords: ['espace', 'espace real estate'],
    counterTemplate: 'wc_agency_service_advantage',
  },
  {
    id: 'betterhomes',
    displayName: 'Better Homes',
    category: 'agency',
    keywords: ['better homes', 'betterhomes', 'betterhomes.com'],
    counterTemplate: 'wc_agency_service_advantage',
  },
  {
    id: 'allsopp',
    displayName: 'Allsopp & Allsopp',
    category: 'agency',
    keywords: ['allsopp', 'allsopp & allsopp'],
    counterTemplate: 'wc_agency_service_advantage',
  },
  {
    id: 'metropolitan',
    displayName: 'Metropolitan',
    category: 'agency',
    keywords: ['metropolitan', 'metropolitan premium properties'],
    counterTemplate: 'wc_agency_service_advantage',
  },
  {
    id: 'hamptons',
    displayName: 'Hamptons International',
    category: 'agency',
    keywords: ['hamptons', 'hamptons international'],
    counterTemplate: 'wc_agency_service_advantage',
  },

  // ── International portals ───────────────────────────────────────────────────
  {
    id: 'rightmove',
    displayName: 'Rightmove',
    category: 'international',
    keywords: ['rightmove', 'rightmove.co.uk'],
    counterTemplate: 'wc_local_expertise_advantage',
  },
  {
    id: 'zillow',
    displayName: 'Zillow',
    category: 'international',
    keywords: ['zillow', 'zillow.com'],
    counterTemplate: 'wc_local_expertise_advantage',
  },
];

// ─── Alert Store (in-memory ring buffer, 100 alerts max) ─────────────────────

const MAX_ALERTS = 100;
const alertRing: CompetitorAlert[] = [];

function addAlert(alert: CompetitorAlert): void {
  if (alertRing.length >= MAX_ALERTS) alertRing.shift();
  alertRing.push(alert);
}

// ─── Core Scanner ─────────────────────────────────────────────────────────────

/**
 * Scan a single message for competitor mentions.
 *
 * Matching is case-insensitive. Partial word matching is deliberate —
 * "Bayut listing" should still trigger the Bayut detector.
 *
 * @param message - Incoming WhatsApp / chat message
 * @param leadId  - Optional CRM lead ID (for alert tagging)
 * @param phone   - Optional phone number (for alert tagging)
 */
export function scanMessage(
  message: string,
  leadId?: string,
  phone?:  string,
): CompetitorScanResult {
  const lower    = message.toLowerCase();
  const mentions: CompetitorMention[] = [];

  for (const competitor of COMPETITORS) {
    for (const kw of competitor.keywords) {
      if (lower.includes(kw)) {
        // Find the original casing from the message for display
        const startIdx   = lower.indexOf(kw);
        const matchedText = message.slice(startIdx, startIdx + kw.length);
        mentions.push({ competitor, matchedText });
        break; // Only one mention per competitor
      }
    }
  }

  const result: CompetitorScanResult = {
    hasMention: mentions.length > 0,
    mentions,
    leadId,
    phone,
    scannedAt: new Date().toISOString(),
  };

  if (result.hasMention) {
    const alert: CompetitorAlert = {
      ...result,
      alertId:      `comp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      acknowledged: false,
    };
    addAlert(alert);
    console.info(
      `[CompetitorDetector] ${mentions.length} competitor mention(s) detected for lead ${leadId ?? 'unknown'}. ` +
      mentions.map(m => m.competitor.displayName).join(', ')
    );
  }

  return result;
}

/**
 * Return recent unacknowledged competitor alerts (newest first).
 * @param limit - Maximum number of alerts to return (default 20)
 */
export function getRecentAlerts(limit = 20): CompetitorAlert[] {
  return [...alertRing]
    .reverse()
    .slice(0, limit);
}

/**
 * Acknowledge an alert (mark as seen by agent).
 */
export function acknowledgeAlert(alertId: string): boolean {
  const alert = alertRing.find(a => a.alertId === alertId);
  if (!alert) return false;
  alert.acknowledged = true;
  return true;
}

/**
 * Get a deduplicated list of all competitors (for admin UI dropdowns).
 */
export function getAllCompetitors(): Competitor[] {
  return COMPETITORS;
}
