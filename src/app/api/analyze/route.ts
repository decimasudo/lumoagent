import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { fetchQuoteData } from '@/lib/stocks'
import { analyzeStock } from '@/lib/openrouter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticker } = body

    if (!ticker || typeof ticker !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Ticker is required' },
        { status: 400 }
      )
    }

    const tickerSymbol = ticker.toUpperCase().trim()

    // Validate ticker format (1-5 uppercase letters)
    if (!/^[A-Z]{1,5}$/.test(tickerSymbol)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ticker format' },
        { status: 400 }
      )
    }

    // Fetch stock data
    const stockData = await fetchQuoteData(tickerSymbol)

    if (!stockData) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch stock data. Please check the ticker symbol.' },
        { status: 404 }
      )
    }

    // Get OpenRouter API key from environment
    const openRouterKey = process.env.OPENROUTER_API_KEY

    let aiAnalysis = ''

    if (openRouterKey) {
      // Perform AI analysis
      aiAnalysis = await analyzeStock(tickerSymbol, stockData, openRouterKey)
    } else {
      // Fallback: Generate basic analysis without AI
      aiAnalysis = generateBasicAnalysis(stockData)
    }

    // Get Supabase client and user (if authenticated)
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    let analysisRecord = null

    // If user is authenticated, save to database
    if (session?.user) {
      const { data, error } = await supabase
        .from('analyses')
        .insert({
          user_id: session.user.id,
          ticker: stockData.symbol,
          company_name: stockData.companyName,
          stock_data: stockData,
          ai_analysis: aiAnalysis,
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving analysis:', error)
      } else {
        analysisRecord = data
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: analysisRecord?.id || `local-${Date.now()}`,
        userId: session?.user?.id || null,
        ticker: stockData.symbol,
        companyName: stockData.companyName,
        stockData,
        aiAnalysis,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during analysis' },
      { status: 500 }
    )
  }
}

function generateBasicAnalysis(stockData: any): string {
  const { currentPrice, peRatio, dividendYield, week52High, week52Low, volume, sector } = stockData

  let pricePosition = ''
  const range = week52High - week52Low
  const position = ((currentPrice - week52Low) / range) * 100

  if (position > 75) pricePosition = 'near its 52-week high'
  else if (position < 25) pricePosition = 'near its 52-week low'
  else pricePosition = 'in the middle of its 52-week range'

  return `# ${stockData.companyName} (${stockData.symbol}) Analysis

## Company Overview
${stockData.companyName} is a company in the ${sector} sector operating in the ${stockData.industry} industry.

## Quantitative Analysis
- **Current Price**: $${currentPrice.toFixed(2)} - trading ${pricePosition}
- **P/E Ratio**: ${peRatio ? peRatio.toFixed(2) : 'N/A'} - ${peRatio ? (peRatio < 15 ? 'Potentially undervalued' : peRatio > 25 ? 'Premium valuation' : 'Fair valuation') : 'P/E not available'}
- **Dividend Yield**: ${dividendYield ? (dividendYield * 100).toFixed(2) + '%' : 'No dividend'}
- **Market Cap**: ${formatMarketCap(stockData.marketCap)}

## Risk Assessment
- **Volatility**: Trading ${pricePosition} suggests ${position > 75 ? 'recent strength but could face resistance' : position < 25 ? 'potential value opportunity but may have underlying concerns' : 'moderate volatility'}
- **Volume**: Daily volume of ${formatVolume(volume)} indicates ${volume > 1000000 ? 'good liquidity' : 'moderate liquidity'}

## Investment Strategy
**Recommendation**: Hold/Neutral

The stock appears to be ${pricePosition}. P/E ratio suggests ${peRatio ? (peRatio < 15 ? 'potentially good value' : 'premium valuation') : 'neutral'}. Consider monitoring for entry points around support levels.

*Note: This is basic automated analysis. For comprehensive research, please consult financial advisors.*`
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
