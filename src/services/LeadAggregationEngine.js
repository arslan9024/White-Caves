/**
 * LeadAggregationEngine
 * 
 * Unified lead management across all property portals:
 * - Bayut
 * - PropertyFinder
 * - Dubizzle
 * - Skyloov
 * 
 * Features:
 * - Real-time lead ingestion from multiple sources
 * - Duplicate detection and deduplication
 * - Lead scoring and qualification
 * - Automatic assignment to agents
 * - Lead enrichment with external data
 * - Bulk operations and batch processing
 */

import { BayutAdapter } from './BayutAdapter';
import { PropertyFinderAdapter } from './PropertyFinderAdapter';
import { DubizzleAdapter } from './DubizzleAdapter';
import { SkyloovAdapter } from './SkyloovAdapter';

export class LeadAggregationEngine {
  constructor() {
    this.adapters = {
      bayut: new BayutAdapter(),
      propertyfinder: new PropertyFinderAdapter(),
      dubizzle: new DubizzleAdapter(),
      skyloov: new SkyloovAdapter()
    };

    this.leads = [];
    this.deduplicationRules = [];
    this.scoringRules = [];
    this.assignmentRules = [];
    this.isProcessing = false;
    this.lastSync = null;
    this.syncInterval = 5 * 60 * 1000; // 5 minutes
    this.webhookHandlers = {};
  }

  /**
   * Initialize all adapters
   */
  async initialize(credentials = {}) {
    console.log('[LeadAggregationEngine] Initializing adapters...');

    const results = {};

    for (const [portalName, adapter] of Object.entries(this.adapters)) {
      try {
        if (credentials[portalName]) {
          await adapter.connect(credentials[portalName]);
          results[portalName] = { success: true, message: 'Connected' };
          console.log(`[LeadAggregationEngine] ${portalName} initialized`);
        } else {
          results[portalName] = { success: false, message: 'No credentials provided' };
        }
      } catch (error) {
        results[portalName] = { success: false, message: error.message };
        console.error(`[LeadAggregationEngine] ${portalName} failed:`, error.message);
      }
    }

    return results;
  }

  /**
   * Get adapter by name
   */
  getAdapter(portalName) {
    return this.adapters[portalName.toLowerCase()] || null;
  }

  /**
   * Fetch all leads from all portals
   */
  async fetchAllLeads(filters = {}) {
    console.log('[LeadAggregationEngine] Fetching leads from all portals...');

    const leadsByPortal = {};

    const results = await Promise.allSettled(
      Object.entries(this.adapters).map(async ([portalName, adapter]) => {
        if (!adapter.isConnected) {
          console.warn(`[LeadAggregationEngine] ${portalName} not connected, skipping`);
          return null;
        }

        try {
          const leads = await adapter.getLeads(filters);
          leadsByPortal[portalName] = leads;
          console.log(`[LeadAggregationEngine] Fetched ${leads.length} leads from ${portalName}`);
          return { portal: portalName, count: leads.length };
        } catch (error) {
          console.error(`[LeadAggregationEngine] Error fetching from ${portalName}:`, error.message);
          return null;
        }
      })
    );

    return leadsByPortal;
  }

  /**
   * Add deduplication rule
   */
  addDeduplicationRule(rule) {
    /**
     * rule = {
     *   name: 'email_match',
     *   fields: ['email'],
     *   priority: 100,
     *   action: 'merge' | 'ignore_new' | 'update_existing'
     * }
     */
    this.deduplicationRules.push({
      ...rule,
      priority: rule.priority || 50
    });

    // Sort by priority (highest first)
    this.deduplicationRules.sort((a, b) => b.priority - a.priority);

    console.log(`[LeadAggregationEngine] Added deduplication rule: ${rule.name}`);
  }

