'use client';
import React, { useEffect, useRef, useState, memo } from 'react';
import { Activity } from 'lucide-react';

function MarketOverview() {
  const container = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!container.current || container.current.querySelector('script')) return;
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": "BINANCE:BTCUSDT",
      "interval": "1",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "backgroundColor": "rgba(0, 0, 0, 0)",
      "gridColor": "rgba(255, 255, 255, 0.05)",
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "save_image": false,
      "container_id": "tradingview_widget",
      "support_host": "https://www.tradingview.com"
    });
    script.onload = () => setIsLoading(false);
    container.current.appendChild(script);
    
    // Fallback if onload doesn't fire reliably
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <div className="glass rounded-2xl lg:col-span-2 h-[450px] flex flex-col relative overflow-hidden">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 z-0 flex flex-col p-6">
          <div className="w-full h-full rounded-xl bg-white/5 animate-pulse flex items-center justify-center border border-white/5">
            <div className="flex flex-col items-center gap-3">
              <Activity className="text-brand/50 animate-pulse" size={32} />
              <span className="text-xs font-semibold text-text-secondary tracking-widest uppercase">Loading Chart Data...</span>
            </div>
          </div>
        </div>
      )}

      <div 
        className={`tradingview-widget-container flex-1 w-full h-full relative z-10 transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`} 
        ref={container}
      >
        <div className="tradingview-widget-container__widget h-full w-full"></div>
      </div>
    </div>
  );
}

export default memo(MarketOverview);
