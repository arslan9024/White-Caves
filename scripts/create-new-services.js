#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const services = {
  'server/services/IntentDetectionService.js': `/**
 * Intent Detection Service - Priority 4
 * Extracts intent from candidate messages
 */
export class IntentDetectionService {
  static INTENT_TYPES = {
    SLOT_SELECTED: 'slot_selected',
    INTERESTED: 'interested',
    RESCHEDULE: 'reschedule',
    DECLINE: 'decline',
    QUESTION: 'question',
    UNSURE: 'unsure'
  };

  static SLOT_KEYWORDS = /^([1-5])$/;
  static INTERESTED_KEYWORDS = /(^(schedule|book|confirm|yes|ready))/i;
  static RESCHEDULE_KEYWORDS = /(reschedule|different time|other time|can't make it|change|another slot)/i;
  static DECLINE_KEYWORDS = /(decline|not interested|no thanks|not right now|cancel)/i;
  static QUESTION_KEYWORDS = /(question|when|how|where|what|tell me more|more info|unclear|don't understand)/i;

  static detectIntent(message) {
    const lowerMessage = message.toLowerCase().trim();
    const slotMatch = lowerMessage.match(this.SLOT_KEYWORDS);
    if (slotMatch) {
      return {
        type: this.INTENT_TYPES.SLOT_SELECTED,
        slotIndex: parseInt(slotMatch[1]) - 1,
        confidence: 0.95
      };
    }
    if (this.INTERESTED_KEYWORDS.test(lowerMessage)) {
      return { type: this.INTENT_TYPES.INTERESTED, confidence: 0.9 };
    }
    if (this.RESCHEDULE_KEYWORDS.test(message)) {
      return { type: this.INTENT_TYPES.RESCHEDULE, confidence: 0.85 };
    }
    if (this.DECLINE_KEYWORDS.test(message)) {
      return {
        type: this.INTENT_TYPES.DECLINE,
        reason: this.extractDeclineReason(message),
        confidence: 0.9
      };
    }
    if (this.QUESTION_KEYWORDS.test(message)) {
      return { type: this.INTENT_TYPES.QUESTION, confidence: 0.7 };
    }
    return { type: this.INTENT_TYPES.UNSURE, confidence: 0.5 };
  }

  static extractDeclineReason(message) {
    if (/busy|don't have time|schedule|can't/i.test(message)) return 'Scheduling conflict';
    if (/interested|right role|looking for/i.test(message)) return 'Not interested in role';
    if (/already found|other job|accepted/i.test(message)) return 'Already accepted another offer';
    return 'Candidate declined';
  }
}
export default IntentDetectionService;
`,
  'server/utils/PhoneFormattingService.js': `/**
 * Phone Number Formatting Service - Priority 4
 * Standardizes phone numbers to E.164 format
 */
export class PhoneFormattingService {
  static formatForWhatsApp(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\\D/g, '');
    if (cleaned.startsWith('971')) return \`+\${cleaned}\`;
    if (cleaned.startsWith('50') || cleaned.startsWith('52') || cleaned.startsWith('55')) {
      return \`+971\${cleaned}\`;
    }
    if (cleaned.length === 9) return \`+971\${cleaned}\`;
    return \`+\${cleaned}\`;
  }

  static formatForDisplay(phone) {
    const cleaned = phone.replace(/\\D/g, '');
    if (cleaned.length === 12) {
      return \`+\${cleaned.slice(0, 3)} \${cleaned.slice(3, 5)} \${cleaned.slice(5, 8)} \${cleaned.slice(8)}\`;
    }
    return phone;
  }

  static getCountryCode(phone) {
    const cleaned = phone.replace(/\\D/g, '');
    if (cleaned.startsWith('971')) return '971';
    if (cleaned.startsWith('1')) return '1';
    if (cleaned.startsWith('44')) return '44';
    return null;
  }

  static isValid(phone) {
    const cleaned = phone.replace(/\\D/g, '');
    return cleaned.length >= 9 && cleaned.length <= 15;
  }
}
export default PhoneFormattingService;
`,
  'server/utils/MessageSendingUtility.js': `/**
 * Message Sending Utility - Priority 4
 * Handles message sending with retry logic
 */
export class MessageSendingUtility {
  static async sendMessage(messageData, service, options = {}) {
    const { retries = 3, delayMs = 1000, logPrefix = '📨' } = options;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(\`\${logPrefix} Sending (attempt \${attempt}/\${retries})\`);
        const result = await service.save();
        console.log('✅ Message sent');
        return { success: true, attempts: attempt, messageId: result._id || result.id };
      } catch (error) {
        console.error(\`❌ Attempt \${attempt} failed: \${error.message}\`);
        if (attempt < retries) {
          const waitTime = delayMs * attempt;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          throw new Error(\`Failed after \${retries} attempts: \${error.message}\`);
        }
      }
    }
  }

  static buildMetadata(type, context) {
    return { messageType: type, timestamp: new Date(), context, version: '1.0' };
  }
}
export default MessageSendingUtility;
`
};

console.log('\n' + '='.repeat(60));
console.log('🚀 PRIORITY 4: Creating New Service Files');
console.log('='.repeat(60) + '\n');

let created = 0;
const errors = [];

Object.entries(services).forEach(([filePath, content]) => {
  const fullPath = path.join(projectRoot, filePath);
  const dir = path.dirname(fullPath);
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(fullPath)) {
      console.log(`⏭️  ${filePath} (exists)`);
      return;
    }
    fs.writeFileSync(fullPath, content, 'utf-8');
    created++;
    console.log(`✅ Created: ${filePath}`);
  } catch (error) {
    errors.push({ file: filePath, error: error.message });
    console.log(`❌ Failed: ${filePath}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Created: ${created}/${Object.keys(services).length}`);
console.log('='.repeat(60) + '\n');
process.exit(errors.length > 0 ? 1 : 0);
