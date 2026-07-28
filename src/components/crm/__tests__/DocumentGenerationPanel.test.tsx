import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DocumentGenerationPanel } from '../DocumentGenerationPanel';

describe('DocumentGenerationPanel Component', () => {
  it('renders document template selection cards', () => {
    render(<DocumentGenerationPanel />);
    expect(screen.getByText(/Tenancy Contract \(Ejari\)/i)).toBeInTheDocument();
    expect(screen.getByText(/MOU \/ Sale Agreement \(Form F\)/i)).toBeInTheDocument();
  });

  it('switches between Generate and Library tabs', () => {
    render(<DocumentGenerationPanel />);
    const libraryTab = screen.getByText(/Document Library/i);
    fireEvent.click(libraryTab);
    expect(screen.getByPlaceholderText(/Search documents.../i)).toBeInTheDocument();
  });

  it('renders live contract preview modal when preview button is clicked in library tab', () => {
    render(<DocumentGenerationPanel />);
    const libraryTab = screen.getByText(/Document Library/i);
    fireEvent.click(libraryTab);

    const previewButtons = screen.getAllByText(/👁️ Preview/i);
    if (previewButtons.length > 0) {
      fireEvent.click(previewButtons[0]);
      expect(screen.getByText(/RERA OFFICIAL PREVIEW/i)).toBeInTheDocument();
      expect(screen.getByText(/WHITE CAVES REAL ESTATE LLC/i)).toBeInTheDocument();

      const closeButton = screen.getByText(/Close Preview/i);
      fireEvent.click(closeButton);
      expect(screen.queryByText(/RERA OFFICIAL PREVIEW/i)).not.toBeInTheDocument();
    }
  });
});
