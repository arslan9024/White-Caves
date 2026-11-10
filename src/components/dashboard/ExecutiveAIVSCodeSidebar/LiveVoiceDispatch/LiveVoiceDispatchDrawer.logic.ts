import { useState, useCallback, useRef, useEffect } from 'react';
import { VoiceDispatchChannel, VoiceDispatchMessage } from './LiveVoiceDispatchDrawer.types';
import { WhisperAudioTranscriptionService } from '../../../../services/WhisperAudioTranscriptionService';

export const CHANNELS: VoiceDispatchChannel[] = [
  { id: 'zoe', name: 'AI Zoe', role: 'COO Executive Partner', deptCode: 'EXEC-00', avatarColor: '#EF4444', status: 'online', streamLatencyMs: 24 },
  { id: 'linda', name: 'AI Linda', role: 'WhatsApp Comms Lead', deptCode: 'BOT-LINDA', avatarColor: '#25D366', status: 'online', streamLatencyMs: 38 },
  { id: 'mary', name: 'AI Mary', role: 'DH2 Inventory Master', deptCode: 'AI_MARY', avatarColor: '#3B82F6', status: 'online', streamLatencyMs: 32 },
  { id: 'rachel', name: 'AI Rachel', role: 'SQA Defense Lead', deptCode: 'DEPT-12', avatarColor: '#A855F7', status: 'idle', streamLatencyMs: 19 },
  { id: 'farah', name: 'AI Farah', role: 'RERA Compliance & Title Deed', deptCode: 'DEPT-10', avatarColor: '#F59E0B', status: 'online', streamLatencyMs: 41 },
];

export function useLiveVoiceDispatchLogic(initialAgentId = 'zoe', onDispatchTask?: (agentId: string, instruction: string) => void) {
  const [activeChannelId, setActiveChannelId] = useState<string>(initialAgentId);
  const [messages, setMessages] = useState<VoiceDispatchMessage[]>([
    {
      id: 'init-1',
      agentId: 'zoe',
      agentName: 'AI Zoe',
      sender: 'agent',
      text: 'Zoe Executive Voice & Live Dispatch node active. Broadcast audio notes or type directives below.',
      language: 'en',
      timestamp: '18:24',
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [inputText, setInputText] = useState('');
  const [forcedLanguage, setForcedLanguage] = useState<'en' | 'ar'>('en');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const activeChannel = CHANNELS.find(c => c.id === activeChannelId) || CHANNELS[0];

  const handleToggleRecord = useCallback(async () => {
    if (!isRecording) {
      // Start recording simulation
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    } else {
      // Stop recording and transcribe
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const tempId = `rec-${Date.now()}`;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add temporary user message
      setMessages(prev => [
        ...prev,
        {
          id: tempId,
          agentId: activeChannel.id,
          agentName: activeChannel.name,
          sender: 'user',
          text: '🎙️ Processing voice note...',
          language: forcedLanguage,
          timestamp: now,
          status: 'transcribing',
        },
      ]);

      try {
        const dummyBlob = new Blob(['sample-audio-data'], { type: 'audio/webm' });
        const res = await WhisperAudioTranscriptionService.transcribeAudio(dummyBlob, forcedLanguage);

        const transcribedText = res.text || 'Directive processed from voice note.';

        setMessages(prev =>
          prev.map(m =>
            m.id === tempId
              ? {
                  ...m,
                  text: `🎙️ "${transcribedText}"`,
                  audioDurationSeconds: recordingSeconds,
                  confidence: res.confidence,
                  status: 'completed',
                }
              : m
          )
        );

        // Auto reply from agent
        setTimeout(() => {
          const replyText = `Acknowledged by ${activeChannel.name}: Executing voice directive across ${activeChannel.deptCode}.`;
          setMessages(prev => [
            ...prev,
            {
              id: `reply-${Date.now()}`,
              agentId: activeChannel.id,
              agentName: activeChannel.name,
              sender: 'agent',
              text: replyText,
              language: forcedLanguage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          if (onDispatchTask) {
            onDispatchTask(activeChannel.id, transcribedText);
          }
        }, 600);
      } catch (err) {
        setMessages(prev =>
          prev.map(m =>
            m.id === tempId ? { ...m, text: 'Voice note transcription failed', status: 'failed' } : m
          )
        );
      }
    }
  }, [isRecording, recordingSeconds, activeChannel, forcedLanguage, onDispatchTask]);

  const handleSendMessage = useCallback((textToSend?: string) => {
    const raw = textToSend !== undefined ? textToSend : inputText;
    if (!raw.trim()) return;

    const userText = raw.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        agentId: activeChannel.id,
        agentName: activeChannel.name,
        sender: 'user',
        text: userText,
        language: forcedLanguage,
        timestamp: now,
      },
    ]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          agentId: activeChannel.id,
          agentName: activeChannel.name,
          sender: 'agent',
          text: `Acknowledged directive by ${activeChannel.name}: '${userText}' queued on ${activeChannel.deptCode}.`,
          language: forcedLanguage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      if (onDispatchTask) {
        onDispatchTask(activeChannel.id, userText);
      }
    }, 450);
  }, [inputText, activeChannel, forcedLanguage, onDispatchTask]);

  return {
    activeChannel,
    setActiveChannelId,
    channels: CHANNELS,
    messages,
    isRecording,
    recordingSeconds,
    inputText,
    setInputText,
    forcedLanguage,
    setForcedLanguage,
    handleToggleRecord,
    handleSendMessage,
  };
}
