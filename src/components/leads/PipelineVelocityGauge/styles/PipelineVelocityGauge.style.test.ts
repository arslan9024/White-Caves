import { describe, it, expect } from 'vitest';
import * as styles from './PipelineVelocityGauge.style';

describe('PipelineVelocityGauge.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.Root).toBeDefined();
    expect(styles.Title).toBeDefined();
    expect(styles.GaugeRow).toBeDefined();
    expect(styles.GaugeHeader).toBeDefined();
    expect(styles.StageName).toBeDefined();
    expect(styles.DaysInfo).toBeDefined();
    expect(styles.AvgDays).toBeDefined();
    expect(styles.TargetDays).toBeDefined();
    expect(styles.Track).toBeDefined();
    expect(styles.Fill).toBeDefined();
    expect(styles.Summary).toBeDefined();
  });
});
