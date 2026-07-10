'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
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

export default function LotteryPage() {
  const { formatCurrency } = useCurrency();
  const [selectedPool, setSelectedPool] = useState<string>('mega');
  
  // Buying animation states
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'idle' | 'rolling' | 'success'>('idle');
  const [generatedTicket, setGeneratedTicket] = useState('');
  
  const [myTickets, setMyTickets] = useState([
    { id: 'TKT-841921', pool: 'Mega Weekly', date: 'Today, 10:00 AM' },
    { id: 'TKT-842922', pool: 'Mega Weekly', date: 'Yesterday, 14:15 PM' }
  ]);

  const activePool = pools.find(p => p.id === selectedPool) || pools[1];

  const handleBuyTicket = () => {
    setPurchasing(true);
    setPurchaseStep('rolling');
    
    // Simulate slot-rolling generation
    setTimeout(() => {
      const tktCode = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedTicket(tktCode);
      setPurchaseStep('success');
      
      // Update my tickets list
      setMyTickets(prev => [
        { id: tktCode, pool: activePool.name.replace(' Draw', ''), date: 'Just now' },
        ...prev
      ]);
    }, 2000);
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
                  className={`p-5 rounded-2xl cursor-pointer transition-all border-l-4 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-white via-emerald-50 to-brand border-l-brand text-slate-900 shadow-xl border-y-border border-r-border border-y border-r' 
                      : 'bg-bg-card/40 border-l-border/85 border-y border-r border-y-border/80 border-r-border/80 hover:border-brand/40 text-white hover:bg-bg-card-hover'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-extrabold text-sm ${isSelected ? 'text-slate-900' : 'text-white'}`}>{p.name}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                      isSelected ? 'bg-slate-900 text-white border-slate-800' : 'bg-brand/10 border-brand/20 text-brand'
                    }`}>
                      Entry: {formatCurrency(p.fee)}
                    </span>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className={`text-[10px] ${isSelected ? 'text-slate-600' : 'text-text-secondary'} block uppercase font-bold`}>Prize Pool</span>
                        <p className={`text-xl font-extrabold ${isSelected ? 'text-slate-900' : 'text-white'}`}>{formatCurrency(p.prize)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] ${isSelected ? 'text-slate-600' : 'text-text-secondary'} block uppercase font-bold`}>Tickets Sold</span>
                        <p className={`text-xs font-extrabold ${isSelected ? 'text-slate-900' : 'text-white'}`}>{p.participants} / {p.maxParticipants}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className={`w-full ${isSelected ? 'bg-slate-900/10' : 'bg-bg-base'} h-1.5 rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full rounded-full ${isSelected ? 'bg-slate-900' : 'bg-brand'}`} 
                          style={{ width: `${progressPct}%` }} 
                        />
                      </div>
                    </div>

                    <button 
                      className={`w-full text-center font-extrabold text-[10px] py-2 rounded-xl transition-all uppercase tracking-wider ${
                        isSelected ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-brand text-black hover:bg-brand-hover'
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

        {/* Centerpiece Prize pool display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-brand/15 via-bg-card to-bg-base p-6 rounded-3xl lg:col-span-2 relative overflow-hidden flex flex-col justify-between border border-brand/20 min-h-[380px]"
          style={{ boxShadow: `0 10px 40px -10px ${activePool.glow}` }}
        >
          {/* Glowing background nodes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between z-10 w-full">
            <div className="flex items-center gap-2 bg-brand/10 border border-brand/20 px-3 py-1 rounded-full text-brand text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles size={11} /> {activePool.name}
            </div>
            <span className="text-[10px] text-brand border border-brand/20 bg-brand/5 px-2.5 py-1 rounded-lg font-bold">
              Entry: {formatCurrency(activePool.fee)}
            </span>
          </div>

          <div className="my-6 space-y-2 relative z-10 text-center">
            <span className="text-[11px] text-text-secondary font-bold uppercase tracking-widest block">Grand Prize Pool Payout</span>
            <div className="text-5xl md:text-7xl font-black text-brand glow-text tracking-tight animate-pulse-slow">
              {formatCurrency(activePool.prize)}
            </div>
          </div>

          <div className="w-full space-y-5 z-10">
            {/* Prize distribution, Estimated payout */}
            <div className="grid grid-cols-3 gap-4 bg-bg-base/60 border border-border/80 p-4 rounded-2xl text-center text-xs">
              <div>
                <span className="text-[9px] text-text-secondary uppercase font-bold block mb-1">1st Place (60%)</span>
                <span className="font-extrabold text-brand">{formatCurrency(activePool.prize * 0.60)}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-secondary uppercase font-bold block mb-1">2nd Place (25%)</span>
                <span className="font-extrabold text-white">{formatCurrency(activePool.prize * 0.25)}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-secondary uppercase font-bold block mb-1">3rd Place (15%)</span>
                <span className="font-extrabold text-white">{formatCurrency(activePool.prize * 0.15)}</span>
              </div>
            </div>

            {/* Slots and buy */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-text-secondary font-semibold">
                <span>Sold Tickets Progress</span>
                <span className="text-white">{activePool.participants} / {activePool.maxParticipants} slots filled</span>
              </div>
              <div className="w-full bg-bg-base h-2 rounded-full overflow-hidden border border-border/55">
                <div 
                  className="bg-brand h-full rounded-full transition-all duration-1000 animate-pulse-slow" 
                  style={{ width: `${(activePool.participants / activePool.maxParticipants) * 100}%` }}
                />
              </div>
            </div>

            <button 
              onClick={handleBuyTicket}
              className="w-full bg-brand text-black font-extrabold text-sm py-4 rounded-2xl hover:bg-brand-hover shadow-[0_0_20px_rgba(0,255,136,0.35)] transition-all flex items-center justify-center gap-2.5 uppercase tracking-wider"
            >
              <Ticket size={18} strokeWidth={2.5} /> Purchase Pool Payout Ticket
            </button>
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
              {myTickets.map((tkt, idx) => (
                <div key={tkt.id} className="flex justify-between items-center bg-bg-base/30 border border-border/80 p-3.5 rounded-xl">
                  <div>
                    <div className="text-brand text-xs font-bold font-mono tracking-widest">{tkt.id}</div>
                    <div className="text-[10px] text-text-secondary mt-0.5">{tkt.pool} Draw • {tkt.date}</div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-brand/10 border border-brand/20 text-brand rounded-full uppercase">
                    Active
                  </span>
                </div>
              ))}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Sarah Conner', amount: 50000, pool: 'Mega Weekly', date: 'Jul 03, 2026', ticket: 'TKT-890451', color: '#00ff88', avatar: 'SC' },
              { name: 'Bruce Wayne', amount: 5000, pool: 'Daily Speed', date: 'Jul 09, 2026', ticket: 'TKT-104812', color: '#3b82f6', avatar: 'BW' },
              { name: 'Clark Kent', amount: 250000, pool: 'VIP Monthly', date: 'Jun 30, 2026', ticket: 'TKT-001842', color: '#a855f7', avatar: 'CK' }
            ].map((w, idx) => (
              <div 
                key={w.name}
                className="bg-bg-card/40 border border-border/80 p-4 rounded-xl flex flex-col justify-between relative group hover:border-brand/40 transition-colors gap-4"
              >
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: w.color }} />
                
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
                    <span className="text-text-secondary font-semibold">{w.date}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/30 pt-2 mt-1">
                    <span className="text-[10px] text-text-secondary font-bold uppercase">Payout</span>
                    <p className="text-xs font-extrabold text-brand">{formatCurrency(w.amount)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ticket Purchase Rolling Overlay */}
      <AnimatePresence>
        {purchasing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-bg-base border border-border/80 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              {purchaseStep === 'rolling' ? (
                <div className="py-12 space-y-6">
                  {/* Rolling counter effect */}
                  <div className="w-16 h-16 border-4 border-t-brand border-border/40 rounded-full animate-spin mx-auto flex items-center justify-center" />
                  
                  <div>
                    <h3 className="text-md font-bold text-white">Minting Ticket Ledger</h3>
                    <p className="text-xs text-text-secondary mt-1">Interlocking contract addresses inside pool.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-brand/10 border border-brand/20 text-brand rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle size={28} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-white">Purchase Approved</h3>
                    <p className="text-xs text-text-secondary mt-1">Funds of {formatCurrency(activePool.fee)} deducted from Main wallet.</p>
                  </div>

                  <div className="bg-bg-card/40 border border-border/80 p-4 rounded-xl space-y-2">
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-bold">Your Ticket Code</span>
                    <span className="text-2xl font-mono font-extrabold text-brand tracking-widest block">{generatedTicket}</span>
                  </div>

                  <button 
                    onClick={closePurchaseModal}
                    className="w-full bg-brand text-black font-extrabold text-xs py-3 rounded-xl hover:bg-brand-hover transition-all uppercase tracking-wider"
                  >
                    Confirm Receipt
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
