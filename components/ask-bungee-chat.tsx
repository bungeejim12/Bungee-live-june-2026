'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { X, Send, MessageCircle, Upload, Trash2, FileText, Loader2, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface KnowledgeFile {
  id: string
  name: string
  content: string
}

interface AskBungeeChatProps {
  onNavigate?: (tab: string) => void
  onOpenModal?: (modal: string) => void
  isOpen?: boolean
  onClose?: () => void
  variant?: 'floating' | 'fullscreen' | 'header' | 'inline'
}

export function AskBungeeChat({ onNavigate, onOpenModal, isOpen: controlledIsOpen, onClose, variant = 'floating' }: AskBungeeChatProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = onClose ? (open: boolean) => { if (!open) onClose() } : setInternalIsOpen
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`)
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false)
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/ask-bungee',
      body: { sessionId }
    }),
  })

  const [inputValue, setInputValue] = useState('')

  const loadKnowledgeFiles = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('bungee_knowledge')
        .select('id, name, content')
        .order('created_at', { ascending: false })
      
      if (data) {
        setKnowledgeFiles(data)
      }
    } catch {
      // Supabase not configured, skip loading knowledge files
      console.log('[v0] Supabase not configured, skipping knowledge files')
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load knowledge files on mount
  useEffect(() => {
    loadKnowledgeFiles()
  }, [loadKnowledgeFiles])

  // Check for speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = ''
          let interimText = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimText += transcript
            }
          }
          
          if (finalTranscript) {
            setInputValue(prev => prev + (prev ? ' ' : '') + finalTranscript)
            setInterimTranscript('')
          } else {
            setInterimTranscript(interimText)
          }
        }

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.log('[v0] Speech recognition error:', event.error)
          setIsListening(false)
          setInterimTranscript('')
        }

        recognitionRef.current.onend = () => {
          // Auto-restart if still supposed to be listening
          if (isListening && recognitionRef.current) {
            try {
              recognitionRef.current.start()
            } catch {
              setIsListening(false)
              setInterimTranscript('')
            }
          } else {
            setIsListening(false)
            setInterimTranscript('')
          }
        }
      }
    }
  }, [isListening])

  const toggleListening = () => {
    console.log('[v0] toggleListening called, recognitionRef:', recognitionRef.current)
    console.log('[v0] speechSupported:', speechSupported)
    
    if (!recognitionRef.current) {
      console.log('[v0] No recognition ref, trying to initialize...')
      // Try to initialize again
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          console.log('[v0] Got speech result:', event.results)
          let finalTranscript = ''
          let interimText = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimText += transcript
            }
          }
          
          console.log('[v0] Final:', finalTranscript, 'Interim:', interimText)
          
          if (finalTranscript) {
            setInputValue(prev => prev + (prev ? ' ' : '') + finalTranscript)
            setInterimTranscript('')
          } else {
            setInterimTranscript(interimText)
          }
        }

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.log('[v0] Speech error:', event.error)
          setIsListening(false)
          setInterimTranscript('')
        }

        recognitionRef.current.onend = () => {
          console.log('[v0] Speech ended')
          setIsListening(false)
          setInterimTranscript('')
        }
      } else {
        console.log('[v0] SpeechRecognition not available')
        alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.')
        return
      }
    }

    if (isListening) {
      console.log('[v0] Stopping listening')
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      console.log('[v0] Starting listening')
      try {
        recognitionRef.current.start()
        setIsListening(true)
        console.log('[v0] Started successfully')
      } catch (err) {
        console.log('[v0] Start error:', err)
      }
    }
  }

  const handleSend = () => {
    if (!inputValue.trim() || status === 'streaming') return
    sendMessage({ text: inputValue }, { body: { sessionId } })
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      const text = await file.text()
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('bungee_knowledge')
        .insert({
          name: file.name,
          content: text,
          file_type: file.type || 'text/plain'
        })
        .select('id, name, content')
        .single()
      
      if (error) throw error
      
      if (data) {
        setKnowledgeFiles(prev => [data, ...prev])
      }
    } catch (error) {
      console.error('Error uploading knowledge file:', error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteKnowledge = async (id: string) => {
    try {
      const supabase = createClient()
      await supabase.from('bungee_knowledge').delete().eq('id', id)
      setKnowledgeFiles(prev => prev.filter(f => f.id !== id))
    } catch {
      // Supabase not configured, just remove from local state
      setKnowledgeFiles(prev => prev.filter(f => f.id !== id))
    }
  }

  const getMessageText = (msg: typeof messages[0]): string => {
    if (!msg.parts || !Array.isArray(msg.parts)) return ''
    return msg.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('')
  }

    // Navigation is now handled only through user button clicks in renderMessageContent
  // The [NAVIGATE:] commands are parsed there and Yes/No buttons are shown
  // This ensures users explicitly choose whether to navigate or stay in chat

  // Function to render message text, hiding navigation commands and adding navigation buttons
  const renderMessageContent = (text: string) => {
    // Remove navigation commands from display
    const cleanText = text.replace(/\[NAVIGATE:\w+(?:-\w+)?\]/g, '').trim()
    
    // Check if there's a navigation offer in the message
    const navMatch = text.match(/\[NAVIGATE:(\w+(?:-\w+)?)\]/)
    const hasNavOffer = !!navMatch
    
    // Also detect natural language navigation context to infer destination
    let inferredDestination: string | null = null
    if (!hasNavOffer) {
      // Check for referral/earning context (Bungee referrer dashboard)
      if (/\b(make a referral|make referral|earn money|earn bounties|refer someone|available opportunities|become a bungee|bungee referral|referral dashboard|how do i refer|want to refer|making referrals)\b/i.test(cleanText)) {
        inferredDestination = 'referral-dashboard'
      }
      // Check for hiring/job-related context
      else if (/\b(hiring|hire tab|post a job|job posting|self-hire|recruiter|bungee blast|veteran pool|bungee pool)\b/i.test(cleanText)) {
        if (/\bself-hire\b/i.test(cleanText)) inferredDestination = 'self-hire'
        else if (/\bpro.?recruit/i.test(cleanText)) inferredDestination = 'pro-recruit'
        else if (/\bbungee blast\b/i.test(cleanText)) inferredDestination = 'bungee-blast'
        else if (/\bveteran pool\b/i.test(cleanText)) inferredDestination = 'veteran-pool'
        else if (/\bbungee pool\b/i.test(cleanText)) inferredDestination = 'bungee-pool'
        else inferredDestination = 'hire'
      }
      // Check for marketplace context
      else if (/\b(marketplace|sell products?|product listing|inventory)\b/i.test(cleanText)) {
        inferredDestination = 'marketplace'
      }
      // Check for products tab context  
      else if (/\b(products? tab|product bounty|boost product|your products)\b/i.test(cleanText)) {
        inferredDestination = 'products'
      }
      // Check for services context  
      else if (/\b(services? tab|service referral|contractor|service bounty|your services)\b/i.test(cleanText)) {
        inferredDestination = 'services'
      }
    }
    
    // Check for natural language navigation offers
    const hasNaturalNavOffer = /would you like me to take you|want me to take you|shall I take you|do you want me to take you|take you there|would you like to go there|want to go there|like me to navigate/i.test(cleanText)
    
    const destination = navMatch ? navMatch[1] : inferredDestination
    const showButtons = (hasNavOffer || (hasNaturalNavOffer && inferredDestination)) && destination
    
    return (
      <div>
        <p className="whitespace-pre-wrap">{cleanText}</p>
        {showButtons && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                // Handle page redirects (goes to a different page entirely)
                if (destination === 'referral-dashboard') {
                  window.location.href = '/dashboard/bungee'
                  return
                }
                
                if (onOpenModal && ['self-hire', 'pro-recruit', 'bungee-blast', 'veteran-pool', 'bungee-pool'].includes(destination)) {
                  onOpenModal(destination)
                  setIsOpen(false) // Close chat when navigating
                } else if (onNavigate && ['hire', 'marketplace', 'jobs', 'services', 'products'].includes(destination)) {
                  onNavigate(destination)
                  setIsOpen(false) // Close chat when navigating
                }
              }}
              className="px-4 py-2 bg-[#FF8C00] hover:bg-[#E67E00] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
            >
              Yes, take me there
            </button>
            <button
              onClick={() => {
                // Add a follow-up message that user declined navigation
                setMessages([...messages, {
                  id: `decline-${Date.now()}`,
                  role: 'user' as const,
                  content: 'No thanks, I\'ll navigate myself.',
                  parts: [{ type: 'text' as const, text: 'No thanks, I\'ll navigate myself.' }],
                  createdAt: new Date()
                }])
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              No thanks
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Collapsible Side Panel - For floating variant */}
      {variant === 'floating' && (
        <>
          {/* Side Tab Button - Anchored on right edge, above the bottom nav to avoid overlap */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`fixed right-0 top-[38%] -translate-y-1/2 z-40 flex items-center transition-all duration-300 ${
              isOpen ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
            }`}
          >
            {/* Vertical tab with "Ask Bungee" text */}
            <div className="bg-gradient-to-b from-[#FF8C00] to-orange-500 rounded-l-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:scale-105 py-4 px-2 flex flex-col items-center gap-2">
              {/* Bungee logo */}
              <div className="relative size-8 rounded-full overflow-hidden border-2 border-white/50 bg-white shadow">
                <Image
                  src="/images/bungee-logo.png"
                  alt="Bungee"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              {/* Vertical text */}
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-xs tracking-wide" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                  Ask Bungee
                </span>
              </div>
              {/* Pulsing indicator */}
              <div className="relative">
                <MessageCircle className="size-4 text-white" />
                <span className="absolute -top-0.5 -right-0.5 size-2 bg-white rounded-full animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 size-2 bg-white rounded-full" />
              </div>
            </div>
          </button>

          {/* Slide-out panel */}
          <div 
            className={`fixed right-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Panel container */}
            <div className="h-full w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FF8C00] to-orange-500 border-b border-orange-600">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-full overflow-hidden border-2 border-white/30 bg-white">
                    <Image
                      src="/images/bungee-logo.png"
                      alt="Bungee"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Ask Bungee</h3>
                    <p className="text-xs text-white/80">Your AI assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowKnowledgePanel(!showKnowledgePanel)}
                    className={`p-2 rounded-lg transition-colors ${showKnowledgePanel ? 'bg-white/30' : 'hover:bg-white/20'}`}
                    title="Manage Knowledge"
                  >
                    <FileText className="size-5 text-white" />
                  </button>
                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Close"
                  >
                    <X className="size-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Knowledge Panel */}
              {showKnowledgePanel && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Knowledge Base</h4>
                    <label className="cursor-pointer">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.json,.md"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-[#FF8C00] hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors">
                        {isUploading ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />}
                        Upload
                      </span>
                    </label>
                  </div>
                  {knowledgeFiles.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400">No knowledge files uploaded yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {knowledgeFiles.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="size-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteKnowledge(file.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors flex-shrink-0"
                          >
                            <Trash2 className="size-3 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="relative size-16 mb-4">
                      <Image
                        src="/images/bungee-logo.png"
                        alt="Bungee"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Welcome to Ask Bungee!</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                      I can help you navigate the app, answer questions about Bungee, and assist with your tasks.
                    </p>
                  </div>
                )}
                {messages.map((msg) => {
                  const text = getMessageText(msg)
                  if (!text) return null
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-[#FF8C00] to-orange-500 text-white rounded-br-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-md'
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {msg.role === 'assistant' ? renderMessageContent(text) : text}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {status === 'streaming' && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="size-2 bg-[#FF8C00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="size-2 bg-[#FF8C00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="size-2 bg-[#FF8C00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue + (interimTranscript ? (inputValue ? ' ' : '') + interimTranscript : '')}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isListening ? "Listening... speak now" : "Ask Bungee anything..."}
                      className={`w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8C00] text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 ${isListening ? 'ring-2 ring-red-500 animate-pulse' : ''}`}
                      rows={1}
                      style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                    {speechSupported && (
                      <button
                        onClick={toggleListening}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                          isListening 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'text-gray-400 hover:text-[#FF8C00] hover:bg-orange-50 dark:hover:bg-gray-600'
                        }`}
                        title={isListening ? 'Stop listening' : 'Voice input'}
                      >
                        {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                      </button>
                    )}
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || status === 'streaming'}
                    className="bg-gradient-to-r from-[#FF8C00] to-orange-500 hover:from-[#E67E00] hover:to-orange-600 text-white rounded-xl h-12 w-12 p-0 flex items-center justify-center disabled:opacity-50"
                  >
                    {status === 'streaming' ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Send className="size-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop overlay when panel is open */}
          {isOpen && (
            <div 
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsOpen(false)}
            />
          )}
        </>
      )}

      {/* Header Button - Compact inline button for header placement */}
      {variant === 'header' && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
            isOpen 
              ? 'bg-gray-600 hover:bg-gray-500' 
              : 'bg-gradient-to-r from-[#FF8C00] to-orange-500 hover:from-[#E67E00] hover:to-orange-600 shadow-md shadow-orange-500/30'
          }`}
        >
          {/* Pulsing ring effect when closed */}
          {!isOpen && (
            <>
              <span className="absolute inset-0 rounded-lg bg-[#FF8C00] animate-ping opacity-40" />
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF8C00] to-orange-500 animate-pulse opacity-60" />
            </>
          )}
          <div className="relative size-6 rounded-full overflow-hidden border border-white/30 bg-white z-10">
            <Image
              src="/images/bungee-logo.png"
              alt="Bungee"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <span className="relative z-10 font-semibold text-white text-xs whitespace-nowrap">
            {isOpen ? 'Close' : 'Ask Bungee'}
          </span>
          {isOpen ? (
            <X className="relative z-10 size-3.5 text-white" />
          ) : (
            <MessageCircle className="relative z-10 size-3.5 text-white animate-bounce" />
          )}
        </button>
      )}

      {/* Inline Button - Small button to sit next to other controls */}
      {variant === 'inline' && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center gap-1.5 px-2.5 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-all border ${
            isOpen 
              ? 'bg-gray-600 hover:bg-gray-500 border-gray-500' 
              : 'bg-gradient-to-r from-[#FF8C00] to-orange-500 hover:from-[#E67E00] hover:to-orange-600 border-[#FF8C00]/50 shadow-sm shadow-orange-500/30'
          }`}
        >
          {/* Pulsing ring effect when closed */}
          {!isOpen && (
            <>
              <span className="absolute inset-0 rounded-lg bg-[#FF8C00] animate-ping opacity-30" />
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF8C00] to-orange-500 animate-pulse opacity-50" />
            </>
          )}
          <div className="relative size-5 sm:size-5 rounded-full overflow-hidden border border-white/30 bg-white z-10">
            <Image
              src="/images/bungee-logo.png"
              alt="Bungee"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <span className="relative z-10 font-semibold text-white text-[10px] sm:text-[10px] whitespace-nowrap hidden sm:inline">
            {isOpen ? 'Close' : 'Ask'}
          </span>
          {isOpen ? (
            <X className="relative z-10 size-3.5 text-white" />
          ) : (
            <MessageCircle className="relative z-10 size-3.5 text-white animate-bounce" />
          )}
        </button>
      )}

      {/* Chat Window - For header, inline, and fullscreen variants only */}
      {isOpen && variant !== 'floating' && (
        <>
          <div className={`fixed z-50 bg-white dark:bg-gray-800 flex flex-col overflow-hidden shadow-2xl ${
            variant === 'fullscreen' 
              ? 'inset-0' 
              : 'top-16 right-4 w-[360px] h-[480px] rounded-2xl border border-gray-200 dark:border-gray-700'
          }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FF8C00] to-orange-500 border-b border-orange-600">
            <div className="flex items-center gap-3">
              <div className="relative size-10 rounded-full overflow-hidden border-2 border-white/30 bg-white">
                <Image
                  src="/images/bungee-logo.png"
                  alt="Bungee"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Ask Bungee</h3>
                <p className="text-xs text-white/80">Your AI assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKnowledgePanel(!showKnowledgePanel)}
                className={`p-2 rounded-lg transition-colors ${showKnowledgePanel ? 'bg-white/30' : 'hover:bg-white/20'}`}
                title="Manage Knowledge"
              >
                <FileText className="size-5 text-white" />
              </button>
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                title="Close"
              >
                <X className="size-5 text-white" />
              </button>
            </div>
          </div>

          {/* Knowledge Panel */}
          {showKnowledgePanel && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Knowledge Base</h4>
                <label className="cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.json,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-[#FF8C00] hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors">
                    {isUploading ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />}
                    Upload
                  </span>
                </label>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {knowledgeFiles.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">No knowledge files uploaded yet. Upload .txt, .json, or .md files to enhance Bungee&apos;s knowledge.</p>
                ) : (
                  knowledgeFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="size-4 text-[#FF8C00] flex-shrink-0" />
                        <span className="text-xs text-gray-900 dark:text-white truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteKnowledge(file.id)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors flex-shrink-0"
                      >
                        <Trash2 className="size-3 text-red-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Hi! I&apos;m Bungee, your AI assistant.</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Ask me anything about the Bungee platform, how to earn, the ranking system, or any other questions!</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-[#FF8C00] text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="text-sm">{renderMessageContent(getMessageText(message))}</div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{getMessageText(message)}</p>
                  )}
                </div>
              </div>
            ))}
            
            {status === 'streaming' && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-600">
                  <div className="flex gap-1">
                    <span className="size-2 bg-[#FF8C00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="size-2 bg-[#FF8C00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="size-2 bg-[#FF8C00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {/* Live transcription display */}
            {isListening && interimTranscript && (
              <div className="mb-2 px-3 py-2 bg-orange-50 dark:bg-gray-700/50 rounded-lg border border-[#FF8C00]/30">
                <p className="text-sm text-gray-700 dark:text-gray-300 italic animate-pulse">{interimTranscript}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  if (!speechSupported) {
                    alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.')
                    return
                  }
                  toggleListening()
                }}
                disabled={status === 'streaming'}
                className={`p-3 rounded-xl transition-all ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-[#FF8C00] hover:bg-[#E67E00]'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isListening ? 'Stop listening' : 'Speak your question'}
              >
                {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              </Button>
              <input
                type="text"
                value={inputValue + (isListening && interimTranscript ? ' ' + interimTranscript : '')}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening... speak now" : "Ask Bungee anything..."}
                className={`flex-1 px-4 py-3 bg-white dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent text-sm ${
                  isListening ? 'border-[#FF8C00] ring-1 ring-[#FF8C00]/50' : 'border-gray-200 dark:border-gray-600'
                }`}
                disabled={status === 'streaming'}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || status === 'streaming'}
                className="p-3 bg-[#FF8C00] hover:bg-[#E67E00] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="size-5" />
              </Button>
            </div>
            {isListening && (
              <p className="text-xs text-[#FF8C00] mt-2 text-center">Microphone active - speak your question</p>
            )}
          </div>
        </div>
        </>
      )}
    </>
  )
}
