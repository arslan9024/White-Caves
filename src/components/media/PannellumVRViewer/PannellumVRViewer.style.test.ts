import { describe, it, expect } from 'vitest';
import * as styles from './PannellumVRViewer.style';

describe('PannellumVRViewer.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.VrContainer).toBeDefined();
    expect(styles.VrViewport).toBeDefined();
    expect(styles.HotspotButton).toBeDefined();
    expect(styles.VrControls).toBeDefined();
  });
});
