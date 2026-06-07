import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Globe, Rocket, CheckCircle2, ShieldCheck, Terminal, Users, Briefcase, ShoppingBag, ArrowRight, Activity, Eye, LogOut, Lock, Zap, TrendingUp } from 'lucide-react';

export default function BungeeGatedDashboardPortal() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [channel, setChannel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Active Demo State variables 
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleRegisterAndUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email || !channel) return;
    
    setIsSubmitting(true);
    // Simulating instant secure data registration pipeline
    setTimeout(() => {
      setIsSubmitting(false);
      setIsUnlocked(true);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-foreground flex flex-col items-center justify-start p-4">
      
      {/* DYNAMIC TOP NAVIGATION CAPTAIN BAR */}
      <header className="w-full max-w-4xl border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 h-16 flex items-center justify-between mb-6 shrink-0 rounded-xl shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-[#FF8C00] text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-md">
            B
          </div>
          <span className="font-bold text-gray-900 dark:text-white">BUNGEE</span>
          <Badge className="bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200 text-[10px]">Business Portal</Badge>
        </div>
        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <>
              <Badge className="bg-green-100 text-green-600 border-green-200 flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                Verified
              </Badge>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <Badge className="bg-amber-100 text-amber-600 border-amber-200 flex items-center gap-1">
              <Lock className="size-3" />
              Locked
            </Badge>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="w-full max-w-4xl flex-1">
        {!isUnlocked ? (
          /* GATED REGISTRATION FORM */
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="mx-auto size-16 rounded-2xl bg-gradient-to-br from-[#FF8C00] to-fuchsia-500 flex items-center justify-center shadow-lg">
                <ShieldCheck className="size-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Unlock Your Business Dashboard
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Register your company to access the full BUNGEE Business Portal with hiring tools, referral tracking, and merchant services.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleRegisterAndUnlock} className="space-y-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company Name *
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Corporation"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Business Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Business Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@company.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Website (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company Website
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.company.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Primary Channel Interest */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Primary Interest *
                  </Label>
                  <Select value={channel} onValueChange={setChannel} required>
                    <SelectTrigger>
                      <SelectValue placeholder="What brings you to BUNGEE?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hiring">
                        <div className="flex items-center gap-2">
                          <Briefcase className="size-4 text-fuchsia-500" />
                          <span>Hiring & Recruitment</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="referrals">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-green-500" />
                          <span>Referral Network</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="products">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="size-4 text-sky-500" />
                          <span>Product Marketplace</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="services">
                        <div className="flex items-center gap-2">
                          <Terminal className="size-4 text-purple-500" />
                          <span>Service Provider</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !companyName || !email || !channel}
                  className="w-full h-12 bg-gradient-to-r from-[#FF8C00] to-fuchsia-500 hover:from-[#FF8C00]/90 hover:to-fuchsia-500/90 text-white font-semibold text-base gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Rocket className="size-5" />
                      Unlock Dashboard
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
              <div className="flex items-center gap-4 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3" /> Secure
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="size-3" /> Instant Access
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Free to Join
                </span>
              </div>
            </CardFooter>
          </Card>
        ) : (
          /* UNLOCKED DASHBOARD VIEW */
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold">Welcome, {companyName}!</h3>
                  <p className="text-sm text-white/80">Your business dashboard is now active</p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                {channel === 'hiring' ? 'Hiring' : channel === 'referrals' ? 'Referrals' : channel === 'products' ? 'Products' : 'Services'}
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Active Jobs', value: '0', icon: Briefcase, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20' },
                { label: 'Referrals', value: '0', icon: Users, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                { label: 'Products', value: '0', icon: ShoppingBag, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/20' },
                { label: 'Services', value: '0', icon: Terminal, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              ].map((stat, i) => (
                <Card key={i} className={`${stat.bg} border-0`}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <stat.icon className={`size-8 ${stat.color}`} />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hiring Panel */}
              <Card className="border-fuchsia-200 dark:border-fuchsia-800 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
                      <Briefcase className="size-6 text-white" />
                    </div>
                    <ArrowRight className="size-5 text-gray-400 group-hover:text-fuchsia-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Start Hiring</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Post jobs, set bounties, and tap into our referral network</p>
                </CardContent>
              </Card>

              {/* Referral Network Panel */}
              <Card className="border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Users className="size-6 text-white" />
                    </div>
                    <ArrowRight className="size-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Referral Network</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Build your network and earn from successful referrals</p>
                </CardContent>
              </Card>

              {/* Products Panel */}
              <Card className="border-sky-200 dark:border-sky-800 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                      <ShoppingBag className="size-6 text-white" />
                    </div>
                    <ArrowRight className="size-5 text-gray-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Product Marketplace</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">List and promote your products to our network</p>
                </CardContent>
              </Card>

              {/* Services Panel */}
              <Card className="border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                      <Terminal className="size-6 text-white" />
                    </div>
                    <ArrowRight className="size-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Service Directory</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Offer your services and get discovered by businesses</p>
                </CardContent>
              </Card>
            </div>

            {/* Activity Feed Toggle */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="size-5 text-[#FF8C00]" />
                    Live Activity Feed
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    className="text-gray-500"
                  >
                    <Eye className="size-4 mr-1" />
                    {isPanelOpen ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </CardHeader>
              {isPanelOpen && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {[
                      { action: 'New referral opportunity', time: 'Just now', type: 'referral' },
                      { action: 'Job posting viewed 12 times', time: '5m ago', type: 'hiring' },
                      { action: 'Product inquiry received', time: '1h ago', type: 'product' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <div className={`size-2 rounded-full ${item.type === 'referral' ? 'bg-green-500' : item.type === 'hiring' ? 'bg-fuchsia-500' : 'bg-sky-500'}`} />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item.action}</span>
                        </div>
                        <span className="text-xs text-gray-400">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
