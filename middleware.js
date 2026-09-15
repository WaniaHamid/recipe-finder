import { NextResponse } from 'next/server';

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Normalized path without trailing slash
  const path = pathname.replace(/\/$/, '') || '/';

  // Only protect routes that strictly require authentication
  const protectedRoutes = ['/dashboard', '/favorites', '/grocery-list'];
  const isProtectedRoute = protectedRoutes.some(route => path === route || path.startsWith(`${route}/`));

  // If trying to access protected route without valid token
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Basic token validation for Edge Runtime
    const payload = decodeJwtPayload(token);
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // If logged in user tries to access auth pages, redirect to dashboard
  if (token && (path === '/login' || path === '/register')) {
    const payload = decodeJwtPayload(token);
    // Check if token is not expired
    if (payload && (!payload.exp || payload.exp * 1000 > Date.now())) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};