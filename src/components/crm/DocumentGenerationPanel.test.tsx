import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DocumentGenerationPanel } from './DocumentGenerationPanel';

describe('DocumentGenerationPanel — production quality tests', () => {
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders without crashing', () => {
    render(<DocumentGenerationPanel />);
    expect(screen.getByText(/Document Generation Centre/i)).toBeInTheDocument();
  });

  it('renders template options including Ejari contract', () => {
    render(<DocumentGenerationPanel />);
    expect(screen.getByText('Tenancy Contract (Ejari)')).toBeInTheDocument();
    expect(screen.getByText('MOU / Sale Agreement (Form F)')).toBeInTheDocument();
  });

  it('allows switching tabs between Generate and Library', () => {
    render(<DocumentGenerationPanel />);
    const libraryTab = screen.getByText(/Document Library/i);
    fireEvent.click(libraryTab);
    // Library tab shows a search input with placeholder
    expect(screen.getByPlaceholderText(/Search documents/i)).toBeInTheDocument();
  });

  it('opens live RERA PDF contract preview modal', () => {
    render(<DocumentGenerationPanel />);
    // Switch to library tab where generated docs exist
    const libraryTab = screen.getByText(/Document Library/i);
    fireEvent.click(libraryTab);
    
    // Find Preview button
    const previewButtons = screen.getAllByText(/👁️ Preview/i);
    if (previewButtons.length > 0) {
      fireEvent.click(previewButtons[0]);
      expect(screen.getByText(/RERA OFFICIAL PREVIEW/i)).toBeInTheDocument();
    }
  });

  it('never calls window.alert on download or print actions', () => {
    render(<DocumentGenerationPanel />);
    const libraryTab = screen.getByText(/Document Library/i);
    fireEvent.click(libraryTab);

    const pdfButtons = screen.getAllByText(/⬇ PDF/i);
    if (pdfButtons.length > 0) {
      fireEvent.click(pdfButtons[0]);
    }
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
