import { describe, expect, it } from 'vitest';
import {
  applyDeposit,
  applyTransfer,
  applyWithdrawal,
  parsePositiveAmount,
  validateTransactionRequest,
  type AccountState,
} from '@/core/transactions';

const makeAccount = (overrides: Partial<AccountState> = {}): AccountState => ({
  userId: 'u1',
  email: 'user@example.com',
  balance: 100,
  transactions: [],
  ...overrides,
});

describe('parsePositiveAmount', () => {
  it('accepts positive numbers and strings', () => {
    expect(parsePositiveAmount(12)).toBe(12);
    expect(parsePositiveAmount('12.5')).toBe(12.5);
  });

  it('rejects invalid values', () => {
    expect(parsePositiveAmount('')).toBeNull();
    expect(parsePositiveAmount('abc')).toBeNull();
    expect(parsePositiveAmount(0)).toBeNull();
    expect(parsePositiveAmount(-5)).toBeNull();
    expect(parsePositiveAmount(undefined)).toBeNull();
  });
});

describe('validateTransactionRequest', () => {
  it('returns validation error for invalid amount', () => {
    const result = validateTransactionRequest({ action: 'deposit', amount: 'bad' });

    expect(result.amount).toBeNull();
    expect(result.error).toEqual({ ok: false, status: 400, message: 'Invalid amount' });
  });

  it('returns parsed amount for valid request', () => {
    const result = validateTransactionRequest({ action: 'withdraw', amount: '20' });

    expect(result.error).toBeNull();
    expect(result.amount).toBe(20);
  });
});

describe('applyDeposit', () => {
  it('increments balance and appends transaction', () => {
    const account = makeAccount();
    const result = applyDeposit(account, 25);

    expect(result).toMatchObject({ ok: true, status: 200, message: 'Deposit Successful', balance: 125 });
    expect(account.balance).toBe(125);
    expect(account.transactions[0]?.type).toBe('Deposit');
  });
});

describe('applyWithdrawal', () => {
  it('rejects insufficient funds', () => {
    const account = makeAccount({ balance: 10 });
    const result = applyWithdrawal(account, 20);

    expect(result).toEqual({ ok: false, status: 400, message: 'Insufficient Funds' });
    expect(account.balance).toBe(10);
  });

  it('debits balance and appends transaction when funds are sufficient', () => {
    const account = makeAccount({ balance: 100 });
    const result = applyWithdrawal(account, 20);

    expect(result).toMatchObject({ ok: true, status: 200, message: 'Withdrawal Successful', balance: 80 });
    expect(account.balance).toBe(80);
    expect(account.transactions[0]?.type).toBe('Withdrawal');
  });
});

describe('applyTransfer', () => {
  it('rejects missing recipient id', () => {
    const sender = makeAccount({ userId: 's1' });
    const recipient = makeAccount({ userId: 'r1' });

    const result = applyTransfer(sender, recipient, 20);

    expect(result).toEqual({ ok: false, status: 400, message: 'Recipient ID required' });
  });

  it('rejects missing recipient account', () => {
    const sender = makeAccount({ userId: 's1' });

    const result = applyTransfer(sender, null, 20, 'r1');

    expect(result).toEqual({ ok: false, status: 404, message: 'Recipient not found' });
  });

  it('rejects transfer when sender has insufficient funds', () => {
    const sender = makeAccount({ userId: 's1', balance: 5 });
    const recipient = makeAccount({ userId: 'r1', balance: 10 });

    const result = applyTransfer(sender, recipient, 20, 'r1');

    expect(result).toEqual({ ok: false, status: 400, message: 'Transfer Failed. Insufficient Funds' });
  });

  it('transfers funds and appends transactions on both accounts', () => {
    const sender = makeAccount({ userId: 's1', balance: 100 });
    const recipient = makeAccount({ userId: 'r1', balance: 10 });

    const result = applyTransfer(sender, recipient, 25, 'r1');

    expect(result).toMatchObject({ ok: true, status: 200, message: 'Transfer Successful', balance: 75 });
    expect(sender.balance).toBe(75);
    expect(recipient.balance).toBe(35);
    expect(sender.transactions[0]).toMatchObject({ type: 'Transfer', amount: 25, to: 'r1' });
    expect(recipient.transactions[0]).toMatchObject({ type: 'Deposit', amount: 25, from: 's1' });
  });
});
