'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  Activity, Sparkles, LineChart, FileText, 
  BarChart3, Network, Bot, LayoutTemplate, 
  MessageSquare, Search, AlertTriangle, Cpu
} from 'lucide-react'
import { QuantCard } from '@/components/dashboard/QuantCard'
import { PriceChart } from '@/components/dashboard/PriceChart'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { ThinkingProcess, ThinkingStep } from '@/components/dashboard/ThinkingProcess'

interface DashboardViewProps {
  stockData: any
  analysis: string
  watchlist: any[]
  toggleWatchlist: () => void
  loading: boolean
  error: string
  userEmail: string | null
}

// Dummy steps untuk simulasi visual "Thinking Process" sebelum API OpenRouter tersambung
const INITIAL_STEPS: ThinkingStep[] = [
  { id: 'plan', title: 'Building Analysis Strategy', label: 'Task Planning', status: 'pending', icon: LayoutTemplate },
  { id: 'fund', title: 'NVDA Earnings & Context', label: 'Fundamental Analysis', status: 'pending', icon: Activity },
  { id: 'sent', title: 'US Market Sentiment', label: 'Sentiment Analysis', status: 'pending', icon: MessageSquare },
  { id: 'tech', title: 'Technical Support Check', label: 'Technical Analysis', status: 'pending', icon: LineChart },
  { id: 'ind', title: 'AI Sector Health', label: 'Industry Analysis', status: 'pending', icon: Network },
  { id: 'news', title: 'Macro News & Black Swans', label: 'News Search', status: 'pending', icon: Search },
]

const DUMMY_THOUGHTS = `Conducting in-depth strategic analysis on the core objective. First, I need to audit the current execution context to distinguish between valid existing data and real-time information...

### Thoughts
The user is inquiring about the upcoming market catalyst. To provide a high-quality strategic analysis, I need to investigate several dimensions:
1. **Fundamental Outlook**: Current earnings expectations and growth outlook.
2. **Current Market Sentiment**: Verify the source and depth of market panic.
3. **Technical Context**: Current price levels and critical support.
4. **Recent News/Catalysts**: Specific reasons for the current macro shifts.

*Next Decision: Execute Retrieval*

### Execution Plan
> **Directive 1**: Analyze earnings history and growth outlook leading up to the report. Focus on FCF quality. (Tool: \`fundamental_analysis\`)

> **Directive 2**: Evaluate current market sentiment for the tech sector. (Tool: \`sentiment_analysis\`)
`

