'use client';

import React, { useState } from 'react';
import { Gift, Plus, Pause, Play, Trash2 } from 'lucide-react';
import { createReward, toggleRewardStatus, deleteReward } from './actions';
import { useCurrency } from '@/components/CurrencyProvider';

export default function RewardsClient({ rewards }: { rewards: any[] }) {
  const { formatCurrency } = useCurrency();
  const [activeRewards, setActiveRewards] = useState(rewards);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'MILESTONE',
    amount: 10,
    condition: '{"target": 100}',
    isActive: true
  });

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setIsProcessing(id);
    const res = await toggleRewardStatus(id, currentStatus);
    if (res.success) {
      setActiveRewards(activeRewards.map(r => r.id === id ? { ...r, isActive: res.newStatus } : r));
    }
    setIsProcessing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;
    setIsProcessing(id);
    const res = await deleteReward(id);
    if (res.success) {
      setActiveRewards(activeRewards.filter(r => r.id !== id));
    }
    setIsProcessing(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing('create');
    const res = await createReward(formData);
    if (res.success) {
      setActiveRewards([...activeRewards, res.reward]);
      setCreateModalOpen(false);
      setFormData({ name: '', description: '', type: 'MILESTONE', amount: 10, condition: '{"target": 100}', isActive: true });
    } else {
      alert(res.error);
    }
    setIsProcessing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gift className="text-brand" /> Rewards Management
          </h2>
          <p className="text-text-secondary text-sm">Create and manage daily bonuses, milestones, and badges.</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-brand text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-hover transition-colors"
        >
          <Plus size={18} /> New Reward
        </button>
      </div>

      <div className="bg-bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-bg-base/40 text-text-secondary uppercase text-[10px] tracking-wider border-b border-border/50">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Reward</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {activeRewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{reward.name}</td>
                  <td className="px-6 py-4 text-text-secondary">{reward.type}</td>
                  <td className="px-6 py-4 text-brand font-bold">{formatCurrency(reward.amount)}</td>
                  <td className="px-6 py-4 text-text-secondary font-mono text-xs">{reward.condition}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      reward.isActive ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {reward.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => handleToggle(reward.id, reward.isActive)}
                      disabled={isProcessing === reward.id}
                      className="text-text-secondary hover:text-white transition-colors disabled:opacity-50"
                    >
                      {reward.isActive ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(reward.id)}
                      disabled={isProcessing === reward.id}
                      className="text-text-secondary hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {activeRewards.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                    No rewards configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-base border border-border/50 rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Create New Reward</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-text-secondary uppercase mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-secondary uppercase mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none">
                    <option value="DAILY_LOGIN">DAILY_LOGIN</option>
                    <option value="MILESTONE">MILESTONE</option>
                    <option value="VIP_UPGRADE">VIP_UPGRADE</option>
                    <option value="BADGE_UNLOCK">BADGE_UNLOCK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary uppercase mb-1">Reward Amount</label>
                  <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-secondary uppercase mb-1">Condition (JSON or Number)</label>
                <input required type="text" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} placeholder='{"target": 100, "category": "Investment"}' className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white font-mono text-xs focus:border-brand focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-text-secondary uppercase mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none" rows={3}></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="flex-1 py-3 border border-border/50 text-white rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={isProcessing === 'create'} className="flex-1 py-3 bg-brand text-black font-bold rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50">Create Reward</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
