"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { User, Video, Calendar, ShieldCheck, Award, CheckCircle2, Phone, Users, VideoIcon, MapPin, Eye, FileText, Check, AlertCircle, X, ChevronLeft, ChevronRight, Brain, MessageSquare, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { VoiceTextarea as Textarea } from '@/components/voice-textarea';

interface CandidateManagementWizardProps {
  onClose?: () => void;
  candidateName?: string;
  jobTitle?: string;
  referredBy?: string;
  bountyAmount?: string;
}

export default function CandidateManagementWizard({ 
  onClose, 
  candidateName = "John Doe",
  jobTitle = "Senior Full-Stack Engineer",
  referredBy = "Alex Smith (Bungee User)",
  bountyAmount = "$2,500.00"
}: CandidateManagementWizardProps) {
  const [step, setStep] = useState(1);
  const [interviewType, setInterviewType] = useState('zoom');
  const [bgCheckActive, setBgCheckActive] = useState(false);
  const [drugTestActive, setDrugTestActive] = useState(false);
  const [psychEvalActive, setPsychEvalActive] = useState(false);
  const [videoIntroActive, setVideoIntroActive] = useState(false);
  const [screeningQuestionsActive, setScreeningQuestionsActive] = useState(false);
  const [screeningQuestions, setScreeningQuestions] = useState(['', '', '']);
  const [hiringDecision, setHiringDecision] = useState('');

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Get initials from candidate name
  const initials = candidateName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="w-full max-w-2xl mx-auto p-4 relative">
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-white hover:bg-red-500 hover:text-white transition-colors z-10 border border-gray-200 shadow-md"
        >
          <X className="size-4" />
        </button>
      )}

      {/* CANDIDATE HEADER CAPSULE */}
      <div className="mb-5 p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-900/10 flex items-center justify-center text-gray-900 font-bold">
            {initials}
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-gray-900">{candidateName}</h3>
            <p className="text-xs text-gray-600">Applicant for: <span className="font-medium text-gray-900">{jobTitle}</span></p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-gray-900/10 text-gray-900 border-none font-semibold text-xs">
          Referred by: {referredBy}
        </Badge>
      </div>

      {/* PROGRESS TRACKER BAR */}
      <div className="mb-6 sm:mb-8">
        {/* Step Counter Header */}
        <div className="text-center mb-4">
          <span className="text-xs sm:text-sm font-medium text-gray-500">Step {step} of 4</span>
        </div>
        
        <div className="flex items-start justify-between px-2 sm:px-6">
          {[1, 2, 3, 4].map((num, idx) => {
            const labels = ['Screening', 'Interview', 'Verifications', 'Decision'];
            return (
              <div key={num} className="flex flex-col items-center flex-1 last:flex-none relative">
                <div className="flex items-center w-full">
                  {/* Step Circle */}
                  <div className={`relative flex items-center justify-center size-10 sm:size-14 rounded-full border-3 sm:border-4 text-base sm:text-xl font-black z-10 transition-all duration-300 ${
                    step === num 
                      ? 'bg-gradient-to-br from-fuchsia-400 via-fuchsia-500 to-purple-600 text-white border-white ring-4 ring-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.5)] scale-110 animate-pulse' 
                      : step > num 
                      ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white border-fuchsia-300 shadow-lg'
                      : 'bg-gray-100 text-gray-400 border-gray-200 shadow-inner'
                  }`}>
                    {step > num ? (
                      <Check className="size-5 sm:size-7 stroke-[3]" />
                    ) : (
                      <span className="drop-shadow-sm">{num}</span>
                    )}
                    {/* Active Indicator Dot */}
                    {step === num && (
                      <span className="absolute -top-1 -right-1 size-3 sm:size-4 bg-white rounded-full border-2 border-fuchsia-500 shadow-md" />
                    )}
                  </div>
                  
                  {/* Connecting Line */}
                  {idx < 3 && (
                    <div className="flex-1 h-1.5 sm:h-2 mx-2 sm:mx-3 rounded-full overflow-hidden bg-gray-200 shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-700 ease-out ${
                        step > num ? 'w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-400' : 'w-0'
                      }`} />
                    </div>
                  )}
                </div>
                
                {/* Step Label */}
                <span className={`text-[10px] sm:text-sm font-bold mt-2 sm:mt-3 transition-all ${
                  step === num 
                    ? 'text-fuchsia-600 scale-105' 
                    : step > num 
                    ? 'text-fuchsia-500' 
                    : 'text-gray-400'
                }`}>
                  {labels[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="shadow-xl border-gray-200 bg-white transition-all duration-300">
        {/* STEP 1: AI VETTING & SUBMITTED VIDEO ANSWER */}
        {step === 1 && (
          <>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-gray-900" />
                <CardTitle className="text-xl font-bold tracking-tight text-gray-900">Step 1: Screening & Video Submission</CardTitle>
              </div>
              <CardDescription className="text-gray-600">Review the initial tracking profile and automated video responses provided by the candidate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* RESUME LINK MATRICES */}
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div className="text-left">
                    <span className="block text-xs font-semibold text-gray-900">{candidateName.toLowerCase().replace(' ', '_')}_resume.pdf</span>
                    <span className="block text-[10px] text-gray-500">AI Match Score: 94%</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1 border-gray-900/50 text-gray-900 hover:bg-gray-900/10">
                  <Eye className="h-3.5 w-3.5" /> View Resume
                </Button>
              </div>

              {/* VIDEO RESPONSE SIMULATOR BOX */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted Screening Video (Optional Tag Check)</Label>
                <div className="aspect-video w-full rounded-xl bg-gray-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group border border-gray-700 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80 z-0" />
                  <VideoIcon className="h-10 w-10 text-white/40 mb-2 z-10 group-hover:scale-110 transition-transform cursor-pointer" />
                  <p className="text-xs text-white/90 font-medium z-10 max-w-sm px-4">
                    "Prompt Response: Walk us through a complex state-management issue you solved..."
                  </p>
                  <span className="absolute bottom-3 left-3 text-[10px] text-white/60 font-mono z-10 bg-black/40 px-2 py-0.5 rounded">
                    Duration: 0:58s
                  </span>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* STEP 2: INTERVIEW COORDINATOR MATRIX */}
        {step === 2 && (
          <>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-900" />
                <CardTitle className="text-xl font-bold tracking-tight text-gray-900">Step 2: Coordinate Interview</CardTitle>
              </div>
              <CardDescription className="text-gray-600">Select your channel medium to invite {candidateName} to an active interview meeting calendar link.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={interviewType} onValueChange={setInterviewType} className="grid grid-cols-2 gap-3">
                <div>
                  <RadioGroupItem value="phone" id="phone" className="peer sr-only" />
                  <Label htmlFor="phone" className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-gray-900 peer-data-[state=checked]:bg-gray-900/5 [&:has([data-state=checked])]:border-gray-900 cursor-pointer transition-all">
                    <Phone className="h-5 w-5 mb-2 text-blue-500" />
                    <span className="text-sm font-semibold text-gray-900">Phone Interview</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="zoom" id="zoom" className="peer sr-only" />
                  <Label htmlFor="zoom" className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-gray-900 peer-data-[state=checked]:bg-gray-900/5 [&:has([data-state=checked])]:border-gray-900 cursor-pointer transition-all">
                    <VideoIcon className="h-5 w-5 mb-2 text-[#2D8CFF]" />
                    <span className="text-sm font-semibold text-gray-900">Zoom Meeting</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="teams" id="teams" className="peer sr-only" />
                  <Label htmlFor="teams" className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-gray-900 peer-data-[state=checked]:bg-gray-900/5 [&:has([data-state=checked])]:border-gray-900 cursor-pointer transition-all">
                    <Users className="h-5 w-5 mb-2 text-indigo-500" />
                    <span className="text-sm font-semibold text-gray-900">MS Teams Link</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="onsite" id="onsite" className="peer sr-only" />
                  <Label htmlFor="onsite" className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-gray-900 peer-data-[state=checked]:bg-gray-900/5 [&:has([data-state=checked])]:border-gray-900 cursor-pointer transition-all">
                    <MapPin className="h-5 w-5 mb-2 text-green-500" />
                    <span className="text-sm font-semibold text-gray-900">Face-to-Face Meeting</span>
                  </Label>
                </div>
              </RadioGroup>

              <Button className="w-full h-10 mt-2 bg-gray-900 hover:bg-gray-800 text-white font-medium">
                Send Live Smart-Schedule Invitation
              </Button>
            </CardContent>
          </>
        )}

        {/* STEP 3: CANDIDATE SCREENING & VERIFICATIONS - DESKTOP ONLY */}
        {step === 3 && (
          <>
            <CardHeader className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-gray-900" />
                <CardTitle className="text-xl font-bold tracking-tight text-gray-900">Step 3: Screening & Verifications</CardTitle>
              </div>
              <CardDescription className="text-gray-600">Configure candidate screening options and verification requirements.</CardDescription>
            </CardHeader>
            
            {/* Mobile Warning */}
            <div className="sm:hidden p-6 text-center">
              <ShieldCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">This section is optimized for desktop viewing.</p>
              <p className="text-xs text-gray-400 mt-1">Please access from a larger screen for the full experience.</p>
            </div>
            
            <CardContent className="hidden sm:block space-y-6">
              
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
                  <Button variant="outline" size="sm" className="text-xs">
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Create Job Posting
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <User className="h-3.5 w-3.5 mr-1.5" />
                    Process Self-Hire
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-medium">Screening Options</span>
                </div>
              </div>

              {/* TOGGLE: 60-Second Video Introduction */}
              <div className={`rounded-xl border transition-all ${videoIntroActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${videoIntroActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <Video className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-900">60-Second Video Introduction</Label>
                      <p className="text-xs text-gray-500">Require candidates to submit a brief video pitch</p>
                    </div>
                  </div>
                  <Switch checked={videoIntroActive} onCheckedChange={setVideoIntroActive} className="data-[state=checked]:bg-gray-900" />
                </div>
                {videoIntroActive && (
                  <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-1 duration-200">
                    <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">
                      <p className="font-medium text-gray-900 mb-1">Video Requirements:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                        <li>Maximum 60 seconds in length</li>
                        <li>Candidate introduces themselves and explains interest</li>
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
                    <div className={`p-2 rounded-lg ${screeningQuestionsActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-900">Screening Questions</Label>
                      <p className="text-xs text-gray-500">Add custom questions for candidates to answer</p>
                    </div>
                  </div>
                  <Switch checked={screeningQuestionsActive} onCheckedChange={setScreeningQuestionsActive} className="data-[state=checked]:bg-gray-900" />
                </div>
                {screeningQuestionsActive && (
                  <div className="px-4 pb-4 pt-0 space-y-3 animate-in slide-in-from-top-1 duration-200">
                    {screeningQuestions.map((q, idx) => (
                      <div key={idx} className="space-y-1">
                        <Label className="text-xs text-gray-500">Question {idx + 1}</Label>
                        <Textarea 
                          placeholder={`Enter screening question ${idx + 1}...`}
                          value={q}
                          onChange={(e) => {
                            const newQuestions = [...screeningQuestions];
                            newQuestions[idx] = e.target.value;
                            setScreeningQuestions(newQuestions);
                          }}
                          className="text-sm min-h-[60px] resize-none"
                        />
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs w-full"
                      onClick={() => setScreeningQuestions([...screeningQuestions, ''])}
                    >
                      + Add Another Question
                    </Button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative">
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
                    <div className={`p-2 rounded-lg ${bgCheckActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-900">Background Check</Label>
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
                    <div className={`p-2 rounded-lg ${drugTestActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-900">Drug Screen</Label>
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
                    <div className={`p-2 rounded-lg ${psychEvalActive ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-bold text-gray-900">PI Survey Behavioral Assessment</Label>
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

              {/* Active Options Warning */}
              {(bgCheckActive || drugTestActive || psychEvalActive || videoIntroActive || screeningQuestionsActive) && (
                <div className="p-3 text-center text-xs text-amber-600 font-medium bg-amber-50 rounded-lg border border-amber-200/50 animate-in fade-in zoom-in-95 duration-200">
                  {[bgCheckActive && 'Background Check', drugTestActive && 'Drug Screen', psychEvalActive && 'PI Survey', videoIntroActive && 'Video Intro', screeningQuestionsActive && 'Screening Questions'].filter(Boolean).join(', ')} enabled. These will be applied when you proceed.
                </div>
              )}
            </CardContent>
          </>
        )}

        {/* STEP 4: HR HIRING STATUS SCORECARD ACCELERATION */}
        {step === 4 && (
          <>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-gray-900" />
                <CardTitle className="text-xl font-bold tracking-tight text-gray-900">Step 4: Ultimate Placement Decision</CardTitle>
              </div>
              <CardDescription className="text-gray-600">Conclude vetting operations. Moving to hire locks deployment assets and disburses fees.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <RadioGroup value={hiringDecision} onValueChange={setHiringDecision} className="space-y-2.5">
                <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${hiringDecision === 'hire' ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="hire" id="decision-hire" className="text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                    <Label htmlFor="decision-hire" className="cursor-pointer text-sm font-bold text-emerald-600">Approve Hire & Disburse Bounty</Label>
                  </div>
                </div>

                <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${hiringDecision === 'pass' ? 'border-destructive bg-destructive/5' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="pass" id="decision-pass" className="text-destructive border-gray-300 focus:ring-destructive" />
                    <Label htmlFor="decision-pass" className="cursor-pointer text-sm font-bold text-destructive">Archive Candidate / Pass</Label>
                  </div>
                </div>
              </RadioGroup>
              
              {hiringDecision === 'hire' && (
                <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 space-y-2 text-xs text-gray-900 animate-in slide-in-from-top-1 duration-200">
                  <p className="font-semibold flex items-center gap-1.5 text-emerald-600">
                    <Check className="h-4 w-4" /> Automated Action Sequence Ready:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-gray-600">
                    <li>Auto-generates digital onboarding credential packet</li>
                    <li>Triggers direct contract release token parameters</li>
                    <li><strong>Disburses {bountyAmount} Bounty Payout</strong> to {referredBy.split(' (')[0]}&apos;s dashboard profile</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </>
        )}

        {/* WIZARD ACTION PANEL REACTION BUTTONS */}
        <CardFooter className="border-t border-gray-200 pt-4 flex items-center justify-between">
          <Button variant="ghost" onClick={step === 1 ? onClose : prevStep} className="text-sm font-medium text-gray-700 gap-1">
            <ChevronLeft className="size-4" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {step < 4 ? (
            <Button 
              onClick={nextStep} 
              className="text-sm font-semibold px-6 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white shadow-lg h-10 gap-1.5 transition-all"
            >
              Next Step
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button 
              disabled={!hiringDecision}
              className={`text-sm font-semibold px-6 text-white transition-all ${hiringDecision === 'hire' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-destructive hover:bg-destructive/90'}`}
              onClick={() => {
                alert('Candidate Record Finalized in Bungee Ecosystem.');
                onClose?.();
              }}
            >
              {hiringDecision === 'hire' ? 'Execute Onboarding & Bounty' : 'Finalize Archive Log'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
