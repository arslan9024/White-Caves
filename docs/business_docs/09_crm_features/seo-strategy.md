# SEO Strategy

> **Owner:** @Rachel | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Purpose:** Dubai property keyword clusters, Core Web Vitals targets and structured data schemas.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM SEO strategy feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend SEO/performance lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

The SEO strategy module manages Dubai keyword coverage, schema markup, technical crawl hygiene, and performance targets.

## Requirement catalog

### REQ-SEO-001: Keyword clustering and page mapping

The system shall map high-value Dubai real-estate keyword clusters to canonical pages.

**Acceptance criteria:**

- [ ] Keyword clusters are grouped by intent and area
- [ ] Each cluster has a canonical landing page
- [ ] Arabic and English clusters are tracked separately

**Evidence:** keyword map and page assignment log.

### REQ-SEO-002: Core Web Vitals and performance budgets

The system shall maintain the documented performance targets for LCP, CLS, and interaction latency.

**Acceptance criteria:**

- [ ] Performance thresholds are documented and measurable
- [ ] Asset and script optimizations are tracked
- [ ] Failures are visible in the audit loop

**Evidence:** CWV report and performance snapshot.

### REQ-SEO-003: Structured data and crawl hygiene

The system shall inject structured data and maintain sitemap, robots, and canonical hygiene.

**Acceptance criteria:**

- [ ] JSON-LD schema is valid on key templates
- [ ] Sitemap and robots directives are published
- [ ] Duplicate content controls are in place

**Evidence:** schema validation and crawl audit.

### REQ-SEO-004: Measurement and link acquisition

The system shall track rankings, Search Console metrics, and link acquisition outcomes.

**Acceptance criteria:**

- [ ] Ranking and page health metrics are captured
- [ ] Link acquisition efforts are visible in reporting
- [ ] Alerts exist for major traffic or ranking drops

**Evidence:** ranking dashboard and measurement report.

## Traceability

- Maps to `REQ-MKT-AUT-004` and marketing performance coverage
- Aligns to `WC-SRS-014` and SEO evidence artifacts
- Feeds keyword, technical SEO, and reporting validation

## 2. Dubai Keyword Clusters

Keyword clusters should be organized by intent, geography, and language with canonical page mapping.

## 3. Core Web Vitals Targets

SEO strategy requirements are now captured in the catalog below, covering keyword clusters, Core Web Vitals, structured data, crawl hygiene, and measurement.

## 4. Local SEO Foundations

- Google Business Profile optimization.
- NAP consistency and map citations.

## 5. Arabic and English Localization SEO

- Hreflang strategy.
- RTL-aware metadata and content structure.

## 6. Structured Data Schemas

- RealEstateListing, LocalBusiness, FAQPage JSON-LD.
- Validation through rich result tools.

## 7. Technical Crawl Hygiene

- XML sitemap and robots directives.
- Canonicalization and duplicate control.

## 8. On-Page Optimization Rules

- Title/meta templates for area/property pages.
- Internal linking standards for conversion paths.

## 9. Content Cluster Strategy

- Pillar pages for buying, renting, off-plan.
- Supporting neighborhood and community pages.

## 10. Landing Page Conversion SEO

- UX copy aligned with intent clusters.
- Fast CTA pathways and trust signals.

## 11. Performance Budget

- LCP < 2.5s, CLS < 0.1, interaction latency targets.
- Image and script optimization policy.

## 12. Link Acquisition Plan

- Partnerships and local directories.
- PR and authority backlink campaigns.

## 13. Measurement Framework

- Search Console and Analytics event mapping.
- Keyword ranking and page health dashboards.

## 14. API and CMS Support

- SEO metadata endpoints.
- Automated schema injection workflow.

## 15. Acceptance Criteria

- Keyword clusters mapped to canonical pages.
- Structured data valid on key templates.
- Core Web Vitals within target bands.

## 16. Test and Audit Plan

- Monthly technical SEO audit checklist.
- Broken link and schema regression tests.
- Pre-release metadata verification.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
