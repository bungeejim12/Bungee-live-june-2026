"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, Briefcase, Award, CheckCircle2, Sparkles, X, Globe, Loader2, ChevronLeft, ChevronRight, Check, Users, Building2, Wallet, Info, Mail, Copy, Share2, Package, Wrench, MessageSquare } from 'lucide-react';
import { 
  generateSmsPayload, 
  generateSmsProtocolUrl,
  type DaisyChainPayload,
  type CampaignType as DaisyChainCampaignType
} from '@/lib/daisy-chain-sms';

interface ServiceBountyWizardProps {
  onClose?: () => void;
  businessName?: string;
  defaultCategory?: 'recruiting' | 'services' | 'products';
}

// Category types
type CategoryType = 'recruiting' | 'services' | 'products' | '';

// 25% Corporate Take-Rate Model
const calculateEscrowSplit = (bungeeReward: number) => {
  const corporateFee = bungeeReward * 0.25;
  const totalEscrow = bungeeReward + corporateFee;
  return {
    bungeeReward,
    corporateFee,
    totalEscrow
  };
};

export default function ServiceBountyWizard({ onClose, businessName = 'Your Business', defaultCategory }: ServiceBountyWizardProps) {
  // If defaultCategory is provided, skip step 1 and start at step 2
  const [step, setStep] = useState(defaultCategory ? 2 : 1);
  
  // Step 1: Category Selection - pre-populate if defaultCategory provided
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(defaultCategory || '');
  
  // AI Scraping State
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);
  
  // Step 2: Dynamic Fields based on category
  // Recruiting fields
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [locationStyle, setLocationStyle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  
  // Services fields
  const [serviceTitle, setServiceTitle] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [targetClientPersona, setTargetClientPersona] = useState('');
  
  // Products fields
  const [productName, setProductName] = useState('');
  const [catalogUrl, setCatalogUrl] = useState('');
  const [keySellingPoints, setKeySellingPoints] = useState('');
  
  // Step 3: Bounty Financial Fields
  const [bountyAmount, setBountyAmount] = useState<string>('');
  const [split, setSplit] = useState({ bungeeReward: 0, corporateFee: 0, totalEscrow: 0 });
  
  // Success state (Step 4)
  const [isCopied, setIsCopied] = useState(false);
  const [campaignUrl, setCampaignUrl] = useState('');

  // AI-powered website scraper
  const handleAiScrape = async () => {
    if (!websiteUrl) return;
    setIsAiLoading(true);
    setAiSuccess(false);

    try {
      const response = await fetch('/api/scrape-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl,
          formType: 'service'
        })
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        console.error("[v0] Scrape error:", result.error);
        return;
      }

      const data = result.data;
      
      // Fill in service fields based on extracted data
      if (data.serviceName && data.serviceName !== "NOT_FOUND") {
        setServiceTitle(data.serviceName);
      }
      
      if (data.companyDescription && data.companyDescription !== "NOT_FOUND") {
        setProjectScope(data.companyDescription);
      }
      
      if (data.targetAudience && data.targetAudience !== "NOT_FOUND") {
        setTargetClientPersona(data.targetAudience);
      }
      
      if (data.salesPitch && data.salesPitch !== "NOT_FOUND") {
        setKeySellingPoints(data.salesPitch);
      }
      
      // Set default bounty based on confidence
      if (result.confidence === "HIGH") {
        setBountyAmount('500');
      } else if (result.confidence === "MEDIUM") {
        setBountyAmount('350');
      } else {
        setBountyAmount('250');
      }
      
      setAiSuccess(true);
    } catch (error) {
      console.error("[v0] AI Extraction Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Update split calculation when bounty amount changes
  useEffect(() => {
    const amount = parseFloat(bountyAmount) || 0;
    setSplit(calculateEscrowSplit(amount));
  }, [bountyAmount]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle campaign launch
  const handleLaunchCampaign = () => {
    const bountyId = `campaign_${Date.now()}`;
    const generatedUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/refer/${bountyId}`;
    setCampaignUrl(generatedUrl);
    nextStep();
  };

  // Get campaign title based on category
  const getCampaignTitle = () => {
    switch (selectedCategory) {
      case 'recruiting': return jobTitle;
      case 'services': return serviceTitle;
      case 'products': return productName;
      default: return 'Your Campaign';
    }
  };

  // Build mailto link
  const buildMailtoLink = () => {
    const subject = `Join our referral campaign - Earn ${formatCurrency(split.bungeeReward)}!`;
    const body = `Hi,

We just launched a new referral campaign on Bungee for "${getCampaignTitle()}"!

If you refer someone who completes a successful transaction, you'll earn ${formatCurrency(split.bungeeReward)} cash reward.

Learn more and start referring: ${campaignUrl}

Best,
${businessName}`;

    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Build SMS link using daisy chain utility
  const buildSmsLink = () => {
    // Map category to daisy chain campaign type
    const campaignTypeMap: Record<string, DaisyChainCampaignType> = {
      'recruiting': 'hiring',
      'services': 'service',
      'products': 'product'
    };
    
    // Determine title based on category
    const getTitle = () => {
      switch (selectedCategory) {
        case 'recruiting': return jobTitle || 'Job Opportunity';
        case 'services': return serviceTitle || 'Service Offer';
        case 'products': return productName || 'Product Deal';
        default: return 'Opportunity';
      }
    };
    
    const payload: DaisyChainPayload = {
      businessName: businessName,
      title: getTitle(),
      bountyAmount: split.bungeeReward,
      campaignType: campaignTypeMap[selectedCategory] || 'service',
      campaignId: `${selectedCategory}-${Date.now().toString(36)}`,
      currentUserId: `business-${Date.now().toString(36)}`
    };
    
    return generateSmsProtocolUrl(payload);
  };

  // Copy link handler
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Check if step 2 is valid based on category
  const isStep2Valid = () => {
    switch (selectedCategory) {
      case 'recruiting':
        return jobTitle.trim() && locationStyle && roleDescription.trim();
      case 'services':
        return serviceTitle.trim() && targetClientPersona.trim();
      case 'products':
        return productName.trim() && keySellingPoints.trim();
      default:
        return false;
    }
  };

  // Category cards data
  const categories = [
    {
      id: 'recruiting' as CategoryType,
      icon: Briefcase,
      title: 'Recruiting / Job Placement',
      description: 'Find your next hire through trusted referrals. Pay only when the right candidate is placed.',
      color: 'blue'
    },
    {
      id: 'services' as CategoryType,
      icon: Wrench,
      title: 'Promote a Local Service',
      description: 'Generate qualified leads for your service business. Reward referrers for each new client.',
      color: 'emerald'
    },
    {
      id: 'products' as CategoryType,
      icon: Package,
      title: 'Sell a Product',
      description: 'Boost product sales through word-of-mouth. Pay commissions on successful purchases.',
      color: 'orange'
    }
  ];

  return (
    <div className="w-full">
      {/* PROGRESS TRACKER (STEPS 1-3) */}
      {step <= 3 && (
        <div className="mb-6 sm:mb-8">
          <div className="text-center mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-500">Step {step} of 3</span>
          </div>
          
          <div className="flex items-center justify-center gap-0 px-4">
            {[
              { num: 1, label: 'Category' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Bounty' },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`relative flex items-center justify-center size-10 sm:size-12 rounded-full border-2 text-sm sm:text-base font-bold transition-all duration-300 ${
                    step === s.num 
                      ? 'bg-[#FF8C00] text-white border-[#FF8C00] ring-4 ring-[#FF8C00]/20 shadow-lg' 
                      : step > s.num 
                      ? 'bg-[#FF8C00] text-white border-[#FF8C00] shadow-md'
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                    {step > s.num ? (
                      <Check className="size-5 sm:size-6 stroke-[3]" />
                    ) : (
                      <span>{s.num}</span>
                    )}
                  </div>
                  
                  <span className={`text-xs font-semibold mt-2 transition-all ${
                    step >= s.num ? 'text-[#FF8C00]' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                
                {idx < 2 && (
                  <div className="w-12 sm:w-20 h-1 mx-2 rounded-full overflow-hidden bg-gray-200 mt-[-20px]">
                    <div className={`h-full rounded-full transition-all duration-700 ease-out ${
                      step > s.num ? 'w-full bg-[#FF8C00]' : 'w-0'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <Card className="border-gray-200 bg-white shadow-xl rounded-2xl overflow-hidden relative">
        {/* Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          >
            <X className="size-4 text-gray-600" />
          </button>
        )}

        {/* STEP 1: CATEGORY SELECTION */}
        {step === 1 && (
          <>
            <CardHeader className="pb-4 pt-6 px-6">
              <CardTitle className="text-xl font-bold text-gray-900">What type of campaign?</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Choose the category that best fits what you want to promote.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                const colorClasses = {
                  blue: { bg: 'bg-blue-50', border: 'border-blue-500', iconBg: 'bg-blue-100', icon: 'text-blue-600', ring: 'ring-blue-500/20' },
                  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-500', iconBg: 'bg-emerald-100', icon: 'text-emerald-600', ring: 'ring-emerald-500/20' },
                  orange: { bg: 'bg-orange-50', border: 'border-[#FF8C00]', iconBg: 'bg-orange-100', icon: 'text-[#FF8C00]', ring: 'ring-[#FF8C00]/20' }
                }[cat.color];
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected 
                        ? `${colorClasses.bg} ${colorClasses.border} ring-4 ${colorClasses.ring}` 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? colorClasses.iconBg : 'bg-gray-100'
                      }`}>
                        <Icon className={`size-6 ${isSelected ? colorClasses.icon : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-base mb-1 ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                          {cat.title}
                        </h3>
                        <p className={`text-sm ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                          {cat.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className={`size-6 rounded-full flex items-center justify-center shrink-0 ${colorClasses.iconBg}`}>
                          <Check className={`size-4 ${colorClasses.icon}`} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </>
        )}

        {/* STEP 2: DYNAMIC LAYOUT FIELDS */}
        {step === 2 && (
          <>
            <CardHeader className="pb-4 pt-6 px-6">
              <div className="flex items-center gap-2 mb-1">
                {selectedCategory === 'recruiting' && <Briefcase className="size-5 text-blue-600" />}
                {selectedCategory === 'services' && <Wrench className="size-5 text-emerald-600" />}
                  {selectedCategory === 'products' && <Package className="size-5 text-[#FF8C00]" />}
                <CardTitle className="text-lg font-bold text-gray-900">
                  {selectedCategory === 'recruiting' && 'Job Details'}
                  {selectedCategory === 'services' && 'Service Details'}
                  {selectedCategory === 'products' && 'Product Details'}
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-gray-600">
                {selectedCategory === 'recruiting' && 'Provide details about the role so referrers can match you with the right candidates.'}
                {selectedCategory === 'services' && 'Describe your service to help referrers identify potential clients.'}
                {selectedCategory === 'products' && 'Share product information that referrers can use to promote to their network.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-6 pb-6">
              {/* AI WEBSITE SCRAPER - Auto-fill from company website */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF8C00]/10 to-amber-500/5 border border-[#FF8C00]/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-lg bg-[#FF8C00] flex items-center justify-center">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">AI Auto-Fill</p>
                    <p className="text-xs text-gray-500">Enter your website to auto-populate details</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      placeholder="yourcompany.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-10"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAiScrape}
                    disabled={!websiteUrl || isAiLoading}
                    className="bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white h-10 px-4"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : aiSuccess ? (
                      <>
                        <CheckCircle2 className="size-4 mr-2" />
                        Done!
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4 mr-2" />
                        Scan
                      </>
                    )}
                  </Button>
                </div>
                {aiSuccess && (
                  <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    Fields auto-filled from your website. Review and adjust as needed.
                  </p>
                )}
              </div>

              {/* RECRUITING FIELDS */}
              {selectedCategory === 'recruiting' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Job Title <span className="text-red-500">*</span></Label>
                    <Input 
                      placeholder="e.g., Senior Software Engineer, Sales Manager" 
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-11" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Company Department</Label>
                    <Input 
                      placeholder="e.g., Engineering, Sales, Marketing" 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-11" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Location Style <span className="text-red-500">*</span></Label>
                    <Select value={locationStyle} onValueChange={setLocationStyle}>
                      <SelectTrigger className="bg-white border-gray-200 text-gray-900 h-11">
                        <SelectValue placeholder="Select work arrangement" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="onsite" className="text-gray-900">Onsite</SelectItem>
                        <SelectItem value="hybrid" className="text-gray-900">Hybrid</SelectItem>
                        <SelectItem value="remote" className="text-gray-900">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Role Description & Ideal Candidate <span className="text-red-500">*</span></Label>
                    <Textarea 
                      placeholder="Describe the role responsibilities, required skills, experience level, and what makes an ideal candidate..." 
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 min-h-[120px] resize-none" 
                    />
                  </div>
                </>
              )}

              {/* SERVICES FIELDS */}
              {selectedCategory === 'services' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Service Title <span className="text-red-500">*</span></Label>
                    <Input 
                      placeholder="e.g., Commercial Roofing, Tax Preparation, Web Development" 
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-11" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Project Scope / Coverage Area</Label>
                    <Input 
                      placeholder="e.g., Greater Austin Area, Nationwide, Remote Only" 
                      value={projectScope}
                      onChange={(e) => setProjectScope(e.target.value)}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-11" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Target Client & Special Offerings <span className="text-red-500">*</span></Label>
                    <Textarea 
                      placeholder="Describe your ideal client persona, unique value propositions, and any special offerings that referrers should highlight..." 
                      value={targetClientPersona}
                      onChange={(e) => setTargetClientPersona(e.target.value)}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 min-h-[120px] resize-none" 
                    />
                  </div>
                </>
              )}

              {/* PRODUCTS FIELDS */}
              {selectedCategory === 'products' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></Label>
                    <Input 
                      placeholder="e.g., Premium Fitness Tracker, Organic Skincare Kit" 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-11" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">E-Commerce / Catalog URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input 
                        placeholder="https://yourstore.com/product" 
                        value={catalogUrl}
                        onChange={(e) => setCatalogUrl(e.target.value)}
                        className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-11" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Key Selling Points & Pitch <span className="text-red-500">*</span></Label>
                    <Textarea 
                      placeholder="What makes this product special? Include key features, benefits, pricing advantages, and talking points for referrers..." 
                      value={keySellingPoints}
                      onChange={(e) => setKeySellingPoints(e.target.value)}
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 min-h-[120px] resize-none" 
                    />
                  </div>
                </>
              )}
            </CardContent>
          </>
        )}

        {/* STEP 3: POST YOUR BOUNTY (Financial Clearance) */}
        {step === 3 && (
          <>
            <CardHeader className="pb-4 pt-6 px-6">
              <div className="flex items-center gap-2 mb-1">
                <Award className="size-5 text-[#FF8C00]" />
                <CardTitle className="text-lg font-bold text-gray-900">Post Your Bounty</CardTitle>
              </div>
              <CardDescription className="text-sm text-gray-600">
                Set your referral reward amount. Higher bounties attract more active Bungees.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-6 pb-6">
              {/* Performance-Based Notice */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                <Info className="size-5 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Bounties are performance-based.</span> You are only charged upon a successful hire or completed referral transaction.
                </p>
              </div>

              {/* Bounty Input */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-800">Reward Offered to the Bungee</Label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-gray-700" />
                  <Input 
                    type="number" 
                    placeholder="100" 
                    value={bountyAmount}
                    onChange={(e) => setBountyAmount(e.target.value)}
                    className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-16 text-3xl font-bold rounded-xl" 
                  />
                </div>
                <p className="text-xs text-gray-500">
                  This is what the Bungee referrer receives for each successful conversion.
                </p>
              </div>

              {/* Live Split-Fee Calculation Card */}
              <div className="rounded-xl border-2 border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Wallet className="size-4" />
                    Escrow Breakdown
                  </h4>
                </div>
                <div className="p-5 space-y-4">
                  {/* Bungee Referrer Payout */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Users className="size-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Bungee Referrer Payout</p>
                        <p className="text-xs text-gray-500">100% of reward amount</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">
                      {formatCurrency(split.bungeeReward)}
                    </span>
                  </div>

                  {/* Bungee Corporate Service Fee */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Building2 className="size-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Bungee Corporate Service Fee</p>
                        <p className="text-xs text-gray-500">25% of reward amount</p>
                      </div>
                    </div>
                    <span className="text-lg font-medium text-gray-600">
                      {formatCurrency(split.corporateFee)}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-gray-200 my-2" />

                  {/* Total Funded Escrow */}
                  <div className="flex items-center justify-between bg-[#FF8C00]/5 -mx-5 px-5 py-4 border-t border-[#FF8C00]/20">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Total Funded Escrow</p>
                      <p className="text-xs text-gray-500">Due on successful conversion</p>
                    </div>
                    <span className="text-2xl font-bold text-[#FF8C00]">
                      {formatCurrency(split.totalEscrow)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 4: SUCCESS & BROADCAST */}
        {step === 4 && (
          <>
            <CardHeader className="text-center space-y-3 pt-8 px-6">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Campaign Launched!</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Your bounty is live. Share it with your network to start receiving referrals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-4 px-6 pb-6">
              {/* Split Summary */}
              <div className="rounded-xl p-4 bg-gray-50 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Bungee Reward</span>
                  <span className="text-lg font-bold text-emerald-600">{formatCurrency(split.bungeeReward)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Escrow (on success)</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(split.totalEscrow)}</span>
                </div>
              </div>

              {/* Broadcast Section */}
              <div className="rounded-xl p-5 bg-white border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-[#FF8C00]" />
                  <span className="text-sm font-semibold text-gray-700">Broadcast to Network</span>
                </div>

                <a
                  href={buildMailtoLink()}
                  className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-lg bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold transition-colors shadow-sm"
                >
                  <Mail className="h-5 w-5" />
                  Share with Email List
                </a>
                
                <p className="text-center text-xs text-gray-500">
                  Opens your email app. Paste contacts into BCC to send!
                </p>

                <a
                  href={buildSmsLink()}
                  className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-lg border-2 border-gray-400 text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  Text Message to My Team
                </a>
                
                <p className="text-center text-xs text-gray-400 italic">
                  Opens your messaging app. Select contacts and hit send!
                </p>

                <button
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center gap-3 w-full py-3 px-6 rounded-lg border font-medium transition-all ${
                    isCopied 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-5 w-5" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      Copy Campaign Link
                    </>
                  )}
                </button>

                <div className="p-3 rounded-lg text-xs font-mono truncate bg-gray-100 text-gray-500">
                  {campaignUrl}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* FOOTER NAVIGATION */}
        {step <= 3 && (
          <CardFooter className="flex justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            {step > 1 ? (
              <Button 
                variant="outline" 
                onClick={prevStep}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <ChevronLeft className="size-4 mr-1" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <Button 
                onClick={nextStep}
                disabled={!selectedCategory}
                className="bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold disabled:opacity-50"
              >
                Continue
                <ChevronRight className="size-4 ml-1" />
              </Button>
            )}

            {step === 2 && (
              <Button 
                onClick={nextStep}
                disabled={!isStep2Valid()}
                className="bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold disabled:opacity-50"
              >
                Continue
                <ChevronRight className="size-4 ml-1" />
              </Button>
            )}

            {step === 3 && (
              <Button 
                onClick={handleLaunchCampaign}
                disabled={!bountyAmount || parseFloat(bountyAmount) <= 0}
                className="bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold px-6 disabled:opacity-50"
              >
                Launch Campaign
                <ChevronRight className="size-4 ml-1" />
              </Button>
            )}
          </CardFooter>
        )}

        {/* DONE BUTTON FOR SUCCESS STEP */}
        {step === 4 && onClose && (
          <CardFooter className="px-6 py-4 border-t border-gray-100">
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-900"
            >
              Done
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
