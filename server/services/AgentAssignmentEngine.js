class AgentAssignmentEngine {
  constructor() {
    this.weights = {
      expertise: 0.35,
      availability: 0.25,
      performance: 0.20,
      proximity: 0.10,
      clientMatch: 0.10
    };
  }

  async assignAgent(property, client, agents) {
    if (!agents || agents.length === 0) {
      return [];
    }

    const scores = await Promise.all(
      agents.map(async (agent) => {
        const scoreBreakdown = {
          expertise: this.calculateExpertiseScore(agent, property),
          availability: this.calculateAvailabilityScore(agent),
          performance: this.calculatePerformanceScore(agent),
          proximity: this.calculateProximityScore(agent, property),
          clientMatch: this.calculateClientMatchScore(agent, client)
        };

        const totalScore = Object.keys(scoreBreakdown).reduce((sum, key) => {
          return sum + (scoreBreakdown[key] * this.weights[key]);
        }, 0);

        return {
          agentId: agent._id || agent.id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          totalScore: parseFloat(totalScore.toFixed(2)),
          breakdown: scoreBreakdown,
          recommendation: this.getRecommendation(totalScore)
        };
      })
    );

    return scores.sort((a, b) => b.totalScore - a.totalScore);
  }

  calculateExpertiseScore(agent, property) {
    if (!agent || !property) return 50;
    
    let score = 0;
    const maxScore = 100;

    const propertyTypeExpertise = agent.expertise?.propertyTypes || [];
    const propertyType = property.specifications?.propertyType || property.type;
    if (propertyTypeExpertise.includes(propertyType)) {
      score += 40;
    }

    const locationExpertise = agent.expertise?.locations || [];
    const propertyLocation = property.location?.emirate || property.emirate;
    if (locationExpertise.includes(propertyLocation)) {
      score += 35;
    }

    const priceExpertise = agent.expertise?.priceRange || {};
    const propertyPrice = property.pricing?.amount || property.price;
    if (propertyPrice >= (priceExpertise.min || 0) && 
        propertyPrice <= (priceExpertise.max || Infinity)) {
      score += 25;
    }

    return Math.min(score, maxScore);
  }

  calculateAvailabilityScore(agent) {
    if (!agent) return 50;

    let score = 100;
    const activeDeals = agent.activeDeals || agent.currentListings || 0;
    const maxDeals = agent.maxCapacity || 10;

    const utilizationRate = activeDeals / maxDeals;
    if (utilizationRate > 0.9) {
      score = 20;
    } else if (utilizationRate > 0.7) {
      score = 50;
    } else if (utilizationRate > 0.5) {
      score = 70;
    } else {
      score = 100;
    }

    if (agent.isOnLeave) {
      score = 0;
    }

    return score;
  }

  calculatePerformanceScore(agent) {
    if (!agent) return 50;

    let score = 0;
    const performance = agent.performance || {};

    const closingRate = performance.closingRate || 0;
    score += Math.min(closingRate * 0.4, 40);

    const avgDays = performance.avgDaysToClose || 60;
    if (avgDays < 30) {
      score += 30;
    } else if (avgDays < 45) {
      score += 20;
    } else if (avgDays < 60) {
      score += 10;
    }

    const rating = performance.clientRating || 0;
    score += (rating / 5) * 30;

    return Math.min(score, 100);
  }

  calculateProximityScore(agent, property) {
    if (!agent || !property) return 50;

    const agentLocation = agent.location?.area || agent.primaryArea;
    const propertyLocation = property.location?.community || property.community;

    if (!agentLocation || !propertyLocation) return 50;

    if (agentLocation === propertyLocation) {
      return 100;
    }

    const agentEmirate = agent.location?.emirate || agent.emirate;
    const propertyEmirate = property.location?.emirate || property.emirate;
    if (agentEmirate === propertyEmirate) {
      return 70;
    }

    return 30;
  }

  calculateClientMatchScore(agent, client) {
    if (!agent || !client) return 50;

    let score = 0;

    if (client.preferredLanguage) {
      const agentLanguages = agent.languages || ['en'];
      if (agentLanguages.includes(client.preferredLanguage)) {
        score += 40;
      }
    } else {
      score += 20;
    }

    if (client.nationality && agent.specializations?.nationalities) {
      if (agent.specializations.nationalities.includes(client.nationality)) {
        score += 30;
      }
    } else {
      score += 15;
    }

    if (client.budget) {
      const agentPriceRange = agent.expertise?.priceRange || {};
      if (client.budget >= (agentPriceRange.min || 0) && 
          client.budget <= (agentPriceRange.max || Infinity)) {
        score += 30;
      }
    } else {
      score += 15;
    }

    return Math.min(score, 100);
  }

  getRecommendation(score) {
    if (score >= 80) {
      return {
        level: 'highly_recommended',
        label: 'Highly Recommended',
        color: '#22C55E'
      };
    } else if (score >= 60) {
      return {
        level: 'recommended',
        label: 'Recommended',
        color: '#3B82F6'
      };
    } else if (score >= 40) {
      return {
        level: 'suitable',
        label: 'Suitable',
        color: '#F59E0B'
      };
    } else {
      return {
        level: 'not_recommended',
        label: 'Not Recommended',
        color: '#EF4444'
      };
    }
  }

  async getBestAgent(property, client, agents) {
    const rankedAgents = await this.assignAgent(property, client, agents);
    return rankedAgents.length > 0 ? rankedAgents[0] : null;
  }

  async getTopAgents(property, client, agents, count = 3) {
    const rankedAgents = await this.assignAgent(property, client, agents);
    return rankedAgents.slice(0, count);
  }

  updateWeights(newWeights) {
    const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
    if (Math.abs(total - 1.0) > 0.01) {
      throw new Error('Weights must sum to 1.0');
    }
    this.weights = { ...this.weights, ...newWeights };
  }
}

export default AgentAssignmentEngine;
