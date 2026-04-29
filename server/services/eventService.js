// EventService - Central event bus for system-wide events
class EventService {
  constructor() {
    this.subscribers = new Map(); // eventType -> [callbacks]
  }

  /**
   * Subscribe to an event
   * @param {string} eventType - Event type (e.g., 'PROPERTY_CREATED', 'LEAD_QUALIFIED')
   * @param {function} callback - Callback function (receives eventData)
   * @returns {function} Unsubscribe function
   */
  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }

    this.subscribers.get(eventType).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Publish an event
   * @param {string} eventType - Event type
   * @param {object} eventData - Event data payload
   * @param {object} metadata - Optional metadata (userId, source, etc.)
   */
  async publish(eventType, eventData, metadata = {}) {
    const event = {
      eventType,
      eventId: `${eventType}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
      data: eventData,
      metadata
    };

    console.log(`[EventService] Publishing event: ${eventType}`, event);

    const callbacks = this.subscribers.get(eventType) || [];

    // Execute all callbacks
    const promises = callbacks.map((callback) => {
      try {
        return Promise.resolve(callback(event));
      } catch (err) {
        console.error(`[EventService] Error in callback for ${eventType}:`, err);
        return Promise.reject(err);
      }
    });

    try {
      await Promise.all(promises);
    } catch (err) {
      console.error(`[EventService] Error publishing event ${eventType}:`, err);
    }

    return event;
  }

  /**
   * List all subscribed events
   */
  getSubscribedEvents() {
    return Array.from(this.subscribers.keys());
  }

  /**
   * Get subscriber count for an event
   */
  getSubscriberCount(eventType) {
    return (this.subscribers.get(eventType) || []).length;
  }

  /**
   * Clear all subscribers (useful for testing)
   */
  clearSubscribers() {
    this.subscribers.clear();
  }
}

// Singleton instance
const eventService = new EventService();

export default eventService;
