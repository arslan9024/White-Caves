/**
 * NinaLindaMaryIntegration
 * Initialize and connect all three AI assistants for unified operations
 * Enables: Property queries, real-time inventory, event-driven status updates
 */

import NinaMaryIntelligence from './NinaMaryIntelligence';
import PropertyQueryService from './PropertyQueryService';
import PropertyStatusEventService from './PropertyStatusEventService';
import ComplianceValidationService from './ComplianceValidationService';

class NinaLindaMaryIntegration {
  constructor() {
    this.ninaMaryIntelligence = new NinaMaryIntelligence();
    this.propertyQueryService = new PropertyQueryService();
    this.statusEventService = new PropertyStatusEventService();
    this.complianceService = new ComplianceValidationService();
    this.initialized = false;
  }

  /**
   * Initialize the integrated system
   * Connect all event subscribers and validators
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Nina-Linda-Mary Integration System...');

      // Subscribe Mary to property status change events
      this.subscribeMarryToStatusEvents();

      // Subscribe Linda to property updates
      this.subscribeLindaToStatusEvents();

      // Subscribe Nina to availability changes
      this.subscribeNinaToStatusEvents();

      // Initialize compliance validation
      this.initializeComplianceValidation();

      console.log('✅ Integration system initialized successfully');
      this.initialized = true;

      return {
        success: true,
        services: {
          ninaMary: this.ninaMaryIntelligence,
          propertyQuery: this.propertyQueryService,
          statusEvents: this.statusEventService,
          compliance: this.complianceService
        }
      };
    } catch (error) {
      console.error('❌ Integration initialization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Subscribe Mary to property status change events
   * When: Lease signed, property sold, maintenance completed
   * Action: Update property status dimensions
   */
  subscribeMarryToStatusEvents() {
    // Lease signed event
    this.statusEventService.subscribeTo('lease_signed', async (event) => {
      console.log('[MARY] Processing lease signed event:', event.payload.propertyId);

      // Update property status
      const updatePayload = {
        occupancyStatus: 'occupied_by_tenant',
        marketAvailability: 'not_available',
        currentTenant: {
          name: event.payload.tenantName,
          phone: event.payload.tenantPhone,
          email: event.payload.tenantEmail
        },
        leaseStartDate: event.payload.leaseStartDate,
        leaseEndDate: event.payload.leaseEndDate,
        leaseRentAmount: event.payload.rentAmount,
        updatedBy: 'daisy_event'
      };

      // In production: PATCH /api/inventory/{propertyId}/status with updatePayload
      return updatePayload;
    });

    // Property sold event
    this.statusEventService.subscribeTo('property_sold', async (event) => {
      console.log('[MARY] Processing property sold event:', event.payload.propertyId);

      const updatePayload = {
        marketAvailability: 'not_available',
        occupancyStatus: 'occupied_by_owner',
        updatedBy: 'clara_sales_event'
      };

      // In production: PATCH /api/inventory/{propertyId}/status
      return updatePayload;
    });

    // Maintenance completed event
    this.statusEventService.subscribeTo('maintenance_completed', async (event) => {
      console.log('[MARY] Processing maintenance completed event:', event.payload.propertyId);

      // Property returns to normal status after maintenance
      return {
        occupancyStatus: 'vacant',
        updatedBy: 'sentinel_maintenance_event'
      };
    });

    // Lease expiring event
    this.statusEventService.subscribeTo('lease_expiring', async (event) => {
      console.log('[MARY] Lease expiring soon:', event.payload.propertyId);

      // Flag for attention but don't change market availability yet
      return {
        tags: ['lease_expiring_soon'],
        updatedBy: 'daisy_expiry_event'
      };
    });

    // Property handed over event
    this.statusEventService.subscribeTo('property_handed_over', async (event) => {
      console.log('[MARY] Processing handover event:', event.payload.propertyId);

      return {
        constructionStage: 'handed_over',
        occupancyStatus: 'occupied_by_owner',
        updatedBy: 'handover_event'
      };
    });
  }

  /**
   * Subscribe Linda to property status change events
   * When: Status changes
   * Action: Notify agents via dashboard, suggest property updates in conversations
   */
  subscribeLindaToStatusEvents() {
    // Any property status change
    const allStatusEvents = [
      'lease_signed',
      'property_sold',
      'lease_expiring',
      'maintenance_completed',
      'property_handed_over'
    ];

    allStatusEvents.forEach(eventType => {
      this.statusEventService.subscribeTo(eventType, async (event) => {
        console.log('[LINDA] Status change notification:', eventType, event.payload.propertyId);

        // Generate notification for Linda's dashboard
        const notification = {
          type: eventType,
          propertyId: event.payload.propertyId,
          message: this.generateLindaNotification(eventType, event.payload),
          timestamp: event.timestamp,
          priority: this.getNotificationPriority(eventType)
        };

        // In production: POST /api/whatsapp/notifications with notification
        return notification;
      });
    });
  }

  /**
   * Subscribe Nina to property availability changes
   * When: Property becomes available or unavailable
   * Action: Update bot knowledge base, prepare relevant responses
   */
  subscribeNinaToStatusEvents() {
    this.statusEventService.subscribeTo('lease_terminated', async (event) => {
      console.log('[NINA] Lease terminated - property may become available:', event.payload.propertyId);

      // Nina's bot can now use property in availability responses
      return {
        type: 'property_availability_update',
        propertyId: event.payload.propertyId,
        status: 'check_mary_for_new_availability'
      };
    });

    this.statusEventService.subscribeTo('property_handed_over', async (event) => {
      console.log('[NINA] Property handed over - update knowledge base:', event.payload.propertyId);

      return {
        type: 'property_update',
        propertyId: event.payload.propertyId,
        status: 'now_available_for_rent'
      };
    });
  }

