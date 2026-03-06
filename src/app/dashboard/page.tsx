'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Bot, Cpu } from 'lucide-react'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardView } from '@/components/dashboard/DashboardView'
import { AgentsView } from '@/components/dashboard/AgentsView'
import { SettingsView } from '@/components/dashboard/SettingsView'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { TickerSelector } from '@/components/dashboard/TickerSelector'
import { InteractiveBackground } from '@/components/landing/InteractiveBackground'

function DashboardContent() {
  const [ticker, setTicker] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [stockData, setStockData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [agentType, setAgentType] = useState('fundamental')
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [selectedModel, setSelectedModel] = useState<string>('google/gemini-2.5-flash-lite')
  
  const [historyList, setHistoryList] = useState<any[]>([])
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

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
        // Allowing Guest Access
        setUserEmail('GUEST_USER')
        return
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

  const executeAnalysis = async (targetTicker: string, specificAgentType?: string, customPrompt?: string) => {
    setLoading(true); setError(''); setAnalysis(''); setStockData(null); 
    // Kita biarkan ticker input tetap berisi text prompt agar user tahu apa yang dieksekusi
    const currentAgentType = specificAgentType || agentType;
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticker: targetTicker, 
          agentType: currentAgentType,
          model: selectedModel,
          customPrompt: customPrompt 
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
    if (!ticker.trim()) {
      setError('Please enter a ticker symbol or analysis prompt')
      return
    }
    if (loading) return
    setSelectedPrompt(null) // Reset selected prompt setelah analyze
    // Jika input berisi kalimat panjang, kita asumsikan itu custom prompt
    if (ticker.length > 10 || ticker.includes(' ')) {
       executeAnalysis('', agentType, ticker.trim())
    } else {
       executeAnalysis(ticker.trim())
    }
  }

  // Handler yang dipanggil dari TickerSelector saat Jerril Template diklik
  const handleJerrilSelect = (promptText: string) => {
    setTicker(promptText) // Masukkan teks ke input
    setSelectedPrompt(promptText) // Tandai bahwa ini dari template
    // Jangan langsung eksekusi, biarkan user klik submit manual
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
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans selection:bg-stellar/30 selection:text-white overflow-hidden relative">
      
      {/* INTERACTIVE BACKGROUND DARI LANDING PAGE */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <InteractiveBackground />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-void/40 to-void/80 pointer-events-none z-0" /> {/* Overlay gradien space depth */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none z-0 mix-blend-overlay" />

      {/* Konten Utama harus di z-10 agar berada di atas background interaktif */}
      <div className="flex h-full w-full relative z-10 backdrop-blur-[2px]">
        <Sidebar 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
          userEmail={userEmail} 
          history={historyList}
          onSelectHistory={(item) => { 
            // Cari pesan dari assistant dalam riwayat pesan
            const assistantMessage = item.messages?.find((m: any) => m.role === 'assistant');
            const userMessage = item.messages?.find((m: any) => m.role === 'user');
            
            // Ekstrak ticker dari title jika ada (format: "Analysis: AAPL")
            const tickerFromTitle = item.title?.includes(': ') ? item.title.split(': ')[1] : '';

            setTicker(userMessage?.content || tickerFromTitle || ''); 
            setAnalysis(assistantMessage?.content || 'No analysis data found.'); 
            setStockData(null); // Reset stock data karena butuh re-fetch jika ingin grafik real-time
            setActiveMenu('dashboard') 
          }}
          onRemoveHistory={async (id) => {
            await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
            fetchHistory();
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

        <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-white/[0.01] backdrop-blur-md border-l border-white/5 shadow-2xl">
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
              <div className="text-center py-20 text-slate-600 uppercase tracking-[0.2em] font-black text-xs">
                Module Under Construction
              </div>
            )}
          </div>

          {activeMenu === 'dashboard' && (
            <TickerSelector
              ticker={ticker}
              onTickerChange={(value) => {
                setTicker(value)
                setSelectedPrompt(null) // Reset jika user edit manual
              }}
              onAnalyze={handleAnalyze}
              loading={loading}
              activeMenu={activeMenu}
              onMenuChange={setActiveMenu}
              onJerrilSelect={handleJerrilSelect} // Prop Jerril Chat
              selectedPrompt={selectedPrompt}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-void">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
             <div className="absolute inset-0 bg-stellar/20 rounded-full blur-xl animate-pulse" />
             <Cpu className="h-10 w-10 text-stellar relative z-10 animate-pulse" />
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] text-stellar uppercase animate-pulse">
            Synchronizing Neural Hub...
          </p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}