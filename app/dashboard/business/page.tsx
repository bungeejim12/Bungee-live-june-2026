"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import BusinessDashboard from "@/components/business-dashboard"
import { ProfileRoleSwitcher } from "@/components/profile-role-switcher"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X, Loader2 } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: string
  email: string | null
  phone: string | null
  first_name: string | null
  last_name: string | null
  business_name: string | null
  user_type: string | null
  is_demo: boolean
  business_verified?: boolean
}

export default function BusinessDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check if user is in demo mode or has a real account
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check URL params FIRST - most reliable for fresh page loads
      const urlParams = new URLSearchParams(window.location.search)
      const isDemoParam = urlParams.get('demo') === 'true'
      const isAuthenticated = urlParams.get('authenticated') === 'true'
      const isStaging = urlParams.get('staging') === 'true'
      
      // If ?demo=true in URL, immediately enter demo mode
      if (isDemoParam) {
        // Set localStorage for future visits
        localStorage.setItem('bungee_demo_mode', 'true')
        localStorage.setItem('bungee_demo_active', 'true')
        setIsDemo(true)
        setIsLoading(false)
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname)
        return
      }
      
      // If staging mode, treat as demo
      if (isStaging) {
        setIsDemo(true)
        setIsLoading(false)
        window.history.replaceState({}, '', window.location.pathname)
        return
      }
      
      // Check localStorage for demo tokens
      const demoActive = localStorage.getItem('bungee_demo_active')
      const demoMode = localStorage.getItem('bungee_demo_mode')
      const sandboxSession = localStorage.getItem('bungee_sandbox_session')
      
      if (demoActive === 'true' || demoMode === 'true' || sandboxSession) {
        // Demo/staging user - render immediately without Supabase checks
        setIsDemo(true)
        setIsLoading(false)
        return
      }
      
      // If real authenticated param, clear demo flags
      if (isAuthenticated) {
        localStorage.removeItem('bungee_demo_mode')
        localStorage.removeItem('bungee_demo_type')
        localStorage.removeItem('bungee_demo_active')
        localStorage.removeItem('bungee_sandbox_session')
        window.history.replaceState({}, '', window.location.pathname)
      }

      // Check for real authenticated user
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // Fetch user profile - explicitly select only columns that exist
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, phone, first_name, last_name, business_name, user_type, business_verified')
            .eq('id', user.id)
            .single()

          if (profileError) {
            console.log('[v0] Profile fetch error:', profileError.message)
          }

          if (profileData) {
            setProfile({
              ...profileData,
              is_demo: false, // is_demo is handled by localStorage, not database
            })
            setIsDemo(false) // Real user with profile = not demo
          } else {
            // User exists but no profile - use metadata
            setProfile({
              id: user.id,
              email: user.email || null,
              phone: user.phone || null,
              first_name: user.user_metadata?.first_name || null,
              last_name: user.user_metadata?.last_name || null,
              business_name: user.user_metadata?.business_name || null,
              user_type: user.user_metadata?.user_type || 'business',
              is_demo: false,
              business_verified: false,
            })
            setIsDemo(false)
          }
        } else {
          // No authenticated user - treat as demo
          setIsDemo(true)
        }
      } catch {
        // Error checking auth - default to demo
        setIsDemo(true)
      }

      setIsLoading(false)
    }

    checkAuthStatus()
  }, [])

  const handleLogout = async () => {
    // Clear ALL demo mode flags
    localStorage.removeItem('bungee_demo_mode')
    localStorage.removeItem('bungee_demo_type')
    localStorage.removeItem('bungee_demo_active')
    localStorage.removeItem('bungee_demo_user')
    localStorage.removeItem('bungee_sandbox_session')
    
    // Sign out from Supabase if authenticated
    const supabase = createClient()
    await supabase.auth.signOut()
    
    window.location.href = '/auth/login'
  }

  // Demo mode values
  const demoBusinessName = 'Bungee Corp'
  const demoUserName = 'James Mitchell'

  // Real user values (blank for new accounts)
  const realBusinessName = profile?.business_name || ''
  const realUserName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile?.email || ''

  // Use demo values in demo mode, real values otherwise
  const businessName = isDemo ? demoBusinessName : realBusinessName
  const userName = isDemo ? demoUserName : realUserName

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF8C00]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
          {/* Left: Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-8 px-2"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center lg:justify-start lg:pl-4">
            <Link href="/" className="text-xl font-bold text-[#FF8C00]">bungee</Link>
          </div>

          {/* Right: Exit/Logout */}
          <div className="flex items-center gap-2">
            {isDemo && (
              <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                Demo Mode
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 h-8 px-2 sm:px-3"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-2 text-xs">{isDemo ? 'Exit Demo' : 'Logout'}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar with Role Switcher */}
        <aside className={`
          fixed lg:sticky top-14 left-0 z-40
          h-[calc(100vh-3.5rem)] w-72
          bg-gray-50 border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}>
          <div className="p-4">
            {/* Profile Role Switcher */}
            <ProfileRoleSwitcher 
              currentMode="merchant"
              businessName={businessName || 'Your Business'}
              userName={userName || 'New User'}
            />

            {/* Additional Navigation Links */}
            <nav className="mt-6 space-y-1">
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-900 bg-[#FF8C00]/10 border border-[#FF8C00]/20">
                <span className="size-2 rounded-full bg-[#FF8C00]" />
                Dashboard Overview
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <span className="size-2 rounded-full bg-gray-300" />
                Campaigns
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <span className="size-2 rounded-full bg-gray-300" />
                Hiring Pipeline
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <span className="size-2 rounded-full bg-gray-300" />
                Analytics
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <span className="size-2 rounded-full bg-gray-300" />
                Settings
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content - Business Dashboard */}
        <main className="flex-1 min-w-0">
          <BusinessDashboard 
            businessName={businessName || 'Your Business'} 
            isDemo={isDemo}
            userProfile={profile}
          />
        </main>
      </div>
    </div>
  )
}
