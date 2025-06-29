import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return new NextResponse('Missing code', { status: 400 })
  }

  const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
    client_key: process.env.TIKTOK_CLIENT_KEY,
    client_secret: process.env.TIKTOK_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.TIKTOK_REDIRECT_URI,
  })

  const { access_token } = response.data.data

  const res = NextResponse.redirect('/dashboard')
  res.cookies.set('access_token', access_token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60,
  })

  return res
}

