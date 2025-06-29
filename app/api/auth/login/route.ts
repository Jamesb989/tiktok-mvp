import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // You can log it or ignore it explicitly
  void req

  const url = new URL('https://www.tiktok.com/v2/auth/authorize')

  url.searchParams.set('client_key', process.env.TIKTOK_CLIENT_KEY!)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'user.info.basic open_api.cm')
  url.searchParams.set('redirect_uri', process.env.TIKTOK_REDIRECT_URI!)
  url.searchParams.set('state', 'nudge')

  return NextResponse.redirect(url.toString())
}

