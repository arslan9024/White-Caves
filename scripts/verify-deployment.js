/* eslint-disable no-console, security/detect-non-literal-fs-filename, security/detect-object-injection */

import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function getRuntimeConfig() {
  const domain = process.env.VERCEL_URL || process.env.DOMAIN || 'localhost:5000';
  const isLocal = domain.includes('localhost');
  return {
    domain,
    isLocal,
    protocol: isLocal ? http : https,
    baseUrl: isLocal ? `http://${domain}` : `https://${domain}`,
  };
}

const runtime = getRuntimeConfig();

const checks = [
  { path: '/', name: 'Homepage', required: true },
  { path: '/api/health', name: 'API Health', required: true },
  { path: '/robots.txt', name: 'SEO - Robots.txt', required: false },
  { path: '/sitemap.xml', name: 'SEO - Sitemap.xml', required: false },
  { path: '/manifest.json', name: 'PWA Manifest', required: false },
];

export async function checkURL(urlPath, name) {
  const url = `${runtime.baseUrl}${urlPath}`;

  return new Promise(resolve => {
    const req = runtime.protocol.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        resolve({
          name,
          url,
          status: res.statusCode === 200 ? '✅ UP' : `⚠️  Status ${res.statusCode}`,
          statusCode: res.statusCode,
          success: res.statusCode === 200,
        });
      });
    });

    req.on('error', error => {
      resolve({
        name,
        url,
        status: `❌ ERROR: ${error.code || error.message}`,
        statusCode: 0,
        success: false,
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ name, url, status: '❌ TIMEOUT', statusCode: 0, success: false });
    });
  });
}

export function checkBuildFiles() {
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
    results.push({
      name: 'Build directory',
      status: '❌ Not found (run npm run build)',
      success: false,
    });
  }

  return results;
}

export function checkEnvVariables() {
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

export function checkConfigFiles() {
  const results = [];
  const configs = [
    { file: 'vercel.json', name: 'Vercel Config' },
    { file: 'vite.config.js', name: 'Vite Config' },
    { file: 'package.json', name: 'Package.json' },
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

export function checkSeoFiles() {
  const results = [];
  const seoFiles = [
    { file: 'public/robots.txt', name: 'SEO robots.txt (public)' },
    { file: 'public/sitemap.xml', name: 'SEO sitemap.xml (public)' },
  ];

  for (const seo of seoFiles) {
    const filePath = path.join(process.cwd(), seo.file);
    if (fs.existsSync(filePath)) {
      results.push({ name: seo.name, status: '✅ Found', success: true });
    } else {
      results.push({ name: seo.name, status: '❌ Missing', success: false });
    }
  }

  // Basic freshness check: sitemap should include the current year in <lastmod>
  const sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const year = String(new Date().getFullYear());
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    if (content.includes(`<lastmod>${year}`)) {
      results.push({
        name: 'SEO sitemap freshness',
        status: '✅ Current year present',
        success: true,
      });
    } else {
      results.push({
        name: 'SEO sitemap freshness',
        status: '⚠️  Outdated lastmod year',
        success: false,
      });
    }
  }

  return results;
}

export async function runChecks() {
  console.log('🔍 White Caves Real Estate - Deployment Verification\n');
  console.log('='.repeat(50));
  console.log(`\n📡 Testing: ${runtime.baseUrl}\n`);

  console.log('🌐 Endpoint Checks:');
  console.log('-'.repeat(40));

  const endpointResults = await Promise.all(checks.map(check => checkURL(check.path, check.name)));

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

  console.log('\n🔎 SEO Files (local):');
  console.log('-'.repeat(40));

  const seoFileResults = checkSeoFiles();
  for (const result of seoFileResults) {
    console.log(`  ${result.name}: ${result.status}`);
  }

  const allResults = [
    ...endpointResults,
    ...buildResults,
    ...envResults,
    ...configResults,
    ...seoFileResults,
  ];
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
    console.log("  All checks passed! You're good to go.");
  } else {
    failed.forEach(f => {
      console.log(`  - ${f.name}: ${f.status}`);
    });
  }

  console.log('\n');
}

function runCli() {
  runChecks().catch(console.error);
}

const currentPath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentPath) {
  runCli();
}
