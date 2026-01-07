#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 White Caves Real Estate - Code Validation\n');
console.log('='.repeat(50));

const rootDir = process.cwd();

const validationRules = [
  {
    name: 'Configuration Files',
    check: () => {
      const required = ['package.json', 'vite.config.js', 'vercel.json'];
      const results = [];
      
      for (const file of required) {
        const filePath = path.join(rootDir, file);
        if (fs.existsSync(filePath)) {
          results.push({ file, status: '✅' });
        } else {
          results.push({ file, status: '❌ Missing' });
        }
      }
      
      const allExist = results.every(r => r.status === '✅');
      return {
        passed: allExist,
        message: allExist ? '✅ All config files present' : `❌ Missing: ${results.filter(r => r.status !== '✅').map(r => r.file).join(', ')}`
      };
    }
  },
  {
    name: 'Environment Template',
    check: () => {
      const envTemplate = path.join(rootDir, '.env.template');
      const envExample = path.join(rootDir, '.env.example');
      
      if (fs.existsSync(envTemplate) || fs.existsSync(envExample)) {
        return { passed: true, message: '✅ Environment template exists' };
      }
      return { passed: false, message: '⚠️  No .env.template or .env.example found' };
    }
  },
  {
    name: 'Deprecated Packages',
    check: () => {
      const deprecatedPackages = ['crypto', 'node-domexception', 'request', 'querystring'];
      const packageJsonPath = path.join(rootDir, 'package.json');
      
      if (!fs.existsSync(packageJsonPath)) {
        return { passed: false, message: '❌ package.json not found' };
      }
      
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      const found = deprecatedPackages.filter(dep => allDeps[dep]);
      
      if (found.length > 0) {
        return { passed: false, message: `⚠️  Deprecated packages found: ${found.join(', ')}` };
      }
      return { passed: true, message: '✅ No deprecated packages' };
    }
  },
  {
    name: 'Hardcoded Localhost URLs',
    check: () => {
      const patterns = ['http://localhost', 'localhost:5000', 'localhost:3000', '127.0.0.1'];
      const srcDir = path.join(rootDir, 'src');
      let foundHardcoded = [];
      
      function checkDirectory(dir) {
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const filePath = path.join(dir, file.name);
          
          if (file.isDirectory() && !file.name.includes('node_modules')) {
            checkDirectory(filePath);
          } else if (file.isFile() && /\.(js|jsx|ts|tsx)$/.test(file.name)) {
            const content = fs.readFileSync(filePath, 'utf8');
            for (const pattern of patterns) {
              if (content.includes(pattern) && !content.includes('// allowed-localhost')) {
                foundHardcoded.push(`${file.name}: ${pattern}`);
              }
            }
          }
        }
      }
      
      checkDirectory(srcDir);
      
      if (foundHardcoded.length > 0) {
        return { 
          passed: false, 
          message: `⚠️  Hardcoded URLs found in ${foundHardcoded.length} locations`
        };
      }
      return { passed: true, message: '✅ No hardcoded localhost URLs in source' };
    }
  },
  {
    name: 'Console.log Statements',
    check: () => {
      const srcDir = path.join(rootDir, 'src');
      let consoleCount = 0;
      
      function checkDirectory(dir) {
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const filePath = path.join(dir, file.name);
          
          if (file.isDirectory() && !file.name.includes('node_modules')) {
            checkDirectory(filePath);
          } else if (file.isFile() && /\.(js|jsx|ts|tsx)$/.test(file.name)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const matches = content.match(/console\.log\(/g);
            if (matches) {
              consoleCount += matches.length;
            }
          }
        }
      }
      
      checkDirectory(srcDir);
      
      if (consoleCount > 20) {
        return { 
          passed: false, 
          message: `⚠️  Found ${consoleCount} console.log statements (consider removing for production)`
        };
      }
      return { passed: true, message: `✅ Console.log count acceptable (${consoleCount})` };
    }
  },
  {
    name: 'API Routes Structure',
    check: () => {
      const routesPaths = [
        path.join(rootDir, 'src/server/routes'),
        path.join(rootDir, 'server/routes'),
        path.join(rootDir, 'api')
      ];
      
      for (const routesPath of routesPaths) {
        if (fs.existsSync(routesPath)) {
          const files = fs.readdirSync(routesPath);
          if (files.length > 0) {
            return { passed: true, message: `✅ API routes found in ${routesPath.replace(rootDir, '.')}` };
          }
        }
      }
      
      return { passed: false, message: '⚠️  No API routes directory found' };
    }
  },
  {
    name: 'Component Structure',
    check: () => {
      const componentsPath = path.join(rootDir, 'src/components');
      
      if (!fs.existsSync(componentsPath)) {
        return { passed: false, message: '❌ src/components directory not found' };
      }
      
      const components = fs.readdirSync(componentsPath, { withFileTypes: true });
      const componentCount = components.filter(f => f.isDirectory() || f.name.endsWith('.jsx') || f.name.endsWith('.js')).length;
      
      return { 
        passed: true, 
        message: `✅ Found ${componentCount} components in src/components` 
      };
    }
  },
  {
    name: 'CSS/Styling Files',
    check: () => {
      const stylesPath = path.join(rootDir, 'src/styles');
      
      if (!fs.existsSync(stylesPath)) {
        return { passed: false, message: '⚠️  No src/styles directory (using inline or module CSS)' };
      }
      
      const styleFiles = fs.readdirSync(stylesPath).filter(f => f.endsWith('.css'));
      
      return { 
        passed: true, 
        message: `✅ Found ${styleFiles.length} style files in src/styles` 
      };
    }
  }
];

function runValidation() {
  console.log('\n📋 Running Code Validation Checks:\n');
  
  const results = [];
  
  for (const rule of validationRules) {
    console.log(`  Checking: ${rule.name}...`);
    const result = rule.check();
    results.push({ name: rule.name, ...result });
    console.log(`    ${result.message}\n`);
  }
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const score = Math.round((passed / total) * 100);
  
  console.log('='.repeat(50));
  console.log(`\n📊 Code Quality Score: ${score}% (${passed}/${total} checks passed)\n`);
  
  if (score >= 90) {
    console.log('✅ Code is production-ready!');
  } else if (score >= 70) {
    console.log('⚠️  Code needs minor improvements');
  } else {
    console.log('❌ Code needs attention before deployment');
  }
  
  const failed = results.filter(r => !r.passed);
  if (failed.length > 0) {
    console.log('\n📝 Recommendations:');
    failed.forEach(f => {
      console.log(`  - ${f.name}: ${f.message}`);
    });
  }
  
  console.log('\n');
}

runValidation();
