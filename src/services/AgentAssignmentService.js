export class AgentAssignmentEngine {
  constructor() {
    this.factors = {
      expertise: 0.30,
      availability: 0.25,
      performance: 0.20,
      proximity: 0.15,
      clientPreference: 0.10
    };
  }

  async calculateAgentScore(agent, property, client = null) {
    const scores = {
      expertise: this.calculateExpertiseScore(agent, property),
      availability: await this.calculateAvailabilityScore(agent),
      performance: this.calculatePerformanceScore(agent),
      proximity: this.calculateProximityScore(agent, property),
      clientPreference: client ? this.calculateClientPreference(agent, client) : 0.5
    };

    const totalScore = Object.keys(scores).reduce((sum, key) => {
      return sum + (scores[key] * this.factors[key]);
    }, 0);

    return {
      agentId: agent._id || agent.id,
      agentName: agent.name,
      score: Math.round(totalScore * 100),
      breakdown: {
        expertise: Math.round(scores.expertise * 100),
        availability: Math.round(scores.availability * 100),
        performance: Math.round(scores.performance * 100),
        proximity: Math.round(scores.proximity * 100),
        clientPreference: Math.round(scores.clientPreference * 100)
      },
      recommendations: this.generateRecommendations(scores, agent, property)
    };
  }

  calculateExpertiseScore(agent, property) {
    if (!agent || !property) return 0;
    
    const specializations = agent.specializations || [];
    const languages = agent.languages || ['en'];
    let score = 0;
    let factors = 0;

    const propertyType = property.details?.propertyType || property.propertyType;
    if (propertyType && specializations.some(s => 
      s.toLowerCase().includes(propertyType.toLowerCase()) ||
      propertyType.toLowerCase().includes(s.toLowerCase())
    )) {
      score += 0.35;
    }
    factors++;

    const emirate = property.details?.emirate || 'Dubai';
    const community = property.details?.community || property.location;
    if (specializations.some(s => 
      s.toLowerCase().includes(emirate.toLowerCase()) ||
      s.toLowerCase().includes(community?.toLowerCase() || '')
    )) {
      score += 0.35;
    }
    factors++;

    const priceAmount = property.details?.price?.amount || property.price;
    if (priceAmount && this.isInExpertiseRange(agent, priceAmount)) {
      score += 0.3;
    }
    factors++;

    const clientLanguage = property.client?.requirements?.preferredLanguage;
    if (clientLanguage && languages.includes(clientLanguage)) {
      score += 0.1;
    }

    return Math.min(score, 1);
  }

  isInExpertiseRange(agent, price) {
    const ranges = agent.expertisePriceRanges || {
      min: 500000,
      max: 50000000
    };
    
    return price >= ranges.min && price <= ranges.max;
  }

  async calculateAvailabilityScore(agent) {
    if (!agent) return 0;

    const currentLoad = agent.assignedProperties?.length || 0;
    const maxLoad = agent.maxProperties || 15;
    const availabilityRatio = Math.max(0, (maxLoad - currentLoad) / maxLoad);

    const pendingViewings = agent.pendingViewings || 0;
    const maxViewingsPerDay = 8;
    const viewingScore = Math.max(0, 1 - (pendingViewings / maxViewingsPerDay));

    const isOnLeave = agent.onLeave || false;
    if (isOnLeave) return 0;

    const workingHours = this.checkWorkingHours(agent);
    
    return (availabilityRatio * 0.4) + (viewingScore * 0.3) + (workingHours * 0.3);
  }

  checkWorkingHours(agent) {
    const now = new Date();
    const dubaiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
    const hour = dubaiTime.getHours();
    const day = dubaiTime.getDay();

    if (day === 5) return 0;
    if (day === 6) return 0.5;

    if (hour >= 9 && hour < 22) {
      return 1;
    } else if (hour >= 8 && hour < 9) {
      return 0.7;
    }
    return 0.3;
  }

  calculatePerformanceScore(agent) {
    if (!agent || !agent.performance) return 0.5;

    const performance = agent.performance;
    
    const closureRate = Math.min(performance.closureRate || 0, 1);
    const responseTimeScore = this.normalizeResponseTime(performance.avgResponseTime);
    const clientRating = (performance.avgRating || 3) / 5;
    const reviewCount = Math.min((performance.reviewCount || 0) / 50, 1);
    const dealsThisMonth = Math.min((performance.monthlyDeals || 0) / 10, 1);

    return (
      (closureRate * 0.30) +
      (responseTimeScore * 0.20) +
      (clientRating * 0.25) +
      (reviewCount * 0.10) +
      (dealsThisMonth * 0.15)
    );
  }

  normalizeResponseTime(avgResponseTime) {
    if (!avgResponseTime) return 0.5;
    
    const targetTime = 30;
    const maxTime = 240;
    
    if (avgResponseTime <= targetTime) {
      return 1;
    } else if (avgResponseTime >= maxTime) {
      return 0;
    }
    
    return 1 - ((avgResponseTime - targetTime) / (maxTime - targetTime));
  }

  calculateProximityScore(agent, property) {
    if (!agent?.location || !property?.coordinates) {
      return 0.5;
    }

    const agentAreas = agent.primaryAreas || [];
    const propertyLocation = property.details?.community || property.location;

    if (agentAreas.some(area => 
      propertyLocation?.toLowerCase().includes(area.toLowerCase()) ||
      area.toLowerCase().includes(propertyLocation?.toLowerCase() || '')
    )) {
      return 1;
    }

    const nearbyAreas = agent.secondaryAreas || [];
    if (nearbyAreas.some(area => 
      propertyLocation?.toLowerCase().includes(area.toLowerCase())
    )) {
      return 0.7;
    }

    return 0.3;
  }

  calculateClientPreference(agent, client) {
    if (!client) return 0.5;

    let score = 0.5;

    if (client.preferredLanguage && agent.languages?.includes(client.preferredLanguage)) {
      score += 0.2;
    }

    if (client.previousAgent === agent._id || client.previousAgent === agent.id) {
      score += 0.3;
    }

    if (client.preferredGender && agent.gender === client.preferredGender) {
      score += 0.1;
    }

    if (client.nationality && agent.nationalitiesServed?.includes(client.nationality)) {
      score += 0.1;
    }

    return Math.min(score, 1);
  }

  generateRecommendations(scores, agent, property) {
    const recommendations = [];
    const threshold = 0.6;

    if (scores.expertise < threshold) {
      recommendations.push({
        type: 'expertise',
        priority: 'medium',
        message: `Consider agents with more experience in ${property.details?.propertyType || 'this property type'}`
      });
    }

    if (scores.availability < threshold) {
      recommendations.push({
        type: 'availability',
        priority: 'high',
        message: `${agent.name} has high workload. Consider backup agents.`
      });
    }

    if (scores.performance < threshold) {
      recommendations.push({
        type: 'performance',
        priority: 'low',
        message: `Agent performance is below average. Monitor closely.`
      });
    }

    if (scores.proximity < threshold) {
      recommendations.push({
        type: 'proximity',
        priority: 'medium',
        message: `Agent is not in primary area. May affect response time.`
      });
    }

    return recommendations;
  }

  async findBestAgent(agents, property, client = null) {
    if (!agents || agents.length === 0) {
      return null;
    }

    const scoredAgents = await Promise.all(
      agents.map(agent => this.calculateAgentScore(agent, property, client))
    );

    scoredAgents.sort((a, b) => b.score - a.score);

    return {
      recommended: scoredAgents[0],
      alternatives: scoredAgents.slice(1, 4),
      allScores: scoredAgents
    };
  }

  async roundRobinAssignment(agents, excludeAgentIds = []) {
    const availableAgents = agents.filter(
      agent => !excludeAgentIds.includes(agent._id || agent.id) && !agent.onLeave
    );

    if (availableAgents.length === 0) return null;

    availableAgents.sort((a, b) => {
      const aAssignments = a.assignedProperties?.length || 0;
      const bAssignments = b.assignedProperties?.length || 0;
      return aAssignments - bAssignments;
    });

    return availableAgents[0];
  }

  calculateTeamWorkload(agents) {
    const workload = {
      totalAgents: agents.length,
      activeAgents: 0,
      onLeave: 0,
      totalAssignments: 0,
      averageLoad: 0,
      overloaded: [],
      underloaded: []
    };

    const optimalLoad = 10;

    agents.forEach(agent => {
      if (agent.onLeave) {
        workload.onLeave++;
        return;
      }

      workload.activeAgents++;
      const assignments = agent.assignedProperties?.length || 0;
      workload.totalAssignments += assignments;

      if (assignments > optimalLoad * 1.5) {
        workload.overloaded.push({
          name: agent.name,
          assignments,
          excess: assignments - optimalLoad
        });
      } else if (assignments < optimalLoad * 0.5) {
        workload.underloaded.push({
          name: agent.name,
          assignments,
          capacity: optimalLoad - assignments
        });
      }
    });

    workload.averageLoad = workload.activeAgents > 0 
      ? Math.round(workload.totalAssignments / workload.activeAgents) 
      : 0;

    return workload;
  }
}

export const agentAssignmentEngine = new AgentAssignmentEngine();
export default agentAssignmentEngine;
