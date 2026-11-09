/**
 * assistants108Registry.data.ts — 🔱 The Canonical 1-12-108 Hierarchy Protocol Master Registry
 * White Caves Real Estate LLC — Global Sovereign AI Command Grid
 *
 * PROTOCOL HIERARCHY:
 * Level 0: 1 Managing Director (Human) paired with 1 Executive Chief AI Assistant: "Zoe"
 * Level 1: 12 Corporate Departments with 12 Human Department Managers + 12 AI Department Manager Assistants
 * Level 2: 108 Operational Supervisors (12 Departments × 9 Supervisors each)
 * Total Active AI Mesh: 1 (Zoe) + 12 (Managers) + 108 (Supervisors) = 121 Autonomous AI Agents
 */

export interface DepartmentDef {
  id: string;
  name: string;
  code: string;
  color: string;
  gradient: string;
  icon: string;
  description: string;
  managerAi: {
    id: string;
    name: string;
    title: string;
    avatar: string;
  };
  supervisors?: SupervisorDef[];
}

export interface SupervisorDef {
  id: string;
  name: string;
  code: string;
  title: string;
  departmentId: string;
  departmentName: string;
  supervisorIndex: number; // 1 to 9
  icon: string;
  color: string;
  avatar: string;
  status: 'active' | 'optimal' | 'standby';
  description: string;
  specialty: string;
  assignedTasks: string[];
  capabilities: string[];
  slaResponseTime: string;
  metrics: {
    accuracyRate: number;
    tasksCompletedToday: number;
    systemHealth: 'optimal' | 'good' | 'warning';
  };
}

export interface ExecutiveCommandDef {
  managingDirector: {
    name: string;
    title: string;
    clearance: string;
    licenseDet: string;
    reraOrn: string;
  };
  executiveAi: {
    id: string;
    name: string;
    code: string;
    title: string;
    avatar: string;
    role: string;
    responsibilities: string[];
  };
}

// ── LEVEL 0: EXECUTIVE COMMAND (1 MD + 1 ZOE) ─────────────────────────────────
export const EXECUTIVE_COMMAND_1: ExecutiveCommandDef = {
  managingDirector: {
    name: 'ARSLAN MALIK BASHIR AHMAD',
    title: 'Managing Director & Founder',
    clearance: 'Level 5 Sovereign Founder Clearance',
    licenseDet: '1388443',
    reraOrn: '44483',
  },
  executiveAi: {
    id: 'zoe',
    name: 'AI Zoe',
    code: 'AI_ZOE_COO',
    title: 'Chief Operations Officer (COO) Executive AI',
    avatar: 'https://ui-avatars.com/api/?name=Zoe+COO&background=1E293B&color=EF4444',
    role: 'Direct Executive Partner to Managing Director',
    responsibilities: [
      'Autonomous orchestration of all 12 corporate departments',
      'Real-time aggregation of multi-agent tasks and 15-minute SLA tracking',
      'Strategic roadmap execution and high-level company governance',
      'Cross-departmental budget approval and statutory compliance verification',
    ],
  },
};

