class MessageRouter {
  constructor() {
    this.routes = [];
    this.defaultHandler = null;
    this.autoReplies = new Map();
    this.blockedPatterns = [];
  }

  addRoute(pattern, handler, options = {}) {
    this.routes.push({
      pattern: typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern,
      handler,
      priority: options.priority || 0,
      type: options.type || 'text',
      description: options.description || ''
    });
    this.routes.sort((a, b) => b.priority - a.priority);
  }

  setDefaultHandler(handler) {
    this.defaultHandler = handler;
  }

  addAutoReply(trigger, response, options = {}) {
    this.autoReplies.set(trigger.toLowerCase(), {
      response,
      caseSensitive: options.caseSensitive || false,
      exactMatch: options.exactMatch || false
    });
  }

  addBlockedPattern(pattern) {
    this.blockedPatterns.push(
      typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern
    );
  }

  isBlocked(message) {
    return this.blockedPatterns.some(pattern => pattern.test(message));
  }

  async route(msg, context = {}) {
    const body = msg.body || '';
    const type = msg.type || 'chat';
    const from = msg.from || '';

    if (this.isBlocked(body)) {
      return { handled: false, reason: 'blocked' };
    }

    for (const [trigger, config] of this.autoReplies) {
      const messageText = config.caseSensitive ? body : body.toLowerCase();
      const triggerText = config.caseSensitive ? trigger : trigger.toLowerCase();
      
      if (config.exactMatch ? messageText === triggerText : messageText.includes(triggerText)) {
        try {
          await msg.reply(config.response);
          return { handled: true, type: 'auto_reply', trigger };
        } catch (error) {
          console.error('Auto-reply failed:', error.message);
        }
      }
    }

    for (const route of this.routes) {
      if (route.type !== 'any' && route.type !== type) {
        continue;
      }

      if (route.pattern.test(body)) {
        try {
          const result = await route.handler(msg, context);
          return { handled: true, type: 'route', pattern: route.pattern.toString(), result };
        } catch (error) {
          console.error(`Route handler error (${route.description}):`, error.message);
          return { handled: false, reason: 'handler_error', error: error.message };
        }
      }
    }

    if (this.defaultHandler) {
      try {
        const result = await this.defaultHandler(msg, context);
        return { handled: true, type: 'default', result };
      } catch (error) {
        console.error('Default handler error:', error.message);
        return { handled: false, reason: 'default_handler_error', error: error.message };
      }
    }

    return { handled: false, reason: 'no_match' };
  }

  setupDefaultRoutes() {
    this.addAutoReply('ping', 'pong', { exactMatch: true });
    
    this.addRoute(/^!help$/i, async (msg) => {
      await msg.reply('Available commands:\n!help - Show this message\n!status - Check bot status');
    }, { priority: 100, description: 'Help command' });

    this.addRoute(/^!status$/i, async (msg) => {
      await msg.reply('Bot is online and running.');
    }, { priority: 100, description: 'Status command' });

    this.addRoute(/^(السلام عليكم|مرحبا|اهلا)/i, async (msg) => {
      await msg.reply('وعليكم السلام ورحمة الله وبركاته');
    }, { priority: 50, description: 'Arabic greeting' });

    this.addRoute(/^(hello|hi|hey)\b/i, async (msg) => {
      await msg.reply('Hello! How can I help you today?');
    }, { priority: 50, description: 'English greeting' });
  }

  setupPropertyRoutes(propertyHandler) {
    this.addRoute(/property|house|villa|apartment|flat|unit/i, async (msg, context) => {
      return propertyHandler.handleInquiry(msg, context);
    }, { priority: 30, description: 'Property inquiry' });

    this.addRoute(/price|cost|rent|buy|sale/i, async (msg, context) => {
      return propertyHandler.handlePriceInquiry(msg, context);
    }, { priority: 25, description: 'Price inquiry' });

    this.addRoute(/view|visit|viewing|schedule|appointment/i, async (msg, context) => {
      return propertyHandler.handleViewingRequest(msg, context);
    }, { priority: 20, description: 'Viewing request' });
  }

  getRouteStats() {
    return {
      totalRoutes: this.routes.length,
      autoReplies: this.autoReplies.size,
      blockedPatterns: this.blockedPatterns.length,
      routes: this.routes.map(r => ({
        pattern: r.pattern.toString(),
        priority: r.priority,
        type: r.type,
        description: r.description
      }))
    };
  }

  clearRoutes() {
    this.routes = [];
    this.autoReplies.clear();
    this.blockedPatterns = [];
    this.defaultHandler = null;
  }
}

export default new MessageRouter();
