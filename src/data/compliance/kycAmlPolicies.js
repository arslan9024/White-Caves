export const KYC_AML_POLICIES = {
  version: '2.0',
  effectiveDate: '2024-01-01',
  jurisdiction: 'UAE',
  regulatoryAuthorities: ['CBUAE', 'SCA', 'RERA', 'DLD'],

  riskCategories: {
    LOW: { level: 1, label: 'Low Risk', color: '#10B981', reviewPeriod: 365 },
    MEDIUM: { level: 2, label: 'Medium Risk', color: '#F59E0B', reviewPeriod: 180 },
    HIGH: { level: 3, label: 'High Risk', color: '#EF4444', reviewPeriod: 90 },
    PROHIBITED: { level: 4, label: 'Prohibited', color: '#7C3AED', reviewPeriod: 0 }
  },

  customerDueDiligence: {
    CDD: {
      name: 'Customer Due Diligence',
      thresholdAED: 50000,
      documents: ['passport', 'emirates_id', 'visa', 'proof_of_address'],
      requiredFor: ['LOW', 'MEDIUM'],
      validityDays: 365
    },
    EDD: {
      name: 'Enhanced Due Diligence',
      thresholdAED: 500000,
      documents: ['passport', 'emirates_id', 'visa', 'proof_of_address', 'source_of_funds', 'bank_statements', 'income_proof'],
      requiredFor: ['HIGH'],
      validityDays: 180,
      additionalChecks: ['pep_screening', 'sanctions_check', 'adverse_media', 'source_of_wealth']
    }
  },

  documentRequirements: {
    passport: {
      id: 'passport',
      name: 'Passport',
      description: 'Valid passport with minimum 6 months validity',
      required: true,
      validityCheck: true,
      ocrFields: ['full_name', 'nationality', 'passport_number', 'date_of_birth', 'expiry_date', 'gender']
    },
    emirates_id: {
      id: 'emirates_id',
      name: 'Emirates ID',
      description: 'Valid UAE Emirates ID card',
      required: true,
      validityCheck: true,
      ocrFields: ['id_number', 'full_name_en', 'full_name_ar', 'nationality', 'expiry_date']
    },
    visa: {
      id: 'visa',
      name: 'UAE Visa',
      description: 'Valid UAE residence visa or entry permit',
      required: true,
      validityCheck: true,
      ocrFields: ['visa_type', 'sponsor', 'profession', 'expiry_date']
    },
    proof_of_address: {
      id: 'proof_of_address',
      name: 'Proof of Address',
      description: 'Utility bill, bank statement, or tenancy contract (within 3 months)',
      required: true,
      validityCheck: false,
      maxAgeDays: 90,
      acceptedTypes: ['utility_bill', 'bank_statement', 'ejari_certificate', 'tenancy_contract']
    },
    source_of_funds: {
      id: 'source_of_funds',
      name: 'Source of Funds Declaration',
      description: 'Declaration of source of funds for transaction',
      required: false,
      requiredForEDD: true,
      acceptedTypes: ['salary', 'business_income', 'investment_returns', 'inheritance', 'property_sale', 'gift']
    },
    bank_statements: {
      id: 'bank_statements',
      name: 'Bank Statements',
      description: 'Last 6 months bank statements',
      required: false,
      requiredForEDD: true,
      maxAgeDays: 30,
      minimumPeriodMonths: 6
    },
    income_proof: {
      id: 'income_proof',
      name: 'Income Proof',
      description: 'Salary certificate, trade license, or tax returns',
      required: false,
      requiredForEDD: true,
      acceptedTypes: ['salary_certificate', 'trade_license', 'audited_financials', 'tax_returns']
    },
    company_documents: {
      id: 'company_documents',
      name: 'Company Documents',
      description: 'For corporate entities: trade license, MOA, board resolution',
      required: false,
      requiredFor: ['corporate'],
      documents: ['trade_license', 'memorandum_of_association', 'board_resolution', 'shareholder_register', 'ubo_declaration']
    }
  },

  riskScoringMatrix: {
    customerType: {
      individual_resident: 0,
      individual_non_resident: 10,
      corporate_local: 5,
      corporate_foreign: 15,
      trust_foundation: 20,
      pep: 30,
      pep_family: 25
    },
    nationality: {
      gcc: 0,
      low_risk_country: 5,
      medium_risk_country: 15,
      high_risk_country: 30,
      fatf_blacklist: 50,
      sanctioned_country: 100
    },
    transactionValue: {
      below_50k: 0,
      '50k_to_500k': 5,
      '500k_to_2m': 10,
      '2m_to_10m': 20,
      above_10m: 30
    },
    transactionType: {
      residential_rental: 0,
      residential_purchase: 5,
      commercial_rental: 5,
      commercial_purchase: 10,
      offplan_purchase: 10,
      investment_portfolio: 15,
      cash_transaction: 25
    },
    sourceOfFunds: {
      salary: 0,
      business_income: 5,
      investment_returns: 5,
      property_sale: 10,
      inheritance: 10,
      gift: 15,
      crypto: 25,
      unknown: 30
    },
    occupation: {
      employed: 0,
      self_employed: 5,
      business_owner: 5,
      investor: 10,
      retired: 5,
      student: 10,
      unemployed: 15,
      high_risk_profession: 20
    }
  },

  riskThresholds: {
    low: { min: 0, max: 25 },
    medium: { min: 26, max: 50 },
    high: { min: 51, max: 75 },
    prohibited: { min: 76, max: 100 }
  },

  pepCategories: {
    domestic: {
      categories: [
        'Head of State/Government',
        'Senior Politicians',
        'Senior Government Officials',
        'Judicial Officials',
        'Military Officers',
        'State-Owned Enterprise Executives',
        'Political Party Officials'
      ],
      riskWeight: 30
    },
    foreign: {
      categories: [
        'Foreign Head of State/Government',
        'Foreign Senior Politicians',
        'International Organization Officials',
        'Ambassadors/Diplomats'
      ],
      riskWeight: 35
    },
    international: {
      categories: [
        'UN Officials',
        'World Bank Officials',
        'IMF Officials',
        'Regional Organization Officials'
      ],
      riskWeight: 25
    },
    familyAssociates: {
      categories: [
        'Spouse',
        'Children',
        'Parents',
        'Siblings',
        'Close Business Associates'
      ],
      riskWeight: 20
    }
  },

  sanctionsLists: [
    { id: 'un_consolidated', name: 'UN Consolidated Sanctions List', priority: 1, mandatory: true },
    { id: 'ofac_sdn', name: 'OFAC SDN List (US)', priority: 2, mandatory: true },
    { id: 'eu_consolidated', name: 'EU Consolidated Sanctions List', priority: 3, mandatory: true },
    { id: 'uk_sanctions', name: 'UK Sanctions List', priority: 4, mandatory: true },
    { id: 'uae_local', name: 'UAE Local Terrorist List', priority: 1, mandatory: true },
    { id: 'interpol', name: 'Interpol Wanted List', priority: 5, mandatory: false },
    { id: 'worldcheck', name: 'World-Check (Refinitiv)', priority: 6, mandatory: false }
  ],

  highRiskCountries: {
    fatfBlacklist: ['North Korea', 'Iran', 'Myanmar'],
    fatfGreylist: ['Syria', 'Yemen', 'South Sudan', 'Mali', 'Burkina Faso', 'Cameroon', 'DRC', 'Mozambique', 'Nigeria', 'Senegal', 'Tanzania', 'Turkey', 'UAE', 'Vietnam'],
    enhancedDueDiligence: ['Russia', 'Belarus', 'Venezuela', 'Zimbabwe', 'Cuba']
  },

  amlRedFlags: {
    transactionPatterns: [
      { id: 'structuring', description: 'Multiple transactions just below reporting threshold', severity: 'HIGH' },
      { id: 'rapid_movement', description: 'Rapid movement of funds in and out', severity: 'HIGH' },
      { id: 'round_amounts', description: 'Unusually round transaction amounts', severity: 'MEDIUM' },
      { id: 'third_party', description: 'Third party payments without clear relationship', severity: 'HIGH' },
      { id: 'cash_intensive', description: 'Unusually large cash transactions', severity: 'HIGH' },
      { id: 'geographic_mismatch', description: 'Transaction location mismatches customer profile', severity: 'MEDIUM' },
      { id: 'unusual_frequency', description: 'Unusual frequency of transactions', severity: 'MEDIUM' },
      { id: 'price_manipulation', description: 'Property price significantly above/below market', severity: 'HIGH' }
    ],
    customerBehavior: [
      { id: 'reluctant_info', description: 'Reluctant to provide information', severity: 'MEDIUM' },
      { id: 'inconsistent_info', description: 'Inconsistent or contradictory information', severity: 'HIGH' },
      { id: 'unusual_documents', description: 'Unusual or suspicious documents', severity: 'HIGH' },
      { id: 'nominee_structures', description: 'Complex nominee/shell company structures', severity: 'HIGH' },
      { id: 'rushed_transaction', description: 'Unusual urgency to complete transaction', severity: 'MEDIUM' },
      { id: 'no_concern_price', description: 'No concern about property price or terms', severity: 'MEDIUM' }
    ],
    propertyFlags: [
      { id: 'rapid_resale', description: 'Property resold within short period at significant markup', severity: 'HIGH' },
      { id: 'abandoned_transaction', description: 'Transaction abandoned after deposit', severity: 'MEDIUM' },
      { id: 'multiple_properties', description: 'Multiple property purchases in short time', severity: 'MEDIUM' },
      { id: 'renovation_inflated', description: 'Inflated renovation costs', severity: 'HIGH' }
    ]
  },

  reportingThresholds: {
    ctr: { threshold: 55000, currency: 'AED', description: 'Cash Transaction Report' },
    str: { threshold: 0, currency: 'AED', description: 'Suspicious Transaction Report - any amount' },
    ptr: { threshold: 500000, currency: 'AED', description: 'Property Transaction Report' }
  },

  verificationWorkflow: {
    steps: [
      { id: 'document_collection', name: 'Document Collection', order: 1, requiredDocs: ['passport', 'emirates_id'], timeout: 72 },
      { id: 'document_verification', name: 'Document Verification', order: 2, automated: true, timeout: 1 },
      { id: 'identity_verification', name: 'Identity Verification', order: 3, automated: true, timeout: 1 },
      { id: 'pep_screening', name: 'PEP Screening', order: 4, automated: true, timeout: 1 },
      { id: 'sanctions_check', name: 'Sanctions Check', order: 5, automated: true, timeout: 1 },
      { id: 'risk_assessment', name: 'Risk Assessment', order: 6, automated: true, timeout: 1 },
      { id: 'edd_review', name: 'EDD Review', order: 7, automated: false, conditionalOn: 'HIGH_RISK', timeout: 48 },
      { id: 'compliance_approval', name: 'Compliance Approval', order: 8, automated: false, timeout: 24 },
      { id: 'onboarding_complete', name: 'Onboarding Complete', order: 9, automated: true, timeout: 1 }
    ],
    escalationRules: {
      pepMatch: { escalateTo: 'compliance_officer', priority: 'HIGH', deadline: 24 },
      sanctionsMatch: { escalateTo: 'mlro', priority: 'CRITICAL', deadline: 1 },
      highRisk: { escalateTo: 'compliance_officer', priority: 'HIGH', deadline: 48 },
      documentIssues: { escalateTo: 'kyc_analyst', priority: 'MEDIUM', deadline: 72 }
    }
  },

  auditRequirements: {
    retentionPeriod: 5,
    retentionUnit: 'years',
    requiredFields: ['timestamp', 'action', 'actor', 'customer_id', 'details', 'ip_address', 'device_info'],
    immutable: true,
    encryption: 'AES-256-GCM'
  },

  roles: {
    kyc_analyst: {
      name: 'KYC Analyst',
      permissions: ['view_profiles', 'verify_documents', 'request_info', 'create_cases'],
      aiAssistant: 'laila'
    },
    compliance_officer: {
      name: 'Compliance Officer',
      permissions: ['view_profiles', 'verify_documents', 'approve_onboarding', 'manage_alerts', 'file_str', 'access_reports'],
      aiAssistant: 'henry'
    },
    mlro: {
      name: 'Money Laundering Reporting Officer',
      permissions: ['full_access', 'file_str', 'regulatory_reports', 'policy_management'],
      aiAssistant: 'henry'
    },
    auditor: {
      name: 'Internal Auditor',
      permissions: ['view_only', 'audit_reports', 'compliance_reports'],
      aiAssistant: 'henry'
    }
  },

  assistantIntegration: {
    henry: {
      role: 'Compliance Officer',
      department: 'compliance',
      fullAccess: true,
      capabilities: ['full_kyc_management', 'aml_alerts', 'str_filing', 'policy_management', 'audit_oversight']
    },
    laila: {
      role: 'Arabic Communications & Document Verification',
      department: 'communications',
      capabilities: ['document_verification', 'arabic_document_ocr', 'customer_communication', 'translation']
    },
    theodora: {
      role: 'CFO Intelligence',
      department: 'finance',
      capabilities: ['transaction_monitoring', 'financial_screening', 'payment_verification', 'fund_tracking']
    },
    evangeline: {
      role: 'Legal AI',
      department: 'legal',
      capabilities: ['legal_compliance', 'contract_review', 'regulatory_research', 'sanctions_interpretation']
    }
  }
};

