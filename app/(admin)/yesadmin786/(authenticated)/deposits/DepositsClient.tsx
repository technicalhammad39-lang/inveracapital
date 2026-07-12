'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowDownToLine, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  Eye
} from 'lucide-react';
import clsx from 'clsx';
import { useCurrency } from '@/components/CurrencyProvider';
import { updateDepositStatus } from './actions';

export default function DepositsClient({ deposits }: { deposits: any[] }) {
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDeposits, setActiveDeposits] = useState(deposits);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filtered = activeDeposits.filter(d => 
    d.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this deposit?`)) return;
    setIsProcessing(id);
    const res = await updateDepositStatus(id, status);
    if (res.success) {
      setActiveDeposits(activeDeposits.map(d => d.id === id ? { ...d, status } : d));
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
            Deposit Queue
          </h1>
          <p className="text-text-secondary text-sm font-medium">Review and process incoming fund transfers from investors.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search TXID or email..." 
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
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">TXID / Proof</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">No deposits found.</td>
                </tr>
              ) : filtered.map((dep) => (
                <tr key={dep.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{dep.user?.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-brand block">{formatCurrency(dep.amount)}</span>
                    <span className="text-xs text-text-secondary uppercase">{dep.method}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-text-secondary font-mono bg-white/5 px-2 py-1 rounded inline-block truncate max-w-[150px]">
                      {dep.transactionId || 'Manual/Fiat'}
                    </p>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(dep.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={clsx(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border",
                      dep.status === 'APPROVED' ? "bg-brand/10 text-brand border-brand/20" : 
                      dep.status === 'PENDING' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                      "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {dep.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {dep.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          disabled={isProcessing === dep.id}
                          onClick={() => handleStatusUpdate(dep.id, 'APPROVED')}
                          className="p-1.5 text-text-secondary hover:text-brand hover:bg-brand/10 rounded-lg transition-colors disabled:opacity-50" 
                          title="Approve Deposit"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          disabled={isProcessing === dep.id}
                          onClick={() => handleStatusUpdate(dep.id, 'REJECTED')}
                          className="p-1.5 text-text-secondary hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Reject Deposit"
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
