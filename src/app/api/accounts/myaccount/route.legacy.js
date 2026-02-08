import { NextResponse } from 'next/server';
import dbConnect from "@/utils/dbConnect";
import Account from "@/models/Account";
import { cookies } from 'next/headers';
import { parseSessionCookie } from '@/core/session';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    const session = parseSessionCookie(sessionCookie?.value);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await Account.findOne({ email: session.email });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      account: 'myaccount', 
      balance: account.balance,
      transactions: account.transactions,
      email: account.email
    });
  } catch (error) {
    console.error("Error in myaccount:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
