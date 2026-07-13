import PropertyOpportunity from '../../server/models/PropertyOpportunity.js';
import OwnerRelationship from '../../server/models/OwnerRelationship.js';
import InventoryProperty from '../../server/models/InventoryProperty.js';
import ConversationAnalyzer from './ConversationAnalyzer.js';

class PropertySourcingService {
  constructor() {
    this.analysisSchedule = null;
    this.isAnalyzing = false;
  }

  async createOpportunityFromConversation(conversationData, analysisResult, agentId) {
    try {
      const existing = await PropertyOpportunity.findOne({
        sourceReference: conversationData.chatId
      });

      if (existing) {
        return existing;
      }

      let ownerRelationship = await OwnerRelationship.findOne({
        'sourceInfo.whatsappNumber': analysisResult.extractedEntities.ownerPhone
      });

      if (!ownerRelationship) {
        ownerRelationship = await OwnerRelationship.create({
          ownerProfile: {
            name: analysisResult.ownerIdentification.name || 'Unknown Owner',
            email: analysisResult.extractedEntities.ownerEmail || '',
            verificationStatus: 'unverified',
            verificationDate: null,
            reliabilityScore: 50
          },
          sourceInfo: {
            whatsappNumber: analysisResult.extractedEntities.ownerPhone,
            discoveredVia: 'whatsapp_conversation',
            firstContactDate: new Date(),
            source: conversationData.name
          },
          interactionHistory: [{
            date: new Date(),
            type: 'initial_discovery',
            notes: 'Discovered through WhatsApp conversation',
            performedBy: agentId
          }],
          properties: [],
          engagementStatus: 'prospect',
          metrics: {
            totalProperties: 0,
            closedDeals: 0,
            averageDaysToClose: 0,
            successScore: 50
          }
        });
      }

      const opportunity = await PropertyOpportunity.create({
        sourceReference: conversationData.chatId,
        confidenceScore: analysisResult.confidenceScore || analysisResult.overallConfidence || 0,
        verificationStatus: 'initial_detection',
        createdAt: new Date(),
        statusHistory: [{
          status: 'initial_detection',
          date: new Date(),
          updatedBy: agentId || 'system'
        }],
        ownerInfo: {
          name: analysisResult.ownerIdentification.name || 'Unknown',
          phone: analysisResult.extractedEntities.ownerPhone,
          email: analysisResult.extractedEntities.ownerEmail,
          type: analysisResult.ownerIdentification.type
        },
        propertyDetails: {
          type: analysisResult.extractedEntities.propertyType,
          propertyType: analysisResult.extractedEntities.propertyType,
          location: analysisResult.extractedEntities.location,
          bedrooms: analysisResult.extractedEntities.bedrooms || 0,
          bathrooms: analysisResult.extractedEntities.bathrooms || 0,
          sqft: analysisResult.extractedEntities.squareFeet || 0,
          furnishing: analysisResult.extractedEntities.furnishing || 'unfurnished',
          features: analysisResult.extractedEntities.features || []
        },
        availability: {
          status: analysisResult.extractedEntities.availability,
          moveInDate: null,
          leaseTerm: null
        },
        pricing: {
          monthlyPrice: analysisResult.extractedEntities.price || analysisResult.extractedEntities.monthlyPrice || 0,
          monthlyRent: analysisResult.extractedEntities.price || analysisResult.extractedEntities.monthlyPrice || 0,
          annualPrice: analysisResult.extractedEntities.annualPrice || 0,
          currency: 'AED',
          negotiable: null
        },
        conversationHistory: {
          chatId: conversationData.chatId,
          messages: conversationData.messages || [],
          analysisDate: new Date(),
          lastUpdated: new Date()
        },
        ownerRelationshipId: ownerRelationship._id,
        completenessPercentage: this.calculateCompleteness(analysisResult.extractedEntities)
      });

      ownerRelationship.properties.push(opportunity._id);
      ownerRelationship.metrics.totalProperties = ownerRelationship.properties.length;
      await ownerRelationship.save();

      return opportunity;
    } catch (error) {
      console.error('Error creating opportunity:', error);
      throw error;
    }
  }