  /**
   * Add scoring rule
   */
  addScoringRule(rule) {
    /**
     * rule = {
     *   name: 'has_phone',
     *   condition: (lead) => lead.phone && lead.phone.length > 0,
     *   points: 10
     * }
     */
    this.scoringRules.push(rule);
    console.log(`[LeadAggregationEngine] Added scoring rule: ${rule.name}`);
  }

  /**
   * Add assignment rule
   */
  addAssignmentRule(rule) {
    /**
     * rule = {
     *   name: 'auto_assign_to_agent',
     *   condition: (lead) => lead.score > 50,
     *   assignTo: (lead) => selectedAgent.id,
     *   priority: (lead) => lead.score
     * }
     */
    this.assignmentRules.push(rule);
    console.log(`[LeadAggregationEngine] Added assignment rule: ${rule.name}`);
  }

  /**
   * Setup default rules
   */
  setupDefaultRules() {
    // Deduplication rules
    this.addDeduplicationRule({
      name: 'exact_email_match',
      fields: ['email'],
      priority: 100,
      action: 'merge',
      merge: (existingLead, newLead) => ({
        ...existingLead,
        lastContactDate: newLead.createdAt > existingLead.lastContactDate ? newLead.createdAt : existingLead.lastContactDate,
        portals: [...new Set([...existingLead.portals || [], newLead.portalId])],
        contactCount: (existingLead.contactCount || 0) + 1
      })
    });

    this.addDeduplicationRule({
      name: 'phone_and_name_match',
      fields: ['phone', 'name'],
      priority: 80,
      action: 'merge'
    });

    this.addDeduplicationRule({
      name: 'email_domain_and_phone',
      fields: ['email_domain', 'phone'],
      priority: 60,
      action: 'merge'
    });

    // Scoring rules
    this.addScoringRule({
      name: 'has_email',
      condition: (lead) => lead.email && lead.email.length > 0,
      points: 20
    });

    this.addScoringRule({
      name: 'has_phone',
      condition: (lead) => lead.phone && lead.phone.length > 0,
      points: 20
    });

    this.addScoringRule({
      name: 'has_message',
      condition: (lead) => lead.message && lead.message.length > 10,
      points: 15
    });

    this.addScoringRule({
      name: 'from_trusted_portal',
      condition: (lead) => ['bayut', 'propertyfinder'].includes(lead.portalId),
      points: 25
    });

    this.addScoringRule({
      name: 'verified_contact',
      condition: (lead) => lead.verified === true,
      points: 30
    });

    this.addScoringRule({
      name: 'quick_response_required',
      condition: (lead) => {
        const age = Date.now() - new Date(lead.createdAt).getTime();
        return age < 3600000; // Less than 1 hour
      },
      points: 20
    });

    console.log('[LeadAggregationEngine] Default rules configured');
  }

  /**
   * Deduplicate leads
   */
  async deduplicateLeads(leads) {
    console.log(`[LeadAggregationEngine] Deduplicating ${leads.length} leads...`);

    const deduplicated = [];
    const duplicateMap = new Map();

    for (const lead of leads) {
      let isDuplicate = false;
      let matchedRule = null;

      for (const rule of this.deduplicationRules) {
        const key = this.generateDeduplicationKey(lead, rule.fields);

        if (duplicateMap.has(key)) {
          isDuplicate = true;
          matchedRule = rule;
          const existingLead = duplicateMap.get(key);

          if (rule.action === 'merge' && rule.merge) {
            const merged = rule.merge(existingLead, lead);
            duplicateMap.set(key, merged);
          }

          console.log(`[LeadAggregationEngine] Duplicate detected (${rule.name}): ${key}`);
          break;
        }
      }

      if (!isDuplicate) {
        deduplicated.push(lead);
        const key = this.generateDeduplicationKey(lead, this.deduplicationRules[0]?.fields || ['email']);
        duplicateMap.set(key, lead);
      }
    }

    console.log(`[LeadAggregationEngine] Deduplicated ${leads.length} → ${deduplicated.length} leads`);
    return deduplicated;
  }

