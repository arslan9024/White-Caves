import { describe, expect, it } from 'vitest';
import { imageQualityWarnings } from './henryImageQuality';

function pixels(value: (x: number, y: number) => number) {
  const width = 100, height = 100;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    data.fill(value(x, y), i, i + 3);
    data[i + 3] = 255;
  }
  return { width, height, data };
}

describe('bounded heuristic image advisories', () => {
  it('flags low resolution and near-blank exposure without guaranteeing glare', () => {
    expect(imageQualityWarnings(pixels(() => 255)).join(' ')).toMatch(/low source resolution.*almost entirely white/);
  });
  it('flags weak detail and dark framing', () => {
    expect(imageQualityWarnings(pixels(x => x * 2), 1200, 1200).join(' ')).toMatch(/weak fine detail/);
    expect(imageQualityWarnings(pixels((x, y) => x < 4 || y < 4 || x > 95 || y > 95 ? 0 : 180), 1200, 1200).join(' ')).toMatch(/cropping/);
  });
  it('does not flag legitimate low contrast or sharp text as blur', () => {
    expect(imageQualityWarnings(pixels(x => 180 + x / 20), 1200, 1200)).toEqual([]);
    expect(imageQualityWarnings(pixels((x, y) => x > 10 && x < 90 && y > 10 && y < 90 && x % 2 ? 0 : 240), 1200, 1200).join(' ')).not.toMatch(/blur/);
  });
  it('rejects malformed or oversized samples without allocating', () => {
    expect(imageQualityWarnings({ width: 5000, height: 5000, data: new Uint8ClampedArray() })[0]).toMatch(/unavailable/);
  });
});
