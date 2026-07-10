'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
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
  TrendingUp
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

// Analytics balance history
const chartData = [
  { date: 'Jul 04', balance: 80000 },
  { date: 'Jul 05', balance: 84000 },
  { date: 'Jul 06', balance: 91000 },
  { date: 'Jul 07', balance: 89000 },
  { date: 'Jul 08', balance: 95000 },
  { date: 'Jul 09', balance: 99000 },
  { date: 'Jul 10', balance: 108650 },
];

export default function WalletPage() {
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  
  // Deposit States
  const [depMethod, setDepMethod] = useState<'bank' | 'crypto' | 'local'>('bank');
  const [depAmount, setDepAmount] = useState<string>('1000');
  const [receiptUploaded, setReceiptUploaded] = useState<boolean>(false);
  const [uploadingReceipt, setUploadingReceipt] = useState<boolean>(false);
  const [depSuccess, setDepSuccess] = useState<boolean>(false);

  // Withdraw States
  const [withMethod, setWithMethod] = useState<'bank' | 'crypto' | 'local'>('crypto');
  const [withAmount, setWithAmount] = useState<string>('500');
  const [withAddress, setWithAddress] = useState<string>('TY27aF981jKls019aHGJlk82451Lks');
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
    { key: 'main', label: 'Main Wallet', value: 12450.50, color: '#00ff88', glow: 'rgba(0,255,136,0.15)' },
    { key: 'investment', label: 'Investment Wallet', value: 85000.00, color: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
    { key: 'referral', label: 'Referral Wallet', value: 1250.00, color: '#a855f7', glow: 'rgba(168,85,247,0.15)' },
    { key: 'bonus', label: 'Bonus Wallet', value: 450.00, color: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
    { key: 'locked', label: 'Locked Balance', value: 9500.00, color: '#ef4444', glow: 'rgba(239,68,68,0.15)', icon: Lock },
  ];

  // Simulating Receipt upload
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingReceipt(true);
      setTimeout(() => {
        setUploadingReceipt(false);
        setReceiptUploaded(true);
      }, 1500);
    }
  };

  const handleDepositSubmit = () => {
    if (!depAmount || Number(depAmount) <= 0) return;
    setDepSuccess(true);
    setTimeout(() => {
      setDepSuccess(false);
      setDepAmount('');
      setReceiptUploaded(false);
    }, 4000);
  };

  const handleWithdrawSubmit = () => {
    setWithError('');
    const amt = Number(withAmount);
    if (!withAmount || amt <= 0) {
      setWithError('Please enter a valid amount.');
      return;
    }
    if (amt > 12450.50) {
      setWithError('Insufficient funds in Main Wallet.');
      return;
    }
    if (withPin !== '1234') {
      setWithError('Invalid Security Withdrawal PIN. Hint: Enter 1234');
      return;
    }
    
    setWithSuccess(true);
    setTimeout(() => {
      setWithSuccess(false);
      setWithAmount('');
      setWithPin('');
    }, 4000);
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
        {wallets.map((w, i) => {
          const Icon = w.icon;
          return (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between"
              style={{ boxShadow: `0 8px 30px -5px ${w.glow}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-secondary text-xs font-semibold uppercase">{w.label}</span>
                {Icon && <Icon size={14} style={{ color: w.color }} className="animate-pulse" />}
              </div>
              <div className="text-xl font-bold tracking-tight text-white mt-1">
                {formatCurrency(w.value)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics & Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Actions panel (Deposit, Withdraw, Transfer) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between"
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
                        <div className="grid grid-cols-3 gap-3">
                          <button 
                            onClick={() => setDepMethod('bank')}
                            className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                              depMethod === 'bank' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                            }`}
                          >
                            <CreditCard size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Bank Transfer</span>
                          </button>
                          
                          <button 
                            onClick={() => setDepMethod('crypto')}
                            className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                              depMethod === 'crypto' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                            }`}
                          >
                            <Coins size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Crypto (USDT)</span>
                          </button>
                          
                          <button 
                            onClick={() => setDepMethod('local')}
                            className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                              depMethod === 'local' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                            }`}
                          >
                            <Building2 size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">JazzCash / Easy</span>
                          </button>
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
                          {depMethod === 'bank' && (
                            <>
                              <p className="font-bold text-white text-sm mb-1">Invera Trust Account</p>
                              <p><span className="text-text-secondary">Bank:</span> Habib Bank Limited</p>
                              <p><span className="text-text-secondary">IBAN:</span> PK56HABB0029104810294108</p>
                              <p><span className="text-text-secondary">Memo Ref:</span> INV-DEP-ADMIN</p>
                            </>
                          )}
                          {depMethod === 'crypto' && (
                            <div className="flex items-center gap-3">
                              <QrCode size={48} className="text-brand shrink-0" />
                              <div className="space-y-0.5 overflow-hidden">
                                <p className="font-bold text-white">USDT Payout Wallet</p>
                                <p className="text-[10px] text-text-secondary font-mono truncate">TY27aF981jKls019aHGJlk82451Lks</p>
                                <p className="text-[9px] text-brand uppercase font-bold">Network: TRON (TRC20)</p>
                              </div>
                            </div>
                          )}
                          {depMethod === 'local' && (
                            <>
                              <p className="font-bold text-white text-sm mb-1">Mobile Merchant Payout</p>
                              <p><span className="text-text-secondary">Merchant:</span> Invera Capital Ltd.</p>
                              <p><span className="text-text-secondary">Mobile Account:</span> +92 300 1234567</p>
                              <p><span className="text-text-secondary">Type:</span> JazzCash Business</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Receipt upload */}
                      <div className="space-y-2">
                        <label className="text-xs text-text-secondary font-semibold">3. Attach Payment Voucher</label>
                        <div className="border-2 border-dashed border-border/60 hover:border-brand/40 rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-bg-base/20">
                          <input 
                            type="file" 
                            accept="image/*,application/pdf"
                            onChange={handleReceiptUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                          />
                          {uploadingReceipt ? (
                            <div className="text-xs text-brand font-bold py-2 animate-pulse">Uploading file receipt...</div>
                          ) : receiptUploaded ? (
                            <div className="flex items-center justify-center gap-2 text-xs text-brand font-bold py-2">
                              <FileCheck size={16} /> Receipt_Attached.png
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <Upload size={20} className="text-text-secondary mx-auto mb-1 group-hover:text-brand" />
                              <p className="text-xs font-bold text-white">Click or drag deposit receipt slips</p>
                              <p className="text-[10px] text-text-secondary">Supports PNG, PDF, JPG files (max 5MB)</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={handleDepositSubmit}
                        disabled={!receiptUploaded}
                        className="w-full bg-brand text-black font-extrabold text-xs py-3.5 rounded-xl hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Submit Deposit Voucher
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
                        Your request of {formatCurrency(Number(withAmount))} is successfully authorized. Payouts clear within 1-2 business hours.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Gateways select */}
                      <div>
                        <label className="text-xs text-text-secondary block mb-3 font-semibold">1. Select Withdrawal Destination</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button 
                            onClick={() => setWithMethod('bank')}
                            className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                              withMethod === 'bank' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                            }`}
                          >
                            <CreditCard size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Bank Account</span>
                          </button>
                          
                          <button 
                            onClick={() => setWithMethod('crypto')}
                            className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                              withMethod === 'crypto' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                            }`}
                          >
                            <Coins size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">USDT Wallet</span>
                          </button>
                          
                          <button 
                            onClick={() => setWithMethod('local')}
                            className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                              withMethod === 'local' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                            }`}
                          >
                            <Building2 size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">JazzCash / Easy</span>
                          </button>
                        </div>
                      </div>

                      {/* Withdraw fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-text-secondary font-semibold block mb-2">2. Destination Address / IBAN</label>
                            <input 
                              type="text" 
                              value={withAddress}
                              onChange={(e) => setWithAddress(e.target.value)}
                              className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-4 outline-none focus:border-brand text-xs font-mono text-white transition-colors" 
                            />
                          </div>

                          <div>
                            <label className="text-xs text-text-secondary font-semibold block mb-2">3. Payout Amount (Main Wallet)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-semibold">$</span>
                              <input 
                                type="number" 
                                value={withAmount}
                                onChange={(e) => setWithAmount(e.target.value)}
                                className="w-full bg-bg-base border border-border/80 rounded-xl py-3 pl-8 pr-4 outline-none focus:border-brand text-sm font-bold text-white transition-colors" 
                              />
                            </div>
                            <span className="text-[10px] text-text-secondary mt-1.5 block">
                              Available Main balance: <strong className="text-white">{formatCurrency(12450.50)}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Security check */}
                        <div className="bg-bg-base/40 border border-border/80 p-5 rounded-2xl space-y-4 flex flex-col justify-center">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-0.5 text-[11px]">
                              <p className="font-bold text-white">Security Checklist</p>
                              <p className="text-text-secondary leading-normal">Requires active 4-digit Security Withdrawal PIN.</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Enter Withdrawal PIN</label>
                            <input 
                              type="password" 
                              maxLength={4}
                              placeholder="••••"
                              value={withPin}
                              onChange={(e) => setWithPin(e.target.value)}
                              className="w-full bg-bg-base border border-border/80 rounded-xl py-3 text-center tracking-widest outline-none focus:border-brand text-md text-white font-bold transition-colors" 
                            />
                            <span className="text-[9px] text-text-secondary block text-center">Hint: 1234 for simulation</span>
                          </div>
                        </div>

                      </div>

                      {withError && (
                        <div className="text-xs text-rose-400 font-bold border border-rose-500/20 bg-rose-500/5 p-3 rounded-lg flex items-center gap-2">
                          <AlertTriangle size={14} /> {withError}
                        </div>
                      )}

                      <button 
                        onClick={handleWithdrawSubmit}
                        className="w-full bg-brand text-black font-extrabold text-xs py-3.5 rounded-xl hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
                      >
                        Confirm Security Withdrawal
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
                              <option value="main">Main Wallet ({formatCurrency(12450.50)})</option>
                              <option value="referral">Referral Wallet ({formatCurrency(1250.00)})</option>
                              <option value="bonus">Bonus Wallet ({formatCurrency(450.00)})</option>
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

        {/* Wallet Analytics Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/60">
              <TrendingUp size={18} className="text-brand" />
              <h3 className="font-bold text-md text-white">Wallet Analytics</h3>
            </div>
            <p className="text-xs text-text-secondary mb-4">Total holdings balance curve over current cycle.</p>
            
            <div className="h-[200px] w-full pr-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="walletChartColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: 11, color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#00ff88" strokeWidth={2} fillOpacity={1} fill="url(#walletChartColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 border-t border-border/60 pt-4 mt-4">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Gas Fee Tier</span>
              <span className="text-brand font-bold">Standard VIP (0%)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Withdrawal Cap</span>
              <span className="text-white font-bold">$100,000.00 / daily</span>
            </div>
          </div>
        </motion.div>

      </div>

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
              {[
                { type: 'Deposit', amount: 5000, date: 'Today, 10:45 AM', status: 'Completed', positive: true, from: 'HBL Bank Transfer', to: 'INV-DEP-ADMIN' },
                { type: 'Internal Transfer', amount: 1500, date: 'Yesterday, 14:20 PM', status: 'Completed', positive: false, from: 'Referral Wallet', to: 'Investment Wallet' },
                { type: 'Withdrawal', amount: 1200, date: 'Oct 24, 2026', status: 'Pending', positive: false, from: 'Main Wallet', to: 'USDT Address' }
              ].map((tx, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-bold text-text-primary">{tx.type}</td>
                  <td className={`px-6 py-4 font-bold text-sm ${tx.positive ? 'text-brand' : 'text-text-primary'}`}>
                    {tx.positive ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{tx.from}</td>
                  <td className="px-6 py-4 text-text-secondary font-mono">{tx.to}</td>
                  <td className="px-6 py-4 text-text-secondary">{tx.date}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider border ${
                      tx.status === 'Completed' ? 'bg-brand/10 border-brand/20 text-brand' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
