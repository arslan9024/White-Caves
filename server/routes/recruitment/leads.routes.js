/**
 * leads.routes.js — Lead listing, status transitions & funnel analytics endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';
import { LeadScoringIntegration } from '../../utils/LeadScoringIntegration.js';

const router = express.Router();

/**
 * GET /recruitment/leads?temperature=hot|warm|cold&jobId=?&limit=20
 * List qualified leads by temperature tier
 */
router.get('/leads', async (req, res) => {
  try {
    const { temperature, jobId, limit = 20 } = req.query;
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);

    let query = {};
    if (temperature) {
      query.leadTemperature = temperature.toUpperCase();
    }
    if (jobId) {
      query.jobId = jobId;
    }

    // Try to fetch from database
    let leads = [];
    try {
      leads = await ctx.prisma.leadScore.findMany({
        where: query,
        take: parsedLimit,
        orderBy: { overallScore: 'desc' },
        include: {
          candidate: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              location: true,
            },
          },
        },
      });
    } catch (dbError) {
      console.warn('Could not query database:', dbError.message);
    }

    // Format response
    const formattedLeads = leads.map(lead => ({
      candidateId: lead.candidateId,
      candidate: lead.candidate,
      overallScore: lead.overallScore,
      temperature: lead.leadTemperature,
      qualification: lead.qualificationLevel,
      recommendations: lead.recommendations,
      scoredAt: lead.createdAt,
    }));

    // Get temperature breakdown
    const breakdown = {
      HOT: formattedLeads.filter(l => l.temperature === 'HOT').length,
      WARM: formattedLeads.filter(l => l.temperature === 'WARM').length,
      COLD: formattedLeads.filter(l => l.temperature === 'COLD').length,
    };

    return res.json({
      success: true,
      filters: { temperature, jobId, limit: parsedLimit },
      leadsCount: formattedLeads.length,
      breakdown,
      leads: formattedLeads,
    });
  } catch (error) {
    console.error('Lead listing error:', error);
    return res.status(500).json({
      error: 'Failed to list leads',
      details: error.message,
    });
  }
});

/**
 * PATCH /recruitment/leads/:candidateId/status
 * Update lead status and trigger recommended actions
 */
