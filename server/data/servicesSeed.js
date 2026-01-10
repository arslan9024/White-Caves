export const SERVICES_SEED = [
  {
    serviceId: 'WC-SVC-001',
    name: 'Luxury Property Concierge',
    category: 'Sales',
    shortDescription: 'White-glove service for properties valued over AED 10M',
    description: 'Exclusive end-to-end service for ultra-high-net-worth clients with properties over AED 10 million',
    departmentCode: 'SALES',
    targetAudience: ['UHNWI', 'VIP Investors', 'Celebrities'],
    pricing: { type: 'commission', percentage: 2.0, minFee: 50000 },
    workflow: {
      estimatedDuration: '120 days',
      stages: [
        { name: 'Client Onboarding', duration: '3 days', required: true },
        { name: 'Requirements Analysis', duration: '5 days', required: true },
        { name: 'Property Shortlist', duration: '14 days', required: true },
        { name: 'Private Viewings', duration: '21 days', required: true },
        { name: 'Negotiation', duration: '14 days', required: true },
        { name: 'Due Diligence', duration: '30 days', required: true },
        { name: 'Contract Execution', duration: '7 days', required: true },
        { name: 'Handover', duration: '14 days', required: true }
      ]
    },
    aiAssistants: ['KAIROS', 'SOPHIA'],
    requirements: ['Emirates ID', 'Passport', 'Proof of Funds', 'Source of Wealth Declaration'],
    deliverables: ['Property Title Deed', 'Completion Certificate', 'Handover Documentation'],
    metrics: { totalRequests: 45, completedRequests: 38, avgCompletionTime: 95, satisfactionScore: 98, revenue: 4500000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-002',
    name: 'Off-Plan Investment Advisory',
    category: 'Sales',
    shortDescription: 'Expert guidance for off-plan property investments',
    description: 'Comprehensive advisory service for investors looking to purchase off-plan properties with payment plan optimization',
    departmentCode: 'SALES',
    targetAudience: ['Investors', 'First-time Buyers', 'Portfolio Builders'],
    pricing: { type: 'fixed', amount: 25000 },
    workflow: {
      estimatedDuration: '45 days',
      stages: [
        { name: 'Investment Profiling', duration: '2 days', required: true },
        { name: 'Market Analysis', duration: '5 days', required: true },
        { name: 'Project Selection', duration: '7 days', required: true },
        { name: 'Developer Due Diligence', duration: '10 days', required: true },
        { name: 'Payment Plan Negotiation', duration: '7 days', required: true },
        { name: 'Booking & SPA', duration: '14 days', required: true }
      ]
    },
    aiAssistants: ['ATLAS', 'SOPHIA'],
    requirements: ['Emirates ID/Passport', 'Investment Budget Confirmation'],
    deliverables: ['Investment Report', 'SPA Copy', 'Payment Schedule'],
    metrics: { totalRequests: 180, completedRequests: 165, avgCompletionTime: 42, satisfactionScore: 94, revenue: 4125000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-003',
    name: 'Secondary Market Sale',
    category: 'Sales',
    shortDescription: 'Professional resale property services',
    description: 'Full-service secondary market sale with valuation, marketing, and transaction management',
    departmentCode: 'SALES',
    targetAudience: ['Property Owners', 'Sellers'],
    pricing: { type: 'commission', percentage: 2.0 },
    workflow: {
      estimatedDuration: '90 days',
      stages: [
        { name: 'Property Valuation', duration: '3 days', required: true },
        { name: 'Photography & Staging', duration: '5 days', required: true },
        { name: 'Portal Listing', duration: '2 days', required: true },
        { name: 'Buyer Viewings', duration: '30 days', required: true },
        { name: 'Offer Negotiation', duration: '14 days', required: true },
        { name: 'Contract & NOC', duration: '21 days', required: true },
        { name: 'Transfer', duration: '14 days', required: true }
      ]
    },
    aiAssistants: ['SOPHIA', 'CLARA', 'MARY'],
    requirements: ['Title Deed', 'Owner Emirates ID', 'NOC from Developer'],
    deliverables: ['Buyer SPA', 'Transfer Documentation', 'Payment Confirmation'],
    metrics: { totalRequests: 320, completedRequests: 285, avgCompletionTime: 78, satisfactionScore: 92, revenue: 9600000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-004',
    name: 'Property Acquisition',
    category: 'Sales',
    shortDescription: 'Buyer representation and property search',
    description: 'Dedicated buyer representation service including property search, due diligence, and purchase support',
    departmentCode: 'SALES',
    targetAudience: ['Buyers', 'Investors', 'Relocating Families'],
    pricing: { type: 'commission', percentage: 1.0 },
    workflow: {
      estimatedDuration: '60 days',
      stages: [
        { name: 'Requirement Analysis', duration: '3 days', required: true },
        { name: 'Property Search', duration: '14 days', required: true },
        { name: 'Shortlist Review', duration: '7 days', required: true },
        { name: 'Viewings', duration: '14 days', required: true },
        { name: 'Negotiation Support', duration: '7 days', required: true },
        { name: 'Transaction Coordination', duration: '14 days', required: true }
      ]
    },
    aiAssistants: ['CLARA', 'SOPHIA'],
    requirements: ['Emirates ID/Passport', 'Budget Confirmation'],
    deliverables: ['Property Shortlist Report', 'Purchase Documentation'],
    metrics: { totalRequests: 450, completedRequests: 398, avgCompletionTime: 52, satisfactionScore: 95, revenue: 6750000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-005',
    name: 'Annual Lease Management',
    category: 'Leasing',
    shortDescription: 'Complete tenancy contract services',
    description: 'End-to-end annual lease management including Ejari registration, payment collection, and renewal handling',
    departmentCode: 'OPS',
    targetAudience: ['Landlords', 'Tenants'],
    pricing: { type: 'commission', percentage: 5.0 },
    workflow: {
      estimatedDuration: '14 days',
      stages: [
        { name: 'Tenant Screening', duration: '3 days', required: true },
        { name: 'Document Collection', duration: '2 days', required: true },
        { name: 'Contract Drafting', duration: '1 day', required: true },
        { name: 'Signing', duration: '1 day', required: true },
        { name: 'Ejari Registration', duration: '2 days', required: true },
        { name: 'Key Handover', duration: '1 day', required: true }
      ]
    },
    aiAssistants: ['DAISY', 'IVY'],
    requirements: ['Emirates ID', 'Passport', 'Visa Copy', 'Salary Certificate'],
    deliverables: ['Tenancy Contract', 'Ejari Certificate', 'Move-in Checklist'],
    metrics: { totalRequests: 890, completedRequests: 856, avgCompletionTime: 10, satisfactionScore: 96, revenue: 4450000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-006',
    name: 'Property Valuation',
    category: 'Advisory',
    shortDescription: 'Professional market valuation reports',
    description: 'Comprehensive property valuation using comparative market analysis and AI-powered pricing models',
    departmentCode: 'INTEL',
    targetAudience: ['Sellers', 'Banks', 'Legal Firms', 'Property Owners'],
    pricing: { type: 'fixed', amount: 5000 },
    workflow: {
      estimatedDuration: '5 days',
      stages: [
        { name: 'Property Inspection', duration: '1 day', required: true },
        { name: 'Market Analysis', duration: '2 days', required: true },
        { name: 'Report Generation', duration: '1 day', required: true },
        { name: 'Quality Review', duration: '1 day', required: true }
      ]
    },
    aiAssistants: ['CIPHER', 'SAGE'],
    requirements: ['Property Access', 'Title Deed Copy'],
    deliverables: ['Valuation Certificate', 'Market Analysis Report'],
    metrics: { totalRequests: 520, completedRequests: 512, avgCompletionTime: 4, satisfactionScore: 97, revenue: 2560000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-007',
    name: 'Portfolio Management',
    category: 'Advisory',
    shortDescription: 'Multi-property investment oversight',
    description: 'Comprehensive portfolio management for investors with multiple properties including performance tracking',
    departmentCode: 'FIN',
    targetAudience: ['Investors', 'Family Offices', 'Investment Companies'],
    pricing: { type: 'subscription', monthly: 15000 },
    workflow: {
      estimatedDuration: 'Ongoing',
      stages: [
        { name: 'Portfolio Audit', duration: '7 days', required: true },
        { name: 'Strategy Development', duration: '14 days', required: true },
        { name: 'Monthly Reporting', duration: 'Monthly', required: true },
        { name: 'Quarterly Review', duration: 'Quarterly', required: true }
      ]
    },
    aiAssistants: ['MAVEN', 'THEODORA'],
    requirements: ['Property Documentation', 'Financial Records'],
    deliverables: ['Portfolio Dashboard Access', 'Monthly Reports', 'Investment Recommendations'],
    metrics: { totalRequests: 45, completedRequests: 45, avgCompletionTime: null, satisfactionScore: 99, revenue: 675000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-008',
    name: 'Property Marketing Campaign',
    category: 'Marketing',
    shortDescription: 'Premium property marketing and exposure',
    description: 'Multi-channel marketing campaign including portal listings, social media, and targeted advertising',
    departmentCode: 'MKT',
    targetAudience: ['Sellers', 'Landlords', 'Developers'],
    pricing: { type: 'package', tiers: [{ name: 'Basic', price: 5000 }, { name: 'Premium', price: 15000 }, { name: 'Luxury', price: 35000 }] },
    workflow: {
      estimatedDuration: '30 days',
      stages: [
        { name: 'Property Photoshoot', duration: '2 days', required: true },
        { name: 'Virtual Tour Creation', duration: '3 days', required: false },
        { name: 'Listing Copywriting', duration: '2 days', required: true },
        { name: 'Portal Publishing', duration: '1 day', required: true },
        { name: 'Campaign Launch', duration: '1 day', required: true },
        { name: 'Performance Monitoring', duration: '21 days', required: true }
      ]
    },
    aiAssistants: ['OLIVIA', 'STELLA', 'MARCUS'],
    requirements: ['Property Access', 'Marketing Authorization'],
    deliverables: ['Marketing Assets', 'Campaign Report', 'Lead List'],
    metrics: { totalRequests: 680, completedRequests: 645, avgCompletionTime: 25, satisfactionScore: 91, revenue: 8840000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-009',
    name: 'KYC & AML Verification',
    category: 'Compliance',
    shortDescription: 'Client identity and source of funds verification',
    description: 'Comprehensive KYC due diligence and AML screening for high-value transactions',
    departmentCode: 'COMP',
    targetAudience: ['All Clients', 'High-Value Transactions'],
    pricing: { type: 'fixed', amount: 2500 },
    workflow: {
      estimatedDuration: '3 days',
      stages: [
        { name: 'Document Collection', duration: '1 day', required: true },
        { name: 'Identity Verification', duration: '1 day', required: true },
        { name: 'AML Screening', duration: '1 day', required: true },
        { name: 'Report Generation', duration: '0.5 days', required: true }
      ]
    },
    aiAssistants: ['LAILA', 'VERA'],
    requirements: ['Emirates ID', 'Passport', 'Bank Statements', 'Source of Funds'],
    deliverables: ['KYC Report', 'AML Clearance Certificate'],
    metrics: { totalRequests: 1250, completedRequests: 1230, avgCompletionTime: 2.5, satisfactionScore: 99, revenue: 3075000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-010',
    name: 'Legal Contract Review',
    category: 'Legal',
    shortDescription: 'Professional contract review and advisory',
    description: 'Expert legal review of property contracts, SPAs, and tenancy agreements with recommendations',
    departmentCode: 'LEGAL',
    targetAudience: ['Buyers', 'Sellers', 'Landlords', 'Tenants'],
    pricing: { type: 'fixed', amount: 3500 },
    workflow: {
      estimatedDuration: '5 days',
      stages: [
        { name: 'Document Receipt', duration: '0.5 days', required: true },
        { name: 'Initial Review', duration: '1 day', required: true },
        { name: 'Detailed Analysis', duration: '2 days', required: true },
        { name: 'Report & Recommendations', duration: '1.5 days', required: true }
      ]
    },
    aiAssistants: ['EVANGELINE', 'SOPHIA'],
    requirements: ['Contract Document', 'Client Brief'],
    deliverables: ['Legal Opinion', 'Marked-up Contract', 'Risk Assessment'],
    metrics: { totalRequests: 780, completedRequests: 762, avgCompletionTime: 4, satisfactionScore: 96, revenue: 2667000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-011',
    name: 'Maintenance Coordination',
    category: 'Property Management',
    shortDescription: 'Property maintenance and repair services',
    description: 'End-to-end maintenance coordination including vendor management and quality assurance',
    departmentCode: 'OPS',
    targetAudience: ['Property Owners', 'Landlords', 'Property Managers'],
    pricing: { type: 'hourly', rate: 150, markup: 15 },
    workflow: {
      estimatedDuration: '7 days',
      stages: [
        { name: 'Issue Assessment', duration: '1 day', required: true },
        { name: 'Vendor Selection', duration: '1 day', required: true },
        { name: 'Quote Approval', duration: '1 day', required: true },
        { name: 'Work Execution', duration: '3 days', required: true },
        { name: 'Quality Check', duration: '1 day', required: true }
      ]
    },
    aiAssistants: ['SENTINEL', 'DAISY'],
    requirements: ['Property Access', 'Owner Authorization'],
    deliverables: ['Work Completion Report', 'Invoice', 'Warranty Documents'],
    metrics: { totalRequests: 2150, completedRequests: 2089, avgCompletionTime: 5, satisfactionScore: 93, revenue: 3225000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-012',
    name: 'WhatsApp Customer Support',
    category: 'Communications',
    shortDescription: '24/7 WhatsApp-based customer service',
    description: 'Round-the-clock customer support via WhatsApp with AI-powered responses and human escalation',
    departmentCode: 'COMM',
    targetAudience: ['All Clients', 'Prospects', 'Tenants'],
    pricing: { type: 'included', note: 'Included with all services' },
    workflow: {
      estimatedDuration: 'Instant',
      stages: [
        { name: 'Inquiry Receipt', duration: 'Instant', required: true },
        { name: 'AI Classification', duration: 'Instant', required: true },
        { name: 'Response/Escalation', duration: '< 2 min', required: true },
        { name: 'Resolution', duration: 'Varies', required: true }
      ]
    },
    aiAssistants: ['LINDA', 'NINA'],
    requirements: ['WhatsApp Number'],
    deliverables: ['Chat History', 'Resolution Confirmation'],
    metrics: { totalRequests: 15600, completedRequests: 15420, avgCompletionTime: 0.02, satisfactionScore: 94, revenue: 0 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-013',
    name: 'Tenant Move-In/Move-Out',
    category: 'Leasing',
    shortDescription: 'Professional move-in/out inspection services',
    description: 'Comprehensive property inspection, condition documentation, and security deposit assessment',
    departmentCode: 'OPS',
    targetAudience: ['Tenants', 'Landlords'],
    pricing: { type: 'fixed', amount: 1500 },
    workflow: {
      estimatedDuration: '1 day',
      stages: [
        { name: 'Scheduling', duration: '1 hour', required: true },
        { name: 'Property Inspection', duration: '2 hours', required: true },
        { name: 'Documentation', duration: '2 hours', required: true },
        { name: 'Report Delivery', duration: '2 hours', required: true }
      ]
    },
    aiAssistants: ['DAISY', 'SENTINEL'],
    requirements: ['Appointment Confirmation', 'Keys/Access'],
    deliverables: ['Condition Report', 'Photo Documentation', 'Deposit Assessment'],
    metrics: { totalRequests: 890, completedRequests: 878, avgCompletionTime: 0.5, satisfactionScore: 97, revenue: 1317000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-014',
    name: 'Investment Feasibility Study',
    category: 'Advisory',
    shortDescription: 'ROI analysis and investment projections',
    description: 'Detailed feasibility study including ROI projections, risk analysis, and market positioning',
    departmentCode: 'INTEL',
    targetAudience: ['Developers', 'Investors', 'Family Offices'],
    pricing: { type: 'fixed', amount: 35000 },
    workflow: {
      estimatedDuration: '21 days',
      stages: [
        { name: 'Brief & Scope', duration: '2 days', required: true },
        { name: 'Market Research', duration: '7 days', required: true },
        { name: 'Financial Modeling', duration: '7 days', required: true },
        { name: 'Report Compilation', duration: '3 days', required: true },
        { name: 'Presentation', duration: '2 days', required: true }
      ]
    },
    aiAssistants: ['ATLAS', 'CIPHER', 'SAGE'],
    requirements: ['Project Details', 'Land Documents', 'Development Plans'],
    deliverables: ['Feasibility Report', 'Financial Model', 'Risk Matrix', 'Recommendations'],
    metrics: { totalRequests: 28, completedRequests: 25, avgCompletionTime: 18, satisfactionScore: 98, revenue: 875000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-015',
    name: 'RERA & DLD Registration',
    category: 'Compliance',
    shortDescription: 'Regulatory registration and licensing',
    description: 'Complete RERA registration, DLD coordination, and regulatory compliance for property transactions',
    departmentCode: 'COMP',
    targetAudience: ['Property Owners', 'Agents', 'Developers'],
    pricing: { type: 'fixed', amount: 4500 },
    workflow: {
      estimatedDuration: '7 days',
      stages: [
        { name: 'Document Preparation', duration: '2 days', required: true },
        { name: 'Submission', duration: '1 day', required: true },
        { name: 'Follow-up', duration: '3 days', required: true },
        { name: 'Certificate Collection', duration: '1 day', required: true }
      ]
    },
    aiAssistants: ['LAILA', 'HENRY'],
    requirements: ['Title Deed', 'Owner ID', 'Application Forms'],
    deliverables: ['RERA Certificate', 'DLD Confirmation', 'Compliance Report'],
    metrics: { totalRequests: 450, completedRequests: 438, avgCompletionTime: 6, satisfactionScore: 95, revenue: 1971000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-016',
    name: 'Property Photography & Video',
    category: 'Marketing',
    shortDescription: 'Professional property media production',
    description: 'High-quality photography, 360 virtual tours, drone footage, and promotional videos',
    departmentCode: 'MKT',
    targetAudience: ['Sellers', 'Landlords', 'Developers'],
    pricing: { type: 'package', tiers: [{ name: 'Standard', price: 2500 }, { name: 'Premium', price: 7500 }, { name: 'Cinematic', price: 15000 }] },
    workflow: {
      estimatedDuration: '5 days',
      stages: [
        { name: 'Pre-production Planning', duration: '1 day', required: true },
        { name: 'Property Shoot', duration: '1 day', required: true },
        { name: 'Post-production', duration: '2 days', required: true },
        { name: 'Delivery', duration: '1 day', required: true }
      ]
    },
    aiAssistants: ['STELLA', 'OLIVIA'],
    requirements: ['Property Access', 'Staging Preferences'],
    deliverables: ['Photo Gallery', 'Video Files', 'Virtual Tour Link', 'Social Media Edits'],
    metrics: { totalRequests: 920, completedRequests: 905, avgCompletionTime: 4, satisfactionScore: 94, revenue: 4600000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-017',
    name: 'Rent Collection Service',
    category: 'Property Management',
    shortDescription: 'Automated rent collection and reconciliation',
    description: 'Full rent collection service including reminders, payment processing, and landlord disbursement',
    departmentCode: 'FIN',
    targetAudience: ['Landlords', 'Property Managers'],
    pricing: { type: 'commission', percentage: 3.0 },
    workflow: {
      estimatedDuration: 'Monthly',
      stages: [
        { name: 'Invoice Generation', duration: 'Auto', required: true },
        { name: 'Payment Reminders', duration: 'Auto', required: true },
        { name: 'Collection', duration: 'As received', required: true },
        { name: 'Reconciliation', duration: '1 day', required: true },
        { name: 'Disbursement', duration: '2 days', required: true }
      ]
    },
    aiAssistants: ['THEODORA', 'QUINN'],
    requirements: ['Bank Details', 'Tenant Information', 'Lease Copy'],
    deliverables: ['Monthly Statement', 'Payment Receipts', 'Disbursement Confirmation'],
    metrics: { totalRequests: 1850, completedRequests: 1820, avgCompletionTime: 3, satisfactionScore: 96, revenue: 2775000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-018',
    name: 'Commission Processing',
    category: 'Finance',
    shortDescription: 'Agent commission calculation and payout',
    description: 'Accurate commission calculation, split management, and timely agent payouts',
    departmentCode: 'FIN',
    targetAudience: ['Agents', 'Management'],
    pricing: { type: 'internal', note: 'Internal service' },
    workflow: {
      estimatedDuration: '3 days',
      stages: [
        { name: 'Deal Verification', duration: '1 day', required: true },
        { name: 'Commission Calculation', duration: '0.5 days', required: true },
        { name: 'Approval', duration: '1 day', required: true },
        { name: 'Payment Processing', duration: '0.5 days', required: true }
      ]
    },
    aiAssistants: ['PENNY', 'THEODORA'],
    requirements: ['Closed Deal Documentation', 'Agent Agreement'],
    deliverables: ['Commission Statement', 'Payment Confirmation'],
    metrics: { totalRequests: 680, completedRequests: 675, avgCompletionTime: 2.5, satisfactionScore: 98, revenue: 0 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-019',
    name: 'Lead Generation Campaign',
    category: 'Marketing',
    shortDescription: 'Targeted digital lead generation',
    description: 'Multi-channel lead generation including paid ads, SEO, and content marketing',
    departmentCode: 'MKT',
    targetAudience: ['Company', 'Agents'],
    pricing: { type: 'budget', minSpend: 10000, managementFee: 2000 },
    workflow: {
      estimatedDuration: '30 days',
      stages: [
        { name: 'Strategy Development', duration: '3 days', required: true },
        { name: 'Creative Production', duration: '5 days', required: true },
        { name: 'Campaign Setup', duration: '2 days', required: true },
        { name: 'Launch & Optimization', duration: '20 days', required: true }
      ]
    },
    aiAssistants: ['MARCUS', 'HUNTER', 'OLIVIA'],
    requirements: ['Budget Approval', 'Target Audience Brief'],
    deliverables: ['Campaign Report', 'Lead Database', 'Performance Analytics'],
    metrics: { totalRequests: 85, completedRequests: 78, avgCompletionTime: 28, satisfactionScore: 89, revenue: 510000 },
    status: 'active'
  },
  {
    serviceId: 'WC-SVC-020',
    name: 'Project Handover Coordination',
    category: 'Sales',
    shortDescription: 'Off-plan project handover management',
    description: 'Complete handover coordination including snagging, defect management, and final documentation',
    departmentCode: 'SALES',
    targetAudience: ['Off-Plan Buyers', 'Investors'],
    pricing: { type: 'fixed', amount: 8500 },
    workflow: {
      estimatedDuration: '30 days',
      stages: [
        { name: 'Handover Notice Review', duration: '2 days', required: true },
        { name: 'Pre-inspection', duration: '1 day', required: true },
        { name: 'Snagging List', duration: '3 days', required: true },
        { name: 'Defect Rectification', duration: '14 days', required: true },
        { name: 'Final Inspection', duration: '1 day', required: true },
        { name: 'Handover & Keys', duration: '1 day', required: true }
      ]
    },
    aiAssistants: ['VESTA', 'SENTINEL'],
    requirements: ['Handover Notice', 'Payment Completion', 'SPA Copy'],
    deliverables: ['Snagging Report', 'Handover Certificate', 'Key Set', 'Completion Certificate'],
    metrics: { totalRequests: 125, completedRequests: 118, avgCompletionTime: 22, satisfactionScore: 94, revenue: 1003000 },
    status: 'active'
  }
];

const additionalServices = [
  { name: 'Ejari Registration', category: 'Leasing', dept: 'OPS', price: 500, requests: 2450 },
  { name: 'Tenancy Renewal', category: 'Leasing', dept: 'OPS', price: 1000, requests: 1680 },
  { name: 'Security Deposit Management', category: 'Leasing', dept: 'FIN', price: 500, requests: 1850 },
  { name: 'Property Staging', category: 'Marketing', dept: 'MKT', price: 8000, requests: 95 },
  { name: 'Market Intelligence Report', category: 'Advisory', dept: 'INTEL', price: 12000, requests: 45 },
  { name: 'Mortgage Referral', category: 'Finance', dept: 'FIN', price: 0, requests: 380 },
  { name: 'Golden Visa Assistance', category: 'Compliance', dept: 'COMP', price: 5000, requests: 120 },
  { name: 'Property Insurance Referral', category: 'Advisory', dept: 'OPS', price: 0, requests: 450 },
  { name: 'Utility Setup Assistance', category: 'Property Management', dept: 'OPS', price: 750, requests: 1200 },
  { name: 'Power of Attorney Coordination', category: 'Legal', dept: 'LEGAL', price: 3000, requests: 280 },
  { name: 'Escrow Account Management', category: 'Finance', dept: 'FIN', price: 2500, requests: 185 },
  { name: 'Developer Relations', category: 'Sales', dept: 'SALES', price: 0, requests: 65 },
  { name: 'VIP Client Concierge', category: 'Sales', dept: 'SALES', price: 25000, requests: 35 },
  { name: 'Dispute Resolution Support', category: 'Legal', dept: 'LEGAL', price: 8000, requests: 42 },
  { name: 'Tax Advisory Referral', category: 'Finance', dept: 'FIN', price: 0, requests: 150 }
];

let svcCounter = 21;
additionalServices.forEach(svc => {
  SERVICES_SEED.push({
    serviceId: `WC-SVC-${String(svcCounter).padStart(3, '0')}`,
    name: svc.name,
    category: svc.category,
    shortDescription: `Professional ${svc.name.toLowerCase()} services`,
    description: `Comprehensive ${svc.name.toLowerCase()} service for White Caves clients`,
    departmentCode: svc.dept,
    targetAudience: ['All Clients'],
    pricing: svc.price > 0 ? { type: 'fixed', amount: svc.price } : { type: 'referral', note: 'Commission from partner' },
    workflow: { estimatedDuration: '7 days', stages: [{ name: 'Processing', duration: '7 days', required: true }] },
    aiAssistants: [],
    requirements: ['Standard Documentation'],
    deliverables: ['Service Completion Report'],
    metrics: { totalRequests: svc.requests, completedRequests: Math.floor(svc.requests * 0.95), avgCompletionTime: 5, satisfactionScore: 94, revenue: svc.price * svc.requests * 0.95 },
    status: 'active'
  });
  svcCounter++;
});

export default SERVICES_SEED;
