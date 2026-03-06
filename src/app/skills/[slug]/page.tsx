'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Terminal,
  Shield,
  Zap,
  Github,
  PlayCircle,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TestDriveModal } from '@/components/dashboard/TestDriveModal'

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

export default function SkillDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTestDrive, setShowTestDrive] = useState(false)

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await fetch('/skills.json')
        const data = await response.json()
        const foundSkill = data.skills.find((s: Skill) => s.slug === slug)
        setSkill(foundSkill || null)
      } catch (error) {
        console.error('Error fetching skill:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchSkill()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900">Skill not found</h2>
        <p className="text-zinc-500">The skill you are looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard?menu=agents" className="text-cyan-600 hover:underline">Return to Jerril</Link>
      </div>
    )
  }

  const copyCommand = async () => {
    await navigator.clipboard.writeText(skill.install_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 px-6 py-8">

      {/* Test Drive Modal */}
      {showTestDrive && (
        <TestDriveModal skill={skill} onClose={() => setShowTestDrive(false)} />
      )}

      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <Link href="/dashboard?menu=agents" className="font-medium">Back to Jerril Hub</Link>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 md:items-start justify-between bg-gradient-to-r from-zinc-50 to-white p-8 rounded-3xl border border-zinc-200/50 shadow-sm">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 border border-zinc-300/50 text-cyan-600 shadow-sm">
              <Terminal className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 leading-tight">{skill.name}</h1>
              <div className="flex items-center gap-3 text-zinc-500 text-base mt-2">
                <span className="font-medium">by {skill.author}</span>
                <span className="text-zinc-300">•</span>
                <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-sm font-semibold">
                  {skill.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Test Drive Button */}
          <button
            onClick={() => setShowTestDrive(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:-translate-y-0.5 font-semibold"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Test Drive</span>
          </button>
          <a
            href={skill.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Github className="w-5 h-5" />
            <span className="font-semibold">View Source</span>
          </a>
        </div>
      </div>

      {/* Install Block */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-zinc-50 to-zinc-100 border-b border-zinc-200">
          <div className="flex items-center gap-3 text-sm font-mono text-zinc-600">
            <Terminal className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">Installation</span>
          </div>
          <button
            onClick={copyCommand}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-cyan-600 transition-colors px-3 py-1 rounded-lg hover:bg-zinc-100"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </button>
        </div>
        <div className="p-8 font-mono text-base md:text-lg relative group">
          <div className="absolute inset-0 bg-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-b-2xl" />
          <div className="flex items-center gap-4 text-zinc-900 relative z-10">
            <span className="text-cyan-600 select-none font-bold">$</span>
            <span className="break-all font-medium">{skill.install_command}</span>
          </div>
        </div>
      </div>

      {/* Description & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="text-2xl font-black text-zinc-900 mb-6">About this Skill</h3>
            <p className="text-zinc-600 leading-relaxed whitespace-pre-line text-lg">
              {skill.description}
            </p>
          </section>

          {/* Features / Capabilities */}
          <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
             <h3 className="text-2xl font-black text-zinc-900 mb-6">Capabilities</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex items-start gap-4 text-zinc-600">
                 <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 mt-1">
                   <Zap className="w-5 h-5 text-cyan-600" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-zinc-900 mb-1">Optimized Performance</h4>
                   <span>Engineered for low-latency execution environments.</span>
                 </div>
               </div>
               <div className="flex items-start gap-4 text-zinc-600">
                 <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 mt-1">
                   <Shield className="w-5 h-5 text-zinc-600" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-zinc-900 mb-1">Secure Execution</h4>
                   <span>Sandboxed environment with strict permission boundaries.</span>
                 </div>
               </div>
             </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="p-6 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white shadow-sm">
            <h4 className="font-black text-zinc-900 mb-6 text-lg">Metadata</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-3 border-b border-zinc-200">
                <span className="text-zinc-500 font-medium">Version</span>
                <span className="text-zinc-900 font-semibold">1.0.0</span>
              </div>
              <div className="flex justify-between py-3 border-b border-zinc-200">
                <span className="text-zinc-500 font-medium">License</span>
                <span className="text-zinc-900 font-semibold">MIT</span>
              </div>
              <div className="flex justify-between py-3 border-b border-zinc-200">
                <span className="text-zinc-500 font-medium">Updated</span>
                <span className="text-zinc-900 font-semibold">2 days ago</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-zinc-500 font-medium">Downloads</span>
                <span className="text-zinc-900 font-semibold">1.2k</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white shadow-sm">
            <h4 className="font-black text-zinc-900 mb-6 text-lg">Tags</h4>
            <div className="flex flex-wrap gap-3">
              {(skill.tags || ['ai', 'automation']).map((tag: string) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-sm text-zinc-600 font-medium hover:bg-zinc-50 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}