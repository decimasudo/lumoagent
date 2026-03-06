'use client'

import { useState, useMemo } from 'react'
import { 
  Activity, Sparkles, LineChart, FileText, 
  BarChart3, Network, TrendingUp, TrendingDown, Clock
} from 'lucide-react'
import { QuantCard } from '@/components/dashboard/QuantCard'
import { PriceChart } from '@/components/dashboard/PriceChart'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

interface DashboardViewProps {
  stockData: any
  analysis: string
  watchlist: any[]
  toggleWatchlist: () => void
  loading: boolean
  error: string
}

export function DashboardView({ stockData, analysis, watchlist, toggleWatchlist, loading, error }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'insight' | 'financials'>('insight')

  const dummyMarketData = useMemo(() => {
    const tickers = ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'META', 'NFLX', 'BTC', 'ETH', 'SOL', 'AMD'];
    return tickers.map(symbol => {
      const basePrice = symbol === 'BTC' ? 65000 : symbol === 'ETH' ? 3500 : symbol === 'SOL' ? 140 : 200;
      const price = basePrice + (Math.random() * basePrice * 0.1);
      const changePercent = (Math.random() * 10) - 5;
      const change = (price * changePercent) / 100;
      const volume = (Math.random() * 100).toFixed(1) + 'M';
      return { symbol, price, change, changePercent, volume };
    });
  }, []);


  // --- STATE 2: ERROR ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in slide-in-from-bottom-5">
        <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Activity className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 mb-2">Analysis Failed</h2>
        <p className="text-zinc-500 max-w-md mx-auto mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors">
          Reset Workspace
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full">
      <div className="lg:col-span-7 p-8 overflow-y-auto scrollbar-hide h-full">
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/95 backdrop-blur-sm z-20 py-2 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-900 rounded-xl text-white shadow-lg">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="font-black text-xl text-zinc-900 tracking-tight">Research Report</h2>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  {stockData?.symbol || 'Unknown Asset'} • Multi-Agent Synthesized
                </p>
              </div>
            </div>

            <div className="flex bg-zinc-100 p-1.5 rounded-xl">
              <button 
                onClick={() => setActiveTab('insight')}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'insight' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <FileText className="w-3.5 h-3.5" /> Insight
              </button>
              <button 
                onClick={() => setActiveTab('financials')}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'financials' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Metrics
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'financials' && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <QuantCard data={stockData} isWatchlisted={watchlist.some(w => w.ticker === stockData?.symbol)} onToggleWatchlist={toggleWatchlist} />
              </div>
            )}
            {activeTab === 'insight' && (
              <div className="prose prose-sm prose-zinc max-w-none bg-white">
                 <MarkdownRenderer className="text-[15px] leading-relaxed text-zinc-700 font-medium">
                    {analysis}
                 </MarkdownRenderer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel Kanan (Chart & Live Feed) */}
      <div className="lg:col-span-5 border-l border-zinc-200 bg-zinc-50/50 h-full flex flex-col">
        <div className="p-6 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Live Market Feed</span>
          </div>
          
          {/* PERBAIKAN 1: Pengecekan Aman (Safe Checks) untuk Mencegah Nilai 0 Jika Data Belum Lengkap */}
          {stockData && typeof stockData.price === 'number' ? (
             <div className="flex items-end justify-between">
               <div className="flex items-baseline gap-3">
                 <h1 className="text-4xl font-black text-zinc-900">{stockData.symbol}</h1>
                 <span className={`text-xl font-bold ${stockData.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                   {stockData.price.toFixed(2)}
                 </span>
               </div>
               <div className={`text-sm font-bold px-3 py-1 rounded-lg flex items-center gap-1 ${stockData.change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                 {stockData.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stockData.changePercent).toFixed(2)}%
               </div>
             </div>
          ) : (
            // Tampilkan Skeleton (Efek Loading Abu-abu) jika harga belum tersedia
            <div className="flex items-end justify-between animate-pulse">
               <div className="flex gap-3 items-baseline">
                 <div className="h-10 w-24 bg-zinc-200 rounded-md" />
                 <div className="h-6 w-16 bg-zinc-200 rounded-md" />
               </div>
               <div className="h-6 w-20 bg-zinc-200 rounded-md" />
            </div>
          )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide space-y-6">
          {/* Live Market Feed Section */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live Market Feed</h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-zinc-400 font-medium">LIVE</span>
              </div>
            </div>
            <div className="space-y-3">
              {dummyMarketData.map((stock, index) => (
                <div key={stock.symbol} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50 transition-colors animate-in slide-in-from-left-2" style={{animationDelay: `${index * 50}ms`}}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-zinc-600">{stock.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{stock.symbol}</p>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider">NASDAQ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-zinc-900">${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div className={`flex items-center gap-1 text-xs font-medium ${stock.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      <span>{stock.change >= 0 ? '▲' : '▼'}</span>
                      <span>{Math.abs(stock.change).toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">VOL</p>
                    <p className="text-xs font-medium text-zinc-600">{stock.volume}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {stockData?.historicalData ? (
            <div className="animate-in slide-in-from-right-4 duration-700 space-y-6">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Price Action (60D)</h3>
                   <LineChart className="w-4 h-4 text-zinc-300" />
                </div>
                <PriceChart data={stockData.historicalData} ticker={stockData.symbol} />
              </div>
              
              {stockData?.quantitative && (
                <div className="p-6 bg-zinc-900 rounded-3xl text-white shadow-2xl relative overflow-hidden group border border-zinc-800">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 blur-[50px] rounded-full group-hover:bg-cyan-500/30 transition-all duration-700" />
                  <div className="space-y-5 relative z-10">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Algorithmic Trend</p>
                      <p className="text-lg font-medium leading-snug">
                        Pattern matching classifies <span className="text-cyan-400 font-bold">{stockData.symbol}</span> as exhibiting <span className="underline decoration-cyan-500/50 uppercase">{stockData.quantitative.trend}</span> characteristics.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <Network className="w-16 h-16 mb-4 text-zinc-300" />
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Awaiting Sub-Agent Data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
