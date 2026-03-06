'use client'

import { Activity, Star, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

interface QuantCardProps {
  data: any
  isWatchlisted?: boolean
  onToggleWatchlist?: () => void
}

export function QuantCard({ data, isWatchlisted = false, onToggleWatchlist }: QuantCardProps) {
  if (!data) return null
  
  const q = data.quantitative || {}

  // 1. Logika Warna & Status RSI
  const rsi = q.rsi14 || 0
  let rsiColor = 'text-zinc-900'
  let rsiStatus = 'Neutral'
  if (rsi >= 70) {
    rsiColor = 'text-red-600'
    rsiStatus = 'Overbought'
  } else if (rsi <= 30 && rsi > 0) {
    rsiColor = 'text-cyan-600'
    rsiStatus = 'Oversold'
  }

  // 2. Logika Warna Trend
  const isBullish = q.trend === 'Bullish'
  const trendColor = isBullish ? 'text-cyan-600' : 'text-red-600'
  const TrendIcon = isBullish ? TrendingUp : TrendingDown

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-100">
        
        {/* Title Area */}
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-zinc-900" />
          <h3 className="font-bold text-zinc-900 tracking-tight">Quantitative Dashboard: {data.symbol}</h3>
        </div>

        {/* WATCHLIST BUTTON */}
        {onToggleWatchlist && (
          <button 
            onClick={onToggleWatchlist}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shadow-sm ${
              isWatchlisted 
              ? 'bg-amber-100 text-amber-500 border border-amber-200 hover:bg-amber-200' 
              : 'bg-zinc-50 text-zinc-400 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-600'
            }`}
            title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <Star className="w-4 h-4" fill={isWatchlisted ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        )}

      </div>

      {/* Metrics Grid (Kini 8 Kotak untuk kesan "Ramai" dan Analitik) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* 1. Harga Saat Ini */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Current Price</p>
          <p className="text-xl font-black tracking-tight text-zinc-900">
            ${data.currentPrice?.toFixed(2) || '0.00'}
          </p>
        </div>

        {/* 2. Momentum Trend */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Momentum Trend</p>
          <div className="flex items-center space-x-1.5">
            <TrendIcon className={`w-5 h-5 ${trendColor}`} strokeWidth={3} />
            <p className={`text-xl font-black tracking-tight ${trendColor}`}>
              {q.trend || 'N/A'}
            </p>
          </div>
        </div>

        {/* 3. RSI 14-Hari */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">RSI (14D)</p>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-widest border ${
              rsiStatus === 'Overbought' ? 'bg-red-50 text-red-600 border-red-100' :
              rsiStatus === 'Oversold' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' :
              'bg-zinc-100 text-zinc-500 border-zinc-200'
            }`}>
              {rsiStatus}
            </span>
          </div>
          <p className={`text-xl font-black tracking-tight ${rsiColor}`}>
            {rsi.toFixed(2)}
          </p>
        </div>

        {/* 4. Risk Level */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 relative overflow-hidden">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
            Risk Profile <AlertCircle className="w-3 h-3" />
          </p>
          <p className={`text-xl font-black tracking-tight ${
            q.riskLevel === 'High' ? 'text-red-600' : 'text-cyan-600'
          }`}>
            {q.riskLevel || 'Unknown'}
          </p>
          {/* Aksen visual ringan jika risiko tinggi */}
          {q.riskLevel === 'High' && (
             <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-red-500/10 rounded-full blur-xl" />
          )}
        </div>

        {/* 5. 20-Day SMA */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">20-Day SMA</p>
          <p className="text-xl font-black tracking-tight text-zinc-900">
            ${q.sma20?.toFixed(2) || '0.00'}
          </p>
        </div>

        {/* 6. Volatilitas */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Volatility (Std Dev)</p>
          <p className="text-xl font-black tracking-tight text-zinc-900">
            {q.volatility?.toFixed(2) || '0.00'}
          </p>
        </div>

        {/* 7. 52-Week High */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">52W High</p>
          <p className="text-xl font-black tracking-tight text-zinc-500">
            ${data.week52High?.toFixed(2) || '0.00'}
          </p>
        </div>

        {/* 8. 52-Week Low */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">52W Low</p>
          <p className="text-xl font-black tracking-tight text-zinc-500">
            ${data.week52Low?.toFixed(2) || '0.00'}
          </p>
        </div>

      </div>
    </div>
  )
}
