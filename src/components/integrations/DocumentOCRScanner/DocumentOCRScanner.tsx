import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const scanAnim = keyframes`0%{top:0}50%{top:100%}100%{top:0}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px;display:grid;grid-template-columns:1fr 1fr;gap:24px`;
const Col = styled.div`display:flex;flex-direction:column;gap:16px`;
const Title = styled.h2`margin:0 0 8px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const ImageArea = styled.div`position:relative;width:100%;aspect-ratio:1.6;background:rgba(30,41,59,0.5);border:1px dashed rgba(100,116,139,0.5);border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-size:.8rem`;
const ScannerLine = styled.div`position:absolute;left:0;right:0;height:2px;background:#38BDF8;box-shadow:0 0 10px #38BDF8;animation:${scanAnim} 2s linear infinite`;

const ExtractedData = styled.div`background:rgba(30,41,59,0.3);border:1px solid rgba(100,116,139,0.2);border-radius:12px;padding:16px`;
const Field = styled.div`margin-bottom:12px;border-bottom:1px solid rgba(100,116,139,0.1);padding-bottom:12px;&:last-child{border:none;margin:0;padding:0}`;
const FLabel = styled.div`font-size:.65rem;color:#94A3B8;text-transform:uppercase;margin-bottom:4px`;
const FVal = styled.div`font-size:.9rem;font-weight:700;color:#E2E8F0;display:flex;align-items:center;gap:8px`;
const ConfBadge = styled.div`font-size:.6rem;padding:2px 6px;background:rgba(16,185,129,0.15);color:#10B981;border-radius:4px`;

export const DocumentOCRScanner: FC = () => {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setScanning(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Wrap data-testid="document-ocr-scanner">
      <Col>
        <Title>📷 Document OCR Upload</Title>
        <ImageArea>
          Emirates ID Front (Mockup)
          {scanning && <ScannerLine />}
        </ImageArea>
      </Col>

      <Col>
        <Title>AI Extraction Results</Title>
        <ExtractedData>
          <Field>
            <FLabel>Full Name</FLabel>
            <FVal>
              {scanning ? 'Extracting...' : 'Tariq Al Mansoori'}
              {!scanning && <ConfBadge>99%</ConfBadge>}
            </FVal>
          </Field>
          <Field>
            <FLabel>ID Number</FLabel>
            <FVal>
              {scanning ? 'Extracting...' : '784-1990-1234567-1'}
              {!scanning && <ConfBadge>99%</ConfBadge>}
            </FVal>
          </Field>
          <Field>
            <FLabel>Nationality</FLabel>
            <FVal>
              {scanning ? 'Extracting...' : 'United Arab Emirates'}
              {!scanning && <ConfBadge>98%</ConfBadge>}
            </FVal>
          </Field>
        </ExtractedData>
      </Col>
    </Wrap>
  );
};
export default DocumentOCRScanner;
