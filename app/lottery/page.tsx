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

// Ticking Timer Component
function CountdownTimer({ initialSeconds }: { initialSeconds: number }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="flex gap-2 justify-center">
      {days > 0 && (
        <div className="bg-bg-base px-2.5 py-1.5 rounded-xl border border-border/80 min-w-[50px]">
          <div className="text-sm font-extrabold text-white">{pad(days)}</div>
          <div className="text-[8px] text-text-secondary uppercase font-bold tracking-wider">Days</div>
        </div>
      )}
      <div className="bg-bg-base px-2.5 py-1.5 rounded-xl border border-border/80 min-w-[50px]">
        <div className="text-sm font-extrabold text-white">{pad(hours)}</div>
        <div className="text-[8px] text-text-secondary uppercase font-bold tracking-wider">Hours</div>
      </div>
      <div className="bg-bg-base px-2.5 py-1.5 rounded-xl border border-border/80 min-w-[50px]">
        <div className="text-sm font-extrabold text-white">{pad(minutes)}</div>
        <div className="text-[8px] text-text-secondary uppercase font-bold tracking-wider">Mins</div>
      </div>
      <div className="bg-bg-base px-2.5 py-1.5 rounded-xl border border-border/80 min-w-[50px]">
        <div className="text-sm font-extrabold text-brand glow-text">{pad(seconds)}</div>
        <div className="text-[8px] text-text-secondary uppercase font-bold tracking-wider">Secs</div>
      </div>
    </div>
  );
}

const pools = [
  {
    id: 'daily',
    name: 'Daily Speed Draw',
    prize: 5000,
    fee: 10,
    participants: 142,
    maxParticipants: 300,
    seconds: 13502, // 3h 45m
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
    seconds: 225902, // 2d 14h 45m
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
    seconds: 1577522, // 18d 6h 12m
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
            {pools.map((p) => (
              <div 
                key={p.id}
                onClick={() => setSelectedPool(p.id)}
                className={`glass p-4 rounded-2xl cursor-pointer transition-all border ${
                  selectedPool === p.id 
                    ? 'border-brand bg-brand/5 shadow-[0_0_15px_rgba(0,255,136,0.1)]' 
                    : 'border-border/80 bg-bg-base/30 hover:border-brand/40'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-white">{p.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-border" style={{ color: p.color }}>
                    Fee: {formatCurrency(p.fee)}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs text-text-secondary">Grand Prize Pool</span>
                    <p className="text-lg font-extrabold text-white" style={{ textShadow: `0 0 10px ${p.glow}` }}>{formatCurrency(p.prize)}</p>
                  </div>
                  <span className="text-[10px] text-text-secondary font-medium">
                    {p.participants} / {p.maxParticipants} Sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centerpiece Prize pool display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-6 rounded-3xl lg:col-span-2 relative overflow-hidden flex flex-col items-center justify-between text-center border-brand/20 min-h-[350px]"
          style={{ boxShadow: `0 10px 40px -10px ${activePool.glow}` }}
        >
          {/* Glowing visualization of Chest/Trophy */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-brand/5 blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 bg-brand/10 border border-brand/20 px-3 py-1 rounded-full text-brand text-[10px] font-bold uppercase tracking-wider mt-2">
            <Sparkles size={11} /> {activePool.name}
          </div>

          <div className="my-6 space-y-2 relative z-10">
            <span className="text-xs text-text-secondary font-bold uppercase tracking-wider block">Estimated Payout Pool</span>
            <div className="text-5xl md:text-6.5xl font-black text-brand glow-text tracking-tight animate-pulse-slow">
              {formatCurrency(activePool.prize)}
            </div>
          </div>

          <div className="w-full max-w-sm space-y-5 pb-2 relative z-10">
            {/* Dynamic countdown clock */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <Clock size={12} /> Remaining Time to Draw
              </span>
              <CountdownTimer key={activePool.id} initialSeconds={activePool.seconds} />
            </div>

            {/* Slots and buy */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-text-secondary font-semibold">
                <span>Sold Tickets Pool</span>
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
              className="w-full bg-brand text-black font-extrabold text-sm py-4 rounded-2xl hover:bg-brand-hover shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Ticket size={18} strokeWidth={2.5} /> Acquire Payout Ticket
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
            <Trophy size={16} className="text-brand" /> Draw Payout Cabinet
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Sarah Conner', amount: 50000, pool: 'Mega Weekly', date: 'Jul 03, 2026', ticket: 'TKT-890451', color: '#00ff88' },
              { name: 'Bruce Wayne', amount: 5000, pool: 'Daily Speed', date: 'Jul 09, 2026', ticket: 'TKT-104812', color: '#3b82f6' },
              { name: 'Clark Kent', amount: 250000, pool: 'VIP Monthly', date: 'Jun 30, 2026', ticket: 'TKT-001842', color: '#a855f7' }
            ].map((w, idx) => (
              <div 
                key={w.name}
                className="bg-bg-base/20 border border-border/80 p-4 rounded-xl flex flex-col justify-between relative group hover:border-brand/40 transition-colors"
              >
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: w.color }} />
                
                <div>
                  <span className="text-[10px] text-text-secondary font-bold block uppercase tracking-wider">{w.pool}</span>
                  <span className="text-md font-bold text-white block mt-1">{w.name}</span>
                  <span className="text-[10px] text-text-secondary font-mono block mt-0.5">{w.ticket}</span>
                </div>
                
                <div className="border-t border-border/40 mt-4 pt-3 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] text-text-secondary">Payout Realized</span>
                    <p className="text-sm font-extrabold text-brand">{formatCurrency(w.amount)}</p>
                  </div>
                  <span className="text-[8px] text-text-secondary/80 font-semibold">{w.date}</span>
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
