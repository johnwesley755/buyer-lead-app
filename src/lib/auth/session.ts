import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME } from './config';
import { getUserByEmail } from '../db/queries';

export async function getSession() {
  const cookieStore = await cookies(); // ✅ Await here
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    if (!decoded.email) {
      return null;
    }

    const user = await getUserByEmail(decoded.email);
    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const user = await getSession();

  if (!user) {
    redirect('/auth/login');
  }

  return user;
}
