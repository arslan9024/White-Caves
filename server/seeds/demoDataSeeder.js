import TenancyDeal from '../models/TenancyDeal.js';
import SalesDeal from '../models/SalesDeal.js';
import DemoData from '../models/DemoData.js';

const DEMO_LANDLORD = {
  name: 'Ahmed Al Maktoum',
  email: 'ahmed.landlord@demo.whitecaves.ae',
  phone: '+971501234567',
  emiratesId: '784-1985-1234567-1',
  type: 'individual'
};

const DEMO_TENANT = {
  name: 'Sarah Johnson',
  email: 'sarah.tenant@demo.whitecaves.ae',
  phone: '+971502345678',
  emiratesId: '784-1990-2345678-2',
  employer: 'Emirates NBD',
  monthlyIncome: 35000,
  kycStatus: 'verified'
};

const DEMO_BUYER = {
  name: 'Mohammed Al Rashid',
  email: 'mohammed.buyer@demo.whitecaves.ae',
  phone: '+971503456789',
  emiratesId: '784-1988-3456789-3',
  nationality: 'UAE',
  kycStatus: 'verified'
};

const DEMO_SELLER = {
  name: 'Fatima Hassan',
  email: 'fatima.seller@demo.whitecaves.ae',
  phone: '+971504567890',
  emiratesId: '784-1975-4567890-4',
  type: 'individual'
};

const DEMO_LEASING_BROKER = {
  name: 'Omar Khalid',
  email: 'omar.broker@whitecaves.ae',
  phone: '+971505678901',
  brnNumber: 'BRN-12345',
  assignedBy: 'Daisy AI',
  assignedAt: new Date()
};

const DEMO_OFFPLAN_BROKER = {
  name: 'Layla Ahmed',
  email: 'layla.broker@whitecaves.ae',
  phone: '+971506789012',
  brnNumber: 'BRN-23456',
  specialization: 'off_plan',
  assignedBy: 'Clara AI',
  assignedAt: new Date()
};

const DEMO_SECONDARY_BROKER = {
  name: 'Khalid Mansoor',
  email: 'khalid.broker@whitecaves.ae',
  phone: '+971507890123',
  brnNumber: 'BRN-34567',
  specialization: 'secondary',
  assignedBy: 'Sophia AI',
  assignedAt: new Date()
};

const DEMO_LEASING_PROPERTY = {
  address: 'Villa 42, Street 5, Jumeirah Village Circle',
  area: 'JVC',
  type: 'Villa',
  bedrooms: 4,
  bathrooms: 5,
  size: 3500,
  annualRent: 180000,
  securityDeposit: 15000
};

const DEMO_OFFPLAN_PROPERTY = {
  address: 'Unit 1205, Tower A, Creek Harbour',
  area: 'Dubai Creek Harbour',
  project: 'Creek Rise',
  developer: 'Emaar Properties',
  type: 'Apartment',
  bedrooms: 2,
  bathrooms: 3,
  size: 1450,
  askingPrice: 2800000,
  isOffPlan: true
};

const DEMO_SECONDARY_PROPERTY = {
  address: 'Apt 804, Marina Heights, Dubai Marina',
  area: 'Dubai Marina',
  project: 'Marina Heights',
  developer: 'Damac Properties',
  type: 'Apartment',
  bedrooms: 3,
  bathrooms: 4,
  size: 2100,
  askingPrice: 3500000,
  isOffPlan: false
};

