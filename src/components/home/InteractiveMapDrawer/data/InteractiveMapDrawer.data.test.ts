import { describe, it, expect } from 'vitest';
import { MAP_PINS, MAP_DRAWER_TEXT } from './InteractiveMapDrawer.data';

describe('InteractiveMapDrawer.data', () => {
  it('exports map pins and drawer text', () => {
    expect(MAP_PINS.length).toBeGreaterThan(0);
    expect(MAP_PINS[0].id).toBe('PIN-1');
    expect(MAP_DRAWER_TEXT.drawerTitle).toBe('Property Quick View');
  });
});
