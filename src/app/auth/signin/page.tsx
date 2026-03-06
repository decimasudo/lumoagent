'use client'

import { useMemo, useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft, Cpu, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'
import { InteractiveBackground } from '@/components/landing/InteractiveBackground'

// Import dinamis untuk mematikan SSR pada Canvas Three.js
const RobotCanvas = dynamic(() => import('@/components/Robot3D'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center w-full h-full text-[#00E5FF]">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <span className="text-[10px] font-black tracking-[0.2em] uppercase text-stellar">Loading Neural Core...</span>
    </div>
  ),
})

export default function SignIn() {
  const router = useRouter()
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null
    try {
      return createClient()
    } catch {
      return null
    }
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState('')
  
  const [textIndex, setTextIndex] = useState(0)
  const featureTexts = [
    'Neural Terminal Access',
    'Quantum Data Streams',
    'AI Multi-Agent Core'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((current) => (current + 1) % featureTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [featureTexts.length])

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!supabase) {
      setError('Authentication is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Environment Variables.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setRedirecting(true)
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1500) // Small delay to show redirect message
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-void text-slate-200 selection:bg-stellar/30 relative">
      <InteractiveBackground />
      
      {/* Global Top Header */}
      <header className="h-20 flex-shrink-0 bg-void/40 backdrop-blur-xl flex items-center px-8 justify-between border-b border-white/5 relative z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:stellar-border transition-all">
              <Cpu className="w-6 h-6 text-stellar" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              Lumo<span className="text-stellar">Agent</span>
            </span>
          </Link>
        </div>
        <Link href="/" className="text-[10px] font-black text-slate-500 hover:text-stellar uppercase tracking-[0.3em] transition-colors flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Orbit
        </Link>
      </header>

      {/* Main Content Area: Split View */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Left Column: Robot 3D Presentation */}
        <div className="hidden lg:flex w-[60%] relative items-center justify-center overflow-hidden">
          
          {/* Animated Text Block at bottom left */}
          <div className="absolute bottom-20 left-20 right-20 z-20 pointer-events-none">
            <div className="flex items-center gap-3 text-stellar mb-4">
              <div className="w-8 h-[1px] bg-stellar/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol Active</span>
            </div>
            <h2 key={textIndex} className="text-6xl font-black text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 uppercase tracking-tighter leading-none">
              {featureTexts[textIndex]}
            </h2>
            <p className="text-slate-400 text-sm font-medium max-w-md leading-relaxed font-mono opacity-80 uppercase tracking-widest">
              Uplinking to Jerril Neural Core. Initializing high-fidelity data streams for advanced portfolio dominance.
            </p>
          </div>

          {/* 3D Robot Canvas with glow effects */}
          <div className="w-full h-full relative z-10 flex items-center justify-center scale-110 drop-shadow-[0_0_50px_rgba(34,211,238,0.15)]">
            <div className="absolute w-[500px] h-[500px] bg-stellar/5 rounded-full blur-[120px] animate-pulse" />
            <RobotCanvas />
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="w-full lg:w-[40%] flex flex-col bg-white/[0.02] backdrop-blur-3xl border-l border-white/5 relative z-30 shadow-2xl">
          
          <div className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
            <div className="w-full max-w-sm space-y-12">
              
              <div className="text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stellar/10 border border-stellar/20">
                  <Sparkles className="w-3.5 h-3.5 text-stellar" />
                  <span className="text-[9px] font-black text-stellar uppercase tracking-[0.2em]">Auth Module v3.0</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Neural<br/>Convergence</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Authorize terminal access via secure protocol.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center text-[10px] font-black text-red-400 uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Uplink ID / Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-stellar transition-colors" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@lumo.network"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:stellar-border transition-all text-white font-mono text-sm placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Access Cipher / Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-stellar transition-colors" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:stellar-border transition-all text-white font-mono text-sm placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                   <Link href="#" className="text-[10px] font-black text-slate-500 hover:text-stellar uppercase tracking-widest transition-colors">
                     Reset Protocol?
                   </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading || redirecting}
                  className="w-full group relative overflow-hidden bg-stellar hover:bg-white text-void py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.2)] disabled:opacity-50"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {redirecting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Authorize Access'
                    )}
                  </span>
                </button>
              </form>

              <div className="pt-8 text-center border-t border-white/5">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  Terminal newbie?{' '}
                  <Link href="/auth/signup" className="text-stellar hover:text-white transition-colors ml-2">
                    Initialize New ID
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}