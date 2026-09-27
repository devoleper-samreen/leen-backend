import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

interface IAddress {
  label: string;
  lat: number;
  lng: number;
  formatted: string;
  isPrimary: boolean;
}

export interface ICustomerProfile extends Document {
  userId: Types.ObjectId;
  fullName: string;
  addresses: IAddress[];
}

const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    formatted: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

const customerProfileSchema = new Schema<ICustomerProfile>({
  userId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  addresses: { type: [addressSchema], default: [] },
});

customerProfileSchema.plugin(basePlugin);

export const CustomerProfile = model<ICustomerProfile>('CustomerProfile', customerProfileSchema);
