import { describe, it, expect } from 'vitest';
import { AdaptiveVideoManager, VideoStreamConfig } from '../adaptiveVideoManager';
import { generateResponsiveImageSources } from '../responsiveImageHelper';

describe('Media Services: Adaptive Video Manager & Responsive Image Helper', () => {
  const config: VideoStreamConfig = {
    posterUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
    title: 'The Sky Penthouse',
    community: 'Palm Jumeirah',
    tracks: [
      { quality: '4K', bitrateKbps: 15000, src: '/videos/penthouse-4k.mp4' },
      { quality: '1080P', bitrateKbps: 6000, src: '/videos/penthouse-1080p.mp4' },
      { quality: '720P', bitrateKbps: 2500, src: '/videos/penthouse-720p.mp4' },
      { quality: '480P', bitrateKbps: 1000, src: '/videos/penthouse-480p.mp4' }
    ]
  };

  it('selects 4K track when high bandwidth is available (> 15Mbps)', () => {
    const manager = new AdaptiveVideoManager(config);
    const track = manager.selectOptimalTrack(20000, 2);
    expect(track.quality).toBe('4K');
    expect(track.bitrateKbps).toBe(15000);
  });

  it('drops to 700P or 480P gracefully under constrained mobile bandwidth (< 2Mbps)', () => {
    const manager = new AdaptiveVideoManager(config);
    const track = manager.selectOptimalTrack(1500, 1);
    expect(track.quality).toBe('480P');
    expect(track.bitrateKbps).toBe(1000);
  });

  it('generates multi-tier AVIF and WebP responsive srcset with sizes attribute', () => {
    const res = generateResponsiveImageSources('https://assets.whitecaves.com/villas/damac-hills-2.jpg');
    expect(res.avif.type).toBe('image/avif');
    expect(res.avif.srcSet).toContain('damac-hills-2-480w.avif 480w');
    expect(res.webp.srcSet).toContain('damac-hills-2-1600w.webp 1600w');
    expect(res.fallback).toBe('https://assets.whitecaves.com/villas/damac-hills-2-1200w.jpg');
  });
});
