export interface CommissionResult {
  agentPayout: number;
  companyRevenue: number;
  agentPercentage: number;
  tierName: string;
  isOnboardingActive: boolean;
}

export interface DealAttributionResult {
  agentAPayout: number;
  agentBPayout: number;
  companyRevenue: number;
  agentAPointsPct: number;
  agentBPointsPct: number;
  dealType: 'direct' | 'internal_split' | 'referral';
}

export interface LeaderboardAgent {
  id: string;
  name: string;
  tier: string;
  gwcRevenue: number;
  unitsTransacted: number;
  points: number;
  milestoneBadge?: string;
  voucherRewardAed?: number;
  uncappedRateLock?: number;
}

export const dubaiFinanceEngine = {
  getGlobalMetrics: () => {
    return {
      monthlyRevenue: 15400000,
      activeLeads: 342,
      hotLeads: 45,
      agentsOnline: 24,
      contractsInExecution: 12,
      complianceStatus: '100% RERA Compliant',
      dubaiMarketTrend: '+4.2% MoM',
    };
  },

  /**
   * White Caves Core Commission & Slab Waterfall Engine
   */
  calculateAgentPayout: (
    grossCommission: number,
    isOnboarding: boolean = false,
    monthlyRunRate: number = 0,
    serviceType: 'sales' | 'leasing' | 'pm' = 'sales'
  ): CommissionResult => {
    // Static 50/50 splits for leasing and property management
    if (serviceType === 'leasing' || serviceType === 'pm') {
      return {
        agentPayout: grossCommission * 0.5,
        companyRevenue: grossCommission * 0.5,
        agentPercentage: 0.5,
        tierName: 'Standard Static Split (50/50)',
        isOnboardingActive: false,
      };
    }

    let agentPercentage = 0.5;
    let tierName = 'Executive Consultant';

    if (isOnboarding) {
      agentPercentage = 0.7; // 180-day 70/30 Onboarding Support Buffer
      tierName = 'Accelerated Onboarding Support (70/30)';
    } else {
      if (monthlyRunRate >= 150000) {
        agentPercentage = 0.7; // Platinum Elite
        tierName = 'Platinum Elite (70/30)';
      } else if (monthlyRunRate >= 100000) {
        agentPercentage = 0.6; // Gold Producer
        tierName = 'Gold Producer (60/40)';
      } else if (monthlyRunRate >= 50000) {
        agentPercentage = 0.55; // Silver Producer
        tierName = 'Silver Producer (55/45)';
      } else {
        agentPercentage = 0.5; // Executive Consultant
        tierName = 'Executive Consultant (50/50)';
      }
    }

    const agentPayout = grossCommission * agentPercentage;
    const companyRevenue = grossCommission - agentPayout;

    return {
      agentPayout,
      companyRevenue,
      agentPercentage,
      tierName,
      isOnboardingActive: isOnboarding,
    };
  },

  /**
   * Multi-Agent Deal Splitting & Attribution Engine
   */
  calculateDealAttribution: (
    dealType: 'direct' | 'internal_split' | 'referral',
    grossCommission: number,
    agentATierPct: number = 0.5,
    agentBTierPct: number = 0.5
  ): DealAttributionResult => {
    if (dealType === 'direct') {
      const agentAPayout = grossCommission * agentATierPct;
      return {
        agentAPayout,
        agentBPayout: 0,
        companyRevenue: grossCommission - agentAPayout,
        agentAPointsPct: 100,
        agentBPointsPct: 0,
        dealType: 'direct',
      };
    }

    if (dealType === 'internal_split') {
      const halfGross = grossCommission / 2;
      const agentAPayout = halfGross * agentATierPct;
      const agentBPayout = halfGross * agentBTierPct;
      const companyRevenue = grossCommission - (agentAPayout + agentBPayout);

      return {
        agentAPayout,
        agentBPayout,
        companyRevenue,
        agentAPointsPct: 50,
        agentBPointsPct: 50,
        dealType: 'internal_split',
      };
    }

    // Referral Deal: Agent A (Referrer 10% points), Agent B (Closer 90% points)
    const referralFee = grossCommission * 0.1;
    const remainingGross = grossCommission - referralFee;
    const agentBPayout = remainingGross * agentBTierPct;

    return {
      agentAPayout: referralFee,
      agentBPayout,
      companyRevenue: grossCommission - (referralFee + agentBPayout),
      agentAPointsPct: 10,
      agentBPointsPct: 90,
      dealType: 'referral',
    };
  },

  /**
   * White Caves Dual-Track Apex Champions Leaderboard
   */
  getDualTrackLeaderboard: () => {
    const trackA_SalesElite: LeaderboardAgent[] = [
      {
        id: '1',
        name: 'Sarah Al Maktoum',
        tier: 'Platinum Elite',
        gwcRevenue: 4200000,
        unitsTransacted: 8,
        points: 4200,
        milestoneBadge: 'Cave Master of the Month',
        voucherRewardAed: 2500,
        uncappedRateLock: 0.75, // Chairman's Circle 75% Lock
      },
      {
        id: '2',
        name: 'Arsalan Malik',
        tier: 'Managing Director / Level 5',
        gwcRevenue: 3800000,
        unitsTransacted: 6,
        points: 3800,
        milestoneBadge: 'Principal Founder',
      },
      {
        id: '3',
        name: 'Omar Zayed',
        tier: 'Gold Producer',
        gwcRevenue: 2800000,
        unitsTransacted: 5,
        points: 2800,
        milestoneBadge: 'Elite Portfolio Director',
      },
      {
        id: '4',
        name: 'Laila Hassan',
        tier: 'Silver Producer',
        gwcRevenue: 1450000,
        unitsTransacted: 3,
        points: 1450,
      },
    ];

    const trackB_LeasingVolume: LeaderboardAgent[] = [
      {
        id: '101',
        name: 'Tariq Mansoor',
        tier: 'Leasing Specialist',
        gwcRevenue: 950000,
        unitsTransacted: 24,
        points: 2400,
        milestoneBadge: 'Leasing Density Champion',
      },
      {
        id: '102',
        name: 'Fatima Al Sayed',
        tier: 'Senior Leasing Advisor',
        gwcRevenue: 820000,
        unitsTransacted: 19,
        points: 1900,
      },
      {
        id: '103',
        name: 'Zainab Rashid',
        tier: 'Leasing Consultant',
        gwcRevenue: 640000,
        unitsTransacted: 14,
        points: 1400,
      },
    ];

    return {
      trackASales: trackA_SalesElite,
      trackBLeasing: trackB_LeasingVolume,
    };
  },

  getLeaderboard: () => {
    return [
      { id: '1', name: 'Sarah Al Maktoum', tier: 'Chairman Club', revenue: 4200000, deals: 8 },
      { id: '2', name: 'Arsalan Malik', tier: 'Managing Director', revenue: 3800000, deals: 6 },
      { id: '3', name: 'Omar Zayed', tier: 'Gold Producer', revenue: 2800000, deals: 5 },
      { id: '4', name: 'Laila Hassan', tier: 'Silver Producer', revenue: 1450000, deals: 3 },
    ];
  },

  getAITelemetry: () => {
    return {
      whatsappSla: '99.8%',
      avgResponseTime: '1.2s',
      activeAgents: ['Zoe (Sales)', 'Nadia (Compliance)', 'Sentinel (Security)'],
    };
  },
};
