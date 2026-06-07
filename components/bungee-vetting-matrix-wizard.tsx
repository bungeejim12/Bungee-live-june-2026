"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Sparkles, Sliders, ShieldCheck, CheckCircle2, HelpCircle, Plus, Trash2, Video, ArrowRight, X } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  type: 'boolean' | 'multiple';
  correctAnswer: string;
  options?: string[];
}

interface BungeeVettingMatrixWizardProps {
  onClose?: () => void;
}

export default function BungeeVettingMatrixWizard({ onClose }: BungeeVettingMatrixWizardProps) {
  const [step, setStep] = useState(1);
  const [passScore, setPassScore] = useState([70]);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: 'Do you hold an active, unexpired state Cosmetology License?',
      type: 'boolean',
      correctAnswer: 'Yes'
    },
    {
      id: 2,
      text: 'How many years of commercial salon shift management experience do you possess?',
      type: 'multiple',
      options: ['0-1 Years', '1-2 Years', '2-5 Years', '5+ Years'],
      correctAnswer: '2-5 Years'
    }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<'boolean' | 'multiple'>('boolean');
  const [newOptions, setNewOptions] = useState('');
  const [enableVideo, setEnableVideo] = useState(false);
  const [videoQuestion, setVideoQuestion] = useState('');

  const addQuestion = () => {
    if (!newQuestionText) return;
    const newQ: Question = {
      id: Date.now(),
      text: newQuestionText,
      type: newQuestionType,
      correctAnswer: newQuestionType === 'boolean' ? 'Yes' : '',
      options: newQuestionType === 'multiple' ? newOptions.split(',').map(o => o.trim()).filter(o => o) : undefined
    };
    setQuestions([...questions, newQ]);
    setNewQuestionText('');
    setNewOptions('');
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateCorrectAnswer = (id: number, answer: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, correctAnswer: answer } : q));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const stepLabels = ['Questions', 'Pass Score', 'Video (Optional)', 'Review'];

  return (
    <Card className="w-full max-w-2xl mx-auto border border-[#FF8C00]/30 bg-white shadow-xl">
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#FF8C00] flex items-center justify-center">
              <ShieldCheck className="size-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">Pre-Qualifying Vetting Matrix</CardTitle>
              <CardDescription className="text-xs text-gray-600">Screen candidates before they apply</CardDescription>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="size-5 text-gray-500" />
            </button>
          )}
        </div>
        
        {/* Step Indicator */}
        <div className="mt-6">
          {/* Step Counter Header */}
          <div className="text-center mb-4">
            <span className="text-xs sm:text-sm font-medium text-gray-500">Step {step} of {stepLabels.length}</span>
          </div>
          
          <div className="flex items-start justify-between px-2 sm:px-4">
            {stepLabels.map((label, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 last:flex-none relative">
                <div className="flex items-center w-full">
                  {/* Step Circle */}
                  <div className={`relative flex items-center justify-center size-10 sm:size-14 rounded-full border-3 sm:border-4 text-base sm:text-xl font-black transition-all duration-300 ${
                    step === idx + 1 
                      ? 'bg-gradient-to-br from-orange-400 via-[#FF8C00] to-orange-600 text-white border-white ring-4 ring-[#FF8C00] shadow-[0_0_20px_rgba(255,140,0,0.5)] scale-110 animate-pulse' 
                      : step > idx + 1 
                      ? 'bg-gradient-to-br from-[#FF8C00] to-orange-600 text-white border-orange-300 shadow-lg'
                      : 'bg-gray-100 text-gray-400 border-gray-200 shadow-inner'
                  }`}>
                    {step > idx + 1 ? (
                      <CheckCircle2 className="size-5 sm:size-7 stroke-[3]" />
                    ) : (
                      <span className="drop-shadow-sm">{idx + 1}</span>
                    )}
                    {/* Active Indicator Dot */}
                    {step === idx + 1 && (
                      <span className="absolute -top-1 -right-1 size-3 sm:size-4 bg-white rounded-full border-2 border-[#FF8C00] shadow-md" />
                    )}
                  </div>
                  
                  {/* Connecting Line */}
                  {idx < stepLabels.length - 1 && (
                    <div className="flex-1 h-1.5 sm:h-2 mx-2 sm:mx-3 rounded-full overflow-hidden bg-gray-200 shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-700 ease-out ${
                        step > idx + 1 ? 'w-full bg-gradient-to-r from-[#FF8C00] via-orange-500 to-orange-400' : 'w-0'
                      }`} />
                    </div>
                  )}
                </div>
                
                {/* Step Label */}
                <span className={`text-[10px] sm:text-sm font-bold mt-2 sm:mt-3 transition-all ${
                  step === idx + 1 
                    ? 'text-[#FF8C00] scale-105' 
                    : step > idx + 1 
                    ? 'text-orange-500' 
                    : 'text-gray-400'
                }`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Step 1: Questions */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#FF8C00]/10 border border-[#FF8C00]/30">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="size-4 text-[#FF8C00]" />
                <span className="text-sm font-semibold text-gray-900">Pre-Qualifying Questions</span>
              </div>
              <p className="text-xs text-gray-600">Add yes/no or multiple choice questions to screen candidates before they submit their application.</p>
            </div>

            {/* Existing Questions */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <Badge className="bg-[#FF8C00]/10 text-[#FF8C00] border-[#FF8C00]/30 text-[10px] shrink-0">Q{idx + 1}</Badge>
                      <p className="text-xs text-gray-900 leading-relaxed">{q.text}</p>
                    </div>
                    <button onClick={() => deleteQuestion(q.id)} className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">Correct Answer:</span>
                    {q.type === 'boolean' ? (
                      <div className="flex gap-1">
                        {['Yes', 'No'].map((ans) => (
                          <button
                            key={ans}
                            onClick={() => updateCorrectAnswer(q.id, ans)}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                              q.correctAnswer === ans 
                                ? 'bg-[#FF8C00] text-white' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#FF8C00]/50'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <Select value={q.correctAnswer} onValueChange={(val) => updateCorrectAnswer(q.id, val)}>
                        <SelectTrigger className="h-6 text-[10px] w-auto min-w-[100px]">
                          <SelectValue placeholder="Select answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {q.options?.map((opt) => (
                            <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Question */}
            <div className="p-3 rounded-lg border border-dashed border-[#FF8C00]/50 bg-[#FF8C00]/5 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="size-4 text-[#FF8C00]" />
                <span className="text-xs font-semibold text-gray-900">Add New Question</span>
              </div>
              
              <Input
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Type your pre-qualifying question..."
                className="h-9 text-xs"
              />
              
              <div className="flex items-center gap-2">
                <Select value={newQuestionType} onValueChange={(val: 'boolean' | 'multiple') => setNewQuestionType(val)}>
                  <SelectTrigger className="h-8 text-xs w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean" className="text-xs">Yes / No</SelectItem>
                    <SelectItem value="multiple" className="text-xs">Multiple Choice</SelectItem>
                  </SelectContent>
                </Select>
                
                {newQuestionType === 'multiple' && (
                  <Input
                    value={newOptions}
                    onChange={(e) => setNewOptions(e.target.value)}
                    placeholder="Options (comma separated)"
                    className="h-8 text-xs flex-1"
                  />
                )}
              </div>
              
              <Button onClick={addQuestion} disabled={!newQuestionText} className="w-full h-8 text-xs bg-[#FF8C00] hover:bg-orange-600 text-white">
                <Plus className="size-3.5 mr-1" />
                Add Question
              </Button>
            </div>

            {/* Suggestion chips */}
            <div className="space-y-1">
              <span className="text-[10px] text-gray-500">Quick Add Suggestions:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  "Are you authorized to work in the United States?",
                  "Do you have reliable transportation?",
                  "Are you available to start within 2 weeks?",
                  "Do you have a valid driver's license?"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setNewQuestionText(suggestion)}
                    className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-[10px] text-gray-600 hover:border-[#FF8C00]/50 hover:bg-[#FF8C00]/10 transition-colors"
                  >
                    {suggestion.length > 35 ? suggestion.substring(0, 35) + '...' : suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pass Score */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#FF8C00]/10 border border-[#FF8C00]/30">
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="size-4 text-[#FF8C00]" />
                <span className="text-sm font-semibold text-gray-900">Minimum Pass Score</span>
              </div>
              <p className="text-xs text-gray-600">Set the minimum percentage of correct answers required to pass pre-qualification.</p>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 bg-gray-50 space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#FF8C00]">{passScore[0]}%</div>
                <p className="text-sm text-gray-600 mt-1">Minimum Pass Score</p>
              </div>
              
              <Slider
                value={passScore}
                onValueChange={setPassScore}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>0% (Accept All)</span>
                <span>100% (Perfect Score)</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-600">
                  With <strong>{questions.length} questions</strong> and a <strong>{passScore[0]}%</strong> pass rate, 
                  candidates must answer at least <strong className="text-[#FF8C00]">{Math.ceil(questions.length * passScore[0] / 100)}</strong> questions correctly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Video Question (Optional) */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Video className="size-4 text-purple-500" />
                <span className="text-sm font-semibold text-gray-900">Video Introduction (Optional)</span>
              </div>
              <p className="text-xs text-gray-600">Ask candidates to record a short video response as part of their application.</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-900">Enable Video Question</Label>
                <button
                  onClick={() => setEnableVideo(!enableVideo)}
                  className={`w-12 h-6 rounded-full transition-colors ${enableVideo ? 'bg-[#FF8C00]' : 'bg-gray-300'}`}
                >
                  <div className={`size-5 rounded-full bg-white shadow-sm transition-transform ${enableVideo ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {enableVideo && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-700">Video Prompt</Label>
                    <textarea
                      value={videoQuestion}
                      onChange={(e) => setVideoQuestion(e.target.value)}
                      placeholder="e.g., Tell us about yourself and why you're interested in this position..."
                      className="w-full h-20 px-3 py-2 rounded-lg border border-gray-200 text-xs resize-none focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] text-gray-500 w-full">Suggestions:</span>
                    {[
                      "Tell us about yourself and why you want this role.",
                      "Describe your greatest professional achievement.",
                      "What makes you the ideal candidate for this position?"
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setVideoQuestion(suggestion)}
                        className="px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-600 hover:bg-purple-500/20 transition-colors"
                      >
                        {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="text-[10px] text-purple-600">
                      Candidates will have 60 seconds to record their response. Videos are stored securely and only visible to your hiring team.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="size-4 text-green-500" />
                <span className="text-sm font-semibold text-gray-900">Review Your Vetting Matrix</span>
              </div>
              <p className="text-xs text-gray-600">Confirm your pre-qualifying setup before saving.</p>
            </div>

            <div className="space-y-3">
              {/* Questions Summary */}
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-900">Pre-Qualifying Questions</span>
                  <Badge className="bg-[#FF8C00]/10 text-[#FF8C00] border-[#FF8C00]/30 text-[10px]">{questions.length} Questions</Badge>
                </div>
                <div className="space-y-1">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="flex items-center gap-2 text-[10px]">
                      <span className="text-[#FF8C00] font-semibold">Q{idx + 1}:</span>
                      <span className="text-gray-600 truncate">{q.text}</span>
                      <span className="text-green-500 font-medium ml-auto shrink-0">→ {q.correctAnswer}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pass Score Summary */}
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900">Minimum Pass Score</span>
                  <span className="text-lg font-bold text-[#FF8C00]">{passScore[0]}%</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Candidates must answer at least {Math.ceil(questions.length * passScore[0] / 100)} of {questions.length} questions correctly.
                </p>
              </div>

              {/* Video Summary */}
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900">Video Introduction</span>
                  <Badge className={`text-[10px] ${enableVideo ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {enableVideo ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                {enableVideo && videoQuestion && (
                  <p className="text-[10px] text-gray-500 mt-1 truncate">Prompt: {videoQuestion}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className="h-9 text-xs border-gray-200 text-gray-600"
        >
          Back
        </Button>
        
        {step < 4 ? (
          <Button onClick={nextStep} className="h-10 text-sm font-semibold bg-gradient-to-r from-[#FF8C00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg gap-1.5 px-5">
            Continue
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={onClose} className="h-10 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg gap-1.5 px-5">
            <CheckCircle2 className="size-4" />
            Save Vetting Matrix
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
