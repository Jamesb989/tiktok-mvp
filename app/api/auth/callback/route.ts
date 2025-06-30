// app/api/auth/callback/route.ts (Temporary Debugging Code)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse('Error: Missing authorization code from TikTok', { status: 400 });
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
      return new NextResponse(`<h1>Error from TikTok</h1><pre>${JSON.stringify(tokenData.error, null, 2)}</pre>`, {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const accessToken = tokenData.data.access_token;
    const expiresIn = tokenData.data.expires_in;

    // Instead of a redirect, we return an HTML page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authenticated!</title>
          <script>
            // This script will run in the browser
            window.location.href = '/dashboard';
          </script>
        </head>
        <body>
          <h1>Authentication Successful!</h1>
          <p>You should be redirected to the dashboard shortly.</p>
          <p>If you are not redirected, <a href="/dashboard">click here</a>.</p>
        </body>
      </html>
    `;

    // Create the response with the HTML
    const response = new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
    
    // Set the cookie on this response
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
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new NextResponse(`<h1>Internal Server Error</h1><p>${errorMessage}</p>`, { 
        status: 500,
        headers: { 'Content-Type': 'text/html' }
    });
  }
}

