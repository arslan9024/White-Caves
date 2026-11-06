// FILE: scripts/audit-auto-created-agents.ts
/**
 * Dry-Run Audit: Auto-Created Firebase Agent Accounts (Law T20 Remediation)
 * Single Purpose: Identify non-founder social-auth accounts that received role='agent'
 * automatically under the legacy default without an approved RoleRequest.
 *
 * SAFETY: Strictly read-only by default. Does NOT mutate any user records unless
 * invoked with `--apply-reset-to-guest`.
 */

import { prisma } from '../server/database.js';
import { SUPERUSER_EMAIL } from '../server/controllers/auth/authCommon.js';

const FOUNDER_EMAILS = new Set(
  [
    'arslanmalikgoraha@gmail.com',
    'the.white.caves@gmail.com',
    'arslan@whitecaves.com',
    SUPERUSER_EMAIL,
  ]
    .map(e => e.toLowerCase().trim())
    .filter(Boolean)
);

async function runAudit(): Promise<void> {
  const applyReset = process.argv.includes('--apply-reset-to-guest');
  const db = prisma as any;

  const candidates = await prisma.user.findMany({
    where: {
      role: 'agent',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      firebaseUid: true,
      brnNumber: true,
      createdAt: true,
    },
  });

  const approvedRequests = await db.roleRequest.findMany({
    where: {
      status: 'approved',
      requestedRole: 'agent',
    },
    select: { userId: true },
  });
  const approvedUserIds = new Set(approvedRequests.map((r: { userId: string }) => r.userId));

  const unconfirmedSocialAgents = candidates.filter(u => {
    const emailLower = u.email.toLowerCase().trim();
    if (FOUNDER_EMAILS.has(emailLower)) return false;
    if (emailLower.endsWith('@whitecaves.ae') || emailLower.endsWith('@whitecaves.com')) {
      return false;
    }
    if (u.brnNumber) return false;
    if (approvedUserIds.has(u.id)) return false;
    return Boolean(u.firebaseUid);
  });

  console.log('=== Law T20 Dry-Run Audit: Auto-Created Social Agent Accounts ===');
  console.log(`Total role="agent" accounts scanned: ${candidates.length}`);
  console.log(
    `Unconfirmed external social accounts auto-assigned role="agent": ${unconfirmedSocialAgents.length}`
  );

  for (const u of unconfirmedSocialAgents) {
    console.log(
      `  - id=${u.id} | email=${u.email} | name=${u.name ?? 'N/A'} | status=${u.status} | createdAt=${u.createdAt.toISOString()}`
    );
  }

  if (applyReset && unconfirmedSocialAgents.length > 0) {
    const ids = unconfirmedSocialAgents.map(u => u.id);
    const res = await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { role: 'guest' },
    });
    console.log(`Applied reset to role="guest" for ${res.count} account(s).`);
  } else {
    console.log('Mode: DRY RUN ONLY (no records modified).');
  }
}

runAudit()
  .catch(err => {
    console.error('Audit script failed:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
