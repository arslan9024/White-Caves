/**
 * Message Sending Utility - Priority 4
 * Handles message sending with retry logic
 */
export class MessageSendingUtility {
  static async sendMessage(messageData, service, options = {}) {
    const { retries = 3, delayMs = 1000, logPrefix = '📨' } = options;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`${logPrefix} Sending (attempt ${attempt}/${retries})`);
        const result = await service.save();
        console.log('✅ Message sent');
        return { success: true, attempts: attempt, messageId: result._id || result.id };
      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed: ${error.message}`);
        if (attempt < retries) {
          const waitTime = delayMs * attempt;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          throw new Error(`Failed after ${retries} attempts: ${error.message}`);
        }
      }
    }
  }

  static buildMetadata(type, context) {
    return { messageType: type, timestamp: new Date(), context, version: '1.0' };
  }
}
export default MessageSendingUtility;
