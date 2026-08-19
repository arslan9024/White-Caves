import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PipelineVelocityGauge } from './PipelineVelocityGauge';
describe('PipelineVelocityGauge', () => {
  it('renders all pipeline stages', () => {
    render(<PipelineVelocityGauge />);
    expect(screen.getByTestId('pipeline-velocity-gauge')).toBeTruthy();
    expect(screen.getByText('New → Contacted')).toBeTruthy();
    expect(screen.getByText('Offer → Closed')).toBeTruthy();
  });
});
