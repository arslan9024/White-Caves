import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FollowUpSequenceBuilder } from './FollowUpSequenceBuilder';
describe('FollowUpSequenceBuilder', () => {
  it('renders sequence steps', () => {
    render(<FollowUpSequenceBuilder />);
    expect(screen.getByTestId('follow-up-builder')).toBeTruthy();
    expect(screen.getByText('+ Add Step')).toBeTruthy();
  });
});
