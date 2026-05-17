/* eslint-disable no-console */

import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function normalizeBaseUrl(inputUrl) {
  const raw = (inputUrl || '').trim();
  if (!raw) throw new Error('Base URL is required. Pass --url=https://example.com');
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(withProtocol);
  return url.toString().replace(/\/$/, '');
}

export function buildRuntimeChecks(baseUrl) {
  const normalized = normalizeBaseUrl(baseUrl);
  return [
    { name: 'Homepage', path: '/', required: true, url: `${normalized}/` },
    { name: 'API Health', path: '/api/health', required: true, url: `${normalized}/api/health` },
    {
      name: 'SEO robots.txt',
      path: '/robots.txt',
      required: false,
      url: `${normalized}/robots.txt`,
    },
    {
      name: 'SEO sitemap.xml',
      path: '/sitemap.xml',
      required: false,
      url: `${normalized}/sitemap.xml`,
    },
  ];
}

export function checkEndpoint(url, timeoutMs = 10000) {
  return new Promise(resolve => {
    const protocol = url.startsWith('https://') ? https : http;
    const parsed = new URL(url);
    const req = protocol.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || undefined,
        path: `${parsed.pathname}${parsed.search}`,
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Connection: 'close',
        },
      },
      res => {
      res.resume();
      resolve({
        url,
        statusCode: res.statusCode ?? 0,
        success: res.statusCode === 200,
      });
      }
    );

    req.end();

    req.on('error', err => {
      resolve({ url, statusCode: 0, success: false, error: err.code || err.message });
    });

    req.setTimeout(timeoutMs, () => {
      req.destroy();
      resolve({ url, statusCode: 0, success: false, error: 'TIMEOUT' });
    });
  });
}

export async function checkEndpointWithRetries(url, options = {}) {
  const timeoutMs = Number(options.timeoutMs ?? 10000);
  const retries = Math.max(0, Number(options.retries ?? 0));
  const retryDelayMs = Math.max(0, Number(options.retryDelayMs ?? 1500));
  const requester = options.requester || (targetUrl => checkEndpoint(targetUrl, timeoutMs));

  let lastResult = null;

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    const result = await requester(url);
    lastResult = {
      ...result,
      attempts: attempt,
    };

    if (result.success) {
      return lastResult;
    }

    if (attempt <= retries) {
      await sleep(retryDelayMs);
    }
  }

  return lastResult || { url, statusCode: 0, success: false, attempts: retries + 1 };
}

export async function verifyRuntimeEndpoints(baseUrl, options = {}) {
  const timeoutMs = Number(options.timeoutMs ?? 10000);
  const retries = Math.max(0, Number(options.retries ?? 0));
  const retryDelayMs = Math.max(0, Number(options.retryDelayMs ?? 1500));
  const requester = options.requester || (url => checkEndpoint(url, timeoutMs));
  const checks = buildRuntimeChecks(baseUrl);

  const responses = await Promise.all(
    checks.map(async check => {
      const result = await checkEndpointWithRetries(check.url, {
        timeoutMs,
        retries,
        retryDelayMs,
        requester,
      });

      return {
        ...check,
        statusCode: result.statusCode,
        success: Boolean(result.success),
        error: result.error || null,
        attempts: result.attempts || 1,
      };
    })
  );

  const requiredFailures = responses.filter(r => r.required && !r.success);
  return {
    checks: responses,
    success: requiredFailures.length === 0,
    requiredFailures,
  };
}

async function runCli() {
  const urlArg = process.argv.find(arg => arg.startsWith('--url='));
  const timeoutArg = process.argv.find(arg => arg.startsWith('--timeout='));
  const retriesArg = process.argv.find(arg => arg.startsWith('--retries='));
  const retryDelayArg = process.argv.find(arg => arg.startsWith('--retry-delay='));
  const dryRun = process.argv.includes('--dry-run');

  const baseUrl = normalizeBaseUrl(
    urlArg?.split('=')[1] || process.env.RUNTIME_VERIFY_URL || process.env.DOMAIN || ''
  );
  const timeoutMs = Number(timeoutArg?.split('=')[1] || 10000);
  const retries = Number(retriesArg?.split('=')[1] || 0);
  const retryDelayMs = Number(retryDelayArg?.split('=')[1] || 1500);

  if (dryRun) {
    console.log('🔎 Runtime endpoint checks (dry-run):');
    console.log(`   timeout=${timeoutMs}ms retries=${retries} retryDelay=${retryDelayMs}ms`);
    buildRuntimeChecks(baseUrl).forEach(c => {
      console.log(` - ${c.required ? '[required]' : '[optional]'} ${c.name}: ${c.url}`);
    });
    return;
  }

  console.log(`🌐 Verifying runtime endpoints: ${baseUrl}`);
  const report = await verifyRuntimeEndpoints(baseUrl, { timeoutMs, retries, retryDelayMs });

  report.checks.forEach(check => {
    const status = check.success ? '✅' : check.required ? '❌' : '⚠️';
    const detail = check.success
      ? `${check.statusCode} (attempt ${check.attempts})`
      : `${check.statusCode || 0}${check.error ? ` (${check.error})` : ''} (attempt ${check.attempts})`;
    console.log(`${status} ${check.name}: ${detail}`);
  });

  if (!report.success) {
    console.error(`❌ Required runtime checks failed: ${report.requiredFailures.length}`);
    process.exit(1);
  }

  console.log('✅ Required runtime checks passed.');
}

const currentPath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentPath) {
  runCli().catch(error => {
    console.error('❌ Runtime verification failed:', error.message || error);
    process.exit(1);
  });
}
