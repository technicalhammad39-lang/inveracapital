'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Gift, 
  Plus, 
  Users, 
  Trash2,
  Trophy,
  Ticket,
  CheckCircle,
  X
} from 'lucide-react';
import clsx from 'clsx';
import { useCurrency } from '@/components/CurrencyProvider';
import { createLottery, toggleLotteryStatus, deleteLottery } from './actions';

export default function LotteryClient({ lotteries }: { lotteries: any[] }) {
  const { formatCurrency } = useCurrency();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'DAILY',
    ticketPrice: 10,
    prizePool: 5000,
    maxTickets: 1000,
    drawDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  });

  const [activeLotteries, setActiveLotteries] = useState(lotteries);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleToggle = async (lotteryId: string, currentStatus: string) => {
    setIsProcessing(lotteryId);
    const res = await toggleLotteryStatus(lotteryId, currentStatus);
    if (res.success) {
      setActiveLotteries(activeLotteries.map(l => l.id === lotteryId ? { ...l, status: res.newStatus } : l));
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(null);
  };

  const handleDelete = async (lotteryId: string) => {
    if (!confirm('Are you sure you want to delete this lottery?')) return;
    setIsProcessing(lotteryId);
    const res = await deleteLottery(lotteryId);
    if (res.success) {
      setActiveLotteries(activeLotteries.filter(l => l.id !== lotteryId));
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing('create');
    const res = await createLottery(formData);
    if (res.success) {
      setCreateModalOpen(false);
      window.location.reload(); 
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
            Lottery Management
          </h1>
          <p className="text-text-secondary text-sm font-medium">Create draws, monitor ticket sales, and distribute prizes.</p>
        </div>

        <button 
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand text-black font-extrabold text-sm rounded-xl hover:bg-brand-hover active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)]"
        >
          <Plus size={18} />
          Create Draw
        </button>
      </div>

      {/* Lottery Grid (Premium Stripe Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeLotteries.length === 0 ? (
          <div className="col-span-full py-12 text-center text-text-secondary bg-[#0a0a0b] rounded-2xl border border-white/10">
            No active lotteries found.
          </div>
        ) : activeLotteries.map((lottery, i) => {
          const totalSold = lottery._count?.entries || 0;
          const soldPercentage = Math.min(100, Math.round((totalSold / lottery.maxTickets) * 100));

          return (
            <motion.div 
              key={lottery.id}
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
                    lottery.status === 'ACTIVE' ? "bg-brand/10 text-brand border-brand/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                  )}>
                    {lottery.status}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      disabled={isProcessing === lottery.id}
                      onClick={() => handleToggle(lottery.id, lottery.status)}
                      className="p-1.5 text-text-secondary hover:text-amber-400 bg-white/5 rounded-lg border border-white/10 transition-colors disabled:opacity-50" 
                      title={lottery.status === 'ACTIVE' ? 'Complete Draw' : 'Reactivate Draw'}
                    >
                      <CheckCircle size={14} />
                    </button>
                    <button 
                      disabled={isProcessing === lottery.id}
                      onClick={() => handleDelete(lottery.id)}
                      className="p-1.5 text-text-secondary hover:text-rose-400 bg-white/5 rounded-lg border border-white/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white">{lottery.name}</h3>
                <p className="text-brand font-black text-2xl mt-1">{formatCurrency(lottery.prizePool)} Pool</p>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between relative z-10 bg-[#0a0a0b]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-xs text-text-secondary">Ticket Price</span>
                    <span className="text-sm font-semibold text-white">{formatCurrency(lottery.ticketPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-xs text-text-secondary">Draw Date</span>
                    <span className="text-xs font-semibold text-white">
                      {new Date(lottery.drawDate).toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Progress Bar for Tickets */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5"><Ticket size={14}/> Tickets Sold</span>
                      <span className="text-xs font-bold text-white">{totalSold} / {lottery.maxTickets}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-brand h-1.5 rounded-full" 
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
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
              <h2 className="text-xl font-bold text-white">Create Lottery Draw</h2>
              <button onClick={() => setCreateModalOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Lottery Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  placeholder="e.g. Mega Weekly Draw"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Ticket Price ($)</label>
                  <input 
                    required type="number" 
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({...formData, ticketPrice: Number(e.target.value)})}
                    className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Prize Pool ($)</label>
                  <input 
                    required type="number" 
                    value={formData.prizePool}
                    onChange={(e) => setFormData({...formData, prizePool: Number(e.target.value)})}
                    className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Max Tickets</label>
                  <input 
                    required type="number" 
                    value={formData.maxTickets}
                    onChange={(e) => setFormData({...formData, maxTickets: Number(e.target.value)})}
                    className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Draw Date</label>
                <input 
                  required type="datetime-local" 
                  value={formData.drawDate}
                  onChange={(e) => setFormData({...formData, drawDate: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
              <button 
                disabled={isProcessing === 'create'}
                type="submit" 
                className="w-full mt-6 py-2.5 bg-brand text-black font-extrabold text-sm rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-50"
              >
                {isProcessing === 'create' ? 'Creating...' : 'Create Draw'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
