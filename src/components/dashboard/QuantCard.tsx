'use client'

import { BarChart2, Star } from 'lucide-react'

// Menambahkan interface props untuk menerima status watchlist dari Dashboard utama
interface QuantCardProps {
  data: any
  isWatchlisted?: boolean
  onToggleWatchlist?: () => void
}

export function QuantCard({ data, isWatchlisted = false, onToggleWatchlist }: QuantCardProps) {
  if (!data) return null
  
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-100">
        
        {/* Title Area */}
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-zinc-900" />
          <h3 className="font-bold text-zinc-900 tracking-tight">Quantitative Metrics: {data.symbol}</h3>
        </div>

        {/* WATCHLIST BUTTON (Bintang) */}
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Price', value: `$${data.currentPrice?.toFixed(2)}` },
          { label: '20-Day SMA', value: `$${data.quantitative?.sma20?.toFixed(2)}` },
          { label: 'Volatility', value: data.quantitative?.volatility?.toFixed(2) },
          { 
            label: 'Risk Level', 
            value: data.quantitative?.riskLevel,
            isRisk: true 
          }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-xl font-black tracking-tight ${
              stat.isRisk 
              ? stat.value === 'High' ? 'text-red-600' : 'text-emerald-600'
              : 'text-zinc-900'
            }`}>
              {stat.value || 'N/A'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}