import { Flame, TrendingUp, BarChart3, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const HOT_TOPICS = [
  { icon: TrendingUp, text: "Analyze NVDA's recent volatility" },
  { icon: Globe, text: "Global macro impact on Crypto markets" },
  { icon: BarChart3, text: "Compare TSLA vs BYD financials" },
  { icon: Flame, text: "Identify undervalued AI stocks" },
];

export function MarketHotSpots({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2 text-cyan-500 animate-pulse">
        <Flame className="w-5 h-5" />
        <h3 className="font-semibold text-sm uppercase tracking-wider">Market Hot Spots</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {HOT_TOPICS.map((topic, i) => (
          <Button
            key={i}
            variant="outline"
            className="h-auto py-4 justify-start text-left hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group"
            onClick={() => onSelect(topic.text)}
          >
            <topic.icon className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-cyan-500" />
            <span className="text-sm font-medium">{topic.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
