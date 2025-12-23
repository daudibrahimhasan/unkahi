import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { recipient_instagram, message, deviceInfo } = await request.json()
    
    const supabase = createClient()
    
    // Check if recipient exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, message_count')
      .eq('instagram_username', recipient_instagram)
      .maybeSingle()
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Get IP and location info
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'
    
    const country = request.headers.get('x-vercel-ip-country') || 'unknown'
    
    // Insert message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        recipient_instagram,
        message_text: message,
        sender_ip: ip,
        sender_browser: deviceInfo.browser,
        sender_device: deviceInfo.device,
        sender_fingerprint: deviceInfo.fingerprint,
        sender_country: country
      })
      .select()
      .single()
    
    if (messageError) throw messageError
    
    // Update user message count
    await supabase
      .from('users')
      .update({
        message_count: (user.message_count || 0) + 1,
        last_message_at: new Date().toISOString()
      })
      .eq('instagram_username', recipient_instagram)
    
    return NextResponse.json({ success: true, data: messageData })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
