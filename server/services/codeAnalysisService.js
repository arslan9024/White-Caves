/**
 * Code Analysis Service
 * Real static code analysis - scans actual project files
 * for components, routes, models, services, Redux slices
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CodeAnalysisService {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.analysisCache = null;
    this.lastAnalysisTime = null;
    this.cacheValidityMs = 5 * 60 * 1000;
  }

  async walkDirectory(dir, fileList = [], extensions = ['.js', '.jsx', '.ts', '.tsx', '.css']) {
    try {
      const files = await fs.readdir(dir, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          if (['node_modules', '.git', 'dist', 'build', '.cache', 'coverage'].includes(file.name)) {
            continue;
          }
          await this.walkDirectory(filePath, fileList, extensions);
        } else {
          const ext = path.extname(file.name);
          if (extensions.includes(ext)) {
            fileList.push(filePath);
          }
        }
      }
    } catch (error) {
      console.error(`Error walking directory ${dir}:`, error.message);
    }
    
    return fileList;
  }

  async analyzeFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(this.projectRoot, filePath);
      const ext = path.extname(filePath);
      const fileName = path.basename(filePath);
      
      const analysis = {
        path: relativePath,
        name: fileName,
        extension: ext,
        lines: content.split('\n').length,
        size: content.length,
        type: this.determineFileType(filePath, content),
        isReactComponent: this.isReactComponent(content),
        componentName: this.extractComponentName(content, fileName),
        exports: this.extractExports(content),
        imports: this.extractImports(content),
        eventHandlers: this.extractEventHandlers(content),
        apiCalls: this.extractAPICalls(content),
        reduxUsage: this.extractReduxUsage(content),
        stateVariables: this.extractStateVariables(content),
        hasPlaceholders: this.hasPlaceholders(content),
        hasTodos: this.countTodos(content),
        hasMockData: this.hasMockData(content),
        dependencies: this.extractDependencies(content)
      };
      
      return analysis;
    } catch (error) {
      console.error(`Error analyzing file ${filePath}:`, error.message);
      return null;
    }
  }

  determineFileType(filePath, content) {
    const relativePath = path.relative(this.projectRoot, filePath);
    const fileName = path.basename(filePath);
    
    if (relativePath.includes('components/')) return 'component';
    if (relativePath.includes('pages/') || relativePath.includes('views/')) return 'page';
    if (relativePath.includes('routes/')) return 'route';
    if (relativePath.includes('models/')) return 'model';
    if (relativePath.includes('services/')) return 'service';
    if (relativePath.includes('slices/') || fileName.includes('Slice')) return 'redux-slice';
    if (relativePath.includes('store/')) return 'store';
    if (relativePath.includes('config/')) return 'config';
    if (relativePath.includes('hooks/') || fileName.startsWith('use')) return 'hook';
    if (relativePath.includes('utils/') || relativePath.includes('helpers/')) return 'utility';
    if (relativePath.includes('middleware/')) return 'middleware';
    if (fileName.endsWith('.css')) return 'stylesheet';
    if (fileName.endsWith('.test.js') || fileName.endsWith('.spec.js')) return 'test';
    
    if (content.includes('mongoose.Schema') || content.includes('new Schema')) return 'model';
    if (content.includes('createSlice') || content.includes('createAsyncThunk')) return 'redux-slice';
    if (content.includes('express.Router()')) return 'route';
    if (content.includes('export default function') && this.isReactComponent(content)) return 'component';
    
    return 'other';
  }

  isReactComponent(content) {
    return (
      content.includes('import React') ||
      content.includes("from 'react'") ||
      content.includes('from "react"') ||
      content.includes('useState') ||
      content.includes('useEffect') ||
      (content.includes('return (') && (content.includes('<div') || content.includes('<>')))
    );
  }

  extractComponentName(content, fileName) {
    const exportMatch = content.match(/export\s+(?:default\s+)?(?:function|const|class)\s+(\w+)/);
    if (exportMatch) return exportMatch[1];
    
    const funcMatch = content.match(/(?:function|const)\s+(\w+)\s*[=(]/);
    if (funcMatch) return funcMatch[1];
    
    return fileName.replace(/\.(jsx?|tsx?)$/, '');
  }

  extractExports(content) {
    const exports = [];
    
    const namedExports = content.match(/export\s+(?:const|function|class|let|var)\s+(\w+)/g) || [];
    namedExports.forEach(exp => {
      const name = exp.match(/export\s+(?:const|function|class|let|var)\s+(\w+)/);
      if (name) exports.push({ name: name[1], type: 'named' });
    });
    
    if (content.includes('export default')) {
      const defaultMatch = content.match(/export\s+default\s+(?:function\s+)?(\w+)?/);
      exports.push({ 
        name: defaultMatch?.[1] || 'default', 
        type: 'default' 
      });
    }
    
    return exports;
  }

  extractImports(content) {
    const imports = [];
    const importRegex = /import\s+(?:{[^}]+}|[\w*]+(?:\s*,\s*{[^}]+})?)\s+from\s+['"]([^'"]+)['"]/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push({
        source: match[1],
        isRelative: match[1].startsWith('.'),
        isNodeModule: !match[1].startsWith('.')
      });
    }
    
    return imports;
  }

  extractEventHandlers(content) {
    const handlers = [];
    const handlerPatterns = [
      { pattern: /onClick\s*=\s*\{([^}]+)\}/g, type: 'click' },
      { pattern: /onChange\s*=\s*\{([^}]+)\}/g, type: 'change' },
      { pattern: /onSubmit\s*=\s*\{([^}]+)\}/g, type: 'submit' },
      { pattern: /onKeyDown\s*=\s*\{([^}]+)\}/g, type: 'keydown' },
      { pattern: /onMouseEnter\s*=\s*\{([^}]+)\}/g, type: 'mouseenter' },
      { pattern: /onMouseLeave\s*=\s*\{([^}]+)\}/g, type: 'mouseleave' },
      { pattern: /onFocus\s*=\s*\{([^}]+)\}/g, type: 'focus' },
      { pattern: /onBlur\s*=\s*\{([^}]+)\}/g, type: 'blur' },
      { pattern: /onLoad\s*=\s*\{([^}]+)\}/g, type: 'load' },
      { pattern: /onScroll\s*=\s*\{([^}]+)\}/g, type: 'scroll' }
    ];
    
    handlerPatterns.forEach(({ pattern, type }) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        handlers.push({
          type,
          handler: match[1].trim(),
          isInlineFunction: match[1].includes('=>') || match[1].includes('function'),
          isPlaceholder: this.isPlaceholderHandler(match[1])
        });
      }
    });
    
    return handlers;
  }

  isPlaceholderHandler(handlerCode) {
    const placeholderPatterns = [
      /console\.log/,
      new RegExp('\\/\\/\\s*TODO'),
      new RegExp('\\/\\/\\s*FIXME'),
      /alert\(/,
      /\/\/\s*Static fallback/,
      /\(\)\s*=>\s*\{\s*\}/,
      /\(\)\s*=>\s*null/
    ];
    
    return placeholderPatterns.some(p => p.test(handlerCode));
  }

  extractAPICalls(content) {
    const apiCalls = [];
    
    const fetchMatches = content.match(/fetch\s*\(\s*['"`]([^'"`]+)['"`]/g) || [];
    fetchMatches.forEach(match => {
      const url = match.match(/fetch\s*\(\s*['"`]([^'"`]+)['"`]/);
      if (url) apiCalls.push({ type: 'fetch', url: url[1] });
    });
    
    const axiosMatches = content.match(/axios\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/g) || [];
    axiosMatches.forEach(match => {
      const parsed = match.match(/axios\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/);
      if (parsed) apiCalls.push({ type: 'axios', method: parsed[1], url: parsed[2] });
    });
    
    return apiCalls;
  }

  extractReduxUsage(content) {
    return {
      usesUseSelector: content.includes('useSelector'),
      usesUseDispatch: content.includes('useDispatch'),
      usesConnect: content.includes('connect('),
      usesCreateSlice: content.includes('createSlice'),
      usesCreateAsyncThunk: content.includes('createAsyncThunk'),
      actions: this.extractReduxActions(content)
    };
  }

  extractReduxActions(content) {
    const actions = [];
    const actionMatches = content.match(/dispatch\s*\(\s*(\w+)\s*\(/g) || [];
    actionMatches.forEach(match => {
      const action = match.match(/dispatch\s*\(\s*(\w+)/);
      if (action) actions.push(action[1]);
    });
    return [...new Set(actions)];
  }

  extractStateVariables(content) {
    const states = [];
    const stateMatches = content.match(/const\s+\[\s*(\w+)\s*,\s*set\w+\s*\]\s*=\s*useState/g) || [];
    stateMatches.forEach(match => {
      const state = match.match(/const\s+\[\s*(\w+)/);
      if (state) states.push(state[1]);
    });
    return states;
  }

  hasPlaceholders(content) {
    return (
      content.includes('// TODO') ||
      content.includes('// FIXME') ||
      content.includes('/* TODO') ||
      content.includes('// Placeholder') ||
      content.includes('// Not implemented')
    );
  }

  countTodos(content) {
    const todoMatches = content.match(/\/\/\s*(TODO|FIXME|XXX|HACK)/gi) || [];
    return todoMatches.length;
  }

  hasMockData(content) {
    return (
      content.includes('mockData') ||
      content.includes('mock_data') ||
      content.includes('// Mock') ||
      content.includes('/* Mock') ||
      content.includes('dummyData') ||
      content.includes('fakeData') ||
      content.includes('sampleData')
    );
  }

  extractDependencies(content) {
    const deps = new Set();
    const importRegex = /from\s+['"]([^'"./][^'"]*)['"]/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const pkg = match[1].split('/')[0];
      if (!pkg.startsWith('@')) {
        deps.add(pkg);
      } else {
        deps.add(match[1].split('/').slice(0, 2).join('/'));
      }
    }
    
    return [...deps];
  }

  async performFullAnalysis(forceRefresh = false) {
    if (!forceRefresh && this.analysisCache && this.lastAnalysisTime) {
      const cacheAge = Date.now() - this.lastAnalysisTime;
      if (cacheAge < this.cacheValidityMs) {
        console.log('📦 Returning cached analysis');
        return this.analysisCache;
      }
    }

    console.log('🔍 Performing full code analysis...');
    const startTime = Date.now();

    const srcFiles = await this.walkDirectory(path.join(this.projectRoot, 'src'));
    const serverFiles = await this.walkDirectory(path.join(this.projectRoot, 'server'));
    const allFiles = [...srcFiles, ...serverFiles];

    const fileAnalyses = await Promise.all(allFiles.map(f => this.analyzeFile(f)));
    const validAnalyses = fileAnalyses.filter(Boolean);

    const analysis = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      
      summary: {
        totalFiles: validAnalyses.length,
        totalLines: validAnalyses.reduce((sum, f) => sum + f.lines, 0),
        totalSize: validAnalyses.reduce((sum, f) => sum + f.size, 0),
        byType: this.groupByType(validAnalyses),
        byExtension: this.groupByExtension(validAnalyses)
      },
      
      components: {
        total: validAnalyses.filter(f => f.type === 'component').length,
        react: validAnalyses.filter(f => f.isReactComponent).length,
        withPlaceholders: validAnalyses.filter(f => f.type === 'component' && f.hasPlaceholders).length,
        withMockData: validAnalyses.filter(f => f.type === 'component' && f.hasMockData).length,
        list: validAnalyses.filter(f => f.type === 'component').map(f => ({
          name: f.componentName,
          path: f.path,
          lines: f.lines,
          handlers: f.eventHandlers.length,
          hasPlaceholders: f.hasPlaceholders,
          hasMockData: f.hasMockData
        }))
      },
      
      routes: {
        total: validAnalyses.filter(f => f.type === 'route').length,
        list: validAnalyses.filter(f => f.type === 'route').map(f => ({
          name: f.name,
          path: f.path,
          lines: f.lines
        }))
      },
      
      models: {
        total: validAnalyses.filter(f => f.type === 'model').length,
        list: validAnalyses.filter(f => f.type === 'model').map(f => ({
          name: f.name.replace('.js', ''),
          path: f.path,
          lines: f.lines
        }))
      },
      
      services: {
        total: validAnalyses.filter(f => f.type === 'service').length,
        list: validAnalyses.filter(f => f.type === 'service').map(f => ({
          name: f.name.replace('.js', ''),
          path: f.path,
          lines: f.lines
        }))
      },
      
      reduxSlices: {
        total: validAnalyses.filter(f => f.type === 'redux-slice').length,
        list: validAnalyses.filter(f => f.type === 'redux-slice').map(f => ({
          name: f.name.replace('.js', ''),
          path: f.path,
          lines: f.lines
        }))
      },
      
      stylesheets: {
        total: validAnalyses.filter(f => f.type === 'stylesheet').length,
        totalLines: validAnalyses.filter(f => f.type === 'stylesheet').reduce((sum, f) => sum + f.lines, 0)
      },
      
      eventHandlers: {
        total: validAnalyses.reduce((sum, f) => sum + f.eventHandlers.length, 0),
        byType: this.aggregateEventHandlers(validAnalyses),
        placeholders: validAnalyses.reduce((sum, f) => 
          sum + f.eventHandlers.filter(h => h.isPlaceholder).length, 0
        )
      },
      
      apiIntegrations: {
        total: validAnalyses.reduce((sum, f) => sum + f.apiCalls.length, 0),
        endpoints: this.aggregateAPICalls(validAnalyses)
      },
      
      codeQuality: {
        totalTodos: validAnalyses.reduce((sum, f) => sum + f.hasTodos, 0),
        filesWithPlaceholders: validAnalyses.filter(f => f.hasPlaceholders).length,
        filesWithMockData: validAnalyses.filter(f => f.hasMockData).length,
        completionScore: this.calculateCompletionScore(validAnalyses)
      },
      
      dependencies: this.aggregateDependencies(validAnalyses),
      
      files: validAnalyses
    };

    this.analysisCache = analysis;
    this.lastAnalysisTime = Date.now();

    console.log(`✅ Analysis complete in ${analysis.duration}ms - ${analysis.summary.totalFiles} files analyzed`);
    return analysis;
  }

  groupByType(analyses) {
    const groups = {};
    analyses.forEach(a => {
      groups[a.type] = (groups[a.type] || 0) + 1;
    });
    return groups;
  }

  groupByExtension(analyses) {
    const groups = {};
    analyses.forEach(a => {
      groups[a.extension] = (groups[a.extension] || 0) + 1;
    });
    return groups;
  }

  aggregateEventHandlers(analyses) {
    const byType = {};
    analyses.forEach(a => {
      a.eventHandlers.forEach(h => {
        byType[h.type] = (byType[h.type] || 0) + 1;
      });
    });
    return byType;
  }

  aggregateAPICalls(analyses) {
    const endpoints = new Set();
    analyses.forEach(a => {
      a.apiCalls.forEach(call => {
        endpoints.add(call.url);
      });
    });
    return [...endpoints];
  }

  aggregateDependencies(analyses) {
    const deps = new Set();
    analyses.forEach(a => {
      a.dependencies.forEach(d => deps.add(d));
    });
    return [...deps].sort();
  }

  calculateCompletionScore(analyses) {
    const components = analyses.filter(a => a.type === 'component');
    if (components.length === 0) return 100;

    let score = 100;
    
    const placeholderRatio = components.filter(c => c.hasPlaceholders).length / components.length;
    score -= placeholderRatio * 20;
    
    const mockDataRatio = components.filter(c => c.hasMockData).length / components.length;
    score -= mockDataRatio * 15;
    
    const totalHandlers = components.reduce((sum, c) => sum + c.eventHandlers.length, 0);
    const placeholderHandlers = components.reduce((sum, c) => 
      sum + c.eventHandlers.filter(h => h.isPlaceholder).length, 0
    );
    if (totalHandlers > 0) {
      const handlerRatio = placeholderHandlers / totalHandlers;
      score -= handlerRatio * 15;
    }
    
    return Math.max(0, Math.round(score));
  }

  async getSummary() {
    const analysis = await this.performFullAnalysis();
    return {
      timestamp: analysis.timestamp,
      totalFiles: analysis.summary.totalFiles,
      totalLines: analysis.summary.totalLines,
      components: analysis.components.total,
      routes: analysis.routes.total,
      models: analysis.models.total,
      services: analysis.services.total,
      reduxSlices: analysis.reduxSlices.total,
      eventHandlers: analysis.eventHandlers.total,
      completionScore: analysis.codeQuality.completionScore,
      todos: analysis.codeQuality.totalTodos
    };
  }
}

export default new CodeAnalysisService();
