'use client'

import { useMemo, useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import dynamic from 'next/dynamic'

// Import dinamis untuk mematikan SSR pada Canvas Three.js
const RobotCanvas = dynamic(() => import('@/components/Robot3D'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center w-full h-full text-[#00E5FF]">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <span className="text-sm font-medium text-slate-600">Loading Jerril 3D...</span>
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
    'Smart AI Assistance',
    'Automated Workflows',
    'Intelligent Insights'
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
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white text-slate-900">
      
      {/* Global Top Header */}
      <header className="h-20 flex-shrink-0 bg-white flex items-center px-6 justify-between border-b border-slate-100 relative z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center space-x-2">
            <img src="/logo.jpeg" alt="Jerril Logo" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Jerril
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content Area: Split View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Robot 3D Presentation */}
        <div className="hidden lg:flex w-[65%] relative bg-white items-center justify-center overflow-hidden">
          
          {/* Animated Text Block at bottom left */}
          <div className="absolute bottom-10 left-12 right-12 z-10 pointer-events-none min-h-[140px]">
            <h2 key={textIndex} className="text-4xl font-bold text-slate-900 mb-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {featureTexts[textIndex]}
            </h2>
            <p className="text-slate-600 text-base max-w-lg">
              Empower your workflow with Jerril. Access real-time stock analysis, quantitative insights, and AI-driven predictions.
            </p>
          </div>

          {/* 3D Robot Canvas */}
          <div className="w-full h-full flex items-center justify-center relative -mt-10">
            <RobotCanvas />
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="w-full lg:w-[35%] flex flex-col bg-white border-l border-slate-100 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] relative z-10">
          
          <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-sm space-y-8">
              
              <div className="text-left mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
                <p className="text-sm text-slate-500">Sign in to your account to continue</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-sm text-red-700 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end text-sm mt-2">
                   <Link href="#" className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
                     Forgot password?
                   </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading || redirecting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center mt-6"
                >
                  {redirecting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Redirecting to dashboard...
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600 text-sm">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">
                    Sign up now
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