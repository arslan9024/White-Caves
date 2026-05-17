import { logger } from '../../../../utils/logger.js';
import type { LindaCoreClientContract, LindaCoreMode } from '../contracts/lindaCore.types.js';

export interface LindaSendRequest {
  phoneNumber: string;
  message: string;
}

export interface LindaBroadcastRequest {
  phoneNumbers: string[];
  message: string;
}

export class LindaMessageBridge {
  constructor(
    private readonly client: LindaCoreClientContract,
    private readonly mode: LindaCoreMode
  ) {}

  async send(request: LindaSendRequest): Promise<string> {
    const messageId = await this.client.sendMessage(request.phoneNumber, request.message);
    if (this.mode === 'shadow') {
      logger.debug('[LindaMessageBridge] send', {
        phoneNumber: request.phoneNumber,
        messageId,
      });
    }
    return messageId;
  }

  async broadcast(request: LindaBroadcastRequest) {
    const results = await this.client.broadcastMessage(request.phoneNumbers, request.message);
    if (this.mode === 'shadow') {
      logger.debug('[LindaMessageBridge] broadcast', {
        recipients: request.phoneNumbers.length,
        sent: results.filter(r => !r.error).length,
        failed: results.filter(r => !!r.error).length,
      });
    }
    return results;
  }

  getQueue() {
    const queue = this.client.getMessageQueue();
    if (this.mode === 'shadow') {
      logger.debug('[LindaMessageBridge] queue_poll', { count: queue.length });
    }
    return queue;
  }

  getConversations() {
    return this.client.getConversations();
  }

  getConversationHistory(phoneNumber: string, limit?: number) {
    return this.client.getConversationHistory(phoneNumber, limit);
  }
}
