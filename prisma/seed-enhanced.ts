/**
 * White Caves CRM — Enhanced Database Seed Script
 * =================================================
 * Uses faker generators for 10× more realistic data.
 *
 * Usage:
 *   npx tsx prisma/seed-enhanced.ts
 *   npx tsx prisma/seed-enhanced.ts --count small   (20 props, 10 agents, 50 leads)
 *   npx tsx prisma/seed-enhanced.ts --count medium  (50 props, 20 agents, 100 leads) [default]
 *   npx tsx prisma/seed-enhanced.ts --count large   (200 props, 50 agents, 500 leads)
 *   npx tsx prisma/seed-enhanced.ts --skip-cleanup  (keep existing data)
 *   SEED_PASSWORD=mypass npx tsx prisma/seed-enhanced.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Import faker generators (relative from prisma/ to src/)
import { generateProperties } from '../src/utils/faker/properties';
import { generateAgents } from '../src/utils/faker/agents';
import { generateLeads } from '../src/utils/faker/leads';
import { generateTransactions } from '../src/utils/faker/transactions';
import { generateConversations } from '../src/utils/faker/conversations';
import { generateActivities } from '../src/utils/faker/conversations';

const prisma = new PrismaClient();

// ─── CLI Args ─────────────────────────────────────────────────

type SeedSize = 'small' | 'medium' | 'large';

const SEED_SIZES: Record<SeedSize, { properties: number; agents: number; leads: number; transactions: number; conversations: number; activities: number }> = {
  small:  { properties: 20,  agents: 10, leads: 50,  transactions: 15, conversations: 10, activities: 25  },
  medium: { properties: 50,  agents: 20, leads: 100, transactions: 30, conversations: 25, activities: 50  },
  large:  { properties: 200, agents: 50, leads: 500, transactions: 100, conversations: 75, activities: 200 },
};

function parseArgs(): { size: SeedSize; skipCleanup: boolean } {
  const args = process.argv.slice(2);
  const countIdx = args.indexOf('--count');
  const sizeArg = countIdx >= 0 ? args[countIdx + 1] : 'medium';
  const size = (['small', 'medium', 'large'].includes(sizeArg) ? sizeArg : 'medium') as SeedSize;
  const skipCleanup = args.includes('--skip-cleanup');
  return { size, skipCleanup };
}

// ─── Helpers ──────────────────────────────────────────────────

const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || 'password123';
const hashPassword = async (pw: string) => bcrypt.hash(pw, 12);

function log(emoji: string, msg: string) {
  console.log(`${emoji} ${msg}`);
}

function timer() {
  const t0 = Date.now();
  return () => `${((Date.now() - t0) / 1000).toFixed(1)}s`;
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  const { size, skipCleanup } = parseArgs();
  const counts = SEED_SIZES[size];
  const elapsed = timer();

  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🌱 WHITE CAVES — Enhanced Database Seed                 ║
║  Size: ${size.toUpperCase().padEnd(8)}   Cleanup: ${skipCleanup ? 'SKIP' : 'YES '}                   ║
╚════════════════════════════════════════════════════════════╝
`);

  // ─── 0. CLEANUP ────────────────────────────────────────────

  if (!skipCleanup) {
    log('🧹', 'Cleaning existing data...');
    const collections = [
      'Activity', 'Commission', 'Transaction', 'NadiaMessage',
      'NadiaConversation', 'NadiaConversationQueue', 'Tenant',
      'Favorite', 'SavedSearch', 'Viewing', 'Offer', 'Lease',
      'Maintenance', 'JobApplication', 'Lead', 'Property', 'User',
    ];
    for (const col of collections) {
      try {
        await prisma.$runCommandRaw({ drop: col });
      } catch {
        // Collection might not exist — fine
      }
    }
    log('  ✅', 'All collections cleaned');
  }

  // ─── 1. GENERATE DATA ─────────────────────────────────────

  log('⚡', 'Generating faker data...');
  const genTimer = timer();

  const fakeProperties = generateProperties(counts.properties, 42);
  const fakeAgents = generateAgents(counts.agents, 99);
  const fakeLeads = generateLeads(counts.leads, 137);
  const { transactions: fakeTxns, commissions: fakeComms } = generateTransactions(counts.transactions, 200);
  const fakeConversations = generateConversations(counts.conversations, 300);
  const fakeActivities = generateActivities(counts.activities, 400);

  log('  ✅', `Generated ${fakeProperties.length} properties, ${fakeAgents.length} agents, ${fakeLeads.length} leads, ${fakeTxns.length} transactions, ${fakeConversations.length} conversations, ${fakeActivities.length} activities (${genTimer()})`);

  // ─── 2. USERS (Owner + Agents) ────────────────────────────

  log('👤', `Creating ${fakeAgents.length + 1} users...`);
  const defaultHash = await hashPassword(DEFAULT_PASSWORD);

  const owner = await prisma.user.create({
    data: {
      email: 'owner@whitecaves.ae',
      name: 'Ahmad Al-Rashid',
      role: 'owner',
      phone: '+971501234567',
      department: 'Executive',
      status: 'active',
      passwordHash: defaultHash,
    },
  });

  // Map faker agents → Prisma Users
  const dbAgents: { id: string; email: string; name: string; fakerIdx: number }[] = [];
  for (let i = 0; i < fakeAgents.length; i++) {
    const fa = fakeAgents[i];
    const user = await prisma.user.create({
      data: {
        email: fa.email,
        name: fa.name,
        role: 'agent',
        phone: fa.phone,
        department: fa.department,
        status: fa.status === 'offline' ? 'inactive' : 'active',
        photoUrl: fa.avatar,
        passwordHash: defaultHash,
      },
    });
    dbAgents.push({ id: user.id, email: fa.email, name: fa.name, fakerIdx: i });
  }
  log('  ✅', `${dbAgents.length + 1} users created`);

  // Helper: get a random agent's DB id from faker agent ref
  function resolveAgentId(fakerAgentId: string): string {
    const num = parseInt(fakerAgentId.replace('agent-', ''), 10);
    const idx = (num - 1) % dbAgents.length;
    return dbAgents[idx].id;
  }

  // ─── 3. PROPERTIES ────────────────────────────────────────

  log('🏠', `Creating ${fakeProperties.length} properties...`);
  const dbProperties: { id: string; fakeId: string }[] = [];

  for (const fp of fakeProperties) {
    const agentId = resolveAgentId(fp.agent);
    const agentName = dbAgents.find(a => a.id === agentId)?.name || 'Unknown Agent';

    const statusMap: Record<string, string> = {
      available: 'available',
      sold: 'sold',
      rented: 'rented',
      pending: 'reserved',
    };

    const property = await prisma.property.create({
      data: {
        title: fp.title,
        description: fp.description,
        type: fp.type.toLowerCase(),
        status: statusMap[fp.status] || 'available',
        price: fp.price,
        bedrooms: fp.beds,
        bathrooms: fp.baths,
        sqft: fp.sqft,
        location: fp.location,
        area: fp.location.split(',')[0].trim(),
        amenities: fp.amenities,
        images: fp.images,
        featured: fp.featured,
        agentName,
        userId: agentId,
      },
    });
    dbProperties.push({ id: property.id, fakeId: fp.id });
  }
  log('  ✅', `${dbProperties.length} properties created`);

  // Helper: get DB property id from faker prop ref
  function resolvePropertyId(fakePropId: string): string | undefined {
    return dbProperties.find(p => p.fakeId === fakePropId)?.id;
  }

  // ─── 4. LEADS ─────────────────────────────────────────────

  log('📋', `Creating ${fakeLeads.length} leads...`);
  const dbLeads: { id: string; fakeId: string }[] = [];

  // Map faker lead sources to Prisma-compatible sources
  const sourceMap: Record<string, string> = {
    'Website': 'website', 'Bayut': 'website', 'Property Finder': 'website',
    'Dubizzle': 'website', 'Google Ads': 'marketing', 'Facebook': 'marketing',
    'LinkedIn': 'marketing', 'Email Campaign': 'marketing', 'Exhibition': 'marketing',
    'Instagram': 'marketing', 'WhatsApp': 'whatsapp', 'Referral': 'referral',
    'Walk-In': 'direct', 'Agent Network': 'referral', 'Open House': 'direct',
  };

  for (const fl of fakeLeads) {
    const agentId = resolveAgentId(fl.assigned_agent);
    // Assign a random property interest if available
    const propNum = parseInt(fl.id.replace('lead-', ''), 10);
    const propIdx = (propNum - 1) % dbProperties.length;
    const propertyId = dbProperties[propIdx]?.id;

    const lead = await prisma.lead.create({
      data: {
        name: fl.name,
        email: fl.email,
        phone: fl.phone,
        company: fl.tags.includes('Corporate') ? `${fl.lastName} Holdings` : null,
        status: fl.status === 'negotiation' ? 'qualified' : fl.status,
        source: sourceMap[fl.source] || 'direct',
        budget: fl.budget,
        score: fl.score,
        notes: fl.notes,
        tags: fl.tags,
        assignedToId: agentId,
        createdById: owner.id,
        propertyId,
      },
    });
    dbLeads.push({ id: lead.id, fakeId: fl.id });
  }
  log('  ✅', `${dbLeads.length} leads created`);

  // Helper: get DB lead id from faker lead ref
  function resolveLeadId(fakeLeadId: string): string | undefined {
    return dbLeads.find(l => l.fakeId === fakeLeadId)?.id;
  }

  // ─── 5. TRANSACTIONS ─────────────────────────────────────

  log('📝', `Creating ${fakeTxns.length} transactions...`);
  const dbTransactions: { id: string; fakeId: string }[] = [];

  for (const ft of fakeTxns) {
    const agentId = resolveAgentId(ft.agentId);
    const propertyId = resolvePropertyId(ft.propertyId);
    const leadId = resolveLeadId(ft.leadId);

    const txn = await prisma.transaction.create({
      data: {
        type: ft.type,
        status: ft.status,
        amount: ft.amount,
        closingDate: ft.timeline.closingDate ? new Date(ft.timeline.closingDate) : null,
        notes: ft.notes,
        documents: ft.documents,
        agentId,
        propertyId: propertyId || null,
        leadId: leadId || null,
      },
    });
    dbTransactions.push({ id: txn.id, fakeId: ft.id });
  }
  log('  ✅', `${dbTransactions.length} transactions created`);

  // ─── 6. COMMISSIONS ───────────────────────────────────────

  log('💰', `Creating ${fakeComms.length} commissions...`);
  let commCount = 0;

  for (const fc of fakeComms) {
    const agentId = resolveAgentId(fc.agentId);
    const propertyId = resolvePropertyId(fc.propertyId);
    const leadId = resolveLeadId(fc.leadId);

    await prisma.commission.create({
      data: {
        amount: fc.amount,
        percentage: fc.percentage,
        type: fc.type,
        status: fc.status,
        notes: fc.notes,
        paidAt: fc.paidAt ? new Date(fc.paidAt) : null,
        agentId,
        propertyId: propertyId || null,
        leadId: leadId || null,
      },
    });
    commCount++;
  }
  log('  ✅', `${commCount} commissions created`);

  // ─── 7. CONVERSATIONS (Nadia WhatsApp) ────────────────────

  log('💬', `Creating ${fakeConversations.length} conversations with messages...`);
  let msgCount = 0;

  for (const fc of fakeConversations) {
    const conv = await prisma.nadiaConversation.create({
      data: {
        wabaId: `waba_${fc.id}`,
        customerPhone: fc.customerPhone.replace(/\s/g, ''),
        agentPhone: null,
        intent: fc.messages[0]?.intent?.toLowerCase() || null,
        leadScore: fc.leadScore,
        status: fc.status === 'ACTIVE' ? 'active' : fc.status === 'CLOSED' ? 'closed' : fc.status === 'SPAM' ? 'closed' : 'active',
        routedAt: new Date(fc.createdAt),
        closedAt: fc.closedAt ? new Date(fc.closedAt) : null,
        closedReason: fc.status === 'CLOSED' ? 'resolved' : fc.status === 'SPAM' ? 'spam' : null,
      },
    });

    // Create messages for this conversation
    for (const fm of fc.messages) {
      await prisma.nadiaMessage.create({
        data: {
          conversationId: conv.id,
          waMessageId: `wa_${fm.id}`,
          direction: fm.sender === 'CUSTOMER' ? 'inbound' : 'outbound',
          body: fm.content,
          messageType: fm.messageType,
          status: fm.status,
          timestamp: new Date(fm.timestamp),
        },
      });
      msgCount++;
    }
  }
  log('  ✅', `${fakeConversations.length} conversations, ${msgCount} messages created`);

  // ─── 8. ACTIVITIES ────────────────────────────────────────

  log('📊', `Creating ${fakeActivities.length} activities...`);

  // Map activity type to Prisma-compatible type/action
  const activityTypeMap: Record<string, { type: string; action: string }> = {
    deal_closed: { type: 'deal', action: 'status_changed' },
    lead_created: { type: 'lead', action: 'created' },
    stage_change: { type: 'lead', action: 'status_changed' },
    client_created: { type: 'client', action: 'created' },
    deal_cancelled: { type: 'deal', action: 'status_changed' },
    property_added: { type: 'property', action: 'created' },
    agent_added: { type: 'agent', action: 'created' },
    alert: { type: 'system', action: 'alert' },
    call: { type: 'lead', action: 'call' },
    email: { type: 'lead', action: 'email' },
    whatsapp: { type: 'lead', action: 'whatsapp' },
    visit: { type: 'property', action: 'visit' },
    note: { type: 'lead', action: 'note_added' },
  };

  for (const fa of fakeActivities) {
    const mapping = activityTypeMap[fa.type] || { type: 'system', action: 'unknown' };
    const agentIdx = Math.abs(fa.id) % dbAgents.length;

    await prisma.activity.create({
      data: {
        type: mapping.type,
        action: mapping.action,
        description: fa.description,
        userId: dbAgents[agentIdx].id,
        metadata: { icon: fa.icon, originalType: fa.type },
      },
    });
  }
  log('  ✅', `${fakeActivities.length} activities created`);

  // ─── SUMMARY ──────────────────────────────────────────────

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🌱 ENHANCED DATABASE SEED — COMPLETE                        ║
╠════════════════════════════════════════════════════════════════╣
║  Size preset:    ${size.toUpperCase().padEnd(42)}║
║  Users:          ${String(dbAgents.length + 1).padEnd(42)}║
║  Properties:     ${String(dbProperties.length).padEnd(42)}║
║  Leads:          ${String(dbLeads.length).padEnd(42)}║
║  Transactions:   ${String(dbTransactions.length).padEnd(42)}║
║  Commissions:    ${String(commCount).padEnd(42)}║
║  Conversations:  ${String(fakeConversations.length).padEnd(42)}║
║  Messages:       ${String(msgCount).padEnd(42)}║
║  Activities:     ${String(fakeActivities.length).padEnd(42)}║
║                                                               ║
║  Total records:  ${String(dbAgents.length + 1 + dbProperties.length + dbLeads.length + dbTransactions.length + commCount + fakeConversations.length + msgCount + fakeActivities.length).padEnd(42)}║
║  Elapsed:        ${elapsed().padEnd(42)}║
║                                                               ║
║  Login: owner@whitecaves.ae / ${DEFAULT_PASSWORD.slice(0, 8).padEnd(29)}║
║         agent emails: see faker output                        ║
╚════════════════════════════════════════════════════════════════╝
`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
