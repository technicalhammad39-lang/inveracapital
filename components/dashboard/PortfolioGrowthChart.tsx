'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Activity } from 'lucide-react';
import { PremiumEmptyState } from '@/components/PremiumEmptyState';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface ChartData {
  name: string;
  value: number;
}

const PortfolioGrowthChart = React.memo(function PortfolioGrowthChart({ data }: { data: ChartData[] }) {
  const [chartRange, setChartRange] = useState('Last 6 Days');
  
  const displayData = data && data.length > 0 ? data : [
    { name: 'Mon', value: 0 },
    { name: 'Tue', value: 0 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 0 },
    { name: 'Fri', value: 0 },
    { name: 'Sat', value: 0 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl lg:col-span-2 relative overflow-hidden flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-2 p-6 pb-0">
        <div className="space-y-1">
          <h3 className="font-bold text-md text-white">Portfolio Growth</h3>
          <p className="text-xs text-text-secondary">Historical value and ROI projections.</p>
        </div>
        
        <select 
          value={chartRange}
          onChange={(e) => setChartRange(e.target.value)}
          className="bg-bg-base border border-border/80 hover:border-brand/30 rounded-xl px-3 py-1.5 text-xs text-text-secondary outline-none cursor-pointer transition-colors relative z-10"
        >
          <option>Last 6 Days</option>
          <option>This Month</option>
          <option>Current Year</option>
        </select>
      </div>
      
      <div className="h-[280px] w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="chartBrandColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} dy={10} />
            <YAxis 
              domain={[0, 'auto']} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} 
              dx={-10} 
              tickFormatter={(value) => value === 0 ? '$0' : `$${(value / 1000).toFixed(1)}k`} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-bg-base)', borderColor: 'var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: 'var(--color-text-primary)', fontSize: 12 }}
              labelStyle={{ color: 'var(--color-brand)', fontWeight: 'bold', fontSize: 10 }}
              formatter={(value) => [formatCurrency(Number(value)), 'Total Value']}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Bar dataKey="value" fill="url(#chartBrandColor)" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

export default PortfolioGrowthChart;
