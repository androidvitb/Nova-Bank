export interface SessionData {
  email: string;
  role?: string;
}

export const parseSessionCookie = (
  rawCookieValue?: string | null,
): SessionData | null => {
  if (!rawCookieValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawCookieValue) as Partial<SessionData>;

    if (!parsed || typeof parsed.email !== 'string' || parsed.email.length === 0) {
      return null;
    }

    return {
      email: parsed.email,
      role: typeof parsed.role === 'string' ? parsed.role : undefined,
    };
  } catch {
    return null;
  }
};
