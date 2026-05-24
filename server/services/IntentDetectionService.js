/**
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
