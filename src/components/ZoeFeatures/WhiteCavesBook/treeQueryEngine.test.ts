// src/components/ZoeFeatures/WhiteCavesBook/treeQueryEngine.test.ts
import { describe, it, expect } from 'vitest';
import { AEGIS_12_LEVEL_CORPUS } from './masterLibraryData';
import {
  findNodeById,
  queryTreeCoordinate,
  calculateTokenSavingsBenchmark,
} from './treeQueryEngine';

describe('AEGIS 12-Level Sovereign Tree Query Engine (TURING-LAW-000)', () => {
  it('should verify Book 1 (White Caves) and Book 2 (AEGIS Engine) are properly decoupled', () => {
    const enterpriseLib = AEGIS_12_LEVEL_CORPUS.libraries[0];
    expect(enterpriseLib.books.length).toBe(2);

    const book1 = enterpriseLib.books[0];
    const book2 = enterpriseLib.books[1];

    expect(book1.bookId).toBe('book-01-white-caves');
    expect(book1.title).toBe('The Book of White Caves');
    expect(book1.subtitle).toContain('Real Estate');

    expect(book2.bookId).toBe('book-02-aegis');
    expect(book2.title).toBe('The Book of AEGIS');
    expect(book2.subtitle).toContain('Autonomous Sovereign Multi-Agent Mesh');
  });

  it('should resolve a Level 12 LineNode in White Caves Book with under 60 tokens footprint', () => {
    const targetNodeId = 'LN12-WC-L1';
    const result = findNodeById(AEGIS_12_LEVEL_CORPUS, targetNodeId);

    expect(result).not.toBeNull();
    if (result) {
      expect(result.level).toBe(12);
      expect((result.node as any).nodeId).toBe(targetNodeId);
      expect(result.tokenEstimate).toBeLessThan(60);
      expect(result.lineage.some(l => l.titleOrId.includes('White Caves'))).toBe(true);
    }
  });

  it('should resolve a Level 12 LineNode in AEGIS Engine Book with under 60 tokens footprint', () => {
    const targetNodeId = 'L12-001';
    const result = findNodeById(AEGIS_12_LEVEL_CORPUS, targetNodeId);

    expect(result).not.toBeNull();
    if (result) {
      expect(result.level).toBe(12);
      expect((result.node as any).nodeId).toBe(targetNodeId);
      expect(result.tokenEstimate).toBeLessThan(60);
      expect(result.lineage.some(l => l.titleOrId.includes('AEGIS'))).toBe(true);
    }
  });

  it('should query through coordinate interface directly', () => {
    const node = queryTreeCoordinate(AEGIS_12_LEVEL_CORPUS, {
      lineId: 'LN12-WC-L1',
    });
    expect(node).not.toBeNull();
    expect(node?.level).toBe(12);
  });

  it('should calculate 85% to 95%+ token reduction savings accurately', () => {
    const benchmark = calculateTokenSavingsBenchmark(8000, 50);
    expect(benchmark.savingsPercentage).toBeGreaterThanOrEqual(90);
    expect(benchmark.multiplierFactor).toBeGreaterThanOrEqual(100);
  });
});
