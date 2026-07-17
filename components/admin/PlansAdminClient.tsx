'use client';

import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, CheckCircle2, XCircle, ChevronDown, ChevronUp, Save
} from 'lucide-react';
import { 
  createInvestmentPlan, 
  updateInvestmentPlan, 
  deleteInvestmentPlan 
} from '@/app/actions/adminPlanActions';

export default function PlansAdminClient({ initialPlans }: { initialPlans: any[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dailyRoi: 0,
    durationDays: 0,
    minAmount: 0,
    maxAmount: 0,
    fixedAmount: '',
    status: 'ACTIVE',
    displayOrder: 0,
    badge: '',
    icon: 'briefcase',
    gradientColor: '#00ff88',
    theme: 'dark',
    planImage: '',
    features: '',
    riskLevel: 'Medium',
    expectedReturn: 'Variable',
    visibility: true
  });

  const openModal = (plan?: any) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        ...plan,
        dailyRoi: Number(plan.dailyRoi),
        minAmount: Number(plan.minAmount),
        maxAmount: Number(plan.maxAmount),
        fixedAmount: plan.fixedAmount ? String(plan.fixedAmount) : '',
        features: Array.isArray(plan.features) ? plan.features.join('\\n') : '',
        badge: plan.badge || '',
        planImage: plan.planImage || ''
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '', description: '', dailyRoi: 1, durationDays: 30, minAmount: 100, maxAmount: 10000,
        fixedAmount: '', status: 'ACTIVE', displayOrder: plans.length, badge: '', icon: 'briefcase',
        gradientColor: '#00ff88', theme: 'dark', planImage: '', features: '', riskLevel: 'Medium',
        expectedReturn: 'Variable', visibility: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      dailyRoi: Number(formData.dailyRoi),
      durationDays: Number(formData.durationDays),
      minAmount: Number(formData.minAmount),
      maxAmount: Number(formData.maxAmount),
      fixedAmount: formData.fixedAmount ? Number(formData.fixedAmount) : null,
      displayOrder: Number(formData.displayOrder),
      features: formData.features.split('\\n').filter(f => f.trim() !== '')
    };

    if (editingPlan) {
      const res = await updateInvestmentPlan(editingPlan.id, payload);
      if (res.success) {
        setPlans(plans.map(p => p.id === editingPlan.id ? res.data : p));
        setIsModalOpen(false);
      } else alert(res.error);
    } else {
      const res = await createInvestmentPlan(payload);
      if (res.success) {
        setPlans([...plans, res.data]);
        setIsModalOpen(false);
      } else alert(res.error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    const res = await deleteInvestmentPlan(id);
    if (res.success) {
      setPlans(plans.filter(p => p.id !== id));
    } else {
      alert(res.error);
    }
  };

  const toggleVisibility = async (plan: any) => {
    const res = await updateInvestmentPlan(plan.id, { visibility: !plan.visibility });
    if (res.success) {
      setPlans(plans.map(p => p.id === plan.id ? res.data : p));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => openModal()} className="bg-brand text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-hover transition-colors">
          <Plus size={16} /> Create Plan
        </button>
      </div>

      <div className="bg-bg-card border border-border/50 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-bg-base/50 text-text-secondary text-xs uppercase tracking-wider border-b border-border/50">
            <tr>
              <th className="px-6 py-4">Plan Name</th>
              <th className="px-6 py-4">ROI / Duration</th>
              <th className="px-6 py-4">Limits</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Visible</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-white">
            {plans.map(plan => (
              <tr key={plan.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-bold">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${plan.gradientColor}20`, color: plan.gradientColor }}>
                      <span className="material-icons text-sm">{plan.icon}</span>
                    </div>
                    {plan.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-brand font-bold">{Number(plan.dailyRoi)}%</span> daily<br/>
                  <span className="text-text-secondary text-xs">{plan.durationDays} days</span>
                </td>
                <td className="px-6 py-4 text-xs">
                  {plan.fixedAmount ? (
                    <span className="font-mono">Fixed: ${Number(plan.fixedAmount)}</span>
                  ) : (
                    <span className="font-mono">${Number(plan.minAmount)} - ${Number(plan.maxAmount)}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${plan.status === 'ACTIVE' ? 'bg-brand/10 text-brand' : 'bg-rose-500/10 text-rose-500'}`}>
                    {plan.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleVisibility(plan)}>
                    {plan.visibility ? <CheckCircle2 className="text-brand" size={18}/> : <XCircle className="text-text-secondary" size={18}/>}
                  </button>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openModal(plan)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-text-secondary">
                  No plans configured. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-card border border-border/80 p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">{editingPlan ? 'Edit Plan' : 'Create Plan'}</h2>
            
            <form onSubmit={handleSave} className="space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-secondary mb-1">Plan Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Badge (e.g. Most Popular)</label>
                  <input value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Daily ROI (%)</label>
                  <input required type="number" step="0.0001" value={formData.dailyRoi} onChange={e => setFormData({...formData, dailyRoi: Number(e.target.value)})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Duration (Days)</label>
                  <input required type="number" value={formData.durationDays} onChange={e => setFormData({...formData, durationDays: Number(e.target.value)})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Min Amount ($)</label>
                  <input required type="number" value={formData.minAmount} onChange={e => setFormData({...formData, minAmount: Number(e.target.value)})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Max Amount ($)</label>
                  <input required type="number" value={formData.maxAmount} onChange={e => setFormData({...formData, maxAmount: Number(e.target.value)})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Fixed Amount ($) - Optional</label>
                  <input type="number" value={formData.fixedAmount} onChange={e => setFormData({...formData, fixedAmount: e.target.value})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand" placeholder="Leave empty for range" />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Display Order</label>
                  <input required type="number" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: Number(e.target.value)})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Gradient Color (Hex)</label>
                  <input required type="text" value={formData.gradientColor} onChange={e => setFormData({...formData, gradientColor: e.target.value})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Icon Name (Lucide string)</label>
                  <input required type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand" />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand h-20" />
              </div>

              <div>
                <label className="block text-text-secondary mb-1">Features/Benefits (One per line)</label>
                <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-bg-base border border-border/50 rounded-xl p-3 text-white outline-none focus:border-brand h-24" placeholder="Dedicated Account Manager\nPriority Support\nCapital Protection" />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-border/50 text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl bg-brand text-black font-bold hover:bg-brand-hover transition-colors flex items-center gap-2">
                  {loading ? 'Saving...' : <><Save size={16} /> Save Plan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