  /**
   * Generate deduplication key
   */
  generateDeduplicationKey(lead, fields) {
    return fields
      .map(field => {
        if (field === 'email_domain') {
          return lead.email?.split('@')[1] || '';
        }
        return lead[field] || '';
      })
      .filter(v => v)
      .join('|')
      .toLowerCase();
  }

  /**
   * Score leads
   */
  scoreLead(lead) {
    let score = 0;

    for (const rule of this.scoringRules) {
      if (rule.condition(lead)) {
        score += rule.points;
      }
    }

    return Math.min(100, score); // Cap at 100
  }

  /**
   * Score all leads
   */
  scoreLeads(leads) {
    return leads.map(lead => ({
      ...lead,
      score: this.scoreLead(lead),
      rating: this.getLeadRating(this.scoreLead(lead))
    }));
  }

  /**
   * Get lead rating
   */
  getLeadRating(score) {
    if (score >= 80) return '⭐⭐⭐⭐⭐ Excellent';
    if (score >= 60) return '⭐⭐⭐⭐ Very Good';
    if (score >= 40) return '⭐⭐⭐ Good';
    if (score >= 20) return '⭐⭐ Fair';
    return '⭐ Poor';
  }

  /**
   * Assign leads to agents
   */
  assignLeadsToAgents(leads, agents = []) {
    return leads.map(lead => {
      let assignedAgent = null;
      let assignmentReason = 'no_rule_matched';

      for (const rule of this.assignmentRules) {
        if (rule.condition(lead)) {
          const agentId = rule.assignTo(lead);
          assignedAgent = agents.find(a => a.id === agentId);
          assignmentReason = rule.name;
          break;
        }
      }

      return {
        ...lead,
        assignedAgent,
        assignmentReason,
        assignedAt: assignedAgent ? new Date().toISOString() : null
      };
    });
  }

