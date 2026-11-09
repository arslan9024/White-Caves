/**
 * Adaptive Video Stream Manager (HLS / DASH / MP4 Multi-Bitrate)
 * Domain: Luxury Real Estate UX & Motion (Domain 1)
 * Standard: Sub-100ms initialization, network-aware bitrate adaptation
 */

export interface VideoStreamTrack {
  quality: '4K' | '1080P' | '720P' | '480P';
  bitrateKbps: number;
  src: string;
  codecs?: string;
}

export interface VideoStreamConfig {
  posterUrl: string;
  title: string;
  community: string;
  tracks: VideoStreamTrack[];
}

export class AdaptiveVideoManager {
  private currentTrackIndex = 0;
  private tracks: VideoStreamTrack[] = [];

  constructor(config: VideoStreamConfig) {
    // Sort descending by bitrate
    this.tracks = [...config.tracks].sort((a, b) => b.bitrateKbps - a.bitrateKbps);
  }

  /**
   * Selects optimal track based on effective bandwidth (in kbps) and device pixel ratio
   */
  public selectOptimalTrack(bandwidthKbps: number, devicePixelRatio = 1): VideoStreamTrack {
    if (this.tracks.length === 0) {
      throw new Error('No tracks configured in stream manager');
    }

    // High DPI screening adjustment
    const effectiveTargetBitrate = bandwidthKbps / (devicePixelRatio > 1.5 ? 1.0 : 1.2);

    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].bitrateKbps <= effectiveTargetBitrate) {
        this.currentTrackIndex = i;
        return this.tracks[i];
      }
    }

    // Default to lowest available bitrate track to avoid buffering
    this.currentTrackIndex = this.tracks.length - 1;
    return this.tracks[this.currentTrackIndex];
  }

  public getCurrentTrack(): VideoStreamTrack {
    return this.tracks[this.currentTrackIndex];
  }

  public getAllTracks(): VideoStreamTrack[] {
    return [...this.tracks];
  }
}
