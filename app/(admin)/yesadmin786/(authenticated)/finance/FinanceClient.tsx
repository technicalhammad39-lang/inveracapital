'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, Save } from 'lucide-react';
import { updateSetting } from './actions';

export default function FinanceClient({ settings }: { settings: any[] }) {
  const [formData, setFormData] = useState({
    minDeposit: settings.find(s => s.key === 'minDeposit')?.value || '10',
    maxDeposit: settings.find(s => s.key === 'maxDeposit')?.value || '100000',
    minWithdrawal: settings.find(s => s.key === 'minWithdrawal')?.value || '50',
    maxWithdrawal: settings.find(s => s.key === 'maxWithdrawal')?.value || '50000',
    withdrawalFeePercent: settings.find(s => s.key === 'withdrawalFeePercent')?.value || '2',
    referralLevel1: settings.find(s => s.key === 'referralLevel1')?.value || '5',
    referralLevel2: settings.find(s => s.key === 'referralLevel2')?.value || '2',
    referralLevel3: settings.find(s => s.key === 'referralLevel3')?.value || '1',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const updates = Object.entries(formData).map(([key, value]) => updateSetting(key, value));
    
    try {
      await Promise.all(updates);
      alert('Financial settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings.');
    }
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Financial Control
          </h1>
          <p className="text-text-secondary text-sm font-medium">Manage global platform limits, fees, and referral structures.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0b] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl"
      >
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Limits Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Deposit & Withdrawal Limits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Minimum Deposit ($)</label>
                <input 
                  type="number" 
                  value={formData.minDeposit}
                  onChange={(e) => setFormData({...formData, minDeposit: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Maximum Deposit ($)</label>
                <input 
                  type="number" 
                  value={formData.maxDeposit}
                  onChange={(e) => setFormData({...formData, maxDeposit: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Minimum Withdrawal ($)</label>
                <input 
                  type="number" 
                  value={formData.minWithdrawal}
                  onChange={(e) => setFormData({...formData, minWithdrawal: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Maximum Withdrawal ($)</label>
                <input 
                  type="number" 
                  value={formData.maxWithdrawal}
                  onChange={(e) => setFormData({...formData, maxWithdrawal: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* Fees Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Platform Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Global Withdrawal Fee (%)</label>
                <input 
                  type="number" step="0.1"
                  value={formData.withdrawalFeePercent}
                  onChange={(e) => setFormData({...formData, withdrawalFeePercent: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
            </div>
          </div>

          {/* Referrals Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Referral Commission Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Level 1 Commission (%)</label>
                <input 
                  type="number" step="0.1"
                  value={formData.referralLevel1}
                  onChange={(e) => setFormData({...formData, referralLevel1: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Level 2 Commission (%)</label>
                <input 
                  type="number" step="0.1"
                  value={formData.referralLevel2}
                  onChange={(e) => setFormData({...formData, referralLevel2: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Level 3 Commission (%)</label>
                <input 
                  type="number" step="0.1"
                  value={formData.referralLevel3}
                  onChange={(e) => setFormData({...formData, referralLevel3: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-brand text-black font-extrabold text-sm rounded-xl hover:bg-brand-hover active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)] disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
