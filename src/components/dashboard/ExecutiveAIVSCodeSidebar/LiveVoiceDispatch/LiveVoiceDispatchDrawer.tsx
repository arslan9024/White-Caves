import React, { FC } from 'react';
import { Mic, MicOff, Send, Radio, Activity, Volume2, Globe } from 'lucide-react';
import { LiveVoiceDispatchDrawerProps } from './LiveVoiceDispatchDrawer.types';
import { useLiveVoiceDispatchLogic } from './LiveVoiceDispatchDrawer.logic';
import {
  LiveVoiceContainer,
  LiveVoiceHeader,
  ChannelSelector,
  ChannelPill,
  DispatchFeed,
  MessageBubble,
  AudioWaveformVisualizer,
  DispatchControlBar,
  MicRecordButton,
  ActionSendButton,
} from './LiveVoiceDispatchDrawer.styles';

export const LiveVoiceDispatchDrawer: FC<LiveVoiceDispatchDrawerProps> = ({
  onDispatchTask,
  selectedAgentId,
}) => {
  const {
    activeChannel,
    setActiveChannelId,
    channels,
    messages,
    isRecording,
    recordingSeconds,
    inputText,
    setInputText,
    forcedLanguage,
    setForcedLanguage,
    handleToggleRecord,
    handleSendMessage,
  } = useLiveVoiceDispatchLogic(selectedAgentId, onDispatchTask);

  return (
    <LiveVoiceContainer data-testid="live-voice-dispatch-drawer">
      {/* 1. Header with live status & stream latency */}
      <LiveVoiceHeader>
        <div className="header-left">
          <Radio size={14} color="#EF4444" />
          <div className="live-indicator">
            <Activity size={10} />
            <span>LIVE DISPATCH</span>
          </div>
        </div>
        <div className="latency-badge">
          {activeChannel.streamLatencyMs}ms · WEBSOCKET
        </div>
      </LiveVoiceHeader>

      {/* 2. Channel switcher across core agents */}
      <ChannelSelector data-testid="voice-channel-selector">
        {channels.map(ch => (
          <ChannelPill
            key={ch.id}
            type="button"
            $isActive={ch.id === activeChannel.id}
            $color={ch.avatarColor}
            onClick={() => setActiveChannelId(ch.id)}
            data-testid={`channel-pill-${ch.id}`}
          >
            <span style={{ fontSize: '0.75rem' }}>●</span>
            <span>{ch.name}</span>
          </ChannelPill>
        ))}
      </ChannelSelector>

      {/* 3. Real-time message & voice transcription stream */}
      <DispatchFeed data-testid="voice-dispatch-feed">
        {messages.map(msg => (
          <MessageBubble key={msg.id} $sender={msg.sender} data-testid={`voice-msg-${msg.id}`}>
            <div className="msg-content">{msg.text}</div>
            <div className="msg-meta">
              <span>{msg.sender === 'user' ? 'Me' : msg.agentName}</span>
              <span>{msg.timestamp}</span>
            </div>
          </MessageBubble>
        ))}
      </DispatchFeed>

      {/* 4. Audio Waveform visualizer */}
      <AudioWaveformVisualizer $isRecording={isRecording} data-testid="voice-waveform-visualizer">
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        {isRecording && (
          <span style={{ fontSize: '0.65rem', color: '#EF4444', fontWeight: 800, marginLeft: '6px' }}>
            REC {recordingSeconds}s
          </span>
        )}
      </AudioWaveformVisualizer>

      {/* 5. Dispatch controls (Voice Mic + Text Input + Language Toggle) */}
      <DispatchControlBar>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: '#94A3B8' }}>
            <Volume2 size={11} color="#EF4444" />
            <span>Target: <strong style={{ color: activeChannel.avatarColor }}>{activeChannel.name}</strong></span>
          </div>

          <button
            type="button"
            onClick={() => setForcedLanguage(lang => (lang === 'en' ? 'ar' : 'en'))}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.62rem',
              color: '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
            title="Toggle Arabic/English transcription"
            data-testid="toggle-language-btn"
          >
            <Globe size={10} color="#3B82F6" />
            <span>{forcedLanguage.toUpperCase()}</span>
          </button>
        </div>

        <form
          className="input-row"
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <MicRecordButton
            type="button"
            $isRecording={isRecording}
            onClick={handleToggleRecord}
            title={isRecording ? 'Stop & Transcribe Voice Note' : 'Record Voice Directive'}
            data-testid="btn-mic-toggle"
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
          </MicRecordButton>

          <input
            type="text"
            placeholder={`Voice or text directive to ${activeChannel.name}...`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            data-testid="voice-dispatch-text-input"
          />

          <ActionSendButton type="submit" title="Send Directive" data-testid="btn-send-dispatch">
            <Send size={13} />
          </ActionSendButton>
        </form>
      </DispatchControlBar>
    </LiveVoiceContainer>
  );
};

export default LiveVoiceDispatchDrawer;
