import { DepartmentNode, IDepartmentNode } from '../models/DepartmentNode';
import { VirtualStaff, IVirtualStaff } from '../models/VirtualStaff';
import { CustomSquad, ICustomSquad } from '../models/CustomSquad';
import masterWorkforceGrid from '../config/ai-command-center/master-workforce-grid.json';
import { createLogger } from '../utils/logger';

const log = createLogger('CorporateHierarchy');

export interface HierarchyDepartmentSummary {
  node: IDepartmentNode;
  manager: IVirtualStaff | null;
  supervisors: IVirtualStaff[];
  subDepartments: IDepartmentNode[];
  squads: ICustomSquad[];
}

export interface CorporateHierarchyOverview {
  departments: HierarchyDepartmentSummary[];
  executiveStaff: IVirtualStaff[];
  standbyRoster: IVirtualStaff[];
  counts: {
    totalDepartments: number;
    totalSubDepartments: number;
    totalActiveStaff: number;
    totalStandbyStaff: number;
    totalSquads: number;
  };
}

/**
 * Ensures baseline corporate departments (DEP-01 to DEP-12) and their assigned
 * managers and 108 supervisors exist in MongoDB, migrating unassigned entities to STANDBY.
 * Strict Zero-Data-Loss: Existing records are preserved and updated, never dropped.
 */
export async function seedCorporateHierarchy(): Promise<void> {
  try {
    log.info('Synchronizing Corporate Hierarchy from master workforce grid...');

    // 1. Executive Lead (e.g., Zoe)
    if (masterWorkforceGrid.executiveAiPartner) {
      const exec = masterWorkforceGrid.executiveAiPartner;
      await VirtualStaff.findOneAndUpdate(
        { staffId: exec.id },
        {
          $set: {
            staffId: exec.id,
            name: exec.name,
            gender: exec.gender || 'Female',
            title: exec.title || 'Chief Operations Officer (COO)',
            role: 'EXECUTIVE',
            status: 'ACTIVE',
            assignedTasks: ['Executive Oversight', 'Autonomous Guard Node', 'Security SLA Enforcement'],
          },
        },
        { upsert: true, new: true }
      );
    }

    // 2. Iterate 12 Departments
    for (const dept of masterWorkforceGrid.departments) {
      const slug = dept.deptName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Upsert department container
      const deptNode = await DepartmentNode.findOneAndUpdate(
        { code: dept.deptCode },
        {
          $set: {
            code: dept.deptCode,
            slug,
            title: dept.deptName,
            level: 'DEPARTMENT',
            color: dept.color,
            description: `${dept.deptName} operations node`,
          },
        },
        { upsert: true, new: true }
      );

      // Upsert Department Manager
      if (dept.manager) {
        await VirtualStaff.findOneAndUpdate(
          { staffId: dept.manager.id },
          {
            $set: {
              staffId: dept.manager.id,
              name: dept.manager.name,
              gender: (dept.manager as { gender?: string }).gender || 'Female',
              title: dept.manager.title,
              role: 'MANAGER',
              status: 'ACTIVE',
              departmentId: deptNode._id,
              departmentCode: dept.deptCode,
              reportingTo: 'AI Zoe (COO)',
            },
          },
          { upsert: true, new: true }
        );
      }

      // Upsert 9 Department Supervisors
      if (Array.isArray(dept.supervisors)) {
        for (const sup of dept.supervisors) {
          await VirtualStaff.findOneAndUpdate(
            { staffId: sup.id },
            {
              $set: {
                staffId: sup.id,
                name: sup.name,
                gender: sup.gender || 'Female',
                title: sup.title,
                role: 'SUPERVISOR',
                status: 'ACTIVE',
                departmentId: deptNode._id,
                departmentCode: dept.deptCode,
                supervisorSlot: sup.slot,
                assignedTasks: sup.tasks || [],
                reportingTo: dept.manager?.name || 'Department Manager',
              },
            },
            { upsert: true, new: true }
          );
        }
      }
    }

    log.info('Corporate hierarchy synchronization complete.');
  } catch (err) {
    log.error('Failed to synchronize corporate hierarchy:', err);
    throw err;
  }
}

/**
 * Retrieve the full corporate organizational overview.
 */
export async function getCorporateHierarchyOverview(): Promise<CorporateHierarchyOverview> {
  const allNodes = await DepartmentNode.find({}).sort({ code: 1 }).lean();
  const allStaff = await VirtualStaff.find({}).sort({ staffId: 1 }).lean();
  const allSquads = await CustomSquad.find({ isActive: true }).lean();

  const primaryDeptNodes = allNodes.filter(n => n.level === 'DEPARTMENT');
  const subDeptNodes = allNodes.filter(n => n.level === 'SUB_DEPARTMENT');

  const executiveStaff = allStaff.filter(s => s.role === 'EXECUTIVE');
  const standbyRoster = allStaff.filter(s => s.status === 'STANDBY');
  const activeStaff = allStaff.filter(s => s.status === 'ACTIVE');

  const departmentSummaries: HierarchyDepartmentSummary[] = primaryDeptNodes.map(dept => {
    const manager = allStaff.find(
      s => s.role === 'MANAGER' && s.departmentCode === dept.code && s.status === 'ACTIVE'
    ) || null;

    const supervisors = allStaff.filter(
      s => s.role === 'SUPERVISOR' && s.departmentCode === dept.code && s.status === 'ACTIVE'
    );

    const subDepartments = subDeptNodes.filter(
      sub => String(sub.parentDeptId) === String(dept._id)
    );

    const squads = allSquads.filter(
      sq => String(sq.departmentId) === String(dept._id)
    );

    return {
      node: dept as unknown as IDepartmentNode,
      manager: (manager as unknown as IVirtualStaff) || null,
      supervisors: supervisors as unknown as IVirtualStaff[],
      subDepartments: subDepartments as unknown as IDepartmentNode[],
      squads: squads as unknown as ICustomSquad[],
    };
  });

  return {
    departments: departmentSummaries,
    executiveStaff: executiveStaff as unknown as IVirtualStaff[],
    standbyRoster: standbyRoster as unknown as IVirtualStaff[],
    counts: {
      totalDepartments: primaryDeptNodes.length,
      totalSubDepartments: subDeptNodes.length,
      totalActiveStaff: activeStaff.length,
      totalStandbyStaff: standbyRoster.length,
      totalSquads: allSquads.length,
    },
  };
}

/**
 * Safely move an active staff member to the Unassigned Standby Roster.
 * Adheres to Zero-Data-Loss: retains past tasks, title, and identity.
 */
export async function moveToStandbyRoster(staffId: string): Promise<IVirtualStaff | null> {
  return VirtualStaff.findOneAndUpdate(
    { staffId },
    {
      $set: {
        status: 'STANDBY',
        role: 'STANDBY',
        departmentId: null,
        departmentCode: null,
        supervisorSlot: null,
      },
    },
    { new: true }
  );
}
