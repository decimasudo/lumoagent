import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { fetchQuoteData } from '@/lib/stocks'
import { analyzeStock } from '@/lib/openrouter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Menangkap tipe agen yang dikirim dari UI, default ke fundamental
    const { ticker, agentType = 'fundamental', model = 'google/gemini-2.0-flash-001' } = body

    if (!ticker || typeof ticker !== 'string') {
      return NextResponse.json({ success: false, error: 'Ticker is required' }, { status: 400 })
    }

    const tickerSymbol = ticker.toUpperCase().trim()
    console.log(`[API] Analyzing ${tickerSymbol} with ${agentType} agent...`)

    // 1. Ambil data mentah + kalkulasi kuantitatif
    console.log(`[API] Fetching stock data for ${tickerSymbol}...`);
    const stockData = await fetchQuoteData(tickerSymbol)
    console.log(`[API] Stock data fetched:`, stockData ? 'success' : 'null');

    if (!stockData) {
      // Inilah alasan Anda mendapatkan pesan error 404 sebelumnya
      return NextResponse.json({ 
         success: false, 
         error: `Failed to fetch stock data for ${tickerSymbol}. Please check if the ticker is valid (e.g., AAPL, BTC-USD).` 
      }, { status: 404 })
    }

    // 2. Lempar ke Agen AI
    const openRouterKey = process.env.OPENROUTER_API_KEY
    console.log(`[API] OpenRouter key present: ${!!openRouterKey}`);
    let aiAnalysis = ''

    if (openRouterKey) {
      console.log(`[API] Calling analyzeStock with model ${model}...`);
      aiAnalysis = await analyzeStock(tickerSymbol, stockData, openRouterKey, agentType, model)
      console.log(`[API] AI analysis completed`);
    } else {
      return NextResponse.json({ success: false, error: 'OpenRouter API Key is missing.' }, { status: 500 })
    }

    // 3. Simpan riwayat ke Supabase secara diam-diam (tidak menghentikan proses jika gagal)
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Sesuaikan nama tabel 'analysis_history' dengan milik Anda jika berbeda
        await supabase.from('analysis_history').insert({
          user_id: user.id,
          ticker: tickerSymbol,
          // Opsional: Anda bisa menambahkan kolom agent_type di Supabase nanti
          analysis_result: aiAnalysis
        })
      }
    } catch (dbError) {
      console.error("[API] Failed to save history to Supabase:", dbError)
    }

    // Mengirim kembali hasil ke UI
    return NextResponse.json({ success: true, analysis: aiAnalysis, data: stockData })

  } catch (error: any) {
    console.error('[API] Unexpected Error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}