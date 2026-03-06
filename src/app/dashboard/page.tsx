'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { AgentsView } from '@/components/dashboard/AgentsView'
import { SettingsView } from '@/components/dashboard/SettingsView'
import { DashboardView } from '@/components/dashboard/DashboardView'
import { JerrilCommander } from '@/components/dashboard/JerrilCommander'
import { Send, Menu, Sparkles, Loader2, PlayCircle, Clock, ChevronDown, Command, Search, Zap, ChevronRight, Bot, TerminalSquare, Building2, MessageSquareText, CheckCircle2, CircleDashed, LineChart } from 'lucide-react'

// Import Robot3D dynamically - Only needed for specific views if any
const RobotCanvas = dynamic(() => import('@/components/Robot3D'), {
  ssr: false,
})

// Define message type
interface Message {
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

interface Chat {
  id: string
  title: string
  created_at: string
}

// PROMPT LIBRARY - PRE-DEFINED TASKS
const PROMPT_LIBRARY = [
  { id: 'nvda-deep', title: 'Deep Dive: NVDA', category: 'Semiconductors', prompt: 'Provide a comprehensive analysis of NVDA stock including earnings outlook, AI exposure, and technical levels.', icon: <Zap className="w-4 h-4 text-yellow-500" /> },
  { id: 'aapl-analysis', title: 'Apple Inc. Analysis', category: 'Big Tech', prompt: 'Analyze AAPL stock performance, iPhone supercycle thesis, and near-term price targets.', icon: <LineChart className="w-4 h-4 text-cyan-500" /> },
  { id: 'spy-outlook', title: 'SPY Market Outlook', category: 'Index', prompt: 'Analyze SPY ETF technicals and broader S&P 500 market structure for the next quarter.', icon: <TerminalSquare className="w-4 h-4 text-blue-500" /> },
  { id: 'tsla-sentiment', title: 'Tesla Sentiment', category: 'EV / Growth', prompt: 'What is the current market sentiment for TSLA? Include delivery expectations and margin analysis.', icon: <Building2 className="w-4 h-4 text-emerald-500" /> },
  { id: 'btc-outlook', title: 'Bitcoin Cycle Analysis', category: 'Crypto', prompt: 'Analyze BTC price structure, on-chain metrics, and macro catalysts for the current cycle.', icon: <Sparkles className="w-4 h-4 text-orange-500" /> },
  { id: 'macro-outlook', title: 'Global Macro Outlook', category: 'Economics', prompt: 'Summarize key macro economic indicators: Fed policy, inflation trajectory, yield curve, and risk-off signals.', icon: <MessageSquareText className="w-4 h-4 text-purple-500" /> },
]

const THINKING_STEPS = [
  { id: 'plan', title: 'Building Analysis Strategy', label: 'Task Planning', icon: TerminalSquare },
  { id: 'fund', title: 'Target Entity & Context', label: 'Fundamental Analysis', icon: Building2 },
  { id: 'sent', title: 'Global Market Sentiment', label: 'Sentiment Analysis', icon: MessageSquareText },
  { id: 'tech', title: 'Price Action & Support', label: 'Technical Analysis', icon: LineChart },
]

export default function DashboardPage() {
  const router = useRouter()
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null
    try { return createClient() } catch { return null }
  }, [])
  
  const [user, setUser] = useState<any>(null)
  
  // WORKSPACE STATES: 'idle' | 'loading' | 'error' | 'results'
  const [workspaceState, setWorkspaceState] = useState<'idle' | 'loading' | 'error' | 'results'>('idle')
  
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false) // Used for internal API loading
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const [isCommanderOpen, setIsCommanderOpen] = useState(false)
  
  // Analysis Results Data
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [stockData, setStockData] = useState<any>(null)
  const [thinkingStep, setThinkingStep] = useState(0)

  // Advance thinking step animation while loading
  useEffect(() => {
    if (workspaceState === 'loading') {
      setThinkingStep(0)
      const interval = setInterval(() => {
        setThinkingStep(prev => {
          if (prev < THINKING_STEPS.length - 1) return prev + 1
          clearInterval(interval)
          return prev
        })
      }, 2500)
      return () => clearInterval(interval)
    }
  }, [workspaceState])

  const chatEndRef = useRef<HTMLDivElement>(null)

  // 1. Check Auth & Load Initial User
  useEffect(() => {
    // Guest access allowed - no strict redirect
    if (!supabase) return
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        fetchChats(user.id)
      }
    }
    checkUser()
  }, [supabase, router])

  // 2. Fetch All Chats for Sidebar
  const fetchChats = async (userId: string) => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (data) setChats(data)
    if (error) console.error('Error fetching chats:', error)
  }

  // 3. Select Chat & Load Messages
  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId)
    setLoading(true)
    setWorkspaceState('results') // Assuming selecting a chat shows results/history
    setMessages([]) 
    
    if (!supabase) {
        setLoading(false)
        return
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)
    setLoading(false)
  }

  // 4. Create New Chat (Reset UI)
  const handleNewChat = () => {
    setCurrentChatId(null)
    setMessages([])
    setInput('')
    setWorkspaceState('idle') // Return to prompt library
  }
  
  // 5. Delete Chat
  const handleDeleteChat = async (chatId: string) => {
    if (!supabase) return
    const { error } = await supabase.from('chats').delete().eq('id', chatId)
    if (!error) {
       setChats(prev => prev.filter(c => c.id !== chatId))
       if (currentChatId === chatId) handleNewChat()
    }
  }

  // 6. Execution Logic (Process Prompt)
  const executePrompt = async (promptText: string) => {
    if (!promptText.trim()) return
    
    setInput(promptText)
    setWorkspaceState('loading')
    setLoading(true)
    
    // Optimistic UI
    const optimisticMsg: Message = { role: 'user', content: promptText, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, optimisticMsg])

    try {
      let chatId = currentChatId

      // Create Chat in DB if User Exists
      if (!chatId && user && supabase) {
        const title = promptText.length > 30 ? promptText.substring(0, 30) + '...' : promptText
        const { data: newChat, error: chatError } = await supabase
          .from('chats')
          .insert({ user_id: user.id, title })
          .select()
          .single()
        
        if (!chatError && newChat) {
          chatId = newChat.id
          setCurrentChatId(chatId)
          setChats(prev => [newChat, ...prev])
        }
      }

      // Save User Msg
      if (chatId && user && supabase) {
        await supabase.from('messages').insert({ chat_id: chatId, role: 'user', content: promptText })
      }

      // API Call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: promptText }]
        })
      })
      
      const data = await response.json()
      const aiText = data.success ? data.message : `Error: ${data.error || 'Failed to get response'}`

      // Extract ticker and fetch stock data if possible
      if (data.success && data.ticker) {
        try {
          const stockRes = await fetch(`/api/stocks?ticker=${data.ticker}`)
          const sData = await stockRes.json()
          if (sData.success) {
            setStockData(sData.data)
          }
        } catch (e) {
          console.error("Failed to fetch stock data for dashboard:", e)
        }
      }

      // Save Assistant Msg
      if (chatId && user && supabase) {
        await supabase.from('messages').insert({ chat_id: chatId, role: 'assistant', content: aiText })
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiText, created_at: new Date().toISOString() }])
      
      // Store analysis data for DashboardView
      setAnalysisResult(aiText) 
      
      // Transition to Results
      setTimeout(() => {
          setWorkspaceState('results')
          setLoading(false)
      }, 1000) // Brief delay to show "Thinking" completion

    } catch (error) {
      console.error('Execution failed:', error)
      setWorkspaceState('error')
      setLoading(false)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    executePrompt(input)
  }

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, workspaceState])

  return (
    <div className="flex h-screen bg-void text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar 
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        userEmail={user?.email || 'Guest User'}
        onSignOut={async () => { await supabase?.auth.signOut(); router.push('/') }}
        chats={chats}
        activeChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        watchlist={[]} 
        onSelectWatchlist={() => {}}
        onRemoveWatchlist={() => {}}
        isAnalyzing={workspaceState === 'loading'}
      />

      {/* Jerril Commander FAB & Tool */}
      {activeMenu === 'dashboard' && workspaceState !== 'loading' && (
        <JerrilCommander 
          isOpen={isCommanderOpen} 
          setIsOpen={setIsCommanderOpen} 
          onSelectPrompt={executePrompt} 
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden h-14 border-b border-white/5 flex items-center justify-between px-4 bg-void/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-400">
                <Menu className="w-5 h-5" />
            </button>
            <span className="font-black text-white tracking-widest uppercase text-sm">Jerril<span className="text-stellar">AI</span></span>
            <div className="w-8" />
        </header>

        {/* WORKSPACE VIEW (ActiveMenu === 'dashboard') */}
        {activeMenu === 'dashboard' && (
          <div className="flex-1 relative bg-void flex flex-col overflow-hidden">
            
            {/* 1. IDLE STATE: PROMPT LIBRARY */}
            {workspaceState === 'idle' && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-full max-w-2xl space-y-8">
                        {/* Hero Text */}
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-void glass-panel stellar-border shadow-2xl shadow-stellar/5 mb-4 group rotate-3 hover:rotate-0 transition-all duration-500">
                                <Sparkles className="w-10 h-10 text-stellar group-hover:scale-110 transition-transform" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white hover:text-stellar transition-colors uppercase tracking-tight leading-none">
                                Intelligence, <span className="text-stellar-glow">On Demand</span>.
                            </h1>
                            <p className="text-slate-500 text-base font-mono uppercase tracking-widest opacity-60">Initialize kernel or select a directive below.</p>
                        </div>

                        {/* Input Field */}
                        <div className="relative group">
                             <div className="absolute inset-0 bg-gradient-to-r from-stellar/20 via-nebula/10 to-stellar/20 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity duration-500"></div>
                             <div className="relative bg-void/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 flex items-center p-2 transition-all group-focus-within:stellar-border group-focus-within:ring-4 group-focus-within:ring-stellar/10">
                                <Search className="w-5 h-5 text-slate-500 ml-4 mr-2" />
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && executePrompt(input)}
                                    placeholder="COMMAND INTERFACE // DESCRIBE TASK..."
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-black uppercase tracking-widest h-14 text-sm"
                                />
                                <button 
                                    onClick={() => executePrompt(input)}
                                    disabled={!input.trim()}
                                    className="p-3.5 bg-white text-void hover:bg-stellar hover:text-void rounded-xl transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed group"
                                >
                                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                             </div>
                        </div>

                        {/* Suggestion Section */}
                        <div className="flex justify-center pt-2">
                             <button 
                                onClick={() => setIsCommanderOpen(true)}
                                className="px-6 py-2 rounded-full bg-stellar/5 border border-stellar/20 text-stellar text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stellar hover:text-void transition-all duration-500 scale-95 hover:scale-100"
                             >
                                Browse Neural Library
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. LOADING STATE: 2-COLUMN THINKING PROCESS */}
            {workspaceState === 'loading' && (
                <div className="flex gap-4 h-full p-6 bg-void animate-in fade-in duration-500">

                    {/* Left Column: Vertical Timeline */}
                    <section className="relative flex max-h-full w-[280px] shrink-0 flex-col overflow-y-auto scrollbar-hide">
                        <div className="relative px-3 py-2">
                            <div className="absolute top-0 right-[22px] bottom-3 w-px border-white/5 border-r-2 border-dashed z-0"></div>
                            <div className="flex flex-col gap-6">
                                {THINKING_STEPS.map((step, idx) => {
                                    const isCompleted = idx < thinkingStep
                                    const isActive = idx === thinkingStep
                                    return (
                                        <div key={idx} className={`group relative flex items-center gap-3 transition-all duration-500 ${idx > thinkingStep ? 'opacity-20' : 'opacity-100'}`}>
                                            <div className={`flex flex-1 cursor-default flex-col gap-2 overflow-hidden rounded-xl border p-3 ring-1 transition-all duration-300 bg-void/40 backdrop-blur-md z-10
                                                ${isActive ? 'stellar-border shadow-lg shadow-stellar/10 ring-stellar/10' :
                                                isCompleted ? 'border-emerald-500/50 ring-emerald-500/10 shadow-sm' : 'border-white/5 ring-white/5'}`}>
                                                <div className="flex items-center gap-1.5">
                                                    {isCompleted ? <CheckCircle2 className="size-4 shrink-0 text-emerald-500" /> :
                                                     isActive ? <Loader2 className="size-4 shrink-0 text-stellar animate-spin" /> :
                                                     <CircleDashed className="size-4 shrink-0 text-white/20" />}
                                                    <span className={`truncate font-black text-[9px] uppercase tracking-widest ${isActive ? 'text-white' : isCompleted ? 'text-emerald-500' : 'text-slate-600'}`}>{step.title}</span>
                                                </div>
                                                <div className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-black text-[8px] uppercase tracking-[0.2em]
                                                    ${isActive ? 'bg-stellar/10 text-stellar' : isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-slate-600'}`}>
                                                    <step.icon className="size-3" />
                                                    <span className="truncate">{step.label}</span>
                                                </div>
                                            </div>
                                            <div className="relative z-10 flex flex-col items-center shrink-0 w-6">
                                                <div className={`absolute top-1/2 right-5 h-px w-6 -translate-y-1/2 transition-colors duration-500 ${isActive ? 'bg-stellar' : isCompleted ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
                                                <div className={`relative flex size-5 items-center justify-center rounded-full border transition-all duration-300 bg-void
                                                    ${isActive ? 'scale-110 stellar-border' : isCompleted ? 'border-emerald-500' : 'border-white/10'}`}>
                                                    <div className={`size-2 rounded-full transition-all duration-300 ${isActive ? 'bg-stellar animate-pulse' : isCompleted ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Right Column: Agent Terminal Log */}
                    <section className="flex-1 rounded-2xl border border-white/5 bg-void/40 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bot className="w-5 h-5 text-stellar animate-pulse" />
                                <div>
                                    <h3 className="font-black text-xs text-white uppercase tracking-[0.2em]">Lumo Agent Terminal</h3>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Executing {THINKING_STEPS[thinkingStep]?.label}...</p>
                                </div>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500/20" />
                                <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                            </div>
                        </div>
                        <div className="flex-1 bg-black/40 p-6 font-mono text-[11px] text-emerald-500/90 overflow-y-auto leading-relaxed relative">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none" />
                            <p className="mb-2 opacity-50 tracking-tighter">&gt; LUMO_OS_v2.0.4_INITIALIZING...</p>
                            <p className="mb-2">&gt; [OAUTH] Session authenticated // Guest Mode...</p>
                            <p className="mb-2" style={{ animationDelay: '0.4s' }}>&gt; [QUERY] Parsing global directive: &quot;{input.substring(0, 40)}{input.length > 40 ? '...' : ''}&quot;</p>
                            <p className="mb-2">&gt; [KERNEL] Allocating neural context window: 128k...</p>
                            {thinkingStep >= 1 && <p className="mb-2 text-white border-l-2 border-stellar pl-3 ml-1">&gt; [FUNDAMENTAL] Accessing SEC EDGAR &amp; real-time equity feeds...</p>}
                            {thinkingStep >= 2 && <p className="mb-2 text-white border-l-2 border-stellar pl-3 ml-1">&gt; [SENTIMENT] Aggregating social velocity &amp; news sentiment...</p>}
                            {thinkingStep >= 3 && <p className="mb-2 text-white border-l-2 border-stellar pl-3 ml-1">&gt; [TECHNICAL] Calculating multi-timeframe RSI, MACD, and OBV...</p>}
                            {thinkingStep >= 3 && <p className="mb-2 text-stellar animate-pulse">&gt; [SYNTHESIS] Generative report compiling...</p>}
                            <span className="inline-block w-2 h-4 bg-stellar animate-pulse mt-2" />
                        </div>
                    </section>
                </div>
            )}

            {/* 3. ERROR STATE */}
            {workspaceState === 'error' && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 bg-void glass-panel border-red-500/50 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-red-500/5">
                        <Zap className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Process Interrupted</h2>
                    <p className="text-slate-500 max-w-md mb-8 font-mono text-xs uppercase tracking-widest opacity-60">
                        The agent encountered a neural anomaly. Kernel reset required.
                    </p>
                    <button 
                        onClick={() => setWorkspaceState('idle')}
                        className="px-10 py-4 bg-white text-void rounded-full font-black uppercase tracking-widest hover:bg-stellar hover:text-void transition-all scale-95 hover:scale-100"
                    >
                        Reset Kernel
                    </button>
                </div>
            )}

            {/* 4. RESULTS STATE: DASHBOARD VIEW */}
            {workspaceState === 'results' && (
                <div className="flex-1 overflow-hidden relative flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Results Header */}
                    <div className="h-14 border-b border-white/5 bg-void flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-3">
                             <div className="relative">
                                <span className="absolute inset-0 bg-emerald-500 rounded-full blur-sm animate-pulse opacity-50"></span>
                                <span className="relative block w-2 h-2 rounded-full bg-emerald-500"></span>
                             </div>
                             <span className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500">Neural Response Ready</span>
                        </div>
                        <div className="flex items-center gap-4">
                             <button
                                onClick={handleNewChat} 
                                className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] px-4 py-2 rounded-full hover:bg-white/5 transition-all"
                             >
                                New Directive
                             </button>
                        </div>
                    </div>
                    
                    {/* Main Results View */}
                    <div className="flex-1 overflow-y-auto bg-void/50">
                        <DashboardView 
                            stockData={stockData} 
                            analysis={messages.length > 0 ? messages[messages.length-1].content : ''} 
                            watchlist={[]}
                            toggleWatchlist={() => {}}
                            loading={false}
                            error=""
                        />
                    </div>
                </div>
            )}
            
          </div>
        )}

        {/* Agents View */}
        {activeMenu === 'agents' && (
           <AgentsView selectedModel={selectedModel} onModelSelect={setSelectedModel} />
        )}

        {/* Settings View */}
        {activeMenu === 'settings' && (
           <SettingsView />
        )}

      </main>
    </div>
  )
}
