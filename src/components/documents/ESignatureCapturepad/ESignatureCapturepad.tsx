/** ESignatureCapturepad.tsx — View Layer */
import React, { FC } from 'react';
import { useESignatureCapturepadLogic } from './logic/ESignatureCapturepad.logic';
import { Root, Title, ModeBar, ModeBtn, Canvas, TypeInput, ActionRow, ClearBtn, SaveBtn, SavedBanner } from './styles/ESignatureCapturepad.style';

export const ESignatureCapturepad: FC = () => {
  const { canvasRef, startDraw, draw, stopDraw, mode, setMode, typedName, setTypedName, saved, handleClear, handleSave } = useESignatureCapturepadLogic();
  return (
    <Root data-testid="e-signature-capturepad">
      <Title>✍️ Digital Signature</Title>
      {!saved ? (
        <>
          <ModeBar>
            <ModeBtn $active={mode === 'draw'} onClick={() => setMode('draw')}>✏️ Draw</ModeBtn>
            <ModeBtn $active={mode === 'type'} onClick={() => setMode('type')}>⌨️ Type Name</ModeBtn>
          </ModeBar>
          {mode === 'draw' ? (
            <Canvas
              ref={canvasRef}
              width={440} height={120}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
            />
          ) : (
            <TypeInput
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Type your full legal name"
            />
          )}
          <ActionRow>
            <ClearBtn onClick={handleClear}>Clear</ClearBtn>
            <SaveBtn onClick={handleSave}>Save Signature</SaveBtn>
          </ActionRow>
        </>
      ) : (
        <SavedBanner>
          ✅ Signature captured and saved successfully<br />
          <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--text-secondary, #64748b)' }}>Timestamped: {new Date().toLocaleString('en-AE')}</span>
        </SavedBanner>
      )}
    </Root>
  );
};
export default ESignatureCapturepad;
