'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { AnalysisResult, StockData } from '@/types'
import {
  BarChart3,
  Search,
  TrendingUp,
  Shield,
  Target,
  Brain,
  Clock,
  Trash2,
  LogOut,
  ChevronRight,
  Loader2,
  AlertCircle,
  DollarSign,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export default function Dashboard() {
  const [ticker, setTicker] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [history, setHistory] = useState<AnalysisResult[]>([])
  const [user, setUser] = useState<any>(null)
  const [showHistory, setShowHistory] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchHistory()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history')
      const data = await response.json()
      if (data.success) {
        setHistory(data.data)
      }
    } catch (err) {
      console.error('Error fetching history:', err)
    }
  }

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault()
    if (!ticker.trim()) return

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: ticker.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setAnalysis(data.data)
        if (data.data.userId) {
          fetchHistory()
        }
      } else {
        setError(data.error || 'Failed to analyze stock')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteHistory = async (id: string) => {
    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setHistory(history.filter((item) => item.id !== id))
        if (analysis?.id === id) {
          setAnalysis(null)
        }
      }
    } catch (err) {
      console.error('Error deleting analysis:', err)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setHistory([])
  }

  const formatMarketCap = (value: number): string => {
    if (!value) return 'N/A'
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const parseMarkdown = (text: string) => {
    // Simple markdown parsing
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-slate-900 mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-slate-900 mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-slate-800 mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-slate-600">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 text-slate-600">$1</li>')
      .replace(/\n/gim, '<br />')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">QuantAI</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-slate-600">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Analyze Stock</h2>
              <form onSubmit={handleAnalyze} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="Enter stock ticker (e.g., AAPL)"
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg uppercase"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !ticker.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Analyze
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{analysis.ticker}</h2>
                      <p className="text-blue-100">{analysis.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white">
                        ${analysis.stockData.currentPrice.toFixed(2)}
                      </p>
                      <p className="text-blue-100 text-sm">Current Price</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 border-b border-slate-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{formatMarketCap(analysis.stockData.marketCap)}</p>
                    <p className="text-xs text-slate-500">Market Cap</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-lg font-semibold text-slate-900">
                      {analysis.stockData.peRatio ? analysis.stockData.peRatio.toFixed(2) : 'N/A'}
                    </p>
                    <p className="text-xs text-slate-500">P/E Ratio</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-lg font-semibold text-slate-900">
                      ${analysis.stockData.eps ? analysis.stockData.eps.toFixed(2) : 'N/A'}
                    </p>
                    <p className="text-xs text-slate-500">EPS</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg mx-auto mb-2">
                      <PieChart className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-lg font-semibold text-slate-900">
                      {analysis.stockData.dividendYield
                        ? (analysis.stockData.dividendYield * 100).toFixed(2)
                        : '0'}%
                    </p>
                    <p className="text-xs text-slate-500">Dividend</p>
                  </div>
                </div>

                {/* 52 Week Range */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">52-Week Range</span>
                    <span className="text-sm text-slate-900">
                      ${analysis.stockData.week52Low?.toFixed(2)} - ${analysis.stockData.week52High?.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                      style={{
                        width: `${((analysis.stockData.currentPrice - analysis.stockData.week52Low) /
                          (analysis.stockData.week52High - analysis.stockData.week52Low)) *
                          100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Brain className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-slate-900">AI Analysis</h3>
                  </div>
                  <div
                    className="prose prose-slate max-w-none text-slate-600"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(analysis.aiAnalysis) }}
                  />
                </div>

                {/* Timestamp */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center text-sm text-slate-500">
                  <Clock className="w-4 h-4 mr-2" />
                  Analyzed on {formatDate(analysis.createdAt)}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!analysis && !loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Analysis Yet</h3>
                <p className="text-slate-600 mb-4">
                  Enter a stock ticker above to get AI-powered analysis
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                  <span>Try: AAPL, GOOGL, MSFT, TSLA, AMZN</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Analysis Features</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Quantitative Analysis</p>
                    <p className="text-sm text-slate-500">P/E, Market Cap, EPS metrics</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Risk Assessment</p>
                    <p className="text-sm text-slate-500">Volatility & range analysis</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Strategy Recommendation</p>
                    <p className="text-sm text-slate-500">Bullish/Neutral/Bearish</p>
                  </div>
                </div>
              </div>
            </div>

            {/* History Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Recent Analyses</h3>
                {history.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showHistory ? 'Hide' : 'Show All'}
                  </button>
                )}
              </div>

              {history.length > 0 ? (
                <div className="space-y-3">
                  {(showHistory ? history : history.slice(0, 5)).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">{item.ticker}</p>
                        <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteHistory(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  {user ? 'No analysis history yet' : 'Sign in to save your analysis history'}
                </p>
              )}

              {!user && history.length === 0 && (
                <Link
                  href="/auth/signup"
                  className="mt-4 w-full block text-center bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up to Save History
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
