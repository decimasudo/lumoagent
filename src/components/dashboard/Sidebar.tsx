'use client'

import { LayoutDashboard, Bot, Settings, LogOut, TrendingUp, History, ChevronRight, Star, Trash2 } from 'lucide-react'

interface SidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
  userEmail: string | null
  onSignOut: () => void
  
  // Props untuk History
  history: any[] 
  onSelectHistory: (item: any) => void 
  
  // Props Baru untuk Watchlist
  watchlist: any[]
  onSelectWatchlist: (ticker: string) => void
  onRemoveWatchlist: (id: string) => void
  isAnalyzing?: boolean // Added prop for loading state
}

export function Sidebar({ 
  activeMenu, 
  setActiveMenu, 
  userEmail, 
  onSignOut, 
  history, 
  onSelectHistory,
  watchlist,
  onSelectWatchlist,
  onRemoveWatchlist,
  isAnalyzing = false // Default to false
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Workspace', icon: LayoutDashboard },
    { id: 'agents', label: 'LUMO Hub', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]


  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col justify-between hidden md:flex">
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-4">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-100 sticky top-0 bg-white z-10">
          <div className="w-8 h-8 bg-white border-2 border-orange-200 rounded-lg flex items-center justify-center mr-3 shadow-sm p-1">
            <img src="/logo.jpeg" alt="LumoAgent" className="w-full h-full rounded" />
          </div>
          <span className="font-bold text-xl tracking-tight text-zinc-900">LumoAgent</span>
        </div>

        {/* Main Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`group w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all ${
                activeMenu === item.id 
                ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm' 
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left flex items-center justify-between">
                {item.label}
                {item.id === 'dashboard' && isAnalyzing && (
                  <span className="flex items-center h-full ml-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                   <span className="text-[10px] ml-2 font-normal text-muted-foreground hidden group-hover:block transition-all opacity-0 group-hover:opacity-100">Analyzing...</span>
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>

        {/* Watchlist Section (Daya Ingat Portofolio) */}
        {watchlist.length > 0 && (
          <div className="px-4 mt-2 mb-2 animate-in fade-in duration-500">
            <div className="flex items-center space-x-2 px-2 mb-3">
              <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Watchlist</span>
            </div>
            <div className="space-y-1">
              {watchlist.map((item) => (
                <div key={item.id} className="flex items-center justify-between group px-3 py-2 rounded-md hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100">
                  <button
                    onClick={() => onSelectWatchlist(item.ticker)}
                    className="flex-1 text-left flex flex-col overflow-hidden"
                  >
                    <span className="text-sm font-bold text-zinc-700 group-hover:text-zinc-900 truncate uppercase">
                      {item.ticker}
                    </span>
                  </button>
                  <button 
                    onClick={() => onRemoveWatchlist(item.id)}
                    className="p-1.5 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-red-50"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Section (Daya Ingat Chat) */}
        {history.length > 0 && (
          <div className="px-4 mt-6 mb-6 animate-in fade-in duration-500">
            <div className="flex items-center space-x-2 px-2 mb-3">
              <History className="w-4 h-4 text-zinc-400" />
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Recent Analysis</span>
            </div>
            <div className="space-y-1">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectHistory(item)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md group hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100"
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-zinc-700 group-hover:text-zinc-900 truncate uppercase">
                      {item.ticker}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-zinc-200 bg-zinc-50/50 shrink-0">
        <div className="mb-4 px-2">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Account</p>
          <p className="text-sm font-semibold truncate text-zinc-700">{userEmail || 'Guest'}</p>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-zinc-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-zinc-600 rounded-lg transition-all text-sm font-medium shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}