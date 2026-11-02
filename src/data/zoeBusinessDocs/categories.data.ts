import type { ZoeBusinessDocCategory } from './types';

export const ZOE_BUSINESS_CATEGORIES = [
  { id: 'all', label: 'All Business Docs', count: 17 },
  { id: 'progress', label: '🌟 00. Project Progress & Telemetry', count: 1 },
  { id: 'corporate', label: '🏛️ 01. Corporate & Identity', count: 1 },
  { id: 'departments', label: '🏢 01. 12 Departments Matrix', count: 1 },
  { id: 'licensing', label: '📜 03. RERA & Trade Licensing', count: 1 },
  { id: 'leasing', label: '📑 02. Ejari & Tenancy Playbook', count: 1 },
  { id: 'finance', label: '💰 07. 42 Expenses & 5% VAT', count: 1 },
  { id: 'design_security', label: '🛡️ 10. Design & PDPL Security', count: 1 },
  { id: 'workflows', label: '🔄 04. Deal Lifecycles & SOPs', count: 1 },
  { id: 'crm_features', label: '⚡ 09. CRM & 22-Role RBAC', count: 1 },
  { id: 'vip_concierge', label: '👑 09. UHNW Vault & VIP', count: 1 },
  { id: 'services', label: '🌟 02. Agency Services & SLAs', count: 1 },
  { id: 'design_arch', label: '📐 06. Architecture & Data Schema', count: 1 },
  { id: 'requirements', label: '📋 05. Functional Rules & Risks', count: 1 },
  { id: 'market_intel', label: '📊 08. Market Trends & Portals', count: 1 },
  { id: 'ai_command', label: '🤖 03. AI 44-Assistant Mesh', count: 1 },
  { id: 'seo', label: '🎯 11. SEO & Syndication', count: 1 },
  { id: 'srs_testing', label: '🧪 12/13. SRS & QA Test Plan', count: 1 },
  { id: 'devops_release', label: '🚀 14/15. DevOps & Release', count: 1 },
] as const;
