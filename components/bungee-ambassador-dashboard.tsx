import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Trophy, UserPlus, Building2, MapPin, DollarSign, Briefcase, ShoppingBag, Users, ArrowUpRight, Sparkles, Activity } from 'lucide-react';

interface BungeeAmbassadorDashboardProps {
  onViewChange?: (view: "business" | "referral") => void;
}

export default function BungeeAmbassadorDashboard({ onViewChange }: BungeeAmbassadorDashboardProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  // Live earner network metrics tailored specifically for the Connector/Referral profile side
  const tickerMessages = [
    { text: 'Your referral Robert Vance confirmed a HVAC service contract! Bounty incoming.', icon: <Briefcase className="h-3.5 w-3.5 text-emerald-500" /> },
    { text: 'John Doe passed the business Round 1 SpamGuard! Tracking status updated.', icon: <Users className="h-3.5 w-3.5 text-orange-500" /> },
    { text: 'Checkout tracking verified: Pam Beesly bought Desk Chairs using your token.', icon: <ShoppingBag className="h-3.5 w-3.5 text-blue-500" /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerMessages.length]);

  // Mock data for active referrals
  const activeReferrals = [
    { id: 1, name: 'Sarah Johnson', type: 'Job', company: 'TechCorp Inc', bounty: '$500', status: 'Interview Scheduled', progress: 60 },
    { id: 2, name: 'Mike Chen', type: 'Service', company: "Joe's Plumbing", bounty: '$150', status: 'Contacted', progress: 30 },
    { id: 3, name: 'Lisa Park', type: 'Product', company: 'Office Depot', bounty: '$50', status: 'Purchase Pending', progress: 80 },
  ];

  // Earnings summary
  const earningsSummary = {
    thisMonth: 1250,
    pending: 450,
    lifetime: 8750,
    referralsThisMonth: 12
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      
      {/* 1. ELITE PREMIUM HEADER ZONE: ONE HUGE ICON & CURRENT RANKING */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-gradient-to-br from-gray-100 via-white to-transparent dark:from-gray-800 dark:via-gray-900 dark:to-transparent border rounded-2xl shadow-sm gap-4">
        <div className="flex items-center space-x-4">
          {/* HERO PROFILE RANK ICON */}
          <div className="h-14 w-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-inner shrink-0">
            <Trophy className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ambassador Command Center</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your referrals, earnings & network impact</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 px-3 py-1">
            <Trophy className="h-3.5 w-3.5 mr-1" />
            Silver Ambassador
          </Badge>
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1">
            <Activity className="h-3.5 w-3.5 mr-1" />
            Active
          </Badge>
        </div>
      </div>

      {/* 2. LIVE ACTIVITY TICKER */}
      <Card className="overflow-hidden border-orange-200 dark:border-orange-800">
        <CardContent className="p-0">
          <div className="flex items-center bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 px-4 py-3">
            <div className="flex items-center gap-2 shrink-0 mr-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Live</span>
            </div>
            <div className="flex items-center gap-2 overflow-hidden">
              {tickerMessages[tickerIndex].icon}
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate animate-fade-in">
                {tickerMessages[tickerIndex].text}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. EARNINGS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${earningsSummary.thisMonth}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <Badge className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">Pending</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${earningsSummary.pending}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting Payout</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${earningsSummary.lifetime}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Lifetime Earnings</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/20 dark:to-purple-900/20 border-fuchsia-200 dark:border-fuchsia-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
              <UserPlus className="h-4 w-4 text-fuchsia-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{earningsSummary.referralsThisMonth}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Referrals This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* 4. ACTIVE REFERRALS TRACKING */}
      <Card>
        <CardContent className="p-0">
          <button 
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">Active Referrals</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activeReferrals.length} referrals in progress</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300">{activeReferrals.length} Active</Badge>
              {isPanelOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
          </button>
          
          {isPanelOpen && (
            <div className="border-t border-gray-100 dark:border-gray-800">
              {activeReferrals.map((referral) => (
                <div key={referral.id} className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        referral.type === 'Job' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        referral.type === 'Service' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                        'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                        {referral.type === 'Job' ? <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" /> :
                         referral.type === 'Service' ? <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> :
                         <ShoppingBag className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{referral.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{referral.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">{referral.bounty}</p>
                      <Badge variant="outline" className="text-[10px]">{referral.type}</Badge>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{referral.status}</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{referral.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          referral.type === 'Job' ? 'bg-blue-500' :
                          referral.type === 'Service' ? 'bg-emerald-500' :
                          'bg-purple-500'
                        }`}
                        style={{ width: `${referral.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. QUICK ACTIONS */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-14 justify-start gap-3 border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
        >
          <MapPin className="h-5 w-5 text-orange-500" />
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white">Find Opportunities</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Browse local bounties</p>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-14 justify-start gap-3 border-gray-200 dark:border-gray-700 hover:border-fuchsia-300 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20"
        >
          <UserPlus className="h-5 w-5 text-fuchsia-500" />
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white">Refer Someone</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Submit a new referral</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
