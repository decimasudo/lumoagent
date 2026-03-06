'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react'

export default function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null
    try {
      return createClient()
    } catch {
      return null
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')

    if (!supabase) {
      setError('Supabase client not initialized.')
      setLoading(false)
      return
    }

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          setError(error.message)
        } else {
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) {
          setError(error.message)
        } else {
          if (data.session) {
            router.push('/dashboard')
            router.refresh()
          } else {
            setSuccessMsg('Account created! Please check your email to confirm.')
            // Optionally switch back to signin or stay here
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {mode === 'signin' ? 'Welcome Back' : 'Initialize Account'}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {mode === 'signin' 
            ? 'Enter your credentials to access the system.' 
            : 'Register to begin your Jerril experience.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Email Identity
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              placeholder="agent@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">
            Access Code
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
            <input
              type="password"
              required
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-sm text-green-600 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {mode === 'signin' ? 'Enter System' : 'Create Access ID'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          {mode === 'signin' ? "Don't have an ID?" : "Already recognized?"}
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError('')
              setSuccessMsg('')
            }}
            className="ml-2 font-semibold text-cyan-600 hover:text-cyan-700 hover:underline transition-colors"
          >
            {mode === 'signin' ? 'Request Access' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  )
}
