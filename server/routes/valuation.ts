/**
 * Valuation Routes — Wave 12
 * Property AVM (Automated Valuation Model) + Manual Override + Bank Request
 */
import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

const parsePositiveInt = (value: unknown, fallback: number, max: number): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(max, parsed);
};

// ─── Dubai Area Benchmarks (price per sqft in AED) ─────────────────────────
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

// ─── AVM Engine ─────────────────────────────────────────────────────────────
interface AvmInput {
  location: string;
  sqft: number;
  yearBuilt?: number;
  amenities?: string[];
  serviceChargeAedPerYear?: number;
}

interface AvmResult {
  estimatedValueAed: number;
  rentAnnualAed: number;
  grossYieldPct: number;
  netYieldPct: number;
  confidence: string;
  ageDiscount: number;
  amenityPremium: number;
  priceRangeLow: number;
  priceRangeHigh: number;
  benchmarkPricePerSqft: number;
  rentPerSqftPerYear: number;
}

function runAvm(input: AvmInput): AvmResult {
  const locationKey = (input.location || '').toLowerCase().trim();
  const benchmark = areaBenchmarks[locationKey];
  const confidence = benchmark ? (input.sqft > 200 ? 'high' : 'medium') : 'low';
  const salePricePerSqft = benchmark?.sale ?? 1100; // default to Mirdif-level
  const rentPerSqftPerYear = (benchmark?.rent ?? 75) * 12;

  // Age discount: 0.5% per year over 5 years, max 15%
  const age = input.yearBuilt ? new Date().getFullYear() - input.yearBuilt : 0;
  const ageDiscount = age > 5 ? Math.min((age - 5) * 0.005, 0.15) : 0;

  // Amenity premium: 2% per premium amenity, max 15%
  const premiumAmenities = [
    'pool',
    'gym',
    'sea view',
    'marina view',
    'burj view',
    'private pool',
    'concierge',
    'smart home',
    'tennis court',
    'beach access',
  ];
  const amenityCount = (input.amenities ?? []).filter(a =>
    premiumAmenities.includes(a.toLowerCase())
  ).length;
  const amenityPremium = Math.min(amenityCount * 0.02, 0.15);

  const adjustedPricePerSqft = salePricePerSqft * (1 - ageDiscount) * (1 + amenityPremium);
  const estimatedValueAed = Math.round(adjustedPricePerSqft * input.sqft);
  const rentAnnualAed = Math.round(rentPerSqftPerYear * input.sqft);

  const grossYieldPct = parseFloat(((rentAnnualAed / estimatedValueAed) * 100).toFixed(2));
  const netYieldPct = parseFloat(
    (((rentAnnualAed - (input.serviceChargeAedPerYear ?? 0)) / estimatedValueAed) * 100).toFixed(2)
  );

  const rangeVariance = confidence === 'high' ? 0.05 : confidence === 'medium' ? 0.1 : 0.2;

  return {
    estimatedValueAed,
    rentAnnualAed,
    grossYieldPct,
    netYieldPct,
    confidence,
    ageDiscount: parseFloat(ageDiscount.toFixed(4)),
    amenityPremium: parseFloat(amenityPremium.toFixed(4)),
    priceRangeLow: Math.round(estimatedValueAed * (1 - rangeVariance)),
    priceRangeHigh: Math.round(estimatedValueAed * (1 + rangeVariance)),
    benchmarkPricePerSqft: salePricePerSqft,
    rentPerSqftPerYear,
  };
}

// ─── GET /api/valuations/yield-calculator (no auth — utility) ───────────────
router.get(
  '/yield-calculator',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { salePrice, annualRent, serviceCharge } = req.query as Record<
      string,
      string | undefined
    >;
    if (!salePrice || !annualRent) {
      throw new AppError('salePrice and annualRent are required', 400);
    }
    const sale = parseFloat(salePrice as string);
    const rent = parseFloat(annualRent as string);
    const sc = parseFloat((serviceCharge as string) ?? '0') || 0;
    if (isNaN(sale) || isNaN(rent) || sale <= 0) {
      throw new AppError('Invalid numeric values', 400);
    }
    const grossYield = (rent / sale) * 100;
    const netYield = ((rent - sc) / sale) * 100;
    res.json({
      success: true,
      data: {
        grossYieldPct: parseFloat(grossYield.toFixed(2)),
        netYieldPct: parseFloat(netYield.toFixed(2)),
        annualRent: rent,
        salePrice: sale,
        serviceCharge: sc,
      },
    });
  })
);

