/** Advisory-only heuristics on bounded samples, not a document/glare/blur detector. */
export function imageQualityWarnings(
  image: { width: number; height: number; data: Uint8ClampedArray },
  sourceWidth = image.width,
  sourceHeight = image.height
): string[] {
  const { width, height, data } = image;
  if (width < 3 || height < 3 || width * height > 4_000_000 || data.length !== width * height * 4)
    return ['Image quality advisory unavailable; compare the original manually.'];
  const warnings: string[] = [];
  if (Math.max(sourceWidth, sourceHeight) < 1000)
    warnings.push('Heuristic advisory: low source resolution; enlarging cannot restore detail. Rescan if text is unclear.');
  const step = Math.max(1, Math.ceil(Math.max(width, height) / 256));
  const gray = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    const alpha = data[i + 3]! / 255;
    return (0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!) * alpha + 255 * (1 - alpha);
  };
  let count = 0, bright = 0, sum = 0, squared = 0, lapSum = 0, lapSquared = 0;
  let edges = 0, edgeDark = 0;
  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const value = gray(x, y);
      const lap = gray(x - 1, y) + gray(x + 1, y) + gray(x, y - 1) + gray(x, y + 1) - 4 * value;
      count++;
      bright += Number(value >= 250);
      sum += value;
      squared += value * value;
      lapSum += lap;
      lapSquared += lap * lap;
      if (x < width * 0.03 || x > width * 0.97 || y < height * 0.03 || y > height * 0.97) {
        edges++;
        edgeDark += Number(value < 100);
      }
    }
  }
  const variance = squared / count - (sum / count) ** 2;
  const sharpness = lapSquared / count - (lapSum / count) ** 2;
  // White margins and low-contrast scans alone are not evidence of glare or blur.
  if (bright / count > 0.98)
    warnings.push('Heuristic advisory: image is almost entirely white/overexposed; check for blank content or glare and retake if needed.');
  if (variance > 100 && sharpness < 25)
    warnings.push('Heuristic advisory: weak fine detail may indicate blur; inspect characters and retake with steady focus if needed.');
  if (edges && edgeDark / edges > 0.3)
    warnings.push('Heuristic advisory: dark content touches the frame; check all document edges for cropping. This may also be a border/background.');
  return warnings;
}
