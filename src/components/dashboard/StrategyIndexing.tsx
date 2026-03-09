'use client'

import React, { useState } from 'react'
import { Beaker, Play, Zap, ShieldCheck, BarChart3, Cpu, AlertTriangle } from 'lucide-react'

export function StrategySimulator() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [progress, setProgress] = useState(0)

  const startSimulation = () => {
    setIsSimulating(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSimulating(false)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  return (
    <div className="p-6 rounded-3xl bg-void/40 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden relative group">
      {/* Decorative Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-stellar/10 rounded-full blur-[80px] group-hover:bg-stellar/20 transition-colors" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-stellar/10 border border-stellar/20">
            <Beaker className="w-6 h-6 text-stellar animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Neural Strategy Simulator</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Core Engine: LUMO-V3 Beta</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Engine Ready</span>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { label: 'Risk Tolerance', value: 'Dynamic / AI-Managed', icon: ShieldCheck },
          { label: 'Backtest Period', value: 'Last 1,000 Candles', icon: Zap },
          { label: 'Asset Class', value: 'Quantum-Filtered', icon: Cpu },
          { label: 'Confidence Threshold', value: '85% Minimum', icon: BarChart3 },
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-crosshair">
            <div className="flex items-center gap-3 mb-2">
              <item.icon className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
            </div>
            <p className="text-xs font-black text-white tracking-widest">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Simulation Progress Area */}
      {isSimulating && (
        <div className="mb-8 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stellar">
            <span>Sequencing Market Fractals...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-stellar via-indigo-500 to-nebula transition-all duration-300 ease-out shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      )}

      {/* Warning Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3 mb-8">
        <AlertTriangle className="w-4 h-4 text-amber-500/60 mt-0.5" />
        <p className="text-[9px] leading-relaxed text-amber-500/60 font-medium uppercase tracking-wider">
          Past performance is simulated via quantum extrapolation. AI probability scores are not financial advice. 
          Use LLM-based signals with calibrated risk offsets.
        </p>
      </div>

      {/* CTA Button */}
      <button 
        disabled={isSimulating}
        onClick={startSimulation}
        className="w-full relative group/btn overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 hover:border-stellar/50 transition-all duration-500"
      >
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-stellar to-transparent scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-700" />
        <div className="px-8 py-5 flex items-center justify-center gap-3">
          {isSimulating ? (
            <span className="text-xs font-black text-white uppercase tracking-[0.3em] animate-pulse">Processing...</span>
          ) : (
            <>
              <Play className="w-4 h-4 text-stellar fill-stellar" />
              <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Initialize Backtest</span>
            </>
          )}
        </div>
      </button>
    </div>
  )
}