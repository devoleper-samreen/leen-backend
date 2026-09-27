import { RbacAccessLevel, RbacModule, basePlugin } from '@leen/shared';
import { Schema, model, Document } from 'mongoose';

interface IPermission {
  module: RbacModule;
  accessLevel: RbacAccessLevel;
}

export interface IRole extends Document {
  name: string;
  permissions: IPermission[];
}

const permissionSchema = new Schema<IPermission>(
  {
    module: { type: String, enum: Object.values(RbacModule), required: true },
    accessLevel: { type: String, enum: Object.values(RbacAccessLevel), required: true },
  },
  { _id: false },
);

const roleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions: { type: [permissionSchema], default: [] },
});

roleSchema.plugin(basePlugin);

export const Role = model<IRole>('Role', roleSchema);
