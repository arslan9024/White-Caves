/**
 * AssistantOrchestrator — Central Event Bus for AI Assistants
 *
 * Singleton EventEmitter enabling cross-assistant communication between:
 *   Linda  (WhatsApp device — whatsapp-web.js)
 *   Nadia  (Meta Cloud API — official WABA)
 *   Nina   (Internal NLP engine)
 *   Mary   (Property inventory manager — 9,378+ units)
 *   Henry  (Document hub + compliance engine)
 *
 * Architecture: Node.js EventEmitter with typed events, 50-entry ring buffer,
 * structured logging, and error-isolated handler registration.
 */

import { EventEmitter } from 'events';

// ─── Event Type Definitions ───────────────────────────────────────────────────

/** All cross-assistant event names */
export type OrchestratorEvent =
  | 'linda:message_received'       // Linda got a WA message → route to Nina for NLP
  | 'nina:intent_classified'       // Nina classified intent → route to Nadia OR Mary
  | 'nadia:lead_scored'            // Nadia scored a lead → tell Linda + Henry
  | 'mary:property_status_changed' // Mary changed status → trigger Linda broadcast + Henry doc
  | 'henry:compliance_failed'      // Henry found compliance issue → alert Nadia conversation
  | 'henry:document_generated'     // Henry created document → notify relevant Nadia conversation
  | 'cross:viewing_booked'         // Booking confirmed → Nadia confirmation + Henry viewing agreement
  | 'cross:offer_accepted';        // Offer accepted → Henry MOU + Nadia notify buyer + Linda notify agent

/** Strongly-typed payload map — every event has a fixed shape */
export interface OrchestratorEventPayloads {
  'linda:message_received': {
    from: string;
    message: string;
    conversationId?: string;
    timestamp: string;
  };
  'nina:intent_classified': {
    intent: string;
    entities: string[];
    confidence: number;
    source: string;
    conversationId?: string;
  };
  'nadia:lead_scored': {
    conversationId: string;
    leadScore: number;
    phone: string;
    intent: string;
  };
  'mary:property_status_changed': {
    propertyId: string;
    previousStatus: string;
    newStatus: string;
    broadcastPayload?: Record<string, unknown>;
    targetPhones?: string[];
  };
  'henry:compliance_failed': {
    conversationId?: string;
    templateKey: string;
    violations: string[];
    severity: 'error' | 'warning' | 'info';
  };
  'henry:document_generated': {
    documentId: string;
    templateKey: string;
    conversationId?: string;
    fileName: string;
  };
  'cross:viewing_booked': {
    viewingId?: string;
    propertyId: string;
    contactPhone: string;
    scheduledAt: string;
    documentData?: Record<string, unknown>;
    conversationId?: string;
  };
  'cross:offer_accepted': {
    offerId?: string;
    propertyId: string;
    buyerPhone: string;
    agentPhone?: string;
    offerAmount: number;
    documentData?: Record<string, unknown>;
    conversationId?: string;
  };
}

/** Union of all payload shapes (stored in ring buffer) */
export type AnyOrchestratorPayload =
  OrchestratorEventPayloads[keyof OrchestratorEventPayloads];

/** Single entry in the in-memory event ring buffer */
export interface OrchestratorLogEntry {
  id: string;
  event: OrchestratorEvent;
  payload: AnyOrchestratorPayload;
  timestamp: string;
}

/** Handler registration and activity status */
export interface OrchestratorStatus {
  handlerCount: Record<string, number>;
  registeredAssistants: string[];
  totalEventsEmitted: number;
  ringBufferSize: number;
  uptime: number;
}

// ─── Core Implementation ──────────────────────────────────────────────────────

class AssistantOrchestrator extends EventEmitter {
  private readonly eventLog: OrchestratorLogEntry[] = [];
  private readonly MAX_LOG_SIZE = 50;
  private totalEventsEmitted = 0;
  private readonly startedAt = Date.now();
  private readonly registeredAssistants = new Set<string>();

  constructor() {
    super();
    // Raise ceiling — multiple handlers per event across 5 assistants
    this.setMaxListeners(60);
  }

