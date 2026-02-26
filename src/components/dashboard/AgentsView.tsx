'use client'

import { Bot, Github, Terminal, Zap, Search, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Skill {
  id: number
  name: string
  slug: string
  description: string
  category: string
  author: string
  github_url: string
  install_command: string
  featured?: boolean
  popular?: boolean
  tags?: string[]
}

interface AgentsViewProps {
  selectedModel: string
  onModelSelect: (model: string) => void
}

export function AgentsView({ selectedModel, onModelSelect }: AgentsViewProps) {
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const categories = [
    { id: 'all', label: 'All Skills', icon: Terminal },
    { id: 'AI & LLMs', label: 'AI & LLMs', icon: Bot },
    { id: 'Search & Research', label: 'Search & Research', icon: Search },
    { id: 'Finance', label: 'Finance', icon: TrendingUp }
  ]

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/skills.json')
        const data = await response.json()
        // Get all skills from the specified categories
        const filteredSkills = data.skills.filter((skill: Skill) =>
          ['AI & LLMs', 'Search & Research', 'Finance'].includes(skill.category)
        )
        setAllSkills(filteredSkills)
        setFilteredSkills(filteredSkills)
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredSkills(allSkills)
    } else {
      setFilteredSkills(allSkills.filter(skill => skill.category === activeFilter))
    }
    setCurrentPage(1) // Reset to first page when filter changes
  }, [activeFilter, allSkills])

  // Pagination logic
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSkills = filteredSkills.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI & LLMs':
        return <Bot className="w-5 h-5" />
      case 'Search & Research':
        return <Search className="w-5 h-5" />
      case 'Finance':
        return <TrendingUp className="w-5 h-5" />
      default:
        return <Terminal className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="p-8 h-full overflow-y-auto flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-full overflow-y-auto animate-in fade-in duration-700 bg-gradient-to-br from-zinc-50 via-white to-zinc-50">
      {/* Lumo Introduction Section */}
      <div className="relative px-8 py-16 lg:px-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 leading-tight">
                  Meet <span className="text-orange-600 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">LUMO</span>
                </h1>
                <div className="space-y-4 text-lg md:text-xl text-zinc-600 leading-relaxed">
                  <p>
                    When the age of financial AI began, it did not begin gently. New systems appeared almost overnight — faster, sharper, relentlessly optimized. They were engineered to predict before others could react, to trade before others could think, to capture opportunity with mechanical precision.
                  </p>
                  <p>
                    But somewhere in that race, a different question was asked.
                  </p>
                  <p className="font-semibold text-zinc-800">
                    What if intelligence didn't have to be aggressive to be powerful?
                  </p>
                  <p>
                    LUMO was born from that question. He was not designed to conquer volatility or exploit weakness. He was shaped to understand the people behind the numbers — the uncertainty before a first investment, the tension of a falling chart, the quiet hope attached to long-term plans.
                  </p>
                  <p className="font-semibold text-zinc-800 italic">
                    That is what makes him different. And that difference is his strength.
                  </p>
                </div>
              </div>
            </div>

            {/* Robot Image */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative group">
                <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200 p-2 shadow-2xl border border-zinc-300/50">
                  <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center overflow-hidden border border-zinc-100 shadow-inner">
                    <img 
                      src="/logo.jpeg" 
                      alt="LUMO" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                {/* Robotic glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/20 via-zinc-400/10 to-purple-400/20 opacity-0 group-hover:opacity-100 blur-2xl -z-10 transition-opacity duration-700"></div>
                {/* Circuit pattern overlay */}
                <div className="absolute inset-2 rounded-2xl border border-zinc-200/30 opacity-50 pointer-events-none">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-4 right-4 w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="px-8 pb-16 lg:px-16 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-zinc-900 via-orange-600 to-zinc-900 bg-clip-text text-transparent mb-4">LUMO Skills</h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Explore specialized AI skills engineered for intelligent analysis and decision-making.</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300 ${
                    activeFilter === category.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-lg shadow-orange-500/25'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{category.label}</span>
                  {activeFilter === category.id && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {filteredSkills.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentSkills.map((skill, index) => (
              <Link
                key={skill.id}
                href={`/skills/${skill.slug}`}
                className="group bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-300 transition-all duration-500 block hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2"
                style={{animationDelay: `${index * 50}ms`}}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-xl flex items-center justify-center border border-zinc-200/50 group-hover:bg-orange-50 group-hover:border-orange-200 transition-all duration-300 shadow-sm">
                    {getCategoryIcon(skill.category)}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full uppercase tracking-wider border border-zinc-100">
                    {skill.category}
                  </span>
                </div>

                <h3 className="font-bold text-zinc-900 mb-2 group-hover:text-orange-600 transition-colors text-lg leading-tight">{skill.name}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-5 min-h-[48px] line-clamp-3">{skill.description}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {(skill.tags || ['ai']).slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] font-semibold text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-100 hover:bg-zinc-100 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-4 border-t border-zinc-100">
                  <span className="font-medium">by {skill.author}</span>
                  <div className="flex items-center gap-1">
                    <Github className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-wider">Source</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-sm font-medium">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}