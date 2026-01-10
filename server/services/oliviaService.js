import InventoryProperty from '../models/InventoryProperty.js';
import HomepageFeature from '../models/HomepageFeature.js';

const SCORING_WEIGHTS = {
  INQUIRIES: 3,
  VIEWS: 0.5,
  QUALITY: 2,
  NEW_LISTING_BONUS: 10
};

const DAYS_CONSIDERED_NEW = 7;

class OliviaService {
  static calculatePropertyScore(property) {
    const now = new Date();
    const createdAt = new Date(property.createdAt);
    const daysOld = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    const isNew = daysOld <= DAYS_CONSIDERED_NEW;

    const qualityScore = this.calculateQualityScore(property);

    const inquiriesScore = (property.inquiries || 0) * SCORING_WEIGHTS.INQUIRIES;
    const viewsScore = (property.views || 0) * SCORING_WEIGHTS.VIEWS;
    const qualityPoints = qualityScore * SCORING_WEIGHTS.QUALITY;
    const newListingBonus = isNew ? SCORING_WEIGHTS.NEW_LISTING_BONUS : 0;

    const totalScore = inquiriesScore + viewsScore + qualityPoints + newListingBonus;

    return {
      totalScore: Math.round(totalScore * 100) / 100,
      breakdown: {
        inquiriesScore: Math.round(inquiriesScore * 100) / 100,
        viewsScore: Math.round(viewsScore * 100) / 100,
        qualityScore: Math.round(qualityPoints * 100) / 100,
        newListingBonus
      }
    };
  }

  static calculateQualityScore(property) {
    let score = 0;

    if (property.images && property.images.length > 0) score += 2;
    if (property.images && property.images.length >= 5) score += 1;
    if (property.askingPrice) score += 1;
    if (property.actualArea) score += 1;
    if (property.rooms) score += 1;
    if (property.viewType) score += 0.5;
    if (property.notes && property.notes.length > 50) score += 0.5;
    if (property.tags && property.tags.length > 0) score += 0.5;
    if (property.dewaPremiseNumber) score += 0.5;

    return Math.min(score, 10);
  }

  static async selectDailyFeatured(count = 10) {
    console.log('[Olivia] Starting daily featured property selection...');
    const startTime = Date.now();

    try {
      const availableProperties = await InventoryProperty.find({
        status: 'available',
        isActive: true,
        askingPrice: { $gt: 0 }
      }).lean();

      console.log(`[Olivia] Found ${availableProperties.length} available properties`);

      if (availableProperties.length === 0) {
        console.log('[Olivia] No available properties found');
        return { success: false, message: 'No available properties', properties: [] };
      }

      const scoredProperties = availableProperties.map(property => {
        const { totalScore, breakdown } = this.calculatePropertyScore(property);
        return {
          ...property,
          score: totalScore,
          scoreBreakdown: breakdown
        };
      });

      scoredProperties.sort((a, b) => b.score - a.score);

      const topProperties = scoredProperties.slice(0, count);

      const featuredProperties = topProperties.map(prop => ({
        propertyRef: prop._id.toString(),
        pNumber: prop.pNumber,
        title: `${prop.propertyType || 'Property'} in ${prop.area}`,
        propertyType: prop.propertyType,
        area: prop.area,
        project: prop.project,
        askingPrice: prop.askingPrice,
        currency: prop.currency || 'AED',
        rooms: prop.rooms,
        actualArea: prop.actualArea,
        status: prop.status,
        purpose: prop.purpose,
        images: prop.images || [],
        score: prop.score,
        scoreBreakdown: prop.scoreBreakdown
      }));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await HomepageFeature.findOneAndUpdate(
        { dateActive: today },
        {
          dateActive: today,
          featuredProperties,
          totalAvailable: availableProperties.length,
          selectionMethod: 'scored',
          generatedBy: 'Olivia_AI_Assistant',
          generatedAt: new Date(),
          isActive: true
        },
        { upsert: true, new: true }
      );

      const duration = Date.now() - startTime;
      console.log(`[Olivia] Successfully selected ${featuredProperties.length} featured properties in ${duration}ms`);

      return {
        success: true,
        message: `Selected ${featuredProperties.length} featured properties`,
        properties: featuredProperties,
        totalAvailable: availableProperties.length,
        duration
      };

    } catch (error) {
      console.error('[Olivia] Error selecting featured properties:', error);
      return { success: false, message: error.message, properties: [] };
    }
  }

  static async getTodaysFeatured() {
    try {
      let featured = await HomepageFeature.getTodaysFeatured();

      if (!featured) {
        console.log('[Olivia] No featured properties for today, generating...');
        const result = await this.selectDailyFeatured();
        if (result.success) {
          featured = await HomepageFeature.getTodaysFeatured();
        }
      }

      if (!featured) {
        featured = await HomepageFeature.getMostRecent();
        if (featured) {
          console.log('[Olivia] Using fallback from most recent featured list');
        }
      }

      return featured;
    } catch (error) {
      console.error('[Olivia] Error getting today\'s featured:', error);
      return null;
    }
  }

  static async getPropertyDetails(propertyRefs) {
    try {
      const properties = await InventoryProperty.find({
        _id: { $in: propertyRefs }
      }).populate('primaryOwner').lean();

      return properties;
    } catch (error) {
      console.error('[Olivia] Error getting property details:', error);
      return [];
    }
  }

  static async manualRefresh() {
    console.log('[Olivia] Manual refresh triggered');
    return await this.selectDailyFeatured();
  }
}

export default OliviaService;
