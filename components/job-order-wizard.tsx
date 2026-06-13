"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { UserPlus, Briefcase, MapPin, DollarSign, Sparkles, Video, HelpCircle, Award, CheckCircle2, Users, Database, Globe, Loader2, X, ChevronLeft, ChevronRight, ShieldCheck, Plus, Check, Megaphone, FileText, Download, Copy, Share2, Brain, MessageSquare, AlertCircle } from 'lucide-react';
import BungeeDistributionHub from './bungee-distribution-hub';
import { 
  generateSmsPayload, 
  triggerNativeShare,
  copyToClipboard,
  type DaisyChainPayload
} from '@/lib/daisy-chain-sms';

interface JobOrderWizardProps {
  onClose?: () => void;
}

export default function JobOrderWizard({ onClose }: JobOrderWizardProps) {
  const [step, setStep] = useState(1);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [targetRoleInput, setTargetRoleInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  // Form fields controlled dynamically by the Bungee AI Scraping Agent
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [requireVideo, setRequireVideo] = useState(true);
  const [screeningQuestionsActive, setScreeningQuestionsActive] = useState(true);
  const [bgCheckActive, setBgCheckActive] = useState(false);
  const [drugTestActive, setDrugTestActive] = useState(false);
  const [psychEvalActive, setPsychEvalActive] = useState(false);
  const [questionOne, setQuestionOne] = useState('');
  const [questionTwo, setQuestionTwo] = useState('');
  const [bountyAmount, setBountyAmount] = useState('');
  
  // Spam Guard - Pre-qualifying screening questions
  const [spamGuardQuestions, setSpamGuardQuestions] = useState([
    { id: 1, question: 'Do you have reliable transportation to commute to work?', expectedAnswer: 'yes' },
    { id: 2, question: 'Are you authorized to work in the United States?', expectedAnswer: 'yes' },
  ]);
  const [passRateThreshold, setPassRateThreshold] = useState(85);

  // Equip Your Bungees - Promotional tools
  const [promotionalTool, setPromotionalTool] = useState('');
  const [elevatorPitch, setElevatorPitch] = useState('');
  const [aiGeneratedOnePager, setAiGeneratedOnePager] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Distribution Hub state
  const [showDistributionHub, setShowDistributionHub] = useState(false);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // LIVE AI SCRAPING PIPELINE - Extracts real data from company website
  const handleHiringAiScrape = async () => {
    if (!websiteUrl || !targetRoleInput) return;
    setIsAiLoading(true);
    setAiSuccess(false);

    try {
      const response = await fetch('/api/scrape-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl,
          targetRole: targetRoleInput,
          formType: 'hiring'
        })
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        console.error("[v0] Scrape error:", result.error);
        // Fall back to basic defaults on error
        setJobTitle(targetRoleInput);
        setDescription(`Role: ${targetRoleInput}. Please update with specific job details.`);
        return;
      }

      const data = result.data;
      
      // Only set fields that were actually found (not "NOT_FOUND")
      if (data.jobTitle && data.jobTitle !== "NOT_FOUND") {
        setJobTitle(data.jobTitle);
      } else {
        setJobTitle(targetRoleInput); // Fall back to user input
      }
      
      if (data.department && data.department !== "NOT_FOUND") {
        setDepartment(data.department);
      }
      
      if (data.location && data.location !== "NOT_FOUND") {
        setLocation(data.location);
      }
      
      if (data.salary && data.salary !== "NOT_FOUND") {
        // Extract numeric value from salary string
        const salaryNum = data.salary.replace(/[^0-9]/g, '');
        if (salaryNum) setSalary(salaryNum);
      }
      
      if (data.jobType && data.jobType !== "NOT_FOUND") {
        setJobType(data.jobType);
      }
      
      if (data.experience && data.experience !== "NOT_FOUND") {
        setExperience(data.experience);
      }
      
      if (data.skills && data.skills !== "NOT_FOUND") {
        setSkills(data.skills);
      }
      
      if (data.description && data.description !== "NOT_FOUND") {
        setDescription(data.description);
      }
      
      if (data.screeningQuestion1 && data.screeningQuestion1 !== "NOT_FOUND") {
        setQuestionOne(data.screeningQuestion1);
      }
      
      if (data.screeningQuestion2 && data.screeningQuestion2 !== "NOT_FOUND") {
        setQuestionTwo(data.screeningQuestion2);
      }

      // Set default bounty based on confidence
      if (result.confidence === "HIGH") {
        setBountyAmount('2500');
      } else if (result.confidence === "MEDIUM") {
        setBountyAmount('2000');
      } else {
        setBountyAmount('1500');
      }
      
      setAiSuccess(true);
    } catch (error) {
      console.error("[v0] AI Extraction Error:", error);
      // Set minimal fallback data
      setJobTitle(targetRoleInput);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleComplete = () => {
    if (onClose) {
      onClose();
    } else {
      setStep(1);
      setAiSuccess(false);
      setWebsiteUrl('');
      setTargetRoleInput('');
    }
  };

  // Generate AI-powered Bungee Info Pack from company website
  const handleGenerateOnePager = async () => {
    setIsGeneratingPdf(true);
    try {
      // If we have a website URL, use AI scraper to generate comprehensive info pack
      if (websiteUrl) {
        const response = await fetch('/api/scrape-company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            websiteUrl,
            targetRole: jobTitle || targetRoleInput || 'Open Position',
            formType: 'bungee-info-pack'
          })
        });

        const result = await response.json();

        if (result.success && result.bungeeInfoPack) {
          setAiGeneratedOnePager(result.bungeeInfoPack);
          return;
        }
      }

      // Fallback to basic template if no website or scrape failed
      const generatedContent = `# 🍊 BUNGEE INFO PACK
## ${jobTitle || 'Open Position'}

---

## 🏢 ABOUT THE COMPANY
${websiteUrl ? `Company: ${websiteUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0]}` : 'Company Name'}

---

## �� THE OPPORTUNITY

**Role:** ${jobTitle || 'Open Position'}
**Location:** ${location || 'Contact for details'}
**Type:** ${jobType || 'Full-time'}

### Description
${description || 'Join our growing team in this exciting opportunity.'}

### Requirements
${skills ? skills.split(',').map((s: string) => `• ${s.trim()}`).join('\n') : '• Relevant experience\n• Strong communication skills\n• Team player mentality'}

### Compensation
${salary ? `$${Number(salary).toLocaleString()} per year` : 'Competitive salary'}

---

## 🎯 YOUR 30-SECOND PITCH

> "${elevatorPitch || `I know a great company that's hiring for a ${jobTitle || 'position'} role. They're known for their excellent culture and growth opportunities. Would you be interested in learning more?`}"

---

## 💰 REFERRAL BONUS: $${bountyAmount || '1,500'}

Know someone perfect for this role? Refer them through Bungee and earn!

---

*Generated by Bungee AI*
      `.trim();
      setAiGeneratedOnePager(generatedContent);
    } catch (error) {
      console.error("[v0] Error generating Bungee Info Pack:", error);
      // Set basic fallback on error
      setAiGeneratedOnePager(`# Bungee Info Pack\n\n## ${jobTitle || 'Open Position'}\n\nContact for more details about this opportunity.`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Universal Contact Matrix - Native Web Share API Integration with Daisy Chain
  const handleImportContactMatrix = async () => {
    // Build daisy chain payload for hiring campaigns
    const payload: DaisyChainPayload = {
      businessName: 'Your Company',
      title: jobTitle || 'Job Opportunity',
      bountyAmount: bountyAmount || '1,500',
      campaignType: 'hiring',
      campaignId: `hiring-${jobTitle?.toLowerCase().replace(/\s+/g, '-') || 'job'}-${Date.now().toString(36)}`,
      currentUserId: `recruiter-${Date.now().toString(36)}`
    };

    // Use centralized daisy chain share utility
    const shared = await triggerNativeShare(payload);
    
    if (!shared) {
      // Fallback: Copy to clipboard
      const copied = await copyToClipboard(payload);
      if (copied) {
        alert('Referral link copied to clipboard! Share it via email, SMS, or any messaging app.');
      } else {
        const smsText = generateSmsPayload(payload);
        prompt('Copy this referral message to share:', smsText);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute -top-1 -right-1 p-2 rounded-full bg-white hover:bg-red-500 hover:text-white transition-colors z-10 border border-gray-200 shadow-md"
        >
          <X className="size-4" />
        </button>
      )}

      {/* DYNAMIC STEP TRACKER SYSTEM */}
      {step <= 5 && (
        <div className="mb-6 sm:mb-8">
          {/* Step Counter Header */}
          <div className="text-center mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Step {step} of 5</span>
          </div>
          
          <div className="flex items-start justify-between px-2 sm:px-6">
            {[
              { num: 1, label: 'Role Profile' },
              { num: 2, label: 'Requirements' },
              { num: 3, label: 'Screening' },
              { num: 4, label: 'Equip' },
              { num: 5, label: 'Bounty' },
            ].map((s, idx) => (
              <div key={s.num} className="flex flex-col items-center flex-1 last:flex-none relative">
                <div className="flex items-center w-full">
                  {/* Step Circle */}
                  <div className={`relative flex items-center justify-center size-8 sm:size-12 rounded-full border-2 sm:border-3 text-sm sm:text-lg font-black transition-all duration-300 ${
                    step === s.num 
                      ? 'bg-[#FF8C00] text-white border-white ring-3 ring-[#FF8C00]/50 shadow-lg scale-110' 
                      : step > s.num 
                      ? 'bg-[#FF8C00] text-white border-[#FF8C00]/30 shadow-md'
                      : 'bg-white text-gray-400 border-gray-200 shadow-sm'
                  }`}>
                    {step > s.num ? (
                      <Check className="size-4 sm:size-5 stroke-[3]" />
                    ) : (
                      <span className="drop-shadow-sm">{s.num}</span>
                    )}
                    {/* Active Indicator Dot */}
                    {step === s.num && (
                      <span className="absolute -top-1 -right-1 size-2.5 sm:size-3 bg-white rounded-full border-2 border-[#FF8C00] shadow-md" />
                    )}
                  </div>
                  
                  {/* Connecting Line */}
                  {idx < 4 && (
                    <div className="flex-1 h-1 sm:h-1.5 mx-1.5 sm:mx-2 rounded-full overflow-hidden bg-gray-200 shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-700 ease-out ${
                        step > s.num ? 'w-full bg-[#FF8C00]' : 'w-0'
                      }`} />
                    </div>
                  )}
                </div>
                
                {/* Step Label */}
                <span className={`text-[10px] sm:text-sm font-bold mt-2 sm:mt-3 transition-all ${
                  step === s.num 
                    ? 'text-[#FF8C00] scale-105' 
                    : step > s.num 
                    ? 'text-[#FF8C00]' 
                    : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI WEBSCRAPER & ROLE INTEGRATION CONTROL PANEL - Clean Bungee Orange theme */}
      {step === 1 && (
        <div className="mb-4 p-3 sm:p-4 rounded-xl bg-white border border-gray-200 shadow-sm relative overflow-hidden space-y-3">
          <div className="flex items-center space-x-2 text-[#0f172a]">
            <Sparkles className="size-4 text-[#FF8C00]" />
            <span className="text-xs font-bold uppercase tracking-wider">Bungee AI Talent Scraper Engine</span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-600">
            Drop your company website and the target job title below. Our AI Agent will scrape your public brand identity, company voice, and core location coordinates to build the complete job order blueprint instantly.
          </p>
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 size-4 text-gray-400" />
                <Input 
                  placeholder="e.g., www.greatclips.com" 
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="pl-9 h-9 bg-white border-gray-200 focus-visible:ring-[#FF8C00] text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 size-4 text-gray-400" />
                <Input 
                  placeholder="e.g., Salon Manager, Senior Dev" 
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  className="pl-9 h-9 bg-white border-gray-200 focus-visible:ring-[#FF8C00] text-sm text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
            <Button 
              type="button" 
              onClick={handleHiringAiScrape}
              disabled={isAiLoading || !websiteUrl || !targetRoleInput}
              className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white text-xs font-semibold h-9 shadow-sm transition-all duration-200"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Scraping Company Website...
                </>
              ) : aiSuccess ? (
                'Company Context & Role Configurations Loaded'
              ) : (
                'Run Smart AI Extraction Pipeline'
              )}
            </Button>
          </div>
        </div>
      )}

      <Card className="shadow-xl border-gray-200 dark:border-gray-600 transition-all duration-300 bg-white dark:bg-gray-900 overflow-hidden">
        {/* Scrollable content wrapper */}
        <div className="max-h-[70vh] overflow-y-auto">
        {/* STEP 1: DYNAMIC CONFIGURATION FIELDS */}
        {step === 1 && (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="size-5 text-gray-900 dark:text-white" />
                <CardTitle className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">Step 1: Role Profiles</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Verify your baseline organizational structure coordinates below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="job-title" className="text-xs sm:text-sm font-medium text-gray-700">Job Title</Label>
                  <Input 
                    id="job-title" 
                    value={jobTitle || targetRoleInput}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Salon Manager" 
                    className={`h-9 text-sm transition-all bg-white text-gray-900 border-gray-300 placeholder:text-gray-400 ${aiSuccess ? 'border-[#FF8C00] bg-orange-50' : ''}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="department" className="text-xs sm:text-sm font-medium text-gray-700">Department</Label>
                  <Input 
                    id="department" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g., Sales, Dev" 
                    className={`h-9 text-sm transition-all bg-white text-gray-900 border-gray-300 placeholder:text-gray-400 ${aiSuccess ? 'border-[#FF8C00] bg-orange-50' : ''}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="location" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 size-4 text-gray-500 dark:text-gray-400" />
                    <Input 
                      id="location" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Atlanta, GA" 
                      className={`pl-9 h-9 text-sm transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${aiSuccess ? 'border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''}`}
                    />
                  </div>
                </div>
                <div className="col-span-1 space-y-1">
                  <Label htmlFor="job-type" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Type</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger id="job-type" className={`h-9 text-sm transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ${aiSuccess ? 'border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                      <SelectItem value="full-time">Full-Time</SelectItem>
                      <SelectItem value="part-time">Part-Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="salary" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Annual Salary ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 size-4 text-gray-500 dark:text-gray-400" />
                  <Input 
                    id="salary" 
                    type="number" 
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g., 55000" 
                    className={`pl-9 h-9 text-sm font-medium transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${aiSuccess ? 'border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''}`}
                  />
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 2: QUALIFICATIONS MATRIX */}
        {step === 2 && (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="size-5 text-gray-900 dark:text-white" />
                <CardTitle className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">Step 2: Qualifications & Scope</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Establish technical execution metrics for headhunters in the Bungee network.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <Label htmlFor="experience-level" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Experience</Label>
                  <Input id="experience-level" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g., 2+ Years" className="h-9 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="skills" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                    Required Skills 
                    {aiSuccess && <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">AI Extracted</span>}
                  </Label>
                  <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Comma-separated skills..." className={`h-9 text-xs transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${aiSuccess ? 'border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''}`} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Role Description</Label>
                <Textarea 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Core daily tasks, metrics expectations, and strategic targets..." 
                  rows={3}
                  className={`transition-all text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${aiSuccess ? 'border-purple-400 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''}`}
                />
              </div>

              {/* SPAM GUARD - Pre-Qualifying Yes/No Questions */}
              <div className="p-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-lg bg-gray-900 dark:bg-gray-700 flex items-center justify-center">
                    <ShieldCheck className="size-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Bungee Spam Guard</h4>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">Yes/No questions to filter unqualified candidates</p>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-2 mb-3">
                  {spamGuardQuestions.map((q, index) => (
                    <div key={q.id} className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                      <div className="flex-1">
                        <Input
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...spamGuardQuestions];
                            updated[index].question = e.target.value;
                            setSpamGuardQuestions(updated);
                          }}
                          placeholder="Enter yes/no question..."
                          className="h-8 text-xs border-0 bg-transparent dark:bg-transparent focus-visible:ring-0 p-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...spamGuardQuestions];
                          updated[index].expectedAnswer = q.expectedAnswer === 'yes' ? 'no' : 'yes';
                          setSpamGuardQuestions(updated);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                          q.expectedAnswer === 'yes' 
                            ? 'bg-green-500/20 text-green-600 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-600 border border-red-500/30'
                        }`}
                      >
                        {q.expectedAnswer === 'yes' ? 'YES' : 'NO'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSpamGuardQuestions(spamGuardQuestions.filter((_, i) => i !== index));
                        }}
                        className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Question Button */}
                <button
                  type="button"
                  onClick={() => {
                    const newId = Math.max(...spamGuardQuestions.map(q => q.id), 0) + 1;
                    setSpamGuardQuestions([...spamGuardQuestions, { id: newId, question: '', expectedAnswer: 'yes' }]);
                  }}
                  className="w-full p-2 rounded-lg border-2 border-dashed border-gray-900/30 text-gray-900 text-xs font-medium hover:bg-gray-900/5 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="size-3" />
                  Add Screening Question
                </button>

                {/* Quick Add Suggestions */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[9px] text-gray-500">Quick add:</span>
                  {[
                    { q: 'Can you pass a background check?', a: 'yes' },
                    { q: 'Are you available to start within 2 weeks?', a: 'yes' },
                    { q: 'Do you have a valid driver\'s license?', a: 'yes' },
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const newId = Math.max(...spamGuardQuestions.map(q => q.id), 0) + 1;
                        setSpamGuardQuestions([...spamGuardQuestions, { id: newId, question: suggestion.q, expectedAnswer: suggestion.a }]);
                      }}
                      className="px-1.5 py-0.5 rounded bg-gray-900/10 border border-gray-900/20 text-[9px] text-gray-900 hover:bg-gray-900/20 transition-colors"
                    >
                      + {suggestion.q.length > 25 ? suggestion.q.substring(0, 25) + '...' : suggestion.q}
                    </button>
                  ))}
                </div>

                {/* Pass Rate Threshold */}
                <div className="mt-3 p-2 rounded-lg bg-white dark:bg-white border border-gray-200 dark:border-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Pass Rate Threshold</p>
                      <p className="text-[9px] text-gray-500">Minimum % of correct answers to qualify</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-gray-900">{passRateThreshold}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={passRateThreshold}
                      onChange={(e) => setPassRateThreshold(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    {[50, 75, 85, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setPassRateThreshold(preset)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          passRateThreshold === preset 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 3: SCREENING & VERIFICATIONS - DESKTOP OPTIMIZED */}
        {step === 3 && (
          <>
            <CardHeader className="pb-3 hidden sm:block">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="size-5 text-gray-900" />
                <CardTitle className="text-base sm:text-xl font-bold text-gray-900">Step 3: Screening & Verifications</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm text-gray-600">Configure candidate screening options and verification requirements.</CardDescription>
            </CardHeader>
            
            {/* Mobile Warning */}
            <div className="sm:hidden p-6 text-center">
              <ShieldCheck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">This section is optimized for desktop.</p>
              <p className="text-xs text-gray-400 mt-1">Access from a larger screen for the full experience.</p>
            </div>
            
            <CardContent className="hidden sm:block space-y-4">
              
              {/* SECTION: Create Job Posting / Self-Hire */}
              <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-white border border-gray-200">
                    <Briefcase className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Create a Job Posting / Self-Hire</h3>
                    <p className="text-xs text-gray-500">Post directly to job boards or process a direct hire without referral</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Create Job Posting
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                    Process Self-Hire
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-medium">Screening Options</span>
                </div>
              </div>

              {/* TOGGLE: 60-Second Video Introduction */}
              <div className={`rounded-xl border transition-all ${requireVideo ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${requireVideo ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <Video className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-900 cursor-pointer">60-Second Video Response</Label>
                      <p className="text-xs text-gray-500">Candidates answer screening questions via recorded mobile video</p>
                    </div>
                  </div>
                  <Switch checked={requireVideo} onCheckedChange={setRequireVideo} className="data-[state=checked]:bg-gray-900" />
                </div>
                {requireVideo && (
                  <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-1 duration-200">
                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">
                      <p className="font-medium text-gray-900 mb-1">Video Requirements:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                        <li>Maximum 60 seconds in length</li>
                        <li>Candidate introduces themselves and answers questions</li>
                        <li>Automatically saved to candidate profile</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* TOGGLE: Screening Questions */}
              <div className={`rounded-xl border transition-all ${screeningQuestionsActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${screeningQuestionsActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-900 cursor-pointer">Screening Questions</Label>
                      <p className="text-xs text-gray-500">Add custom questions for candidates to answer</p>
                    </div>
                  </div>
                  <Switch checked={screeningQuestionsActive} onCheckedChange={setScreeningQuestionsActive} className="data-[state=checked]:bg-gray-900" />
                </div>
                {screeningQuestionsActive && (
                  <div className="px-4 pb-4 pt-0 space-y-3 animate-in slide-in-from-top-1 duration-200">
                    {/* Question 1 */}
                    <div className="space-y-1.5">
                      <Label htmlFor="q1" className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                        <HelpCircle className="size-3.5 text-gray-900" />
                        Screening Question 1 {aiSuccess && <span className="text-[10px] text-gray-900 font-semibold">(AI Tailored)</span>}
                      </Label>
                      <Input id="q1" value={questionOne} onChange={(e) => setQuestionOne(e.target.value)} placeholder="Type your own question or select a suggestion below..." className="h-9 text-xs bg-white text-gray-900 border-gray-300 placeholder:text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] text-gray-500">Suggestions:</span>
                        {["Why are you interested in this role?", "What relevant experience do you bring?", "Describe your greatest achievement."].map((suggestion, i) => (
                          <button key={i} type="button" onClick={() => setQuestionOne(suggestion)} className="px-2 py-0.5 rounded-full bg-gray-900/10 border border-gray-900/30 text-[10px] text-gray-900 hover:bg-gray-900/20 transition-colors">
                            {suggestion.length > 25 ? suggestion.substring(0, 25) + '...' : suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Question 2 */}
                    <div className="space-y-1.5">
                      <Label htmlFor="q2" className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                        <HelpCircle className="size-3.5 text-gray-900" />
                        Screening Question 2 {aiSuccess && <span className="text-[10px] text-gray-900 font-semibold">(AI Tailored)</span>}
                      </Label>
                      <Input id="q2" value={questionTwo} onChange={(e) => setQuestionTwo(e.target.value)} placeholder="Type your own question or select a suggestion below..." className="h-9 text-xs bg-white text-gray-900 border-gray-300 placeholder:text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] text-gray-500">Suggestions:</span>
                        {["How do you handle tight deadlines?", "Describe a challenge you overcame.", "What are your salary expectations?"].map((suggestion, i) => (
                          <button key={i} type="button" onClick={() => setQuestionTwo(suggestion)} className="px-2 py-0.5 rounded-full bg-gray-900/10 border border-gray-900/30 text-[10px] text-gray-900 hover:bg-gray-900/20 transition-colors">
                            {suggestion.length > 25 ? suggestion.substring(0, 25) + '...' : suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-medium">Verification Options</span>
                </div>
              </div>

              {/* TOGGLE: Background Check */}
              <div className={`rounded-xl border transition-all ${bgCheckActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${bgCheckActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-900 cursor-pointer">Background Check</Label>
                      <p className="text-xs text-gray-500">Comprehensive criminal background screening</p>
                    </div>
                  </div>
                  <Switch checked={bgCheckActive} onCheckedChange={setBgCheckActive} className="data-[state=checked]:bg-gray-900" />
                </div>
                {bgCheckActive && (
                  <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-1 duration-200">
                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">
                      <p className="font-medium text-gray-900 mb-1">Includes:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                        <li>Global watchdog catalogs</li>
                        <li>National database search</li>
                        <li>County records validation</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* TOGGLE: Drug Screen */}
              <div className={`rounded-xl border transition-all ${drugTestActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${drugTestActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-900 cursor-pointer">Drug Screen</Label>
                      <p className="text-xs text-gray-500">Automated 10-panel drug screen testing</p>
                    </div>
                  </div>
                  <Switch checked={drugTestActive} onCheckedChange={setDrugTestActive} className="data-[state=checked]:bg-gray-900" />
                </div>
                {drugTestActive && (
                  <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-1 duration-200">
                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">
                      <p className="font-medium text-gray-900 mb-1">Process:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                        <li>Automated voucher link issued</li>
                        <li>Maps candidate to nearest lab station</li>
                        <li>Results delivered within 24-48 hours</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* TOGGLE: PI Survey - Premium */}
              <div className={`relative rounded-xl border-2 transition-all ${psychEvalActive ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50' : 'border-gray-200 bg-white hover:border-indigo-200'}`}>
                <div className="absolute -top-2.5 left-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                    <Brain className="size-3" />
                    PREMIUM ADD-ON
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 pt-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${psychEvalActive ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-bold text-gray-900 cursor-pointer">PI Survey Behavioral Assessment</Label>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">+$49/candidate</span>
                      </div>
                      <p className="text-xs text-gray-500">Powered by <span className="font-semibold text-indigo-600">pisurvey potentially</span></p>
                    </div>
                  </div>
                  <Switch checked={psychEvalActive} onCheckedChange={setPsychEvalActive} className="data-[state=checked]:bg-indigo-600" />
                </div>
                {psychEvalActive && (
                  <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-1 duration-200">
                    <div className="p-3 bg-white rounded-lg border border-indigo-200 text-xs">
                      <p className="font-medium text-gray-900 mb-2">Assessment Includes:</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <CheckCircle2 className="size-3.5 text-indigo-500" />
                          <span>Cognitive Testing</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <CheckCircle2 className="size-3.5 text-indigo-500" />
                          <span>Behavioral Profile</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <CheckCircle2 className="size-3.5 text-indigo-500" />
                          <span>Job-Fit Score</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Options Summary */}
              {(bgCheckActive || drugTestActive || psychEvalActive || requireVideo || screeningQuestionsActive) && (
                <div className="p-3 text-center text-xs text-amber-600 font-medium bg-amber-50 rounded-lg border border-amber-200/50 animate-in fade-in zoom-in-95 duration-200">
                  Active: {[requireVideo && 'Video Response', screeningQuestionsActive && 'Screening Questions', bgCheckActive && 'Background Check', drugTestActive && 'Drug Screen', psychEvalActive && 'PI Survey'].filter(Boolean).join(', ')}
                </div>
              )}
            </CardContent>
          </>
        )}

        {/* STEP 4: EQUIP YOUR BUNGEES */}
        {step === 4 && (
          <>
            <CardHeader className="pb-2 pt-2 sm:pt-4 px-2 sm:px-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Megaphone className="size-4 sm:size-5 text-gray-900" />
                <CardTitle className="text-base sm:text-xl font-bold text-gray-900">Step 4: Equip Your Bungees</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm text-gray-600">Arm your network with promotional tools to refer candidates for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-2 sm:px-6 pb-2 sm:pb-4">
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm text-gray-700">Primary Promotional Tool</Label>
                <Select value={promotionalTool} onValueChange={setPromotionalTool}>
                  <SelectTrigger className="bg-white dark:bg-white border-gray-200 dark:border-gray-300 text-gray-900 dark:text-gray-900 h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Select a promotional asset" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-white border-gray-200 dark:border-gray-300">
                    <SelectItem value="referral-link" className="text-gray-900">Referral Link / Share Card</SelectItem>
                    <SelectItem value="job-flyer" className="text-gray-900">PDF Job Flyer / One-Pager</SelectItem>
                    <SelectItem value="video-intro" className="text-gray-900">Video Intro / Company Culture</SelectItem>
                    <SelectItem value="social-post" className="text-gray-900">Social Media Post Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm text-gray-700 flex items-center gap-1">
                  <Sparkles className="size-3 sm:size-4 text-gray-900" />
                  Elevator Pitch / Why Join Us
                </Label>
                <Textarea 
                  placeholder="What makes this opportunity special? Why should candidates apply?" 
                  value={elevatorPitch}
                  onChange={(e) => setElevatorPitch(e.target.value)}
                  className="bg-white dark:bg-white border-gray-200 dark:border-gray-300 text-gray-900 dark:text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm min-h-[70px] sm:min-h-[90px] resize-none" 
                />
              </div>
              
              {/* AI PDF One-Pager Generator */}
              <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#FF8C00]/10">
                      <FileText className="size-4 sm:size-5 text-[#FF8C00]" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-gray-900">AI Job Flyer Generator</span>
                  </div>
                  {aiGeneratedOnePager && (
                    <span className="text-xs sm:text-sm text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="size-3.5 sm:size-4" /> Ready
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">Let AI create a professional job flyer for your Bungees to share with potential candidates.</p>
                
                <Button 
                  onClick={handleGenerateOnePager}
                  disabled={isGeneratingPdf}
                  className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white h-10 sm:h-11 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="size-4 sm:size-5 animate-spin mr-2" />
                      Generating Flyer...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 sm:size-5 mr-2" />
                      Generate Job Flyer
                    </>
                  )}
                </Button>
                
                {/* Generated Content Preview */}
                {aiGeneratedOnePager && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-white rounded-xl p-3 sm:p-4 max-h-48 sm:max-h-56 overflow-y-auto border border-gray-200 shadow-inner">
                      <pre className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{aiGeneratedOnePager}</pre>
                    </div>
                    
                    {/* Action Buttons - Clear and accessible */}
                    <div className="flex gap-2 pt-1">
                      <Button 
                        variant="outline" 
                        size="default" 
                        className="flex-1 h-10 text-sm font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all"
                        onClick={() => navigator.clipboard.writeText(aiGeneratedOnePager)}
                      >
                        <Copy className="size-4 mr-2" />
                        Copy Text
                      </Button>
                      <Button 
                        size="default" 
                        className="flex-1 h-10 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white shadow-md transition-all"
                      >
                        <Download className="size-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 5: CHECKOUT PLACEMENT BOUNTY */}
        {step === 5 && (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Award className="size-5 text-gray-900" />
                <CardTitle className="text-base sm:text-xl font-bold text-gray-900">Step 5: Establish Placement Bounty</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm text-gray-600">Set your bounty referral fee. High rewards turn the entire local network into active headhunters for your team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="hire-bounty" className="text-xs sm:text-sm font-medium text-gray-700">Successful Hiring Placement Reward</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 size-5 text-gray-900" />
                  <Input 
                    id="hire-bounty" 
                    type="number" 
                    value={bountyAmount}
                    onChange={(e) => setBountyAmount(e.target.value)}
                    placeholder="1500.00" 
                    className="pl-10 h-12 text-xl font-bold border-gray-900/30 focus-visible:ring-gray-900 bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder:text-gray-400" 
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 block">
                  This placement fee is held securely in escrow and disbursed only when your verification checks confirm a recommended user completes orientation benchmarks.
                </span>
              </div>
              
              {/* Bounty recommendation */}
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-100 border border-gray-200 dark:border-gray-300">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold text-gray-900">Tip:</span> Jobs with bounties of $2,000+ receive 3x more qualified referrals from the Bungee network.
                </p>
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 6: HR PIPELINE BROADCAST ECOSYSTEM */}
        {step === 6 && (
          <>
            <CardHeader className="text-center space-y-2 pt-6">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">Job Order Launched!</CardTitle>
              <CardDescription className="max-w-md mx-auto text-xs sm:text-sm">
                Your bounty is live. Now blast it to your network to maximize referrals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {/* Primary CTA - Blast to Network */}
              <Button 
                onClick={() => setShowDistributionHub(true)}
                className="w-full h-14 bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold text-base gap-2 shadow-lg"
              >
                <Share2 className="size-5" />
                Blast to Your Network
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">or connect integrations</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button className="h-14 flex items-center justify-start space-x-3 px-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                  <Database className="size-5 text-slate-700" />
                  <div className="text-left">
                    <span className="block text-sm font-medium text-[#0f172a]">Sync Corporate ATS</span>
                    <span className="block text-[10px] text-slate-500">Greenhouse, Lever, Workday</span>
                  </div>
                </button>
                <button 
                  onClick={handleImportContactMatrix}
                  className="h-14 flex items-center justify-start space-x-3 px-4 rounded-lg bg-white border border-slate-200 hover:border-[#FF8C00] hover:bg-orange-50 transition-all cursor-pointer"
                >
                  <Users className="size-5 text-slate-700" />
                  <div className="text-left">
                    <span className="block text-sm font-medium text-[#0f172a]">Import Contact Matrix</span>
                    <span className="block text-[10px] text-slate-500">Share via contacts, SMS, email</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </>
        )}

        {/* Distribution Hub Modal */}
        <BungeeDistributionHub 
          isOpen={showDistributionHub}
          onClose={() => setShowDistributionHub(false)}
          campaignMeta={{
            companyWebsite: websiteUrl || 'www.company.com',
            assetAttachmentName: aiGeneratedOnePager ? 'job_flyer.pdf' : 'bungee_packet.pdf',
            referralLink: `https://justbungee.com/ref/${jobTitle?.toLowerCase().replace(/\s+/g, '-') || 'job'}`,
            bountyReward: bountyAmount || '1,500',
            jobTitle: jobTitle || 'Open Position',
            businessEmail: 'hr@company.com'
          }}
        />

        </div>
        {/* End scrollable content wrapper */}
        
        {/* NAVIGATIONAL CONTROL FOOTER CONTROLS - Fixed at bottom */}
        <CardFooter className="border-t border-gray-100 bg-white dark:bg-gray-900 pt-4 pb-4 flex items-center justify-between sticky bottom-0 z-10">
          {step <= 5 ? (
            <>
              <Button variant="ghost" onClick={step === 1 ? onClose : prevStep} className="text-sm font-medium text-gray-600 gap-1">
                <ChevronLeft className="size-4" />
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>
              <Button 
                onClick={nextStep} 
                className="text-sm font-semibold px-6 bg-[#FF8C00] hover:bg-[#E67E00] text-white shadow-lg h-10 gap-1.5 transition-all"
              >
                {step === 5 ? 'Launch Job Order' : 'Next Step'}
                <ChevronRight className="size-4" />
              </Button>
            </>
          ) : (
            <Button 
              className="w-full h-11 text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-colors" 
              onClick={handleComplete}
            >
              Go to Dashboard View
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
