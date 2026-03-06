'use client'

import { LayoutDashboard, Bot, Settings, LogOut, TrendingUp, History, ChevronRight, Star, Trash2, UserPlus, LogIn } from 'lucide-react'

interface SidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
  userEmail: string | null
  onSignOut: () => void
  
  // Props untuk History
  chats: any[] 
  activeChatId?: string | null
  onSelectChat: (chatId: string) => void 
  onDeleteChat: (chatId: string) => void
  onNewChat: () => void
  
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
  chats = [], 
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  watchlist,
  onSelectWatchlist,
  onRemoveWatchlist,
  isAnalyzing = false // Default to false
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Jerril Chat', icon: Bot },
    { id: 'agents', label: 'Agent Hub', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]


  return (
    <aside className="w-64 bg-white border-r border-zinc-100 flex flex-col justify-between hidden md:flex relative">
      {/* Decorative vertical line */}
      <div className="absolute right-[-1px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-4 relative z-10 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="w-8 h-8 bg-white border-2 border-zinc-100 rounded-lg flex items-center justify-center mr-3 shadow-sm p-1 relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img src="/logo.jpeg" alt="Jerril" className="w-full h-full rounded relative z-10" />
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-900">
            Jerril<span className="text-cyan-600">AI</span>
          </span>
        </div>

        {/* New Chat Button */}
        <div className="px-4 py-4">
          <button 
            onClick={onNewChat}
            className="w-full flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl transition-all shadow-sm group active:scale-[0.98]"
          >
            <Bot className="w-4 h-4 text-cyan-400 group-hover:animate-pulse" />
            <span className="font-semibold text-sm">New Chat</span>
          </button>
        </div>

        {/* Main Menu */}
        <nav className="p-4 space-y-1.5 pt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden ${
                activeMenu === item.id 
                ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              {activeMenu === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
              )}
              <item.icon className={`w-4 h-4 ${activeMenu === item.id ? 'text-cyan-400' : ''}`} />
              <span className="flex-1 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                {item.label}
                {item.id === 'dashboard' && isAnalyzing && (
                  <span className="flex items-center">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>

        {/* History Section (Daya Ingat Chat) */}
        <div className="flex-1 px-4 mt-2 overflow-y-auto">
          {chats.length > 0 && (
            <div className="animate-in fade-in duration-500 mb-6">
              <div className="flex items-center space-x-2 px-2 mb-3">
                <History className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Chat History</span>
              </div>
              <div className="space-y-1">
                {chats.map((chat) => (
                  <div key={chat.id} className="relative group">
                    <button
                      onClick={() => onSelectChat(chat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-all border ${
                        activeChatId === chat.id 
                          ? 'bg-zinc-50 border-zinc-200 text-zinc-900 shadow-sm' 
                          : 'text-zinc-600 border-transparent hover:bg-zinc-50 hover:text-zinc-900'
                      }`}
                    >
                      <span className="text-sm font-medium truncate pr-6">
                        {chat.title || 'New Chat'}
                      </span>
                    </button>
                    
                    {/* Delete Button (Visible on Hover) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all z-10"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Watchlist Section (Daya Ingat Portofolio) */}
        {watchlist.length > 0 && (
          <div className="px-4 mt-auto mb-2 animate-in fade-in duration-500 border-t border-zinc-100 pt-4">
            <div className="flex items-center justify-between px-2 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Watchlist</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-300">{watchlist.length.toString().padStart(2, '0')}</span>
            </div>
            <div className="space-y-1">
              {watchlist.map((item) => (
                <div key={item.id} className="flex items-center justify-between group px-3 py-2.5 rounded-xl hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100">
                  <button
                    onClick={() => onSelectWatchlist(item.ticker)}
                    className="flex-1 text-left flex flex-col overflow-hidden"
                  >
                    <span className="text-xs font-bold text-zinc-700 group-hover:text-zinc-900 truncate uppercase tracking-tight">
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
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-zinc-200 bg-zinc-50/50 shrink-0">
        <div className="mb-4 px-2">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Account</p>
          <p className="text-sm font-semibold truncate text-zinc-700">{userEmail && userEmail !== 'Guest User' ? userEmail : 'Guest Session'}</p>
        </div>
        
        {userEmail && userEmail !== 'Guest User' ? (
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-zinc-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-zinc-600 rounded-lg transition-all text-sm font-medium shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-transparent rounded-lg transition-all text-sm font-medium shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Join/Login</span>
          </button>
        )}
      </div>
    </aside>
  )
}