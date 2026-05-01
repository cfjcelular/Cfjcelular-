/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Settings, 
  Bell, 
  User, 
  Menu, 
  LayoutDashboard, 
  History, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Lock,
  Activity
} from 'lucide-react';
import { TradingChart } from './components/Chart';
import { AISignals } from './components/AISignals';
import { Calculator } from './components/Calculator';
import { cn, formatCurrency } from './lib/utils';

// Generate some initial mock data for the chart
const generateInitialData = () => {
  const data = [];
  let currentPrice = 64000;
  const now = new Date();
  
  for (let i = 0; i < 100; i++) {
    const time = new Date(now.getTime() - (100 - i) * 3600000).toISOString().split('T')[0];
    const open = currentPrice;
    const high = open + Math.random() * 500;
    const low = open - Math.random() * 500;
    const close = low + Math.random() * (high - low);
    data.push({ time, open, high, low, close });
    currentPrice = close;
  }
  return data;
};

export default function App() {
  const [btcPrice, setBtcPrice] = useState(64250.80);
  const [priceChange, setPriceChange] = useState(2.45);
  const [chartData] = useState(generateInitialData());

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 10;
      setBtcPrice(prev => prev + change);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-400 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-bottom border-white/5 border-b">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <span className="text-white font-black text-xl tracking-tighter">MILLIONAIRE<span className="text-emerald-500">.</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">Trade</a>
              <a href="#" className="text-sm font-medium hover:text-white transition-colors">Markets</a>
              <a href="#" className="text-sm font-medium hover:text-white transition-colors">Portfolio</a>
              <a href="#" className="text-sm font-medium hover:text-white transition-colors">Earning</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-white">BTC: ${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-mono text-emerald-500">{priceChange}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Bell className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><User className="w-5 h-5" /></button>
              <button className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"><Menu className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <aside className="hidden xl:col-span-1 xl:flex flex-col gap-4">
          <NavItem icon={<LayoutDashboard />} active />
          <NavItem icon={<Activity />} />
          <NavItem icon={<History />} />
          <NavItem icon={<Wallet />} />
          <NavItem icon={<Globe />} />
          <div className="mt-auto">
            <NavItem icon={<Settings />} />
          </div>
        </aside>

        {/* Central Content */}
        <div className="xl:col-span-8 space-y-6">
          {/* Market Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Volume 24h" value="$2.4B" change="+12%" />
            <StatCard label="Open Interest" value="$840M" change="-2.4%" />
            <StatCard label="Funding Rate" value="0.0100%" subValue="in 4h" />
            <StatCard label="Liquidations" value="$12.4M" change="+45%" isDanger />
          </div>

          {/* Chart Section */}
          <div className="relative">
            <TradingChart data={chartData} />
            <div className="absolute top-4 right-4 flex gap-2">
               <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-all">1m</button>
               <button className="px-3 py-1 bg-emerald-500 text-black text-xs rounded font-bold transition-all">5m</button>
               <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-all">1h</button>
               <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-all">1d</button>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AISignals />
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group h-full">
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-500/10 blur-[80px]" />
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                Proteção de Elite
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Todos os trades são processados através da nossa rede de liquidez de ultra-baixa latência, garantindo o melhor preço e derrapagem mínima.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Execution Speed</span>
                  <span className="text-white font-mono">1.2ms</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-indigo-500" />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Security Index</span>
                  <span className="text-indigo-400 font-mono">AAA+</span>
                </div>
              </div>
              <button className="w-full mt-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                ATIVAR PROTEÇÃO
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Trade Panels */}
        <div className="xl:col-span-3 space-y-6">
           {/* Quick Trade Panel */}
           <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Trade Rápido</h3>
              <div className="flex bg-black p-1 rounded-xl border border-white/5">
                <button className="flex-1 py-1.5 text-xs font-bold bg-white/10 text-white rounded-lg transition-all">LIMIT</button>
                <button className="flex-1 py-1.5 text-xs font-bold text-gray-500 hover:text-white transition-all">MARKET</button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
                    <span>Preço (USDT)</span>
                    <span className="text-emerald-500">Market Price</span>
                  </div>
                  <input type="text" value={btcPrice.toFixed(2)} readOnly className="w-full bg-black border border-white/5 rounded-lg py-2 px-3 text-sm text-white focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
                    <span>Quantidade (BTC)</span>
                    <span>Max: 1.25 BTC</span>
                  </div>
                  <input type="number" placeholder="0.00" className="w-full bg-black border border-white/5 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['25%', '50%', '75%', '100%'].map(pct => (
                    <button key={pct} className="py-1 text-[10px] bg-white/5 border border-white/5 rounded-md hover:bg-white/10 text-gray-400 transition-all">{pct}</button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 space-y-2">
                 <button className="w-full py-4 bg-emerald-500 text-black text-sm font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)]">
                   BUY / LONG
                 </button>
                 <button className="w-full py-4 bg-red-500 text-black text-sm font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(239,68,68,0.2)]">
                   SELL / SHORT
                 </button>
              </div>
           </div>

           <Calculator />
        </div>
      </main>

      {/* Ticker Bar Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-8 bg-[#111] border-t border-white/5 flex items-center overflow-hidden whitespace-nowrap">
        <div className="flex items-center animate-ticker gap-12 px-6">
          <TickerItem symbol="ETH" price="3,450.20" change="+1.2%" />
          <TickerItem symbol="BNB" price="580.45" change="-0.4%" />
          <TickerItem symbol="SOL" price="145.10" change="+5.4%" />
          <TickerItem symbol="XRP" price="0.62" change="+0.1%" />
          <TickerItem symbol="ADA" price="0.45" change="-2.1%" />
          <TickerItem symbol="DOGE" price="0.16" change="+12.4%" />
          {/* Duplicated for smooth loop */}
          <TickerItem symbol="ETH" price="3,450.20" change="+1.2%" />
          <TickerItem symbol="BNB" price="580.45" change="-0.4%" />
          <TickerItem symbol="SOL" price="145.10" change="+5.4%" />
        </div>
      </footer>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
      `}</style>
    </div>
  );
}

function NavItem({ icon, active }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button className={cn(
      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
      active 
        ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" 
        : "text-gray-500 hover:text-white hover:bg-white/5"
    )}>
      {icon}
    </button>
  );
}

function StatCard({ label, value, change, subValue, isDanger }: { label: string; value: string; change?: string; subValue?: string; isDanger?: boolean }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-xl font-bold text-white font-mono">{value}</span>
        {change && (
          <span className={cn(
            "text-[10px] font-bold font-mono",
            change.startsWith('+') ? "text-emerald-500" : "text-red-500"
          )}>
            {change}
          </span>
        )}
        {subValue && (
          <span className="text-[10px] text-gray-600 font-mono italic">{subValue}</span>
        )}
      </div>
    </div>
  );
}

function TickerItem({ symbol, price, change }: { symbol: string; price: string; change: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-white">{symbol}</span>
      <span className="text-[10px] font-mono text-gray-400">${price}</span>
      <span className={cn(
        "text-[10px] font-mono",
        change.startsWith('+') ? "text-emerald-500" : "text-red-500"
      )}>
        {change}
      </span>
    </div>
  );
}
