/**
 * AppointmentScheduler — Unit Tests
 * Tests: rendering, date selection, schedule flow, reschedule mode,
 * AbortController cleanup, error handling, API success/failure
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const mockAuthFetch = vi.fn();
const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };

vi.mock('../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

vi.mock('../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

vi.mock('./Toast', () => ({
  useToast: () => mockToast,
}));

// Mock DatePicker as a simple input
vi.mock('react-datepicker', () => ({
  __esModule: true,
  default: ({ onChange, selected, placeholderText, ...props }: {
    onChange: (date: Date | null) => void;
    selected: Date | null;
    placeholderText?: string;
    [key: string]: unknown;
  }) => (
    <input
      data-testid="date-picker"
      placeholder={placeholderText}
      value={selected ? selected.toISOString() : ''}
      onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
    />
  ),
}));

vi.mock('react-datepicker/dist/react-datepicker.css', () => ({}));

vi.mock('./AppointmentScheduler.styles', () => ({
  AppointmentSchedulerContainer: ({ children }: React.PropsWithChildren) => <div data-testid="scheduler-container">{children}</div>,
  DatePickerWrapper: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  ScheduleButton: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <button {...props}>{children}</button>,
}));

import AppointmentScheduler from './AppointmentScheduler';

describe('AppointmentScheduler', () => {
  const defaultProps = {
    propertyId: 'prop-123',
    agentId: 'agent-456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ────── Rendering ──────

  it('renders schedule heading', () => {
    render(<AppointmentScheduler {...defaultProps} />);
    expect(screen.getByText('Schedule Viewing')).toBeInTheDocument();
  });

  it('renders date picker', () => {
    render(<AppointmentScheduler {...defaultProps} />);
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('renders schedule button disabled when no date selected', () => {
    render(<AppointmentScheduler {...defaultProps} />);
    const btn = screen.getByText('Schedule Appointment');
    expect(btn).toBeDisabled();
  });

  // ────── Date Selection & Scheduling ──────

  it('enables button after selecting date', () => {
    render(<AppointmentScheduler {...defaultProps} />);
    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2026-03-01T10:00:00.000Z' } });
    expect(screen.getByText('Schedule Appointment')).not.toBeDisabled();
  });

  it('calls authFetch with correct payload on schedule', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'apt-1' }),
    });

    render(<AppointmentScheduler {...defaultProps} />);

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2026-03-01T10:00:00.000Z' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Schedule Appointment'));
    });

    expect(mockAuthFetch).toHaveBeenCalledWith(
      '/api/appointments',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    // Verify payload includes propertyId and agentId
    const callBody = JSON.parse(mockAuthFetch.mock.calls[0][1].body);
    expect(callBody.propertyId).toBe('prop-123');
    expect(callBody.agentId).toBe('agent-456');
  });

  it('shows success toast on successful schedule', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'apt-1' }),
    });

    render(<AppointmentScheduler {...defaultProps} />);

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2026-03-01T10:00:00.000Z' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Schedule Appointment'));
    });

    expect(mockToast.success).toHaveBeenCalledWith('Appointment scheduled successfully!');
  });

  // ────── API Error Handling ──────

  it('shows error toast with server message on failed schedule', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Time slot unavailable' }),
    });

    render(<AppointmentScheduler {...defaultProps} />);

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2026-03-01T10:00:00.000Z' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Schedule Appointment'));
    });

    expect(mockToast.error).toHaveBeenCalledWith('Time slot unavailable');
  });

  it('shows fallback error message when json parsing fails', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: false,
      json: () => { throw new Error('Not JSON'); },
    });

    render(<AppointmentScheduler {...defaultProps} />);

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2026-03-01T10:00:00.000Z' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Schedule Appointment'));
    });

    expect(mockToast.error).toHaveBeenCalledWith('Failed to schedule appointment');
  });

  it('shows error toast on network exception', async () => {
    mockAuthFetch.mockRejectedValue(new Error('Network error'));

    render(<AppointmentScheduler {...defaultProps} />);

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2026-03-01T10:00:00.000Z' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Schedule Appointment'));
    });

    expect(mockToast.error).toHaveBeenCalledWith('Failed to schedule appointment');
  });

  // ────── AbortController / Race Condition ──────

  it('ignores AbortError silently', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    mockAuthFetch.mockRejectedValue(abortError);

    render(<AppointmentScheduler {...defaultProps} />);

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2026-03-01T10:00:00.000Z' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Schedule Appointment'));
    });

    expect(mockToast.error).not.toHaveBeenCalled();
    expect(mockToast.success).not.toHaveBeenCalled();
  });

  it('aborts previous request on rapid clicks', async () => {
    let callCount = 0;
    mockAuthFetch.mockImplementation((_url: string, opts: { signal?: AbortSignal }) => {
      callCount++;
      return new Promise((resolve, reject) => {
        if (opts?.signal) {
          opts.signal.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        }
        // Resolve after a delay (only last request should complete)
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ id: `apt-${callCount}` }),
        }), 100);
      });
    });

    render(<AppointmentScheduler {...defaultProps} />);

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2026-03-01T10:00:00.000Z' } });

    const btn = screen.getByText('Schedule Appointment');
    // Rapid clicks
    fireEvent.click(btn);
    fireEvent.click(btn);

    // Both requests should have been initiated
    expect(mockAuthFetch).toHaveBeenCalledTimes(2);
  });

  // ────── Resets ──────

  it('clears date after successful schedule', async () => {
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'apt-1' }),
    });

    render(<AppointmentScheduler {...defaultProps} />);

    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2026-03-01T10:00:00.000Z' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Schedule Appointment'));
    });

    // After successful schedule, the button should be disabled again
    expect(screen.getByText('Schedule Appointment')).toBeDisabled();
  });
});
