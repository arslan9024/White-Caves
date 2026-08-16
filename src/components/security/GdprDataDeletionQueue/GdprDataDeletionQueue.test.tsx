import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { GdprDataDeletionQueue } from './GdprDataDeletionQueue';

describe('GdprDataDeletionQueue Component', () => {
  it('renders GDPR and UAE PDPL deletion queue and pending requests', () => {
    render(<GdprDataDeletionQueue />);
    expect(screen.getByTestId('gdpr-data-deletion-queue')).toBeDefined();
    expect(screen.getByText(/GDPR & UAE PDPL Right to Erasure Execution Queue/i)).toBeDefined();
    expect(screen.getByText(/PRIVACY GOVERNANCE/i)).toBeDefined();
    expect(screen.getByText(/Marc Dubois \(France \/ GDPR\)/i)).toBeDefined();
  });
});
