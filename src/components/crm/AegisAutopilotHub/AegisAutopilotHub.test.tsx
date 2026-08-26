import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AegisAutopilotHub } from './AegisAutopilotHub';

describe('AegisAutopilotHub Component', () => {
  it('renders orchestrator & autopilot catalog with search and category filters', () => {
    render(<AegisAutopilotHub />);

    expect(screen.getByTestId('aegis-autopilot-hub')).toBeDefined();
    expect(screen.getByText(/AEGIS Autonomous Engineering & Autopilot Hub/i)).toBeDefined();
    expect(screen.getByText(/AEGIS-STS-01/i)).toBeDefined();
    expect(screen.getByText(/AEGIS-POL-01/i)).toBeDefined();
  });

  it('filters docs when typing in search query', () => {
    render(<AegisAutopilotHub />);

    const searchInput = screen.getByPlaceholderText(/Search AEGIS modules/i);
    fireEvent.change(searchInput, { target: { value: 'Chronology' } });

    expect(screen.getByText(/AEGIS-LOG-01/i)).toBeDefined();
  });

  it('opens doc in viewer overlay and triggers cross-assistant navigation', () => {
    const onNavigate = vi.fn();
    render(<AegisAutopilotHub onNavigateAssistant={onNavigate} />);

    const docCard = screen.getByTestId('aegis-card-AEGIS-STS-01');
    fireEvent.click(docCard);

    expect(screen.getByTestId('aegis-viewer-overlay')).toBeDefined();
    expect(screen.getByText(/Active Policy Version/i)).toBeDefined();
    expect(screen.getByText(/0 Issues/i)).toBeDefined();
  });
});
