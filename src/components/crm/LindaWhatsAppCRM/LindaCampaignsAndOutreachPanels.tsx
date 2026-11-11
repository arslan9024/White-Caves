import React, { memo } from 'react';
import type {
  LindaCampaignItem,
  LindaOutreachOwnerRow,
} from './LindaWhatsAppCRM.data';
import { LindaCampaignsTable } from './LindaCampaignsTable';
import { LindaOutreachPlannerPanel } from './LindaOutreachPlannerPanel';

export { LindaConversationsAndPillarsPanel } from './LindaConversationsAndPillarsPanel';
export type { ConversationsAndPillarsProps } from './LindaConversationsAndPillarsPanel';
export { LindaCampaignsTable } from './LindaCampaignsTable';
export { LindaOutreachPlannerPanel } from './LindaOutreachPlannerPanel';

export interface CampaignsAndOutreachProps {
  campaigns: LindaCampaignItem[];
  onToggleCampaignStatus: (campaignId: string) => void;
  outreachOwners: LindaOutreachOwnerRow[];
  onQueueOutreachBatch: (cluster: string) => void;
}

/**
 * LindaCampaignsAndOutreachPanel — Campaigns and Area Outreach Coordinator
 * Modularized under AEGIS APOCALYPSE-AEG-042 (< 350 lines).
 */
export const LindaCampaignsAndOutreachPanel: React.FC<CampaignsAndOutreachProps> = memo(({
  campaigns,
  onToggleCampaignStatus,
  outreachOwners,
  onQueueOutreachBatch,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16 }}>
      <LindaCampaignsTable
        campaigns={campaigns}
        onToggleCampaignStatus={onToggleCampaignStatus}
      />
      <LindaOutreachPlannerPanel
        outreachOwners={outreachOwners}
        onQueueOutreachBatch={onQueueOutreachBatch}
      />
    </div>
  );
});
