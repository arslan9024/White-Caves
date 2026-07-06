/**
 * Conversation Batch Processor - Phase 1C Part 3
 * Batch-analyzes conversation histories and updates lead scores
 * Runs nightly or on-demand to process active conversations
 */

import LeadQualificationService from './LeadQualificationService.js';
import EnhancedIntentDetectionService from './EnhancedIntentDetectionService.js';
import ConversationMetricsAnalyzer from './ConversationMetricsAnalyzer.js';

export class ConversationBatchProcessor {
  // Configuration
  static CONFIG = {
    batchSize: 50,              // Process 50 candidates per job at a time
    messageWindowSize: 10,      // Analyze last 10 messages
    timeoutMs: 30000,           // 30 second timeout per batch
    retryAttempts: 3,
    retryDelayMs: 1000
  };

  /**
   * Process batch of candidates for a specific job
   * @param {String} jobId - Job ID
   * @param {Array} candidates - Array of candidate objects with messages
   * @param {Object} repository - Database repository with save/update methods
   * @returns {Object} Processing results
   */
  static async processBatch(jobId, candidates, repository) {
    if (!jobId || !Array.isArray(candidates)) {
      return {
        success: false,
        jobId,
        processed: 0,
        failed: 0,
        errors: ['Invalid input: jobId or candidates array']
      };
    }

    console.log(`🔄 Starting batch process for job ${jobId}: ${candidates.length} candidates`);
    
    const results = {
      jobId,
      processed: 0,
      failed: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      startedAt: new Date(),
      completedAt: null,
      processedCandidates: []
    };

    // Process candidates in chunks
    const chunks = this.chunkArray(candidates, this.CONFIG.batchSize);
    
    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      console.log(`📋 Processing chunk ${chunkIndex + 1}/${chunks.length}`);

      for (const candidate of chunk) {
        try {
          const candidateResult = await this.processSingleCandidate(
            candidate,
            jobId,
            repository
          );

          results.processed++;
          if (candidateResult.success) {
            results.updated++;
            results.processedCandidates.push({
              candidateId: candidate._id || candidate.id,
              status: 'updated',
              newScore: candidateResult.score?.overallScore,
              temperature: candidateResult.score?.leadTemperature,
              messagesAnalyzed: candidateResult.messagesCount
            });
          } else {
            results.skipped++;
          }
        } catch (error) {
          results.failed++;
          results.errors.push({
            candidateId: candidate._id || candidate.id,
            error: error.message,
            timestamp: new Date()
          });
          console.error(`❌ Error processing candidate ${candidate._id}:`, error.message);
        }
      }

      // Add delay between chunks to avoid overload
      if (chunkIndex < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    results.completedAt = new Date();
    results.processingTimeMs = results.completedAt - results.startedAt;

    console.log(`✅ Batch processing completed for job ${jobId}`);
    console.log(`   Processed: ${results.processed}, Updated: ${results.updated}, Failed: ${results.failed}`);

    return results;
  }

  /**
   * Process single candidate conversation
   * @param {Object} candidate - Candidate document with conversation data
   * @param {String} jobId - Job ID
   * @param {Object} repository - Database operations
   * @returns {Object} Processing result
   */
  static async processSingleCandidate(candidate, jobId, repository) {
    const candidateId = candidate._id || candidate.id;

    // Check if candidate has recent messages to analyze
    if (!candidate.whatsappMessages || candidate.whatsappMessages.length === 0) {
      return {
        success: false,
        reason: 'No messages',
        candidateId
      };
    }

    // Get application record if exists
    const application = candidate.applications?.find(app => app.jobId === jobId);
    if (!application) {
      return {
        success: false,
        reason: 'No application for job',
        candidateId
      };
    }

    try {
      // Extract recent messages (last N messages)
      const recentMessages = this.extractRecentMessages(
        candidate.whatsappMessages,
        this.CONFIG.messageWindowSize
      );

      // Get resume score
      const resumeScore = candidate.overallScore || 0;

      // Get previous lead score for velocity calculation
      const previousLeadScore = await this.getPreviousLeadScore(
        candidateId,
        jobId,
        repository
      );

      // Calculate new lead score
      const leadScore = LeadQualificationService.calculateLeadScore(
        resumeScore,
        recentMessages,
        candidateId,
        previousLeadScore
      );

      // Prepare data for saving
      const dataToSave = {
        candidateId,
        jobId,
        ...leadScore
      };

      // Save to database
      const saveResult = await this.saveLeadScore(dataToSave, repository);

      if (saveResult.success) {
        // Update candidate document with latest scores
        await this.updateCandidateWithScore(
          candidateId,
          leadScore,
          repository
        );
      }

      return {
        success: true,
        candidateId,
        score: leadScore,
        messagesCount: recentMessages.length,
        saveResult
      };

    } catch (error) {
      console.error(`Error processing candidate ${candidateId}:`, error);
      throw error;
    }
  }

  /**
   * Extract recent messages from conversation history
   * @param {Array} allMessages - All messages
   * @param {Number} windowSize - Number of recent messages to return
   * @returns {Array}
   */
  static extractRecentMessages(allMessages, windowSize) {
    if (!Array.isArray(allMessages)) return [];
    
    // Sort by timestamp (newest first) and take the most recent
    const sorted = [...allMessages].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.createdAt || 0);
      const timeB = new Date(b.timestamp || b.createdAt || 0);
      return timeB - timeA;
    });

    return sorted.slice(0, windowSize).reverse(); // Return oldest to newest in window
  }

  /**
   * Get previous lead score for velocity calculation
   * @param {String} candidateId
   * @param {String} jobId
   * @param {Object} repository
   * @returns {Object} Previous score or null
   */
  static async getPreviousLeadScore(candidateId, jobId, repository) {
    try {
      if (repository.LeadScore && typeof repository.LeadScore.findLatest === 'function') {
        return await repository.LeadScore.findLatest(candidateId, jobId);
      }
      // Fallback: check if method exists
      if (typeof repository.findPreviousLeadScore === 'function') {
        return await repository.findPreviousLeadScore(candidateId, jobId);
      }
      return null;
    } catch (error) {
      console.warn('Could not retrieve previous lead score:', error.message);
      return null;
    }
  }

  /**
   * Save lead score to database
   * @param {Object} leadScore - Lead score data
   * @param {Object} repository
   * @returns {Object} Save result
   */
  static async saveLeadScore(leadScore, repository) {
    try {
      if (repository.LeadScore && typeof repository.LeadScore.create === 'function') {
        const saved = await repository.LeadScore.create(leadScore);
        return { success: true, id: saved._id || saved.id };
      }
      
      if (typeof repository.saveLeadScore === 'function') {
        const saved = await repository.saveLeadScore(leadScore);
        return { success: true, id: saved._id || saved.id };
      }

      return { success: false, error: 'No save method available' };
    } catch (error) {
      console.error('Error saving lead score:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update candidate document with latest score
   * @param {String} candidateId
   * @param {Object} leadScore
   * @param {Object} repository
   * @returns {Object} Update result
   */
  static async updateCandidateWithScore(candidateId, leadScore, repository) {
    try {
      const updateData = {
        conversation_score: leadScore.scoreBreakdown.conversationScore,
        lead_temperature: leadScore.leadTemperature,
        engagement_score: leadScore.conversationMetrics.engagementScore,
        last_analyzed_at: new Date()
      };

      if (repository.Candidate && typeof repository.Candidate.updateById === 'function') {
        return await repository.Candidate.updateById(candidateId, updateData);
      }

      if (typeof repository.updateCandidate === 'function') {
        return await repository.updateCandidate(candidateId, updateData);
      }

      return { updated: false, reason: 'No update method available' };
    } catch (error) {
      console.warn('Could not update candidate with score:', error.message);
      return { updated: false, error: error.message };
    }
  }

  /**
   * Split array into chunks
   * @param {Array} array
   * @param {Number} chunkSize
   * @returns {Array}
   */
  static chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Run batch analysis with retry logic
   * @param {String} jobId
   * @param {Array} candidates
   * @param {Object} repository
   * @param {Number} attemptNumber
   * @returns {Object} Results
   */
  static async runWithRetry(jobId, candidates, repository, attemptNumber = 1) {
    try {
      return await this.processBatch(jobId, candidates, repository);
    } catch (error) {
      if (attemptNumber < this.CONFIG.retryAttempts) {
        console.warn(`⚠️ Batch process failed, retrying (${attemptNumber}/${this.CONFIG.retryAttempts})...`);
        await new Promise(resolve => 
          setTimeout(resolve, this.CONFIG.retryDelayMs * attemptNumber)
        );
        return this.runWithRetry(jobId, candidates, repository, attemptNumber + 1);
      }
      throw error;
    }
  }

  /**
   * Generate batch processing report
   * @param {Object} results - Results from processBatch
   * @returns {String} Formatted report
   */
  static generateReport(results) {
    const report = `
╔════════════════════════════════════════════════════════════╗
║         CONVERSATION BATCH PROCESSING REPORT               ║
╚════════════════════════════════════════════════════════════╝

Job ID: ${results.jobId}
Started: ${results.startedAt.toISOString()}
Completed: ${results.completedAt?.toISOString() || 'In Progress'}
Duration: ${results.processingTimeMs}ms

📊 STATISTICS
─────────────────────────────────────────────────────────────
Total Processed: ${results.processed}
Successfully Updated: ${results.updated}
Skipped: ${results.skipped}
Failed: ${results.failed}

Success Rate: ${((results.updated / results.processed) * 100).toFixed(1)}%

${results.errors.length > 0 ? `
⚠️ ERRORS (${results.errors.length})
─────────────────────────────────────────────────────────────
${results.errors.map(e => `• ${e.candidateId}: ${e.error}`).join('\n')}
` : ''}

📈 TEMPERATURE BREAKDOWN
─────────────────────────────────────────────────────────────
${this.getTemperatureBreakdown(results.processedCandidates)}

═════════════════════════════════════════════════════════════
    `;

    return report;
  }

  /**
   * Get breakdown of candidates by temperature
   * @param {Array} candidates
   * @returns {String}
   */
  static getTemperatureBreakdown(candidates) {
    const breakdown = {
      HOT: 0,
      WARM: 0,
      COLD: 0
    };

    candidates.forEach(c => {
      if (c.temperature) {
        breakdown[c.temperature]++;
      }
    });

    return `🔴 Hot:  ${breakdown.HOT}  |  🟡 Warm: ${breakdown.WARM}  |  🔵 Cold: ${breakdown.COLD}`;
  }
}

export default ConversationBatchProcessor;
