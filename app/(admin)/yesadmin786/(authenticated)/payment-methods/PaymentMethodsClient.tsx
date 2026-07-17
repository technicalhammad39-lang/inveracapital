'use client';

import React, { useState } from 'react';
import { CreditCard, Plus, Pause, Play, Trash2 } from 'lucide-react';
import { createPaymentMethod, togglePaymentMethodStatus, deletePaymentMethod } from './actions';
import { useCurrency } from '@/components/CurrencyProvider';

export default function PaymentMethodsClient({ methods }: { methods: any[] }) {
  const { formatCurrency } = useCurrency();
  const [activeMethods, setActiveMethods] = useState(methods);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CRYPTO',
    currency: 'USDT',
    address: '',
    network: '',
    instructions: '',
    minDeposit: 10,
    maxDeposit: 100000,
    processingTime: 'Instant',
    isActive: true
  });

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setIsProcessing(id);
    const res = await togglePaymentMethodStatus(id, currentStatus);
    if (res.success) {
      setActiveMethods(activeMethods.map(m => m.id === id ? { ...m, isActive: res.newStatus } : m));
    }
    setIsProcessing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    setIsProcessing(id);
    const res = await deletePaymentMethod(id);
    if (res.success) {
      setActiveMethods(activeMethods.filter(m => m.id !== id));
    }
    setIsProcessing(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing('create');
    const res = await createPaymentMethod(formData);
    if (res.success) {
      setActiveMethods([...activeMethods, res.pm]);
      setCreateModalOpen(false);
      setFormData({ name: '', type: 'CRYPTO', currency: 'USDT', address: '', network: '', instructions: '', minDeposit: 10, maxDeposit: 100000, processingTime: 'Instant', isActive: true });
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
            <CreditCard className="text-brand" /> Payment Methods
          </h2>
          <p className="text-text-secondary text-sm">Manage deposit methods, crypto wallets, and bank details.</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-brand text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-hover transition-colors"
        >
          <Plus size={18} /> Add Method
        </button>
      </div>

      <div className="bg-bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-bg-base/40 text-text-secondary uppercase text-[10px] tracking-wider border-b border-border/50">
              <tr>
                <th className="px-6 py-4">Method Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Currency / Network</th>
                <th className="px-6 py-4">Limits</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {activeMethods.map((pm) => (
                <tr key={pm.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{pm.name}</td>
                  <td className="px-6 py-4 text-text-secondary">{pm.type}</td>
                  <td className="px-6 py-4 text-text-secondary">
                    {pm.currency} {pm.network && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded ml-1">{pm.network}</span>}
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-xs">
                    {formatCurrency(pm.minDeposit)} - {formatCurrency(pm.maxDeposit)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      pm.isActive ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {pm.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => handleToggle(pm.id, pm.isActive)}
                      disabled={isProcessing === pm.id}
                      className="text-text-secondary hover:text-white transition-colors disabled:opacity-50"
                    >
                      {pm.isActive ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(pm.id)}
                      disabled={isProcessing === pm.id}
                      className="text-text-secondary hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {activeMethods.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                    No payment methods configured.
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
          <div className="bg-bg-base border border-border/50 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">Add Payment Method</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-secondary uppercase mb-1">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. USDT TRC20" className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary uppercase mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none">
                    <option value="CRYPTO">CRYPTO</option>
                    <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-secondary uppercase mb-1">Currency Symbol</label>
                  <input required type="text" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} placeholder="USDT, BTC, USD" className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary uppercase mb-1">Network (Optional)</label>
                  <input type="text" value={formData.network} onChange={e => setFormData({...formData, network: e.target.value})} placeholder="TRC20, ERC20" className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-secondary uppercase mb-1">Address / Account Info</label>
                <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Wallet address or Bank IBAN" className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white font-mono text-xs focus:border-brand focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-secondary uppercase mb-1">Min Deposit</label>
                  <input required type="number" step="1" value={formData.minDeposit} onChange={e => setFormData({...formData, minDeposit: Number(e.target.value)})} className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary uppercase mb-1">Max Deposit</label>
                  <input required type="number" step="1" value={formData.maxDeposit} onChange={e => setFormData({...formData, maxDeposit: Number(e.target.value)})} className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-secondary uppercase mb-1">Payment Instructions</label>
                <textarea value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} placeholder="Send exactly the requested amount..." className="w-full bg-bg-card border border-border/50 rounded-lg p-3 text-white focus:border-brand focus:outline-none" rows={3}></textarea>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="flex-1 py-3 border border-border/50 text-white rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={isProcessing === 'create'} className="flex-1 py-3 bg-brand text-black font-bold rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50">Create Method</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
