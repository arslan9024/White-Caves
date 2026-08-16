/**
 * White Caves Real Estate LLC — Speech Engine (Disabled per user directive)
 * Audio speech synthesis is completely disabled across Nina AI Assistant and all interfaces.
 */

export interface SpeechEngineConfig {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
  muted?: boolean;
}

let speechMuted = true;

export function setNinaSpeechMuted(muted: boolean): void {
  speechMuted = true;
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isNinaSpeechMuted(): boolean {
  return true;
}

export function ninaTekkenAnnouncerSpeak(
  commandPhrase: string,
  onSubtitleUpdate?: (sub: string | null) => void
): void {
  // Speech synthesis completely disabled per user preference
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (onSubtitleUpdate) {
    onSubtitleUpdate(null);
  }
}

export const ninaSpeak = ninaTekkenAnnouncerSpeak;
export default ninaTekkenAnnouncerSpeak;
