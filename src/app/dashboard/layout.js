import React from 'react';
import { cookies } from 'next/headers';
import dbConnect from '@/utils/dbConnect';
import Account from '@/models/Account';
import DashboardNav from '@/components/Dashboard/DashboardNav';

async function getBalance() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) return 0;

  try {
    const session = JSON.parse(sessionCookie.value);
    await dbConnect();
    const account = await Account.findOne({ email: session.email });
    return account ? account.balance : 0;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return 0;
  }
}

export default async function DashboardLayout({ children }) {
  const balance = await getBalance();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <DashboardNav balance={balance} />
      <main>
        {children}
      </main>
    </div>
  );
}
