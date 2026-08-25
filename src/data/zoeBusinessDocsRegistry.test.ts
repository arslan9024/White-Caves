import { describe, it, expect } from 'vitest';
import { ZOE_BUSINESS_DOCS, ZOE_BUSINESS_CATEGORIES } from './zoeBusinessDocsRegistry';

describe('zoeBusinessDocsRegistry', () => {
  it('contains all business documentation items with valid HTML and metadata', () => {
    expect(ZOE_BUSINESS_DOCS.length).toBeGreaterThanOrEqual(6);
    expect(ZOE_BUSINESS_CATEGORIES.length).toBeGreaterThanOrEqual(7);

    const doc01 = ZOE_BUSINESS_DOCS.find((d) => d.code === 'DOC-BUS-01');
    expect(doc01).toBeDefined();
    expect(doc01?.title).toContain('Corporate Identity');
    expect(doc01?.htmlContent).toContain('1388443'); // DET License
    expect(doc01?.htmlContent).toContain('44483');   // RERA ORN
    expect(doc01?.htmlContent).toContain('0120250814005322'); // Ejari
  });

  it('contains cross-links to key assistants in HTML', () => {
    const doc03 = ZOE_BUSINESS_DOCS.find((d) => d.code === 'DOC-BUS-03');
    expect(doc03?.htmlContent).toContain('3.19 Henry AI');

    const doc04 = ZOE_BUSINESS_DOCS.find((d) => d.code === 'DOC-BUS-04');
    expect(doc04?.htmlContent).toContain('3.14 Theodora AI');
  });
});
