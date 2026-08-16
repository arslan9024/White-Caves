import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpatialAudioGuide } from './SpatialAudioGuide';

describe('SpatialAudioGuide Component', () => {
  it('renders AI audio tour guide and switches between Nadia and Nina AI', () => {
    render(<SpatialAudioGuide />);
    expect(screen.getByTestId('spatial-audio-guide')).toBeDefined();
    expect(screen.getByText(/AI Audio Tour Guide/i)).toBeDefined();
    expect(screen.getByText(/▶️ Start Tour/i)).toBeDefined();

    // Switch to Nina AI
    const ninaBtn = screen.getByText(/🤖 Nina/i);
    fireEvent.click(ninaBtn);
    expect(screen.getAllByText(/Nina AI/i).length).toBeGreaterThan(0);
  });
});
