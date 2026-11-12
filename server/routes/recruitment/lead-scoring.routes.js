/**
 * lead-scoring.routes.js — Conversation analysis & lead score calculation endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';
import { ConversationMetricsAnalyzer } from '../../services/ConversationMetricsAnalyzer.js';
import { EnhancedIntentDetectionService } from '../../services/EnhancedIntentDetectionService.js';
import { LeadQualificationService } from '../../services/LeadQualificationService.js';

const router = express.Router();

// ============= PHASE 1C PART 3: LEAD SCORING ENDPOINTS =============

/**
 * POST /recruitment/conversations/:candidateId/analyze
 * Analyze single conversation history and return metrics
 */
router.post('/conversations/:candidateId/analyze', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Messages must be an array',
        example: [{ content: 'text', timestamp: '2024-01-01T00:00:00Z', direction: 'incoming' }],
      });
    }

    // Analyze conversation metrics
    const metrics = ConversationMetricsAnalyzer.analyzeConversation(messages);

    // Detect intent from latest message
    const latestMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
    const intent = EnhancedIntentDetectionService.detectIntent(latestMessage, messages.slice(-5));

    // Get qualification assessment
    const qualification = EnhancedIntentDetectionService.assessQualification(messages);

    return res.json({
      success: true,
      candidateId,
      analysis: {
        metrics,
        intent,
        qualification,
        messageCount: messages.length,
        analyzedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Conversation analysis error:', error);
    return res.status(500).json({
      error: 'Failed to analyze conversation',
      details: error.message,
    });
  }
});

/**
 * POST /recruitment/leads/:candidateId/calculate-score
 * Calculate comprehensive lead score combining resume + conversation
 */
router.post('/leads/:candidateId/calculate-score', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { resumeScore, conversationMessages, jobId } = req.body;

    if (typeof resumeScore !== 'number' || !Array.isArray(conversationMessages)) {
      return res.status(400).json({
        error: 'Invalid input. Require: resumeScore (number), conversationMessages (array)',
      });
    }

    // Get previous lead score for velocity calculation
    let previousLeadScore = null;
    try {
      previousLeadScore = await ctx.prisma.leadScore.findFirst({
        where: { candidateId, jobId: jobId || null },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {
      // LeadScore table may not exist yet
      console.warn('LeadScore table not found, continuing without velocity');
    }

    // Calculate lead score
    const leadScore = LeadQualificationService.calculateLeadScore(
      resumeScore,
      conversationMessages,
      candidateId,
      previousLeadScore
    );

    // Try to save to database
    try {
      if (jobId) {
        await ctx.prisma.leadScore.create({
          data: {
            candidateId,
            jobId,
            overallScore: leadScore.overallScore,
            scoreBreakdown: leadScore.scoreBreakdown,
            leadTemperature: leadScore.leadTemperature,
            qualificationLevel: leadScore.qualificationLevel,
            recommendations: leadScore.recommendations,
          },
        });
      }
    } catch (dbError) {
      console.warn('Could not save to database:', dbError.message);
    }

    return res.json({
      success: true,
      candidateId,
      leadScore,
      savedToDatabase: !!jobId,
    });
  } catch (error) {
    console.error('Lead score calculation error:', error);
    return res.status(500).json({
      error: 'Failed to calculate lead score',
      details: error.message,
    });
  }
});

export default router;
