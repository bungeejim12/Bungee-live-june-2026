import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { assertSupabaseServerEnv } from '@/lib/supabase/env'

export async function POST() {
  const env = assertSupabaseServerEnv()
  if (!env) {
    return NextResponse.json({ error: 'Supabase server key not configured' }, { status: 500 })
  }

  const supabaseAdmin = createClient(
    env.url,
    env.key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const testEmail = 'demo@bungee.test'
  const testPassword = 'BungeeDemo2024!'

  try {
    // First, try to delete any existing user with this email
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === testEmail)
    
    if (existingUser) {
      // Delete existing profile first
      await supabaseAdmin.from('profiles').delete().eq('id', existingUser.id)
      // Then delete the user
      await supabaseAdmin.auth.admin.deleteUser(existingUser.id)
    }

    // Create the test user with the admin API
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        first_name: 'Demo',
        last_name: 'Business',
        business_name: 'Demo Company',
        user_type: 'business'
      }
    })

    if (createError) {
      console.error('[Create Test User] Error:', createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    // Create the profile
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: newUser.user.id,
      email: testEmail,
      first_name: 'Demo',
      last_name: 'Business',
      business_name: 'Demo Company',
      user_type: 'business',
      business_verified: true
    })

    if (profileError) {
      console.error('[Create Test User] Profile error:', profileError)
      // User was created but profile failed - still return success with warning
      return NextResponse.json({ 
        success: true, 
        warning: 'User created but profile may need manual setup',
        credentials: { email: testEmail, password: testPassword }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test user created successfully',
      credentials: { email: testEmail, password: testPassword }
    })

  } catch (err) {
    console.error('[Create Test User] Unexpected error:', err)
    return NextResponse.json({ error: 'Failed to create test user' }, { status: 500 })
  }
}
