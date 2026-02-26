'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, Briefcase, Activity, AlertTriangle, ChevronDown, Layout } from 'lucide-react'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { QuantCard } from '@/components/dashboard/QuantCard'
import { PriceChart } from '@/components/dashboard/PriceChart'

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
    setLoading(true); setError(''); setAnalysis(''); setStockData(null); setTicker(targetTicker)
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
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Terminal V1.5</h1>
          </div>
          
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            {['fundamental', 'technical'].map((type) => (
              <button 
                key={type}
                onClick={() => {
                  setAgentType(type);
                  // If we already have data, re-analyze automatically with new agent type
                  if (stockData?.symbol) {
                    executeAnalysis(stockData.symbol, type);
                  }
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                  agentType === type ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {type === 'fundamental' ? <Briefcase className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                <span className="capitalize">{type === 'fundamental' ? 'Warren Agent' : 'Quant Agent'}</span>
              </button>
            ))}
          </div>
        </header>

        {/* WORKSPACE AREA: DUA KOLOM */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {activeMenu === 'dashboard' ? (
            <div className="h-full">
              {!stockData && !loading && !error && (
                <div className="mt-32 text-center animate-in fade-in zoom-in duration-700">
                  <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Layout className="w-10 h-10 text-zinc-900" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4">Awaiting Ticker Selection.</h2>
                  <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Select an asset below to initialize workspace</p>
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-8 h-full">
                  <div className="lg:col-span-7 space-y-4 animate-pulse">
                    <div className="h-64 bg-zinc-50 rounded-3xl" />
                    <div className="h-96 bg-zinc-50 rounded-3xl" />
                  </div>
                  <div className="lg:col-span-5 animate-pulse">
                    <div className="h-full bg-zinc-50 rounded-3xl" />
                  </div>
                </div>
              )}

              {stockData && !loading && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-full">
                  
                  {/* KOLOM KIRI: FUNDAMENTAL INSIGHTS */}
                  <div className="lg:col-span-7 p-8 border-r border-zinc-100 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-6">
                       <Bot className="w-5 h-5 text-zinc-900" />
                       <h2 className="font-black uppercase tracking-tight text-zinc-400 text-sm">AI Agent Analysis</h2>
                    </div>

                    <QuantCard 
                      data={stockData} 
                      isWatchlisted={watchlist.some(w => w.ticker === stockData.symbol)} 
                      onToggleWatchlist={toggleWatchlist} 
                    />

                    <div className="bg-white text-zinc-800 text-[15px]
                      [&>h3]:text-lg [&>h3]:font-black [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:uppercase [&>h3]:text-zinc-900
                      [&>p]:mb-6 [&>p]:leading-relaxed
                      [&>ul]:mb-8 [&>ul]:list-disc [&>ul]:pl-6
                      first:[&>h3]:mt-0
                    ">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                  </div>

                  {/* KOLOM KANAN: CHART & TECHNICAL TOOLS */}
                  <div className="lg:col-span-5 p-8 bg-zinc-50/30 sticky top-0 h-screen overflow-y-auto scrollbar-hide">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-zinc-400" />
                          <h2 className="font-black uppercase tracking-tight text-zinc-400 text-sm">Visual Terminal</h2>
                       </div>
                    </div>

                    <PriceChart 
                      data={stockData.historicalData} 
                      ticker={stockData.symbol} 
                    />

                    {/* Tambahan: Info Card Kecil untuk kesan "Ramai" */}
                    <div className="mt-6 p-6 bg-zinc-900 rounded-2xl text-white shadow-xl">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Market Sentiment</p>
                       <p className="text-sm font-medium leading-snug">
                          {stockData.symbol} exhibits {stockData.quantitative.trend} trend characteristics over the 60-day window with an RSI of {stockData.quantitative.rsi14.toFixed(2)}.
                       </p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          ) : activeMenu === 'agents' ? (
            <div className="p-8 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-zinc-900">Agent Market</h2>
                  <p className="text-zinc-500 text-sm mt-1">Select and deploy AI models for your analysis workspace.</p>
                </div>
                <div className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100 uppercase tracking-wider">
                  Active Model: {selectedModel.split('/')[1] || selectedModel}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {[
                  {
                    id: 'google/gemini-2.0-flash-001',
                    name: 'Gemini Flash 2.0',
                    provider: 'Google DeepMind',
                    desc: 'Multimodal model optimized for high-speed financial analysis.',
                    tags: ['Fast', 'Free Tier']
                  },
                  {
                    id: 'meta-llama/llama-3.1-8b-instruct',
                    name: 'Llama 3.1 8B',
                    provider: 'Meta AI',
                    desc: 'Balanced open-source model with strong reasoning capabilities.',
                    tags: ['Open Source']
                  },
                  {
                    id: 'mistralai/mistral-small-24b-instruct-2501:free',
                    name: 'Mistral Small 3',
                    provider: 'Mistral AI',
                    desc: 'Efficient model specializing in concise and direct answers.',
                    tags: ['Fast', 'Low Latency']
                  },
                  {
                    id: 'openai/o3-mini-high',
                    name: 'O3 Mini High',
                    provider: 'OpenAI',
                    desc: 'Advanced model for complex reasoning and deep analysis tasks.',
                    tags: ['Reasoning', 'Complex Logic']
                  },
                  { 
                    id: 'qwen/qwen-turbo',
                    name: 'Qwen Turbo',
                    provider: 'Alibaba Cloud',
                    desc: 'High-performance model with strong multilingual capabilities.',
                    tags: ['Multilingual', 'Enterprise']
                  }
                ].map((agent) => (
                  <div key={agent.id} className={`group bg-white border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden ${selectedModel === agent.id ? 'border-zinc-900 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    
                    {selectedModel === agent.id && (
                      <div className="absolute top-0 right-0 p-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        <VendorIcon provider={agent.provider} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        {agent.provider}
                      </span>
                    </div>

                    <h3 className="font-bold text-zinc-900 mb-1">{agent.name}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4 min-h-[40px]">{agent.desc}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {agent.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedModel(agent.id);
                        // Optional: Navigate back to dashboard automatically
                        // setActiveMenu('dashboard');
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                        selectedModel === agent.id
                          ? 'bg-orange-50 text-orange-600 border border-orange-200 cursor-default'
                          : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg hover:scale-[1.02]'
                      }`}
                    >
                      {selectedModel === agent.id ? 'Deployed' : 'Deploy Model'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeMenu === 'settings' ? (
            <div className="p-8 h-full overflow-y-auto">
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 mb-6">Settings</h2>
              
              <div className="space-y-6 max-w-2xl">
                {/* Account Settings */}
                <div className="bg-white p-6 rounded-2xl border border-zinc-200">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                       <Layout className="w-4 h-4" />
                    </div>
                    Account Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                      <div>
                        <p className="font-medium text-sm">Email Notification</p>
                        <p className="text-xs text-zinc-500">Receive daily market summaries</p>
                      </div>
                      <div className="w-12 h-6 bg-zinc-200 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium text-sm">Dark Mode</p>
                        <p className="text-xs text-zinc-500">Toggle application theme</p>
                      </div>
                       <div className="w-12 h-6 bg-zinc-900 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* API & Data Settings */}
                <div className="bg-white p-6 rounded-2xl border border-zinc-200">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                       <Activity className="w-4 h-4" />
                    </div>
                    Data Sources
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-zinc-700">Yahoo Finance API</span>
                      </div>
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">CONNECTED</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-zinc-700">OpenRouter AI</span>
                      </div>
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">OPERATIONAL</span>
                    </div>
                  </div>
                </div>

                {/* Subscription Plan */}
                <div className="bg-zinc-900 p-6 rounded-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <h3 className="font-bold text-lg mb-2 relative z-10">Pro Plan</h3>
                  <p className="text-zinc-400 text-sm mb-6 relative z-10">Your subscription is active until Dec 2026.</p>
                  <button className="w-full py-3 bg-white text-zinc-900 font-bold rounded-xl text-sm hover:bg-zinc-100 transition-colors relative z-10">
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-400 uppercase tracking-widest">Module Under Development</div>
          )}
        </div>

        {/* INPUT SELECTOR */}
        <div className="p-8 border-t border-zinc-100 bg-white z-30">
          <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto relative group">
            <select
              value={ticker}
              onChange={(e) => {
                const newTicker = e.target.value;
                setTicker(newTicker);
                // If in Agent Market, switch back to workspace when selecting a stock
                if (activeMenu === 'agents') {
                  setActiveMenu('dashboard');
                }
              }}
              className="w-full pl-8 pr-20 py-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl text-zinc-900 font-bold text-xl appearance-none cursor-pointer outline-none focus:border-zinc-900 transition-all shadow-sm"
            >
              <option value="" disabled>SELECT ASSET TERMINAL...</option>
              {SUPPORTED_TICKERS.map((t) => (
                <option key={t.symbol} value={t.symbol}>{t.symbol} — {t.name}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading || !ticker}
              className="absolute right-3 top-3 bottom-3 px-6 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all flex items-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}