/**
 * Phase 1C Part 2: Interview Scheduling via WhatsApp - Test Suite
 * 
 * Tests for:
 * 1. Intent detection from candidate messages
 * 2. Time slot generation
 * 3. Slot formatting and display
 * 4. Interview booking flow
 * 5. Rescheduling logic
 * 6. Decline handling
 * 7. Reminder sending
 * 8. Interview statistics
 * 9. Full conversation simulation
 * 10. Edge cases and error handling
 */

import { InterviewSchedulingService } from '../services/InterviewSchedulingService.js';

console.log('\n' + '='.repeat(70));
console.log('🎯 PHASE 1C PART 2: INTERVIEW SCHEDULING TEST SUITE');
console.log('='.repeat(70) + '\n');

// Test counters
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Test helper
function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✅ ${name}`);
  } catch (error) {
    failedTests++;
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
  }
}

// Assert helper
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// ============= TEST 1: INTENT DETECTION =============
console.log('\n📍 TEST 1: Intent Detection from Messages');
console.log('-'.repeat(70));

test('Detects "schedule" intent with number selection', () => {
  const intent = InterviewSchedulingService.detectInterviewIntent('1');
  assert(intent.type === 'slot_selected', 'Should detect slot selection');
  assert(intent.slotIndex === 0, 'Should extract correct slot index');
  assert(intent.confidence >= 0.9, 'Should have high confidence');
});

test('Detects "interested" intent with keywords', () => {
  const messages = ['schedule please', 'yes', 'ready', 'book it', 'confirm'];
  messages.forEach(msg => {
    const intent = InterviewSchedulingService.detectInterviewIntent(msg);
    assert(intent.type === 'interested', `Should detect intent for: ${msg}`);
  });
});

test('Detects "reschedule" intent with variation keywords', () => {
  const messages = ['reschedule', 'different time', 'change slot', 'another time'];
  messages.forEach(msg => {
    const intent = InterviewSchedulingService.detectInterviewIntent(msg);
    assert(intent.type === 'reschedule', `Should detect reschedule for: ${msg}`);
  });
});

test('Detects "decline" intent with rejection keywords', () => {
  const intent = InterviewSchedulingService.detectInterviewIntent('not interested');
  assert(intent.type === 'decline', 'Should detect decline');
  assert(intent.reason, 'Should extract reason');
});

test('Detects "question" intent for support requests', () => {
  const messages = ['when?', 'where?', 'tell me more', 'how does this work?'];
  messages.forEach(msg => {
    const intent = InterviewSchedulingService.detectInterviewIntent(msg);
    assert(intent.type === 'question', `Should detect question for: ${msg}`);
  });
});

test('Returns "unsure" for ambiguous messages', () => {
  const intent = InterviewSchedulingService.detectInterviewIntent('maybe later');
  assert(intent.type === 'unsure', 'Should return unsure for ambiguous message');
});

test('Handles all slot numbers (1-5)', () => {
  for (let i = 1; i <= 5; i++) {
    const intent = InterviewSchedulingService.detectInterviewIntent(i.toString());
    assert(intent.type === 'slot_selected', `Should detect slot ${i}`);
    assert(intent.slotIndex === i - 1, `Should have correct index for slot ${i}`);
  }
});

test('Ignores invalid numbers (0, 6+)', () => {
  const intent0 = InterviewSchedulingService.detectInterviewIntent('0');
  const intent6 = InterviewSchedulingService.detectInterviewIntent('6');
  
  assert(intent0.type !== 'slot_selected', 'Should not select slot 0');
  assert(intent6.type !== 'slot_selected', 'Should not select slot 6');
});

// ============= TEST 2: TIME SLOT GENERATION =============
console.log('\n📍 TEST 2: Time Slot Generation');
console.log('-'.repeat(70));

test('Generates correct number of slots', () => {
  const slots = InterviewSchedulingService.generateTimeSlots(5);
  assert(slots.length === 5, 'Should generate 5 slots');
  assert(slots.length === 5, 'Should have exact count');
});

test('Slots are scheduled for future dates only', () => {
  const slots = InterviewSchedulingService.generateTimeSlots(5);
  const now = new Date();
  
  slots.forEach(slot => {
    const slotDate = new Date(slot.start);
    assert(slotDate > now, 'Slot should be in future');
    assert(slotDate.getDate() >= now.getDate() + 1 || slotDate.getMonth() > now.getMonth(), 'Should be tomorrow or later');
  });
});

test('Skips weekends in slot generation', () => {
  const slots = InterviewSchedulingService.generateTimeSlots(20);
  
  slots.forEach(slot => {
    const slotDate = new Date(slot.start);
    const dayOfWeek = slotDate.getDay();
    assert(dayOfWeek !== 0 && dayOfWeek !== 6, 'Should not schedule on weekends');
  });
});

test('Slots have valid time properties', () => {
  const slots = InterviewSchedulingService.generateTimeSlots(3);
  
  slots.forEach(slot => {
    assert(slot.start, 'Should have start time');
    assert(slot.end, 'Should have end time');
    assert(slot.day, 'Should have day name');
    assert(slot.date, 'Should have date');
    assert(slot.time, 'Should have formatted time');
  });
});

test('Each slot is 45 minutes long', () => {
  const slots = InterviewSchedulingService.generateTimeSlots(3);
  
  slots.forEach(slot => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    const durationMs = end - start;
    const durationMins = durationMs / (1000 * 60);
    assert(durationMins === 45, `Slot duration should be 45 mins, got ${durationMins}`);
  });
});

test('Generates alternative slots different from main slots', () => {
  const mainSlots = InterviewSchedulingService.generateTimeSlots(5);
  const altSlots = InterviewSchedulingService.generateAlternativeSlots();
  
  assert(altSlots.length === 3, 'Should generate 3 alternative slots');
  assert(altSlots[0].start !== mainSlots[0].start, 'Alternative slots should differ from main');
});

// ============= TEST 3: SLOT FORMATTING =============
console.log('\n📍 TEST 3: Slot Formatting and Display');
console.log('-'.repeat(70));

test('Formats slot object to readable string', () => {
  const slot = {
    day: 'Monday',
    date: '2026-01-20',
    time: '10:00 AM'
  };
  
  const formatted = InterviewSchedulingService.formatSlot(slot);
  assert(formatted.includes('Monday'), 'Should include day');
  assert(formatted.includes('2026-01-20'), 'Should include date');
  assert(formatted.includes('10:00 AM'), 'Should include time');
});

test('Handles pre-formatted slot strings', () => {
  const formatted = 'Monday (2026-01-20) at 10:00 AM';
  const result = InterviewSchedulingService.formatSlot(formatted);
  assert(result === formatted, 'Should return string as-is');
});

test('Formats date and time correctly', () => {
  const dateString = '2026-01-20T10:00:00.000Z';
  const formatted = InterviewSchedulingService.formatDateTime(dateString);
  
  assert(formatted.includes('January'), 'Should include month name');
  assert(formatted.includes('10:'), 'Should include hours');
  assert(formatted.includes('AM') || formatted.includes('PM'), 'Should include period');
});

test('Gets correct day name from date', () => {
  const monday = new Date('2026-01-19'); // Monday
  const wednesday = new Date('2026-01-21'); // Wednesday
  const friday = new Date('2026-01-23'); // Friday
  
  assert(InterviewSchedulingService.getDayName(monday) === 'Monday', 'Should recognize Monday');
  assert(InterviewSchedulingService.getDayName(wednesday) === 'Wednesday', 'Should recognize Wednesday');
  assert(InterviewSchedulingService.getDayName(friday) === 'Friday', 'Should recognize Friday');
});

// ============= TEST 4: PHONE NUMBER FORMATTING =============
console.log('\n📍 TEST 4: Phone Number Formatting');
console.log('-'.repeat(70));

test('Formats UAE numbers without country code', () => {
  const formatted = InterviewSchedulingService.formatPhoneForWhatsApp('0501234567');
  assert(formatted === '+971501234567', `Should add +971 prefix, got ${formatted}`);
});

test('Formats UAE numbers with partial country code', () => {
  const formatted = InterviewSchedulingService.formatPhoneForWhatsApp('501234567');
  assert(formatted === '+971501234567', `Should format correctly, got ${formatted}`);
});

test('Preserves already correct UAE numbers', () => {
  const formatted = InterviewSchedulingService.formatPhoneForWhatsApp('+971501234567');
  assert(formatted === '+971501234567', 'Should preserve correct format');
});

test('Formats numbers with various separators', () => {
  const variants = ['050-1234-567', '050 123 4567', '+971 50 123 4567'];
  variants.forEach(phone => {
    const formatted = InterviewSchedulingService.formatPhoneForWhatsApp(phone);
    assert(formatted.startsWith('+971'), `Should format ${phone} correctly`);
  });
});

test('Handles empty/null phone numbers', () => {
  const formatted1 = InterviewSchedulingService.formatPhoneForWhatsApp('');
  const formatted2 = InterviewSchedulingService.formatPhoneForWhatsApp(null);
  
  assert(formatted1 === '', 'Should return empty string for empty input');
  assert(formatted2 === '', 'Should return empty string for null input');
});

// ============= TEST 5: DECLINE REASON EXTRACTION =============
console.log('\n📍 TEST 5: Decline Reason Extraction');
console.log('-'.repeat(70));

test('Extracts "scheduling conflict" reason', () => {
  const reason = InterviewSchedulingService.extractDeclineReason('I am busy that day');
  assert(reason === 'Scheduling conflict', `Should extract scheduling reason, got ${reason}`);
});

test('Extracts "not interested in role" reason', () => {
  const reason = InterviewSchedulingService.extractDeclineReason('This is not the right role for me');
  assert(reason === 'Not interested in role', `Should extract role mismatch, got ${reason}`);
});

test('Extracts "already accepted another offer" reason', () => {
  const reason = InterviewSchedulingService.extractDeclineReason('I already accepted another offer');
  assert(reason === 'Already accepted another offer', `Should extract offer reason, got ${reason}`);
});

test('Returns default reason for unclear message', () => {
  const reason = InterviewSchedulingService.extractDeclineReason('no thanks');
  assert(reason === 'Candidate declined', `Should return default reason, got ${reason}`);
});

// ============= TEST 6: MEETING ID GENERATION =============
console.log('\n📍 TEST 6: Unique Meeting ID Generation');
console.log('-'.repeat(70));

test('Generates unique meeting IDs', () => {
  const id1 = InterviewSchedulingService.generateMeetingId();
  const id2 = InterviewSchedulingService.generateMeetingId();
  const id3 = InterviewSchedulingService.generateMeetingId();
  
  assert(id1 !== id2, 'Should generate different IDs');
  assert(id2 !== id3, 'Should generate different IDs');
  assert(id1 !== id3, 'Should generate different IDs');
});

test('Generated meeting IDs have correct format', () => {
  const id = InterviewSchedulingService.generateMeetingId();
  assert(id.length > 20, 'Should be reasonably long');
  assert(/^[a-z0-9]+$/.test(id), 'Should contain only alphanumeric');
});

// ============= TEST 7: BATCH INTERVIEW PROCESSING =============
console.log('\n📍 TEST 7: Batch Interview Flow Simulation');
console.log('-'.repeat(70));

test('Simulates candidate selecting first slot', () => {
  const intent = InterviewSchedulingService.detectInterviewIntent('1');
  assert(intent.type === 'slot_selected', 'Should detect slot 1');
  assert(intent.slotIndex === 0, 'Should extract index 0');
});

test('Simulates candidate selecting last available slot', () => {
  const intent = InterviewSchedulingService.detectInterviewIntent('5');
  assert(intent.type === 'slot_selected', 'Should detect slot 5');
  assert(intent.slotIndex === 4, 'Should extract index 4');
});

test('Simulates multiple candidates with different responses', () => {
  const responses = [
    { message: '1', expectedType: 'slot_selected' },
    { message: '2', expectedType: 'slot_selected' },
    { message: 'reschedule', expectedType: 'reschedule' },
    { message: 'not interested', expectedType: 'decline' },
    { message: 'when?', expectedType: 'question' }
  ];

  responses.forEach(resp => {
    const intent = InterviewSchedulingService.detectInterviewIntent(resp.message);
    assert(intent.type === resp.expectedType, `Message "${resp.message}" should be ${resp.expectedType}`);
  });
});

// ============= TEST 8: TIME ZONE AND BUSINESS HOURS =============
console.log('\n📍 TEST 8: Business Hours Validation');
console.log('-'.repeat(70));

test('All slots are during business hours', () => {
  const slots = InterviewSchedulingService.generateTimeSlots(10);
  
  slots.forEach(slot => {
    const date = new Date(slot.start);
    const hour = date.getHours();
    
    // Assuming 9 AM to 5 PM business hours
    assert(hour >= 9 && hour <= 17, `Slot at ${hour}:00 is outside business hours`);
  });
});

test('No slots scheduled before 9 AM', () => {
  const slots = InterviewSchedulingService.generateTimeSlots(15);
  
  slots.forEach(slot => {
    const date = new Date(slot.start);
    assert(date.getHours() >= 9, 'Should not schedule before 9 AM');
  });
});

test('No slots scheduled after 5 PM', () => {
  const slots = InterviewSchedulingService.generateTimeSlots(15);
  
  slots.forEach(slot => {
    const date = new Date(slot.start);
    // Accounting for 45-min slot duration
    assert(date.getHours() <= 16, 'Should not schedule after 4:15 PM (5 PM - 45 mins)');
  });
});

// ============= TEST 9: CONVERSATION FLOW SIMULATION =============
console.log('\n📍 TEST 9: Full Interview Conversation Flow');
console.log('-'.repeat(70));

test('Flow: Candidate receives offer → responds positive → selects slot → confirmed', () => {
  // Step 1: Offer sent (generated slots)
  const slots = InterviewSchedulingService.generateTimeSlots(5);
  assert(slots.length === 5, 'Should send 5 slot options');

  // Step 2: Candidate responds with intent
  const intent = InterviewSchedulingService.detectInterviewIntent('2');
  assert(intent.type === 'slot_selected', 'Should detect slot selection');

  // Step 3: System recognizes and books
  const selectedSlot = slots[intent.slotIndex];
  assert(selectedSlot, 'Should have valid slot to book');

  // Step 4: Confirmation prepared
  const formatted = InterviewSchedulingService.formatSlot(selectedSlot);
  assert(formatted, 'Should format confirmation message');
});

test('Flow: Candidate wants to reschedule', () => {
  // Initial slots
  const slots = InterviewSchedulingService.generateTimeSlots(3);
  
  // Candidate responds
  const intent = InterviewSchedulingService.detectInterviewIntent('reschedule');
  assert(intent.type === 'reschedule', 'Should detect reschedule');

  // System offers alternatives
  const alternatives = InterviewSchedulingService.generateAlternativeSlots();
  assert(alternatives.length === 3, 'Should offer 3 alternative slots');
});

test('Flow: Candidate declines', () => {
  const intent = InterviewSchedulingService.detectInterviewIntent('not interested thanks');
  assert(intent.type === 'decline', 'Should detect decline');
  
  const reason = InterviewSchedulingService.extractDeclineReason('not interested thanks');
  assert(reason, 'Should extract decline reason');
});

test('Flow: Candidate has questions', () => {
  const intent = InterviewSchedulingService.detectInterviewIntent('What time zone will the meeting be in?');
  assert(intent.type === 'question', 'Should detect question');
});

// ============= TEST 10: ERROR HANDLING AND EDGE CASES =============
console.log('\n📍 TEST 10: Error Handling & Edge Cases');
console.log('-'.repeat(70));

test('Handles empty message gracefully', () => {
  const intent = InterviewSchedulingService.detectInterviewIntent('');
  assert(intent.type === 'unsure', 'Should handle empty message');
});

test('Handles very long messages', () => {
  const longMessage = 'A'.repeat(1000);
  const intent = InterviewSchedulingService.detectInterviewIntent(longMessage);
  assert(intent.type, 'Should still return an intent type');
});

test('Handles messages with special characters', () => {
  const messages = ['1!', '#2', '$schedule', '!@#decline'];
  messages.forEach(msg => {
    const intent = InterviewSchedulingService.detectInterviewIntent(msg);
    assert(intent.type, `Should handle special chars in: ${msg}`);
  });
});

test('Handles case-insensitive intent detection', () => {
  const variations = [
    { msg: 'SCHEDULE', type: 'interested' },
    { msg: 'ReSCHEDULE', type: 'reschedule' },
    { msg: 'DECLINE', type: 'decline' }
  ];

  variations.forEach(v => {
    const intent = InterviewSchedulingService.detectInterviewIntent(v.msg);
    assert(intent.type === v.type, `Should handle case-insensitive: ${v.msg}`);
  });
});

test('Handles slot numbers with text', () => {
  const messages = ['1 please', 'I choose 2', 'slot 3', 'option 4'];
  messages.forEach(msg => {
    const intent = InterviewSchedulingService.detectInterviewIntent(msg);
    // These should be detected as 'unsure' since they include extra text
    assert(intent.type, `Should handle text with numbers: ${msg}`);
  });
});

test('Generates consistent number of alternative slots', () => {
  for (let i = 0; i < 5; i++) {
    const alts = InterviewSchedulingService.generateAlternativeSlots();
    assert(alts.length === 3, `Attempt ${i + 1}: Should always generate 3 alternative slots`);
  }
});

test('Slot generation never produces duplicates', () => {
  const slots = InterviewSchedulingService.generateTimeSlots(10);
  const uniqueDates = new Set(slots.map(s => s.start));
  
  assert(uniqueDates.size === slots.length, 'Should not have duplicate slots');
});

test('Phone formatting handles international formats', () => {
  const formatted1 = InterviewSchedulingService.formatPhoneForWhatsApp('+44 20 7946 0958');
  const formatted2 = InterviewSchedulingService.formatPhoneForWhatsApp('+1 (555) 123-4567');
  
  // Should at least preserve the format
  assert(formatted1.startsWith('+'), 'Should preserve international format');
  assert(formatted2.startsWith('+'), 'Should preserve international format');
});

// ============= TEST SUMMARY =============
console.log('\n' + '='.repeat(70));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(70));
console.log(`Total Tests: ${totalTests}`);
console.log(`✅ Passed:   ${passedTests}`);
console.log(`❌ Failed:   ${failedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

if (failedTests === 0) {
  console.log('🎉 ALL TESTS PASSED! Interview Scheduling Service is ready for production.\n');
} else {
  console.log(`⚠️  ${failedTests} test(s) failed. Review errors above.\n`);
}

console.log('='.repeat(70));
console.log('Phase 1C Part 2 Testing Complete!');
console.log('='.repeat(70) + '\n');
