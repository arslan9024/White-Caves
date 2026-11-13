// src/components/ZoeFeatures/WhiteCavesBook/treeQueryEngine.test.ts
import { describe, it, expect } from 'vitest';
import { AEGIS_12_LEVEL_CORPUS } from './masterLibraryData';
import {
  findNodeById,
  queryTreeCoordinate,
  calculateTokenSavingsBenchmark,
  search12LevelTree,
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

  it('should execute 12-Level Omni-Search across books and return sub-60-token coordinates', () => {
    // Search for VAT in the library
    const results = search12LevelTree(AEGIS_12_LEVEL_CORPUS, 'VAT', 10);
    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(topResult.bookTitle).toContain('White Caves');
    expect(topResult.tokenEstimate).toBeLessThanOrEqual(60);

    // Search for Turing in the library
    const aegisResults = search12LevelTree(AEGIS_12_LEVEL_CORPUS, 'Turing', 10);
    expect(aegisResults.length).toBeGreaterThan(0);
    expect(aegisResults.some(r => r.bookId === 'book-02-aegis')).toBe(true);
  });

  it('should accurately resolve hover preview data for constitutional protocols and tree nodes', async () => {
    const { getNodePreviewData } = await import('./previewHelper');

    // Statutory protocol lookup
    const turingPreview = getNodePreviewData(AEGIS_12_LEVEL_CORPUS, 'TURING-LAW-000');
    expect(turingPreview).not.toBeNull();
    expect(turingPreview?.title).toContain('Turing Zero-Waste');
    expect(turingPreview?.badge).toBe('TURING-LAW-000');

    // AEG protocol lookup
    const aegPreview = getNodePreviewData(AEGIS_12_LEVEL_CORPUS, 'AEG-003');
    expect(aegPreview).not.toBeNull();
    expect(aegPreview?.category).toContain('Prometheus Pillar');

    // 12-Level tree node lookup
    const chPreview = getNodePreviewData(AEGIS_12_LEVEL_CORPUS, 'CH05-PROTOCOLS');
    expect(chPreview).not.toBeNull();
    expect(chPreview?.title).toContain('Sovereign Protocol Canon');
    expect(chPreview?.levelText).toBe('Level 5');
  });

  it('should compare tree navigation snapshots correctly for history tracking', async () => {
    const { areSnapshotsEqual } = await import('./navigationHistoryTypes');

    const snap1 = {
      bookId: 'book-01-white-caves',
      volId: 'VL03-001',
      cantoId: 'CN04-001',
      chapterId: 'CH05-001',
      subChapterId: null,
      sectionId: null,
      topicId: null,
      artifactId: null,
      paragraphId: null,
      sentenceId: null,
      lineId: null,
    };

    const snap2 = { ...snap1 };
    expect(areSnapshotsEqual(snap1, snap2)).toBe(true);

    const snap3 = { ...snap1, chapterId: 'CH05-002' };
    expect(areSnapshotsEqual(snap1, snap3)).toBe(false);
  });
});
