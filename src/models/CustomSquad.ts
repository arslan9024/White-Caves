import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICustomSquad extends Document {
  squadCode: string;
  name: string;
  departmentId: Types.ObjectId;
  supervisorId: Types.ObjectId;
  memberStaffIds: Types.ObjectId[];
  focusArea: string;
  slaTargetMinutes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomSquadSchema: Schema<ICustomSquad> = new Schema(
  {
    squadCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'DepartmentNode',
      required: true,
      index: true,
    },
    supervisorId: {
      type: Schema.Types.ObjectId,
      ref: 'VirtualStaff',
      required: true,
      index: true,
    },
    memberStaffIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'VirtualStaff',
      },
    ],
    focusArea: {
      type: String,
      default: '',
    },
    slaTargetMinutes: {
      type: Number,
      default: 15,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'custom_squads',
  }
);

export const CustomSquad: Model<ICustomSquad> =
  mongoose.models.CustomSquad || mongoose.model<ICustomSquad>('CustomSquad', CustomSquadSchema);

export default CustomSquad;