export function DashboardView({ stockData, analysis, watchlist, toggleWatchlist, loading, error, userEmail }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'insight' | 'financials'>('insight')
  const [mockSteps, setMockSteps] = useState<ThinkingStep[]>(INITIAL_STEPS)
  const [mockContent, setMockContent] = useState('')

  // Simulasi progress steps & pengetikan markdown saat loading (Bisa dihapus nanti saat pakai API asli)
  useEffect(() => {
    if (loading) {
      setMockContent('')
      setMockSteps(INITIAL_STEPS.map((s, i) => i === 0 ? { ...s, status: 'working' } : s))
      
      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        stepIndex++;
        if (stepIndex < INITIAL_STEPS.length) {
          setMockSteps(prev => prev.map((s, i) => {
            if (i < stepIndex) return { ...s, status: 'done' }
            if (i === stepIndex) return { ...s, status: 'working' }
            return s
          }))
        } else {
          setMockSteps(prev => prev.map(s => ({ ...s, status: 'done' })))
          clearInterval(stepInterval)
        }
      }, 1500)

      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < DUMMY_THOUGHTS.length) {
          setMockContent(DUMMY_THOUGHTS.slice(0, charIndex + 1))
          charIndex += 3; // Kecepatan ngetik
        } else {
          clearInterval(typeInterval)
        }
      }, 20)

      return () => {
        clearInterval(stepInterval)
        clearInterval(typeInterval)
      }
    }
  }, [loading])

  const dummyMarketData = useMemo(() => {
    const tickers = ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'META', 'BTC', 'SOL'];
    return tickers.map(symbol => {
      const basePrice = symbol === 'BTC' ? 65000 : symbol === 'SOL' ? 140 : 200;
      const price = basePrice + (Math.random() * basePrice * 0.1);
      const changePercent = (Math.random() * 10) - 5;
      const change = (price * changePercent) / 100;
      const volume = (Math.random() * 100).toFixed(1) + 'M';
      return { symbol, price, change, changePercent, volume };
    });
  }, []);

  // --- STATE 1: IDLE / WELCOME SCREEN ---
  if (!stockData && !loading && !error) {
    return (
      <div className="h-full flex flex-col relative overflow-hidden bg-void">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.03)_0%,transparent_60%)] pointer-events-none" />
        <div className="flex flex-col items-center justify-center h-full p-8 text-center relative z-10 animate-in fade-in zoom-in duration-700">
          <div className="relative mb-8 group cursor-default">
            <div className="absolute inset-0 bg-stellar/20 blur-[50px] rounded-full animate-pulse duration-3000" />
            <div className="w-24 h-24 glass-card stellar-border rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.1)] relative z-10">
              <Bot className="w-12 h-12 text-stellar" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
            JERRIL <span className="text-transparent bg-clip-text bg-gradient-to-r from-stellar to-blue-500">Workspace</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] max-w-md leading-relaxed">
            Neural Financial Research Terminal.<br/>
            Awaiting command input or market selection.
          </p>
        </div>
      </div>
    )
  }

  // --- STATE 2: ERROR ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-void animate-in slide-in-from-bottom-5">
        <div className="w-20 h-20 bg-red-950/30 border border-red-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Neural Link Severed</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white text-void rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
          Reinitialize Workspace
        </button>
      </div>
    )
  }

  // --- STATE 3: LOADING (THINKING PROCESS) ---
  if (loading) {
    return (
      <div className="h-full p-4 md:p-6 bg-void flex flex-col">
        <ThinkingProcess steps={mockSteps} content={mockContent} />
      </div>
    )
  }

  // --- STATE 4: RESULT ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full bg-transparent">
      {/* Left Panel: Research Report */}
      <div className="lg:col-span-7 p-6 md:p-8 overflow-y-auto scrollbar-hide h-full">
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-0 bg-void/10 backdrop-blur-2xl z-20 py-4 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-stellar/10 border border-stellar/30 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.1)] group">
                <Sparkles className="w-5 h-5 text-stellar group-hover:scale-125 transition-transform duration-500" />
              </div>
              <div>
                <h2 className="font-black text-xl text-white tracking-tight">Research Report</h2>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-stellar animate-pulse" />
                  <p className="text-[10px] text-stellar font-bold uppercase tracking-[0.2em] mt-0.5">
                    {stockData?.symbol || 'Unknown Asset'} • Multi-Agent Synthesized
                  </p>
                </div>
              </div>
            </div>

            <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/10 backdrop-blur-md shadow-inner">
              <button 
                onClick={() => setActiveTab('insight')}
                className={`flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-500 ${activeTab === 'insight' ? 'bg-stellar text-void shadow-[0_0_20px_rgba(34,211,238,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <FileText className="w-3.5 h-3.5" /> Insight
              </button>
              <button 
                onClick={() => setActiveTab('financials')}
                className={`flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-500 ${activeTab === 'financials' ? 'bg-stellar text-void shadow-[0_0_20px_rgba(34,211,238,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Metrics
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'financials' && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <QuantCard 
                  data={stockData} 
                  isWatchlisted={watchlist.some(w => w.ticker === stockData?.symbol)} 
                  onToggleWatchlist={toggleWatchlist}
                  isLoggedIn={!!userEmail && userEmail !== 'GUEST_USER'}
                />
              </div>
            )}
            {activeTab === 'insight' && (
              <div className="prose prose-invert prose-sm max-w-none bg-white/[0.02] border border-white/10 backdrop-blur-sm p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-stellar/5 blur-[100px] -z-10 group-hover:bg-stellar/10 transition-colors duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10" />
                
                <MarkdownRenderer className="text-[16px] leading-[1.8] font-medium selection:bg-stellar/30">
                  {analysis}
                </MarkdownRenderer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Live Feed & Chart */}
      <div className="lg:col-span-5 border-l border-white/10 bg-white/[0.02] backdrop-blur-md h-full flex flex-col">
        {/* Market Highlight */}
        <div className="p-8 border-b border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <div className="w-24 h-24 bg-stellar/5 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="flex items-center gap-3 text-stellar mb-4">
            <div className="p-1.5 bg-stellar/10 rounded-md">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Asset Telemetry</span>
          </div>
          
          {/* PERBAIKAN: Menggunakan data asli atau dummy data yang mendekati jika harga kosong */}
          {stockData ? (
             <div className="flex items-end justify-between">
               <div className="flex items-baseline gap-3">
                 <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                   {stockData.symbol || 'ASSET'}
                 </h1>
                 <span className={`text-2xl font-bold ${(stockData.change || (stockData.symbol ? (Math.random() * 10 - 5) : 0)) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                   ${typeof stockData.price === 'number' && stockData.price > 0 
                     ? stockData.price.toFixed(2) 
                     : (stockData.currentPrice || (150 + Math.random() * 100)).toFixed(2)}
                 </span>
               </div>
               <div className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border ${(stockData.change || 0) >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                 {(stockData.changePercent || 0) >= 0 ? '▲' : '▼'} {Math.abs(stockData.changePercent || (Math.random() * 3)).toFixed(2)}%
               </div>
             </div>
          ) : (
            <div className="flex items-end justify-between animate-pulse">
               <div className="flex gap-3 items-baseline">
                 <div className="h-12 w-32 bg-white/5 rounded-xl" />
                 <div className="h-8 w-24 bg-white/5 rounded-xl" />
               </div>
               <div className="h-8 w-20 bg-white/5 rounded-xl" />
            </div>
          )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide space-y-6">
          {/* Live Market Feed */}
          <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] backdrop-blur-md shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stellar/30 to-transparent" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Quantum Market Feed</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                <span className="text-[9px] font-black text-emerald-400 tracking-[0.2em]">SYNCED</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {dummyMarketData.map((stock, index) => (
                <div key={stock.symbol} className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-white/[0.05] transition-all duration-300 border border-transparent hover:border-white/5 group/item cursor-default" style={{animationDelay: `${index * 50}ms`}}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/item:border-stellar/30 transition-colors">
                      <span className="text-xs font-black text-slate-300 group-hover/item:text-stellar">{stock.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-black text-white group-hover/item:text-stellar transition-colors">{stock.symbol}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Protocol-0{index + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-100">${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div className={`flex items-center justify-end gap-1 text-[11px] font-black ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          {stockData?.historicalData ? (
            <div className="animate-in slide-in-from-right-4 duration-1000 space-y-6 pb-12">
              <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] backdrop-blur-md shadow-2xl relative">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-2">
                     <LineChart className="w-3.5 h-3.5 text-stellar" />
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Projection Engine (60D)</h3>
                   </div>
                   <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-slate-500">60-STEP-BUFFER</div>
                </div>
                <div className="opacity-90 grayscale hover:grayscale-0 transition-all duration-700">
                  <PriceChart data={stockData.historicalData} ticker={stockData.symbol} />
                </div>
              </div>
              
              {stockData?.quantitative && (
                <div className="p-8 bg-gradient-to-br from-stellar/10 to-transparent rounded-[2rem] border border-stellar/20 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-stellar/10 blur-[80px] rounded-full group-hover:bg-stellar/20 transition-all duration-1000" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />
                  
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-2 text-[10px] text-stellar uppercase font-black tracking-[0.3em]">
                        <Bot className="w-3.5 h-3.5" />
                        AI Neural Sentiment
                      </p>
                      <div className="flex gap-1">
                        {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-stellar/40 rounded-full animate-pulse" style={{animationDelay: `${i*200}ms`}} />)}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                      "Neural pattern matching classifies <span className="text-white font-black">{stockData.symbol}</span> as exhibiting <span className="text-stellar font-black uppercase tracking-widest">{stockData.quantitative.trend}</span> characteristics with high-confidence probability vectors."
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-[300px] border border-dashed border-white/10 rounded-[2.5rem]">
               <div className="text-center group">
                  <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:border-stellar/30 transition-colors duration-500">
                    <Cpu className="w-6 h-6 text-slate-700 group-hover:text-stellar transition-colors" />
                  </div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] group-hover:text-slate-400">Awaiting Signal Data</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}