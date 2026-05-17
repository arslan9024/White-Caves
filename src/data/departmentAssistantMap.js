export const DEPT_ASSISTANT_MAP = {
  executive: {
    primary: ['zoe'],
    secondary: [],
    label: 'Executive Overview',
    description: 'Strategic oversight and company-wide intelligence',
    lifecycleStages: ['Planning', 'Review', 'Decision', 'Execution', 'Monitoring'],
    kpis: ['Revenue', 'Growth', 'Efficiency', 'Satisfaction']
  },
  operations: {
    primary: ['marcus', 'kevin'],
    secondary: ['zoe'],
    label: 'Operations & Organization',
    description: 'HR, departments, employees, and organizational structure',
    lifecycleStages: ['Recruitment', 'Onboarding', 'Training', 'Active', 'Review', 'Offboarding'],
    kpis: ['Headcount', 'Productivity', 'Retention', 'Satisfaction']
  },
  sales: {
    primary: ['ella', 'liam', 'phoebe'],
    secondary: ['zoe', 'clara'],
    label: 'Sales & Pipeline',
    description: 'Leads, deals, negotiations, and client journey',
    lifecycleStages: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    kpis: ['Leads', 'Conversion', 'Revenue', 'Pipeline Value']
  },
  properties: {
    primary: ['mary', 'henry', 'olivia', 'mason', 'sam'],
    secondary: ['zoe'],
    label: 'Properties & Inventory',
    description: 'Portfolio management, listings, and property lifecycle',
    lifecycleStages: ['Draft', 'Review', 'Listed', 'Under Offer', 'Sold/Rented', 'Archived'],
    kpis: ['Total Properties', 'Active Listings', 'Pending', 'Closed']
  },
  services: {
    primary: ['sophia', 'ethan'],
    secondary: ['zoe'],
    label: 'Services & Fulfillment',
    description: 'Service catalog, requests, and fulfillment tracking',
    lifecycleStages: ['Requested', 'Assigned', 'In Progress', 'Review', 'Completed', 'Invoiced'],
    kpis: ['Requests', 'In Progress', 'Completed', 'Satisfaction']
  },
  leasing: {
    primary: ['nina', 'grace', 'amber', 'luna'],
    secondary: ['zoe', 'daisy'],
    label: 'Leasing & Tenancy',
    description: 'Ejari, tenancy lifecycle, renewals, and tenant management',
    lifecycleStages: ['Inquiry', 'Viewing', 'Application', 'Approved', 'Ejari', 'Active', 'Renewal', 'Ended'],
    kpis: ['Active Leases', 'Renewals Due', 'Occupancy', 'Rent Collection']
  },
  marketing: {
    primary: ['ivy', 'walter', 'iris'],
    secondary: ['zoe', 'olivia'],
    label: 'Marketing & Communications',
    description: 'Campaigns, content, WhatsApp, and brand management',
    lifecycleStages: ['Planning', 'Content', 'Review', 'Scheduled', 'Live', 'Analysis'],
    kpis: ['Campaigns', 'Reach', 'Engagement', 'Leads Generated']
  },
  finance: {
    primary: ['max'],
    secondary: ['zoe', 'theodora'],
    label: 'Finance & Payments',
    description: 'Payments, invoices, commissions, and financial reporting',
    lifecycleStages: ['Invoice', 'Sent', 'Reminder', 'Paid', 'Overdue', 'Written Off'],
    kpis: ['Revenue', 'Outstanding', 'Collected', 'Commissions']
  },
  compliance: {
    primary: ['leo', 'jack'],
    secondary: ['zoe', 'henry', 'evangeline'],
    label: 'Compliance & Legal',
    description: 'RERA audits, KYC/AML, document vault, and audit trails',
    lifecycleStages: ['Initiated', 'Documents', 'Verification', 'Approved', 'Flagged', 'Resolved'],
    kpis: ['Pending KYC', 'Approved', 'Flagged', 'Compliance Rate']
  },
  analytics: {
    primary: ['coral', 'celeste'],
    secondary: ['zoe', 'sage'],
    label: 'Analytics & Intelligence',
    description: 'Market insights, performance reports, and forecasting',
    lifecycleStages: ['Data Collection', 'Processing', 'Analysis', 'Insights', 'Report', 'Action'],
    kpis: ['Reports Generated', 'Insights', 'Accuracy', 'Actions Taken']
  },
  admin: {
    primary: ['aurora', 'stella', 'nova', 'ember', 'marina'],
    secondary: ['zoe'],
    label: 'Administration',
    description: 'System settings, integrations, knowledge base, and health',
    lifecycleStages: ['Draft', 'Review', 'Published', 'Archived'],
    kpis: ['Documents', 'Integrations', 'Uptime', 'Issues']
  }
};

export const getAssistantsForDepartment = (deptId) => {
  const dept = DEPT_ASSISTANT_MAP[deptId];
  if (!dept) return [];
  return [...dept.primary, ...dept.secondary];
};

export const getDepartmentsForAssistant = (assistantId) => {
  const departments = [];
  for (const [deptId, dept] of Object.entries(DEPT_ASSISTANT_MAP)) {
    if (dept.primary.includes(assistantId) || dept.secondary.includes(assistantId)) {
      departments.push({
        id: deptId,
        ...dept,
        isPrimary: dept.primary.includes(assistantId)
      });
    }
  }
  return departments;
};

export const isAssistantPrimaryForDepartment = (assistantId, deptId) => {
  const dept = DEPT_ASSISTANT_MAP[deptId];
  return dept?.primary.includes(assistantId) || false;
};

export const getLifecycleStages = (deptId) => {
  return DEPT_ASSISTANT_MAP[deptId]?.lifecycleStages || [];
};

export const getDepartmentKpis = (deptId) => {
  return DEPT_ASSISTANT_MAP[deptId]?.kpis || [];
};
