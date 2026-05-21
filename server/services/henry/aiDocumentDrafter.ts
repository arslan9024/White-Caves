/**
 * AI Document Drafter — Powered by Groq (LLaMA 3.3 70B)
 *
 * Generates first-draft real-estate legal documents using an LLM.
 * If GROQ_API_KEY is not set, falls back to a high-quality handlebars template.
 *
 * Supported document types:
 *   - Tenancy Contract        (Memorandum of Agreement — residential)
 *   - MOU for Sale            (Memorandum of Understanding)
 *   - NOC Request Letter      (No Objection Certificate)
 *   - Addendum                (to existing tenancy/sale)
 *   - Offer Letter            (from buyer / tenant to seller / landlord)
 *   - Commercial Lease        (commercial premises)
 *
 * Architecture:
 *   1. Caller provides `DocumentDraftInput` with the context fields.
 *   2. Service builds a structured system prompt + user content.
 *   3. Groq Completions API returns a markdown-formatted draft.
 *   4. Draft is returned as-is (PDF rendering is a separate layer).
 *
 * Used by: POST /api/henry/ai-draft
 */

import https from 'https';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type DraftDocumentType =
  | 'tenancy_contract'
  | 'mou_for_sale'
  | 'noc_letter'
  | 'addendum'
  | 'offer_letter'
  | 'commercial_lease';

export interface DocumentDraftInput {
  documentType:   DraftDocumentType;
  language:       'en' | 'ar' | 'bilingual';

  // Parties
  landlordName?:  string;
  tenantName?:    string;
  sellerName?:    string;
  buyerName?:     string;
  agentName?:     string;

  // Property
  propertyAddress?: string;
  unitNumber?:      string;
  community?:       string;
  propertyType?:    string; // apartment, villa, etc.
  buaSqft?:         number;

  // Financial
  annualRentAED?:   number;
  chequesCount?:    number;
  salePriceAED?:    number;
  depositAED?:      number;

  // Dates
  leaseStartDate?:  string; // ISO date
  leaseEndDate?:    string;
  signatureDate?:   string;

  // Additional clauses
  additionalClauses?: string; // Free text
}

export interface DocumentDraftResult {
  success:      boolean;
  documentType: DraftDocumentType;
  language:     string;
  draftContent: string;   // Markdown-formatted document
  generatedBy:  'ai_groq' | 'template_fallback';
  modelUsed?:   string;
  generatedAt:  string;
  warningNote?: string;
}

// ─── System Prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(lang: string): string {
  const langNote =
    lang === 'bilingual'
      ? 'Write the document BILINGUALLY — every clause must appear in English first, then Arabic immediately below it.'
      : lang === 'ar'
      ? 'Write the entire document in Arabic (UAE dialect). Use formal legal Arabic.'
      : 'Write the document in English. Use formal legal language appropriate for Dubai/UAE real estate.';

  return `You are an expert Dubai real estate legal document drafter with 20 years of experience.
You specialise in UAE real estate law, specifically:
  - Dubai Law No. 26 of 2007 (Landlord Tenant Law) and its amendments
  - Decree No. 43 of 2013 (Rental Index)
  - DLD and RERA regulations
  - Dubai Law No. 4 of 2026 (latest updates)

RULES:
1. ${langNote}
2. Use professional legal formatting with numbered sections and sub-clauses.
3. Include a header, recitals, operative clauses, signature blocks, and witness blocks.
4. Reference the relevant UAE law article in brackets after each key obligation.
5. Include standard RERA-required fields (Ejari clause, late payment penalty, dispute resolution via RDSC).
6. Do NOT invent party names — use the placeholders [LANDLORD_NAME], [TENANT_NAME], etc. if not provided.
7. Mark any clause that requires customization with: ** ← REVIEW REQUIRED **
8. End with a metadata block: Document Type, Governing Law, Effective Date.`;
}

function buildUserPrompt(input: DocumentDraftInput): string {
  const lines: string[] = [
    `Generate a ${input.documentType.replace(/_/g, ' ')} with these details:`,
    '',
  ];

  if (input.landlordName) lines.push(`• Landlord: ${input.landlordName}`);
  if (input.tenantName)   lines.push(`• Tenant:   ${input.tenantName}`);
  if (input.sellerName)   lines.push(`• Seller:   ${input.sellerName}`);
  if (input.buyerName)    lines.push(`• Buyer:    ${input.buyerName}`);
  if (input.agentName)    lines.push(`• Agent:    ${input.agentName}`);

  if (input.propertyAddress) lines.push(`• Property: ${input.propertyAddress}`);
  if (input.unitNumber)      lines.push(`• Unit:     ${input.unitNumber}`);
  if (input.community)       lines.push(`• Community:${input.community}`);
  if (input.propertyType)    lines.push(`• Type:     ${input.propertyType}`);
  if (input.buaSqft)         lines.push(`• BUA:      ${input.buaSqft} sqft`);

  if (input.annualRentAED)   lines.push(`• Annual Rent: AED ${input.annualRentAED.toLocaleString()}`);
  if (input.chequesCount)    lines.push(`• Cheques:     ${input.chequesCount}`);
  if (input.salePriceAED)    lines.push(`• Sale Price:  AED ${input.salePriceAED.toLocaleString()}`);
  if (input.depositAED)      lines.push(`• Deposit:     AED ${input.depositAED.toLocaleString()}`);

  if (input.leaseStartDate)  lines.push(`• Lease Start: ${input.leaseStartDate}`);
  if (input.leaseEndDate)    lines.push(`• Lease End:   ${input.leaseEndDate}`);
  if (input.signatureDate)   lines.push(`• Signed On:   ${input.signatureDate}`);

  if (input.additionalClauses) {
    lines.push('', `Additional clauses to include:`, input.additionalClauses);
  }

  return lines.join('\n');
}

