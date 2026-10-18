# AEGIS V4 Deep Codebase Audit Report

> **Scan Generated:** 2026-10-09T11:32:11.098Z  
> **Total Files Scanned:** 4367 source files (Cache Hits: 4360)  
> **Scan Duration:** 1942ms  
> **Status:** Deep Static Analysis Complete

---

## 📊 Deep Metric Breakdown

- **Total Source Files Scanned:** 4367
- **Hardcoded Production Mocks Detected:** 15
- **Empty / Stubbed Event Handlers:** 3
- **TypeScript `any` Annotations:** 36
- **Unresolved TODO / FIXME Tags:** 0

---

## 🔍 Hardcoded Production Mocks (15)

- [`src/components/crm/AuroraAnalysisDashboard.jsx:537`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/crm/AuroraAnalysisDashboard.jsx#L537): `{comp.hasMockData && <span className="issue">Mock Data</span>}`
- [`src/config/databaseConfig.js:183`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/config/databaseConfig.js#L183): `const { createMockModels } = await import('../test/utils/mockDatabase.js');`
- [`server/models/ComponentAnalysis.js:69`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/models/ComponentAnalysis.js#L69): `hasMockData: Boolean,`
- [`server/routes/aurora.js:98`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/routes/aurora.js#L98): `hasMockData: f.hasMockData,`
- [`server/routes/aurora.js:157`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/routes/aurora.js#L157): `hasMockData: c.completion.hasMockData`
- [`server/routes/aurora.js:394`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/routes/aurora.js#L394): `if (file.hasMockData) score -= 10;`
- [`server/services/codeAnalysisService.js:72`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/services/codeAnalysisService.js#L72): `hasMockData: this.hasMockData(content),`
- [`server/services/codeAnalysisService.js:274`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/services/codeAnalysisService.js#L274): `hasMockData(content) {`
- [`server/services/codeAnalysisService.js:276`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/services/codeAnalysisService.js#L276): `content.includes('mockData') ||`
- [`server/services/codeAnalysisService.js:280`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/services/codeAnalysisService.js#L280): `content.includes('dummyData') ||`
- [`server/services/codeAnalysisService.js:338`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/services/codeAnalysisService.js#L338): `withMockData: validAnalyses.filter(f => f.type === 'component' && f.hasMockData).length,`
- [`server/services/codeAnalysisService.js:345`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/services/codeAnalysisService.js#L345): `hasMockData: f.hasMockData`
- [`server/services/codeAnalysisService.js:406`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/services/codeAnalysisService.js#L406): `filesWithMockData: validAnalyses.filter(f => f.hasMockData).length,`
- [`server/services/codeAnalysisService.js:475`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/services/codeAnalysisService.js#L475): `const mockDataRatio = components.filter(c => c.hasMockData).length / components.length;`
- [`server/services/codeAnalysisService.js:476`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/server/services/codeAnalysisService.js#L476): `score -= mockDataRatio * 15;`

---

## ⚡ Empty / Stubbed Event Handlers (3)

- [`src/components/cards/__tests__/KPICard.test.tsx:231`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/cards/**tests**/KPICard.test.tsx#L231): `onClick={() => {}}`
- [`src/components/crm/shared/__tests__/BigTileCard.test.tsx:171`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/crm/shared/**tests**/BigTileCard.test.tsx#L171): `<BigTileCard title="Card" onClick={() => {}} />`
- [`src/components/crm/shared/__tests__/BigTileCard.test.tsx:183`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/crm/shared/**tests**/BigTileCard.test.tsx#L183): `<BigTileCard title="Card" onClick={() => {}} />`

---

## 🏷️ TypeScript `any` Type Usages (36)

- [`src/components/finance/ArabicRTLInvoiceWidget/ArabicRTLInvoiceWidget.tsx:20`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/ArabicRTLInvoiceWidget/ArabicRTLInvoiceWidget.tsx#L20): `<tbody>{t.items.map((item: any, i: number) => (<tr key={i}><td>{item.desc}</td><td>{item.qty}</td><td className="amount">AED {(item.qty * item.price).toLocaleString()}</td></tr>))}</tbody>`
- [`src/components/finance/FinanceAlertsWidget/FinanceAlertsWidget.tsx:14`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/FinanceAlertsWidget/FinanceAlertsWidget.tsx#L14): `{t.alerts.map((a: any) => (<AlertCard key={a.id} $severity={a.severity}>{icon(a.severity)}<div><div className="type">{a.type}</div><div className="message">{a.message}</div></div></AlertCard>))}`
- [`src/components/finance/IndustryBenchmarkWidget/IndustryBenchmarkWidget.tsx:17`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/IndustryBenchmarkWidget/IndustryBenchmarkWidget.tsx#L17): `{benchmarks.map((b: any) => (`
- [`src/components/finance/InsurancePremiumWidget/InsurancePremiumWidget.tsx:15`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/InsurancePremiumWidget/InsurancePremiumWidget.tsx#L15): `<tbody>{t.policies.map((p: any) => (<tr key={p.id}><td>{p.id}</td><td>{p.type}</td><td>AED {p.premium.toLocaleString()}</td><td>{p.renewal}</td><td><StatusBadge $status={p.status}>{p.status}</StatusBadge></td></tr>))}</tbody>`
- [`src/components/finance/MobileFinanceWidget/MobileFinanceWidget.tsx:15`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/MobileFinanceWidget/MobileFinanceWidget.tsx#L15): `{t.actions.map((a: any) => (`
- [`src/components/homepage/Hero/HeroVideoBackground.tsx:6`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/homepage/Hero/HeroVideoBackground.tsx#L6): `y: any; // MotionValue`
- [`src/components/navigation/Sidebar108/Sidebar108.tsx:204`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/navigation/Sidebar108/Sidebar108.tsx#L204): `{departments.map((dept: any) => {`
- [`src/components/navigation/Sidebar108/Sidebar108.tsx:241`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/navigation/Sidebar108/Sidebar108.tsx#L241): `{dept.supervisors.map((sup: any) => (`
- [`src/e2e/accessibility.audit.spec.ts:48`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/e2e/accessibility.audit.spec.ts#L48): `async function injectAxe(page: any) {`
- [`src/e2e/accessibility.audit.spec.ts:55`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/e2e/accessibility.audit.spec.ts#L55): `async function navigateAndStabilize(page: any, path: string) {`
- [`src/e2e/accessibility.audit.spec.ts:81`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/e2e/accessibility.audit.spec.ts#L81): `function ensureExpectedPathOrSkip(page: any, expectedPath: string) {`
- [`src/e2e/accessibility.audit.spec.ts:89`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/e2e/accessibility.audit.spec.ts#L89): `async function ensureDashboardReadyOrSkip(page: any) {`
- [`src/e2e/accessibility.audit.spec.ts:105`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/e2e/accessibility.audit.spec.ts#L105): `async function runAxeViolations(page: any, options?: any): Promise<any[]> {`
- [`src/e2e/accessibility.audit.spec.ts:116`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/e2e/accessibility.audit.spec.ts#L116): `} catch (error: any) {`
- [`src/e2e/accessibility.audit.spec.ts:132`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/e2e/accessibility.audit.spec.ts#L132): `function criticalOrSeriousViolations(violations: any[]): any[] {`

---

## 📝 Pending TODO / FIXME Items (0)

None detected.
