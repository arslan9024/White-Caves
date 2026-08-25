import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import HenrySharedDocumentUploader from './HenrySharedDocumentUploader';

describe('HenrySharedDocumentUploader', () => {
  it('renders title, subtitle, dropzone, and calls onSampleLoad when sample button clicked', () => {
    const onSampleLoad = vi.fn();
    render(
      <HenrySharedDocumentUploader
        title="Sample Document Uploader"
        subtitle="Upload official PDF or scanned image"
        onSampleLoad={onSampleLoad}
        onFileUpload={() => {}}
      />
    );

    expect(screen.getByText('Sample Document Uploader')).toBeInTheDocument();
    expect(screen.getByText('Upload official PDF or scanned image')).toBeInTheDocument();

    const sampleBtn = screen.getByText(/Load Demo Benchmark/i);
    fireEvent.click(sampleBtn);
    expect(onSampleLoad).toHaveBeenCalled();
  });
});
