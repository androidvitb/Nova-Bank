import { Schema, model, models, type Types } from 'mongoose';

export interface AccountTransaction {
  type: 'Deposit' | 'Withdrawal' | 'Transfer';
  amount: number;
  date: Date;
  to?: Types.ObjectId | string | null;
  from?: Types.ObjectId | string | null;
}

export interface AccountDocument {
  userId: Types.ObjectId | null;
  email: string;
  balance: number;
  transactions: AccountTransaction[];
}

const accountSchema = new Schema<AccountDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 1000,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ['Deposit', 'Withdrawal', 'Transfer'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
});

const Account = models.Account || model<AccountDocument>('Account', accountSchema);

export default Account;
