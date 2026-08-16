/**
 * PropertyStatusEventService
 * Handles event-driven status synchronization between systems
 * Events from: Daisy (leasing), Sentinel (maintenance), Clara (sales)
 * Consumers: Mary (inventory), Linda (CRM), Nina (communications)
 */

class PropertyStatusEventService {
  constructor() {
    this.eventQueue = [];
    this.subscribers = new Map();
    this.eventHistory = [];
    this.maxHistorySize = 10000;
  }

  /**
   * Register a subscriber for specific event types
   * Example: subscribeTo('lease_signed', (event) => {...})
   */
  subscribeTo(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push(callback);
  }

  /**
   * Publish an event to the queue
   */
  async publishEvent(eventType, payload, source) {
    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      source: source, // 'daisy', 'sentinel', 'clara', 'manual'
      payload,
      timestamp: new Date(),
      processed: false,
      errors: []
    };

    this.eventQueue.push(event);
    this.eventHistory.push(event);

    // Keep history size manageable
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Process event immediately
    await this.processEvent(event);

    return event;
  }

  /**
   * Process a single event
   */
  async processEvent(event) {
    try {
      const subscribers = this.subscribers.get(event.type) || [];

      // Call all subscribers for this event type
      const promises = subscribers.map(callback => 
        Promise.resolve(callback(event)).catch(error => {
          
          event.errors.push({
            subscriber: callback.name || 'anonymous',
            error: error.message
          });
        })
      );

      await Promise.all(promises);
      event.processed = true;
    } catch (error) {
      
      event.errors.push({
        processor: 'main',
        error: error.message
      });
    }
  }

  /**
   * LEASE EVENTS FROM DAISY
   */

  /**
   * When lease is signed in Daisy system
   */
  async onLeaseSigned(leaseData) {
    return this.publishEvent('lease_signed', {
      propertyId: leaseData.propertyId,
      tenantId: leaseData.tenantId,
      tenantName: leaseData.tenantName,
      tenantPhone: leaseData.tenantPhone,
      tenantEmail: leaseData.tenantEmail,
      leaseStartDate: leaseData.startDate,
      leaseEndDate: leaseData.endDate,
      rentAmount: leaseData.rentAmount,
      currency: leaseData.currency || 'AED'
    }, 'daisy');
  }

  /**
   * When lease is about to expire
   */
  async onLeaseExpiring(leaseData, daysUntilExpiry) {
    return this.publishEvent('lease_expiring', {
      propertyId: leaseData.propertyId,
      tenantId: leaseData.tenantId,
      daysUntilExpiry,
      currentLeaseEndDate: leaseData.endDate,
      rentAmount: leaseData.rentAmount
    }, 'daisy');
  }

  /**
   * When lease is terminated/ended
   */
  async onLeaseTerminated(leaseData, reason) {
    return this.publishEvent('lease_terminated', {
      propertyId: leaseData.propertyId,
      tenantId: leaseData.tenantId,
      leaseEndDate: leaseData.endDate,
      reason,
      timestamp: new Date()
    }, 'daisy');
  }

  /**
   * SALES EVENTS FROM CLARA
   */

  /**
   * When property is sold
   */
  async onPropertySold(saleData) {
    return this.publishEvent('property_sold', {
      propertyId: saleData.propertyId,
      buyerId: saleData.buyerId,
      buyerName: saleData.buyerName,
      salePrice: saleData.salePrice,
      currency: saleData.currency || 'AED',
      saleDate: saleData.saleDate,
      deedNumber: saleData.deedNumber
    }, 'clara');
  }

  /**
   * MAINTENANCE EVENTS FROM SENTINEL
   */

  /**
   * When maintenance is completed
   */
  async onMaintenanceCompleted(maintenanceData) {
    return this.publishEvent('maintenance_completed', {
      propertyId: maintenanceData.propertyId,
      maintenanceType: maintenanceData.type,
      completionDate: maintenanceData.completionDate,
      cost: maintenanceData.cost,
      notes: maintenanceData.notes
    }, 'sentinel');
  }

  /**
   * When property needs maintenance
   */
  async onMaintenanceRequired(maintenanceData) {
    return this.publishEvent('maintenance_required', {
      propertyId: maintenanceData.propertyId,
      maintenanceType: maintenanceData.type,
      urgency: maintenanceData.urgency, // 'low', 'medium', 'high', 'critical'
      reportedDate: maintenanceData.reportedDate,
      description: maintenanceData.description
    }, 'sentinel');
  }

  /**
   * PROPERTY DELIVERY EVENTS (for off-plan properties)
   */

  /**
   * When property is handed over to owner
   */
  async onPropertyHandedOver(handoverData) {
    return this.publishEvent('property_handed_over', {
      propertyId: handoverData.propertyId,
      ownerId: handoverData.ownerId,
      handoverDate: handoverData.handoverDate,
      handoverCondition: handoverData.condition, // 'shell', 'semi_ready', 'ready'
      keys: handoverData.keysProvidedDate
    }, 'manual');
  }

  /**
   * SUBSCRIBER IMPLEMENTATIONS
   * These are called when events are published
   */

  /**
   * Update Mary's inventory when lease is signed
   */
  async maryOnLeaseSigned(event) {
    const { propertyId, tenantName, tenantPhone, tenantEmail, leaseStartDate, leaseEndDate, rentAmount } = event.payload;

    // In actual implementation, would call Mary's API
    // PUT /api/inventory/{propertyId}
    const updatePayload = {
      occupancyStatus: 'occupied_by_tenant',
      marketAvailability: 'not_available',
      currentTenant: {
        name: tenantName,
        phone: tenantPhone,
        email: tenantEmail
      },
      leaseStartDate,
      leaseEndDate,
      leaseRentAmount: rentAmount,
      updatedBy: 'daisy_system'
    };
    
    // emit to update Mary
    return updatePayload;
  }

  /**
   * Notify Linda when property status changes
   */
  async lindaOnPropertyStatusChange(event) {

    // In actual implementation, would notify Linda's CRM dashboard
    // POST /api/whatsapp/conversations/notify
    const notification = {
      type: 'property_status_change',
      propertyId: event.payload.propertyId,
      eventType: event.type,
      message: this.generateLindaNotification(event),
      priority: 'high',
      timestamp: event.timestamp
    };
    
    return notification;
  }

  /**
   * Notify Nina about property availability changes
   */
  async ninaOnPropertyAvailabilityChange(event) {

    // Nina should update its knowledge base about property availability
    const notification = {
      type: 'property_availability_change',
      propertyId: event.payload.propertyId,
      eventType: event.type,
      canRespond: this.shouldNinaRespond(event)
    };
    
    return notification;
  }

  /**
   * HELPER METHODS
   */

  /**
   * Generate human-readable notification for Linda
   */
  generateLindaNotification(event) {
    const messages = {
      'lease_signed': `Lease signed! Property now occupied. Mark as rented in agent conversations.`,
      'lease_terminated': `Lease ended. Property may become available for new tenants.`,
      'lease_expiring': `Lease expiring soon. Plan renewal or vacancy management.`,
      'property_sold': `Property sold! Remove from available listings.`,
      'maintenance_completed': `Maintenance completed. Property back to normal condition.`,
      'maintenance_required': `Maintenance required! Contact property manager.`,
      'property_handed_over': `Property handed over to owner. Update handover status.`
    };
    
    return messages[event.type] || `Status update: ${event.type}`;
  }

  /**
   * Determine if Nina should respond to this event
   */
  shouldNinaRespond(event) {
    const responsiveEvents = ['property_sold', 'lease_terminated', 'property_handed_over'];
    return responsiveEvents.includes(event.type);
  }

  /**
   * Get event history filtered by type
   */
  getEventHistory(eventType = null, limit = 100) {
    let history = this.eventHistory;
    
    if (eventType) {
      history = history.filter(e => e.type === eventType);
    }
    
    return history.slice(-limit).reverse();
  }

  /**
   * Get event statistics
   */
  getEventStatistics() {
    const stats = {
      totalEvents: this.eventHistory.length,
      eventsByType: {},
      eventsBySource: {},
      recentEvents: this.eventHistory.slice(-50),
      errors: []
    };

    this.eventHistory.forEach(event => {
      // Count by type
      stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
      
      // Count by source
      stats.eventsBySource[event.source] = (stats.eventsBySource[event.source] || 0) + 1;
      
      // Collect errors
      if (event.errors.length > 0) {
        stats.errors.push({
          eventId: event.id,
          type: event.type,
          errors: event.errors
        });
      }
    });

    return stats;
  }
}

export default PropertyStatusEventService;
