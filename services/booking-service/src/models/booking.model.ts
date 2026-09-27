import { BookingStatus, BookingType, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

interface IAddressSnapshot {
  formatted: string;
  lat: number;
  lng: number;
}

interface IPriceBreakdown {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

interface IJobOtp {
  start?: string;
  restart?: string;
  end?: string;
}

interface IJobPhotos {
  before?: string;
  after?: string;
}

interface ICancellation {
  reason?: string;
  fee?: number;
  cancelledAt?: Date;
  cancelledByRole?: 'customer' | 'partner' | 'admin';
}

export interface IBooking extends Document {
  customerId: Types.ObjectId;
  partnerId?: Types.ObjectId;
  staffId?: Types.ObjectId;
  serviceId: Types.ObjectId;
  type: BookingType;
  status: BookingStatus;
  scheduledFor?: Date;
  address: IAddressSnapshot;
  notes?: string;
  toolsNeeded?: string[];
  priceBreakdown: IPriceBreakdown;
  paymentMethod?: string;
  otp: IJobOtp;
  photos: IJobPhotos;
  cancellation?: ICancellation;
  tipAmount?: number;
  extraHours?: number;
}

const addressSnapshotSchema = new Schema<IAddressSnapshot>(
  { formatted: { type: String, required: true }, lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  { _id: false },
);

const priceBreakdownSchema = new Schema<IPriceBreakdown>(
  {
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, required: true, default: 'OMR' },
  },
  { _id: false },
);

const jobOtpSchema = new Schema<IJobOtp>(
  { start: { type: String }, restart: { type: String }, end: { type: String } },
  { _id: false },
);

const jobPhotosSchema = new Schema<IJobPhotos>(
  { before: { type: String }, after: { type: String } },
  { _id: false },
);

const cancellationSchema = new Schema<ICancellation>(
  {
    reason: { type: String },
    fee: { type: Number },
    cancelledAt: { type: Date },
    cancelledByRole: { type: String, enum: ['customer', 'partner', 'admin'] },
  },
  { _id: false },
);

const bookingSchema = new Schema<IBooking>({
  customerId: { type: Schema.Types.ObjectId, required: true, index: true },
  partnerId: { type: Schema.Types.ObjectId, index: true },
  staffId: { type: Schema.Types.ObjectId, index: true },
  serviceId: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, enum: Object.values(BookingType), required: true },
  status: {
    type: String,
    enum: Object.values(BookingStatus),
    default: BookingStatus.Searching,
    index: true,
  },
  scheduledFor: { type: Date },
  address: { type: addressSnapshotSchema, required: true },
  notes: { type: String },
  toolsNeeded: { type: [String], default: [] },
  priceBreakdown: { type: priceBreakdownSchema, required: true },
  paymentMethod: { type: String },
  otp: { type: jobOtpSchema, default: {} },
  photos: { type: jobPhotosSchema, default: {} },
  cancellation: { type: cancellationSchema },
  tipAmount: { type: Number },
  extraHours: { type: Number },
});

bookingSchema.plugin(basePlugin);

export const Booking = model<IBooking>('Booking', bookingSchema);
