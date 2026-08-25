import { describe, it, expect } from 'vitest';
import * as styles from './AnimatedHeadlineGradient.style';

describe('AnimatedHeadlineGradient.style', () => {
  it('exports styled headline component', () => {
    expect(styles).toBeDefined();
    expect(styles.Headline).toBeDefined();
  });
});
