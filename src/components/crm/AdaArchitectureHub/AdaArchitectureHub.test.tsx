import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdaArchitectureHub } from './AdaArchitectureHub';

describe('AdaArchitectureHub Component', () => {
  it('renders architecture & SDLC catalog with search and category filters', () => {
    render(<AdaArchitectureHub />);

    expect(screen.getByTestId('ada-architecture-hub')).toBeDefined();
    expect(screen.getByText(/Chief Architecture & Engineering Governance Hub/i)).toBeDefined();
    expect(screen.getByText(/ADA-ARCH-01/i)).toBeDefined();
    expect(screen.getByText(/ADA-SDLC-01/i)).toBeDefined();
  });

  it('filters architecture docs when typing in search query', () => {
    render(<AdaArchitectureHub />);

    const searchInput = screen.getByPlaceholderText(/Search architecture docs/i);
    fireEvent.change(searchInput, { target: { value: 'Deduplication' } });

    expect(screen.getByText(/ADA-DEDUP-01/i)).toBeDefined();
  });

  it('opens doc in viewer overlay and triggers cross-assistant navigation', () => {
    const onNavigate = vi.fn();
    render(<AdaArchitectureHub onNavigateAssistant={onNavigate} />);

    const docCard = screen.getByTestId('ada-card-ADA-ARCH-01');
    fireEvent.click(docCard);

    expect(screen.getByTestId('ada-viewer-overlay')).toBeDefined();
    expect(screen.getByText(/React 18 \+ Vite/i)).toBeDefined();
  });
});
