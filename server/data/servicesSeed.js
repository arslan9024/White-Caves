export const SERVICES_SEED = [
  {
    code: 'WC-SVC-001',
    name: 'Luxury Property Concierge',
    category: 'Property Sales',
    shortDescription: 'White-glove service for properties valued over AED 10M',
    description: 'Exclusive end-to-end service for ultra-high-net-worth clients with properties over AED 10 million',
    departmentCode: 'SALES',
    targetAudience: ['investors', 'buyers'],
    pricing: { type: 'percentage', percentage: 2.0, amount: 50000 },
    workflow: {
      estimatedDuration: '120 days',
      stages: [
        { order: 1, name: 'Client Onboarding', duration: '3 days', actions: ['Initial meeting', 'Requirements capture'] },
        { order: 2, name: 'Requirements Analysis', duration: '5 days', actions: ['Property profiling', 'Budget analysis'] },
        { order: 3, name: 'Property Shortlist', duration: '14 days', actions: ['Market search', 'Shortlist creation'] },
        { order: 4, name: 'Private Viewings', duration: '21 days', actions: ['Schedule viewings', 'Property tours'] },
        { order: 5, name: 'Negotiation', duration: '14 days', actions: ['Price negotiation', 'Terms discussion'] },
        { order: 6, name: 'Due Diligence', duration: '30 days', actions: ['Legal review', 'Title verification'] },
        { order: 7, name: 'Contract Execution', duration: '7 days', actions: ['SPA signing', 'Payment coordination'] },
        { order: 8, name: 'Handover', duration: '14 days', actions: ['Keys handover', 'Documentation'] }
      ]
    },
    requirements: [
      { name: 'Emirates ID', mandatory: true },
      { name: 'Passport', mandatory: true },
      { name: 'Proof of Funds', mandatory: true },
      { name: 'Source of Wealth Declaration', mandatory: false }
    ],
    deliverables: [
      { name: 'Property Title Deed', format: 'Physical/PDF' },
      { name: 'Completion Certificate', format: 'PDF' },
      { name: 'Handover Documentation', format: 'Physical/PDF' }
    ],
    metrics: { totalRequests: 45, completedRequests: 38, avgCompletionTime: 95, satisfactionScore: 98, revenue: 4500000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-002',
    name: 'Off-Plan Investment Advisory',
    category: 'Property Sales',
    shortDescription: 'Expert guidance for off-plan property investments',
    description: 'Comprehensive advisory service for investors looking to purchase off-plan properties with payment plan optimization',
    departmentCode: 'SALES',
    targetAudience: ['investors', 'buyers'],
    pricing: { type: 'fixed', amount: 25000 },
    workflow: {
      estimatedDuration: '45 days',
      stages: [
        { order: 1, name: 'Investment Profiling', duration: '2 days', actions: ['Risk assessment', 'Goals analysis'] },
        { order: 2, name: 'Market Analysis', duration: '5 days', actions: ['Trend research', 'ROI projections'] },
        { order: 3, name: 'Project Selection', duration: '7 days', actions: ['Developer research', 'Project comparison'] },
        { order: 4, name: 'Developer Due Diligence', duration: '10 days', actions: ['Track record review', 'Financial check'] },
        { order: 5, name: 'Payment Plan Negotiation', duration: '7 days', actions: ['Terms negotiation', 'Discount negotiation'] },
        { order: 6, name: 'Booking & SPA', duration: '14 days', actions: ['Booking form', 'SPA signing'] }
      ]
    },
    requirements: [
      { name: 'Emirates ID or Passport', mandatory: true },
      { name: 'Investment Budget Confirmation', mandatory: true }
    ],
    deliverables: [
      { name: 'Investment Report', format: 'PDF' },
      { name: 'SPA Copy', format: 'PDF' },
      { name: 'Payment Schedule', format: 'PDF' }
    ],
    metrics: { totalRequests: 180, completedRequests: 165, avgCompletionTime: 42, satisfactionScore: 94, revenue: 4125000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-003',
    name: 'Secondary Market Sale',
    category: 'Property Sales',
    shortDescription: 'Professional resale property services',
    description: 'Full-service secondary market sale with valuation, marketing, and transaction management',
    departmentCode: 'SALES',
    targetAudience: ['sellers', 'landlords'],
    pricing: { type: 'percentage', percentage: 2.0 },
    workflow: {
      estimatedDuration: '90 days',
      stages: [
        { order: 1, name: 'Property Valuation', duration: '3 days', actions: ['Market comparison', 'Expert assessment'] },
        { order: 2, name: 'Photography & Staging', duration: '5 days', actions: ['Professional photos', 'Virtual tours'] },
        { order: 3, name: 'Portal Listing', duration: '2 days', actions: ['Multi-portal listing', 'Marketing launch'] },
        { order: 4, name: 'Buyer Viewings', duration: '30 days', actions: ['Viewing coordination', 'Feedback collection'] },
        { order: 5, name: 'Offer Negotiation', duration: '14 days', actions: ['Offer management', 'Counter-offers'] },
        { order: 6, name: 'Contract & NOC', duration: '21 days', actions: ['SPA drafting', 'NOC application'] },
        { order: 7, name: 'Transfer', duration: '14 days', actions: ['DLD transfer', 'Payment coordination'] }
      ]
    },
    requirements: [
      { name: 'Title Deed', mandatory: true },
      { name: 'Owner Emirates ID', mandatory: true },
      { name: 'NOC from Developer', mandatory: true }
    ],
    deliverables: [
      { name: 'Buyer SPA', format: 'PDF' },
      { name: 'Transfer Documentation', format: 'Physical' },
      { name: 'Payment Confirmation', format: 'PDF' }
    ],
    metrics: { totalRequests: 320, completedRequests: 285, avgCompletionTime: 78, satisfactionScore: 92, revenue: 9600000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-004',
    name: 'Property Acquisition',
    category: 'Property Sales',
    shortDescription: 'Buyer representation and property search',
    description: 'Dedicated buyer representation service including property search, due diligence, and purchase support',
    departmentCode: 'SALES',
    targetAudience: ['buyers', 'investors'],
    pricing: { type: 'percentage', percentage: 1.0 },
    workflow: {
      estimatedDuration: '60 days',
      stages: [
        { order: 1, name: 'Requirement Analysis', duration: '3 days', actions: ['Needs assessment', 'Budget planning'] },
        { order: 2, name: 'Property Search', duration: '14 days', actions: ['Market search', 'Property matching'] },
        { order: 3, name: 'Shortlist Review', duration: '7 days', actions: ['Comparative analysis', 'Recommendation'] },
        { order: 4, name: 'Viewings', duration: '14 days', actions: ['Property tours', 'Expert guidance'] },
        { order: 5, name: 'Negotiation Support', duration: '7 days', actions: ['Offer preparation', 'Price negotiation'] },
        { order: 6, name: 'Transaction Coordination', duration: '14 days', actions: ['Documentation', 'Transfer support'] }
      ]
    },
    requirements: [
      { name: 'Emirates ID or Passport', mandatory: true },
      { name: 'Budget Confirmation', mandatory: true }
    ],
    deliverables: [
      { name: 'Property Shortlist Report', format: 'PDF' },
      { name: 'Purchase Documentation', format: 'Physical/PDF' }
    ],
    metrics: { totalRequests: 450, completedRequests: 398, avgCompletionTime: 52, satisfactionScore: 95, revenue: 6750000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-005',
    name: 'Annual Lease Management',
    category: 'Property Rentals',
    shortDescription: 'Complete tenancy contract services',
    description: 'End-to-end annual lease management including Ejari registration, payment collection, and renewal handling',
    departmentCode: 'OPS',
    targetAudience: ['landlords', 'tenants'],
    pricing: { type: 'percentage', percentage: 5.0 },
    workflow: {
      estimatedDuration: '14 days',
      stages: [
        { order: 1, name: 'Tenant Screening', duration: '3 days', actions: ['Background check', 'References'] },
        { order: 2, name: 'Document Collection', duration: '2 days', actions: ['ID copies', 'Employment letter'] },
        { order: 3, name: 'Contract Drafting', duration: '1 day', actions: ['Terms finalization', 'Contract prep'] },
        { order: 4, name: 'Signing', duration: '1 day', actions: ['Contract signing', 'Cheque collection'] },
        { order: 5, name: 'Ejari Registration', duration: '2 days', actions: ['RERA registration', 'Ejari certificate'] },
        { order: 6, name: 'Key Handover', duration: '1 day', actions: ['Move-in inspection', 'Keys handover'] }
      ]
    },
    requirements: [
      { name: 'Tenant Emirates ID', mandatory: true },
      { name: 'Employment Contract', mandatory: true },
      { name: 'Landlord Emirates ID', mandatory: true }
    ],
    deliverables: [
      { name: 'Ejari Certificate', format: 'PDF' },
      { name: 'Tenancy Contract', format: 'Physical/PDF' },
      { name: 'Move-in Report', format: 'PDF' }
    ],
    metrics: { totalRequests: 850, completedRequests: 820, avgCompletionTime: 10, satisfactionScore: 96, revenue: 2125000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-006',
    name: 'Property Management',
    category: 'Property Management',
    shortDescription: 'Full property management services',
    description: 'Comprehensive property management including maintenance, tenant relations, and financial management',
    departmentCode: 'OPS',
    targetAudience: ['landlords', 'investors'],
    pricing: { type: 'percentage', percentage: 8.0 },
    workflow: {
      estimatedDuration: 'Ongoing',
      stages: [
        { order: 1, name: 'Property Onboarding', duration: '5 days', actions: ['Inspection', 'Documentation'] },
        { order: 2, name: 'Tenant Management', duration: 'Ongoing', actions: ['Rent collection', 'Communication'] },
        { order: 3, name: 'Maintenance Coordination', duration: 'As needed', actions: ['Repairs', 'Inspections'] },
        { order: 4, name: 'Financial Reporting', duration: 'Monthly', actions: ['Statements', 'Disbursements'] }
      ]
    },
    requirements: [
      { name: 'Property Title Deed', mandatory: true },
      { name: 'Owner POA (if applicable)', mandatory: false }
    ],
    deliverables: [
      { name: 'Monthly Statements', format: 'PDF' },
      { name: 'Annual Property Report', format: 'PDF' }
    ],
    metrics: { totalRequests: 120, completedRequests: 118, avgCompletionTime: 0, satisfactionScore: 94, revenue: 1440000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-007',
    name: 'Mortgage Advisory',
    category: 'Financial Services',
    shortDescription: 'Expert mortgage and financing solutions',
    description: 'Comprehensive mortgage advisory including bank liaison, documentation, and approval tracking',
    departmentCode: 'FIN',
    targetAudience: ['buyers', 'investors'],
    pricing: { type: 'fixed', amount: 15000 },
    workflow: {
      estimatedDuration: '30 days',
      stages: [
        { order: 1, name: 'Financial Assessment', duration: '2 days', actions: ['Income review', 'Eligibility check'] },
        { order: 2, name: 'Bank Selection', duration: '3 days', actions: ['Rate comparison', 'Bank shortlist'] },
        { order: 3, name: 'Application', duration: '5 days', actions: ['Documentation', 'Submission'] },
        { order: 4, name: 'Approval Process', duration: '15 days', actions: ['Bank processing', 'Valuation'] },
        { order: 5, name: 'Disbursement', duration: '5 days', actions: ['Final approval', 'Fund transfer'] }
      ]
    },
    requirements: [
      { name: 'Salary Certificate', mandatory: true },
      { name: 'Bank Statements (6 months)', mandatory: true },
      { name: 'Emirates ID', mandatory: true }
    ],
    deliverables: [
      { name: 'Pre-approval Letter', format: 'PDF' },
      { name: 'Final Offer Letter', format: 'PDF' },
      { name: 'Mortgage Documents', format: 'Physical' }
    ],
    metrics: { totalRequests: 280, completedRequests: 245, avgCompletionTime: 28, satisfactionScore: 91, revenue: 4200000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-008',
    name: 'Legal Conveyancing',
    category: 'Legal & Compliance',
    shortDescription: 'Property legal services and compliance',
    description: 'Full legal conveyancing including contract review, DLD registration, and compliance verification',
    departmentCode: 'LEGAL',
    targetAudience: ['buyers', 'sellers', 'landlords', 'tenants'],
    pricing: { type: 'fixed', amount: 12000 },
    workflow: {
      estimatedDuration: '21 days',
      stages: [
        { order: 1, name: 'Document Review', duration: '3 days', actions: ['Contract analysis', 'Risk assessment'] },
        { order: 2, name: 'Due Diligence', duration: '5 days', actions: ['Title search', 'Lien verification'] },
        { order: 3, name: 'Contract Finalization', duration: '5 days', actions: ['Amendments', 'Final draft'] },
        { order: 4, name: 'DLD Registration', duration: '5 days', actions: ['Fee payment', 'Registration'] },
        { order: 5, name: 'Completion', duration: '3 days', actions: ['Title issuance', 'File closure'] }
      ]
    },
    requirements: [
      { name: 'Signed SPA', mandatory: true },
      { name: 'Party Identification', mandatory: true },
      { name: 'Payment Receipts', mandatory: true }
    ],
    deliverables: [
      { name: 'Legal Opinion', format: 'PDF' },
      { name: 'Registered Title Deed', format: 'Physical' },
      { name: 'Closing Statement', format: 'PDF' }
    ],
    metrics: { totalRequests: 420, completedRequests: 405, avgCompletionTime: 18, satisfactionScore: 97, revenue: 5040000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-009',
    name: 'Property Marketing',
    category: 'Marketing',
    shortDescription: 'Premium property marketing campaigns',
    description: 'High-end property marketing including photography, virtual tours, and multi-channel campaigns',
    departmentCode: 'MKT',
    targetAudience: ['sellers', 'landlords', 'developers'],
    pricing: { type: 'fixed', amount: 8000 },
    workflow: {
      estimatedDuration: '14 days',
      stages: [
        { order: 1, name: 'Photography Session', duration: '2 days', actions: ['Professional shoot', 'Drone footage'] },
        { order: 2, name: 'Content Creation', duration: '4 days', actions: ['Copywriting', 'Video editing'] },
        { order: 3, name: 'Virtual Tour', duration: '3 days', actions: ['3D scanning', 'Tour creation'] },
        { order: 4, name: 'Campaign Launch', duration: '3 days', actions: ['Portal listing', 'Social media'] },
        { order: 5, name: 'Performance Tracking', duration: 'Ongoing', actions: ['Analytics', 'Optimization'] }
      ]
    },
    requirements: [
      { name: 'Property Access', mandatory: true },
      { name: 'Marketing Authorization', mandatory: true }
    ],
    deliverables: [
      { name: 'Professional Photos', format: 'Digital' },
      { name: 'Virtual Tour Link', format: 'URL' },
      { name: 'Marketing Report', format: 'PDF' }
    ],
    metrics: { totalRequests: 350, completedRequests: 340, avgCompletionTime: 12, satisfactionScore: 93, revenue: 2800000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-010',
    name: 'Property Valuation',
    category: 'Client Services',
    shortDescription: 'Professional property valuation',
    description: 'RERA-certified property valuation for sale, mortgage, or insurance purposes',
    departmentCode: 'OPS',
    targetAudience: ['sellers', 'landlords', 'buyers', 'investors'],
    pricing: { type: 'fixed', amount: 3500 },
    workflow: {
      estimatedDuration: '5 days',
      stages: [
        { order: 1, name: 'Site Inspection', duration: '1 day', actions: ['Property visit', 'Measurement'] },
        { order: 2, name: 'Market Analysis', duration: '2 days', actions: ['Comparable sales', 'Market trends'] },
        { order: 3, name: 'Report Preparation', duration: '2 days', actions: ['Valuation calculation', 'Report writing'] }
      ]
    },
    requirements: [
      { name: 'Title Deed', mandatory: true },
      { name: 'Property Access', mandatory: true }
    ],
    deliverables: [
      { name: 'Valuation Report', format: 'PDF' },
      { name: 'RERA Certificate', format: 'PDF' }
    ],
    metrics: { totalRequests: 680, completedRequests: 670, avgCompletionTime: 4, satisfactionScore: 96, revenue: 2380000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-011',
    name: 'Golden Visa Assistance',
    category: 'Client Services',
    shortDescription: 'UAE Golden Visa property investment route',
    description: 'Complete assistance for obtaining UAE Golden Visa through property investment of AED 2M+',
    departmentCode: 'SALES',
    targetAudience: ['investors', 'buyers'],
    pricing: { type: 'fixed', amount: 20000 },
    workflow: {
      estimatedDuration: '45 days',
      stages: [
        { order: 1, name: 'Eligibility Assessment', duration: '2 days', actions: ['Investment review', 'Criteria check'] },
        { order: 2, name: 'Document Preparation', duration: '7 days', actions: ['Document collection', 'Translation'] },
        { order: 3, name: 'Application Submission', duration: '3 days', actions: ['Online application', 'Fee payment'] },
        { order: 4, name: 'ICP Processing', duration: '21 days', actions: ['Government review', 'Approval wait'] },
        { order: 5, name: 'Visa Stamping', duration: '7 days', actions: ['Medical test', 'Emirates ID'] }
      ]
    },
    requirements: [
      { name: 'Property Title Deed (2M+)', mandatory: true },
      { name: 'Passport', mandatory: true },
      { name: 'Photos', mandatory: true }
    ],
    deliverables: [
      { name: 'Golden Visa', format: 'Physical' },
      { name: 'Emirates ID', format: 'Physical' },
      { name: 'Process Completion Report', format: 'PDF' }
    ],
    metrics: { totalRequests: 95, completedRequests: 88, avgCompletionTime: 40, satisfactionScore: 99, revenue: 1900000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-012',
    name: 'Snagging & Handover',
    category: 'Property Management',
    shortDescription: 'New property inspection services',
    description: 'Professional snagging inspection and handover coordination for new properties',
    departmentCode: 'OPS',
    targetAudience: ['buyers', 'investors'],
    pricing: { type: 'fixed', amount: 2500 },
    workflow: {
      estimatedDuration: '7 days',
      stages: [
        { order: 1, name: 'Pre-Inspection', duration: '1 day', actions: ['Schedule coordination', 'Checklist prep'] },
        { order: 2, name: 'Snagging Inspection', duration: '1 day', actions: ['Full inspection', 'Issue logging'] },
        { order: 3, name: 'Report Generation', duration: '2 days', actions: ['Photo documentation', 'Report creation'] },
        { order: 4, name: 'Developer Follow-up', duration: '3 days', actions: ['Issue submission', 'Resolution tracking'] }
      ]
    },
    requirements: [
      { name: 'Handover Appointment', mandatory: true },
      { name: 'Property Access', mandatory: true }
    ],
    deliverables: [
      { name: 'Snagging Report', format: 'PDF' },
      { name: 'Photo Documentation', format: 'Digital' },
      { name: 'Resolution Tracker', format: 'PDF' }
    ],
    metrics: { totalRequests: 220, completedRequests: 215, avgCompletionTime: 5, satisfactionScore: 95, revenue: 550000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-013',
    name: 'Tenant Screening',
    category: 'Property Rentals',
    shortDescription: 'Comprehensive tenant verification',
    description: 'Thorough tenant screening including background checks, employment verification, and reference checks',
    departmentCode: 'OPS',
    targetAudience: ['landlords'],
    pricing: { type: 'fixed', amount: 1500 },
    workflow: {
      estimatedDuration: '3 days',
      stages: [
        { order: 1, name: 'Document Collection', duration: '1 day', actions: ['ID collection', 'Employment docs'] },
        { order: 2, name: 'Verification', duration: '1 day', actions: ['Employment check', 'Reference calls'] },
        { order: 3, name: 'Report', duration: '1 day', actions: ['Risk assessment', 'Recommendation'] }
      ]
    },
    requirements: [
      { name: 'Applicant Emirates ID', mandatory: true },
      { name: 'Employment Letter', mandatory: true }
    ],
    deliverables: [
      { name: 'Screening Report', format: 'PDF' },
      { name: 'Risk Assessment', format: 'PDF' }
    ],
    metrics: { totalRequests: 450, completedRequests: 445, avgCompletionTime: 2, satisfactionScore: 94, revenue: 675000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-014',
    name: 'KYC & AML Compliance',
    category: 'Legal & Compliance',
    shortDescription: 'Regulatory compliance verification',
    description: 'Complete KYC and AML compliance services as per UAE Central Bank and RERA requirements',
    departmentCode: 'COMP',
    targetAudience: ['buyers', 'sellers', 'investors', 'all'],
    pricing: { type: 'fixed', amount: 5000 },
    workflow: {
      estimatedDuration: '5 days',
      stages: [
        { order: 1, name: 'Document Collection', duration: '1 day', actions: ['ID verification', 'Address proof'] },
        { order: 2, name: 'Background Screening', duration: '2 days', actions: ['PEP check', 'Sanctions screening'] },
        { order: 3, name: 'Source of Funds', duration: '1 day', actions: ['Fund verification', 'Bank confirmation'] },
        { order: 4, name: 'Compliance Report', duration: '1 day', actions: ['Risk rating', 'Clearance issuance'] }
      ]
    },
    requirements: [
      { name: 'Emirates ID / Passport', mandatory: true },
      { name: 'Bank Statements', mandatory: true },
      { name: 'Source of Funds Declaration', mandatory: true }
    ],
    deliverables: [
      { name: 'KYC Report', format: 'PDF' },
      { name: 'AML Clearance', format: 'PDF' },
      { name: 'Risk Rating Certificate', format: 'PDF' }
    ],
    metrics: { totalRequests: 380, completedRequests: 375, avgCompletionTime: 4, satisfactionScore: 98, revenue: 1900000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-015',
    name: 'Rental Yield Analysis',
    category: 'Financial Services',
    shortDescription: 'Investment return calculations',
    description: 'Detailed rental yield and investment return analysis for property investment decisions',
    departmentCode: 'FIN',
    targetAudience: ['investors', 'landlords'],
    pricing: { type: 'fixed', amount: 4000 },
    workflow: {
      estimatedDuration: '5 days',
      stages: [
        { order: 1, name: 'Property Assessment', duration: '1 day', actions: ['Property details', 'Location analysis'] },
        { order: 2, name: 'Market Research', duration: '2 days', actions: ['Rental comparisons', 'Occupancy rates'] },
        { order: 3, name: 'Financial Modeling', duration: '1 day', actions: ['Yield calculation', 'ROI projections'] },
        { order: 4, name: 'Report Delivery', duration: '1 day', actions: ['Report preparation', 'Presentation'] }
      ]
    },
    requirements: [
      { name: 'Property Details', mandatory: true },
      { name: 'Purchase Price / Value', mandatory: true }
    ],
    deliverables: [
      { name: 'Yield Analysis Report', format: 'PDF' },
      { name: 'Investment Recommendation', format: 'PDF' }
    ],
    metrics: { totalRequests: 240, completedRequests: 235, avgCompletionTime: 4, satisfactionScore: 93, revenue: 960000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-016',
    name: 'Maintenance Coordination',
    category: 'Property Management',
    shortDescription: 'Property maintenance services',
    description: 'Complete maintenance coordination including contractor management and quality assurance',
    departmentCode: 'OPS',
    targetAudience: ['landlords', 'tenants'],
    pricing: { type: 'percentage', percentage: 10.0 },
    workflow: {
      estimatedDuration: 'As needed',
      stages: [
        { order: 1, name: 'Request Logging', duration: '1 hour', actions: ['Issue recording', 'Prioritization'] },
        { order: 2, name: 'Contractor Dispatch', duration: '24 hours', actions: ['Vendor selection', 'Scheduling'] },
        { order: 3, name: 'Work Execution', duration: 'Variable', actions: ['Supervision', 'Quality check'] },
        { order: 4, name: 'Completion', duration: '1 day', actions: ['Final inspection', 'Invoice processing'] }
      ]
    },
    requirements: [
      { name: 'Property Access', mandatory: true },
      { name: 'Issue Description', mandatory: true }
    ],
    deliverables: [
      { name: 'Work Completion Report', format: 'PDF' },
      { name: 'Invoice', format: 'PDF' }
    ],
    metrics: { totalRequests: 1200, completedRequests: 1150, avgCompletionTime: 3, satisfactionScore: 91, revenue: 360000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-017',
    name: 'Interior Design Consultation',
    category: 'Client Services',
    shortDescription: 'Property interior design services',
    description: 'Professional interior design consultation for property staging or renovation',
    departmentCode: 'MKT',
    targetAudience: ['buyers', 'landlords', 'sellers'],
    pricing: { type: 'fixed', amount: 10000 },
    workflow: {
      estimatedDuration: '21 days',
      stages: [
        { order: 1, name: 'Initial Consultation', duration: '2 days', actions: ['Style assessment', 'Budget planning'] },
        { order: 2, name: 'Concept Development', duration: '5 days', actions: ['Mood boards', '3D visualization'] },
        { order: 3, name: 'Sourcing', duration: '7 days', actions: ['Furniture selection', 'Vendor coordination'] },
        { order: 4, name: 'Implementation', duration: '7 days', actions: ['Installation', 'Styling'] }
      ]
    },
    requirements: [
      { name: 'Property Access', mandatory: true },
      { name: 'Design Brief', mandatory: true }
    ],
    deliverables: [
      { name: 'Design Concept', format: 'PDF' },
      { name: '3D Renders', format: 'Digital' },
      { name: 'Shopping List', format: 'PDF' }
    ],
    metrics: { totalRequests: 85, completedRequests: 80, avgCompletionTime: 18, satisfactionScore: 96, revenue: 850000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-018',
    name: 'Relocation Assistance',
    category: 'Client Services',
    shortDescription: 'Complete relocation services',
    description: 'End-to-end relocation assistance including moving, utility setup, and area orientation',
    departmentCode: 'OPS',
    targetAudience: ['buyers', 'tenants'],
    pricing: { type: 'fixed', amount: 5000 },
    workflow: {
      estimatedDuration: '14 days',
      stages: [
        { order: 1, name: 'Planning', duration: '2 days', actions: ['Moving assessment', 'Schedule planning'] },
        { order: 2, name: 'Utility Setup', duration: '5 days', actions: ['DEWA', 'Internet', 'Cooling'] },
        { order: 3, name: 'Moving Day', duration: '1 day', actions: ['Coordination', 'Supervision'] },
        { order: 4, name: 'Area Orientation', duration: '2 days', actions: ['Neighborhood tour', 'Essential services'] }
      ]
    },
    requirements: [
      { name: 'Tenancy Contract / Title Deed', mandatory: true },
      { name: 'Emirates ID', mandatory: true }
    ],
    deliverables: [
      { name: 'Utility Confirmation', format: 'PDF' },
      { name: 'Area Guide', format: 'PDF' },
      { name: 'Welcome Pack', format: 'Physical' }
    ],
    metrics: { totalRequests: 180, completedRequests: 175, avgCompletionTime: 12, satisfactionScore: 94, revenue: 900000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-019',
    name: 'Holiday Home Management',
    category: 'Property Rentals',
    shortDescription: 'Short-term rental management',
    description: 'Complete holiday home management including DTCM licensing, guest management, and revenue optimization',
    departmentCode: 'OPS',
    targetAudience: ['landlords', 'investors'],
    pricing: { type: 'percentage', percentage: 20.0 },
    workflow: {
      estimatedDuration: 'Ongoing',
      stages: [
        { order: 1, name: 'DTCM Licensing', duration: '14 days', actions: ['Application', 'Approval'] },
        { order: 2, name: 'Platform Setup', duration: '7 days', actions: ['Airbnb', 'Booking.com', 'Photos'] },
        { order: 3, name: 'Operations', duration: 'Ongoing', actions: ['Guest management', 'Cleaning', 'Maintenance'] },
        { order: 4, name: 'Reporting', duration: 'Monthly', actions: ['Revenue report', 'Performance analysis'] }
      ]
    },
    requirements: [
      { name: 'Title Deed', mandatory: true },
      { name: 'Owner Emirates ID', mandatory: true },
      { name: 'Furnished Property', mandatory: true }
    ],
    deliverables: [
      { name: 'DTCM License', format: 'Physical' },
      { name: 'Monthly Revenue Report', format: 'PDF' },
      { name: 'Guest Reviews Summary', format: 'PDF' }
    ],
    metrics: { totalRequests: 65, completedRequests: 62, avgCompletionTime: 0, satisfactionScore: 92, revenue: 780000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-020',
    name: 'Commercial Leasing',
    category: 'Property Rentals',
    shortDescription: 'Commercial property leasing services',
    description: 'Professional commercial property leasing including office, retail, and warehouse spaces',
    departmentCode: 'SALES',
    targetAudience: ['landlords', 'tenants', 'investors'],
    pricing: { type: 'percentage', percentage: 5.0 },
    workflow: {
      estimatedDuration: '30 days',
      stages: [
        { order: 1, name: 'Requirements Analysis', duration: '3 days', actions: ['Space needs', 'Budget assessment'] },
        { order: 2, name: 'Property Search', duration: '7 days', actions: ['Market search', 'Shortlisting'] },
        { order: 3, name: 'Viewings & Negotiation', duration: '10 days', actions: ['Site visits', 'Terms negotiation'] },
        { order: 4, name: 'Contract & Handover', duration: '10 days', actions: ['Legal review', 'Contract signing', 'Fit-out'] }
      ]
    },
    requirements: [
      { name: 'Trade License', mandatory: true },
      { name: 'Company Emirates ID', mandatory: true }
    ],
    deliverables: [
      { name: 'Commercial Lease Agreement', format: 'Physical' },
      { name: 'Ejari Certificate', format: 'PDF' }
    ],
    metrics: { totalRequests: 140, completedRequests: 125, avgCompletionTime: 25, satisfactionScore: 90, revenue: 1750000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-021',
    name: 'Portfolio Management',
    category: 'Financial Services',
    shortDescription: 'Multi-property portfolio services',
    description: 'Comprehensive portfolio management for investors with multiple properties',
    departmentCode: 'FIN',
    targetAudience: ['investors'],
    pricing: { type: 'percentage', percentage: 1.0 },
    workflow: {
      estimatedDuration: 'Ongoing',
      stages: [
        { order: 1, name: 'Portfolio Assessment', duration: '7 days', actions: ['Asset valuation', 'Performance review'] },
        { order: 2, name: 'Strategy Development', duration: '5 days', actions: ['Optimization plan', 'Risk assessment'] },
        { order: 3, name: 'Implementation', duration: 'Ongoing', actions: ['Buy/Sell recommendations', 'Rebalancing'] },
        { order: 4, name: 'Reporting', duration: 'Quarterly', actions: ['Performance reports', 'Market updates'] }
      ]
    },
    requirements: [
      { name: 'Portfolio Details', mandatory: true },
      { name: 'Investment Goals', mandatory: true }
    ],
    deliverables: [
      { name: 'Portfolio Strategy', format: 'PDF' },
      { name: 'Quarterly Reports', format: 'PDF' },
      { name: 'Tax Documentation', format: 'PDF' }
    ],
    metrics: { totalRequests: 35, completedRequests: 34, avgCompletionTime: 0, satisfactionScore: 97, revenue: 850000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-022',
    name: 'Developer Project Sales',
    category: 'Property Sales',
    shortDescription: 'Off-plan project sales',
    description: 'Exclusive sales representation for developer off-plan projects',
    departmentCode: 'SALES',
    targetAudience: ['developers', 'investors', 'buyers'],
    pricing: { type: 'percentage', percentage: 3.0 },
    workflow: {
      estimatedDuration: 'Project duration',
      stages: [
        { order: 1, name: 'Project Onboarding', duration: '14 days', actions: ['Training', 'Marketing materials'] },
        { order: 2, name: 'Lead Generation', duration: 'Ongoing', actions: ['Marketing', 'Roadshows'] },
        { order: 3, name: 'Sales', duration: 'Ongoing', actions: ['Presentations', 'Bookings'] },
        { order: 4, name: 'After-sales', duration: 'Ongoing', actions: ['Progress updates', 'Handover coordination'] }
      ]
    },
    requirements: [
      { name: 'Exclusive Agreement', mandatory: true },
      { name: 'Marketing Materials', mandatory: true }
    ],
    deliverables: [
      { name: 'Sales Reports', format: 'PDF' },
      { name: 'Marketing Analytics', format: 'PDF' }
    ],
    metrics: { totalRequests: 8, completedRequests: 6, avgCompletionTime: 0, satisfactionScore: 94, revenue: 12000000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-023',
    name: 'Property Insurance',
    category: 'Financial Services',
    shortDescription: 'Property insurance advisory',
    description: 'Insurance advisory and procurement for property owners and tenants',
    departmentCode: 'FIN',
    targetAudience: ['landlords', 'tenants', 'buyers'],
    pricing: { type: 'percentage', percentage: 5.0 },
    workflow: {
      estimatedDuration: '7 days',
      stages: [
        { order: 1, name: 'Needs Assessment', duration: '1 day', actions: ['Coverage requirements', 'Risk profile'] },
        { order: 2, name: 'Quote Comparison', duration: '3 days', actions: ['Multiple quotes', 'Coverage analysis'] },
        { order: 3, name: 'Policy Procurement', duration: '3 days', actions: ['Documentation', 'Payment', 'Policy issuance'] }
      ]
    },
    requirements: [
      { name: 'Property Details', mandatory: true },
      { name: 'Owner/Tenant ID', mandatory: true }
    ],
    deliverables: [
      { name: 'Insurance Policy', format: 'PDF' },
      { name: 'Coverage Summary', format: 'PDF' }
    ],
    metrics: { totalRequests: 320, completedRequests: 310, avgCompletionTime: 5, satisfactionScore: 92, revenue: 320000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-024',
    name: 'Will & Succession Planning',
    category: 'Legal & Compliance',
    shortDescription: 'Property inheritance services',
    description: 'DIFC Wills and succession planning for property owners',
    departmentCode: 'LEGAL',
    targetAudience: ['landlords', 'investors', 'buyers'],
    pricing: { type: 'fixed', amount: 15000 },
    workflow: {
      estimatedDuration: '30 days',
      stages: [
        { order: 1, name: 'Consultation', duration: '2 days', actions: ['Asset review', 'Beneficiary discussion'] },
        { order: 2, name: 'Will Drafting', duration: '7 days', actions: ['Legal drafting', 'Review'] },
        { order: 3, name: 'DIFC Registration', duration: '14 days', actions: ['Submission', 'Witnessing'] },
        { order: 4, name: 'Completion', duration: '7 days', actions: ['Registration confirmation', 'Secure storage'] }
      ]
    },
    requirements: [
      { name: 'Property Title Deeds', mandatory: true },
      { name: 'Passport', mandatory: true },
      { name: 'Beneficiary Details', mandatory: true }
    ],
    deliverables: [
      { name: 'Registered Will', format: 'Physical' },
      { name: 'Registration Certificate', format: 'PDF' }
    ],
    metrics: { totalRequests: 75, completedRequests: 72, avgCompletionTime: 25, satisfactionScore: 99, revenue: 1125000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-025',
    name: 'Dispute Resolution',
    category: 'Legal & Compliance',
    shortDescription: 'Property dispute mediation',
    description: 'Mediation and dispute resolution services for landlord-tenant and buyer-seller conflicts',
    departmentCode: 'LEGAL',
    targetAudience: ['landlords', 'tenants', 'buyers', 'sellers'],
    pricing: { type: 'hourly', amount: 1000 },
    workflow: {
      estimatedDuration: 'Variable',
      stages: [
        { order: 1, name: 'Case Assessment', duration: '2 days', actions: ['Document review', 'Claim analysis'] },
        { order: 2, name: 'Mediation', duration: 'Variable', actions: ['Negotiation', 'Settlement attempts'] },
        { order: 3, name: 'Resolution', duration: 'Variable', actions: ['Agreement drafting', 'Execution'] }
      ]
    },
    requirements: [
      { name: 'Dispute Details', mandatory: true },
      { name: 'Supporting Documents', mandatory: true }
    ],
    deliverables: [
      { name: 'Resolution Agreement', format: 'PDF' },
      { name: 'Case Summary', format: 'PDF' }
    ],
    metrics: { totalRequests: 45, completedRequests: 38, avgCompletionTime: 30, satisfactionScore: 85, revenue: 380000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-026',
    name: 'Market Intelligence Reports',
    category: 'Client Services',
    shortDescription: 'Custom market research',
    description: 'Tailored market intelligence reports for investors and developers',
    departmentCode: 'INT',
    targetAudience: ['investors', 'developers'],
    pricing: { type: 'fixed', amount: 25000 },
    workflow: {
      estimatedDuration: '21 days',
      stages: [
        { order: 1, name: 'Brief Definition', duration: '2 days', actions: ['Scope definition', 'Data requirements'] },
        { order: 2, name: 'Data Collection', duration: '7 days', actions: ['Primary research', 'Secondary research'] },
        { order: 3, name: 'Analysis', duration: '7 days', actions: ['Data analysis', 'Trend identification'] },
        { order: 4, name: 'Report Delivery', duration: '5 days', actions: ['Report writing', 'Presentation'] }
      ]
    },
    requirements: [
      { name: 'Research Brief', mandatory: true },
      { name: 'Geographic Scope', mandatory: true }
    ],
    deliverables: [
      { name: 'Market Intelligence Report', format: 'PDF' },
      { name: 'Data Dashboard Access', format: 'Digital' },
      { name: 'Executive Presentation', format: 'PPT' }
    ],
    metrics: { totalRequests: 28, completedRequests: 26, avgCompletionTime: 18, satisfactionScore: 96, revenue: 700000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-027',
    name: 'Rent Collection',
    category: 'Property Management',
    shortDescription: 'Automated rent collection',
    description: 'Systematic rent collection and payment tracking for property owners',
    departmentCode: 'FIN',
    targetAudience: ['landlords'],
    pricing: { type: 'percentage', percentage: 3.0 },
    workflow: {
      estimatedDuration: 'Ongoing',
      stages: [
        { order: 1, name: 'Setup', duration: '3 days', actions: ['Payment schedule', 'Tenant onboarding'] },
        { order: 2, name: 'Collection', duration: 'Monthly', actions: ['Reminders', 'Payment processing'] },
        { order: 3, name: 'Reporting', duration: 'Monthly', actions: ['Statement generation', 'Disbursement'] }
      ]
    },
    requirements: [
      { name: 'Tenancy Contract', mandatory: true },
      { name: 'Bank Details', mandatory: true }
    ],
    deliverables: [
      { name: 'Monthly Statement', format: 'PDF' },
      { name: 'Annual Summary', format: 'PDF' }
    ],
    metrics: { totalRequests: 280, completedRequests: 275, avgCompletionTime: 0, satisfactionScore: 94, revenue: 504000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-028',
    name: 'Ejari Registration',
    category: 'Legal & Compliance',
    shortDescription: 'Official tenancy registration',
    description: 'Complete Ejari registration service for tenancy contracts',
    departmentCode: 'OPS',
    targetAudience: ['landlords', 'tenants'],
    pricing: { type: 'fixed', amount: 500 },
    workflow: {
      estimatedDuration: '2 days',
      stages: [
        { order: 1, name: 'Document Collection', duration: '1 day', actions: ['Contract copy', 'ID copies'] },
        { order: 2, name: 'Registration', duration: '1 day', actions: ['RERA submission', 'Certificate issuance'] }
      ]
    },
    requirements: [
      { name: 'Signed Tenancy Contract', mandatory: true },
      { name: 'Landlord Emirates ID', mandatory: true },
      { name: 'Tenant Emirates ID', mandatory: true }
    ],
    deliverables: [
      { name: 'Ejari Certificate', format: 'PDF' }
    ],
    metrics: { totalRequests: 1500, completedRequests: 1490, avgCompletionTime: 1, satisfactionScore: 98, revenue: 750000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-029',
    name: 'Property Photography',
    category: 'Marketing',
    shortDescription: 'Professional property photography',
    description: 'High-quality professional photography and videography for property listings',
    departmentCode: 'MKT',
    targetAudience: ['sellers', 'landlords'],
    pricing: { type: 'fixed', amount: 2500 },
    workflow: {
      estimatedDuration: '3 days',
      stages: [
        { order: 1, name: 'Scheduling', duration: '1 day', actions: ['Appointment booking', 'Preparation tips'] },
        { order: 2, name: 'Photo Shoot', duration: '1 day', actions: ['Interior photos', 'Exterior photos', 'Drone shots'] },
        { order: 3, name: 'Post-processing', duration: '1 day', actions: ['Editing', 'Delivery'] }
      ]
    },
    requirements: [
      { name: 'Property Access', mandatory: true },
      { name: 'Prepared Property', mandatory: false }
    ],
    deliverables: [
      { name: 'HD Photos (20+)', format: 'Digital' },
      { name: 'Drone Footage', format: 'Video' },
      { name: 'Floor Plan', format: 'PDF' }
    ],
    metrics: { totalRequests: 480, completedRequests: 475, avgCompletionTime: 2, satisfactionScore: 95, revenue: 1200000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-030',
    name: 'Virtual Tour Creation',
    category: 'Marketing',
    shortDescription: '3D virtual property tours',
    description: 'Immersive 3D virtual tours using Matterport technology',
    departmentCode: 'MKT',
    targetAudience: ['sellers', 'landlords', 'developers'],
    pricing: { type: 'fixed', amount: 4000 },
    workflow: {
      estimatedDuration: '5 days',
      stages: [
        { order: 1, name: '3D Scanning', duration: '1 day', actions: ['Property scan', 'Data capture'] },
        { order: 2, name: 'Processing', duration: '2 days', actions: ['Cloud processing', 'Model creation'] },
        { order: 3, name: 'Enhancement', duration: '2 days', actions: ['Hotspots', 'Information tags', 'Branding'] }
      ]
    },
    requirements: [
      { name: 'Property Access', mandatory: true },
      { name: 'Staged Property', mandatory: false }
    ],
    deliverables: [
      { name: 'Matterport Tour Link', format: 'URL' },
      { name: 'Embedded Player', format: 'HTML' },
      { name: 'Floor Plan', format: 'PDF' }
    ],
    metrics: { totalRequests: 180, completedRequests: 175, avgCompletionTime: 4, satisfactionScore: 97, revenue: 720000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-031',
    name: 'Social Media Marketing',
    category: 'Marketing',
    shortDescription: 'Property social media campaigns',
    description: 'Targeted social media marketing campaigns for property promotion',
    departmentCode: 'MKT',
    targetAudience: ['sellers', 'landlords', 'developers'],
    pricing: { type: 'fixed', amount: 6000 },
    workflow: {
      estimatedDuration: '30 days',
      stages: [
        { order: 1, name: 'Strategy', duration: '3 days', actions: ['Target audience', 'Content plan'] },
        { order: 2, name: 'Content Creation', duration: '5 days', actions: ['Graphics', 'Video content'] },
        { order: 3, name: 'Campaign Launch', duration: '7 days', actions: ['Ads setup', 'Initial optimization'] },
        { order: 4, name: 'Optimization', duration: '15 days', actions: ['A/B testing', 'Performance tracking'] }
      ]
    },
    requirements: [
      { name: 'Property Photos', mandatory: true },
      { name: 'Marketing Budget', mandatory: true }
    ],
    deliverables: [
      { name: 'Campaign Report', format: 'PDF' },
      { name: 'Lead Report', format: 'Excel' }
    ],
    metrics: { totalRequests: 120, completedRequests: 115, avgCompletionTime: 28, satisfactionScore: 88, revenue: 720000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-032',
    name: 'Move-in/Move-out Inspection',
    category: 'Property Management',
    shortDescription: 'Property condition reports',
    description: 'Detailed property inspection reports for move-in and move-out',
    departmentCode: 'OPS',
    targetAudience: ['landlords', 'tenants'],
    pricing: { type: 'fixed', amount: 800 },
    workflow: {
      estimatedDuration: '2 days',
      stages: [
        { order: 1, name: 'Inspection', duration: '1 day', actions: ['Full property check', 'Photo documentation'] },
        { order: 2, name: 'Report', duration: '1 day', actions: ['Condition report', 'Recommendations'] }
      ]
    },
    requirements: [
      { name: 'Property Access', mandatory: true },
      { name: 'Both Parties Present', mandatory: false }
    ],
    deliverables: [
      { name: 'Inspection Report', format: 'PDF' },
      { name: 'Photo Documentation', format: 'Digital' }
    ],
    metrics: { totalRequests: 650, completedRequests: 645, avgCompletionTime: 1, satisfactionScore: 94, revenue: 520000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-033',
    name: 'Lease Renewal',
    category: 'Property Rentals',
    shortDescription: 'Tenancy renewal services',
    description: 'Complete lease renewal service including negotiation and Ejari update',
    departmentCode: 'OPS',
    targetAudience: ['landlords', 'tenants'],
    pricing: { type: 'fixed', amount: 1500 },
    workflow: {
      estimatedDuration: '14 days',
      stages: [
        { order: 1, name: 'Renewal Notice', duration: '3 days', actions: ['Tenant communication', 'Terms proposal'] },
        { order: 2, name: 'Negotiation', duration: '7 days', actions: ['Rent discussion', 'Terms finalization'] },
        { order: 3, name: 'Documentation', duration: '4 days', actions: ['Addendum signing', 'Ejari update'] }
      ]
    },
    requirements: [
      { name: 'Current Tenancy Contract', mandatory: true },
      { name: 'Renewal Intent', mandatory: true }
    ],
    deliverables: [
      { name: 'Renewal Addendum', format: 'PDF' },
      { name: 'Updated Ejari', format: 'PDF' }
    ],
    metrics: { totalRequests: 420, completedRequests: 410, avgCompletionTime: 10, satisfactionScore: 93, revenue: 630000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-034',
    name: 'Eviction Support',
    category: 'Legal & Compliance',
    shortDescription: 'Legal eviction assistance',
    description: 'Legal support for property eviction cases through RERA and RDC',
    departmentCode: 'LEGAL',
    targetAudience: ['landlords'],
    pricing: { type: 'fixed', amount: 8000 },
    workflow: {
      estimatedDuration: '90 days',
      stages: [
        { order: 1, name: 'Case Assessment', duration: '5 days', actions: ['Legal review', 'Evidence collection'] },
        { order: 2, name: 'Notice Period', duration: '30 days', actions: ['Legal notice', 'Documentation'] },
        { order: 3, name: 'RDC Filing', duration: '14 days', actions: ['Case filing', 'Hearing scheduling'] },
        { order: 4, name: 'Resolution', duration: '41 days', actions: ['Court proceedings', 'Execution'] }
      ]
    },
    requirements: [
      { name: 'Tenancy Contract', mandatory: true },
      { name: 'Evidence of Breach', mandatory: true }
    ],
    deliverables: [
      { name: 'Legal Opinion', format: 'PDF' },
      { name: 'Court Order', format: 'Physical' },
      { name: 'Eviction Execution', format: 'Physical' }
    ],
    metrics: { totalRequests: 25, completedRequests: 20, avgCompletionTime: 75, satisfactionScore: 82, revenue: 200000 },
    status: 'active'
  },
  {
    code: 'WC-SVC-035',
    name: 'API Integration Services',
    category: 'Technology',
    shortDescription: 'Property tech integration',
    description: 'Custom API integrations for property portals and management systems',
    departmentCode: 'TECH',
    targetAudience: ['developers', 'investors'],
    pricing: { type: 'custom', details: 'Quote-based' },
    workflow: {
      estimatedDuration: '30-90 days',
      stages: [
        { order: 1, name: 'Requirements', duration: '5 days', actions: ['Scope definition', 'Technical assessment'] },
        { order: 2, name: 'Development', duration: 'Variable', actions: ['API development', 'Integration'] },
        { order: 3, name: 'Testing', duration: '7 days', actions: ['QA testing', 'UAT'] },
        { order: 4, name: 'Deployment', duration: '3 days', actions: ['Go-live', 'Documentation'] }
      ]
    },
    requirements: [
      { name: 'Technical Requirements', mandatory: true },
      { name: 'API Access', mandatory: true }
    ],
    deliverables: [
      { name: 'API Documentation', format: 'Digital' },
      { name: 'Integration Guide', format: 'PDF' },
      { name: 'Support SLA', format: 'PDF' }
    ],
    metrics: { totalRequests: 12, completedRequests: 10, avgCompletionTime: 45, satisfactionScore: 94, revenue: 600000 },
    status: 'active'
  }
];
