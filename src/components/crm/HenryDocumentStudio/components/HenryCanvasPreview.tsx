import React, { FC } from 'react';
import { Eye, Printer, Share2, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
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
    <PreviewCanvasCard>
      <ToolbarHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Eye size={16} color="#EF4444" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            Live Document Preview — Zoom: {zoomLevel}%
          </span>
        </div>

        <ToolButtonGroup>
          {selectedTemplateId === 'tenancy_contract_esign' && (
            <ActionButton onClick={handleCopyEsignLink} title="No signing provider connected">
              <Share2 size={14} /> E-signature unavailable
            </ActionButton>
          )}

          {selectedTemplateId === 'viewing_form_autofill' && (
            <ActionButton
              onClick={handleTriggerAiAutoFill}
              title="1-Click AI Auto-Fill Form from CRM Data"
            >
              <Sparkles size={14} color="#FACC15" /> 1-Click AI Auto-Fill
            </ActionButton>
          )}

          <ActionButton onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={14} />
          </ActionButton>
          <ActionButton onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={14} />
          </ActionButton>
          <ActionButton $primary onClick={handlePrint} title="Laser Print / Save as PDF">
            <Printer size={14} /> Print / Export PDF
          </ActionButton>
        </ToolButtonGroup>
      </ToolbarHeader>

      {/* Interactive Document Render Viewport */}
      <PreviewFrame
        srcDoc={compiledHtml}
        title="Henry PDF Live Print Canvas"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
      />
    </PreviewCanvasCard>
  );
};
