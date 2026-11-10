import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LiveVoiceDispatchDrawer from './LiveVoiceDispatchDrawer';
import { WhisperAudioTranscriptionService } from '../../../../services/WhisperAudioTranscriptionService';

vi.mock('../../../../services/WhisperAudioTranscriptionService', () => ({
  WhisperAudioTranscriptionService: {
    transcribeAudio: vi.fn().mockResolvedValue({
      text: 'Mocked voice instruction for luxury offplan',
      confidence: 0.98,
      durationSeconds: 2,
    }),
  },
}));

describe('LiveVoiceDispatchDrawer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default channel Zoe and online status', () => {
    render(<LiveVoiceDispatchDrawer />);

    expect(screen.getByTestId('live-voice-dispatch-drawer')).toBeInTheDocument();
    expect(screen.getByText(/LIVE DISPATCH/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Zoe/i)).toBeInTheDocument();
    expect(screen.getByTestId('channel-pill-zoe')).toBeInTheDocument();
  });

  it('switches active channel on channel pill click', () => {
    render(<LiveVoiceDispatchDrawer />);

    const lindaPill = screen.getByTestId('channel-pill-linda');
    fireEvent.click(lindaPill);

    expect(screen.getByPlaceholderText(/Voice or text directive to AI Linda/i)).toBeInTheDocument();
  });

  it('handles text message dispatch correctly and triggers task callback', async () => {
    const handleDispatchTask = vi.fn();
    render(<LiveVoiceDispatchDrawer onDispatchTask={handleDispatchTask} />);

    const input = screen.getByTestId('voice-dispatch-text-input');
    const sendBtn = screen.getByTestId('btn-send-dispatch');

    fireEvent.change(input, { target: { value: 'Audit Ejari 2026 expiries' } });
    fireEvent.click(sendBtn);

    expect(screen.getByText('Audit Ejari 2026 expiries')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(handleDispatchTask).toHaveBeenCalledWith('zoe', 'Audit Ejari 2026 expiries');
      },
      { timeout: 1500 }
    );
  });

  it('toggles voice recording and transcribes via Whisper service', async () => {
    vi.useFakeTimers();
    const handleDispatchTask = vi.fn();
    render(<LiveVoiceDispatchDrawer onDispatchTask={handleDispatchTask} />);

    const micBtn = screen.getByTestId('btn-mic-toggle');

    // Start recording
    act(() => {
      fireEvent.click(micBtn);
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Stop recording and trigger transcription
    await act(async () => {
      fireEvent.click(micBtn);
    });

    expect(WhisperAudioTranscriptionService.transcribeAudio).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
