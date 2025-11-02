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
  const isClinicAdminPage = pathname.startsWith('/admin/clinic');
  const isAdminRoute = isLabAdminPage || isClinicAdminPage;

  // If not logged in and trying to access admin, redirect to login
  if (!role && isAdminRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Role-based access control
  if (role === 'CLINIC_ADMIN' && isLabAdminPage) {
    return NextResponse.redirect(new URL('/clinic', req.url));
  }

  if (role === 'LAB_ADMIN' && isClinicAdminPage) {
    return NextResponse.redirect(new URL('/lab', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
