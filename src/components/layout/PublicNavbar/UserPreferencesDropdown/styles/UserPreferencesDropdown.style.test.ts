import { describe, it, expect } from 'vitest';
import * as styles from './UserPreferencesDropdown.style';

describe('UserPreferencesDropdown.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.DropdownContainer).toBeDefined();
    expect(styles.UserHeader).toBeDefined();
    expect(styles.UserDetails).toBeDefined();
  });
});