  /**
   * Aggregate all leads from all portals
   */
  async aggregateLeads(filters = {}) {
    if (this.isProcessing) {
      console.warn('[LeadAggregationEngine] Aggregation already in progress');
      return null;
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      console.log('[LeadAggregationEngine] Starting lead aggregation...');

      // Step 1: Fetch leads from all portals
      const leadsByPortal = await this.fetchAllLeads(filters);

      // Step 2: Flatten and combine
      const allLeads = Object.values(leadsByPortal).flat();
      console.log(`[LeadAggregationEngine] Total leads fetched: ${allLeads.length}`);

      // Step 3: Deduplicate
      const deduplicated = await this.deduplicateLeads(allLeads);

      // Step 4: Score
      const scored = this.scoreLeads(deduplicated);

      // Step 5: Store
      this.leads = scored;
      this.lastSync = new Date().toISOString();

      const duration = Date.now() - startTime;
      console.log(`[LeadAggregationEngine] Aggregation completed in ${duration}ms`);

      return {
        success: true,
        timestamp: this.lastSync,
        duration,
        portalCounts: Object.entries(leadsByPortal).reduce((acc, [portal, leads]) => {
          acc[portal] = leads.length;
          return acc;
        }, {}),
        totalFetched: allLeads.length,
        afterDeduplication: deduplicated.length,
        currentLeads: scored.length
      };
    } catch (error) {
      console.error('[LeadAggregationEngine] Aggregation failed:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Start auto-aggregation
   */
  startAutoAggregation(interval = this.syncInterval) {
    if (this.autoAggregationInterval) {
      clearInterval(this.autoAggregationInterval);
    }

    console.log(`[LeadAggregationEngine] Starting auto-aggregation every ${interval / 1000}s`);

    this.autoAggregationInterval = setInterval(() => {
      this.aggregateLeads().catch(err =>
        console.error('[LeadAggregationEngine] Auto-aggregation error:', err)
      );
    }, interval);

    // Initial aggregation
    this.aggregateLeads();
  }

  /**
   * Stop auto-aggregation
   */
  stopAutoAggregation() {
    if (this.autoAggregationInterval) {
      clearInterval(this.autoAggregationInterval);
      this.autoAggregationInterval = null;
      console.log('[LeadAggregationEngine] Auto-aggregation stopped');
    }
  }

  /**
   * Get leads by score range
   */
  getLeadsByScoreRange(minScore, maxScore) {
    return this.leads.filter(lead => lead.score >= minScore && lead.score <= maxScore);
  }

  /**
   * Get hot leads (high score)
   */
  getHotLeads(threshold = 70) {
    return this.leads.filter(lead => lead.score >= threshold).sort((a, b) => b.score - a.score);
  }

  /**
   * Get leads by portal
   */
  getLeadsByPortal(portalId) {
    return this.leads.filter(lead => lead.portalId === portalId);
  }

  /**
   * Get leads by assignment status
   */
  getUnassignedLeads() {
    return this.leads.filter(lead => !lead.assignedAgent);
  }

  /**
   * Get aggregation status
   */
  getStatus() {
    const hotLeads = this.getHotLeads();
    const unassigned = this.getUnassignedLeads();

    return {
      isProcessing: this.isProcessing,
      lastSync: this.lastSync,
      totalLeads: this.leads.length,
      hotLeads: hotLeads.length,
      unassignedLeads: unassigned.length,
      portalBreakdown: {
        bayut: this.getLeadsByPortal('bayut').length,
        propertyfinder: this.getLeadsByPortal('propertyfinder').length,
        dubizzle: this.getLeadsByPortal('dubizzle').length,
        skyloov: this.getLeadsByPortal('skyloov').length
      },
      adapterHealth: Object.entries(this.adapters).reduce((acc, [name, adapter]) => {
        acc[name] = adapter.getSyncStatus();
        return acc;
      }, {})
    };
  }

  /**
   * Setup webhook for real-time lead updates
   */
  async setupWebhooks(webhookUrl) {
    console.log('[LeadAggregationEngine] Setting up webhooks...');

    const results = {};

    for (const [portalName, adapter] of Object.entries(this.adapters)) {
      if (!adapter.isConnected) continue;

      try {
        const result = await adapter.setupWebhook(webhookUrl, [
          'property.created',
          'property.updated',
          'lead.created'
        ]);

        results[portalName] = { success: true, webhookId: result?.id };
        console.log(`[LeadAggregationEngine] Webhook configured for ${portalName}`);
      } catch (error) {
        results[portalName] = { success: false, error: error.message };
        console.error(`[LeadAggregationEngine] Webhook setup failed for ${portalName}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Handle webhook payload from any portal
   */
  async handleWebhookPayload(portalName, payload) {
    const adapter = this.getAdapter(portalName);
    if (!adapter) {
      throw new Error(`Unknown portal: ${portalName}`);
    }

    try {
      const result = await adapter.handleWebhookPayload(payload);

      if (result.type === 'lead') {
        console.log('[LeadAggregationEngine] New lead from webhook:', result.data.id);
        // Re-aggregate to include new lead
        await this.aggregateLeads();
      }

      return result;
    } catch (error) {
      console.error('[LeadAggregationEngine] Webhook handling failed:', error.message);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const scores = this.leads.map(l => l.score);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;

    return {
      totalLeads: this.leads.length,
      averageScore: Math.round(avgScore),
      highestScore: Math.max(...scores, 0),
      lowestScore: Math.min(...scores, 0),
      scoreDistribution: {
        excellent: this.getLeadsByScoreRange(80, 100).length,
        veryGood: this.getLeadsByScoreRange(60, 79).length,
        good: this.getLeadsByScoreRange(40, 59).length,
        fair: this.getLeadsByScoreRange(20, 39).length,
        poor: this.getLeadsByScoreRange(0, 19).length
      }
    };
  }
}

export default LeadAggregationEngine;
