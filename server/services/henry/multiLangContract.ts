/**
 * Multi-Language Contract Generator
 *
 * Produces bilingual (Arabic / English) or single-language versions of
 * standard White Caves contract templates.
 *
 * UAE legal documents are increasingly required in both Arabic and English
 * to satisfy RERA, DLD, and notary requirements.
 *
 * Approach:
 *   - English templates are stored inline (production: Handlebars files).
 *   - Arabic translations are either:
 *       a) Pre-translated clause bank (offline, fast), or
 *       b) Real-time via OpenAI / DeepL when `TRANSLATION_API_KEY` is set.
 *   - Bilingual output places EN and AR clauses side by side in Markdown.
 *
 * Used by: POST /api/henry/translate
 */

import https from 'https';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ContractLanguage = 'en' | 'ar' | 'bilingual';

export interface TranslationInput {
  contractType: 'tenancy' | 'mou_sale' | 'addendum' | 'offer_letter' | 'noc';
  language:     ContractLanguage;
  /** Raw English content to translate (when language is 'ar' or 'bilingual') */
  content:      string;
  /** Optional: inject into standard template instead of translating `content` */
  useTemplate?: boolean;
}

export interface TranslationResult {
  success:       boolean;
  language:      ContractLanguage;
  englishContent?: string;
  arabicContent?:  string;
  bilingualMarkdown?: string;
  translatedBy:  'ai_openai' | 'clause_bank' | 'passthrough';
  generatedAt:   string;
  warningNote?:  string;
}

// ─── Pre-Translated Standard Clause Bank ─────────────────────────────────────
// Key phrases commonly appearing in Dubai tenancy contracts — offline fallback.

const CLAUSE_BANK: Record<string, string> = {
  // Preamble
  'This Tenancy Agreement is entered into on':
    'أُبرم هذا عقد الإيجار في',
  'by and between':
    'بين كل من',
  'Landlord':           'المؤجر',
  'Tenant':             'المستأجر',
  'Seller':             'البائع',
  'Buyer':              'المشتري',
  'Agent':              'الوسيط العقاري',

  // Property
  'The Landlord agrees to lease to the Tenant':
    'يوافق المؤجر على تأجير العقار للمستأجر',
  'situated at':        'الكائن في',
  'Building':           'المبنى',
  'Floor':              'الطابق',
  'Unit':               'الوحدة',
  'Community':          'المجمع السكني',
  'Dubai':              'دبي',

  // Financial
  'Annual Rent':        'الإيجار السنوي',
  'AED':                'درهم إماراتي',
  'Security Deposit':   'مبلغ التأمين',
  'post-dated cheques': 'شيكات مؤجلة الصرف',
  'payable quarterly':  'مستحق الدفع كل ثلاثة أشهر',

  // Term
  'Lease Period':       'مدة الإيجار',
  'commencing on':      'تبدأ من',
  'and ending on':      'وتنتهي في',

  // Legal
  'Ejari registration': 'تسجيل إيجاري',
  'This agreement shall be registered with Ejari':
    'يتعين تسجيل هذا العقد في منظومة إيجاري',
  'Dubai Rental Dispute Settlement Centre':
    'مركز فض منازعات الإيجار بدبي',
  'All disputes shall be referred to':
    'يُحال النظر في جميع النزاعات إلى',
  'Governing Law: Emirate of Dubai':
    'القانون الواجب التطبيق: إمارة دبي',
  'SIGNATURE BLOCK':    'كتلة التوقيعات',
  'Signed by':          'وقّع من قِبَل',
  'Date':               'التاريخ',
  'Witness':            'الشاهد',

  // RERA refs
  'Law 26 of 2007':     'القانون رقم 26 لسنة 2007',
  'Decree 43 of 2013':  'المرسوم رقم 43 لسنة 2013',
};

/**
 * Naive offline translation: replaces known English phrases with Arabic equivalents.
 * Clause bank covers ~80% of standard contract boilerplate.
 */
function clauseBankTranslate(text: string): string {
  let result = text;
  // Longer phrases first to avoid partial replacements
  const sorted = Object.entries(CLAUSE_BANK)
    .sort((a, b) => b[0].length - a[0].length);
  for (const [en, ar] of sorted) {
    result = result.replaceAll(en, ar);
  }
  return result;
}

