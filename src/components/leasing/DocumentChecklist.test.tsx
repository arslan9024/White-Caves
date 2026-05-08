import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DocumentChecklist } from './DocumentChecklist';

// ── helpers ──────────────────────────────────────────────────────────────────
const makeProperty = (overrides = {}) => ({
  id: 'prop-5',
  title: 'Downtown Office',
  unitNumber: 'F-20',
  titleDeedMissing: false,
  landlordPassportMissing: false,
  ejariMissing: false,
  ...overrides,
});

const mockLocalStorage = () => {
  vi.mocked(global.localStorage.getItem).mockImplementation((key: string) =>
    key === 'token' ? 'mock-jwt' : null
  );
};

// ── suite ─────────────────────────────────────────────────────────────────────
describe('DocumentChecklist', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(window, 'fetch');
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    mockLocalStorage();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── 1 ──────────────────────────────────────────────────────────────────────
  it('renders modal title with unit number', () => {
    render(<DocumentChecklist property={makeProperty()} onClose={vi.fn()} onRefresh={vi.fn()} />);
    expect(screen.getByText(/Document Checklist: F-20/i)).toBeInTheDocument();
  });

  // ── 2 ──────────────────────────────────────────────────────────────────────
  it('shows verified state when no documents are missing', () => {
    render(<DocumentChecklist property={makeProperty()} onClose={vi.fn()} onRefresh={vi.fn()} />);
    expect(screen.getByText(/Title Deed Verified/i)).toBeInTheDocument();
    expect(screen.getByText(/Passport Verified/i)).toBeInTheDocument();
    expect(screen.getByText(/Ejari Verified/i)).toBeInTheDocument();
  });

  // ── 3 ──────────────────────────────────────────────────────────────────────
  it('shows missing rows when documents are absent', () => {
    render(
      <DocumentChecklist
        property={makeProperty({ titleDeedMissing: true, landlordPassportMissing: true })}
        onClose={vi.fn()}
        onRefresh={vi.fn()}
      />
    );
    expect(screen.getByText(/Missing Title Deed/i)).toBeInTheDocument();
    expect(screen.getByText(/Missing Passport/i)).toBeInTheDocument();
  });

  // ── 4 ──────────────────────────────────────────────────────────────────────
  it('no error banner shown on initial render', () => {
    render(<DocumentChecklist property={makeProperty()} onClose={vi.fn()} onRefresh={vi.fn()} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ── 5 ──────────────────────────────────────────────────────────────────────
  it('calls onRefresh on successful upload — no error shown', async () => {
    const onRefresh = vi.fn();
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { fileUrl: 'https://cdn/deed.pdf' } }), {
        status: 200,
      }) as Response
    );

    render(
      <DocumentChecklist
        property={makeProperty({ titleDeedMissing: true })}
        onClose={vi.fn()}
        onRefresh={onRefresh}
      />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['pdf content'], 'deed.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ── 6 ──────────────────────────────────────────────────────────────────────
  it('shows role="alert" ErrorBanner when upload returns non-ok', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 422 }) as Response);

    render(
      <DocumentChecklist
        property={makeProperty({ titleDeedMissing: true })}
        onClose={vi.fn()}
        onRefresh={vi.fn()}
      />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['bad'], 'bad.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Upload failed');
    expect(banner).toHaveAttribute('data-testid', 'doc-checklist-error');
  });

  // ── 7 ──────────────────────────────────────────────────────────────────────
  it('shows generic error on network throw during upload', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Network timeout'));

    render(
      <DocumentChecklist
        property={makeProperty({ landlordPassportMissing: true })}
        onClose={vi.fn()}
        onRefresh={vi.fn()}
      />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['passport'], 'passport.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Upload error');
  });

  // ── 8 ──────────────────────────────────────────────────────────────────────
  it('never calls window.alert()', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('boom'));

    render(
      <DocumentChecklist
        property={makeProperty({ ejariMissing: true })}
        onClose={vi.fn()}
        onRefresh={vi.fn()}
      />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['ejari'], 'ejari.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await screen.findByRole('alert');
    expect(alertSpy).not.toHaveBeenCalled();
  });

  // ── 9 ──────────────────────────────────────────────────────────────────────
  it('data-testid "doc-checklist-error" present on upload error', async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 500 }) as Response);

    render(
      <DocumentChecklist
        property={makeProperty({ titleDeedMissing: true })}
        onClose={vi.fn()}
        onRefresh={vi.fn()}
      />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: { files: [new File(['x'], 'x.pdf', { type: 'application/pdf' })] },
    });

    const banner = await screen.findByTestId('doc-checklist-error');
    expect(banner).toBeInTheDocument();
  });
});
