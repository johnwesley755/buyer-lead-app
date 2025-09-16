import { createId } from '@paralleldrive/cuid2';

export const AUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!AUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set');
}

export const COOKIE_NAME = 'buyer-lead-app-session';
export const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export function generateToken() {
  return createId();
}