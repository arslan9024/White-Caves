export const COMPANY_SERVICES = {
  sales: [
    {
      id: 'svc-1',
      name: 'Off-Plan Purchase',
      category: 'sales',
      description: 'Purchase new development properties directly from developers with flexible payment plans',
      icon: '🏗️',
      status: 'active',
      avgDuration: '30-60 days',
      avgValue: 'AED 2.5M',
      monthlyVolume: 45,
      workflow: ['research', 'selection', 'booking', 'payment_plan', 'handover'],
      assistants: ['sophia', 'atlas'],
      stages: [
        { id: 'research', name: 'Research', icon: '🔍', duration: '3-5 days', actions: ['Market analysis', 'Developer review', 'Project comparison'] },
        { id: 'selection', name: 'Selection', icon: '🏗️', duration: '5-7 days', actions: ['Unit selection', 'Floor plan review', 'Price negotiation'] },
        { id: 'booking', name: 'Booking', icon: '📝', duration: '1-2 days', actions: ['Reservation form', 'Initial deposit', 'Document collection'] },
        { id: 'payment_plan', name: 'Payment Plan', icon: '💳', duration: '1-3 days', actions: ['Plan selection', 'Payment schedule', 'Contract signing'] },
        { id: 'handover', name: 'Handover', icon: '🔑', duration: 'At completion', actions: ['Inspection', 'Snagging', 'Key collection'] }
      ]
    },
    {
      id: 'svc-2',
      name: 'Secondary Market Sale',
      category: 'sales',
      description: 'Buy or sell existing properties in the secondary market',
      icon: '🏠',
      status: 'active',
      avgDuration: '45-90 days',
      avgValue: 'AED 3.2M',
      monthlyVolume: 32,
      workflow: ['valuation', 'listing', 'marketing', 'viewing', 'negotiation', 'closing'],
      assistants: ['sophia', 'clara'],
      stages: [
        { id: 'valuation', name: 'Valuation', icon: '📊', duration: '2-3 days', actions: ['Property inspection', 'Market comparison', 'Price recommendation'] },
        { id: 'listing', name: 'Listing', icon: '📋', duration: '1-2 days', actions: ['Photo shoot', 'Description writing', 'Portal upload'] },
        { id: 'marketing', name: 'Marketing', icon: '📣', duration: 'Ongoing', actions: ['Portal featuring', 'Social media', 'Email campaigns'] },
        { id: 'viewing', name: 'Viewing', icon: '👁️', duration: 'Per request', actions: ['Schedule viewing', 'Property tour', 'Feedback collection'] },
        { id: 'negotiation', name: 'Negotiation', icon: '🤝', duration: '3-7 days', actions: ['Offer presentation', 'Counter offers', 'Terms agreement'] },
        { id: 'closing', name: 'Closing', icon: '✅', duration: '7-14 days', actions: ['Contract signing', 'DLD transfer', 'Payment processing'] }
      ]
    },
    {
      id: 'svc-3',
      name: 'Property Selling',
      category: 'sales',
      description: 'Full-service property selling with maximum value optimization',
      icon: '📈',
      status: 'active',
      avgDuration: '60-120 days',
      avgValue: 'AED 4.1M',
      monthlyVolume: 28,
      workflow: ['valuation', 'documentation', 'marketing', 'buyer_match', 'negotiation', 'transfer'],
      assistants: ['sophia', 'olivia'],
      stages: [
        { id: 'valuation', name: 'Valuation', icon: '💰', duration: '2-3 days', actions: ['Expert assessment', 'Market analysis', 'Pricing strategy'] },
        { id: 'documentation', name: 'Documentation', icon: '📁', duration: '3-5 days', actions: ['Title deed', 'NOC collection', 'Legal clearance'] },
        { id: 'marketing', name: 'Marketing', icon: '📣', duration: 'Ongoing', actions: ['Professional photos', 'Virtual tour', 'Premium listing'] },
        { id: 'buyer_match', name: 'Buyer Match', icon: '🎯', duration: 'Ongoing', actions: ['Lead qualification', 'Buyer screening', 'Interest matching'] },
        { id: 'negotiation', name: 'Negotiation', icon: '🤝', duration: '5-10 days', actions: ['Offer review', 'Price negotiation', 'Terms finalization'] },
        { id: 'transfer', name: 'Transfer', icon: '🔑', duration: '7-14 days', actions: ['DLD appointment', 'Fund transfer', 'Handover'] }
      ]
    },
    {
      id: 'svc-4',
      name: 'Luxury Property Sales',
      category: 'sales',
      description: 'White-glove service for ultra-luxury properties above AED 10M',
      icon: '👑',
      status: 'active',
      avgDuration: '90-180 days',
      avgValue: 'AED 18M',
      monthlyVolume: 8,
      workflow: ['vip_intro', 'private_viewing', 'custom_terms', 'white_glove_closing'],
      assistants: ['kairos', 'sophia'],
      stages: [
        { id: 'vip_intro', name: 'VIP Introduction', icon: '🎩', duration: '1-3 days', actions: ['Personal consultation', 'Lifestyle assessment', 'Portfolio presentation'] },
        { id: 'private_viewing', name: 'Private Viewing', icon: '🏰', duration: 'By appointment', actions: ['Exclusive access', 'Champagne tour', 'Privacy guaranteed'] },
        { id: 'custom_terms', name: 'Custom Terms', icon: '📜', duration: '7-14 days', actions: ['Bespoke negotiation', 'Special conditions', 'Legal customization'] },
        { id: 'white_glove_closing', name: 'White Glove Closing', icon: '🤵', duration: '14-30 days', actions: ['Concierge service', 'Full coordination', 'VIP handover'] }
      ]
    },
    {
      id: 'svc-5',
      name: 'Investment Advisory',
      category: 'sales',
      description: 'Strategic property investment guidance and portfolio management',
      icon: '📊',
      status: 'active',
      avgDuration: 'Ongoing',
      avgValue: 'AED 5M+',
      monthlyVolume: 15,
      workflow: ['consultation', 'portfolio_analysis', 'roi_modeling', 'recommendation'],
      assistants: ['maven', 'cipher'],
      stages: [
        { id: 'consultation', name: 'Consultation', icon: '💼', duration: '1-2 hours', actions: ['Goals assessment', 'Risk profiling', 'Budget planning'] },
        { id: 'portfolio_analysis', name: 'Portfolio Analysis', icon: '📈', duration: '3-5 days', actions: ['Current holdings', 'Performance review', 'Gap analysis'] },
        { id: 'roi_modeling', name: 'ROI Modeling', icon: '🧮', duration: '2-3 days', actions: ['Yield projections', 'Capital appreciation', 'Scenario analysis'] },
        { id: 'recommendation', name: 'Recommendation', icon: '💡', duration: '1-2 days', actions: ['Property shortlist', 'Investment memo', 'Action plan'] }
      ]
    },
    {
      id: 'svc-6',
      name: 'Developer Partnership',
      category: 'sales',
      description: 'Establish exclusive inventory partnerships with premier developers',
      icon: '🤝',
      status: 'active',
      avgDuration: '30-60 days',
      avgValue: 'Commission based',
      monthlyVolume: 3,
      workflow: ['contact', 'negotiation', 'agreement', 'inventory_access', 'commission_setup'],
      assistants: ['atlas', 'zoe'],
      stages: [
        { id: 'contact', name: 'Contact', icon: '📞', duration: '1-2 weeks', actions: ['Developer outreach', 'Initial meeting', 'Proposal presentation'] },
        { id: 'negotiation', name: 'Negotiation', icon: '🤝', duration: '2-4 weeks', actions: ['Terms discussion', 'Commission rates', 'Exclusivity terms'] },
        { id: 'agreement', name: 'Agreement', icon: '📝', duration: '1 week', actions: ['Contract drafting', 'Legal review', 'Signing'] },
        { id: 'inventory_access', name: 'Inventory Access', icon: '🗄️', duration: '3-5 days', actions: ['System integration', 'Unit allocation', 'Training'] },
        { id: 'commission_setup', name: 'Commission Setup', icon: '💰', duration: '1-2 days', actions: ['Rate configuration', 'Payment terms', 'Reporting setup'] }
      ]
    },
    {
      id: 'svc-7',
      name: 'Property Valuation',
      category: 'sales',
      description: 'Professional property valuation and market analysis',
      icon: '🔍',
      status: 'active',
      avgDuration: '3-5 days',
      avgValue: 'Service fee',
      monthlyVolume: 85,
      workflow: ['inspection', 'market_analysis', 'comparable_study', 'report'],
      assistants: ['cipher', 'mary'],
      stages: [
        { id: 'inspection', name: 'Inspection', icon: '🏠', duration: '1-2 hours', actions: ['Physical assessment', 'Condition rating', 'Photo documentation'] },
        { id: 'market_analysis', name: 'Market Analysis', icon: '📊', duration: '1-2 days', actions: ['Area trends', 'Price movements', 'Demand analysis'] },
        { id: 'comparable_study', name: 'Comparable Study', icon: '⚖️', duration: '1 day', actions: ['Similar properties', 'Recent sales', 'Price adjustments'] },
        { id: 'report', name: 'Report', icon: '📄', duration: '1 day', actions: ['Valuation report', 'Price recommendation', 'Market insights'] }
      ]
    },
    {
      id: 'svc-8',
      name: 'Buyer Consultation',
      category: 'sales',
      description: 'Personalized buyer guidance and property matching',
      icon: '🎯',
      status: 'active',
      avgDuration: '1-2 weeks',
      avgValue: 'Included',
      monthlyVolume: 120,
      workflow: ['needs_analysis', 'budget_planning', 'property_matching', 'shortlist'],
      assistants: ['clara', 'sophia'],
      stages: [
        { id: 'needs_analysis', name: 'Needs Analysis', icon: '📝', duration: '30-60 min', actions: ['Requirements gathering', 'Lifestyle assessment', 'Priority ranking'] },
        { id: 'budget_planning', name: 'Budget Planning', icon: '💵', duration: '1-2 hours', actions: ['Financial review', 'Mortgage options', 'Total cost analysis'] },
        { id: 'property_matching', name: 'Property Matching', icon: '🔎', duration: '2-5 days', actions: ['Database search', 'Criteria matching', 'Option filtering'] },
        { id: 'shortlist', name: 'Shortlist', icon: '📋', duration: '1 day', actions: ['Top recommendations', 'Comparison matrix', 'Viewing schedule'] }
      ]
    }
  ],
  leasing: [
    {
      id: 'svc-9',
      name: 'Residential Rental',
      category: 'leasing',
      description: 'End-to-end residential leasing with Ejari registration',
      icon: '🏠',
      status: 'active',
      avgDuration: '7-14 days',
      avgValue: 'AED 85K/year',
      monthlyVolume: 95,
      workflow: ['inquiry', 'viewing', 'application', 'approval', 'contract', 'ejari', 'handover'],
      assistants: ['daisy', 'vesta'],
      stages: [
        { id: 'inquiry', name: 'Inquiry', icon: '📞', duration: 'Same day', actions: ['Requirements gathering', 'Budget confirmation', 'Availability check'] },
        { id: 'viewing', name: 'Viewing', icon: '👁️', duration: '1-3 days', actions: ['Schedule viewing', 'Property tour', 'Q&A session'] },
        { id: 'application', name: 'Application', icon: '📝', duration: '1 day', actions: ['Application form', 'Document submission', 'Initial checks'] },
        { id: 'approval', name: 'Approval', icon: '✅', duration: '2-3 days', actions: ['Background check', 'Reference verification', 'Landlord approval'] },
        { id: 'contract', name: 'Contract', icon: '📄', duration: '1-2 days', actions: ['Contract drafting', 'Terms review', 'Signing'] },
        { id: 'ejari', name: 'Ejari', icon: '🏛️', duration: '1-2 days', actions: ['DLD submission', 'Registration', 'Certificate issuance'] },
        { id: 'handover', name: 'Handover', icon: '🔑', duration: '1 day', actions: ['Inventory check', 'Key handover', 'Welcome pack'] }
      ]
    },
    {
      id: 'svc-10',
      name: 'Commercial Leasing',
      category: 'leasing',
      description: 'Office, retail, and warehouse leasing for businesses',
      icon: '🏢',
      status: 'active',
      avgDuration: '30-60 days',
      avgValue: 'AED 250K/year',
      monthlyVolume: 18,
      workflow: ['requirements', 'site_visit', 'negotiation', 'fitout', 'lease_signing'],
      assistants: ['daisy', 'laila'],
      stages: [
        { id: 'requirements', name: 'Requirements', icon: '📋', duration: '1-2 days', actions: ['Space needs', 'Location preferences', 'Budget range'] },
        { id: 'site_visit', name: 'Site Visit', icon: '🏢', duration: '3-7 days', actions: ['Property tours', 'Space assessment', 'Infrastructure check'] },
        { id: 'negotiation', name: 'Negotiation', icon: '🤝', duration: '1-2 weeks', actions: ['Rent negotiation', 'Term discussion', 'Incentives'] },
        { id: 'fitout', name: 'Fit-out', icon: '🔨', duration: '2-8 weeks', actions: ['Design approval', 'Construction', 'Handover preparation'] },
        { id: 'lease_signing', name: 'Lease Signing', icon: '✍️', duration: '3-5 days', actions: ['Contract finalization', 'Legal review', 'Execution'] }
      ]
    },
    {
      id: 'svc-11',
      name: 'Tenant Screening',
      category: 'leasing',
      description: 'Comprehensive background and credit verification',
      icon: '🔍',
      status: 'active',
      avgDuration: '2-3 days',
      avgValue: 'Service fee',
      monthlyVolume: 110,
      workflow: ['application', 'background_check', 'income_verify', 'credit_check', 'report'],
      assistants: ['laila', 'daisy'],
      stages: [
        { id: 'application', name: 'Application', icon: '📝', duration: 'Day 1', actions: ['Form submission', 'Document collection', 'Initial review'] },
        { id: 'background_check', name: 'Background Check', icon: '🔎', duration: '1 day', actions: ['Identity verification', 'Reference check', 'History review'] },
        { id: 'income_verify', name: 'Income Verification', icon: '💰', duration: '1 day', actions: ['Employment confirmation', 'Salary verification', 'Bank statements'] },
        { id: 'credit_check', name: 'Credit Check', icon: '📊', duration: '1 day', actions: ['Credit score', 'Payment history', 'Liability review'] },
        { id: 'report', name: 'Report', icon: '📄', duration: 'Day 3', actions: ['Risk assessment', 'Recommendation', 'Landlord report'] }
      ]
    },
    {
      id: 'svc-12',
      name: 'Lease Renewal',
      category: 'leasing',
      description: 'Hassle-free lease renewal with Ejari update',
      icon: '🔄',
      status: 'active',
      avgDuration: '5-10 days',
      avgValue: 'Existing rent',
      monthlyVolume: 42,
      workflow: ['reminder', 'negotiation', 'new_terms', 'signing', 'ejari_update'],
      assistants: ['daisy', 'nina'],
      stages: [
        { id: 'reminder', name: 'Reminder', icon: '🔔', duration: '90 days before', actions: ['Expiry notification', 'Renewal intent', 'Initial discussion'] },
        { id: 'negotiation', name: 'Negotiation', icon: '🤝', duration: '1-2 weeks', actions: ['Rent review', 'Term discussion', 'Condition updates'] },
        { id: 'new_terms', name: 'New Terms', icon: '📝', duration: '2-3 days', actions: ['Term finalization', 'Contract update', 'Approval'] },
        { id: 'signing', name: 'Signing', icon: '✍️', duration: '1 day', actions: ['Contract signing', 'Payment processing', 'Documentation'] },
        { id: 'ejari_update', name: 'Ejari Update', icon: '🏛️', duration: '1-2 days', actions: ['DLD update', 'New certificate', 'Record update'] }
      ]
    },
    {
      id: 'svc-13',
      name: 'Ejari Registration',
      category: 'leasing',
      description: 'Official tenancy contract registration with Dubai Land Department',
      icon: '🏛️',
      status: 'active',
      avgDuration: '1-2 days',
      avgValue: 'AED 220',
      monthlyVolume: 135,
      workflow: ['document_collection', 'dld_portal', 'submission', 'certificate'],
      assistants: ['laila', 'daisy'],
      stages: [
        { id: 'document_collection', name: 'Document Collection', icon: '📁', duration: '1-2 hours', actions: ['Passport copies', 'Visa pages', 'Title deed', 'Contract'] },
        { id: 'dld_portal', name: 'DLD Portal', icon: '💻', duration: '30 min', actions: ['Data entry', 'Document upload', 'Fee payment'] },
        { id: 'submission', name: 'Submission', icon: '📤', duration: '15 min', actions: ['Application submit', 'Confirmation receipt', 'Tracking number'] },
        { id: 'certificate', name: 'Certificate', icon: '📜', duration: '24-48 hours', actions: ['Certificate issuance', 'PDF download', 'Tenant notification'] }
      ]
    },
    {
      id: 'svc-14',
      name: 'Key Handover',
      category: 'leasing',
      description: 'Professional property handover with inventory documentation',
      icon: '🔑',
      status: 'active',
      avgDuration: '2-4 hours',
      avgValue: 'Included',
      monthlyVolume: 85,
      workflow: ['inspection', 'inventory_check', 'keys_transfer', 'welcome_pack'],
      assistants: ['vesta', 'daisy'],
      stages: [
        { id: 'inspection', name: 'Inspection', icon: '🔍', duration: '1 hour', actions: ['Condition check', 'Photo documentation', 'Meter readings'] },
        { id: 'inventory_check', name: 'Inventory Check', icon: '📋', duration: '30 min', actions: ['Furniture list', 'Appliance check', 'Accessory count'] },
        { id: 'keys_transfer', name: 'Keys Transfer', icon: '🔑', duration: '15 min', actions: ['Key handover', 'Access cards', 'Parking fobs'] },
        { id: 'welcome_pack', name: 'Welcome Pack', icon: '🎁', duration: '15 min', actions: ['Building info', 'Emergency contacts', 'Area guide'] }
      ]
    },
    {
      id: 'svc-15',
      name: 'Rent Collection',
      category: 'leasing',
      description: 'Automated rent collection and landlord payouts',
      icon: '💰',
      status: 'active',
      avgDuration: 'Monthly cycle',
      avgValue: 'Portfolio based',
      monthlyVolume: 450,
      workflow: ['invoice', 'reminder', 'collection', 'receipt', 'landlord_payout'],
      assistants: ['theodora', 'daisy'],
      stages: [
        { id: 'invoice', name: 'Invoice', icon: '📧', duration: '7 days before', actions: ['Invoice generation', 'Email dispatch', 'Payment link'] },
        { id: 'reminder', name: 'Reminder', icon: '🔔', duration: '3 days before', actions: ['WhatsApp reminder', 'SMS alert', 'App notification'] },
        { id: 'collection', name: 'Collection', icon: '💳', duration: 'Due date', actions: ['Card payment', 'Bank transfer', 'Cheque deposit'] },
        { id: 'receipt', name: 'Receipt', icon: '🧾', duration: 'Immediate', actions: ['Receipt generation', 'Confirmation email', 'Record update'] },
        { id: 'landlord_payout', name: 'Landlord Payout', icon: '💸', duration: '3-5 days', actions: ['Commission deduction', 'Transfer initiation', 'Statement'] }
      ]
    }
  ],
  operations: [
    {
      id: 'svc-16',
      name: 'Property Viewing',
      category: 'operations',
      description: 'Scheduled property tours for prospective buyers and tenants',
      icon: '👁️',
      status: 'active',
      avgDuration: '1-2 hours',
      avgValue: 'Lead conversion',
      monthlyVolume: 320,
      workflow: ['request', 'scheduling', 'confirmation', 'tour', 'followup'],
      assistants: ['clara', 'linda'],
      stages: [
        { id: 'request', name: 'Request', icon: '📞', duration: 'Immediate', actions: ['Inquiry receipt', 'Requirements capture', 'Availability check'] },
        { id: 'scheduling', name: 'Scheduling', icon: '📅', duration: '1-24 hours', actions: ['Slot selection', 'Agent assignment', 'Calendar booking'] },
        { id: 'confirmation', name: 'Confirmation', icon: '✅', duration: '1 hour before', actions: ['Reminder SMS', 'WhatsApp confirm', 'Address share'] },
        { id: 'tour', name: 'Tour', icon: '🚶', duration: '45-90 min', actions: ['Property walkthrough', 'Feature highlight', 'Q&A'] },
        { id: 'followup', name: 'Follow-up', icon: '📧', duration: '24 hours', actions: ['Thank you message', 'Feedback request', 'Next steps'] }
      ]
    },
    {
      id: 'svc-17',
      name: 'Maintenance Request',
      category: 'operations',
      description: 'Property maintenance and repair coordination',
      icon: '🔧',
      status: 'active',
      avgDuration: '1-7 days',
      avgValue: 'Variable',
      monthlyVolume: 180,
      workflow: ['report', 'assessment', 'quote', 'approval', 'work', 'verify'],
      assistants: ['sentinel', 'vesta'],
      stages: [
        { id: 'report', name: 'Report', icon: '📝', duration: 'Immediate', actions: ['Issue description', 'Photo upload', 'Priority setting'] },
        { id: 'assessment', name: 'Assessment', icon: '🔍', duration: '24 hours', actions: ['Technician visit', 'Problem diagnosis', 'Scope definition'] },
        { id: 'quote', name: 'Quote', icon: '💰', duration: '1-2 days', actions: ['Cost estimate', 'Parts list', 'Timeline'] },
        { id: 'approval', name: 'Approval', icon: '✅', duration: '1-2 days', actions: ['Owner review', 'Budget check', 'Approval'] },
        { id: 'work', name: 'Work', icon: '🔨', duration: '1-5 days', actions: ['Schedule work', 'Execute repair', 'Quality check'] },
        { id: 'verify', name: 'Verify', icon: '✔️', duration: '1 day', actions: ['Tenant inspection', 'Sign-off', 'Case closure'] }
      ]
    },
    {
      id: 'svc-18',
      name: 'Property Inspection',
      category: 'operations',
      description: 'Regular property condition inspections and reporting',
      icon: '📋',
      status: 'active',
      avgDuration: '1-2 hours',
      avgValue: 'Service fee',
      monthlyVolume: 65,
      workflow: ['appointment', 'checklist', 'report', 'defects_log', 'action_items'],
      assistants: ['sentinel', 'juno'],
      stages: [
        { id: 'appointment', name: 'Appointment', icon: '📅', duration: '3-5 days', actions: ['Schedule booking', 'Tenant notification', 'Access arrangement'] },
        { id: 'checklist', name: 'Checklist', icon: '☑️', duration: '1-2 hours', actions: ['Room-by-room check', 'Condition rating', 'Photo evidence'] },
        { id: 'report', name: 'Report', icon: '📄', duration: '1-2 days', actions: ['Report generation', 'Photo compilation', 'Summary'] },
        { id: 'defects_log', name: 'Defects Log', icon: '⚠️', duration: 'With report', actions: ['Issue documentation', 'Priority ranking', 'Responsibility assignment'] },
        { id: 'action_items', name: 'Action Items', icon: '📝', duration: '1 day', actions: ['Task creation', 'Deadline setting', 'Assignment'] }
      ]
    },
    {
      id: 'svc-19',
      name: 'Inventory Management',
      category: 'operations',
      description: 'Property database management and listing coordination',
      icon: '🗄️',
      status: 'active',
      avgDuration: 'Continuous',
      avgValue: 'N/A',
      monthlyVolume: 9378,
      workflow: ['data_entry', 'verification', 'photos', 'pricing', 'publishing'],
      assistants: ['mary', 'olivia'],
      stages: [
        { id: 'data_entry', name: 'Data Entry', icon: '⌨️', duration: '15-30 min', actions: ['Property details', 'Feature input', 'Classification'] },
        { id: 'verification', name: 'Verification', icon: '✅', duration: '10 min', actions: ['Data accuracy', 'Duplicate check', 'Owner verification'] },
        { id: 'photos', name: 'Photos', icon: '📷', duration: '1-2 hours', actions: ['Photo upload', 'Quality check', 'Ordering'] },
        { id: 'pricing', name: 'Pricing', icon: '💰', duration: '5-10 min', actions: ['Market comparison', 'Price setting', 'Owner approval'] },
        { id: 'publishing', name: 'Publishing', icon: '🌐', duration: '5 min', actions: ['Portal selection', 'Listing activation', 'Confirmation'] }
      ]
    },
    {
      id: 'svc-20',
      name: 'Snagging & Defects',
      category: 'operations',
      description: 'New property defect identification and resolution',
      icon: '🔎',
      status: 'active',
      avgDuration: '2-4 weeks',
      avgValue: 'Included',
      monthlyVolume: 25,
      workflow: ['inspection', 'log', 'developer_report', 'resolution', 'signoff'],
      assistants: ['vesta', 'sentinel'],
      stages: [
        { id: 'inspection', name: 'Inspection', icon: '🔍', duration: '2-4 hours', actions: ['Detailed walkthrough', 'Defect identification', 'Photo documentation'] },
        { id: 'log', name: 'Log', icon: '📋', duration: '1 day', actions: ['Defect listing', 'Categorization', 'Priority assignment'] },
        { id: 'developer_report', name: 'Developer Report', icon: '📨', duration: '1-2 days', actions: ['Report compilation', 'Developer submission', 'Follow-up schedule'] },
        { id: 'resolution', name: 'Resolution', icon: '🔧', duration: '1-3 weeks', actions: ['Developer repairs', 'Progress tracking', 'Quality checks'] },
        { id: 'signoff', name: 'Sign-off', icon: '✅', duration: '1 day', actions: ['Final inspection', 'Owner approval', 'Case closure'] }
      ]
    },
    {
      id: 'svc-21',
      name: 'Move-in Coordination',
      category: 'operations',
      description: 'Complete move-in support including utilities setup',
      icon: '📦',
      status: 'active',
      avgDuration: '1-3 days',
      avgValue: 'Included',
      monthlyVolume: 75,
      workflow: ['schedule', 'utilities_setup', 'access_cards', 'welcome'],
      assistants: ['juno', 'vesta'],
      stages: [
        { id: 'schedule', name: 'Schedule', icon: '📅', duration: '2-3 days before', actions: ['Date confirmation', 'Time slot', 'Contact sharing'] },
        { id: 'utilities_setup', name: 'Utilities Setup', icon: '⚡', duration: '1-2 days', actions: ['DEWA transfer', 'Internet activation', 'AC registration'] },
        { id: 'access_cards', name: 'Access Cards', icon: '🎫', duration: '1 day', actions: ['Building access', 'Gym/pool cards', 'Parking registration'] },
        { id: 'welcome', name: 'Welcome', icon: '🏠', duration: 'Move-in day', actions: ['Key handover', 'Building tour', 'Emergency contacts'] }
      ]
    },
    {
      id: 'svc-22',
      name: 'Move-out Process',
      category: 'operations',
      description: 'Streamlined move-out with deposit settlement',
      icon: '🚪',
      status: 'active',
      avgDuration: '7-14 days',
      avgValue: 'Deposit based',
      monthlyVolume: 45,
      workflow: ['notice', 'inspection', 'deposit_settlement', 'key_return'],
      assistants: ['daisy', 'theodora'],
      stages: [
        { id: 'notice', name: 'Notice', icon: '📢', duration: '90 days before', actions: ['Notice receipt', 'Acknowledgment', 'Timeline confirmation'] },
        { id: 'inspection', name: 'Inspection', icon: '🔍', duration: '7 days before', actions: ['Property check', 'Damage assessment', 'Cleaning requirements'] },
        { id: 'deposit_settlement', name: 'Deposit Settlement', icon: '💰', duration: '7-14 days', actions: ['Deduction calculation', 'Owner approval', 'Refund processing'] },
        { id: 'key_return', name: 'Key Return', icon: '🔑', duration: 'Last day', actions: ['Final walkthrough', 'Key collection', 'Access deactivation'] }
      ]
    },
    {
      id: 'svc-23',
      name: 'Facility Management',
      category: 'operations',
      description: 'Building systems and common area management',
      icon: '🏗️',
      status: 'active',
      avgDuration: 'Ongoing',
      avgValue: 'Contract based',
      monthlyVolume: 120,
      workflow: ['request', 'assignment', 'execution', 'qa', 'closure'],
      assistants: ['juno', 'sentinel'],
      stages: [
        { id: 'request', name: 'Request', icon: '📝', duration: 'Immediate', actions: ['Issue reporting', 'Category selection', 'Priority setting'] },
        { id: 'assignment', name: 'Assignment', icon: '👷', duration: '1-4 hours', actions: ['Team allocation', 'Resource assignment', 'Schedule'] },
        { id: 'execution', name: 'Execution', icon: '🔧', duration: '1-24 hours', actions: ['Work execution', 'Progress updates', 'Part replacement'] },
        { id: 'qa', name: 'QA', icon: '✅', duration: '1-2 hours', actions: ['Quality check', 'Functionality test', 'Documentation'] },
        { id: 'closure', name: 'Closure', icon: '📁', duration: '30 min', actions: ['Report filing', 'Notification', 'Case closure'] }
      ]
    }
  ],
  finance: [
    {
      id: 'svc-24',
      name: 'Invoice Processing',
      category: 'finance',
      description: 'Automated invoice generation and tracking',
      icon: '📧',
      status: 'active',
      avgDuration: '1-2 days',
      avgValue: 'Variable',
      monthlyVolume: 650,
      workflow: ['generate', 'send', 'track', 'collect', 'receipt'],
      assistants: ['theodora'],
      stages: [
        { id: 'generate', name: 'Generate', icon: '📄', duration: 'Instant', actions: ['Invoice creation', 'Line items', 'Tax calculation'] },
        { id: 'send', name: 'Send', icon: '📤', duration: 'Instant', actions: ['Email dispatch', 'SMS notification', 'Portal update'] },
        { id: 'track', name: 'Track', icon: '👁️', duration: 'Ongoing', actions: ['View tracking', 'Reminder scheduling', 'Escalation rules'] },
        { id: 'collect', name: 'Collect', icon: '💳', duration: 'Due date', actions: ['Payment receipt', 'Multi-channel', 'Reconciliation'] },
        { id: 'receipt', name: 'Receipt', icon: '🧾', duration: 'Immediate', actions: ['Receipt generation', 'Ledger update', 'Confirmation'] }
      ]
    },
    {
      id: 'svc-25',
      name: 'Payment Collection',
      category: 'finance',
      description: 'Multi-channel payment collection and reconciliation',
      icon: '💳',
      status: 'active',
      avgDuration: 'Real-time',
      avgValue: 'AED 125K avg',
      monthlyVolume: 520,
      workflow: ['invoice', 'reminder', 'payment', 'confirmation', 'ledger_update'],
      assistants: ['theodora', 'nina'],
      stages: [
        { id: 'invoice', name: 'Invoice', icon: '📧', duration: 'Scheduled', actions: ['Invoice dispatch', 'Payment link', 'QR code'] },
        { id: 'reminder', name: 'Reminder', icon: '🔔', duration: 'Automated', actions: ['WhatsApp reminder', 'Email follow-up', 'SMS alert'] },
        { id: 'payment', name: 'Payment', icon: '💳', duration: 'Instant', actions: ['Card payment', 'Bank transfer', 'Aani QR'] },
        { id: 'confirmation', name: 'Confirmation', icon: '✅', duration: 'Instant', actions: ['Payment confirmation', 'Receipt email', 'App notification'] },
        { id: 'ledger_update', name: 'Ledger Update', icon: '📊', duration: 'Instant', actions: ['Account update', 'Balance reconciliation', 'Report generation'] }
      ]
    },
    {
      id: 'svc-26',
      name: 'Commission Calculation',
      category: 'finance',
      description: 'Automated agent commission calculation and payouts',
      icon: '💰',
      status: 'active',
      avgDuration: '3-5 days',
      avgValue: 'AED 85K avg',
      monthlyVolume: 45,
      workflow: ['sale_close', 'rate_apply', 'agent_split', 'approval', 'payout'],
      assistants: ['theodora', 'sophia'],
      stages: [
        { id: 'sale_close', name: 'Sale Close', icon: '🤝', duration: 'Trigger', actions: ['Deal closure', 'Value confirmation', 'Documentation'] },
        { id: 'rate_apply', name: 'Rate Apply', icon: '📊', duration: 'Instant', actions: ['Rate lookup', 'Tier calculation', 'Bonus check'] },
        { id: 'agent_split', name: 'Agent Split', icon: '👥', duration: 'Instant', actions: ['Split calculation', 'Team share', 'Manager override'] },
        { id: 'approval', name: 'Approval', icon: '✅', duration: '1-2 days', actions: ['Manager review', 'Finance approval', 'Final confirmation'] },
        { id: 'payout', name: 'Payout', icon: '💸', duration: '2-3 days', actions: ['Payment processing', 'Bank transfer', 'Pay slip'] }
      ]
    },
    {
      id: 'svc-27',
      name: 'Escrow Management',
      category: 'finance',
      description: 'Secure escrow holding and conditional release',
      icon: '🔐',
      status: 'active',
      avgDuration: '30-90 days',
      avgValue: 'AED 500K avg',
      monthlyVolume: 15,
      workflow: ['deposit', 'hold', 'conditions_met', 'release'],
      assistants: ['theodora', 'laila'],
      stages: [
        { id: 'deposit', name: 'Deposit', icon: '💵', duration: '1-2 days', actions: ['Fund receipt', 'Account credit', 'Confirmation'] },
        { id: 'hold', name: 'Hold', icon: '🔒', duration: 'Variable', actions: ['Secure holding', 'Status tracking', 'Interest accrual'] },
        { id: 'conditions_met', name: 'Conditions Met', icon: '☑️', duration: 'Variable', actions: ['Condition verification', 'Documentation check', 'Approval'] },
        { id: 'release', name: 'Release', icon: '💸', duration: '1-3 days', actions: ['Fund release', 'Transfer execution', 'Confirmation'] }
      ]
    },
    {
      id: 'svc-28',
      name: 'Financial Reporting',
      category: 'finance',
      description: 'Comprehensive financial analysis and reporting',
      icon: '📊',
      status: 'active',
      avgDuration: 'Monthly/Quarterly',
      avgValue: 'N/A',
      monthlyVolume: 12,
      workflow: ['data_gather', 'analysis', 'report', 'review', 'distribution'],
      assistants: ['theodora', 'zoe'],
      stages: [
        { id: 'data_gather', name: 'Data Gather', icon: '📥', duration: '2-3 days', actions: ['Transaction export', 'System integration', 'Data validation'] },
        { id: 'analysis', name: 'Analysis', icon: '🔍', duration: '2-3 days', actions: ['Trend analysis', 'KPI calculation', 'Variance analysis'] },
        { id: 'report', name: 'Report', icon: '📄', duration: '1-2 days', actions: ['Report generation', 'Chart creation', 'Summary writing'] },
        { id: 'review', name: 'Review', icon: '👁️', duration: '1-2 days', actions: ['Management review', 'Feedback incorporation', 'Finalization'] },
        { id: 'distribution', name: 'Distribution', icon: '📤', duration: '1 day', actions: ['Stakeholder distribution', 'Archive', 'Meeting schedule'] }
      ]
    }
  ],
  compliance: [
    {
      id: 'svc-29',
      name: 'KYC Verification',
      category: 'compliance',
      description: 'Know Your Customer identity verification',
      icon: '🆔',
      status: 'active',
      avgDuration: '2-4 hours',
      avgValue: 'Per transaction',
      monthlyVolume: 185,
      workflow: ['document_upload', 'verification', 'risk_score', 'approval_reject'],
      assistants: ['laila'],
      stages: [
        { id: 'document_upload', name: 'Document Upload', icon: '📤', duration: '5-10 min', actions: ['Passport upload', 'Visa upload', 'Emirates ID'] },
        { id: 'verification', name: 'Verification', icon: '🔍', duration: '1-2 hours', actions: ['Document validation', 'Cross-reference', 'Authenticity check'] },
        { id: 'risk_score', name: 'Risk Score', icon: '📊', duration: '30 min', actions: ['Risk calculation', 'PEP check', 'Sanctions screening'] },
        { id: 'approval_reject', name: 'Approval/Reject', icon: '✅', duration: '30 min', actions: ['Decision making', 'Notification', 'Documentation'] }
      ]
    },
    {
      id: 'svc-30',
      name: 'AML Screening',
      category: 'compliance',
      description: 'Anti-Money Laundering transaction monitoring',
      icon: '🛡️',
      status: 'active',
      avgDuration: 'Real-time + review',
      avgValue: 'Per transaction',
      monthlyVolume: 520,
      workflow: ['transaction', 'flag_check', 'investigation', 'clear_escalate'],
      assistants: ['laila', 'zoe'],
      stages: [
        { id: 'transaction', name: 'Transaction', icon: '💳', duration: 'Real-time', actions: ['Transaction capture', 'Pattern analysis', 'Threshold check'] },
        { id: 'flag_check', name: 'Flag Check', icon: '🚩', duration: 'Instant', actions: ['Rule matching', 'Alert generation', 'Priority assignment'] },
        { id: 'investigation', name: 'Investigation', icon: '🔍', duration: '1-5 days', actions: ['Case review', 'Evidence gathering', 'Source verification'] },
        { id: 'clear_escalate', name: 'Clear/Escalate', icon: '⚖️', duration: '1-2 days', actions: ['Decision', 'Documentation', 'Regulatory report'] }
      ]
    },
    {
      id: 'svc-31',
      name: 'Contract Review',
      category: 'compliance',
      description: 'Legal contract review and compliance verification',
      icon: '📜',
      status: 'active',
      avgDuration: '2-5 days',
      avgValue: 'Per contract',
      monthlyVolume: 95,
      workflow: ['draft', 'legal_review', 'comments', 'revision', 'approval'],
      assistants: ['evangeline', 'laila'],
      stages: [
        { id: 'draft', name: 'Draft', icon: '📝', duration: '1-2 days', actions: ['Template selection', 'Term customization', 'Initial draft'] },
        { id: 'legal_review', name: 'Legal Review', icon: '⚖️', duration: '1-2 days', actions: ['Clause review', 'Risk assessment', 'Compliance check'] },
        { id: 'comments', name: 'Comments', icon: '💬', duration: '1 day', actions: ['Feedback compilation', 'Change requests', 'Clarifications'] },
        { id: 'revision', name: 'Revision', icon: '✏️', duration: '1 day', actions: ['Amendments', 'Version update', 'Final review'] },
        { id: 'approval', name: 'Approval', icon: '✅', duration: '1 day', actions: ['Final approval', 'Signature', 'Archive'] }
      ]
    },
    {
      id: 'svc-32',
      name: 'Regulatory Compliance',
      category: 'compliance',
      description: 'RERA and regulatory compliance auditing',
      icon: '🏛️',
      status: 'active',
      avgDuration: 'Quarterly',
      avgValue: 'N/A',
      monthlyVolume: 4,
      workflow: ['audit', 'gap_analysis', 'remediation', 'certification'],
      assistants: ['laila', 'aurora'],
      stages: [
        { id: 'audit', name: 'Audit', icon: '🔍', duration: '1-2 weeks', actions: ['Process review', 'Documentation check', 'Interviews'] },
        { id: 'gap_analysis', name: 'Gap Analysis', icon: '📊', duration: '3-5 days', actions: ['Compliance gaps', 'Risk prioritization', 'Recommendations'] },
        { id: 'remediation', name: 'Remediation', icon: '🔧', duration: '2-4 weeks', actions: ['Action plans', 'Implementation', 'Progress tracking'] },
        { id: 'certification', name: 'Certification', icon: '📜', duration: '1-2 days', actions: ['Final review', 'Certification', 'Reporting'] }
      ]
    }
  ],
  marketing: [
    {
      id: 'svc-33',
      name: 'Property Marketing',
      category: 'marketing',
      description: 'Professional property photography and multi-portal listing',
      icon: '📸',
      status: 'active',
      avgDuration: '3-5 days',
      avgValue: 'Per property',
      monthlyVolume: 85,
      workflow: ['photography', 'listing', 'multi_platform', 'analytics'],
      assistants: ['olivia', 'mary'],
      stages: [
        { id: 'photography', name: 'Photography', icon: '📷', duration: '2-4 hours', actions: ['Photo shoot', 'Video tour', 'Drone footage'] },
        { id: 'listing', name: 'Listing', icon: '📝', duration: '1-2 days', actions: ['Description writing', 'Feature highlighting', 'SEO optimization'] },
        { id: 'multi_platform', name: 'Multi-Platform', icon: '🌐', duration: '1 day', actions: ['Bayut', 'Property Finder', 'Dubizzle', 'Website'] },
        { id: 'analytics', name: 'Analytics', icon: '📊', duration: 'Ongoing', actions: ['View tracking', 'Lead monitoring', 'Performance reports'] }
      ]
    },
    {
      id: 'svc-34',
      name: 'Lead Generation',
      category: 'marketing',
      description: 'Multi-channel lead acquisition and scoring',
      icon: '🎯',
      status: 'active',
      avgDuration: 'Continuous',
      avgValue: 'AED 150 per lead',
      monthlyVolume: 450,
      workflow: ['campaign', 'capture', 'score', 'route', 'followup'],
      assistants: ['olivia', 'clara', 'hunter'],
      stages: [
        { id: 'campaign', name: 'Campaign', icon: '📣', duration: 'Ongoing', actions: ['Ad creation', 'Targeting', 'Budget management'] },
        { id: 'capture', name: 'Capture', icon: '📥', duration: 'Real-time', actions: ['Form submission', 'Call tracking', 'Chat leads'] },
        { id: 'score', name: 'Score', icon: '⭐', duration: 'Instant', actions: ['AI scoring', 'Intent analysis', 'Priority assignment'] },
        { id: 'route', name: 'Route', icon: '🔀', duration: 'Instant', actions: ['Agent matching', 'Availability check', 'Assignment'] },
        { id: 'followup', name: 'Follow-up', icon: '📞', duration: '< 5 min', actions: ['Initial contact', 'Qualification', 'Appointment'] }
      ]
    },
    {
      id: 'svc-35',
      name: 'Client Communication',
      category: 'marketing',
      description: 'Automated client nurturing and retention',
      icon: '💬',
      status: 'active',
      avgDuration: 'Lifecycle',
      avgValue: 'Retention based',
      monthlyVolume: 2500,
      workflow: ['inquiry', 'response', 'nurture', 'conversion', 'retention'],
      assistants: ['linda', 'nina'],
      stages: [
        { id: 'inquiry', name: 'Inquiry', icon: '📩', duration: 'Instant', actions: ['Message receipt', 'Intent detection', 'Routing'] },
        { id: 'response', name: 'Response', icon: '💬', duration: '< 2 min', actions: ['Auto-response', 'AI suggestion', 'Agent handoff'] },
        { id: 'nurture', name: 'Nurture', icon: '🌱', duration: 'Weeks-Months', actions: ['Drip campaigns', 'Content sharing', 'Check-ins'] },
        { id: 'conversion', name: 'Conversion', icon: '🎯', duration: 'Variable', actions: ['Deal closure', 'Onboarding', 'Thank you'] },
        { id: 'retention', name: 'Retention', icon: '🔄', duration: 'Ongoing', actions: ['Anniversary messages', 'Referral requests', 'Feedback'] }
      ]
    }
  ]
};

export const getAllServices = () => {
  return Object.values(COMPANY_SERVICES).flat();
};

export const getServicesByCategory = (category) => {
  return COMPANY_SERVICES[category] || [];
};

export const getServiceById = (id) => {
  return getAllServices().find(s => s.id === id);
};

export const getServiceStats = () => {
  const all = getAllServices();
  return {
    total: all.length,
    byCategory: {
      sales: COMPANY_SERVICES.sales.length,
      leasing: COMPANY_SERVICES.leasing.length,
      operations: COMPANY_SERVICES.operations.length,
      finance: COMPANY_SERVICES.finance.length,
      compliance: COMPANY_SERVICES.compliance.length,
      marketing: COMPANY_SERVICES.marketing.length
    },
    totalMonthlyVolume: all.reduce((sum, s) => sum + s.monthlyVolume, 0)
  };
};

export default {
  COMPANY_SERVICES,
  getAllServices,
  getServicesByCategory,
  getServiceById,
  getServiceStats
};
