'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Calendar, Gift, Users, Copy } from 'lucide-react';
import { createLottery, updateLottery, deleteLottery } from '@/app/actions/adminLotteryActions';

export default function LotteryAdminClient({ initialLotteries }: { initialLotteries: any[] }) {
  const [lotteries, setLotteries] = useState(initialLotteries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    prizePool: '0',
    entryFee: '0',
    maxParticipants: '1000',
    status: 'DRAFT',
    description: '',
    rules: '',
    winnerDistribution: '',
    startDate: '',
    endDate: '',
    drawDate: '',
    featured: false,
    bannerImage: '',
    promoBanner: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (lottery: any = null) => {
    if (lottery) {
      setEditingId(lottery.id);
      setFormData({
        name: lottery.name,
        prizePool: lottery.prizePool.toString(),
        entryFee: lottery.entryFee.toString(),
        maxParticipants: lottery.maxParticipants.toString(),
        status: lottery.status,
        description: lottery.description || '',
        rules: lottery.rules || '',
        winnerDistribution: lottery.winnerDistribution || '',
        startDate: lottery.startDate ? new Date(lottery.startDate).toISOString().slice(0, 16) : '',
        endDate: lottery.endDate ? new Date(lottery.endDate).toISOString().slice(0, 16) : '',
        drawDate: lottery.drawDate ? new Date(lottery.drawDate).toISOString().slice(0, 16) : '',
        featured: lottery.featured || false,
        bannerImage: lottery.bannerImage || '',
        promoBanner: lottery.promoBanner || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', prizePool: '0', entryFee: '0', maxParticipants: '1000',
        status: 'DRAFT', description: '', rules: '', winnerDistribution: '',
        startDate: '', endDate: '', drawDate: '', featured: false,
        bannerImage: '', promoBanner: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const res = await updateLottery(editingId, formData);
        if (res.success) {
          setLotteries(lotteries.map(l => l.id === editingId ? { ...res.lottery, _count: l._count } : l));
          setIsModalOpen(false);
        } else alert(res.error);
      } else {
        const res = await createLottery(formData);
        if (res.success) {
          setLotteries([{ ...res.lottery, _count: { entries: 0, winners: 0 } }, ...lotteries]);
          setIsModalOpen(false);
        } else alert(res.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lottery?')) return;
    const res = await deleteLottery(id);
    if (res.success) {
      setLotteries(lotteries.filter(l => l.id !== id));
    } else alert(res.error);
  };

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    UPCOMING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    OPEN: 'bg-brand/10 text-brand border-brand/20',
    LIVE: 'bg-brand/10 text-brand border-brand/20',
    CLOSED: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    COMPLETED: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">All Lotteries</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-brand text-black font-semibold rounded-lg hover:bg-brand-hover transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Create Lottery
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {lotteries.map((l) => (
          <div key={l.id} className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
            {l.featured && (
              <div className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-500 text-xs font-bold px-2 py-1 rounded border border-yellow-500/30">
                FEATURED
              </div>
            )}
            <h3 className="text-lg font-bold text-white mb-1">{l.name}</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-2 py-1 rounded border ${statusColors[l.status] || statusColors.DRAFT}`}>
                {l.status}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary flex items-center gap-2"><Gift size={14}/> Prize Pool</span>
                <span className="text-brand font-bold">${Number(l.prizePool).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary flex items-center gap-2"><Tag size={14}/> Entry Fee</span>
                <span className="text-white">${Number(l.entryFee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary flex items-center gap-2"><Users size={14}/> Participants</span>
                <span className="text-white">{l._count?.entries || 0} / {l.maxParticipants}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleOpenModal(l)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => handleDelete(l.id)} className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass w-full max-w-2xl rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingId ? 'Edit Lottery' : 'Create New Lottery'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Lottery Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-dark border border-white/10 rounded-lg p-3 text-white">
                    <option value="DRAFT">DRAFT</option>
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="LIVE">LIVE</option>
                    <option value="OPEN">OPEN (Legacy)</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Prize Pool ($)</label>
                  <input type="number" step="0.01" value={formData.prizePool} onChange={(e) => setFormData({...formData, prizePool: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Entry Fee ($)</label>
                  <input type="number" step="0.01" value={formData.entryFee} onChange={(e) => setFormData({...formData, entryFee: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Max Participants</label>
                  <input type="number" value={formData.maxParticipants} onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Banner Image URL</label>
                  <input type="text" value={formData.bannerImage} onChange={(e) => setFormData({...formData, bannerImage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Promotional Banner URL</label>
                  <input type="text" value={formData.promoBanner} onChange={(e) => setFormData({...formData, promoBanner: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" placeholder="https://..." />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Start Date</label>
                  <input type="datetime-local" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">End Date</label>
                  <input type="datetime-local" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Draw Date</label>
                  <input type="datetime-local" value={formData.drawDate} onChange={(e) => setFormData({...formData, drawDate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white h-24" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand focus:ring-brand" />
                <label htmlFor="featured" className="text-white text-sm">Mark as Featured Lottery</label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-brand text-black rounded-lg hover:bg-brand-hover transition-colors font-semibold disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Lottery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
