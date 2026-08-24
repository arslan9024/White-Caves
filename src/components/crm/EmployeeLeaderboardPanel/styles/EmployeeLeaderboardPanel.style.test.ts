import { describe, it, expect } from 'vitest';
import * as styles from './EmployeeLeaderboardPanel.style';

describe('EmployeeLeaderboardPanel.style', () => {
  it('exports styled components with valid styledComponentIds', () => {
    expect(styles.Container).toBeDefined();
    expect(styles.Header).toBeDefined();
    expect(styles.Title).toBeDefined();
    expect(styles.Container.styledComponentId).toBeDefined();
    expect(styles.Header.styledComponentId).toBeDefined();
    expect(styles.Title.styledComponentId).toBeDefined();
  });
});
