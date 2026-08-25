import { describe, it, expect } from 'vitest';
import * as styles from './LeadKanbanBoard.style';

describe('LeadKanbanBoard.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.BoardRoot).toBeDefined();
    expect(styles.Column).toBeDefined();
    expect(styles.ColumnHeader).toBeDefined();
    expect(styles.ColumnTitle).toBeDefined();
    expect(styles.ColumnCount).toBeDefined();
    expect(styles.CardList).toBeDefined();
  });
});
