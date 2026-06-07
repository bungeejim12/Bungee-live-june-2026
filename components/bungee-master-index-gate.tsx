import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, Globe, Lock, Eye, EyeOff, ClipboardCopy, CheckCircle2, ShieldAlert, Rocket, ChevronRight, LogIn, ArrowLeft, Users, Briefcase, ShoppingBag, Shield } from 'lucide-react';

interface WaitlistMerchant {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  focus: 'Hiring Bounties' | 'Service Leads' | 'Product Boosting';
}

export default function BungeeMasterIndexGate() {
  // Core operational page state routers
  const [currentView, setCurrentView] = useState<'signin' | 'waitlist-modal' | 'admin-ledger'>('signin');
  
  // Access credentials & form captures
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  
  // Waitlist form hook states
  const [wCompanyName, setWCompanyName] = useState('');
  const [wEmail, setWEmail] = useState('');
  const [wPhone, setWPhone] = useState('');
  const [wWebsite, setWWebsite] = useState('');
  const [wFocus, setWFocus] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Admin backend spreadsheet array
  const [merchantLedger, setMerchantLedger] = useState<WaitlistMerchant[]>([
    { id: '1', name: 'Vance Refrigeration', email: 'rvance@vancerefrig.com', phone: '(570) 555-0120', website: 'www.vancerefrigeration.com', focus: 'Hiring Bounties' },
    { id: '2', name: 'Dunder Mifflin', email: 'mscott@dundermifflin.com', phone: '(570) 555-0100', website: 'www.dundermifflin.com', focus: 'Service Leads' },
    { id: '3', name: 'Schrute Farms', email: 'dwight@schrutefarms.com', phone: '(570) 555-0145', website: 'www.schrutefarms.com', focus: 'Product Boosting' },
    { id: '4', name: 'Michael Scott Paper', email: 'michael@mspc.com', phone: '(570) 555-0199', website: 'www.michaelscottpapercompany.com', focus: 'Service Leads' },
    { id: '5', name: 'Athlead Sports', email: 'jim@athlead.com', phone: '(215) 555-0177', website: 'www.athlead.com', focus: 'Hiring Bounties' },
  ]);

  // Handle sign-in attempt
  const handleSignIn = () => {
    if (loginEmail === 'admin@bungee.com' && loginPassword === 'bungee123') {
      setAuthError(false);
      setCurrentView('admin-ledger');
    } else {
      setAuthError(true);
    }
  };

  // Handle waitlist registration
  const handleWaitlistSubmit = () => {
    if (!wCompanyName || !wEmail || !wFocus) return;
    
    setIsRegistering(true);
    setTimeout(() => {
      const newMerchant: WaitlistMerchant = {
        id: String(merchantLedger.length + 1),
        name: wCompanyName,
        email: wEmail,
        phone: wPhone,
        website: wWebsite,
        focus: wFocus as WaitlistMerchant['focus'],
      };
      setMerchantLedger([...merchantLedger, newMerchant]);
      setIsRegistering(false);
      setRegisterSuccess(true);
    }, 1500);
  };

  // Copy all emails to clipboard
  const copyAllEmails = () => {
    const emails = merchantLedger.map(m => m.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2000);
  };

  // Reset waitlist form
  const resetWaitlistForm = () => {
    setWCompanyName('');
    setWEmail('');
    setWPhone('');
    setWWebsite('');
    setWFocus('');
    setRegisterSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* ===== SIGN IN VIEW ===== */}
      {currentView === 'signin' && (
        <Card className="w-full max-w-md bg-gray-800/90 border-gray-700 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto size-16 rounded-2xl bg-gradient-to-br from-[#FF8C00] to-orange-600 flex items-center justify-center shadow-lg">
              <Lock className="size-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">BUNGEE Business Portal</CardTitle>
            <CardDescription className="text-gray-400">Sign in to access your dashboard or join the waitlist</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                <ShieldAlert className="size-5 text-red-400" />
                <p className="text-sm text-red-400">Invalid credentials. Please try again.</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-gray-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                <Input 
                  type="email"
                  placeholder="you@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                <Input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="size-4 text-gray-500" /> : <Eye className="size-4 text-gray-500" />}
                </button>
              </div>
            </div>

            <Button 
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-[#FF8C00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
            >
              <LogIn className="size-4 mr-2" />
              Sign In
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-800 px-2 text-gray-500">or</span>
              </div>
            </div>

            <Button 
              variant="outline"
              onClick={() => setCurrentView('waitlist-modal')}
              className="w-full border-fuchsia-500/50 text-fuchsia-400 hover:bg-fuchsia-500/10 hover:border-fuchsia-500"
            >
              <Rocket className="size-4 mr-2" />
              Join the Merchant Waitlist
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-xs text-gray-500">Demo: admin@bungee.com / bungee123</p>
          </CardFooter>
        </Card>
      )}

      {/* ===== WAITLIST REGISTRATION MODAL ===== */}
      {currentView === 'waitlist-modal' && (
        <Card className="w-full max-w-md bg-gray-800/90 border-gray-700 shadow-2xl">
          <CardHeader className="space-y-2">
            <button 
              onClick={() => { setCurrentView('signin'); resetWaitlistForm(); }}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors w-fit"
            >
              <ArrowLeft className="size-4" />
              Back to Sign In
            </button>
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
                <Rocket className="size-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">Join the Waitlist</CardTitle>
                <CardDescription className="text-gray-400">Get early access to BUNGEE for Business</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {registerSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto size-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="size-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">You&apos;re on the list!</h3>
                  <p className="text-sm text-gray-400 mt-1">Spot #{merchantLedger.length} secured</p>
                </div>
                <Badge className="bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50">
                  {wFocus}
                </Badge>
                <Button 
                  onClick={() => { setCurrentView('signin'); resetWaitlistForm(); }}
                  variant="outline"
                  className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Return to Sign In
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-gray-300">Company Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                    <Input 
                      placeholder="Your Business Name"
                      value={wCompanyName}
                      onChange={(e) => setWCompanyName(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Business Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                    <Input 
                      type="email"
                      placeholder="you@company.com"
                      value={wEmail}
                      onChange={(e) => setWEmail(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                    <Input 
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={wPhone}
                      onChange={(e) => setWPhone(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                    <Input 
                      placeholder="www.yourcompany.com"
                      value={wWebsite}
                      onChange={(e) => setWWebsite(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Primary Interest *</Label>
                  <Select value={wFocus} onValueChange={setWFocus}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select your focus" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="Hiring Bounties" className="text-white hover:bg-gray-600">Hiring Bounties</SelectItem>
                      <SelectItem value="Service Leads" className="text-white hover:bg-gray-600">Service Leads</SelectItem>
                      <SelectItem value="Product Boosting" className="text-white hover:bg-gray-600">Product Boosting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleWaitlistSubmit}
                  disabled={!wCompanyName || !wEmail || !wFocus || isRegistering}
                  className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-semibold disabled:opacity-50"
                >
                  {isRegistering ? (
                    <>
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Securing Your Spot...
                    </>
                  ) : (
                    <>
                      <Rocket className="size-4 mr-2" />
                      Join Waitlist
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ===== ADMIN LEDGER VIEW ===== */}
      {currentView === 'admin-ledger' && (
        <Card className="w-full max-w-4xl bg-gray-800/90 border-gray-700 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-gradient-to-br from-[#FF8C00] to-orange-600 flex items-center justify-center">
                <Users className="size-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">Merchant Waitlist Ledger</CardTitle>
                <CardDescription className="text-gray-400">{merchantLedger.length} businesses registered</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={copyAllEmails}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {copiedEmails ? <CheckCircle2 className="size-4 mr-1 text-green-400" /> : <ClipboardCopy className="size-4 mr-1" />}
                {copiedEmails ? 'Copied!' : 'Copy All Emails'}
              </Button>
              <Button 
                onClick={() => setCurrentView('signin')}
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Sign Out
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">#</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Company</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Phone</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Website</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Focus</th>
                  </tr>
                </thead>
                <tbody>
                  {merchantLedger.map((merchant, index) => (
                    <tr key={merchant.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                            <Building2 className="size-4 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium text-white">{merchant.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">{merchant.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">{merchant.phone || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-400 truncate max-w-[150px]">{merchant.website || '-'}</td>
                      <td className="py-3 px-4">
                        <Badge className={`text-xs ${
                          merchant.focus === 'Hiring Bounties' 
                            ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50'
                            : merchant.focus === 'Service Leads'
                            ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                        }`}>
                          {merchant.focus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-700 justify-between pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-fuchsia-400" />
                <span className="text-xs text-gray-400">Hiring: {merchantLedger.filter(m => m.focus === 'Hiring Bounties').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-green-400" />
                <span className="text-xs text-gray-400">Services: {merchantLedger.filter(m => m.focus === 'Service Leads').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-sky-400" />
                <span className="text-xs text-gray-400">Products: {merchantLedger.filter(m => m.focus === 'Product Boosting').length}</span>
              </div>
            </div>
            <Button 
              onClick={() => setCurrentView('waitlist-modal')}
              size="sm"
              className="bg-gradient-to-r from-[#FF8C00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Add Merchant
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
