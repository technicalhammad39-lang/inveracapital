'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  TrendingUp, 
  Activity, 
  Gift, 
  Network, 
  DollarSign, 
  LifeBuoy,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '@/components/CurrencyProvider';

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardClient({ stats, activityFeed, revenueData }: { stats: any, activityFeed: any[], revenueData: any[] }) {
  const { formatCurrency } = useCurrency();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const metrics = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, trend: '+12.5%', isUp: true },
    { label: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: Activity, trend: '+5.2%', isUp: true },
    { label: 'Verified Users', value: stats.verifiedUsers.toLocaleString(), icon: UserCheck, trend: '+8.1%', isUp: true },
    { label: 'Pending KYC', value: stats.pendingKyc.toLocaleString(), icon: ShieldAlert, trend: '-2.4%', isUp: false },
    { label: 'Total Deposits', value: formatCurrency(stats.totalDeposits), icon: ArrowDownToLine, trend: '+18.2%', isUp: true },
    { label: 'Total Withdrawals', value: formatCurrency(stats.totalWithdrawals), icon: ArrowUpFromLine, trend: '+4.1%', isUp: true },
    { label: 'Total Investments', value: formatCurrency(stats.totalInvestments), icon: TrendingUp, trend: '+22.4%', isUp: true },
    { label: 'Active Investments', value: stats.activeInvestments.toLocaleString(), icon: TrendingUp, trend: '+15.3%', isUp: true },
    { label: 'Lottery Revenue', value: formatCurrency(stats.lotteryRevenue), icon: Gift, trend: '+9.8%', isUp: true },
    { label: 'Referral Payouts', value: formatCurrency(stats.referralPayouts), icon: Network, trend: '+11.2%', isUp: true },
    { label: 'Total Profit', value: formatCurrency(stats.totalProfit), icon: DollarSign, trend: '+34.5%', isUp: true },
    { label: 'Pending Support', value: stats.pendingSupport.toLocaleString(), icon: LifeBuoy, trend: '-1.2%', isUp: false },
  ];

  return (
    <div className="space-y-10 pb-10 max-w-7xl mx-auto">
      
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Command Center
          </h1>
          <p className="text-text-secondary text-sm font-medium">Live PostgreSQL metrics and platform overview.</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-brand/10 border border-brand/20 rounded-full text-brand font-semibold">
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            Live Sync
          </div>
        </div>
      </div>

      {/* Redesigned Premium Metrics Grid (Stripe/Linear Inspired) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          const isHovered = hoveredCard === m.label;
          
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              onMouseEnter={() => setHoveredCard(m.label)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group cursor-default"
            >
              {/* Animated Gradient Border Glow */}
              <div className={`absolute -inset-[1px] bg-gradient-to-r from-brand/0 via-brand/40 to-brand/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isHovered ? 'animate-shimmer' : ''}`} style={{ backgroundSize: '200% 100%' }} />
              
              {/* Card Body */}
              <div className="relative h-full bg-[#0a0a0b] border border-white/10 rounded-2xl p-5 overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_30px_-5px_rgba(0,255,136,0.15)] group-hover:bg-[#0f1115]">
                
                {/* Top Row: Value & Icon */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{m.value}</h3>
                  </div>
                  <Icon size={20} className="text-text-secondary group-hover:text-brand transition-colors duration-300" strokeWidth={2} />
                </div>

                {/* Bottom Row: Label & Trend */}
                <div className="flex justify-between items-end">
                  <p className="text-[13px] font-medium text-text-secondary/80 group-hover:text-text-secondary transition-colors">{m.label}</p>
                  
                  <div className={`flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${m.isUp ? 'text-brand bg-brand/10' : 'text-rose-400 bg-rose-400/10'}`}>
                    {m.isUp ? <ArrowUpRight size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                    {m.trend}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart - Linear Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-[#0a0a0b] p-6 rounded-2xl border border-white/10 flex flex-col hover:border-white/20 transition-colors"
        >
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-white">Revenue vs Profit</h3>
              <p className="text-xs text-text-secondary mt-1">7-day performance metrics</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111318', borderColor: '#2a2e33', borderRadius: '8px', fontSize: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" stroke="#00ff88" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0a0a0b] p-6 rounded-2xl border border-white/10 flex flex-col hover:border-white/20 transition-colors"
        >
          <div className="mb-6">
            <h3 className="font-semibold text-white">Live Activity</h3>
            <p className="text-xs text-text-secondary mt-1">Real-time database stream</p>
          </div>
          
          <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1 relative">
            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-white/5" />
            
            {activityFeed.map((activity, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (idx * 0.1) }}
                key={activity.id} 
                className="relative pl-8 group"
              >
                {/* Timeline dot */}
                <div className="absolute left-[7px] top-1.5 w-2 h-2 rounded-full bg-brand ring-4 ring-[#0a0a0b] group-hover:scale-125 transition-transform" />
                
                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-brand/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-white">{activity.user}</span>
                    <span className="text-[10px] text-text-secondary/70 font-medium" suppressHydrationWarning>{formatTimeAgo(activity.time)}</span>
                  </div>
                  <p className="text-xs text-text-secondary/90">{activity.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-xs font-semibold text-text-secondary hover:text-white transition-colors border-t border-white/10 pt-4">
            View Complete Audit Log →
          </button>
        </motion.div>

      </div>
    </div>
  );
}
