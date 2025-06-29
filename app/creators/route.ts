import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  const access_token = req.cookies.get('access_token')?.value
  if (!access_token) return NextResponse.redirect('/login')

  const formData = await req.formData()
  const creator_id = formData.get('creator_id') as string

  await axios.post(
    'https://open.tiktokapis.com/v2/open_api/cm/v2/invitation/create/',
    {
      creator_id,
      campaign_name: 'Nudge Demo Campaign',
      description: 'We’d love to collaborate with you on a branded content project.',
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return NextResponse.redirect('/dashboard')
}
