'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { SecurityVector } from '@/components/CustomIllustrations';
import { 
  ShieldAlert, 
  Lock, 
  Key, 
  Smartphone, 
  Mail, 
  Activity, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  Laptop,
  SmartphoneIcon
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  ip: string;
  location: string;
  browser: string;
  status: 'Current' | 'Active';
}

export default function SecurityPage() {
  const { formatCurrency } = useCurrency();
  
  // States
  const [activeTab, setActiveTab] = useState<'2fa' | 'pin' | 'sessions'>('2fa');
  const [pinSuccess, setPinSuccess] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // 2FA state
  const [is2faEnabled, setIs2faEnabled] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [tfaSuccess, setTfaSuccess] = useState<string | null>(null);

  // Verification toggles
  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Active sessions list
  const [sessions, setSessions] = useState<Device[]>([
    { id: 'dev1', name: 'Chrome on Windows 11', ip: '192.168.12.10', location: 'Islamabad, PK', browser: 'Chrome v120', status: 'Current' },
    { id: 'dev2', name: 'Safari on iPhone 15 Pro', ip: '182.29.41.98', location: 'Lahore, PK', browser: 'Mobile Safari', status: 'Active' },
    { id: 'dev3', name: 'Firefox on MacOS Sequoia', ip: '92.10.45.112', location: 'London, UK', browser: 'Firefox v125', status: 'Active' }
  ]);
  const [sessionToast, setSessionToast] = useState<string | null>(null);

  const revokeSession = (id: string) => {
    const dev = sessions.find(s => s.id === id);
    if (!dev) return;
    setSessions(sessions.filter(s => s.id !== id));
    setSessionToast(`Authorized session for ${dev.name} revoked successfully.`);
    setTimeout(() => setSessionToast(null), 3000);
  };

  const handleUpdatePin = () => {
    setPinError('');
    setPinSuccess(false);

    if (!oldPin || !newPin || !confirmPin) {
      setPinError('All fields are required.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('New PIN and confirmation PIN do not match.');
      return;
    }
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      setPinError('PIN must be a 4-digit number.');
      return;
    }

    setPinSuccess(true);
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => setPinSuccess(false), 3500);
  };

  const handleToggle2fa = () => {
    if (is2faEnabled) {
      // Disabling 2FA
      setIs2faEnabled(false);
      setTfaSuccess('Two-factor authentication disabled.');
    } else {
      // Enabling 2FA
      if (verificationCode.length !== 6 || isNaN(Number(verificationCode))) {
        alert('Please enter a valid 6-digit verification code.');
        return;
      }
      setIs2faEnabled(true);
      setVerificationCode('');
      setTfaSuccess('Two-factor authentication enabled successfully.');
    }
    setTimeout(() => setTfaSuccess(null), 3000);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
          Security Center
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Configure multi-factor authentication, change withdrawal codes, and monitor device access.</p>
      </div>

      {/* Grid: Security Score Meter & Verification toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Security Score Meter */}
        <div className="glass p-6 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand/5 blur-3xl pointer-events-none" />
          <SecurityVector className="w-40 h-40 animate-pulse-slow" />
          
          <div className="space-y-2 relative z-10">
            <div className="text-3xl font-black text-white">85%</div>
            <span className="text-[10px] text-brand font-bold uppercase tracking-wider block">Security Score: Strong</span>
            <p className="text-[10px] text-text-secondary max-w-xs mx-auto leading-normal">
              Activate mobile phone authentication to reach 100% full account protection.
            </p>
          </div>
        </div>

        {/* Verification Toggles panel (2 columns) */}
        <div className="glass p-6 rounded-3xl lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="font-bold text-md text-white pb-2 border-b border-border/60">Credential Verification Status</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Email Card */}
              <div className="p-4 rounded-xl border border-border bg-bg-base/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="text-brand w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-white block">Email Verification</span>
                    <span className="text-[10px] text-text-secondary block mt-0.5">admin@inveracapital.com</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20 uppercase tracking-wide">
                  Verified
                </span>
              </div>

              {/* Phone Card */}
              <div className="p-4 rounded-xl border border-border bg-bg-base/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="text-text-secondary w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-white block">Phone SMS Verification</span>
                    <span className="text-[10px] text-text-secondary block mt-0.5">Unregistered</span>
                  </div>
                </div>
                <button 
                  onClick={() => setPhoneVerified(!phoneVerified)}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                    phoneVerified 
                      ? 'bg-brand text-black border-brand' 
                      : 'bg-bg-base text-text-secondary border-border hover:border-brand/40 hover:text-white'
                  }`}
                >
                  {phoneVerified ? 'Verified' : 'Register'}
                </button>
              </div>

            </div>
          </div>

          <div className="bg-bg-base/30 border border-border/50 p-4 rounded-xl mt-6 text-xs text-text-secondary flex items-start gap-2.5">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5 w-4.5 h-4.5" />
            <div>
              <p className="font-bold text-white mb-0.5">Audit Alert Note</p>
              <p className="leading-normal">Any changes to 2FA or Withdrawal PIN disable withdrawals for 24 hours to prevent phishing fraud.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Settings Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings Select Buttons (left) */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-text-secondary uppercase tracking-wider pl-1">Configuration Options</h3>
          <div className="flex flex-col gap-2">
            {[
              { key: '2fa', label: '2FA Authenticator', icon: Key },
              { key: 'pin', label: 'Withdrawal PIN', icon: Lock },
              { key: 'sessions', label: 'Active Devices', icon: Activity }
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.key}
                  onClick={() => setActiveTab(btn.key as any)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-xs font-bold transition-all text-left ${
                    activeTab === btn.key 
                      ? 'border-brand bg-brand/5 text-brand shadow-[0_0_15px_rgba(0,255,136,0.08)]' 
                      : 'border-border/80 bg-bg-base/30 text-text-secondary hover:border-brand/45 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Detail box (right panel spans 2 columns) */}
        <div className="glass p-6 rounded-3xl lg:col-span-2 min-h-[300px]">
          <AnimatePresence mode="wait">
            
            {/* 2FA Authenticator */}
            {activeTab === '2fa' && (
              <motion.div 
                key="2fa"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white">Google Two-Factor Authenticator (2FA)</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Encrypts login checks and withdrawal authorizations.</p>
                </div>

                {is2faEnabled ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-brand/20 bg-brand/5 text-brand flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} />
                        <span className="font-bold text-white text-sm">Two-Factor Authentication is ACTIVE</span>
                      </div>
                      <button 
                        onClick={handleToggle2fa}
                        className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-lg font-bold transition-colors"
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-3.5">
                      <p className="text-text-secondary leading-normal">
                        To enable 2FA, scan the QR code using Google Authenticator or copy the Secret Key.
                      </p>
                      
                      <div className="bg-bg-base/40 border border-border p-3.5 rounded-xl space-y-2 font-semibold">
                        <span className="text-[10px] text-text-secondary uppercase">2FA Secret Key</span>
                        <div className="text-brand font-mono tracking-wider break-all select-all">
                          KBZW X4RY J5SZ K9AQ
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-text-secondary font-bold uppercase text-[10px] block">Enter 6-Digit Code</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            maxLength={6}
                            placeholder="000000"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="bg-bg-base border border-border rounded-xl px-4 py-2.5 outline-none focus:border-brand font-mono text-center text-white text-sm font-bold tracking-widest flex-1"
                          />
                          <button 
                            onClick={handleToggle2fa}
                            className="bg-brand text-black font-extrabold px-4 rounded-xl hover:bg-brand-hover transition-all text-xs"
                          >
                            Verify & Activate
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-bg-base/30 border border-border p-4 rounded-xl">
                      <QrCode size={100} className="text-white bg-white p-1 rounded" />
                      <span className="text-[9px] text-text-secondary mt-2">Scan code on Mobile Authenticator</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Withdrawal PIN */}
            {activeTab === 'pin' && (
              <motion.div 
                key="pin"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white">Security Withdrawal PIN</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Authorizes all deposit releases, transfers, and wallet operations.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-text-secondary font-semibold block mb-2">Current 4-Digit PIN</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      value={oldPin}
                      onChange={(e) => setOldPin(e.target.value)}
                      placeholder="••••" 
                      className="w-full bg-bg-base border border-border/80 rounded-xl py-3 text-center tracking-widest outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="text-text-secondary font-semibold block mb-2">New 4-Digit PIN</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="••••" 
                      className="w-full bg-bg-base border border-border/80 rounded-xl py-3 text-center tracking-widest outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="text-text-secondary font-semibold block mb-2">Confirm New PIN</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="••••" 
                      className="w-full bg-bg-base border border-border/80 rounded-xl py-3 text-center tracking-widest outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>
                </div>

                {pinError && (
                  <div className="text-xs text-rose-400 font-bold border border-rose-500/20 bg-rose-500/5 p-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={14} /> {pinError}
                  </div>
                )}

                {pinSuccess && (
                  <div className="text-xs text-brand font-bold border border-brand/20 bg-brand/5 p-3 rounded-lg flex items-center gap-2 animate-pulse">
                    <CheckCircle2 size={14} /> Withdrawal PIN successfully updated!
                  </div>
                )}

                <button 
                  onClick={handleUpdatePin}
                  className="w-full bg-brand text-black font-extrabold text-xs py-3.5 rounded-xl hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
                >
                  Update Withdrawal PIN
                </button>
              </motion.div>
            )}

            {/* Device Sessions Manager */}
            {activeTab === 'sessions' && (
              <motion.div 
                key="sessions"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="pb-2 border-b border-border/60 mb-2">
                  <h3 className="font-bold text-md text-white">Active Authorized Device Sessions</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Revoke any suspicious login session immediately.</p>
                </div>

                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div 
                      key={sess.id} 
                      className="flex justify-between items-center bg-bg-base/30 border border-border p-3.5 rounded-xl text-xs hover:border-brand/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {sess.name.includes('iPhone') ? (
                          <SmartphoneIcon className="text-brand w-5 h-5 shrink-0" />
                        ) : <Laptop className="text-brand w-5 h-5 shrink-0" />}
                        
                        <div>
                          <span className="font-bold text-white block">
                            {sess.name} 
                            {sess.status === 'Current' && (
                              <span className="text-[8px] bg-brand text-black font-extrabold px-1.5 py-0.5 rounded ml-2 uppercase">Current</span>
                            )}
                          </span>
                          <span className="text-[10px] text-text-secondary block mt-0.5">
                            IP: {sess.ip} • Location: {sess.location} • Browser: {sess.browser}
                          </span>
                        </div>
                      </div>

                      {sess.status !== 'Current' && (
                        <button 
                          onClick={() => revokeSession(sess.id)}
                          className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-lg text-[10px] font-bold transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Security messages toast */}
      <AnimatePresence>
        {sessionToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-bg-base border border-brand/30 p-4 rounded-xl shadow-[0_10px_35px_rgba(0,255,136,0.15)] flex items-center gap-3 text-xs"
          >
            <CheckCircle2 className="text-brand w-5 h-5 shrink-0" />
            <span className="text-white font-medium">{sessionToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tfaSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-bg-base border border-brand/30 p-4 rounded-xl shadow-[0_10px_35px_rgba(0,255,136,0.15)] flex items-center gap-3 text-xs"
          >
            <CheckCircle2 className="text-brand w-5 h-5 shrink-0" />
            <span className="text-white font-medium">{tfaSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
