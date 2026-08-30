# AEGIS V4 Deep Codebase Audit Report

> **Scan Generated:** 2026-08-30T02:55:40.279Z  
> **Total Files Scanned:** 3940 source files  
> **Status:** Deep Static Analysis Complete  

---

## 📊 Deep Metric Breakdown

- **Total Source Files Scanned:** 3940
- **Hardcoded Production Mocks Detected:** 17
- **Empty / Stubbed Event Handlers:** 3
- **TypeScript `any` Annotations:** 12
- **Unresolved TODO / FIXME Tags:** 0

---

## 🔍 Hardcoded Production Mocks (17)

- [`src/components/crm/AuroraAnalysisDashboard.jsx:537`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/components/crm/AuroraAnalysisDashboard.jsx#L537): `{comp.hasMockData && <span className="issue">Mock Data</span>}`
- [`src/components/crm/inventory/ImageDataExtractor.tsx:76`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/components/crm/inventory/ImageDataExtractor.tsx#L76): `const mockData = {`
- [`src/components/crm/inventory/ImageDataExtractor.tsx:83`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/components/crm/inventory/ImageDataExtractor.tsx#L83): `resolve(mockData);`
- [`src/config/databaseConfig.js:183`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/config/databaseConfig.js#L183): `const { createMockModels } = await import('../test/utils/mockDatabase.js');`
- [`server/models/ComponentAnalysis.js:69`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/models/ComponentAnalysis.js#L69): `hasMockData: Boolean,`
- [`server/routes/aurora.js:98`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/routes/aurora.js#L98): `hasMockData: f.hasMockData,`
- [`server/routes/aurora.js:157`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/routes/aurora.js#L157): `hasMockData: c.completion.hasMockData`
- [`server/routes/aurora.js:394`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/routes/aurora.js#L394): `if (file.hasMockData) score -= 10;`
- [`server/services/codeAnalysisService.js:72`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/services/codeAnalysisService.js#L72): `hasMockData: this.hasMockData(content),`
- [`server/services/codeAnalysisService.js:274`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/services/codeAnalysisService.js#L274): `hasMockData(content) {`
- [`server/services/codeAnalysisService.js:276`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/services/codeAnalysisService.js#L276): `content.includes('mockData') ||`
- [`server/services/codeAnalysisService.js:280`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/services/codeAnalysisService.js#L280): `content.includes('dummyData') ||`
- [`server/services/codeAnalysisService.js:338`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/services/codeAnalysisService.js#L338): `withMockData: validAnalyses.filter(f => f.type === 'component' && f.hasMockData).length,`
- [`server/services/codeAnalysisService.js:345`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/services/codeAnalysisService.js#L345): `hasMockData: f.hasMockData`
- [`server/services/codeAnalysisService.js:406`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/services/codeAnalysisService.js#L406): `filesWithMockData: validAnalyses.filter(f => f.hasMockData).length,`

---

## ⚡ Empty / Stubbed Event Handlers (3)

- [`src/components/cards/__tests__/KPICard.test.tsx:231`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/components/cards/__tests__/KPICard.test.tsx#L231): `onClick={() => {}}`
- [`src/components/crm/shared/__tests__/BigTileCard.test.tsx:171`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/components/crm/shared/__tests__/BigTileCard.test.tsx#L171): `<BigTileCard title="Card" onClick={() => {}} />`
- [`src/components/crm/shared/__tests__/BigTileCard.test.tsx:183`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/components/crm/shared/__tests__/BigTileCard.test.tsx#L183): `<BigTileCard title="Card" onClick={() => {}} />`

---

## 🏷️ TypeScript `any` Type Usages (12)

- [`src/components/homepage/Hero/HeroVideoBackground.tsx:6`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/components/homepage/Hero/HeroVideoBackground.tsx#L6): `y: any; // MotionValue`
- [`src/e2e/accessibility.audit.spec.ts:48`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/e2e/accessibility.audit.spec.ts#L48): `async function injectAxe(page: any) {`
- [`src/e2e/accessibility.audit.spec.ts:55`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/e2e/accessibility.audit.spec.ts#L55): `async function navigateAndStabilize(page: any, path: string) {`
- [`src/e2e/accessibility.audit.spec.ts:81`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/e2e/accessibility.audit.spec.ts#L81): `function ensureExpectedPathOrSkip(page: any, expectedPath: string) {`
- [`src/e2e/accessibility.audit.spec.ts:89`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/e2e/accessibility.audit.spec.ts#L89): `async function ensureDashboardReadyOrSkip(page: any) {`
- [`src/e2e/accessibility.audit.spec.ts:105`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/e2e/accessibility.audit.spec.ts#L105): `async function runAxeViolations(page: any, options?: any): Promise<any[]> {`
- [`src/e2e/accessibility.audit.spec.ts:116`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/e2e/accessibility.audit.spec.ts#L116): `} catch (error: any) {`
- [`src/e2e/accessibility.audit.spec.ts:132`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/e2e/accessibility.audit.spec.ts#L132): `function criticalOrSeriousViolations(violations: any[]): any[] {`
- [`src/e2e/functionality.layer3.spec.ts:47`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/e2e/functionality.layer3.spec.ts#L47): `async function skipIfLoadingShell(page: any, options?: { expectedPath?: string }) {`
- [`src/e2e/functionality.layer3.spec.ts:123`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/e2e/functionality.layer3.spec.ts#L123): `const errors: any[] = [];`
- [`src/e2e/functionality.layer3.spec.ts:506`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/src/e2e/functionality.layer3.spec.ts#L506): `await form.evaluate((f: any) => {`
- [`server/routes/transactions.ts:168`](file:///C:/Users/HP/Documents/My Web Sites/AntigravityWC/White-Caves/server/routes/transactions.ts#L168): `// Risk definition: any sale OR amount >= AED 500k.`

---

## 📝 Pending TODO / FIXME Items (0)

None detected.
