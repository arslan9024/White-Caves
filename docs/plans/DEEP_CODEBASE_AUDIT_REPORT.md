# AEGIS V4 Deep Codebase Audit Report

> **Scan Generated:** 2026-10-09T10:36:34.080Z  
> **Total Files Scanned:** 4366 source files  
> **Status:** Deep Static Analysis Complete

---

## 📊 Deep Metric Breakdown

- **Total Source Files Scanned:** 4366
- **Hardcoded Production Mocks Detected:** 17
- **Empty / Stubbed Event Handlers:** 3
- **TypeScript `any` Annotations:** 40
- **Unresolved TODO / FIXME Tags:** 0

---

## 🔍 Hardcoded Production Mocks (17)

- [`src/components/crm/AuroraAnalysisDashboard.jsx:537`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/crm/AuroraAnalysisDashboard.jsx#L537): `{comp.hasMockData && <span className="issue">Mock Data</span>}`
- [`src/components/crm/inventory/ImageDataExtractor.tsx:76`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/crm/inventory/ImageDataExtractor.tsx#L76): `const mockData = {`
- [`src/components/crm/inventory/ImageDataExtractor.tsx:83`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/crm/inventory/ImageDataExtractor.tsx#L83): `resolve(mockData);`
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

---

## ⚡ Empty / Stubbed Event Handlers (3)

- [`src/components/cards/__tests__/KPICard.test.tsx:231`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/cards/**tests**/KPICard.test.tsx#L231): `onClick={() => {}}`
- [`src/components/crm/shared/__tests__/BigTileCard.test.tsx:171`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/crm/shared/**tests**/BigTileCard.test.tsx#L171): `<BigTileCard title="Card" onClick={() => {}} />`
- [`src/components/crm/shared/__tests__/BigTileCard.test.tsx:183`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/crm/shared/**tests**/BigTileCard.test.tsx#L183): `<BigTileCard title="Card" onClick={() => {}} />`

---

## 🏷️ TypeScript `any` Type Usages (40)

- [`src/components/compliance/DldFeeCalculator/DldFeeCalculator.tsx:61`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/compliance/DldFeeCalculator/DldFeeCalculator.tsx#L61): `onChange={(e:any)=>setTxType(e.target.value)}`
- [`src/components/dashboard/organogram/AIOrganogramTree.tsx:33`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/dashboard/organogram/AIOrganogramTree.tsx#L33): `const activeDept = ASSISTANTS_108_REGISTRY.find((d: any) => d.id === selectedDeptId) || ASSISTANTS_108_REGISTRY[0];`
- [`src/components/dashboard/organogram/AIOrganogramTree.tsx:120`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/dashboard/organogram/AIOrganogramTree.tsx#L120): `{ASSISTANTS_108_REGISTRY.map((dept: any) => {`
- [`src/components/finance/ArabicRTLInvoiceWidget/ArabicRTLInvoiceWidget.logic.ts:8`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/ArabicRTLInvoiceWidget/ArabicRTLInvoiceWidget.logic.ts#L8): `const subtotal = t.items.reduce((sum: number, item: any) => sum + item.qty * item.price, 0);`
- [`src/components/finance/ArabicRTLInvoiceWidget/ArabicRTLInvoiceWidget.tsx:20`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/ArabicRTLInvoiceWidget/ArabicRTLInvoiceWidget.tsx#L20): `<tbody>{t.items.map((item: any, i: number) => (<tr key={i}><td>{item.desc}</td><td>{item.qty}</td><td className="amount">AED {(item.qty * item.price).toLocaleString()}</td></tr>))}</tbody>`
- [`src/components/finance/CryptoPaymentWidget/CryptoPaymentWidget.tsx:15`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/CryptoPaymentWidget/CryptoPaymentWidget.tsx#L15): `<tbody>{t.receipts.map((r: any) => (<tr key={r.id}><td>{r.id}</td><td><CoinBadge $coin={r.coin}>{r.coin}</CoinBadge></td><td>{r.amount}</td><td>AED {r.aed.toLocaleString()}</td><td>{r.date}</td><td>{r.status}</td></tr>))}</tbody>`
- [`src/components/finance/FinanceAlertsWidget/FinanceAlertsWidget.tsx:14`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/FinanceAlertsWidget/FinanceAlertsWidget.tsx#L14): `{t.alerts.map((a: any) => (<AlertCard key={a.id} $severity={a.severity}>{icon(a.severity)}<div><div className="type">{a.type}</div><div className="message">{a.message}</div></div></AlertCard>))}`
- [`src/components/finance/IndustryBenchmarkWidget/IndustryBenchmarkWidget.tsx:17`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/IndustryBenchmarkWidget/IndustryBenchmarkWidget.tsx#L17): `{benchmarks.map((b: any) => (`
- [`src/components/finance/InsurancePremiumWidget/InsurancePremiumWidget.tsx:15`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/InsurancePremiumWidget/InsurancePremiumWidget.tsx#L15): `<tbody>{t.policies.map((p: any) => (<tr key={p.id}><td>{p.id}</td><td>{p.type}</td><td>AED {p.premium.toLocaleString()}</td><td>{p.renewal}</td><td><StatusBadge $status={p.status}>{p.status}</StatusBadge></td></tr>))}</tbody>`
- [`src/components/finance/MobileFinanceWidget/MobileFinanceWidget.tsx:15`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/finance/MobileFinanceWidget/MobileFinanceWidget.tsx#L15): `{t.actions.map((a: any) => (`
- [`src/components/homepage/Hero/HeroVideoBackground.tsx:6`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/homepage/Hero/HeroVideoBackground.tsx#L6): `y: any; // MotionValue`
- [`src/components/navigation/Sidebar108/Sidebar108.tsx:204`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/navigation/Sidebar108/Sidebar108.tsx#L204): `{departments.map((dept: any) => {`
- [`src/components/navigation/Sidebar108/Sidebar108.tsx:241`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/components/navigation/Sidebar108/Sidebar108.tsx#L241): `{dept.supervisors.map((sup: any) => (`
- [`src/e2e/accessibility.audit.spec.ts:48`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/e2e/accessibility.audit.spec.ts#L48): `async function injectAxe(page: any) {`
- [`src/e2e/accessibility.audit.spec.ts:55`](file:///C:/Users/Murad Ali/OneDrive/Documents/White Caves/White-Caves/src/e2e/accessibility.audit.spec.ts#L55): `async function navigateAndStabilize(page: any, path: string) {`

---

## 📝 Pending TODO / FIXME Items (0)

None detected.
