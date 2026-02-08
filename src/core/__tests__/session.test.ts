import { describe, expect, it } from 'vitest';
import { parseSessionCookie } from '@/core/session';

describe('parseSessionCookie', () => {
  it('returns null for empty values', () => {
    expect(parseSessionCookie(undefined)).toBeNull();
    expect(parseSessionCookie(null)).toBeNull();
    expect(parseSessionCookie('')).toBeNull();
  });

  it('returns null for malformed json', () => {
    expect(parseSessionCookie('{oops')).toBeNull();
  });

  it('returns null when email is missing', () => {
    expect(parseSessionCookie(JSON.stringify({ role: 'user' }))).toBeNull();
  });

  it('returns parsed session for valid cookie', () => {
    const result = parseSessionCookie(JSON.stringify({ email: 'a@b.com', role: 'admin' }));

    expect(result).toEqual({ email: 'a@b.com', role: 'admin' });
  });

  it('drops invalid role values while keeping email', () => {
    const result = parseSessionCookie(JSON.stringify({ email: 'a@b.com', role: 123 }));

    expect(result).toEqual({ email: 'a@b.com', role: undefined });
  });
});
