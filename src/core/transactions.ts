export type TransactionKind = 'Deposit' | 'Withdrawal' | 'Transfer';

export interface AccountTransaction {
  type: TransactionKind;
  amount: number;
  date: Date;
  to?: string | null;
  from?: string | null;
}

export interface AccountState {
  userId?: string | null;
  email: string;
  balance: number;
  transactions: AccountTransaction[];
}

export interface TransactionRequest {
  action: 'deposit' | 'withdraw' | 'transfer';
  amount: unknown;
  recipientId?: string;
}

export interface TransactionResult {
  ok: boolean;
  status: number;
  message: string;
  balance?: number;
}

export const parsePositiveAmount = (amount: unknown): number | null => {
  const numericAmount =
    typeof amount === 'number'
      ? amount
      : typeof amount === 'string'
        ? Number.parseFloat(amount)
        : Number.NaN;

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return null;
  }

  return numericAmount;
};

export const applyDeposit = (account: AccountState, amount: number): TransactionResult => {
  account.balance += amount;
  account.transactions.push({
    type: 'Deposit',
    amount,
    date: new Date(),
  });

  return {
    ok: true,
    status: 200,
    message: 'Deposit Successful',
    balance: account.balance,
  };
};

export const applyWithdrawal = (account: AccountState, amount: number): TransactionResult => {
  if (account.balance < amount) {
    return {
      ok: false,
      status: 400,
      message: 'Insufficient Funds',
    };
  }

  account.balance -= amount;
  account.transactions.push({
    type: 'Withdrawal',
    amount,
    date: new Date(),
  });

  return {
    ok: true,
    status: 200,
    message: 'Withdrawal Successful',
    balance: account.balance,
  };
};

export const applyTransfer = (
  sender: AccountState,
  recipient: AccountState | null,
  amount: number,
  recipientId?: string,
): TransactionResult => {
  if (!recipientId) {
    return {
      ok: false,
      status: 400,
      message: 'Recipient ID required',
    };
  }

  if (!recipient) {
    return {
      ok: false,
      status: 404,
      message: 'Recipient not found',
    };
  }

  if (sender.balance < amount) {
    return {
      ok: false,
      status: 400,
      message: 'Transfer Failed. Insufficient Funds',
    };
  }

  sender.balance -= amount;
  sender.transactions.push({
    type: 'Transfer',
    amount,
    date: new Date(),
    to: recipient.userId,
  });

  recipient.balance += amount;
  recipient.transactions.push({
    type: 'Deposit',
    amount,
    date: new Date(),
    from: sender.userId,
  });

  return {
    ok: true,
    status: 200,
    message: 'Transfer Successful',
    balance: sender.balance,
  };
};

export const validateTransactionRequest = (
  request: TransactionRequest,
): { amount: number | null; error: TransactionResult | null } => {
  const amount = parsePositiveAmount(request.amount);

  if (amount === null) {
    return {
      amount: null,
      error: {
        ok: false,
        status: 400,
        message: 'Invalid amount',
      },
    };
  }

  return { amount, error: null };
};
