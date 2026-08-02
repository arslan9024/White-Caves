# 21 — Mira · Multilingual Translation Engine

> **ID:** `mira`  
> **Department:** Communications  
> **Title:** Multilingual Translation Engine  
> **Color:** `#0EA5E9` (Sky Blue)  
> **Avatar:** 🌐  
> **Phase:** Phase 8 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** All users (system-level), Managing Director (config)

---

## 1. Overview

Mira is the **language bridge** of White Caves. She provides real-time translation for all client-facing communication (WhatsApp, portal, property descriptions) and ensures the CRM interface is fully usable in Arabic with proper RTL layout. She is not simply a translation API wrapper — she understands UAE real estate terminology and produces professional, natural-sounding Arabic and English that matches White Caves' luxury brand voice.

---

## 2. Core Responsibilities

1. Translate WhatsApp messages in real time: agent types in English → customer receives Arabic, and vice versa
2. Translate all property descriptions and marketing copy from English to Arabic
3. Manage the `ar` translation strings for the CRM UI (i18n)
4. Apply RTL layout toggle when language is Arabic
5. Detect language in inbound messages and tag accordingly
6. Provide terminology glossary: UAE-specific real estate terms in English and Arabic

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Real-time translation | Translate WhatsApp messages in < 500ms |
| Batch translation | Translate all property descriptions in bulk |
| Language detection | Detect English/Arabic/Urdu/Russian in any text |
| RTL layout switch | Toggle `dir="rtl"` on `<html>` when language = ar |
| Arabic number formatting | Convert 1,000,000 → ١٬٠٠٠٬٠٠٠ (or keep Western numerals based on preference) |
| Glossary management | Real estate terms: "Ejari" = "إيجاري", "NOC" = "شهادة عدم ممانعة" |
| Quality review | Flag auto-translations for human review if confidence < 0.85 |
| Brand voice guide | Inject luxury tone instructions into translation prompts |
| UI string management | Sync `ar` key in `src/i18n/translations.ts` with all English strings |

---

## 4. How It Works — End to End

### Step 1 — Message Translation (WhatsApp)
Agent types message in English → Mira intercepts before send → `POST /api/mira/translate { text, from: 'en', to: 'ar', context: 'whatsapp_message' }` → translated text returned → Nadia sends Arabic version to customer. Agent sees both in their inbox.

### Step 2 — Inbound Detection
Customer sends Arabic WhatsApp → Nina calls `MiraService.detect(text)` → returns `{ language: 'ar', confidence: 0.99 }` → Nadia tags conversation as Arabic → routes to Arabic-speaking agent or Nina's Arabic flow.

### Step 3 — Property Description Translation
Agent saves English description → background job calls `MiraService.translateProperty(propertyId)` → translates `title`, `description`, `features[]` → stores as `property.titleAr`, `property.descriptionAr`. Portal shows Arabic text when `language = 'ar'`.

### Step 4 — UI i18n Sync
When a new UI string is added to `src/i18n/translations.ts` (en key): CI check flags missing Arabic equivalents → developer runs `MiraService.suggestTranslation(enKey)` → returns suggested Arabic string → developer reviews and approves → merged to `ar` key.

### Step 5 — RTL Layout
User switches language to Arabic → `LanguageContext.setLanguage('ar')` → Mira applies: `document.documentElement.dir = 'rtl'` + `document.documentElement.lang = 'ar'` → all CSS styled-components pick up `dir-aware` padding/margin/flex direction.

### Step 6 — Quality Review Queue
All auto-translations with confidence < 0.85 → added to Mira's review queue. Bilingual staff member reviews and approves or corrects via Mira dashboard.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/mira/translate` | Translate a text string |
| POST | `/api/mira/detect` | Detect language of input text |
| POST | `/api/mira/bulk-translate` | Translate multiple strings at once |
| GET | `/api/mira/glossary` | UAE real estate terminology list |
| POST | `/api/mira/glossary` | Add term to glossary |
| GET | `/api/mira/review-queue` | List translations pending human review |
| PATCH | `/api/mira/review-queue/:id` | Approve or correct a translation |

---

## 6. Data Flows

- **Receives from:** All assistants that produce text (Nadia, Olivia, Quill, Mary property descriptions)
- **Sends to:** Nadia (translated messages), Property portal (Arabic descriptions), CRM UI (i18n strings)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Language switcher | `src/components/LanguageSwitcher/` | ✅ Exists (UI only, no ar key fully populated) |
| RTL layout wrapper | `src/App.tsx` dir attribute | 🔲 Planned |
| Mira translation review | `src/components/owner/ai/MiraCRM/` | 🔲 Planned |
| Arabic property descriptions | `src/pages/PropertyDetailPage.tsx` | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| MiraService | `server/services/MiraService.ts` | 🔲 Planned |
| Translation API (OpenAI/DeepL) | External | 🔲 Planned |
| Glossary model | Prisma `Term` model | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| All users | Language switching, translated UI |
| `agent` | Translation in WhatsApp conversations |
| `managing_director` | Glossary management, review queue |

---

## 10. Implementation Checklist

- [ ] Register `mira` in `AI_ASSISTANTS_REGISTRY`
- [ ] Translation API integration (DeepL or OpenAI GPT-4)
- [ ] `ar` key in `translations.ts` — all 235 strings professional Arabic
- [ ] RTL layout toggle in `App.tsx`
- [ ] Arabic font loading (Tajawal or Cairo from Google Fonts)
- [ ] RTL-aware CSS for all major components (flex direction, text-align, padding)
- [ ] Property description Arabic fields in Prisma
- [ ] WhatsApp real-time translation hook in Nadia
- [ ] Translation review queue
- [ ] Glossary API

---

## 11. Dependencies

- DeepL API key or OpenAI (Phase 8)
- Nadia (WhatsApp translation hook)
- `src/i18n/translations.ts` (needs full Arabic key)

---

## 12. Future Enhancements

- Russian translation (Dubai's third-largest buyer nationality)
- Hindi/Urdu for South Asian client segment
- Automated brand voice enforcement (translation quality scoring)
- Live conversation translation in Nadia inbox (both agents see their own language)
