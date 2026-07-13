import { Request, Response, NextFunction } from 'express';

export enum AccessLevel {
  LEVEL_1_READ = 1,
  LEVEL_2_RESTRICTED = 2,
  LEVEL_3_POWER = 3,
  LEVEL_4_DEPARTMENT_HEAD = 4,
  LEVEL_5_MASTER = 5,
}

export type Tier = 'Executive' | 'Senior' | 'Mid' | 'Junior' | 'Intern' | 'AI';

export interface JobRole {
  roleId: string;
  departmentId: string;
  title: string;
  tier: Tier;
  defaultAccessLevel: AccessLevel;
}

export const WHITE_CAVES_ROLES: JobRole[] = [
  {
    roleId: "SAL-001",
    departmentId: "sales",
    title: "Chief Sales Officer (CSO)",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "SAL-002",
    departmentId: "sales",
    title: "VP of Luxury Sales",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "SAL-003",
    departmentId: "sales",
    title: "Director of Residential Sales",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "SAL-004",
    departmentId: "sales",
    title: "Director of Commercial Sales",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "SAL-005",
    departmentId: "sales",
    title: "Elite Off-Plan Specialist",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "SAL-006",
    departmentId: "sales",
    title: "Senior Residential Broker (Dubai Marina Zone)",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "SAL-007",
    departmentId: "sales",
    title: "Senior Residential Broker (Palm Jumeirah Zone)",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "SAL-008",
    departmentId: "sales",
    title: "Senior Residential Broker (DAMAC Hills 2 Zone)",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "SAL-009",
    departmentId: "sales",
    title: "Mid-Tier Residential Broker",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "SAL-010",
    departmentId: "sales",
    title: "Junior Client Coordinator",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "SAL-011",
    departmentId: "sales",
    title: "Sales & Telemarketing Intern",
    tier: "Intern",
    defaultAccessLevel: AccessLevel.LEVEL_1_READ
  },
  {
    roleId: "OPR-001",
    departmentId: "operations",
    title: "Chief Operating Officer (COO)",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "OPR-002",
    departmentId: "operations",
    title: "Head of Property Management",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "OPR-003",
    departmentId: "operations",
    title: "Senior Asset Operations Manager",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "OPR-004",
    departmentId: "operations",
    title: "Facilities Management Lead",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "OPR-005",
    departmentId: "operations",
    title: "DH2 Cluster Operations Supervisor",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "OPR-006",
    departmentId: "operations",
    title: "Tenant Relations Specialist",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "OPR-007",
    departmentId: "operations",
    title: "Maintenance Coordinator",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "OPR-008",
    departmentId: "operations",
    title: "Inventory Auditor",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "OPR-009",
    departmentId: "operations",
    title: "Junior Fleet Operations Coordinator",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "OPR-010",
    departmentId: "operations",
    title: "Junior Helpdesk Associate",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "OPR-011",
    departmentId: "operations",
    title: "Operations Logistics Intern",
    tier: "Intern",
    defaultAccessLevel: AccessLevel.LEVEL_1_READ
  },
  {
    roleId: "COM-001",
    departmentId: "communications",
    title: "Chief Communications Officer",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "COM-002",
    departmentId: "communications",
    title: "Director of Customer Experience",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "COM-003",
    departmentId: "communications",
    title: "Nadia WhatsApp Network Administrator",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "COM-004",
    departmentId: "communications",
    title: "Lead Chatbot Conversational Designer",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "COM-005",
    departmentId: "communications",
    title: "Senior Customer Care Specialist",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "COM-006",
    departmentId: "communications",
    title: "WhatsApp Broadcast Campaign Specialist",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "COM-007",
    departmentId: "communications",
    title: "Inbound Lead Routing Specialist",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "COM-008",
    departmentId: "communications",
    title: "Junior Live-Chat Response Agent",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "COM-009",
    departmentId: "communications",
    title: "Junior Template Editor",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "COM-010",
    departmentId: "communications",
    title: "Communications Quality Intern",
    tier: "Intern",
    defaultAccessLevel: AccessLevel.LEVEL_1_READ
  },
  {
    roleId: "FIN-001",
    departmentId: "finance",
    title: "Chief Financial Officer (CFO)",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "FIN-002",
    departmentId: "finance",
    title: "Director of Real Estate Accounting",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "FIN-003",
    departmentId: "finance",
    title: "Senior Commission Reconciliation Manager",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "FIN-004",
    departmentId: "finance",
    title: "Corporate Treasury Lead",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "FIN-005",
    departmentId: "finance",
    title: "Senior Accounts Payable Officer",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "FIN-006",
    departmentId: "finance",
    title: "Senior Accounts Receivable Analyst",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "FIN-007",
    departmentId: "finance",
    title: "Dubai Corporate Tax Specialist",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "FIN-008",
    departmentId: "finance",
    title: "Junior Commission Disbursement Accountant",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "FIN-009",
    departmentId: "finance",
    title: "Junior Invoice Processing Clerk",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "FIN-010",
    departmentId: "finance",
    title: "Finance Data Intern",
    tier: "Intern",
    defaultAccessLevel: AccessLevel.LEVEL_1_READ
  },
  {
    roleId: "MKT-001",
    departmentId: "marketing",
    title: "Chief Marketing Officer (CMO)",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "MKT-002",
    departmentId: "marketing",
    title: "Head of Performance Marketing",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "MKT-003",
    departmentId: "marketing",
    title: "Brand Strategy Director",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "MKT-004",
    departmentId: "marketing",
    title: "Lead Lead-Generation Architect",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "MKT-005",
    departmentId: "marketing",
    title: "Search Engine Optimization (SEO) Lead",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "MKT-006",
    departmentId: "marketing",
    title: "Content & Videography Producer",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "MKT-007",
    departmentId: "marketing",
    title: "Social Media Engagement Manager",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "MKT-008",
    departmentId: "marketing",
    title: "Junior Performance Copywriter",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "MKT-009",
    departmentId: "marketing",
    title: "Junior Graphic Designer",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "MKT-010",
    departmentId: "marketing",
    title: "Marketing Analytics Intern",
    tier: "Intern",
    defaultAccessLevel: AccessLevel.LEVEL_1_READ
  },
  {
    roleId: "EXE-001",
    departmentId: "executive",
    title: "Managing Director / Principal Owner (The 'Lion')",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_5_MASTER
  },
  {
    roleId: "EXE-002",
    departmentId: "executive",
    title: "Chief of Staff",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "EXE-003",
    departmentId: "executive",
    title: "Senior Business Intelligence Director",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "EXE-004",
    departmentId: "executive",
    title: "Executive Operations Manager",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "EXE-005",
    departmentId: "executive",
    title: "Executive Communications Lead",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "EXE-006",
    departmentId: "executive",
    title: "Junior Administrative Coordinator",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "EXE-007",
    departmentId: "executive",
    title: "Executive Research Assistant",
    tier: "Intern",
    defaultAccessLevel: AccessLevel.LEVEL_1_READ
  },
  {
    roleId: "CMP-001",
    departmentId: "compliance",
    title: "Chief Compliance Officer",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "CMP-002",
    departmentId: "compliance",
    title: "Head of RERA / DLD Audit Operations",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "CMP-003",
    departmentId: "compliance",
    title: "Senior Anti-Money Laundering (AML) Investigator",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "CMP-004",
    departmentId: "compliance",
    title: "Know Your Customer (KYC) Risk Analyst",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "CMP-005",
    departmentId: "compliance",
    title: "Trakheesi Advertising Permit Coordinator",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "CMP-006",
    departmentId: "compliance",
    title: "Data Protection Compliance Officer",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "CMP-007",
    departmentId: "compliance",
    title: "Junior Contract Audit Clerk",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "CMP-008",
    departmentId: "compliance",
    title: "Junior Compliance Screening Associate",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "CMP-009",
    departmentId: "compliance",
    title: "Regulatory Audit Intern",
    tier: "Intern",
    defaultAccessLevel: AccessLevel.LEVEL_1_READ
  },
  {
    roleId: "TEC-001",
    departmentId: "technology",
    title: "Chief Technology Officer (CTO)",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "TEC-002",
    departmentId: "technology",
    title: "Principal Software Architect",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "TEC-003",
    departmentId: "technology",
    title: "Lead Backend Engineer",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "TEC-004",
    departmentId: "technology",
    title: "Lead Frontend Engineer",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "TEC-005",
    departmentId: "technology",
    title: "DevOps & Infrastructure Lead",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "TEC-006",
    departmentId: "technology",
    title: "Senior Full-Stack Developer",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "TEC-007",
    departmentId: "technology",
    title: "Quality Assurance & Test Automation Engineer",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "TEC-008",
    departmentId: "technology",
    title: "Junior Frontend UI Developer",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "TEC-009",
    departmentId: "technology",
    title: "Junior Database Administrator",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "TEC-010",
    departmentId: "technology",
    title: "Software Engineering Intern",
    tier: "Intern",
    defaultAccessLevel: AccessLevel.LEVEL_1_READ
  },
  {
    roleId: "LEG-001",
    departmentId: "legal",
    title: "General Counsel / Chief Legal Officer",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "LEG-002",
    departmentId: "legal",
    title: "Head of Real Estate Conveyancing",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "LEG-003",
    departmentId: "legal",
    title: "Senior Dispute Resolution Specialist",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "LEG-004",
    departmentId: "legal",
    title: "Lead Contract Draftsman",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "LEG-005",
    departmentId: "legal",
    title: "DLD Form 7/12 Compliance Analyst",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "LEG-006",
    departmentId: "legal",
    title: "Ejari Regulatory Specialist",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "LEG-007",
    departmentId: "legal",
    title: "Junior Legal Assistant",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "LEG-008",
    departmentId: "legal",
    title: "Junior Conveyancing Associate",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "LEG-009",
    departmentId: "legal",
    title: "Legal Research Intern",
    tier: "Intern",
    defaultAccessLevel: AccessLevel.LEVEL_1_READ
  },
  {
    roleId: "INT-001",
    departmentId: "intelligence",
    title: "Chief Intelligence Officer",
    tier: "Executive",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "INT-002",
    departmentId: "intelligence",
    title: "Principal Data Scientist",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "INT-003",
    departmentId: "intelligence",
    title: "IoT Fleet Telemetry Lead",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "INT-004",
    departmentId: "intelligence",
    title: "Lead Real Estate Market Analyst",
    tier: "Senior",
    defaultAccessLevel: AccessLevel.LEVEL_3_POWER
  },
  {
    roleId: "INT-005",
    departmentId: "intelligence",
    title: "Predictive Pricing Analyst",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "INT-006",
    departmentId: "intelligence",
    title: "IoT Anomaly Detection Specialist",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "INT-007",
    departmentId: "intelligence",
    title: "Data Engineer",
    tier: "Mid",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "INT-008",
    departmentId: "intelligence",
    title: "Junior Business Intelligence Analyst",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "INT-009",
    departmentId: "intelligence",
    title: "Junior Data Validation Analyst",
    tier: "Junior",
    defaultAccessLevel: AccessLevel.LEVEL_2_RESTRICTED
  },
  {
    roleId: "INT-010",
    departmentId: "intelligence",
    title: "Data Science Intern",
    tier: "Intern",
    defaultAccessLevel: AccessLevel.LEVEL_1_READ
  },
  {
    roleId: "AI-ZOE",
    departmentId: "ai",
    title: "Zoe Portal",
    tier: "AI",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "AI-NADIA",
    departmentId: "ai",
    title: "Nadia Router",
    tier: "AI",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  },
  {
    roleId: "AI-SENTINEL",
    departmentId: "ai",
    title: "Sentinel Core",
    tier: "AI",
    defaultAccessLevel: AccessLevel.LEVEL_4_DEPARTMENT_HEAD
  }
];

export const enforceAccessGating = (requiredLevel: AccessLevel) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Extract user from hydration session context
      const user = (req as any).user;
      
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check Lion override
      if (user.email === 'arslanmalikgoraha@gmail.com' && user.role === 'managing_director') {
        (req as any).accessLevel = AccessLevel.LEVEL_5_MASTER;
        next();
        return;
      }

      const userRole = WHITE_CAVES_ROLES.find(r => r.roleId === user.roleId);
      
      if (!userRole) {
        res.status(403).json({ error: 'Forbidden: Role not found' });
        return;
      }

      if (userRole.defaultAccessLevel < requiredLevel) {
        res.status(403).json({ error: 'Forbidden: Insufficient access level' });
        return;
      }

      (req as any).accessLevel = userRole.defaultAccessLevel;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  };
};
