'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { Send, Bot, Briefcase, Activity, AlertTriangle, ChevronDown, Layout } from 'lucide-react'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { QuantCard } from '@/components/dashboard/QuantCard'
import { PriceChart } from '@/components/dashboard/PriceChart'
import { DashboardView } from '@/components/dashboard/DashboardView'
import { AgentsView } from '@/components/dashboard/AgentsView'
import { SettingsView } from '@/components/dashboard/SettingsView'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { TickerSelector } from '@/components/dashboard/TickerSelector'

const SUPPORTED_TICKERS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'AMZN', name: 'Amazon.com' },
  { symbol: 'BTC-USD', name: 'Bitcoin' },
  { symbol: 'ETH-USD', name: 'Ethereum' },
  { symbol: 'SOL-USD', name: 'Solana' }
]

const VendorIcon = ({ provider }: { provider: string }) => {
  if (provider === 'Google DeepMind') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    );
  }
  if (provider === 'Meta AI') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.14 7.66C15.11 7.66 14.12 8.1 13.31 8.89L12 10.18L10.69 8.89C9.88 8.1 8.89 7.66 7.86 7.66C5.18 7.66 3 9.84 3 12.52C3 15.2 5.18 17.38 7.86 17.38C8.89 17.38 9.88 16.94 10.69 16.15L12 14.86L13.31 16.15C14.12 16.94 15.11 17.38 16.14 17.38C18.82 17.38 21 15.2 21 12.52C21 9.84 18.82 7.66 16.14 7.66ZM16.14 15.62C15.59 15.62 15.06 15.39 14.63 14.97L13.41 13.75L14.63 12.53C15.06 12.11 15.59 11.88 16.14 11.88C17.29 11.88 18.23 12.82 18.23 13.97C18.23 15.12 17.29 16.06 16.14 16.06V15.62ZM7.86 11.88C8.41 11.88 8.94 12.11 9.37 12.53L10.59 13.75L9.37 14.97C8.94 15.39 8.41 15.62 7.86 15.62C6.71 15.62 5.77 14.68 5.77 13.53C5.77 12.38 6.71 11.44 7.86 11.44V11.88Z" fill="#0668E1"/>
      </svg>
    );
  }
  if (provider === 'Mistral AI') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#f5d0fe">
        <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
      </svg>
    );
  }
  if (provider === 'OpenAI') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#10a37f">
        <path d="M22.28 9.82a5.98 5.98 0 0 0-.51-4.91 6.04 6.04 0 0 0-4.75-2.91 6.04 6.04 0 0 0-5.42 2.48 6.04 6.04 0 0 0-5.42-2.48 6.04 6.04 0 0 0-4.75 2.91 5.98 5.98 0 0 0-.51 4.91 6.05 6.05 0 0 0 1.26 5.49 5.98 5.98 0 0 0 .51 4.91 6.04 6.04 0 0 0 4.75 2.91 6.04 6.04 0 0 0 5.42-2.48 6.04 6.04 0 0 0 5.42 2.48 6.04 6.04 0 0 0 4.75-2.91 5.98 5.98 0 0 0 .51-4.91 6.05 6.05 0 0 0-1.26-5.49zM18.26 15.51a3.8 3.8 0 0 1-1.89 1.1l-1.9.46-1.1 1.89a3.81 3.81 0 0 1-5.18 1.39 3.81 3.81 0 0 1-1.39-5.18l1.1-1.9-.46-1.9a3.81 3.81 0 0 1 1.39-5.18 3.81 3.81 0 0 1 5.18 1.39l1.1 1.9 1.9-.46a3.8 3.8 0 0 1 1.89-1.1c.36-.08.72-.04 1.05.1a3.81 3.81 0 0 1 1.39 5.18l-1.1 1.9.46 1.9c.08.36.04.72-.1 1.05-.28.67-.82 1.21-1.49 1.49z" />
      </svg>
    );
  }
  if (provider === 'Alibaba Cloud') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ff6a00">
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 15.5l-5-3.1V8.6l5-3.1 5 3.1v5.8l-5 3.1z" />
      </svg>
    );
  }
  return <Bot className="w-5 h-5" />;
}

