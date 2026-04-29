/**
 * AI Ensemble Service
 * Multi-provider AI integration using Groq, Google AI, OpenRouter, and HuggingFace
 * All providers use OpenAI-compatible SDK format for consistency
 */

import axios from 'axios';

const PROVIDERS = {
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.1-70b-versatile',
    envKey: 'GROQ_API_KEY',
    priority: 1,
    maxTokens: 8192,
    description: 'Ultra-fast inference with Llama 3.1'
  },
  google: {
    name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.0-flash',
    envKey: 'GOOGLE_AI_KEY',
    priority: 2,
    maxTokens: 8192,
    description: 'Gemini 2.0 Flash - 1M tokens/day free'
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    envKey: 'OPENROUTER_API_KEY',
    priority: 3,
    maxTokens: 4096,
    description: '200+ models with free tier'
  },
  huggingface: {
    name: 'HuggingFace',
    baseUrl: 'https://router.huggingface.co/v1',
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    envKey: 'HF_TOKEN',
    priority: 4,
    maxTokens: 4096,
    description: 'Open source models'
  }
};

class AIEnsembleService {
  constructor() {
    this.providers = {};
    this.initializeProviders();
  }

  initializeProviders() {
    for (const [key, config] of Object.entries(PROVIDERS)) {
      const apiKey = process.env[config.envKey];
      if (apiKey) {
        this.providers[key] = {
          ...config,
          apiKey,
          available: true,
          lastError: null,
          successCount: 0,
          failureCount: 0
        };
        console.log(`✅ AI Provider initialized: ${config.name}`);
      } else {
        console.log(`⚠️ AI Provider not configured: ${config.name} (missing ${config.envKey})`);
      }
    }
  }