export const getTransactionValueCategory = (amountAED) => {
  if (amountAED < 50000) return 'below_50k';
  if (amountAED < 500000) return '50k_to_500k';
  if (amountAED < 2000000) return '500k_to_2m';
  if (amountAED < 10000000) return '2m_to_10m';
  return 'above_10m';
};

export const calculateRiskScore = (factors) => {
  const matrix = KYC_AML_POLICIES.riskScoringMatrix;
  let score = 0;
  
  if (factors.customerType && matrix.customerType[factors.customerType]) {
    score += matrix.customerType[factors.customerType];
  }
  if (factors.nationality && matrix.nationality[factors.nationality]) {
    score += matrix.nationality[factors.nationality];
  }
  if (factors.transactionValue) {
    const category = getTransactionValueCategory(factors.transactionValue);
    score += matrix.transactionValue[category] || 0;
  }
  if (factors.transactionType && matrix.transactionType[factors.transactionType]) {
    score += matrix.transactionType[factors.transactionType];
  }
  if (factors.sourceOfFunds && matrix.sourceOfFunds[factors.sourceOfFunds]) {
    score += matrix.sourceOfFunds[factors.sourceOfFunds];
  }
  if (factors.occupation && matrix.occupation[factors.occupation]) {
    score += matrix.occupation[factors.occupation];
  }
  
  return Math.min(score, 100);
};

export const getRiskCategory = (score) => {
  const thresholds = KYC_AML_POLICIES.riskThresholds;
  if (score <= thresholds.low.max) return 'LOW';
  if (score <= thresholds.medium.max) return 'MEDIUM';
  if (score <= thresholds.high.max) return 'HIGH';
  return 'PROHIBITED';
};

export const getRequiredDocuments = (riskCategory, customerType = 'individual') => {
  const cdd = KYC_AML_POLICIES.customerDueDiligence;
  const docs = KYC_AML_POLICIES.documentRequirements;
  
  let requiredDocs = [...cdd.CDD.documents];
  
  if (riskCategory === 'HIGH' || riskCategory === 'PROHIBITED') {
    requiredDocs = [...cdd.EDD.documents];
  }
  
  if (customerType === 'corporate') {
    requiredDocs.push('company_documents');
  }
  
  return requiredDocs.map(docId => docs[docId]).filter(Boolean);
};

export default KYC_AML_POLICIES;
