import { WalletTransactionDirection, WalletTransactionStatus, WalletTransactionType, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Wallet.balance stays for fast reads, but this append-only ledger is the
 * source of truth for reconciliation - every balance change must be
 * traceable to a transaction.
 */
export interface IWalletTransaction extends Document {
  walletId: Types.ObjectId;
  ownerId: Types.ObjectId;
  direction: WalletTransactionDirection;
  amount: number;
  type: WalletTransactionType;
  referenceType?: 'booking' | 'payout' | 'refund' | 'manual';
  referenceId?: Types.ObjectId;
  status: WalletTransactionStatus;
  balanceBefore: number;
  balanceAfter: number;
}

const walletTransactionSchema = new Schema<IWalletTransaction>({
  walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true, index: true },
  ownerId: { type: Schema.Types.ObjectId, required: true, index: true },
  direction: { type: String, enum: Object.values(WalletTransactionDirection), required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: Object.values(WalletTransactionType), required: true },
  referenceType: { type: String, enum: ['booking', 'payout', 'refund', 'manual'] },
  referenceId: { type: Schema.Types.ObjectId },
  status: {
    type: String,
    enum: Object.values(WalletTransactionStatus),
    default: WalletTransactionStatus.Pending,
  },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
});

walletTransactionSchema.plugin(basePlugin);

export const WalletTransaction = model<IWalletTransaction>(
  'WalletTransaction',
  walletTransactionSchema,
);
