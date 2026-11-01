import { DepartmentNode, IDepartmentNode } from '../../../models/DepartmentNode';
import { Personnel, IPersonnel } from '../../../models/Personnel';
import { TeamSquad, ITeamSquad } from '../../../models/TeamSquad';
import { AppError } from '../../../../server/middleware/errorHandler';

export function assertSuperUser(sessionUserEmail?: string): void {
  const superEmail = process.env.SUPER_USER_EMAIL;
  if (!superEmail || !sessionUserEmail || sessionUserEmail.toLowerCase() !== superEmail.toLowerCase()) {
    throw new AppError('Unauthorized: Action restricted to Super User', 403);
  }
}

export async function renameDepartmentNode(
  nodeId: string,
  newTitle: string,
  userEmail?: string
): Promise<IDepartmentNode> {
  assertSuperUser(userEmail);
  if (!newTitle || !newTitle.trim()) {
    throw new AppError('Title is required', 400);
  }
  const updated = await DepartmentNode.findByIdAndUpdate(
    nodeId,
    { $set: { title: newTitle.trim() } },
    { new: true }
  );
  if (!updated) {
    throw new AppError('Department node not found', 404);
  }
  return updated;
}

export async function reorderDepartmentNodes(
  orderedIds: string[],
  userEmail?: string
): Promise<void> {
  assertSuperUser(userEmail);
  if (!Array.isArray(orderedIds)) {
    throw new AppError('orderedIds must be an array', 400);
  }
  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }));
  if (bulkOps.length > 0) {
    await DepartmentNode.bulkWrite(bulkOps);
  }
}

export async function createSubDepartment(
  parentDeptId: string,
  title: string,
  slug: string,
  code: string,
  userEmail?: string
): Promise<IDepartmentNode> {
  assertSuperUser(userEmail);
  if (!title || !slug || !code) {
    throw new AppError('Title, slug, and code are required', 400);
  }
  const parent = await DepartmentNode.findById(parentDeptId);
  if (!parent || parent.level !== 'DEPARTMENT') {
    throw new AppError('Valid parent department required', 404);
  }
  const existing = await DepartmentNode.findOne({
    $or: [{ code: code.toUpperCase().trim() }, { slug: slug.toLowerCase().trim() }],
  });
  if (existing) {
    throw new AppError('Department code or slug already exists', 409);
  }
  const subDept = await DepartmentNode.create({
    code: code.toUpperCase().trim(),
    slug: slug.toLowerCase().trim(),
    title: title.trim(),
    level: 'SUB_DEPARTMENT',
    parentDeptId: parent._id,
    order: await DepartmentNode.countDocuments({ parentDeptId: parent._id }),
  });
  return subDept;
}

export async function createTeamSquad(
  subDepartmentId: string,
  name: string,
  supervisorId: string,
  userEmail?: string
): Promise<ITeamSquad> {
  assertSuperUser(userEmail);
  if (!name || !name.trim()) throw new AppError('Squad name is required', 400);
  const subDept = await DepartmentNode.findById(subDepartmentId);
  if (!subDept) throw new AppError('Sub-department not found', 404);
  const supervisor = await Personnel.findById(supervisorId);
  if (!supervisor) throw new AppError('Supervisor not found', 404);

  const squad = await TeamSquad.create({
    name: name.trim(),
    subDepartmentId: subDept._id,
    supervisorId: supervisor._id,
    order: await TeamSquad.countDocuments({ subDepartmentId: subDept._id }),
  });
  return squad;
}

export async function renameTeamSquad(
  squadId: string,
  newName: string,
  userEmail?: string
): Promise<ITeamSquad> {
  assertSuperUser(userEmail);
  if (!newName || !newName.trim()) throw new AppError('New squad name is required', 400);
  const squad = await TeamSquad.findByIdAndUpdate(
    squadId,
    { $set: { name: newName.trim() } },
    { new: true }
  );
  if (!squad) throw new AppError('Team squad not found', 404);
  return squad;
}

export async function assignMemberToSquad(
  personnelId: string,
  targetSquadId: string | null,
  userEmail?: string
): Promise<IPersonnel> {
  assertSuperUser(userEmail);
  const member = await Personnel.findById(personnelId);
  if (!member) throw new AppError('Personnel not found', 404);

  if (!targetSquadId) {
    member.departmentId = null;
    member.subDepartmentId = null;
    member.teamSquadId = null;
    member.reportsTo = null;
    member.lineage = [];
    member.status = 'STANDBY';
    await member.save();
    return member;
  }

  const squad = await TeamSquad.findById(targetSquadId);
  if (!squad) throw new AppError('Target squad not found', 404);

  const subDept = await DepartmentNode.findById(squad.subDepartmentId);
  if (!subDept) throw new AppError('Sub-department not found for squad', 404);

  const supervisor = await Personnel.findById(squad.supervisorId);
  if (!supervisor) throw new AppError('Supervisor not found for squad', 404);

  // Lineage validation & creation without circular dependencies
  const supLineage = supervisor.lineage || [];
  if (supLineage.some((id: any) => id.toString() === member._id.toString())) {
    throw new AppError('Circular reporting lineage detected', 400);
  }

  member.departmentId = subDept.parentDeptId || null;
  member.subDepartmentId = subDept._id;
  member.teamSquadId = squad._id;
  member.reportsTo = supervisor._id;
  member.lineage = [...supLineage, supervisor._id];
  member.status = 'ACTIVE';
  await member.save();
  return member;
}

export async function promoteDemotePersonnel(
  personnelId: string,
  newRole: 'DIRECTOR' | 'MANAGER' | 'SUPERVISOR' | 'EMPLOYEE' | 'INTERN',
  userEmail?: string
): Promise<IPersonnel> {
  assertSuperUser(userEmail);
  const validRoles = ['DIRECTOR', 'MANAGER', 'SUPERVISOR', 'EMPLOYEE', 'INTERN'];
  if (!validRoles.includes(newRole)) throw new AppError('Invalid role specified', 400);

  const member = await Personnel.findByIdAndUpdate(
    personnelId,
    { $set: { role: newRole } },
    { new: true }
  );
  if (!member) throw new AppError('Personnel not found', 404);
  return member;
}

export async function updateAIPersonaPrompt(
  personnelId: string,
  newPrompt: string,
  userEmail?: string
): Promise<IPersonnel> {
  assertSuperUser(userEmail);
  const member = await Personnel.findById(personnelId);
  if (!member) throw new AppError('Personnel not found', 404);
  if (!member.isVirtual) throw new AppError('Only virtual AI assistants have prompt overrides', 400);

  member.systemPrompt = newPrompt;
  await member.save();
  return member;
}

