import { generateText } from "ai"
import { NextResponse } from "next/server"

// Helper to extract text content from HTML
function extractTextFromHtml(html: string): string {
  // Remove script and style tags and their content
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ')
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#39;/g, "'")
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim()
  // Limit to reasonable length for AI processing
  return text.slice(0, 15000)
}

// Extract company name from HTML title
function extractCompanyName(html: string, hostname: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch) {
    const title = titleMatch[1]
      .replace(/\s*[-|–—]\s*.+$/, '')
      .replace(/^(Home|Welcome to|About)\s*[-|–—]?\s*/i, '')
      .trim()
    if (title && title.length > 2 && title.length < 100) {
      return title
    }
  }
  return hostname.replace(/^www\./, '').replace(/\.(com|org|net|io|co)$/, '')
}

export async function POST(request: Request) {
  try {
    const { websiteUrl, targetRole, formType } = await request.json()

    if (!websiteUrl) {
      return NextResponse.json({ error: "Website URL is required" }, { status: 400 })
    }

    // Normalize URL
    let url = websiteUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    // Fetch the website content
    let scrapedContent = ""
    let rawHtml = ""
    let hostname = ""
    try {
      const parsedUrl = new URL(url)
      hostname = parsedUrl.hostname
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BungeeBot/1.0; +https://bungee.com)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      
      rawHtml = await response.text()
      scrapedContent = extractTextFromHtml(rawHtml)
    } catch (fetchError) {
      console.error("[v0] Website fetch error:", fetchError)
      return NextResponse.json({ 
        error: "Could not access website. Please check the URL and try again.",
        scrapedContent: null 
      }, { status: 400 })
    }

    if (!scrapedContent || scrapedContent.length < 100) {
      return NextResponse.json({ 
        error: "Could not extract meaningful content from website.",
        scrapedContent: null 
      }, { status: 400 })
    }

    // Extract company name from HTML
    const companyName = extractCompanyName(rawHtml, hostname)

    // Build the extraction prompt based on form type
    const systemPrompt = `### ROLE & TASK
You are a precise data extraction assistant. Your job is to fill out a form using ONLY the live, scraped text provided below from the target company's website.

### CRITICAL RULES (ANTI-GENERIC GUARDRAILS)
1. DO NOT use your internal, pre-trained knowledge about this company or generic business templates.
2. If the specific data requested is NOT present in the provided [Scraped Website Content], return "NOT_FOUND" for that field. Do not guess or hallucinate.
3. Your output must strictly reflect the current reality of the provided text.
4. Extract real company information like location, services offered, company culture, and job-relevant details.
5. For salary, only include if explicitly mentioned - otherwise return "NOT_FOUND".
6. Be specific and factual - use exact wording from the website when possible.`

    let userPrompt = ""
    
    if (formType === "hiring") {
      userPrompt = `### INPUT DATA
- Company Website URL: ${url}
- Company Name: ${companyName}
- Target Role: ${targetRole || "General Position"}
- Scraped Website Content:
"""
${scrapedContent}
"""

### EXTRACTION COMMAND
Analyze the [Scraped Website Content] above and extract data for a JOB ORDER FORM. Return a JSON object with these fields:

{
  "companyName": "${companyName}",
  "jobTitle": "Suggested job title based on ${targetRole} and company context, or NOT_FOUND",
  "department": "Relevant department based on company structure, or NOT_FOUND",
  "location": "Physical location/address from website, or NOT_FOUND",
  "salary": "Only if salary info is on website, otherwise NOT_FOUND",
  "jobType": "full-time, part-time, or contract based on context, or NOT_FOUND",
  "experience": "Suggested experience level for the role, or NOT_FOUND",
  "skills": "Comma-separated skills relevant to this company and role, extracted from website, or NOT_FOUND",
  "description": "A job description based ONLY on what this company does per the website. Do not invent services. If insufficient info, return NOT_FOUND",
  "screeningQuestion1": "A relevant screening question based on the company's actual services, or NOT_FOUND",
  "screeningQuestion2": "A second relevant screening question based on the company's actual services, or NOT_FOUND",
  "companyDescription": "Brief company overview based on website content, or NOT_FOUND",
  "companyServices": "List of services/products the company offers, extracted from website, or NOT_FOUND",
  "companyCulture": "Company culture indicators from website, or NOT_FOUND",
  "companyBenefits": "Any employee benefits mentioned on website, or NOT_FOUND",
  "confidence": "HIGH if most data was found on site, MEDIUM if some data found, LOW if mostly inferred"
}

Return ONLY the JSON object, no additional text.`
    } else if (formType === "service") {
      userPrompt = `### INPUT DATA
- Company Website URL: ${url}
- Company Name: ${companyName}
- Scraped Website Content:
"""
${scrapedContent}
"""

### EXTRACTION COMMAND
Analyze the [Scraped Website Content] above and extract data for a SERVICE LEAD FORM. Return a JSON object with these fields:

{
  "companyName": "${companyName}",
  "serviceName": "Primary service or product offered by this company, or NOT_FOUND",
  "targetAudience": "Who this company serves based on website content, or NOT_FOUND",
  "salesPitch": "A compelling pitch based ONLY on actual services/benefits mentioned on the website. Do not invent claims. Or NOT_FOUND",
  "mainGoal": "demo, contract, email, call, quote, consultation, appointment, or booking - based on company type, or NOT_FOUND",
  "companyDescription": "Brief company overview based on website content, or NOT_FOUND",
  "companyServices": "List of services/products the company offers, extracted from website, or NOT_FOUND",
  "uniqueSellingPoints": "What makes this company different, based on website content, or NOT_FOUND",
  "confidence": "HIGH if most data was found on site, MEDIUM if some data found, LOW if mostly inferred"
}

Return ONLY the JSON object, no additional text.`
    } else if (formType === "bungee-info-pack") {
      // Special mode for generating comprehensive Bungee Info Pack
      userPrompt = `### INPUT DATA
- Company Website URL: ${url}
- Company Name: ${companyName}
- Target Role: ${targetRole || "General Position"}
- Scraped Website Content:
"""
${scrapedContent}
"""

### EXTRACTION COMMAND
Analyze the [Scraped Website Content] and create a comprehensive BUNGEE INFO PACK - a document that Bungee referrers will use to pitch this company and role to potential candidates. Return a JSON object:

{
  "companyName": "${companyName}",
  "companyTagline": "A short tagline or mission statement from the website, or NOT_FOUND",
  "companyDescription": "2-3 sentence company overview based ONLY on website content",
  "companyServices": ["Array of services/products offered"],
  "companyCulture": "Work environment and culture indicators",
  "companyBenefits": ["Array of employee benefits if mentioned"],
  "companyLocations": ["Array of office locations"],
  "industryKeywords": ["Array of industry/sector keywords"],
  "targetRole": "${targetRole}",
  "roleDescription": "Description of the target role in context of this company",
  "roleRequirements": ["Array of likely requirements for this role"],
  "rolePerks": "Why someone would want this role at this company",
  "elevatorPitch": "A 30-second pitch a Bungee can use to introduce this opportunity",
  "talkingPoints": ["Array of 3-5 key talking points for referrers"],
  "objectionHandlers": ["Array of responses to common candidate objections"],
  "idealCandidateProfile": "Description of the ideal candidate",
  "confidence": "HIGH, MEDIUM, or LOW"
}

Return ONLY the JSON object, no additional text.`
    } else {
      return NextResponse.json({ error: "Invalid form type" }, { status: 400 })
    }

    // Call AI to extract data
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.1, // Low temperature for factual extraction
    })

    // Parse the AI response
    let extractedData
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedText = text.trim()
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7)
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3)
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3)
      }
      extractedData = JSON.parse(cleanedText.trim())
    } catch (parseError) {
      console.error("[v0] Failed to parse AI response:", text)
      return NextResponse.json({ 
        error: "Failed to process extracted data",
        rawResponse: text 
      }, { status: 500 })
    }

    // If this is a bungee-info-pack request, generate the formatted markdown document
    if (formType === "bungee-info-pack") {
      const infoPack = generateBungeeInfoPackMarkdown(extractedData, url)
      return NextResponse.json({ 
        success: true,
        data: extractedData,
        bungeeInfoPack: infoPack,
        scrapedContentLength: scrapedContent.length,
        confidence: extractedData.confidence || "UNKNOWN"
      })
    }

    return NextResponse.json({ 
      success: true,
      data: extractedData,
      scrapedContentLength: scrapedContent.length,
      confidence: extractedData.confidence || "UNKNOWN"
    })

  } catch (error) {
    console.error("[v0] Scrape API error:", error)
    return NextResponse.json({ 
      error: "Internal server error during extraction" 
    }, { status: 500 })
  }
}

