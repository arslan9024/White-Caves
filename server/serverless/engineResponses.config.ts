import { z } from 'zod';

export const requestObject = z.object({}).passthrough();
export const pricingRequest = requestObject
  .extend({
    serviceType: z.enum([
      'PROPERTY_SALE',
      'LEASING',
      'PROPERTY_MANAGEMENT',
      'CONSULTATION',
      'DOCUMENTATION',
    ]),
    clientData: z
      .object({
        tier: z.string().optional(),
        transactionCount: z.number().int().nonnegative().optional(),
        totalValue: z.number().nonnegative().optional(),
      })
      .passthrough()
      .default({}),
    propertyData: z
      .object({
        value: z.number().positive().optional(),
        annualRent: z.number().positive().optional(),
        monthlyRent: z.number().positive().optional(),
        rarity: z.string().optional(),
        type: z.string().optional(),
      })
      .passthrough()
      .default({}),
    contextData: z
      .object({
        complexity: z.string().optional(),
        marketCondition: z.string().optional(),
      })
      .passthrough()
      .default({}),
  })
  .superRefine((request, context) => {
    const requiredAmount = {
      PROPERTY_SALE: request.propertyData.value,
      LEASING: request.propertyData.annualRent,
      PROPERTY_MANAGEMENT: request.propertyData.monthlyRent,
      CONSULTATION: 1,
      DOCUMENTATION: 1,
    }[request.serviceType];
    if (!requiredAmount) {
      context.addIssue({
        code: 'custom',
        message: 'A positive property amount is required',
        path: ['propertyData'],
      });
    }
  });

export const pricingResponse = z
  .object({
    finalRate: z.number().finite(),
    metadata: z.object({ propertyRarity: z.string() }).passthrough(),
  })
  .passthrough();

export const leadScoreResponse = z
  .object({
    overallScore: z.number().min(0).max(100),
    scoreGrade: z.string(),
    conversionProbability: z.string(),
    recommendedAction: z.unknown(),
    components: z.unknown(),
  })
  .passthrough();
