import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { instagram_username, instagram_url } = await request.json()
    
    const supabase = createClient()
    
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('instagram_username', instagram_username)
      .maybeSingle()
    
    if (existing) {
      return NextResponse.json({ success: true, data: existing })
    }
    
    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        instagram_username,
        instagram_url
      })
      .select()
      .single()
      
    if (error) throw error
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
