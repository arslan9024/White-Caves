import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeadScoreBadge } from './LeadScoreBadge';
describe('LeadScoreBadge', () => {
  it('shows S tier for score 95', () => {
    render(<LeadScoreBadge score={95} />);
    expect(screen.getByText('S')).toBeTruthy();
    expect(screen.getByText('Super Hot')).toBeTruthy();
  });
  it('shows D tier for score 20', () => {
    render(<LeadScoreBadge score={20} />);
    expect(screen.getByText('D')).toBeTruthy();
  });
});
