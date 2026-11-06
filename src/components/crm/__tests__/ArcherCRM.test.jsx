// FILE: src/components/crm/__tests__/ArcherCRM.test.jsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ArcherCRM from '../ArcherCRM';

vi.mock('../shared/AssistantDocsTab', () => ({
  default: () => <div data-testid="mock-docs-tab">Docs Tab</div>,
}));

vi.mock('../shared/AssistantLifecycleTab', () => ({
  default: () => <div data-testid="mock-lifecycle-tab">Lifecycle Tab</div>,
}));

describe('ArcherCRM', () => {
  it('renders Archer header and lead scoring engine title', () => {
    render(<ArcherCRM />);
    expect(screen.getByText(/Archer — Lead Scoring Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Scoring Active/i)).toBeInTheDocument();
  });

  it('renders quick stats and lead score table', () => {
    render(<ArcherCRM />);
    expect(screen.getByText(/Hot Leads \(80\+\)/i)).toBeInTheDocument();
    expect(screen.getByText('Ahmad Al Rashidi')).toBeInTheDocument();
    expect(screen.getByText('Priya Nair')).toBeInTheDocument();
  });

  it('filters leads by search query', () => {
    render(<ArcherCRM />);
    const searchInput = screen.getByPlaceholderText(/Search leads…/i);
    fireEvent.change(searchInput, { target: { value: 'Chen' } });
    expect(screen.getByText('Chen Wei')).toBeInTheDocument();
    expect(screen.queryByText('Ahmad Al Rashidi')).not.toBeInTheDocument();
  });

  it('switches to scoring model tab and queue tab', () => {
    render(<ArcherCRM />);
    fireEvent.click(screen.getByText(/⚖️ Scoring Model/i));
    expect(screen.getByText(/Scoring Model Weights/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/📋 Agent Queue/i));
    expect(screen.getByText(/Agent Work Queue \(Priority Order\)/i)).toBeInTheDocument();
  });
});
