/**
 * LeadDetailSlideOver.tsx — View Layer (4-Way Component Architecture)
 * Full lead history & timeline slide-over panel.
 */
import React, { FC } from 'react';
import { X, Phone, Mail, User, Home } from 'lucide-react';
import { useLeadDetailSlideOverLogic } from './logic/LeadDetailSlideOver.logic';
import {
  Overlay, Panel, PanelHeader, PanelTitle, CloseBtn,
  TabBar, Tab, PanelBody,
  TimelineItem, TimelineDot, TimelineContent, TimelineLabel, TimelineTime, TimelineDetail,
  DetailRow, DetailLabel, DetailValue,
} from './styles/LeadDetailSlideOver.style';

const TYPE_EMOJI: Record<string, string> = {
  call: '📞', whatsapp: '💬', viewing: '🏠', offer: '📋', note: '📝',
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const LeadDetailSlideOver: FC<Props> = ({ open, onClose }) => {
  const { lead, activeTab, setActiveTab } = useLeadDetailSlideOverLogic(onClose);

  return (
    <>
      <Overlay $open={open} onClick={onClose} data-testid="slide-over-overlay" />
      <Panel $open={open} data-testid="lead-detail-slide-over">
        <PanelHeader>
          <PanelTitle>{lead.name}</PanelTitle>
          <CloseBtn onClick={onClose} aria-label="Close panel"><X size={20} /></CloseBtn>
        </PanelHeader>
        <TabBar>
          <Tab $active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')}>Timeline</Tab>
          <Tab $active={activeTab === 'details'} onClick={() => setActiveTab('details')}>Details</Tab>
        </TabBar>
        <PanelBody>
          {activeTab === 'timeline' && lead.events.map((ev) => (
            <TimelineItem key={ev.id}>
              <TimelineDot $type={ev.type}>{TYPE_EMOJI[ev.type]}</TimelineDot>
              <TimelineContent>
                <TimelineTime>{ev.timestamp}</TimelineTime>
                <TimelineLabel>{ev.label}</TimelineLabel>
                <TimelineDetail>{ev.detail}</TimelineDetail>
              </TimelineContent>
            </TimelineItem>
          ))}
          {activeTab === 'details' && (
            <>
              <DetailRow><DetailLabel><Phone size={12} /> Phone</DetailLabel><DetailValue>{lead.phone}</DetailValue></DetailRow>
              <DetailRow><DetailLabel><Mail size={12} /> Email</DetailLabel><DetailValue>{lead.email}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>Budget</DetailLabel><DetailValue>{lead.budget}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>Nationality</DetailLabel><DetailValue>{lead.nationality}</DetailValue></DetailRow>
              <DetailRow><DetailLabel><Home size={12} /> Interest</DetailLabel><DetailValue>{lead.interest}</DetailValue></DetailRow>
              <DetailRow><DetailLabel><User size={12} /> Agent</DetailLabel><DetailValue>{lead.assignedAgent}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>Source</DetailLabel><DetailValue>{lead.source}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>Stage</DetailLabel><DetailValue>{lead.stage}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>Created</DetailLabel><DetailValue>{lead.createdAt}</DetailValue></DetailRow>
            </>
          )}
        </PanelBody>
      </Panel>
    </>
  );
};

export default LeadDetailSlideOver;