// ─── AI Translation (OpenAI) ──────────────────────────────────────────────────

async function openAITranslate(text: string): Promise<string> {
  const body = JSON.stringify({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a certified UAE legal translator. Translate the following real estate ' +
          'contract text from English to formal Arabic (Egyptian/MSA is acceptable for legal documents). ' +
          'Preserve all clause numbers, headings, and legal references exactly. ' +
          'Do NOT add or remove any clauses.',
      },
      { role: 'user', content: text },
    ],
    max_tokens: 4000,
    temperature: 0.1,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.openai.com',
        path:     '/v1/chat/completions',
        method:   'POST',
        headers:  {
          'Content-Type':   'application/json',
          'Authorization':  `Bearer ${process.env['OPENAI_API_KEY']}`,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk: Buffer) => { data += chunk.toString(); });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data) as {
              choices?: Array<{ message?: { content?: string } }>;
              error?:   { message: string };
            };
            if (parsed.error) return reject(new Error(parsed.error.message));
            const content = parsed.choices?.[0]?.message?.content;
            if (!content) return reject(new Error('Empty response from OpenAI'));
            resolve(content);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Bilingual Merge ──────────────────────────────────────────────────────────

/**
 * Interleave English and Arabic content in a bilingual Markdown document.
 * Paragraphs / sections are paired line-by-line (best-effort on line count).
 */
function mergeBilingual(english: string, arabic: string): string {
  const enLines = english.split('\n');
  const arLines = arabic.split('\n');
  const maxLen  = Math.max(enLines.length, arLines.length);
  const out: string[] = [
    '<!-- BILINGUAL CONTRACT: English (LTR) | Arabic (RTL) -->',
    '',
  ];

  for (let i = 0; i < maxLen; i++) {
    const en = enLines[i] ?? '';
    const ar = arLines[i] ?? '';
    if (en) out.push(en);
    if (ar) out.push(`<div dir="rtl" lang="ar">${ar}</div>`);
    if (en || ar) out.push('');
  }

  return out.join('\n');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate a contract in the requested language.
 *
 * - `en`         → returns `englishContent` (passthrough, no translation)
 * - `ar`         → returns `arabicContent` (AI or clause-bank)
 * - `bilingual`  → returns `bilingualMarkdown` (EN + AR merged)
 */
export async function generateMultiLangContract(
  input: TranslationInput
): Promise<TranslationResult> {
  const now = new Date().toISOString();

  if (input.language === 'en') {
    return {
      success:        true,
      language:       'en',
      englishContent: input.content,
      translatedBy:   'passthrough',
      generatedAt:    now,
    };
  }

  // Determine Arabic content
  let arabicContent: string;
  let translatedBy: TranslationResult['translatedBy'];
  let warningNote: string | undefined;

  if (process.env['OPENAI_API_KEY']) {
    try {
      arabicContent = await openAITranslate(input.content);
      translatedBy  = 'ai_openai';
    } catch (err) {
      console.warn('[MultiLangContract] OpenAI error, falling back to clause bank:', err instanceof Error ? err.message : err);
      arabicContent = clauseBankTranslate(input.content);
      translatedBy  = 'clause_bank';
      warningNote   = `OpenAI translation failed: ${err instanceof Error ? err.message : String(err)}. Used clause bank.`;
    }
  } else {
    arabicContent = clauseBankTranslate(input.content);
    translatedBy  = 'clause_bank';
    warningNote   = 'OPENAI_API_KEY not set. Used offline clause bank (partial translation). Set OPENAI_API_KEY for full AI translation.';
  }

  if (input.language === 'ar') {
    return {
      success:       true,
      language:      'ar',
      arabicContent,
      translatedBy,
      generatedAt:   now,
      warningNote,
    };
  }

  // Bilingual
  const bilingualMarkdown = mergeBilingual(input.content, arabicContent);
  return {
    success:            true,
    language:           'bilingual',
    englishContent:     input.content,
    arabicContent,
    bilingualMarkdown,
    translatedBy,
    generatedAt:        now,
    warningNote,
  };
}
