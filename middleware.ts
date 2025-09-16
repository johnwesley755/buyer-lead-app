import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_NAME } from './src/lib/auth/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the path is protected
  if (
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/api/auth') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/favicon.ico')
  ) {
    const sessionCookie = request.cookies.get(COOKIE_NAME);
    
    // If there's no session cookie, redirect to login
    if (!sessionCookie) {
      const url = new URL('/auth/login', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};