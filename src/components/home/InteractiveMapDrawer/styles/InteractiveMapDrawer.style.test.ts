import { describe, it, expect } from 'vitest';
import * as styles from './InteractiveMapDrawer.style';

describe('InteractiveMapDrawer.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.MapContainer).toBeDefined();
    expect(styles.MapPinMarker).toBeDefined();
    expect(styles.SlideDrawer).toBeDefined();
  });
});
