import React from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Network, 
  Settings, 
  History, 
  Star, 
  LogOut, 
  Bot, 
  Trash2,
  ChevronRight,
  Twitter,
  ShieldAlert,
  UserCircle
} from 'lucide-react'

interface SidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
  userEmail: string | null
  history: any[]
  onSelectHistory: (item: any) => void
  onRemoveHistory: (id: string) => void
  watchlist: any[]
  onSelectWatchlist: (ticker: string) => void
  onRemoveWatchlist: (id: string) => void
  onSignOut: () => void
  isAnalyzing?: boolean
}

export function Sidebar({ 
  activeMenu, 
  setActiveMenu, 
  userEmail, 
  history = [], 
  onSelectHistory, 
  onRemoveHistory,
  watchlist = [], 
  onSelectWatchlist, 
  onRemoveWatchlist, 
  onSignOut,
  isAnalyzing 
}: SidebarProps) {
  
  const NavItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: string }) => {
    const isActive = activeMenu === id
    return (
      <button
        onClick={() => setActiveMenu(id)}
        disabled={isAnalyzing}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed
          ${isActive 
            ? 'bg-stellar/10 border border-stellar/20 shadow-[0_0_15px_rgba(34,211,238,0.05)]' 
            : 'hover:bg-white/5 border border-transparent'}`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-stellar' : 'text-slate-500 group-hover:text-slate-300'}`} />
          <span className={`text-sm font-bold tracking-wide transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
            {label}
          </span>
        </div>
        {isActive && <ChevronRight className="w-4 h-4 text-stellar animate-in slide-in-from-left-2" />}
      </button>
    )
  }

  const isGuest = !userEmail || userEmail === 'GUEST_USER'

  return (
    <aside className="w-72 flex-none flex flex-col h-full bg-void/90 backdrop-blur-2xl border-r border-white/5 relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center gap-4">
        <div className="relative flex-none">
          <div className="absolute inset-0 bg-stellar/30 blur-md rounded-full animate-pulse" />
          <div className="relative bg-void border border-stellar/30 p-1.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)] overflow-hidden">
            <img 
              src="/logo.jpeg" 
              alt="Jerril Logo" 
              className="w-7 h-7 object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-black tracking-tighter text-xl text-white leading-none uppercase">
            Jerril<span className="text-transparent bg-clip-text bg-gradient-to-r from-stellar to-blue-500">.AI</span>
          </span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            Neural Terminal v3.0
          </span>
        </div>
      </div>

      {/* Guest Upsell Prompt */}
      {isGuest && (
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-stellar/10 to-transparent border border-stellar/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <ShieldAlert className="w-8 h-8 text-stellar" />
          </div>
          <p className="text-[10px] font-black text-stellar uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stellar/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stellar"></span>
            </span>
            Restricted Access
          </p>
          <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-3">
            Neural sync and watchlist persistence are disabled in Guest Mode.
          </p>
          <Link 
            href="/auth/signup"
            className="flex items-center justify-center w-full py-2 bg-stellar text-void text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            Authorize Account
          </Link>
        </div>
      )}

      {/* Main Navigation */}
      <div className="p-4 space-y-1.5 border-b border-white/5">
        <NavItem icon={LayoutDashboard} label="Workspace" id="dashboard" />
        <NavItem icon={Network} label="Jerril Hub" id="agents" />
      </div>

      {/* Scrollable Content: Watchlist & History */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-8">
        
        {/* Watchlist Section */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">
            <Star className="w-3.5 h-3.5 text-stellar" /> Active Watchlist
          </h3>
          <div className="space-y-1">
            {watchlist.length === 0 ? (
              <p className="text-xs text-slate-600 px-2 italic">Awaiting asset link...</p>
            ) : (
              watchlist.map((item) => (
                <div key={item.id} className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <button 
                    onClick={() => onSelectWatchlist(item.ticker)}
                    disabled={isAnalyzing}
                    className="flex-1 text-left text-sm font-bold text-slate-300 group-hover:text-white transition-colors disabled:opacity-50"
                  >
                    {item.ticker}
                  </button>
                  <button 
                    onClick={() => onRemoveWatchlist(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <History className="w-3.5 h-3.5 text-stellar" /> Neural Logs
            </h3>
            {isGuest && (
              <span className="text-[8px] font-bold text-amber-500/50 uppercase tracking-tighter bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10">Read-Only</span>
            )}
          </div>
          <div className="space-y-1">
            {isGuest ? (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mx-2 group hover:border-stellar/20 transition-all">
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed text-center italic">
                  Sign in to securely archive and sync your analysis trajectories.
                </p>
              </div>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-600 px-2 italic">Awaiting neural trace...</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="group relative flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-stellar/20 shadow-sm hover:shadow-stellar/10">
                  <button 
                    onClick={() => onSelectHistory(item)}
                    disabled={isAnalyzing}
                    className="flex-1 text-left min-w-0"
                  >
                    <span className="block text-sm font-bold text-slate-200 group-hover:text-stellar transition-colors truncate tracking-wide">
                      {item.title || `Ref: ${item.id.slice(0, 8)}`}
                    </span>
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                      {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveHistory(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Foot Profile & Social */}
      <div className="p-4 border-t border-white/5 bg-white/[0.01] space-y-3">
        <a 
          href="https://x.com/jerrilagent"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:stellar-border transition-all group"
        >
          <Twitter className="w-4 h-4 text-slate-400 group-hover:text-stellar" />
          <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-[0.2em]">Join Community</span>
        </a>

        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="flex items-center gap-3 overflow-hidden">
             {isGuest ? (
               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-slate-500">
                  <UserCircle className="w-5 h-5" />
               </div>
             ) : (
               <div className="w-8 h-8 rounded-lg bg-stellar/10 flex items-center justify-center border border-stellar/20 text-stellar">
                  <Bot className="w-5 h-5" />
               </div>
             )}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Operator</span>
              <span className="text-xs font-medium text-slate-300 truncate mt-0.5">
                {isGuest ? 'GUEST_USER' : userEmail}
              </span>
            </div>
          </div>
          <button 
            onClick={onSignOut}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-none"
            title={isGuest ? "Exit Terminal" : "Disconnect"}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}