import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  ⚠️  STAGING WARNING: DEVELOPER-ONLY PURGE ENDPOINT  ⚠️                    ║
 * ║                                                                           ║
 * ║  Executing this script permanently purges ALL test user records from      ║
 * ║  the auth.users table to reset registration constraints.                  ║
 * ║                                                                           ║
 * ║  This action is IRREVERSIBLE and should ONLY be used in development       ║
 * ║  or staging environments to clear test data before production launch.     ║
 * ║                                                                           ║
 * ║  DO NOT expose this endpoint in production without proper safeguards.     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// Security: Only allow in development/staging environments
const ALLOWED_ENVIRONMENTS = ['development', 'preview', 'staging']
const PURGE_SECRET = process.env.PURGE_SECRET || 'bungee-dev-purge-2024'

export async function POST(request: Request) {
  try {
    // Environment check
    const nodeEnv = process.env.NODE_ENV || 'development'
    const vercelEnv = process.env.VERCEL_ENV || 'development'
    
    // Allow in development, preview, or with explicit staging flag
    const isAllowedEnv = ALLOWED_ENVIRONMENTS.includes(nodeEnv) || 
                         ALLOWED_ENVIRONMENTS.includes(vercelEnv) ||
                         process.env.ALLOW_DEV_PURGE === 'true'
    
    if (!isAllowedEnv && vercelEnv === 'production') {
      return NextResponse.json({
        success: false,
        error: 'This endpoint is disabled in production environments.',
        hint: 'Set ALLOW_DEV_PURGE=true to override (use with extreme caution).'
      }, { status: 403 })
    }

    // Parse request body for optional confirmation
    const body = await request.json().catch(() => ({}))
    const { secret, confirm, preserveEmails } = body as { 
      secret?: string
      confirm?: boolean
      preserveEmails?: string[]
    }

    // Validate purge secret
    if (secret !== PURGE_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Invalid purge secret. Provide the correct secret to proceed.',
        hint: 'Include { "secret": "your-purge-secret" } in request body.'
      }, { status: 401 })
    }

    // Require explicit confirmation
    if (!confirm) {
      return NextResponse.json({
        success: false,
        error: 'Confirmation required. This action will permanently delete ALL test users.',
        hint: 'Include { "confirm": true } in request body to proceed.',
        warning: '⚠️ This action is IRREVERSIBLE. All auth.users records will be deleted.'
      }, { status: 400 })
    }

    // Initialize Supabase Admin client with Service Role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
      }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Step 1: Fetch all users from auth.users
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to list users from auth.users',
        details: listError.message
      }, { status: 500 })
    }

    const allUsers = usersData?.users || []
    
    // Filter out any emails to preserve (e.g., admin accounts)
    const emailsToPreserve = new Set(preserveEmails?.map(e => e.toLowerCase()) || [])
    const usersToDelete = allUsers.filter(user => {
      const email = user.email?.toLowerCase() || ''
      return !emailsToPreserve.has(email)
    })

    // Step 2: Delete each user from auth.users
    const results = {
      total: allUsers.length,
      preserved: allUsers.length - usersToDelete.length,
      deleted: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (const user of usersToDelete) {
      try {
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
        
        if (deleteError) {
          results.failed++
          results.errors.push(`Failed to delete user ${user.id}: ${deleteError.message}`)
        } else {
          results.deleted++
        }
      } catch (err) {
        results.failed++
        results.errors.push(`Exception deleting user ${user.id}: ${err}`)
      }
    }

    // Step 3: Clear related tables (profiles, business_accounts, etc.)
    const tablesToClear = ['profiles', 'business_accounts', 'referral_visits', 'referral_shares']
    const tableResults: Record<string, { success: boolean; count?: number; error?: string }> = {}

    for (const table of tablesToClear) {
      try {
        // Delete all rows from the table
        const { error: tableError, count } = await supabaseAdmin
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all (workaround for no WHERE clause)
          .select('*', { count: 'exact', head: true })

        if (tableError) {
          tableResults[table] = { success: false, error: tableError.message }
        } else {
          tableResults[table] = { success: true, count: count || 0 }
        }
      } catch (err) {
        tableResults[table] = { success: false, error: String(err) }
      }
    }

    return NextResponse.json({
      success: true,
      message: '🧹 Database purge completed successfully.',
      warning: 'All test user data has been permanently removed.',
      results: {
        auth_users: results,
        related_tables: tableResults
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during purge operation',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// GET endpoint for status/documentation only
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/dev/purge-test-users',
    status: 'active',
    warning: '⚠️ STAGING ONLY: This endpoint permanently deletes ALL test user records.',
    usage: {
      method: 'POST',
      body: {
        secret: 'your-purge-secret (required)',
        confirm: 'true (required)',
        preserveEmails: ['optional@array.of', 'emails@to.preserve']
      },
      example: 'curl -X POST /api/dev/purge-test-users -H "Content-Type: application/json" -d \'{"secret":"bungee-dev-purge-2024","confirm":true}\''
    },
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown'
  })
}
