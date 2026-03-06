'use client'

import { useMemo, useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
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

export default function SignUp() {
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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [textIndex, setTextIndex] = useState(0)
  const featureTexts = [
    'Create your Portfolio',
    'Advanced Stock Analysis',
    'Real-time AI Insights'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((current) => (current + 1) % featureTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [featureTexts.length])

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!supabase) {
      setError('Authentication is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Environment Variables.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // If Supabase returned a session directly (email confirmation disabled), go straight to dashboard
      if (signUpData?.session) {
        setRedirecting(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
        return
      }

      // Email confirmation is enabled — attempt auto sign-in anyway
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!signInError && signInData?.session) {
        setRedirecting(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
        return
      }

      // Fallback: account created but email confirmation still required
      setSuccess(true)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-green-50/50">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Account Created!</h1>
            <p className="text-slate-600 mb-8 text-lg">
              Your account for <span className="font-semibold text-slate-900">{email}</span> is ready.
              Sign in now to start using Jerril.
            </p>
            <Link
              href="/auth/signin"
              className="w-full inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-500/20 transition-all hover:-translate-y-1 active:scale-[0.98]"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    )
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
              Join Jerril today. Unlock powerful portfolio tracking, risk assessment, and intelligence for your investments.
            </p>
          </div>

          {/* 3D Robot Canvas */}
          <div className="w-full h-full flex items-center justify-center relative -mt-10">
            <RobotCanvas />
          </div>
        </div>

        {/* Right Column: Signup Form */}
        <div className="w-full lg:w-[35%] flex flex-col bg-white border-l border-slate-100 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] relative z-10">
          
          <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-sm space-y-8">
              
              <div className="text-left mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Get Started</h1>
                <p className="text-sm text-slate-500">Create your free account to start analyzing</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-sm text-red-700 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-5">
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
                      minLength={6}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600 text-sm">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors">
                    Sign in here
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
