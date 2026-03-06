'use client'

import { useState, useRef, useEffect } from 'react'
import {
  X, Send, Bot, User, Loader2, Zap, RotateCcw, Terminal, Sparkles
} from 'lucide-react'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Skill {
  id: number
  name: string
  slug: string
  description: string
  category: string
  author: string
}

interface TestDriveModalProps {
  skill: Skill
  onClose: () => void
}

// Generate suggested questions based on skill category & name
function getSuggestedQuestions(skill: Skill): string[] {
  const { category, name, slug, description } = skill
  const lowerCat = category.toLowerCase()
  const lowerName = name.toLowerCase()

  // Specific Slug Handling
  if (slug === 'warren-intelligence') {
    return [
      "Evaluate AAPL's economic moat and margin safety",
      "Analyze MSFT's intrinsic value based on cash flows",
      "Is NVDA's current valuation sustainable long-term?",
      "Assess BRK-B capital allocation effectiveness",
      "What are the key qualitative risks for TSLA?"
    ]
  }

  if (slug === 'market-researcher') {
    return [
      "Latest news on semiconductor supply chain disruptions",
      "What is the current market sentiment for BTC-USD?",
      "Summarize recent Federal Reserve meeting minutes",
      "Find top analyst ratings for LLY and NVO",
      "Trending macroeconomic factors affecting S&P 500"
    ]
  }

  if (slug === 'momentum-quant') {
    return [
      "Identify overbought stocks using RSI (14)",
      "Technical breakout alert for SOL-USD",
      "Analyze the MACD signal for NVIDIA (NVDA)",
      "Support and resistance levels for ETH-USD",
      "Volume-weighted momentum score for AAPL"
    ]
  }

  if (slug === 'news-sentiment') {
    return [
      "Analyze sentiment for recent $NVDA headlines",
      "What is the market's mood on $TSLA today?",
      "Summarize news impact on $AAPL share price",
      "Are there any bearish signals for $BTC in news?",
      "Quantify news volatility for the banking sector"
    ]
  }

  if (lowerCat.includes('finance') || lowerName.includes('stock') || lowerName.includes('trade') || lowerName.includes('market')) {
    // Generate personalized questions based on skill name
    const skillWords = name.toLowerCase().split(/[\s\-_]+/).filter(word => word.length > 2)

    return [
      `How can ${name} help with financial analysis?`,
      `What trading strategies does ${name} support?`,
      `Show me how ${name} analyzes market data`,
      `How does ${name} handle portfolio optimization?`,
      `What risk management features does ${name} offer?`
    ]
  }
  if (lowerCat.includes('ai') || lowerCat.includes('llm') || lowerName.includes('ai') || lowerName.includes('llm')) {
    // Generate personalized questions based on skill name
    const skillWords = name.toLowerCase().split(/[\s\-_]+/).filter(word => word.length > 2)

    return [
      `What AI capabilities does ${name} provide?`,
      `How can ${name} help with complex reasoning tasks?`,
      `Show me how ${name} processes and analyzes data`,
      `What are the integration options for ${name}?`,
      `How does ${name} handle multi-step workflows?`
    ]
  }
  if (lowerCat.includes('search') || lowerCat.includes('research')) {
    // Generate personalized questions based on skill name and description
    const skillWords = name.toLowerCase().split(/[\s\-_]+/).filter(word => word.length > 2)
    const descWords = description.toLowerCase().split(/[\s\-_]+/).filter(word => word.length > 2)

    // Extract key topics from skill name and description
    const topics = [...new Set([...skillWords, ...descWords])].slice(0, 3)

    return [
      `How can ${name} help me search for information?`,
      `What kind of research tasks is ${name} best suited for?`,
      `Show me an example of using ${name} for ${topics[0] || 'data'} analysis`,
      `How does ${name} handle complex search queries?`,
      `What are the advanced features of ${name} for research?`
    ]
  }
  if (lowerCat.includes('web') || lowerCat.includes('frontend') || lowerCat.includes('dev')) {
    // Generate personalized questions based on skill name
    const skillWords = name.toLowerCase().split(/[\s\-_]+/).filter(word => word.length > 2)

    return [
      `What web development tasks can ${name} help with?`,
      `How does ${name} handle UI/UX design?`,
      `Show me how ${name} creates interactive components`,
      `What frameworks and tools does ${name} support?`,
      `How can ${name} optimize web performance?`
    ]
  }
  // Generic fallbacks - personalized based on skill name
  return [
    `What can ${name} do for me?`,
    `Give me a practical demo of ${name} in action`,
    `What are the most powerful use cases for ${name}?`,
    `How does ${name} handle complex or edge-case inputs?`,
    `Walk me through a step-by-step workflow using ${name}`
  ]
}

export function TestDriveModal({ skill, onClose }: TestDriveModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestedQuestions = getSuggestedQuestions(skill)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Close on Escape key
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setStarted(true)

    try {
      const res = await fetch('/api/skill-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          skillName: skill.name,
          skillDescription: skill.description,
          skillCategory: skill.category,
          skillSlug: skill.slug
        })
      })

      const data = await res.json()

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection failed. Please try again.' }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleReset = () => {
    setMessages([])
    setStarted(false)
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">Test Drive</h2>
              <p className="text-xs text-zinc-400 font-mono">{skill.name}</p>
            </div>
            <span className="ml-2 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
              Sandbox
            </span>
          </div>
          <div className="flex items-center gap-2">
            {started && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/50">
          
          {/* Welcome / Suggestions */}
          {!started && (
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[85%]">
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    <span className="font-bold text-zinc-900">Skill active.</span> You are now in the sandbox for{' '}
                    <span className="font-semibold text-cyan-600">{skill.name}</span>.
                    Ask me anything related to this skill, or pick a suggested question below.
                  </p>
                </div>
              </div>
              
              {/* Suggested Questions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Suggested Questions</span>
                </div>
                <div className="space-y-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-zinc-200 bg-white hover:border-cyan-300 hover:bg-cyan-50 text-sm text-zinc-600 hover:text-zinc-900 transition-all duration-200 group shadow-sm hover:shadow-md"
                    >
                      <span className="text-cyan-500 font-bold mr-2 group-hover:text-cyan-600">→</span>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-cyan-600" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-zinc-900 text-white rounded-tr-sm'
                  : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-zinc-900 prose-p:text-zinc-700">
                    <MarkdownRenderer>{msg.content}</MarkdownRenderer>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-zinc-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-zinc-600" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-medium font-mono">Skill processing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 bg-white border-t border-zinc-100 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Ask ${skill.name} anything...`}
                disabled={loading}
                autoFocus
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <p className="text-center text-[10px] text-zinc-400 mt-2 font-medium">
            Sandbox mode — powered by LumoAgent via OpenRouter
          </p>
        </div>
      </div>
    </div>
  )
}
