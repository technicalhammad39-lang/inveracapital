// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { PremiumEmptyState } from '@/components/PremiumEmptyState';
import { 
  Ticket, 
  Trophy, 
  Users, 
  Clock, 
  Sparkles, 
  Coins, 
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Gift
} from 'lucide-react';

const pools = [
  {
    id: 'daily',
    name: 'Daily Speed Draw',
    prize: 5000,
    fee: 10,
    participants: 142,
    maxParticipants: 300,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.1)'
  },
  {
    id: 'mega',
    name: 'Mega Weekly Draw',
    prize: 50000,
    fee: 50,
    participants: 1245,
    maxParticipants: 5000,
    color: '#00ff88',
    glow: 'rgba(0,255,136,0.15)'
  },
  {
    id: 'vip',
    name: 'VIP Monthly Draw',
    prize: 250000,
    fee: 250,
    participants: 89,
    maxParticipants: 1000,
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.1)'
  }
];

import { purchaseTicket } from '@/app/actions/lotteryActions';

export default function LotteryClient({ dbLotteries, dbEntries, dbWinners }: { dbLotteries?: any, dbEntries?: any, dbWinners?: any }) {
  const { formatCurrency } = useCurrency();
  
  const pools = dbLotteries && dbLotteries.length > 0 ? dbLotteries : [
    {
      id: 'daily',
      name: 'Daily Speed Draw',
      prize: 5000,
      fee: 10,
      participants: 142,
      maxParticipants: 300,
      color: '#3b82f6',
      glow: 'rgba(59,130,246,0.1)'
    }
  ];

  const [selectedPool, setSelectedPool] = useState<string>(pools[0]?.id || 'daily');
  
  // Buying animation states
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'idle' | 'rolling' | 'success'>('idle');
  const [generatedTicket, setGeneratedTicket] = useState('');
  
  const [myTickets, setMyTickets] = useState(dbEntries || []);
  const winners = dbWinners || [];

  const activePool = pools.find((p: any) => p.id === selectedPool) || pools[0];

  const handleBuyTicket = async () => {
    setPurchasing(true);
    setPurchaseStep('rolling');
    
    try {
      const res = await purchaseTicket(activePool.id);
      if (res.success && res.ticket) {
        setGeneratedTicket(res.ticket.ticketNum);
        setPurchaseStep('success');
        
        // Update my tickets list
        setMyTickets((prev: any) => [
          { id: res.ticket.ticketNum, pool: activePool.name.replace(' Draw', ''), date: 'Just now', status: 'OPEN' },
          ...prev
        ]);
      } else {
        closePurchaseModal();
        alert('Failed to purchase ticket: ' + (res.error || 'Unknown error'));
      }
    } catch (err) {
      closePurchaseModal();
      console.error(err);
    }
  };

  const closePurchaseModal = () => {
    setPurchasing(false);
    setPurchaseStep('idle');
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
            Mega Lottery
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Join active contract draws to claim institutional bonus prize pools.</p>
        </div>
      </div>

      {/* Hero Visualization & Active Draw detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Draw Select list (left panel) */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs text-text-secondary uppercase tracking-wider pl-1">Select Active Draw</h3>
          <div className="space-y-3">
            {pools.map((p) => {
              const isSelected = selectedPool === p.id;
              const progressPct = (p.participants / p.maxParticipants) * 100;
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPool(p.id)}
                  className={`p-5 rounded-[1.5rem] cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-[#ffffff] to-[#e6fcf0] text-black shadow-[0_20px_40px_rgba(0,255,136,0.15)] scale-[1.02]' 
                      : 'bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-extrabold text-sm ${isSelected ? 'text-black' : 'text-white'}`}>{p.name}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      isSelected ? 'bg-black/5 text-black/60' : 'bg-brand/10 border-brand/20 text-brand border'
                    }`}>
                      Entry: {formatCurrency(p.fee)}
                    </span>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className={`text-[10px] block uppercase font-bold ${isSelected ? 'text-black/60' : 'text-text-secondary'}`}>Prize Pool</span>
                        <p className={`text-xl font-extrabold ${isSelected ? 'text-black' : 'text-white'}`}>{formatCurrency(p.prize)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] block uppercase font-bold ${isSelected ? 'text-black/60' : 'text-text-secondary'}`}>Tickets Sold</span>
                        <p className={`text-xs font-extrabold ${isSelected ? 'text-black' : 'text-white'}`}>{p.participants} / {p.maxParticipants}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-black/10' : 'bg-bg-base'}`}>
                        <div 
                          className="h-full rounded-full bg-brand" 
                          style={{ width: `${progressPct}%` }} 
                        />
                      </div>
                    </div>

                    <button 
                      className={`w-full text-center font-extrabold text-[10px] py-2 rounded-xl transition-all uppercase tracking-wider ${
                        isSelected ? 'bg-black text-white hover:bg-gray-900 shadow-xl' : 'bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20'
                      }`}
                    >
                      Join Draw
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Promotional Banner Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg-card rounded-3xl lg:col-span-2 relative overflow-hidden flex flex-col justify-between border border-border min-h-[380px] group"
          style={{ boxShadow: `0 10px 40px -10px ${activePool.glow || 'rgba(0,0,0,0)'}` }}
        >
          {activePool.promoBanner ? (
            <img 
              src={activePool.promoBanner} 
              alt={activePool.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-bg-base">
               <Gift size={64} className="text-brand/20 animate-pulse" />
            </div>
          )}

          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${activePool.featured ? 'bg-yellow-500 text-black' : 'bg-brand text-black'}`}>
              {activePool.status}
            </span>
            {activePool.featured && (
              <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30">
                Premium Draw
              </span>
            )}
          </div>

          {/* Bottom Content Area */}
          <div className="relative z-10 p-8 mt-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 w-full">
              
              {/* Left Side: Info */}
              <div className="flex-1 space-y-2">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl">{activePool.name}</h2>
                <p className="text-text-secondary text-sm max-w-lg leading-relaxed line-clamp-2">
                  {activePool.description || 'Join this exclusive contract draw to claim institutional bonus prize pools. Secure your ticket today.'}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Trophy size={16} className="text-brand" />
                    <span className="text-white">{formatCurrency(activePool.prize)} Pool</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Users size={16} className="text-brand" />
                    <span className="text-white">{activePool.participants} / {activePool.maxParticipants} Sold</span>
                  </div>
                  {activePool.drawDate && (
                    <div className="flex items-center gap-1.5 text-sm font-bold">
                      <Clock size={16} className="text-brand" />
                      <span className="text-white">Draw: {new Date(activePool.drawDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: CTA */}
              <div className="w-full md:w-auto shrink-0 flex flex-col items-center md:items-end gap-3">
                <div className="text-right w-full">
                  <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold mb-1">Entry Fee</div>
                  <div className="text-2xl font-black text-brand drop-shadow-md">{formatCurrency(activePool.fee)}</div>
                </div>
                <button 
                  onClick={handleBuyTicket}
                  className="w-full md:w-56 bg-brand text-black font-extrabold text-sm py-4 rounded-xl hover:bg-brand-hover shadow-[0_0_20px_rgba(0,255,136,0.35)] transition-all flex items-center justify-center gap-2.5 uppercase tracking-wider hover:scale-105 active:scale-95"
                >
                  <Ticket size={18} strokeWidth={2.5} /> Join Draw
                </button>
              </div>
              
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tickets & Past Winners Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Tickets List */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-border/60">
              <Ticket size={16} className="text-brand" /> My Active Entries
            </h3>
            
            <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {myTickets.length === 0 ? (
                <PremiumEmptyState 
                  title="No Active Entries"
                  description="Purchase a ticket to join the next draw."
                  icon={Ticket}
                  className="min-h-[160px] p-4"
                />
              ) : (
                myTickets.map((tkt: any, idx: number) => (
                  <div key={tkt.id} className="flex justify-between items-center bg-bg-base/30 border border-border/80 p-3.5 rounded-xl">
                    <div>
                      <div className="text-brand text-xs font-bold font-mono tracking-widest">{tkt.id}</div>
                      <div className="text-[10px] text-text-secondary mt-0.5">{tkt.pool} Draw • {tkt.date}</div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-brand/10 border border-brand/20 text-brand rounded-full uppercase">
                      Active
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-bg-base/30 border border-border/50 p-3 rounded-xl mt-4 text-[10px] text-text-secondary leading-relaxed">
            🎟️ Entry settlements clear instantly from Main Balance. Check system logs for winners notifications.
          </div>
        </motion.div>

        {/* Recent Winners Cards list */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-2xl lg:col-span-2"
        >
          <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-border/60 mb-4">
            <Trophy size={16} className="text-brand" /> Draw Payout Cabinet (Winners)
          </h3>
          {winners.length === 0 ? (
            <PremiumEmptyState 
              title="No Winners Yet"
              description="Be the first to claim the grand prize in the active draws."
              icon={Trophy}
              className="min-h-[220px]"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {winners.map((w: any) => (
                <div 
                  key={w.ticket}
                  className="bg-bg-card/40 border border-border/80 p-4 rounded-xl flex flex-col justify-between relative group hover:border-brand/40 transition-colors gap-4"
                >
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: w.color || '#00ff88' }} />
                  
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs border border-border">
                      {w.avatar}
                    </div>
                    <div>
                      <span className="text-[10px] text-text-secondary font-bold block uppercase tracking-wider">{w.pool}</span>
                      <span className="text-xs font-bold text-white block mt-0.5">{w.name}</span>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-text-secondary">Ticket</span>
                      <span className="font-mono text-white font-bold">{w.ticket}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-text-secondary">Date</span>
                      <span className="text-white font-bold">{w.date}</span>
                    </div>
                  </div>

                  <div className="mt-1 pt-3 border-t border-border/40 flex justify-between items-center">
                    <span className="text-[10px] text-brand uppercase tracking-widest font-extrabold">Payout</span>
                    <span className="text-sm font-black text-brand glow-text">{formatCurrency(w.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Ticket Purchase Rolling Overlay */}
      <AnimatePresence>
        {purchasing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-b from-bg-card to-bg-base border border-white/10 rounded-3xl p-8 max-w-sm w-full relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
            >
              {/* Premium Glow effect */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand/20 blur-[80px] rounded-full pointer-events-none" />
              
              {purchaseStep === 'rolling' ? (
                <div className="py-12 space-y-8 text-center relative z-10">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-t-brand border-white/10 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Ticket size={24} className="text-brand animate-pulse" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">Minting Receipt</h3>
                    <p className="text-xs text-text-secondary mt-2">Securing your allocation on the ledger...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 relative z-10">
                  <div className="w-16 h-16 bg-brand/10 border border-brand/20 text-brand rounded-full flex items-center justify-center mx-auto animate-[bounce_1s_ease-in-out_1]">
                    <CheckCircle size={32} strokeWidth={2.5} />
                  </div>
                  
                  <div className="text-center border-b border-dashed border-white/20 pb-6">
                    <h3 className="text-2xl font-black text-white tracking-tight">Payment Successful</h3>
                    <p className="text-xs text-text-secondary mt-1">Amount deducted from Main Wallet</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary">Amount Paid</span>
                      <span className="text-white font-bold">{formatCurrency(activePool.fee)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary">Draw Pool</span>
                      <span className="text-white font-bold">{activePool.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary">Draw Date</span>
                      <span className="text-white font-bold">{activePool.drawDate ? new Date(activePool.drawDate).toLocaleDateString() : 'TBA'}</span>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-brand/30 p-5 rounded-2xl space-y-2 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/10 transition-colors" />
                    <span className="text-[10px] text-brand uppercase tracking-[0.2em] block font-black relative z-10">Official Ticket Code</span>
                    <span className="text-2xl font-mono font-black text-white tracking-widest block relative z-10">{generatedTicket}</span>
                  </div>

                  <button 
                    onClick={closePurchaseModal}
                    className="w-full bg-white text-black hover:bg-gray-200 font-extrabold text-sm py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