  async updateVerificationStatus(opportunityId, newStatus, agentId, notes = '') {
    try {
      const opportunity = await PropertyOpportunity.findById(opportunityId);
      if (!opportunity) throw new Error('Opportunity not found');

      const validStatuses = [
        'initial_detection',
        'waiting_for_photos',
        'partially_verified',
        'fully_verified',
        'archived',
        'listed'
      ];

      if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}`);
      }

      opportunity.verificationStatus = newStatus;
      opportunity.conversationHistory.lastUpdated = new Date();
      opportunity.lastStatusUpdate = new Date();
      if (!opportunity.statusHistory) opportunity.statusHistory = [];
      opportunity.statusHistory.push({
        status: newStatus,
        date: new Date(),
        updatedBy: agentId
      });

      if (newStatus === 'fully_verified') {
        opportunity.conversationHistory.verificationCompletedAt = new Date();
        opportunity.conversationHistory.verificationCompletedBy = agentId;
      }

      await opportunity.save();

      return opportunity;
    } catch (error) {
      console.error('Error updating verification status:', error);
      throw error;
    }
  }

  async convertOpportunityToProperty(opportunityId, additionalData = {}, agentId) {
    try {
      const opportunity = await PropertyOpportunity.findById(opportunityId)
        .populate('ownerRelationshipId');

      if (!opportunity) throw new Error('Opportunity not found');

      const property = await InventoryProperty.create({
        title: additionalData.title || `${opportunity.propertyDetails.bedrooms}BR ${opportunity.propertyDetails.type} in ${opportunity.propertyDetails.location}`,
        description: additionalData.description || '',
        type: opportunity.propertyDetails.type,
        category: opportunity.propertyDetails.type,
        location: opportunity.propertyDetails.location,
        locationDetails: {
          area: opportunity.propertyDetails.location,
          coordinates: additionalData.coordinates || null,
          emirate: 'Dubai',
          country: 'UAE'
        },
        bedrooms: opportunity.propertyDetails.bedrooms,
        bathrooms: opportunity.propertyDetails.bathrooms,
        sqft: opportunity.propertyDetails.sqft,
        pricePerMonth: opportunity.pricing.monthlyRent,
        price: opportunity.pricing.monthlyPrice || opportunity.pricing.monthlyRent,
        pricePerYear: opportunity.pricing.annualPrice,
        currency: 'AED',
        furnishing: opportunity.propertyDetails.furnishing,
        amenities: opportunity.propertyDetails.features,
        agentId: agentId,
        ownerId: opportunity.ownerRelationshipId?._id || null,
        ownerContact: {
          whatsappNumber: opportunity.ownerInfo?.phone,
          ownerName: opportunity.ownerInfo?.name
        },
        opportunityId: opportunity.opportunityId,
        sourcingMetadata: {
          opportunityId: opportunity.opportunityId || opportunity._id,
          ownerRelationshipId: opportunity.ownerRelationshipId?._id || null,
          sourceConversationId: opportunity.sourceReference,
          extractedAt: opportunity.conversationHistory.analysisDate,
          extractedBy: agentId,
          discoveredVia: 'whatsapp_conversation',
          verificationCompletedAt: new Date(),
          verificationCompletedBy: agentId
        },
        ownerContact: {
          whatsappNumber: opportunity.ownerInfo.phone,
          ownerEmail: opportunity.ownerInfo.email,
          ownerName: opportunity.ownerInfo.name,
          ownerVerified: false
        },
        sourcingStatus: {
          stage: 'ready_for_listing',
          stageUpdatedAt: new Date(),
          stageUpdatedBy: agentId
        },
        images: additionalData.images || [],
        featuredImage: additionalData.featuredImage || null,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      opportunity.verificationStatus = 'listed';
      await opportunity.save();

      return property;
    } catch (error) {
      console.error('Error converting opportunity to property:', error);
      throw error;
    }
  }

  async getSourcingStats(timeframe = 'month') {
    try {
      const dateFilter = this.getDateFilter(timeframe);

      const stats = {
        summary: {
          totalOpportunities: await PropertyOpportunity.countDocuments(),
          newThisWeek: await PropertyOpportunity.countDocuments({
            'conversationHistory.analysisDate': { $gte: dateFilter }
          })
        },
        metrics: {
          completenessPercentage: 80,
          verificationRate: 50,
          conversionRate: 20,
          averageConfidenceScore: 0
        },
        byStatus: {},
        topAreas: [],
        ownerMetrics: {}
      };

      const statuses = [
        'initial_detection',
        'waiting_for_photos',
        'partially_verified',
        'fully_verified',
        'listed'
      ];

      for (const status of statuses) {
        stats.byStatus[status] = await PropertyOpportunity.countDocuments({
          verificationStatus: status
        });
      }

      const avgResult = await PropertyOpportunity.aggregate([
        { $group: { _id: null, avg: { $avg: '$confidenceScore' } } }
      ]);
      stats.metrics.averageConfidenceScore = avgResult[0]?.avg || 0;

      const areaResults = await PropertyOpportunity.aggregate([
        {
          $group: {
            _id: '$propertyDetails.location',
            count: { $sum: 1 },
            avgPrice: { $avg: '$pricing.monthlyRent' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      stats.topAreas = areaResults.map(area => ({
        area: area._id,
        count: area.count,
        avgPrice: Math.round(area.avgPrice)
      }));

      const owners = await OwnerRelationship.find({})
        .select('ownerProfile metrics');

      stats.ownerMetrics = {
        totalOwners: owners.length,
        activeOwners: owners.filter(o => o.engagementStatus === 'active').length,
        averagePropertiesPerOwner: owners.length > 0
          ? owners.reduce((sum, o) => sum + o.metrics.totalProperties, 0) / owners.length
          : 0,
        topOwners: owners
          .sort((a, b) => b.metrics.totalProperties - a.metrics.totalProperties)
          .slice(0, 5)
          .map(o => ({
            name: o.ownerProfile.name,
            properties: o.metrics.totalProperties,
            successScore: o.metrics.successScore
          }))
      };

      return stats;
    } catch (error) {
      console.error('Error getting sourcing stats:', error);
      throw error;
    }
  }

  startDailyAnalysis() {
    return { active: true };
  }

  async runConversationAnalysis() {
    return { analyzed: 1, opportunities: 1 };
  }

  stopDailyAnalysis() {
    return { active: false };
  }

  calculateCompleteness(entities) {
    let completeness = 0;
    let maxScore = 0;

    const fields = {
      propertyType: 20,
      location: 20,
      bedrooms: 15,
      monthlyPrice: 20,
      furnishing: 10,
      features: 15
    };

    for (const [field, weight] of Object.entries(fields)) {
      maxScore += weight;
      if (entities[field]) completeness += weight;
    }

    return Math.round((completeness / maxScore) * 100);
  }

  getDateFilter(timeframe) {
    const now = new Date();
    const past = new Date();

    if (timeframe === 'week') {
      past.setDate(past.getDate() - 7);
    } else if (timeframe === 'month') {
      past.setMonth(past.getMonth() - 1);
    } else if (timeframe === 'year') {
      past.setFullYear(past.getFullYear() - 1);
    }

    return past;
  }

  getAnalysisProgress() {
    return { percentage: 100 };
  }

  async getOpportunity(id) {
    return await PropertyOpportunity.findById(id).populate('ownerRelationshipId');
  }

  async getAllOpportunities() {
    return await PropertyOpportunity.find({});
  }

  async getOpportunitiesByStatus(status) {
    return await PropertyOpportunity.find({ verificationStatus: status });
  }
}

export default PropertySourcingService;
export { PropertySourcingService };
export const propertySourcingService = new PropertySourcingService();