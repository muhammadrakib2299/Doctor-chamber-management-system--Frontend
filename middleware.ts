import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role-to-route mapping
const roleRoutes: Record<string, string[]> = {
    admin: ['/admin'],
    doctor: ['/doctor'],
    assistant: ['/assistant'],
};

// Public routes that don't require authentication
const publicRoutes = ['/', '/auth/login', '/auth/forgot-password'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (publicRoutes.some(route => pathname === route)) {
        return NextResponse.next();
    }

    // Allow static assets and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Read auth cookies set during login
    const token = request.cookies.get('auth-token')?.value || null;
    const userRole = request.cookies.get('auth-role')?.value || null;

    // Check if trying to access a protected route
    const isProtectedRoute = Object.values(roleRoutes)
        .flat()
        .some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        // No token — redirect to login
        if (!token) {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Check role-based access
        if (userRole) {
            const allowedRoutes = roleRoutes[userRole] || [];
            const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

            if (!hasAccess) {
                // Redirect to their correct dashboard
                const defaultRoute = allowedRoutes[0] || '/';
                const dashboardUrl = new URL(`${defaultRoute}/dashboard`, request.url);
                return NextResponse.redirect(dashboardUrl);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all routes except static files
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
