/**
 * WeeklyResearchModule – comprehensive test suite
 * Covers rendering, compact mode, schedule, topics, research run, toggle
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import WeeklyResearchModule from './WeeklyResearchModule';

/* ── Mock Redux ───────────────────────────────────────────────── */
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/slices/aiAssistantDashboardSlice', () => ({
  addExecutiveSuggestion: (payload: any) => ({ type: 'test/addExecutiveSuggestion', payload }),
}));

describe('WeeklyResearchModule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /* ── Rendering ──────────────────────────────────────────────── */
  describe('rendering', () => {
    it('renders module header', () => {
      render(<WeeklyResearchModule />);
      expect(screen.getByText('Weekly Research Module')).toBeInTheDocument();
    });

    it('renders subtitle with assistant name', () => {
      render(<WeeklyResearchModule assistantId="clara" />);
      expect(screen.getByText(/Automated intelligence gathering for Clara/)).toBeInTheDocument();
    });

    it('renders for different assistants', () => {
      render(<WeeklyResearchModule assistantId="olivia" />);
      expect(screen.getByText(/Automated intelligence gathering for Olivia/)).toBeInTheDocument();
    });

    it('defaults to clara template for unknown assistantId', () => {
      render(<WeeklyResearchModule assistantId="unknown-bot" />);
      expect(screen.getByText(/Automated intelligence gathering for Clara/)).toBeInTheDocument();
    });
  });

  /* ── Compact mode ───────────────────────────────────────────── */
  describe('compact mode', () => {
    it('renders compact header when compact=true', () => {
      render(<WeeklyResearchModule compact />);
      expect(screen.getByText('Weekly Research')).toBeInTheDocument();
    });

    it('shows Active badge when active in compact', () => {
      render(<WeeklyResearchModule compact isActive />);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('shows Paused badge when inactive in compact', () => {
      render(<WeeklyResearchModule compact isActive={false} />);
      expect(screen.getByText('Paused')).toBeInTheDocument();
    });

    it('expands on click in compact mode', () => {
      render(<WeeklyResearchModule compact />);
      fireEvent.click(screen.getByRole('button', { name: /Expand weekly research module/ }));
      expect(screen.getByText('Weekly Research Module')).toBeInTheDocument();
    });

    it('expands on Enter key in compact mode', () => {
      render(<WeeklyResearchModule compact />);
      fireEvent.keyDown(screen.getByRole('button', { name: /Expand weekly research module/ }), { key: 'Enter' });
      expect(screen.getByText('Weekly Research Module')).toBeInTheDocument();
    });
  });

  /* ── Schedule info ──────────────────────────────────────────── */
  describe('schedule', () => {
    it('renders schedule select with default weekly', () => {
      render(<WeeklyResearchModule />);
      const select = screen.getByDisplayValue('Weekly');
      expect(select).toBeInTheDocument();
    });

    it('renders all schedule options', () => {
      render(<WeeklyResearchModule />);
      expect(screen.getByText('Weekly')).toBeInTheDocument();
      expect(screen.getByText('Bi-Weekly')).toBeInTheDocument();
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    it('calls onScheduleChange when schedule changes', () => {
      const onScheduleChange = vi.fn();
      render(<WeeklyResearchModule onScheduleChange={onScheduleChange} />);
      fireEvent.change(screen.getByDisplayValue('Weekly'), { target: { value: 'monthly' } });
      expect(onScheduleChange).toHaveBeenCalledWith('monthly');
    });

    it('shows "Never" when lastResearch is null', () => {
      render(<WeeklyResearchModule lastResearch={null} />);
      expect(screen.getByText('Never')).toBeInTheDocument();
    });

    it('shows "Not scheduled" for next run when no lastResearch', () => {
      render(<WeeklyResearchModule lastResearch={null} />);
      expect(screen.getByText('Not scheduled')).toBeInTheDocument();
    });
  });

  /* ── Topics ─────────────────────────────────────────────────── */
  describe('topics', () => {
    it('renders research topics for clara', () => {
      render(<WeeklyResearchModule assistantId="clara" />);
      expect(screen.getByText('Lead conversion tools and CRM automation')).toBeInTheDocument();
      expect(screen.getByText('Sales pipeline optimization strategies')).toBeInTheDocument();
    });

    it('shows selected count', () => {
      render(<WeeklyResearchModule assistantId="clara" />);
      expect(screen.getByText('4 selected')).toBeInTheDocument();
    });

    it('toggles topic selection on click', () => {
      render(<WeeklyResearchModule assistantId="clara" />);
      const topic = screen.getByText('Lead conversion tools and CRM automation');
      fireEvent.click(topic.closest('[role="checkbox"]')!);
      expect(screen.getByText('3 selected')).toBeInTheDocument();
    });

    it('toggles topic on Enter key', () => {
      render(<WeeklyResearchModule assistantId="clara" />);
      const checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.keyDown(checkbox, { key: 'Enter' });
      expect(screen.getByText('3 selected')).toBeInTheDocument();
    });

    it('re-selects deselected topic', () => {
      render(<WeeklyResearchModule assistantId="clara" />);
      const checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(checkbox);
      expect(screen.getByText('3 selected')).toBeInTheDocument();
      fireEvent.click(checkbox);
      expect(screen.getByText('4 selected')).toBeInTheDocument();
    });
  });

  /* ── Toggle active/pause ────────────────────────────────────── */
  describe('toggle', () => {
    it('shows Pause button when active', () => {
      render(<WeeklyResearchModule isActive />);
      expect(screen.getByText('Pause')).toBeInTheDocument();
    });

    it('shows Start button when inactive', () => {
      render(<WeeklyResearchModule isActive={false} />);
      expect(screen.getByText('Start')).toBeInTheDocument();
    });

    it('calls onToggle when toggle button clicked', () => {
      const onToggle = vi.fn();
      render(<WeeklyResearchModule isActive onToggle={onToggle} />);
      fireEvent.click(screen.getByText('Pause'));
      expect(onToggle).toHaveBeenCalledWith(false);
    });
  });

  /* ── Run research ───────────────────────────────────────────── */
  describe('run research', () => {
    it('renders Run Research Now button', () => {
      render(<WeeklyResearchModule />);
      expect(screen.getByText('Run Research Now')).toBeInTheDocument();
    });

    it('shows Researching state on click', () => {
      render(<WeeklyResearchModule />);
      fireEvent.click(screen.getByText('Run Research Now'));
      expect(screen.getByText('Researching...')).toBeInTheDocument();
    });

    it('dispatches addExecutiveSuggestion after timeout', () => {
      render(<WeeklyResearchModule assistantId="clara" />);
      fireEvent.click(screen.getByText('Run Research Now'));
      act(() => { vi.advanceTimersByTime(2000); });
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('button is disabled while running', () => {
      render(<WeeklyResearchModule />);
      fireEvent.click(screen.getByText('Run Research Now'));
      const btn = screen.getByText('Researching...').closest('button');
      expect(btn).toBeDisabled();
    });

    it('button re-enables after research completes', () => {
      render(<WeeklyResearchModule />);
      fireEvent.click(screen.getByText('Run Research Now'));
      act(() => { vi.advanceTimersByTime(2000); });
      expect(screen.getByText('Run Research Now')).toBeInTheDocument();
      const btn = screen.getByText('Run Research Now').closest('button');
      expect(btn).not.toBeDisabled();
    });

    it('disables run button when no topics selected', () => {
      render(<WeeklyResearchModule assistantId="clara" />);
      // Deselect all 4 topics
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(cb => fireEvent.click(cb));
      const btn = screen.getByText('Run Research Now').closest('button');
      expect(btn).toBeDisabled();
    });
  });

  /* ── Send to Zoe ────────────────────────────────────────────── */
  describe('secondary actions', () => {
    it('renders Send to Zoe button', () => {
      render(<WeeklyResearchModule />);
      expect(screen.getByText('Send to Zoe')).toBeInTheDocument();
    });
  });
});
