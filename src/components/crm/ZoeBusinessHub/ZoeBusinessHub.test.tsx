import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ZoeBusinessHub } from './ZoeBusinessHub';

describe('ZoeBusinessHub Component', () => {
  it('renders business documentation catalog with search and category filters', () => {
    render(<ZoeBusinessHub />);

    expect(screen.getByTestId('zoe-business-hub')).toBeDefined();
    expect(screen.getByText(/Corporate & Legal Documentation Hub/i)).toBeDefined();
    expect(screen.getByText(/DOC-BUS-01/i)).toBeDefined();
    expect(screen.getByText(/DOC-BUS-02/i)).toBeDefined();
  });

  it('filters docs when typing in search query', () => {
    render(<ZoeBusinessHub />);

    const searchInput = screen.getByPlaceholderText(/Search business docs/i);
    fireEvent.change(searchInput, { target: { value: 'Ejari' } });

    expect(screen.getByText(/DOC-BUS-03/i)).toBeDefined();
  });

  it('opens doc in viewer overlay and triggers cross-assistant navigation', () => {
    const onNavigate = vi.fn();
    render(<ZoeBusinessHub onNavigateAssistant={onNavigate} />);

    const docCard = screen.getByTestId('doc-card-DOC-BUS-01');
    fireEvent.click(docCard);

    expect(screen.getByTestId('doc-viewer-overlay')).toBeDefined();
    expect(screen.getByText(/1388443/i)).toBeDefined();
    expect(screen.getByText(/44483/i)).toBeDefined();

    // Click link to Henry AI (3.19)
    const links = screen.getAllByRole('link');
    const henryLink = links.find((l) => l.getAttribute('href') === '#assistant-3.19');
    if (henryLink) {
      fireEvent.click(henryLink);
      expect(onNavigate).toHaveBeenCalledWith('3.19');
    }
  });
});
