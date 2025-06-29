import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  console.log('📨 Incoming invite POST request...')

  const access_token = req.cookies.get('access_token')?.value
  if (!access_token) {
    console.warn('⚠️ No access token found. Redirecting to /login')
    return NextResponse.redirect('/login')
  }

  try {
    const formData = await req.formData()
    const creator_id = formData.get('creator_id') as string

    if (!creator_id) {
      console.warn('⚠️ No creator_id in form data.')
      return new NextResponse('Missing creator_id', { status: 400 })
    }

    console.log(`🎯 Sending invitation to creator ${creator_id}`)

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

    console.log('✅ Invite sent successfully!')
    return NextResponse.redirect('/dashboard')
  } catch (error) {
    console.error('❌ Error sending invite:', error)
    return new NextResponse('Failed to send invite', { status: 500 })
  }
}
