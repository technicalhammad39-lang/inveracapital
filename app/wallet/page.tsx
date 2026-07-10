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
    { key: 'main', label: 'Main Wallet', value: 12450.50, color: '#00ff88', glow: 'rgba(0,255,136,0.15)', badge: 'Active', icon: Wallet },
    { key: 'investment', label: 'Investment Wallet', value: 85000.00, color: '#3b82f6', glow: 'rgba(59,130,246,0.15)', badge: 'Trading', icon: TrendingUp },
    { key: 'referral', label: 'Referral Wallet', value: 1250.00, color: '#a855f7', glow: 'rgba(168,85,247,0.15)', badge: 'Network', icon: Users },
    { key: 'bonus', label: 'Bonus Wallet', value: 450.00, color: '#f59e0b', glow: 'rgba(245,158,11,0.15)', badge: 'Promo', icon: Award },
    { key: 'locked', label: 'Locked Balance', value: 9500.00, color: '#ef4444', glow: 'rgba(239,68,68,0.15)', badge: 'Locked', icon: Lock },
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
              className="animated-gradient-border group cursor-pointer"
            >
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <span className="text-text-secondary text-[10px] font-bold tracking-wider block uppercase">
                      {w.label}
                    </span>
                    <span className={clsx(
                      "text-[9px] font-extrabold px-2 py-0.5 rounded-full inline-block tracking-wider uppercase border",
                      w.key === 'locked' ? "bg-rose-500/10 text-rose-400 border-rose-500/25" : "bg-brand/10 text-brand border-brand/25 shadow-[0_0_10px_rgba(0,255,136,0.05)]"
                    )}>
                      {w.badge}
                    </span>
                  </div>
                  <Icon className="w-5 h-5 text-brand transition-transform duration-300 shrink-0" />
                </div>

                <div className="flex items-end justify-between pt-2">
                  <div className="space-y-1.5">
                    <div className="text-xl font-extrabold text-white tracking-tight">
                      {formatCurrency(w.value)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
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
                          <>
                            <p className="font-bold text-white text-sm mb-1">TRC20 Wallet Address</p>
                            <p className="font-mono text-[10px] select-all text-brand bg-brand/5 p-1.5 rounded border border-brand/10">TY27aF981jKls019aHGJlk82451Lks</p>
                            <p className="text-[10px] text-text-secondary mt-1">⚠️ Double check address. Send USDT only on Tron (TRC-20) network.</p>
                          </>
                        )}
                        {depMethod === 'local' && (
                          <>
                            <p className="font-bold text-white text-sm mb-1">Mobile Accounts</p>
                            <p><span className="text-text-secondary">EasyPaisa:</span> 0300-1234567 (Hammad A.)</p>
                            <p><span className="text-text-secondary">JazzCash:</span> 0315-9876543 (Hammad A.)</p>
                          </>
                        )}
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
                      <div className="grid grid-cols-3 gap-3">
                        <button 
                          onClick={() => setWithMethod('bank')}
                          className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                            withMethod === 'bank' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                          }`}
                        >
                          <CreditCard size={18} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Saved Bank</span>
                        </button>
                        
                        <button 
                          onClick={() => setWithMethod('crypto')}
                          className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                            withMethod === 'crypto' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                          }`}
                        >
                          <Coins size={18} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">USDT Address</span>
                        </button>
                        
                        <button 
                          onClick={() => setWithMethod('local')}
                          className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border transition-all ${
                            withMethod === 'local' ? 'border-brand bg-brand/5 text-brand' : 'border-border bg-bg-base text-text-secondary hover:border-brand/40'
                          }`}
                        >
                          <Building2 size={18} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Local Account</span>
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
                        <span className="text-[10px] text-text-secondary block">Available: {formatCurrency(12450.50)}</span>
                      </div>

                      {/* Destination */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs text-text-secondary font-semibold">3. Destination Address / Account Info</label>
                        <input 
                          type="text" 
                          value={withAddress}
                          onChange={(e) => setWithAddress(e.target.value)}
                          placeholder="Bank IBAN, Crypto Wallet, or Local Account Phone" 
                          className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-4 outline-none focus:border-brand text-sm font-semibold text-white transition-colors" 
                        />
                        <span className="text-[10px] text-text-secondary block">Ensure correct account details to prevent loss of funds.</span>
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
