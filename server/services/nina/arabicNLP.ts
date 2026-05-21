/**
 * Arabic NLP Service
 *
 * Detects Arabic language in WhatsApp messages and classifies intent using
 * Dubai real-estate specific Arabic keyword banks.
 *
 * Architecture: Pure rule-based (no external API required) — works offline.
 * For production scale, swap `classifyArabicIntent` with an Arabic-capable
 * LLM call (GPT-4o, Claude, or AraBERT fine-tune) via `ARABIC_NLP_API_KEY`.
 *
 * Used by:
 *   - POST /api/nina/arabic-detect
 *   - ninaEngine.ts (as a pre-processor when Arabic script is detected)
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ArabicIntentResult {
  isArabic: boolean;
  detectedLanguage: 'ar' | 'ar-en-mix' | 'en';
  intent: string;
  confidence: number;
  keywordsMatched: string[];
  suggestedEnglishIntent: string;
  transliterationHint: string;
}

export interface ArabicEntityResult {
  budgetMentioned: number | null; // AED amount if found
  bedroomsMentioned: number | null;
  areasMentioned: string[];
  propertyTypeMentioned: string | null;
}

// ─── Arabic Script Detection ──────────────────────────────────────────────────

/** Regular expression matching any Arabic Unicode block character */
const ARABIC_SCRIPT_RE = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Returns true if the message contains Arabic script characters.
 * A single Arabic character is enough to classify the message as Arabic-bearing.
 */
export function containsArabic(message: string): boolean {
  return ARABIC_SCRIPT_RE.test(message);
}

/**
 * Returns 'ar' (pure Arabic), 'ar-en-mix' (mixed Arabic + English), or 'en'.
 * Mixed messages are common in UAE WhatsApp conversations.
 */
export function detectLanguage(message: string): 'ar' | 'ar-en-mix' | 'en' {
  const hasArabic = ARABIC_SCRIPT_RE.test(message);
  const hasLatin = /[a-zA-Z]/.test(message);
  if (hasArabic && hasLatin) return 'ar-en-mix';
  if (hasArabic) return 'ar';
  return 'en';
}

// ─── Arabic Keyword Banks (Dubai Real Estate) ─────────────────────────────────

/**
 * Maps canonical English intent identifiers to arrays of Arabic keywords
 * and their transliterations commonly used in UAE real estate WhatsApp chats.
 */
const ARABIC_INTENT_KEYWORDS: Record<string, string[]> = {
  property_search: [
    'عقار',
    'شقة',
    'فيلا',
    'تاون هاوس',
    'بنتهاوس',
    'استوديو',
    'غرفة',
    'أبحث عن',
    'أريد شراء',
    'أريد إيجار',
    'متاح',
    'معروض للبيع',
    'عقارات دبي',
    'مشروع سكني',
    'وحدة سكنية',
  ],
  information_request: [
    'معلومات',
    'تفاصيل',
    'سعر',
    'مساحة',
    'طابق',
    'إطلالة',
    'مرافق',
    'كم سعر',
    'كم الإيجار',
    'ما هو السعر',
    'تكلفة',
    'رسوم',
    'عمولة',
    'موقع',
    'قريب من',
    'بجانب',
  ],
  schedule_tour: [
    'معاينة',
    'جولة',
    'زيارة',
    'مشاهدة',
    'عرض',
    'تفقد',
    'أريد معاينة',
    'هل يمكن الزيارة',
    'متى يمكن',
    'موعد',
  ],
  make_offer: [
    'عرض سعر',
    'أقدم عرض',
    'مفاوضة',
    'تفاوض',
    'قابل للتفاوض',
    'سأدفع',
    'أقبل',
    'صفقة',
    'حجز',
  ],
  financing: [
    'تمويل',
    'قرض',
    'رهن عقاري',
    'بنك',
    'دفعة أولى',
    'قسط',
    'تمويل عقاري',
    'اقتراض',
    'بالتقسيط',
  ],
  complaint: [
    'مشكلة',
    'شكوى',
    'خلل',
    'عيب',
    'تلف',
    'صيانة',
    'غير راضٍ',
    'مخالف للاتفاق',
    'لم يلتزم',
  ],
  general_inquiry: [
    'سؤال',
    'استفسار',
    'مرحبا',
    'السلام عليكم',
    'أهلاً',
    'صباح الخير',
    'مساء الخير',
    'شكراً',
    'مساعدة',
  ],
};

/** Dubai area names in Arabic + English transliterations */
const ARABIC_AREAS: Record<string, string> = {
  'دبي هيلز': 'Dubai Hills',
  'داون تاون': 'Downtown Dubai',
  'وسط المدينة': 'Downtown Dubai',
  'نخلة جميرا': 'Palm Jumeirah',
  النخلة: 'Palm Jumeirah',
  'مرسى دبي': 'Dubai Marina',
  'الخليج التجاري': 'Business Bay',
  'جي بي سي': 'JBR',
  'جميرا بيتش رزيدنس': 'JBR',
  'دبي لاند': 'Dubailand',
  'مدينة محمد بن راشد': 'MBR City',
  'داماك هيلز 2': 'DAMAC Hills 2',
  اكويا: 'DAMAC Hills 2',
  أكويا: 'DAMAC Hills 2',
  الروضة: 'Al Raudah',
  ديرة: 'Deira',
  'بر دبي': 'Bur Dubai',
};

