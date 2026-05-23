import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MessageScheduler } from './MessageScheduler';

// ── helpers ────────────────────────────────────────────────────────────────────

/** Returns a datetime-local string (YYYY-MM-DDTHH:mm) 24 h from now */
function futureDatetime(): string {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
}

/** Returns a datetime-local string 1 minute in the past */
function pastDatetime(): string {
  const d = new Date(Date.now() - 60_000);
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
}

const CONTENT_PLACEHOLDER = /Enter the message you want to schedule/i;
const RECIPIENT_PLACEHOLDER = /Enter recipient/i;

// ── suite ──────────────────────────────────────────────────────────────────────

describe('MessageScheduler — Phase 36', () => {
  let mockSchedule: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSchedule = vi.fn().mockResolvedValue(undefined);
  });

  const renderScheduler = () => render(<MessageScheduler onScheduleMessage={mockSchedule} />);

  // ── shared fill helpers ──────────────────────────────────────────────────────

  const fillContent = (text = 'Test broadcast message') => {
    fireEvent.change(screen.getByPlaceholderText(CONTENT_PLACEHOLDER), {
      target: { value: text },
    });
  };

  const addRecipient = (phone = '+971501234567') => {
    fireEvent.change(screen.getByPlaceholderText(RECIPIENT_PLACEHOLDER), {
      target: { value: phone },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Add$/i }));
  };

  const setDatetime = (value: string) => {
    const input = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    fireEvent.change(input, { target: { value } });
  };

  const submitForm = () =>
    fireEvent.submit(screen.getByRole('form', { name: /Schedule message/i }));

  // ── tests ────────────────────────────────────────────────────────────────────

  it('renders form with content textarea, recipient input, and submit button', () => {
    renderScheduler();
    expect(screen.getByPlaceholderText(CONTENT_PLACEHOLDER)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(RECIPIENT_PLACEHOLDER)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Schedule Message/i })).toBeInTheDocument();
  });

  it('shows inline error — no content on submit', async () => {
    renderScheduler();
    submitForm();
    expect(await screen.findByRole('alert')).toHaveTextContent('Please enter a message');
  });

  it('shows inline error — no recipients on submit', async () => {
    renderScheduler();
    fillContent();
    submitForm();
    expect(await screen.findByRole('alert')).toHaveTextContent('Please add at least one recipient');
  });

  it('shows inline error — no schedule date on submit', async () => {
    renderScheduler();
    fillContent();
    addRecipient();
    submitForm();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please select a schedule date/time'
    );
  });

  it('shows inline error — scheduled time is in the past', async () => {
    renderScheduler();
    fillContent();
    addRecipient();
    setDatetime(pastDatetime());
    submitForm();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please select a future date and time'
    );
  });

  it('shows inline success message after scheduling and calls onScheduleMessage once', async () => {
    renderScheduler();
    fillContent('Hello Dubai!');
    addRecipient('+971509876543');
    setDatetime(futureDatetime());

    await act(async () => {
      submitForm();
    });

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('Message scheduled successfully');
    expect(mockSchedule).toHaveBeenCalledOnce();
    expect(mockSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Hello Dubai!',
        recipients: ['+971509876543'],
      })
    );
  });

  it('shows inline error when onScheduleMessage rejects', async () => {
    mockSchedule.mockRejectedValueOnce(new Error('Network timeout'));
    renderScheduler();
    fillContent();
    addRecipient();
    setDatetime(futureDatetime());

    await act(async () => {
      submitForm();
    });

    expect(await screen.findByRole('alert')).toHaveTextContent('Network timeout');
  });

  it('clears the status message when Clear button is clicked', async () => {
    renderScheduler();
    submitForm(); // triggers "please enter a message" error
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Clear/i }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('never calls window.alert()', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderScheduler();
    submitForm();
    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
