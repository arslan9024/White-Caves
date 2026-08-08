import { describe, expect, it } from 'vitest';
import { extractWaveItemsFromMarkdown } from '../srs-wave-backlog.js';

describe('extractWaveItemsFromMarkdown', () => {
  it('extracts wave items, requirement ids, owners, and checkpoints', () => {
    const markdown = `# SRS Implementation Packet

## Wave-ready backlog bridge

| Wave item | Scope | Primary requirement IDs | Suggested owner | Validation checkpoint |
| --- | --- | --- | --- | --- |
| WAVE-SRS-001 | Reservation and milestone consistency | \`FR-OP-001\`, \`FR-OP-002\` | Off-plan delivery lead | Reservation and milestone state align. |
| WAVE-SRS-002 | Deal readiness and ROI visibility | \`FR-CI-001\` | Commercial finance lead | Deal progression is blocked until ROI data is present. |
`;

    const items = extractWaveItemsFromMarkdown(markdown);

    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({
      waveItem: 'WAVE-SRS-001',
      scope: 'Reservation and milestone consistency',
      requirementIds: ['FR-OP-001', 'FR-OP-002'],
      owner: 'Off-plan delivery lead',
      validationCheckpoint: 'Reservation and milestone state align.',
    });
    expect(items[1].requirementIds).toEqual(['FR-CI-001']);
  });
});
