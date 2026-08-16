import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploadDropzone } from './FileUploadDropzone';

describe('FileUploadDropzone Component', () => {
  it('renders dropzone container and handles file selection', () => {
    const onFilesSelected = vi.fn();
    render(<FileUploadDropzone onFilesSelected={onFilesSelected} />);
    expect(screen.getByTestId('file-upload-dropzone')).toBeDefined();
    expect(screen.getByText(/Upload Title Deed, Passport or Property Photos/i)).toBeDefined();

    const input = screen.getByTestId('file-upload-dropzone').querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDefined();

    const file = new File(['dummy content'], 'title_deed.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(onFilesSelected).toHaveBeenCalledWith([file]);
    expect(screen.getByText(/title_deed.pdf/i)).toBeDefined();
    expect(screen.getByText(/✓ Attached/i)).toBeDefined();
  });
});
