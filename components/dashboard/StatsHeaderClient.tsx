'use client';

import React from 'react';
import { Wallet, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import PremiumKPICard from '@/components/ui/PremiumKPICard';

interface StatsHeaderClientProps {
  portfolioValue: number;
  todayRoi: number;
  totalProfit: number;
  referralEarnings: number;
}

export default function StatsHeaderClient({
  portfolioValue,
  todayRoi,
  totalProfit,
  referralEarnings
}: StatsHeaderClientProps) {
  const stats = [
    { label: 'Total Portfolio', value: portfolioValue, icon: Wallet, change: '+12.5%', trend: 'up' as const },
    { label: 'Today\'s Yield', value: todayRoi, icon: TrendingUp, change: '+2.1%', trend: 'up' as const },
    { label: 'Total Profit', value: totalProfit, icon: ArrowUpRight, change: '+28.4%', trend: 'up' as const },
    { label: 'Referral Rewards', value: referralEarnings, icon: Activity, change: '0.0%', trend: 'neutral' as const },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, idx) => (
        <PremiumKPICard
          key={idx}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          change={stat.change}
          trend={stat.trend}
          delay={idx * 0.08}
          isCurrency={true}
        />
      ))}
    </div>
  );
}
