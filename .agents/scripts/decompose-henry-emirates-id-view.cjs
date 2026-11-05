const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('src/components/crm/HenryDocumentStudio');
const stylesDir = path.join(baseDir, 'styles');
const logicDir = path.join(baseDir, 'logic');
const componentsDir = path.join(baseDir, 'components');

[stylesDir, logicDir, componentsDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const originalContent = fs.readFileSync(path.join(baseDir, 'HenryEmiratesIdScannerView.tsx'), 'utf-8');
const lines = originalContent.split('\n');

// 1. styles/HenryEmiratesIdScannerView.style.ts
// Lines 63 to 348 (0-indexed)
const stylesCode = lines.slice(63, 349).join('\n');
const styleFileContent = `import styled from 'styled-components';

${stylesCode}
`;
fs.writeFileSync(path.join(stylesDir, 'HenryEmiratesIdScannerView.style.ts'), styleFileContent, 'utf-8');
console.log('Created styles/HenryEmiratesIdScannerView.style.ts');

// 2. logic/useHenryEmiratesIdScannerLogic.ts
// Lines 352 to 532 (0-indexed: 351 to 532)
const logicImports = `import { useState, useEffect, useRef } from 'react';
import henryEmiratesIdScannerService, {
  EmiratesIdExtractedData,
  EMPTY_EMIRATES_ID,
} from '../../../../services/HenryEmiratesIdScannerService';
import {
  assessScanReadiness,
  canUseScan,
  scanExpiry,
  validScanDate,
  VaultSaveOptions,
} from '../../../../services/henryScanReview';
import { markFieldReviewed } from '../../../../services/henryDocumentParsing';
import { snapshotBenchmarkValues, type BenchmarkValues } from '../../../../services/henryBenchmark';
import type { DriveImport } from '../../../../services/henryDrive';
import { useDriveScannerIntake } from './useDriveScannerIntake';
`;

// Extract state and handlers
const hookBody = lines.slice(351, 532).join('\n');
const hookContent = `${logicImports}

export function useHenryEmiratesIdScannerLogic(importedSource?: DriveImport) {
${hookBody}

  const readiness = assessScanReadiness(extractedData);

  return {
    uploaderReset,
    setUploaderReset,
    archiveReset,
    setArchiveReset,
    scannerValues,
    setScannerValues,
    extractedData,
    setExtractedData,
    frontFile,
    setFrontFile,
    backFile,
    setBackFile,
    uploadedFile,
    setUploadedFile,
    filePreviewUrl,
    setFilePreviewUrl,
    activeSideView,
    setActiveSideView,
    isScanning,
    setIsScanning,
    zoomLevel,
    setZoomLevel,
    statusMsg,
    setStatusMsg,
    copiedJson,
    setCopiedJson,
    scanGeneration,
    vaultOptions,
    setVaultOptions,
    readiness,
    handleFileUpload,
    handleLoadDemo,
    handleUpdateField,
    handleSaveToVault,
    handleAutoFillAsTenant,
    handleAutoFillAsLandlord,
    handleDiscard,
    handleCopyJson,
  };
}

export type HenryEmiratesIdScannerLogicReturn = ReturnType<typeof useHenryEmiratesIdScannerLogic>;
`;
fs.writeFileSync(path.join(logicDir, 'useHenryEmiratesIdScannerLogic.ts'), hookContent, 'utf-8');
console.log('Created logic/useHenryEmiratesIdScannerLogic.ts');

// 3. components/HenryEmiratesIdLeftPane.tsx
// Lines 659 to 1004 (0-indexed: 659 to 1004)
const leftPaneBody = lines.slice(659, 1005).join('\n');
const leftPaneContent = `import React, { FC } from 'react';
import {
  CreditCard,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  LeftDocumentPane,
  PaneHeader,
  ZoomBtn,
  DocumentCanvasViewer,
} from '../styles/HenryEmiratesIdScannerView.style';
import HenrySharedDocumentUploader from '../HenrySharedDocumentUploader';
import { EmiratesIdExtractedData } from '../../../../services/HenryEmiratesIdScannerService';

export interface HenryEmiratesIdLeftPaneProps {
  activeSideView: 'front' | 'back';
  setActiveSideView: (side: 'front' | 'back') => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  uploaderReset: number;
  isScanning: boolean;
  uploadedFile: File | null;
  filePreviewUrl: string | null;
  extractedData: EmiratesIdExtractedData;
  handleFileUpload: (file: File, original?: File) => Promise<void>;
  handleLoadDemo: () => void;
  onLoadMansoorDemo: () => void;
}

export const HenryEmiratesIdLeftPane: FC<HenryEmiratesIdLeftPaneProps> = ({
  activeSideView,
  setActiveSideView,
  zoomLevel,
  setZoomLevel,
  uploaderReset,
  isScanning,
  uploadedFile,
  filePreviewUrl,
  extractedData,
  handleFileUpload,
  handleLoadDemo,
  onLoadMansoorDemo,
}) => {
  return (
${leftPaneBody}
  );
};
`;

// Replace handleLoadDemo('mansoor') with onLoadMansoorDemo
const adjustedLeftPane = leftPaneContent.replace(
  /onClick=\{handleLoadDemo\}/g,
  'onClick={handleLoadDemo}'
).replace(
  /onClick=\{\(\) => handleLoadDemo\('mansoor'\)\}/g,
  'onClick={onLoadMansoorDemo}'
);

fs.writeFileSync(path.join(componentsDir, 'HenryEmiratesIdLeftPane.tsx'), adjustedLeftPane, 'utf-8');
console.log('Created components/HenryEmiratesIdLeftPane.tsx');

// 4. components/HenryEmiratesIdVariablesPane.tsx
// Lines 1005 to 1261 (0-indexed: 1004 to 1261)
const rightPaneBody = lines.slice(1004, 1261).join('\n');
const rightPaneContent = `import React, { FC } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Calendar,
  Flag,
  User,
  Briefcase,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  Trash2,
  Save,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  RightVariablesPane,
  VariableSectionCard,
  MrzTerminal,
  ActionButton,
} from '../styles/HenryEmiratesIdScannerView.style';
import { EmiratesIdExtractedData } from '../../../../services/HenryEmiratesIdScannerService';
import { canUseScan, scanExpiry } from '../../../../services/henryScanReview';

export interface HenryEmiratesIdVariablesPaneProps {
  extractedData: EmiratesIdExtractedData;
  isScanning: boolean;
  handleUpdateField: (field: keyof EmiratesIdExtractedData, value: string) => void;
  handleAutoFillAsTenant: () => void;
  handleAutoFillAsLandlord: () => void;
  handleDiscard: () => void;
  handleSaveToVault: () => Promise<void>;
}

export const HenryEmiratesIdVariablesPane: FC<HenryEmiratesIdVariablesPaneProps> = ({
  extractedData,
  isScanning,
  handleUpdateField,
  handleAutoFillAsTenant,
  handleAutoFillAsLandlord,
  handleDiscard,
  handleSaveToVault,
}) => {
  return (
${rightPaneBody}
  );
};
`;

fs.writeFileSync(path.join(componentsDir, 'HenryEmiratesIdVariablesPane.tsx'), rightPaneContent, 'utf-8');
console.log('Created components/HenryEmiratesIdVariablesPane.tsx');

// 5. HenryEmiratesIdScannerView.tsx (Slim root component)
const rootComponentContent = `/**
 * HenryEmiratesIdScannerView.tsx — Emirates ID Live Extraction Studio (V7)
 *
 * Modular Architecture (< 350 lines per file per AEGIS V4.1 Law):
 * - styles/HenryEmiratesIdScannerView.style.ts: UI primitives & styled components
 * - logic/useHenryEmiratesIdScannerLogic.ts: State, side effects & business handlers
 * - components/HenryEmiratesIdLeftPane.tsx: Live document viewer & uploader
 * - components/HenryEmiratesIdVariablesPane.tsx: Extracted variables comparison cards
 */

import React, { FC } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Save,
} from 'lucide-react';
import henryEmiratesIdScannerService, {
  EmiratesIdExtractedData,
} from '../../../services/HenryEmiratesIdScannerService';
import {
  canUseScan,
  scanExpiry,
} from '../../../services/henryScanReview';
import { HenryExtractionEvidence } from './HenryExtractionEvidence';
import HenryVaultControls from './HenryVaultControls';
import type { DriveImport } from '../../../services/henryDrive';
import {
  StudioContainer,
  TopActionBar,
  ComparisonGrid,
  ActionButton,
} from './styles/HenryEmiratesIdScannerView.style';
import { useHenryEmiratesIdScannerLogic } from './logic/useHenryEmiratesIdScannerLogic';
import { HenryEmiratesIdLeftPane } from './components/HenryEmiratesIdLeftPane';
import { HenryEmiratesIdVariablesPane } from './components/HenryEmiratesIdVariablesPane';

export const HenryEmiratesIdScannerView: FC<{ importedSource?: DriveImport }> = ({
  importedSource,
}) => {
  const {
    uploaderReset,
    setUploaderReset,
    archiveReset,
    setArchiveReset,
    scannerValues,
    setScannerValues,
    extractedData,
    setExtractedData,
    frontFile,
    setFrontFile,
    backFile,
    setBackFile,
    uploadedFile,
    setUploadedFile,
    filePreviewUrl,
    activeSideView,
    setActiveSideView,
    isScanning,
    setIsScanning,
    zoomLevel,
    setZoomLevel,
    statusMsg,
    copiedJson,
    scanGeneration,
    vaultOptions,
    setVaultOptions,
    readiness,
    handleFileUpload,
    handleLoadDemo,
    handleUpdateField,
    handleSaveToVault,
    handleAutoFillAsTenant,
    handleAutoFillAsLandlord,
    handleDiscard,
    handleCopyJson,
  } = useHenryEmiratesIdScannerLogic(importedSource);

  return (
    <StudioContainer>
      <label>
        Capture side{' '}
        <select
          aria-label="Capture side"
          value={activeSideView}
          onChange={event => setActiveSideView(event.target.value as 'front' | 'back')}
        >
          <option value="front">Front</option>
          <option value="back">Back</option>
        </select>
      </label>
      <HenryVaultControls
        key={archiveReset}
        docType="emirates_id"
        options={vaultOptions}
        onOptions={setVaultOptions}
        onSuggestion={data => {
          setArchiveReset(previous => previous + 1);
          setUploaderReset(previous => previous + 1);
          setScannerValues(undefined);
          scanGeneration.current++;
          setIsScanning(false);
          henryEmiratesIdScannerService.clearCachedEmiratesId();
          setFrontFile(null);
          setBackFile(null);
          setUploadedFile(null);
          setExtractedData(data as EmiratesIdExtractedData);
        }}
      />
      <p>
        {frontFile ? 'Front captured' : 'Front pending'} ·{' '}
        {backFile ? 'Back captured' : 'Back pending'}
      </p>
      <p role="note">
        OCR is not proof of authenticity or ownership. Compare every field to the original before
        saving or autofill. Missing or uncertain values: rescan without glare, then correct below.
      </p>
      {extractedData?.demoOnly && <p role="alert">Demo only — saving and autofill disabled.</p>}
      {!!extractedData?.missingFields?.length && (
        <p role="alert">
          Missing: {extractedData.missingFields.join(', ')}. Correct these fields or rescan.
        </p>
      )}
      <HenryExtractionEvidence diagnostics={extractedData.diagnostics} scannerValues={scannerValues} />
      <p role="status">
        Readiness: {readiness.status.replaceAll('_', ' ')}. {readiness.reasons.join(' ')}
      </p>
      {scanExpiry(extractedData.expiryDate).isExpired && (
        <label>
          <input
            type="checkbox"
            aria-label="Acknowledge expired ID"
            disabled={isScanning || extractedData.demoOnly}
            checked={extractedData.expiryAcknowledgedFor === extractedData.expiryDate}
            onChange={event => {
              henryEmiratesIdScannerService.clearCachedEmiratesId();
              const acknowledged = event.target.checked;
              setExtractedData(prev => ({
                ...prev,
                reviewConfirmed: false,
                expiryAcknowledgedFor: acknowledged ? prev.expiryDate : undefined,
              }));
            }}
          />
          I acknowledge this ID is expired; reuse does not make it current identification.
        </label>
      )}
      <label>
        <input
          type="checkbox"
          aria-label="Confirm document review"
          checked={!!extractedData?.reviewConfirmed}
          disabled={!canUseScan({ ...extractedData, reviewConfirmed: true }) || isScanning}
          onChange={event => {
            henryEmiratesIdScannerService.clearCachedEmiratesId();
            setExtractedData(prev =>
              prev ? { ...prev, reviewConfirmed: event.target.checked } : prev
            );
          }}
        />
        I compared the fields to the original and confirm use for saving and autofill.
      </label>

      {/* ══════════ TOP HEADER & LIVE AI SCANNER STATUS ══════════ */}
      <TopActionBar>
        <div className="header-left">
          <div className="ai-badge">
            <Sparkles size={14} color="#EF4444" /> HENRY AI OCR ENGINE
          </div>
          <h3>3.19.2 Emirates ID Live Extraction Studio</h3>
        </div>

        <div className="header-right">
          <ActionButton $variant="secondary" onClick={handleCopyJson}>
            {copiedJson ? <Check size={14} color="#EF4444" /> : <Copy size={14} />}
            <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
          </ActionButton>

          <ActionButton
            $variant="primary"
            onClick={handleSaveToVault}
            disabled={!canUseScan(extractedData) || isScanning}
          >
            <Save size={15} />
            <span>Confirm & Save to KYC Vault</span>
          </ActionButton>
        </div>
      </TopActionBar>

      {statusMsg && (
        <div
          style={{
            background: 'var(--color-0f172a, #0F172A)',
            color: 'var(--color-38bdf8, #EF4444)',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 800,
          }}
        >
          ⚡ {statusMsg}
        </div>
      )}

      {/* ══════════ SIDE-BY-SIDE LIVE COMPARISON GRID ══════════ */}
      <ComparisonGrid>
        <HenryEmiratesIdLeftPane
          activeSideView={activeSideView}
          setActiveSideView={setActiveSideView}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          uploaderReset={uploaderReset}
          isScanning={isScanning}
          uploadedFile={uploadedFile}
          filePreviewUrl={filePreviewUrl}
          extractedData={extractedData}
          handleFileUpload={handleFileUpload}
          handleLoadDemo={handleLoadDemo}
          onLoadMansoorDemo={() => handleLoadDemo('mansoor')}
        />

        <HenryEmiratesIdVariablesPane
          extractedData={extractedData}
          isScanning={isScanning}
          handleUpdateField={handleUpdateField}
          handleAutoFillAsTenant={handleAutoFillAsTenant}
          handleAutoFillAsLandlord={handleAutoFillAsLandlord}
          handleDiscard={handleDiscard}
          handleSaveToVault={handleSaveToVault}
        />
      </ComparisonGrid>
    </StudioContainer>
  );
};

export default HenryEmiratesIdScannerView;
`;

fs.writeFileSync(path.join(baseDir, 'HenryEmiratesIdScannerView.tsx'), rootComponentContent, 'utf-8');
console.log('Replaced HenryEmiratesIdScannerView.tsx with slim coordinator component');

