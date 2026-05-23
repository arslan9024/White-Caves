/**
 * WhatsApp Conversation Tracker
 * 
 * Manages conversation history, message tracking, and metadata
 * for multi-account WhatsApp Web integration.
 * 
 * Features:
 * - Conversation management (group/individual)
 * - Message history storage
 * - Conversation metadata & stats
 * - Search & filtering capabilities
 */

const crypto = require('crypto');

class ConversationTracker {
  constructor(database) {
    this.db = database;
    this.conversationCache = new Map();
    this.maxCacheSize = 1000;
  }

  /**
   * Initialize conversation tracker with collections
   */
  async initialize() {
    console.log('[ConversationTracker] Initializing...');
    
    try {
      // Ensure database collections exist (Mongoose will handle this)
      // Collections will be auto-created on first use
      console.log('[ConversationTracker] ✅ Initialization complete');
    } catch (error) {
      console.error('[ConversationTracker] ❌ Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get or create conversation
   */
  async getOrCreateConversation(accountId, recipientPhone, isGroup = false) {
    const conversationId = this.generateConversationId(accountId, recipientPhone);
    
    // Check cache first
    if (this.conversationCache.has(conversationId)) {
      return this.conversationCache.get(conversationId);
    }

    try {
      // Query database
      let conversation = await this.db.collection('conversations').findOne({
        conversationId,
        accountId,
      });

      if (!conversation) {
        // Create new conversation
        conversation = {
          conversationId,
          accountId,
          recipientPhone,
          recipientName: null,
          isGroup,
          groupName: isGroup ? null : undefined,
          groupMembers: isGroup ? [] : undefined,
          messageCount: 0,
          unreadCount: 0,
          lastMessage: null,
          lastMessageTime: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            isArchived: false,
            isPinned: false,
            isMuted: false,
            customLabel: null,
          },
        };

        await this.db.collection('conversations').insertOne(conversation);
        console.log(`[ConversationTracker] Created conversation: ${conversationId}`);
      }

      // Cache it
      this.cacheConversation(conversationId, conversation);

      return conversation;
    } catch (error) {
      console.error('[ConversationTracker] Get/create conversation failed:', error);
      throw error;
    }
  }

  /**
   * Add message to conversation
   */
  async addMessage(accountId, conversationId, messageData) {
    try {
      const message = {
        messageId: crypto.randomUUID(),
        conversationId,
        accountId,
        from: messageData.from,
        to: messageData.to,
        body: messageData.body,
        timestamp: messageData.timestamp || new Date(),
        type: messageData.type || 'text',
        direction: messageData.direction || 'incoming', // incoming | outgoing
        status: messageData.status || 'delivered', // sent | delivered | read
        mediaUrl: messageData.mediaUrl,
        mediaType: messageData.mediaType, // image | video | document | audio
        reactions: [],
        quotedMessageId: messageData.quotedMessageId,
        isEdited: false,
        editedAt: null,
        metadata: {
          isRead: messageData.direction === 'outgoing',
          readAt: messageData.direction === 'outgoing' ? new Date() : null,
          isStarred: false,
          isForwarded: false,
        },
      };

      // Save message
      await this.db.collection('messages').insertOne(message);

      // Update conversation stats
      await this.db.collection('conversations').updateOne(
        { conversationId, accountId },
        {
          $set: {
            lastMessage: message.body,
            lastMessageTime: message.timestamp,
            updatedAt: new Date(),
          },
          $inc: {
            messageCount: 1,
            unreadCount: messageData.direction === 'incoming' ? 1 : 0,
          },
        }
      );

      // Invalidate cache
      this.conversationCache.delete(conversationId);

      return message;
    } catch (error) {
      console.error('[ConversationTracker] Add message failed:', error);
      throw error;
    }
  }

  /**
   * Get conversation messages
   */
  async getMessages(conversationId, options = {}) {
    try {
      const {
        limit = 50,
        skip = 0,
        before = null,
        after = null,
      } = options;

      const query = { conversationId };

      if (before) {
        query.timestamp = { $lt: before };
      } else if (after) {
        query.timestamp = { $gt: after };
      }

      const messages = await this.db.collection('messages')
        .find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('[ConversationTracker] Get messages failed:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId, accountId) {
    try {
      const result = await this.db.collection('messages').updateMany(
        {
          conversationId,
          accountId,
          direction: 'incoming',
          'metadata.isRead': false,
        },
        {
          $set: {
            'metadata.isRead': true,
            'metadata.readAt': new Date(),
          },
        }
      );

      // Update conversation unread count
      await this.db.collection('conversations').updateOne(
        { conversationId, accountId },
        { $set: { unreadCount: 0 } }
      );

      return result.modifiedCount;
    } catch (error) {
      console.error('[ConversationTracker] Mark as read failed:', error);
      throw error;
    }
  }

  /**
   * Search conversations
   */
  async searchConversations(accountId, searchTerm, options = {}) {
    try {
      const {
        limit = 20,
        skip = 0,
        includeArchived = false,
      } = options;

      const query = {
        accountId,
        'metadata.isArchived': includeArchived ? { $in: [true, false] } : false,
      };

      // Text search on recipient name and phone
      if (searchTerm) {
        query.$or = [
          { recipientPhone: { $regex: searchTerm, $options: 'i' } },
          { recipientName: { $regex: searchTerm, $options: 'i' } },
          { groupName: { $regex: searchTerm, $options: 'i' } },
        ];
      }

      const results = await this.db.collection('conversations')
        .find(query)
        .sort({ lastMessageTime: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      return results;
    } catch (error) {
      console.error('[ConversationTracker] Search conversations failed:', error);
      throw error;
    }
  }

  /**
   * Search messages
   */
  async searchMessages(accountId, searchTerm, options = {}) {
    try {
      const {
        limit = 50,
        skip = 0,
        conversationId = null,
      } = options;

      const query = {
        accountId,
        body: { $regex: searchTerm, $options: 'i' },
      };

      if (conversationId) {
        query.conversationId = conversationId;
      }

      const messages = await this.db.collection('messages')
        .find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      return messages;
    } catch (error) {
      console.error('[ConversationTracker] Search messages failed:', error);
      throw error;
    }
  }

  /**
   * Get conversation stats
   */
  async getConversationStats(conversationId, accountId) {
    try {
      const stats = await this.db.collection('messages').aggregate([
        {
          $match: {
            conversationId,
            accountId,
          },
        },
        {
          $group: {
            _id: '$conversationId',
            totalMessages: { $sum: 1 },
            incomingMessages: {
              $sum: { $cond: [{ $eq: ['$direction', 'incoming'] }, 1, 0] },
            },
            outgoingMessages: {
              $sum: { $cond: [{ $eq: ['$direction', 'outgoing'] }, 1, 0] },
            },
            firstMessage: { $min: '$timestamp' },
            lastMessage: { $max: '$timestamp' },
            uniqueSenders: { $addToSet: '$from' },
          },
        },
      ]).toArray();

      if (stats.length === 0) {
        return null;
      }

      return {
        ...stats[0],
        uniqueSenderCount: stats[0].uniqueSenders.length,
        averageMessageLength: await this.calculateAverageMessageLength(conversationId, accountId),
      };
    } catch (error) {
      console.error('[ConversationTracker] Get conversation stats failed:', error);
      throw error;
    }
  }

  /**
   * Archive/Unarchive conversation
   */
  async toggleArchive(conversationId, accountId, isArchived) {
    try {
      await this.db.collection('conversations').updateOne(
        { conversationId, accountId },
        { $set: { 'metadata.isArchived': isArchived, updatedAt: new Date() } }
      );

      this.conversationCache.delete(conversationId);
      return { conversationId, isArchived };
    } catch (error) {
      console.error('[ConversationTracker] Archive conversation failed:', error);
      throw error;
    }
  }

  /**
   * List all conversations for account
   */
  async listConversations(accountId, options = {}) {
    try {
      const {
        limit = 50,
        skip = 0,
        sortBy = 'lastMessageTime',
        includeArchived = false,
      } = options;

      const query = {
        accountId,
        'metadata.isArchived': includeArchived ? { $in: [true, false] } : false,
      };

      const conversations = await this.db.collection('conversations')
        .find(query)
        .sort({ [sortBy]: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      return conversations;
    } catch (error) {
      console.error('[ConversationTracker] List conversations failed:', error);
      throw error;
    }
  }

  /**
   * Get unread count for account
   */
  async getUnreadCount(accountId) {
    try {
      const result = await this.db.collection('conversations').aggregate([
        {
          $match: {
            accountId,
            'metadata.isArchived': false,
          },
        },
        {
          $group: {
            _id: null,
            totalUnread: { $sum: '$unreadCount' },
            conversationCount: { $sum: 1 },
          },
        },
      ]).toArray();

      if (result.length === 0) {
        return { totalUnread: 0, conversationCount: 0 };
      }

      return result[0];
    } catch (error) {
      console.error('[ConversationTracker] Get unread count failed:', error);
      throw error;
    }
  }

  /**
   * Helper: Generate unique conversation ID
   */
  generateConversationId(accountId, recipientPhone) {
    return crypto
      .createHash('sha256')
      .update(`${accountId}:${recipientPhone}`)
      .digest('hex')
      .substring(0, 32);
  }

  /**
   * Helper: Cache conversation
   */
  cacheConversation(conversationId, conversation) {
    // Simple LRU cache
    if (this.conversationCache.size >= this.maxCacheSize) {
      const firstKey = this.conversationCache.keys().next().value;
      this.conversationCache.delete(firstKey);
    }
    this.conversationCache.set(conversationId, conversation);
  }

  /**
   * Helper: Calculate average message length
   */
  async calculateAverageMessageLength(conversationId, accountId) {
    try {
      const result = await this.db.collection('messages').aggregate([
        {
          $match: {
            conversationId,
            accountId,
          },
        },
        {
          $group: {
            _id: null,
            avgLength: { $avg: { $strLenCP: '$body' } },
          },
        },
      ]).toArray();

      return result[0]?.avgLength || 0;
    } catch (error) {
      return 0;
    }
  }
}

module.exports = ConversationTracker;
