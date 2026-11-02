import React, { FC } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  SidebarControlPanel,
  SectionLabel,
  TemplateCard,
} from '../styles/HenryDocumentStudio.style';
import { DocumentTemplateOption } from '../data/HenryDocumentStudio.data';

export interface HenryDocumentStudioSidebarProps {
  templates: DocumentTemplateOption[];
  selectedTemplateId: DocumentTemplateOption['id'];
  setSelectedTemplateId: (id: DocumentTemplateOption['id']) => void;
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
        {templates.map(tpl => (
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
        1. Upload supported documents in Henry Records and review extraction candidates against
        originals.
        <br />
        2. Confirm review before applying fields to a preparation draft.
        <br />
        3. Save reviewed supported originals explicitly to the encrypted vault. Uploaded Ejari
        certificates can be archived through Reviewed document intake; templates do not register or
        issue certificates.
      </div>
    </SidebarControlPanel>
  );
};
