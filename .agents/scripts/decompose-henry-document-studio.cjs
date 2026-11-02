/**
 * AEGIS V4.1 Single Purpose File Law Refactoring
 * Decomposes src/components/crm/HenryDocumentStudio/HenryDocumentStudio.tsx (1,383 lines)
 * into modular < 350-line sub-components under components/.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const FILE_PATH = path.join(ROOT, 'src/components/crm/HenryDocumentStudio/HenryDocumentStudio.tsx');
const TARGET_DIR = path.join(ROOT, 'src/components/crm/HenryDocumentStudio/components');

const raw = fs.readFileSync(FILE_PATH, 'utf8');
const lines = raw.split(/\r?\n/);
console.log(`Read ${lines.length} lines from ${FILE_PATH}`);

fs.mkdirSync(TARGET_DIR, { recursive: true });

// 1. HEADER (Lines 91 to 157)
const headerContent = `import React, { FC } from 'react';
import { Check, FilePlus2 } from 'lucide-react';
import { StudioHeader, Badge } from '../styles/HenryDocumentStudio.style';

export interface HenryDocumentStudioHeaderProps {
  handleOpenTenancyModal: () => void;
  actionSuccessMessage: string | null;
}

export const HenryDocumentStudioHeader: FC<HenryDocumentStudioHeaderProps> = ({
  handleOpenTenancyModal,
  actionSuccessMessage,
}) => {
  return (
    <>
      <StudioHeader>
        <div>
          <h2>
            <span>📄</span> Henry AI — Sovereign Record Keeper & Document Studio
          </h2>
          <p style={{ margin: 0, color: 'var(--color-94a3b8, #94A3B8)', fontSize: '0.88rem' }}>
            Document preparation previews and reviewed OCR candidates. No government registration or external dispatch.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleOpenTenancyModal}
            data-testid="prepare-tenancy-btn"
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              border: '1px solid #DC2626',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <FilePlus2 size={16} /> Prepare New Tenancy Contract
          </button>
          <Badge>HENRY RECORD KEEPER</Badge>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Demo / preparation previews</span>
        </div>
      </StudioHeader>
      <p>
        Specialized OCR scanners support Emirates ID, passport, title deed and tenancy contract. Review every
        extraction; neither authenticity nor signatures are verified. Ejari certificates, licences,
        NOCs, agency forms, sale agreements, invoices, receipts and cheques use the separate Reviewed document intake
        in Henry Records: labelled fields and manual corrections only, never official validation.
        Preparation templates do not add OCR capability.
      </p>
      <p>
        Studio scanner cards show synthetic demo data, not your vault records. Use the upload/review scanners
        in Henry Records for real documents. Preparation previews start with sample values; review all fields before use.
      </p>

      {actionSuccessMessage && (
        <div
          style={{
            backgroundColor: '#ECFDF5',
            color: '#065F46',
            border: '1.5px solid #A7F3D0',
            padding: '10px 16px',
            borderRadius: '8px',
            margin: '0 24px 12px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={16} color="#10B981" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}
    </>
  );
};
`;
fs.writeFileSync(path.join(TARGET_DIR, 'HenryDocumentStudioHeader.tsx'), headerContent, 'utf8');

// 2. SIDEBAR (Lines 160 to 221)
const sidebarContent = `import React, { FC } from 'react';
import { ShieldCheck } from 'lucide-react';
import { SidebarControlPanel, SectionLabel, TemplateCard } from '../styles/HenryDocumentStudio.style';

export interface TemplateItem {
  id: string;
  icon: string;
  title: string;
  badge: string;
  description: string;
}

export interface HenryDocumentStudioSidebarProps {
  templates: TemplateItem[];
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
}

export const HenryDocumentStudioSidebar: FC<HenryDocumentStudioSidebarProps> = ({
  templates,
  selectedTemplateId,
  setSelectedTemplateId,
}) => {
  return (
    <SidebarControlPanel>
      <SectionLabel>Document Classification Streams</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {templates.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            $selected={selectedTemplateId === tpl.id}
            onClick={() => setSelectedTemplateId(tpl.id)}
          >
            <div className="card-title">
              <span>
                {tpl.icon} {tpl.title}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 800,
                }}
              >
                {tpl.badge}
              </span>
            </div>
            <div className="card-desc">{tpl.description}</div>
          </TemplateCard>
        ))}
      </div>

      <SectionLabel style={{ marginTop: '14px' }}>Henry Record Keeper SOP</SectionLabel>
      <div
        style={{
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          fontSize: '11px',
          color: '#64748B',
          lineHeight: 1.5,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#1E293B',
            fontWeight: 800,
            marginBottom: '4px',
          }}
        >
          <ShieldCheck size={14} color="#EF4444" />
          <span>Source review workflow</span>
        </div>
        1. Upload supported documents in Henry Records and review extraction candidates against originals.<br />
        2. Confirm review before applying fields to a preparation draft.<br />
        3. Save reviewed supported originals explicitly to the encrypted vault. Uploaded Ejari certificates can be archived through Reviewed document intake; templates do not register or issue certificates.
      </div>
    </SidebarControlPanel>
  );
};
`;
fs.writeFileSync(path.join(TARGET_DIR, 'HenryDocumentStudioSidebar.tsx'), sidebarContent, 'utf8');

// 3. TENANCY CONTRACT PREVIEW (0-indexed 224 to 489)
const tenancyCardLines = lines.slice(224, 489).join('\n');
const tenancyCardContent = `import React, { FC } from 'react';
import {
  FileText,
  Scan,
  RefreshCw,
  Copy,
  Building,
  UserCheck,
  FileCheck,
  Home,
} from 'lucide-react';
import { PreviewCanvasCard, ActionButton } from '../styles/HenryDocumentStudio.style';

export interface HenryTenancyContractPreviewProps {
  scannedContractData: any;
  isScanning: boolean;
  handleScanTenancyContract: () => void;
  handleLoadContractIntoPreparationStudio: () => void;
  handleCreateCrmLandlordFromContract: () => void;
  handleCreateCrmTenantFromContract: () => void;
  handleCopyContractJsonVariables: () => void;
}

export const HenryTenancyContractPreview: FC<HenryTenancyContractPreviewProps> = ({
  scannedContractData,
  isScanning,
  handleScanTenancyContract,
  handleLoadContractIntoPreparationStudio,
  handleCreateCrmLandlordFromContract,
  handleCreateCrmTenantFromContract,
  handleCopyContractJsonVariables,
}) => {
  return (
${tenancyCardLines}
  );
};
`;
fs.writeFileSync(path.join(TARGET_DIR, 'HenryTenancyContractPreview.tsx'), tenancyCardContent, 'utf8');

// 4. PASSPORT PREVIEW (0-indexed 490 to 767)
const passportCardLines = lines.slice(490, 767).join('\n');
const passportCardContent = `import React, { FC } from 'react';
import {
  Globe,
  Scan,
  RefreshCw,
  Copy,
  FileText,
  Building,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import { PreviewCanvasCard, ActionButton } from '../styles/HenryDocumentStudio.style';

export interface HenryPassportPreviewProps {
  passportData: any;
  isScanning: boolean;
  handleScanPassport: () => void;
  handleAutoFillTenancyAsPassportTenant: () => void;
  handleAutoFillTenancyAsPassportLandlord: () => void;
  handleAutoFillViewingFromPassport: () => void;
  handleCreateAmlKycRecord: () => void;
  handleCopyPassportJsonVariables: () => void;
}

export const HenryPassportPreview: FC<HenryPassportPreviewProps> = ({
  passportData,
  isScanning,
  handleScanPassport,
  handleAutoFillTenancyAsPassportTenant,
  handleAutoFillTenancyAsPassportLandlord,
  handleAutoFillViewingFromPassport,
  handleCreateAmlKycRecord,
  handleCopyPassportJsonVariables,
}) => {
  return (
${passportCardLines}
  );
};
`;
fs.writeFileSync(path.join(TARGET_DIR, 'HenryPassportPreview.tsx'), passportCardContent, 'utf8');

// 5. TITLE DEED PREVIEW (0-indexed 768 to 1049)
const titleDeedCardLines = lines.slice(768, 1049).join('\n');
const titleDeedCardContent = `import React, { FC } from 'react';
import {
  Home,
  Scan,
  RefreshCw,
  Copy,
  Building,
  FileText,
} from 'lucide-react';
import { PreviewCanvasCard, ActionButton } from '../styles/HenryDocumentStudio.style';

export interface HenryTitleDeedPreviewProps {
  titleDeedData: any;
  isScanning: boolean;
  handleScanTitleDeed: () => void;
  handleCreateCrmListing: () => void;
  handleAutoFillTenancyFromTitleDeed: () => void;
  handleAutoFillFormA: () => void;
  handleCopyTitleDeedJsonVariables: () => void;
}

export const HenryTitleDeedPreview: FC<HenryTitleDeedPreviewProps> = ({
  titleDeedData,
  isScanning,
  handleScanTitleDeed,
  handleCreateCrmListing,
  handleAutoFillTenancyFromTitleDeed,
  handleAutoFillFormA,
  handleCopyTitleDeedJsonVariables,
}) => {
  return (
${titleDeedCardLines}
  );
};
`;
fs.writeFileSync(path.join(TARGET_DIR, 'HenryTitleDeedPreview.tsx'), titleDeedCardContent, 'utf8');

// 6. EMIRATES ID PREVIEW (0-indexed 1050 to 1321)
const eidCardLines = lines.slice(1050, 1321).join('\n');
const eidCardContent = `import React, { FC } from 'react';
import {
  UserCheck,
  Scan,
  RefreshCw,
  Copy,
  Building,
  FileText,
  Eye,
} from 'lucide-react';
import { PreviewCanvasCard, ActionButton } from '../styles/HenryDocumentStudio.style';

export interface HenryEmiratesIdPreviewProps {
  eidData: any;
  isScanning: boolean;
  handleScanEmiratesId: () => void;
  handleAutoFillAsTenant: () => void;
  handleAutoFillAsLandlord: () => void;
  handleAutoFillViewingForm: () => void;
  handleCopyJsonVariables: () => void;
}

export const HenryEmiratesIdPreview: FC<HenryEmiratesIdPreviewProps> = ({
  eidData,
  isScanning,
  handleScanEmiratesId,
  handleAutoFillAsTenant,
  handleAutoFillAsLandlord,
  handleAutoFillViewingForm,
  handleCopyJsonVariables,
}) => {
  return (
${eidCardLines}
  );
};
`;
fs.writeFileSync(path.join(TARGET_DIR, 'HenryEmiratesIdPreview.tsx'), eidCardContent, 'utf8');

// 7. CANVAS PREVIEW (0-indexed 1322 to 1369)
const canvasPreviewLines = lines.slice(1322, 1369).join('\n');
const canvasPreviewContent = `import React, { FC } from 'react';
import {
  Sparkles,
  Share2,
  ZoomIn,
  ZoomOut,
  Printer,
  Eye,
} from 'lucide-react';
import {
  PreviewCanvasCard,
  ToolbarHeader,
  ToolButtonGroup,
  ActionButton,
  PreviewFrame,
} from '../styles/HenryDocumentStudio.style';

export interface HenryCanvasPreviewProps {
  selectedTemplateId: string;
  compiledHtml: string;
  zoomLevel: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handlePrint: () => void;
  handleCopyEsignLink: () => void;
  handleTriggerAiAutoFill: () => void;
}

export const HenryCanvasPreview: FC<HenryCanvasPreviewProps> = ({
  selectedTemplateId,
  compiledHtml,
  zoomLevel,
  handleZoomIn,
  handleZoomOut,
  handlePrint,
  handleCopyEsignLink,
  handleTriggerAiAutoFill,
}) => {
  return (
${canvasPreviewLines}
  );
};
`;
fs.writeFileSync(path.join(TARGET_DIR, 'HenryCanvasPreview.tsx'), canvasPreviewContent, 'utf8');

// 8. REWRITE HenryDocumentStudio.tsx (< 150 lines)
const newStudioContent = `/**
 * HenryDocumentStudio.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentation coordinator shell consuming sub-components, logic, and styles.
 * AEGIS V4.1 Single Purpose File Law: Modularized under 350 lines.
 */

