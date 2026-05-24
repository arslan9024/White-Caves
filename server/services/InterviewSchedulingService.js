import { PrismaClient } from '@prisma/client';
import MessageTemplateService from './MessageTemplateService.js';
import { WhatsAppMessage, WhatsAppContact } from '../lib/database.js';

const prisma = new PrismaClient();

/**
 * Interview Scheduling Service - Phase 1C Part 2
 * 
 * Enables candidates to schedule interviews via WhatsApp by:
 * 1. Offering available time slots
 * 2. Detecting "schedule" intent in candidate messages
 * 3. Auto-booking selected slots
 * 4. Sending confirmations and reminders
 * 5. Tracking interview lifecycle
 */

export class InterviewSchedulingService {
  /**
   * Create interview session with available slots
   */
  static async createInterviewSession(candidateId, jobId, interviewerIds, slotOptions) {
    try {
      // Find candidate and job
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId }
      });

      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { company: true }
      });

      if (!candidate || !job) {
        throw new Error('Candidate or Job not found');
      }

      // Create interview session
      const session = await prisma.interviewSession.create({
        data: {
          candidateId,
          jobId,
          status: 'pending_scheduling',
          interviewers: interviewerIds,
          availableSlots: slotOptions,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Send WhatsApp with available slots
      await this.sendInterviewInvitation(candidate, job, session, slotOptions);

      return {
        success: true,
        sessionId: session.id,
        message: 'Interview invitation sent via WhatsApp'
      };
    } catch (error) {
      console.error('❌ Error creating interview session:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send interview invitation with time slots
   */
  static async sendInterviewInvitation(candidate, job, session, slots) {
    try {
      // Format slots for display
      const slotsText = slots
        .map((slot, i) => `${i + 1}. ${this.formatSlot(slot)}`)
        .join('\n');

      const variables = {
        candidate_name: candidate.first_name || candidate.name,
        job_title: job.title,
        interview_type: 'Technical Assessment',
        interview_duration: '45',
        available_times: slotsText,
        meeting_link: `https://zoom.us/j/${this.generateMeetingId()}`,
        next_action: 'Reply with number (1-3) to book your slot'
      };

      // Render message using template
      const message = MessageTemplateService.render('interview_invitation', variables);

      // Get or create WhatsApp contact
      const phone = this.formatPhoneForWhatsApp(candidate.whatsapp_phone || candidate.phone_number);
      
      let contact = await WhatsAppContact.findOne({ phoneNumber: phone });
      if (!contact) {
        contact = new WhatsAppContact({
          phoneNumber: phone,
          waId: `${phone.replace('+', '')}@c.us`,
          name: candidate.first_name || candidate.name,
          conversationStatus: 'active'
        });
        await contact.save();
      }

      // Store message in database
      const messageRecord = new WhatsAppMessage({
        waId: contact.waId,
        phoneNumber: phone,
        direction: 'outgoing',
        messageType: 'interview_invitation',
        content: message,
        status: 'pending',
        metadata: {
          sessionId: session.id,
          candidateId: candidate.id,
          jobId: job.id,
          slots: slots
        },
        createdAt: new Date()
      });

      await messageRecord.save();

      console.log(`✅ Interview invitation sent to ${phone}`);
      return {
        success: true,
        messageId: messageRecord._id,
        phone
      };
    } catch (error) {
      console.error('❌ Error sending interview invitation:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process candidate response to interview invitation
   * Detects intent (schedule, interested, reschedule, decline)
   */
  static async processInterviewResponse(waId, phoneNumber, messageContent, sessionId) {
    try {
      // Detect intent from message
      const intent = this.detectInterviewIntent(messageContent);

      // Get session
      const session = await prisma.interviewSession.findUnique({
        where: { id: sessionId },
        include: {
          candidate: true,
          job: true
        }
      });

      if (!session) {
        throw new Error('Interview session not found');
      }

      let result;

      switch (intent.type) {
        case 'slot_selected':
          result = await this.bookSelectedSlot(session, intent.slotIndex, phoneNumber);
          break;

        case 'reschedule':
          result = await this.offerRescheduleSlots(session, phoneNumber);
          break;

        case 'decline':
          result = await this.declineInterview(session, phoneNumber, intent.reason);
          break;

        case 'interested':
          result = await this.sendTimeSlotOptions(session, phoneNumber);
          break;

        case 'unsure':
        case 'question':
          result = await this.sendSupportMessage(session, phoneNumber, messageContent);
          break;

        default:
          result = await this.sendGuideMessage(session, phoneNumber);
      }

      return result;
    } catch (error) {
      console.error('❌ Error processing interview response:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Detect interview-related intent from candidate message
   */
  static detectInterviewIntent(message) {
    const lowerMessage = message.toLowerCase().trim();

    // Check for slot selection (numbers 1-5)
    const slotMatch = lowerMessage.match(/^([1-5])$/);
    if (slotMatch) {
      return {
        type: 'slot_selected',
        slotIndex: parseInt(slotMatch[1]) - 1,
        confidence: 0.95
      };
    }

    // Check for "schedule" keywords
    if (/^(schedule|book|confirm|yes|ready)/.test(lowerMessage)) {
      return {
        type: 'interested',
        confidence: 0.9
      };
    }

    // Check for "reschedule" keywords
    if (/(reschedule|different time|other time|can't make it|change|another slot)/i.test(message)) {
      return {
        type: 'reschedule',
        confidence: 0.85
      };
    }

    // Check for decline keywords
    if (/(decline|not interested|no thanks|not right now|cancel)/i.test(message)) {
      return {
        type: 'decline',
        reason: this.extractDeclineReason(message),
        confidence: 0.9
      };
    }

    // Check for question/unsure
    if (/(question|when|how|where|what|where|tell me more|more info|unclear|don't understand)/i.test(message)) {
      return {
        type: 'question',
        confidence: 0.7
      };
    }

    // Default: unsure
    return {
      type: 'unsure',
      confidence: 0.5
    };
  }

  /**
   * Book selected time slot for interview
   */
  static async bookSelectedSlot(session, slotIndex, phoneNumber) {
    try {
      const slot = session.availableSlots[slotIndex];

      if (!slot) {
        return {
          success: false,
          error: 'Invalid slot selection'
        };
      }

      // Update session
      const updatedSession = await prisma.interviewSession.update({
        where: { id: session.id },
        data: {
          status: 'scheduled',
          selectedSlot: slot,
          scheduledAt: new Date(slot.start),
          updatedAt: new Date()
        }
      });

      // Create interview record
      const interview = await prisma.interview.create({
        data: {
          candidateId: session.candidateId,
          jobId: session.jobId,
          sessionId: session.id,
          status: 'scheduled',
          scheduledAt: new Date(slot.start),
          interviewers: session.interviewers,
          meetingLink: `https://zoom.us/j/${this.generateMeetingId()}`,
          createdAt: new Date()
        }
      });

      // Send confirmation
      const candidate = session.candidate;
      const job = session.job;

      const confirmationMessage = `
✅ Interview Confirmed!

Hi ${candidate.first_name},

Your interview has been scheduled for:
📅 ${this.formatSlot(slot)}

Role: ${job.title}
Duration: 45 minutes
Platform: Zoom

Meeting Link will be sent 24 hours before the interview.

Reply REMINDER to get a reminder 24 hours before.
      `.trim();

      // Store confirmation message
      const messageRecord = new WhatsAppMessage({
        waId: `${phoneNumber.replace('+', '')}@c.us`,
        phoneNumber: phoneNumber,
        direction: 'outgoing',
        messageType: 'interview_confirmation',
        content: confirmationMessage,
        status: 'sent',
        metadata: {
          sessionId: session.id,
          interviewId: interview.id,
          slot
        },
        createdAt: new Date()
      });

      await messageRecord.save();

      console.log(`✅ Interview booked for ${phoneNumber} at ${slot.start}`);

      return {
        success: true,
        interviewId: interview.id,
        scheduledAt: slot.start,
        message: 'Interview successfully scheduled'
      };
    } catch (error) {
      console.error('❌ Error booking slot:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Offer different time slots if candidate wants to reschedule
   */
  static async offerRescheduleSlots(session, phoneNumber) {
    try {
      // Generate new slot options
      const newSlots = this.generateAlternativeSlots();

      const slotsText = newSlots
        .map((slot, i) => `${i + 1}. ${this.formatSlot(slot)}`)
        .join('\n');

      const rescheduleMessage = `
⏰ No problem! Here are alternative times:

${slotsText}

Reply with your preferred number (1-3) or let us know if you need more flexibility.
      `.trim();

      // Store message
      const messageRecord = new WhatsAppMessage({
        waId: `${phoneNumber.replace('+', '')}@c.us`,
        phoneNumber: phoneNumber,
        direction: 'outgoing',
        messageType: 'reschedule_offer',
        content: rescheduleMessage,
        status: 'sent',
        metadata: {
          sessionId: session.id,
          slots: newSlots
        },
        createdAt: new Date()
      });

      await messageRecord.save();

      // Update session with new slots
      await prisma.interviewSession.update({
        where: { id: session.id },
        data: {
          availableSlots: newSlots,
          updatedAt: new Date()
        }
      });

      console.log(`✅ Reschedule options sent to ${phoneNumber}`);

      return {
        success: true,
        messageId: messageRecord._id,
        slots: newSlots
      };
    } catch (error) {
      console.error('❌ Error offering reschedule:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Handle interview decline
   */
  static async declineInterview(session, phoneNumber, reason) {
    try {
      // Update session status
      await prisma.interviewSession.update({
        where: { id: session.id },
        data: {
          status: 'declined',
          declineReason: reason,
          updatedAt: new Date()
        }
      });

      // Update candidate score status
      const score = await prisma.candidateScore.findFirst({
        where: {
          candidateId: session.candidateId,
          jobId: session.jobId
        }
      });

      if (score) {
        await prisma.candidateScore.update({
          where: { id: score.id },
          data: {
            screening_status: 'declined_interview',
            feedback: `Candidate declined interview: ${reason}`,
            updatedAt: new Date()
          }
        });
      }

      const declineAck = `
Thanks for letting us know. We appreciate your interest in ${session.job.title}.

Good luck with your other opportunities! 👋
      `.trim();

      // Store acknowledgment
      const messageRecord = new WhatsAppMessage({
        waId: `${phoneNumber.replace('+', '')}@c.us`,
        phoneNumber: phoneNumber,
        direction: 'outgoing',
        messageType: 'decline_acknowledgment',
        content: declineAck,
        status: 'sent',
        metadata: {
          sessionId: session.id,
          reason
        },
        createdAt: new Date()
      });

      await messageRecord.save();

      console.log(`📭 Interview declined by ${phoneNumber}`);

      return {
        success: true,
        status: 'declined',
        reason
      };
    } catch (error) {
      console.error('❌ Error declining interview:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send time slot options to candidate
   */
  static async sendTimeSlotOptions(session, phoneNumber) {
    try {
      const slots = this.generateTimeSlots(5);

      const slotsText = slots
        .map((slot, i) => `${i + 1}. ${this.formatSlot(slot)}`)
        .join('\n');

      const optionsMessage = `
Great! Here are your available interview slots:

${slotsText}

Reply with your preferred number (1-5) to confirm.
      `.trim();

      // Store message
      const messageRecord = new WhatsAppMessage({
        waId: `${phoneNumber.replace('+', '')}@c.us`,
        phoneNumber: phoneNumber,
        direction: 'outgoing',
        messageType: 'slot_options',
        content: optionsMessage,
        status: 'sent',
        metadata: {
          sessionId: session.id,
          slots
        },
        createdAt: new Date()
      });

      await messageRecord.save();

      return {
        success: true,
        messageId: messageRecord._id,
        slots
      };
    } catch (error) {
      console.error('❌ Error sending slot options:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send support message for questions
   */
  static async sendSupportMessage(session, phoneNumber, questionContent) {
    try {
      const supportMessage = `
📞 Good question! 

For more details about the ${session.job.title} role, you can:
• Reply to this chat
• Call our HR team at +971-XX-XXX-XXXX
• Email careers@company.com

Or proceed with scheduling by replying with your preferred time slot number.
      `.trim();

      // Store message
      const messageRecord = new WhatsAppMessage({
        waId: `${phoneNumber.replace('+', '')}@c.us`,
        phoneNumber: phoneNumber,
        direction: 'outgoing',
        messageType: 'support',
        content: supportMessage,
        status: 'sent',
        metadata: {
          sessionId: session.id,
          originalQuestion: questionContent
        },
        createdAt: new Date()
      });

      await messageRecord.save();

      return {
        success: true,
        messageId: messageRecord._id
      };
    } catch (error) {
      console.error('❌ Error sending support message:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send guide message when intent is unclear
   */
  static async sendGuideMessage(session, phoneNumber) {
    try {
      const guideMessage = `
😊 I didn't quite understand. Here's what you can do:

1️⃣ Reply with a number (1-5) to select a time slot
2️⃣ Reply "RESCHEDULE" to see other times
3️⃣ Reply "DECLINE" if you're not interested
4️⃣ Reply "?" for questions

Which would you like to do?
      `.trim();

      // Store message
      const messageRecord = new WhatsAppMessage({
        waId: `${phoneNumber.replace('+', '')}@c.us`,
        phoneNumber: phoneNumber,
        direction: 'outgoing',
        messageType: 'guide',
        content: guideMessage,
        status: 'sent',
        metadata: {
          sessionId: session.id
        },
        createdAt: new Date()
      });

      await messageRecord.save();

      return {
        success: true,
        messageId: messageRecord._id
      };
    } catch (error) {
      console.error('❌ Error sending guide message:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send interview reminder 24 hours before
   */
  static async sendInterviewReminder(interviewId) {
    try {
      const interview = await prisma.interview.findUnique({
        where: { id: interviewId },
        include: {
          candidate: true,
          job: true
        }
      });

      if (!interview) {
        throw new Error('Interview not found');
      }

      const phone = this.formatPhoneForWhatsApp(
        interview.candidate.whatsapp_phone || interview.candidate.phone_number
      );

      const reminderMessage = `
⏰ Reminder: Your Interview is Tomorrow!

Role: ${interview.job.title}
Date & Time: ${this.formatDateTime(interview.scheduledAt)}
Duration: 45 minutes
Platform: Zoom

Zoom Link: ${interview.meetingLink}

Reply CONFIRM to let us know you're ready!
      `.trim();

      // Store message
      const messageRecord = new WhatsAppMessage({
        waId: `${phone.replace('+', '')}@c.us`,
        phoneNumber: phone,
        direction: 'outgoing',
        messageType: 'interview_reminder',
        content: reminderMessage,
        status: 'sent',
        metadata: {
          interviewId,
          reminderType: 'day_before'
        },
        createdAt: new Date()
      });

      await messageRecord.save();

      // Update interview record
      await prisma.interview.update({
        where: { id: interviewId },
        data: {
          reminderSentAt: new Date()
        }
      });

      console.log(`🔔 Reminder sent for interview ${interviewId}`);

      return {
        success: true,
        messageId: messageRecord._id,
        phone
      };
    } catch (error) {
      console.error('❌ Error sending reminder:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate available time slots (next 5 business days)
   */
  static generateTimeSlots(count = 5) {
    const slots = [];
    const now = new Date();
    let currentDate = new Date(now);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

    const timeOptions = ['10:00 AM', '2:00 PM', '4:00 PM'];
    let slotCount = 0;

    while (slotCount < count) {
      // Skip weekends
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        const time = timeOptions[slotCount % timeOptions.length];
        const [hours, period] = time.split(' ');
        let [h, m] = hours.split(':').map(Number);

        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;

        const start = new Date(currentDate);
        start.setHours(h, m, 0, 0);

        const end = new Date(start);
        end.setMinutes(end.getMinutes() + 45);

        slots.push({
          start: start.toISOString(),
          end: end.toISOString(),
          day: this.getDayName(currentDate),
          date: currentDate.toISOString().split('T')[0],
          time
        });

        slotCount++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }

  /**
   * Generate alternative slots (different times)
   */
  static generateAlternativeSlots() {
    const slots = [];
    const now = new Date();
    let currentDate = new Date(now);
    currentDate.setDate(currentDate.getDate() + 3); // Start 3 days from now

    const timeOptions = ['9:00 AM', '11:00 AM', '3:30 PM'];

    for (let i = 0; i < 3; i++) {
      // Skip weekends
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const time = timeOptions[i];
      const [hours, period] = time.split(' ');
      let [h, m] = hours.split(':').map(Number);

      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;

      const start = new Date(currentDate);
      start.setHours(h, m, 0, 0);

      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 45);

      slots.push({
        start: start.toISOString(),
        end: end.toISOString(),
        day: this.getDayName(currentDate),
        date: currentDate.toISOString().split('T')[0],
        time
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }

  /**
   * Format slot for display
   */
  static formatSlot(slot) {
    if (typeof slot === 'string') {
      return slot; // Already formatted
    }

    return `${slot.day} (${slot.date}) at ${slot.time}`;
  }

  /**
   * Format date and time
   */
  static formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Get day name from date
   */
  static getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  /**
   * Generate unique meeting ID
   */
  static generateMeetingId() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Format phone number for WhatsApp
   */
  static formatPhoneForWhatsApp(phone) {
    if (!phone) return '';

    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Handle UAE numbers
    if (cleaned.startsWith('971')) {
      return `+${cleaned}`;
    }

    if (cleaned.startsWith('50') || cleaned.startsWith('52') || cleaned.startsWith('55')) {
      return `+971${cleaned}`;
    }

    // Handle other formats
    if (cleaned.length === 9) {
      return `+971${cleaned}`;
    }

    return `+${cleaned}`;
  }

  /**
   * Extract decline reason from message
   */
  static extractDeclineReason(message) {
    if (/busy|don't have time|schedule|can't/i.test(message)) {
      return 'Scheduling conflict';
    }
    if (/interested|right role|looking for/i.test(message)) {
      return 'Not interested in role';
    }
    if (/already found|other job|accepted/i.test(message)) {
      return 'Already accepted another offer';
    }
    return 'Candidate declined';
  }

  /**
   * Get interview statistics
   */
  static async getInterviewStats(jobId) {
    try {
      const interviews = await prisma.interview.findMany({
        where: { jobId },
        include: {
          candidate: true
        }
      });

      const sessions = await prisma.interviewSession.findMany({
        where: { jobId }
      });

      return {
        total_sessions: sessions.length,
        scheduled: sessions.filter(s => s.status === 'scheduled').length,
        pending: sessions.filter(s => s.status === 'pending_scheduling').length,
        declined: sessions.filter(s => s.status === 'declined').length,
        completed: interviews.filter(i => i.status === 'completed').length,
        no_show: interviews.filter(i => i.status === 'no_show').length
      };
    } catch (error) {
      console.error('❌ Error getting stats:', error.message);
      return null;
    }
  }
}

export default InterviewSchedulingService;
