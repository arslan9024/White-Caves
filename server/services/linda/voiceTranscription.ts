/**
 * Voice Transcription Service — Whisper API
 *
 * Transcribes WhatsApp audio messages (ogg/opus, mp3, m4a, wav)
 * using OpenAI Whisper. The raw audio buffer is posted directly
 * to the Whisper endpoint; no temporary disk writes are needed.
 *
 * Falls back to a graceful error message when OPENAI_API_KEY is absent.
 *
 * Automatic language detection supports: English, Arabic, Urdu, Hindi,
 * Russian, Chinese — all common languages among Dubai WhatsApp leads.
 *
 * Used by: POST /api/linda/transcribe
 *
 * Environment Variables:
 *   OPENAI_API_KEY    - Required for live transcription
 *   WHISPER_MODEL     - Default: whisper-1
 */

import https from 'https';
import { randomBytes } from 'crypto';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type AudioFormat = 'ogg' | 'mp3' | 'm4a' | 'wav' | 'webm';

export interface TranscriptionInput {
  /** Raw audio data (Buffer from multer or base64-decoded) */
  audioBuffer:  Buffer;
  /** MIME / extension format */
  format:       AudioFormat;
  /** Optional: hint the expected language code (e.g. 'ar', 'en') */
  languageHint?: string;
  /** Optional: context prompt to improve transcription accuracy */
  contextPrompt?: string;
}

export interface TranscriptionResult {
  success:          boolean;
  transcription:    string;
  detectedLanguage: string;
  duration?:        number;  // seconds (if returned by Whisper)
  confidence?:      number;  // rough estimate: word count vs silence ratio
  modelUsed:        string;
  processedAt:      string;
  warningNote?:     string;
}

// ─── Multipart Form Builder ────────────────────────────────────────────────────

interface WhisperResponseBody {
  text?: string;
  language?: string;
  duration?: number;
  error?: { message: string };
}

function buildMultipartBody(
  audioBuffer: Buffer,
  format:      AudioFormat,
  boundary:    string,
  model:       string,
  lang?:       string,
  prompt?:     string,
): Buffer {
  const CRLF    = '\r\n';
  const ext     = format === 'ogg' ? 'ogg' : format;
  const mimeMap: Record<AudioFormat, string> = {
    ogg:  'audio/ogg',
    mp3:  'audio/mpeg',
    m4a:  'audio/mp4',
    wav:  'audio/wav',
    webm: 'audio/webm',
  };
  const mime = mimeMap[format] ?? 'audio/ogg';

  const parts: (string | Buffer)[] = [];

  // model field
  parts.push(`--${boundary}${CRLF}`);
  parts.push(`Content-Disposition: form-data; name="model"${CRLF}${CRLF}`);
  parts.push(`${model}${CRLF}`);

  // file field
  parts.push(`--${boundary}${CRLF}`);
  parts.push(
    `Content-Disposition: form-data; name="file"; filename="audio.${ext}"${CRLF}` +
    `Content-Type: ${mime}${CRLF}${CRLF}`
  );
  parts.push(audioBuffer);
  parts.push(CRLF);

  // optional language
  if (lang) {
    parts.push(`--${boundary}${CRLF}`);
    parts.push(`Content-Disposition: form-data; name="language"${CRLF}${CRLF}`);
    parts.push(`${lang}${CRLF}`);
  }

  // optional prompt
  if (prompt) {
    parts.push(`--${boundary}${CRLF}`);
    parts.push(`Content-Disposition: form-data; name="prompt"${CRLF}${CRLF}`);
    parts.push(`${prompt}${CRLF}`);
  }

  parts.push(`--${boundary}--${CRLF}`);

  return Buffer.concat(parts.map(p => typeof p === 'string' ? Buffer.from(p) : p));
}

// ─── Whisper API Call ─────────────────────────────────────────────────────────

async function callWhisper(input: TranscriptionInput, model: string): Promise<WhisperResponseBody> {
  const boundary = `whisper-boundary-${randomBytes(8).toString('hex')}`;
  const body     = buildMultipartBody(
    input.audioBuffer,
    input.format,
    boundary,
    model,
    input.languageHint,
    input.contextPrompt ??
      'Dubai real estate conversation. May contain property names, AED amounts, area names like Marina, JBR, Downtown.'
  );

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.openai.com',
        path:     '/v1/audio/transcriptions',
        method:   'POST',
        headers:  {
          'Authorization':  `Bearer ${process.env['OPENAI_API_KEY']}`,
          'Content-Type':   `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk: Buffer) => { data += chunk.toString(); });
        res.on('end', () => {
          try { resolve(JSON.parse(data) as WhisperResponseBody); }
          catch (e) { reject(e); }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Confidence Estimate ──────────────────────────────────────────────────────

/**
 * Rough confidence score: ratio of recognised word count to
 * expected words per second (approx. 2 words/sec for WhatsApp voice notes).
 * Capped between 0.1 and 1.0.
 */
function estimateConfidence(text: string, durationSecs?: number): number {
  if (!durationSecs || durationSecs <= 0) return 0.8; // default
  const wordCount   = text.trim().split(/\s+/).length;
  const maxExpected = durationSecs * 2;
  return Math.min(1.0, Math.max(0.1, wordCount / maxExpected));
}

// ─── Public API ───────────────────────────────────────────────────────────────

const DEFAULT_MODEL = process.env['WHISPER_MODEL'] ?? 'whisper-1';

/**
 * Transcribe a WhatsApp voice message audio buffer.
 *
 * Returns a graceful error result (not throws) when API key is absent.
 */
export async function transcribeVoiceMessage(
  input: TranscriptionInput
): Promise<TranscriptionResult> {
  const now = new Date().toISOString();

  if (!process.env['OPENAI_API_KEY']) {
    return {
      success:          false,
      transcription:    '',
      detectedLanguage: 'unknown',
      modelUsed:        DEFAULT_MODEL,
      processedAt:      now,
      warningNote:      'OPENAI_API_KEY is not set. Voice transcription unavailable. Configure OPENAI_API_KEY to enable Whisper.',
    };
  }

  try {
    const result = await callWhisper(input, DEFAULT_MODEL);

    if (result.error) {
      return {
        success:          false,
        transcription:    '',
        detectedLanguage: 'unknown',
        modelUsed:        DEFAULT_MODEL,
        processedAt:      now,
        warningNote:      `Whisper API error: ${result.error.message}`,
      };
    }

    const text       = result.text ?? '';
    const lang       = result.language ?? (input.languageHint ?? 'auto');
    const duration   = result.duration;
    const confidence = estimateConfidence(text, duration);

    console.info(
      `[VoiceTranscription] Transcribed ${duration?.toFixed(1) ?? '?'}s audio ` +
      `(lang=${lang}, words=${text.split(' ').length})`
    );

    return {
      success:          true,
      transcription:    text,
      detectedLanguage: lang,
      duration,
      confidence,
      modelUsed:        DEFAULT_MODEL,
      processedAt:      now,
    };
  } catch (err) {
    console.error('[VoiceTranscription] Error:', err instanceof Error ? err.message : err);
    return {
      success:          false,
      transcription:    '',
      detectedLanguage: 'unknown',
      modelUsed:        DEFAULT_MODEL,
      processedAt:      now,
      warningNote:      `Transcription failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
