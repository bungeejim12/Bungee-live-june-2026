"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, ShoppingBag, Target, Award, QrCode, Sparkles, Image, CheckCircle2, Mail, Users, Phone, Database, Plus, X, Globe, Loader2, FileText, Download, Copy, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { 
  generateSmsPayload, 
  generateMailtoUrl, 
  triggerNativeShare,
  type DaisyChainPayload
} from '@/lib/daisy-chain-sms';

interface ProductBountyWizardProps {
  onClose?: () => void;
}

export default function ProductBountyWizard({ onClose }: ProductBountyWizardProps) {
  const [step, setStep] = useState(1);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);
  
  // Form State Fields that AI can dynamically fill
  const [productName, setProductName] = useState('');
  const [targetBuyer, setTargetBuyer] = useState('');
  const [salesPitch, setSalesPitch] = useState('');
  const [mainGoal, setMainGoal] = useState('');
  const [bountyAmount, setBountyAmount] = useState('200');
  
  // AI One-Pager Generation State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [aiGeneratedOnePager, setAiGeneratedOnePager] = useState('');

  // Generate referral link for sharing
  const referralLink = `https://justbungee.com/refer/${productName?.toLowerCase().replace(/\s+/g, '-') || 'product'}-${Date.now().toString(36)}`;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Build daisy chain payload for all network blast actions
  const buildDaisyChainPayload = (): DaisyChainPayload => ({
    businessName: productName || 'Your Business',
    title: productName || 'Product Opportunity',
    bountyAmount: bountyAmount,
    campaignType: 'product',
    campaignId: `product-${Date.now().toString(36)}`,
    currentUserId: `user-${Date.now().toString(36)}`
  });

  // Handle network blast actions using daisy chain utility
  const handleEmailBlast = () => {
    const payload = buildDaisyChainPayload();
    const mailtoUrl = generateMailtoUrl(payload);
    window.location.href = mailtoUrl;
  };

  const handleContactsImport = () => {
    // Show alert for demo - in production this would open a contact import modal
    alert('Contact import feature coming soon! This will allow you to import contacts from your phone or CSV file.');
  };

  const handleSmsBlast = async () => {
    const payload = buildDaisyChainPayload();
    await triggerNativeShare(payload);
  };

  const handleCrmSync = () => {
    // Show alert for demo - in production this would open CRM integration modal
    alert('CRM integration coming soon! Connect HubSpot, Salesforce, or other CRMs to auto-sync your referral campaigns.');
  };

  // Simulated AI Autofill Process based on URL scraping - now with dynamic domain-based content
  const handleAiAutofill = () => {
    if (!websiteUrl) return;
    setIsAiLoading(true);
    
    setTimeout(() => {
      setIsAiLoading(false);
      setAiSuccess(true);
      
      // Extract domain for dynamic content generation
      const domain = websiteUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('.')[0];
      const domainCapitalized = domain.charAt(0).toUpperCase() + domain.slice(1);
      
      // Generate dynamic content based on domain keywords
      if (domain.toLowerCase().includes('heat') || domain.toLowerCase().includes('ac') || domain.toLowerCase().includes('cool')) {
        setProductName(`${domainCapitalized} AC Promo`);
        setTargetBuyer('Local homeowners looking for premium cooling solutions');
        setSalesPitch(`Beat the heat with ${domainCapitalized}! Professional HVAC services with same-day installation. Energy-efficient systems that cut your bills by up to 40%. Licensed, bonded, and insured.`);
        setMainGoal('quote');
      } else if (domain.toLowerCase().includes('desk') || domain.toLowerCase().includes('office') || domain.toLowerCase().includes('ergo')) {
        setProductName('Premium Ergonomic Standing Desk Pro');
        setTargetBuyer('Remote workers, home office professionals, and health-conscious employees');
        setSalesPitch("Transform your workspace with our award-winning standing desk. Reduce back pain by 67% and boost productivity. Ships fully assembled with a 10-year warranty.");
        setMainGoal('purchase');
      } else {
        // Generic fallback based on domain name
        setProductName(`${domainCapitalized} Premium Service`);
        setTargetBuyer(`Customers looking for quality ${domainCapitalized.toLowerCase()} solutions`);
        setSalesPitch(`Discover why thousands trust ${domainCapitalized} for their needs. Premium quality, exceptional service, and competitive pricing. Contact us today for a free consultation.`);
        setMainGoal('demo');
      }
      
      // Reset success indicator after 3 seconds
      setTimeout(() => setAiSuccess(false), 3000);
    }, 2000);
  };

  // AI Agent PDF One-Pager Generation
  const handleGenerateOnePager = () => {
    setIsGeneratingPdf(true);
    
    setTimeout(() => {
      setIsGeneratingPdf(false);
      const generatedContent = `
📄 PRODUCT ONE-PAGER

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${productName || 'Your Product Name'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 PERFECT FOR
${targetBuyer || 'Your target buyer description'}

💡 WHY THIS PRODUCT?
${salesPitch || 'Your product pitch goes here'}

✅ KEY FEATURES
• Premium quality materials
• 30-day money-back guarantee
• Free shipping on orders $50+
• 5-star rated by 1000+ customers

🛒 READY TO BUY?
Use code BUNGEE for your exclusive discount!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `.trim();
      
      setAiGeneratedOnePager(generatedContent);
    }, 2500);
  };

  return (
    <div className="w-full">
      {/* PROGRESS TRACKER (STEPS 1-4) */}
      {step <= 4 && (
        <div className="mb-6 sm:mb-8">
          {/* Step Counter Header */}
          <div className="text-center mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Step {step} of 4</span>
          </div>
          
          <div className="flex items-start justify-between px-2 sm:px-6">
            {[
              { num: 1, label: 'Details' },
              { num: 2, label: 'Targeting' },
              { num: 3, label: 'Rewards' },
              { num: 4, label: 'Launch' },
            ].map((s, idx) => (
              <div key={s.num} className="flex flex-col items-center flex-1 last:flex-none relative">
                <div className="flex items-center w-full">
                  {/* Step Circle */}
                  <div className={`relative flex items-center justify-center size-10 sm:size-14 rounded-full border-2 text-base sm:text-xl font-bold transition-all duration-300 ${
                    step === s.num 
                      ? 'bg-[#FF8C00] text-white border-[#FF8C00] ring-4 ring-[#FF8C00]/20 shadow-lg' 
                      : step > s.num 
                      ? 'bg-[#FF8C00] text-white border-[#FF8C00] shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600'
                  }`}>
                    {step > s.num ? (
                      <Check className="size-5 sm:size-7 stroke-[3]" />
                    ) : (
                      <span className="drop-shadow-sm">{s.num}</span>
                    )}
                    {/* Active Indicator Dot */}
                    {step === s.num && (
                      <span className="absolute -top-1 -right-1 size-3 sm:size-4 bg-white rounded-full border-2 border-[#FF8C00] shadow-md" />
                    )}
                  </div>
                  
                  {/* Connecting Line */}
                  {idx < 3 && (
                    <div className="flex-1 h-1.5 sm:h-2 mx-2 sm:mx-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <div className={`h-full rounded-full transition-all duration-700 ease-out ${
                        step > s.num ? 'w-full bg-[#FF8C00]' : 'w-0'
                      }`} />
                    </div>
                  )}
                </div>
                
                {/* Step Label */}
                <span className={`text-[10px] sm:text-sm font-semibold mt-2 sm:mt-3 transition-all ${
                  step === s.num 
                    ? 'text-[#FF8C00]' 
                    : step > s.num 
                    ? 'text-[#FF8C00]' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Card className="border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-xl">
        {/* Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-lg bg-gray-100/50 hover:bg-gray-100 transition-colors"
          >
            <X className="size-3 sm:size-4 text-gray-600" />
          </button>
        )}

        {/* STEP 1: PRODUCT BASICS */}
        {step === 1 && (
          <>
            <CardHeader className="pb-2 pt-2 sm:pt-4 px-2 sm:px-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShoppingBag className="size-4 sm:size-5 text-gray-900 dark:text-white" />
                <CardTitle className="text-xs sm:text-lg font-bold text-gray-900 dark:text-white">Step 1: Product Details</CardTitle>
              </div>
              <CardDescription className="text-[9px] sm:text-sm text-gray-600 dark:text-gray-400">Tell our network what product you want to boost sales for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-4 px-2 sm:px-6 pb-2 sm:pb-4">
              {/* AI Smart Autofill - Clean Bungee Orange style */}
              <div className="p-2 sm:p-3 rounded-lg bg-white border border-gray-200 relative overflow-hidden">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="size-3 sm:size-4 text-[#FF8C00]" />
                  <span className="text-[9px] sm:text-sm font-semibold text-[#0f172a]">AI Smart Autofill</span>
                  {aiSuccess && (
                    <span className="text-[7px] sm:text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                      <CheckCircle2 className="size-2.5 sm:size-3" /> Fields populated!
                    </span>
                  )}
                </div>
                <p className="text-[7px] sm:text-xs text-gray-500 mb-1.5">Enter your website and let AI fill in your product details automatically.</p>
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Globe className="absolute left-2 top-1/2 -translate-y-1/2 size-3 sm:size-4 text-gray-400" />
                    <Input 
                      placeholder="https://yourstore.com/product" 
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="pl-6 sm:pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 h-7 sm:h-9 text-[10px] sm:text-sm" 
                    />
                  </div>
                  <Button 
                    onClick={handleAiAutofill}
                    disabled={!websiteUrl || isAiLoading}
                    className="bg-[#FF8C00] hover:bg-[#E67E00] text-white h-7 sm:h-9 px-2 sm:px-3 text-[9px] sm:text-sm"
                  >
                    {isAiLoading ? (
                      <Loader2 className="size-3 sm:size-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="size-2.5 sm:size-3 mr-1" />
                        Autofill
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <Label className="text-[9px] sm:text-sm text-gray-700 dark:text-gray-300">Product Name / Campaign Title</Label>
                <Input 
                  placeholder="e.g., Premium Coffee Maker, Ergonomic Office Chair" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-7 sm:h-10 text-[10px] sm:text-sm" 
                />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <Label className="text-[9px] sm:text-sm text-gray-700 dark:text-gray-300">Target Buyer / Ideal Customer</Label>
                <div className="relative">
                  <Target className="absolute left-2 top-1/2 -translate-y-1/2 size-3 sm:size-4 text-gray-500 dark:text-gray-400" />
                  <Input 
                    placeholder="e.g., Home office workers, Coffee enthusiasts" 
                    value={targetBuyer}
                    onChange={(e) => setTargetBuyer(e.target.value)}
                    className="pl-6 sm:pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-7 sm:h-10 text-[10px] sm:text-sm" 
                  />
                </div>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <Label className="text-[9px] sm:text-sm text-gray-700 dark:text-gray-300">Success Trigger (Main Goal)</Label>
                <Select value={mainGoal} onValueChange={setMainGoal}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white h-7 sm:h-10 text-[10px] sm:text-sm">
                    <SelectValue placeholder="Select what constitutes a successful sale" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                    <SelectItem value="purchase" className="text-gray-900 dark:text-white">Completed Purchase</SelectItem>
                    <SelectItem value="cart" className="text-gray-900 dark:text-white">Added to Cart</SelectItem>
                    <SelectItem value="signup" className="text-gray-900 dark:text-white">Wishlist / Email Signup</SelectItem>
                    <SelectItem value="demo" className="text-gray-900 dark:text-white">Product Demo Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 2: MANDATORY PROMO TRACKING */}
        {step === 2 && (
          <>
            <CardHeader className="pb-2 pt-2 sm:pt-4 px-2 sm:px-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <QrCode className="size-4 sm:size-5 text-gray-900 dark:text-white" />
                <CardTitle className="text-xs sm:text-lg font-bold text-gray-900 dark:text-white">Step 2: Tracking & Promo Code</CardTitle>
              </div>
              <CardDescription className="text-[9px] sm:text-sm text-gray-600 dark:text-gray-400">Bungees give this discount to buyers to close deals and track conversions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-4 px-2 sm:px-6 pb-2 sm:pb-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-0.5 sm:space-y-1">
                  <Label className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Discount Structure</Label>
                  <Select defaultValue="percentage">
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white h-7 sm:h-10 text-[10px] sm:text-sm">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                      <SelectItem value="percentage" className="text-gray-900 dark:text-white">Percentage Off (%)</SelectItem>
                      <SelectItem value="fixed" className="text-gray-900 dark:text-white">Fixed Amount ($)</SelectItem>
                      <SelectItem value="bogo" className="text-gray-900 dark:text-white">Buy One Get One</SelectItem>
                      <SelectItem value="free-shipping" className="text-gray-900 dark:text-white">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <Label className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">Promo Incentive Offer</Label>
                  <Input placeholder="e.g., 15% Off, $25 Off" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 h-7 sm:h-10 text-[10px] sm:text-sm" />
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-[8px] sm:text-xs text-gray-600 dark:text-gray-400">
                <span className="text-gray-900 dark:text-white font-medium">How it tracks:</span> Bungee converts this offer into a QR code and link. When a customer uses the code at checkout, the system attributes the sale to the Bungee user.
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 3: SALES TOOLS */}
        {step === 3 && (
          <>
            <CardHeader className="pb-2 pt-2 sm:pt-4 px-2 sm:px-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Image className="size-4 sm:size-5 text-gray-900 dark:text-white" />
                <CardTitle className="text-xs sm:text-lg font-bold text-gray-900 dark:text-white">Step 3: Equip Your Bungees</CardTitle>
              </div>
              <CardDescription className="text-[9px] sm:text-sm text-gray-600 dark:text-gray-400">Arm your network with promotional tools to sell for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-4 px-2 sm:px-6 pb-2 sm:pb-4">
              <div className="space-y-0.5 sm:space-y-1">
                <Label className="text-[9px] sm:text-sm text-gray-700 dark:text-gray-300">Primary Promotional Tool</Label>
                <Select>
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white h-7 sm:h-10 text-[10px] sm:text-sm">
                    <SelectValue placeholder="Select a promotional asset" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                    <SelectItem value="product-images" className="text-gray-900 dark:text-white">Product Images / Gallery</SelectItem>
                    <SelectItem value="video-demo" className="text-gray-900 dark:text-white">Product Video / Demo</SelectItem>
                    <SelectItem value="one-pager" className="text-gray-900 dark:text-white">PDF One-Pager / Spec Sheet</SelectItem>
                    <SelectItem value="social-posts" className="text-gray-900 dark:text-white">Ready-to-Post Social Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <Label className="text-[9px] sm:text-sm text-gray-700 flex items-center gap-1">
                  <Sparkles className="size-3 sm:size-4 text-[#FF8C00]" />
                  Product Pitch / Key Selling Points
                </Label>
                <Textarea 
                  placeholder="What makes your product a must-have? Highlight key features and benefits..." 
                  value={salesPitch}
                  onChange={(e) => setSalesPitch(e.target.value)}
                  className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 text-[10px] sm:text-sm min-h-[60px] sm:min-h-[80px] resize-none" 
                />
              </div>
              
              {/* AI PDF One-Pager Generator - Clean Bungee Orange style */}
              <div className="p-2 sm:p-3 rounded-lg bg-white border border-gray-200 relative overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <FileText className="size-3 sm:size-4 text-[#FF8C00]" />
                    <span className="text-[9px] sm:text-sm font-semibold text-[#0f172a]">AI One-Pager Generator</span>
                  </div>
                  {aiGeneratedOnePager && (
                    <span className="text-[7px] sm:text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                      <CheckCircle2 className="size-2.5 sm:size-3" /> Ready!
                    </span>
                  )}
                </div>
                <p className="text-[7px] sm:text-xs text-gray-500 mb-2">Let AI create a professional PDF one-pager for your Bungees to share.</p>
                
                <Button 
                  onClick={handleGenerateOnePager}
                  disabled={isGeneratingPdf}
                  className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white h-8 sm:h-10 text-[9px] sm:text-sm mb-2"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="size-3 sm:size-4 animate-spin mr-1.5" />
                      Generating One-Pager...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3 sm:size-4 mr-1.5" />
                      Generate PDF One-Pager
                    </>
                  )}
                </Button>
                
                {/* Generated Content Preview */}
                {aiGeneratedOnePager && (
                  <div className="space-y-1.5">
                    <div className="bg-white rounded-lg p-2 sm:p-3 max-h-32 sm:max-h-40 overflow-y-auto border border-gray-200">
                      <pre className="text-[7px] sm:text-xs text-gray-700 whitespace-pre-wrap font-mono">{aiGeneratedOnePager}</pre>
                    </div>
                    <div className="flex gap-1.5">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-gray-200 text-[#0f172a] hover:bg-gray-50 h-7 sm:h-8 text-[8px] sm:text-xs"
                        onClick={() => navigator.clipboard.writeText(aiGeneratedOnePager)}
                      >
                        <Copy className="size-2.5 sm:size-3 mr-1" />
                        Copy Text
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-gray-200 text-[#0f172a] hover:bg-gray-50 h-7 sm:h-8 text-[8px] sm:text-xs"
                      >
                        <Download className="size-2.5 sm:size-3 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 4: POST THE BOUNTY */}
        {step === 4 && (
          <>
            <CardHeader className="pb-2 pt-2 sm:pt-4 px-2 sm:px-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Award className="size-4 sm:size-5 text-gray-900 dark:text-white" />
                <CardTitle className="text-xs sm:text-lg font-bold text-gray-900 dark:text-white">Step 4: Launch Campaign</CardTitle>
              </div>
              <CardDescription className="text-[9px] sm:text-sm text-gray-600 dark:text-gray-400">Higher bounties mean more active Bungees promoting your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-4 px-2 sm:px-6 pb-2 sm:pb-4">
              <div className="space-y-0.5 sm:space-y-1">
                <Label className="text-[9px] sm:text-sm text-gray-700 dark:text-gray-300">Referral Reward Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 size-4 sm:size-5 text-gray-900 dark:text-white" />
                  <Input type="number" placeholder="0.00" className="pl-7 sm:pl-10 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 h-10 sm:h-14 text-lg sm:text-2xl font-bold" />
                </div>
                <p className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Paid securely only when a Bungee successfully delivers a sale verified by promo code.
                </p>
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 5: SUCCESS & NETWORK CHANNELS */}
        {step === 5 && (
          <>
            <CardHeader className="text-center space-y-1 sm:space-y-2 pt-3 sm:pt-6 px-2 sm:px-6">
<div className="mx-auto flex size-8 sm:size-12 items-center justify-center rounded-full bg-[#FF8C00]/20 dark:bg-[#FF8C00]/30">
                  <CheckCircle2 className="size-4 sm:size-6 text-[#FF8C00]" />
                </div>
                <CardTitle className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">Product Campaign Launched!</CardTitle>
              <CardDescription className="text-[9px] sm:text-sm text-gray-600 dark:text-gray-400">
                Your campaign is live. Push it to your networks to amplify sales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-4 pt-1 sm:pt-2 px-2 sm:px-6 pb-2 sm:pb-4">
              <Label className="text-[8px] sm:text-xs font-semibold text-[#0f172a] dark:text-gray-400 uppercase tracking-wider block">Send to Your Network</Label>
              
              <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                <button 
                  onClick={handleEmailBlast}
                  className="h-10 sm:h-14 flex items-center justify-start gap-1.5 sm:gap-3 px-2 sm:px-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Mail className="size-3.5 sm:size-5 text-[#0f172a]" />
                  <div className="text-left">
                    <span className="block text-[9px] sm:text-sm font-medium text-[#0f172a]">Email List</span>
                    <span className="block text-[7px] sm:text-xs text-slate-500">Blast subscribers</span>
                  </div>
                </button>

                <button 
                  onClick={handleContactsImport}
                  className="h-10 sm:h-14 flex items-center justify-start gap-1.5 sm:gap-3 px-2 sm:px-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Users className="size-3.5 sm:size-5 text-[#0f172a]" />
                  <div className="text-left">
                    <span className="block text-[9px] sm:text-sm font-medium text-[#0f172a]">Contacts</span>
                    <span className="block text-[7px] sm:text-xs text-slate-500">Import list</span>
                  </div>
                </button>

                <button 
                  onClick={handleSmsBlast}
                  className="h-10 sm:h-14 flex items-center justify-start gap-1.5 sm:gap-3 px-2 sm:px-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Phone className="size-3.5 sm:size-5 text-[#0f172a]" />
                  <div className="text-left">
                    <span className="block text-[9px] sm:text-sm font-medium text-[#0f172a]">SMS</span>
                    <span className="block text-[7px] sm:text-xs text-slate-500">Invite via text</span>
                  </div>
                </button>

                <button 
                  onClick={handleCrmSync}
                  className="h-10 sm:h-14 flex items-center justify-start gap-1.5 sm:gap-3 px-2 sm:px-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Database className="size-3.5 sm:size-5 text-[#0f172a]" />
                  <div className="text-left">
                    <span className="block text-[9px] sm:text-sm font-medium text-[#0f172a]">CRM</span>
                    <span className="block text-[7px] sm:text-xs text-slate-500">HubSpot, etc.</span>
                  </div>
                </button>
              </div>

              <button className="w-full h-8 sm:h-11 flex items-center justify-start gap-2 px-3 rounded-lg text-slate-500 border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                <Plus className="size-3 sm:size-4" />
                <span className="text-[9px] sm:text-sm">Other integrations (Coming Soon)</span>
              </button>
            </CardContent>
          </>
        )}

        {/* WIZARD FOOTER NAV */}
        <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-2 sm:pt-4 px-2 sm:px-6 pb-2 sm:pb-4 flex items-center justify-between">
          {step <= 4 ? (
            <>
              <Button variant="ghost" onClick={step === 1 ? onClose : prevStep} className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 h-7 sm:h-9 gap-1">
                <ChevronLeft className="size-3 sm:size-4" />
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>
              <Button onClick={nextStep} className="text-[10px] sm:text-sm bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold h-8 sm:h-10 px-4 sm:px-6 gap-1.5 shadow-lg">
                {step === 4 ? 'Create & Launch' : 'Next Step'}
                <ChevronRight className="size-3.5 sm:size-4" />
              </Button>
            </>
          ) : (
            <Button className="w-full h-8 sm:h-11 text-[10px] sm:text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white" onClick={onClose || (() => setStep(1))}>
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
