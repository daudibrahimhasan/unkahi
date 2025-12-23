import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const { instagram_username } = await request.json()
    
    const supabase = createClient()
    
    // Generate unique code
    const code = nanoid(16)
    
    // Expires in 365 days
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 365)
    
    const { data, error } = await supabase
      .from('access_codes')
      .insert({
        instagram_username,
        code,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, code: data.code })
  } catch (error) {
    console.error('Generate access code error:', error)
    return NextResponse.json(
      { error: 'Failed to generate access code' },
      { status: 500 }
    )
  }
}
