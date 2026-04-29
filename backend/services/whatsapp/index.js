/**
 * WhatsApp Integration Factory
 * 
 * Initializes and manages WhatsApp Web integration components
 */

const WhatsAppWebIntegration = require('./WhatsAppWebIntegration');
const ConversationTracker = require('./ConversationTracker');
const CounterManager = require('./CounterManager');
const SessionStore = require('./SessionStore');

class WhatsAppIntegrationFactory {
  constructor(database, config = {}) {
    this.database = database;
    this.config = {
      sessionStoreType: config.sessionStoreType || 'memory',
      ...config,
    };

    this.components = {
      whatsappWeb: null,
      conversationTracker: null,
      counterManager: null,
      sessionStore: null,
    };
  }

  /**
   * Initialize all WhatsApp components
   */
  async initialize() {
    console.log('[WhatsAppFactory] Initializing WhatsApp Integration...');

    try {
      // Initialize session store
      this.components.sessionStore = new SessionStore(
        this.config.sessionStoreType,
        this.database
      );

      // Initialize WhatsApp Web integration
      this.components.whatsappWeb = new WhatsAppWebIntegration(this.config);
      await this.components.whatsappWeb.initialize(this.components.sessionStore);

      // Initialize conversation tracker
      this.components.conversationTracker = new ConversationTracker(this.database);
      await this.components.conversationTracker.initialize();

      // Initialize counter manager
      this.components.counterManager = new CounterManager(this.database);
      await this.components.counterManager.initialize();

      // Set up event listeners
      this.setupEventListeners();

      console.log('[WhatsAppFactory] ✅ All components initialized');
      return this.components;
    } catch (error) {
      console.error('[WhatsAppFactory] ❌ Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Set up event listeners between components
   */
  setupEventListeners() {
    const { whatsappWeb, conversationTracker, counterManager } = this.components;

    // When message is received from WhatsApp
    whatsappWeb.on('message_received', async (message) => {
      try {
        // Track in conversation
        await conversationTracker.addMessage(
          message.accountId,
          message.conversationId,
          message
        );

        // Update counters
        await counterManager.incrementCounter(message.accountId, message);
      } catch (error) {
        console.error('[WhatsAppFactory] Message handling error:', error);
      }
    });

    // When message is sent via WhatsApp
    whatsappWeb.on('message_sent', async (message) => {
      try {
        // Track in conversation
        await conversationTracker.addMessage(
          message.accountId,
          message.conversationId,
          message
        );

        // Update counters
        await counterManager.incrementCounter(message.accountId, message);
      } catch (error) {
        console.error('[WhatsAppFactory] Message handling error:', error);
      }
    });

    // When device is linked
    whatsappWeb.on('device_linked', async (data) => {
      console.log('[WhatsAppFactory] Device linked event:', data.accountId);
    });

    // When account connects
    whatsappWeb.on('account_connected', async (data) => {
      console.log('[WhatsAppFactory] Account connected event:', data.accountId);
    });

    // When account disconnects
    whatsappWeb.on('account_disconnected', async (data) => {
      console.log('[WhatsAppFactory] Account disconnected event:', data.accountId);
    });
  }

  /**
   * Get component
   */
  getComponent(componentName) {
    if (!this.components[componentName]) {
      throw new Error(`Component not found: ${componentName}`);
    }
    return this.components[componentName];
  }

  /**
   * Get all components
   */
  getComponents() {
    return this.components;
  }

  /**
   * Shutdown all components
   */
  async shutdown() {
    console.log('[WhatsAppFactory] Shutting down...');

    try {
      // Close any open connections
      const accounts = this.components.whatsappWeb.listAccounts();
      for (const account of accounts) {
        await this.components.whatsappWeb.disconnect(account.accountId);
      }

      console.log('[WhatsAppFactory] ✅ Shutdown complete');
    } catch (error) {
      console.error('[WhatsAppFactory] ❌ Shutdown failed:', error);
      throw error;
    }
  }
}

module.exports = WhatsAppIntegrationFactory;
