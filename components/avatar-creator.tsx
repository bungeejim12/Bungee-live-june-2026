"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BUNGEE_RANKS } from "@/components/bungee-rank-system"
import { Upload, Sparkles, Loader2, Check, RotateCcw, Download, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const CANVAS_SIZE = 512

// Geometry for the Bungee stick-figure body, expressed in canvas coordinates.
// The head sits at the top; the zigzag "cord" runs down the torso center.
const HEAD = { cx: CANVAS_SIZE / 2, cy: 150, r: 78 }
const NECK = { x: CANVAS_SIZE / 2, y: HEAD.cy + HEAD.r } // ~228
const HIP = { x: CANVAS_SIZE / 2, y: 360 }

type AvatarCreatorProps = {
  /** Bungee rank level (1-12). Controls the cord color. */
  level?: number
  firstName?: string
  /** Called with the final composited PNG data URL when the user confirms. */
  onComplete?: (dataUrl: string) => void | Promise<void>
  saving?: boolean
  className?: string
}

export function AvatarCreator({
  level = 1,
  firstName,
  onComplete,
  saving = false,
  className,
}: AvatarCreatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [portrait, setPortrait] = useState<HTMLImageElement | null>(null)
  const [vibe, setVibe] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"upload" | "ai">("ai")

  const rank = useMemo(() => BUNGEE_RANKS[Math.min(Math.max(level - 1, 0), BUNGEE_RANKS.length - 1)], [level])
  const cordColor = rank.color

  // --- Drawing ---------------------------------------------------------------

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Soft background so the avatar reads as a self-contained portrait.
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    const ink = "#0f172a"

    // ---- BODY LAYER (stick figure limbs, drawn in ink) ----
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = ink

    // Arms: from just below the neck out to the sides (the classic Bungee pose).
    ctx.lineWidth = 9
    ctx.beginPath()
    ctx.moveTo(NECK.x, NECK.y + 14)
    ctx.lineTo(NECK.x - 92, NECK.y + 70)
    ctx.moveTo(NECK.x, NECK.y + 14)
    ctx.lineTo(NECK.x + 92, NECK.y + 70)
    ctx.stroke()

    // Legs: from the hip splaying down to two feet.
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.moveTo(HIP.x, HIP.y)
    ctx.lineTo(HIP.x - 70, HIP.y + 110)
    ctx.moveTo(HIP.x, HIP.y)
    ctx.lineTo(HIP.x + 70, HIP.y + 110)
    ctx.stroke()
    // Feet
    ctx.lineWidth = 9
    ctx.beginPath()
    ctx.moveTo(HIP.x - 70, HIP.y + 110)
    ctx.lineTo(HIP.x - 38, HIP.y + 110)
    ctx.moveTo(HIP.x + 70, HIP.y + 110)
    ctx.lineTo(HIP.x + 38, HIP.y + 110)
    ctx.stroke()

    // ---- CORD LAYER (distinct zigzag, colored by rank) ----
    // The signature wavy bungee cord runs from neck to hip.
    drawCord(ctx, NECK.y + 6, HIP.y, cordColor)

    // ---- HEAD LAYER (portrait composited into a circular mask) ----
    if (portrait) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(HEAD.cx, HEAD.cy, HEAD.r, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      // Cover-fit the portrait into the circle.
      const size = HEAD.r * 2
      const scale = Math.max(size / portrait.width, size / portrait.height)
      const dw = portrait.width * scale
      const dh = portrait.height * scale
      ctx.drawImage(portrait, HEAD.cx - dw / 2, HEAD.cy - dh / 2, dw, dh)
      ctx.restore()

      // Blend ring around the head so the portrait fuses with the body.
      ctx.lineWidth = 8
      ctx.strokeStyle = ink
      ctx.beginPath()
      ctx.arc(HEAD.cx, HEAD.cy, HEAD.r, 0, Math.PI * 2)
      ctx.stroke()

      // Subtle inner shading ring for a seamless mask edge.
      const grad = ctx.createRadialGradient(HEAD.cx, HEAD.cy, HEAD.r - 14, HEAD.cx, HEAD.cy, HEAD.r)
      grad.addColorStop(0, "rgba(15,23,42,0)")
      grad.addColorStop(1, "rgba(15,23,42,0.18)")
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(HEAD.cx, HEAD.cy, HEAD.r, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Placeholder head: the iconic Bungee scribble outline.
      ctx.lineWidth = 9
      ctx.strokeStyle = ink
      ctx.beginPath()
      ctx.arc(HEAD.cx, HEAD.cy, HEAD.r, 0, Math.PI * 2)
      ctx.stroke()

      // Hair scribbles on top.
      ctx.lineWidth = 4
      ctx.beginPath()
      for (let i = -2; i <= 2; i++) {
        ctx.moveTo(HEAD.cx + i * 12, HEAD.cy - HEAD.r + 6)
        ctx.lineTo(HEAD.cx + i * 12 + 6, HEAD.cy - HEAD.r - 26)
      }
      ctx.stroke()
    }
  }, [portrait, cordColor])

  useEffect(() => {
    draw()
  }, [draw])

  // --- Portrait sources ------------------------------------------------------

  const loadImageFromUrl = useCallback((url: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file.")
        return
      }
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const img = await loadImageFromUrl(reader.result as string)
          setPortrait(img)
        } catch {
          setError("Could not read that image. Try another file.")
        }
      }
      reader.readAsDataURL(file)
    },
    [loadImageFromUrl],
  )

  const handleGenerate = useCallback(async () => {
    if (!vibe.trim() || isGenerating) return
    setError(null)
    setIsGenerating(true)
    try {
      const res = await fetch("/api/avatar/generate-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Generation failed")
      const img = await loadImageFromUrl(data.image)
      setPortrait(img)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate a portrait.")
    } finally {
      setIsGenerating(false)
    }
  }, [vibe, isGenerating, loadImageFromUrl])

  const getDataUrl = useCallback(() => {
    return canvasRef.current?.toDataURL("image/png") ?? null
  }, [])

  const handleDownload = useCallback(() => {
    const url = getDataUrl()
    if (!url) return
    const a = document.createElement("a")
    a.href = url
    a.download = "bungee-avatar.png"
    a.click()
  }, [getDataUrl])

  const handleConfirm = useCallback(async () => {
    const url = getDataUrl()
    if (url && onComplete) await onComplete(url)
  }, [getDataUrl, onComplete])

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Live preview */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="h-auto w-full max-w-[260px] rounded-xl"
              aria-label="Live preview of your Bungee avatar"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: cordColor }}
              aria-hidden="true"
            />
            <span className="font-medium text-slate-700">{rank.name}</span>
            <span className="text-slate-400">Lvl {rank.level}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("ai")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                mode === "ai" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Sparkles className="h-4 w-4" /> AI Vibe
            </button>
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                mode === "upload" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Upload className="h-4 w-4" /> Upload
            </button>
          </div>

          {mode === "ai" ? (
            <div className="space-y-2">
              <Label htmlFor="vibe" className="font-medium text-slate-700">
                What is your hobby or vibe?
              </Label>
              <Input
                id="vibe"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g. surfing, coding, professional"
                className="!text-slate-900 border-slate-300 bg-white placeholder:text-slate-400 focus:border-[#FF8C00] focus:ring-[#FF8C00]"
                style={{ color: "#0f172a" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleGenerate()
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={!vibe.trim() || isGenerating}
                className="w-full bg-[#FF8C00] font-semibold text-white hover:bg-[#E67E00]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate Portrait
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-500">
                We&apos;ll create a cartoon portrait that matches your vibe, then drop it onto your Bungee.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="photo" className="font-medium text-slate-700">
                Upload a portrait photo
              </Label>
              <label
                htmlFor="photo"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-colors hover:border-[#FF8C00] hover:bg-orange-50"
              >
                <ImageIcon className="h-8 w-8 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Click to choose a photo</span>
                <span className="text-xs text-slate-400">PNG or JPG, square works best</span>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                  }}
                />
              </label>
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}

          {portrait && (
            <button
              type="button"
              onClick={() => setPortrait(null)}
              className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <RotateCcw className="h-4 w-4" /> Clear portrait
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={handleDownload}
          className="border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <Download className="mr-2 h-4 w-4" /> Save PNG
        </Button>
        {onComplete && (
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            className="flex-1 bg-[#FF8C00] font-semibold text-white hover:bg-[#E67E00]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Avatar...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> {firstName ? `Use this Bungee, ${firstName}` : "Use this Bungee"}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

// Draws the signature wavy bungee cord between two vertical points.
function drawCord(ctx: CanvasRenderingContext2D, top: number, bottom: number, color: string) {
  const cx = CANVAS_SIZE / 2
  const amplitude = 26
  const segments = 6
  const span = bottom - top

  ctx.save()
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  // Outer darker stroke for depth.
  ctx.strokeStyle = shade(color, -28)
  ctx.lineWidth = 18
  traceCord(ctx, cx, top, span, amplitude, segments)
  ctx.stroke()

  // Main colored cord.
  ctx.strokeStyle = color
  ctx.lineWidth = 12
  traceCord(ctx, cx, top, span, amplitude, segments)
  ctx.stroke()

  // Highlight for a glossy, rubbery look.
  ctx.strokeStyle = shade(color, 55)
  ctx.lineWidth = 4
  traceCord(ctx, cx, top, span, amplitude, segments)
  ctx.stroke()

  ctx.restore()
}

function traceCord(
  ctx: CanvasRenderingContext2D,
  cx: number,
  top: number,
  span: number,
  amplitude: number,
  segments: number,
) {
  ctx.beginPath()
  ctx.moveTo(cx, top)
  const step = span / segments
  for (let i = 0; i < segments; i++) {
    const y0 = top + step * i
    const y1 = top + step * (i + 1)
    const dir = i % 2 === 0 ? 1 : -1
    const cpX = cx + amplitude * dir
    ctx.quadraticCurveTo(cpX, (y0 + y1) / 2, cx, y1)
  }
}

// Lightens (positive) or darkens (negative) a hex color.
function shade(hex: string, amount: number) {
  const c = hex.replace("#", "")
  const full = c.length === 3 ? c.split("").map((ch) => ch + ch).join("") : c
  const num = Number.parseInt(full, 16)
  let r = (num >> 16) + amount
  let g = ((num >> 8) & 0x00ff) + amount
  let b = (num & 0x0000ff) + amount
  r = Math.max(0, Math.min(255, r))
  g = Math.max(0, Math.min(255, g))
  b = Math.max(0, Math.min(255, b))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}
