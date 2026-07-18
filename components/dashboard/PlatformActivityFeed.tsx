'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Activity, ArrowDownLeft, ArrowUpRight, CheckCircle, Ticket, Gift, Sparkles, UserPlus } from 'lucide-react';
import { useCurrency } from '@/components/CurrencyProvider';
import { PremiumEmptyState } from '@/components/PremiumEmptyState';

export default function PlatformActivityFeed({ activities }: { activities: any[] }) {
  const { formatCurrency } = useCurrency();

  const getActionDetails = (action: string, type: string) => {
    switch (action) {
      case 'DEPOSIT_APPROVED':
        return { icon: ArrowDownLeft, color: 'text-brand', bg: 'bg-brand/10', border: 'border-brand/20', text: 'Deposit Completed' };
      case 'WITHDRAWAL_APPROVED':
        return { icon: ArrowUpRight, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'Withdrawal Completed' };
      case 'INVESTMENT_STARTED':
        return { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'Investment Started' };
      case 'LOTTERY_PURCHASE':
        return { icon: Ticket, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'Lottery Ticket Purchased' };
      case 'REWARD_CLAIMED':
        return { icon: Gift, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'Reward Claimed' };
      case 'NEW_REFERRAL':
        return { icon: UserPlus, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'New Referral Joined' };
      default:
        return { icon: Activity, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: action };
    }
  };

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass rounded-2xl overflow-hidden mt-8"
    >
      <div className="p-6 border-b border-border/60 bg-bg-card/25 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-md text-white flex items-center gap-2">
            <Activity size={18} className="text-brand animate-pulse" /> Live Platform Activity
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">Real-time feed of recent platform-wide actions.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand"></span>
          </span>
          <span className="text-[10px] text-brand font-bold uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-xs text-left min-w-[700px]">
          <thead className="text-text-secondary bg-bg-base/40 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Activity Event</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {activities.length > 0 ? (
              activities.map((act) => {
                const details = getActionDetails(act.action, act.type);
                const Icon = details.icon;

                return (
                  <tr key={act.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                          {act.avatar}
                        </div>
                        <span className="font-bold text-white group-hover:text-brand transition-colors">{act.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-md ${details.bg} ${details.border} border`}>
                          <Icon size={14} className={details.color} />
                        </div>
                        <span className="font-semibold text-text-primary">{details.text}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black">
                      {act.amount ? (
                        <span className={act.action.includes('DEPOSIT') || act.action.includes('REWARD') ? 'text-brand' : 'text-white'}>
                          {formatCurrency(act.amount)}
                        </span>
                      ) : (
                        <span className="text-text-secondary">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-brand/10 text-brand border border-brand/20">
                        {act.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-text-secondary font-mono">
                      {timeAgo(act.time)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10">
                  <PremiumEmptyState 
                    title="No recent activity"
                    description="The platform activity feed is currently quiet."
                    icon={Sparkles}
                    className="border-none bg-transparent"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
