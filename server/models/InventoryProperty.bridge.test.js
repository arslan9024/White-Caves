import { describe, it, expect } from 'vitest';
import InventoryProperty from './InventoryProperty.js';

describe('InventoryProperty bridge', () => {
  it('resolves to the PropertyInventory mongoose model', () => {
    expect(InventoryProperty).toBeTruthy();
    expect(InventoryProperty.modelName).toBe('PropertyInventory');
  });
});
