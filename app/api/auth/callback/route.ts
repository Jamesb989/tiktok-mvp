// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // It's good practice to check the state

  // Validate state to prevent CSRF
  if (state !== 'nudge') {
    return new NextResponse('Invalid state parameter', { status: 400 });
  }

  if (!code) {
    return new NextResponse('Missing authorization code', { status: 400 });
  }

  try {
    // We use URLSearchParams to ensure the body is x-www-form-urlencoded
    const body = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
    });

    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    const data = await response.json();

    if (!response.ok) {
      // Log the error for debugging and return a user-friendly message
      console.error('TikTok token exchange failed:', data);
      return new NextResponse(`Error from TikTok: ${data.error.message || 'Unknown Error'}`, { status: 500 });
    }

    const accessToken = data.data.access_token;
    const expiresIn = data.data.expires_in; // Use the dynamic expiration time

    // Redirect to the dashboard
    const redirectUrl = new URL('/dashboard', req.url);
    const res = NextResponse.redirect(redirectUrl);

    // Set the secure cookie
    res.cookies.set('access_token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: expiresIn, // Use the value from the API
      secure: process.env.NODE_ENV === 'production', // Only set secure in production
      sameSite: 'lax', // CSRF protection
    });

    return res;

  } catch (error) {
    console.error('Internal server error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

