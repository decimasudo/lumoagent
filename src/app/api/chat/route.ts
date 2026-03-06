import { NextRequest, NextResponse } from 'next/server'
import { fetchQuoteData } from '@/lib/stocks'

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Enhanced fetch with retries (internal simplified version of lib/openrouter)
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 || response.status >= 502) {
         throw new Error(`HTTP ${response.status}`);
      }
      return response;
    } catch (err: any) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  throw new Error("fetchWithRetry: exhausted retries");
}

function extractTickerFromPrompt(prompt: string): string | null {
  const parentheticalMatch = prompt.match(/\(([A-Z0-9.\-]+)\)/i);
  if (parentheticalMatch) return parentheticalMatch[1].toUpperCase();

  const words = prompt.split(/[\s,!?]+/); 
  const uppercaseWord = words.find(w => /^[A-Z0-9.\-]{2,8}$/.test(w) && !['WHO', 'WHAT', 'WHEN', 'WHERE', 'WHY', 'HOW', 'AND', 'THE', 'FOR', 'NOT', 'YES', 'BUY', 'SELL', 'HOLD'].includes(w.toUpperCase()));
  
  if (uppercaseWord) return uppercaseWord.toUpperCase();
  
  // Only return full string if it looks like a ticker (short, no spaces)
  if (/^[A-Z0-9.\-]{2,8}$/.test(prompt.trim())) {
      return prompt.trim().toUpperCase();
  }
  
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: 'Messages required' }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]
    const ticker = extractTickerFromPrompt(lastMessage.content)
    
    let systemPrompt = `You are Jerril, an elite AI-powered Quantitative Financial Research Terminal.

    STRICT OPERATIONAL RULES:
    1. You ONLY answer questions about: stocks, financial markets, economic indicators, investment analysis, crypto assets, and macroeconomics.
    2. For ANY non-financial query, respond ONLY with: "This terminal is dedicated exclusively to financial market analysis. Please submit a market-related query."
    3. Structure ALL responses using these exact sections (when applicable):
       ## Market Summary
       ## Price Analysis
       ## Key News & Catalysts
       ## Technical Indicators
       ## Risk Assessment
       ## Analyst Outlook
    4. Use **bold** for all data points, percentages, price levels, and key metrics.
    5. STRICTLY NO EMOJIS. Be data-driven, precise, and Bloomberg Terminal-style.
    6. When real-time data is provided below, lead with it. When unavailable, use your training knowledge and clearly state the data may not reflect current prices.
    `

    if (ticker) {
      console.log(`[Chat API] Detected ticker: ${ticker}`)
      const stockData = await fetchQuoteData(ticker)
      if (stockData) {
        systemPrompt += `\n\n[REAL-TIME MARKET DATA FOR ${ticker}]:
        - Price: $${stockData.currentPrice}
        - Market Cap: $${stockData.marketCap}
        - PE Ratio: ${stockData.peRatio}
        - 52W High/Low: $${stockData.week52High} / $${stockData.week52Low}
        - SMA20: ${stockData.quantitative?.sma20}
        - Volatility: ${stockData.quantitative?.volatility}
        - Risk Level: ${stockData.quantitative?.riskLevel}
        
        Use this data to answer the user's request accurately.`
      }
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY
    const cleanApiKey = openRouterKey?.replace(/[\r\n\s]+/g, '')

    const response = await fetchWithRetry(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cleanApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
            { role: "system", content: systemPrompt },
            ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    const data = await response.json()
    const aiMessage = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response at this time."

    return NextResponse.json({ success: true, message: aiMessage })

  } catch (error: any) {
    console.error('[Chat API] Error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
