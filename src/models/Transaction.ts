import { Schema, model, models, type Types } from 'mongoose';

export interface TransactionDocument {
  accountId: Types.ObjectId;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  date: Date;
  description?: string;
}

const transactionSchema = new Schema<TransactionDocument>({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
});

const Transaction = models.Transaction || model<TransactionDocument>('Transaction', transactionSchema);

export default Transaction;