export async function seedDemoTenancyDeal() {
  const existingDemo = await TenancyDeal.findOne({ isDemo: true, 'property.area': 'JVC' });
  if (existingDemo) {
    console.log('[Seed] Demo tenancy deal already exists');
    return existingDemo;
  }

  const dealNumber = await TenancyDeal.generateDealNumber();
  
  const tenancyDeal = new TenancyDeal({
    dealNumber,
    status: 'contract_preparation',
    property: DEMO_LEASING_PROPERTY,
    landlord: DEMO_LANDLORD,
    tenant: DEMO_TENANT,
    broker: DEMO_LEASING_BROKER,
    offer: {
      monthlyRent: 15000,
      securityDeposit: 15000,
      agencyFee: 7500,
      paymentSchedule: '4_cheques',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2027-01-31'),
      duration: 12,
      specialConditions: ['Pets allowed', 'Maintenance included for first 3 months'],
      submittedAt: new Date('2026-01-10'),
      acceptedAt: new Date('2026-01-12')
    },
    contract: {
      contractNumber: `TC-2026-${dealNumber}`,
      generatedAt: new Date('2026-01-12')
    },
    timeline: [
      { stage: 'inquiry', status: 'completed', timestamp: new Date('2026-01-05'), actor: 'Sarah Johnson', notes: 'Initial inquiry via website' },
      { stage: 'viewing_scheduled', status: 'completed', timestamp: new Date('2026-01-06'), actor: 'Daisy AI', notes: 'Viewing scheduled for Jan 7' },
      { stage: 'viewing_completed', status: 'completed', timestamp: new Date('2026-01-07'), actor: 'Omar Khalid', notes: 'Tenant liked the property' },
      { stage: 'offer_submitted', status: 'completed', timestamp: new Date('2026-01-10'), actor: 'Sarah Johnson', notes: 'Offer submitted at AED 15,000/month' },
      { stage: 'landlord_review', status: 'completed', timestamp: new Date('2026-01-10'), actor: 'Daisy AI', notes: 'Sent to landlord for review' },
      { stage: 'offer_accepted', status: 'completed', timestamp: new Date('2026-01-12'), actor: 'Ahmed Al Maktoum', notes: 'Landlord accepted offer' },
      { stage: 'contract_preparation', status: 'in_progress', timestamp: new Date('2026-01-12'), actor: 'Daisy AI', notes: 'Contract being prepared' }
    ],
    kycVerification: {
      landlordVerified: true,
      tenantVerified: true,
      riskScore: 15,
      verifiedAt: new Date('2026-01-11'),
      verifiedBy: 'Henry AI'
    },
    financials: {
      totalContractValue: 180000,
      commissionAmount: 9000,
      commissionPaid: false
    },
    isDemo: true
  });

  await tenancyDeal.save();
  console.log('[Seed] Demo tenancy deal created:', dealNumber);
  return tenancyDeal;
}

export async function seedDemoOffPlanDeal() {
  const existingDemo = await SalesDeal.findOne({ isDemo: true, dealType: 'off_plan' });
  if (existingDemo) {
    console.log('[Seed] Demo off-plan deal already exists');
    return existingDemo;
  }

  const dealNumber = await SalesDeal.generateDealNumber('off_plan');
  
  const salesDeal = new SalesDeal({
    dealNumber,
    dealType: 'off_plan',
    status: 'offer_accepted',
    property: DEMO_OFFPLAN_PROPERTY,
    seller: {
      name: 'Emaar Properties',
      email: 'sales@emaar.ae',
      phone: '+97148835353',
      type: 'developer'
    },
    buyer: DEMO_BUYER,
    broker: DEMO_OFFPLAN_BROKER,
    leadSource: {
      source: 'website',
      campaign: 'Creek Harbour Launch',
      leadScore: 85,
      qualification: 'hot'
    },
    offer: {
      offerPrice: 2800000,
      agreedPrice: 2800000,
      depositAmount: 280000,
      paymentPlan: '60/40 (60% during construction, 40% on handover)',
      submittedAt: new Date('2026-01-08'),
      acceptedAt: new Date('2026-01-09')
    },
    timeline: [
      { stage: 'lead', status: 'completed', timestamp: new Date('2026-01-01'), actor: 'Clara AI', notes: 'Lead captured from website' },
      { stage: 'qualified', status: 'completed', timestamp: new Date('2026-01-02'), actor: 'Clara AI', notes: 'Lead qualified - budget confirmed' },
      { stage: 'viewing_scheduled', status: 'completed', timestamp: new Date('2026-01-03'), actor: 'Layla Ahmed', notes: 'Show unit viewing scheduled' },
      { stage: 'viewing_completed', status: 'completed', timestamp: new Date('2026-01-05'), actor: 'Layla Ahmed', notes: 'Buyer very interested in Unit 1205' },
      { stage: 'offer_submitted', status: 'completed', timestamp: new Date('2026-01-08'), actor: 'Mohammed Al Rashid', notes: 'Reservation form submitted' },
      { stage: 'offer_accepted', status: 'in_progress', timestamp: new Date('2026-01-09'), actor: 'Emaar Properties', notes: 'Reservation confirmed, SPA pending' }
    ],
    kycVerification: {
      buyerVerified: true,
      riskScore: 12,
      amlCleared: true,
      verifiedAt: new Date('2026-01-07')
    },
    financials: {
      totalTransactionValue: 2800000,
      commissionPercentage: 3,
      commissionAmount: 84000,
      commissionPaid: false
    },
    isDemo: true
  });

  await salesDeal.save();
  console.log('[Seed] Demo off-plan deal created:', dealNumber);
  return salesDeal;
}

