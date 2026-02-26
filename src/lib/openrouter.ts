// src/lib/openrouter.ts

export async function analyzeStock(ticker: string, stockData: any, apiKey: string, agentType: string, selectedModel: string = "anthropic/claude-3-haiku") {
  
  let systemPrompt = "";
  
  const baseRules = `
    STRICT RULES:
    1. STRICTLY NO EMOJIS. Do not use any emojis, unicode icons, or graphical symbols under any circumstances.
    2. Tone: Highly professional, academic, objective, and institutional (like a Bloomberg or Goldman Sachs report).
    3. Formatting: Use clear Markdown. Use **bold** for key metrics, risk factors, and important terms. Use bullet points for lists.
    4. Structure: Use Header 3 (###) for main sections.
  `;

  if (agentType === 'technical') {
    systemPrompt = `You are an elite Quantitative & Technical Trading Analyst. 
    Your core directive: Analyze the price action, volatility, moving averages, statistical risk levels, and recent news catalysts. 
    Do not focus on long-term company fundamentals. 
    
    ${baseRules}
    
    Required Output Structure:
    ### 1. Quantitative Overview
    ### 2. Volatility & Momentum Analysis
    ### 3. News & Catalyst Impact (Briefly assess if recent news explains the current price action)
    ### 4. Risk Management Strategy
    ### 5. Technical Verdict (Buy/Sell/Hold with defined zones)
    `;
  } else {
    systemPrompt = `You are an elite Value Investing & Fundamental Analyst.
    Your core directive: Analyze intrinsic value, valuation multiples (P/E), market cap, yields, macroeconomic positioning, and recent news.
    Do not focus on short-term chart patterns.
    
    ${baseRules}
    
    Required Output Structure:
    ### 1. Fundamental Overview
    ### 2. Valuation Analysis
    ### 3. Recent News & Market Catalysts (Analyze the impact of the latest headlines)
    ### 4. Long-term Risk Assessment
    ### 5. Investment Verdict (Undervalued/Fairly Valued/Overvalued)
    `;
  }

  // Merakit teks berita agar mudah dibaca oleh AI
  let newsText = "No recent news available.";
  if (stockData.news && stockData.news.length > 0) {
    newsText = stockData.news.map((n: any) => `- "${n.title}" (Source: ${n.publisher})`).join('\n');
  }

  const userPrompt = `
  Please provide a comprehensive analysis for the following asset: **${ticker}** (${stockData.companyName})

  **Market Data:**
  - Current Price: $${stockData.currentPrice}
  - 52-Week High: $${stockData.week52High}
  - 52-Week Low: $${stockData.week52Low}
  - Market Cap: $${stockData.marketCap}
  - P/E Ratio: ${stockData.peRatio || 'N/A'}
  - EPS: ${stockData.eps || 'N/A'}
  - Dividend Yield: ${stockData.dividendYield ? (stockData.dividendYield * 100).toFixed(2) + '%' : 'N/A'}

  **Quantitative Indicators (Last 30 Days):**
  - 20-Day SMA: $${stockData.quantitative?.sma20?.toFixed(2) || 'N/A'}
  - 30-Day Volatility (Std Dev): ${stockData.quantitative?.volatility?.toFixed(2) || 'N/A'}
  - Calculated Risk Level: ${stockData.quantitative?.riskLevel || 'Unknown'}

  **Recent News Headlines (Catalysts):**
  ${newsText}
  `;

  // Membersihkan API Key dari spasi atau karakter enter tersembunyi untuk mencegah ECONNRESET
  const cleanApiKey = apiKey.replace(/[\r\n\s]+/g, '');

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cleanApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://quantai.vercel.app", 
        "X-Title": "QuantAI Terminal"
      },
      body: JSON.stringify({
        model: selectedModel, 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("[OpenRouter] Detailed Fetch Error:", error.message);
    if (error.cause) {
       console.error("[OpenRouter] Network Cause:", error.cause);
    }
    throw new Error(`Connection to AI server failed: ${error.message}`);
  }
}