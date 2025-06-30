// app/api/auth/callback/route.ts (Final Production Code)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    // In production, it's better to redirect with an error param
    const errorUrl = new URL('/login', req.url);
    errorUrl.searchParams.set('error', 'Missing authorization code from TikTok');
    return NextResponse.redirect(errorUrl);
  }

  try {
    const body = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
    });

    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('TikTok token exchange failed:', tokenData);
      const errorUrl = new URL('/login', req.url);
      errorUrl.searchParams.set('error', 'Failed to get token from TikTok.');
      return NextResponse.redirect(errorUrl);
    }

    const accessToken = tokenData.data.access_token;
    const expiresIn = tokenData.data.expires_in;

    const redirectUrl = new URL('/dashboard', req.url);
    const response = NextResponse.redirect(redirectUrl);
    
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: expiresIn,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('Internal server error in callback:', error);
    const errorUrl = new URL('/login', req.url);
    errorUrl.searchParams.set('error', 'An internal server error occurred.');
    return NextResponse.redirect(errorUrl);
  }
}

