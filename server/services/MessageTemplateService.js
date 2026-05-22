/**
 * MessageTemplateService
 * Manages WhatsApp message templates with variable substitution
 * Used for screening results, interview invitations, reminders, etc.
 */

import { SCREENING_STATUS } from '../constants/ScoreLevels.js';

class MessageTemplateService {
  constructor() {
    // Default templates - can be stored in DB later
    this.templates = {
      screening_result: {
        id: 'screening_result',
        name: 'Screening Result Notification',
        category: 'screening',
        body: `Hi {{candidate_name}}, 👋

We've reviewed your resume for the {{job_title}} position.

📊 *Your Assessment Results:*
• *Overall Score:* {{overall_score}}/100 ({{screening_status}})
• *Skills Match:* {{skills_score}}/100
• *Experience:* {{experience_score}}/100
• *Education:* {{education_score}}/100
• *Cultural Fit:* {{cultural_fit_score}}/100
• *Location Match:* {{location_match_score}}/100

💡 *Feedback:*
{{feedback}}

🎯 *Next Steps:*
{{next_action}}

If you have any questions, feel free to reply to this message.

— Recruitment Team`,
        variables: [
          'candidate_name',
          'job_title',
          'overall_score',
          'screening_status',
          'skills_score',
          'experience_score',
          'education_score',
          'cultural_fit_score',
          'location_match_score',
          'feedback',
          'next_action'
        ],
        enabled: true
      },

      interview_invitation: {
        id: 'interview_invitation',
        name: 'Interview Invitation',
        category: 'interview',
        body: `Congratulations {{candidate_name}}! 🎉

You've been selected to interview for the {{job_title}} position.

📅 *Interview Details:*
• *Position:* {{job_title}}
• *Type:* {{interview_type}}
• *Duration:* {{interview_duration}} minutes

⏰ *Available Times:*
{{available_times}}

🔗 *Meeting Link:*
{{meeting_link}}

Please reply with your preferred time, or reply "HELP" if you have questions.

— Recruitment Team`,
        variables: [
          'candidate_name',
          'job_title',
          'interview_type',
          'interview_duration',
          'available_times',
          'meeting_link'
        ],
        enabled: true
      },

      interview_reminder: {
        id: 'interview_reminder',
        name: 'Interview Reminder',
        category: 'reminder',
        body: `Reminder {{candidate_name}}: Your interview is tomorrow! ⏰

📅 *Date & Time:* {{interview_date}} at {{interview_time}}
🔗 *Link:* {{meeting_link}}
⏱️ *Duration:* {{interview_duration}} minutes

Please confirm your attendance by replying "YES" or "CONFIRM"

See you soon! 👋

— Recruitment Team`,
        variables: [
          'candidate_name',
          'interview_date',
          'interview_time',
          'meeting_link',
          'interview_duration'
        ],
        enabled: true
      },

      offer_letter: {
        id: 'offer_letter',
        name: 'Job Offer',
        category: 'offer',
        body: `Great News {{candidate_name}}! 🎊

We are pleased to offer you the position of *{{job_title}}* at {{company_name}}.

💼 *Position Details:*
• *Title:* {{job_title}}
• *Department:* {{department}}
• *Start Date:* {{start_date}}
• *Salary:* {{salary}}

🎯 *Next Steps:*
1. Reply "ACCEPT" to confirm
2. We'll send detailed offer via email
3. Onboarding begins {{start_date}}

Congratulations! 🎉

— Recruitment Team`,
        variables: [
          'candidate_name',
          'job_title',
          'company_name',
          'department',
          'start_date',
          'salary'
        ],
        enabled: true
      },

      onboarding_welcome: {
        id: 'onboarding_welcome',
        name: 'Onboarding Welcome',
        category: 'onboarding',
        body: `Welcome to {{company_name}}, {{candidate_name}}! 🎉

Your onboarding for the *{{job_title}}* role starts on *{{start_date}}*.

📋 *Your First-Day Checklist:*
{{checklist_items}}

🤝 *Buddy Support:*
{{buddy_name}}

📚 *Training Modules:*
{{training_modules}}

If you need any help before day one, reply to this message.

— Recruitment Team`,
        variables: [
          'candidate_name',
          'company_name',
          'job_title',
          'start_date',
          'checklist_items',
          'buddy_name',
          'training_modules'
        ],
        enabled: true
      },

      rejection_notification: {
        id: 'rejection_notification',
        name: 'Rejection Notification',
        category: 'screening',
        body: `Hi {{candidate_name}},

Thank you for applying for the {{job_title}} position. We appreciate your interest in our company.

After careful review, we've decided to move forward with other candidates whose qualifications more closely match our current needs.

We encourage you to apply again in the future when there's a better match.

Best of luck with your job search! 🤝

— Recruitment Team`,
        variables: [
          'candidate_name',
          'job_title'
        ],
        enabled: true
      },

      follow_up: {
        id: 'follow_up',
        name: 'Follow-up Message',
        category: 'follow_up',
        body: `Hi {{candidate_name}},

Just checking in regarding your application for {{job_title}}.

We're still reviewing applications and will get back to you with an update by {{expected_date}}.

In the meantime, feel free to reach out if you have any questions!

— Recruitment Team`,
        variables: [
          'candidate_name',
          'job_title',
          'expected_date'
        ],
        enabled: true
      }
    };
  }

