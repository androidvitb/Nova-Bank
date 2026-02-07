import { NextResponse } from 'next/server';
import dbConnect from "@/utils/dbConnect";
import Account from "@/models/Account";
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const account = await Account.findOne({ email: session.email });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ balance: account.balance, transactions: account.transactions });
  } catch (error) {
    console.error("Error in getBalance:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Keep POST for backward compatibility if needed, but prefer GET with session
export async function POST(req) {
  try {
    await dbConnect();
    const { userId, email } = await req.json();

    const query = email ? { email } : { userId };
    const account = await Account.findOne(query);

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ balance: account.balance, transactions: account.transactions });
  } catch (error) {
    console.error("Error in getBalance POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
