import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware to protect admin routes based on user role
export async function middleware(req: NextRequest) {
  // Retrieve JWT session (requires NEXTAUTH_SECRET in env)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role as string | undefined;

  console.log('Middleware - Path:', req.nextUrl.pathname);
  console.log('Middleware - Token:', token ? 'exists' : 'missing');
  console.log('Middleware - Role:', role);

  const { pathname } = req.nextUrl;
  const isLabAdminPage = pathname.startsWith('/admin/lab');
  const isClinicAdminPage = pathname.startsWith('/admin/clinic') || pathname === '/admin';
  const isRootAdmin = pathname === '/admin';
  const isAdminRoute = pathname.startsWith('/admin');

  // 1. If not logged in and trying to access ANY admin route, redirect to login
  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const email = token?.email as string | undefined;

  // STRICT RULE: Only labadmin@maxi.com can access /admin/lab
  if (isLabAdminPage && email !== 'labadmin@maxi.com') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 2. If logged in but NOT an admin (e.g. CLIENT), deny access to ANY admin route
  // Assuming 'CLIENT' is the standard user role. Adjust if there are others.
  if (role === 'CLIENT' && isAdminRoute) {
    // Redirect to home or show 403 page
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 3. Role-based direction for Admins

  // Clinic admin (ADMIN) trying to access lab panel -> go to clinic panel
  if (role === 'ADMIN' && isLabAdminPage) {
    return NextResponse.redirect(new URL('/admin/clinic', req.url));
  }

  // Clinic admin at root /admin -> go to clinic panel
  if (role === 'ADMIN' && isRootAdmin) {
    return NextResponse.redirect(new URL('/admin/clinic', req.url));
  }

  // Lab admin (LAB_CLIENT) opening root /admin -> go to lab panel
  if (role === 'LAB_CLIENT' && isRootAdmin) {
    return NextResponse.redirect(new URL('/admin/lab', req.url));
  }

  // Lab admin trying to access clinic panel -> go to lab panel
  if (role === 'LAB_CLIENT' && isClinicAdminPage && !isRootAdmin) {
    return NextResponse.redirect(new URL('/admin/lab', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
