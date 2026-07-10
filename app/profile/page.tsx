'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  User, 
  Building, 
  Coins, 
  Bell, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Save, 
  Globe,
  Wallet,
  Settings
} from 'lucide-react';

interface BankAccount {
  id: string;
  bankName: string;
  title: string;
  iban: string;
}

interface CryptoAddress {
  id: string;
  network: string;
  address: string;
}

export default function ProfilePage() {
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'info' | 'banks' | 'crypto' | 'notifs' | 'security' | 'prefs' | 'verification' | 'logs'>('info');
  
  // Profile settings state
  const [name, setName] = useState('Admin User');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [country, setCountry] = useState('Pakistan');
  const [savingInfo, setSavingInfo] = useState(false);
  
  // Save Notification States
  const [notifStates, setNotifStates] = useState({
    deposits: true,
    withdrawals: true,
    roi: true,
    security: true,
    marketing: false
  });

  // Saved Bank accounts
  const [banks, setBanks] = useState<BankAccount[]>([
    { id: 'b1', bankName: 'Habib Bank Limited', title: 'Admin User Account', iban: 'PK56HABB0029104810294108' }
  ]);
  const [newBankName, setNewBankName] = useState('');
  const [newBankTitle, setNewBankTitle] = useState('');
  const [newBankIban, setNewBankIban] = useState('');

  // Saved Crypto Addresses
  const [cryptos, setCryptos] = useState<CryptoAddress[]>([
    { id: 'c1', network: 'USDT (TRC20)', address: 'TY27aF981jKls019aHGJlk82451Lks' }
  ]);
  const [newNet, setNewNet] = useState('USDT (TRC20)');
  const [newAddr, setNewAddr] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveInfo = () => {
    setSavingInfo(true);
    setTimeout(() => {
      setSavingInfo(false);
      triggerToast('Personal details updated successfully.');
    }, 1200);
  };

  const handleAddBank = () => {
    if (!newBankName || !newBankTitle || !newBankIban) return;
    const newB: BankAccount = {
      id: `b-${Date.now()}`,
      bankName: newBankName,
      title: newBankTitle,
      iban: newBankIban
    };
    setBanks([...banks, newB]);
    setNewBankName('');
    setNewBankTitle('');
    setNewBankIban('');
    triggerToast('Bank account registered successfully.');
  };

  const handleRemoveBank = (id: string) => {
    setBanks(banks.filter(b => b.id !== id));
    triggerToast('Bank account removed from database.');
  };

  const handleAddCrypto = () => {
    if (!newAddr) return;
    const newC: CryptoAddress = {
      id: `c-${Date.now()}`,
      network: newNet,
      address: newAddr
    };
    setCryptos([...cryptos, newC]);
    setNewAddr('');
    triggerToast('Crypto wallet address registered.');
  };

  const handleRemoveCrypto = (id: string) => {
    setCryptos(cryptos.filter(c => c.id !== id));
    triggerToast('Wallet address removed.');
  };

  const toggleNotif = (key: keyof typeof notifStates) => {
    setNotifStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
          Enterprise Profile Center
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Configure personal details, link bank accounts, check security ratings, and monitor access sessions.</p>
      </div>

      {/* Enterprise Profile Header Card */}
      <div className="glass p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-brand/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand/5 blur-3xl pointer-events-none" />
        
        {/* Left Side: Avatar & Badges */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="relative">
            {/* Centered avatar with pulsing glowing ring */}
            <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-brand/40 flex items-center justify-center text-2xl font-black text-white relative z-10 shadow-[0_0_20px_rgba(0,255,136,0.15)]">
              AU
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-brand/30 animate-ping opacity-25" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Admin User</h2>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="text-[10px] bg-gradient-to-r from-emerald-500/20 to-brand/10 text-brand border border-brand/35 shadow-[0_0_10px_rgba(0,255,136,0.1)] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Platinum VIP Member
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/25 px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={11} className="text-brand" /> KYC Tier 2 Verified
              </span>
            </div>
            
            <p className="text-xs text-text-secondary">Member since: <strong className="text-white">Jan 12, 2026</strong> • UID: <strong className="text-white font-mono">INV-849201</strong></p>
          </div>
        </div>

        {/* Right Side: Profile Completion Meter */}
        <div className="w-full md:max-w-xs space-y-2 border-t md:border-t-0 md:border-l border-border/60 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
          <div className="flex justify-between text-xs font-bold text-white">
            <span>Profile Completion</span>
            <span className="text-brand">85%</span>
          </div>
          <div className="w-full bg-bg-base h-2 rounded-full overflow-hidden border border-border/80">
            <div className="bg-brand h-full rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-[10px] text-text-secondary leading-normal">
            💡 Add a backup security 2FA key or crypto payout address to hit 100% security rating.
          </p>
        </div>
      </div>

      {/* Main navigation configuration grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Sidebar Panel (left) */}
        <div className="flex flex-col gap-2">
          {[
            { key: 'info', label: 'Personal Info', icon: User },
            { key: 'security', label: 'Security & 2FA', icon: Lock },
            { key: 'banks', label: 'Bank Accounts', icon: Building },
            { key: 'crypto', label: 'Crypto Wallets', icon: Coins },
            { key: 'notifs', label: 'Notifications', icon: Bell },
            { key: 'prefs', label: 'Preferences', icon: Settings },
            { key: 'verification', label: 'Verification (KYC)', icon: CheckCircle2 },
            { key: 'logs', label: 'Activity Logs', icon: Globe }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as any)}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-xs font-bold transition-all text-left ${
                  activeTab === item.key 
                    ? 'border-brand bg-brand/5 text-brand shadow-[0_0_15px_rgba(0,255,136,0.08)]' 
                    : 'border-border/80 bg-bg-base/30 text-text-secondary hover:border-brand/45 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Configurations Box Panel (right spans 3 columns) */}
        <div className="glass p-6 rounded-3xl lg:col-span-3 min-h-[350px]">
          <AnimatePresence mode="wait">
            
            {/* Personal Details */}
            {activeTab === 'info' && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white font-sans">Personal Information Details</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Ensure information details match verification passports.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Full Legal Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-4 outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Primary Contact Phone</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-4 outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Registered Email (Read Only)</label>
                    <input 
                      type="text" 
                      value="admin@inveracapital.com" 
                      disabled
                      className="w-full bg-bg-base/50 border border-border/50 rounded-xl py-3 px-4 outline-none text-text-secondary/70 font-bold cursor-not-allowed" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Residence Country</label>
                    <input 
                      type="text" 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-4 outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSaveInfo}
                  disabled={savingInfo}
                  className="w-full bg-brand text-black font-extrabold text-xs py-3.5 rounded-xl hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  {savingInfo ? (
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : <Save size={14} />}
                  <span>Save Personal Details</span>
                </button>
              </motion.div>
            )}

            {/* Bank Accounts */}
            {activeTab === 'banks' && (
              <motion.div 
                key="banks"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white font-sans">Payout Bank Accounts</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Link HBL or local bank accounts for fiat withdrawals.</p>
                </div>

                {/* Add Bank Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs bg-bg-base/20 border border-border p-4.5 rounded-2xl">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Bank Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Habib Bank Ltd" 
                      value={newBankName}
                      onChange={(e) => setNewBankName(e.target.value)}
                      className="w-full bg-bg-base border border-border rounded-xl py-2.5 px-3 outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Account Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      value={newBankTitle}
                      onChange={(e) => setNewBankTitle(e.target.value)}
                      className="w-full bg-bg-base border border-border rounded-xl py-2.5 px-3 outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-between">
                    <label className="text-text-secondary font-semibold">IBAN Account Number</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="PK56HABB..." 
                        value={newBankIban}
                        onChange={(e) => setNewBankIban(e.target.value)}
                        className="bg-bg-base border border-border rounded-xl py-2.5 px-3 outline-none focus:border-brand text-white font-bold font-mono transition-colors flex-1" 
                      />
                      <button 
                        onClick={handleAddBank}
                        className="bg-brand text-black font-extrabold px-3 rounded-xl hover:bg-brand-hover transition-all shrink-0 flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Banks List */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-text-secondary uppercase tracking-wider pl-1">Saved Bank Accounts</h4>
                  {banks.length === 0 ? (
                    <p className="text-xs text-text-secondary pl-1">No registered bank accounts.</p>
                  ) : (
                    banks.map((b) => (
                      <div key={b.id} className="flex justify-between items-center bg-bg-base/30 border border-border p-3.5 rounded-xl text-xs">
                        <div className="flex items-center gap-3">
                          <Building className="text-brand w-5 h-5 shrink-0" />
                          <div>
                            <span className="font-bold text-white block">{b.bankName}</span>
                            <span className="text-[10px] text-text-secondary block mt-0.5">
                              Title: {b.title} • IBAN: <strong className="text-white font-mono">{b.iban}</strong>
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleRemoveBank(b.id)}
                          className="p-2 hover:bg-rose-500/10 text-text-secondary hover:text-rose-400 border border-border rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Crypto Addresses */}
            {activeTab === 'crypto' && (
              <motion.div 
                key="crypto"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white font-sans">Crypto Payout Addresses</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Link TRC20/ERC20 wallet details for secure crypto withdrawals.</p>
                </div>

                {/* Add crypto form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-bg-base/20 border border-border p-4.5 rounded-2xl">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Network Chain</label>
                    <select 
                      value={newNet} 
                      onChange={(e) => setNewNet(e.target.value)}
                      className="w-full bg-bg-base border border-border rounded-xl py-3 px-3 outline-none focus:border-brand text-white font-semibold cursor-pointer"
                    >
                      <option>USDT (TRC20)</option>
                      <option>USDT (ERC20)</option>
                      <option>BTC (Bitcoin Chain)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Wallet Receipt Address</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="e.g. TY27aF981jK..." 
                        value={newAddr}
                        onChange={(e) => setNewAddr(e.target.value)}
                        className="bg-bg-base border border-border rounded-xl py-3 px-3 outline-none focus:border-brand text-white font-bold font-mono transition-colors flex-1" 
                      />
                      <button 
                        onClick={handleAddCrypto}
                        className="bg-brand text-black font-extrabold px-3 rounded-xl hover:bg-brand-hover transition-all shrink-0 flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* List of Crypto Addresses */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-text-secondary uppercase tracking-wider pl-1">Saved Payout Addresses</h4>
                  {cryptos.length === 0 ? (
                    <p className="text-xs text-text-secondary pl-1">No saved addresses.</p>
                  ) : (
                    cryptos.map((c) => (
                      <div key={c.id} className="flex justify-between items-center bg-bg-base/30 border border-border p-3.5 rounded-xl text-xs">
                        <div className="flex items-center gap-3">
                          <Coins className="text-brand w-5 h-5 shrink-0" />
                          <div>
                            <span className="font-bold text-white block">{c.network}</span>
                            <span className="text-[10px] text-text-secondary block mt-0.5">
                              Address: <strong className="text-white font-mono break-all">{c.address}</strong>
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleRemoveCrypto(c.id)}
                          className="p-2 hover:bg-rose-500/10 text-text-secondary hover:text-rose-400 border border-border rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Notification settings */}
            {activeTab === 'notifs' && (
              <motion.div 
                key="notifs"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white font-sans">Notification Alerts Settings</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Configure when you receive emails, pushes, or SMS notifications.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'deposits', label: 'Deposit Arrivals', desc: 'Alert me instantly when deposits clear into my wallets.' },
                    { key: 'withdrawals', label: 'Withdrawal Approvals', desc: 'Alert me when withdrawals are processed or completed.' },
                    { key: 'roi', label: 'Daily ROI Crediting', desc: 'Alert me when daily yields credit into my active balances.' },
                    { key: 'security', label: 'Security & login updates', desc: 'Send high-priority notifications for login attempts, password changes, or 2FA updates.' },
                    { key: 'marketing', label: 'Promotions & Announcements', desc: 'Receive letters regarding campaign adjustments, VIP reward bonuses, or notices.' }
                  ].map((notif) => {
                    const active = notifStates[notif.key as keyof typeof notifStates];
                    return (
                      <div 
                        key={notif.key}
                        onClick={() => toggleNotif(notif.key as any)}
                        className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg-base/30 cursor-pointer hover:border-brand/40 transition-colors"
                      >
                        <div className="space-y-1 pr-6 text-xs">
                          <span className="font-bold text-white block">{notif.label}</span>
                          <span className="text-[10px] text-text-secondary leading-normal block">{notif.desc}</span>
                        </div>

                        {/* Sliding Switch Indicator */}
                        <div className={`w-10 h-6.5 rounded-full p-1 transition-colors shrink-0 flex items-center ${
                          active ? 'bg-brand' : 'bg-border'
                        }`}>
                          <div className={`w-4.5 h-4.5 rounded-full bg-black transition-transform duration-200 ${
                            active ? 'translate-x-3.5' : 'translate-x-0'
                          }`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white font-sans">Security settings</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Manage passwords, withdrawal PINs, and Two-Factor Authentication.</p>
                </div>

                <div className="space-y-5 text-xs">
                  {/* Change Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-text-secondary font-semibold">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-4 outline-none focus:border-brand text-white transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-text-secondary font-semibold">Confirm Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-4 outline-none focus:border-brand text-white transition-colors" />
                    </div>
                  </div>

                  {/* 2FA Setup */}
                  <div className="bg-bg-base/30 border border-border p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">Two-Factor Authentication (2FA)</h4>
                      <p className="text-[10px] text-text-secondary leading-normal max-w-md">Boost login authentication protocols by verifying accounts via Google Authenticator credentials.</p>
                    </div>
                    <button className="bg-brand text-black font-extrabold text-[10px] px-4 py-2 rounded-xl hover:bg-brand-hover transition-all uppercase tracking-wider">
                      Enable 2FA
                    </button>
                  </div>

                  {/* Withdrawal PIN */}
                  <div className="bg-bg-base/30 border border-border p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">Security withdrawal PIN</h4>
                      <p className="text-[10px] text-text-secondary leading-normal max-w-md">Configure 4-digit code required to authorize internal balance transfers or payout dispatches.</p>
                    </div>
                    <button className="border border-border hover:border-brand/40 bg-bg-base text-white font-extrabold text-[10px] px-4 py-2 rounded-xl transition-all uppercase tracking-wider">
                      Reset PIN
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'prefs' && (
              <motion.div 
                key="prefs"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white font-sans">User Preferences</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Adjust client configurations, default currencies, and UI settings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Base Valuation Currency</label>
                    <select className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-3 outline-none focus:border-brand text-white font-semibold cursor-pointer">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>PKR (Rs.)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Locale & Language</label>
                    <select className="w-full bg-bg-base border border-border/80 rounded-xl py-3 px-3 outline-none focus:border-brand text-white font-semibold cursor-pointer">
                      <option>English (United States)</option>
                      <option>Spanish (ES)</option>
                      <option>Urdu (PK)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-bg-base/30">
                      <div className="space-y-1 pr-6">
                        <span className="font-bold text-white block">Auto-Lock Dashboard Sessions</span>
                        <span className="text-[10px] text-text-secondary block">Lock dashboard viewport after 15 minutes of inactivity.</span>
                      </div>
                      <div className="w-10 h-6.5 rounded-full p-1 bg-brand shrink-0 flex items-center">
                        <div className="w-4.5 h-4.5 rounded-full bg-black translate-x-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'verification' && (
              <motion.div 
                key="verification"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white font-sans">Identity verification checks (KYC)</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Upload international passports or utility bills to unlock higher tier ceilings.</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-emerald-950/20 border border-brand/20 p-5 rounded-2xl flex items-start gap-4">
                    <CheckCircle2 className="text-brand shrink-0 w-6 h-6" />
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-white text-sm">KYC Verified Tier 2 Account Status</h4>
                      <p className="text-text-secondary leading-relaxed">You have cleared all verification controls. Account withdrawal ceilings expanded.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-border bg-bg-base/30 p-4 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="font-bold text-white block">1. Identity Verification</span>
                        <span className="text-[10px] text-text-secondary">International Passport or National ID.</span>
                      </div>
                      <span className="text-[9px] font-bold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded uppercase">Verified</span>
                    </div>

                    <div className="border border-border bg-bg-base/30 p-4 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="font-bold text-white block">2. Address Utility Check</span>
                        <span className="text-[10px] text-text-secondary">Recent bank records, gas, or electricity billing receipts.</span>
                      </div>
                      <span className="text-[9px] font-bold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded uppercase">Verified</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'logs' && (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white font-sans">Activity Log history</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Audit log records of operations, dispatches, and login sessions.</p>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {[
                    { event: 'User login session authorized', device: 'Chrome / Windows 11', ip: '182.176.12.84', time: 'Today, 10:45 AM' },
                    { event: 'Saved bank account b1 modified', device: 'Vercel Server Dispatch', ip: 'IP Lookup Shield', time: 'Yesterday, 14:15 PM' },
                    { event: 'Withdrawal dispatch security auth', device: 'Google Auth 2FA API', ip: '182.176.12.84', time: 'Oct 24, 2026, 11:20 AM' },
                    { event: 'Vault crypt keys updated', device: 'System Ledger Sync', ip: 'Vault Core Protocol', time: 'Oct 20, 2026, 09:00 AM' }
                  ].map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-bg-base/30 border border-border p-3.5 rounded-xl text-[11px]">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">{log.event}</span>
                        <span className="text-[10px] text-text-secondary block">{log.device} • IP: <strong className="text-white font-mono">{log.ip}</strong></span>
                      </div>
                      <span className="text-[10px] text-text-secondary shrink-0 font-medium">{log.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Profile settings messages toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-bg-base border border-brand/30 p-4 rounded-xl shadow-[0_10px_35px_rgba(0,255,136,0.15)] flex items-center gap-3 text-xs"
          >
            <CheckCircle2 className="text-brand w-5 h-5 shrink-0" />
            <span className="text-white font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
