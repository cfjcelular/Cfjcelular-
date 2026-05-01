import { useState, useMemo } from 'react';
import { Calculator as CalcIcon, Percent, DollarSign, Activity, Target } from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';

export function Calculator() {
  const [margin, setMargin] = useState(100);
  const [leverage, setLeverage] = useState(10);
  const [entryPrice, setEntryPrice] = useState(65000);
  const [targetPrice, setTargetPrice] = useState(67000);
  const [side, setSide] = useState<'long' | 'short'>('long');

  const stats = useMemo(() => {
    const positionSize = margin * leverage;
    const diff = targetPrice - entryPrice;
    const pnl = side === 'long' ? (diff / entryPrice) * positionSize : (-(diff / entryPrice)) * positionSize;
    const roi = (pnl / margin) * 100;
    
    // Simplistic liquidation formula
    const liqPrice = side === 'long' 
      ? entryPrice * (1 - (1 / leverage)) 
      : entryPrice * (1 + (1 / leverage));

    return {
      positionSize,
      pnl,
      roi,
      liqPrice
    };
  }, [margin, leverage, entryPrice, targetPrice, side]);

  return (
    <section className="p-6 rounded-2xl bg-[#111111] border border-white/5 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <CalcIcon className="w-5 h-5 text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Futures Calculator Pro</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setSide('long')}
          className={cn(
            "py-3 rounded-xl border font-bold transition-all",
            side === 'long' 
              ? "bg-green-500 text-black border-transparent shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
              : "bg-white/5 text-gray-500 border-white/5 hover:bg-white/10"
          )}
        >
          LONG / COMPRAR
        </button>
        <button 
          onClick={() => setSide('short')}
          className={cn(
            "py-3 rounded-xl border font-bold transition-all",
            side === 'short' 
              ? "bg-red-500 text-black border-transparent shadow-[0_0_20px_rgba(239,68,68,0.3)]" 
              : "bg-white/5 text-gray-500 border-white/5 hover:bg-white/10"
          )}
        >
          SHORT / VENDER
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Margem (USDT)</label>
            <span className="text-xs text-emerald-400 font-mono">${margin}</span>
          </div>
          <input 
            type="range" min="10" max="10000" step="10"
            value={margin} onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs text-gray-500 uppercase tracking-widest font-bold">Alavancagem</label>
            <span className="text-xs text-emerald-400 font-mono">{leverage}x</span>
          </div>
          <input 
            type="range" min="1" max="125" step="1"
            value={leverage} onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase font-bold">Preço de Entrada</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
              <input 
                type="number" value={entryPrice} onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase font-bold">Preço Alvo</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
              <input 
                type="number" value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-y-6 gap-x-4">
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Lucro Estimado</p>
          <p className={cn("text-lg font-mono font-bold", stats.pnl >= 0 ? "text-green-400" : "text-red-400")}>
            {formatCurrency(stats.pnl)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">ROI Estimado</p>
          <p className={cn("text-lg font-mono font-bold", stats.roi >= 0 ? "text-green-400" : "text-red-400")}>
            {stats.roi.toFixed(2)}%
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Tamanho da Posição</p>
          <p className="text-lg font-mono font-bold text-white">
            {formatCurrency(stats.positionSize)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Preço de Liquidação</p>
          <p className="text-lg font-mono font-bold text-orange-400">
            {formatCurrency(stats.liqPrice)}
          </p>
        </div>
      </div>
    </section>
  );
}
