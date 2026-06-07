import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Globe, Sparkles, Rocket, CheckCircle2, ShieldCheck, ClipboardCopy, Users, ListFilter, X } from 'lucide-react';

interface RegisteredBusiness {
  id: string;
  companyName: string;
  email: string;
  website: string;
  targetChannel: 'Hiring Bounties' | 'Service Leads' | 'Product Boosting';
  spotNumber: number;
}

interface BungeeMerchantWaitlistHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BungeeMerchantWaitlistHub({ isOpen, onClose }: BungeeMerchantWaitlistHubProps) {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [channel, setChannel] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [assignedSpot, setAssignedSpot] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [filterChannel, setFilterChannel] = useState<string>('all');

  // Pre-populated seed dataset to show upcoming waitlisted companies
  const [waitlist, setWaitlist] = useState<RegisteredBusiness[]>([
    { id: '1', companyName: 'Vance Refrigeration', email: 'rvance@vancerefrig.com', website: 'www.vancerefrigeration.com', targetChannel: 'Service Leads', spotNumber: 28 },
    { id: '2', companyName: 'Dunder Mifflin Paper Co.', email: 'mscott@dundermifflin.com', website: 'www.dundermifflin.com', targetChannel: 'Hiring Bounties', spotNumber: 29 },
    { id: '3', companyName: 'Scranton Design Hub', email: 'pam.b@scrantondesign.io', website: 'www.scrantondesign.io', targetChannel: 'Product Boosting', spotNumber: 30 },
    { id: '4', companyName: 'TechStart Solutions', email: 'info@techstart.co', website: 'www.techstart.co', targetChannel: 'Hiring Bounties', spotNumber: 31 },
    { id: '5', companyName: 'Local Marketing Pro', email: 'hello@localmarketingpro.com', website: 'www.localmarketingpro.com', targetChannel: 'Service Leads', spotNumber: 32 },
  ]);

  const handleSubmit = async () => {
    if (!companyName || !email || !channel) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSpot = waitlist.length > 0 ? Math.max(...waitlist.map(w => w.spotNumber)) + 1 : 1;
    
    const newBusiness: RegisteredBusiness = {
      id: Date.now().toString(),
      companyName,
      email,
      website,
      targetChannel: channel as 'Hiring Bounties' | 'Service Leads' | 'Product Boosting',
      spotNumber: newSpot,
    };
    
    setWaitlist(prev => [...prev, newBusiness]);
    setAssignedSpot(newSpot);
    setRegistrationSuccess(true);
    setIsSubmitting(false);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText('https://justbungee.com/merchant-waitlist');
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const filteredWaitlist = filterChannel === 'all' 
    ? waitlist 
    : waitlist.filter(b => b.targetChannel === filterChannel);

  const getChannelColor = (ch: string) => {
    switch(ch) {
      case 'Hiring Bounties': return 'bg-fuchsia-500 text-white';
      case 'Service Leads': return 'bg-green-500 text-white';
      case 'Product Boosting': return 'bg-sky-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-2 border-[#FF8C00]/30">
        <CardHeader className="relative pb-2">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="size-5 text-gray-500" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 rounded-xl bg-gradient-to-br from-[#FF8C00] to-orange-600 flex items-center justify-center">
              <Building2 className="size-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Merchant Waitlist</CardTitle>
              <CardDescription className="text-sm">Join the Bungee network</CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-[#FF8C00]/10 text-[#FF8C00] border-[#FF8C00]/30">
              <Users className="size-3 mr-1" />
              {waitlist.length} businesses waiting
            </Badge>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
              <Sparkles className="size-3 mr-1" />
              Early Access
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {!registrationSuccess ? (
            <>
              {/* Registration Form */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Company Name *</Label>
                  <Input 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company LLC"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Business Email *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Website (optional)</Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="www.yourcompany.com"
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Primary Interest *</Label>
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hiring Bounties">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-fuchsia-500" />
                          Hiring Bounties
                        </div>
                      </SelectItem>
                      <SelectItem value="Service Leads">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-green-500" />
                          Service Leads
                        </div>
                      </SelectItem>
                      <SelectItem value="Product Boosting">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-sky-500" />
                          Product Boosting
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!companyName || !email || !channel || isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-[#FF8C00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Securing Your Spot...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Rocket className="size-4" />
                    Join Waitlist
                  </div>
                )}
              </Button>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="size-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">You&apos;re In!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {companyName} is now on the waitlist
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF8C00]/10 border border-[#FF8C00]/30">
                <ShieldCheck className="size-4 text-[#FF8C00]" />
                <span className="text-sm font-bold text-[#FF8C00]">Spot #{assignedSpot}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 mb-2">Share with other businesses</p>
                <Button 
                  variant="outline" 
                  onClick={copyShareLink}
                  className="w-full"
                >
                  <ClipboardCopy className="size-4 mr-2" />
                  {copyFeedback ? 'Copied!' : 'Copy Invite Link'}
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={() => {
                  setRegistrationSuccess(false);
                  setCompanyName('');
                  setEmail('');
                  setWebsite('');
                  setChannel('');
                }}
                className="text-sm text-gray-500"
              >
                Register Another Business
              </Button>
            </div>
          )}

          {/* Admin Panel Toggle */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="text-xs text-gray-500 hover:text-[#FF8C00] transition-colors flex items-center gap-1"
            >
              <ListFilter className="size-3" />
              {showAdminPanel ? 'Hide' : 'Show'} Waitlist Preview
            </button>
            
            {showAdminPanel && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Select value={filterChannel} onValueChange={setFilterChannel}>
                    <SelectTrigger className="h-7 text-xs w-40">
                      <SelectValue placeholder="Filter by channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="Hiring Bounties">Hiring Bounties</SelectItem>
                      <SelectItem value="Service Leads">Service Leads</SelectItem>
                      <SelectItem value="Product Boosting">Product Boosting</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-[10px] text-gray-400">{filteredWaitlist.length} results</span>
                </div>
                
                <div className="max-h-40 overflow-y-auto space-y-1.5">
                  {filteredWaitlist.map((biz) => (
                    <div 
                      key={biz.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-gray-400">#{biz.spotNumber}</span>
                        <span className="font-medium text-gray-900 dark:text-white truncate">{biz.companyName}</span>
                      </div>
                      <Badge className={`${getChannelColor(biz.targetChannel)} text-[9px] px-1.5`}>
                        {biz.targetChannel.split(' ')[0]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <p className="text-[10px] text-gray-400 text-center w-full">
            By joining, you agree to Bungee&apos;s merchant terms and conditions.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
