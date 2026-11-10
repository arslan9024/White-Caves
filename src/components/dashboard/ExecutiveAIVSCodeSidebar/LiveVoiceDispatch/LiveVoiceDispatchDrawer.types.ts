/**
 * LiveVoiceDispatchDrawer.types.ts
 * Type definitions for Multi-Agent Real-Time Voice/Audio Dispatch Drawer
 * Law: AEG-001–009, Single Purpose File Law (< 350 lines)
 */

export interface VoiceDispatchChannel {
  id: string;
  name: string;
  role: string;
  deptCode: string;
  avatarColor: string;
  status: 'online' | 'busy' | 'transcribing' | 'idle';
  streamLatencyMs: number;
}

export interface VoiceDispatchMessage {
  id: string;
  agentId: string;
  agentName: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  language: 'en' | 'ar';
  timestamp: string;
  audioDurationSeconds?: number;
  confidence?: number;
  status?: 'transcribing' | 'completed' | 'failed';
}

export interface LiveVoiceDispatchDrawerProps {
  onClose?: () => void;
  onDispatchTask?: (agentId: string, instruction: string) => void;
  selectedAgentId?: string;
}
