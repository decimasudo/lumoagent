'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, Briefcase, Activity, AlertTriangle, ChevronDown } from 'lucide-react'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { QuantCard } from '@/components/dashboard/QuantCard'

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

export default function Dashboard() {
  const [ticker, setTicker] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [stockData, setStockData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [agentType, setAgentType] = useState('fundamental')
  const [activeMenu, setActiveMenu] = useState('dashboard')
  
  const [historyList, setHistoryList] = useState<any[]>([])
  const [watchlist, setWatchlist] = useState<any[]>([])

  const router = useRouter()
  const supabase = createClient()
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
    } catch (err) {
      console.error("Failed to fetch history")
    }
  }

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist')
      const json = await res.json()
      if (json.success) setWatchlist(json.data || [])
    } catch (err) {
      console.error("Failed to fetch watchlist")
    }
  }

  const executeAnalysis = async (targetTicker: string) => {
    setLoading(true); setError(''); setAnalysis(''); setStockData(null); setTicker(targetTicker)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: targetTicker, agentType }), 
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Analysis failed. Please check the asset.')
      
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

  const loadFromHistory = (item: any) => {
    setTicker(item.ticker)
    setAnalysis(item.analysis || item.result || item.analysis_result || item.content || '')
    setStockData(null)
    setActiveMenu('dashboard')
    setError('')
  }

  const loadFromWatchlist = (targetTicker: string) => {
    executeAnalysis(targetTicker)
  }

  const removeWatchlist = async (id: string) => {
    try {
      const res = await fetch(`/api/watchlist?id=${id}`, { method: 'DELETE' })
      if (res.ok) fetchWatchlist()
    } catch (e) {
      console.error(e)
    }
  }

  const toggleWatchlist = async () => {
    if (!stockData?.symbol) return
    const symbol = stockData.symbol
    const existing = watchlist.find(w => w.ticker === symbol)
    
    if (existing) {
      await removeWatchlist(existing.id)
    } else {
      try {
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker: symbol })
        })
        if (res.ok) fetchWatchlist()
      } catch (e) {
        console.error(e)
      }
    }
  }

  const isCurrentWatchlisted = stockData ? watchlist.some(w => w.ticker === stockData.symbol) : false

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [analysis, loading])

  return (
    <div className="flex h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        userEmail={userEmail} 
        history={historyList}
        onSelectHistory={loadFromHistory}
        watchlist={watchlist}
        onSelectWatchlist={loadFromWatchlist}
        onRemoveWatchlist={removeWatchlist}
        onSignOut={async () => { await supabase.auth.signOut(); router.push('/') }} 
      />

      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Terminal V1.3</h1>
          </div>
          
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            {[
              { id: 'fundamental', label: 'Warren (Value)', icon: Briefcase },
              { id: 'technical', label: 'Quant (Tech)', icon: Activity }
            ].map((btn) => (
              <button 
                key={btn.id}
                onClick={() => setAgentType(btn.id)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-2 ${
                  agentType === btn.id ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <btn.icon className="w-3.5 h-3.5" />
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pb-40 space-y-8 scrollbar-hide">
          {activeMenu === 'dashboard' ? (
            <div className="max-w-3xl mx-auto w-full">
              {!analysis && !loading && !error && (
                <div className="mt-32 text-center animate-in fade-in zoom-in duration-700">
                  <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Bot className="w-10 h-10 text-zinc-900" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4">Awaiting Instructions.</h2>
                  <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Select an asset to Begin Statistical Analysis</p>
                </div>
              )}

              {loading && (
                <div className="flex items-start space-x-6 animate-pulse">
                  <div className="w-10 h-10 bg-zinc-900 rounded-full shrink-0" />
                  <div className="space-y-4 w-full">
                    <div className="h-4 bg-zinc-100 rounded-full w-1/3" />
                    <div className="h-24 bg-zinc-50 rounded-2xl w-full" />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-zinc-900 text-white p-5 rounded-2xl flex items-center space-x-4 shadow-xl animate-in slide-in-from-top-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <p className="text-sm font-bold tracking-tight">{error}</p>
                </div>
              )}

              {analysis && !loading && (
                <>
                  <QuantCard 
                    data={stockData} 
                    isWatchlisted={isCurrentWatchlisted} 
                    onToggleWatchlist={toggleWatchlist} 
                  />
                  <div className="flex items-start space-x-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    {/* CSS FIX: Menyuntikkan styling margin dan typography kustom yang meng-override Tailwind Preflight */}
                    <div className="bg-white border border-zinc-100 p-8 rounded-3xl rounded-tl-none shadow-sm text-zinc-800 leading-relaxed font-medium text-[15px]
                      [&>h3]:text-lg [&>h3]:font-black [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-zinc-900 [&>h3]:uppercase [&>h3]:tracking-tight
                      [&>h4]:font-bold [&>h4]:mt-6 [&>h4]:mb-2 [&>h4]:text-zinc-800
                      [&>p]:mb-5 
                      [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 [&>ul>li]:marker:text-zinc-400
                      [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2
                      [&>strong]:text-zinc-900 [&>strong]:font-bold
                      first:[&>h3]:mt-0
                    ">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                  </div>
                </>
              )}
              <div ref={chatEndRef} />
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-400 font-bold uppercase tracking-widest animate-in fade-in">Module Under Development</div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent">
          <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto relative group">
            <div className="relative">
              <select
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                disabled={loading}
                className="w-full pl-8 pr-20 py-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-900 transition-all font-bold tracking-tighter text-xl shadow-sm appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="" disabled>SELECT AN ASSET TO ANALYZE...</option>
                {SUPPORTED_TICKERS.map((t) => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol} — {t.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-20 top-0 bottom-0 flex items-center pointer-events-none text-zinc-400 group-hover:text-zinc-900 transition-colors">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !ticker}
              className="absolute right-3 top-3 bottom-3 px-6 bg-zinc-900 hover:bg-black text-white rounded-xl transition-all disabled:opacity-20 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}