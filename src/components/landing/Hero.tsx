'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Terminal } from 'lucide-react'
import dynamic from 'next/dynamic'

// Import Robot3D dynamically
const RobotCanvas = dynamic(() => import('@/components/Robot3D'), {
  ssr: false,
})

export function Hero() {
  return (
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between min-h-[85vh] px-6 max-w-7xl mx-auto gap-8 pt-10 md:pt-0">
      
      {/* 1. Left Content: Text & CTA */}
      <div className="flex-1 flex flex-col items-start text-left space-y-8 animate-in slide-in-from-left-8 duration-1000 z-20">
        
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-stellar text-[10px] font-black tracking-[0.2em] shadow-sm hover:stellar-border transition-all cursor-pointer group">
            <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stellar/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-stellar"></span>
            </span>
            LUMO AGENT // KERNEL v2.0
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.85] uppercase">
            DEEP SPACE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-stellar via-white to-nebula animate-nebula-flow">
                QUANTUM
            </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-400 max-w-xl font-medium leading-relaxed font-mono">
            Navigate the financial cosmos with Jerril. 
            High-fidelity algorithmic analysis for the next generation of asset control.
        </p>

        {/* CTA Button Group */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-8">
            <Link 
                href="/dashboard"
                className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-white transition-all duration-500 bg-white/5 font-mono rounded-full hover:scale-105 active:scale-95 shadow-2xl glass-panel stellar-border w-full sm:w-auto overflow-hidden uppercase tracking-widest"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="mr-3 text-lg relative z-10">Initialize Terminal</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2 relative z-10 text-stellar" />
            </Link>
            
             <p className="hidden sm:block text-[10px] text-slate-500 font-black uppercase tracking-widest self-center opacity-60">
                GUEST MODE // PERSISTENCE OFF
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 pt-12 w-full max-w-2xl border-t border-white/5 mt-8 opacity-60">
            {[
                { label: 'Intelligence', value: 'NEURAL' },
                { label: 'Execution', value: 'INSTANT' },
                { label: 'Security', value: 'LEVEL 4' }
            ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                    <span className="text-xl font-black font-mono text-white tracking-tighter">{stat.value}</span>
                    <span className="text-[10px] font-black text-stellar-glow uppercase tracking-widest mt-1 opacity-50">{stat.label}</span>
                </div>
            ))}
        </div>
      </div>

      {/* 2. Right Content: 3D Robot Container */}
      <div className="flex-1 w-full h-[500px] md:h-[800px] relative flex items-center justify-center animate-in zoom-in duration-1000 delay-200 pointer-events-none md:pointer-events-auto overflow-visible">
         
         {/* Solar System / Galaxy Background Effect */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            {/* Pulsating Solar Disks */}
            <div className="w-[400px] h-[400px] md:w-[700px] md:h-[700px] border border-stellar/10 rounded-full animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-[350px] h-[350px] md:w-[600px] md:h-[600px] border border-nebula/10 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
            
            {/* Glowing Orbs (Planets) */}
            <div className="absolute top-10 right-20 w-4 h-4 bg-stellar rounded-full blur-md opacity-40 animate-pulse" />
            <div className="absolute bottom-40 left-10 w-6 h-6 bg-nebula rounded-full blur-lg opacity-30 animate-pulse delay-500" />
            
            {/* Central Star Glow (Behind Robot) */}
            <div className="absolute w-[300px] h-[300px] bg-stellar/5 rounded-full blur-[100px] animate-pulse" />
            
            {/* Quantum Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)] opacity-30" />
         </div>

         {/* 3D Canvas */}
         <div className="w-full h-full relative z-10 scale-95 md:scale-110 lg:translate-x-0 drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <RobotCanvas />
         </div>
         
         {/* Floating UI Elements */}
         <div className="absolute top-[20%] right-[0%] glass-panel stellar-border px-4 py-2 rounded-xl text-[10px] font-black text-stellar animate-bounce delay-1000 hidden lg:block z-20 tracking-widest uppercase">
            Link Status: Optimized
         </div>
         <div className="absolute bottom-[20%] left-[5%] glass-panel border-white/10 px-4 py-2 rounded-xl text-[10px] font-black text-white/40 animate-bounce delay-700 hidden lg:block z-20 tracking-widest uppercase">
            Void Signal: Stable
         </div>
      </div>
    
    </div>
  )
}
