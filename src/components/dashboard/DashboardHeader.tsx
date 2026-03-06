'use client'

import { Briefcase, Activity, Terminal, ShieldCheck, Cpu, Twitter, Github } from 'lucide-react'

interface DashboardHeaderProps {
  agentType: string
  onAgentTypeChange: (type: string) => void
  stockData: any
  executeAnalysis: (ticker: string, agentType?: string) => void
}

export function DashboardHeader({ agentType, onAgentTypeChange, stockData, executeAnalysis }: DashboardHeaderProps) {
  return (
    <header className="h-16 flex items-center px-8 border-b border-zinc-50 sticky top-0 bg-white/80 backdrop-blur-md z-20">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
          <h1 className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">System.v1.5.0</h1>
        </div>
        
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-300">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span className="uppercase tracking-tighter">Encrypted</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-300">
            <Terminal className="w-2.5 h-2.5" />
            <span className="uppercase tracking-tighter">Terminal_Ready</span>
          </div>
        </div>
      </div>

      {/* Spacer to push right content */}
      <div className="flex-1"></div>

      {/* Social Links and Agent Selector */}
      <div className="flex items-center space-x-4">
        {/* Social Links */}
        <div className="flex items-center space-x-2">
          <a 
            href="https://x.com/Lumoagent" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-zinc-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-zinc-50"
            title="Follow us on X"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a 
            href="https://github.com/decimasudo/lumoagent" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-50"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

        {/* Agent Type Selector */}
        <div className="flex bg-zinc-50 p-1 rounded-2xl border border-zinc-100 shadow-sm">
          {['fundamental', 'technical'].map((type) => (
            <button
              key={type}
              onClick={() => {
                onAgentTypeChange(type);
                // If we already have data, re-analyze automatically with new agent type
                if (stockData?.symbol) {
                  executeAnalysis(stockData.symbol, type);
                }
              }}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2.5 ${
                agentType === type 
                ? 'bg-zinc-900 shadow-lg shadow-zinc-200 text-white' 
                : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {type === 'fundamental' ? <Briefcase className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
              <span>{type === 'fundamental' ? 'Warren_Mod' : 'Quant_Mod'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Decorative pulse on the right */}
      <div className="absolute top-0 right-0 h-full w-48 pointer-events-none overflow-hidden opacity-5 flex items-center justify-end pr-8">
        <Cpu className="w-12 h-12 text-zinc-900 animate-pulse" />
      </div>
    </header>
  )
}