  /**
   * Get all available templates
   */
  getAll() {
    return Object.values(this.templates);
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId) {
    if (!this.templates[templateId]) {
      throw new Error(`Template not found: ${templateId}`);
    }
    return this.templates[templateId];
  }

  /**
   * Render template with variables
   * @param {string} templateId - Template ID
   * @param {object} variables - Variables to substitute
   * @returns {string} Rendered message
   */
  render(templateId, variables = {}) {
    const template = this.getTemplate(templateId);
    let message = template.body;

    // Replace all {{variable}} with actual values
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      message = message.replace(regex, value || '');
    });

    // Replace remaining unreplaced variables with empty string (for optional fields)
    message = message.replace(/{{.*?}}/g, '');

    return message;
  }

  /**
   * Validate that all required variables are provided
   */
  validate(templateId, variables = {}) {
    const template = this.getTemplate(templateId);
    const missing = [];

    template.variables.forEach(variable => {
      if (!(variable in variables) || variables[variable] === undefined || variables[variable] === '') {
        missing.push(variable);
      }
    });

    return {
      valid: missing.length === 0,
      missing
    };
  }

  /**
   * Get screening result template with auto-calculated next action
   */
  renderScreeningResult(candidate, job, score) {
    let nextAction = '';

    if (score.screening_status === SCREENING_STATUS.STRONG_MATCH) {
      nextAction = 'Reply "SCHEDULE" to book an interview or "INFO" for more details.';
    } else if (score.screening_status === SCREENING_STATUS.MODERATE_MATCH) {
      nextAction = 'We\'ll contact you soon with next steps. Reply with any questions!';
    } else if (score.screening_status === SCREENING_STATUS.WEAK_MATCH) {
      nextAction = 'Feel free to apply to other positions that might be a better fit.';
    } else if (score.screening_status === SCREENING_STATUS.REJECTED) {
      nextAction = 'We encourage you to apply in the future as your skills develop.';
    } else {
      nextAction = 'We\'ll review your application and get back to you soon.';
    }

    const variables = {
      candidate_name: candidate.first_name || candidate.email || 'Candidate',
      job_title: job.title || 'the position',
      overall_score: Math.round(score.overall_score),
      screening_status: this.formatStatus(score.screening_status),
      skills_score: Math.round(score.skills_score),
      experience_score: Math.round(score.experience_score),
      education_score: Math.round(score.education_score),
      cultural_fit_score: Math.round(score.cultural_fit_score),
      location_match_score: Math.round(score.location_match_score),
      feedback: score.feedback || 'Great potential!',
      next_action: nextAction
    };

    // Validate
    const validation = this.validate('screening_result', variables);
    if (!validation.valid) {
      console.warn('Missing variables for screening_result template:', validation.missing);
    }

    return this.render('screening_result', variables);
  }

  /**
   * Format screening status for human-readable output
   */
  formatStatus(status) {
    const statusMap = {
      [SCREENING_STATUS.STRONG_MATCH]: 'Strong Match ⭐⭐⭐⭐⭐',
      [SCREENING_STATUS.MODERATE_MATCH]: 'Moderate Match ⭐⭐⭐⭐',
      [SCREENING_STATUS.WEAK_MATCH]: 'Weak Match ⭐⭐',
      [SCREENING_STATUS.REJECTED]: 'Not a Match',
      good_match: 'Moderate Match ⭐⭐⭐⭐',
      potential_match: 'Weak Match ⭐⭐',
      poor_match: 'Not a Match',
      does_not_match: 'Not a Match'
    };
    return statusMap[status] || status;
  }

  /**
   * Create custom template (for future DB storage)
   */
  createTemplate(templateData) {
    if (!templateData.id || !templateData.body || !templateData.variables) {
      throw new Error('Template must have id, body, and variables');
    }

    this.templates[templateData.id] = {
      id: templateData.id,
      name: templateData.name || templateData.id,
      category: templateData.category || 'custom',
      body: templateData.body,
      variables: templateData.variables,
      enabled: templateData.enabled !== false
    };

    return this.templates[templateData.id];
  }

  /**
   * Update template
   */
  updateTemplate(templateId, updates) {
    const template = this.getTemplate(templateId);
    Object.assign(template, updates);
    return template;
  }

  /**
   * Delete template (for custom templates only)
   */
  deleteTemplate(templateId) {
    // Don't allow deleting default templates
    const defaultTemplates = [
      'screening_result',
      'interview_invitation',
      'interview_reminder',
      'offer_letter',
      'onboarding_welcome',
      'rejection_notification',
      'follow_up'
    ];

    if (defaultTemplates.includes(templateId)) {
      throw new Error('Cannot delete default template');
    }

    delete this.templates[templateId];
  }

  /**
   * Get template variables list
   */
  getTemplateVariables(templateId) {
    const template = this.getTemplate(templateId);
    return template.variables;
  }

  /**
   * Preview template with sample data
   */
  getPreview(templateId) {
    const template = this.getTemplate(templateId);

    // Create sample variables
    const sampleData = {
      candidate_name: 'Ahmed',
      job_title: 'Senior Developer',
      company_name: 'White Caves Real Estate',
      overall_score: '87',
      screening_status: 'Strong Match ⭐⭐⭐⭐⭐',
      skills_score: '92',
      experience_score: '85',
      education_score: '78',
      cultural_fit_score: '88',
      location_match_score: '90',
      feedback: 'Excellent technical skills and cultural alignment.',
      next_action: 'Reply "SCHEDULE" to book an interview.',
      interview_type: 'Technical Round',
      interview_duration: '45',
      available_times: '• Monday 2 PM\n• Tuesday 3 PM\n• Wednesday 10 AM',
      meeting_link: 'https://zoom.us/j/12345678',
      interview_date: '2026-01-20',
      interview_time: '2:00 PM',
      department: 'Engineering',
      start_date: '2026-02-01',
      salary: 'AED 15,000 - 20,000 per month',
      checklist_items: '• Bring Emirates ID\n• Sign HR documents\n• Collect laptop from IT',
      buddy_name: 'Sarah Johnson',
      training_modules: '• HR Orientation\n• CRM Access Setup\n• Role-Specific Enablement',
      expected_date: '2026-01-25'
    };

    return this.render(templateId, sampleData);
  }
}

// Export singleton instance
export default new MessageTemplateService();
