import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IWallet extends Document {
  ownerId: Types.ObjectId;
  ownerRole: 'customer' | 'partner';
  balance: number;
  currency: string;
  bankAccount?: {
    accountHolder: string;
    iban: string;
    bankName: string;
  };
}

const walletSchema = new Schema<IWallet>({
  ownerId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
  ownerRole: { type: String, enum: ['customer', 'partner'], required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, required: true, default: 'OMR' },
  bankAccount: {
    accountHolder: { type: String },
    iban: { type: String },
    bankName: { type: String },
  },
});

walletSchema.plugin(basePlugin);

export const Wallet = model<IWallet>('Wallet', walletSchema);