// ─── GET /api/valuations/:propertyId — latest valuation + summary ────────────
router.get(
  '/:propertyId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId } = req.params as Record<string, string>;

    const [latest, totalSnapshots] = await Promise.all([
      prisma.propertyValuation.findFirst({
        where: { propertyId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.propertyValuation.count({ where: { propertyId } }),
    ]);

    res.json({ success: true, data: { latest, totalSnapshots } });
  })
);

// ─── GET /api/valuations/:propertyId/history — paginated snapshots ───────────
router.get(
  '/:propertyId/history',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId } = req.params as Record<string, string>;
    const page = parsePositiveInt(req.query.page, 1, 1000);
    const pageSize = parsePositiveInt(req.query.pageSize, 20, 50);
    const skip = (page - 1) * pageSize;

    const [records, total] = await Promise.all([
      prisma.propertyValuation.findMany({
        where: { propertyId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.propertyValuation.count({ where: { propertyId } }),
    ]);

    res.json({
      success: true,
      data: records,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  })
);

// ─── POST /api/valuations/:propertyId/recalculate — run AVM + persist ────────
router.post(
  '/:propertyId/recalculate',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId } = req.params as Record<string, string>;

    // Fetch property details from DB for AVM inputs
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        location: true,
        area: true,
        sqft: true,
        amenities: true,
        type: true,
        bedrooms: true,
      },
    });
    if (!property) throw new AppError('Property not found', 404);

    const avmInput: AvmInput = {
      location: (property.area ?? property.location ?? '').toLowerCase(),
      sqft: property.sqft ?? 0,
      amenities: property.amenities ?? [],
    };

    const result = runAvm(avmInput);

    const valuation = await prisma.propertyValuation.create({
      data: {
        propertyId,
        estimatedValueAed: result.estimatedValueAed,
        rentAnnualAed: result.rentAnnualAed,
        grossYieldPct: result.grossYieldPct,
        netYieldPct: result.netYieldPct,
        confidence: result.confidence,
        method: 'avm',
        ageDiscount: result.ageDiscount,
        amenityPremium: result.amenityPremium,
        priceRangeLow: result.priceRangeLow,
        priceRangeHigh: result.priceRangeHigh,
        createdById: userId,
      },
    });

    logger.info(`AVM recalculation for property ${propertyId} by user ${userId}`);
    res.json({ success: true, data: valuation });
  })
);

// ─── POST /api/valuations/:propertyId/override — manual override (manager+) ──
router.post(
  '/:propertyId/override',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) throw new AppError('Authentication required', 401);
    if (!['manager', 'admin', 'owner'].includes(role ?? '')) {
      throw new AppError('Only managers and admins can override valuations', 403);
    }

    const { propertyId } = req.params as Record<string, string>;
    const { overrideValueAed, rentAnnualAed, reason } = req.body as {
      overrideValueAed: number;
      rentAnnualAed?: number;
      reason: string;
    };

    if (!overrideValueAed || overrideValueAed <= 0) {
      throw new AppError('overrideValueAed must be a positive number', 400);
    }
    if (!reason || reason.trim().length < 5) {
      throw new AppError('A valid override reason is required', 400);
    }

    const rent = rentAnnualAed ?? 0;
    const grossYield = rent > 0 ? parseFloat(((rent / overrideValueAed) * 100).toFixed(2)) : 0;

    const valuation = await prisma.propertyValuation.create({
      data: {
        propertyId,
        estimatedValueAed: overrideValueAed,
        rentAnnualAed: rent,
        grossYieldPct: grossYield,
        netYieldPct: grossYield,
        confidence: 'high',
        method: 'manual_override',
        overrideReason: reason.trim(),
        overriddenById: userId,
        createdById: userId,
      },
    });

    logger.info(
      `Valuation override for property ${propertyId} by user ${userId}: AED ${overrideValueAed}`
    );
    res.json({ success: true, data: valuation });
  })
);

// ─── POST /api/valuations/:propertyId/bank-request ───────────────────────────
router.post(
  '/:propertyId/bank-request',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { propertyId } = req.params as Record<string, string>;
    const { bankName, purpose } = req.body as { bankName?: string; purpose?: string };

    // Create a pending bank valuation record
    const valuation = await prisma.propertyValuation.create({
      data: {
        propertyId,
        estimatedValueAed: 0,
        rentAnnualAed: 0,
        grossYieldPct: 0,
        netYieldPct: 0,
        confidence: 'low',
        method: 'bank',
        bankRequestStatus: 'pending',
        bankRequestedAt: new Date(),
        overrideReason: purpose ?? 'Bank mortgage pre-approval',
        createdById: userId,
      },
    });

    logger.info(
      `Bank valuation request for property ${propertyId}, bank: ${bankName ?? 'unknown'}`
    );
    res.json({
      success: true,
      data: valuation,
      message: `Bank valuation request submitted${bankName ? ` to ${bankName}` : ''}. Expect response within 3-5 business days.`,
    });
  })
);

export default router;
