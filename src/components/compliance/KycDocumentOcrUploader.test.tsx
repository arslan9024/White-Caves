/**
 * KycDocumentOcrUploader.test.tsx
 * Vitest suite for KycDocumentOcrUploader (AEG-034 & AEG-017)
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KycDocumentOcrUploader } from './KycDocumentOcrUploader';

describe('KycDocumentOcrUploader Component (AEG-034 / AEG-017)', () => {
  it('renders OCR uploader drop zone and default state', () => {
    render(<KycDocumentOcrUploader />);

    expect(screen.getByTestId('kyc-ocr-uploader-card')).toBeInTheDocument();
    expect(screen.getByText(/Smart KYC & Emirates ID OCR Scanner/i)).toBeInTheDocument();
    expect(screen.getByText(/Drop Emirates ID, Passport, or Title Deed/i)).toBeInTheDocument();
  });

  it('scans an Emirates ID file and renders extracted fields with privacy masking', async () => {
    const handleScan = vi.fn();
    render(<KycDocumentOcrUploader onScanComplete={handleScan} />);

    const input = screen.getByTestId('kyc-file-input');
    const file = new File(['dummy-content'], 'emirates_id_front.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Verified Document \(EMIRATES_ID\)/i)).toBeInTheDocument();
    });

    expect(screen.getByText('ARSLAN MALIK')).toBeInTheDocument();
    // Default privacy masking should mask middle digits per AEG-017
    expect(screen.getByText(/784\*\*\*\*7-1/)).toBeInTheDocument();

    // Toggle reveal
    const toggleBtn = screen.getByTitle('Toggle Privacy Mask (AEG-017)');
    fireEvent.click(toggleBtn);

    expect(screen.getByText('784-1992-1234567-1')).toBeInTheDocument();
    expect(handleScan).toHaveBeenCalledWith(
      expect.objectContaining({
        documentType: 'EMIRATES_ID',
        idNumber: '784-1992-1234567-1',
      })
    );
  });
});