// ─── Core Classification Function ─────────────────────────────────────────────

/**
 * Classify the intent of an Arabic or mixed-language message using keyword scoring.
 *
 * Scoring: each matching keyword adds 1 point; intent with most matches wins.
 * Tie-break: order in `ARABIC_INTENT_KEYWORDS` (property_search first).
 *
 * @param message - Raw WhatsApp message (may include Arabic, Latin, digits, emoji)
 * @returns ArabicIntentResult
 */
export function classifyArabicIntent(message: string): ArabicIntentResult {
  const lang = detectLanguage(message);
  const isArabic = lang !== 'en';

  if (!isArabic) {
    return {
      isArabic: false,
      detectedLanguage: 'en',
      intent: 'unknown',
      confidence: 0,
      keywordsMatched: [],
      suggestedEnglishIntent: 'unknown',
      transliterationHint: '',
    };
  }

  // Score each intent by keyword count
  const scores: Record<string, number> = {};
  const allMatches: string[] = [];

  for (const [intent, keywords] of Object.entries(ARABIC_INTENT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (message.includes(kw)) {
        score++;
        allMatches.push(kw);
      }
    }
    scores[intent] = score;
  }

  // Pick the highest-scoring intent
  let bestIntent = 'general_inquiry';
  let bestScore = 0;
  for (const [intent, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  // Confidence: rough estimate — 1 match → 0.5, 2 → 0.7, 3+ → 0.9
  const confidence = bestScore === 0 ? 0.3 : bestScore === 1 ? 0.5 : bestScore === 2 ? 0.7 : 0.9;

  // Transliteration hints map
  const HINT_MAP: Record<string, string> = {
    property_search: 'ابحث عن عقار (searching for property)',
    information_request: 'معلومات / تفاصيل (information / details)',
    schedule_tour: 'أريد معاينة (I want to view)',
    make_offer: 'عرض سعر (price offer)',
    financing: 'تمويل عقاري (mortgage financing)',
    complaint: 'شكوى / مشكلة (complaint / issue)',
    general_inquiry: 'استفسار عام (general inquiry)',
  };

  return {
    isArabic,
    detectedLanguage: lang,
    intent: bestIntent,
    confidence,
    keywordsMatched: [...new Set(allMatches)],
    suggestedEnglishIntent: bestIntent,
    transliterationHint: HINT_MAP[bestIntent] ?? '',
  };
}

/**
 * Extract Arabic entities: budget, bedrooms, area names, property type.
 *
 * @param message - Raw WhatsApp message
 * @returns ArabicEntityResult
 */
export function extractArabicEntities(message: string): ArabicEntityResult {
  // Budget: e.g. "مليون" (million), "ألف" (thousand), explicit AED numbers
  let budgetMentioned: number | null = null;
  const millionMatch = message.match(/(\d+(?:\.\d+)?)\s*مليون/);
  const thousandMatch = message.match(/(\d+(?:\.\d+)?)\s*ألف/);
  const aedMatch = message.match(/(\d{4,})\s*(?:درهم|AED|aed)/i);
  if (millionMatch) budgetMentioned = parseFloat(millionMatch[1]) * 1_000_000;
  else if (thousandMatch) budgetMentioned = parseFloat(thousandMatch[1]) * 1_000;
  else if (aedMatch) budgetMentioned = parseInt(aedMatch[1], 10);

  // Bedrooms: e.g. "غرفتين" (2BR), "3 غرف", "ثلاث غرف"
  let bedroomsMentioned: number | null = null;
  const brMatch = message.match(/(\d)\s*غرف/);
  if (brMatch) bedroomsMentioned = parseInt(brMatch[1], 10);
  else if (message.includes('غرفتين')) bedroomsMentioned = 2;
  else if (message.includes('ثلاث غرف') || message.includes('ثلاثة غرف')) bedroomsMentioned = 3;
  else if (message.includes('أربع غرف') || message.includes('4 غرف')) bedroomsMentioned = 4;

  // Areas
  const areasMentioned: string[] = [];
  for (const [arabicName, englishName] of Object.entries(ARABIC_AREAS)) {
    if (message.includes(arabicName)) areasMentioned.push(englishName);
  }

  // Property type
  let propertyTypeMentioned: string | null = null;
  if (message.includes('شقة')) propertyTypeMentioned = 'apartment';
  else if (message.includes('فيلا')) propertyTypeMentioned = 'villa';
  else if (message.includes('تاون هاوس')) propertyTypeMentioned = 'townhouse';
  else if (message.includes('استوديو')) propertyTypeMentioned = 'studio';
  else if (message.includes('بنتهاوس')) propertyTypeMentioned = 'penthouse';

  return { budgetMentioned, bedroomsMentioned, areasMentioned, propertyTypeMentioned };
}
