'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { useCurrency } from '@/components/CurrencyProvider';

interface PremiumKPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
  isCurrency?: boolean;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function PremiumKPICard({
  label,
  value,
  icon: Icon,
  delay = 0,
  isCurrency = false,
  change,
  trend
}: PremiumKPICardProps) {
  const { formatCurrency } = useCurrency();

  const trendBg = trend === 'up' ? 'bg-brand/10' : trend === 'down' ? 'bg-rose-500/10' : 'bg-yellow-500/10';
  const trendText = trend === 'up' ? 'text-brand' : trend === 'down' ? 'text-rose-500' : 'text-yellow-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="animated-gradient-border group cursor-pointer h-full"
    >
      <div className="p-6 flex flex-col justify-between h-full gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <span className="text-text-secondary text-[11px] font-bold tracking-wider block uppercase">
              {label}
            </span>
          </div>
          <Icon className="w-6 h-6 text-brand transition-transform duration-300 shrink-0 opacity-80 group-hover:scale-110 group-hover:text-white" />
        </div>

        <div className="flex items-end justify-between pt-2">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="text-2xl lg:text-3xl font-black text-white tracking-tight truncate w-full">
              {isCurrency ? formatCurrency(Number(value)) : value}
            </div>
          </div>
          
          {change && (
            <div className={`ml-2 px-2.5 py-1 rounded-full flex items-center justify-center shrink-0 ${trendBg} ${trendText}`}>
              <span className="text-[10px] font-bold whitespace-nowrap">{change}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