// ── LEVEL 1: 12 CORPORATE DEPARTMENTS & 12 AI MANAGERS ────────────────────────
export const CORPORATE_DEPARTMENTS_12: DepartmentDef[] = [
  {
    id: 'customer_experience',
    name: 'Customer Experience, Concierge & Hospitality',
    code: 'DEPT-01',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    icon: 'MessageSquare',
    description: 'VIP client welcoming, 5-star concierge, multi-lingual reception, and frontline luxury hospitality.',
    managerAi: { id: 'mgr_corinne', name: 'AI Corinne', title: 'Director of Customer Experience & Hospitality', avatar: 'https://ui-avatars.com/api/?name=Corinne+Hospitality&background=EF4444&color=fff' },
  },
  {
    id: 'marketing_branding',
    name: 'Marketing, Branding & Digital Acquisition',
    code: 'DEPT-02',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    icon: 'Megaphone',
    description: 'Omnichannel lead acquisition, luxury brand identity, portal syndication (Bayut/PropertyFinder), and paid campaigns.',
    managerAi: { id: 'mgr_olivia', name: 'AI Olivia', title: 'Director of Marketing & Brand Acquisition', avatar: 'https://ui-avatars.com/api/?name=Olivia+Marketing&background=EC4899&color=fff' },
  },
  {
    id: 'human_resources',
    name: 'Human Resources, Performance & Recruiting',
    code: 'DEPT-03',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    icon: 'Users',
    description: 'Talent acquisition, broker performance KPIs, RERA broker licensing onboarding, and organizational culture.',
    managerAi: { id: 'mgr_selena', name: 'AI Selena', title: 'Director of Human Resources & Performance', avatar: 'https://ui-avatars.com/api/?name=Selena+HR&background=8B5CF6&color=fff' },
  },
  {
    id: 'technology_systems',
    name: 'Technology, Systems & Digital Infrastructure',
    code: 'DEPT-04',
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    icon: 'Cpu',
    description: 'Core CRM software engineering, cloud infrastructure, AI automation pipelines, and API gateway security.',
    managerAi: { id: 'mgr_aurora', name: 'AI Aurora', title: 'Chief Technology & Digital Infrastructure Director', avatar: 'https://ui-avatars.com/api/?name=Aurora+CTO&background=0EA5E9&color=fff' },
  },
  {
    id: 'sales_operations',
    name: 'Sales, Services & Operations',
    code: 'DEPT-05',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    icon: 'TrendingUp',
    description: 'Primary and secondary luxury real estate sales, client advisory services, and active deal closing operations.',
    managerAi: { id: 'mgr_clara', name: 'AI Clara', title: 'Director of Sales & Deal Operations', avatar: 'https://ui-avatars.com/api/?name=Clara+Sales&background=F97316&color=fff' },
  },
  {
    id: 'inventory_portfolio',
    name: 'Inventory, Portfolio & Asset Management',
    code: 'DEPT-06',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    icon: 'Building',
    description: 'Master property inventory catalog, landlord portfolio custody, developer unit allocation, and asset preservation.',
    managerAi: { id: 'mgr_sentinel', name: 'AI Sentinel', title: 'Director of Inventory & Asset Management', avatar: 'https://ui-avatars.com/api/?name=Sentinel+Inventory&background=10B981&color=fff' },
  },
  {
    id: 'partnerships_growth',
    name: 'Partnerships, Alliances & Capital Growth',
    code: 'DEPT-07',
    color: '#14B8A6',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    icon: 'Briefcase',
    description: 'Tier-1 master developer alliances (Emaar, Nakheel, Sobha), family office relations, institutional JV capital, and global investor corridors.',
    managerAi: { id: 'mgr_maktoum', name: 'AI Maktoum', title: 'Director of Strategic Alliances & Capital Growth', avatar: 'https://ui-avatars.com/api/?name=Maktoum+Alliances&background=14B8A6&color=fff' },
  },
  {
    id: 'media_public_relations',
    name: 'Media, Public Relations & Communications',
    code: 'DEPT-08',
    color: '#25D366',
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    icon: 'Radio',
    description: 'Executive press releases, luxury architectural media studio, public relations broadcasts, and corporate reputation management.',
    managerAi: { id: 'mgr_maya', name: 'AI Maya', title: 'Director of Media & Public Relations', avatar: 'https://ui-avatars.com/api/?name=Maya+Media&background=25D366&color=fff' },
  },
  {
    id: 'research_analytics',
    name: 'Research, Analytics & Market Intelligence',
    code: 'DEPT-09',
    color: '#64748B',
    gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
    icon: 'BarChart3',
    description: 'Dubai Land Department macroeconomic transaction indexing, price appreciation forecasting, and real estate data science.',
    managerAi: { id: 'mgr_elena', name: 'AI Elena', title: 'Chief Research & Intelligence Director', avatar: 'https://ui-avatars.com/api/?name=Elena+CRO&background=64748B&color=fff' },
  },
  {
    id: 'accounting_finance',
    name: 'Accounting, Finance & Tax',
    code: 'DEPT-10',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    icon: 'DollarSign',
    description: 'UAE FTA VAT 5%, Corporate Tax 9%, broker commission ledger, escrow account reconciliations, and P&L financial audits.',
    managerAi: { id: 'mgr_theodora', name: 'AI Theodora', title: 'Chief Financial Director', avatar: 'https://ui-avatars.com/api/?name=Theodora+Finance&background=F59E0B&color=fff' },
  },
  {
    id: 'legal_compliance',
    name: 'Legal, Compliance & Audit',
    code: 'DEPT-11',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    icon: 'FileCheck',
    description: 'DLD/RERA statutory compliance, Trakheesi permits, Anti-Money Laundering (goAML/KYC), and corporate contract governance.',
    managerAi: { id: 'mgr_sofia', name: 'AI Sofia', title: 'Chief Legal & Compliance Officer', avatar: 'https://ui-avatars.com/api/?name=Sofia+Legal&background=6366F1&color=fff' },
  },
  {
    id: 'executive_governance',
    name: 'Executive, Governance & Strategy',
    code: 'DEPT-12',
    color: '#1E293B',
    gradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    icon: 'Shield',
    description: 'Board of Directors governance, strategic enterprise roadmap execution, M&A operations, and sovereign company policy.',
    managerAi: { id: 'mgr_zayed', name: 'AI Zayed', title: 'Director of Strategic Governance & Enterprise Operations', avatar: 'https://ui-avatars.com/api/?name=Zayed+Governance&background=1E293B&color=fff' },
  },
];

import { SUPERVISOR_TAXONOMY_108 } from './assistants108Taxonomy.data';

// Helper to generate 9 dedicated supervisors for each department (12 * 9 = 108)
function build108Supervisors(): SupervisorDef[] {
  const supervisors: SupervisorDef[] = [];

  CORPORATE_DEPARTMENTS_12.forEach(dept => {
    const deptSupervisors = SUPERVISOR_TAXONOMY_108[dept.id] || [];
    deptSupervisors.forEach((sup, localIdx) => {
      supervisors.push({
        id: `sup_${dept.id}_${localIdx + 1}`,
        name: sup.name,
        code: `SUP-${dept.code}-${localIdx + 1}`,
        title: sup.title,
        departmentId: dept.id,
        departmentName: dept.name,
        supervisorIndex: localIdx + 1,
        icon: dept.icon,
        color: dept.color,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(sup.name)}&background=${dept.color.replace('#', '')}&color=fff`,
        status: 'optimal',
        description: `Autonomous supervisor assigned to ${dept.name}, executing 3 core tasks with 15-minute SLA.`,
        specialty: sup.specialty,
        assignedTasks: sup.tasks,
        capabilities: [sup.specialty, ...sup.tasks],
        slaResponseTime: '< 15 mins',
        metrics: {
          accuracyRate: 99.8,
          tasksCompletedToday: 850 + Math.floor(Math.random() * 200),
          systemHealth: 'optimal',
        },
      });
    });
  });

  return supervisors;
}

export const SUPERVISORS_108: SupervisorDef[] = build108Supervisors();

// Export aggregate count helper
export const CANONICAL_COUNTS = {
  managingDirector: 1,
  executiveAi: 1, // Zoe
  departments: 12,
  departmentManagers: 12,
  supervisorsPerDept: 9,
  totalSupervisors: 108,
  totalAiMesh: 1 + 12 + 108, // 121
};
