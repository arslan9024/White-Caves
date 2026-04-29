import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import logger from '../lib/logger.js';

/**
 * PlanService - Handles CRUD operations for markdown plan files
 * Plans are stored in the /plans directory with YAML frontmatter metadata
 */
class PlanService {
  constructor(plansFolder = './plans') {
    this.plansFolder = plansFolder;
    this.plansIndex = new Map();
    this.initializePlansFolder();
  }

  /**
   * Initialize plans folder and index existing plans
   */
  async initializePlansFolder() {
    try {
      // Ensure plans folder exists
      await fs.ensureDir(this.plansFolder);
      
      // Index existing plans
      await this.indexPlans();
      
      logger.info(`PlanService initialized with ${this.plansIndex.size} plans`);
    } catch (error) {
      logger.error('PlanService initialization failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Index all existing plans
   */
  async indexPlans() {
    try {
      const files = await fs.readdir(this.plansFolder);
      const mdFiles = files.filter(f => f.endsWith('.md'));

      for (const file of mdFiles) {
        try {
          const filepath = path.join(this.plansFolder, file);
          const content = await fs.readFile(filepath, 'utf8');
          const { data: metadata } = matter(content);

          const planId = metadata.id || uuidv4();
          
          this.plansIndex.set(planId, {
            id: planId,
            filename: file,
            filepath,
            metadata: {
              ...metadata,
              id: planId,
              created: metadata.created || new Date().toISOString(),
              updated: metadata.updated || new Date().toISOString()
            },
            preview: content.substring(0, 200)
          });
        } catch (error) {
          logger.warn(`Failed to index plan: ${file}`, { error: error.message });
        }
      }
    } catch (error) {
      logger.error('Plan indexing failed', { error: error.message });
      throw error;
    }
  }

  /**
   * CREATE - Create a new plan
   */
  async createPlan(filename, content, metadata = {}) {
    try {
      const planId = metadata.id || uuidv4();
      const filepath = path.join(this.plansFolder, filename);

      // Prepare frontmatter
      const frontmatter = {
        id: planId,
        title: metadata.title || filename.replace('.md', ''),
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        tags: metadata.tags || [],
        status: metadata.status || 'draft',
        aiImproved: false,
        ...metadata,
        id: planId // Ensure ID is set
      };

      // Write file with frontmatter
      const fileContent = matter.stringify(content, frontmatter);
      await fs.writeFile(filepath, fileContent, 'utf8');

      // Update index
      this.plansIndex.set(planId, {
        id: planId,
        filename,
        filepath,
        metadata: frontmatter,
        preview: content.substring(0, 200)
      });

      logger.info(`Plan created: ${filename}`, { planId });
      
      return {
        success: true,
        id: planId,
        filename,
        message: 'Plan created successfully'
      };
    } catch (error) {
      logger.error('Failed to create plan', { error: error.message });
      throw error;
    }
  }

  /**
   * READ - Read a plan by ID or filename
   */
  async readPlan(identifier) {
    try {
      let filepath;
      let planId;

      // Determine if identifier is filename or ID
      if (identifier.includes('.md')) {
        filepath = path.join(this.plansFolder, identifier);
        const entry = Array.from(this.plansIndex.values()).find(p => p.filename === identifier);
        planId = entry?.id || identifier.replace('.md', '');
      } else {
        const entry = this.plansIndex.get(identifier);
        if (!entry) {
          throw new Error(`Plan not found: ${identifier}`);
        }
        filepath = entry.filepath;
        planId = identifier;
      }

      // Read file
      const fileContent = await fs.readFile(filepath, 'utf8');
      const { data: metadata, content } = matter(fileContent);

      logger.info(`Plan read: ${planId}`);

      return {
        id: planId,
        metadata: { ...metadata, id: planId },
        content,
        raw: fileContent,
        filepath
      };
    } catch (error) {
      logger.error('Failed to read plan', { error: error.message });
      throw error;
    }
  }

  /**
   * UPDATE - Update a plan
   */
  async updatePlan(identifier, updates) {
    try {
      const plan = await this.readPlan(identifier);

      const updatedMetadata = {
        ...plan.metadata,
        ...updates.metadata,
        updated: new Date().toISOString(),
        id: plan.id
      };

      const updatedContent = updates.content || plan.content;
      const fileContent = matter.stringify(updatedContent, updatedMetadata);

      // Write updated file
      await fs.writeFile(plan.filepath, fileContent, 'utf8');

      // Update index
      this.plansIndex.set(plan.id, {
        id: plan.id,
        filename: path.basename(plan.filepath),
        filepath: plan.filepath,
        metadata: updatedMetadata,
        preview: updatedContent.substring(0, 200)
      });

      logger.info(`Plan updated: ${plan.id}`);

      return {
        success: true,
        id: plan.id,
        message: 'Plan updated successfully'
      };
    } catch (error) {
      logger.error('Failed to update plan', { error: error.message });
      throw error;
    }
  }

  /**
   * DELETE - Delete a plan
   */
  async deletePlan(identifier) {
    try {
      const plan = await this.readPlan(identifier);

      // Delete file
      await fs.remove(plan.filepath);

      // Remove from index
      this.plansIndex.delete(plan.id);

      logger.info(`Plan deleted: ${plan.id}`);

      return {
        success: true,
        id: plan.id,
        message: 'Plan deleted successfully'
      };
    } catch (error) {
      logger.error('Failed to delete plan', { error: error.message });
      throw error;
    }
  }

  /**
   * LIST - List all plans with optional filtering
   */
  async listPlans(filter = {}) {
    try {
      const plans = Array.from(this.plansIndex.values());

      let filtered = plans;

      // Filter by status
      if (filter.status) {
        filtered = filtered.filter(p => p.metadata.status === filter.status);
      }

      // Filter by tags
      if (filter.tags && filter.tags.length > 0) {
        filtered = filtered.filter(p => {
          const planTags = p.metadata.tags || [];
          return filter.tags.some(tag => planTags.includes(tag));
        });
      }

      // Filter by search text
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filtered = filtered.filter(p => {
          const searchable = [
            p.metadata.title || '',
            p.metadata.tags?.join(' ') || '',
            p.preview
          ].join(' ').toLowerCase();
          return searchable.includes(searchLower);
        });
      }

      // Sort by updated date (newest first)
      filtered.sort((a, b) => 
        new Date(b.metadata.updated) - new Date(a.metadata.updated)
      );

      logger.info(`Listed ${filtered.length} plans`);

      return filtered.map(p => ({
        id: p.id,
        filename: p.filename,
        title: p.metadata.title || p.filename,
        status: p.metadata.status || 'draft',
        tags: p.metadata.tags || [],
        created: p.metadata.created,
        updated: p.metadata.updated,
        aiImproved: p.metadata.aiImproved || false,
        preview: p.preview
      }));
    } catch (error) {
      logger.error('Failed to list plans', { error: error.message });
      throw error;
    }
  }

  /**
   * SEARCH - Search within plans
   */
  async searchPlans(query) {
    try {
      const plans = Array.from(this.plansIndex.values());
      const results = [];

      const queryLower = query.toLowerCase();

      for (const plan of plans) {
        let score = 0;

        // Title match (highest weight)
        if (plan.metadata.title?.toLowerCase().includes(queryLower)) {
          score += 10;
        }

        // Tags match
        if (plan.metadata.tags?.some(tag => tag.toLowerCase().includes(queryLower))) {
          score += 5;
        }

        // Content preview match
        if (plan.preview.toLowerCase().includes(queryLower)) {
          score += 2;
        }

        if (score > 0) {
          results.push({
            id: plan.id,
            filename: plan.filename,
            title: plan.metadata.title,
            score,
            preview: plan.preview,
            status: plan.metadata.status
          });
        }
      }

      // Sort by relevance score
      results.sort((a, b) => b.score - a.score);

      logger.info(`Search "${query}" returned ${results.length} results`);

      return results;
    } catch (error) {
      logger.error('Plan search failed', { error: error.message });
      throw error;
    }
  }

  /**
   * MERGE - Merge multiple plans into one
   */
  async mergePlans(planIds, outputFilename, metadata = {}) {
    try {
      let mergedContent = `# Merged Plans\n\nGenerated: ${new Date().toLocaleString()}\n\n`;
      const sourceMetadata = {
        merged_from: [],
        merged_date: new Date().toISOString()
      };

      // Collect content from each plan
      for (const planId of planIds) {
        try {
          const plan = await this.readPlan(planId);
          mergedContent += `## ${plan.metadata.title || planId}\n\n`;
          mergedContent += plan.content + '\n\n---\n\n';
          
          sourceMetadata.merged_from.push({
            id: planId,
            title: plan.metadata.title
          });
        } catch (error) {
          logger.warn(`Failed to merge plan ${planId}`, { error: error.message });
        }
      }

      // Create merged plan
      return await this.createPlan(outputFilename, mergedContent, {
        ...metadata,
        ...sourceMetadata,
        tags: ['merged', ...(metadata.tags || [])]
      });
    } catch (error) {
      logger.error('Plan merge failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Get plan statistics
   */
  async getPlanStats() {
    try {
      const plans = Array.from(this.plansIndex.values());
      
      const stats = {
        totalPlans: plans.length,
        byStatus: {},
        byTag: {},
        totalWords: 0,
        averageWords: 0
      };

      for (const plan of plans) {
        // Count by status
        const status = plan.metadata.status || 'draft';
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

        // Count by tags
        if (plan.metadata.tags) {
          plan.metadata.tags.forEach(tag => {
            stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
          });
        }

        // Count words
        const wordCount = plan.preview.split(/\s+/).length;
        stats.totalWords += wordCount;
      }

      stats.averageWords = plans.length > 0 ? Math.round(stats.totalWords / plans.length) : 0;

      logger.info('Plan statistics calculated');

      return stats;
    } catch (error) {
      logger.error('Failed to calculate plan stats', { error: error.message });
      throw error;
    }
  }
}

// Export singleton instance
let planServiceInstance = null;

export async function getPlanService() {
  if (!planServiceInstance) {
    planServiceInstance = new PlanService('./plans');
    await planServiceInstance.initializePlansFolder();
  }
  return planServiceInstance;
}

export default PlanService;
