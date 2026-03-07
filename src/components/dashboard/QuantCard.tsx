import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  BarChart2, 
  PieChart,
  Star,
  Target
} from 'lucide-react';

interface QuantCardProps {
  data: any;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  isLoggedIn?: boolean;
}

export function QuantCard({ data, isWatchlisted, onToggleWatchlist, isLoggedIn }: QuantCardProps) {
  if (!data || !data.quantitative) {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-card border border-white/5 rounded-3xl opacity-50">
        <Activity className="w-10 h-10 text-slate-500 mb-4 animate-pulse" />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Telemetry Data Unavailable</p>
      </div>
    );
  }

  const { quantitative } = data;

  const MetricItem = ({ label, value, icon: Icon, color = "text-stellar" }: { label: string, value: string | number, icon: any, color?: string }) => (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-200 tracking-wide">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Watchlist Button */}
      <div className="flex items-center justify-between glass-card p-5 border border-white/5 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-stellar/10 blur-[40px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-void border border-stellar/30 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Target className="w-6 h-6 text-stellar" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Quantitative Metrics</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Real-time Asset Telemetry</p>
          </div>
        </div>

        {isLoggedIn ? (
          <button
            onClick={onToggleWatchlist}
            className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border
              ${isWatchlisted 
                ? 'bg-stellar/10 text-stellar border-stellar/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'}`}
          >
            <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-stellar' : ''}`} />
            {isWatchlisted ? 'Tracked' : 'Track Asset'}
          </button>
        ) : (
          <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <span className="text-[9px] font-black uppercase tracking-widest">Login to Watchlist</span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quantitative.marketCap && (
          <MetricItem 
            label="Market Cap" 
            value={`$${(quantitative.marketCap / 1e9).toFixed(2)}B`} 
            icon={PieChart} 
          />
        )}
        
        {quantitative.peRatio && (
          <MetricItem 
            label="P/E Ratio" 
            value={quantitative.peRatio.toFixed(2)} 
            icon={BarChart2} 
          />
        )}

        {quantitative.volume && (
          <MetricItem 
            label="24h Volume" 
            value={quantitative.volume.toLocaleString()} 
            icon={Activity} 
          />
        )}

        {quantitative.fiftyTwoWeekHigh && (
          <MetricItem 
            label="52W High" 
            value={`$${quantitative.fiftyTwoWeekHigh.toFixed(2)}`} 
            icon={TrendingUp} 
            color="text-emerald-400"
          />
        )}

        {quantitative.fiftyTwoWeekLow && (
          <MetricItem 
            label="52W Low" 
            value={`$${quantitative.fiftyTwoWeekLow.toFixed(2)}`} 
            icon={TrendingDown} 
            color="text-red-400"
          />
        )}

        {quantitative.dividendYield !== undefined && (
          <MetricItem 
            label="Div Yield" 
            value={`${(quantitative.dividendYield * 100).toFixed(2)}%`} 
            icon={DollarSign} 
          />
        )}
      </div>

      {/* Momentum Indicator */}
      <div className="glass-card p-5 border border-white/5 rounded-3xl mt-4">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Neural Momentum Score</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-stellar rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, quantitative.momentumScore || 50))}%` }}
            />
          </div>
          <span className="text-sm font-black text-stellar w-12 text-right">
            {quantitative.momentumScore || 50}/100
          </span>
        </div>
      </div>
      
    </div>
  );
}