import { type NextRequest, NextResponse } from "next/server"

// Pulls candidate product images from a website URL so businesses can equip
// their Bungees with visuals without leaving the bounty wizard.

function resolveUrl(src: string, base: URL): string | null {
  try {
    return new URL(src, base).href
  } catch {
    return null
  }
}

function extractImages(html: string, base: URL): string[] {
  const urls = new Set<string>()

  // Prefer Open Graph / Twitter images first — these are the hero assets.
  const metaRegex = /<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["'][^>]*>/gi
  for (const tag of html.match(metaRegex) ?? []) {
    const content = tag.match(/content=["']([^"']+)["']/i)?.[1]
    if (content) {
      const resolved = resolveUrl(content, base)
      if (resolved) urls.add(resolved)
    }
  }

  // Then collect <img> sources (handle src, data-src, and srcset).
  const imgRegex = /<img[^>]+>/gi
  for (const tag of html.match(imgRegex) ?? []) {
    const src =
      tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ??
      tag.match(/\bdata-src=["']([^"']+)["']/i)?.[1] ??
      tag.match(/\bsrcset=["']([^"', ]+)/i)?.[1]
    if (!src) continue
    if (src.startsWith("data:")) continue
    const resolved = resolveUrl(src, base)
    if (resolved) urls.add(resolved)
  }

  return [...urls]
    // Skip obvious tracking pixels / sprites / icons.
    .filter((u) => !/sprite|pixel|spacer|1x1|favicon|logo-?icon/i.test(u))
    .slice(0, 12)
}

export async function POST(request: NextRequest) {
  try {
    const { websiteUrl } = await request.json()

    if (!websiteUrl || typeof websiteUrl !== "string") {
      return NextResponse.json({ error: "A website URL is required." }, { status: 400 })
    }

    const normalized = websiteUrl.match(/^https?:\/\//i) ? websiteUrl : `https://${websiteUrl}`

    let base: URL
    try {
      base = new URL(normalized)
    } catch {
      return NextResponse.json({ error: "That doesn't look like a valid website URL." }, { status: 400 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    let res: Response
    try {
      res = await fetch(base.href, {
        headers: {
          // Present as a normal browser so sites return full markup.
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!res.ok) {
      return NextResponse.json({ error: `Couldn't reach that site (status ${res.status}).` }, { status: 502 })
    }

    const html = await res.text()
    const images = extractImages(html, base)

    if (images.length === 0) {
      return NextResponse.json({ error: "No usable product images were found on that page.", images: [] })
    }

    return NextResponse.json({ images })
  } catch (error) {
    console.error("[v0] Image scrape error:", error)
    return NextResponse.json({ error: "Failed to pull images from that website." }, { status: 500 })
  }
}
