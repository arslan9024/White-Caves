/**
 * Notification Controller
 * Handles notification creation and management
 */

const { notifications } = require('../data/mockData');

/**
 * Send notification to assistant
 * @param {string} assistantId - Assistant ID
 * @param {string} message - Notification message
 * @param {string} type - Notification type (info, warning, error, success)
 */
async function sendNotification(assistantId, message, type = 'info') {
  try {
    console.debug(`[Controller] Sending notification to ${assistantId}:`, message);

    if (!assistantId || !message) {
      return {
        success: false,
        error: 'Assistant ID and message are required',
      };
    }

    // Validate type
    const validTypes = ['info', 'warning', 'error', 'success'];
    if (!validTypes.includes(type)) {
      return {
        success: false,
        error: `Invalid notification type. Valid types: ${validTypes.join(', ')}`,
      };
    }

    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assistantId,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // If using database, replace with:
    // const saved = await Notification.create(notification);
    // return { success: true, data: saved };

    notifications.push(notification);

    // Emit to WebSocket/real-time service if available
    try {
      await emitNotificationEvent(notification);
    } catch (e) {
      console.warn('[Controller] Could not emit notification event:', e.message);
    }

    return {
      success: true,
      data: notification,
    };
  } catch (error) {
    console.error('[Controller] Error sending notification:', error);
    return {
      success: false,
      error: `Failed to send notification: ${error.message}`,
    };
  }
}

/**
 * Get notifications for assistant
 * @param {string} assistantId - Assistant ID
 * @param {boolean} unreadOnly - Only unread notifications
 */
async function getNotifications(assistantId, unreadOnly = false) {
  try {
    console.debug(`[Controller] Getting notifications for ${assistantId}`);

    if (!assistantId) {
      throw new Error('Assistant ID is required');
    }

    // If using database, replace with:
    // const query = { assistantId };
    // if (unreadOnly) query.read = false;
    // return await Notification.find(query).sort({ timestamp: -1 });

    let filtered = notifications.filter(n => n.assistantId === assistantId);

    if (unreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return filtered;
  } catch (error) {
    console.error('[Controller] Error getting notifications:', error);
    throw new Error(`Failed to retrieve notifications: ${error.message}`);
  }
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 */
async function markAsRead(notificationId) {
  try {
    console.debug(`[Controller] Marking notification as read: ${notificationId}`);

    if (!notificationId) {
      throw new Error('Notification ID is required');
    }

    // If using database, replace with:
    // return await Notification.findByIdAndUpdate(
    //   notificationId,
    //   { read: true },
    //   { new: true }
    // );

    const notification = notifications.find(n => n.id === notificationId);

    if (!notification) {
      return null;
    }

    notification.read = true;
    notification.readAt = new Date().toISOString();

    return notification;
  } catch (error) {
    console.error('[Controller] Error marking notification as read:', error);
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
}

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 */
async function deleteNotification(notificationId) {
  try {
    console.debug(`[Controller] Deleting notification: ${notificationId}`);

    if (!notificationId) {
      throw new Error('Notification ID is required');
    }

    // If using database, replace with:
    // return await Notification.findByIdAndDelete(notificationId);

    const index = notifications.findIndex(n => n.id === notificationId);

    if (index === -1) {
      return null;
    }

    const [deleted] = notifications.splice(index, 1);

    return deleted;
  } catch (error) {
    console.error('[Controller] Error deleting notification:', error);
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
}

/**
 * Get notification count for assistant
 * @param {string} assistantId - Assistant ID
 */
async function getNotificationCount(assistantId) {
  try {
    const unread = await getNotifications(assistantId, true);
    return unread.length;
  } catch (error) {
    console.error('[Controller] Error getting notification count:', error);
    return 0;
  }
}

/**
 * Emit notification event (for real-time updates)
 * @param {Object} notification - Notification object
 */
async function emitNotificationEvent(notification) {
  try {
    // If using Socket.io or similar, emit here:
    // io.to(`assistant_${notification.assistantId}`).emit('notification', notification);

    console.debug('[Controller] Notification event would be emitted:', notification.id);
  } catch (error) {
    console.error('[Controller] Error emitting notification event:', error);
  }
}

module.exports = {
  sendNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
  getNotificationCount,
  emitNotificationEvent,
};
