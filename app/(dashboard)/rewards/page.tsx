'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  Gift, 
  Check, 
  Lock, 
  Award, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Star, 
  Flame,
  CheckCircle2
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  desc: string;
  reward: number;
  current: number;
  target: number;
  category: string;
}

const mockAchievements: Achievement[] = [
  { id: 'ach1', title: 'Seed Fund deploy', desc: 'Deploy at least $5,000 into Wealth Builder Pro.', reward: 250, current: 5000, target: 5000, category: 'Investment' },
  { id: 'ach2', title: 'Lottery enthusiast', desc: 'Secure at least 10 entries in Mega Lottery draws.', reward: 50, current: 3, target: 10, category: 'Lottery' },
  { id: 'ach3', title: 'Network builder', desc: 'Invite 5 active stakers to your Level 1 node.', reward: 150, current: 3, target: 5, category: 'Referral' },
  { id: 'ach4', title: 'High roller VIP', desc: 'Achieve total network volume of $100k.', reward: 1000, current: 95000, target: 100000, category: 'VIP' }
];

export default function RewardsPage() {
  const { formatCurrency } = useCurrency();
  
  // Daily login rewards state
  const [dailyClaimed, setDailyClaimed] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  });
  const [claimToast, setClaimToast] = useState<string | null>(null);

  const dailyAmounts = [1, 1.5, 2, 2.5, 3, 5, 10]; // Rewards value

  const handleClaimDaily = (day: number) => {
    // Can only claim if previous days are claimed and this day is not claimed
    if (day !== 3 || dailyClaimed[day]) return; // Day 3 is current ready day in our mock
    
    setDailyClaimed(prev => ({ ...prev, [day]: true }));
    setClaimToast(`Daily Bonus of ${formatCurrency(dailyAmounts[day - 1])} added to Bonus Wallet!`);
    setTimeout(() => setClaimToast(null), 3000);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
          Rewards & Achievements
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Claim daily sign-in allowances, clear milestones, and unlock VIP multiplier badges.</p>
      </div>

      {/* Daily Reward claim row */}
      <div className="glass p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
          <div className="space-y-1">
            <h3 className="font-bold text-md text-white flex items-center gap-2">
              <Gift size={18} className="text-brand animate-bounce" /> Daily Sign-in Allowance
            </h3>
            <p className="text-xs text-text-secondary">Claim daily yields by checking into your dashboard cycle every 24h.</p>
          </div>
          <span className="text-[10px] bg-brand/10 border border-brand/20 text-brand font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Current Day: Day 3
          </span>
        </div>

        {/* 7 Days blocks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {dailyAmounts.map((amt, idx) => {
            const dayNum = idx + 1;
            const isClaimed = dailyClaimed[dayNum];
            const isCurrent = dayNum === 3;
            const isLocked = dayNum > 3;

            return (
              <div 
                key={dayNum}
                onClick={() => handleClaimDaily(dayNum)}
                className={`p-4 rounded-2xl flex flex-col justify-between items-center text-center border relative transition-all ${
                  isClaimed 
                    ? 'bg-brand/5 border-brand/20 text-brand/60' 
                    : isCurrent 
                    ? 'bg-brand border-brand cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.35)] hover:bg-brand-hover text-black' 
                    : 'bg-bg-base border-border/80 text-text-secondary'
                }`}
              >
                {/* Status Icon */}
                <div className="absolute top-2 right-2">
                  {isClaimed ? (
                    <Check size={12} className="text-brand" />
                  ) : isLocked ? (
                    <Lock size={12} className="text-text-secondary/50" />
                  ) : (
                    <Sparkles size={12} className="text-black animate-pulse" />
                  )}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider block mb-3">Day {dayNum}</span>
                <span className={`text-lg font-black block ${isClaimed ? 'text-text-secondary/60' : isCurrent ? 'text-black' : 'text-white'}`}>
                  +{formatCurrency(amt)}
                </span>
                
                <span className="text-[9px] font-extrabold mt-4 block">
                  {isClaimed ? 'Claimed' : isCurrent ? 'CLAIM NOW' : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Achievements & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Achievements (left panel) */}
        <div className="glass p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div className="pb-2 border-b border-border/60">
            <h3 className="font-bold text-md text-white flex items-center gap-2">
              <Zap size={18} className="text-brand" /> Active Tasks & Milestones
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">Clear these milestones to trigger instant wallet reward crediting.</p>
          </div>

          <div className="space-y-4">
            {mockAchievements.map((ach) => {
              const pct = Math.min((ach.current / ach.target) * 100, 100);
              const isCleared = pct === 100;
              return (
                <div key={ach.id} className="bg-bg-base/30 border border-border/80 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-6 hover:border-brand/40 transition-colors">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-extrabold text-sm text-white">{ach.title}</h4>
                    <p className="text-xs text-text-secondary leading-normal">{ach.desc}</p>
                    
                    {/* Progress details */}
                    <div className="space-y-1.5 pt-3 max-w-md">
                      <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                        <div className="bg-brand h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-text-secondary">
                        <span>Progress: {pct.toFixed(0)}%</span>
                        <span>{ach.current.toLocaleString()} / {ach.target.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2 justify-center">
                    <div className="text-right">
                      <span className="text-[10px] text-text-secondary block font-bold">Reward Payout</span>
                      <span className="font-extrabold text-brand text-sm">+{formatCurrency(ach.reward)}</span>
                    </div>

                    {isCleared ? (
                      <button className="bg-brand text-black font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg hover:bg-brand-hover shadow-[0_0_10px_rgba(0,255,136,0.2)] transition-all uppercase tracking-wider">
                        Claim Reward
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1.5 bg-bg-base border border-border/60 text-text-secondary/60 rounded-lg uppercase tracking-wider">
                        <Lock size={10} /> Locked
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Cabinet (right panel) */}
        <div className="glass p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="pb-2 border-b border-border/60">
              <h3 className="font-bold text-md text-white flex items-center gap-2">
                <Award size={18} className="text-brand" /> Badges & Medals
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">Cabinet showcasing unlocked account accolades.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'First Seed', desc: 'Made first deposit', unlocked: true, icon: Star, gradient: 'from-brand/10 to-emerald-950/20 border-brand/25 text-brand shadow-[0_0_15px_rgba(0,255,136,0.05)]' },
                { name: 'Yield Master', desc: 'Total ROI $10k+', unlocked: true, icon: Flame, gradient: 'from-blue-500/10 to-blue-950/20 border-blue-500/20 text-blue-400' },
                { name: 'Network Boss', desc: 'Total Team 100+', unlocked: true, icon: Award, gradient: 'from-purple-500/10 to-purple-950/20 border-purple-500/20 text-purple-400' },
                { name: 'Millionaire', desc: 'Balance $1M+', unlocked: false, icon: Lock, gradient: 'from-bg-base/30 to-bg-base/10 border-border/80 text-text-secondary/50' }
              ].map((bdg) => {
                const Icon = bdg.icon;
                return (
                  <div 
                    key={bdg.name}
                    className={`p-5 rounded-2xl border flex flex-col items-center text-center relative overflow-hidden transition-all hover:scale-102 bg-gradient-to-b ${bdg.gradient}`}
                  >
                    {/* Illustration background ring */}
                    <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full border border-white/[0.03] pointer-events-none" />
                    
                    <div className="w-12 h-12 rounded-full bg-bg-base border border-border flex items-center justify-center mb-3 shadow-inner relative z-10 shrink-0">
                      <Icon size={20} className="shrink-0" />
                    </div>

                    <span className="font-extrabold text-xs text-white block truncate w-full relative z-10">{bdg.name}</span>
                    <span className="text-[9px] text-text-secondary mt-1 leading-normal block relative z-10">{bdg.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-bg-base/30 border border-border/50 p-3 rounded-xl mt-6 text-[10px] text-text-secondary leading-relaxed">
            🏆 Unlocking badges boosters your overall VIP rating levels and reduces withdrawal gas limits.
          </div>
        </div>

      </div>

      {/* Claim confirmation Toast */}
      <AnimatePresence>
        {claimToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-bg-base border border-brand/30 p-4 rounded-xl shadow-[0_10px_35px_rgba(0,255,136,0.15)] flex items-center gap-3 text-xs"
          >
            <CheckCircle2 className="text-brand w-5 h-5 shrink-0" />
            <span className="text-white font-medium">{claimToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
