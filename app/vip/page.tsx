'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { VipCrown } from '@/components/CustomIllustrations';
import { 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  TrendingUp, 
  Lock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const tiers = [
  {
    id: 'silver',
    name: 'Silver VIP',
    requirement: 1000,
    roiBoost: '+0.10%',
    gasFee: '2.0%',
    limit: 10000,
    manager: 'Standard Queue',
    color: 'text-slate-400',
    border: 'border-slate-500/20',
    bg: 'rgba(148, 163, 184, 0.05)',
  },
  {
    id: 'gold',
    name: 'Gold VIP',
    requirement: 10000,
    roiBoost: '+0.25%',
    gasFee: '1.0%',
    limit: 25000,
    manager: 'Dedicated Support',
    color: 'text-yellow-400',
    border: 'border-yellow-500/20',
    bg: 'rgba(250, 204, 21, 0.05)',
    active: true
  },
  {
    id: 'platinum',
    name: 'Platinum VIP',
    requirement: 50000,
    roiBoost: '+0.50%',
    gasFee: '0.5%',
    limit: 50000,
    manager: 'Assigned Executive',
    color: 'text-teal-400',
    border: 'border-teal-500/20',
    bg: 'rgba(20, 184, 166, 0.05)'
  },
  {
    id: 'diamond',
    name: 'Diamond VIP',
    requirement: 100000,
    roiBoost: '+0.75%',
    gasFee: 'Free Gas',
    limit: 100000,
    manager: 'Private Banker',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'rgba(59, 130, 246, 0.05)'
  },
  {
    id: 'elite',
    name: 'Elite VIP',
    requirement: 250000,
    roiBoost: '+1.20%',
    gasFee: 'Free Gas',
    limit: 250000,
    manager: 'Board of Advisory',
    color: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'rgba(168, 85, 247, 0.05)'
  }
];

export default function VipPage() {
  const { formatCurrency } = useCurrency();
  const [selectedTier, setSelectedTier] = useState<string>('gold');

  const activeTier = tiers.find(t => t.id === selectedTier) || tiers[1];
  const myCurrentVolume = 35000; // Mock current invested volume

  const nextTier = tiers[2]; // Platinum is next
  const gap = nextTier.requirement - myCurrentVolume;
  const progressionPct = (myCurrentVolume / nextTier.requirement) * 100;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
          VIP Membership Center
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Review accounts tier allocations, loyalty benefits, and yield booster multipliers.</p>
      </div>

      {/* Hero Banner with crown illustration & progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Crown vector hero */}
        <div className="glass p-6 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand/5 blur-3xl pointer-events-none" />
          <VipCrown className="w-40 h-40 animate-pulse-slow" />
          <div className="space-y-1 relative z-10">
            <h3 className="font-extrabold text-xl text-white">Gold Tier VIP Member</h3>
            <p className="text-xs text-brand font-semibold">Boost Rate: +0.25% Daily Settlement</p>
          </div>
        </div>

        {/* Upgrade progression details (middle panel) */}
        <div className="glass p-6 rounded-3xl lg:col-span-2 flex flex-col justify-between h-full min-h-[220px]">
          <div className="space-y-3">
            <h3 className="font-bold text-md text-white flex items-center gap-2">
              <Zap size={18} className="text-brand" /> VIP Progress Tracker
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your active investment portfolio size is <strong className="text-white">{formatCurrency(myCurrentVolume)}</strong>. Invest another <strong className="text-brand">{formatCurrency(gap)}</strong> to unlock <strong className="text-teal-400">Platinum VIP</strong> yield boosts.
            </p>
          </div>

          <div className="space-y-2 mt-6">
            <div className="w-full bg-border h-2 rounded-full overflow-hidden border border-border/60">
              <div className="bg-gradient-to-r from-yellow-400 to-teal-400 h-full rounded-full" style={{ width: `${progressionPct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-text-secondary">
              <span>Gold VIP ($10k Target)</span>
              <span className="text-teal-400">Platinum VIP ($50k Target)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Tiers Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-text-secondary uppercase tracking-wider pl-1">Accounts VIP Tiers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {tiers.map((t) => (
            <div 
              key={t.id}
              onClick={() => setSelectedTier(t.id)}
              className={`p-5 rounded-2xl border cursor-pointer flex flex-col justify-between min-h-[170px] transition-all relative ${
                selectedTier === t.id 
                  ? 'border-brand bg-brand/5 shadow-[0_0_15px_rgba(0,255,136,0.1)]' 
                  : 'border-border/80 bg-bg-base/30 hover:border-brand/40'
              }`}
            >
              {t.active && (
                <span className="absolute top-2.5 right-2.5 text-[8px] bg-brand text-black font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
              
              <div>
                <span className={`text-xs font-bold block ${t.color}`}>{t.name}</span>
                <span className="text-[10px] text-text-secondary mt-1 block">Min Portfolio Size</span>
                <span className="text-md font-bold text-white mt-0.5 block">{formatCurrency(t.requirement)}</span>
              </div>
              
              <div className="border-t border-border/40 pt-3 mt-4 flex justify-between items-end">
                <div>
                  <span className="text-[9px] text-text-secondary block">ROI Booster</span>
                  <span className="text-xs font-bold text-brand">{t.roiBoost}</span>
                </div>
                <ChevronRight size={14} className="text-text-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed comparison grid */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border/60 bg-bg-card/25">
          <h3 className="font-bold text-md text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-brand" /> VIP Tier Matrix benefits
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">Comprehensive comparison showing yield adjustments and security levels.</p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="text-text-secondary bg-bg-base/40 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Membership Level</th>
                <th className="px-6 py-4">Investment Requirement</th>
                <th className="px-6 py-4">ROI Boost Yield</th>
                <th className="px-6 py-4">Withdrawal Gas Fee</th>
                <th className="px-6 py-4">Daily Cash Limit</th>
                <th className="px-6 py-4 text-right">Account Manager Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-white">
              {tiers.map((t) => (
                <tr 
                  key={t.id}
                  className={`hover:bg-white/[0.01] transition-colors ${
                    selectedTier === t.id ? 'bg-brand/[0.02] border-brand/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-bold">{t.name}</td>
                  <td className="px-6 py-4 text-text-secondary font-semibold">{formatCurrency(t.requirement)}</td>
                  <td className="px-6 py-4 text-brand font-bold">{t.roiBoost}</td>
                  <td className="px-6 py-4 text-text-secondary font-semibold">{t.gasFee}</td>
                  <td className="px-6 py-4 text-text-secondary font-semibold">{formatCurrency(t.limit)} / daily</td>
                  <td className="px-6 py-4 text-right text-text-secondary font-semibold">{t.manager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
