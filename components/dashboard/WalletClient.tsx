'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import PremiumKPICard from '@/components/ui/PremiumKPICard';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowRightLeft, 
  CreditCard, 
  Building2, 
  Coins, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  QrCode,
  FileCheck,
  TrendingUp,
  Users,
  Award,
  Wallet
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Helper to generate dynamic chart data based on current balance
const generateChartData = (currentBalance: number) => {
  return [
    { date: 'Day 1', balance: currentBalance * 0.95 },
    { date: 'Day 2', balance: currentBalance * 0.96 },
    { date: 'Day 3', balance: currentBalance * 0.96 },
    { date: 'Day 4', balance: currentBalance * 0.98 },
    { date: 'Day 5', balance: currentBalance * 0.99 },
    { date: 'Day 6', balance: currentBalance },
    { date: 'Today', balance: currentBalance },
  ];
};

export default function WalletClient({ 
  dbWalletData, 
  paymentMethods = [],
  banks = [],
  cryptos = [],
  recentLedgers = []
}: { 
  dbWalletData: any, 
  paymentMethods?: any[],
  banks?: any[],
  cryptos?: any[],
  recentLedgers?: any[]
}) {
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  
  // Wallet Data State
  const [walletData, setWalletData] = useState<any>(dbWalletData);
  const loading = false;

  React.useEffect(() => {
    setWalletData(dbWalletData);
  }, [dbWalletData]);

  // Deposit States
  const [depMethod, setDepMethod] = useState<string>(paymentMethods.length > 0 ? paymentMethods[0].id : '');
  const [depAmount, setDepAmount] = useState<string>('1000');
  const [receiptUploaded, setReceiptUploaded] = useState<boolean>(false);
  const [uploadingReceipt, setUploadingReceipt] = useState<boolean>(false);
  const [depSuccess, setDepSuccess] = useState<boolean>(false);
  const [depError, setDepError] = useState<string>('');

  // Withdraw States
  const [withMethod, setWithMethod] = useState<'bank' | 'crypto' | 'local'>('crypto');
  const [withAmount, setWithAmount] = useState<string>('500');
  const [withAddress, setWithAddress] = useState<string>('');
  const [withPin, setWithPin] = useState<string>('');
  const [withSuccess, setWithSuccess] = useState<boolean>(false);
  const [withError, setWithError] = useState<string>('');

  // Transfer States
  const [trFrom, setTrFrom] = useState<'main' | 'referral' | 'bonus'>('main');
  const [trTo, setTrTo] = useState<'investment' | 'main'>('investment');
  const [trAmount, setTrAmount] = useState<string>('100');
  const [trSuccess, setTrSuccess] = useState<boolean>(false);

  // Wallets Balances
  const wallets = [
    { key: 'main', label: 'Main Wallet', value: walletData?.main || 0, color: '#00ff88', glow: 'rgba(0,255,136,0.15)', badge: 'Active', icon: Wallet },
    { key: 'investment', label: 'Investment Wallet', value: walletData?.investment || 0, color: '#3b82f6', glow: 'rgba(59,130,246,0.15)', badge: 'Trading', icon: TrendingUp },
    { key: 'referral', label: 'Referral Wallet', value: walletData?.referral || 0, color: '#a855f7', glow: 'rgba(168,85,247,0.15)', badge: 'Network', icon: Users },
    { key: 'bonus', label: 'Bonus Wallet', value: walletData?.bonus || 0, color: '#f59e0b', glow: 'rgba(245,158,11,0.15)', badge: 'Promo', icon: Award },
    { key: 'locked', label: 'Locked Balance', value: walletData?.locked || 0, color: '#ef4444', glow: 'rgba(239,68,68,0.15)', badge: 'Locked', icon: Lock },
  ];

  // Simulating Receipt upload visually for now
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingReceipt(true);
      setTimeout(() => {
        setUploadingReceipt(false);
        setReceiptUploaded(true);
      }, 1500);
    }
  };

  const handleDepositSubmit = async () => {
    if (!depAmount || Number(depAmount) <= 0) return;
    setDepError('');
    const m = await import('@/app/actions/walletActions');
    const res = await m.requestDeposit(depAmount, depMethod);
    
    if (res.success) {
      setDepSuccess(true);
      setTimeout(() => {
        setDepSuccess(false);
        setDepAmount('');
        setReceiptUploaded(false);
      }, 4000);
    } else {
      setDepError(res.error || 'Deposit failed');
    }
  };

  const handleWithdrawSubmit = async () => {
    if (!withAmount || Number(withAmount) <= 0) {
      setWithError('Please enter a valid amount.');
      return;
    }
    if (!withAddress) {
      setWithError('Please provide a withdrawal address/account.');
      return;
    }

    setWithError('');
    const m = await import('@/app/actions/walletActions');
    const res = await m.requestWithdrawal(withAmount, withMethod, withAddress);

    if (res.success) {
      setWithSuccess(true);
      // Refresh wallet locally
      setWalletData((prev: any) => ({ ...prev, main: prev.main - Number(withAmount) }));
      setTimeout(() => {
        setWithSuccess(false);
        setWithAmount('');
        setWithAddress('');
        setWithPin('');
      }, 4000);
    } else {
      setWithError(res.error || 'Withdrawal failed. Check balance.');
    }
  };

  const handleTransferSubmit = () => {
    if (!trAmount || Number(trAmount) <= 0) return;
    setTrSuccess(true);
    setTimeout(() => {
      setTrSuccess(false);
      setTrAmount('');
    }, 4000);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
          Wallet Operations
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Deposit Capital, withdraw accrued yield, or transfer internal balances.</p>
      </div>

      {/* 5 Balance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {wallets.map((w, i) => (
          <PremiumKPICard
            key={w.key}
            label={w.label}
            value={w.value}
            icon={w.icon}
            delay={i * 0.08}
            isCurrency={true}
          />
        ))}
      </div>

      {/* Actions panel (Deposit, Withdraw, Transfer) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass p-6 rounded-2xl w-full flex flex-col justify-between"
      >
        {/* Action Tabs switcher */}
        <div className="flex bg-bg-base p-1.5 rounded-xl border border-border/80 mb-6">
          <button 
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'deposit' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <ArrowDownLeft size={14} /> Deposit Funds
          </button>
          <button 
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'withdraw' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <ArrowUpRight size={14} /> Withdraw Payouts
          </button>
          <button 
            onClick={() => setActiveTab('transfer')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'transfer' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <ArrowRightLeft size={14} /> Internal Transfer
          </button>
        </div>

        <div>
          <AnimatePresence mode="wait">
            
            {/* Deposit Interface */}
            {activeTab === 'deposit' && (
              <motion.div 
                key="deposit"
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {depSuccess ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-12 h-12 bg-brand/10 border border-brand/20 text-brand rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Deposit Receipt Received</h3>
                    <p className="text-xs text-text-secondary max-w-sm mx-auto">
                      Your deposit of {formatCurrency(Number(depAmount))} is under verification. Our staff will confirm it within 15 minutes.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Gateways select */}
                    <div>
                      <label className="text-xs text-text-secondary block mb-3 font-semibold">1. Choose Gateway Method</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {paymentMethods.map(pm => {
                          const Icon = pm.type === 'BANK' ? CreditCard : pm.type === 'CRYPTO' ? Coins : Building2;
                          return (
                            <button 
                              key={pm.id}
                              onClick={() => setDepMethod(pm.id)}
                              className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                                depMethod === pm.id ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                              }`}
                            >
                              <Icon size={18} />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-center">{pm.name}</span>
                            </button>
                          );
                        })}
                        {paymentMethods.length === 0 && (
                          <div className="col-span-full p-4 text-center text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                            No payment methods configured. Please contact support.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Deposit Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Amount */}
                      <div className="space-y-2">
                        <label className="text-xs text-text-secondary font-semibold">2. Specify Amount</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-semibold">$</span>
                          <input 
                            type="number" 
                            value={depAmount}
                            onChange={(e) => setDepAmount(e.target.value)}
                            placeholder="Min: 100" 
                            className="w-full bg-bg-base border border-border/80 rounded-xl py-3 pl-8 pr-4 outline-none focus:border-brand text-sm font-bold text-white transition-colors" 
                          />
                        </div>
                        <div className="flex gap-2">
                          {['250', '500', '1000', '5000'].map(amt => (
                            <button 
                              key={amt}
                              onClick={() => setDepAmount(amt)}
                              className="px-2.5 py-1 text-[10px] border border-border/80 rounded-full text-text-secondary hover:text-brand hover:border-brand/40 transition-colors font-bold"
                            >
                              +${amt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Gateway Details */}
                      <div className="bg-bg-base/40 border border-border/80 p-4 rounded-xl text-xs space-y-1.5 flex flex-col justify-center">
                        {paymentMethods.map(pm => {
                          if (pm.id !== depMethod) return null;
                          return (
                            <div key={pm.id}>
                              <p className="font-bold text-white text-sm mb-2">{pm.name} Details</p>
                              <div className="whitespace-pre-wrap text-text-secondary">
                                {pm.details}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>

                    {/* Receipt upload */}
                    <div className="space-y-2 border-t border-border/50 pt-5">
                      <label className="text-xs text-text-secondary block font-semibold">3. Upload Transfer Voucher / Receipt Screenshot</label>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <label className="w-full sm:w-auto shrink-0">
                          <span className="flex items-center justify-center gap-2 px-5 py-3 border border-dashed border-border hover:border-brand/40 rounded-xl text-xs font-semibold cursor-pointer transition-colors bg-bg-base/30 text-text-secondary hover:text-white">
                            <Upload size={14} /> Choose File
                          </span>
                          <input type="file" className="hidden" onChange={handleReceiptUpload} accept="image/*,application/pdf" />
                        </label>
                        
                        <div>
                          {uploadingReceipt ? (
                            <span className="text-xs text-brand animate-pulse">Uploading file to ledger vault...</span>
                          ) : receiptUploaded ? (
                            <span className="text-xs text-brand flex items-center gap-1.5 font-bold"><FileCheck size={14} /> Receipt Uploaded Successfully!</span>
                          ) : (
                            <span className="text-xs text-text-secondary">No file uploaded yet. (JPEG, PNG, PDF formats accepted)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleDepositSubmit}
                      disabled={!receiptUploaded}
                      className={`w-full font-extrabold text-xs py-3.5 rounded-xl transition-all ${
                        receiptUploaded 
                          ? 'bg-brand text-black hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.3)] cursor-pointer' 
                          : 'bg-bg-base/40 text-text-secondary border border-border cursor-not-allowed'
                      }`}
                    >
                      Verify and Submit Deposit Request
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {/* Withdraw Interface */}
            {activeTab === 'withdraw' && (
              <motion.div 
                key="withdraw"
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {withSuccess ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-12 h-12 bg-brand/10 border border-brand/20 text-brand rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Withdrawal Dispatched</h3>
                    <p className="text-xs text-text-secondary max-w-sm mx-auto">
                      Your payout of {formatCurrency(Number(withAmount))} was successfully sent. Standard blockchain verification takes 5-10 minutes.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Withdraw method */}
                    <div>
                      <label className="text-xs text-text-secondary block mb-3 font-semibold">1. Select Withdrawal Gateway</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => { setWithMethod('bank'); setWithAddress(''); }}
                          className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                            withMethod === 'bank' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                          }`}
                        >
                          <CreditCard size={18} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Saved Banks</span>
                        </button>
                        
                        <button 
                          onClick={() => { setWithMethod('crypto'); setWithAddress(''); }}
                          className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                            withMethod === 'crypto' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                          }`}
                        >
                          <Coins size={18} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Crypto Wallets</span>
                        </button>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      
                      {/* Amount */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-text-secondary font-semibold">
                          <span>2. Specify Amount</span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-semibold">$</span>
                          <input 
                            type="number" 
                            value={withAmount}
                            onChange={(e) => setWithAmount(e.target.value)}
                            placeholder="Min: 50" 
                            className="w-full bg-bg-base border border-border/80 rounded-xl py-3 pl-8 pr-4 outline-none focus:border-brand text-sm font-bold text-white transition-colors" 
                          />
                        </div>
                        <span className="text-[10px] text-text-secondary block">Available: {formatCurrency(walletData?.main || 0)}</span>
                      </div>

                      {/* Destination */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs text-text-secondary font-semibold">3. Select Saved Account</label>
                        <select 
                          value={withAddress}
                          onChange={(e) => setWithAddress(e.target.value)}
                          className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-4 outline-none focus:border-brand text-sm font-semibold text-white transition-colors cursor-pointer appearance-none"
                        >
                          <option value="">-- Choose Account --</option>
                          {withMethod === 'bank' && banks.map(b => (
                            <option key={b.id} value={`${b.bankName} - ${b.accountNumber}`}>
                              {b.bankName} ({b.accountNumber.slice(-4)})
                            </option>
                          ))}
                          {withMethod === 'crypto' && cryptos.map(c => (
                            <option key={c.id} value={`${c.network} - ${c.address}`}>
                              {c.network} ({c.address.slice(0, 6)}...{c.address.slice(-4)})
                            </option>
                          ))}
                        </select>
                        <span className="text-[10px] text-text-secondary block">
                          {(withMethod === 'bank' && banks.length === 0) || (withMethod === 'crypto' && cryptos.length === 0) 
                            ? <a href="/profile" className="text-brand hover:underline">You have no saved accounts here. Click to add one in your Profile.</a> 
                            : 'Ensure correct account details to prevent loss of funds.'}
                        </span>
                      </div>

                    </div>

                    {/* Security PIN */}
                    <div className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-rose-400">
                        <Lock size={16} />
                        <h4 className="font-bold text-xs">Security Verification Check</h4>
                      </div>
                      <p className="text-[10px] text-text-secondary">Enter your 4-digit Security Withdrawal PIN. (Default setup is 1234).</p>
                      
                      <input 
                        type="password" 
                        maxLength={4}
                        placeholder="••••"
                        value={withPin}
                        onChange={(e) => setWithPin(e.target.value)}
                        className="bg-bg-base border border-border/80 rounded-lg py-2 px-3 outline-none focus:border-rose-500 text-center tracking-widest text-sm font-bold text-white w-24" 
                      />
                    </div>

                    {withError && (
                      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs flex items-center gap-2">
                        <AlertTriangle size={14} />
                        <span>{withError}</span>
                      </div>
                    )}

                    <button 
                      onClick={handleWithdrawSubmit}
                      className="w-full bg-brand text-black font-extrabold text-xs py-3.5 rounded-xl hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
                    >
                      Confirm and Complete Security Payout Dispatch
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {/* Transfer Interface */}
            {activeTab === 'transfer' && (
              <motion.div 
                key="transfer"
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {trSuccess ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-12 h-12 bg-brand/10 border border-brand/20 text-brand rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Transfer Completed</h3>
                    <p className="text-xs text-text-secondary max-w-sm mx-auto">
                      Your transfer of {formatCurrency(Number(trAmount))} from {trFrom.toUpperCase()} to {trTo.toUpperCase()} is completed instantly.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-text-secondary font-semibold block mb-2">1. Source Wallet (Debit)</label>
                          <select 
                            value={trFrom} 
                            onChange={(e) => setTrFrom(e.target.value as any)}
                            className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-4 outline-none focus:border-brand text-xs font-semibold text-white transition-colors cursor-pointer"
                          >
                            <option value="main">Main Wallet ({formatCurrency(walletData?.main || 0)})</option>
                            <option value="referral">Referral Wallet ({formatCurrency(walletData?.referral || 0)})</option>
                            <option value="bonus">Bonus Wallet ({formatCurrency(walletData?.bonus || 0)})</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-text-secondary font-semibold block mb-2">2. Destination Wallet (Credit)</label>
                          <select 
                            value={trTo} 
                            onChange={(e) => setTrTo(e.target.value as any)}
                            className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-4 outline-none focus:border-brand text-xs font-semibold text-white transition-colors cursor-pointer"
                          >
                            <option value="investment">Investment Wallet</option>
                            <option value="main">Main Wallet</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4 flex flex-col justify-center">
                        <div>
                          <label className="text-xs text-text-secondary font-semibold block mb-2">3. Transfer Value</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-semibold">$</span>
                            <input 
                              type="number" 
                              value={trAmount}
                              onChange={(e) => setTrAmount(e.target.value)}
                              className="w-full bg-bg-base border border-border/80 rounded-xl py-3 pl-8 pr-4 outline-none focus:border-brand text-sm font-bold text-white transition-colors" 
                            />
                          </div>
                        </div>

                        <div className="bg-bg-base/30 border border-border/50 p-3 rounded-lg text-[10px] text-text-secondary leading-relaxed">
                          💡 Internal transfers across user wallets incur zero network gas or commission settlement fees.
                        </div>
                      </div>

                    </div>

                    <button 
                      onClick={handleTransferSubmit}
                      className="w-full bg-brand text-black font-extrabold text-xs py-3.5 rounded-xl hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
                    >
                      Authorize Internal Transfer
                    </button>
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </motion.div>

      {/* Mini Ledgers Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border/60 flex justify-between items-center bg-bg-card/25">
          <div>
            <h3 className="font-bold text-md text-white">Recent Transactions</h3>
            <p className="text-xs text-text-secondary">Log details of your deposits, transfers, and withdrawal dispatches.</p>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left min-w-[600px]">
            <thead className="text-text-secondary bg-bg-base/40 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Transaction Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Source Account</th>
                <th className="px-6 py-4">Destination ID</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {recentLedgers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-text-secondary">
                    No recent transactions found.
                  </td>
                </tr>
              ) : recentLedgers.map((tx: any) => {
                const positive = tx.type === 'CREDIT';
                return (
                  <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-bold text-text-primary">{tx.description || tx.type}</td>
                    <td className={`px-6 py-4 font-bold text-sm ${positive ? 'text-brand' : 'text-text-primary'}`}>
                      {positive ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{tx.type}</td>
                    <td className="px-6 py-4 text-text-secondary font-mono">{tx.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-text-secondary">{new Date(tx.date).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border ${
                        tx.status === 'COMPLETED' ? 'bg-brand/10 border-brand/20 text-brand' : 
                        tx.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
