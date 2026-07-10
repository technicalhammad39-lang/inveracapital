'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  Shield, 
  Target, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight, 
  Calculator, 
  PieChart as PieIcon, 
  Calendar,
  Hourglass,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const plans = [
  {
    id: 'alpha',
    name: 'Institutional Alpha',
    roi: 1.5, // 1.5% daily
    duration: 30, // Days
    min: 1000,
    max: 9999,
    features: ['Daily ROI Credit', 'Principal Return', 'Priority Support', 'Weekly Analytics'],
    icon: Shield,
    popular: false,
    color: '#00ff88'
  },
  {
    id: 'wealth',
    name: 'Wealth Builder Pro',
    roi: 2.0, // 2.0% daily
    duration: 60, // Days
    min: 10000,
    max: 49999,
    features: ['Daily ROI Credit', 'Principal Return', 'Dedicated Account Manager', 'Bonus Campaign Access'],
    icon: Target,
    popular: true,
    color: '#3b82f6'
  },
  {
    id: 'elite',
    name: 'Elite VIP Fund',
    roi: 2.8, // 2.8% daily
    duration: 90, // Days
    min: 50000,
    max: 500000,
    features: ['Compound Interest Option', 'Principal Return', 'Institutional Wealth Advisor', 'VIP Event Invites', 'Reduced Fees'],
    icon: Zap,
    popular: false,
    color: '#a855f7'
  }
];

