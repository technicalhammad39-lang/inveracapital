// @ts-nocheck
import React from 'react';
import Link from 'next/link';
import { Wallet, ArrowDownRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { getCurrentUser } from '@/lib/auth';
import { getWalletMetrics, getRecentLedgers } from '@/app/actions/dashboardActions';
import { PremiumEmptyState } from '@/components/PremiumEmptyState';
import { FormattedCurrency } from '@/components/FormattedCurrency';

export default async function RecentLedgersList() {
  const user = await getCurrentUser();
  if (!user) return null;

  const wallet = await getWalletMetrics();
  const ledgers = wallet ? await getRecentLedgers() : [];

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-border/60 relative">
      <div className="p-6 border-b border-border/60 flex justify-between items-center bg-bg-card/40">
        <div>
          <h3 className="font-bold text-md text-white">Recent Ledgers</h3>
          <p className="text-xs text-text-secondary">Updates on internal movements, payouts, and draws.</p>
        </div>
        <Link 
          href="/transactions"
          className="text-[10px] font-bold text-brand hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded-lg border border-brand/20"
        >
          View Complete Ledger <ChevronRight size={12} />
        </Link>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-xs text-left min-w-[600px]">
          <thead className="text-text-secondary bg-bg-base/60 uppercase tracking-wider text-[10px] font-bold">
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
            {(!ledgers || ledgers.length === 0) ? (
              <tr>
                <td colSpan={6} className="p-4">
                  <PremiumEmptyState 
                    title="No Recent Transactions"
                    description="You haven't made any transactions yet."
                    icon={Wallet}
                    className="min-h-[200px]"
                  />
                </td>
              </tr>
            ) : (
              ledgers.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] border-l-2 border-transparent hover:border-brand transition-all">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center border",
                      tx.type === 'CREDIT' ? 'bg-brand/10 border-brand/20 text-brand' : 
                      tx.type === 'DEBIT' ? 'bg-rose-500/5 border-rose-500/10 text-rose-400' : 
                      'bg-white/5 border-border text-white'
                    )}>
                      {tx.type === 'CREDIT' ? <ArrowDownRight size={14} /> : 
                       tx.type === 'DEBIT' ? <ArrowUpRight size={14} /> : 
                       <Activity size={14} />}
                    </div>
                    <div>
                      <span className="font-bold text-text-primary block">{tx.description}</span>
                      <span className="text-[9px] text-text-secondary uppercase tracking-widest">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-text-secondary">{tx.id.substring(0, 10).toUpperCase()}</td>
                  <td className={clsx("px-6 py-4 font-bold text-sm", tx.type === 'CREDIT' ? 'text-brand' : 'text-text-primary')}>
                    {tx.type === 'CREDIT' ? '+' : '-'}<FormattedCurrency amount={tx.amount} />
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-text-secondary">System</td>
                  <td className="px-6 py-4 text-right">
                    <span className={clsx(
                      "px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-wider border",
                      tx.status === 'COMPLETED' ? 'bg-brand/10 border-brand/20 text-brand' : 
                      tx.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                      'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    )}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
