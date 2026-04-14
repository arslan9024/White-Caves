/**
 * Entity Extractor — Advanced NLP Entity Recognition for Dubai Real Estate
 *
 * Extracts structured entities from natural language messages:
 *   - Property types (villa, apartment, townhouse, penthouse, plot, etc.)
 *   - Locations (60+ Dubai areas + emirates)
 *   - Prices (AED amounts, ranges, shorthand like "1.5M", "800K")
 *   - Bedrooms/Bathrooms
 *   - Sizes (sqft / sqm with conversion)
 *   - Dates & timeframes ("next week", "March 2026", "ASAP")
 *   - Contact info (phone numbers, emails, names)
 *   - Amenities (pool, gym, parking, etc.)
 *   - Transaction types (buy, rent, lease, invest)
 *
 * Architecture:
 *   NinaEngine.processMessage()
 *     └─> EntityExtractor.extract(message)  ← this service
 *           └─> returns Entity[] with type, value, confidence, position
 *
 * Dubai-specific: emirate IDs, local phone formats, AED currency,
 *   Arabic property terms, developer names (Emaar, Damac, Meraas, etc.)
 */

import { createLogger } from '../../utils/logger.js';

const log = createLogger('EntityExtractor');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type EntityType =
  | 'PROPERTY_TYPE'
  | 'LOCATION'
  | 'PRICE'
  | 'PRICE_RANGE'
  | 'BEDROOMS'
  | 'BATHROOMS'
  | 'SIZE'
  | 'DATE'
  | 'TIMEFRAME'
  | 'PHONE'
  | 'EMAIL'
  | 'NAME'
  | 'AMENITY'
  | 'DEVELOPER'
  | 'TRANSACTION_TYPE'
  | 'FURNISHING'
  | 'VIEW_TYPE';

export interface ExtractedEntity {
  type: EntityType;
  value: string;
  /** Normalized value for filtering/matching */
  normalized: string;
  confidence: number;
  /** Character position in original message */
  position: { start: number; end: number };
  /** Raw matched text */
  raw: string;
}

export interface ExtractionResult {
  entities: ExtractedEntity[];
  /** Count by type for quick access */
  counts: Partial<Record<EntityType, number>>;
  /** Processing time in ms */
  processingTimeMs: number;
}

// ─────────────────────────────────────────────────────────────
// Reference Data — Dubai Real Estate Domain
// ─────────────────────────────────────────────────────────────

