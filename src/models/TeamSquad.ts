/**
 * TeamSquad.ts
 * Dynamic squads created inside sub-departments.
 * Replaces legacy CustomSquad.ts for new hierarchy.
 * Legacy CustomSquad.ts preserved for zero-data-loss migration.
 */
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITeamSquad extends Document {
  name: string;
  subDepartmentId: Types.ObjectId;
  supervisorId: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSquadSchema = new Schema<ITeamSquad>(
  {
    name:            { type: String, required: true, trim: true },
    subDepartmentId: { type: Schema.Types.ObjectId, ref: 'DepartmentNode', required: true },
    supervisorId:    { type: Schema.Types.ObjectId, ref: 'Personnel', required: true },
    order:           { type: Number, default: 0 },
  },
  { timestamps: true }
);

TeamSquadSchema.index({ subDepartmentId: 1, order: 1 });
TeamSquadSchema.index({ supervisorId: 1 });

const TeamSquad: Model<ITeamSquad> =
  mongoose.models['TeamSquad'] as Model<ITeamSquad> ||
  mongoose.model<ITeamSquad>('TeamSquad', TeamSquadSchema);

export { TeamSquad };
export default TeamSquad;

