/**
 * DepartmentNode.ts
 * Represents both top-level Departments (DEP-01..DEP-12) and Sub-Department desks.
 * Zero-data-loss upgrade from previous schema — all legacy fields preserved.
 */
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type DepartmentLevel = 'DEPARTMENT' | 'SUB_DEPARTMENT';

export interface IDepartmentNode extends Document {
  code: string;
  slug: string;
  title: string;
  level: DepartmentLevel;
  parentDeptId?: Types.ObjectId | null;
  directorOrManagerId?: Types.ObjectId | null;
  order: number;
  // Legacy fields preserved for zero-data-loss
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentNodeSchema = new Schema<IDepartmentNode>(
  {
    code:   { type: String, required: true, uppercase: true, unique: true, trim: true },
    slug:   { type: String, required: true, lowercase: true, unique: true, trim: true },
    title:  { type: String, required: true, trim: true },
    level:  { type: String, enum: ['DEPARTMENT', 'SUB_DEPARTMENT'], default: 'DEPARTMENT' },
    parentDeptId:       { type: Schema.Types.ObjectId, ref: 'DepartmentNode', default: null },
    directorOrManagerId:{ type: Schema.Types.ObjectId, ref: 'Personnel', default: null },
    order:              { type: Number, default: 0 },
    // legacy preserved
    description: { type: String },
    color:       { type: String },
    icon:        { type: String },
  },
  { timestamps: true, collection: 'department_nodes' }
);

DepartmentNodeSchema.index({ slug: 1, parentDeptId: 1 });
DepartmentNodeSchema.index({ level: 1, order: 1 });

const DepartmentNode: Model<IDepartmentNode> =
  mongoose.models['DepartmentNode'] as Model<IDepartmentNode> ||
  mongoose.model<IDepartmentNode>('DepartmentNode', DepartmentNodeSchema);

export { DepartmentNode };
export default DepartmentNode;