// ─── Groq API Call (lightweight — no SDK dependency) ─────────────────────────

function callGroqAPI(
  systemPrompt: string,
  userPrompt:   string,
  modelId:      string
): Promise<string> {
  const body = JSON.stringify({
    model: modelId,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt   },
    ],
    max_tokens: 3000,
    temperature: 0.3,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.groq.com',
        path:     '/openai/v1/chat/completions',
        method:   'POST',
        headers:  {
          'Content-Type':   'application/json',
          'Authorization':  `Bearer ${process.env['GROQ_API_KEY']}`,
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
            if (!content) return reject(new Error('Empty response from Groq'));
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

// ─── Template Fallback ────────────────────────────────────────────────────────

function templateFallback(input: DocumentDraftInput): string {
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const landlord = input.landlordName ?? '[LANDLORD_NAME]';
  const tenant   = input.tenantName   ?? '[TENANT_NAME]';
  const unit     = `${input.unitNumber ?? '[UNIT_NUMBER]'}, ${input.community ?? '[COMMUNITY]'}, Dubai`;
  const rent     = input.annualRentAED
    ? `AED ${input.annualRentAED.toLocaleString()} per annum`
    : '[ANNUAL_RENT_AED]';
  const start    = input.leaseStartDate ?? '[START_DATE]';
  const end      = input.leaseEndDate   ?? '[END_DATE]';

  return `# TENANCY AGREEMENT
*(Template Draft — AI generation unavailable. Please review all placeholders.)*

**Date:** ${today}

## PARTIES

**Landlord:** ${landlord}
**Tenant:** ${tenant}

## PREMISES

The Landlord hereby leases to the Tenant the premises situated at:
**${unit}**
(${input.propertyType ?? 'residential unit'}, BUA: ${input.buaSqft ? `${input.buaSqft} sqft` : '[BUA_SQFT]'})

## TERM
Lease Period: **${start}** to **${end}**

## RENT
Annual Rent: **${rent}**
Payment: ${input.chequesCount ?? '[N]'} post-dated cheque(s)  ** ← REVIEW REQUIRED **

## SECURITY DEPOSIT
${input.depositAED ? `AED ${input.depositAED.toLocaleString()}` : '[DEPOSIT_AED]'}  ** ← REVIEW REQUIRED **

## EJARI REGISTRATION
The Landlord shall register this tenancy with Ejari within 30 days of execution. [Dubai Law 26/2007, Art. 22]

## LATE PAYMENT PENALTY
Monthly late charge: 5% of the monthly rent value for each month overdue. [RERA Circular 2016-21]

## DISPUTE RESOLUTION
All disputes shall be referred to the Rental Dispute Settlement Centre (RDSC), Dubai Courts. [Law 26/2007 Art. 33]

## ADDITIONAL CLAUSES
${input.additionalClauses ?? '(None specified)'}

---
*Governing Law: Emirate of Dubai*  
*Generated: ${today}*  
> ⚠️ This is a template draft. Consult a qualified UAE legal advisor before execution.`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

const GROQ_MODEL = process.env['GROQ_MODEL'] ?? 'llama-3.3-70b-versatile';

/**
 * Generate an AI first-draft for a real estate legal document.
 *
 * Falls back to template if GROQ_API_KEY is not configured.
 */
export async function generateDocumentDraft(
  input: DocumentDraftInput
): Promise<DocumentDraftResult> {
  const systemPrompt = buildSystemPrompt(input.language);
  const userPrompt   = buildUserPrompt(input);

  const base: Omit<DocumentDraftResult, 'draftContent' | 'generatedBy' | 'modelUsed' | 'warningNote'> = {
    success:      true,
    documentType: input.documentType,
    language:     input.language,
    generatedAt:  new Date().toISOString(),
  };

  if (!process.env['GROQ_API_KEY']) {
    const draft = templateFallback(input);
    return {
      ...base,
      draftContent: draft,
      generatedBy: 'template_fallback',
      warningNote: 'GROQ_API_KEY not configured. Using template fallback. Set GROQ_API_KEY for AI drafting.',
    };
  }

  try {
    const draft = await callGroqAPI(systemPrompt, userPrompt, GROQ_MODEL);
    return {
      ...base,
      draftContent: draft,
      generatedBy:  'ai_groq',
      modelUsed:    GROQ_MODEL,
    };
  } catch (err) {
    console.error('[AIDrafter] Groq API error, falling back to template:', err instanceof Error ? err.message : err);
    const draft = templateFallback(input);
    return {
      ...base,
      draftContent: draft,
      generatedBy:  'template_fallback',
      warningNote:  `Groq API error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
