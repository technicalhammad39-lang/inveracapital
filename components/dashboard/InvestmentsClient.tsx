'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  Shield, 
  Target, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight, 
  Calculator, 
  PieChart as PieIcon, 
  Calendar,
  Hourglass,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

import * as LucideIcons from 'lucide-react';
import { purchaseInvestmentPlan } from '@/app/actions/investmentActions';

export default function InvestmentsClient({ 
  dbPlans = [], 
  dbUserInvestments = [],
  globalAllocationData = [],
  dbWallet
}: { 
  dbPlans?: any[], 
  dbUserInvestments?: any[],
  globalAllocationData?: any[],
  dbWallet?: any
}) {
  const { formatCurrency } = useCurrency();
  
  // Map DB plans to UI plans dynamically
  const plans = dbPlans.length > 0 ? dbPlans.map((p) => {
    // Dynamically grab icon from lucide-react or fallback
    const IconComponent = (LucideIcons as any)[p.icon] || LucideIcons.Briefcase;

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      roi: Number(p.dailyRoi) * 100, // DB has 0.0125 for 1.25%
      duration: p.durationDays,
      min: Number(p.minAmount),
      max: Number(p.maxAmount),
      fixedAmount: p.fixedAmount ? Number(p.fixedAmount) : null,
      features: p.features,
      icon: IconComponent,
      color: p.gradientColor,
      theme: p.theme,
      badge: p.badge,
      popular: p.badge === 'Most Popular'
    };
  }) : [];
  
  // Tabs State
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'expired'>('active');

  // ROI Calculator & Purchase State
  const [calcAmount, setCalcAmount] = useState<number>(plans.length > 0 ? plans[0].min : 10000);
  const [calcPlan, setCalcPlan] = useState<string>(plans.length > 0 ? plans[0].id : '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'idle' | 'rolling' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedPlan = plans.find(p => p.id === calcPlan) || plans[0] || { roi: 0, duration: 0, min: 0 };
  const calculatedDaily = calcAmount * (selectedPlan.roi / 100);
  const calculatedProfit = calculatedDaily * selectedPlan.duration;
  const calculatedTotal = calcAmount + calculatedProfit;

  const handleOpenPurchase = (plan: any) => {
    setCalcPlan(plan.id);
    setCalcAmount(plan.fixedAmount || plan.min);
    setPurchaseStep('idle');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (calcAmount < selectedPlan.min || calcAmount > selectedPlan.max) {
      setErrorMsg(`Amount must be between ${selectedPlan.min} and ${selectedPlan.max}`);
      setPurchaseStep('error');
      return;
    }
    
    setIsPurchasing(true);
    setPurchaseStep('rolling');
    
    try {
      const res = await purchaseInvestmentPlan(selectedPlan.id, String(calcAmount));
      if (res.success) {
        setPurchaseStep('success');
        setTimeout(() => {
          window.location.reload(); // Hard reload to see active investments immediately
        }, 3000);
      } else {
        setErrorMsg(res.error || 'Failed to purchase plan');
        setPurchaseStep('error');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unknown error occurred');
      setPurchaseStep('error');
    } finally {
      setIsPurchasing(false);
    }
  };

  // Global Recharts Allocation Data
  const totalGlobalCapital = globalAllocationData.reduce((sum, item) => sum + Number(item.value), 0);
  // Default to empty array, don't show fake values. Let it be empty if 0.
  const allocationData = globalAllocationData;

  // Recharts Analytics Yield Data
  const yieldData = [
    { name: 'Mon', yield: 120 },
    { name: 'Tue', yield: 180 },
    { name: 'Wed', yield: 150 },
    { name: 'Thu', yield: 210 },
    { name: 'Fri', yield: 195 },
    { name: 'Sat', yield: 250 },
    { name: 'Sun', yield: 280 }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
            Investment Portfolio
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Deploy Capital into automated institutional-grade yield strategies.</p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative p-7 rounded-[2rem] flex flex-col justify-between overflow-hidden group transition-all duration-500 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-[#ffffff] to-[#e6fcf0] border-[4px] border-white text-black shadow-[0_20px_40px_rgba(0,255,136,0.15)] hover:shadow-[0_20px_50px_rgba(0,255,136,0.3)] hover:-translate-y-2 scale-[1.02]' 
                  : 'bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-white/10 text-white hover:-translate-y-1'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-brand text-[10px] font-extrabold px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)] uppercase tracking-widest z-10">
                  Most Popular
                </div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                    plan.popular ? 'bg-black text-brand' : 'bg-bg-base border border-white/5'
                  }`}>
                    <Icon size={24} style={!plan.popular ? { color: plan.color } : {}} />
                  </div>
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                    plan.popular ? 'bg-black/5 text-black/60' : 'bg-white/5 text-text-secondary'
                  }`}>{plan.duration} Days Lockup</span>
                </div>
                
                <h3 className={`text-2xl font-black tracking-tight mb-2 ${plan.popular ? 'text-black' : 'text-white'}`}>{plan.name}</h3>
                <div className="flex items-end gap-1 mb-8">
                  <span className={`text-5xl font-black tracking-tighter ${plan.popular ? 'text-brand' : 'text-brand'}`}>
                    {plan.roi}%
                  </span>
                  <span className={`text-xs font-bold mb-2 uppercase tracking-widest ${plan.popular ? 'text-black/60' : 'text-text-secondary'}`}>
                    / Daily
                  </span>
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm font-semibold">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.popular ? 'bg-black text-brand' : 'bg-brand/20 text-brand'
                      }`}>
                        <CheckCircle2 size={12} />
                      </div>
                      <span className={plan.popular ? 'text-black/80' : 'text-text-secondary'}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <div className={`flex justify-between items-center text-xs font-bold mb-5 p-3.5 rounded-xl border ${
                  plan.popular ? 'bg-black/5 border-black/10' : 'bg-bg-base/50 border-white/5'
                }`}>
                  <span className={plan.popular ? 'text-black/60' : 'text-text-secondary'}>
                    {plan.fixedAmount ? 'Fixed Deposit:' : 'Limits:'}
                  </span>
                  <span className={plan.popular ? 'text-black font-black text-sm' : 'text-white font-black text-sm'}>
                    {plan.fixedAmount ? formatCurrency(plan.fixedAmount) : `${formatCurrency(plan.min)} - ${formatCurrency(plan.max)}`}
                  </span>
                </div>
                <button 
                  onClick={() => handleOpenPurchase(plan)}
                  className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                    plan.popular 
                      ? 'bg-black text-white hover:bg-gray-900 shadow-xl hover:shadow-2xl' 
                      : 'bg-brand text-black hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.2)] hover:shadow-[0_0_25px_rgba(0,255,136,0.4)]'
                  }`}
                >
                  Configure & Invest
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Strategy Allocation section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass p-6 rounded-2xl max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/60">
          <PieIcon size={18} className="text-brand" />
          <h3 className="font-bold text-md text-white">Strategy Allocation</h3>
        </div>
        <p className="text-xs text-text-secondary mb-6">Capital split across active institutional accounts.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Chart Container */}
          <div className="h-[220px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 11, color: '#fff' }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Allocated']}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center text overlay with smaller text so it never overlaps */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] text-text-secondary uppercase tracking-wider font-bold">Total Platform Capital</span>
              <span className="text-sm font-extrabold text-white tracking-tight mt-0.5">{formatCurrency(totalGlobalCapital)}</span>
            </div>
          </div>

          {/* Details Legend */}
          <div className="space-y-3">
            {allocationData.map((d) => (
              <div key={d.name} className="flex justify-between items-center text-xs p-3 rounded-xl bg-bg-base/40 border border-border/60 hover:border-brand/35 transition-all">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-text-primary font-bold">{d.name}</span>
                </div>
                <span className="font-extrabold text-white text-sm">{formatCurrency(d.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timeline and History Center */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-card/20">
          <div>
            <h3 className="font-bold text-md text-white">Investment Ledgers</h3>
            <p className="text-xs text-text-secondary">Historical logs of plans, lockups, and earnings.</p>
          </div>
          
          {/* Tabs switch */}
          <div className="flex bg-bg-base p-1 rounded-xl border border-border/80 self-end sm:self-auto">
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'active' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'completed' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Completed
            </button>
            <button 
              onClick={() => setActiveTab('expired')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'expired' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Expired
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'active' && (
            <div className="space-y-6">
              {dbUserInvestments.filter(inv => inv.status === 'ACTIVE').length > 0 ? (
                dbUserInvestments.filter(inv => inv.status === 'ACTIVE').map((inv) => {
                  const plan = inv.plan;
                  const principal = Number(inv.amount);
                  const dailyRoi = Number(plan.dailyRoi);
                  const duration = plan.durationDays;
                  const daysElapsed = Math.min(duration, Math.max(0, Math.floor((Date.now() - new Date(inv.startDate).getTime()) / (1000 * 60 * 60 * 24))));
                  const yieldEarned = principal * dailyRoi * daysElapsed;
                  const progress = (daysElapsed / duration) * 100;
                  const daysLeft = duration - daysElapsed;

                  return (
                    <div key={inv.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-border/80 bg-bg-base/30 gap-6">
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mt-1">
                          <Hourglass size={18} className="text-brand animate-spin-slow" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            {plan.name}
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20 uppercase tracking-wide">Active</span>
                          </div>
                          <div className="text-xs text-text-secondary">
                            Principal Invested: <span className="font-bold text-white">{formatCurrency(principal)}</span> • Daily Yield Accrued: <span className="text-brand font-bold">{formatCurrency(yieldEarned)}</span>
                          </div>
                          <div className="text-[10px] text-text-secondary/70 flex items-center gap-1 mt-1">
                            <Calendar size={12} /> {new Date(inv.startDate).toLocaleDateString()} <ArrowRight size={10} /> {new Date(inv.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-56 space-y-1.5 self-end md:self-auto">
                        <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                          <div className="bg-brand h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] font-semibold text-text-secondary">
                          <span>Progression: {progress.toFixed(1)}%</span>
                          <span>Ends in {daysLeft}d</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                  <Hourglass size={32} className="text-text-secondary mb-3" />
                  <p className="text-sm text-text-secondary font-semibold">No active portfolios.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {dbUserInvestments.filter(inv => inv.status === 'COMPLETED').length > 0 ? (
                dbUserInvestments.filter(inv => inv.status === 'COMPLETED').map((comp) => {
                  const plan = comp.plan;
                  const principal = Number(comp.amount);
                  const profit = principal * Number(plan.dailyRoi) * plan.durationDays;
                  
                  return (
                    <div key={comp.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-border/80 bg-bg-base/30 gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <FileCheck size={18} className="text-blue-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            {plan.name}
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wide">Settled</span>
                          </div>
                          <div className="text-xs text-text-secondary">
                            Principal: <span className="text-white font-bold">{formatCurrency(principal)}</span> • Total ROI Realized: <span className="text-brand font-bold">+{formatCurrency(profit)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-text-secondary block">Dates: {new Date(comp.startDate).toLocaleDateString()} to {new Date(comp.endDate).toLocaleDateString()}</span>
                        <span className="text-brand font-bold uppercase tracking-wider text-[9px] mt-1 inline-block">Payout Released</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                  <FileCheck size={32} className="text-text-secondary mb-3" />
                  <p className="text-sm text-text-secondary font-semibold">No completed portfolios yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'expired' && (
            <div className="flex flex-col items-center justify-center py-10 opacity-60">
              <Hourglass size={32} className="text-text-secondary mb-3" />
              <p className="text-sm text-text-secondary font-semibold">No expired portfolios yet.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Investment Purchase Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isPurchasing && setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-bg-card border border-border/80 rounded-2xl overflow-hidden shadow-2xl"
            >
              {purchaseStep === 'idle' && (
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Purchase Investment</h3>
                  <p className="text-sm text-text-secondary mb-6">You are configuring {selectedPlan.name}.</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-bg-base p-4 rounded-xl border border-white/5 flex justify-between items-center">
                      <span className="text-xs text-text-secondary font-semibold">Available Wallet Balance</span>
                      <span className="text-sm font-bold text-white">{formatCurrency(dbWallet?.main || 0)}</span>
                    </div>

                    <div>
                      <label className="text-xs text-text-secondary font-semibold block mb-2">Investment Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-semibold">$</span>
                        <input 
                          type="number" 
                          disabled={!!selectedPlan.fixedAmount}
                          value={calcAmount}
                          onChange={(e) => setCalcAmount(Number(e.target.value))}
                          className="w-full bg-bg-base border border-border/80 rounded-xl py-3 pl-8 pr-4 outline-none focus:border-brand text-sm font-bold text-white transition-colors" 
                        />
                      </div>
                      <div className="text-[10px] text-text-secondary mt-1 text-right">
                        Limits: {formatCurrency(selectedPlan.min)} - {formatCurrency(selectedPlan.max)}
                      </div>
                    </div>

                    <div className="bg-brand/5 border border-brand/20 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-brand font-semibold">Daily Yield</span>
                        <span className="text-sm font-bold text-white">{formatCurrency(calculatedDaily)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-brand font-semibold">Total Profit</span>
                        <span className="text-sm font-bold text-white">+{formatCurrency(calculatedProfit)}</span>
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs flex items-center gap-2 mb-4">
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-bg-base border border-border/80 hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleConfirmPurchase}
                      className="flex-1 py-3 rounded-xl font-bold text-xs text-black bg-brand hover:bg-brand-hover transition-all"
                    >
                      Confirm Investment
                    </button>
                  </div>
                </div>
              )}

              {purchaseStep === 'rolling' && (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Processing Transaction...</h3>
                  <p className="text-xs text-text-secondary">Securing your position on the smart ledger.</p>
                </div>
              )}

              {purchaseStep === 'success' && (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-brand/20 text-brand rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Investment Successful!</h3>
                  <p className="text-xs text-text-secondary mb-6">Your capital is now actively yielding returns.</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-3 rounded-xl font-bold text-xs text-black bg-brand hover:bg-brand-hover transition-all"
                  >
                    View Active Portfolio
                  </button>
                </div>
              )}

              {purchaseStep === 'error' && (
                <div className="p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Transaction Failed</h3>
                  <p className="text-xs text-rose-400 mb-6">{errorMsg}</p>
                  <button 
                    onClick={() => setPurchaseStep('idle')}
                    className="w-full py-3 rounded-xl font-bold text-xs text-white bg-bg-base border border-border/80 hover:bg-white/5 transition-all"
                  >
                    Try Again
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
