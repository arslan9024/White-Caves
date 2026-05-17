import { logger } from '../../../../utils/logger.js';
import type { LindaCoreClientContract, LindaCoreMode } from '../contracts/lindaCore.types.js';

export interface LindaCampaignDispatchPayload {
  campaignId: string;
  recipients: string[];
  message: string;
}

export interface LindaCampaignDispatchSummary {
  campaignId: string;
  recipients: number;
  sent: number;
  failed: number;
  mode: LindaCoreMode;
}

export class LindaCampaignBridge {
  constructor(
    private readonly client: LindaCoreClientContract,
    private readonly mode: LindaCoreMode
  ) {}

  async dispatch(payload: LindaCampaignDispatchPayload): Promise<LindaCampaignDispatchSummary> {
    const results = await this.client.broadcastMessage(payload.recipients, payload.message);
    const sent = results.filter(r => !r.error).length;
    const failed = results.filter(r => !!r.error).length;

    const summary: LindaCampaignDispatchSummary = {
      campaignId: payload.campaignId,
      recipients: payload.recipients.length,
      sent,
      failed,
      mode: this.mode,
    };

    if (this.mode === 'shadow') {
      logger.debug('[LindaCampaignBridge] dispatch', summary);
    }

    return summary;
  }
}
