import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, CheckCircle2, ShieldCheck, Activity, ChevronDown, ChevronUp, LogIn, LogOut, Building2, Mail, Globe, ArrowRight, Smartphone, Sparkles } from 'lucide-react';

export default function JuBungeeUniversalBusinessGateway() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [channel, setChannel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sandbox demo states
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleRegisterWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email || !website || !channel) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsUnlocked(true);
    }, 1000);
  };

  const handleInstantSignInBypass = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setCompanyName('Premium Pitch Business');
      setIsSubmitting(false);
      setIsSigningIn(false);
      setIsUnlocked(true);
    }, 900);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-start p-4">
      
      {/* TOP NAVIGATION MANAGEMENT HUB BAR */}
      <header className="w-full max-w-4xl border-b bg-background px-4 py-3 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-[#FF8C00] to-orange-600 flex items-center justify-center shadow-lg">
            <Rocket className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">BUNGEE</h1>
            <p className="text-[10px] text-muted-foreground">Business Gateway</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setIsUnlocked(false); setCompanyName(''); }}
              className="gap-1.5 text-xs"
            >
              <LogOut className="size-3" />
              Sign Out
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsSigningIn(true)}
              className="gap-1.5 text-xs"
            >
              <LogIn className="size-3" />
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-4xl flex-1">
        
        {/* LOCKED STATE - Registration / Sign In */}
        {!isUnlocked && (
          <Card className="border-2 border-dashed border-[#FF8C00]/30 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 size-16 rounded-2xl bg-gradient-to-br from-[#FF8C00] to-orange-600 flex items-center justify-center shadow-lg">
                <Building2 className="size-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">
                {isSigningIn ? 'Welcome Back' : 'Join the BUNGEE Network'}
              </CardTitle>
              <CardDescription className="text-sm">
                {isSigningIn 
                  ? 'Sign in to access your business dashboard' 
                  : 'Register your business to unlock hiring, referrals, and more'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {isSigningIn ? (
                /* SIGN IN FORM */
                <form onSubmit={handleInstantSignInBypass} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-xs font-semibold">Business Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input 
                        id="signin-email" 
                        type="email" 
                        placeholder="you@company.com" 
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#FF8C00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Activity className="size-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <LogIn className="size-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    New to BUNGEE?{' '}
                    <button 
                      type="button" 
                      onClick={() => setIsSigningIn(false)} 
                      className="text-[#FF8C00] font-semibold hover:underline"
                    >
                      Register your business
                    </button>
                  </p>
                </form>
              ) : (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegisterWaitlist} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-xs font-semibold">Company Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                          id="company" 
                          value={companyName} 
                          onChange={(e) => setCompanyName(e.target.value)} 
                          placeholder="Acme Inc." 
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold">Business Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="you@company.com" 
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-xs font-semibold">Website *</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                          id="website" 
                          value={website} 
                          onChange={(e) => setWebsite(e.target.value)} 
                          placeholder="www.company.com" 
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="channel" className="text-xs font-semibold">Primary Interest *</Label>
                      <Select value={channel} onValueChange={setChannel} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hiring">Hiring & Bounties</SelectItem>
                          <SelectItem value="referrals">Referral Network</SelectItem>
                          <SelectItem value="products">Product Marketplace</SelectItem>
                          <SelectItem value="services">Service Directory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#FF8C00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold gap-2"
                    disabled={isSubmitting || !companyName || !email || !website || !channel}
                  >
                    {isSubmitting ? (
                      <>
                        <Activity className="size-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Rocket className="size-4" />
                        Join Waitlist & Unlock Dashboard
                      </>
                    )}
                  </Button>
                  
                  <p className="text-center text-xs text-muted-foreground">
                    Already registered?{' '}
                    <button 
                      type="button" 
                      onClick={() => setIsSigningIn(true)} 
                      className="text-[#FF8C00] font-semibold hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </form>
              )}

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 pt-2 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3 text-green-500" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Smartphone className="size-3 text-blue-500" />
                  <span>Mobile Ready</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="size-3 text-[#FF8C00]" />
                  <span>AI Powered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* UNLOCKED STATE - Dashboard */}
        {isUnlocked && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-[#FF8C00]/10 to-orange-500/10 border-[#FF8C00]/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-[#FF8C00] to-orange-600 flex items-center justify-center">
                    <CheckCircle2 className="size-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Welcome, {companyName}!</h2>
                    <p className="text-sm text-muted-foreground">Your business dashboard is now active</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Verified</Badge>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Active Jobs', value: '0', color: 'text-fuchsia-500' },
                { label: 'Referrals', value: '0', color: 'text-green-500' },
                { label: 'Products', value: '0', color: 'text-sky-500' },
                { label: 'Services', value: '0', color: 'text-purple-500' },
              ].map((stat, i) => (
                <Card key={i} className="text-center p-4">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>

            {/* Action Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Hiring Hub', desc: 'Post jobs & set bounties', icon: '💼', color: 'from-fuchsia-500 to-purple-600' },
                { title: 'Referral Network', desc: 'Grow through referrals', icon: '🤝', color: 'from-green-500 to-emerald-600' },
                { title: 'Product Marketplace', desc: 'List & sell products', icon: '🛍️', color: 'from-sky-500 to-blue-600' },
                { title: 'Service Directory', desc: 'Offer your services', icon: '⚡', color: 'from-purple-500 to-indigo-600' },
              ].map((panel, i) => (
                <Card key={i} className="hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`size-12 rounded-xl bg-gradient-to-br ${panel.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {panel.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{panel.title}</h3>
                      <p className="text-xs text-muted-foreground">{panel.desc}</p>
                    </div>
                    <ArrowRight className="size-5 text-muted-foreground group-hover:text-[#FF8C00] transition-colors" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Collapsible Activity Panel */}
            <Card>
              <button 
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-[#FF8C00]" />
                  <span className="font-semibold">Recent Activity</span>
                </div>
                {isPanelOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
              {isPanelOpen && (
                <CardContent className="pt-0 border-t">
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="size-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No activity yet</p>
                    <p className="text-xs">Start by exploring the panels above</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-4xl mt-8 py-4 border-t text-center">
        <p className="text-xs text-muted-foreground">
          BUNGEE Business Gateway - Connecting businesses through referrals
        </p>
      </footer>
    </div>
  );
}
