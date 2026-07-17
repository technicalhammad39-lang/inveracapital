import React from 'react';
import Link from 'next/link';
import { Activity, Zap, PieChart } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getActiveAllocations } from '@/app/actions/dashboardActions';
import { PremiumEmptyState } from '@/components/PremiumEmptyState';
import { FormattedCurrency } from '@/components/FormattedCurrency';

export default async function ActiveAllocationsList() {
  const user = await getCurrentUser();
  if (!user) return null;

  const allocations = await getActiveAllocations();

  return (
    <div className="flex flex-col gap-6 h-full">
      {(!allocations || allocations.length === 0) ? (
        <PremiumEmptyState 
          title="No Active Portfolios"
          description="Start your investment journey to see live portfolio growth and daily yields here."
          ctaText="Browse Investment Plans"
          ctaHref="/investments"
          icon={Activity}
        />
      ) : (
        allocations.map((inv) => (
          <div 
            key={inv.id} 
            className="bg-bg-card border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-brand/30 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                  <PieChart size={22} className="text-brand drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-md tracking-tight">{inv.name}</h4>
                  <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Active Contract</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-brand font-black text-lg">{inv.rate}</div>
                <div className="text-[9px] text-text-secondary uppercase font-bold tracking-widest">Daily Yield</div>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end border-b border-white/5 pb-3">
                <span className="text-xs text-text-secondary font-semibold">Principal Allocation</span>
                <span className="text-white font-extrabold font-mono text-sm"><FormattedCurrency amount={inv.principal} /></span>
              </div>
              <div className="flex justify-between items-end pb-1">
                <span className="text-xs text-text-secondary font-semibold">Total Yield Generated</span>
                <span className="text-brand font-extrabold font-mono text-sm"><FormattedCurrency amount={inv.earned} /></span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
              <span className="text-[10px] text-text-secondary font-mono bg-bg-base px-2 py-1 rounded border border-white/5">ID: {inv.id.substring(0, 8).toUpperCase()}</span>
              <Link href="/investments" className="text-[10px] font-bold text-brand hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors">
                Manage <Zap size={10} />
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
