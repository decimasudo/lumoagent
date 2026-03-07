'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, Loader2, Command, Sparkles, Zap, ChevronUp } from 'lucide-react'
import { PROMPT_LIBRARY } from '@/lib/market-hot-spots'

interface TickerSelectorProps {
  ticker: string
  onTickerChange: (value: string) => void
  onAnalyze: (e: React.FormEvent) => void
  loading: boolean
  activeMenu: string
  onMenuChange: (menu: string) => void
  onJerrilSelect?: (prompt: string) => void
  selectedPrompt?: string | null
}

export function TickerSelector({ ticker, onTickerChange, onAnalyze, loading, activeMenu, onMenuChange, onJerrilSelect, selectedPrompt }: TickerSelectorProps) {
  const [isJerrilOpen, setIsJerrilOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(PROMPT_LIBRARY[0].category)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsJerrilOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (activeMenu !== 'dashboard') return null

  return (
    <div className="flex-none p-6 border-t border-white/5 bg-void relative z-40">
      <div className="max-w-4xl mx-auto relative" ref={dropdownRef}>
        
        {/* JERRIL CHAT DROPDOWN (ULTRA GLASSMORPHISM) */}
        {isJerrilOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-4 bg-[#030712]/40 backdrop-blur-[24px] border border-white/10 rounded-3xl overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] animate-in slide-in-from-bottom-5 fade-in duration-300 flex flex-col md:flex-row max-h-[50vh]">
            
            {/* Sidebar Kategori */}
            <div className="w-full md:w-1/3 border-r border-white/5 bg-black/20 overflow-y-auto p-3 space-y-1">
              <div className="px-3 py-2 mb-2 flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="w-4 h-4 text-stellar" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jerril Templates</span>
              </div>
              {PROMPT_LIBRARY.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(cat.category)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat.category 
                      ? 'bg-stellar/20 text-stellar shadow-[inset_0_0_15px_rgba(34,211,238,0.2)]' 
                      : 'text-slate-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Daftar Prompt */}
            <div className="flex-1 overflow-y-auto p-4 bg-transparent grid grid-cols-1 gap-2">
              {PROMPT_LIBRARY.find(c => c.category === activeCategory)?.prompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onJerrilSelect) onJerrilSelect(prompt)
                    setIsJerrilOpen(false)
                  }}
                  className="group flex flex-col items-start p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-stellar/40 hover:bg-stellar/10 transition-all text-left backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3 h-3 text-stellar group-hover:animate-pulse" />
                    <span className="text-[9px] font-black text-stellar uppercase tracking-widest">Execute Routine</span>
                  </div>
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white leading-relaxed line-clamp-2">
                    {prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TOMBOL TOGGLE JERRIL */}
        <div className="flex justify-end mb-2">
          <button 
            onClick={() => setIsJerrilOpen(!isJerrilOpen)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              isJerrilOpen 
                ? 'bg-stellar/20 text-stellar border-stellar/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isJerrilOpen ? 'Close Templates' : 'Analize stocks'}
            <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-300 ${isJerrilOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* INPUT BAR */}
        {selectedPrompt && (
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-stellar uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Template Selected - Click Execute to Analyze</span>
          </div>
        )}
        <form onSubmit={onAnalyze} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-stellar/0 via-stellar/20 to-stellar/0 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
          
          <div className="relative flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] focus-within:border-stellar/50 focus-within:ring-1 focus-within:ring-stellar/50 transition-all duration-300">
            <div className="pl-6 pr-3 flex items-center justify-center">
              <Command className="w-5 h-5 text-stellar" />
            </div>

            <input
              type="text"
              value={ticker}
              onChange={(e) => onTickerChange(e.target.value)}
              placeholder="ENTER ASSET TICKER OR FULL COMMAND..."
              disabled={loading}
              className="flex-1 bg-transparent py-5 text-sm md:text-base font-bold text-white placeholder:text-slate-600 focus:outline-none tracking-wide disabled:opacity-50"
              spellCheck={false}
              autoComplete="off"
            />

            <div className="pr-3 pl-2">
              <button
                type="submit"
                disabled={!(ticker || '').trim() || loading}
                className="flex items-center gap-2 px-6 py-3 bg-white text-void rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stellar hover:text-void hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing</span>
                  </>
                ) : (
                  <>
                    <span>Execute</span>
                    <Search className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-3 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-stellar/50 animate-pulse" /> System Ready
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" /> API Connected
          </span>
        </div>
      </div>
    </div>
  )
}