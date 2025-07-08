import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/dashboard/:path*', '/authentication'],
};

export async function middleware(request) {
  // Get token from cookies instead of headers.
  const token = request.cookies.get('token')?.value;
  console.log("Token from cookie:", token);
  const url = request.nextUrl;

  if (token && url.pathname.startsWith('/authentication')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/authentication', request.url));
  }

  return NextResponse.next();
}
