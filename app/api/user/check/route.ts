import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username')
    
    if (!username) {
      return NextResponse.json({ exists: false })
    }
    
    const supabase = createClient()
    
    const { data } = await supabase
      .from('users')
      .select('instagram_url')
      .eq('instagram_username', username)
      .maybeSingle()
    
    return NextResponse.json({
      exists: !!data,
      instagram_url: data?.instagram_url
    })
  } catch (error) {
    return NextResponse.json({ exists: false })
  }
}
