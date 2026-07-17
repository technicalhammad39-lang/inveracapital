'use client';

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useCurrency } from '@/components/CurrencyProvider';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const dummyTrendData = [
  { value: 10 }, { value: 15 }, { value: 8 }, { value: 20 }, { value: 18 }, { value: 30 }
];

export default function ProfitLossWidget() {
  const { formatCurrency } = useCurrency();

  const totalProfit = 125430;
  const totalLoss = 45000;
  const netProfit = totalProfit - totalLoss;
  const status = netProfit > 0 ? 'Profit' : netProfit < 0 ? 'Loss' : 'Break-even';

  return (
    <div className="h-full bg-gradient-to-br from-[#0a0a0b] via-[#0f1115] to-[#0a0a0b] rounded-2xl border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden group hover:border-brand/30 transition-colors duration-500">
      
      {/* Background Animated Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-[50px] group-hover:bg-brand/10 transition-colors duration-500" />

      <div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h3 className="font-bold text-white text-md tracking-tight">Platform Profit Status</h3>
            <p className="text-xs text-text-secondary mt-1">Live aggregated net margins</p>
          </div>
          <div className="flex items-center gap-1.5 bg-brand/10 text-brand px-2.5 py-1 rounded-full border border-brand/20">
            <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{status}</span>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-end border-b border-white/5 pb-3">
            <span className="text-sm font-semibold text-text-secondary flex items-center gap-2">
              <ArrowUpRight size={14} className="text-brand" /> Total Profit
            </span>
            <span className="font-bold text-white tracking-wide">{formatCurrency(totalProfit)}</span>
          </div>
          
          <div className="flex justify-between items-end border-b border-white/5 pb-3">
            <span className="text-sm font-semibold text-text-secondary flex items-center gap-2">
              <ArrowDownRight size={14} className="text-rose-400" /> Total Loss
            </span>
            <span className="font-bold text-white tracking-wide">{formatCurrency(totalLoss)}</span>
          </div>

          <div className="flex justify-between items-end pt-2">
            <span className="text-sm font-semibold text-text-secondary">Net Margin</span>
            <div className="text-right">
              <span className="text-2xl font-black text-brand block">{formatCurrency(netProfit)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[80px] w-full mt-6 relative z-10 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dummyTrendData}>
            <defs>
              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#00ff88" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorNet)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
