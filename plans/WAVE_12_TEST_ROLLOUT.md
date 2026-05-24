# WAVE 12 — Test Rollout Plan

## Property Valuation API + Market Intelligence Dashboard

---

## Unit Tests

### ValuationService

```typescript
describe('AVM Engine', () => {
  it('calculates sale estimate for Palm Jumeirah 1000 sqft', () => {
    // benchmark: 3800 AED/sqft, no age discount, no amenity premium
    expect(
      avm({ location: 'palm jumeirah', sqft: 1000, yearBuilt: 2020 }).estimatedSalePrice
    ).toBeCloseTo(3_800_000, -4);
  });

  it('applies 10% age discount for 20-year-old property', () => {
    const result = avm({ location: 'jvc', sqft: 800, yearBuilt: 2005 });
    expect(result.estimatedSalePrice).toBeLessThan(1200 * 800);
  });

  it('caps amenity premium at 15%', () => {
    const result = avm({
      location: 'dubai marina',
      sqft: 1200,
      amenities: [
        'pool',
        'gym',
        'sea view',
        'concierge',
        'smart home',
        'private pool',
        'marina view',
      ],
    });
    expect(result.estimatedSalePrice).toBeLessThanOrEqual(2600 * 1200 * 1.15 * 1.01);
  });

  it('returns low confidence for unknown area', () => {
    expect(avm({ location: 'unknown area xyz', sqft: 500 }).confidenceLevel).toBe('low');
  });

  it('gross yield = annualRent / salePrice × 100', () => {
    const result = avm({ location: 'business bay', sqft: 900 });
    const expected = (result.estimatedAnnualRent / result.estimatedSalePrice) * 100;
    expect(result.grossYieldPct).toBeCloseTo(expected, 1);
  });
});
```

### MarketService

```typescript
describe('Market Intelligence', () => {
  it('returns price index for all 20 benchmarked areas', async () => {
    const index = await getPriceIndex({});
    expect(index.length).toBeGreaterThanOrEqual(20);
  });

  it('filters by property type', async () => {
    const villas = await getPriceIndex({ propertyType: 'villa' });
    villas.forEach(r => expect(r.propertyType).toBe('villa'));
  });
});
```

---

## Integration Tests (Supertest)

```typescript
describe('GET /api/valuations/:propertyId', () => {
  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/valuations/prop_001');
    expect(res.status).toBe(401);
  });

  it('returns latest valuation for known property', async () => {
    const res = await authenticatedRequest(app, agentToken).get('/api/valuations/prop_001');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('estimatedValueAed');
  });
});

describe('POST /api/valuations/:propertyId/override', () => {
  it('rejects for non-manager role', async () => {
    const res = await authenticatedRequest(app, agentToken)
      .post('/api/valuations/prop_001/override')
      .send({ overrideValueAed: 2_000_000, reason: 'test' });
    expect(res.status).toBe(403);
  });

  it('accepts for manager role', async () => {
    const res = await authenticatedRequest(app, managerToken)
      .post('/api/valuations/prop_001/override')
      .send({ overrideValueAed: 2_500_000, reason: 'RERA-certified valuer assessment' });
    expect(res.status).toBe(200);
    expect(res.body.data.method).toBe('manual_override');
  });
});

describe('GET /api/market/price-index', () => {
  it('returns 200 with area array', async () => {
    const res = await authenticatedRequest(app, agentToken).get('/api/market/price-index');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/market/indicators', () => {
  it('includes daysOnMarket and absorptionRate', async () => {
    const res = await authenticatedRequest(app, agentToken).get('/api/market/indicators');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('daysOnMarket');
    expect(res.body.data).toHaveProperty('absorptionRate');
  });
});
```

---

## Regression Checklist

- [ ] Existing `/api/valuation/estimate` (inline) still returns 200
- [ ] `/api/offers` unaffected
- [ ] `/api/maintenance` unaffected
- [ ] `/api/currency/rates` unaffected
- [ ] Frontend build: 0 TS errors, 0 Vite errors
- [ ] `npm run test:ops` still 11/11 passing

---

## Non-Functional

| Check                      | Target                               |
| -------------------------- | ------------------------------------ |
| AVM endpoint response time | < 200ms (no DB hit for new estimate) |
| Valuation history query    | < 500ms for 100 snapshots            |
| Market price-index         | < 300ms (paginated 50 rows)          |
| TypeScript strict mode     | 0 errors                             |

---

_WAVE_12_TEST_ROLLOUT.md — White Caves CRM_
