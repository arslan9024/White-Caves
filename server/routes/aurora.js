/**
 * Aurora API Routes
 * Self-analysis, SRS generation, and component tracking endpoints
 */

import express from 'express';
import aiEnsembleService from '../services/aiEnsembleService.js';
import codeAnalysisService from '../services/codeAnalysisService.js';
import SRSDocument from '../models/SRSDocument.js';
import ComponentAnalysis from '../models/ComponentAnalysis.js';

const router = express.Router();

router.get('/providers', (req, res) => {
  try {
    const providers = aiEnsembleService.getProviderStatus();
    const available = aiEnsembleService.getAvailableProviders();
    
    res.json({
      success: true,
      providers,
      availableCount: available.length,
      available
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/analyze', async (req, res) => {
  try {
    const { refresh } = req.query;
    const forceRefresh = refresh === 'true';
    
    console.log(`📊 Starting code analysis (refresh: ${forceRefresh})...`);
    const analysis = await codeAnalysisService.performFullAnalysis(forceRefresh);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/analyze/summary', async (req, res) => {
  try {
    const summary = await codeAnalysisService.getSummary();
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/scan-components', async (req, res) => {
  try {
    const analysis = await codeAnalysisService.performFullAnalysis(true);
    const analysisRunId = `run_${Date.now()}`;
    
    const componentDocs = analysis.files
      .filter(f => f.type === 'component')
      .map(f => ({
        analysisRunId,
        componentPath: f.path,
        componentName: f.componentName,
        componentType: f.type,
        metrics: {
          lines: f.lines,
          size: f.size,
          exports: f.exports.length,
          imports: f.imports.length
        },
        eventHandlers: {
          total: f.eventHandlers.length,
          implemented: f.eventHandlers.filter(h => !h.isPlaceholder).length,
          placeholders: f.eventHandlers.filter(h => h.isPlaceholder).length,
          byType: f.eventHandlers.reduce((acc, h) => {
            acc[h.type] = (acc[h.type] || 0) + 1;
            return acc;
          }, {})
        },
        apiCalls: {
          total: f.apiCalls.length,
          endpoints: f.apiCalls.map(c => c.url)
        },
        reduxUsage: {
          usesSelector: f.reduxUsage.usesUseSelector,
          usesDispatch: f.reduxUsage.usesUseDispatch,
          actions: f.reduxUsage.actions
        },
        stateVariables: f.stateVariables,
        completion: {
          score: calculateComponentScore(f),
          status: determineComponentStatus(f),
          hasPlaceholders: f.hasPlaceholders,
          hasMockData: f.hasMockData,
          todoCount: f.hasTodos
        },
        dependencies: {
          internal: f.imports.filter(i => i.isRelative).map(i => i.source),
          external: f.dependencies
        }
      }));
    
    if (componentDocs.length > 0) {
      await ComponentAnalysis.insertMany(componentDocs);
    }
    
    res.json({
      success: true,
      analysisRunId,
      componentsAnalyzed: componentDocs.length,
      summary: await ComponentAnalysis.getCompletionSummary(analysisRunId)
    });
  } catch (error) {
    console.error('Component scan error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/components/completion', async (req, res) => {
  try {
    const latestComponent = await ComponentAnalysis.findOne()
      .sort({ createdAt: -1 })
      .select('analysisRunId');
    
    if (!latestComponent) {
      return res.json({
        success: true,
        message: 'No analysis data found',
        components: [],
        summary: {}
      });
    }
    
    const analysisRunId = latestComponent.analysisRunId;
    const components = await ComponentAnalysis.find({ analysisRunId })
      .sort({ 'completion.score': 1 });
    
    const summary = await ComponentAnalysis.getCompletionSummary(analysisRunId);
    
    res.json({
      success: true,
      analysisRunId,
      totalComponents: components.length,
      summary,
      components: components.map(c => ({
        name: c.componentName,
        path: c.componentPath,
        score: c.completion.score,
        status: c.completion.status,
        handlers: c.eventHandlers.total,
        placeholders: c.eventHandlers.placeholders,
        hasPlaceholders: c.completion.hasPlaceholders,
        hasMockData: c.completion.hasMockData
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/generate-srs', async (req, res) => {
  try {
    const {
      detailLevel = 'standard',
      format = 'markdown',
      includeDiagrams = true,
      includeCompliance = true,
      includeArabic = false,
    // Schema validation enforced for payload
    } = req.body;
    
    console.log('📝 Starting SRS generation...');
    const startTime = Date.now();
    
    const analysis = await codeAnalysisService.performFullAnalysis();
    
    const result = await aiEnsembleService.generateSRS(analysis, {
      detailLevel,
      includeDiagrams,
      includeCompliance,
      format,
      preferredProvider
    });
    
    if (!result.success) {
      throw new Error(result.error || 'SRS generation failed');
    }
    
    const generationTime = Date.now() - startTime;
    
    const latestDoc = await SRSDocument.getLatest();
    const newVersion = latestDoc 
      ? { 
          major: latestDoc.version.major, 
          minor: latestDoc.version.minor, 
          patch: latestDoc.version.patch + 1 
        }
      : { major: 1, minor: 0, patch: 0 };
    
    const srsDocument = new SRSDocument({
      version: newVersion,
      generationConfig: {
        detailLevel,
        format,
        includeDiagrams,
        includeCompliance,
        includeArabic
      },
      content: result.content,
      analysisSnapshot: {
        timestamp: new Date(analysis.timestamp),
        totalFiles: analysis.summary.totalFiles,
        totalLines: analysis.summary.totalLines,
        components: analysis.components.total,
        routes: analysis.routes.total,
        models: analysis.models.total,
        services: analysis.services.total,
        completionScore: analysis.codeQuality.completionScore
      },
      generatedBy: {
        provider: result.provider,
        model: result.model,
        tokensUsed: result.usage?.total_tokens || 0,
        generationTime
      },
      changeLog: [{
        version: `${newVersion.major}.${newVersion.minor}.${newVersion.patch}`,
        changes: 'Initial generation',
        author: 'Aurora'
      }]
    });
    
    await srsDocument.save();
    
    console.log(`✅ SRS generated in ${generationTime}ms by ${result.provider}`);
    
    res.json({
      success: true,
      document: {
        id: srsDocument._id,
        documentId: srsDocument.documentId,
        version: srsDocument.versionString,
        title: srsDocument.title,
        generatedBy: srsDocument.generatedBy,
        analysisSnapshot: srsDocument.analysisSnapshot,
        createdAt: srsDocument.createdAt
      },
      content: result.content
    });
  } catch (error) {
    console.error('SRS generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/srs', async (req, res) => {
  try {
    const { status, limit = 20 } = req.query;
    
    const query = status ? { status } : {};
    const documents = await SRSDocument.find(query)
      .select('documentId versionString title status generatedBy analysisSnapshot createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: documents.length,
      documents
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/srs/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const document = await SRSDocument.findOne({ documentId });
    
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }
    
    res.json({
      success: true,
      document
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/srs-latest', async (req, res) => {
  try {
    const document = await SRSDocument.getLatest();
    
    if (!document) {
      return res.json({ 
        success: true, 
        document: null,
        message: 'No SRS documents generated yet'
      });
    }
    
    res.json({
      success: true,
      document
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/audit', async (req, res) => {
  try {
    console.log('🔍 Starting system audit...');
    const startTime = Date.now();
    
    const analysis = await codeAnalysisService.performFullAnalysis(true);
    const result = await aiEnsembleService.generateAuditReport(analysis);
    
    if (!result.success) {
      throw new Error(result.error || 'Audit generation failed');
    }
    
    res.json({
      success: true,
      provider: result.provider,
      model: result.model,
      duration: Date.now() - startTime,
      report: result.content,
      analysisData: {
        totalFiles: analysis.summary.totalFiles,
        completionScore: analysis.codeQuality.completionScore,
        components: analysis.components.total,
        todos: analysis.codeQuality.totalTodos
      }
    });
  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/scan-actions', async (req, res) => {
  try {
    const analysis = await codeAnalysisService.performFullAnalysis();
    
    const actionCatalog = analysis.files
      .filter(f => f.eventHandlers && f.eventHandlers.length > 0)
      .map(f => ({
        component: f.componentName,
        path: f.path,
        type: f.type,
        actions: f.eventHandlers.map(h => ({
          type: h.type,
          handler: h.handler,
          isInline: h.isInlineFunction,
          isPlaceholder: h.isPlaceholder,
          status: h.isPlaceholder ? 'placeholder' : 'implemented'
        }))
      }));
    
    const summary = {
      totalComponents: actionCatalog.length,
      totalActions: actionCatalog.reduce((sum, c) => sum + c.actions.length, 0),
      implemented: actionCatalog.reduce((sum, c) => 
        sum + c.actions.filter(a => !a.isPlaceholder).length, 0),
      placeholders: actionCatalog.reduce((sum, c) => 
        sum + c.actions.filter(a => a.isPlaceholder).length, 0),
      byType: analysis.eventHandlers.byType
    };
    
    res.json({
      success: true,
      summary,
      catalog: actionCatalog
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function calculateComponentScore(file) {
  let score = 100;
  
  if (file.hasPlaceholders) score -= 15;
  if (file.hasMockData) score -= 10;
  if (file.hasTodos > 0) score -= Math.min(file.hasTodos * 2, 10);
  
  const totalHandlers = file.eventHandlers.length;
  if (totalHandlers > 0) {
    const placeholderRatio = file.eventHandlers.filter(h => h.isPlaceholder).length / totalHandlers;
    score -= placeholderRatio * 25;
  }
  
  return Math.max(0, Math.round(score));
}

function determineComponentStatus(file) {
  const score = calculateComponentScore(file);
  if (score >= 90) return 'complete';
  if (score >= 50) return 'partial';
  if (score >= 10) return 'under-construction';
  return 'empty';
}

export default router;
