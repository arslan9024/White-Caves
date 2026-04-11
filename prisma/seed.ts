/**
 * White Caves CRM — Database Seed Script
 * Populates MongoDB with realistic UAE real estate data
 *
 * Usage: npx ts-node prisma/seed.ts
 *    or: npx tsx prisma/seed.ts
 */

/* eslint-disable no-console, no-undef, @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Default password for all seeded users (dev only — override via SEED_PASSWORD env var)
const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || 'password123';
const hashPassword = async (pw: string) => bcrypt.hash(pw, 12);

async function main() {
  console.log('🌱 Seeding White Caves CRM database...\n');

  // ─── 0. CLEANUP ────────────────────────────────────────────────────────
  // Use raw MongoDB drop to handle corrupt data (non-ObjectID IDs from earlier schema)
  console.log('🧹 Cleaning existing data (raw drop)...');
  const collections = [
    'Favorite',
    'Notification',
    'Client',
    'Activity',
    'Commission',
    'Transaction',
    'Tenant',
    'Lead',
    'Property',
    'User',
  ];
  for (const col of collections) {
    try {
      await prisma.$runCommandRaw({ drop: col });
      console.log(`  ✅ Dropped collection: ${col}`);
    } catch (e: any) {
      // Collection might not exist — that's fine
      console.log(
        `  ℹ️  Collection ${col}: ${e.message?.includes('ns not found') ? 'does not exist' : e.message || 'skipped'}`
      );
    }
  }
  console.log('  ✅ All collections cleaned\n');

  // ─── 1. USERS (Agents & Owner) ─────────────────────────────────────────
  console.log('👤 Creating users...');
  const defaultHash = await hashPassword(DEFAULT_PASSWORD);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@whitecaves.ae' },
    update: {},
    create: {
      email: 'owner@whitecaves.ae',
      name: 'Ahmad Al-Rashid',
      role: 'owner',
      phone: '+971501234567',
      department: 'Executive',
      status: 'active',
      passwordHash: defaultHash,
    },
  });

  const agents = await Promise.all([
    prisma.user.upsert({
      where: { email: 'clara@whitecaves.ae' },
      update: {},
      create: {
        email: 'clara@whitecaves.ae',
        name: 'Clara Mendez',
        role: 'agent',
        phone: '+971502345678',
        department: 'Sales',
        status: 'active',
        passwordHash: defaultHash,
      },
    }),
    prisma.user.upsert({
      where: { email: 'mary@whitecaves.ae' },
      update: {},
      create: {
        email: 'mary@whitecaves.ae',
        name: 'Mary Thompson',
        role: 'agent',
        phone: '+971503456789',
        department: 'Inventory',
        status: 'active',
        passwordHash: defaultHash,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sophia@whitecaves.ae' },
      update: {},
      create: {
        email: 'sophia@whitecaves.ae',
        name: 'Sophia Chen',
        role: 'agent',
        phone: '+971504567890',
        department: 'Sales',
        status: 'active',
        passwordHash: defaultHash,
      },
    }),
    prisma.user.upsert({
      where: { email: 'daisy@whitecaves.ae' },
      update: {},
      create: {
        email: 'daisy@whitecaves.ae',
        name: 'Daisy Patel',
        role: 'agent',
        phone: '+971505678901',
        department: 'Leasing',
        status: 'active',
        passwordHash: defaultHash,
      },
    }),
    prisma.user.upsert({
      where: { email: 'theodora@whitecaves.ae' },
      update: {},
      create: {
        email: 'theodora@whitecaves.ae',
        name: 'Theodora Bianchi',
        role: 'agent',
        phone: '+971506789012',
        department: 'Finance',
        status: 'active',
        passwordHash: defaultHash,
      },
    }),
  ]);

  console.log(`  ✅ ${agents.length + 1} users created`);

  // ─── 2. PROPERTIES ─────────────────────────────────────────────────────
  console.log('🏠 Creating properties...');
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        title: 'Luxury 3BR Penthouse - Palm Jumeirah',
        description:
          'Stunning full-floor penthouse with panoramic views of the Arabian Gulf. Private pool, marble finishes, smart home automation.',
        type: 'penthouse',
        status: 'available',
        price: 18500000,
        bedrooms: 3,
        bathrooms: 4,
        sqft: 5200,
        location: 'Palm Jumeirah, Dubai',
        area: 'Palm Jumeirah',
        amenities: ['Private Pool', 'Smart Home', 'Concierge', 'Parking (3)', 'Gym'],
        images: ['/images/palm-penthouse-1.jpg'],
        featured: true,
        agentName: 'Clara Mendez',
        userId: agents[0].id,
      },
    }),
    prisma.property.create({
      data: {
        title: 'Modern 2BR Apartment - Downtown Dubai',
        description:
          'High-floor apartment in Boulevard Point with direct Burj Khalifa views. Full amenities including infinity pool and gym.',
        type: 'apartment',
        status: 'available',
        price: 3200000,
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1450,
        location: 'Downtown Dubai',
        area: 'Downtown',
        amenities: ['Pool', 'Gym', 'Concierge', 'Parking'],
        images: ['/images/downtown-2br-1.jpg'],
        featured: true,
        agentName: 'Sophia Chen',
        userId: agents[2].id,
      },
    }),
    prisma.property.create({
      data: {
        title: '5BR Villa - Emirates Hills',
        description:
          'Prestigious golf-course villa with lake views. Landscaped garden, private cinema, staff quarters, double garage.',
        type: 'villa',
        status: 'available',
        price: 42000000,
        bedrooms: 5,
        bathrooms: 6,
        sqft: 12000,
        location: 'Emirates Hills, Dubai',
        area: 'Emirates Hills',
        amenities: ['Private Garden', 'Cinema Room', 'Staff Quarters', 'Double Garage', 'Pool'],
        images: ['/images/emirates-villa-1.jpg'],
        featured: true,
        agentName: 'Mary Thompson',
        userId: agents[1].id,
      },
    }),
    prisma.property.create({
      data: {
        title: 'Studio Apartment - JVC',
        description: 'Brand new studio in Belgravia Heights. Ideal for investors. High ROI area.',
        type: 'apartment',
        status: 'available',
        price: 550000,
        bedrooms: 0,
        bathrooms: 1,
        sqft: 450,
        location: 'Jumeirah Village Circle',
        area: 'JVC',
        amenities: ['Pool', 'Gym', 'Parking'],
        images: [],
        featured: false,
        agentName: 'Daisy Patel',
        userId: agents[3].id,
      },
    }),
    prisma.property.create({
      data: {
        title: '4BR Townhouse - Dubai Hills',
        description:
          'Corner townhouse with park views. Maid room, large terrace, community pool and clubhouse access.',
        type: 'townhouse',
        status: 'reserved',
        price: 4800000,
        bedrooms: 4,
        bathrooms: 4,
        sqft: 3200,
        location: 'Dubai Hills Estate',
        area: 'Dubai Hills',
        amenities: ['Terrace', 'Maid Room', 'Community Pool', 'Parking (2)'],
        images: ['/images/hills-townhouse-1.jpg'],
        featured: false,
        agentName: 'Clara Mendez',
        userId: agents[0].id,
      },
    }),
    prisma.property.create({
      data: {
        title: 'Commercial Office - Business Bay',
        description:
          'Grade A office space in Prism Tower. Floor-to-ceiling windows, fiber optic, ready to move in.',
        type: 'commercial',
        status: 'available',
        price: 2100000,
        bedrooms: 0,
        bathrooms: 2,
        sqft: 1800,
        location: 'Business Bay, Dubai',
        area: 'Business Bay',
        amenities: ['Fiber Optic', 'Central AC', 'Parking (4)', 'Meeting Rooms'],
        images: [],
        featured: false,
        agentName: 'Sophia Chen',
        userId: agents[2].id,
      },
    }),
    prisma.property.create({
      data: {
        title: '1BR Apartment - Dubai Marina',
        description:
          'Fully furnished 1BR with marina views. Walking distance to JBR beach and The Walk.',
        type: 'apartment',
        status: 'rented',
        price: 1800000,
        bedrooms: 1,
        bathrooms: 1,
        sqft: 850,
        location: 'Dubai Marina',
        area: 'Dubai Marina',
        amenities: ['Pool', 'Gym', 'Beach Access', 'Parking'],
        images: ['/images/marina-1br-1.jpg'],
        featured: false,
        agentName: 'Daisy Patel',
        userId: agents[3].id,
      },
    }),
    prisma.property.create({
      data: {
        title: '6BR Mansion - Arabian Ranches',
        description:
          'Grand mansion on double plot. Cinema, home office, landscaped garden with BBQ area, infinity pool.',
        type: 'villa',
        status: 'sold',
        price: 15000000,
        bedrooms: 6,
        bathrooms: 7,
        sqft: 9500,
        location: 'Arabian Ranches, Dubai',
        area: 'Arabian Ranches',
        amenities: ['Private Pool', 'Cinema', 'BBQ Area', 'Garden', 'Staff Quarters'],
        images: ['/images/ranches-mansion-1.jpg'],
        featured: false,
        agentName: 'Mary Thompson',
        userId: agents[1].id,
      },
    }),
  ]);

  console.log(`  ✅ ${properties.length} properties created`);

  // ─── 3. LEADS ──────────────────────────────────────────────────────────
  console.log('📋 Creating leads...');
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        name: 'Sheikh Mohammed Al-Maktoum',
        email: 'sheikh.m@royalfamily.ae',
        phone: '+971501111111',
        company: 'Royal Estates Holdings',
        status: 'hot',
        source: 'referral',
        budget: 50000000,
        score: 95,
        notes: 'VIP client. Looking for waterfront villa. Budget not fixed.',
        tags: ['VIP', 'High Budget', 'Waterfront'],
        assignedToId: agents[0].id,
        createdById: owner.id,
        propertyId: properties[2].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Sarah Williams',
        email: 'sarah.w@gmail.com',
        phone: '+447891234567',
        company: null,
        status: 'qualified',
        source: 'website',
        budget: 5000000,
        score: 72,
        notes: 'UK expat relocating to Dubai. Interested in family homes.',
        tags: ['Expat', 'Family', 'Relocating'],
        assignedToId: agents[2].id,
        createdById: agents[2].id,
        propertyId: properties[4].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Li Wei Chen',
        email: 'liwei@investcorp.cn',
        phone: '+8613912345678',
        company: 'InvestCorp Asia',
        status: 'warm',
        source: 'marketing',
        budget: 10000000,
        score: 65,
        notes: 'Chinese investor group. Looking for bulk purchase opportunities.',
        tags: ['Investor', 'Bulk', 'International'],
        assignedToId: agents[0].id,
        createdById: agents[0].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Fatima Al-Sayed',
        email: 'fatima@al-sayed.ae',
        phone: '+971509876543',
        company: 'Al-Sayed Group',
        status: 'contacted',
        source: 'whatsapp',
        budget: 3000000,
        score: 58,
        notes: 'Interested in Downtown apartments for personal use.',
        tags: ['Local', 'Personal Use'],
        assignedToId: agents[2].id,
        createdById: agents[2].id,
        propertyId: properties[1].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'James Morrison',
        email: 'james.m@outlook.com',
        phone: '+61412345678',
        company: null,
        status: 'new',
        source: 'website',
        budget: 800000,
        score: 35,
        notes: 'Australian investor looking for rental yield properties.',
        tags: ['Investor', 'Rental', 'Budget'],
        assignedToId: agents[3].id,
        createdById: agents[3].id,
        propertyId: properties[3].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Priya Sharma',
        email: 'priya@sharma-realty.in',
        phone: '+919876543210',
        company: 'Sharma Realty India',
        status: 'hot',
        source: 'referral',
        budget: 8000000,
        score: 88,
        notes: 'Family relocating from Mumbai. Needs large villa, school proximity important.',
        tags: ['Family', 'Relocating', 'Referral'],
        assignedToId: agents[1].id,
        createdById: agents[1].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Alexander Petrov',
        email: 'alex.petrov@mail.ru',
        phone: '+79161234567',
        company: 'Petrov Capital',
        status: 'won',
        source: 'direct',
        budget: 15000000,
        score: 100,
        notes: 'Purchased Arabian Ranches mansion. Great client, may buy more.',
        tags: ['Investor', 'Repeat Client', 'Closed'],
        assignedToId: agents[1].id,
        createdById: owner.id,
        propertyId: properties[7].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Dubai Marina Corp',
        email: 'acquisitions@marinacorp.ae',
        phone: '+97142345678',
        company: 'Dubai Marina Corp',
        status: 'cold',
        source: 'phone',
        budget: 20000000,
        score: 25,
        notes: 'Corporate inquiry. Slow to respond. Follow up needed.',
        tags: ['Corporate', 'Slow Response'],
        assignedToId: agents[0].id,
        createdById: agents[0].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Emily Ryder',
        email: 'emily.r@tech.io',
        phone: '+14155551234',
        company: 'TechFlow Inc',
        status: 'qualified',
        source: 'website',
        budget: 2500000,
        score: 70,
        notes: 'US tech exec moving to Dubai. Flexible on area but wants modern amenities.',
        tags: ['Expat', 'Tech', 'Modern'],
        assignedToId: agents[2].id,
        createdById: agents[2].id,
      },
    }),
    prisma.lead.create({
      data: {
        name: 'Hassan Bin Khalid',
        email: 'hassan@gulf-investments.ae',
        phone: '+971507654321',
        company: 'Gulf Investments LLC',
        status: 'warm',
        source: 'referral',
        budget: 30000000,
        score: 78,
        notes: 'Looking for commercial properties and a personal villa in Emirates Hills.',
        tags: ['High Budget', 'Commercial', 'Villa'],
        assignedToId: agents[0].id,
        createdById: owner.id,
      },
    }),
  ]);

  console.log(`  ✅ ${leads.length} leads created`);

  // ─── 4. COMMISSIONS ────────────────────────────────────────────────────
  console.log('💰 Creating commissions...');
  const commissions = await Promise.all([
    prisma.commission.create({
      data: {
        amount: 450000,
        percentage: 3,
        status: 'paid',
        type: 'sale',
        notes: 'Arabian Ranches mansion sale commission',
        paidAt: new Date('2026-02-15'),
        agentId: agents[1].id,
        leadId: leads[6].id,
        propertyId: properties[7].id,
      },
    }),
    prisma.commission.create({
      data: {
        amount: 144000,
        percentage: 3,
        status: 'approved',
        type: 'sale',
        notes: 'Dubai Hills townhouse reservation commission',
        agentId: agents[0].id,
        leadId: leads[1].id,
        propertyId: properties[4].id,
      },
    }),
    prisma.commission.create({
      data: {
        amount: 27000,
        percentage: 5,
        status: 'pending',
        type: 'rental',
        notes: 'Marina 1BR leasing commission',
        agentId: agents[3].id,
        propertyId: properties[6].id,
      },
    }),
    prisma.commission.create({
      data: {
        amount: 555000,
        percentage: 3,
        status: 'pending',
        type: 'sale',
        notes: 'Palm penthouse commission (pending sale completion)',
        agentId: agents[0].id,
        leadId: leads[0].id,
        propertyId: properties[0].id,
      },
    }),
    prisma.commission.create({
      data: {
        amount: 16500,
        percentage: 3,
        status: 'paid',
        type: 'sale',
        notes: 'JVC studio sale commission',
        paidAt: new Date('2026-01-20'),
        agentId: agents[3].id,
        propertyId: properties[3].id,
      },
    }),
  ]);

  console.log(`  ✅ ${commissions.length} commissions created`);

  // ─── 5. TRANSACTIONS ───────────────────────────────────────────────────
  console.log('📝 Creating transactions...');
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        type: 'sale',
        status: 'completed',
        amount: 15000000,
        closingDate: new Date('2026-02-10'),
        notes: 'Arabian Ranches mansion — closed successfully',
        propertyId: properties[7].id,
        leadId: leads[6].id,
        agentId: agents[1].id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'sale',
        status: 'in_progress',
        amount: 4800000,
        closingDate: new Date('2026-04-15'),
        notes: 'Dubai Hills townhouse — SPA signed, awaiting DLD transfer',
        propertyId: properties[4].id,
        leadId: leads[1].id,
        agentId: agents[0].id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'rental',
        status: 'completed',
        amount: 108000,
        closingDate: new Date('2026-01-05'),
        notes: 'Marina 1BR annual lease',
        propertyId: properties[6].id,
        agentId: agents[3].id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'sale',
        status: 'pending',
        amount: 18500000,
        notes: 'Palm Jumeirah penthouse — negotiation phase',
        propertyId: properties[0].id,
        leadId: leads[0].id,
        agentId: agents[0].id,
      },
    }),
  ]);

  console.log(`  ✅ ${transactions.length} transactions created`);

  // ─── 6. TENANTS ────────────────────────────────────────────────────────
  console.log('🏢 Creating tenants...');
  const tenants = await Promise.all([
    prisma.tenant.create({
      data: {
        name: 'David Park',
        email: 'david.park@gmail.com',
        phone: '+971508765432',
        nationality: 'South Korean',
        emiratesId: '784-1990-1234567-1',
        status: 'active',
        moveInDate: new Date('2026-01-05'),
        monthlyRent: 9000,
        deposit: 18000,
        notes: 'Quiet tenant, works in DIFC. Pays on time.',
        propertyId: properties[6].id,
      },
    }),
    prisma.tenant.create({
      data: {
        name: 'Anna Kozlova',
        email: 'anna.k@outlook.com',
        phone: '+971507654321',
        nationality: 'Russian',
        status: 'active',
        moveInDate: new Date('2025-09-01'),
        monthlyRent: 5500,
        deposit: 11000,
        notes: 'Student visa. Reviewing lease renewal.',
        propertyId: properties[3].id,
      },
    }),
  ]);

  console.log(`  ✅ ${tenants.length} tenants created`);

  // ─── 7. ACTIVITIES ─────────────────────────────────────────────────────
  console.log('📊 Creating activity log...');
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        type: 'lead',
        action: 'created',
        description: 'New VIP lead: Sheikh Mohammed Al-Maktoum — Budget AED 50M',
        userId: owner.id,
        leadId: leads[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'property',
        action: 'created',
        description: 'New listing: Luxury 3BR Penthouse - Palm Jumeirah — AED 18.5M',
        userId: agents[0].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'deal',
        action: 'status_changed',
        description: 'Arabian Ranches mansion: in_progress → completed. Amount: AED 15M',
        userId: agents[1].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'commission',
        action: 'paid',
        description: 'Commission AED 450,000 paid to Mary Thompson (Arabian Ranches sale)',
        userId: owner.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'lead',
        action: 'status_changed',
        description: 'Lead "Alexander Petrov" status: qualified → won',
        userId: agents[1].id,
        leadId: leads[6].id,
        metadata: { oldStatus: 'qualified', newStatus: 'won' },
      },
    }),
    prisma.activity.create({
      data: {
        type: 'lead',
        action: 'call',
        description: 'Phone call with Sarah Williams — discussed Dubai Hills options',
        userId: agents[2].id,
        leadId: leads[1].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'client',
        action: 'created',
        description: 'New tenant added: David Park (Dubai Marina)',
        userId: agents[3].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'property',
        action: 'status_changed',
        description: 'Property "6BR Mansion - Arabian Ranches": available → sold',
        userId: agents[1].id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'system',
        action: 'login',
        description: 'Ahmad Al-Rashid logged in',
        userId: owner.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'lead',
        action: 'email',
        description: 'Email sent to Li Wei Chen — investment portfolio proposal',
        userId: agents[0].id,
        leadId: leads[2].id,
      },
    }),
  ]);

  console.log(`  ✅ ${activities.length} activities created`);

  // ─── 8. CLIENTS ────────────────────────────────────────────────────────
  console.log('👥 Creating clients...');
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'Fatima Al-Maktoum',
        email: 'fatima@maktoum.ae',
        phone: '+971501111111',
        type: 'buyer',
        nationality: 'Emirati',
        status: 'vip',
        company: 'Maktoum Holdings',
        notes: 'Looking for luxury villa in Palm Jumeirah',
        address: 'Downtown Dubai',
        tags: ['VIP', 'Luxury'],
        propertyIds: [properties[0].id],
        emiratesId: '784-1990-1234567-1',
      },
    }),
    prisma.client.create({
      data: {
        name: 'James Wilson',
        email: 'james@wilson.co.uk',
        phone: '+971502222222',
        type: 'investor',
        nationality: 'British',
        status: 'active',
        company: 'Wilson Capital',
        notes: 'Interested in bulk apartment purchases',
        address: 'DIFC, Dubai',
        tags: ['Investor', 'Bulk'],
        propertyIds: [properties[1].id, properties[2].id],
      },
    }),
    prisma.client.create({
      data: {
        name: 'Aisha Rahman',
        email: 'aisha@rahman.ae',
        phone: '+971503333333',
        type: 'seller',
        nationality: 'Pakistani',
        status: 'active',
        notes: 'Selling 2BR apartment in JLT',
        address: 'JLT, Dubai',
        tags: ['Seller'],
        propertyIds: [properties[3].id],
      },
    }),
    prisma.client.create({
      data: {
        name: 'Chen Wei',
        email: 'chen@investors.cn',
        phone: '+971504444444',
        type: 'buyer',
        nationality: 'Chinese',
        status: 'active',
        company: 'Dragon Real Estate',
        notes: 'Looking for commercial space',
        address: 'Business Bay',
        tags: ['Commercial', 'International'],
        propertyIds: [],
      },
    }),
    prisma.client.create({
      data: {
        name: 'Mohammad Al-Zahrani',
        email: 'mohammad@zahrani.sa',
        phone: '+971505555555',
        type: 'owner',
        nationality: 'Saudi',
        status: 'active',
        company: 'Zahrani Properties',
        notes: 'Owns multiple units in Marina',
        address: 'Dubai Marina',
        tags: ['Multi-unit', 'Owner'],
        propertyIds: [properties[4].id, properties[5].id],
      },
    }),
    prisma.client.create({
      data: {
        name: 'Elena Petrova',
        email: 'elena@petrova.ru',
        phone: '+971506666666',
        type: 'investor',
        nationality: 'Russian',
        status: 'inactive',
        notes: 'Previously interested, now on hold',
        address: 'JBR, Dubai',
        tags: ['On Hold'],
        propertyIds: [],
      },
    }),
  ]);
  console.log(`  ✅ ${clients.length} clients created`);

  // ─── 9. NOTIFICATIONS ─────────────────────────────────────────────────
  console.log('🔔 Creating notifications...');
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: owner.id,
        type: 'lead',
        channel: 'in_app',
        title: 'New Lead Assigned',
        message: 'A new high-priority lead has been assigned to your team.',
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: owner.id,
        type: 'commission',
        channel: 'in_app',
        title: 'Commission Approved',
        message: 'Commission for Palm Jumeirah villa sale has been approved.',
        read: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: agents[0].id,
        type: 'property',
        channel: 'in_app',
        title: 'Property Status Changed',
        message: 'Marina Heights 2BR status changed to Under Offer.',
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: agents[1].id,
        type: 'system',
        channel: 'in_app',
        title: 'System Maintenance',
        message: 'Scheduled maintenance this weekend.',
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: agents[2].id,
        type: 'info',
        channel: 'in_app',
        title: 'Training Reminder',
        message: 'Mandatory CRM training session tomorrow at 10 AM.',
        read: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: agents[0].id,
        type: 'success',
        channel: 'in_app',
        title: 'Deal Closed',
        message: 'Congratulations! Business Bay office deal closed successfully.',
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: owner.id,
        type: 'warning',
        channel: 'in_app',
        title: 'License Expiry',
        message: 'RERA license renewal due in 30 days.',
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: agents[3].id,
        type: 'lead',
        channel: 'in_app',
        title: 'Lead Follow-Up Due',
        message: 'Follow up with Sarah Khan about JLT apartment.',
        read: false,
      },
    }),
  ]);
  console.log(`  ✅ ${notifications.length} notifications created`);

  // ─── 10. FAVORITES ────────────────────────────────────────────────────
  console.log('⭐ Creating favorites...');
  const favorites = await Promise.all([
    prisma.favorite.create({ data: { userId: owner.id, propertyId: properties[0].id } }),
    prisma.favorite.create({ data: { userId: owner.id, propertyId: properties[2].id } }),
    prisma.favorite.create({ data: { userId: agents[0].id, propertyId: properties[1].id } }),
    prisma.favorite.create({ data: { userId: agents[0].id, propertyId: properties[4].id } }),
    prisma.favorite.create({ data: { userId: agents[1].id, propertyId: properties[3].id } }),
    prisma.favorite.create({ data: { userId: agents[2].id, propertyId: properties[5].id } }),
  ]);
  console.log(`  ✅ ${favorites.length} favorites created`);

  // ─── SUMMARY ───────────────────────────────────────────────────────────
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🌱 DATABASE SEEDED SUCCESSFULLY                         ║
╠════════════════════════════════════════════════════════════╣
║  Users:         ${agents.length + 1} (1 owner + ${agents.length} agents)                     ║
║  Properties:    ${properties.length}                                      ║
║  Leads:         ${leads.length}                                      ║
║  Commissions:   ${commissions.length}                                       ║
║  Transactions:  ${transactions.length}                                       ║
║  Tenants:       ${tenants.length}                                       ║
║  Activities:    ${activities.length}                                      ║
║  Clients:       ${clients.length}                                       ║
║  Notifications: ${notifications.length}                                       ║
║  Favorites:     ${favorites.length}                                       ║
╠════════════════════════════════════════════════════════════╣
║  Total Records: ${6 + properties.length + leads.length + commissions.length + transactions.length + tenants.length + activities.length + clients.length + notifications.length + favorites.length}                                    ║
╚════════════════════════════════════════════════════════════╝
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Done! Prisma disconnected.\n');
  })
  .catch(async e => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
