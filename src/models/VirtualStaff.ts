import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type VirtualStaffRole = 'EXECUTIVE' | 'MANAGER' | 'SUPERVISOR' | 'SPECIALIST' | 'STANDBY';
export type VirtualStaffStatus = 'ACTIVE' | 'STANDBY' | 'DECOMMISSIONED';

export interface IVirtualStaff extends Document {
  staffId: string;
  name: string;
  gender: string;
  title: string;
  role: VirtualStaffRole;
  status: VirtualStaffStatus;
  departmentId?: Types.ObjectId | null;
  departmentCode?: string;
  supervisorSlot?: number | null;
  assignedTasks: string[];
  systemRole?: string;
  reportingTo?: string;
  color?: string;
  avatar?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const VirtualStaffSchema: Schema<IVirtualStaff> = new Schema(
  {
    staffId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      default: 'Female',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['EXECUTIVE', 'MANAGER', 'SUPERVISOR', 'SPECIALIST', 'STANDBY'],
      default: 'STANDBY',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'STANDBY', 'DECOMMISSIONED'],
      default: 'STANDBY',
      required: true,
      index: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'DepartmentNode',
      default: null,
      index: true,
    },
    departmentCode: {
      type: String,
      uppercase: true,
      trim: true,
      default: null,
      index: true,
    },
    supervisorSlot: {
      type: Number,
      default: null,
    },
    assignedTasks: {
      type: [String],
      default: [],
    },
    systemRole: {
      type: String,
      default: '',
    },
    reportingTo: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#3B82F6',
    },
    avatar: {
      type: String,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'virtual_staff',
  }
);

export const VirtualStaff: Model<IVirtualStaff> =
  mongoose.models.VirtualStaff || mongoose.model<IVirtualStaff>('VirtualStaff', VirtualStaffSchema);

export default VirtualStaff;

