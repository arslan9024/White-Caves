/**
 * PlatformPublisherForm — Unit Tests
 * Tests: rendering, platform selection, form fields, collapsible sections,
 * publish flow, save draft, platform-specific fields
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// ── vi.hoisted helpers ───────────────────────────────────────────

const { mkIcon } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const R = require('react');
  function mkIcon(name: string) {
    const I = (props: Record<string, unknown>) => R.createElement('span', { 'data-icon': name, ...props });
    I.displayName = name;
    return I;
  }
  return { mkIcon };
});

// ── CSS mock ─────────────────────────────────────────────────────

vi.mock('./PlatformPublisher.css', () => ({}));

// ── Mock lucide-react icons (explicit, no Proxy) ─────────────────

vi.mock('lucide-react', () => ({
  Upload: mkIcon('Upload'), Check: mkIcon('Check'), AlertCircle: mkIcon('AlertCircle'),
  Globe: mkIcon('Globe'), Building2: mkIcon('Building2'), Image: mkIcon('Image'),
  FileText: mkIcon('FileText'), Send: mkIcon('Send'),
  ChevronDown: mkIcon('ChevronDown'), ChevronUp: mkIcon('ChevronUp'),
}));

import PlatformPublisherForm from './PlatformPublisherForm';

// ── Tests ────────────────────────────────────────────────────────

describe('PlatformPublisherForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders header text', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText('Multi-Platform Publisher')).toBeInTheDocument();
      expect(screen.getByText('Publish your property to multiple portals at once')).toBeInTheDocument();
    });

    it('renders all platform cards', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText('Bayut')).toBeInTheDocument();
      expect(screen.getByText('Property Finder')).toBeInTheDocument();
      expect(screen.getByText('Dubizzle')).toBeInTheDocument();
    });

    it('renders Select Platforms heading', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText('Select Platforms')).toBeInTheDocument();
    });

    it('renders Property Details section', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText('Property Details')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText('Save as Draft')).toBeInTheDocument();
      expect(screen.getByText(/Publish to/)).toBeInTheDocument();
    });

    it('renders image upload zone', () => {
      render(<PlatformPublisherForm />);
      fireEvent.click(screen.getByText('Property Images'));
      expect(screen.getByText('Drag and drop images here or click to browse')).toBeInTheDocument();
    });
  });

  describe('Platform Selection', () => {
    it('has Bayut and Property Finder selected by default', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText(/Publish to 2 Platform/)).toBeInTheDocument();
    });

    it('shows Dubizzle as disabled (pending status)', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText('Setup Required')).toBeInTheDocument();
    });

    it('can deselect a platform', () => {
      render(<PlatformPublisherForm />);
      fireEvent.click(screen.getByText('Bayut'));
      expect(screen.getByText(/Publish to 1 Platform$/)).toBeInTheDocument();
    });

    it('disables publish when no platforms selected', () => {
      render(<PlatformPublisherForm />);
      fireEvent.click(screen.getByText('Bayut'));
      fireEvent.click(screen.getByText('Property Finder'));
      const publishBtn = screen.getByText(/Publish to 0/);
      expect(publishBtn.closest('button')).toBeDisabled();
    });
  });

  describe('Common Form Fields', () => {
    it('renders Property Title input', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByPlaceholderText('Enter property title')).toBeInTheDocument();
    });

    it('renders Description textarea', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    it('renders Price field', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByPlaceholderText('Enter price (aed)')).toBeInTheDocument();
    });

    it('renders Bedrooms select', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText('Select Bedrooms')).toBeInTheDocument();
    });

    it('renders Property Type select', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText('Select Property Type')).toBeInTheDocument();
    });

    it('renders Purpose select', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText('Select Purpose')).toBeInTheDocument();
    });

    it('updates field on input change', () => {
      render(<PlatformPublisherForm />);
      const titleInput = screen.getByPlaceholderText('Enter property title');
      fireEvent.change(titleInput, { target: { value: 'Luxury Villa' } });
      expect(titleInput).toHaveValue('Luxury Villa');
    });
  });

  describe('Platform-Specific Fields', () => {
    it('shows Bayut-specific fields (Permit Number, Broker ORN)', () => {
      render(<PlatformPublisherForm />);
      fireEvent.click(screen.getByText('Bayut Specific Fields'));
      expect(screen.getByPlaceholderText('Enter permit number')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter broker orn')).toBeInTheDocument();
    });

    it('shows Property Finder-specific fields (Reference Number)', () => {
      render(<PlatformPublisherForm />);
      fireEvent.click(screen.getByText('Property Finder Specific Fields'));
      expect(screen.getByPlaceholderText('Enter reference number')).toBeInTheDocument();
    });

    it('hides platform fields when platform is deselected', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByText('Bayut Specific Fields')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Bayut'));
      expect(screen.queryByText('Bayut Specific Fields')).not.toBeInTheDocument();
    });
  });

  describe('Collapsible Sections', () => {
    it('toggles Property Details section', () => {
      render(<PlatformPublisherForm />);
      expect(screen.getByPlaceholderText('Enter property title')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Property Details'));
      expect(screen.queryByPlaceholderText('Enter property title')).not.toBeInTheDocument();
      fireEvent.click(screen.getByText('Property Details'));
      expect(screen.getByPlaceholderText('Enter property title')).toBeInTheDocument();
    });
  });

  describe('Publish Flow', () => {
    it('shows Publishing... during publish', async () => {
      render(<PlatformPublisherForm />);
      await act(async () => {
        fireEvent.click(screen.getByText(/Publish to 2/));
      });
      expect(screen.getByText('Publishing...')).toBeInTheDocument();
    });

    it('calls onPublish with data and platforms after publish completes', async () => {
      const onPublish = vi.fn();
      render(<PlatformPublisherForm onPublish={onPublish} />);
      fireEvent.change(screen.getByPlaceholderText('Enter property title'), { target: { value: 'Test Property' } });
      await act(async () => {
        fireEvent.click(screen.getByText(/Publish to 2/));
      });
      // First platform publish (1500ms)
      await act(async () => {
        vi.advanceTimersByTime(1600);
      });
      // Second platform publish (1500ms)
      await act(async () => {
        vi.advanceTimersByTime(1600);
      });
      expect(onPublish).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Test Property' }),
        expect.arrayContaining(['bayut', 'property_finder'])
      );
    });

    it('disables publish button during publish', async () => {
      render(<PlatformPublisherForm />);
      await act(async () => {
        fireEvent.click(screen.getByText(/Publish to 2/));
      });
      const publishBtn = screen.getByText('Publishing...').closest('button');
      expect(publishBtn).toBeDisabled();
    });
  });

  describe('Save Draft', () => {
    it('calls onSaveDraft with form data', () => {
      const onSaveDraft = vi.fn();
      render(<PlatformPublisherForm onSaveDraft={onSaveDraft} />);
      fireEvent.change(screen.getByPlaceholderText('Enter property title'), { target: { value: 'Draft Villa' } });
      fireEvent.click(screen.getByText('Save as Draft'));
      expect(onSaveDraft).toHaveBeenCalledWith(expect.objectContaining({ title: 'Draft Villa' }));
    });
  });

  describe('Pre-filled Property Data', () => {
    it('pre-fills form from property prop', () => {
      render(<PlatformPublisherForm property={{ title: 'Pre-filled Title', price: '5000000' } as Record<string, unknown>} />);
      expect(screen.getByDisplayValue('Pre-filled Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5000000')).toBeInTheDocument();
    });
  });
});
