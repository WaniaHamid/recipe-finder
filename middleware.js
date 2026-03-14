import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/api/auth/login',
    '/api/auth/register',
    '/api/recipes',
    '/api/seed'
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/api/recipes/')
  );

  // If trying to access protected route without token
  if (!isPublicRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Basic token validation for Edge Runtime
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
      }

      const payload = JSON.parse(atob(parts[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // If logged in user tries to access auth pages, redirect to dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        // Check if token is not expired
        if (!payload.exp || payload.exp * 1000 > Date.now()) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    } catch (error) {
      // If token is invalid, let them access auth pages
      console.error('Token validation error:', error);
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