export default function Investments() {
  const { formatCurrency } = useCurrency();
  
  // Tabs State
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'expired'>('active');

  // ROI Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(10000);
  const [calcPlan, setCalcPlan] = useState<string>('wealth');

  const selectedPlan = plans.find(p => p.id === calcPlan) || plans[1];
  const calculatedDaily = calcAmount * (selectedPlan.roi / 100);
  const calculatedProfit = calculatedDaily * selectedPlan.duration;
  const calculatedTotal = calcAmount + calculatedProfit;

  // Recharts Allocation Data
  const allocationData = [
    { name: 'Institutional Alpha', value: 35000, color: '#00ff88' },
    { name: 'Wealth Builder Pro', value: 50000, color: '#3b82f6' },
    { name: 'Elite VIP Fund', value: 10000, color: '#a855f7' }
  ];

  // Recharts Analytics Yield Data
  const yieldData = [
    { name: 'Mon', yield: 120 },
    { name: 'Tue', yield: 180 },
    { name: 'Wed', yield: 150 },
    { name: 'Thu', yield: 210 },
    { name: 'Fri', yield: 195 },
    { name: 'Sat', yield: 250 },
    { name: 'Sun', yield: 280 }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
            Investment Portfolio
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Deploy Capital into automated institutional-grade yield strategies.</p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass relative p-6 rounded-2xl flex flex-col justify-between ${
                plan.popular ? 'border-brand/40 shadow-[0_0_20px_rgba(0,255,136,0.05)]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-black text-[10px] font-extrabold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,255,136,0.4)] uppercase tracking-wider">
                  Highly Recommended
                </div>
              )}
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-bg-base border border-border flex items-center justify-center">
                    <Icon size={20} style={{ color: plan.color }} />
                  </div>
                  <span className="text-xs font-semibold text-text-secondary">{plan.duration} Days Lockup</span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1.5 mb-6">
                  <span className="text-3.5xl font-extrabold text-brand tracking-tight">{plan.roi}%</span>
                  <span className="text-text-secondary text-xs mb-1.5">daily interest</span>
                </div>

                <div className="space-y-3 mb-8 text-xs border-y border-border/50 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Minimum Capital</span>
                    <span className="font-bold text-white">{formatCurrency(plan.min)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Maximum Cap</span>
                    <span className="font-bold text-white">{formatCurrency(plan.max)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Payout Model</span>
                    <span className="font-semibold text-brand">Daily Settlement</span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 size={14} className="text-brand shrink-0 mt-0.5" />
                      <span className="text-text-secondary leading-normal">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { setCalcPlan(plan.id); setCalcAmount(plan.min); }}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                  plan.popular 
                    ? 'bg-brand text-black hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.2)]' 
                    : 'bg-bg-base border border-border hover:border-brand/40 text-text-primary'
                }`}
              >
                Configure & Invest
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Strategy Allocation section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass p-6 rounded-2xl max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/60">
          <PieIcon size={18} className="text-brand" />
          <h3 className="font-bold text-md text-white">Strategy Allocation</h3>
        </div>
        <p className="text-xs text-text-secondary mb-6">Capital split across active institutional accounts.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Chart Container */}
          <div className="h-[220px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 11, color: '#fff' }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Allocated']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center text overlay with smaller text so it never overlaps */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold">Total Active</span>
              <span className="text-sm font-extrabold text-white tracking-tight mt-0.5">{formatCurrency(95000)}</span>
            </div>
          </div>

          {/* Details Legend */}
          <div className="space-y-3">
            {allocationData.map((d) => (
              <div key={d.name} className="flex justify-between items-center text-xs p-3 rounded-xl bg-bg-base/40 border border-border/60 hover:border-brand/35 transition-all">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-text-primary font-bold">{d.name}</span>
                </div>
                <span className="font-extrabold text-white text-sm">{formatCurrency(d.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats details */}
        <div className="grid grid-cols-3 gap-4 border-t border-border/60 pt-5 mt-6 text-center">
          <div>
            <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Average APR</div>
            <div className="text-base font-extrabold text-brand">24.5%</div>
          </div>
          <div>
            <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Weekly Earnings</div>
            <div className="text-base font-extrabold text-white">{formatCurrency(1350.25)}</div>
          </div>
          <div>
            <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Risk Rating</div>
            <div className="text-base font-extrabold text-green-400">Low-Mod</div>
          </div>
        </div>
      </motion.div>

      {/* Timeline and History Center */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-card/20">
          <div>
            <h3 className="font-bold text-md text-white">Investment Ledgers</h3>
            <p className="text-xs text-text-secondary">Historical logs of plans, lockups, and earnings.</p>
          </div>
          
          {/* Tabs switch */}
          <div className="flex bg-bg-base p-1 rounded-xl border border-border/80 self-end sm:self-auto">
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'active' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'completed' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Completed
            </button>
            <button 
              onClick={() => setActiveTab('expired')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'expired' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Expired
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'active' && (
            <div className="space-y-6">
              {[
                { name: 'Wealth Builder Pro II', principal: 50000, yieldEarned: 9500, start: 'Jun 15, 2026', end: 'Aug 14, 2026', progress: 45, planId: 'wealth' },
                { name: 'Institutional Alpha V', principal: 35000, yieldEarned: 11025, start: 'Jul 01, 2026', end: 'Jul 31, 2026', progress: 75, planId: 'alpha' },
                { name: 'Elite VIP Fund I', principal: 10000, yieldEarned: 280, start: 'Jul 09, 2026', end: 'Oct 07, 2026', progress: 5, planId: 'elite' }
              ].map((act, i) => (
                <div key={act.name} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-border/80 bg-bg-base/30 gap-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mt-1">
                      <Hourglass size={18} className="text-brand animate-spin-slow" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        {act.name} 
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20 uppercase tracking-wide">Active</span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        Principal Invested: <span className="font-bold text-white">{formatCurrency(act.principal)}</span> • Daily Yield Accrued: <span className="text-brand font-bold">{formatCurrency(act.yieldEarned)}</span>
                      </div>
                      <div className="text-[10px] text-text-secondary/70 flex items-center gap-1 mt-1">
                        <Calendar size={12} /> {act.start} <ArrowRight size={10} /> {act.end}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-56 space-y-1.5 self-end md:self-auto">
                    <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand h-full rounded-full" style={{ width: `${act.progress}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-text-secondary">
                      <span>Progression: {act.progress}%</span>
                      <span>Ends in {Math.round((act.progress / 100) * 30)}d</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {[
                { name: 'Wealth Builder Pro I', principal: 25000, profit: 30000, start: 'Mar 10, 2026', end: 'May 09, 2026', status: 'Liquidated' },
                { name: 'Institutional Alpha IV', principal: 15000, profit: 6750, start: 'May 01, 2026', end: 'May 31, 2026', status: 'Settled' }
              ].map((comp) => (
                <div key={comp.name} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-border/80 bg-bg-base/30 gap-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <FileCheck size={18} className="text-blue-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        {comp.name} 
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wide">Settled</span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        Principal: <span className="text-white font-bold">{formatCurrency(comp.principal)}</span> • Total ROI Realized: <span className="text-brand font-bold">+{formatCurrency(comp.profit)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-text-secondary block">Dates: {comp.start} to {comp.end}</span>
                    <span className="text-brand font-bold uppercase tracking-wider text-[9px] mt-1 inline-block">Payout Released</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'expired' && (
            <div className="space-y-4">
              {[
                { name: 'Alpha Starter Plan', principal: 1000, profit: 450, start: 'Jan 01, 2026', end: 'Jan 31, 2026' }
              ].map((exp) => (
                <div key={exp.name} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-border/80 bg-bg-base/30 gap-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                      <Clock size={18} className="text-rose-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        {exp.name} 
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wide">Expired</span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        Principal: <span className="text-white font-bold">{formatCurrency(exp.principal)}</span> • Payout Realized: <span className="text-brand font-bold">+{formatCurrency(exp.profit)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-text-secondary block">Ended: {exp.end}</span>
                    <span className="text-rose-400 font-bold uppercase tracking-wider text-[9px] mt-1 inline-block">Reinvestment Required</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
