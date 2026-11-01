/**
 * migrateAndSeedOrganization.ts
 * Non-destructive migration and seed script for White Caves Corporate Hierarchy.
 *
 * Safe to run multiple times — uses upsert semantics throughout.
 * Zero-Data-Loss guarantee: existing records are updated, never deleted.
 *
 * Run: npx tsx src/scripts/migrateAndSeedOrganization.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../secrets/.env') });

// ─── Inline model definitions (avoid circular imports during migration) ────────

type DeptLevel = 'DEPARTMENT' | 'SUB_DEPARTMENT';
type EmpType = 'EXECUTIVE' | 'FULL_TIME' | 'INTERN' | 'AI_AGENT';
type PRole = 'DIRECTOR' | 'MANAGER' | 'SUPERVISOR' | 'EMPLOYEE' | 'INTERN';
type PStatus = 'ACTIVE' | 'STANDBY' | 'ON_LEAVE' | 'TERMINATED';

// ─── 12 Seed Departments ───────────────────────────────────────────────────────

interface SeedDept {
  code: string;
  slug: string;
  title: string;
  order: number;
  color: string;
  subDepts: Array<{ code: string; slug: string; title: string; order: number }>;
}

const CORE_DEPARTMENTS: SeedDept[] = [
  {
    code: 'DEP-01',
    slug: 'executive-office',
    title: 'Executive Office & Corporate Governance',
    order: 1,
    color: '#1E293B',
    subDepts: [
      { code: 'SUB-01-01', slug: 'strategy-planning', title: 'Strategy & Planning Desk', order: 1 },
      { code: 'SUB-01-02', slug: 'board-affairs', title: 'Board Affairs & Secretariat', order: 2 },
    ],
  },
  {
    code: 'DEP-02',
    slug: 'luxury-sales',
    title: 'Luxury Sales & Brokerage',
    order: 2,
    color: '#8B5CF6',
    subDepts: [
      { code: 'SUB-02-01', slug: 'off-plan-luxury', title: 'Off-Plan Luxury Desk', order: 1 },
      { code: 'SUB-02-02', slug: 'secondary-resales', title: 'Secondary Resales Desk', order: 2 },
      {
        code: 'SUB-02-03',
        slug: 'international-desk',
        title: 'International Client Desk',
        order: 3,
      },
    ],
  },
  {
    code: 'DEP-03',
    slug: 'commercial-investment',
    title: 'Commercial Real Estate & Investment',
    order: 3,
    color: '#0891B2',
    subDepts: [
      { code: 'SUB-03-01', slug: 'commercial-leasing', title: 'Commercial Leasing Desk', order: 1 },
      {
        code: 'SUB-03-02',
        slug: 'capital-markets',
        title: 'Capital Markets & Acquisitions',
        order: 2,
      },
    ],
  },
  {
    code: 'DEP-04',
    slug: 'portfolio-leasing',
    title: 'Portfolio Management & Residential Leasing',
    order: 4,
    color: '#059669',
    subDepts: [
      {
        code: 'SUB-04-01',
        slug: 'ejari-operations',
        title: 'Ejari & DLD Operations Desk',
        order: 1,
      },
      {
        code: 'SUB-04-02',
        slug: 'residential-portfolio',
        title: 'Residential Portfolio Desk',
        order: 2,
      },
    ],
  },
  {
    code: 'DEP-05',
    slug: 'asset-facilities',
    title: 'Asset Management & Facilities',
    order: 5,
    color: '#D97706',
    subDepts: [
      {
        code: 'SUB-05-01',
        slug: 'facilities-management',
        title: 'Facilities Management Desk',
        order: 1,
      },
      {
        code: 'SUB-05-02',
        slug: 'iot-operations',
        title: 'IoT & Smart Building Operations',
        order: 2,
      },
    ],
  },
  {
    code: 'DEP-06',
    slug: 'finance-treasury',
    title: 'Revenue, Finance & Treasury',
    order: 6,
    color: '#DC2626',
    subDepts: [
      {
        code: 'SUB-06-01',
        slug: 'accounts-payable',
        title: 'Accounts Payable & Receivable',
        order: 1,
      },
      { code: 'SUB-06-02', slug: 'treasury-vat', title: 'Treasury & VAT Compliance', order: 2 },
    ],
  },
  {
    code: 'DEP-07',
    slug: 'marketing-leads',
    title: 'Performance Marketing & Lead Acquisition',
    order: 7,
    color: '#7C3AED',
    subDepts: [
      {
        code: 'SUB-07-01',
        slug: 'digital-marketing',
        title: 'Digital & Performance Marketing',
        order: 1,
      },
      {
        code: 'SUB-07-02',
        slug: 'lead-qualification',
        title: 'Lead Qualification & CRM',
        order: 2,
      },
    ],
  },
  {
    code: 'DEP-08',
    slug: 'communications-cx',
    title: 'Corporate Communications & Client Experience',
    order: 8,
    color: '#0369A1',
    subDepts: [
      { code: 'SUB-08-01', slug: 'pr-media', title: 'PR & Media Relations', order: 1 },
      {
        code: 'SUB-08-02',
        slug: 'client-concierge',
        title: 'Client Concierge & VIP Desk',
        order: 2,
      },
    ],
  },
  {
    code: 'DEP-09',
    slug: 'compliance-rera',
    title: 'Regulatory Affairs & RERA Compliance',
    order: 9,
    color: '#B45309',
    subDepts: [
      { code: 'SUB-09-01', slug: 'rera-licensing', title: 'RERA Licensing & Renewals', order: 1 },
      { code: 'SUB-09-02', slug: 'aml-kyc', title: 'AML, KYC & Due Diligence', order: 2 },
    ],
  },
  {
    code: 'DEP-10',
    slug: 'legal-conveyancing',
    title: 'Conveyancing & Transaction Management',
    order: 10,
    color: '#6D28D9',
    subDepts: [
      { code: 'SUB-10-01', slug: 'noc-transfers', title: 'NOC & DLD Transfers Desk', order: 1 },
      { code: 'SUB-10-02', slug: 'contract-review', title: 'Contract Review & Disputes', order: 2 },
    ],
  },
  {
    code: 'DEP-11',
    slug: 'technology',
    title: 'Technology, CRM & Infrastructure',
    order: 11,
    color: '#0F172A',
    subDepts: [
      { code: 'SUB-11-01', slug: 'crm-devops', title: 'CRM & DevOps Engineering', order: 1 },
      {
        code: 'SUB-11-02',
        slug: 'cybersecurity',
        title: 'Cybersecurity & Data Protection',
        order: 2,
      },
    ],
  },
  {
    code: 'DEP-12',
    slug: 'data-ai',
    title: 'Market Intelligence & IoT Data Science',
    order: 12,
    color: '#0891B2',
    subDepts: [
      {
        code: 'SUB-12-01',
        slug: 'market-research',
        title: 'Market Research & Analytics',
        order: 1,
      },
      { code: 'SUB-12-02', slug: 'ai-models', title: 'AI Models & Predictive Systems', order: 2 },
    ],
  },
];

const GRID_TO_SEEDED_DEPARTMENT_CODE: Record<string, string> = {
  'DEPT-01': 'DEP-01',
  'DEPT-02': 'DEP-02',
  'DEPT-03': 'DEP-03',
  'DEPT-04': 'DEP-04',
  'DEPT-05': 'DEP-05',
  'DEPT-06': 'DEP-06',
  'DEPT-07': 'DEP-07',
  'DEPT-08': 'DEP-08',
  'DEPT-09': 'DEP-09',
  'DEPT-10': 'DEP-10',
  'DEPT-11': 'DEP-11',
  'DEPT-12': 'DEP-12',
};

// ─── Main Migration ────────────────────────────────────────────────────────────

async function run(): Promise<void> {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || '';
  if (!uri) throw new Error('MONGODB_URI or DATABASE_URL not set in secrets/.env');

  console.log('[Migration] Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('[Migration] Connected.');

  const db = mongoose.connection.db!;

  // ── 1. Upsert 12 Core Departments ────────────────────────────────────────────
  console.log('[Migration] Seeding 12 Corporate Departments...');
  const deptColl = db.collection('departmentnodes');

  for (const dept of CORE_DEPARTMENTS) {
    await deptColl.updateOne(
      { code: dept.code },
      {
        $setOnInsert: { createdAt: new Date() },
        $set: {
          slug: dept.slug,
          title: dept.title,
          level: 'DEPARTMENT' as DeptLevel,
          parentDeptId: null,
          order: dept.order,
          color: dept.color,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Fetch parent _id for sub-depts
    const parent = await deptColl.findOne({ code: dept.code });
    if (!parent) continue;

    // ── 2. Upsert Sub-Departments ──────────────────────────────────────────────
    for (const sub of dept.subDepts) {
      await deptColl.updateOne(
        { code: sub.code },
        {
          $setOnInsert: { createdAt: new Date() },
          $set: {
            slug: sub.slug,
            title: sub.title,
            level: 'SUB_DEPARTMENT' as DeptLevel,
            parentDeptId: parent._id,
            order: sub.order,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    }
  }
  console.log('[Migration] ✓ Departments seeded.');

  // ── 3. Migrate legacy VirtualStaff → Personnel (non-destructive) ──────────────
  console.log('[Migration] Migrating legacy VirtualStaff to Personnel...');
  const staffColl = db.collection('virtualstaffs');
  const personnelColl = db.collection('personnels');

  const legacyStaff = await staffColl.find({}).toArray();
  let migrated = 0;

  for (const staff of legacyStaff) {
    const employeeId = `WC-AI-${String(staff.staffId || staff._id)
      .slice(-6)
      .toUpperCase()}`;
    const existing = await personnelColl.findOne({ employeeId });
    if (existing) continue; // already migrated

    await personnelColl.insertOne({
      employeeId,
      fullName: staff.name || 'Unknown',
      employmentType: 'AI_AGENT' as EmpType,
      role: 'SUPERVISOR' as PRole,
      isVirtual: true,
      systemPrompt: staff.systemRole || '',
      status: 'STANDBY' as PStatus,
      departmentId: null,
      subDepartmentId: null,
      teamSquadId: null,
      reportsTo: null,
      lineage: [],
      title: staff.title,
      color: staff.color,
      gender: staff.gender,
      assignedTasks: staff.assignedTasks || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    migrated++;
  }
  console.log(`[Migration] ✓ Migrated ${migrated} legacy VirtualStaff records to Personnel.`);

  // ── 3B. Seed Virtual Staff & Supervisors from master-workforce-grid.json ────
  console.log('[Migration] Ingesting Virtual Staff from master-workforce-grid.json...');
  const gridPath = path.resolve(
    __dirname,
    '../config/ai-command-center/master-workforce-grid.json'
  );
  let gridIngested = 0;
  if (fs.existsSync(gridPath)) {
    const gridData = JSON.parse(fs.readFileSync(gridPath, 'utf8'));

    // Ingest Executive AI Partner (e.g. Zoe)
    if (gridData.executiveAiPartner) {
      const exec = gridData.executiveAiPartner;
      const employeeId = `WC-AI-${exec.id.toUpperCase()}`;
      await personnelColl.updateOne(
        { employeeId },
        {
          $setOnInsert: { createdAt: new Date() },
          $set: {
            fullName: exec.name,
            employmentType: 'AI_AGENT' as EmpType,
            role: 'DIRECTOR' as PRole,
            isVirtual: true,
            status: 'ACTIVE' as PStatus,
            title: exec.title || 'Executive AI Partner',
            color: '#8B5CF6',
            avatar: exec.avatar || '⚡',
            assignedTasks: ['Executive Autonomous Override', 'Guard Node Governance'],
            lineage: [],
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
      gridIngested++;
    }

    // Ingest Managers and Supervisors across 12 Departments
    for (const d of gridData.departments || []) {
      const seededDeptCode = GRID_TO_SEEDED_DEPARTMENT_CODE[d.deptCode];
      const deptDoc = seededDeptCode ? await deptColl.findOne({ code: seededDeptCode }) : null;

      // Ingest Manager
      if (d.manager) {
        const mgr = d.manager;
        const employeeId = `WC-AI-MGR-${mgr.id.toUpperCase()}`;
        const updateDoc: any = {
          fullName: mgr.name,
          employmentType: 'AI_AGENT' as EmpType,
          role: 'MANAGER' as PRole,
          isVirtual: true,
          status: 'ACTIVE' as PStatus,
          title: mgr.title,
          color: d.color,
          avatar: mgr.avatar,
          assignedTasks: mgr.responsibilities || [],
          departmentId: deptDoc ? deptDoc._id : null,
          lineage: [],
          updatedAt: new Date(),
        };

        const res = await personnelColl.findOneAndUpdate(
          { employeeId },
          { $setOnInsert: { createdAt: new Date() }, $set: updateDoc },
          { upsert: true, returnDocument: 'after' }
        );
        if (res && deptDoc && !deptDoc.directorOrManagerId) {
          await deptColl.updateOne(
            { _id: deptDoc._id },
            { $set: { directorOrManagerId: res._id } }
          );
        }
        gridIngested++;
      }

      // Ingest 9 Supervisors per Department (safely linked to department and ready in ACTIVE state)
      for (const sup of d.supervisors || []) {
        const employeeId = `WC-AI-SUP-${sup.id.toUpperCase()}`;
        await personnelColl.updateOne(
          { employeeId },
          {
            $setOnInsert: { createdAt: new Date() },
            $set: {
              fullName: sup.name,
              gender: sup.gender || 'Female',
              employmentType: 'AI_AGENT' as EmpType,
              role: 'SUPERVISOR' as PRole,
              isVirtual: true,
              status: 'ACTIVE' as PStatus,
              title: sup.title,
              color: d.color,
              assignedTasks: sup.tasks || [],
              departmentId: deptDoc ? deptDoc._id : null,
              lineage: [],
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );
        gridIngested++;
      }
    }
    console.log(
      `[Migration] ✓ Ingested ${gridIngested} personnel profiles from master-workforce-grid.`
    );
  }

  // ── 4. Ensure Super User Director exists ──────────────────────────────────────
  const superEmail = process.env.SUPER_USER_EMAIL;
  if (superEmail) {
    console.log(`[Migration] Ensuring Super User (${superEmail}) is Managing Director...`);
    await personnelColl.updateOne(
      { email: superEmail },
      {
        $setOnInsert: { createdAt: new Date(), lineage: [], isVirtual: false },
        $set: {
          employeeId: 'WC-DIR-000',
          fullName: 'Managing Director',
          email: superEmail,
          employmentType: 'EXECUTIVE' as EmpType,
          role: 'DIRECTOR' as PRole,
          status: 'ACTIVE' as PStatus,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log('[Migration] ✓ Super User Managing Director record ensured.');
  }

  // ── 5. Report ─────────────────────────────────────────────────────────────────
  const deptCount = await deptColl.countDocuments({ level: 'DEPARTMENT' });
  const subCount = await deptColl.countDocuments({ level: 'SUB_DEPARTMENT' });
  const personnelCount = await personnelColl.countDocuments();
  const standbyCount = await personnelColl.countDocuments({ status: 'STANDBY' });
  const activeCount = await personnelColl.countDocuments({ status: 'ACTIVE' });

  console.log('\n[Migration] ═══ SUMMARY ═══');
  console.log(`  Corporate Departments : ${deptCount}`);
  console.log(`  Sub-Department Desks  : ${subCount}`);
  console.log(`  Personnel Records     : ${personnelCount}`);
  console.log(`    → ACTIVE            : ${activeCount}`);
  console.log(`    → STANDBY           : ${standbyCount}`);
  console.log('[Migration] ✓ Complete — Zero data was deleted.\n');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('[Migration] FATAL:', err);
  process.exit(1);
});