export async function seedDemoSecondaryDeal() {
  const existingDemo = await SalesDeal.findOne({ isDemo: true, dealType: 'secondary' });
  if (existingDemo) {
    console.log('[Seed] Demo secondary deal already exists');
    return existingDemo;
  }

  const dealNumber = await SalesDeal.generateDealNumber('secondary');
  
  const salesDeal = new SalesDeal({
    dealNumber,
    dealType: 'secondary',
    status: 'negotiation',
    property: DEMO_SECONDARY_PROPERTY,
    seller: DEMO_SELLER,
    buyer: {
      name: 'James Wilson',
      email: 'james.buyer@demo.whitecaves.ae',
      phone: '+971508901234',
      emiratesId: '784-1992-5678901-5',
      nationality: 'UK',
      kycStatus: 'verified'
    },
    broker: DEMO_SECONDARY_BROKER,
    leadSource: {
      source: 'referral',
      campaign: 'Client Referral Program',
      leadScore: 75,
      qualification: 'warm'
    },
    offer: {
      offerPrice: 3200000,
      counterPrice: 3400000,
      depositAmount: 350000,
      submittedAt: new Date('2026-01-10'),
      validUntil: new Date('2026-01-17')
    },
    timeline: [
      { stage: 'lead', status: 'completed', timestamp: new Date('2025-12-20'), actor: 'Sophia AI', notes: 'Referral lead from existing client' },
      { stage: 'qualified', status: 'completed', timestamp: new Date('2025-12-22'), actor: 'Khalid Mansoor', notes: 'Budget and requirements confirmed' },
      { stage: 'viewing_scheduled', status: 'completed', timestamp: new Date('2025-12-28'), actor: 'Khalid Mansoor', notes: 'Property viewing arranged' },
      { stage: 'viewing_completed', status: 'completed', timestamp: new Date('2026-01-03'), actor: 'Khalid Mansoor', notes: 'Buyer interested, wants to negotiate' },
      { stage: 'offer_submitted', status: 'completed', timestamp: new Date('2026-01-10'), actor: 'James Wilson', notes: 'Offer at AED 3.2M submitted' },
      { stage: 'negotiation', status: 'in_progress', timestamp: new Date('2026-01-11'), actor: 'Fatima Hassan', notes: 'Counter offer at AED 3.4M' }
    ],
    kycVerification: {
      sellerVerified: true,
      buyerVerified: true,
      riskScore: 18,
      amlCleared: true,
      verifiedAt: new Date('2026-01-09')
    },
    financials: {
      totalTransactionValue: 3500000,
      commissionPercentage: 2,
      commissionAmount: 70000,
      commissionPaid: false
    },
    isDemo: true
  });

  await salesDeal.save();
  console.log('[Seed] Demo secondary deal created:', dealNumber);
  return salesDeal;
}