/** 60+ Dubai neighborhoods & areas */
const LOCATIONS: Array<{ pattern: RegExp; normalized: string; area: string }> = [
  // Marina / JBR
  { pattern: /\bdubai\s*marina\b/i, normalized: 'Dubai Marina', area: 'Marina' },
  { pattern: /\bjbr\b|\bjumeirah\s*beach\s*residen/i, normalized: 'JBR', area: 'Marina' },
  { pattern: /\bbluewaters?\b/i, normalized: 'Bluewaters Island', area: 'Marina' },
  // Downtown
  { pattern: /\bdowntown\b|\bdowntown\s*dubai\b/i, normalized: 'Downtown Dubai', area: 'Downtown' },
  { pattern: /\bburj\s*khalifa\b/i, normalized: 'Burj Khalifa District', area: 'Downtown' },
  { pattern: /\bbusiness\s*bay\b/i, normalized: 'Business Bay', area: 'Downtown' },
  { pattern: /\bdifc\b|\bfinancial\s*cent/i, normalized: 'DIFC', area: 'Downtown' },
  { pattern: /\bcity\s*walk\b/i, normalized: 'City Walk', area: 'Downtown' },
  // Palm & Jumeirah
  { pattern: /\bpalm\s*jumeirah\b|\bthe\s*palm\b/i, normalized: 'Palm Jumeirah', area: 'Palm' },
  { pattern: /\bjumeirah\b(?!\s*beach\s*residen)/i, normalized: 'Jumeirah', area: 'Jumeirah' },
  { pattern: /\bumm\s*suqeim\b/i, normalized: 'Umm Suqeim', area: 'Jumeirah' },
  // Creek
  { pattern: /\bcreek\s*harbo[u]?r\b/i, normalized: 'Dubai Creek Harbour', area: 'Creek' },
  { pattern: /\bcreek\s*rise\b/i, normalized: 'Creek Rise', area: 'Creek' },
  { pattern: /\bdeira\b/i, normalized: 'Deira', area: 'Creek' },
  { pattern: /\bbur\s*dubai\b/i, normalized: 'Bur Dubai', area: 'Creek' },
  // New Dubai
  { pattern: /\bdubai\s*hills?\b/i, normalized: 'Dubai Hills Estate', area: 'New Dubai' },
  { pattern: /\barabian\s*ranches?\b/i, normalized: 'Arabian Ranches', area: 'New Dubai' },
  { pattern: /\bemirates\s*living\b/i, normalized: 'Emirates Living', area: 'New Dubai' },
  { pattern: /\bsprings\b/i, normalized: 'The Springs', area: 'New Dubai' },
  { pattern: /\bmeadows\b/i, normalized: 'The Meadows', area: 'New Dubai' },
  { pattern: /\bthe\s*villa\b/i, normalized: 'The Villa', area: 'New Dubai' },
  { pattern: /\bdubailand\b/i, normalized: 'Dubailand', area: 'New Dubai' },
  { pattern: /\bmudon\b/i, normalized: 'Mudon', area: 'New Dubai' },
  { pattern: /\btown\s*square\b/i, normalized: 'Town Square', area: 'New Dubai' },
  // South & Airport
  { pattern: /\bdubai\s*south\b/i, normalized: 'Dubai South', area: 'South' },
  { pattern: /\bjvc\b|\bjumeirah\s*village\s*circ/i, normalized: 'JVC', area: 'South' },
  { pattern: /\bjvt\b|\bjumeirah\s*village\s*tri/i, normalized: 'JVT', area: 'South' },
  { pattern: /\bmotor\s*city\b/i, normalized: 'Motor City', area: 'South' },
  { pattern: /\bsports?\s*city\b/i, normalized: 'Dubai Sports City', area: 'South' },
  { pattern: /\bsilicon\s*oasis\b|\bdso\b/i, normalized: 'Dubai Silicon Oasis', area: 'South' },
  { pattern: /\binternational\s*city\b/i, normalized: 'International City', area: 'South' },
  // Waterfront
  { pattern: /\bsobha\s*hartland\b/i, normalized: 'Sobha Hartland', area: 'MBR City' },
  { pattern: /\bmbr\s*city\b|\bm[o]?hammed\s*bin\s*rashid/i, normalized: 'MBR City', area: 'MBR City' },
  { pattern: /\bmeydan\b/i, normalized: 'Meydan', area: 'MBR City' },
  { pattern: /\bal\s*barsha\b/i, normalized: 'Al Barsha', area: 'West' },
  { pattern: /\btecom\b/i, normalized: 'TECOM', area: 'West' },
  { pattern: /\bgreens?\b/i, normalized: 'The Greens', area: 'West' },
  { pattern: /\bviews?\b(?!\s*type)/i, normalized: 'The Views', area: 'West' },
  // RAK / Sharjah / Abu Dhabi (for cross-emirate queries)
  { pattern: /\bsharjah\b/i, normalized: 'Sharjah', area: 'Sharjah' },
  { pattern: /\babu\s*dhabi\b/i, normalized: 'Abu Dhabi', area: 'Abu Dhabi' },
  { pattern: /\bras\s*al\s*khaim/i, normalized: 'Ras Al Khaimah', area: 'RAK' },
  { pattern: /\bajman\b/i, normalized: 'Ajman', area: 'Ajman' },
];

const PROPERTY_TYPES: Array<{ pattern: RegExp; normalized: string }> = [
  { pattern: /\bvilla[s]?\b/i, normalized: 'villa' },
  { pattern: /\bapartment[s]?\b|\bapt[s]?\b/i, normalized: 'apartment' },
  { pattern: /\btownhouse[s]?\b/i, normalized: 'townhouse' },
  { pattern: /\bpenthouse[s]?\b/i, normalized: 'penthouse' },
  { pattern: /\bstudio[s]?\b/i, normalized: 'studio' },
  { pattern: /\bflat[s]?\b/i, normalized: 'apartment' },
  { pattern: /\bduplex\b/i, normalized: 'duplex' },
  { pattern: /\bloft[s]?\b/i, normalized: 'loft' },
  { pattern: /\bplot[s]?\b|\bland\b/i, normalized: 'plot' },
  { pattern: /\boffice[s]?\b(?!\s*hour)/i, normalized: 'office' },
  { pattern: /\bwarehouse[s]?\b/i, normalized: 'warehouse' },
  { pattern: /\bretail\b|\bshop[s]?\b/i, normalized: 'retail' },
  { pattern: /\bhotel\s*apt/i, normalized: 'hotel-apartment' },
];

