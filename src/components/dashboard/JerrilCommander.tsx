'use client'

import React, { useState } from 'react'
import { Sparkles, X, ChevronRight, MessageSquare, Search, Zap, Bot } from 'lucide-react'
import { PROMPT_LIBRARY } from '@/lib/market-hot-spots'

interface JerrilCommanderProps {
  onSelectPrompt: (prompt: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function JerrilCommander({ onSelectPrompt, isOpen, setIsOpen }: JerrilCommanderProps) {
  const [activeCategory, setActiveCategory] = useState(PROMPT_LIBRARY[0].category)

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[100] group flex items-center gap-3 px-6 py-4 rounded-full bg-void shadow-2xl stellar-border glass-panel hover:scale-105 active:scale-95 transition-all duration-300 animate-in fade-in zoom-in"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-stellar/20 rounded-full blur-md animate-pulse" />
          <Bot className="w-6 h-6 text-stellar relative z-10" />
        </div>
        <span className="font-black text-xs uppercase tracking-[0.2em] text-white">Jerril Chat</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-void/80 backdrop-blur-sm" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-4xl max-h-[80vh] flex flex-col glass-card stellar-border rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.15)] animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-stellar/10 border border-stellar/20">
              <Sparkles className="w-6 h-6 text-stellar" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Jerril Commander</h2>
              <p className="text-[10px] font-bold text-stellar/50 uppercase tracking-widest mt-0.5">Neural Hub // Command Selection</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-1/3 border-r border-white/5 bg-white/[0.01] overflow-y-auto p-4 space-y-2">
            {PROMPT_LIBRARY.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.category 
                    ? 'bg-stellar text-void shadow-lg shadow-stellar/20' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Prompts Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-void/50">
            <div className="grid grid-cols-1 gap-3">
              {PROMPT_LIBRARY.find(c => c.category === activeCategory)?.prompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectPrompt(prompt)
                    setIsOpen(false)
                  }}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:stellar-border hover:bg-white/[0.05] transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-stellar/10 text-slate-500 group-hover:text-stellar transition-colors">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{prompt}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-stellar group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Select a template to initialize neural analysis</p>
        </div>
      </div>
    </div>
  )
}
