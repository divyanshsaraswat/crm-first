import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Define all paths that require a user to be logged in
  const protectedPaths = [
    '/users',
    '/settings',
    '/contacts',
    '/accounts',
    '/tasks',
    '/reports',
  ];
  
  // Define paths that an authenticated user should be redirected from
  const publicPaths = ['/login', '/signup'];

  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if the current path is a protected path
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // Check if the current path is a public path
  const isPublicPath = publicPaths.includes(pathname);

  // RULE 1: Redirect to login if user is not authenticated and accessing a protected route.
  if (!token && isProtectedPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // RULE 2: Redirect to a dashboard/home page if an authenticated user tries to access a public route like /login.
  if (token && isPublicPath) {
    const homeUrl = new URL('/users', request.url); // Or your default dashboard URL
    return NextResponse.redirect(homeUrl);
  }

  // If no rules match, continue to the requested destination
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};