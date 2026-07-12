'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Plus, 
  Users, 
  Pause, 
  Play, 
  Edit3, 
  Trash2,
  DollarSign,
  X
} from 'lucide-react';
import clsx from 'clsx';
import { useCurrency } from '@/components/CurrencyProvider';
import { createInvestmentPlan, togglePlanStatus, deletePlan } from './actions';

export default function InvestmentsClient({ plans }: { plans: any[] }) {
  const { formatCurrency } = useCurrency();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    minAmount: 100,
    maxAmount: 10000,
    roiPercent: 1.5,
    durationDays: 30
  });

  const [activePlans, setActivePlans] = useState(plans);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleToggle = async (planId: string, currentStatus: string) => {
    setIsProcessing(planId);
    const res = await togglePlanStatus(planId, currentStatus);
    if (res.success) {
      setActivePlans(activePlans.map(p => p.id === planId ? { ...p, status: res.newStatus } : p));
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(null);
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan? Active investments in this plan will remain but the plan will be hidden.')) return;
    setIsProcessing(planId);
    const res = await deletePlan(planId);
    if (res.success) {
      setActivePlans(activePlans.filter(p => p.id !== planId));
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing('create');
    const res = await createInvestmentPlan(formData);
    if (res.success) {
      setCreateModalOpen(false);
      window.location.reload(); // Quick refresh to grab new plan with relations
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(null);
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Investment Plans
          </h1>
          <p className="text-text-secondary text-sm font-medium">Configure ROI, durations, and manage active institutional pools.</p>
        </div>

        <button 
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand text-black font-extrabold text-sm rounded-xl hover:bg-brand-hover active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)]"
        >
          <Plus size={18} />
          Create New Plan
        </button>
      </div>

      {/* Plans Grid (Premium Stripe Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activePlans.length === 0 ? (
          <div className="col-span-full py-12 text-center text-text-secondary bg-[#0a0a0b] rounded-2xl border border-white/10">
            No investment plans found. Create one to get started.
          </div>
        ) : activePlans.map((plan, i) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-[#0a0a0b] rounded-2xl border border-white/10 overflow-hidden flex flex-col hover:border-brand/30 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(0,255,136,0.15)]"
          >
            <div className={`absolute -inset-[1px] bg-gradient-to-r from-brand/0 via-brand/20 to-brand/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer`} style={{ backgroundSize: '200% 100%' }} />

            <div className="p-6 border-b border-white/10 relative z-10 bg-[#0a0a0b]">
              <div className="flex justify-between items-start mb-4">
                <span className={clsx(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border",
                  plan.status === 'ACTIVE' ? "bg-brand/10 text-brand border-brand/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                )}>
                  {plan.status}
                </span>
                <div className="flex gap-2">
                  <button 
                    disabled={isProcessing === plan.id}
                    onClick={() => handleToggle(plan.id, plan.status)}
                    className="p-1.5 text-text-secondary hover:text-amber-400 bg-white/5 rounded-lg border border-white/10 transition-colors disabled:opacity-50" 
                    title={plan.status === 'ACTIVE' ? 'Pause Plan' : 'Activate Plan'}
                  >
                    {plan.status === 'ACTIVE' ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button 
                    disabled={isProcessing === plan.id}
                    onClick={() => handleDelete(plan.id)}
                    className="p-1.5 text-text-secondary hover:text-rose-400 bg-white/5 rounded-lg border border-white/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-brand font-black text-2xl mt-1">{plan.roiPercent}% Daily</p>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between relative z-10 bg-[#0a0a0b]">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-xs text-text-secondary">Duration</span>
                  <span className="text-sm font-semibold text-white">{plan.durationDays} Days</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-xs text-text-secondary">Limits</span>
                  <span className="text-sm font-semibold text-white">
                    {formatCurrency(plan.minAmount)} - {formatCurrency(plan.maxAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-xs text-text-secondary">Active Investors</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    <Users size={14} className="text-blue-400" />
                    {plan._count?.investments || 0}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Total TVL</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-brand">
                    <DollarSign size={14} />
                    {formatCurrency(plan.totalTVL || 0)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0a0a0b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Create Investment Plan</h2>
              <button onClick={() => setCreateModalOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Plan Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  placeholder="e.g. Wealth Builder Pro"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Min Deposit ($)</label>
                  <input 
                    required type="number" 
                    value={formData.minAmount}
                    onChange={(e) => setFormData({...formData, minAmount: Number(e.target.value)})}
                    className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Max Deposit ($)</label>
                  <input 
                    required type="number" 
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({...formData, maxAmount: Number(e.target.value)})}
                    className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Daily ROI (%)</label>
                  <input 
                    required type="number" step="0.1"
                    value={formData.roiPercent}
                    onChange={(e) => setFormData({...formData, roiPercent: Number(e.target.value)})}
                    className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Duration (Days)</label>
                  <input 
                    required type="number" 
                    value={formData.durationDays}
                    onChange={(e) => setFormData({...formData, durationDays: Number(e.target.value)})}
                    className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
              <button 
                disabled={isProcessing === 'create'}
                type="submit" 
                className="w-full mt-6 py-2.5 bg-brand text-black font-extrabold text-sm rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-50"
              >
                {isProcessing === 'create' ? 'Creating...' : 'Create Plan'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
