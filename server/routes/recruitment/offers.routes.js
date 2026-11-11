/**
 * offers.routes.js — Offer letter, approval, response & onboarding endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';
import { logRecruitmentAudit } from './recruitment.context.js';
import { requireRecruitmentAccess } from './recruitment.access.js';
import { buildOnboardingChecklist } from './recruitment.metrics.js';

const router = express.Router();

// Send offer letter and move application to offer stage
router.post(
  '/applications/:application_id/send-offer',
  requireRecruitmentAccess('write'),
  async (req, res) => {
    try {
      const { application_id } = req.params;
      const { salary, start_date, department, company_name = 'White Caves Real Estate' } = req.body;

      if (!salary || !start_date) {
        return res.status(400).json({
          error: 'salary and start_date are required',
        });
      }

      const application = await ctx.prisma.application.findUnique({
        where: { id: application_id },
        include: { candidate: true, job: true },
      });

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const variables = {
        candidate_name:
          application.candidate.first_name || application.candidate.email || 'Candidate',
        job_title: application.job.title,
        company_name,
        department: department || application.job.department || 'General',
        start_date,
        salary,
      };

      const message = await ctx.scoringService.sendTemplateMessageViaMeta(
        application.candidate,
        'offer_letter',
        variables,
        'offer_letter'
      );
      if (!message) {
        return res
          .status(422)
          .json({ error: 'Offer was not sent: no messaging recipient available' });
      }

      await ctx.prisma.application.update({
        where: { id: application_id },
        data: {
          status: 'offer',
          notes: `Offer sent on ${new Date().toISOString()} | Salary: ${salary} | Start: ${start_date}`,
        },
      });

      await ctx.prisma.candidate.update({
        where: { id: application.candidate_id },
        data: { status: 'selected' },
      });

      logRecruitmentAudit(req, 'offer_sent', {
        application_id,
        candidate_id: application.candidate_id,
        job_id: application.job_id,
        salary,
        start_date,
        template_id: 'offer_letter',
      });

      res.status(200).json({
        success: true,
        message: 'Offer sent successfully',
        application_id,
        whatsapp_message_id: message?._id,
        offer: variables,
      });
    } catch (error) {
      console.error('Error sending offer:', error);
      res.status(500).json({
        error: 'Failed to send offer',
        details: error.message,
      });
    }
  }
);

// Approve a sent offer before candidate acceptance
router.post(
  '/applications/:application_id/approve-offer',
  requireRecruitmentAccess('write'),
  async (req, res) => {
    try {
      const { application_id } = req.params;
      const { approved_by = 'HR', approval_note } = req.body;

      const application = await ctx.prisma.application.findUnique({
        where: { id: application_id },
        include: { candidate: true, job: true },
      });

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      if (!['offer', 'offer_approved'].includes(application.status)) {
        return res.status(409).json({
          error: `Offer can only be approved from offer stage. Current status: ${application.status}`,
        });
      }

      const noteParts = [
        `Offer approved on ${new Date().toISOString()} by ${approved_by}`,
        approval_note ? `Note: ${approval_note}` : null,
      ].filter(Boolean);

      const updated = await ctx.prisma.application.update({
        where: { id: application_id },
        data: {
          status: 'offer_approved',
          notes: [application.notes, ...noteParts].filter(Boolean).join(' | '),
        },
      });

      logRecruitmentAudit(req, 'offer_approved', {
        application_id,
        candidate_id: application.candidate_id,
        job_id: application.job_id,
        approved_by,
        status: updated.status,
      });

      res.status(200).json({
        success: true,
        message: 'Offer approved successfully',
        application_id,
        status: updated.status,
      });
    } catch (error) {
      console.error('Error approving offer:', error);
      res.status(500).json({
        error: 'Failed to approve offer',
        details: error.message,
      });
    }
  }
);

// Record candidate response to an offer
router.post(
  '/applications/:application_id/respond-offer',
  requireRecruitmentAccess('write'),
  async (req, res) => {
    try {
      const { application_id } = req.params;
      const { decision, response_note, confirmed_start_date } = req.body;

      if (!decision || !['accept', 'decline'].includes(decision)) {
        return res.status(400).json({
          error: 'decision is required and must be one of: accept, decline',
        });
      }

      const application = await ctx.prisma.application.findUnique({
        where: { id: application_id },
        include: { candidate: true, job: true },
      });

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      if (
        !['offer', 'offer_approved', 'offer_accepted', 'offer_declined'].includes(
          application.status
        )
      ) {
        return res.status(409).json({
          error: `Offer response can only be recorded from offer stages. Current status: ${application.status}`,
        });
      }

      const accepted = decision === 'accept';
      const nextStatus = accepted ? 'offer_accepted' : 'offer_declined';
      const candidateStatus = accepted ? 'selected' : 'rejected';
      const decisionTimestamp = new Date().toISOString();
      const noteParts = [
        `Offer ${accepted ? 'accepted' : 'declined'} on ${decisionTimestamp}`,
        confirmed_start_date ? `Confirmed start: ${confirmed_start_date}` : null,
        response_note ? `Response note: ${response_note}` : null,
      ].filter(Boolean);

      await ctx.prisma.application.update({
        where: { id: application_id },
        data: {
          status: nextStatus,
          notes: [application.notes, ...noteParts].filter(Boolean).join(' | '),
        },
      });

      await ctx.prisma.candidate.update({
        where: { id: application.candidate_id },
        data: { status: candidateStatus },
      });

      logRecruitmentAudit(req, 'offer_response_recorded', {
        application_id,
        candidate_id: application.candidate_id,
        job_id: application.job_id,
        decision,
        application_status: nextStatus,
        candidate_status: candidateStatus,
      });

      res.status(200).json({
        success: true,
        message: `Offer ${accepted ? 'accepted' : 'declined'} successfully`,
        application_id,
        status: nextStatus,
        candidate_status: candidateStatus,
      });
    } catch (error) {
      console.error('Error recording offer response:', error);
      res.status(500).json({
        error: 'Failed to record offer response',
        details: error.message,
      });
    }
  }
);

// Start onboarding after offer acceptance
router.post(
  '/applications/:application_id/start-onboarding',
  requireRecruitmentAccess('write'),
  async (req, res) => {
    try {
      const { application_id } = req.params;
      const { start_date } = req.body;

      if (!start_date) {
        return res.status(400).json({
          error: 'start_date is required',
        });
      }

      const application = await ctx.prisma.application.findUnique({
        where: { id: application_id },
        include: { candidate: true, job: true },
      });

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      if (!['offer_accepted', 'offer_approved'].includes(application.status)) {
        return res.status(409).json({
          error: `Onboarding can only start after offer approval/acceptance. Current status: ${application.status}`,
        });
      }

      const onboarding = buildOnboardingChecklist(
        application.candidate,
        application.job,
        start_date
      );

      const message = await ctx.scoringService.sendTemplateMessageViaMeta(
        application.candidate,
        'onboarding_welcome',
        {
          ...onboarding,
          checklist_items: onboarding.checklist_items.map(item => `• ${item}`).join('\n'),
          training_modules: onboarding.training_modules.map(item => `• ${item}`).join('\n'),
        },
        'onboarding_welcome'
      );

      await ctx.prisma.application.update({
        where: { id: application_id },
        data: {
          status: 'hired',
          notes: `Onboarding started on ${new Date().toISOString()} | Start: ${start_date}`,
        },
      });

      await ctx.prisma.candidate.update({
        where: { id: application.candidate_id },
        data: { status: 'hired' },
      });

      logRecruitmentAudit(req, 'onboarding_started', {
        application_id,
        candidate_id: application.candidate_id,
        job_id: application.job_id,
        start_date,
        template_id: 'onboarding_welcome',
      });

      res.status(200).json({
        success: true,
        message: 'Onboarding started successfully',
        application_id,
        whatsapp_message_id: message?._id,
        onboarding,
      });
    } catch (error) {
      console.error('Error starting onboarding:', error);
      res.status(500).json({
        error: 'Failed to start onboarding',
        details: error.message,
      });
    }
  }
);

export default router;
