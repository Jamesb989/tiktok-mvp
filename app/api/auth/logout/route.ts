// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  // Clear the cookie by setting its value to empty and maxAge to 0
  cookies().set('access_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  // Redirect the user to the homepage
  const homeUrl = new URL('/', req.url);
  return NextResponse.redirect(homeUrl);
}