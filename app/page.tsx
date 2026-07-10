'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import clsx from 'clsx';
import { 
  ArrowUpRight, 
  TrendingUp, 
  Wallet, 
  ArrowDownRight, 
  Activity, 
  Zap, 
  ShieldAlert, 
  Gift, 
  ExternalLink,
  Plus,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';

// Simulated Recharts data
const data = [
  { name: 'Jul 05', value: 92000 },
  { name: 'Jul 06', value: 95500 },
  { name: 'Jul 07', value: 104000 },
  { name: 'Jul 08', value: 101000 },
  { name: 'Jul 09', value: 118000 },
  { name: 'Jul 10', value: 125430 },
];

function Sparkline({ path, isPositive }: { path: string; isPositive: boolean }) {
  return (
    <svg className="w-20 h-10 shrink-0" viewBox="0 0 100 40" fill="none">
      <path
        d={path}
        stroke={isPositive ? 'url(#sparklineGreen)' : 'url(#sparklineRed)'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="sparklineGreen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00cc6a" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
        <linearGradient id="sparklineRed" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#fda4af" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Dashboard() {
  const { formatCurrency } = useCurrency();
  const [chartRange, setChartRange] = useState('Last 6 Days');

  const stats = [
    { 
      label: 'Portfolio Value', 
      value: 125430, 
      change: '+12.5%', 
      isPositive: true, 
      icon: Wallet,
      sparkline: 'M 0,32 Q 20,25 40,28 T 80,12 T 100,5',
      badge: 'Secure'
    },
    { 
      label: "Today's ROI", 
      value: 450.25, 
      change: '+2.1%', 
      isPositive: true, 
      icon: TrendingUp,
      sparkline: 'M 0,30 Q 20,38 40,20 T 80,15 T 100,2',
      badge: 'Live'
    },
    { 
      label: 'Total Profit', 
      value: 34200, 
      change: '+28.4%', 
      isPositive: true, 
      icon: ArrowUpRight,
      sparkline: 'M 0,38 Q 20,32 40,18 T 80,5 T 100,1',
      badge: 'Compound'
    },
    { 
      label: 'Referral Earnings', 
      value: 2150, 
      change: '-1.5%', 
      isPositive: false, 
      icon: Activity,
      sparkline: 'M 0,8 Q 25,12 40,15 T 80,30 T 100,32',
      badge: 'Network'
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
            Executive Summary
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Welcome back, Admin. Your institutional dashboard is fully synched.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/wallet?action=deposit">
            <button className="h-11 bg-brand text-black font-semibold text-sm px-5 rounded-xl hover:bg-brand-hover active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,136,0.25)] flex items-center justify-center gap-2">
              <Plus size={16} strokeWidth={2.5} /> Deposit Funds
            </button>
          </Link>
          <Link href="/wallet?action=withdraw">
            <button className="h-11 bg-bg-card border border-border/80 hover:border-brand/40 text-text-primary hover:text-white font-semibold text-sm px-5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2">
              <ArrowUpRight size={16} strokeWidth={2.5} /> Withdraw Funds
            </button>
          </Link>
        </div>
      </div>

      {/* Upgraded Stats KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="animated-gradient-border group cursor-pointer"
            >
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <span className="text-text-secondary text-[10px] font-bold tracking-wider block uppercase">
                      {stat.label}
                    </span>
                    <span className={clsx(
                      "text-[9px] font-extrabold px-2 py-0.5 rounded-full inline-block tracking-wider uppercase border",
                      stat.isPositive ? "bg-brand/10 text-brand border-brand/25 shadow-[0_0_10px_rgba(0,255,136,0.05)]" : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                    )}>
                      {stat.badge}
                    </span>
                  </div>
                  <Icon className="w-5 h-5 text-brand transition-transform duration-300 shrink-0" />
                </div>

                <div className="flex items-end justify-between pt-2">
                  <div className="space-y-1.5">
                    <div className="text-2xl font-extrabold text-white tracking-tight">
                      <AnimatedCounter 
                        value={stat.value} 
                        formatter={(val) => formatCurrency(val)} 
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={clsx(
                        "text-xs font-bold flex items-center",
                        stat.isPositive ? "text-brand" : "text-rose-400"
                      )}>
                        {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {stat.change}
                      </span>
                      <span className="text-[10px] text-text-secondary/80">vs prev cycle</span>
                    </div>
                  </div>

                  {/* Sparkline Visual */}
                  <Sparkline path={stat.sparkline} isPositive={stat.isPositive} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts & Side Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth Recharts card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl lg:col-span-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="font-bold text-md text-white">Portfolio Growth</h3>
              <p className="text-xs text-text-secondary">Historical value and ROI projections.</p>
            </div>
            
            <select 
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="bg-bg-base border border-border/80 hover:border-brand/30 rounded-xl px-3 py-1.5 text-xs text-text-secondary outline-none cursor-pointer transition-colors"
            >
              <option>Last 6 Days</option>
              <option>This Month</option>
              <option>Current Year</option>
            </select>
          </div>
          
          <div className="h-[280px] w-full pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartBrandColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} dx={-10} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-base)', borderColor: 'var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: 'var(--color-text-primary)', fontSize: 12 }}
                  labelStyle={{ color: 'var(--color-brand)', fontWeight: 'bold', fontSize: 10 }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Total Value']}
                />
                <Area type="monotone" dataKey="value" stroke="var(--color-brand)" strokeWidth={2.5} fillOpacity={1} fill="url(#chartBrandColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Activity & System Access */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-2xl flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <h3 className="font-bold text-md">Active Allocations</h3>
              <Link href="/investments" className="text-brand text-xs hover:underline flex items-center gap-1">
                Invest center <ExternalLink size={12} />
              </Link>
            </div>
            
            {/* Redesigned Active Allocations */}
            <div className="space-y-4">
              {[
                { name: 'Institutional Alpha V', progress: 75, days: 12, rate: '1.5%', principal: 25000, earned: 4250, maturity: 'Oct 22, 2026', icon: Zap },
                { name: 'Wealth Builder Pro II', progress: 45, days: 45, rate: '2.0%', principal: 10000, earned: 1800, maturity: 'Nov 24, 2026', icon: TrendingUp }
              ].map((inv, idx) => {
                const PlanIcon = inv.icon;
                return (
                  <div 
                    key={inv.name} 
                    className="bg-gradient-to-br from-white via-emerald-50 to-brand-hover p-4 rounded-2xl shadow-xl flex flex-col justify-between border border-white/20 text-slate-900 gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-900/10 flex items-center justify-center text-slate-800">
                          <PlanIcon size={16} />
                        </div>
                        <div>
                          <span className="font-extrabold text-xs block text-slate-900 tracking-tight leading-tight">{inv.name}</span>
                          <span className="text-[9px] text-slate-700 font-bold uppercase tracking-wider">ROI: {inv.rate} Daily</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-extrabold px-1.5 py-0.5 bg-slate-900 text-white rounded-full uppercase tracking-wider">
                        Earning
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 border-y border-slate-900/10 py-2.5 text-[11px]">
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">Invested</span>
                        <span className="font-extrabold text-slate-900">{formatCurrency(inv.principal)}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">Earnings</span>
                        <span className="font-extrabold text-emerald-800">{formatCurrency(inv.earned)}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">Expected Maturity</span>
                        <span className="font-semibold text-slate-800">{inv.maturity}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">Remaining</span>
                        <span className="font-semibold text-slate-800">{inv.days} Days</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="w-full bg-slate-900/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-slate-900 h-full rounded-full" style={{ width: `${inv.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[8px] font-bold text-slate-600">
                        <span>Progress: {inv.progress}%</span>
                        <span>{inv.days} days left</span>
                      </div>
                    </div>

                    <Link href="/investments" className="w-full">
                      <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] py-2 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-1">
                        <span>More Details</span>
                        <ChevronRight size={12} />
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Link href="/wallet" className="w-full">
              <button className="w-full bg-bg-base border border-border hover:border-brand/40 hover:bg-bg-card text-xs font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                <Wallet size={14} /> My Wallet
              </button>
            </Link>
            <Link href="/lottery" className="w-full">
              <button className="w-full bg-bg-base border border-border hover:border-brand/40 hover:bg-bg-card text-xs font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                <Gift size={14} /> Mega Lottery
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Upgraded Recent Transactions Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border/60 flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="font-bold text-md text-white">Recent Ledgers</h3>
            <p className="text-xs text-text-secondary">Updates on internal movements, payouts, and draws.</p>
          </div>
          <Link href="/transactions">
            <button className="text-brand text-xs font-bold hover:underline flex items-center gap-1">
              View Complete Ledger <ExternalLink size={12} />
            </button>
          </Link>
        </div>
        
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left min-w-[600px]">
            <thead className="text-text-secondary bg-bg-base/40 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Transaction Type</th>
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Total Value</th>
                <th className="px-6 py-4">Processed Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                { type: 'Deposit', amount: 5000, date: 'Today, 10:45 AM', status: 'Completed', positive: true, id: 'TXN-902418', method: 'USDT (TRC20)' },
                { type: 'ROI Credit', amount: 150.5, date: 'Yesterday, 12:00 PM', status: 'Completed', positive: true, id: 'TXN-890251', method: 'Internal Compound' },
                { type: 'Withdrawal', amount: 1200, date: 'Oct 24, 2026', status: 'Pending', positive: false, id: 'TXN-820491', method: 'Bank Transfer' },
                { type: 'Lottery Entry', amount: 50, date: 'Oct 22, 2026', status: 'Completed', positive: false, id: 'TXN-794502', method: 'Referral Bonus' },
              ].map((tx, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] border-l-2 border-transparent hover:border-brand transition-all">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center border",
                      tx.type === 'Deposit' ? 'bg-brand/10 border-brand/20 text-brand' : 
                      tx.type === 'Withdrawal' ? 'bg-rose-500/5 border-rose-500/10 text-rose-400' : 
                      'bg-white/5 border-border text-white'
                    )}>
                      {tx.type === 'Deposit' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                    </div>
                    <span className="font-bold text-text-primary">{tx.type}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-text-secondary">{tx.id}</td>
                  <td className={clsx(
                    "px-6 py-4 font-bold text-sm",
                    tx.type === 'Deposit' ? 'text-brand' : 
                    tx.type === 'Withdrawal' ? 'text-rose-400' : 'text-white'
                  )}>
                    {tx.type === 'Deposit' ? '+' : tx.type === 'Withdrawal' ? '-' : ''}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{tx.date}</td>
                  <td className="px-6 py-4 text-text-secondary">{tx.method}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={clsx(
                      "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border",
                      tx.status === 'Completed' ? 'bg-brand/10 border-brand/25 text-brand shadow-[0_0_10px_rgba(0,255,136,0.05)]' : 
                      tx.status === 'Pending' ? 'bg-white/5 border-white/20 text-white' : 
                      tx.status === 'Rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                      'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    )}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="block md:hidden divide-y divide-border/60">
          {[
            { type: 'Deposit', amount: 5000, date: 'Today, 10:45 AM', status: 'Completed', positive: true, id: 'TXN-902418', method: 'USDT (TRC20)' },
            { type: 'ROI Credit', amount: 150.5, date: 'Yesterday, 12:00 PM', status: 'Completed', positive: true, id: 'TXN-890251', method: 'Internal Compound' },
            { type: 'Withdrawal', amount: 1200, date: 'Oct 24, 2026', status: 'Pending', positive: false, id: 'TXN-820491', method: 'Bank Transfer' },
            { type: 'Lottery Entry', amount: 50, date: 'Oct 22, 2026', status: 'Completed', positive: false, id: 'TXN-794502', method: 'Referral Bonus' },
          ].map((tx, idx) => (
            <div key={idx} className="p-4 space-y-3 hover:bg-white/[0.01] transition-all">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={clsx(
                    "w-7 h-7 rounded-full flex items-center justify-center border",
                    tx.type === 'Deposit' ? 'bg-brand/10 border-brand/20 text-brand' : 
                    tx.type === 'Withdrawal' ? 'bg-rose-500/5 border-rose-500/10 text-rose-400' : 
                    'bg-white/5 border-border text-white'
                  )}>
                    {tx.type === 'Deposit' ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                  </div>
                  <span className="font-bold text-text-primary text-xs">{tx.type}</span>
                </div>
                <span className={clsx(
                  "px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider border",
                  tx.status === 'Completed' ? 'bg-brand/10 border-brand/25 text-brand' : 
                  tx.status === 'Pending' ? 'bg-white/5 border-white/20 text-white' : 
                  tx.status === 'Rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                  'bg-amber-500/10 border-amber-500/20 text-amber-400'
                )}>
                  {tx.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-mono">{tx.id}</span>
                <span className={clsx(
                  "font-bold text-sm",
                  tx.type === 'Deposit' ? 'text-brand' : 
                  tx.type === 'Withdrawal' ? 'text-rose-400' : 'text-white'
                )}>
                  {tx.type === 'Deposit' ? '+' : tx.type === 'Withdrawal' ? '-' : ''}{formatCurrency(tx.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-text-secondary">
                <span>{tx.date}</span>
                <span>{tx.method}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