  getAvailableProviders() {
    return Object.entries(this.providers)
      .filter(([_, p]) => p.available)
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([key, provider]) => ({
        id: key,
        name: provider.name,
        model: provider.model,
        description: provider.description,
        stats: {
          success: provider.successCount,
          failure: provider.failureCount
        }
      }));
  }

  async callProvider(providerId, messages, options = {}) {
    const provider = this.providers[providerId];
    if (!provider || !provider.available) {
      throw new Error(`Provider ${providerId} not available`);
    }

    const { maxTokens = provider.maxTokens, temperature = 0.7 } = options;

    try {
      const response = await axios.post(
        `${provider.baseUrl}/chat/completions`,
        {
          model: provider.model,
          messages,
          max_tokens: maxTokens,
          temperature
        },
        {
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json',
            ...(providerId === 'openrouter' && {
              'HTTP-Referer': 'https://whitecaves.realestate',
              'X-Title': 'White Caves Real Estate'
            })
          },
          timeout: 60000
        }
      );

      provider.successCount++;
      return {
        success: true,
        provider: provider.name,
        model: provider.model,
        content: response.data.choices[0].message.content,
        usage: response.data.usage || {}
      };
    } catch (error) {
      provider.failureCount++;
      provider.lastError = error.message;
      
      console.error(`❌ ${provider.name} error:`, error.response?.data || error.message);
      
      return {
        success: false,
        provider: provider.name,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  async generateWithFallback(messages, options = {}) {
    const sortedProviders = Object.entries(this.providers)
      .filter(([_, p]) => p.available)
      .sort((a, b) => a[1].priority - b[1].priority);

    for (const [providerId, provider] of sortedProviders) {
      console.log(`🔄 Trying ${provider.name}...`);
      const result = await this.callProvider(providerId, messages, options);
      
      if (result.success) {
        console.log(`✅ Success with ${provider.name}`);
        return result;
      }
      
      console.log(`⚠️ ${provider.name} failed, trying next...`);
    }

    throw new Error('All AI providers failed');
  }

  async generateWithEnsemble(messages, options = {}) {
    const { 
      useParallel = false, 
      combineResults = false,
      preferredProvider = null 
    } = options;

    if (preferredProvider && this.providers[preferredProvider]?.available) {
      return this.callProvider(preferredProvider, messages, options);
    }

    if (!useParallel) {
      return this.generateWithFallback(messages, options);
    }

    const availableProviders = Object.entries(this.providers)
      .filter(([_, p]) => p.available)
      .slice(0, 3);

    const results = await Promise.allSettled(
      availableProviders.map(([id]) => this.callProvider(id, messages, options))
    );

    const successfulResults = results
      .filter(r => r.status === 'fulfilled' && r.value.success)
      .map(r => r.value);

    if (successfulResults.length === 0) {
      throw new Error('All parallel AI providers failed');
    }

    if (combineResults && successfulResults.length > 1) {
      return this.combineResponses(successfulResults, messages);
    }

    return successfulResults[0];
  }

  async combineResponses(results, originalMessages) {
    const combinedPrompt = `You are synthesizing multiple AI responses into one optimal answer.

Original question: ${originalMessages[originalMessages.length - 1]?.content || 'N/A'}

Responses from different AI models:
${results.map((r, i) => `--- Response ${i + 1} (${r.provider}) ---\n${r.content}`).join('\n\n')}

Please synthesize these responses into a single, comprehensive, and well-structured answer that takes the best elements from each response.`;

    const synthesisMessages = [
      { role: 'system', content: 'You are an expert at synthesizing and improving AI responses.' },
      { role: 'user', content: combinedPrompt }
    ];

    return this.generateWithFallback(synthesisMessages, { maxTokens: 4096 });
  }

  async generateSRS(analysisData, options = {}) {
    const { 
      detailLevel = 'standard',
      includeDiagrams = true,
      includeCompliance = true,
      format = 'markdown'
    } = options;

    const systemPrompt = `You are an expert Software Requirements Specification (SRS) document writer. 
Your task is to generate professional, comprehensive SRS documents following IEEE 830 standards.

Guidelines:
- Use clear, precise language
- Include all standard SRS sections
- Reference actual code analysis data provided
- Be specific about requirements, not generic
- Include functional and non-functional requirements
- Document all interfaces and integrations
- Add diagrams descriptions where appropriate
- Follow ${detailLevel} detail level`;

    const userPrompt = `Generate a complete Software Requirements Specification (SRS) document for the White Caves Real Estate Platform based on this code analysis:

## Project Analysis Data
${JSON.stringify(analysisData, null, 2)}

## Requirements
- Detail Level: ${detailLevel}
- Include Architecture Diagrams: ${includeDiagrams}
- Include Compliance Sections: ${includeCompliance}
- Output Format: ${format}

Generate a comprehensive SRS document with:
1. Introduction (Purpose, Scope, Definitions, References, Overview)
2. Overall Description (Product Perspective, Functions, User Characteristics, Constraints, Assumptions)
3. Specific Requirements (External Interfaces, Functional Requirements, Performance Requirements, Design Constraints)
4. System Features (detailed feature specifications based on analysis)
5. Data Requirements (based on models found)
6. Security Requirements
7. Appendices (API endpoints, component inventory)

Use the actual file counts, component names, and structure from the analysis data.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return this.generateWithEnsemble(messages, {
      maxTokens: 8192,
      temperature: 0.3,
      ...options
    });
  }

  async analyzeCode(codeContent, analysisType = 'quality') {
    const prompts = {
      quality: `Analyze this code for quality issues, best practices, and improvements:`,
      security: `Perform a security audit of this code, identifying vulnerabilities and risks:`,
      performance: `Analyze this code for performance issues and optimization opportunities:`,
      architecture: `Analyze the architectural patterns and design decisions in this code:`
    };

    const messages = [
      { 
        role: 'system', 
        content: 'You are an expert code reviewer specializing in React, Node.js, and MongoDB applications.' 
      },
      { 
        role: 'user', 
        content: `${prompts[analysisType] || prompts.quality}\n\n\`\`\`\n${codeContent}\n\`\`\`` 
      }
    ];

    return this.generateWithFallback(messages, { maxTokens: 2048, temperature: 0.2 });
  }

  async generateAuditReport(analysisData) {
    const systemPrompt = `You are a senior software architect performing a comprehensive audit.
Generate a detailed audit report with specific findings, scores, and actionable recommendations.`;

    const userPrompt = `Perform a comprehensive audit of this software project:

${JSON.stringify(analysisData, null, 2)}

Generate an audit report with:
1. Executive Summary
2. Code Quality Score (0-100) with breakdown
3. Architecture Compliance Assessment
4. Security Findings (Critical, High, Medium, Low)
5. Performance Analysis
6. Technical Debt Assessment
7. Dependency Analysis
8. Recommendations (prioritized)
9. Risk Assessment Matrix`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    return this.generateWithFallback(messages, { maxTokens: 4096, temperature: 0.2 });
  }

  getProviderStatus() {
    return Object.entries(this.providers).map(([id, p]) => ({
      id,
      name: p.name,
      available: p.available,
      model: p.model,
      priority: p.priority,
      stats: {
        success: p.successCount,
        failure: p.failureCount,
        lastError: p.lastError
      }
    }));
  }
}

export default new AIEnsembleService();
