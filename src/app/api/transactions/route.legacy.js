import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Account from '@/models/Account';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { parseSessionCookie } from '@/core/session';
import {
  applyDeposit,
  applyTransfer,
  applyWithdrawal,
  validateTransactionRequest,
} from '@/core/transactions';

export async function POST(req) {
  try {
    await dbConnect();

    // Get user from session cookie if user email is not provided
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    const session = parseSessionCookie(sessionCookie?.value);
    const currentUserEmail = session?.email ?? null;

    const { action, amount, recipientId, email: providedEmail } = await req.json();
    const email = providedEmail || currentUserEmail;

    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let userAccount = await Account.findOne({ email });

    if (!userAccount) {
      // Create account if it doesn't exist for this user (for demo purposes)
      const user = await User.findOne({ email });
      userAccount = await Account.create({
        userId: user ? user._id : null,
        email: email,
        balance: 1000,
        transactions: []
      });
    }

    const { amount: numAmount, error } = validateTransactionRequest({ action, amount, recipientId });
    if (error || numAmount === null) {
      return NextResponse.json(
        { message: error?.message ?? "Invalid amount" },
        { status: error?.status ?? 400 },
      );
    }

    switch (action) {
      case "deposit":
        {
          const result = applyDeposit(userAccount, numAmount);
          await userAccount.save();
          return NextResponse.json({ message: result.message, balance: result.balance });
        }

      case "withdraw":
        {
          const result = applyWithdrawal(userAccount, numAmount);
          if (!result.ok) {
            return NextResponse.json({ message: result.message }, { status: result.status });
          }
          await userAccount.save();
          return NextResponse.json({ message: result.message, balance: result.balance });
        }

      case "transfer":
        if (!recipientId) {
          return NextResponse.json({ message: "Recipient ID required" }, { status: 400 });
        }

        // Find recipient account (by email or userId)
        {
          const recipientAccount = await Account.findOne({
            $or: [{ email: recipientId }, { userId: recipientId }]
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
        return NextResponse.json({ message: "Invalid Action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in transactions route:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
