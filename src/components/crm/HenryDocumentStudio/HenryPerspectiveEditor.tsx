import React, { useEffect, useRef, useState } from 'react';
import { correctPerspective, DEFAULT_CORNERS, perspectiveMap, type Corners } from '../../../services/henryPerspective';
import logger from '../../../utils/logger';

export function HenryPerspectiveEditor({ file, onConfirm, onCancel }: {
  file: File; onConfirm: (corrected: File, original: File) => void; onCancel: () => void;
}) {
  const [corners, setCorners] = useState<Corners>(DEFAULT_CORNERS);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const generation = useRef(0);
  useEffect(() => {
    let preview = '';
    try { preview = URL.createObjectURL(file); setError(''); }
    catch { setError('Image preview unavailable in this browser. Cancel correction and scan the original.'); }
    setUrl(preview); setCorners(DEFAULT_CORNERS); setBusy(false);
    generation.current++;
    return () => { generation.current++; URL.revokeObjectURL(preview); };
  }, [file]);
  const confirm = async () => {
    const token = ++generation.current;
    setBusy(true); setError('');
    try {
      const corrected = await correctPerspective(file, corners);
      if (token === generation.current) onConfirm(corrected, file);
    } catch {
      logger.error('Henry manual perspective correction failed');
      if (token === generation.current) setError('Correction failed. Check convex corner order, image size and browser support, or scan the original.');
    } finally {
      if (token === generation.current) setBusy(false);
    }
  };
  let valid = true;
  try { perspectiveMap(corners); } catch { valid = false; }
  return <section aria-label="Manual perspective correction">
    <p>JPEG/PNG only. Set normalized corners (0–1), ordered TL, TR, BR, BL. Confirm before OCR.
      The untouched original is archived; this bounded corrected image is only used for scanning.</p>
    <div style={{ position: 'relative', maxWidth: 600 }}>
      <img src={url} alt="Original corner selection" style={{ width: '100%', display: 'block' }}
        onError={() => setError('Cannot preview this image. Cancel and choose a readable JPEG or PNG.')} />
      <svg aria-label="Live corner selection overlay" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <polygon points={corners.map(p => `${p.x * 100},${p.y * 100}`).join(' ')}
          fill="none" stroke="#EF4444" strokeWidth="0.6" />
        {corners.map((p, i) => <text key={i} x={Math.min(92, p.x * 100)} y={Math.max(5, p.y * 100)}
          fontSize="4" fill="#EF4444">{['TL', 'TR', 'BR', 'BL'][i]}</text>)}
      </svg>
    </div>
    {corners.map((corner, i) => <fieldset key={i} disabled={busy}>
      <legend>{['TL', 'TR', 'BR', 'BL'][i]}</legend>
      {(['x', 'y'] as const).map(axis => <label key={axis}>{['TL', 'TR', 'BR', 'BL'][i]} {axis}
        <input type="number" min="0" max="1" step="0.01" value={Number.isNaN(corner[axis]) ? '' : corner[axis]}
          onChange={event => { setError(''); setCorners(previous => previous.map((p, index) =>
            index === i ? { ...p, [axis]: event.target.valueAsNumber } : p) as unknown as Corners); }} />
      </label>)}
    </fieldset>)}
    {!valid && <p role="alert">Select a convex, non-degenerate quadrilateral in TL, TR, BR, BL order.</p>}
    {error && <p role="alert">{error}</p>}
    <button type="button" disabled={busy || !valid || !url} onClick={() => void confirm()}>
      {busy ? 'Correcting image…' : 'Confirm corners and scan'}</button>
    <button type="button" onClick={() => { generation.current++; onCancel(); }}>Cancel correction</button>
  </section>;
}