  /**
   * Initialize compliance validation for Nina/Linda messages
   */
  initializeComplianceValidation() {
    // Before Nina sends a response, validate compliance
    const originalNinaGenerate = this.ninaMaryIntelligence.generateEnhancedResponse;

    this.ninaMaryIntelligence.generateEnhancedResponse = async function (...args) {
      const response = await originalNinaGenerate.apply(this, args);

      // Validate Nina's response
      const validation = this.complianceService.validateMessage(response.text, {
        source: 'nina_bot'
      });

      if (!validation.valid) {
        console.warn('[COMPLIANCE] Nina message contains violations:', validation.violations);
        response.complianceWarning = validation.violations[0].message;
        response.suggestion = validation.suggestions[0];
      }

      response.complianceScore = validation.score;
      return response;
    }.bind(this);
  }

  /**
   * Generate human-readable notification for Linda
   */
  generateLindaNotification(eventType, payload) {
    const notifications = {
      'lease_signed': `Lease signed for property ${payload.propertyId}! Mark ${payload.tenantName}'s lead as "Tenant Acquired".`,
      'property_sold': `Property ${payload.propertyId} sold! Remove from active listings.`,
      'lease_expiring': `Lease expiring in ${payload.daysUntilExpiry} days for property ${payload.propertyId}. Renewal opportunity!`,
      'maintenance_completed': `Maintenance completed on property ${payload.propertyId}. Property back to normal status.`,
      'property_handed_over': `Property ${payload.propertyId} handed over to owner. Update status.`
    };

    return notifications[eventType] || `Status update for property ${payload.propertyId}`;
  }

  /**
   * Determine notification priority
   */
  getNotificationPriority(eventType) {
    const priorities = {
      'property_sold': 'critical',
      'lease_expiring': 'high',
      'lease_signed': 'high',
      'maintenance_completed': 'medium',
      'property_handed_over': 'medium'
    };

    return priorities[eventType] || 'low';
  }

  /**
   * WORKFLOW: Client asks about properties → Nina/Linda responds
   */
  async handlePropertyInquiry(userMessage, conversationContext) {
    try {
      // Step 1: Nina processes the message with compliance check
      console.log('📞 [WORKFLOW] Handling property inquiry:', userMessage);

      // Step 2: Validate message compliance
      const validation = this.complianceService.validateMessage(userMessage);
      if (!validation.valid) {
        console.warn('[WORKFLOW] Compliance issues detected:', validation.violations);
      }

      // Step 3: Nina generates enhanced response with Mary's inventory
      const response = await this.ninaMaryIntelligence.generateEnhancedResponse(
        userMessage,
        conversationContext.intent,
        conversationContext.entities,
        conversationContext
      );

      // Step 4: Add property widgets for Linda's agent interface
      response.linda_widget = {
        type: 'property_search',
        query: userMessage,
        properties: response.properties || []
      };

      return {
        success: true,
        response,
        compliance: validation
      };
    } catch (error) {
      console.error('[WORKFLOW] Error handling property inquiry:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * WORKFLOW: Linda sends message to client → Validate compliance
   */
  async handleLindaMessage(messageText, context) {
    try {
      console.log('💬 [WORKFLOW] Validating Linda message:', messageText);

      // Validate compliance
      const validation = this.complianceService.validateBeforeSending(messageText, context);

      if (!validation.canSend && validation.violations.length > 0) {
        console.warn('[WORKFLOW] Message blocked due to compliance violations');

        return {
          success: false,
          canSend: false,
          violations: validation.violations,
          suggestedMessage: this.complianceService.suggestCompliantAlternative(
            messageText,
            validation.violations
          ),
          warnings: validation.warnings
        };
      }

      // If warnings but not critical, allow send with warning
      if (validation.warnings.length > 0 && validation.isCompliant) {
        console.log('[WORKFLOW] Message approved with warnings');

        return {
          success: true,
          canSend: true,
          warnings: validation.warnings,
          complianceScore: validation.complianceScore
        };
      }

      console.log('[WORKFLOW] Message fully compliant');

      return {
        success: true,
        canSend: true,
        complianceScore: validation.complianceScore
      };
    } catch (error) {
      console.error('[WORKFLOW] Error validating Linda message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * WORKFLOW: Property status changes (from Daisy, Clara, Sentinel)
   */
  async handleStatusChange(eventType, payload, source) {
    try {
      console.log(`📊 [WORKFLOW] Publishing status change event: ${eventType} from ${source}`);

      const event = await this.statusEventService.publishEvent(eventType, payload, source);

      console.log('[WORKFLOW] Event processed by all subscribers');

      return {
        success: true,
        eventId: event.id,
        subscribers_notified: [
          'mary_inventory',
          'linda_crm',
          'nina_bot'
        ]
      };
    } catch (error) {
      console.error('[WORKFLOW] Error handling status change:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get system health and integration status
   */
  getIntegrationStatus() {
    return {
      initialized: this.initialized,
      ninaMaryIntelligence: !!this.ninaMaryIntelligence,
      propertyQueryService: !!this.propertyQueryService,
      statusEventService: !!this.statusEventService,
      complianceService: !!this.complianceService,
      eventStats: this.statusEventService?.getEventStatistics(),
      complianceStats: this.complianceService?.getComplianceStats(),
      timestamp: new Date()
    };
  }
}

export default NinaLindaMaryIntegration;
