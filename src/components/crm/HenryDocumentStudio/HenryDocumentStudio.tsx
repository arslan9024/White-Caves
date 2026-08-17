/**
 * HenryDocumentStudio.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentation shell consuming logic, styles and templates.
 */

import React, { FC } from 'react';
import { Printer, ZoomIn, ZoomOut, FileText, Stamp, Eye, Download, ShieldCheck } from 'lucide-react';
import { useHenryDocumentStudioLogic } from './logic/HenryDocumentStudio.logic';
import {
  StudioContainer,
  StudioHeader,
  Badge,
  WorkspaceSplit,
  SidebarControlPanel,
  SectionLabel,
  TemplateCard,
  PreviewCanvasCard,
  ToolbarHeader,
  ToolButtonGroup,
  ActionButton,
  PreviewFrame,
} from './styles/HenryDocumentStudio.style';

export const HenryDocumentStudio: FC = () => {
  const {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    compiledHtml,
    zoomLevel,
    handlePrint,
    handleZoomIn,
    handleZoomOut,
  } = useHenryDocumentStudioLogic();

  return (
    <StudioContainer data-testid="henry-document-studio">
      {/* Executive Header */}
      <StudioHeader>
        <div>
          <h2>
            <span>📄</span> Henry AI — Document Studio & PDF Engine
          </h2>
          <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.88rem' }}>
            High-DPI PDF compilation, visual contract redlining, print preview & Ejari Form 7 automation.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Badge>HENRY AI 4000% ACTIVE</Badge>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>RERA ORN: 44483</span>
        </div>
      </StudioHeader>

      {/* Main Studio Workspace */}
      <WorkspaceSplit>
        {/* Left Template & Document Selector */}
        <SidebarControlPanel>
          <SectionLabel>Select Real Estate Template</SectionLabel>
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

          <SectionLabel style={{ marginTop: '12px' }}>Regulatory Compliance Seals</SectionLabel>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1E293B', fontWeight: 800, marginBottom: '4px' }}>
              <ShieldCheck size={14} color="#EF4444" />
              <span>DET & RERA Auto-Watermarking</span>
            </div>
            All documents generated in Henry Studio include DET License 1388443, RERA ORN 44483, and Ejari cryptographic hash tags.
          </div>
        </SidebarControlPanel>

        {/* Right Print Preview Canvas */}
        <PreviewCanvasCard>
          <ToolbarHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={16} color="#EF4444" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Live Print Preview — Zoom: {zoomLevel}%
              </span>
            </div>

            <ToolButtonGroup>
              <ActionButton onClick={handleZoomOut} title="Zoom Out">
                <ZoomOut size={14} />
              </ActionButton>
              <ActionButton onClick={handleZoomIn} title="Zoom In">
                <ZoomIn size={14} />
              </ActionButton>
              <ActionButton $primary onClick={handlePrint} title="Laser Print / Save as PDF">
                <Printer size={14} /> Print Document
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
      </WorkspaceSplit>
    </StudioContainer>
  );
};

export default HenryDocumentStudio;
