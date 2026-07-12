'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Network, Search, Filter } from 'lucide-react';
import { useCurrency } from '@/components/CurrencyProvider';

export default function ReferralsClient({ referrals }: { referrals: any[] }) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Referral Network
          </h1>
          <p className="text-text-secondary text-sm font-medium">Monitor institutional referral commissions and network growth.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0b] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0f1115]">
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Referrer</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Referred User</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Commission</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Level</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary">No referral commissions found.</td>
                </tr>
              ) : referrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{ref.toUser?.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-text-secondary">{ref.fromUser?.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-brand">{formatCurrency(ref.amount)}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border bg-brand/10 text-brand border-brand/20">
                      Level {ref.level}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(ref.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
