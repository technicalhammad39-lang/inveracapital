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

import { buyLotteryTicket } from '@/app/actions/lotteryActions';

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
      const res = await buyLotteryTicket(activePool.id);
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

        {/* Centerpiece Prize pool display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-brand/15 via-bg-card to-bg-base p-6 rounded-3xl lg:col-span-2 relative overflow-hidden flex flex-col justify-between border border-brand/20 min-h-[380px]"
          style={{ boxShadow: `0 10px 40px -10px ${activePool.glow}` }}
        >
          {/* Glowing background node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
          
          {/* Floating gift icons background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Gift size={30} className="absolute top-[10%] left-[8%] text-brand/8 rotate-12" />
            <Gift size={22} className="absolute top-[20%] right-[12%] text-brand/6 -rotate-12" />
            <Gift size={40} className="absolute bottom-[15%] left-[15%] text-brand/5 rotate-45" />
            <Gift size={18} className="absolute top-[60%] right-[8%] text-brand/7 -rotate-6" />
            <Gift size={26} className="absolute bottom-[35%] right-[30%] text-brand/4 rotate-20" />
            <Gift size={20} className="absolute top-[40%] left-[40%] text-brand/5 -rotate-30" />
            <Gift size={35} className="absolute bottom-[8%] right-[15%] text-brand/6 rotate-15" />
          </div>

          {/* Large animated gift icon + prize */}
          <div className="my-6 space-y-3 relative z-10 text-center flex flex-col items-center">
            <div className="relative">
              <Gift size={60} className="text-brand animate-bounce" strokeWidth={1.5} />
              <div className="absolute inset-0 blur-xl bg-brand/20 rounded-full" />
            </div>
            <span className="text-[11px] text-text-secondary font-bold uppercase tracking-widest block">Grand Prize Pool Payout</span>
            <div className="text-5xl md:text-7xl font-black text-brand glow-text tracking-tight">
              {formatCurrency(activePool.prize)}
            </div>
          </div>

          <div className="w-full space-y-5 z-10">
            {/* Prize distribution Premium Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-[#ffffff] to-[#e6fcf0] p-3 rounded-2xl text-center flex flex-col items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-2 border-white scale-105 z-10 relative">
                <span className="text-[9px] text-black/60 uppercase font-extrabold tracking-widest block mb-0.5">1st Place (60%)</span>
                <span className="text-sm font-black text-black">{formatCurrency(activePool.prize * 0.60)}</span>
                <div className="absolute -top-2.5 bg-brand text-black text-[8px] font-extrabold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                  Grand
                </div>
              </div>
              <div className="bg-gradient-to-br from-white/90 to-white/70 p-3 rounded-2xl text-center flex flex-col items-center justify-center border border-white/40 shadow-lg">
                <span className="text-[9px] text-black/50 uppercase font-extrabold tracking-widest block mb-0.5">2nd Place (25%)</span>
                <span className="text-xs font-black text-black/80">{formatCurrency(activePool.prize * 0.25)}</span>
              </div>
              <div className="bg-gradient-to-br from-white/90 to-white/70 p-3 rounded-2xl text-center flex flex-col items-center justify-center border border-white/40 shadow-lg">
                <span className="text-[9px] text-black/50 uppercase font-extrabold tracking-widest block mb-0.5">3rd Place (15%)</span>
                <span className="text-xs font-black text-black/80">{formatCurrency(activePool.prize * 0.15)}</span>
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
                  className="bg-brand h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${(activePool.participants / activePool.maxParticipants) * 100}%` }}
                />
              </div>
            </div>

            <button 
              onClick={handleBuyTicket}
              className="w-full bg-brand text-black font-extrabold text-sm py-4 rounded-2xl hover:bg-brand-hover shadow-[0_0_20px_rgba(0,255,136,0.35)] transition-all flex items-center justify-center gap-2.5 uppercase tracking-wider"
            >
              <Ticket size={18} strokeWidth={2.5} /> Purchase Ticket — {formatCurrency(activePool.fee)}
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
