// src/lib/stocks.ts

// Variabel global untuk menyimpan sesi auth Yahoo sementara di memori server
let globalCookie = '';
let globalCrumb = '';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// Fungsi untuk menembus proteksi 401 Yahoo Finance
async function getYahooAuth() {
  // Gunakan cache jika token masih ada
  if (globalCrumb && globalCookie) return { cookie: globalCookie, crumb: globalCrumb };
  
  try {
    // 1. Menyamar dan mengambil Cookie pertama
    const cookieRes = await fetch('https://fc.yahoo.com', {
      headers: { 'User-Agent': USER_AGENT },
      cache: 'no-store'
    });
    
    const setCookie = cookieRes.headers.get('set-cookie');
    if (setCookie) {
      globalCookie = setCookie.split(';')[0];
    }

    // 2. Menggunakan Cookie untuk meminta token 'Crumb'
    const crumbRes = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
      headers: { 
        'User-Agent': USER_AGENT, 
        'Cookie': globalCookie 
      },
      cache: 'no-store'
    });
    
    globalCrumb = await crumbRes.text();
  } catch (error) {
    console.error('[Auth] Gagal mengambil Yahoo Crumb:', error);
  }
  
  return { cookie: globalCookie, crumb: globalCrumb };
}

export async function fetchQuoteData(ticker: string): Promise<any | null> {
  try {
    const symbol = ticker.toUpperCase().trim();
    
    // Ambil tiket masuk (Cookie & Crumb) sebelum meminta data
    const { cookie, crumb } = await getYahooAuth();

    const headers = {
      'User-Agent': USER_AGENT,
      'Cookie': cookie,
      'Accept': 'application/json'
    };

    // 1. MENGAMBIL DATA FUNDAMENTAL (Sekarang anti 401 karena ada crumb & cookie)
    const quoteUrl = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbol}&crumb=${crumb}`;
    const quoteRes = await fetch(quoteUrl, { headers, cache: 'no-store' });
    
    if (!quoteRes.ok) {
      throw new Error(`Fundamental API returned status: ${quoteRes.status}`);
    }
    
    const quoteData = await quoteRes.json();
    const quote = quoteData.quoteResponse?.result?.[0];

    if (!quote) {
      return null; // Ticker tidak ditemukan
    }

    // 2. MENGAMBIL DATA HISTORIS 30 HARI UNTUK KALKULASI KUANTITATIF
    const chartUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=30d&crumb=${crumb}`;
    const chartRes = await fetch(chartUrl, { headers, cache: 'no-store' });
    
    let sma20 = 0;
    let volatility = 0;
    let riskLevel = 'Unknown';

    if (chartRes.ok) {
      const chartData = await chartRes.json();
      const result = chartData.chart?.result?.[0];
      const closePrices = result?.indicators?.quote?.[0]?.close?.filter((p: number | null) => p !== null) || [];

      if (closePrices.length > 0) {
        // Kalkulasi Matematika
        const sum = closePrices.reduce((a: number, b: number) => a + b, 0);
        sma20 = sum / closePrices.length;
        const mean = sma20;
        const variance = closePrices.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / closePrices.length;
        volatility = Math.sqrt(variance);
        riskLevel = volatility > (mean * 0.05) ? 'High' : 'Low';
      }
    }

    // 3. MENGAMBIL BERITA TERBARU (FITUR DEEP RESEARCH)
    let recentNews: any[] = [];
    try {
      // Endpoint pencarian Yahoo untuk mengambil berita terkait ticker
      const newsUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${symbol}&quotesCount=0&newsCount=5`;
      const newsRes = await fetch(newsUrl, { headers, cache: 'no-store' });
      
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        // Memfilter dan mengambil 5 berita teratas
        recentNews = (newsData.news || []).map((item: any) => ({
          title: item.title,
          publisher: item.publisher,
          link: item.link
        }));
      }
    } catch (newsError) {
      console.error(`[stocks.ts] Failed to fetch news for ${symbol}:`, newsError);
    }

    // 4. MERAKIT DATA (Ditambahkan array 'news')
    return {
      symbol: quote.symbol,
      companyName: quote.shortName || quote.longName || symbol,
      currentPrice: quote.regularMarketPrice || 0,
      marketCap: quote.marketCap || 0,
      peRatio: quote.trailingPE || 0,
      eps: quote.epsTrailingTwelveMonths || 0,
      dividendYield: quote.dividendYield || 0,
      week52High: quote.fiftyTwoWeekHigh || 0,
      week52Low: quote.fiftyTwoWeekLow || 0,
      volume: quote.regularMarketVolume || 0,
      quantitative: {
        sma20,
        volatility,
        riskLevel
      },
      news: recentNews // Data berita diselipkan di sini untuk diakses OpenRouter
    };

  } catch (error: any) {
    console.error(`[stocks.ts] Native Fetch Error for ${ticker}:`, error.message);
    return null;
  }
}