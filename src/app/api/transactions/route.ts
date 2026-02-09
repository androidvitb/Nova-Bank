import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/utils/dbConnect';
import Account from '@/models/Account';
import User from '@/models/User';
import { parseSessionCookie } from '@/core/session';
import {
  applyDeposit,
  applyTransfer,
  applyWithdrawal,
  validateTransactionRequest,
} from '@/core/transactions';

type TransactionAction = 'deposit' | 'withdraw' | 'transfer';

interface TransactionBody {
  action?: TransactionAction;
  amount?: unknown;
  recipientId?: string;
  email?: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = parseSessionCookie(cookies().get('session')?.value);
    const currentUserEmail = session?.email ?? null;

    const { action, amount, recipientId, email: providedEmail } = (await req.json()) as TransactionBody;
    const email = providedEmail || currentUserEmail;

    if (!email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!action) {
      return NextResponse.json({ message: 'Invalid Action' }, { status: 400 });
    }

    let userAccount = await Account.findOne({ email });

    if (!userAccount) {
      const user = await User.findOne({ email });
      userAccount = await Account.create({
        userId: user ? user._id : null,
        email,
        balance: 1000,
        transactions: [],
      });
    }

    const { amount: numAmount, error } = validateTransactionRequest({ action, amount, recipientId });
    if (error || numAmount === null) {
      return NextResponse.json(
        { message: error?.message ?? 'Invalid amount' },
        { status: error?.status ?? 400 },
      );
    }

    switch (action) {
      case 'deposit': {
        const result = applyDeposit(userAccount, numAmount);
        await userAccount.save();
        return NextResponse.json({ message: result.message, balance: result.balance });
      }

      case 'withdraw': {
        const result = applyWithdrawal(userAccount, numAmount);
        if (!result.ok) {
          return NextResponse.json({ message: result.message }, { status: result.status });
        }
        await userAccount.save();
        return NextResponse.json({ message: result.message, balance: result.balance });
      }

      case 'transfer': {
        if (!recipientId) {
          return NextResponse.json({ message: 'Recipient ID required' }, { status: 400 });
        }

        const recipientAccount = await Account.findOne({
          $or: [{ email: recipientId }, { userId: recipientId }],
        });

        const result = applyTransfer(userAccount, recipientAccount, numAmount, recipientId);

        if (!result.ok) {
          return NextResponse.json({ message: result.message }, { status: result.status });
        }

        await userAccount.save();
        await recipientAccount.save();
        return NextResponse.json({ message: result.message, balance: result.balance });
      }

      default:
        return NextResponse.json({ message: 'Invalid Action' }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('Error in transactions route:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Internal server error', error: message }, { status: 500 });
  }
}
