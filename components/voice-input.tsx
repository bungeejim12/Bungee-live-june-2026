"use client"

import * as React from "react"
import { Mic, MicOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
}

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null
}

// Only these input types make sense for dictation. Everything else
// (password, number, email, tel, date, file, checkbox, radio, etc.) is skipped.
const DICTATABLE_TYPES = new Set(["text", "search", "url", undefined, ""])

interface VoiceInputProps extends React.ComponentProps<"input"> {
  /** Optional language override, defaults to the browser locale or en-US. */
  voiceLang?: string
  /** Force-disable the mic regardless of type (e.g. for currency-as-text fields). */
  disableVoice?: boolean
}

/**
 * Drop-in replacement for <Input> that adds a microphone button for free-text fields.
 * Transcribed speech is appended to the current value via the existing onChange handler,
 * so it works with standard controlled `value` + `onChange={(e) => setX(e.target.value)}` patterns.
 * The mic is automatically hidden for non-text input types and unsupported browsers.
 */
export function VoiceInput({
  className,
  value,
  onChange,
  voiceLang,
  disabled,
  type,
  disableVoice,
  ...props
}: VoiceInputProps) {
  const [listening, setListening] = React.useState(false)
  const [supported, setSupported] = React.useState(false)
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null)
  const valueRef = React.useRef<string>(typeof value === "string" ? value : "")

  const voiceEligible = !disableVoice && DICTATABLE_TYPES.has(type as string | undefined)

  React.useEffect(() => {
    valueRef.current = typeof value === "string" ? value : String(value ?? "")
  }, [value])

  React.useEffect(() => {
    setSupported(!!getSpeechRecognition())
    return () => {
      try {
        recognitionRef.current?.stop()
      } catch {
        // ignore
      }
    }
  }, [])

  const showMic = supported && voiceEligible

  const emitValue = React.useCallback(
    (next: string) => {
      if (!onChange) return
      onChange({ target: { value: next } } as React.ChangeEvent<HTMLInputElement>)
    },
    [onChange],
  )

  const stopListening = React.useCallback(() => {
    try {
      recognitionRef.current?.stop()
    } catch {
      // ignore
    }
    setListening(false)
  }, [])

  const startListening = React.useCallback(() => {
    const Recognition = getSpeechRecognition()
    if (!Recognition) return

    const recognition = new Recognition()
    recognition.lang = voiceLang || (typeof navigator !== "undefined" ? navigator.language : "en-US") || "en-US"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript
        }
      }
      transcript = transcript.trim()
      if (!transcript) return
      const current = valueRef.current
      const needsSpace = current.length > 0 && !/\s$/.test(current)
      const next = current + (needsSpace ? " " : "") + transcript
      valueRef.current = next
      emitValue(next)
    }

    recognition.onerror = () => {
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setListening(true)
    } catch {
      setListening(false)
    }
  }, [emitValue, voiceLang])

  const toggle = React.useCallback(() => {
    if (listening) {
      stopListening()
    } else {
      startListening()
    }
  }, [listening, startListening, stopListening])

  // When the mic isn't applicable, behave exactly like a plain Input.
  if (!showMic) {
    return <Input className={className} value={value} onChange={onChange} disabled={disabled} type={type} {...props} />
  }

  return (
    <div className="relative w-full">
      <Input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-pressed={listening}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        title={listening ? "Stop voice input" : "Speak to fill this field"}
        className={cn(
          "absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border transition-colors disabled:opacity-50",
          listening
            ? "border-red-500 bg-red-500 text-white animate-pulse"
            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
        )}
      >
        {listening ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
      </button>
    </div>
  )
}

export default VoiceInput
