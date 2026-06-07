"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Rocket, ShieldCheck, Lock, ClipboardCopy, Building2, Mail, Phone, Globe, User, ArrowRight, CheckCircle2, KeyRound, EyeOff, Eye, AlertCircle, Sparkles, ArrowLeft, Briefcase, ShoppingBag, Users, Wrench } from 'lucide-react';

interface UniversalWaitlistNode {
  id: string;
  name: string;
  email: string;
  phone: string;
  entityDetails: string;
  painPoint: string;
  accountType: 'Corporate Partner' | 'Individual Connector' | 'Unified Power User';
}

export default function BungeeAllInOneMasterGateway() {
  // Master Screen Visibility State Routers
  const [viewState, setViewState] = useState<'signin' | 'waitlist-form' | 'registration-success' | 'admin-vault'>('signin');
  const [isCorporateToggle, setIsCorporateToggle] = useState(true);
  
  // Waitlist data capture states
  const [fullName, setFullName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [businessFocus, setBusinessFocus] = useState('');
  const [businessPainPoint, setBusinessPainPoint] = useState('');
  const [enableDualPrivileges, setEnableDualPrivileges] = useState(false);
  
  // Founders Control Panel Access Parameters
  const [authPassword, setAuthPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Registration confirmation state
  const [assignedSpot, setAssignedSpot] = useState(0);

  // Seed data for admin vault
  const [waitlistEntries] = useState<UniversalWaitlistNode[]>([
    { id: '1', name: 'Sarah Mitchell', email: 'sarah@techventures.io', phone: '555-0101', entityDetails: 'Tech Ventures Inc', painPoint: 'Finding qualified developers', accountType: 'Corporate Partner' },
    { id: '2', name: 'Marcus Johnson', email: 'marcus.j@gmail.com', phone: '555-0202', entityDetails: 'Independent Recruiter', painPoint: 'Connecting talent to opportunities', accountType: 'Individual Connector' },
    { id: '3', name: 'Elena Rodriguez', email: 'elena@globalservices.com', phone: '555-0303', entityDetails: 'Global Services LLC', painPoint: 'Expanding service network', accountType: 'Corporate Partner' },
    { id: '4', name: 'David Chen', email: 'dchen@outlook.com', phone: '555-0404', entityDetails: 'Freelance Consultant', painPoint: 'Building referral pipeline', accountType: 'Unified Power User' },
    { id: '5', name: 'Amanda Foster', email: 'amanda@innovatehub.co', phone: '555-0505', entityDetails: 'Innovate Hub', painPoint: 'Product distribution channels', accountType: 'Corporate Partner' },
  ]);

  const handleAdminAuth = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (authPassword === 'bungee123') {
        setViewState('admin-vault');
        setAuthError(false);
      } else {
        setAuthError(true);
      }
      setIsProcessing(false);
    }, 800);
  };

  const handleWaitlistSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setAssignedSpot(Math.floor(Math.random() * 200) + (isCorporateToggle ? 100 : 500));
      setViewState('registration-success');
      setIsProcessing(false);
    }, 1000);
  };

  const copyAllEmails = () => {
    const emails = waitlistEntries.map(e => e.email).join(', ');
    navigator.clipboard.writeText(emails);
  };

  const getAccountType = (): 'Corporate Partner' | 'Individual Connector' | 'Unified Power User' => {
    if (enableDualPrivileges) return 'Unified Power User';
    return isCorporateToggle ? 'Corporate Partner' : 'Individual Connector';
  };

  // Business focus options
  const businessOptions = [
    { id: "hiring", label: "Filling Open Positions", icon: Briefcase },
    { id: "products", label: "Selling Products", icon: ShoppingBag },
    { id: "services", label: "Service Leads", icon: Wrench },
    { id: "all", label: "All the Above", icon: Sparkles },
  ];

  // Individual focus options
  const individualOptions = [
    { id: "jobs", label: "Refer People for Jobs", icon: Users },
    { id: "products", label: "Refer Products", icon: ShoppingBag },
    { id: "services", label: "Refer Services", icon: Wrench },
    { id: "all", label: "All the Above", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 overflow-hidden">
        
        {/* ========== SIGN IN VIEW ========== */}
        {viewState === 'signin' && (
          <>
            <CardHeader className="bg-gradient-to-r from-[#FF8C00] to-orange-500 text-white text-center pb-8 pt-8">
              <div className="size-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
                <Rocket className="size-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">BUNGEE Gateway</CardTitle>
              <CardDescription className="text-white/80">Choose your path to get started</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Account Type Toggle */}
              <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-gray-50">
                <span className={`text-sm font-medium transition-colors ${!isCorporateToggle ? 'text-green-600' : 'text-gray-400'}`}>
                  Individual
                </span>
                <Switch
                  checked={isCorporateToggle}
                  onCheckedChange={setIsCorporateToggle}
                  className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-green-500"
                />
                <span className={`text-sm font-medium transition-colors ${isCorporateToggle ? 'text-blue-600' : 'text-gray-400'}`}>
                  Business
                </span>
              </div>

              {/* Dynamic Description */}
              <div className={`text-center p-4 rounded-xl ${isCorporateToggle ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
                <p className={`text-sm font-medium ${isCorporateToggle ? 'text-blue-700' : 'text-green-700'}`}>
                  {isCorporateToggle 
                    ? "Grow your business through trusted referrals and expand your network" 
                    : "Start earning by referring people, products, and services you trust"}
                </p>
              </div>

              {/* Join Waitlist Button */}
              <Button
                onClick={() => setViewState('waitlist-form')}
                className={`w-full py-6 text-base font-semibold transition-all ${
                  isCorporateToggle 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isCorporateToggle ? (
                  <>
                    <Building2 className="size-5 mr-2" />
                    Join the Business Waitlist
                  </>
                ) : (
                  <>
                    <User className="size-5 mr-2" />
                    Join the Bungee Waitlist
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs text-gray-500 uppercase tracking-wider">Founders Only</span>
                </div>
              </div>

              {/* Admin Password Section */}
              <div className="space-y-3">
                <Label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Lock className="size-3" />
                  Admin Access
                </Label>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={authPassword}
                    onChange={(e) => { setAuthPassword(e.target.value); setAuthError(false); }}
                    className={`pr-10 ${authError ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    Invalid password. Try again.
                  </p>
                )}
                <Button
                  onClick={handleAdminAuth}
                  disabled={!authPassword || isProcessing}
                  variant="outline"
                  className="w-full"
                >
                  {isProcessing ? 'Authenticating...' : 'Access Admin Vault'}
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* ========== WAITLIST FORM VIEW ========== */}
        {viewState === 'waitlist-form' && (
          <>
            <CardHeader className={`text-white text-center pb-6 pt-6 ${isCorporateToggle ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}>
              <button
                onClick={() => setViewState('signin')}
                className="absolute top-4 left-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="size-5 text-white" />
              </button>
              <div className="size-14 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
                {isCorporateToggle ? <Building2 className="size-7 text-white" /> : <User className="size-7 text-white" />}
              </div>
              <CardTitle className="text-xl font-bold">
                {isCorporateToggle ? 'Business Waitlist' : 'Bungee Waitlist'}
              </CardTitle>
              <CardDescription className="text-white/80 text-sm">
                {isCorporateToggle ? 'Register your business to grow through referrals' : 'Join to start earning through referrals'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-5 space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Company Name (Business only) */}
              {isCorporateToggle && (
                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isCorporateToggle ? "you@company.com" : "you@email.com"}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              {/* Website (Business only) */}
              {isCorporateToggle && (
                <div className="space-y-1.5">
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website (optional)</Label>
                  <Input
                    id="website"
                    placeholder="www.yourcompany.com"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </div>
              )}

              {/* Primary Interest */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {isCorporateToggle ? 'Primary Interest *' : 'What do you want to refer? *'}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {(isCorporateToggle ? businessOptions : individualOptions).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setBusinessFocus(option.id)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                        businessFocus === option.id
                          ? isCorporateToggle
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <option.icon className={`size-4 ${
                        businessFocus === option.id 
                          ? isCorporateToggle ? 'text-blue-500' : 'text-green-500'
                          : 'text-gray-400'
                      }`} />
                      <span className={`text-xs font-medium ${businessFocus === option.id ? 'text-gray-900' : 'text-gray-600'}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dual Privileges Toggle */}
              <div className={`flex items-center justify-between p-3 rounded-lg border ${enableDualPrivileges ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`size-4 ${enableDualPrivileges ? 'text-purple-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium text-gray-700">Enable Both Privileges</span>
                </div>
                <Switch
                  checked={enableDualPrivileges}
                  onCheckedChange={setEnableDualPrivileges}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
              {enableDualPrivileges && (
                <p className="text-xs text-purple-600 text-center">
                  You&apos;ll be registered as a Unified Power User with access to both business and referrer features!
                </p>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleWaitlistSubmit}
                disabled={!fullName || !contactEmail || !businessFocus || (isCorporateToggle && !companyName) || isProcessing}
                className={`w-full py-6 text-base font-semibold ${
                  isCorporateToggle 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isProcessing ? 'Submitting...' : 'Join Waitlist'}
              </Button>
            </CardContent>
          </>
        )}

        {/* ========== REGISTRATION SUCCESS VIEW ========== */}
        {viewState === 'registration-success' && (
          <CardContent className="p-8 text-center">
            <div className="size-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="size-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re on the list!</h2>
            <p className="text-gray-600 mb-2">
              Welcome, <span className={`font-semibold ${isCorporateToggle ? 'text-blue-500' : 'text-green-500'}`}>
                {isCorporateToggle ? companyName : fullName}
              </span>!
            </p>
            <Badge className={`mb-4 ${
              enableDualPrivileges 
                ? 'bg-purple-100 text-purple-700' 
                : isCorporateToggle 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
            }`}>
              {getAccountType()}
            </Badge>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              isCorporateToggle ? 'bg-blue-500/10' : 'bg-green-500/10'
            }`}>
              <span className="text-sm text-gray-600">Your spot:</span>
              <Badge className={`text-lg px-3 ${isCorporateToggle ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                #{assignedSpot}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              We&apos;ll notify you at <span className="font-medium">{contactEmail}</span> when your dashboard is ready.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setViewState('signin')}
                className={`w-full ${isCorporateToggle ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        )}

        {/* ========== ADMIN VAULT VIEW ========== */}
        {viewState === 'admin-vault' && (
          <>
            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-6 text-green-400" />
                  <CardTitle className="text-lg font-bold">Admin Vault</CardTitle>
                </div>
                <Button
                  onClick={() => { setViewState('signin'); setAuthPassword(''); }}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Sign Out
                </Button>
              </div>
              <CardDescription className="text-gray-400">Waitlist Management Console</CardDescription>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{waitlistEntries.length}</span> entries
                </p>
                <Button
                  onClick={copyAllEmails}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <ClipboardCopy className="size-3 mr-1" />
                  Copy All Emails
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-semibold text-gray-600">Name</th>
                      <th className="text-left p-2 font-semibold text-gray-600">Email</th>
                      <th className="text-left p-2 font-semibold text-gray-600">Entity</th>
                      <th className="text-left p-2 font-semibold text-gray-600">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitlistEntries.map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-gray-900">{entry.name}</td>
                        <td className="p-2 text-gray-600">{entry.email}</td>
                        <td className="p-2 text-gray-600">{entry.entityDetails}</td>
                        <td className="p-2">
                          <Badge className={`text-[10px] ${
                            entry.accountType === 'Corporate Partner' 
                              ? 'bg-blue-100 text-blue-700' 
                              : entry.accountType === 'Individual Connector'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                          }`}>
                            {entry.accountType}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-around text-center text-xs">
                <div>
                  <p className="font-bold text-blue-600">{waitlistEntries.filter(e => e.accountType === 'Corporate Partner').length}</p>
                  <p className="text-gray-500">Business</p>
                </div>
                <div>
                  <p className="font-bold text-green-600">{waitlistEntries.filter(e => e.accountType === 'Individual Connector').length}</p>
                  <p className="text-gray-500">Individual</p>
                </div>
                <div>
                  <p className="font-bold text-purple-600">{waitlistEntries.filter(e => e.accountType === 'Unified Power User').length}</p>
                  <p className="text-gray-500">Unified</p>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
