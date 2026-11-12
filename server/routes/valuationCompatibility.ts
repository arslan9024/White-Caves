import { Express, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import authMiddleware from '../middleware/auth.js';
import logger from '../utils/logger.js';

export function mountValuationCompatibilityRoutes(app: Express): void {
  // Valuation API — heuristic estimator based on Dubai area price-per-sqft benchmarks
  app.post(
    '/api/valuation/estimate',
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      const { location, area, propertyType, bedrooms, bathrooms, sqft, yearBuilt, amenities } =
        req.body;

      if (!location && !area) {
        throw new AppError('location or area is required for valuation', 400);
      }

      // Dubai area price-per-sqft benchmarks (AED, 2025/2026 market data)
      const areaBenchmarks: Record<string, { sale: number; rent: number }> = {
        'palm jumeirah': { sale: 3800, rent: 260 },
        'downtown dubai': { sale: 3200, rent: 220 },
        'dubai marina': { sale: 2600, rent: 175 },
        'business bay': { sale: 2200, rent: 150 },
        jumeirah: { sale: 2800, rent: 190 },
        'arabian ranches': { sale: 1800, rent: 110 },
        'dubai hills': { sale: 2100, rent: 135 },
        jvc: { sale: 1200, rent: 80 },
        'jumeirah village circle': { sale: 1200, rent: 80 },
        mirdif: { sale: 1100, rent: 75 },
        deira: { sale: 900, rent: 60 },
        'bur dubai': { sale: 950, rent: 65 },
        'al barsha': { sale: 1300, rent: 90 },
        'sport city': { sale: 1000, rent: 70 },
        'motor city': { sale: 1050, rent: 72 },
        jlt: { sale: 1500, rent: 100 },
        'jumeirah lake towers': { sale: 1500, rent: 100 },
        'emaar beachfront': { sale: 3500, rent: 240 },
        'creek harbour': { sale: 2900, rent: 195 },
        'sobha hartland': { sale: 2400, rent: 160 },
      };

      const key = (location || area || '').toLowerCase().trim();
      const matchKey = Object.keys(areaBenchmarks).find(k => key.includes(k) || k.includes(key));
      // eslint-disable-next-line security/detect-object-injection
      const benchmark = matchKey ? areaBenchmarks[matchKey] : { sale: 1500, rent: 100 };

      const sqftNum = sqft ? parseFloat(sqft) : 1000;
      const bedsNum = bedrooms ? parseInt(String(bedrooms), 10) : 1;
      const bathsNum = bathrooms ? parseInt(String(bathrooms), 10) : 1;
      const typeMultiplier = propertyType === 'villa' || propertyType === 'townhouse' ? 1.15 : 1.0;

      // Age discount: -1% per year over 10 years old, max -20%
      const ageDiscount = yearBuilt
        ? Math.min(
            0.2,
            Math.max(0, (new Date().getFullYear() - parseInt(String(yearBuilt), 10) - 10) * 0.01)
          )
        : 0;

      // Amenity premium: +3% per luxury amenity up to 15%
      const luxuryAmenities = [
        'pool',
        'gym',
        'concierge',
        'sea view',
        'marina view',
        'private pool',
        'smart home',
      ];
      const amenityList: string[] = Array.isArray(amenities) ? amenities : [];
      const amenityPremium = Math.min(
        0.15,
        amenityList.filter(a => luxuryAmenities.some(l => String(a).toLowerCase().includes(l)))
          .length * 0.03
      );

      const saleEstimate = Math.round(
        sqftNum * benchmark.sale * typeMultiplier * (1 - ageDiscount) * (1 + amenityPremium)
      );
      const rentEstimate = Math.round(
        sqftNum * benchmark.rent * typeMultiplier * (1 - ageDiscount) * (1 + amenityPremium)
      );

      // ±15% confidence range
      const margin = 0.15;
      const result = {
        estimatedSalePrice: saleEstimate,
        estimatedAnnualRent: rentEstimate,
        estimatedMonthlyRent: Math.round(rentEstimate / 12),
        priceRange: {
          sale: {
            low: Math.round(saleEstimate * (1 - margin)),
            high: Math.round(saleEstimate * (1 + margin)),
          },
          rent: {
            lowAnnual: Math.round(rentEstimate * (1 - margin)),
            highAnnual: Math.round(rentEstimate * (1 + margin)),
          },
        },
        inputs: {
          location: location || area,
          sqft: sqftNum,
          propertyType: propertyType || 'apartment',
          bedrooms: bedsNum,
          bathrooms: bathsNum,
          yearBuilt: yearBuilt || null,
        },
        methodology: 'Dubai area price-per-sqft heuristic (2025/2026 benchmarks)',
        confidenceLevel: matchKey ? 'medium' : 'low',
        disclaimer:
          'This is an indicative estimate only and does not constitute a formal valuation. Actual market prices may differ significantly.',
        generatedAt: new Date().toISOString(),
      };

      logger.info('Valuation estimate generated', {
        location: location || area,
        sqft: sqftNum,
        saleEstimate,
      });

      res.status(200).json({ success: true, data: result });
    })
  );
}
