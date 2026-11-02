/**
 * Personnel.ts
 * Unified model for Human Staff, Interns, and AI Assistants.
 * Replaces the legacy VirtualStaff model for production use.
 * Legacy VirtualStaff.ts is preserved for zero-data-loss migration.
 */
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type EmploymentType = 'EXECUTIVE' | 'FULL_TIME' | 'INTERN' | 'AI_AGENT';
export type PersonnelRole = 'DIRECTOR' | 'MANAGER' | 'SUPERVISOR' | 'EMPLOYEE' | 'INTERN';
export type PersonnelStatus = 'ACTIVE' | 'STANDBY' | 'ON_LEAVE' | 'TERMINATED';

export interface IPersonnel extends Document {
  employeeId: string;
  fullName: string;
  email?: string;
  phone?: string;
  employmentType: EmploymentType;
  role: PersonnelRole;
  departmentId?: Types.ObjectId | null;
  subDepartmentId?: Types.ObjectId | null;
  teamSquadId?: Types.ObjectId | null;
  reportsTo?: Types.ObjectId | null;
  lineage: Types.ObjectId[];
  isVirtual: boolean;
  systemPrompt?: string;
  status: PersonnelStatus;
  // UI/display fields
  title?: string;
  color?: string;
  avatar?: string;
  gender?: string;
  assignedTasks?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PersonnelSchema = new Schema<IPersonnel>(
  {
    employeeId:     { type: String, required: true, unique: true, trim: true },
    fullName:       { type: String, required: true, trim: true },
    email:          { type: String, lowercase: true, sparse: true, trim: true },
    phone:          { type: String, trim: true },
    employmentType: { type: String, enum: ['EXECUTIVE','FULL_TIME','INTERN','AI_AGENT'], default: 'AI_AGENT' },
    role:           { type: String, enum: ['DIRECTOR','MANAGER','SUPERVISOR','EMPLOYEE','INTERN'], default: 'EMPLOYEE' },
    departmentId:   { type: Schema.Types.ObjectId, ref: 'DepartmentNode', default: null },
    subDepartmentId:{ type: Schema.Types.ObjectId, ref: 'DepartmentNode', default: null },
    teamSquadId:    { type: Schema.Types.ObjectId, ref: 'TeamSquad', default: null },
    reportsTo:      { type: Schema.Types.ObjectId, ref: 'Personnel', default: null },
    lineage:        [{ type: Schema.Types.ObjectId, ref: 'Personnel' }],
    isVirtual:      { type: Boolean, default: false },
    systemPrompt:   { type: String },
    status:         { type: String, enum: ['ACTIVE','STANDBY','ON_LEAVE','TERMINATED'], default: 'STANDBY' },
    // display fields
    title:          { type: String },
    color:          { type: String },
    avatar:         { type: String },
    gender:         { type: String },
    assignedTasks:  [{ type: String }],
  },
  { timestamps: true }
);

PersonnelSchema.index({ reportsTo: 1 });
PersonnelSchema.index({ lineage: 1 });
PersonnelSchema.index({ departmentId: 1, subDepartmentId: 1 });
PersonnelSchema.index({ teamSquadId: 1 });
PersonnelSchema.index({ status: 1 });
PersonnelSchema.index({ isVirtual: 1, status: 1 });

const Personnel: Model<IPersonnel> =
  mongoose.models['Personnel'] as Model<IPersonnel> ||
  mongoose.model<IPersonnel>('Personnel', PersonnelSchema);

export { Personnel };
export default Personnel;

