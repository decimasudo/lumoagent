import { StockData } from '@/types'

// Yahoo Finance API endpoint
const YAHOO_FINANCE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/'

export async function fetchStockData(ticker: string): Promise<StockData | null> {
  try {
    const response = await fetch(
      `${YAHOO_FINANCE_URL}${ticker.toUpperCase()}?interval=1d&range=5d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    if (!response.ok) {
      console.error('Yahoo Finance API error:', response.status)
      return null
    }

    const data = await response.json()

    if (!data.chart?.result?.[0]) {
      return null
    }

    const result = data.chart.result[0]
    const meta = result.meta
    const quote = result.indicators?.quote?.[0]

    // Get company info from meta or use ticker as fallback
    const companyName = meta.shortName || meta.symbol || ticker.toUpperCase()

    return {
      symbol: meta.symbol,
      companyName: companyName,
      currentPrice: meta.regularMarketPrice || 0,
      marketCap: meta.marketCap || 0,
      peRatio: meta.trailingPE || 0,
      eps: meta.epsTrailingTwelveMonths || 0,
      dividendYield: meta.dividendYield || 0,
      week52High: meta.fiftyTwoWeekHigh || 0,
      week52Low: meta.fiftyTwoWeekLow || 0,
      volume: meta.regularMarketVolume || 0,
      sector: meta.sector || 'Unknown',
      industry: meta.industry || 'Unknown',
    }
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return null
  }
}

// Alternative: Use a simpler endpoint for basic quote data
export async function fetchQuoteData(ticker: string): Promise<StockData | null> {
  try {
    // Using Yahoo Finance quote endpoint
    const response = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker.toUpperCase()}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data.quoteResponse?.result?.[0]) {
      return null
    }

    const quote = data.quoteResponse.result[0]

    return {
      symbol: quote.symbol,
      companyName: quote.shortName || quote.longName || quote.symbol,
      currentPrice: quote.regularMarketPrice || 0,
      marketCap: quote.marketCap || 0,
      peRatio: quote.trailingPE || 0,
      eps: quote.epsTrailingTwelveMonths || 0,
      dividendYield: quote.dividendYield || 0,
      week52High: quote.fiftyTwoWeekHigh || 0,
      week52Low: quote.fiftyTwoWeekLow || 0,
      volume: quote.regularMarketVolume || 0,
      sector: quote.sector || 'Unknown',
      industry: quote.industry || 'Unknown',
    }
  } catch (error) {
    console.error('Error fetching quote data:', error)
    return null
  }
}
