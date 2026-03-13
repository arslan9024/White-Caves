export interface AIAssistant {
  id: string;
  name: string;
  title: string;
  department: string;
  status: string;
  features: string[];
  connections: string[];
}

export const AI_ASSISTANTS_REGISTRY: AIAssistant[] = [
  { id: 'linda', name: 'Linda', title: 'WhatsApp CRM Manager', department: 'Communications', status: 'active', features: ['23+ Agent Management', 'Conversation Routing', 'Lead Pre-qualification', 'Template Messaging', 'Performance Tracking'], connections: ['Clara', 'Sophia'] },
  { id: 'mary', name: 'Mary', title: 'Inventory CRM Manager', department: 'Operations', status: 'active', features: ['DAMAC Hills 2 Inventory (9,378+ units)', 'S3 Asset Fetcher', 'OCR Image Extractor', 'Web Data Harvester', 'Excel Import/Export'], connections: ['Daisy', 'Sophia'] },
  { id: 'clara', name: 'Clara', title: 'Leads CRM Manager', department: 'Sales', status: 'active', features: ['Lead Pipeline Management', 'Qualification Workflows', 'Conversion Tracking', 'Lead Scoring', 'Auto-Assignment'], connections: ['Linda', 'Sophia', 'Nancy'] },
  { id: 'nina', name: 'Nina', title: 'WhatsApp Bot Developer', department: 'Communications', status: 'active', features: ['Bot Flow Design', 'Session Management', 'Analytics Dashboard', 'Template Builder', 'Webhook Configuration'], connections: ['Linda', 'Aurora'] },
  { id: 'nancy', name: 'Nancy', title: 'HR Manager', department: 'Operations', status: 'active', features: ['Employee Directory', 'Recruitment Pipeline', 'Performance Tracking', 'Leave Management', 'Attendance System'], connections: ['Zoe', 'Theodora'] },
  { id: 'sophia', name: 'Sophia', title: 'Sales Pipeline Manager', department: 'Sales', status: 'active', features: ['Deal Tracking', 'Pipeline Visualization', 'Agent Performance', 'Sales Forecasting', 'Commission Calculator'], connections: ['Clara', 'Mary', 'Theodora'] },
  { id: 'daisy', name: 'Daisy', title: 'Leasing Manager', department: 'Operations', status: 'active', features: ['Lease Management', 'Tenant Communications', 'Maintenance Requests', 'Renewal Tracking', 'Ejari Integration'], connections: ['Mary', 'Laila', 'Theodora'] },
  { id: 'theodora', name: 'Theodora', title: 'Finance Director', department: 'Finance', status: 'active', features: ['Invoice Management', 'Payment Tracking', 'Expense Reports', 'P&L Statements', 'Budget Analysis'], connections: ['Sophia', 'Daisy', 'Aurora'] },
  { id: 'olivia', name: 'Olivia', title: 'Marketing & Automation Manager', department: 'Marketing', status: 'active', features: ['Automated Property Sync', 'Mary Inventory Coordination', 'Market Intelligence', 'Website Monitoring (Bayut, PF, Dubizzle)', 'Campaign Management', 'Social Media Analytics', 'Multi-Portal Publishing'], connections: ['Mary', 'Clara', 'Linda'] },
  { id: 'zoe', name: 'Zoe', title: 'Executive Assistant & Strategic Intelligence', department: 'Executive', status: 'active', features: ['Executive Suggestion Inbox', 'AI Strategic Suggestions Pipeline', 'Priority Alerts Dashboard', 'Calendar Management', 'Meeting Scheduling', 'Task Delegation', 'Cross-Department Intelligence'], connections: ['All Assistants', 'Nancy', 'Aurora'] },
  { id: 'laila', name: 'Laila', title: 'Compliance Officer', department: 'Compliance', status: 'active', features: ['KYC Verification', 'AML Monitoring', 'Contract Reviews', 'RERA Compliance', 'Document Validation'], connections: ['Daisy', 'Theodora'] },
  { id: 'aurora', name: 'Aurora', title: 'CTO & Systems Architect', department: 'Technology', status: 'active', features: ['System Monitoring', 'Technical Documentation', 'Architecture Planning', 'API Management', 'Deployment Pipeline'], connections: ['All Assistants', 'Hazel', 'Willow'] },
  { id: 'hazel', name: 'Hazel', title: 'Elite Frontend Engineer', department: 'Technology', status: 'active', features: ['Component Library (47+)', 'Design System Management', 'Accessibility Audits (AAA)', 'UI Performance Optimization', 'Theme System', 'Responsive Design'], connections: ['Aurora', 'Willow'] },
  { id: 'willow', name: 'Willow', title: 'Elite Backend Engineer', department: 'Technology', status: 'active', features: ['API Development (45+ endpoints)', 'Database Optimization', 'Caching Strategies', 'WebSocket Real-time', 'Security Hardening', 'Load Balancing'], connections: ['Aurora', 'Hazel'] }
];
