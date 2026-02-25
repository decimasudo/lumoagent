'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Zap, ChevronRight, BarChart3, Brain, Target } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">QuantAI</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
                How It Works
              </Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all hover:scale-[1.02] shadow-lg shadow-blue-600/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient pt-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Financial Analysis
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Smart Stock Analysis
              <span className="block text-blue-600">Powered by AI</span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get quantitative insights, risk assessments, and investment strategies for any stock in seconds.
              Leveraging advanced AI to help you make smarter investment decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] shadow-xl shadow-blue-600/25 flex items-center justify-center"
              >
                Start Analyzing Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-slate-50 flex items-center justify-center"
              >
                See How It Works
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              No credit card required. Start with 5 free analyses.
            </p>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
              <div className="absolute top-0 left-0 right-0 h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="pt-12 p-8 bg-white">
                <div className="flex items-center justify-center space-x-8 mb-8">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-slate-900">$184.25</p>
                    <p className="text-sm text-slate-500">AAPL Price</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200"></div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600">28.4</p>
                    <p className="text-sm text-slate-500">P/E Ratio</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200"></div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-600">2.41T</p>
                    <p className="text-sm text-slate-500">Market Cap</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    AI Analysis
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Apple demonstrates strong fundamentals with a P/E ratio of 28.4, suggesting fair valuation relative to earnings.
                    The stock is currently trading near its 52-week high, indicating positive market sentiment.
                    <span className="text-green-600 font-medium"> Recommendation: Hold</span> with potential for long-term growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Smart Investing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to make informed investment decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 transition-all card-hover border border-slate-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Quantitative Analysis
              </h3>
              <p className="text-slate-600 leading-relaxed">
                AI-driven analysis of key metrics including P/E ratios, market cap, EPS, and dividend yields.
                Get professional-grade insights in seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 transition-all card-hover border border-slate-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Risk Management
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Comprehensive risk assessment including volatility analysis, 52-week range positioning,
                and volume indicators to help you manage downside risk.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 transition-all card-hover border border-slate-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Investment Strategy
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Receive clear investment recommendations with reasoning based on quantitative data.
                Make confident decisions with AI-powered insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get analysis in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Enter Ticker
              </h3>
              <p className="text-slate-600">
                Simply enter any stock ticker symbol (like AAPL, GOOGL, MSFT) in our search field.
              </p>

              {/* Connector */}
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 relative z-10">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                AI Analysis
              </h3>
              <p className="text-slate-600">
                Our AI fetches real-time data and performs comprehensive quantitative analysis.
              </p>

              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 relative z-10">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                Get Insights
              </h3>
              <p className="text-slate-600">
                Receive detailed analysis including risk assessment and investment strategy recommendations.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Try it now
              <ChevronRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make Smarter Investment Decisions?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of investors using AI to analyze stocks and manage risk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-white/10"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">QuantAI</span>
              </div>
              <p className="text-slate-400 max-w-md">
                AI-powered stock analysis platform helping investors make smarter decisions with quantitative insights and risk management.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-slate-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} QuantAI. All rights reserved.
            </p>
            <p className="text-slate-500 text-sm mt-4 md:mt-0">
              Investing involves risk. This is for educational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
