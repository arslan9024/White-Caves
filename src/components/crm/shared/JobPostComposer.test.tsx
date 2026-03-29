/**
 * JobPostComposer — Unit Tests
 * Tests: rendering, form fields, platform selection, validation,
 * publish/save draft/preview, notification system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// ── vi.hoisted helpers (available in all vi.mock factories) ──────

const { makeDiv, makeBtn, mkIcon } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const R = require('react');
  function makeDiv(name: string) {
    const C = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) { if (!k.startsWith('$')) clean[k] = v; }
      return R.createElement('div', { 'data-testid': name, ...clean }, children);
    };
    C.displayName = name;
    return C;
  }
  function makeBtn(name: string) {
    const C = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) { if (!k.startsWith('$')) clean[k] = v; }
      return R.createElement('button', { 'data-testid': name, ...clean }, children);
    };
    C.displayName = name;
    return C;
  }
  function mkIcon(name: string) {
    const I = (props: Record<string, unknown>) => R.createElement('span', { 'data-icon': name, ...props });
    I.displayName = name;
    return I;
  }
  return { makeDiv, makeBtn, mkIcon };
});

// ── Styled-components mock ───────────────────────────────────────

vi.mock('./JobComponents.styles', () => ({
  JobPostComposer: makeDiv('JobPostComposer'),
  NotificationToast: makeDiv('NotificationToast'),
  ComposerHeader: makeDiv('ComposerHeader'),
  HeaderIcon: makeDiv('HeaderIcon'),
  HeaderInfo: makeDiv('HeaderInfo'),
  PlatformSelection: makeDiv('PlatformSelection'),
  PlatformsRow: makeDiv('PlatformsRow'),
  PlatformChip: makeBtn('PlatformChip'),
  JobForm: makeDiv('JobForm'),
  FormSection: makeDiv('FormSection'),
  FormGrid: makeDiv('FormGrid'),
  FormField: makeDiv('FormField'),
  InputWithIcon: makeDiv('InputWithIcon'),
  SalaryRange: makeDiv('SalaryRange'),
  ErrorMessage: makeDiv('ErrorMessage'),
  PlatformError: makeDiv('PlatformError'),
  ComposerActions: makeDiv('ComposerActions'),
  ActionBtn: makeBtn('ActionBtn'),
  JobPreview: makeDiv('JobPreview'),
  PreviewCard: makeDiv('PreviewCard'),
  PreviewHeader: makeDiv('PreviewHeader'),
  PreviewMeta: makeDiv('PreviewMeta'),
  PreviewSection: makeDiv('PreviewSection'),
}));

// ── Mock lucide-react icons ──────────────────────────────────────

vi.mock('lucide-react', () => ({
  Briefcase: mkIcon('Briefcase'), MapPin: mkIcon('MapPin'),
  DollarSign: mkIcon('DollarSign'), Clock: mkIcon('Clock'),
  Send: mkIcon('Send'), Save: mkIcon('Save'), Eye: mkIcon('Eye'),
  Linkedin: mkIcon('Linkedin'), Globe: mkIcon('Globe'),
  ChevronDown: mkIcon('ChevronDown'), ChevronUp: mkIcon('ChevronUp'),
  Users: mkIcon('Users'), Star: mkIcon('Star'),
}));

import JobPostComposer from './JobPostComposer';

// ── Tests ────────────────────────────────────────────────────────

describe('JobPostComposer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders header text', () => {
      render(<JobPostComposer />);
      expect(screen.getByText('Job Post Composer')).toBeInTheDocument();
      expect(screen.getByText('Create and publish job listings across multiple platforms')).toBeInTheDocument();
    });

    it('renders all platform chips', () => {
      render(<JobPostComposer />);
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('Indeed')).toBeInTheDocument();
      expect(screen.getByText('Bayt')).toBeInTheDocument();
      expect(screen.getByText('GulfTalent')).toBeInTheDocument();
    });

    it('renders job title input', () => {
      render(<JobPostComposer />);
      expect(screen.getByPlaceholderText('e.g., Senior Real Estate Agent')).toBeInTheDocument();
    });

    it('renders description textarea', () => {
      render(<JobPostComposer />);
      expect(screen.getByPlaceholderText('Describe the role, responsibilities, and day-to-day activities...')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      render(<JobPostComposer />);
      expect(screen.getByText('Save Draft')).toBeInTheDocument();
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('renders department select with options', () => {
      render(<JobPostComposer />);
      expect(screen.getByText('Select Department')).toBeInTheDocument();
      expect(screen.getByText('Sales')).toBeInTheDocument();
      expect(screen.getByText('Marketing')).toBeInTheDocument();
    });

    it('renders employment type select', () => {
      render(<JobPostComposer />);
      expect(screen.getByText('Full-time')).toBeInTheDocument();
      expect(screen.getByText('Part-time')).toBeInTheDocument();
    });

    it('renders experience level select', () => {
      render(<JobPostComposer />);
      expect(screen.getByText('Select Level')).toBeInTheDocument();
      expect(screen.getByText('Senior Level')).toBeInTheDocument();
    });
  });

  describe('Platform Selection', () => {
    it('has LinkedIn and Bayt selected by default', () => {
      render(<JobPostComposer />);
      expect(screen.getByText(/Publish to 2 Platforms/)).toBeInTheDocument();
    });

    it('toggles platform selection', () => {
      render(<JobPostComposer />);
      fireEvent.click(screen.getByText('LinkedIn'));
      expect(screen.getByText(/Publish to 1 Platform$/)).toBeInTheDocument();
    });

    it('can select all 4 platforms', () => {
      render(<JobPostComposer />);
      fireEvent.click(screen.getByText('Indeed'));
      fireEvent.click(screen.getByText('GulfTalent'));
      expect(screen.getByText(/Publish to 4 Platforms/)).toBeInTheDocument();
    });
  });

  describe('Form Input', () => {
    it('updates title on input', () => {
      render(<JobPostComposer />);
      const titleInput = screen.getByPlaceholderText('e.g., Senior Real Estate Agent');
      fireEvent.change(titleInput, { target: { value: 'Property Manager' } });
      expect(titleInput).toHaveValue('Property Manager');
    });

    it('updates description on input', () => {
      render(<JobPostComposer />);
      const descInput = screen.getByPlaceholderText('Describe the role, responsibilities, and day-to-day activities...');
      fireEvent.change(descInput, { target: { value: 'Manage luxury properties' } });
      expect(descInput).toHaveValue('Manage luxury properties');
    });

    it('updates location on input', () => {
      render(<JobPostComposer />);
      const locInput = screen.getByPlaceholderText('e.g., Dubai, UAE');
      fireEvent.change(locInput, { target: { value: 'Abu Dhabi, UAE' } });
      expect(locInput).toHaveValue('Abu Dhabi, UAE');
    });
  });

  describe('Validation', () => {
    it('disables publish button when title is empty', () => {
      render(<JobPostComposer />);
      const descInput = screen.getByPlaceholderText('Describe the role, responsibilities, and day-to-day activities...');
      fireEvent.change(descInput, { target: { value: 'Some description' } });
      // Button should be disabled because title is empty
      const publishBtn = screen.getByText(/Publish to/).closest('button');
      expect(publishBtn).toBeDisabled();
    });

    it('disables publish button when description is empty', () => {
      render(<JobPostComposer />);
      const titleInput = screen.getByPlaceholderText('e.g., Senior Real Estate Agent');
      fireEvent.change(titleInput, { target: { value: 'Manager' } });
      const publishBtn = screen.getByText(/Publish to/).closest('button');
      expect(publishBtn).toBeDisabled();
    });

    it('disables publish when no platform selected', () => {
      render(<JobPostComposer />);
      fireEvent.change(screen.getByPlaceholderText('e.g., Senior Real Estate Agent'), { target: { value: 'Title' } });
      fireEvent.change(screen.getByPlaceholderText('Describe the role, responsibilities, and day-to-day activities...'), { target: { value: 'Description text' } });
      fireEvent.click(screen.getByText('LinkedIn'));
      fireEvent.click(screen.getByText('Bayt'));
      const publishBtn = screen.getByText(/Publish to 0/).closest('button');
      expect(publishBtn).toBeDisabled();
    });

    it('enables publish button when all required fields filled', () => {
      render(<JobPostComposer />);
      fireEvent.change(screen.getByPlaceholderText('e.g., Senior Real Estate Agent'), { target: { value: 'Title' } });
      fireEvent.change(screen.getByPlaceholderText('Describe the role, responsibilities, and day-to-day activities...'), { target: { value: 'Desc' } });
      const publishBtn = screen.getByText(/Publish to/).closest('button');
      expect(publishBtn).not.toBeDisabled();
    });
  });

  describe('Publish', () => {
    it('calls onPublish with form data and platforms after successful publish', async () => {
      const onPublish = vi.fn();
      render(<JobPostComposer onPublish={onPublish} />);
      fireEvent.change(screen.getByPlaceholderText('e.g., Senior Real Estate Agent'), { target: { value: 'Agent' } });
      fireEvent.change(screen.getByPlaceholderText('Describe the role, responsibilities, and day-to-day activities...'), { target: { value: 'Role desc' } });
      await act(async () => {
        fireEvent.click(screen.getByText(/Publish to/));
      });
      await act(async () => {
        vi.advanceTimersByTime(2100);
      });
      expect(onPublish).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Agent', description: 'Role desc' }),
        expect.arrayContaining(['linkedin', 'bayt'])
      );
    });

    it('shows Publishing... text during publish', async () => {
      render(<JobPostComposer />);
      fireEvent.change(screen.getByPlaceholderText('e.g., Senior Real Estate Agent'), { target: { value: 'Agent' } });
      fireEvent.change(screen.getByPlaceholderText('Describe the role, responsibilities, and day-to-day activities...'), { target: { value: 'Description' } });
      await act(async () => {
        fireEvent.click(screen.getByText(/Publish to/));
      });
      expect(screen.getByText('Publishing...')).toBeInTheDocument();
      await act(async () => {
        vi.advanceTimersByTime(2100);
      });
    });

    it('shows success notification after publish', async () => {
      render(<JobPostComposer />);
      fireEvent.change(screen.getByPlaceholderText('e.g., Senior Real Estate Agent'), { target: { value: 'Agent' } });
      fireEvent.change(screen.getByPlaceholderText('Describe the role, responsibilities, and day-to-day activities...'), { target: { value: 'Desc' } });
      await act(async () => {
        fireEvent.click(screen.getByText(/Publish to/));
      });
      await act(async () => {
        vi.advanceTimersByTime(2100);
      });
      expect(screen.getByText(/Job posted successfully to 2 platforms!/)).toBeInTheDocument();
    });
  });

  describe('Save Draft', () => {
    it('calls onSaveDraft with form data', () => {
      const onSaveDraft = vi.fn();
      render(<JobPostComposer onSaveDraft={onSaveDraft} />);
      fireEvent.change(screen.getByPlaceholderText('e.g., Senior Real Estate Agent'), { target: { value: 'Draft Job' } });
      fireEvent.click(screen.getByText('Save Draft'));
      expect(onSaveDraft).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Draft Job' })
      );
    });

    it('shows draft saved notification', () => {
      render(<JobPostComposer />);
      fireEvent.click(screen.getByText('Save Draft'));
      expect(screen.getByText('Draft saved successfully!')).toBeInTheDocument();
    });
  });

  describe('Preview', () => {
    it('toggles preview panel', () => {
      render(<JobPostComposer />);
      expect(screen.queryByText('Job Preview')).not.toBeInTheDocument();
      fireEvent.click(screen.getByText('Preview'));
      expect(screen.getByText('Job Preview')).toBeInTheDocument();
    });

    it('shows form data in preview', () => {
      render(<JobPostComposer />);
      fireEvent.change(screen.getByPlaceholderText('e.g., Senior Real Estate Agent'), { target: { value: 'Preview Title' } });
      fireEvent.change(screen.getByPlaceholderText('Describe the role, responsibilities, and day-to-day activities...'), { target: { value: 'Preview description text' } });
      fireEvent.click(screen.getByText('Preview'));
      // Both textarea and preview section have the text, so use getAllByText
      expect(screen.getAllByText('Preview Title').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Preview description text').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('White Caves Real Estate')).toBeInTheDocument();
    });

    it('shows default text when fields are empty', () => {
      render(<JobPostComposer />);
      fireEvent.click(screen.getByText('Preview'));
      expect(screen.getAllByText('Job Title').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Notification Auto-Dismiss', () => {
    it('auto-dismisses notification after 4 seconds', async () => {
      render(<JobPostComposer />);
      fireEvent.click(screen.getByText('Save Draft'));
      expect(screen.getByText('Draft saved successfully!')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(4100);
      });
      expect(screen.queryByText('Draft saved successfully!')).not.toBeInTheDocument();
    });
  });

  describe('Pre-filled Job Data', () => {
    it('pre-fills form from job prop', () => {
      render(<JobPostComposer job={{ title: 'Existing Job', description: 'Existing desc', location: 'Sharjah, UAE' }} />);
      expect(screen.getByDisplayValue('Existing Job')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing desc')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Sharjah, UAE')).toBeInTheDocument();
    });
  });
});