export async function seedDemoKYCCase() {
  const demoKYC = await DemoData.findOne({ type: 'kyc_case', category: 'kyc_aml' });
  if (demoKYC) {
    console.log('[Seed] Demo KYC case already exists');
    return demoKYC;
  }

  const kycCase = new DemoData({
    type: 'kyc_case',
    category: 'kyc_aml',
    name: 'High-Value Property Purchase - KYC Demo',
    description: 'Complete KYC/AML verification workflow for a AED 5M+ property purchase',
    data: {
      customer: {
        name: 'Viktor Petrov',
        nationality: 'Russia',
        emiratesId: '784-1980-9876543-9',
        passportNumber: 'RU12345678',
        occupation: 'Business Owner',
        employer: 'Petrov Trading LLC',
        annualIncome: 2500000,
        sourceOfFunds: 'business_income'
      },
      transaction: {
        type: 'property_purchase',
        value: 5500000,
        property: 'Penthouse, Palm Jumeirah',
        paymentMethod: 'bank_transfer'
      },
      riskAssessment: {
        score: 68,
        category: 'HIGH',
        factors: [
          { factor: 'Nationality', score: 30, reason: 'Sanctioned country (Russia)' },
          { factor: 'Transaction Value', score: 20, reason: 'Above AED 5M threshold' },
          { factor: 'Source of Funds', score: 8, reason: 'Business income - additional verification needed' },
          { factor: 'Occupation', score: 10, reason: 'Business owner - beneficial ownership check required' }
        ]
      },
      verification: {
        status: 'pending_edd',
        stages: [
          { stage: 'Emirates ID Verification', status: 'completed', date: '2026-01-10' },
          { stage: 'Passport Verification', status: 'completed', date: '2026-01-10' },
          { stage: 'PEP Screening', status: 'completed', result: 'No match', date: '2026-01-10' },
          { stage: 'Sanctions Check', status: 'flagged', result: 'Country on sanctions list', date: '2026-01-10' },
          { stage: 'Source of Funds', status: 'pending', date: null },
          { stage: 'Enhanced Due Diligence', status: 'pending', date: null }
        ]
      }
    },
    learningScenario: {
      title: 'High-Risk Customer Verification',
      steps: [
        '1. Initial document collection (Emirates ID, Passport)',
        '2. Run automated PEP and sanctions screening',
        '3. Calculate risk score using scoring matrix',
        '4. Flag for Enhanced Due Diligence (EDD) if score > 50',
        '5. Request additional documentation (bank statements, business license)',
        '6. Verify source of funds with supporting documents',
        '7. Obtain senior management approval for high-risk customers',
        '8. Document all verification steps in audit trail',
        '9. Set appropriate monitoring frequency (90 days for HIGH risk)'
      ],
      bestPractices: [
        'Always verify documents against original sources',
        'Cross-reference information across multiple databases',
        'Document rejection reasons clearly for audit purposes',
        'Escalate unusual patterns to compliance officer',
        'Maintain 5-year retention of all verification records'
      ],
      commonMistakes: [
        'Skipping sanctions screening for existing customers',
        'Not updating risk scores after new transactions',
        'Incomplete documentation of verification steps',
        'Approving high-risk customers without EDD'
      ]
    },
    isActive: true
  });

  await kycCase.save();
  console.log('[Seed] Demo KYC case created');
  return kycCase;
}

export async function seedAllDemoData() {
  console.log('[Seed] Starting demo data seeding...');
  
  const results = {
    tenancyDeal: await seedDemoTenancyDeal(),
    offPlanDeal: await seedDemoOffPlanDeal(),
    secondaryDeal: await seedDemoSecondaryDeal(),
    kycCase: await seedDemoKYCCase()
  };
  
  console.log('[Seed] Demo data seeding complete!');
  return results;
}

export default {
  seedDemoTenancyDeal,
  seedDemoOffPlanDeal,
  seedDemoSecondaryDeal,
  seedDemoKYCCase,
  seedAllDemoData
};
