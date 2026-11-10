import styled, { keyframes, css } from 'styled-components';

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
    transform: scale(1.04);
  }
`;

const waveBar = keyframes`
  0%, 100% {
    height: 6px;
  }
  50% {
    height: 22px;
  }
`;

export const LiveVoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #090e17;
  color: #f8fafc;
  font-family: inherit;
  overflow: hidden;

  [data-theme='light'] & {
    background: #f8fafc;
    color: #0f172a;
  }
`;

export const LiveVoiceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.7);
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
  backdrop-filter: blur(12px);

  [data-theme='light'] & {
    background: rgba(255, 255, 255, 0.85);
    border-bottom: 1px solid #e2e8f0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .live-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.35);
    padding: 3px 8px;
    border-radius: 9999px;
    font-size: 0.65rem;
    font-weight: 800;
    color: #ef4444;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .latency-badge {
    font-size: 0.65rem;
    color: #10b981;
    font-family: monospace;
    font-weight: 700;
  }
`;

export const ChannelSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #0d1527;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
  scrollbar-width: thin;

  [data-theme='light'] & {
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
  }
`;

export const ChannelPill = styled.button<{ $isActive: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid ${({ $isActive, $color }) => ($isActive ? $color : 'rgba(255, 255, 255, 0.1)')};
  background: ${({ $isActive, $color }) => ($isActive ? `${$color}22` : 'rgba(255, 255, 255, 0.03)')};
  color: ${({ $isActive, $color }) => ($isActive ? '#ffffff' : '#94a3b8')};
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ $color }) => $color};
    color: #ffffff;
  }

  [data-theme='light'] & {
    border-color: ${({ $isActive, $color }) => ($isActive ? $color : '#cbd5e1')};
    background: ${({ $isActive, $color }) => ($isActive ? `${$color}15` : '#f1f5f9')};
    color: ${({ $isActive, $color }) => ($isActive ? $color : '#475569')};
  }
`;

export const DispatchFeed = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MessageBubble = styled.div<{ $sender: 'user' | 'agent' | 'system' }>`
  max-width: 90%;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  line-height: 1.4;
  word-break: break-word;
  align-self: ${({ $sender }) => ($sender === 'user' ? 'flex-end' : 'flex-start')};

  ${({ $sender }) =>
    $sender === 'user'
      ? css`
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #ffffff;
          border-bottom-right-radius: 2px;
        `
      : $sender === 'agent'
      ? css`
          background: #1e293b;
          color: #f1f5f9;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom-left-radius: 2px;

          [data-theme='light'] & {
            background: #ffffff;
            color: #1e293b;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
        `
      : css`
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
          border: 1px dashed rgba(239, 68, 68, 0.3);
          align-self: center;
          font-size: 0.7rem;
          text-align: center;
        `}

  .msg-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 0.62rem;
    opacity: 0.75;
    margin-top: 4px;
  }
`;

export const AudioWaveformVisualizer = styled.div<{ $isRecording: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 28px;
  margin: 4px 0;
  opacity: ${({ $isRecording }) => ($isRecording ? 1 : 0.35)};

  .bar {
    width: 3px;
    background: #ef4444;
    border-radius: 2px;
    height: 6px;

    ${({ $isRecording }) =>
      $isRecording &&
      css`
        animation: ${waveBar} 0.8s ease-in-out infinite;

        &:nth-child(1) { animation-delay: 0.1s; }
        &:nth-child(2) { animation-delay: 0.25s; }
        &:nth-child(3) { animation-delay: 0.05s; }
        &:nth-child(4) { animation-delay: 0.35s; }
        &:nth-child(5) { animation-delay: 0.15s; }
        &:nth-child(6) { animation-delay: 0.4s; }
        &:nth-child(7) { animation-delay: 0.2s; }
      `}
  }
`;

export const DispatchControlBar = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #0d1527;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  gap: 8px;

  [data-theme='light'] & {
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  input {
    flex: 1;
    background: #172033;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 7px 10px;
    color: #ffffff;
    font-size: 0.75rem;
    outline: none;

    &:focus {
      border-color: #ef4444;
    }

    [data-theme='light'] & {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }
  }
`;

export const MicRecordButton = styled.button<{ $isRecording: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: ${({ $isRecording }) => ($isRecording ? '#ef4444' : '#1e293b')};
  color: #ffffff;
  transition: all 0.2s ease;

  ${({ $isRecording }) =>
    $isRecording &&
    css`
      animation: ${pulseGlow} 1.5s infinite;
    `}

  &:hover {
    background: #ef4444;
  }

  [data-theme='light'] & {
    background: ${({ $isRecording }) => ($isRecording ? '#ef4444' : '#e2e8f0')};
    color: ${({ $isRecording }) => ($isRecording ? '#ffffff' : '#0f172a')};
  }
`;

export const ActionSendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  border: none;
  background: #ef4444;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #dc2626;
  }
`;
