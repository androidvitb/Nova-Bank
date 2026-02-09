import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/utils/dbConnect';
import Account from '@/models/Account';
import { parseSessionCookie } from '@/core/session';

interface GetBalanceBody {
  userId?: string;
  email?: string;
}

export async function GET(_req: NextRequest) {
  try {
    await dbConnect();
    const sessionCookie = cookies().get('session');
    const session = parseSessionCookie(sessionCookie?.value);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const account = await Account.findOne({ email: session.email });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ balance: account.balance, transactions: account.transactions });
  } catch (error: unknown) {
    console.error('Error in getBalance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, email } = (await req.json()) as GetBalanceBody;

    const query = email ? { email } : { userId };
    const account = await Account.findOne(query);

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ balance: account.balance, transactions: account.transactions });
  } catch (error: unknown) {
    console.error('Error in getBalance POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
