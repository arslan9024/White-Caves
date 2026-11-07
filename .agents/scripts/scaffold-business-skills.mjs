import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const zoeSkills = [
  { slug: 'aegis-biz-dept-01-luxury-sales', deptFolder: 'dept-01-luxury-sales', name: 'AEGIS Business Dept 01: Luxury Sales & Brokerage', desc: 'SOPs, VIP buyer matching, and luxury closing operations for Dept 01' },
  { slug: 'aegis-biz-dept-02-strategic-offplan', deptFolder: 'dept-02-strategic-offplan', name: 'AEGIS Business Dept 02: Strategic Off-Plan Allocations', desc: 'SOPs, developer allocations, launch prioritization, and payment plans for Dept 02' },
  { slug: 'aegis-biz-dept-03-commercial-investment', deptFolder: 'dept-03-commercial-investment', name: 'AEGIS Business Dept 03: Commercial Acquisitions & Capital Markets', desc: 'SOPs, commercial yields, cap rate modeling, and portfolio underwriting for Dept 03' },
  { slug: 'aegis-biz-dept-04-residential-leasing', deptFolder: 'dept-04-residential-leasing', name: 'AEGIS Business Dept 04: Autonomous Leasing & Ejari Operations', desc: 'SOPs, tenant screening, Ejari registration, and lease contract management for Dept 04' },
  { slug: 'aegis-biz-dept-05-asset-facilities', deptFolder: 'dept-05-asset-facilities', name: 'AEGIS Business Dept 05: Community Facilities & Asset Management', desc: 'SOPs, IoT facility monitoring, work orders, and maintenance SLA enforcement for Dept 05' },
  { slug: 'aegis-biz-dept-06-revenue-finance', deptFolder: 'dept-06-revenue-finance', name: 'AEGIS Business Dept 06: Treasury, Invoicing & Financial Operations', desc: 'SOPs, UAE 5% VAT, 9% Corporate Tax reserves, commission splits, and escrow sync for Dept 06' },
  { slug: 'aegis-biz-dept-07-performance-marketing', deptFolder: 'dept-07-performance-marketing', name: 'AEGIS Business Dept 07: Performance Marketing & Growth Engine', desc: 'SOPs, lead acquisition, ad performance attribution, and conversion funnels for Dept 07' },
  { slug: 'aegis-biz-dept-08-client-experience', deptFolder: 'dept-08-client-experience', name: 'AEGIS Business Dept 08: Client Experience & VIP Concierge', desc: 'SOPs, VIP concierge services, client NPS, and omni-channel luxury communication for Dept 08' },
  { slug: 'aegis-biz-dept-09-corporate-governance', deptFolder: 'dept-09-corporate-governance', name: 'AEGIS Business Dept 09: Corporate Architecture & Governance Sentinel', desc: 'SOPs, technical governance, enterprise policy audits, and architecture compliance for Dept 09' },
  { slug: 'aegis-biz-dept-10-rera-compliance', deptFolder: 'dept-10-rera-compliance', name: 'AEGIS Business Dept 10: Legal, RERA & Regulatory Affairs', desc: 'SOPs, DLD/RERA compliance, Trakheesi approvals, AML/KYC screening, and legal filing for Dept 10' },
  { slug: 'aegis-biz-dept-11-conveyancing-transactions', deptFolder: 'dept-11-conveyancing-transactions', name: 'AEGIS Business Dept 11: Conveyancing & Trustee Transfers', desc: 'SOPs, title deed registrations, NOC issuances, escrow settlements, and trustee transfers for Dept 11' },
  { slug: 'aegis-biz-dept-12-market-intelligence', deptFolder: 'dept-12-market-intelligence', name: 'AEGIS Business Dept 12: Market Research & Predictive Analytics', desc: 'SOPs, Dubai real estate trends, macroeconomic price indexing, and AI forecasting for Dept 12' },
];

for (const zs of zoeSkills) {
  const dir = path.join(ROOT, '.agents', 'skills', zs.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const content = `---
name: ${zs.slug}
description: ${zs.desc}
---

# ${zs.name}

## 1. Department Overview & SLA Watchdog
- **Standard SLA:** 15-minute P0 watchdog response.
- **Latency Standard:** Sub-10ms in-memory cache lookup.
- **Statutory Rules:** Strict alignment with UAE DLD, RERA, and FTA tax standards.

## 2. Operational Procedures
- Run autonomous department engine: \`node .agents/zoe-business-assistants/${zs.deptFolder}/dept.engine.js\`
- Execute continuous validation and pipeline synchronization.
- Maintain immutable audit trail of customer interactions and transactional records.
`;
  fs.writeFileSync(path.join(dir, 'SKILL.md'), content);
}
console.log('✅ Created 12 Business Department Skills in .agents/skills/');