  /**
   * Emit a typed orchestrator event.
   * Appends to ring buffer, logs structured message, and fires all registered handlers.
   *
   * @param event   - One of the 8 defined OrchestratorEvent names
   * @param payload - Strongly-typed payload matching the event's interface
   */
  emitEvent<E extends OrchestratorEvent>(
    event: E,
    payload: OrchestratorEventPayloads[E]
  ): boolean {
    this.totalEventsEmitted++;

    const entry: OrchestratorLogEntry = {
      id: `orch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      event,
      payload: payload as AnyOrchestratorPayload,
      timestamp: new Date().toISOString(),
    };

    this.eventLog.push(entry);
    if (this.eventLog.length > this.MAX_LOG_SIZE) {
      this.eventLog.shift();
    }

    const summary = JSON.stringify(payload).slice(0, 160);
    console.info(`[Orchestrator] ${event}: ${summary}`);

    return super.emit(event, payload);
  }

  /**
   * Register a typed event handler with error isolation.
   * Prevents one failing handler from crashing the event chain.
   *
   * @param event   - OrchestratorEvent to subscribe to
   * @param handler - Callback receiving the typed payload
   */
  onEvent<E extends OrchestratorEvent>(
    event: E,
    handler: (payload: OrchestratorEventPayloads[E]) => void | Promise<void>
  ): this {
    return this.on(event, (payload: OrchestratorEventPayloads[E]) => {
      try {
        const result = handler(payload);
        if (result instanceof Promise) {
          result.catch((err: unknown) => {
            console.error(
              `[Orchestrator] Async handler error on "${event}":`,
              err instanceof Error ? err.message : err
            );
          });
        }
      } catch (err) {
        console.error(
          `[Orchestrator] Sync handler error on "${event}":`,
          err instanceof Error ? err.message : err
        );
      }
    });
  }

  /**
   * Returns the last N events from the ring buffer (newest last).
   *
   * @param limit - Maximum entries to return (1–50, default 50)
   */
  getRecentEvents(limit = 50): OrchestratorLogEntry[] {
    const safeLimit = Math.max(1, Math.min(limit, this.MAX_LOG_SIZE));
    return [...this.eventLog].slice(-safeLimit);
  }

  // ─── Handler Registration Methods ─────────────────────────────────────────

  /**
   * Register Linda's cross-assistant handlers.
   * Linda reacts to property status changes (WA broadcast) and accepted offers (notify agent).
   */
  registerLindaHandlers(): void {
    this.registeredAssistants.add('linda');

    this.onEvent('mary:property_status_changed', payload => {
      console.info(
        `[Orchestrator→Linda] Property ${payload.propertyId} → "${payload.newStatus}". ` +
          `Queuing WA broadcast to ${payload.targetPhones?.length ?? 0} contacts.`
      );
    });

    this.onEvent('cross:offer_accepted', payload => {
      console.info(
        `[Orchestrator→Linda] Offer accepted on ${payload.propertyId}. ` +
          `Notifying agent ${payload.agentPhone ?? 'N/A'} via WhatsApp.`
      );
    });

    console.info('[Orchestrator] Linda handlers registered.');
  }

  /**
   * Register Nadia's cross-assistant handlers.
   * Nadia reacts to compliance failures and booking/offer confirmations.
   */
  registerNadiaHandlers(): void {
    this.registeredAssistants.add('nadia');

    this.onEvent('henry:compliance_failed', payload => {
      console.info(
        `[Orchestrator→Nadia] Compliance failure in conversation ` +
          `"${payload.conversationId ?? 'unknown'}": ${payload.violations.length} violation(s) ` +
          `on template "${payload.templateKey}".`
      );
    });

    this.onEvent('cross:viewing_booked', payload => {
      console.info(
        `[Orchestrator→Nadia] Viewing booked for ${payload.propertyId}. ` +
          `Sending confirmation to ${payload.contactPhone}.`
      );
    });

    this.onEvent('cross:offer_accepted', payload => {
      console.info(
        `[Orchestrator→Nadia] Offer accepted — notifying buyer at ${payload.buyerPhone}.`
      );
    });

    console.info('[Orchestrator] Nadia handlers registered.');
  }

  /**
   * Register Nina's cross-assistant handlers.
   * Nina routes every new Linda message through the NLP pipeline.
   */
  registerNinaHandlers(): void {
    this.registeredAssistants.add('nina');

    this.onEvent('linda:message_received', payload => {
      const preview = payload.message.slice(0, 60);
      console.info(
        `[Orchestrator→Nina] Message from ${payload.from}: ` +
          `"${preview}${payload.message.length > 60 ? '…' : ''}". Routing to NLP pipeline.`
      );
    });

    console.info('[Orchestrator] Nina handlers registered.');
  }

  /**
   * Register Mary's cross-assistant handlers.
   * Mary reacts to inventory-related intents classified by Nina.
   */
  registerMaryHandlers(): void {
    this.registeredAssistants.add('mary');

    this.onEvent('nina:intent_classified', payload => {
      const inventoryIntents = ['property_search', 'information_request', 'make_offer'];
      if (inventoryIntents.includes(payload.intent)) {
        console.info(
          `[Orchestrator→Mary] Intent "${payload.intent}" (confidence ${payload.confidence}) ` +
            `with ${payload.entities.length} entities — triggering inventory search.`
        );
      }
    });

    console.info('[Orchestrator] Mary handlers registered.');
  }

  /**
   * Register Henry's cross-assistant handlers.
   * Henry reacts to viewings, accepted offers, and high-value leads.
   */
  registerHenryHandlers(): void {
    this.registeredAssistants.add('henry');

    this.onEvent('cross:viewing_booked', payload => {
      console.info(
        `[Orchestrator→Henry] Viewing for ${payload.propertyId} at ${payload.scheduledAt}. ` +
          `Generating viewing agreement.`
      );
    });

    this.onEvent('cross:offer_accepted', payload => {
      console.info(
        `[Orchestrator→Henry] Offer AED ${payload.offerAmount.toLocaleString()} accepted ` +
          `on ${payload.propertyId}. Generating MOU.`
      );
    });

    this.onEvent('nadia:lead_scored', payload => {
      if (payload.leadScore >= 80) {
        console.info(
          `[Orchestrator→Henry] High-value lead (score ${payload.leadScore}) in ` +
            `conversation ${payload.conversationId}. Pre-staging compliance check.`
        );
      }
    });

    console.info('[Orchestrator] Henry handlers registered.');
  }

  /**
   * Returns the current registration and activity status of the orchestrator.
   */
  getStatus(): OrchestratorStatus {
    const handlerCount: Record<string, number> = {};
    for (const eventName of this.eventNames()) {
      handlerCount[String(eventName)] = this.listenerCount(eventName as string | symbol);
    }
    return {
      handlerCount,
      registeredAssistants: Array.from(this.registeredAssistants),
      totalEventsEmitted: this.totalEventsEmitted,
      ringBufferSize: this.eventLog.length,
      uptime: Math.round((Date.now() - this.startedAt) / 1000),
    };
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

/** Global singleton orchestrator instance */
export const assistantOrchestrator = new AssistantOrchestrator();

/**
 * Convenience helper returning orchestrator status.
 * Exported separately so callers don't need to hold a reference to the singleton.
 */
export function getOrchestratorStatus(): OrchestratorStatus {
  return assistantOrchestrator.getStatus();
}
