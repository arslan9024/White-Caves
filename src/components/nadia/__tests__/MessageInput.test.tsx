/**
 * MessageInput Tests
 * ==================
 * Covers rendering, message composition, validation, keyboard shortcuts,
 * character counting, message type selection, disabled/loading states,
 * error display/dismiss, form submission, and accessibility.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MessageInput from '../MessageInput';

// Default props factory
function defaultProps(overrides: Partial<React.ComponentProps<typeof MessageInput>> = {}) {
  return {
    conversationId: 'conv-123',
    onSendMessage: vi.fn(),
    ...overrides,
  };
}

describe('MessageInput', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Basic Rendering ───────────────────────────────────────────────

  it('renders the message textarea', () => {
    render(<MessageInput {...defaultProps()} />);
    expect(screen.getByLabelText('Message content')).toBeInTheDocument();
  });

  it('renders the send button', () => {
    render(<MessageInput {...defaultProps()} />);
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('renders the message type selector', () => {
    render(<MessageInput {...defaultProps()} />);
    expect(screen.getByLabelText('Message type')).toBeInTheDocument();
  });

  it('renders Customer and Agent options', () => {
    render(<MessageInput {...defaultProps()} />);
    expect(screen.getByText('Customer Message')).toBeInTheDocument();
    expect(screen.getByText('Agent Message')).toBeInTheDocument();
  });

  it('renders character count as 0 / 500 initially', () => {
    render(<MessageInput {...defaultProps()} />);
    expect(screen.getByText('0 / 500')).toBeInTheDocument();
  });

  it('renders placeholder text with keyboard hint', () => {
    render(<MessageInput {...defaultProps()} />);
    const textarea = screen.getByLabelText('Message content');
    expect(textarea).toHaveAttribute('placeholder', 'Type message here... (Ctrl+Enter to send)');
  });

  it('has displayName set to MessageInput', () => {
    expect(MessageInput.displayName).toBe('MessageInput');
  });

  // ── Character Counting ────────────────────────────────────────────

  it('updates character count as user types', () => {
    render(<MessageInput {...defaultProps()} />);
    const textarea = screen.getByLabelText('Message content');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(screen.getByText('5 / 500')).toBeInTheDocument();
  });

  it('truncates input at 500 characters', () => {
    render(<MessageInput {...defaultProps()} />);
    const textarea = screen.getByLabelText('Message content') as HTMLTextAreaElement;
    const longText = 'A'.repeat(600);
    fireEvent.change(textarea, { target: { value: longText } });
    // Component applies .substring(0, 500)
    expect(textarea.value.length).toBeLessThanOrEqual(500);
    expect(screen.getByText('500 / 500')).toBeInTheDocument();
  });

  // ── Message Type Selection ────────────────────────────────────────

  it('defaults to CUSTOMER message type', () => {
    render(<MessageInput {...defaultProps()} />);
    const select = screen.getByLabelText('Message type') as HTMLSelectElement;
    expect(select.value).toBe('CUSTOMER');
  });

  it('allows switching to AGENT message type', () => {
    render(<MessageInput {...defaultProps()} />);
    const select = screen.getByLabelText('Message type');
    fireEvent.change(select, { target: { value: 'AGENT' } });
    expect((select as HTMLSelectElement).value).toBe('AGENT');
  });

  it('sends with selected message type', () => {
    const onSend = vi.fn();
    render(<MessageInput {...defaultProps({ onSendMessage: onSend })} />);
    
    const select = screen.getByLabelText('Message type');
    fireEvent.change(select, { target: { value: 'AGENT' } });
    
    const textarea = screen.getByLabelText('Message content');
    fireEvent.change(textarea, { target: { value: 'Agent reply' } });
    
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    
    expect(onSend).toHaveBeenCalledWith('Agent reply', 'AGENT');
  });

  // ── Form Submission ───────────────────────────────────────────────

  it('calls onSendMessage with trimmed content and messageType on submit', () => {
    const onSend = vi.fn();
    render(<MessageInput {...defaultProps({ onSendMessage: onSend })} />);
    
    const textarea = screen.getByLabelText('Message content');
    fireEvent.change(textarea, { target: { value: '  Hello World  ' } });
    
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    
    expect(onSend).toHaveBeenCalledWith('Hello World', 'CUSTOMER');
  });

  it('clears input after successful send', () => {
    const onSend = vi.fn();
    render(<MessageInput {...defaultProps({ onSendMessage: onSend })} />);
    
    const textarea = screen.getByLabelText('Message content') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    
    expect(textarea.value).toBe('');
    expect(screen.getByText('0 / 500')).toBeInTheDocument();
  });

  it('shows error when submitting empty message', () => {
    render(<MessageInput {...defaultProps()} />);
    
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Message cannot be empty/)).toBeInTheDocument();
  });

  it('shows error when submitting whitespace-only message', () => {
    render(<MessageInput {...defaultProps()} />);
    
    const textarea = screen.getByLabelText('Message content');
    fireEvent.change(textarea, { target: { value: '   ' } });
    
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    
    expect(screen.getByText(/Message cannot be empty/)).toBeInTheDocument();
  });

  it('does not call onSendMessage when validation fails', () => {
    const onSend = vi.fn();
    render(<MessageInput {...defaultProps({ onSendMessage: onSend })} />);
    
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    
    expect(onSend).not.toHaveBeenCalled();
  });

  // ── Error Handling ────────────────────────────────────────────────

  it('shows error when onSendMessage throws', () => {
    const onSend = vi.fn(() => { throw new Error('Network error'); });
    render(<MessageInput {...defaultProps({ onSendMessage: onSend })} />);
    
    const textarea = screen.getByLabelText('Message content');
    fireEvent.change(textarea, { target: { value: 'Test' } });
    
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    
    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it('shows generic error when non-Error is thrown', () => {
    const onSend = vi.fn(() => { throw 'string error'; });
    render(<MessageInput {...defaultProps({ onSendMessage: onSend })} />);
    
    const textarea = screen.getByLabelText('Message content');
    fireEvent.change(textarea, { target: { value: 'Test' } });
    
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    
    expect(screen.getByText(/Failed to send message/)).toBeInTheDocument();
  });

  it('dismisses error when dismiss button is clicked', () => {
    render(<MessageInput {...defaultProps()} />);
    
    // Trigger validation error
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Dismiss it
    fireEvent.click(screen.getByLabelText('Dismiss error'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does not show error initially', () => {
    render(<MessageInput {...defaultProps()} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ── Disabled State ────────────────────────────────────────────────

  it('disables textarea when disabled prop is true', () => {
    render(<MessageInput {...defaultProps({ disabled: true })} />);
    expect(screen.getByLabelText('Message content')).toBeDisabled();
  });

  it('disables send button when disabled prop is true', () => {
    render(<MessageInput {...defaultProps({ disabled: true })} />);
    expect(screen.getByLabelText('Send message')).toBeDisabled();
  });

  it('disables message type select when disabled', () => {
    render(<MessageInput {...defaultProps({ disabled: true })} />);
    expect(screen.getByLabelText('Message type')).toBeDisabled();
  });

  // ── Loading State ─────────────────────────────────────────────────

  it('shows "Sending..." on send button when loading', () => {
    render(<MessageInput {...defaultProps({ loading: true })} />);
    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });

  it('disables textarea when loading', () => {
    render(<MessageInput {...defaultProps({ loading: true })} />);
    expect(screen.getByLabelText('Message content')).toBeDisabled();
  });

  it('disables send button when loading', () => {
    render(<MessageInput {...defaultProps({ loading: true })} />);
    expect(screen.getByLabelText('Send message')).toBeDisabled();
  });

  it('disables message type select when loading', () => {
    render(<MessageInput {...defaultProps({ loading: true })} />);
    expect(screen.getByLabelText('Message type')).toBeDisabled();
  });

  // ── Send Button Disabled Logic ────────────────────────────────────

  it('send button is disabled when textarea is empty', () => {
    render(<MessageInput {...defaultProps()} />);
    expect(screen.getByLabelText('Send message')).toBeDisabled();
  });

  it('send button is enabled when valid text is entered', () => {
    render(<MessageInput {...defaultProps()} />);
    const textarea = screen.getByLabelText('Message content');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(screen.getByLabelText('Send message')).not.toBeDisabled();
  });

  // ── Keyboard Shortcuts ────────────────────────────────────────────

  it('sends message on Ctrl+Enter', () => {
    const onSend = vi.fn();
    render(<MessageInput {...defaultProps({ onSendMessage: onSend })} />);
    
    const textarea = screen.getByLabelText('Message content');
    fireEvent.change(textarea, { target: { value: 'Quick send' } });
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
    
    expect(onSend).toHaveBeenCalledWith('Quick send', 'CUSTOMER');
  });

  it('sends message on Meta+Enter (Mac)', () => {
    const onSend = vi.fn();
    render(<MessageInput {...defaultProps({ onSendMessage: onSend })} />);
    
    const textarea = screen.getByLabelText('Message content');
    fireEvent.change(textarea, { target: { value: 'Mac send' } });
    fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true });
    
    expect(onSend).toHaveBeenCalledWith('Mac send', 'CUSTOMER');
  });

  it('does not send on plain Enter', () => {
    const onSend = vi.fn();
    render(<MessageInput {...defaultProps({ onSendMessage: onSend })} />);
    
    const textarea = screen.getByLabelText('Message content');
    fireEvent.change(textarea, { target: { value: 'No send' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    
    expect(onSend).not.toHaveBeenCalled();
  });

  it('does not send on Ctrl+Enter when disabled', () => {
    const onSend = vi.fn();
    render(<MessageInput {...defaultProps({ onSendMessage: onSend, disabled: true })} />);
    
    const textarea = screen.getByLabelText('Message content');
    // Can't change value of disabled textarea through events, but test the guard
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
    
    expect(onSend).not.toHaveBeenCalled();
  });

  it('does not send on Ctrl+Enter when loading', () => {
    const onSend = vi.fn();
    render(<MessageInput {...defaultProps({ onSendMessage: onSend, loading: true })} />);
    
    const textarea = screen.getByLabelText('Message content');
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
    
    expect(onSend).not.toHaveBeenCalled();
  });

  it('does not send on Ctrl+Enter when textarea is empty', () => {
    const onSend = vi.fn();
    render(<MessageInput {...defaultProps({ onSendMessage: onSend })} />);
    
    const textarea = screen.getByLabelText('Message content');
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
    
    expect(onSend).not.toHaveBeenCalled();
  });

  // ── Textarea Rows ─────────────────────────────────────────────────

  it('textarea has 3 rows', () => {
    render(<MessageInput {...defaultProps()} />);
    const textarea = screen.getByLabelText('Message content');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  // ── Accessibility ─────────────────────────────────────────────────

  it('error container has role="alert"', () => {
    render(<MessageInput {...defaultProps()} />);
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('dismiss button has accessible label', () => {
    render(<MessageInput {...defaultProps()} />);
    const form = screen.getByLabelText('Send message').closest('form')!;
    fireEvent.submit(form);
    expect(screen.getByLabelText('Dismiss error')).toBeInTheDocument();
  });

  it('all interactive elements have accessible labels', () => {
    render(<MessageInput {...defaultProps()} />);
    expect(screen.getByLabelText('Message content')).toBeInTheDocument();
    expect(screen.getByLabelText('Message type')).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });
});
