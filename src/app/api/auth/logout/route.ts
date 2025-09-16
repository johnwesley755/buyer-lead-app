import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/lib/auth/config';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  
  // Delete the session cookie
  cookieStore.delete(COOKIE_NAME);
  
  // Redirect to login page
  return NextResponse.redirect(new URL('/auth/login', req.url));
}