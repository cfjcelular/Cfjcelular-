import { createChart, ColorType, ISeriesApi } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

interface ChartProps {
  data: { time: string; open: number; high: number; low: number; close: number }[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export function TradingChart({ data, colors = {} }: ChartProps) {
  const {
    backgroundColor = '#0a0a0a',
    lineColor = '#2962ff',
    textColor = '#d1d4dc',
  } = colors;

  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.1)',
      },
    });

    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeries.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
       <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        <span className="text-xl font-bold text-white">BTC/USDT</span>
        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded border border-green-500/20 font-mono">LIVE</span>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
