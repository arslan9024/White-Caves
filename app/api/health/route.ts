/**
 * app/api/health/route.ts — Health Check API Route Handler
 *
 * Next.js 15 App Router API Route.
 * Validates: Prisma DB ping, env variables, and uptime.
 *
 * GET /api/health
 * Response: { status, db, uptime, timestamp, version }
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  db: 'connected' | 'unreachable';
  uptime: number;
  timestamp: string;
  version: string;
  environment: string;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const startTime = Date.now();

  // ── Database Ping ───────────────────────────────────────────────────────────
  let dbStatus: 'connected' | 'unreachable' = 'unreachable';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    // DB offline — degrade gracefully
  }

  const overallStatus: HealthResponse['status'] =
    dbStatus === 'connected' ? 'healthy' : 'degraded';

  const response: HealthResponse = {
    status: overallStatus,
    db: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
  };

  return NextResponse.json(response, {
    status: overallStatus === 'healthy' ? 200 : 206,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Response-Time': `${Date.now() - startTime}ms`,
    },
  });
}

// Disable caching for the health endpoint
export const dynamic = 'force-dynamic';
