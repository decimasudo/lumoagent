'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, UserPlus } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-3 group">
        <div className="w-10 h-10 relative overflow-hidden rounded-xl bg-void-slate border border-white/5 glass-panel transition-all group-hover:stellar-border scale-90 group-hover:scale-100 duration-500">
          <img 
            src="/logo.jpeg" 
            alt="Jerril Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xl font-black tracking-tight text-white group-hover:text-stellar transition-colors uppercase">
          Jerril<span className="text-stellar-glow">.AI</span>
        </span>
      </Link>

      {/* Actions */}
      <div className="flex items-center space-x-6">
        <Link 
          href="/auth/signin" 
          className="hidden md:flex items-center text-xs font-black text-slate-400 hover:text-stellar transition-all uppercase tracking-widest"
        >
          <Lock className="w-3.5 h-3.5 mr-2" />
          Login
        </Link>
        <Link 
          href="/auth/signup"
          className="flex items-center px-6 py-2.5 text-xs font-black bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:stellar-border transition-all glass-panel uppercase tracking-widest group"
        >
          <UserPlus className="w-3.5 h-3.5 mr-2 text-stellar group-hover:animate-pulse" />
          Access Terminal
        </Link>
      </div>
    </nav>
  )
}
