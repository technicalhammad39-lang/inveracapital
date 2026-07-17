'use client';

import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise: Promise<void> | null = null;

export default function TradingViewWidgetClient() {
  const onLoadScriptRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => {
      if (onLoadScriptRef.current) {
        onLoadScriptRef.current();
      }
    });

    return () => {
      onLoadScriptRef.current = null;
    };
  }, []);

  function createWidget() {
    if (document.getElementById('tradingview_widget') && 'TradingView' in window) {
      new (window as any).TradingView.widget({
        autosize: true,
        symbol: 'OANDA:XAUUSD',
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        backgroundColor: '#0a0a0b',
        gridColor: 'rgba(255, 255, 255, 0.05)',
        hide_top_toolbar: true,
        hide_side_toolbar: false,
        hide_legend: true,
        save_image: false,
        container_id: 'tradingview_widget',
        allow_symbol_change: false,
        hide_volume: true,
      });
    }
  }

  return (
    <div className="w-full h-[400px] bg-[#0a0a0b] rounded-2xl border border-white/10 overflow-hidden relative">
      <div id="tradingview_widget" className="h-full w-full" />
    </div>
  );
}