router.patch('/leads/:candidateId/status', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { newStatus, jobId, notes } = req.body;

    if (!newStatus) {
      return res.status(400).json({
        error: 'newStatus is required',
        validStatuses: [
          'hot_interview_scheduled',
          'warm_under_review',
          'cold_archived',
          'nurture_sequence',
        ],
      });
    }

    // Fetch lead data
    let leadData = null;
    try {
      leadData = await ctx.prisma.leadScore.findFirst({
        where: { candidateId, jobId: jobId || null },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      console.warn('Could not fetch lead data');
    }

    // Get integration insights
    const integrationResult = LeadScoringIntegration.integrateWithInterviewScheduling(
      { candidateId, leadScore: leadData, resumeScore: leadData?.scoreBreakdown?.resumeScore || 0 },
      null // Passing null for service - would be actual service in production
    );

    // Log the status update
    const updateLog = {
      candidateId,
      jobId,
      oldStatus: leadData?.leadTemperature,
      newStatus,
      notes,
      updatedAt: new Date(),
      integrationDecision: integrationResult.decision,
    };

    try {
      await ctx.prisma.candidate.update({
        where: { id: candidateId },
        data: {
          lead_temperature: newStatus.split('_')[0].toUpperCase(),
          updated_at: new Date(),
        },
      });
    } catch (dbError) {
      console.warn('Could not update candidate record');
    }

    return res.json({
      success: true,
      candidateId,
      updated: {
        status: newStatus,
        notes,
        integrationActions: integrationResult.decision?.autoActions || [],
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Lead status update error:', error);
    return res.status(500).json({
      error: 'Failed to update lead status',
      details: error.message,
    });
  }
});

/**
 * GET /recruitment/analytics/lead-funnel?jobId=?
 * Analytics on lead quality distribution and KPIs
 */
router.get('/analytics/lead-funnel', async (req, res) => {
  try {
    const { jobId } = req.query;

    let query = {};
    if (jobId) {
      query.jobId = jobId;
    }

    // Fetch all lead scores
    let allLeads = [];
    try {
      allLeads = await ctx.prisma.leadScore.findMany({
        where: query,
        select: {
          overallScore: true,
          leadTemperature: true,
          qualificationLevel: true,
          scoreBreakdown: true,
          createdAt: true,
        },
      });
    } catch (dbError) {
      console.warn('Could not fetch lead data from database');
    }

    // If no database data, return template analytics
    if (allLeads.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalLeads: 0,
          temperatureDistribution: {
            HOT: 0,
            WARM: 0,
            COLD: 0,
          },
          qualificationDistribution: {
            Excellent: 0,
            Good: 0,
            Fair: 0,
            Weak: 0,
            Poor: 0,
          },
          scoreDistribution: {
            '80-100': 0,
            '60-79': 0,
            '40-59': 0,
            '0-39': 0,
          },
          averageScores: {
            overall: 0,
            resume: 0,
            conversation: 0,
            engagement: 0,
          },
          kpis: {
            hotLeadPercentage: 0,
            averageQualification: 'Unknown',
            conversionPotential: 'Unknown',
          },
          jobId: jobId || 'all',
          generatedAt: new Date(),
        },
      });
    }

    // Calculate analytics
    const temperatureBreakdown = {
      HOT: allLeads.filter(l => l.leadTemperature === 'HOT').length,
      WARM: allLeads.filter(l => l.leadTemperature === 'WARM').length,
      COLD: allLeads.filter(l => l.leadTemperature === 'COLD').length,
    };

    const qualificationBreakdown = {
      Excellent: allLeads.filter(l => l.qualificationLevel === 'Excellent').length,
      Good: allLeads.filter(l => l.qualificationLevel === 'Good').length,
      Fair: allLeads.filter(l => l.qualificationLevel === 'Fair').length,
      Weak: allLeads.filter(l => l.qualificationLevel === 'Weak').length,
      Poor: allLeads.filter(l => l.qualificationLevel === 'Poor').length,
    };

    const scoreDistribution = {
      '80-100': allLeads.filter(l => l.overallScore >= 80).length,
      '60-79': allLeads.filter(l => l.overallScore >= 60 && l.overallScore < 80).length,
      '40-59': allLeads.filter(l => l.overallScore >= 40 && l.overallScore < 60).length,
      '0-39': allLeads.filter(l => l.overallScore < 40).length,
    };

    const avgOverallScore = (
      allLeads.reduce((sum, l) => sum + l.overallScore, 0) / allLeads.length
    ).toFixed(1);
    const avgResumeScore = (
      allLeads.reduce((sum, l) => sum + (l.scoreBreakdown?.resumeScore || 0), 0) / allLeads.length
    ).toFixed(1);
    const avgConversationScore = (
      allLeads.reduce((sum, l) => sum + (l.scoreBreakdown?.conversationScore || 0), 0) /
      allLeads.length
    ).toFixed(1);
    const avgEngagementScore = (
      allLeads.reduce((sum, l) => sum + (l.scoreBreakdown?.engagementVelocity || 0), 0) /
      allLeads.length
    ).toFixed(1);

    return res.json({
      success: true,
      analytics: {
        totalLeads: allLeads.length,
        temperatureDistribution: temperatureBreakdown,
        qualificationDistribution: qualificationBreakdown,
        scoreDistribution,
        averageScores: {
          overall: parseFloat(avgOverallScore),
          resume: parseFloat(avgResumeScore),
          conversation: parseFloat(avgConversationScore),
          engagement: parseFloat(avgEngagementScore),
        },
        kpis: {
          hotLeadPercentage: ((temperatureBreakdown.HOT / allLeads.length) * 100).toFixed(1),
          warmLeadPercentage: ((temperatureBreakdown.WARM / allLeads.length) * 100).toFixed(1),
          coldLeadPercentage: ((temperatureBreakdown.COLD / allLeads.length) * 100).toFixed(1),
          averageQualification: Object.keys(qualificationBreakdown).reduce((a, b) =>
            qualificationBreakdown[a] > qualificationBreakdown[b] ? a : b
          ),
          conversionPotential:
            parseFloat(avgOverallScore) > 70
              ? 'High'
              : parseFloat(avgOverallScore) > 50
                ? 'Medium'
                : 'Low',
        },
        jobId: jobId || 'all',
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Lead funnel analytics error:', error);
    return res.status(500).json({
      error: 'Failed to generate analytics',
      details: error.message,
    });
  }
});

export default router;
