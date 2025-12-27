import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './SignaturePad.css';

export default function SignaturePad({ 
  onSave, 
  onCancel, 
  signerName = 'Signer',
  signerRole = 'Party'
}) {
  const sigCanvas = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    sigCanvas.current.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (isEmpty) return;
    
    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    onSave({
      signature: signatureData,
      signerName,
      signerRole,
      timestamp: new Date().toISOString()
    });
  };

  const handleEnd = () => {
    setIsEmpty(sigCanvas.current.isEmpty());
  };

  return (
    <div className="signature-pad-container">
      <div className="signature-pad-header">
        <h3>Digital Signature</h3>
        <p>Sign as: <strong>{signerName}</strong> ({signerRole})</p>
      </div>
      
      <div className="signature-canvas-wrapper">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: 'signature-canvas'
          }}
          onEnd={handleEnd}
          penColor="#0a0a0f"
          backgroundColor="rgba(255, 255, 255, 1)"
        />
        <div className="signature-line">
          <span>Sign above this line</span>
        </div>
      </div>

      <div className="signature-actions">
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
        <button className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={isEmpty}
        >
          Apply Signature
        </button>
      </div>

      <p className="signature-disclaimer">
        By signing, I confirm that I am the authorized signatory and agree to the terms of this contract.
      </p>
    </div>
  );
}
