/**
 * Conversation Memory System - Context-Aware State Management
 * Maintains conversation history, learns patterns, predicts next intents
 * Features: Short-term context, long-term memory, pattern recognition, predictive
 */

import { Intent, Entity, IntentResult } from './ninaEngine';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('ConversationMemory');

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: 'CUSTOMER' | 'AGENT' | 'SYSTEM';
  timestamp: Date;
  intentDetected?: Intent;
  sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface Theme {
  topic: string;
  frequency: number;
  firstMentioned: Date;
  lastMentioned: Date;
  relatedEntities: Entity[];
}

export interface UserPreference {
  key: string;
  value: string;
  confidence: number;
  source: 'STATED' | 'INFERRED' | 'HISTORY';
}

export interface ConversationPattern {
  pattern: Intent[];
  frequency: number;
  predictedNextIntent?: Intent;
  successRate: number;
}

export interface ConversationMemoryState {
  conversationId: string;
  customerName?: string;
  customerPhone?: string;
  messageHistory: Message[];
  themes: Theme[];
  userPreferences: UserPreference[];
  patterns: ConversationPattern[];
  recentIntents: Intent[];
  topEntities: Entity[];
  predictedNextIntents: Intent[];
  lastUpdateTime: Date;
  createdAt: Date;
  duration: number; // milliseconds
}

/**
 * Conversation Memory Manager
 */
