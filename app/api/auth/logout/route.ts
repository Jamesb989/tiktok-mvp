// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Create the redirect response to the homepage
  const homeUrl = new URL('/', req.url);
  const response = NextResponse.redirect(homeUrl);

  // Clear the cookie on the response object
  response.cookies.set('access_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0, // Expire the cookie immediately
  });

  // Return the response with the cleared cookie
  return response;
}