export default function Dashboard() {
  const [ticker, setTicker] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [stockData, setStockData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [agentType, setAgentType] = useState('fundamental')
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [selectedModel, setSelectedModel] = useState<string>('google/gemini-2.0-flash-001')
  
  const [historyList, setHistoryList] = useState<any[]>([])
  const [watchlist, setWatchlist] = useState<any[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null

    try {
      return createClient()
    } catch {
      return null
    }
  }, [])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const menu = searchParams.get('menu')
    if (menu) {
      setActiveMenu(menu)
    }
  }, [searchParams])

  useEffect(() => {
    if (!supabase) return

    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
      } else {
        setUserEmail(user.email || null)
        fetchHistory()
        fetchWatchlist()
      }
    }
    initData()
  }, [router, supabase])

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history')
      const json = await res.json()
      if (json.success) setHistoryList(json.data || [])
    } catch (err) { console.error("History fetch error") }
  }

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist')
      const json = await res.json()
      if (json.success) setWatchlist(json.data || [])
    } catch (err) { console.error("Watchlist fetch error") }
  }

  const executeAnalysis = async (targetTicker: string, specificAgentType?: string) => {
    setLoading(true); setError(''); setAnalysis(''); setStockData(null); setTicker('')
    const currentAgentType = specificAgentType || agentType;
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticker: targetTicker, 
          agentType: currentAgentType,
          model: selectedModel // Send selected model
        }), 
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed.')
      
      setAnalysis(data.analysis)
      setStockData(data.data)
      fetchHistory() 
      setActiveMenu('dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticker || loading) return
    executeAnalysis(ticker)
  }

  const toggleWatchlist = async () => {
    if (!stockData?.symbol) return
    const symbol = stockData.symbol
    const existing = watchlist.find(w => w.ticker === symbol)
    if (existing) {
      await fetch(`/api/watchlist?id=${existing.id}`, { method: 'DELETE' })
      fetchWatchlist()
    } else {
      await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: symbol })
      })
      fetchWatchlist()
    }
  }

  return (
    <div className="flex h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        userEmail={userEmail} 
        history={historyList}
        onSelectHistory={(item) => { 
          setTicker(item.ticker); 
          setAnalysis(item.ai_analysis); 
          setStockData(item.stock_data); 
          setActiveMenu('dashboard') 
        }}
        watchlist={watchlist}
        onSelectWatchlist={(t) => executeAnalysis(t)}
        onRemoveWatchlist={async (id) => { 
          await fetch(`/api/watchlist?id=${id}`, { method: 'DELETE' }); 
          fetchWatchlist() 
        }}
        onSignOut={async () => {
          if (!supabase) {
            router.push('/')
            return
          }

          await supabase.auth.signOut()
          router.push('/')
        }} 
        isAnalyzing={loading}
      />

      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        <DashboardHeader 
          agentType={agentType}
          onAgentTypeChange={setAgentType}
          stockData={stockData}
          executeAnalysis={executeAnalysis}
        />

        {/* WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {activeMenu === 'dashboard' && (
            <DashboardView
              stockData={stockData}
              analysis={analysis}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              loading={loading}
              error={error}
            />
          )}
          {activeMenu === 'agents' && (
            <AgentsView
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
          )}
          {activeMenu === 'settings' && (
            <SettingsView />
          )}
          {activeMenu !== 'dashboard' && activeMenu !== 'agents' && activeMenu !== 'settings' && (
            <div className="text-center py-20 text-zinc-400 uppercase tracking-widest">Module Under Development</div>
          )}
        </div>

        {activeMenu === 'dashboard' && (
          <TickerSelector
            ticker={ticker}
            onTickerChange={setTicker}
            onAnalyze={handleAnalyze}
            loading={loading}
            activeMenu={activeMenu}
            onMenuChange={setActiveMenu}
          />
        )}
      </main>
    </div>
  )
}