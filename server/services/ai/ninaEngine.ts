import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';
import { cacheService } from '../CacheService.js';
// We mock the AI provider APIs for now

type Role = 'system' | 'user' | 'assistant';
interface Message {
  role: Role;
  content: string;
}

// Simple Provider interface
export interface AIProvider {
  name: string;
  streamChat(messages: Message[], onToken: (token: string) => void): Promise<void>;
}

class MockOpenAIProvider implements AIProvider {
  name = 'OpenAI';
  async streamChat(messages: Message[], onToken: (token: string) => void): Promise<void> {
    const response = 'This is a streaming response from the AI provider.';
    const tokens = response.split(' ');

    for (const token of tokens) {
      await new Promise(r => setTimeout(r, 50));
      onToken(token + ' ');
    }
  }
}

class MockAnthropicProvider implements AIProvider {
  name = 'Anthropic';
  async streamChat(messages: Message[], onToken: (token: string) => void): Promise<void> {
    const response = 'This is Anthropic taking over.';
    const tokens = response.split(' ');
    for (const token of tokens) {
      await new Promise(r => setTimeout(r, 50));
      onToken(token + ' ');
    }
  }
}

const PROVIDER_CHAIN: AIProvider[] = [new MockOpenAIProvider(), new MockAnthropicProvider()];

export class NinaEngine {
  // W24-008: Context Injection
  static async buildContext(assistantId: string, entityContext?: Record<string, unknown>): Promise<Message> {
    let baseContext = 'You are Nina, a helpful AI assistant.';

    if (entityContext) {
      if (entityContext.type === 'property') {
        baseContext += `\nYou are assisting on a Property page. Property ID: ${entityContext.id}.`;
      } else if (entityContext.type === 'lead') {
        baseContext += `\nYou are assisting a Lead. Lead Name: ${entityContext.name}, Status: ${entityContext.status}.`;
      } else if (entityContext.type === 'tenant') {
        baseContext += `\nYou are assisting a Tenant. Active Lease: ${entityContext.leaseId}.`;
      }
    }

    return { role: 'system', content: baseContext };
  }

  // W24-009: Session persistence and token caps
  static async checkCap(assistantId: string): Promise<boolean> {
    const key = `ai_cap:${assistantId}:${new Date().toISOString().split('T')[0]}`;
    const currentTokens = (await cacheService.get<number>(key)) || 0;
    if (Number(currentTokens) >= 10000) {
      // 10,000 daily token cap
      return false;
    }
    return true;
  }

  static async incrementCap(assistantId: string, tokens: number) {
    const key = `ai_cap:${assistantId}:${new Date().toISOString().split('T')[0]}`;
    await cacheService.incrby(key, tokens, 60 * 60 * 24); // 24h TTL
  }

  static async getHistory(sessionId: string): Promise<Message[]> {
    // 30-day TTL programmatic cleanup in MongoDB
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    try {
      await prisma.aIConversation.deleteMany({
        where: {
          updatedAt: {
            lt: thirtyDaysAgo,
          },
        },
      });
    } catch (err) {
      logger.warn('[NinaEngine] Failed programmatic 30-day TTL conversation pruning:', err);
    }

    const conv = await prisma.aIConversation.findUnique({ where: { sessionId } });
    if (!conv || !conv.messages) return [];
    return conv.messages as any as Message[];
  }

  static async saveHistory(sessionId: string, assistantId: string, messages: Message[]) {
    // Store only the last 20 messages to keep the session size compact
    const recentMessages = messages.slice(-20);
    await prisma.aIConversation.upsert({
      where: { sessionId },
      update: { messages: recentMessages as any, updatedAt: new Date() },
      create: { sessionId, assistantId, messages: recentMessages as any },
    });
  }

  // W24-007: Provider abstraction & SSE streaming
  static async streamResponse(
    sessionId: string,
    assistantId: string,
    userMessage: string,
    entityContext: Record<string, unknown> = {},
    onToken: (token: string) => void = () => {}
  ) {
    if (!(await this.checkCap(assistantId))) {
      onToken('Rate limit exceeded for today.');
      return;
    }

    const history = await this.getHistory(sessionId);
    const systemMsg = await this.buildContext(assistantId, entityContext);

    const messages: Message[] = [systemMsg, ...history, { role: 'user', content: userMessage }];

    let success = false;
    let fullResponse = '';

    // Fallback chain
    for (const provider of PROVIDER_CHAIN) {
      try {
        await provider.streamChat(messages, token => {
          fullResponse += token;
          onToken(token);
        });
        success = true;
        logger.info(`[NinaEngine] Response generated via ${provider.name}`);
        break; // Break on first successful provider
      } catch (err) {
        logger.warn(`[NinaEngine] Provider ${provider.name} failed, falling back...`);
      }
    }

    if (!success) {
      onToken('All AI providers are currently unavailable.');
      return;
    }

    // Save history and increment caps
    messages.push({ role: 'assistant', content: fullResponse.trim() });
    await this.saveHistory(sessionId, assistantId, messages);
    await this.incrementCap(assistantId, 10); // estimate 10 tokens
  }
}
