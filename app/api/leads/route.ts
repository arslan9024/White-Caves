/**
 * app/api/leads/route.ts — Leads API Route Handler (Next.js 15 App Router)
 *
 * Migrates the Express /api/leads endpoints to Next.js API Route Handlers.
 * Uses the shared src/lib/prisma.ts singleton — no new DB connections.
 *
 * GET  /api/leads          — paginated lead list with optional filters
 * POST /api/leads          — create new lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma, safeQuery } from '@/lib/prisma';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeadRecord {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  source?: string | null;
  budget?: number | null;
  assignedTo?: string | null;
  createdAt?: Date | null;
}

interface ApiError {
  error: string;
  code: string;
}

// ─── GET /api/leads ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page    = Math.max(1, parseInt(searchParams.get('page')  ?? '1', 10));
  const limit   = Math.min(100, parseInt(searchParams.get('limit') ?? '20', 10));
  const status  = searchParams.get('status')  ?? undefined;
  const source  = searchParams.get('source')  ?? undefined;
  const search  = searchParams.get('search')  ?? undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (source) where.source = source;
  if (search) {
    where.OR = [
      { name:  { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [leads, total] = await safeQuery(
    async (db) => {
      const [rows, count] = await Promise.all([
        db.lead.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, name: true, email: true, phone: true,
            status: true, source: true, budget: true,
            assignedTo: true, createdAt: true,
          },
        }),
        db.lead.count({ where }),
      ]);
      return [rows as LeadRecord[], count as number];
    },
    [[], 0] as [LeadRecord[], number]
  );

  return NextResponse.json(
    {
      data: leads,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}

// ─── POST /api/leads ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiError>(
      { error: 'Invalid JSON body', code: 'INVALID_BODY' },
      { status: 400 }
    );
  }

  const { name, email, phone, source, budget } = body as Record<string, unknown>;

  // ── Basic validation ───────────────────────────────────────────────────────
  if (!name || typeof name !== 'string') {
    return NextResponse.json<ApiError>(
      { error: '`name` is required and must be a string', code: 'VALIDATION_ERROR' },
      { status: 422 }
    );
  }

  if (!email || typeof email !== 'string') {
    return NextResponse.json<ApiError>(
      { error: '`email` is required and must be a string', code: 'VALIDATION_ERROR' },
      { status: 422 }
    );
  }

  const lead = await safeQuery(
    async (db) => {
      return db.lead.create({
        data: {
          name: String(name),
          email: String(email),
          phone: phone ? String(phone) : null,
          source: source ? String(source) : 'website',
          budget: typeof budget === 'number' ? budget : null,
          status: 'new',
        },
      });
    },
    null
  );

  if (!lead) {
    return NextResponse.json<ApiError>(
      { error: 'Database unavailable — lead could not be saved', code: 'DB_ERROR' },
      { status: 503 }
    );
  }

  return NextResponse.json({ data: lead }, { status: 201 });
}

// Disable caching on all methods
export const dynamic = 'force-dynamic';
