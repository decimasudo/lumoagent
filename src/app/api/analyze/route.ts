import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { fetchQuoteData } from '@/lib/stocks'
import { analyzeStock } from '@/lib/openrouter'

/**
 * Fungsi untuk mengekstrak simbol saham (Ticker) dari kalimat bahasa natural (Prompt).
 * Contoh: "Analyze Apple's (AAPL) short-term trend" -> menghasilkan "AAPL"
 * Contoh: "Compare BTC-USD today" -> menghasilkan "BTC-USD"
 */
function extractTickerFromPrompt(prompt: string): string {
  // 1. Cek apakah ada ticker di dalam kurung: e.g. "What about (AAPL)?" -> "AAPL"
  const parentheticalMatch = prompt.match(/\(([A-Z0-9.\-]+)\)/i);
  if (parentheticalMatch) {
    return parentheticalMatch[1].toUpperCase();
  }

  // 2. Jika tidak ada kurung, cari kata yang seluruhnya huruf besar (panjang 2-8 karakter)
  // Cocok untuk: "Analyze MSFT please" atau "Compare BTC-USD today"
  // Abaikan kata-kata bahasa Inggris umum yang sering diketik kapital penuh seperti "I", "A", dsb.
  const words = prompt.split(/[\s,!?]+/); 
  const uppercaseWord = words.find(w => /^[A-Z0-9.\-]{2,8}$/.test(w));
  if (uppercaseWord) {
    return uppercaseWord.toUpperCase();
  }

  // 3. Fallback: Anggap keseluruhan prompt adalah ticker jika sangat pendek
  // (misal user memang hanya mengetik "NVDA")
  return prompt.trim().toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Tangkap "ticker" DAN "customPrompt" dari UI
    const { ticker = '', customPrompt = '', agentType = 'fundamental', model: bodyModel = '' } = body

    // Tentukan model: prioritas dari body, fallback ke default yang aman
    const model = bodyModel || 'google/gemini-2.5-flash-lite'

    // Gunakan customPrompt jika ada, jika tidak gunakan ticker.
    const promptText = (customPrompt || ticker).trim()

    if (!promptText) {
      console.log(`[API] Error: Prompt is required. Body received:`, body);
      return NextResponse.json({ success: false, error: 'Prompt or ticker is required' }, { status: 400 })
    }

    // Ekstrak simbol saham dari kalimat input user
    const tickerSymbol = extractTickerFromPrompt(promptText);
    
    console.log(`[API] Original Prompt: "${promptText}"`);
    console.log(`[API] Extracted Ticker: ${tickerSymbol} | Analyzing with ${agentType} agent...`);

    // 1. Ambil data mentah + kalkulasi kuantitatif menggunakan ticker hasil ekstrak
    console.log(`[API] Fetching stock data for ${tickerSymbol}...`);
    const stockData = await fetchQuoteData(tickerSymbol);
    console.log(`[API] Stock data fetched:`, stockData ? 'success' : 'null');

    if (!stockData) {
      return NextResponse.json({ 
         success: false, 
         error: `Failed to fetch stock data for ${tickerSymbol}. Please check if the asset is valid (e.g., AAPL, BTC-USD).` 
      }, { status: 404 })
    }

    // 2. Lempar ke Agen AI
    const openRouterKey = process.env.OPENROUTER_API_KEY
    console.log(`[API] OpenRouter key present: ${!!openRouterKey}`);
    let aiAnalysis = ''

    if (openRouterKey) {
      try {
        console.log(`[API] Calling analyzeStock with model ${model}...`);
        
        // Catatan: Jika suatu saat fungsi analyzeStock Anda diupdate agar bisa menerima prompt asli, 
        // Anda bisa passing variabel `promptText` juga ke dalamnya.
        aiAnalysis = await analyzeStock(tickerSymbol, stockData, openRouterKey, agentType, model)
        
        console.log(`[API] AI analysis completed`);
      } catch (aiError: any) {
        console.error(`[API] AI analysis failed: ${aiError.message}`);
        aiAnalysis = 'AI analysis is currently unavailable due to a connection issue. Please try again later or check your network connection.';
      }
    } else {
      aiAnalysis = 'OpenRouter API Key is missing. AI analysis is not available.';
    }

    // 3. Simpan riwayat ke Supabase secara diam-diam
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Create a new chat session for this analysis
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .insert({
            user_id: user.id,
            title: `Analysis: ${tickerSymbol}`
          })
          .select()
          .single()

        if (!chatError && chatData) {
          // Store both user prompt and assistant response
          await supabase.from('messages').insert([
            {
              chat_id: chatData.id,
              role: 'user',
              content: promptText
            },
            {
              chat_id: chatData.id,
              role: 'assistant',
              content: aiAnalysis
            }
          ])
        }
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