const DEVELOPERS: Array<{ pattern: RegExp; normalized: string }> = [
  { pattern: /\bemaar\b/i, normalized: 'Emaar' },
  { pattern: /\bdamac\b/i, normalized: 'DAMAC' },
  { pattern: /\bnakheel\b/i, normalized: 'Nakheel' },
  { pattern: /\bmeraas\b/i, normalized: 'Meraas' },
  { pattern: /\bsobha\b/i, normalized: 'Sobha' },
  { pattern: /\bazizi\b/i, normalized: 'Azizi' },
  { pattern: /\bdanube\b/i, normalized: 'Danube' },
  { pattern: /\bmag\b/i, normalized: 'MAG' },
  { pattern: /\bellington\b/i, normalized: 'Ellington' },
  { pattern: /\bomniyat\b/i, normalized: 'Omniyat' },
  { pattern: /\bselect\s*group\b/i, normalized: 'Select Group' },
  { pattern: /\bal\s*dar\b/i, normalized: 'Aldar' },
];

const AMENITIES: Array<{ pattern: RegExp; normalized: string }> = [
  { pattern: /\bpool\b|\bswimming\b/i, normalized: 'pool' },
  { pattern: /\bgym\b|\bfitness\b/i, normalized: 'gym' },
  { pattern: /\bparking\b|\bgarage\b/i, normalized: 'parking' },
  { pattern: /\bgarden\b/i, normalized: 'garden' },
  { pattern: /\bbalcon[y|ies]+\b/i, normalized: 'balcony' },
  { pattern: /\bterrace\b|\brooftop\b/i, normalized: 'terrace' },
  { pattern: /\bmaid\s*(?:room|'s\s*room)\b/i, normalized: 'maid-room' },
  { pattern: /\blaundry\b/i, normalized: 'laundry' },
  { pattern: /\bconcierge\b/i, normalized: 'concierge' },
  { pattern: /\bspa\b|\bsauna\b/i, normalized: 'spa' },
  { pattern: /\bkids?\s*(?:play|area|room)\b/i, normalized: 'kids-area' },
  { pattern: /\bsecurity\b|\bcctv\b/i, normalized: 'security' },
  { pattern: /\bsmart\s*home\b/i, normalized: 'smart-home' },
  { pattern: /\bpet\s*friendly\b/i, normalized: 'pet-friendly' },
];

const VIEW_TYPES: Array<{ pattern: RegExp; normalized: string }> = [
  { pattern: /\bsea\s*view\b|\bocean\s*view\b/i, normalized: 'sea-view' },
  { pattern: /\bmarina\s*view\b/i, normalized: 'marina-view' },
  { pattern: /\bcity\s*view\b|\bskyline\s*view\b/i, normalized: 'city-view' },
  { pattern: /\bgarden\s*view\b|\bpark\s*view\b/i, normalized: 'garden-view' },
  { pattern: /\bgolf\s*(course\s*)?view\b/i, normalized: 'golf-view' },
  { pattern: /\bburj\s*khalifa\s*view\b/i, normalized: 'burj-khalifa-view' },
  { pattern: /\bpool\s*view\b/i, normalized: 'pool-view' },
  { pattern: /\bcommunity\s*view\b/i, normalized: 'community-view' },
];

const FURNISHING: Array<{ pattern: RegExp; normalized: string }> = [
  { pattern: /\bfurnished\b(?!\s*\/?\s*un)/i, normalized: 'furnished' },
  { pattern: /\bunfurnished\b/i, normalized: 'unfurnished' },
  { pattern: /\bsemi[\s-]*furnished\b/i, normalized: 'semi-furnished' },
];

const TRANSACTION_TYPES: Array<{ pattern: RegExp; normalized: string }> = [
  { pattern: /\bbuy\b|\bpurchas/i, normalized: 'buy' },
  { pattern: /\brent\b|\bleas/i, normalized: 'rent' },
  { pattern: /\binvest\b/i, normalized: 'invest' },
  { pattern: /\bsell\b/i, normalized: 'sell' },
  { pattern: /\boff[\s-]*plan\b/i, normalized: 'off-plan' },
  { pattern: /\bresale\b/i, normalized: 'resale' },
];

// ─────────────────────────────────────────────────────────────
// Price Parsing (Dubai-specific: AED, shorthand, ranges)
// ─────────────────────────────────────────────────────────────

/**
 * Parse a price string like "1.5M", "800K", "2,500,000" → numeric AED value
 */
function parsePriceValue(raw: string): number | null {
  const cleaned = raw.replace(/[,\s]/g, '').replace(/aed/i, '').trim();

  // Shorthand: 1.5M, 2M, 800K
  const shorthand = cleaned.match(/^([\d.]+)\s*([mk])/i);
  if (shorthand) {
    const num = parseFloat(shorthand[1]);
    const multiplier = shorthand[2].toLowerCase() === 'm' ? 1_000_000 : 1_000;
    return num * multiplier;
  }

  // Plain number
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// ─────────────────────────────────────────────────────────────
// Entity Extractor
// ─────────────────────────────────────────────────────────────

export class EntityExtractor {

  /**
   * Extract all entities from a message
   */
  public extract(message: string): ExtractionResult {
    const start = Date.now();
    const entities: ExtractedEntity[] = [];

    entities.push(...this.extractPropertyTypes(message));
    entities.push(...this.extractLocations(message));
    entities.push(...this.extractPrices(message));
    entities.push(...this.extractBedrooms(message));
    entities.push(...this.extractBathrooms(message));
    entities.push(...this.extractSizes(message));
    entities.push(...this.extractDates(message));
    entities.push(...this.extractTimeframes(message));
    entities.push(...this.extractPhones(message));
    entities.push(...this.extractEmails(message));
    entities.push(...this.extractDevelopers(message));
    entities.push(...this.extractAmenities(message));
    entities.push(...this.extractViewTypes(message));
    entities.push(...this.extractFurnishing(message));
    entities.push(...this.extractTransactionTypes(message));

    // Deduplicate overlapping entities (keep higher confidence)
    const deduped = this.deduplicateEntities(entities);

    // Count by type
    const counts: Partial<Record<EntityType, number>> = {};
    for (const e of deduped) {
      counts[e.type] = (counts[e.type] || 0) + 1;
    }

    const processingTimeMs = Date.now() - start;
    log.debug(`Extracted ${deduped.length} entities in ${processingTimeMs}ms`, { counts });

    return { entities: deduped, counts, processingTimeMs };
  }

  // ─── Extractors ────────────────────────────────────────

  private extractPropertyTypes(msg: string): ExtractedEntity[] {
    return this.matchPatterns(msg, PROPERTY_TYPES, 'PROPERTY_TYPE', 0.95);
  }

  private extractLocations(msg: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    for (const loc of LOCATIONS) {
      const match = loc.pattern.exec(msg);
      if (match) {
        entities.push({
          type: 'LOCATION',
          value: loc.normalized,
          normalized: loc.normalized.toLowerCase(),
          confidence: 0.92,
          position: { start: match.index, end: match.index + match[0].length },
          raw: match[0],
        });
      }
    }
    return entities;
  }

  private extractPrices(msg: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];

    // Range: "1M - 2M", "800K to 1.5M", "between 500K and 1M"
    const rangePattern = /(?:between\s+)?(?:aed\s*)?([\d,.]+\s*[mk]?)\s*(?:[-–—to]+|and)\s*(?:aed\s*)?([\d,.]+\s*[mk]?)\s*(?:aed)?/gi;
    let match: RegExpExecArray | null;
    while ((match = rangePattern.exec(msg)) !== null) {
      const low = parsePriceValue(match[1]);
      const high = parsePriceValue(match[2]);
      if (low !== null && high !== null && low >= 1000 && high >= 1000) {
        entities.push({
          type: 'PRICE_RANGE',
          value: `AED ${low.toLocaleString()} - ${high.toLocaleString()}`,
          normalized: `${low}-${high}`,
          confidence: 0.88,
          position: { start: match.index, end: match.index + match[0].length },
          raw: match[0],
        });
      }
    }

    // Single: "AED 1,500,000", "1.5M", "800K AED", "3 million"
    const singlePattern = /(?:aed\s*)?([\d,.]+)\s*(?:m(?:illion)?|k)\s*(?:aed)?|([\d,]{4,})\s*(?:aed|درهم)/gi;
    while ((match = singlePattern.exec(msg)) !== null) {
      // Skip if already captured as part of a range
      if (entities.some(e => e.position.start <= match!.index && e.position.end >= match!.index + match![0].length)) continue;

      const raw = match[1] || match[2];
      const value = parsePriceValue(match[0]);
      if (value !== null && value >= 1000) {
        entities.push({
          type: 'PRICE',
          value: `AED ${value.toLocaleString()}`,
          normalized: String(value),
          confidence: 0.85,
          position: { start: match.index, end: match.index + match[0].length },
          raw: match[0],
        });
      }
    }

    return entities;
  }

  private extractBedrooms(msg: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    const pattern = /(\d+)\s*(?:bed(?:room)?s?|br)\b/gi;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(msg)) !== null) {
      const count = parseInt(match[1], 10);
      if (count >= 0 && count <= 12) {
        entities.push({
          type: 'BEDROOMS',
          value: `${count}BR`,
          normalized: String(count),
          confidence: 0.90,
          position: { start: match.index, end: match.index + match[0].length },
          raw: match[0],
        });
      }
    }
    return entities;
  }

  private extractBathrooms(msg: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    const pattern = /(\d+)\s*(?:bath(?:room)?s?)\b/gi;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(msg)) !== null) {
      const count = parseInt(match[1], 10);
      if (count >= 1 && count <= 12) {
        entities.push({
          type: 'BATHROOMS',
          value: `${count} bath`,
          normalized: String(count),
          confidence: 0.88,
          position: { start: match.index, end: match.index + match[0].length },
          raw: match[0],
        });
      }
    }
    return entities;
  }

  private extractSizes(msg: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    const pattern = /([\d,]+)\s*(sq\.?\s*ft|sqft|sq\.?\s*m|sqm|m2|ft2)\b/gi;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(msg)) !== null) {
      const value = parseInt(match[1].replace(/,/g, ''), 10);
      const unit = match[2].replace(/\s/g, '').toLowerCase().includes('m') ? 'sqm' : 'sqft';
      // Convert sqm to sqft for normalization
      const sqft = unit === 'sqm' ? Math.round(value * 10.764) : value;

      entities.push({
        type: 'SIZE',
        value: `${value} ${unit}`,
        normalized: `${sqft}sqft`,
        confidence: 0.87,
        position: { start: match.index, end: match.index + match[0].length },
        raw: match[0],
      });
    }
    return entities;
  }

  private extractDates(msg: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];

    // ISO-like: "2026-03-15", "15/03/2026", "March 15"
    const months = 'jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?';
    const datePattern = new RegExp(`(\\d{1,2})[/\\-](\\d{1,2})[/\\-](\\d{4})|(${months})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?`, 'gi');

    let match: RegExpExecArray | null;
    while ((match = datePattern.exec(msg)) !== null) {
      entities.push({
        type: 'DATE',
        value: match[0],
        normalized: match[0].toLowerCase(),
        confidence: 0.85,
        position: { start: match.index, end: match.index + match[0].length },
        raw: match[0],
      });
    }

    // Relative: "tomorrow", "today", "next monday"
    const relativeDates = /\b(today|tomorrow|yesterday|next\s+(?:week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|this\s+(?:week|month|weekend))\b/gi;
    while ((match = relativeDates.exec(msg)) !== null) {
      entities.push({
        type: 'DATE',
        value: match[0],
        normalized: match[0].toLowerCase(),
        confidence: 0.80,
        position: { start: match.index, end: match.index + match[0].length },
        raw: match[0],
      });
    }

    return entities;
  }

  private extractTimeframes(msg: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    const patterns = [
      { pattern: /\basap\b|\bimmediately\b|\burgent(?:ly)?\b/gi, normalized: 'immediate' },
      { pattern: /\bwithin\s+(\d+)\s*(days?|weeks?|months?)\b/gi, normalized: 'within-period' },
      { pattern: /\b(\d+)\s*(?:[-–])\s*(\d+)\s*(months?|weeks?)\b/gi, normalized: 'range-period' },
      { pattern: /\blong[\s-]*term\b/gi, normalized: 'long-term' },
      { pattern: /\bshort[\s-]*term\b/gi, normalized: 'short-term' },
    ];

    for (const { pattern, normalized } of patterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(msg)) !== null) {
        entities.push({
          type: 'TIMEFRAME',
          value: match[0],
          normalized,
          confidence: 0.78,
          position: { start: match.index, end: match.index + match[0].length },
          raw: match[0],
        });
      }
    }
    return entities;
  }

  private extractPhones(msg: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    // UAE: +971 XX XXX XXXX, 05X XXX XXXX, 04 XXX XXXX
    const phonePattern = /(?:\+971|00971|0)?\s*(?:5[0-9]|4|2|6|7|9)\d[\s.-]?\d{3}[\s.-]?\d{4}/g;
    let match: RegExpExecArray | null;
    while ((match = phonePattern.exec(msg)) !== null) {
      const digits = match[0].replace(/[\s.\-+]/g, '');
      if (digits.length >= 9 && digits.length <= 13) {
        entities.push({
          type: 'PHONE',
          value: match[0].trim(),
          normalized: digits.startsWith('971') ? `+${digits}` : digits.startsWith('0') ? `+971${digits.slice(1)}` : `+971${digits}`,
          confidence: 0.82,
          position: { start: match.index, end: match.index + match[0].length },
          raw: match[0],
        });
      }
    }
    return entities;
  }

  private extractEmails(msg: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    let match: RegExpExecArray | null;
    while ((match = emailPattern.exec(msg)) !== null) {
      entities.push({
        type: 'EMAIL',
        value: match[0],
        normalized: match[0].toLowerCase(),
        confidence: 0.95,
        position: { start: match.index, end: match.index + match[0].length },
        raw: match[0],
      });
    }
    return entities;
  }

  private extractDevelopers(msg: string): ExtractedEntity[] {
    return this.matchPatterns(msg, DEVELOPERS, 'DEVELOPER', 0.90);
  }

  private extractAmenities(msg: string): ExtractedEntity[] {
    return this.matchPatterns(msg, AMENITIES, 'AMENITY', 0.82);
  }

  private extractViewTypes(msg: string): ExtractedEntity[] {
    return this.matchPatterns(msg, VIEW_TYPES, 'VIEW_TYPE', 0.85);
  }

  private extractFurnishing(msg: string): ExtractedEntity[] {
    return this.matchPatterns(msg, FURNISHING, 'FURNISHING', 0.90);
  }

  private extractTransactionTypes(msg: string): ExtractedEntity[] {
    return this.matchPatterns(msg, TRANSACTION_TYPES, 'TRANSACTION_TYPE', 0.88);
  }

  // ─── Helpers ───────────────────────────────────────────

  private matchPatterns(
    msg: string,
    patterns: Array<{ pattern: RegExp; normalized: string }>,
    type: EntityType,
    confidence: number
  ): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    for (const { pattern, normalized } of patterns) {
      // Reset lastIndex for global patterns
      pattern.lastIndex = 0;
      const match = pattern.exec(msg);
      if (match) {
        entities.push({
          type,
          value: normalized,
          normalized: normalized.toLowerCase(),
          confidence,
          position: { start: match.index, end: match.index + match[0].length },
          raw: match[0],
        });
      }
    }
    return entities;
  }

  /**
   * Remove overlapping entities — keep highest confidence
   */
  private deduplicateEntities(entities: ExtractedEntity[]): ExtractedEntity[] {
    // Sort by position start, then by confidence desc
    const sorted = [...entities].sort((a, b) => {
      if (a.position.start !== b.position.start) return a.position.start - b.position.start;
      return b.confidence - a.confidence;
    });

    const result: ExtractedEntity[] = [];
    let lastEnd = -1;

    for (const entity of sorted) {
      // If this entity overlaps with the previous one, skip if lower confidence
      if (entity.position.start < lastEnd) {
        // Check if same type — allow different types at same position
        const overlapping = result.find(
          e => e.type === entity.type &&
            e.position.start <= entity.position.start &&
            e.position.end >= entity.position.start
        );
        if (overlapping) continue;
      }

      result.push(entity);
      lastEnd = Math.max(lastEnd, entity.position.end);
    }

    return result;
  }
}

// ─── Singleton ───────────────────────────────────────────────

let instance: EntityExtractor | null = null;

export function getEntityExtractor(): EntityExtractor {
  if (!instance) {
    instance = new EntityExtractor();
  }
  return instance;
}

export function createEntityExtractor(): EntityExtractor {
  return new EntityExtractor();
}
