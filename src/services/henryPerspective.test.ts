import { describe, expect, it, vi } from 'vitest';
import { correctPerspective, DEFAULT_CORNERS, perspectiveMap, warpPixels, type Corners } from './henryPerspective';

describe('bounded projective correction', () => {
  it('maps identity and all trapezoid corners, with a genuinely projective midpoint', () => {
    const identity = perspectiveMap(DEFAULT_CORNERS);
    expect(identity(0.3, 0.7)).toEqual({ x: 0.3, y: 0.7 });
    const corners: Corners = [{ x: 0.2, y: 0.1 }, { x: 0.8, y: 0.1 }, { x: 1, y: 0.9 }, { x: 0, y: 0.9 }];
    const map = perspectiveMap(corners);
    DEFAULT_CORNERS.forEach((p, i) => {
      expect(map(p.x, p.y).x).toBeCloseTo(corners[i]!.x);
      expect(map(p.x, p.y).y).toBeCloseTo(corners[i]!.y);
    });
    expect(map(0.5, 0.5).y).not.toBeCloseTo(0.5);
  });
  it('preserves identity pixels and uses bilinear interpolation for a scaled selection', () => {
    const pixels = new Uint8ClampedArray([0, 0, 0, 255, 100, 100, 100, 255, 200, 200, 200, 255, 240, 240, 240, 255]);
    expect(warpPixels(pixels, 2, 2, DEFAULT_CORNERS).pixels).toEqual(pixels);
    const corners: Corners = [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 }];
    expect(warpPixels(pixels, 2, 2, corners).pixels[0]).toBe(71);
  });
  it('rejects crossing, collinear, concave, invalid and over-budget geometry', () => {
    for (const corners of [
      [DEFAULT_CORNERS[0], DEFAULT_CORNERS[2], DEFAULT_CORNERS[1], DEFAULT_CORNERS[3]],
      [{ x: 0, y: 0 }, { x: 0.2, y: 0 }, { x: 0.4, y: 0 }, { x: 0.6, y: 0 }],
      [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0.1, y: 0.1 }, { x: 0, y: 1 }],
      [{ x: NaN, y: 0 }, ...DEFAULT_CORNERS.slice(1)],
    ]) expect(() => perspectiveMap(corners as Corners)).toThrow();
    expect(() => warpPixels(new Uint8ClampedArray(), 4000, 4000, DEFAULT_CORNERS)).toThrow(/budget/);
  });
  it('rejects PDFs and closes bitmap/canvas when correction fails', async () => {
    await expect(correctPerspective(new File(['pdf'], 'a.pdf', { type: 'application/pdf' }), DEFAULT_CORNERS)).rejects.toThrow(/JPEG/);
    const bitmap = { width: 2, height: 2, close: vi.fn() };
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(bitmap));
    const context = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    await expect(correctPerspective(new File(['png'], 'a.png', { type: 'image/png' }), DEFAULT_CORNERS)).rejects.toThrow(/unavailable/);
    expect(bitmap.close).toHaveBeenCalledOnce();
    context.mockRestore(); vi.unstubAllGlobals();
  });
});
