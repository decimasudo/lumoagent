import { StockData } from '@/types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface OpenRouterMessage {
  role: 'system' | 'user'
  content: string
}

interface AnalysisPromptParams {
  ticker: string
  stockData: StockData
}

export function buildAnalysisPrompt({ ticker, stockData }: AnalysisPromptParams): OpenRouterMessage[] {
  const systemPrompt: OpenRouterMessage = {
    role: 'system',
    content: `You are a professional financial analyst with expertise in quantitative analysis and risk management. Your role is to provide clear, actionable insights about stocks based on the provided financial data.

When analyzing stock data, you should cover:
1. Company Overview - Brief description of the company and its business
2. Quantitative Analysis - Interpretation of key metrics (P/E, Market Cap, EPS, etc.)
3. Risk Assessment - Volatility analysis, potential risks, and concerns
4. Investment Strategy - Bullish, Neutral, or Bearish recommendation with reasoning

Always provide balanced, evidence-based analysis. Include specific numbers from the data when making points.
Format your response using clear headings and bullet points for readability.
Keep your analysis concise but informative (300-500 words).`
  }

  const userPrompt: OpenRouterMessage = {
    role: 'user',
    content: `Analyze the following stock data for ${ticker} (${stockData.companyName}):

**Current Market Data:**
- Current Price: $${stockData.currentPrice.toFixed(2)}
- Market Cap: $${formatMarketCap(stockData.marketCap)}
- P/E Ratio: ${stockData.peRatio?.toFixed(2) || 'N/A'}
- EPS (TTM): $${stockData.eps?.toFixed(2) || 'N/A'}
- Dividend Yield: ${stockData.dividendYield ? (stockData.dividendYield * 100).toFixed(2) + '%' : 'N/A'}
- 52-Week Range: $${stockData.week52Low?.toFixed(2)} - $${stockData.week52High?.toFixed(2)}
- Daily Volume: ${formatVolume(stockData.volume)}
- Sector: ${stockData.sector}
- Industry: ${stockData.industry}

Please provide a comprehensive analysis covering company overview, quantitative metrics interpretation, risk assessment, and investment strategy recommendation.`
  }

  return [systemPrompt, userPrompt]
}

function formatMarketCap(value: number): string {
  if (!value) return 'N/A'
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

function formatVolume(value: number): string {
  if (!value) return 'N/A'
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
  return value.toLocaleString()
}

export async function analyzeStock(
  ticker: string,
  stockData: StockData,
  apiKey: string
): Promise<string> {
  const messages = buildAnalysisPrompt({ ticker, stockData })

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://quantai.app',
        'X-Title': 'QuantAI',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter API error:', error)
      throw new Error('Failed to get AI analysis')
    }

    const data = await response.json()

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from AI')
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error('Error in AI analysis:', error)
    throw error
  }
}
