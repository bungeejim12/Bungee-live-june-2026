"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ShieldAlert, Trash2, Plus, HelpCircle, CheckCircle2, Settings, ListChecks, Sparkles, Video, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface ScreeningQuestion {
  id: string;
  questionText: string;
  expectedAnswer: 'yes' | 'no' | 'a' | 'b' | 'c';
  options?: string[];
}

interface BungeeSpamGuardWizardProps {
  onClose?: () => void;
}

export default function BungeeSpamGuardWizard({ onClose }: BungeeSpamGuardWizardProps) {
  const [step, setStep] = useState(1);
  const [passingThreshold, setPassingThreshold] = useState([75]);
  const [questionText, setQuestionText] = useState('');
  const [answerType, setAnswerType] = useState('yes-no');
  const [expectedAns, setExpectedAns] = useState('yes');
  const [enableVideo, setEnableVideo] = useState(false);
  const [videoQuestion, setVideoQuestion] = useState('');
  
  const [screeningList, setScreeningList] = useState<ScreeningQuestion[]>([
    {
      id: '1',
      questionText: 'Do you have a reliable vehicle and a clean driving record?',
      expectedAnswer: 'yes'
    },
    {
      id: '2',
      questionText: 'Are you available to work weekend morning shifts?',
      expectedAnswer: 'yes'
    }
  ]);

  const handleAddQuestion = () => {
    if (!questionText.trim()) return;
    
    const newQuestion: ScreeningQuestion = {
      id: Date.now().toString(),
      questionText: questionText,
      expectedAnswer: expectedAns as any
    };

    setScreeningList([...screeningList, newQuestion]);
    setQuestionText('');
  };

  const handleDeleteQuestion = (id: string) => {
    setScreeningList(screeningList.filter(q => q.id !== id));
  };

  const suggestedQuestions = [
    "Do you have at least 2 years of experience in this field?",
    "Are you legally authorized to work in the United States?",
    "Can you pass a background check?",
    "Are you able to start within 2 weeks?",
    "Do you have reliable transportation?"
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto border-[#FF8C00]/30 bg-white shadow-xl relative">
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition-colors z-10"
        >
          <X className="size-4" />
        </button>
      )}

      <CardHeader className="pb-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#FF8C00] flex items-center justify-center">
            <ShieldAlert className="size-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900">Bungee Spam Guard</CardTitle>
            <CardDescription className="text-sm text-gray-600">Pre-screen candidates with qualifying questions</CardDescription>
          </div>
        </div>
        
        {/* Step Indicators */}
        <div className="mt-6">
          {/* Step Counter Header */}
          <div className="text-center mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-500">Step {step} of 4</span>
          </div>
          
          <div className="flex items-start justify-between px-2 sm:px-4">
            {[
              { num: 1, label: 'Questions', icon: ListChecks },
              { num: 2, label: 'Pass Rate', icon: Settings },
              { num: 3, label: 'Video (Optional)', icon: Video },
              { num: 4, label: 'Review', icon: CheckCircle2 }
            ].map((s, idx) => (
              <div key={s.num} className="flex flex-col items-center flex-1 last:flex-none relative">
                <div className="flex items-center w-full">
                  {/* Step Circle */}
                  <div className={`relative flex items-center justify-center size-10 sm:size-14 rounded-full border-3 sm:border-4 text-base sm:text-xl font-black transition-all duration-300 ${
                    step === s.num 
                      ? 'bg-gradient-to-br from-orange-400 via-[#FF8C00] to-orange-600 text-white border-white ring-4 ring-[#FF8C00] shadow-[0_0_20px_rgba(255,140,0,0.5)] scale-110 animate-pulse' 
                      : step > s.num 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-300 shadow-lg' 
                        : 'bg-gray-100 text-gray-400 border-gray-200 shadow-inner'
                  }`}>
                    {step > s.num ? (
                      <CheckCircle2 className="size-5 sm:size-7 stroke-[3]" />
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
                    <div className="flex-1 h-1.5 sm:h-2 mx-2 sm:mx-3 rounded-full overflow-hidden bg-gray-200 shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-700 ease-out ${
                        step > s.num ? 'w-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-400' : 'w-0'
                      }`} />
                    </div>
                  )}
                </div>
                
                {/* Step Label */}
                <span className={`text-[10px] sm:text-sm font-bold mt-2 sm:mt-3 transition-all ${
                  step === s.num 
                    ? 'text-[#FF8C00] scale-105' 
                    : step > s.num 
                    ? 'text-green-500' 
                    : 'text-gray-400'
                }`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Step 1: Screening Questions */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#FF8C00]/10 border border-[#FF8C00]/30">
              <p className="text-xs text-gray-700">
                <strong className="text-[#FF8C00]">How it works:</strong> Create yes/no questions and set the expected correct answer. 
                Candidates who don&apos;t meet your passing threshold will be automatically filtered out.
              </p>
            </div>

            {/* Current Questions */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <ListChecks className="size-4 text-[#FF8C00]" />
                Your Screening Questions ({screeningList.length})
              </Label>
              
              {screeningList.length === 0 ? (
                <div className="p-4 rounded-lg border border-dashed border-gray-300 text-center">
                  <p className="text-sm text-gray-500">No questions added yet. Add your first question below.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {screeningList.map((q, idx) => (
                    <div key={q.id} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200 group">
                      <span className="size-5 rounded-full bg-[#FF8C00]/20 text-[#FF8C00] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-900">{q.questionText}</p>
                        <Badge className={`mt-1 text-[10px] ${q.expectedAnswer === 'yes' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                          Expected: {q.expectedAnswer.toUpperCase()}
                        </Badge>
                      </div>
                      <button 
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Question */}
            <div className="p-3 rounded-lg border border-gray-200 bg-white space-y-3">
              <Label className="text-xs font-semibold text-gray-700">Add New Question</Label>
              
              <div className="space-y-2">
                <Input 
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Type your screening question..."
                  className="h-9 text-sm"
                />
                
                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] text-gray-500 mr-1">Quick add:</span>
                  {suggestedQuestions.slice(0, 3).map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQuestionText(suggestion)}
                      className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-[10px] text-gray-600 hover:bg-[#FF8C00]/10 hover:border-[#FF8C00]/30 hover:text-[#FF8C00] transition-colors"
                    >
                      {suggestion.length > 35 ? suggestion.substring(0, 35) + '...' : suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label className="text-[10px] text-gray-500 mb-1 block">Expected Answer</Label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setExpectedAns('yes')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        expectedAns === 'yes' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      YES
                    </button>
                    <button
                      onClick={() => setExpectedAns('no')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        expectedAns === 'no' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                      }`}
                    >
                      NO
                    </button>
                  </div>
                </div>
                <Button 
                  onClick={handleAddQuestion}
                  disabled={!questionText.trim()}
                  className="bg-[#FF8C00] hover:bg-orange-600 text-white h-9 px-4"
                >
                  <Plus className="size-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Passing Threshold */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#FF8C00]/10 border border-[#FF8C00]/30">
              <p className="text-xs text-gray-700">
                <strong className="text-[#FF8C00]">Pass Rate:</strong> Set the minimum percentage of correct answers 
                a candidate must achieve to pass screening. Candidates below this threshold will be automatically filtered out.
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-[#FF8C00]/30 bg-gradient-to-br from-orange-50 via-white to-green-50 shadow-lg">
              <div className="text-center mb-6">
                <div className={`text-6xl font-black drop-shadow-md transition-all duration-300 ${
                  passingThreshold[0] >= 85 ? 'text-green-500 scale-105' : 
                  passingThreshold[0] >= 70 ? 'text-[#FF8C00]' : 
                  passingThreshold[0] >= 50 ? 'text-yellow-500' : 'text-red-500'
                }`}>{passingThreshold[0]}%</div>
                <p className="text-sm font-medium text-gray-600 mt-2">Minimum Pass Rate</p>
                <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold inline-block ${
                  passingThreshold[0] >= 85 ? 'bg-green-100 text-green-700' : 
                  passingThreshold[0] >= 70 ? 'bg-orange-100 text-orange-700' : 
                  passingThreshold[0] >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {passingThreshold[0] >= 85 ? 'Strict' : 
                   passingThreshold[0] >= 70 ? 'Recommended' : 
                   passingThreshold[0] >= 50 ? 'Moderate' : 'Lenient'}
                </div>
              </div>

              <div className="relative my-8 px-2">
                {/* Colorful Full Background Track */}
                <div className="absolute inset-x-2 h-4 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-50% via-[#FF8C00] via-75% to-green-500 shadow-inner" />
                {/* Overlay for unfilled area */}
                <div 
                  className="absolute h-4 top-1/2 -translate-y-1/2 right-2 rounded-r-full bg-gray-200/80 transition-all duration-200"
                  style={{ width: `${100 - passingThreshold[0]}%` }}
                />
                <Slider
                  value={passingThreshold}
                  onValueChange={setPassingThreshold}
                  max={100}
                  min={0}
                  step={5}
                  className="relative z-10 [&_[data-slot=slider-track]]:h-4 [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-range]]:bg-transparent [&_[data-slot=slider-thumb]]:size-8 [&_[data-slot=slider-thumb]]:border-4 [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:shadow-xl [&_[data-slot=slider-thumb]]:bg-gradient-to-br [&_[data-slot=slider-thumb]]:from-[#FF8C00] [&_[data-slot=slider-thumb]]:to-orange-600 [&_[data-slot=slider-thumb]]:ring-2 [&_[data-slot=slider-thumb]]:ring-[#FF8C00]/50"
                />
              </div>

              <div className="flex justify-between text-xs font-bold mt-4">
                <div className="flex flex-col items-start">
                  <span className="text-red-500">0%</span>
                  <span className="text-red-400 text-[10px]">All pass</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-yellow-500">50%</span>
                  <span className="text-yellow-400 text-[10px]">Moderate</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[#FF8C00]">75%</span>
                  <span className="text-orange-400 text-[10px]">Recommended</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-green-500">100%</span>
                  <span className="text-green-400 text-[10px]">Perfect</span>
                </div>
              </div>

              {/* Example Calculation */}
              <div className="mt-6 p-4 rounded-xl bg-white border-2 border-dashed border-[#FF8C00]/30">
                <p className="text-sm text-gray-700">
                  <strong className="text-[#FF8C00]">Example:</strong> With {screeningList.length} questions at {passingThreshold[0]}% threshold, 
                  candidates must answer at least <span className="text-lg font-black text-[#FF8C00]">{Math.ceil(screeningList.length * passingThreshold[0] / 100)}</span> questions correctly.
                </p>
              </div>
            </div>

            {/* Preset Options */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 50, label: 'Lenient', color: 'yellow' },
                { value: 75, label: 'Standard', color: 'orange' },
                { value: 85, label: 'Strict', color: 'green' },
                { value: 100, label: 'Perfect', color: 'emerald' }
              ].map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setPassingThreshold([preset.value])}
                  className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                    passingThreshold[0] === preset.value
                      ? 'border-[#FF8C00] bg-gradient-to-br from-[#FF8C00]/20 to-orange-100 text-[#FF8C00] shadow-lg scale-105'
                      : 'border-gray-200 text-gray-600 hover:border-[#FF8C00]/50 hover:bg-orange-50'
                  }`}
                >
                  <div className="text-lg">{preset.value}%</div>
                  <div className="text-[10px] opacity-70">{preset.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Video Response (Optional) */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <p className="text-xs text-gray-700">
                <strong className="text-purple-600">Round 2 - Video Response:</strong> Optionally require candidates 
                to submit a 60-second video answering a question. This helps you assess communication skills and personality.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Video className="size-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">60-Second Video Response</p>
                    <p className="text-xs text-gray-500">Optional screening step</p>
                  </div>
                </div>
                <Switch
                  checked={enableVideo}
                  onCheckedChange={setEnableVideo}
                />
              </div>

              {enableVideo && (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <Label className="text-xs font-medium text-gray-700">Video Prompt Question</Label>
                  <textarea
                    value={videoQuestion}
                    onChange={(e) => setVideoQuestion(e.target.value)}
                    placeholder="e.g., Tell us about yourself and why you're interested in this role..."
                    className="w-full h-20 px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] text-gray-500">Suggestions:</span>
                    {[
                      "Tell us about yourself and why you want this role.",
                      "Describe your greatest professional achievement.",
                      "How do you handle challenging situations at work?"
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setVideoQuestion(suggestion)}
                        className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-[10px] text-purple-600 hover:bg-purple-100 transition-colors"
                      >
                        {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!enableVideo && (
              <div className="p-4 rounded-lg border border-dashed border-gray-300 text-center">
                <Video className="size-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Video response is disabled</p>
                <p className="text-xs text-gray-400">Toggle the switch above to enable</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-xs text-gray-700">
                <strong className="text-green-600">Review your settings:</strong> Make sure everything looks correct before saving your Spam Guard configuration.
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-3">
              {/* Questions Summary */}
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700">Screening Questions</span>
                  <Badge className="bg-[#FF8C00]/10 text-[#FF8C00] border-[#FF8C00]/30">{screeningList.length} questions</Badge>
                </div>
                <div className="space-y-1">
                  {screeningList.map((q, idx) => (
                    <div key={q.id} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="text-[#FF8C00] font-semibold">{idx + 1}.</span>
                      <span className="truncate flex-1">{q.questionText}</span>
                      <Badge className={`text-[9px] ${q.expectedAnswer === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {q.expectedAnswer.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pass Rate Summary */}
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Pass Rate Threshold</span>
                  <span className="text-lg font-bold text-[#FF8C00]">{passingThreshold[0]}%</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Candidates must answer {Math.ceil(screeningList.length * passingThreshold[0] / 100)} of {screeningList.length} questions correctly
                </p>
              </div>

              {/* Video Summary */}
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">Video Response (Round 2)</span>
                  <Badge className={enableVideo ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-500'}>
                    {enableVideo ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                {enableVideo && videoQuestion && (
                  <p className="text-[10px] text-gray-600 mt-1">&quot;{videoQuestion}&quot;</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-gray-100 pt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={() => step > 1 ? setStep(step - 1) : onClose?.()}
          className="gap-1"
        >
          <ChevronLeft className="size-4" />
          {step > 1 ? 'Back' : 'Cancel'}
        </Button>
        
        {step < 4 ? (
          <Button
            onClick={() => setStep(step + 1)}
            className="h-10 text-sm font-semibold bg-gradient-to-r from-[#FF8C00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg gap-1.5 px-5"
          >
            Next Step
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              // Save configuration
              onClose?.();
            }}
            className="h-10 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg gap-1.5 px-5"
          >
            <CheckCircle2 className="size-4" />
            Save Spam Guard
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
