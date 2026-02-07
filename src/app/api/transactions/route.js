import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Account from '@/models/Account';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await dbConnect();
    
    // Get user from session cookie if userId is not provided
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    let currentUserEmail = null;
    
    if (sessionCookie) {
      const session = JSON.parse(sessionCookie.value);
      currentUserEmail = session.email;
    }

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

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    switch (action) {
      case "deposit":
        userAccount.balance += numAmount;
        userAccount.transactions.push({
          type: 'Deposit',
          amount: numAmount,
          date: new Date()
        });
        await userAccount.save();
        return NextResponse.json({ message: "Deposit Successful", balance: userAccount.balance });

      case "withdraw":
        if (userAccount.balance >= numAmount) {
          userAccount.balance -= numAmount;
          userAccount.transactions.push({
            type: 'Withdrawal',
            amount: numAmount,
            date: new Date()
          });
          await userAccount.save();
          return NextResponse.json({ message: "Withdrawal Successful", balance: userAccount.balance });
        }
        return NextResponse.json({ message: "Insufficient Funds" }, { status: 400 });

      case "transfer":
        if (!recipientId) {
          return NextResponse.json({ message: "Recipient ID required" }, { status: 400 });
        }

        // Find recipient account (by email or userId)
        let recipientAccount = await Account.findOne({ 
          $or: [{ email: recipientId }, { userId: recipientId }] 
        });

        if (!recipientAccount) {
          return NextResponse.json({ message: "Recipient not found" }, { status: 404 });
        }

        if (userAccount.balance >= numAmount) {
          userAccount.balance -= numAmount;
          userAccount.transactions.push({
            type: 'Transfer',
            amount: numAmount,
            date: new Date(),
            to: recipientAccount.userId
          });

          recipientAccount.balance += numAmount;
          recipientAccount.transactions.push({
            type: 'Deposit', // Or 'Transfer Received'
            amount: numAmount,
            date: new Date(),
            from: userAccount.userId
          });

          await userAccount.save();
          await recipientAccount.save();
          return NextResponse.json({ message: "Transfer Successful", balance: userAccount.balance });
        }
        return NextResponse.json({ message: "Transfer Failed. Insufficient Funds" }, { status: 400 });

      default:
        return NextResponse.json({ message: "Invalid Action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in transactions route:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