export class ConversationMemory {
  private cache: Map<string, ConversationMemoryState>;
  private readonly MAX_HISTORY = 100;
  private readonly MEMORY_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.cache = new Map();
    log.info('ConversationMemory initialized');
  }

  /**
   * Get or create conversation memory state
   */
  public getOrCreateContext(conversationId: string): ConversationMemoryState {
    if (!this.cache.has(conversationId)) {
      this.cache.set(conversationId, {
        conversationId,
        messageHistory: [],
        themes: [],
        userPreferences: [],
        patterns: [],
        recentIntents: [],
        topEntities: [],
        predictedNextIntents: [],
        lastUpdateTime: new Date(),
        createdAt: new Date(),
        duration: 0,
      });
    }

    return this.cache.get(conversationId)!;
  }

  /**
   * Update context with new message and intent result
   */
  public updateContext(
    conversationId: string,
    message: Message,
    intentResult: IntentResult
  ): ConversationMemoryState {
    const context = this.getOrCreateContext(conversationId);

    // Add message to history
    context.messageHistory.push(message);

    // Keep only last MAX_HISTORY messages
    if (context.messageHistory.length > this.MAX_HISTORY) {
      context.messageHistory = context.messageHistory.slice(-this.MAX_HISTORY);
    }

    // Update recent intents (last 5)
    context.recentIntents.push(intentResult.primary.intent);
    if (context.recentIntents.length > 5) {
      context.recentIntents = context.recentIntents.slice(-5);
    }

    // Update themes
    this.updateThemes(context, intentResult.topics, intentResult.entities);

    // Update user preferences from entities
    this.updatePreferences(context, intentResult.entities, message.content);

    // Update patterns
    this.updatePatterns(context);

    // Predict next intents
    context.predictedNextIntents = this.predictNextIntents(context);

    // Update top entities
    context.topEntities = this.getTopEntities(context);

    // Update timestamps
    context.lastUpdateTime = new Date();
    context.duration = context.lastUpdateTime.getTime() - context.createdAt.getTime();

    return context;
  }

  /**
   * Get current context state
   */
  public getContext(conversationId: string): ConversationMemoryState | undefined {
    return this.cache.get(conversationId);
  }

  /**
   * Extract customer name and phone from message patterns
   */
  public extractCustomerInfo(context: ConversationMemoryState, message: string): void {
    // Extract phone number pattern
    const phoneMatch = message.match(/(\d{10}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (phoneMatch && !context.customerPhone) {
      context.customerPhone = phoneMatch[0];
    }

    // Extract name pattern (simple heuristic)
    const nameMatch = message.match(/(?:my name is|i'm|im|called|name's?)\s+([A-Z][a-z]*(?:\s+[A-Z][a-z]*)?)/i);
    if (nameMatch && !context.customerName) {
      context.customerName = nameMatch[1];
    }
  }

  /**
   * Recognize patterns in conversation
   */
  private updatePatterns(context: ConversationMemoryState): void {
    const intents = context.recentIntents;
    if (intents.length < 2) return;

    // Create n-gram patterns (2-3 consecutive intents)
    const patterns: Map<string, ConversationPattern> = new Map();

    // 2-gram patterns
    for (let i = 0; i < intents.length - 1; i++) {
      const pattern = [intents[i], intents[i + 1]];
      const key = pattern.join('->');

      if (!patterns.has(key)) {
        patterns.set(key, {
          pattern,
          frequency: 0,
          successRate: 0.8,
        });
      }

      const p = patterns.get(key)!;
      p.frequency += 1;
    }

    // Convert to array and store
    context.patterns = Array.from(patterns.values()).sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Predict next intents based on patterns
   */
  public predictNextIntents(context: ConversationMemoryState): Intent[] {
    const predictions: Map<Intent, number> = new Map();

    // Look at patterns
    for (const pattern of context.patterns) {
      if (pattern.pattern.length > 1) {
        const lastIntents = context.recentIntents.slice(-2);

        // Check if pattern matches recent sequence
        const patternMatches =
          lastIntents.length >= pattern.pattern.length - 1 &&
          lastIntents[lastIntents.length - 1] === pattern.pattern[pattern.pattern.length - 2];

        if (patternMatches && pattern.pattern.length === lastIntents.length + 1) {
          const nextIntent = pattern.pattern[pattern.pattern.length - 1];
          const score = pattern.frequency * pattern.successRate;

          predictions.set(nextIntent, (predictions.get(nextIntent) || 0) + score);
        }
      }
    }

    // Sort by prediction score and return top 3
    return Array.from(predictions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([intent]) => intent);
  }

  /**
   * Update themes from topics and entities
   */
  private updateThemes(context: ConversationMemoryState, topics: string[], entities: Entity[]): void {
    const now = new Date();

    for (const topic of topics) {
      const existingTheme = context.themes.find((t) => t.topic === topic);

      if (existingTheme) {
        existingTheme.frequency += 1;
        existingTheme.lastMentioned = now;
      } else {
        context.themes.push({
          topic,
          frequency: 1,
          firstMentioned: now,
          lastMentioned: now,
          relatedEntities: [],
        });
      }
    }

    // Link entities to themes
    for (const theme of context.themes) {
      const relatedEntities = entities.filter((e) => e.type.toLowerCase().includes(theme.topic));
      theme.relatedEntities = relatedEntities;
    }
  }

  /**
   * Update user preferences from extracted entities and messages
   */
  private updatePreferences(context: ConversationMemoryState, entities: Entity[], message: string): void {
    // Extract property type preference
    const propertyTypes = ['apartment', 'villa', 'townhouse', 'plot', 'commercial'];
    for (const type of propertyTypes) {
      if (message.toLowerCase().includes(type)) {
        this.setPreference(context, 'PROPERTY_TYPE', type, 0.9, 'INFERRED');
      }
    }

    // Extract budget preference
    const prices = entities.filter((e) => e.type === 'PRICE');
    if (prices.length > 0) {
      this.setPreference(context, 'BUDGET', prices[0].value, prices[0].confidence, 'STATED');
    }

    // Extract location preference
    const locations = entities.filter((e) => e.type === 'LOCATION');
    if (locations.length > 0) {
      this.setPreference(context, 'LOCATION', locations[0].value, locations[0].confidence, 'STATED');
    }

    // Extract bedroom preference
    const bedrooms = entities.filter((e) => e.type === 'BEDROOMS');
    if (bedrooms.length > 0) {
      this.setPreference(context, 'BEDROOMS', bedrooms[0].value, bedrooms[0].confidence, 'STATED');
    }
  }

  /**
   * Helper to set preference (with confidence-based updates)
   */
  private setPreference(
    context: ConversationMemoryState,
    key: string,
    value: string,
    confidence: number,
    source: 'STATED' | 'INFERRED' | 'HISTORY'
  ): void {
    const existingIndex = context.userPreferences.findIndex((p) => p.key === key);

    if (existingIndex === -1) {
      context.userPreferences.push({ key, value, confidence, source });
    } else {
      // Update only if new confidence is higher
      if (confidence > context.userPreferences[existingIndex].confidence) {
        context.userPreferences[existingIndex] = { key, value, confidence, source };
      }
    }
  }

  /**
   * Get top entities by frequency and recency
   */
  private getTopEntities(context: ConversationMemoryState): Entity[] {
    const entityCounts: Map<string, number> = new Map();

    for (const message of context.messageHistory) {
      // In real implementation, would extract entities here
      // For now, just return empty
    }

    return [];
  }

  /**
   * Clear old conversations (cleanup)
   */
  public clearOldConversations(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, state] of this.cache.entries()) {
      if (now - state.lastUpdateTime.getTime() > this.MEMORY_TTL) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Get memory statistics
   */
  public getStats(): {
    totalConversations: number;
    totalMessages: number;
    averageThemes: number;
  } {
    let totalMessages = 0;
    let totalThemes = 0;

    for (const state of this.cache.values()) {
      totalMessages += state.messageHistory.length;
      totalThemes += state.themes.length;
    }

    return {
      totalConversations: this.cache.size,
      totalMessages,
      averageThemes: this.cache.size > 0 ? totalThemes / this.cache.size : 0,
    };
  }

  /**
   * Export conversation for analysis
   */
  public exportConversation(conversationId: string): ConversationMemoryState | null {
    return this.cache.get(conversationId) || null;
  }
}

// Export singleton instance
export const conversationMemory = new ConversationMemory();
