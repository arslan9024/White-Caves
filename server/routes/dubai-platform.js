import express from 'express';
import UserType from '../models/UserType.js';
import ServiceCatalog from '../models/ServiceCatalog.js';
import DubaiCommunity from '../models/DubaiCommunity.js';
import AMLRiskAssessment from '../models/AMLRiskAssessment.js';
import Commission from '../models/Commission.js';

const router = express.Router();

// ==================== USER TYPES ====================

router.get('/user-types', async (req, res) => {
  try {
    const { tier, category } = req.query;
    const filter = { isActive: true };
    if (tier) filter.tier = tier;
    if (category) filter.category = category;
    
    const userTypes = await UserType.find(filter).sort('typeCode');
    res.json({ success: true, count: userTypes.length, data: userTypes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/user-types/:code', async (req, res) => {
  try {
    const userType = await UserType.findOne({ typeCode: req.params.code });
    if (!userType) return res.status(404).json({ success: false, error: 'User type not found' });
    res.json({ success: true, data: userType });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/user-types', async (req, res) => {
  try {
    const userType = await UserType.create(req.body);
    res.status(201).json({ success: true, data: userType });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== SERVICE CATALOG ====================

router.get('/services', async (req, res) => {
  try {
    const { category, tier, amlRequired } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (tier) filter['eligibility.minimumTier'] = tier;
    if (amlRequired !== undefined) filter['dubaiCompliance.amlCheckRequired'] = amlRequired === 'true';
    
    const services = await ServiceCatalog.find(filter).sort('displayOrder serviceId');
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const service = await ServiceCatalog.findOne({ serviceId: req.params.id });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/services/category/:category', async (req, res) => {
  try {
    const services = await ServiceCatalog.find({ 
      category: req.params.category,
      isActive: true 
    }).sort('displayOrder');
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const service = await ServiceCatalog.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== DUBAI COMMUNITIES ====================

router.get('/communities', async (req, res) => {
  try {
    const { tier, freehold, minYield, lifestyle } = req.query;
    const filter = { isActive: true };
    if (tier) filter.tier = tier;
    if (freehold !== undefined) filter['regulations.freeholdAvailable'] = freehold === 'true';
    if (minYield) filter['marketData.rentalYieldPercent'] = { $gte: parseFloat(minYield) };
    if (lifestyle) filter['lifestyle.vibe'] = lifestyle;
    
    const communities = await DubaiCommunity.find(filter).sort('tier communityName');
    res.json({ success: true, count: communities.length, data: communities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/communities/:id', async (req, res) => {
  try {
    const community = await DubaiCommunity.findOne({ communityId: req.params.id });
    if (!community) return res.status(404).json({ success: false, error: 'Community not found' });
    res.json({ success: true, data: community });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/communities/tier/:tier', async (req, res) => {
  try {
    const communities = await DubaiCommunity.find({ 
      tier: req.params.tier,
      isActive: true 
    }).sort('communityName');
    res.json({ success: true, count: communities.length, data: communities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/communities/recommendations/:userType', async (req, res) => {
  try {
    const scoreField = {
      investor: 'aiRecommendationScore.forInvestors',
      family: 'aiRecommendationScore.forFamilies',
      young_professional: 'aiRecommendationScore.forYoungProfessionals',
      retiree: 'aiRecommendationScore.forRetirees',
      luxury: 'aiRecommendationScore.forLuxurySeekers'
    }[req.params.userType] || 'aiRecommendationScore.forInvestors';
    
    const communities = await DubaiCommunity.find({ isActive: true })
      .sort({ [scoreField]: -1 })
      .limit(10);
    res.json({ success: true, count: communities.length, data: communities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/communities', async (req, res) => {
  try {
    const community = await DubaiCommunity.create(req.body);
    res.status(201).json({ success: true, data: community });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== AML RISK ASSESSMENT ====================

router.post('/aml/assess', async (req, res) => {
  try {
    const { entityType, entityId, entityName, transactionType, transactionValue, checks } = req.body;
    
    const assessmentId = `AML-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const assessment = new AMLRiskAssessment({
      assessmentId,
      entityType,
      entityId,
      entityName,
      transactionType,
      transactionValue,
      dubaiSpecificChecks: checks || {}
    });
    
    assessment.calculateRiskScore();
    
    if (assessment.riskScore >= 70) {
      assessment.goAMLReporting.reportRequired = true;
      assessment.enhancedDueDiligence.required = true;
    }
    
    if (assessment.riskScore < 25) {
      assessment.autoApproved = true;
      assessment.reviewStatus = 'approved';
    }
    
    await assessment.save();
    
    res.status(201).json({ 
      success: true, 
      data: {
        assessmentId: assessment.assessmentId,
        riskScore: assessment.riskScore,
        riskLevel: assessment.riskLevel,
        autoApproved: assessment.autoApproved,
        eddRequired: assessment.enhancedDueDiligence.required,
        goAMLRequired: assessment.goAMLReporting.reportRequired
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/aml/quick-score', async (req, res) => {
  try {
    const { amount, isCash, isPEP, nationality, priceDeviation, monthsSincePurchase } = req.body;
    
    let score = 0;
    const factors = [];
    
    if (amount > 2000000) {
      score += 30;
      factors.push({ factor: 'High value transaction (>AED 2M)', score: 30 });
    }
    
    if (isCash && amount > 55000) {
      score += 40;
      factors.push({ factor: 'Cash transaction exceeds AED 55K threshold', score: 40 });
    }
    
    if (isPEP) {
      score += 25;
      factors.push({ factor: 'Politically Exposed Person (PEP)', score: 25 });
    }
    
    const highRiskCountries = ['Iran', 'Syria', 'Yemen', 'North Korea', 'Russia', 'Belarus'];
    if (highRiskCountries.includes(nationality)) {
      score += 35;
      factors.push({ factor: `High-risk nationality: ${nationality}`, score: 35 });
    }
    
    if (Math.abs(priceDeviation || 0) > 25) {
      score += 20;
      factors.push({ factor: `Price deviation >25% from market value`, score: 20 });
    }
    
    if (monthsSincePurchase && monthsSincePurchase < 6) {
      score += 20;
      factors.push({ factor: 'Property flipping (<6 months ownership)', score: 20 });
    }
    
    const finalScore = Math.min(100, score);
    let riskLevel = 'low';
    if (finalScore >= 70) riskLevel = 'critical';
    else if (finalScore >= 50) riskLevel = 'high';
    else if (finalScore >= 25) riskLevel = 'medium';
    
    res.json({
      success: true,
      data: {
        riskScore: finalScore,
        riskLevel,
        factors,
        eddRequired: finalScore >= 50,
        goAMLRequired: finalScore >= 70,
        recommendation: finalScore >= 70 ? 'Block transaction pending review' :
                       finalScore >= 50 ? 'Enhanced due diligence required' :
                       finalScore >= 25 ? 'Standard verification' : 'Auto-approve eligible'
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/aml/:assessmentId', async (req, res) => {
  try {
    const assessment = await AMLRiskAssessment.findOne({ assessmentId: req.params.assessmentId });
    if (!assessment) return res.status(404).json({ success: false, error: 'Assessment not found' });
    res.json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== COMMISSION CALCULATOR ====================

router.post('/commission/calculate', async (req, res) => {
  try {
    const { 
      transactionValue, 
      transactionType = 'sale',
      baseRate = 2,
      agentSharePercent = 50,
      tier = 'standard',
      adjustments = []
    } = req.body;
    
    let effectiveRate = baseRate;
    const tierAdjustments = {
      ultra_prime: 0.5,
      luxury: 0.25,
      premium: 0,
      standard: 0
    };
    effectiveRate += (tierAdjustments[tier] || 0);
    
    adjustments.forEach(adj => {
      effectiveRate += adj.percentage;
    });
    
    const grossCommission = transactionValue * (effectiveRate / 100);
    const vatRate = 5;
    const vatAmount = grossCommission * (vatRate / 100);
    const netCommission = grossCommission + vatAmount;
    
    const companyShare = grossCommission * ((100 - agentSharePercent) / 100);
    const agentShare = grossCommission * (agentSharePercent / 100);
    
    res.json({
      success: true,
      data: {
        transactionValue,
        transactionType,
        tier,
        effectiveRate: effectiveRate.toFixed(2) + '%',
        grossCommission: Math.round(grossCommission),
        vatAmount: Math.round(vatAmount),
        netCommission: Math.round(netCommission),
        splits: {
          company: {
            percentage: 100 - agentSharePercent,
            amount: Math.round(companyShare)
          },
          agent: {
            percentage: agentSharePercent,
            amount: Math.round(agentShare)
          }
        },
        breakdown: {
          baseRate: baseRate + '%',
          tierAdjustment: (tierAdjustments[tier] || 0) + '%',
          customAdjustments: adjustments
        }
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/commission/create', async (req, res) => {
  try {
    const commissionId = `COM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const commission = new Commission({ ...req.body, commissionId });
    commission.calculateCommission();
    await commission.save();
    res.status(201).json({ success: true, data: commission });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/commission/:id', async (req, res) => {
  try {
    const commission = await Commission.findOne({ commissionId: req.params.id });
    if (!commission) return res.status(404).json({ success: false, error: 'Commission not found' });
    res.json({ success: true, data: commission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== LEAD SCORING ====================

router.post('/lead-score', async (req, res) => {
  try {
    const {
      budgetAED,
      urgency = 'later',
      viewedProperties = 0,
      savedProperties = 0,
      inquiriesSent = 0,
      hasPreApproval = false,
      isVerified = false,
      responseRate = 0,
      propertyType,
      preferredCommunities = []
    } = req.body;
    
    let score = 0;
    const factors = [];
    
    if (budgetAED > 50000000) {
      score += 40;
      factors.push({ factor: 'Ultra high budget (>AED 50M)', score: 40 });
    } else if (budgetAED > 10000000) {
      score += 30;
      factors.push({ factor: 'High budget (>AED 10M)', score: 30 });
    } else if (budgetAED > 3000000) {
      score += 20;
      factors.push({ factor: 'Good budget (>AED 3M)', score: 20 });
    } else if (budgetAED > 1000000) {
      score += 10;
      factors.push({ factor: 'Standard budget (>AED 1M)', score: 10 });
    }
    
    if (urgency === 'immediate' || urgency === 'now') {
      score += 35;
      factors.push({ factor: 'Immediate purchase intent', score: 35 });
    } else if (urgency === '3months' || urgency === 'soon') {
      score += 20;
      factors.push({ factor: 'Near-term intent (3 months)', score: 20 });
    } else if (urgency === '6months') {
      score += 10;
      factors.push({ factor: 'Medium-term intent (6 months)', score: 10 });
    }
    
    if (viewedProperties > 15) {
      score += 15;
      factors.push({ factor: 'High engagement (15+ properties viewed)', score: 15 });
    } else if (viewedProperties > 5) {
      score += 8;
      factors.push({ factor: 'Good engagement (5+ properties viewed)', score: 8 });
    }
    
    if (hasPreApproval) {
      score += 20;
      factors.push({ factor: 'Mortgage pre-approval', score: 20 });
    }
    
    if (isVerified) {
      score += 10;
      factors.push({ factor: 'UAE PASS verified', score: 10 });
    }
    
    if (inquiriesSent > 3) {
      score += 10;
      factors.push({ factor: 'Multiple inquiries sent', score: 10 });
    }
    
    if (savedProperties > 5) {
      score += 5;
      factors.push({ factor: 'Active saver', score: 5 });
    }
    
    const primeCommunitiesMatch = preferredCommunities.filter(c => 
      ['Palm Jumeirah', 'Emirates Hills', 'Downtown Dubai', 'Dubai Marina'].includes(c)
    ).length;
    if (primeCommunitiesMatch > 0) {
      score += 5;
      factors.push({ factor: 'Prime community interest', score: 5 });
    }
    
    const finalScore = Math.min(100, score);
    let hotness = 'cold';
    if (finalScore >= 80) hotness = 'hot';
    else if (finalScore >= 60) hotness = 'warm';
    else if (finalScore >= 40) hotness = 'lukewarm';
    
    let priority = 'low';
    if (finalScore >= 70) priority = 'high';
    else if (finalScore >= 50) priority = 'medium';
    
    res.json({
      success: true,
      data: {
        leadScore: finalScore,
        hotness,
        priority,
        factors,
        recommendedAction: finalScore >= 80 ? 'Assign senior agent immediately' :
                          finalScore >= 60 ? 'Follow up within 24 hours' :
                          finalScore >= 40 ? 'Add to nurture campaign' : 'Monitor engagement',
        aiAssistantSuggestion: finalScore >= 80 ? 'Zoe (Executive Concierge)' :
                               finalScore >= 60 ? 'Clara (Client Relations)' :
                               finalScore >= 40 ? 'Oscar (Marketing)' : 'Automated nurture'
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
