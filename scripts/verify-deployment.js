#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 White Caves Real Estate - Deployment Verification\n');
console.log('=' .repeat(50));

const DOMAIN = process.env.VERCEL_URL || process.env.DOMAIN || 'localhost:5000';
const IS_LOCAL = DOMAIN.includes('localhost');
const PROTOCOL = IS_LOCAL ? http : https;
const BASE_URL = IS_LOCAL ? `http://${DOMAIN}` : `https://${DOMAIN}`;

const checks = [
  { path: '/', name: 'Homepage', required: true },
  { path: '/api/health', name: 'API Health', required: true },
  { path: '/robots.txt', name: 'SEO - Robots.txt', required: false },
  { path: '/manifest.json', name: 'PWA Manifest', required: false }
];

async function checkURL(urlPath, name) {
  const url = `${BASE_URL}${urlPath}`;
  
  return new Promise((resolve) => {
    const req = PROTOCOL.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          name,
          url,
          status: res.statusCode === 200 ? '✅ UP' : `⚠️  Status ${res.statusCode}`,
          statusCode: res.statusCode,
          success: res.statusCode === 200
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({ 
        name, 
        url, 
        status: `❌ ERROR: ${error.code || error.message}`, 
        statusCode: 0,
        success: false 
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ name, url, status: '❌ TIMEOUT', statusCode: 0, success: false });
    });
  });
}

function checkBuildFiles() {
  const buildDir = path.join(process.cwd(), 'dist');
  const results = [];
  
  const requiredFiles = ['index.html', 'assets'];
  
  if (fs.existsSync(buildDir)) {
    results.push({ name: 'Build directory exists', status: '✅', success: true });
    
    for (const file of requiredFiles) {
      const filePath = path.join(buildDir, file);
      if (fs.existsSync(filePath)) {
        results.push({ name: `Build contains ${file}`, status: '✅', success: true });
      } else {
        results.push({ name: `Build contains ${file}`, status: '❌ Missing', success: false });
      }
    }
  } else {
    results.push({ name: 'Build directory', status: '❌ Not found (run npm run build)', success: false });
  }
  
  return results;
}

function checkEnvVariables() {
  const results = [];
  const requiredVars = ['MONGODB_URI', 'VITE_FIREBASE_API_KEY'];
  const optionalVars = ['STRIPE_SECRET_KEY', 'GOOGLE_CLIENT_ID', 'WHATSAPP_API_KEY'];
  
  for (const envVar of requiredVars) {
    if (process.env[envVar]) {
      results.push({ name: `Env: ${envVar}`, status: '✅ Set', success: true });
    } else {
      results.push({ name: `Env: ${envVar}`, status: '❌ Missing (Required)', success: false });
    }
  }
  
  for (const envVar of optionalVars) {
    if (process.env[envVar]) {
      results.push({ name: `Env: ${envVar}`, status: '✅ Set', success: true });
    } else {
      results.push({ name: `Env: ${envVar}`, status: '⚠️  Not set (Optional)', success: true });
    }
  }
  
  return results;
}

function checkConfigFiles() {
  const results = [];
  const configs = [
    { file: 'vercel.json', name: 'Vercel Config' },
    { file: 'vite.config.js', name: 'Vite Config' },
    { file: 'package.json', name: 'Package.json' }
  ];
  
  for (const config of configs) {
    const filePath = path.join(process.cwd(), config.file);
    if (fs.existsSync(filePath)) {
      results.push({ name: config.name, status: '✅ Found', success: true });
    } else {
      results.push({ name: config.name, status: '❌ Missing', success: false });
    }
  }
  
  return results;
}

async function runChecks() {
  console.log(`\n📡 Testing: ${BASE_URL}\n`);
  
  console.log('🌐 Endpoint Checks:');
  console.log('-'.repeat(40));
  
  const endpointResults = await Promise.all(
    checks.map(check => checkURL(check.path, check.name))
  );
  
  for (const result of endpointResults) {
    console.log(`  ${result.name}: ${result.status}`);
  }
  
  console.log('\n📁 Build Files:');
  console.log('-'.repeat(40));
  
  const buildResults = checkBuildFiles();
  for (const result of buildResults) {
    console.log(`  ${result.name}: ${result.status}`);
  }
  
  console.log('\n🔐 Environment Variables:');
  console.log('-'.repeat(40));
  
  const envResults = checkEnvVariables();
  for (const result of envResults) {
    console.log(`  ${result.name}: ${result.status}`);
  }
  
  console.log('\n⚙️  Configuration Files:');
  console.log('-'.repeat(40));
  
  const configResults = checkConfigFiles();
  for (const result of configResults) {
    console.log(`  ${result.name}: ${result.status}`);
  }
  
  const allResults = [...endpointResults, ...buildResults, ...envResults, ...configResults];
  const passedCount = allResults.filter(r => r.success).length;
  const totalCount = allResults.length;
  const score = Math.round((passedCount / totalCount) * 100);
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Deployment Score: ${score}% (${passedCount}/${totalCount} checks passed)`);
  
  if (score >= 90) {
    console.log('✅ Deployment is READY for production!');
  } else if (score >= 70) {
    console.log('⚠️  Deployment is mostly ready. Address warnings for best results.');
  } else {
    console.log('❌ Deployment needs attention. Fix critical issues before deploying.');
  }
  
  console.log('\n📋 Quick Fix Guide:');
  const failed = allResults.filter(r => !r.success);
  if (failed.length === 0) {
    console.log('  All checks passed! You\'re good to go.');
  } else {
    failed.forEach(f => {
      console.log(`  - ${f.name}: ${f.status}`);
    });
  }
  
  console.log('\n');
}

runChecks().catch(console.error);
