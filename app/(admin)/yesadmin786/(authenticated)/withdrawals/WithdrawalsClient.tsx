'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpFromLine, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle
} from 'lucide-react';
import clsx from 'clsx';
import { useCurrency } from '@/components/CurrencyProvider';
import { updateWithdrawalStatus } from './actions';

export default function WithdrawalsClient({ withdrawals }: { withdrawals: any[] }) {
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeWithdrawals, setActiveWithdrawals] = useState(withdrawals);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filtered = activeWithdrawals.filter(w => 
    w.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.destinationAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = async (id: string, status: string) => {
    let notes = '';
    if (status === 'REJECTED') {
      const reason = prompt('Please provide a reason for rejection (this will be logged and the amount refunded to their wallet):');
      if (reason === null) return;
      notes = reason;
    } else {
      if (!confirm(`Are you sure you want to approve this withdrawal?`)) return;
    }

    setIsProcessing(id);
    const res = await updateWithdrawalStatus(id, status, notes);
    if (res.success) {
      setActiveWithdrawals(activeWithdrawals.map(w => w.id === id ? { ...w, status } : w));
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(null);
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Withdrawal Queue
          </h1>
          <p className="text-text-secondary text-sm font-medium">Process investor payout requests and verify destinations.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search user or address..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-[#0a0a0b] border border-white/10 hover:border-brand/40 focus:border-brand rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none transition-all text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0b] border border-white/10 rounded-xl text-sm font-semibold text-white hover:bg-white/5 transition-colors">
            <Filter size={16} />
            Filters
          </button>
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
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Amount / Method</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Destination Address</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">No withdrawals found.</td>
                </tr>
              ) : filtered.map((w) => (
                <tr key={w.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{w.user?.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-rose-400 block">{formatCurrency(w.amount)}</span>
                    <span className="text-xs text-text-secondary uppercase">{w.method}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-text-secondary font-mono bg-white/5 px-2 py-1 rounded inline-block truncate max-w-[200px]" title={w.destinationAddress}>
                      {w.destinationAddress}
                    </p>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(w.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={clsx(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border",
                      w.status === 'COMPLETED' ? "bg-brand/10 text-brand border-brand/20" : 
                      w.status === 'PENDING' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                      "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {w.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {w.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          disabled={isProcessing === w.id}
                          onClick={() => handleStatusUpdate(w.id, 'COMPLETED')}
                          className="p-1.5 text-text-secondary hover:text-brand hover:bg-brand/10 rounded-lg transition-colors disabled:opacity-50" 
                          title="Approve Withdrawal"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          disabled={isProcessing === w.id}
                          onClick={() => handleStatusUpdate(w.id, 'REJECTED')}
                          className="p-1.5 text-text-secondary hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Reject & Refund"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
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