// Generate formatted Bungee Info Pack markdown document
function generateBungeeInfoPackMarkdown(data: Record<string, unknown>, sourceUrl: string): string {
  const companyName = data.companyName || 'Company'
  const targetRole = data.targetRole || 'Open Position'
  
  return `# 🍊 BUNGEE INFO PACK
## ${companyName} - ${targetRole}

---

## 🏢 ABOUT THE COMPANY

${data.companyDescription || 'A growing company looking for talented individuals.'}

${data.companyTagline ? `**Mission:** ${data.companyTagline}` : ''}

### Services & Offerings
${Array.isArray(data.companyServices) ? data.companyServices.map((s: string) => `• ${s}`).join('\n') : '• Contact for details'}

### Company Culture
${data.companyCulture || 'Professional and growth-oriented environment'}

### Benefits
${Array.isArray(data.companyBenefits) && data.companyBenefits.length > 0 
  ? data.companyBenefits.map((b: string) => `✓ ${b}`).join('\n') 
  : '✓ Competitive compensation\n✓ Growth opportunities'}

### Locations
${Array.isArray(data.companyLocations) && data.companyLocations.length > 0 
  ? data.companyLocations.join(', ') 
  : 'Multiple locations available'}

---

## 💼 THE OPPORTUNITY: ${targetRole}

${data.roleDescription || `We're looking for a talented ${targetRole} to join our team.`}

### Requirements
${Array.isArray(data.roleRequirements) 
  ? data.roleRequirements.map((r: string) => `• ${r}`).join('\n') 
  : '• Relevant experience\n• Strong communication skills\n• Team player'}

### Why This Role?
${data.rolePerks || 'Great opportunity for career growth with a dynamic team.'}

---

## 🎯 YOUR 30-SECOND PITCH

> ${data.elevatorPitch || `"I know a great company called ${companyName} that's hiring for a ${targetRole} position. They're known for their excellent culture and growth opportunities. Would you be interested in learning more?"`}

---

## 💡 KEY TALKING POINTS

${Array.isArray(data.talkingPoints) 
  ? data.talkingPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n') 
  : `1. Growing company with strong reputation
2. Excellent team culture
3. Competitive compensation
4. Career advancement opportunities
5. Making a real impact`}

---

## 🛡️ HANDLING OBJECTIONS

${Array.isArray(data.objectionHandlers) && data.objectionHandlers.length > 0
  ? data.objectionHandlers.map((o: string) => `**Q:** Common concern\n**A:** ${o}`).join('\n\n')
  : `**"I'm happy where I am"**
→ "I understand! But it never hurts to explore what's out there. This could be an even better fit for your skills."

**"I don't have time"**
→ "The initial conversation is just 15 minutes. If it's not a fit, no worries - but you might find something amazing."

**"I don't know enough about them"**
→ "That's exactly why I wanted to connect you! Let me share what I know about their culture and opportunities."`}

---

## 👤 IDEAL CANDIDATE

${data.idealCandidateProfile || `Someone who is motivated, professional, and looking for growth opportunities in their career.`}

---

## 📎 QUICK REFERENCE

| Field | Info |
|-------|------|
| Company | ${companyName} |
| Role | ${targetRole} |
| Industry | ${Array.isArray(data.industryKeywords) ? data.industryKeywords.slice(0, 3).join(', ') : 'Various'} |
| Source | ${sourceUrl} |

---

*Generated by Bungee AI • Share this with confidence!*
`
}

