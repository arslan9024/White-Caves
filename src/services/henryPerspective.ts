export type Corner = Readonly<{ x: number; y: number }>;
export type Corners = readonly [Corner, Corner, Corner, Corner];
export const IMAGE_LIMIT = 4_000_000;
export const DEFAULT_CORNERS: Corners = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];

/** Maps output unit-square coordinates back into the selected source quadrilateral. */
export function perspectiveMap(corners: Corners): (u: number, v: number) => Corner {
  if (corners.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y) || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1))
    throw new Error('Corners must be finite coordinates from 0 to 1.');
  for (let i = 0; i < 4; i++) {
    const a = corners[i]!, b = corners[(i + 1) % 4]!, c = corners[(i + 2) % 4]!;
    if ((b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x) < 0.0001)
      throw new Error('Use a non-degenerate convex selection in TL, TR, BR, BL order.');
  }
  const [a, b, c, d] = corners;
  const dx = a.x - b.x + c.x - d.x, dy = a.y - b.y + c.y - d.y;
  const bx = b.x - c.x, by = b.y - c.y, cx = d.x - c.x, cy = d.y - c.y;
  const determinant = bx * cy - cx * by;
  const g = (dx * cy - cx * dy) / determinant, h = (bx * dy - dx * by) / determinant;
  if (![g, h].every(Number.isFinite) || Math.min(1, 1 + g, 1 + h, 1 + g + h) < 0.0001)
    throw new Error('Unstable perspective selection; move the corners farther apart.');
  return (u, v) => ({
    x: ((b.x - a.x + g * b.x) * u + (d.x - a.x + h * d.x) * v + a.x) / (g * u + h * v + 1),
    y: ((b.y - a.y + g * b.y) * u + (d.y - a.y + h * d.y) * v + a.y) / (g * u + h * v + 1),
  });
}

export function warpPixels(source: Uint8ClampedArray, width: number, height: number, corners: Corners): {
  pixels: Uint8ClampedArray; width: number; height: number;
} {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 2 || height < 2 ||
      width * height > IMAGE_LIMIT || source.length !== width * height * 4)
    throw new Error('Image dimensions exceed the correction budget.');
  const map = perspectiveMap(corners);
  const edge = (a: Corner, b: Corner) => Math.hypot((a.x - b.x) * (width - 1), (a.y - b.y) * (height - 1));
  const outWidth = Math.max(2, Math.round(Math.max(edge(corners[0], corners[1]), edge(corners[3], corners[2]))) + 1);
  const outHeight = Math.max(2, Math.round(Math.max(edge(corners[0], corners[3]), edge(corners[1], corners[2]))) + 1);
  if (outWidth > 2500 || outHeight > 2500 || outWidth * outHeight > IMAGE_LIMIT)
    throw new Error('Corrected image exceeds the correction budget.');
  const pixels = new Uint8ClampedArray(outWidth * outHeight * 4);
  for (let y = 0; y < outHeight; y++) for (let x = 0; x < outWidth; x++) {
    const point = map(x / (outWidth - 1), y / (outHeight - 1));
    const sx = Math.max(0, Math.min(width - 1, point.x * (width - 1)));
    const sy = Math.max(0, Math.min(height - 1, point.y * (height - 1)));
    const ix = Math.floor(sx), iy = Math.floor(sy), fx = sx - ix, fy = sy - iy;
    for (let channel = 0; channel < 4; channel++) {
      const sample = (px: number, py: number) => source[(py * width + px) * 4 + channel]!;
      pixels[(y * outWidth + x) * 4 + channel] =
        sample(ix, iy) * (1 - fx) * (1 - fy) + sample(Math.min(ix + 1, width - 1), iy) * fx * (1 - fy) +
        sample(ix, Math.min(iy + 1, height - 1)) * (1 - fx) * fy +
        sample(Math.min(ix + 1, width - 1), Math.min(iy + 1, height - 1)) * fx * fy;
    }
  }
  return { pixels, width: outWidth, height: outHeight };
}

export async function correctPerspective(file: File, corners: Corners): Promise<File> {
  if (!['image/jpeg', 'image/png'].includes(file.type)) throw new Error('Only JPEG and PNG images support corner correction.');
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  try {
    if (bitmap.width < 2 || bitmap.height < 2 || bitmap.width * bitmap.height > 40_000_000)
      throw new Error('Image is too large to safely decode for correction.');
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(2, Math.round(bitmap.width * scale));
    canvas.height = Math.max(2, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image correction is unavailable in this browser.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const result = warpPixels(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height, corners);
    canvas.width = result.width; canvas.height = result.height;
    const output = context.createImageData(result.width, result.height);
    output.data.set(result.pixels); context.putImageData(output, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value =>
      value ? resolve(value) : reject(new Error('Unable to encode corrected image.')), 'image/png'));
    return new File([blob], 'corrected-scan.png', { type: 'image/png' });
  } finally {
    bitmap.close(); canvas.width = 0; canvas.height = 0;
  }
}
