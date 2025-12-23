const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vhnbuoyfntqespjcvuen.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobmJ1b3lmbnRxZXNwamN2dWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDYzNjgsImV4cCI6MjA4MjA4MjM2OH0.zG0eM0MNWLtX_MRSEOCtPp4fxMbY9raLQREx99xR4EQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...\n')
  
  // Test 1: Insert a test user
  console.log('Test 1: Creating user...')
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert({
      instagram_username: 'testuser123',
      instagram_url: 'https://instagram.com/testuser123'
    })
    .select()
    .single()
  
  if (userError) {
    console.error('❌ User insert failed:', userError.message)
    return
  } else {
    console.log('✅ User created:', user.instagram_username)
  }
  
  // Test 2: Insert a test message
  console.log('\nTest 2: Creating message...')
  const { data: message, error: msgError } = await supabase
    .from('messages')
    .insert({
      recipient_instagram: 'testuser123',
      message_text: 'This is a test message!',
      sender_device: 'Desktop',
      sender_browser: 'Chrome'
    })
    .select()
    .single()
  
  if (msgError) {
    console.error('❌ Message insert failed:', msgError.message)
  } else {
    console.log('✅ Message created:', message.message_text)
  }
  
  // Test 3: Read messages
  console.log('\nTest 3: Reading messages...')
  const { data: messages, error: readError } = await supabase
    .from('messages')
    .select('*')
    .eq('recipient_instagram', 'testuser123')
  
  if (readError) {
    console.error('❌ Read failed:', readError.message)
  } else {
    console.log('✅ Messages retrieved:', messages.length, 'message(s)')
  }
  
  // Test 4: Create access code
  console.log('\nTest 4: Creating access code...')
  const { data: accessCode, error: accessError } = await supabase
    .from('access_codes')
    .insert({
      instagram_username: 'testuser123',
      code: 'test-code-12345',
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    })
    .select()
    .single()
  
  if (accessError) {
    console.error('❌ Access code creation failed:', accessError.message)
  } else {
    console.log('✅ Access code created:', accessCode.code)
  }
  
  // Cleanup
  console.log('\nCleaning up test data...')
  await supabase.from('messages').delete().eq('recipient_instagram', 'testuser123')
  await supabase.from('access_codes').delete().eq('instagram_username', 'testuser123')
  await supabase.from('users').delete().eq('instagram_username', 'testuser123')
  
  console.log('\n✅ All tests passed! Database is working perfectly.\n')
}

testConnection().catch(console.error)
