export interface FieldEvidence {
  state: 'extracted' | 'missing' | 'derived' | 'conflict';
  source: 'text' | 'mrz' | 'conversion' | 'review';
  values: string[];
  conflicts?: Record<string, string[]>;
  textRanges?: { start: number; end: number }[];
}

export interface ExtractionDiagnostics {
  fields: Record<string, FieldEvidence>;
  coverage: number;
  warnings: string[];
  ocrConfidence?: number;
  /** Bounded normalized extraction text; ranges refer only to this text, not image coordinates. */
  sourceText?: string;
}

export function normalizeDocumentText(text: string): string {
  return text.normalize('NFKC')
    .replace(/[٠-٩۰-۹]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.includes(digit)
      ? '٠١٢٣٤٥٦٧٨٩'.indexOf(digit) : '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/[‐‑‒–—−]/g, '-').replace(/[：﹕]/g, ':')
    .replace(/\r\n?/g, '\n').replace(/[^\S\n]+/g, ' ');
}

export function parseDocumentNumber(value: string): number | undefined {
  let token = normalizeDocumentText(value).replace(/^[\s([:|-]*(?:AED|sqm|sq\.?\s*m|m[²2]|sq\.?\s*ft|ft[²2]|م[²2]|متر مربع)\s*[)\]:-]*/i, '')
    .replace(/٬/g, ',').replace(/٫/g, '.')
    .match(/(?:^|[^\d])(\d[\d ,.]*)/)?.[1]?.trim().replace(/ /g, '');
  if (!token) return undefined;
  if (/^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(token)) token = token.replace(/,/g, '');
  else if (/^\d+,\d{1,2}$/.test(token)) token = token.replace(',', '.');
  else if (token.includes(',')) return undefined;
  const result = Number(token);
  return Number.isFinite(result) ? result : undefined;
}

export function normalizeDocumentDate(value: string): string {
  const text = normalizeDocumentText(value);
  const iso = /\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/.exec(text);
  const local = /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\b/.exec(text);
  const parts = iso ? [iso[3], iso[2], iso[1]] : local ? [local[1], local[2], local[3]] : [];
  return parts.length ? parts.map((part, i) => i < 2 ? part!.padStart(2, '0') : part).join('/') : '';
}

/** Label boundaries stop neighbouring columns becoming part of a person's name. */
export function readDocumentFields(text: string, schema: Record<string, string[]>): {
  values: Record<string, string[]>;
  diagnostics: ExtractionDiagnostics;
} {
  const normalized = normalizeDocumentText(text);
  const aliases = Object.entries(schema).flatMap(([key, labels]) => labels.map(label => ({ key, label: normalizeDocumentText(label) })))
    .sort((a, b) => b.label.length - a.label.length);
  const escaped = aliases.map(({ label }) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[ \\t]+'));
  const matcher = new RegExp(`(?<![\\p{L}\\p{N}])(${escaped.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  const matches = [...normalized.matchAll(matcher)].filter(match => {
    if (match[1]!.includes(' ')) return true;
    const suffix = normalized.slice(match.index! + match[0].length);
    const prefix = normalized.slice(normalized.lastIndexOf('\n', match.index!) + 1, match.index!);
    return !prefix.trim() || /\|[ \t]*$/.test(prefix) || /^[ \t]*[:/|]/.test(suffix);
  });
  const values: Record<string, string[]> = Object.fromEntries(Object.keys(schema).map(key => [key, []]));
  const ranges: Record<string, { start: number; end: number }[]> = {};
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]!;
    const alias = aliases.find(item => item.label.toLowerCase() === match[1]!.replace(/[ \t]+/g, ' ').toLowerCase());
    if (!alias) continue;
    let start = match.index! + match[0].length;
    let end = matches[i + 1]?.index ?? normalized.length;
    let segment = normalized.slice(start, end)
      .replace(/^[ \t:/|()-]+/, '').trim();
    // A bilingual label pair may have its value after the second label.
    if (!segment && matches[i + 1]) {
      const next = matches[i + 1]!;
      const nextAlias = aliases.find(item => item.label.toLowerCase() === next[1]!.replace(/[ \t]+/g, ' ').toLowerCase());
      if (nextAlias?.key === alias.key) {
        start = next.index! + next[0].length;
        end = matches[i + 2]?.index ?? normalized.length;
        segment = normalized.slice(start, end).replace(/^[ \t:/|()-]+/, '').trim();
      }
    }
    const value = segment.split('\n').find(line => line.trim())?.replace(/^[ :/|]+|[ |]+$/g, '').trim() || '';
    if (value && !values[alias.key]!.includes(value)) values[alias.key]!.push(value);
    const offset = value ? normalized.indexOf(value, start) : -1;
    if (offset >= start && offset + value.length <= Math.min(end, 65536)) {
      const list = ranges[alias.key] ||= [];
      if (!list.some(range => range.start === offset)) list.push({ start: offset, end: offset + value.length });
    }
  }
  const fields: Record<string, FieldEvidence> = {};
  for (const key of Object.keys(schema)) fields[key] = { state: values[key]!.length ? 'extracted' : 'missing', source: 'text', values: values[key]!, textRanges: ranges[key] };
  return { values, diagnostics: { fields, sourceText: normalized.slice(0, 65536), coverage: Object.values(fields).filter(field => field.state === 'extracted').length / Object.keys(schema).length, warnings: [] } };
}

export function languageValue(values: string[], language: 'en' | 'ar'): string {
  return values.map(value => language === 'ar'
    ? value.match(/[\u0600-\u06ff][\u0600-\u06ff\d\s.,()-]*/g)?.join(' ').trim() || ''
    : value.replace(/[\u0600-\u06ff]+/g, '').replace(/\s+/g, ' ').trim())
    .find(value => language === 'ar' ? !!value : /[a-z]/i.test(value)) || '';
}

export function refreshCoverage(diagnostics: ExtractionDiagnostics): void {
  const fields = Object.values(diagnostics.fields);
  diagnostics.coverage = fields.length ? fields.filter(field => field.state === 'extracted').length / fields.length : 0;
}

export function markFieldReviewed(diagnostics: ExtractionDiagnostics | undefined, key: string, value: unknown): ExtractionDiagnostics | undefined {
  if (!diagnostics) return undefined;
  const result = structuredClone(diagnostics);
  const evidenceKey = key.replace(/En$|Ar$/, '');
  const target = result.fields[key] ? key : evidenceKey;
  const state = value === '' || typeof value === 'number' && !Number.isFinite(value) ? 'missing' : 'extracted';
  const evidence = result.fields[target];
  if (evidence?.state === 'conflict' && target !== key) {
    const conflicts = { ...evidence.conflicts };
    if (!evidence.conflicts) {
      for (const language of ['en', 'ar'] as const) {
        const candidates = [...new Set(evidence.values.map(candidate => languageValue([candidate], language)).filter(Boolean))];
        if (candidates.length > 1) conflicts[`${target}${language === 'en' ? 'En' : 'Ar'}`] = candidates;
      }
      // Unknown association conflicts still require a review in the evidence's language.
      if (!Object.keys(conflicts).length) {
        const language = evidence.values.some(candidate => /[a-z]/i.test(candidate)) ? 'En' : 'Ar';
        conflicts[`${target}${language}`] = evidence.values;
      }
    }
    if (state === 'extracted') delete conflicts[key];
    result.fields[target] = {
      ...evidence, source: 'review', conflicts,
      state: Object.keys(conflicts).length ? 'conflict' : state,
      values: [...new Set([...evidence.values, String(value)])],
    };
  } else {
    result.fields[target] = { state, source: 'review', values: [String(value)] };
  }
  refreshCoverage(result);
  return result;
}
