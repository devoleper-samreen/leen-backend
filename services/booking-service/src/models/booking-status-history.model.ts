import { BookingStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IBookingStatusHistory extends Document {
  bookingId: Types.ObjectId;
  fromStatus?: BookingStatus;
  toStatus: BookingStatus;
  actorRole: 'customer' | 'partner' | 'staff' | 'admin' | 'system';
  actorId?: Types.ObjectId;
  changedAt: Date;
}

const bookingStatusHistorySchema = new Schema<IBookingStatusHistory>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  fromStatus: { type: String, enum: Object.values(BookingStatus) },
  toStatus: { type: String, enum: Object.values(BookingStatus), required: true },
  actorRole: {
    type: String,
    enum: ['customer', 'partner', 'staff', 'admin', 'system'],
    required: true,
  },
  actorId: { type: Schema.Types.ObjectId },
  changedAt: { type: Date, default: Date.now },
});

bookingStatusHistorySchema.plugin(basePlugin);

export const BookingStatusHistory = model<IBookingStatusHistory>(
  'BookingStatusHistory',
  bookingStatusHistorySchema,
);
