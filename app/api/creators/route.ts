// app/api/creators/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // CORRECTED: Get the cookie directly from the request object.
  const tokenCookie = req.cookies.get('access_token');

  if (!tokenCookie) {
    return NextResponse.json({ error: 'Authentication token not found.' }, { status: 401 });
  }

  const accessToken = tokenCookie.value;

  try {
    const url = new URL('https://open.tiktokapis.com/v2/user/info/');
    url.searchParams.set('fields', 'open_id,display_name,follower_count');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok || data.error?.code) {
      console.error('TikTok API Error:', data.error);
      return NextResponse.json({ message: `TikTok API Error: ${data.error.message}` }, { status: response.status });
    }

    return NextResponse.json({ user: data.data.user });

  } catch (error) {
    console.error('Internal Server Error fetching creator data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
