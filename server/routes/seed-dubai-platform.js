import express from 'express';
import UserType from '../models/UserType.js';
import ServiceCatalog from '../models/ServiceCatalog.js';
import DubaiCommunity from '../models/DubaiCommunity.js';

const router = express.Router();

router.post('/seed-all', async (req, res) => {
  try {
    const results = {
      userTypes: await seedUserTypes(),
      services: await seedServices(),
      communities: await seedCommunities()
    };
    
    res.json({
      success: true,
      message: 'Dubai platform data seeded successfully',
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function seedUserTypes() {
  await UserType.deleteMany({});
  
  const userTypes = [
    {
      typeCode: 'UT-001',
      typeName: 'UHNWI Investor',
      category: 'investor',
      tier: 'uhnwi',
      profile: {
        netWorthRange: { min: 500000000, max: null },
        propertyPortfolioSize: { min: 10, max: null },
        transactionFrequency: '3-5 transactions/year',
        averageTransactionValue: 50000000,
        typicalProperties: ['Palm Jumeirah villas', 'Emirates Hills estates', 'Burj Khalifa penthouses'],
        decisionTimeWeeks: { min: 2, max: 4 },
        financingRequired: false
      },
      serviceExpectations: {
        level: 'white-glove',
        responseTimeSLA: 30,
        dedicatedSupport: true,
        availability: '24/7/365'
      },
      securityRequirements: {
        encryptionLevel: 'military',
        authenticationMethod: ['biometric', 'hardware_token', 'uae_pass'],
        dataSovereignty: 'UAE sovereign cloud'
      },
      aiAssistantAllocation: [
        { assistantId: 'zoe', assistantName: 'Zoe', role: 'primary' },
        { assistantId: 'sage', assistantName: 'Sage', role: 'secondary' },
        { assistantId: 'theodora', assistantName: 'Theodora', role: 'specialist' },
        { assistantId: 'henry', assistantName: 'Henry', role: 'specialist' },
        { assistantId: 'sophia', assistantName: 'Sophia', role: 'specialist' }
      ],
      requiredIntegrations: ['UAE Central Bank API', 'DIFC Registry', 'Private Banking APIs'],
      dubaiSpecificFeatures: {
        uaePassRequired: true,
        reraComplianceLevel: 'platinum',
        preferredCommunities: ['Emirates Hills', 'Palm Jumeirah', 'District One']
      }
    },
    {
      typeCode: 'UT-002',
      typeName: 'HNWI Investor',
      category: 'investor',
      tier: 'hnwi',
      profile: {
        netWorthRange: { min: 50000000, max: 500000000 },
        propertyPortfolioSize: { min: 3, max: 8 },
        transactionFrequency: '1-2 transactions/year',
        averageTransactionValue: 25000000,
        typicalProperties: ['Dubai Marina penthouses', 'Jumeirah Golf Estates villas'],
        decisionTimeWeeks: { min: 4, max: 8 },
        financingRequired: false
      },
      serviceExpectations: {
        level: 'premium',
        responseTimeSLA: 60,
        dedicatedSupport: true,
        availability: 'Business hours + on-call'
      },
      aiAssistantAllocation: [
        { assistantId: 'clara', assistantName: 'Clara', role: 'primary' },
        { assistantId: 'sage', assistantName: 'Sage', role: 'secondary' }
      ],
      dubaiSpecificFeatures: {
        uaePassRequired: true,
        reraComplianceLevel: 'gold',
        preferredCommunities: ['Dubai Marina', 'Downtown Dubai', 'Business Bay']
      }
    },
    {
      typeCode: 'UT-003',
      typeName: 'Aspirational Luxury Buyer',
      category: 'buyer',
      tier: 'premium',
      profile: {
        incomeRange: { min: 1000000, max: 5000000 },
        netWorthRange: { min: 3000000, max: 10000000 },
        transactionFrequency: 'First-time or upgrade',
        averageTransactionValue: 5000000,
        typicalProperties: ['Marina apartments', 'Downtown apartments', 'Townhouses'],
        decisionTimeWeeks: { min: 12, max: 24 },
        financingRequired: true,
        financingPercentage: 60
      },
      serviceExpectations: {
        level: 'personalized',
        responseTimeSLA: 120,
        dedicatedSupport: false,
        availability: 'Business hours'
      },
      aiAssistantAllocation: [
        { assistantId: 'clara', assistantName: 'Clara', role: 'primary' },
        { assistantId: 'oscar', assistantName: 'Oscar', role: 'secondary' }
      ],
      dubaiSpecificFeatures: {
        uaePassRequired: true,
        reraComplianceLevel: 'standard',
        preferredCommunities: ['JVC', 'Dubai Hills', 'Arabian Ranches']
      }
    },
    {
      typeCode: 'UT-004',
      typeName: 'Premium Tenant',
      category: 'tenant',
      tier: 'premium',
      profile: {
        incomeRange: { min: 500000, max: 2000000 },
        transactionFrequency: 'Annual renewal',
        averageTransactionValue: 250000,
        typicalProperties: ['2-3 bed apartments', 'Villas'],
        decisionTimeWeeks: { min: 2, max: 4 }
      },
      serviceExpectations: {
        level: 'personalized',
        responseTimeSLA: 240,
        dedicatedSupport: false
      },
      aiAssistantAllocation: [
        { assistantId: 'daisy', assistantName: 'Daisy', role: 'primary' }
      ],
      dubaiSpecificFeatures: {
        uaePassRequired: true,
        reraComplianceLevel: 'standard',
        preferredCommunities: ['Dubai Marina', 'JBR', 'Downtown']
      }
    },
    {
      typeCode: 'UT-005',
      typeName: 'Property Owner/Landlord',
      category: 'owner',
      tier: 'premium',
      profile: {
        propertyPortfolioSize: { min: 1, max: 10 },
        transactionFrequency: 'Ongoing management',
        averageTransactionValue: 150000
      },
      serviceExpectations: {
        level: 'personalized',
        responseTimeSLA: 120,
        dedicatedSupport: false
      },
      aiAssistantAllocation: [
        { assistantId: 'nancy', assistantName: 'Nancy', role: 'primary' },
        { assistantId: 'theodora', assistantName: 'Theodora', role: 'specialist' }
      ],
      dubaiSpecificFeatures: {
        uaePassRequired: true,
        reraComplianceLevel: 'standard'
      }
    },
    {
      typeCode: 'UT-006',
      typeName: 'Luxury Property Developer',
      category: 'developer',
      tier: 'hnwi',
      profile: {
        transactionFrequency: 'Bulk listings',
        averageTransactionValue: 100000000
      },
      serviceExpectations: {
        level: 'premium',
        responseTimeSLA: 60,
        dedicatedSupport: true
      },
      aiAssistantAllocation: [
        { assistantId: 'oscar', assistantName: 'Oscar', role: 'primary' },
        { assistantId: 'mary', assistantName: 'Mary', role: 'secondary' }
      ],
      dubaiSpecificFeatures: {
        uaePassRequired: true,
        reraComplianceLevel: 'developer'
      }
    },
    {
      typeCode: 'UT-007',
      typeName: 'Institutional/Corporate Client',
      category: 'corporate',
      tier: 'hnwi',
      profile: {
        transactionFrequency: 'Portfolio transactions',
        averageTransactionValue: 200000000
      },
      serviceExpectations: {
        level: 'white-glove',
        responseTimeSLA: 60,
        dedicatedSupport: true
      },
      aiAssistantAllocation: [
        { assistantId: 'zoe', assistantName: 'Zoe', role: 'primary' },
        { assistantId: 'henry', assistantName: 'Henry', role: 'specialist' }
      ],
      dubaiSpecificFeatures: {
        uaePassRequired: true,
        reraComplianceLevel: 'corporate'
      }
    },
    {
      typeCode: 'UT-008',
      typeName: 'External Real Estate Agent',
      category: 'agent',
      tier: 'standard',
      profile: {
        transactionFrequency: 'Multiple per month'
      },
      serviceExpectations: {
        level: 'standard',
        responseTimeSLA: 240,
        dedicatedSupport: false
      },
      aiAssistantAllocation: [
        { assistantId: 'clara', assistantName: 'Clara', role: 'primary' }
      ],
      dubaiSpecificFeatures: {
        uaePassRequired: true,
        reraComplianceLevel: 'broker'
      }
    },
    {
      typeCode: 'UT-009',
      typeName: 'AI-Assisted Relationship Manager',
      category: 'staff',
      tier: 'standard',
      serviceExpectations: {
        level: 'self-service'
      },
      aiAssistantAllocation: [
        { assistantId: 'aurora', assistantName: 'Aurora', role: 'primary' }
      ]
    },
    {
      typeCode: 'UT-010',
      typeName: 'Portfolio Optimization Specialist',
      category: 'staff',
      tier: 'standard',
      aiAssistantAllocation: [
        { assistantId: 'sage', assistantName: 'Sage', role: 'primary' }
      ]
    },
    {
      typeCode: 'UT-011',
      typeName: 'AI Growth Hacker',
      category: 'staff',
      tier: 'standard',
      aiAssistantAllocation: [
        { assistantId: 'oscar', assistantName: 'Oscar', role: 'primary' }
      ]
    },
    {
      typeCode: 'UT-012',
      typeName: 'Compliance Automation Specialist',
      category: 'staff',
      tier: 'standard',
      aiAssistantAllocation: [
        { assistantId: 'henry', assistantName: 'Henry', role: 'primary' },
        { assistantId: 'laila', assistantName: 'Laila', role: 'secondary' }
      ]
    },
    {
      typeCode: 'UT-013',
      typeName: 'AI Trainer & QA Specialist',
      category: 'staff',
      tier: 'standard',
      aiAssistantAllocation: [
        { assistantId: 'aurora', assistantName: 'Aurora', role: 'primary' }
      ]
    },
    {
      typeCode: 'UT-014',
      typeName: 'Data Scientist',
      category: 'staff',
      tier: 'standard',
      aiAssistantAllocation: [
        { assistantId: 'sage', assistantName: 'Sage', role: 'primary' }
      ]
    },
    {
      typeCode: 'UT-015',
      typeName: 'Executive/Manager',
      category: 'staff',
      tier: 'premium',
      aiAssistantAllocation: [
        { assistantId: 'zoe', assistantName: 'Zoe', role: 'primary' },
        { assistantId: 'theodora', assistantName: 'Theodora', role: 'secondary' }
      ]
    }
  ];
  
  const created = await UserType.insertMany(userTypes);
  return { count: created.length, message: `Created ${created.length} user types` };
}

async function seedServices() {
  await ServiceCatalog.deleteMany({});
  
  const services = [
    // Transaction & Agency Services
    {
      serviceId: 'SVC-001',
      serviceName: 'Ultra-Prime Property Sales (AED 50M+)',
      category: 'transaction_agency',
      subcategory: 'Sales',
      description: 'White-glove sales service for ultra-prime properties',
      department: 'Sales',
      pricing: { type: 'percentage', percentageRate: 2, minimumFee: 750000, currency: 'AED' },
      duration: { minDays: 60, maxDays: 90, averageDays: 75 },
      eligibility: { userTypes: ['UT-001', 'UT-002'], minimumTier: 'uhnwi', propertyValueMin: 50000000 },
      aiAssistants: [
        { assistantId: 'zoe', assistantName: 'Zoe', role: 'primary' },
        { assistantId: 'clara', assistantName: 'Clara', role: 'secondary' }
      ],
      dubaiCompliance: { reraRequired: true, dldIntegration: true, amlCheckRequired: true, uaePassRequired: true },
      displayOrder: 1
    },
    {
      serviceId: 'SVC-002',
      serviceName: 'Luxury Property Sales (AED 10-50M)',
      category: 'transaction_agency',
      subcategory: 'Sales',
      description: 'Premium sales service for luxury properties',
      pricing: { type: 'percentage', percentageRate: 2, minimumFee: 200000, currency: 'AED' },
      duration: { minDays: 45, maxDays: 75, averageDays: 60 },
      eligibility: { minimumTier: 'hnwi', propertyValueMin: 10000000 },
      dubaiCompliance: { reraRequired: true, dldIntegration: true, amlCheckRequired: true },
      displayOrder: 2
    },
    {
      serviceId: 'SVC-003',
      serviceName: 'Standard Property Sales (AED 1-10M)',
      category: 'transaction_agency',
      subcategory: 'Sales',
      description: 'Full-service sales for standard luxury properties',
      pricing: { type: 'percentage', percentageRate: 2, minimumFee: 20000, currency: 'AED' },
      duration: { minDays: 30, maxDays: 60, averageDays: 45 },
      eligibility: { minimumTier: 'premium', propertyValueMin: 1000000 },
      dubaiCompliance: { reraRequired: true, dldIntegration: true, amlCheckRequired: true },
      displayOrder: 3
    },
    {
      serviceId: 'SVC-004',
      serviceName: 'Off-Plan Property Sales',
      category: 'transaction_agency',
      subcategory: 'Off-Plan',
      description: 'Off-plan property sales with developer coordination',
      pricing: { type: 'percentage', percentageRate: 3, currency: 'AED' },
      duration: { minDays: 14, maxDays: 30, averageDays: 21 },
      dubaiCompliance: { reraRequired: true, amlCheckRequired: true },
      displayOrder: 4
    },
    {
      serviceId: 'SVC-005',
      serviceName: 'Property Acquisition Advisory',
      category: 'transaction_agency',
      subcategory: 'Buying',
      description: 'Buyer representation and acquisition services',
      pricing: { type: 'percentage', percentageRate: 2, currency: 'AED' },
      duration: { minDays: 30, maxDays: 90, averageDays: 60 },
      dubaiCompliance: { reraRequired: true, amlCheckRequired: true },
      displayOrder: 5
    },
    // Leasing Services
    {
      serviceId: 'SVC-010',
      serviceName: 'Premium Residential Leasing',
      category: 'transaction_agency',
      subcategory: 'Leasing',
      description: 'Full-service residential leasing with tenant screening',
      pricing: { type: 'percentage', percentageRate: 5, currency: 'AED' },
      duration: { minDays: 7, maxDays: 30, averageDays: 14 },
      dubaiCompliance: { reraRequired: true, ejariRequired: true },
      aiAssistants: [{ assistantId: 'daisy', assistantName: 'Daisy', role: 'primary' }],
      displayOrder: 10
    },
    {
      serviceId: 'SVC-011',
      serviceName: 'Commercial Leasing',
      category: 'transaction_agency',
      subcategory: 'Leasing',
      description: 'Commercial property leasing services',
      pricing: { type: 'percentage', percentageRate: 5, currency: 'AED' },
      duration: { minDays: 14, maxDays: 60, averageDays: 30 },
      dubaiCompliance: { reraRequired: true },
      displayOrder: 11
    },
    // Property Management
    {
      serviceId: 'SVC-020',
      serviceName: 'Full Property Management',
      category: 'property_management',
      description: 'Complete property management including tenant relations, maintenance, and accounting',
      pricing: { type: 'percentage', percentageRate: 8, currency: 'AED' },
      duration: { minDays: 365, averageDays: 365 },
      aiAssistants: [{ assistantId: 'nancy', assistantName: 'Nancy', role: 'primary' }],
      displayOrder: 20
    },
    {
      serviceId: 'SVC-021',
      serviceName: 'Rent Collection Service',
      category: 'property_management',
      description: 'Automated rent collection and payment tracking',
      pricing: { type: 'percentage', percentageRate: 3, currency: 'AED' },
      displayOrder: 21
    },
    {
      serviceId: 'SVC-022',
      serviceName: 'Maintenance Coordination',
      category: 'property_management',
      description: '24/7 maintenance request handling and vendor management',
      pricing: { type: 'fixed', amount: 5000, currency: 'AED' },
      displayOrder: 22
    },
    // Legal & Compliance
    {
      serviceId: 'SVC-030',
      serviceName: 'RERA Title Deed Transfer',
      category: 'legal_compliance',
      description: 'Complete title deed transfer with DLD coordination',
      pricing: { type: 'fixed', amount: 8500, currency: 'AED' },
      duration: { minDays: 10, maxDays: 21, averageDays: 14 },
      dubaiCompliance: { reraRequired: true, dldIntegration: true, amlCheckRequired: true },
      aiAssistants: [{ assistantId: 'sophia', assistantName: 'Sophia', role: 'primary' }],
      displayOrder: 30
    },
    {
      serviceId: 'SVC-031',
      serviceName: 'Ejari Registration',
      category: 'legal_compliance',
      description: 'Ejari tenancy contract registration',
      pricing: { type: 'fixed', amount: 500, currency: 'AED' },
      duration: { minDays: 1, maxDays: 3, averageDays: 1 },
      dubaiCompliance: { ejariRequired: true },
      displayOrder: 31
    },
    {
      serviceId: 'SVC-032',
      serviceName: 'NOC Processing',
      category: 'legal_compliance',
      description: 'No Objection Certificate processing from developers',
      pricing: { type: 'fixed', amount: 2500, currency: 'AED' },
      duration: { minDays: 3, maxDays: 14, averageDays: 7 },
      displayOrder: 32
    },
    {
      serviceId: 'SVC-033',
      serviceName: 'AML/KYC Verification',
      category: 'legal_compliance',
      description: 'Full anti-money laundering and know your customer verification',
      pricing: { type: 'fixed', amount: 3000, currency: 'AED' },
      duration: { minDays: 2, maxDays: 7, averageDays: 3 },
      dubaiCompliance: { amlCheckRequired: true },
      aiAssistants: [{ assistantId: 'henry', assistantName: 'Henry', role: 'primary' }],
      displayOrder: 33
    },
    // Financial Services
    {
      serviceId: 'SVC-040',
      serviceName: 'Mortgage Pre-Approval Coordination',
      category: 'financial_services',
      description: 'Coordination with 8+ UAE banks for mortgage pre-approval',
      pricing: { type: 'on_request' },
      duration: { minDays: 7, maxDays: 21, averageDays: 10 },
      aiAssistants: [{ assistantId: 'theodora', assistantName: 'Theodora', role: 'primary' }],
      displayOrder: 40
    },
    {
      serviceId: 'SVC-041',
      serviceName: 'Property Valuation',
      category: 'financial_services',
      description: 'Professional property valuation with market analysis',
      pricing: { type: 'fixed', amount: 3500, currency: 'AED' },
      duration: { minDays: 3, maxDays: 7, averageDays: 5 },
      displayOrder: 41
    },
    {
      serviceId: 'SVC-042',
      serviceName: 'Investment Analysis Report',
      category: 'financial_services',
      description: 'Comprehensive investment analysis with ROI projections',
      pricing: { type: 'fixed', amount: 5000, currency: 'AED' },
      duration: { minDays: 5, maxDays: 10, averageDays: 7 },
      aiAssistants: [{ assistantId: 'sage', assistantName: 'Sage', role: 'primary' }],
      displayOrder: 42
    },
    // Marketing & Media
    {
      serviceId: 'SVC-050',
      serviceName: 'Professional Photography Package',
      category: 'marketing_media',
      description: 'Professional real estate photography (30+ images)',
      pricing: { type: 'fixed', amount: 2500, currency: 'AED' },
      duration: { minDays: 2, maxDays: 5, averageDays: 3 },
      displayOrder: 50
    },
    {
      serviceId: 'SVC-051',
      serviceName: 'Drone Videography',
      category: 'marketing_media',
      description: 'Aerial drone footage with professional editing',
      pricing: { type: 'fixed', amount: 4000, currency: 'AED' },
      duration: { minDays: 3, maxDays: 7, averageDays: 5 },
      displayOrder: 51
    },
    {
      serviceId: 'SVC-052',
      serviceName: '3D Virtual Tour (Matterport)',
      category: 'marketing_media',
      description: 'Interactive 3D virtual tour with Matterport technology',
      pricing: { type: 'fixed', amount: 3000, currency: 'AED' },
      duration: { minDays: 3, maxDays: 7, averageDays: 4 },
      displayOrder: 52
    },
    {
      serviceId: 'SVC-053',
      serviceName: 'Digital Marketing Campaign',
      category: 'marketing_media',
      description: 'Targeted digital marketing across platforms',
      pricing: { type: 'fixed', priceRange: { min: 5000, max: 50000 }, currency: 'AED' },
      aiAssistants: [{ assistantId: 'oscar', assistantName: 'Oscar', role: 'primary' }],
      displayOrder: 53
    },
    // Concierge & Lifestyle
    {
      serviceId: 'SVC-060',
      serviceName: 'VIP Property Tours',
      category: 'concierge_lifestyle',
      description: 'Luxury vehicle tours with refreshments and dedicated agent',
      pricing: { type: 'fixed', amount: 1500, currency: 'AED' },
      eligibility: { minimumTier: 'hnwi' },
      aiAssistants: [{ assistantId: 'zoe', assistantName: 'Zoe', role: 'primary' }],
      displayOrder: 60
    },
    {
      serviceId: 'SVC-061',
      serviceName: 'Relocation Assistance',
      category: 'concierge_lifestyle',
      description: 'Full relocation support including moving and setup',
      pricing: { type: 'on_request' },
      displayOrder: 61
    },
    {
      serviceId: 'SVC-062',
      serviceName: 'Interior Design Consultation',
      category: 'concierge_lifestyle',
      description: 'Premium interior design consultation and coordination',
      pricing: { type: 'on_request' },
      displayOrder: 62
    }
  ];
  
  const created = await ServiceCatalog.insertMany(services);
  return { count: created.length, message: `Created ${created.length} services` };
}

async function seedCommunities() {
  await DubaiCommunity.deleteMany({});
  
  const communities = [
    // Super Prime
    {
      communityId: 'COM-001',
      communityName: 'Emirates Hills',
      arabicName: 'إمارات هيلز',
      tier: 'super_prime',
      location: {
        district: 'Emirates Living',
        area: 'Emirates Hills',
        coordinates: { lat: 25.0657, lng: 55.1666 },
        nearestMetro: 'Internet City',
        distanceToMetroKm: 5,
        nearestMall: 'Mall of the Emirates',
        nearestBeachKm: 8,
        distanceToAirportKm: 35,
        distanceToDowntownKm: 18
      },
      propertyTypes: [
        { type: 'villa', available: true, priceRangeAED: { min: 25000000, max: 300000000 } }
      ],
      marketData: {
        averagePricePerSqFt: 2800,
        rentalYieldPercent: 3.5,
        priceGrowthYoY: 12,
        averageDaysOnMarket: 120,
        demandIndex: 95,
        lastUpdated: new Date()
      },
      demographics: {
        primaryNationalities: ['UAE', 'UK', 'India', 'Pakistan'],
        averageHouseholdIncome: 5000000,
        familyFriendly: true,
        expatFriendly: true,
        investorPopular: true
      },
      amenities: {
        schools: [
          { name: 'Dubai International Academy', curriculum: 'IB', rating: 5, distanceKm: 2 },
          { name: 'Emirates Hills School', curriculum: 'British', rating: 4.5, distanceKm: 1 }
        ],
        hospitals: [{ name: 'American Hospital Dubai', hospitalType: 'General', distanceKm: 10 }],
        malls: ['Mall of the Emirates'],
        parks: ['Emirates Hills Park'],
        golf: true,
        marina: false
      },
      lifestyle: {
        vibe: 'luxury',
        noiseLevel: 'very_quiet',
        walkability: 3,
        nightlife: false,
        petFriendly: true
      },
      developers: [{ developerName: 'Emaar', projectCount: 1, majorProjects: ['Emirates Hills'] }],
      serviceCharges: { averagePerSqFt: 3.5, range: { min: 3, max: 5 } },
      regulations: {
        freeholdAvailable: true,
        shortTermRentalAllowed: false,
        visaEligible: true,
        minimumInvestmentForVisa: 2000000
      },
      aiRecommendationScore: {
        forInvestors: 85,
        forFamilies: 95,
        forYoungProfessionals: 40,
        forRetirees: 90,
        forLuxurySeekers: 100
      }
    },
    {
      communityId: 'COM-002',
      communityName: 'Palm Jumeirah',
      arabicName: 'نخلة جميرا',
      tier: 'super_prime',
      location: {
        district: 'Palm Jumeirah',
        area: 'Palm Jumeirah',
        coordinates: { lat: 25.1124, lng: 55.1390 },
        nearestMetro: 'Palm Jumeirah Monorail',
        distanceToMetroKm: 0.5,
        nearestMall: 'Nakheel Mall',
        nearestBeachKm: 0,
        distanceToAirportKm: 40,
        distanceToDowntownKm: 25
      },
      propertyTypes: [
        { type: 'villa', available: true, priceRangeAED: { min: 15000000, max: 500000000 } },
        { type: 'apartment', available: true, priceRangeAED: { min: 2000000, max: 50000000 } },
        { type: 'penthouse', available: true, priceRangeAED: { min: 20000000, max: 200000000 } }
      ],
      marketData: {
        averagePricePerSqFt: 3200,
        rentalYieldPercent: 4.8,
        priceGrowthYoY: 15,
        averageDaysOnMarket: 45,
        demandIndex: 98,
        lastUpdated: new Date()
      },
      demographics: {
        primaryNationalities: ['UK', 'Russia', 'UAE', 'India'],
        averageHouseholdIncome: 3000000,
        familyFriendly: true,
        expatFriendly: true,
        investorPopular: true
      },
      lifestyle: {
        vibe: 'beachfront',
        noiseLevel: 'quiet',
        walkability: 5,
        nightlife: true,
        petFriendly: true
      },
      regulations: {
        freeholdAvailable: true,
        shortTermRentalAllowed: true,
        visaEligible: true,
        minimumInvestmentForVisa: 2000000
      },
      aiRecommendationScore: {
        forInvestors: 95,
        forFamilies: 85,
        forYoungProfessionals: 75,
        forRetirees: 80,
        forLuxurySeekers: 100
      }
    },
    // Prime
    {
      communityId: 'COM-010',
      communityName: 'Downtown Dubai',
      arabicName: 'وسط مدينة دبي',
      tier: 'prime',
      location: {
        district: 'Downtown',
        area: 'Downtown Dubai',
        coordinates: { lat: 25.1972, lng: 55.2744 },
        nearestMetro: 'Burj Khalifa/Dubai Mall',
        distanceToMetroKm: 0.3,
        nearestMall: 'Dubai Mall',
        nearestBeachKm: 15,
        distanceToAirportKm: 15,
        distanceToDowntownKm: 0
      },
      propertyTypes: [
        { type: 'apartment', available: true, priceRangeAED: { min: 1500000, max: 100000000 } },
        { type: 'penthouse', available: true, priceRangeAED: { min: 15000000, max: 300000000 } }
      ],
      marketData: {
        averagePricePerSqFt: 2500,
        rentalYieldPercent: 5.2,
        priceGrowthYoY: 10,
        averageDaysOnMarket: 30,
        demandIndex: 95,
        lastUpdated: new Date()
      },
      lifestyle: {
        vibe: 'urban',
        noiseLevel: 'busy',
        walkability: 9,
        nightlife: true,
        petFriendly: false
      },
      regulations: {
        freeholdAvailable: true,
        shortTermRentalAllowed: true,
        visaEligible: true,
        minimumInvestmentForVisa: 2000000
      },
      aiRecommendationScore: {
        forInvestors: 90,
        forFamilies: 60,
        forYoungProfessionals: 95,
        forRetirees: 50,
        forLuxurySeekers: 90
      }
    },
    {
      communityId: 'COM-011',
      communityName: 'Dubai Marina',
      arabicName: 'مرسى دبي',
      tier: 'prime',
      location: {
        district: 'Dubai Marina',
        area: 'Dubai Marina',
        coordinates: { lat: 25.0805, lng: 55.1403 },
        nearestMetro: 'Dubai Marina',
        distanceToMetroKm: 0.2,
        nearestMall: 'Marina Mall',
        nearestBeachKm: 0.5,
        distanceToAirportKm: 35,
        distanceToDowntownKm: 20
      },
      propertyTypes: [
        { type: 'apartment', available: true, priceRangeAED: { min: 800000, max: 30000000 } },
        { type: 'penthouse', available: true, priceRangeAED: { min: 10000000, max: 100000000 } }
      ],
      marketData: {
        averagePricePerSqFt: 1800,
        rentalYieldPercent: 6.1,
        priceGrowthYoY: 8,
        averageDaysOnMarket: 25,
        demandIndex: 92,
        lastUpdated: new Date()
      },
      lifestyle: {
        vibe: 'urban',
        noiseLevel: 'moderate',
        walkability: 8,
        nightlife: true,
        petFriendly: true
      },
      regulations: {
        freeholdAvailable: true,
        shortTermRentalAllowed: true,
        visaEligible: true,
        minimumInvestmentForVisa: 2000000
      },
      aiRecommendationScore: {
        forInvestors: 88,
        forFamilies: 65,
        forYoungProfessionals: 95,
        forRetirees: 55,
        forLuxurySeekers: 80
      }
    },
    {
      communityId: 'COM-012',
      communityName: 'Business Bay',
      arabicName: 'الخليج التجاري',
      tier: 'prime',
      location: {
        district: 'Business Bay',
        coordinates: { lat: 25.1860, lng: 55.2628 },
        nearestMetro: 'Business Bay',
        distanceToMetroKm: 0.3,
        distanceToDowntownKm: 2
      },
      propertyTypes: [
        { type: 'apartment', available: true, priceRangeAED: { min: 700000, max: 15000000 } }
      ],
      marketData: {
        averagePricePerSqFt: 1600,
        rentalYieldPercent: 6.5,
        priceGrowthYoY: 9,
        averageDaysOnMarket: 28,
        demandIndex: 88,
        lastUpdated: new Date()
      },
      lifestyle: {
        vibe: 'urban',
        noiseLevel: 'busy',
        walkability: 7,
        nightlife: true
      },
      regulations: {
        freeholdAvailable: true,
        shortTermRentalAllowed: true,
        visaEligible: true
      },
      aiRecommendationScore: {
        forInvestors: 90,
        forFamilies: 50,
        forYoungProfessionals: 90,
        forRetirees: 40,
        forLuxurySeekers: 70
      }
    },
    // Established
    {
      communityId: 'COM-020',
      communityName: 'Arabian Ranches',
      arabicName: 'المرابع العربية',
      tier: 'established',
      location: {
        district: 'Dubailand',
        coordinates: { lat: 25.0520, lng: 55.2633 },
        distanceToDowntownKm: 25
      },
      propertyTypes: [
        { type: 'villa', available: true, priceRangeAED: { min: 3000000, max: 25000000 } },
        { type: 'townhouse', available: true, priceRangeAED: { min: 2000000, max: 8000000 } }
      ],
      marketData: {
        averagePricePerSqFt: 1200,
        rentalYieldPercent: 5.0,
        priceGrowthYoY: 6,
        averageDaysOnMarket: 45,
        demandIndex: 82,
        lastUpdated: new Date()
      },
      lifestyle: {
        vibe: 'family',
        noiseLevel: 'quiet',
        walkability: 4,
        nightlife: false,
        petFriendly: true
      },
      regulations: {
        freeholdAvailable: true,
        shortTermRentalAllowed: false,
        visaEligible: true
      },
      aiRecommendationScore: {
        forInvestors: 75,
        forFamilies: 95,
        forYoungProfessionals: 40,
        forRetirees: 85,
        forLuxurySeekers: 60
      }
    },
    // Emerging
    {
      communityId: 'COM-030',
      communityName: 'Dubai Hills Estate',
      arabicName: 'دبي هيلز استيت',
      tier: 'emerging',
      location: {
        district: 'Mohammed Bin Rashid City',
        coordinates: { lat: 25.1128, lng: 55.2453 },
        distanceToDowntownKm: 12
      },
      propertyTypes: [
        { type: 'villa', available: true, priceRangeAED: { min: 4000000, max: 50000000 } },
        { type: 'apartment', available: true, priceRangeAED: { min: 1000000, max: 8000000 } },
        { type: 'townhouse', available: true, priceRangeAED: { min: 2500000, max: 6000000 } }
      ],
      marketData: {
        averagePricePerSqFt: 1400,
        rentalYieldPercent: 5.5,
        priceGrowthYoY: 12,
        averageDaysOnMarket: 35,
        demandIndex: 90,
        lastUpdated: new Date()
      },
      lifestyle: {
        vibe: 'family',
        noiseLevel: 'quiet',
        walkability: 5,
        nightlife: false,
        petFriendly: true
      },
      regulations: {
        freeholdAvailable: true,
        visaEligible: true
      },
      aiRecommendationScore: {
        forInvestors: 88,
        forFamilies: 90,
        forYoungProfessionals: 60,
        forRetirees: 75,
        forLuxurySeekers: 70
      }
    },
    {
      communityId: 'COM-031',
      communityName: 'Jumeirah Village Circle (JVC)',
      arabicName: 'قرية جميرا الدائرية',
      tier: 'emerging',
      location: {
        district: 'Jumeirah Village',
        coordinates: { lat: 25.0570, lng: 55.2078 },
        distanceToDowntownKm: 18
      },
      propertyTypes: [
        { type: 'apartment', available: true, priceRangeAED: { min: 400000, max: 3000000 } },
        { type: 'townhouse', available: true, priceRangeAED: { min: 1500000, max: 4000000 } }
      ],
      marketData: {
        averagePricePerSqFt: 850,
        rentalYieldPercent: 7.2,
        priceGrowthYoY: 10,
        averageDaysOnMarket: 20,
        demandIndex: 85,
        lastUpdated: new Date()
      },
      lifestyle: {
        vibe: 'family',
        noiseLevel: 'moderate',
        walkability: 4,
        petFriendly: true
      },
      regulations: {
        freeholdAvailable: true,
        shortTermRentalAllowed: true,
        visaEligible: true
      },
      aiRecommendationScore: {
        forInvestors: 92,
        forFamilies: 80,
        forYoungProfessionals: 75,
        forRetirees: 60,
        forLuxurySeekers: 40
      }
    },
    // Affordable
    {
      communityId: 'COM-040',
      communityName: 'Dubai South',
      arabicName: 'دبي الجنوب',
      tier: 'affordable',
      location: {
        district: 'Dubai South',
        coordinates: { lat: 24.8917, lng: 55.1517 },
        distanceToAirportKm: 5,
        distanceToDowntownKm: 40
      },
      propertyTypes: [
        { type: 'apartment', available: true, priceRangeAED: { min: 300000, max: 1500000 } },
        { type: 'townhouse', available: true, priceRangeAED: { min: 800000, max: 2500000 } }
      ],
      marketData: {
        averagePricePerSqFt: 650,
        rentalYieldPercent: 7.5,
        priceGrowthYoY: 8,
        averageDaysOnMarket: 35,
        demandIndex: 75,
        lastUpdated: new Date()
      },
      lifestyle: {
        vibe: 'mixed',
        noiseLevel: 'moderate'
      },
      regulations: {
        freeholdAvailable: true,
        visaEligible: true
      },
      aiRecommendationScore: {
        forInvestors: 85,
        forFamilies: 70,
        forYoungProfessionals: 65,
        forRetirees: 50,
        forLuxurySeekers: 20
      }
    }
  ];
  
  const created = await DubaiCommunity.insertMany(communities);
  return { count: created.length, message: `Created ${created.length} communities` };
}

router.get('/user-types', async (req, res) => {
  const userTypes = await UserType.find({}).sort('typeCode');
  res.json({ success: true, count: userTypes.length, data: userTypes });
});

router.get('/services', async (req, res) => {
  const services = await ServiceCatalog.find({}).sort('displayOrder');
  res.json({ success: true, count: services.length, data: services });
});

router.get('/communities', async (req, res) => {
  const communities = await DubaiCommunity.find({}).sort('tier communityName');
  res.json({ success: true, count: communities.length, data: communities });
});

export default router;
