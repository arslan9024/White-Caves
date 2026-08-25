import { describe, it, expect } from 'vitest';
import * as styles from './LeadNotificationToast.style';

describe('LeadNotificationToast.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.Container).toBeDefined();
    expect(styles.Toast).toBeDefined();
    expect(styles.ToastIcon).toBeDefined();
    expect(styles.ToastBody).toBeDefined();
    expect(styles.ToastTitle).toBeDefined();
    expect(styles.ToastText).toBeDefined();
    expect(styles.ToastTime).toBeDefined();
    expect(styles.CloseBtn).toBeDefined();
    expect(styles.SoundToggle).toBeDefined();
  });
});
