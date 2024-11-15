import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware((req) => {
  return NextResponse.next();
});

export const config = {
  matcher: ['/protected/:path*', '/dashboard/:path*'],
};
