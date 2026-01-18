import React, { useRef, useEffect, useState } from 'react';
import './SignaturePad.css';

/**
 * Enhanced SignaturePad Component
 * Allows users to draw signatures using mouse, touch, or stylus
 * Supports canvas-based drawing without external dependencies
 */
const SignaturePad = ({
  onSignatureCapture,
  onClear,
  onCancel,
  signerName = 'Signer',
  signerRole = 'Party',
  disabled = false,
  width = 800,
  height = 300,
  showDisclaimer = true
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Set up context
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0a0a0f';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw border
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);

    setContext(ctx);
  }, [width, height]);

  /**
   * Get position relative to canvas
   */
  const getPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let x, y;

    if (e.touches && e.touches.length > 0) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    return { x, y };
  };

  /**
   * Start drawing
   */
  const handleStartDrawing = (e) => {
    if (disabled || !context) return;

    e.preventDefault();
    setIsDrawing(true);

    const { x, y } = getPosition(e);
    context.beginPath();
    context.moveTo(x, y);
  };

  /**
   * Draw on canvas
   */
  const handleDraw = (e) => {
    if (!isDrawing || !context || disabled) return;

    e.preventDefault();

    const { x, y } = getPosition(e);
    context.lineTo(x, y);
    context.stroke();
    setHasSignature(true);
  };

  /**
   * Stop drawing
   */
  const handleStopDrawing = () => {
    if (!context) return;
    setIsDrawing(false);
    context.closePath();
  };

  /**
   * Clear canvas
   */
  const handleClearSignature = () => {
    if (!context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Redraw border
    context.strokeStyle = '#e0e0e0';
    context.lineWidth = 1;
    context.strokeRect(0, 0, width, height);

    setHasSignature(false);

    if (onClear) {
      onClear();
    }
  };

  /**
   * Capture signature as image data
   */
  const handleCapture = () => {
    if (!hasSignature) {
      alert('Please draw a signature');
      return;
    }

    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');

    // Get signature coordinates
    const coordinates = {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    };

    if (onSignatureCapture) {
      onSignatureCapture({
        imageData,
        coordinates,
        timestamp: new Date().toISOString(),
        mimeType: 'image/png',
        signerName,
        signerRole
      });
    }
  };

  return (
    <div className="signature-pad-container">
      <div className="signature-pad-header">
        <h3>Digital Signature</h3>
        <p className="signature-signer-info">
          Signing as: <strong>{signerName}</strong> <span className="signature-role">({signerRole})</span>
        </p>
      </div>

      <div className="signature-pad-wrapper">
        <div className="signature-pad-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className={`signature-pad-canvas ${disabled ? 'disabled' : ''}`}
            onMouseDown={handleStartDrawing}
            onMouseMove={handleDraw}
            onMouseUp={handleStopDrawing}
            onMouseLeave={handleStopDrawing}
            onTouchStart={handleStartDrawing}
            onTouchMove={handleDraw}
            onTouchEnd={handleStopDrawing}
            disabled={disabled}
          />
          {!hasSignature && (
            <div className="signature-pad-placeholder">
              Draw your signature above
            </div>
          )}
        </div>

        <div className="signature-line">
          <span>Sign above this line</span>
        </div>

        <div className="signature-pad-status">
          {hasSignature && (
            <span className="signature-status-complete">✓ Signature drawn</span>
          )}
          {!hasSignature && (
            <span className="signature-status-empty">Draw your signature using mouse, touch, or stylus</span>
          )}
        </div>
      </div>

      <div className="signature-pad-actions">
        <button
          className="btn btn-secondary"
          onClick={handleClearSignature}
          disabled={disabled || !hasSignature}
          type="button"
        >
          Clear
        </button>
        {onCancel && (
          <button
            className="btn btn-outline"
            onClick={onCancel}
            disabled={disabled}
            type="button"
          >
            Cancel
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={handleCapture}
          disabled={disabled || !hasSignature}
          type="button"
        >
          Apply Signature
        </button>
      </div>

      {showDisclaimer && (
        <p className="signature-disclaimer">
          By signing, I confirm that I am the authorized signatory and agree to the terms of this contract.
        </p>
      )}
    </div>
  );
};

export default SignaturePad;
