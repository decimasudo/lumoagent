import { NextRequest, NextResponse } from 'next/server'
import * as http from 'http'
import * as https from 'https'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MAX_RETRIES = 3
const TIMEOUT_MS = 30_000

// Create an agent that forces IPv4 to bypass broken IPv6 routing for OpenRouter
const httpsAgent = new https.Agent({ family: 4 })

/**
 * Custom fetcher using legacy https module to force IPv4
 */
async function nativeHttpsFetch(url: string, options: any): Promise<any> {
  const parsedUrl = new URL(url)
  const requestOptions = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.pathname + parsedUrl.search,
    method: options.method || 'GET',
    headers: options.headers || {},
    family: 4, // Force IPv4
    timeout: TIMEOUT_MS
  }

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        resolve({
          ok: res.statusCode && res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          statusText: res.statusMessage,
          text: async () => data,
          json: async () => JSON.parse(data)
        })
      })
    })

    req.on('error', (err) => reject(err))
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request Timeout'))
    })

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body))
    }
    req.end()
  })
}

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      console.log(`[Skill Chat API] Attempt ${attempt}/${retries} to call OpenRouter API (forcing IPv4)`)
      
      // Use nativeHttpsFetch instead of global fetch to guarantee IPv4
      const response = await nativeHttpsFetch(url, { 
        ...options, 
        signal: controller.signal
      }) as any
      
      clearTimeout(timer)
      return response
    } catch (err: any) {
      clearTimeout(timer)
      console.error(`[Skill Chat API] Fetch attempt ${attempt} failed:`, {
        error: err.message,
        code: err.code,
        name: err.name,
        stack: err.stack?.substring(0, 200)
      })

      // Don't retry on certain non-transient configuration or environment errors
      const isNonRetryable =
        err.code === 'ENOTFOUND' || // DNS resolution failed
        err.code === 'ECONNREFUSED' || // Connection refused
        err.code === 'EHOSTUNREACH' || // Host unreachable
        err.code === 'ENETUNREACH'; // Network unreachable

      if (isNonRetryable) {
        console.error('[Skill Chat API] Non-retryable network error detected, failing immediately')
        throw new Error(`Network connectivity issue: ${err.message}`)
      }

      // Treat "fetch failed" as transient and ALWAYS retry it unless exhausted
      const isTransient =
        err.code === 'ECONNRESET' || 
        err.code === 'ETIMEDOUT' ||
        err.name === 'AbortError' ||
        err.message === 'fetch failed' || 
        err.name === 'TypeError'; // undici/node fetch often throws TypeError

      if (!isTransient || attempt === retries) {
        console.error('[Skill Chat API] Final attempt failed or non-transient error')
        throw err
      }

      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000)
      console.log(`[Skill Chat API] Retrying in ${delay}ms...`)
      await new Promise((r) => setTimeout(r, delay))
    }
  }
  throw new Error('fetchWithRetry: exhausted retries')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, skillName, skillDescription, skillCategory, skillSlug } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, error: 'Messages array is required' }, { status: 400 })
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY
    if (!openRouterKey) {
      console.error('[Skill Chat API] OPENROUTER_API_KEY environment variable is not set')
      return NextResponse.json({ success: false, error: 'OpenRouter API Key is missing.' }, { status: 500 })
    }

    const cleanApiKey = openRouterKey.replace(/[\r\n\s]+/g, '')

    // Check API key format
    if (!cleanApiKey.startsWith('sk-or-v1-')) {
      console.error('[Skill Chat API] Invalid API key format - does not start with sk-or-v1-')
      return NextResponse.json({
        success: false,
        error: 'Invalid OpenRouter API key format. Please check your OPENROUTER_API_KEY environment variable.'
      }, { status: 500 })
    }

    console.log('[Skill Chat API] API key validation passed')

    console.log('[Skill Chat API] Processing request for skill:', { skillName, skillSlug, messageCount: messages.length })

    // Custom system prompts per specific skill slug or category
    let skillSpecificInstruction = ''
    if (skillSlug === 'market-researcher') {
      skillSpecificInstruction = 'Focus heavily on real-time news, sentiment shifts, and macroeconomic data points. Use a "Market Analyst" persona.'
    } else if (skillSlug === 'warren-intelligence') {
      skillSpecificInstruction = 'Adopt the mindset of a value investor. Focus on intrinsic value, moats, cash flow sustainability, and long-term margins.'
    } else if (skillSlug === 'news-sentiment') {
      skillSpecificInstruction = 'Focus on news headlines sentiment scoring. Categorize news as BULLISH, BEARISH, or NEUTRAL. Explain the probable price impact based on news intensity.'
    } else if (skillSlug === 'momentum-quant') {
      skillSpecificInstruction = 'Technical breakout specialized agent. Discuss RSI, MACD, and volume confirmation. Identify overbought/oversold conditions clearly.'
    } else if (skillCategory === 'Finance') {
      skillSpecificInstruction = 'Use strictly quantitative language. Reference tickers in [TICKER] format and provide data in tables.'
    } else if (skillCategory === 'AI & LLMs') {
      skillSpecificInstruction = 'Explain the token usage, logic chaining, and model reasoning for the requested task.'
    }

    // Build a system prompt that simulates the skill being active
    const safeSkillName = skillName.replace(/[^a-zA-Z0-9\s\-_]/g, '').trim() || 'Unknown Skill'
    const systemPrompt = `You are simulating the "${safeSkillName}" skill — a specialized AI agent in the Jerril financial intelligence platform.

Skill Description: ${skillDescription}
Skill Category: ${skillCategory}
${skillSpecificInstruction}

You are running inside a sandbox "Test Drive" environment. The user is testing what this skill can do.
- Act as if this skill is fully active and operational.
- Respond with professional, structured insights relevant to the skill's domain.
- Keep responses concise yet insightful. Use markdown formatting.
- STRICTLY NO emojis.
- Do NOT mention that you are an AI model or part of OpenRouter. You ARE the "${safeSkillName}" skill itself.`

    console.log('[Skill Chat API] Making API call to OpenRouter...')
    const response = await fetchWithRetry(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://jerril.vercel.app',
        'X-Title': 'Jerril Skill Test Drive'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.4,
        max_tokens: 800
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Skill Chat API] OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText.substring(0, 500), // Limit error text length
        skillName,
        skillSlug
      })
      throw new Error(`OpenRouter API HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'No response generated.'

    return NextResponse.json({ success: true, reply })
  } catch (error: any) {
    console.error('[Skill Chat API] Final error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack?.substring(0, 300)
    })

    // Provide user-friendly error messages
    let userFriendlyError = 'An unexpected error occurred while processing your request.'

    if (error.message?.includes('Network connectivity issue')) {
      userFriendlyError = 'Unable to connect to the AI service. Please check your internet connection and try again.'
    } else if (error.message?.includes('OpenRouter API HTTP')) {
      const statusMatch = error.message.match(/HTTP (\d+):/)
      const statusCode = statusMatch ? parseInt(statusMatch[1]) : null

      if (statusCode === 401) {
        userFriendlyError = 'Invalid API key. Please check your OpenRouter API key configuration.'
      } else if (statusCode === 429) {
        userFriendlyError = 'Too many requests. Please wait a moment and try again.'
      } else if (statusCode === 500) {
        userFriendlyError = 'The AI service is temporarily unavailable. Please try again later.'
      } else if (statusCode && statusCode >= 400 && statusCode < 500) {
        userFriendlyError = 'Request error. Please check your input and try again.'
      } else {
        userFriendlyError = 'AI service error. Please try again later.'
      }
    } else if (error.message?.includes('fetch failed') || error.code === 'ENOTFOUND') {
      userFriendlyError = 'Cannot connect to the AI service. Please check your internet connection.'
    } else if (error.name === 'AbortError') {
      userFriendlyError = 'Request timed out. The AI service took too long to respond.'
    }

    return NextResponse.json({
      success: false,
      error: userFriendlyError,
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
