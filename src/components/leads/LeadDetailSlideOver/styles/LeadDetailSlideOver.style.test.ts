import { describe, it, expect } from 'vitest';
import * as styles from './LeadDetailSlideOver.style';

describe('LeadDetailSlideOver.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.Overlay).toBeDefined();
    expect(styles.Panel).toBeDefined();
    expect(styles.PanelHeader).toBeDefined();
    expect(styles.PanelTitle).toBeDefined();
    expect(styles.CloseBtn).toBeDefined();
    expect(styles.TabBar).toBeDefined();
    expect(styles.Tab).toBeDefined();
    expect(styles.PanelBody).toBeDefined();
    expect(styles.TimelineItem).toBeDefined();
  });
});
