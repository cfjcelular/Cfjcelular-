import { useEffect, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, TrendingUp, TrendingDown, Target, Shield, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { TradingSignal } from '@/src/lib/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function AISignals() {
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function generateSignal() {
    setIsLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Analyze the current state of the Bitcoin futures market (simulated) and provide a structured trading signal. Respond with a JSON object containing: type (long/short/neutral), pair (e.g. BTC/USDT), price (current simulated price), confidence (0-1), reasoning (2 sentences), targets (array of 3 price targets), stopLoss (price), and timestamp (ms).",
        config: {
          responseMimeType: 'application/json',
        }
      });

      const data = JSON.parse(response.text || '{}');
      setSignal(data as TradingSignal);
    } catch (error) {
      console.error('Failed to generate signal:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    generateSignal();
    const interval = setInterval(generateSignal, 300000); // Update every 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10 group-hover:bg-blue-500/10 transition-all duration-500" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Brain className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Gemini Strategy Engine</h2>
            <p className="text-xs text-gray-400 font-mono">NEURAL ANALYTICS v4.2</p>
          </div>
        </div>
        <button 
          onClick={generateSignal}
          className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white rounded-md border border-white/10 transition-colors flex items-center gap-2"
          disabled={isLoading}
        >
          <Zap className={cn("w-3 h-3", isLoading && "animate-pulse")} />
          Refrescar Analise
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-48 flex flex-col items-center justify-center gap-4"
          >
            <div className="relative">
              <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              </div>
            </div>
            <p className="text-sm font-mono text-blue-400 animate-pulse">Sincronizando com a rede...</p>
          </motion.div>
        ) : signal ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  signal.type === 'long' ? "bg-green-500/10" : "bg-red-500/10"
                )}>
                  {signal.type === 'long' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">POSIÇÃO RECOMENDADA</p>
                  <p className={cn(
                    "text-lg font-bold uppercase",
                    signal.type === 'long' ? "text-green-500" : "text-red-500"
                  )}>
                    {signal.type === 'long' ? 'Comprar (Long)' : 'Vender (Short)'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">CONFIANÇA</p>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${signal.confidence * 100}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                  <span className="text-sm font-bold text-white">{(signal.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <Target className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Alvos de Lucro</span>
                </div>
                <div className="space-y-1">
                  {signal.targets.map((target, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-gray-500">Target {idx + 1}</span>
                      <span className="text-white font-mono">${target.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <Shield className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Proteção de Capital</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Stop Loss</span>
                  <span className="text-white font-mono font-bold">${signal.stopLoss.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
              <p className="text-xs text-blue-400 font-medium mb-1">Racional Técnico:</p>
              <p className="text-sm text-gray-300 leading-relaxed italic">"{signal.reasoning}"</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
