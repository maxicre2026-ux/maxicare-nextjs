import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware to protect admin routes based on user role
export async function middleware(req: NextRequest) {
  // Retrieve JWT session (requires NEXTAUTH_SECRET in env)
  const session = await getToken({ req });
  const role = (session?.user as any)?.role as string | undefined;

  const { pathname } = req.nextUrl;
  const isLabAdminPage = pathname.startsWith('/admin/lab');
  const isClinicAdminPage = pathname.startsWith('/admin/clinic') || pathname === '/admin';
  const isRootAdmin = pathname === '/admin';
  const isAdminRoute = pathname.startsWith('/admin');

  // If not logged in and trying to access admin, redirect to login
  if (!role && isAdminRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Role-based access control
  // Clinic admin trying to access lab panel
  if (role === 'CLINIC_ADMIN' && isLabAdminPage) {
    return NextResponse.redirect(new URL('/clinic', req.url));
  }

  // Lab admin opening root /admin? redirect to lab panel
  if (role === 'LAB_ADMIN' && isRootAdmin) {
    return NextResponse.redirect(new URL('/admin/lab', req.url));
  }
  // Lab admin trying to access clinic panel
  if (role === 'LAB_ADMIN' && isClinicAdminPage) {
    return NextResponse.redirect(new URL('/lab', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
