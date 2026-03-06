'use client'

import { Layout, Activity } from 'lucide-react'

export function SettingsView() {
  return (
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
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold text-zinc-700">Yahoo Finance API</span>
              </div>
              <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">CONNECTED</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold text-zinc-700">OpenRouter AI</span>
              </div>
              <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">OPERATIONAL</span>
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
  )
}