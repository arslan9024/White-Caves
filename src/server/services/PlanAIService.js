import logger from '../lib/logger.js';

/**
 * PlanAIService - Integrates with free open-source AI models
 * Supports DeepSeek API (free tier) and Ollama (local, privacy-first)
 */
class PlanAIService {
  constructor(aiModel = 'deepseek', deepseekApiKey = null, ollamaHost = 'http://localhost:11434') {
    this.aiModel = aiModel;
    this.deepseekApiKey = deepseekApiKey || process.env.DEEPSEEK_API_KEY;
    this.ollamaHost = ollamaHost;
    this.requestTimeout = 30000; // 30 seconds

    logger.info(`PlanAIService initialized with model: ${this.aiModel}`);
  }

  /**
   * Set AI model dynamically
   */
  setModel(model) {
    if (['deepseek', 'ollama'].includes(model)) {
      this.aiModel = model;
      logger.info(`AI model switched to: ${model}`);
    }
  }

  /**
   * Check DeepSeek API availability
   */
  async checkDeepseekAvailability() {
    return !!this.deepseekApiKey;
  }

  /**
   * Check Ollama availability
   */
  async checkOllamaAvailability() {
    try {
      const response = await fetch(`${this.ollamaHost}/api/tags`, {
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Check AI model availability
   */
  async checkModelAvailability() {
    try {
      if (this.aiModel === 'deepseek') {
        return this.deepseekApiKey ? true : false;
      }
      
      if (this.aiModel === 'ollama') {
        return await this.checkOllamaAvailability();
      }

      return false;
    } catch (error) {
      logger.warn('Failed to check model availability', { error: error.message });
      return false;
    }
  }

  /**
   * Generate content with AI
   */
  async generateContent(prompt, context = '') {
    try {
      if (this.aiModel === 'deepseek') {
        return await this.deepseekGenerate(prompt, context);
      }
      
      if (this.aiModel === 'ollama') {
        return await this.ollamaGenerate(prompt, context);
      }

      throw new Error('No valid AI model configured');
    } catch (error) {
      logger.error('Content generation failed', { error: error.message });
      throw error;
    }
  }

  /**
   * DeepSeek API integration (free tier)
   */
  async deepseekGenerate(prompt, context = '') {
    try {
      if (!this.deepseekApiKey) {
        throw new Error('DeepSeek API key not configured');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepseekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are Zoe, an executive AI assistant helping with business planning. Context: ${context}. Generate professional, actionable content. Format as markdown where appropriate.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 0.95
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`DeepSeek API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error('Invalid response from DeepSeek API');
      }

      logger.info('Content generated via DeepSeek');
      
      return {
        content: data.choices[0].message.content,
        model: 'deepseek',
        usage: data.usage || {}
      };
    } catch (error) {
      logger.error('DeepSeek generation failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Ollama local integration (privacy-first, no API key needed)
   */
  async ollamaGenerate(prompt, context = '') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

      const response = await fetch(`${this.ollamaHost}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: `System: You are Zoe, an executive AI assistant helping with business planning.
Context: ${context}

User: ${prompt}

Response:`,
          stream: false,
          temperature: 0.7,
          num_predict: 2000
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Invalid response from Ollama');
      }

      logger.info('Content generated via Ollama');
      
      return {
        content: data.response,
        model: 'ollama',
        eval_count: data.eval_count || 0
      };
    } catch (error) {
      logger.error('Ollama generation failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Improve existing plan content
   */
  async improvePlan(planContent, focusAreas = []) {
    const focusText = focusAreas.length > 0 
      ? `Focus on improving: ${focusAreas.join(', ')}.`
      : 'Improve overall quality.';

    const prompt = `Please improve this business plan document. ${focusText}

Original Plan:
${planContent}

Provide an improved version with better structure, clearer objectives, and more actionable items.`;

    return await this.generateContent(prompt, 'Plan improvement');
  }

  /**
   * Generate new plan from scratch
   */
  async generatePlan(planType, requirements = '') {
    const prompt = `Generate a comprehensive markdown document for a ${planType} business plan.
${requirements ? `Requirements: ${requirements}` : ''}

Include:
1. Executive Summary
2. Key Objectives
3. Core Activities
4. Success Metrics
5. Timeline
6. Resources Needed
7. Integration Points

Format as professional markdown with clear headers and actionable items.`;

    return await this.generateContent(prompt, `Creating ${planType} plan`);
  }

  /**
   * Summarize a plan
   */
  async summarizePlan(planContent) {
    const prompt = `Summarize this business plan in 5-7 bullet points covering:
1. Main objectives
2. Key actions
3. Success criteria
4. Timeline
5. Resources needed

Plan:
${planContent}`;

    return await this.generateContent(prompt, 'Plan summarization');
  }

  /**
   * Extract action items from plan
   */
  async extractActionItems(planContent) {
    const prompt = `Extract all actionable items from this plan and organize them by:
1. Priority (High/Medium/Low)
2. Owner/Department
3. Timeline
4. Success Criteria

Format as a structured markdown list.

Plan:
${planContent}`;

    return await this.generateContent(prompt, 'Action item extraction');
  }

  /**
   * Brainstorm ideas for a topic
   */
  async brainstormIdeas(topic, existingContext = '') {
    const contextText = existingContext ? `\nExisting context: ${existingContext}` : '';
    
    const prompt = `Brainstorm innovative ideas for: ${topic}${contextText}

Provide:
1. 5 novel concepts with descriptions
2. Implementation strategy for each
3. Potential challenges and risks
4. Success metrics
5. 30/60/90 day timeline

Format as detailed markdown.`;

    return await this.generateContent(prompt, `Brainstorming for ${topic}`);
  }
}

// Export singleton
let planAIServiceInstance = null;

export function getPlanAIService(aiModel = 'deepseek') {
  if (!planAIServiceInstance) {
    planAIServiceInstance = new PlanAIService(aiModel);
  }
  return planAIServiceInstance;
}

export default PlanAIService;
