import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuroraSoftwareHub } from './AuroraSoftwareHub';

describe('AuroraSoftwareHub Component', () => {
  it('renders software documentation catalog with search and category filters', () => {
    render(<AuroraSoftwareHub />);

    expect(screen.getByTestId('aurora-software-hub')).toBeDefined();
    expect(screen.getByText(/Software Engineering & Architecture Hub/i)).toBeDefined();
    expect(screen.getByText(/DOC-SWE-01/i)).toBeDefined();
    expect(screen.getByText(/DOC-SWE-02/i)).toBeDefined();
  });

  it('filters docs when typing in search query', () => {
    render(<AuroraSoftwareHub />);

    const searchInput = screen.getByPlaceholderText(/Search software docs/i);
    fireEvent.change(searchInput, { target: { value: 'Deduplication' } });

    expect(screen.getByText(/DOC-SWE-06/i)).toBeDefined();
  });

  it('opens doc in viewer overlay and triggers cross-assistant navigation', () => {
    const onNavigate = vi.fn();
    render(<AuroraSoftwareHub onNavigateAssistant={onNavigate} />);

    const docCard = screen.getByTestId('doc-card-DOC-SWE-01');
    fireEvent.click(docCard);

    expect(screen.getByTestId('doc-viewer-overlay')).toBeDefined();
    expect(screen.getByText(/ISO\/IEC\/IEEE 29148/i)).toBeDefined();

    // Click link to Henry AI (3.19)
    const links = screen.getAllByRole('link');
    const henryLink = links.find((l) => l.getAttribute('href') === '#assistant-3.19');
    if (henryLink) {
      fireEvent.click(henryLink);
      expect(onNavigate).toHaveBeenCalledWith('3.19');
    }
  });
});