import React, { FC } from 'react';
import { useHenryDocumentStudioLogic } from './logic/HenryDocumentStudio.logic';
import { HenryTenancyContractModal } from './HenryTenancyContractModal';
import { StudioContainer, WorkspaceSplit } from './styles/HenryDocumentStudio.style';
import { HenryDocumentStudioHeader } from './components/HenryDocumentStudioHeader';
import { HenryDocumentStudioSidebar } from './components/HenryDocumentStudioSidebar';
import { HenryTenancyContractPreview } from './components/HenryTenancyContractPreview';
import { HenryPassportPreview } from './components/HenryPassportPreview';
import { HenryTitleDeedPreview } from './components/HenryTitleDeedPreview';
import { HenryEmiratesIdPreview } from './components/HenryEmiratesIdPreview';
import { HenryCanvasPreview } from './components/HenryCanvasPreview';

export const HenryDocumentStudio: FC = () => {
  const {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    compiledHtml,
    zoomLevel,
    eidData,
    titleDeedData,
    passportData,
    isScanning,
    actionSuccessMessage,
    handlePrint,
    handleZoomIn,
    handleZoomOut,
    handleCopyEsignLink,
    handleTriggerAiAutoFill,
    handleScanEmiratesId,
    handleScanTitleDeed,
    handleScanPassport,
    handleAutoFillAsTenant,
    handleAutoFillAsLandlord,
    handleAutoFillTenancyFromTitleDeed,
    handleAutoFillTenancyAsPassportTenant,
    handleAutoFillTenancyAsPassportLandlord,
    handleAutoFillViewingFromPassport,
    handleAutoFillViewingForm,
    handleCopyJsonVariables,
    handleCopyTitleDeedJsonVariables,
    handleCopyPassportJsonVariables,
    handleCreateCrmListing,
    handleAutoFillFormA,
    handleCreateAmlKycRecord,
    scannedContractData,
    handleScanTenancyContract,
    handleLoadContractIntoPreparationStudio,
    handleCreateCrmLandlordFromContract,
    handleCreateCrmTenantFromContract,
    handleCopyContractJsonVariables,
    isTenancyModalOpen,
    handleOpenTenancyModal,
    handleCloseTenancyModal,
  } = useHenryDocumentStudioLogic();

  return (
    <StudioContainer data-testid="henry-document-studio">
      <HenryDocumentStudioHeader
        handleOpenTenancyModal={handleOpenTenancyModal}
        actionSuccessMessage={actionSuccessMessage}
      />

      <WorkspaceSplit>
        <HenryDocumentStudioSidebar
          templates={templates}
          selectedTemplateId={selectedTemplateId}
          setSelectedTemplateId={setSelectedTemplateId}
        />

        {selectedTemplateId === 'tenancy_contract_scanner' ? (
          <HenryTenancyContractPreview
            scannedContractData={scannedContractData}
            isScanning={isScanning}
            handleScanTenancyContract={handleScanTenancyContract}
            handleLoadContractIntoPreparationStudio={handleLoadContractIntoPreparationStudio}
            handleCreateCrmLandlordFromContract={handleCreateCrmLandlordFromContract}
            handleCreateCrmTenantFromContract={handleCreateCrmTenantFromContract}
            handleCopyContractJsonVariables={handleCopyContractJsonVariables}
          />
        ) : selectedTemplateId === 'passport_scanner' ? (
          <HenryPassportPreview
            passportData={passportData}
            isScanning={isScanning}
            handleScanPassport={handleScanPassport}
            handleAutoFillTenancyAsPassportTenant={handleAutoFillTenancyAsPassportTenant}
            handleAutoFillTenancyAsPassportLandlord={handleAutoFillTenancyAsPassportLandlord}
            handleAutoFillViewingFromPassport={handleAutoFillViewingFromPassport}
            handleCreateAmlKycRecord={handleCreateAmlKycRecord}
            handleCopyPassportJsonVariables={handleCopyPassportJsonVariables}
          />
        ) : selectedTemplateId === 'title_deed_scanner' ? (
          <HenryTitleDeedPreview
            titleDeedData={titleDeedData}
            isScanning={isScanning}
            handleScanTitleDeed={handleScanTitleDeed}
            handleCreateCrmListing={handleCreateCrmListing}
            handleAutoFillTenancyFromTitleDeed={handleAutoFillTenancyFromTitleDeed}
            handleAutoFillFormA={handleAutoFillFormA}
            handleCopyTitleDeedJsonVariables={handleCopyTitleDeedJsonVariables}
          />
        ) : selectedTemplateId === 'emirates_id_scanner' ? (
          <HenryEmiratesIdPreview
            eidData={eidData}
            isScanning={isScanning}
            handleScanEmiratesId={handleScanEmiratesId}
            handleAutoFillAsTenant={handleAutoFillAsTenant}
            handleAutoFillAsLandlord={handleAutoFillAsLandlord}
            handleAutoFillViewingForm={handleAutoFillViewingForm}
            handleCopyJsonVariables={handleCopyJsonVariables}
          />
        ) : (
          <HenryCanvasPreview
            selectedTemplateId={selectedTemplateId}
            compiledHtml={compiledHtml}
            zoomLevel={zoomLevel}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handlePrint={handlePrint}
            handleCopyEsignLink={handleCopyEsignLink}
            handleTriggerAiAutoFill={handleTriggerAiAutoFill}
          />
        )}
      </WorkspaceSplit>

      <HenryTenancyContractModal
        isOpen={isTenancyModalOpen}
        onClose={handleCloseTenancyModal}
      />
    </StudioContainer>
  );
};

export default HenryDocumentStudio;
`;
fs.writeFileSync(FILE_PATH, newStudioContent, 'utf8');
console.log(`Rewrote ${FILE_PATH} to ${newStudioContent.split('\n').length} lines.`);
