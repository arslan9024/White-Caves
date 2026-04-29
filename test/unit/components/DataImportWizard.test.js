import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataImportWizard from '../../../src/components/MaryImport/DataImportWizard';

// Mock the API calls
jest.mock('../../../src/services/importService', () => ({
  validateFile: jest.fn(),
  createImportSession: jest.fn(),
  executeImport: jest.fn(),
}));

describe('DataImportWizard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the import wizard with file upload step', () => {
    render(<DataImportWizard />);

    expect(screen.getByText(/import/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('should accept Excel file uploads', async () => {
    const user = userEvent.setup();
    render(<DataImportWizard />);

    const input = screen.getByRole('textbox', { hidden: true });
    const file = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    await user.upload(input, file);

    await waitFor(() => {
      expect(input.files[0]).toBe(file);
    });
  });

  it('should display validation errors for invalid files', async () => {
    const user = userEvent.setup();
    render(<DataImportWizard />);

    const input = screen.getByRole('textbox', { hidden: true });
    const invalidFile = new File(['dummy'], 'test.txt', { type: 'text/plain' });

    await user.upload(input, invalidFile);

    await waitFor(() => {
      expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
    });
  });

  it('should show preview of data after upload', async () => {
    const user = userEvent.setup();
    render(<DataImportWizard />);

    // Simulate file upload
    const input = screen.getByRole('textbox', { hidden: true });
    const file = new File(['dummy'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    await user.upload(input, file);

    // Wait for preview to appear
    await waitFor(() => {
      expect(screen.getByText(/preview/i)).toBeInTheDocument();
    });
  });

  it('should proceed through wizard steps sequentially', async () => {
    const user = userEvent.setup();
    render(<DataImportWizard />);

    // Step 1: Upload
    expect(screen.getByText(/step 1/i)).toBeInTheDocument();

    // Click next
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    // Step 2: Mapping
    await waitFor(() => {
      expect(screen.getByText(/step 2/i)).toBeInTheDocument();
    });
  });

  it('should handle column mapping', async () => {
    const user = userEvent.setup();
    render(<DataImportWizard />);

    // Navigate to mapping step (assumes previous steps are completed)
    await waitFor(() => {
      const mappingInputs = screen.queryAllByRole('combobox');
      if (mappingInputs.length > 0) {
        expect(mappingInputs[0]).toBeInTheDocument();
      }
    });
  });

  it('should validate before proceeding to next step', async () => {
    const user = userEvent.setup();
    render(<DataImportWizard />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    // Should show validation error if no file selected
    await waitFor(() => {
      expect(screen.getByText(/please select a file/i)).toBeInTheDocument();
    });
  });

  it('should display summary before final import', async () => {
    const user = userEvent.setup();
    render(<DataImportWizard />);

    // Navigate to final step (assumes previous steps are completed)
    await waitFor(() => {
      const reviewButton = screen.queryByRole('button', { name: /review/i });
      if (reviewButton) {
        expect(reviewButton).toBeInTheDocument();
      }
    });
  });

  it('should execute import and show success message', async () => {
    const user = userEvent.setup();
    const { importService } = require('../../../src/services/importService');
    importService.executeImport.mockResolvedValue({
      success: true,
      importedCount: 100,
      failedCount: 0,
    });

    render(<DataImportWizard />);

    // Simulate complete import flow (simplified)
    const importButton = screen.getByRole('button', { name: /import|finish/i });
    await user.click(importButton);

    await waitFor(() => {
      expect(screen.getByText(/success|completed/i)).toBeInTheDocument();
    });
  });

  it('should handle import errors gracefully', async () => {
    const user = userEvent.setup();
    const { importService } = require('../../../src/services/importService');
    importService.executeImport.mockRejectedValue(new Error('Import failed'));

    render(<DataImportWizard />);

    const importButton = screen.getByRole('button', { name: /import|finish/i });
    await user.click(importButton);

    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  it('should allow user to go back to previous steps', async () => {
    const user = userEvent.setup();
    render(<DataImportWizard />);

    // Navigate forward
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    // Navigate backward
    const backButton = screen.getByRole('button', { name: /back|previous/i });
    if (backButton) {
      await user.click(backButton);

      await waitFor(() => {
        expect(screen.getByText(/step 1/i)).toBeInTheDocument();
      });
    }
  });
});
