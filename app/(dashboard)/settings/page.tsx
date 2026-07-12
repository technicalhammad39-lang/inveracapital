'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  Settings, 
  Key, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  Eye, 
  Lock, 
  AlertTriangle,
  Globe,
  Bell,
  Coins,
  CheckCircle2,
  X
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  scopes: string[];
  created: string;
}

export default function SettingsPage() {
  const { formatCurrency, currency, setCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'general' | 'api'>('general');

  // Preferences General states
  const [prefLang, setPrefLang] = useState('EN');
  const [prefFee, setPrefFee] = useState('standard'); // standard, speed

  // API states
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: 'k1', name: 'Institutional Trading Bot', key: 'inv_live_a8f92jKls9021a84Hkl', scopes: ['Read Balances', 'Execute Trades'], created: 'Jun 10, 2026' }
  ]);
  
  // Create key states
  const [newKeyName, setNewKeyName] = useState('');
  const [readScope, setReadScope] = useState(true);
  const [writeScope, setWriteScope] = useState(false);
  const [ipRestrict, setIpRestrict] = useState('');

  // Generated secret key details modal state
  const [generatedKey, setGeneratedKey] = useState<ApiKey | null>(null);
  const [generatedSecret, setGeneratedSecret] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateKey = () => {
    if (!newKeyName) return;

    const scopes = [];
    if (readScope) scopes.push('Read Balances');
    if (writeScope) scopes.push('Execute Trades');

    const newKCode = `inv_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const secretCode = `inv_sec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const newApiKey: ApiKey = {
      id: `k-${Date.now()}`,
      name: newKeyName,
      key: newKCode,
      scopes,
      created: 'Just now'
    };

    setKeys([...keys, newApiKey]);
    setGeneratedKey(newApiKey);
    setGeneratedSecret(secretCode);
    setNewKeyName('');
    setIpRestrict('');
    setWriteScope(false);
    triggerToast('API Integration key successfully generated.');
  };

  const handleRemoveKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
    triggerToast('API access credential revoked.');
  };

  const copyToClipboard = (text: string, type: 'key' | 'secret') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
          Advanced Settings
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Configure system parameters, regional formats, and manage trader API integrations.</p>
      </div>

      {/* Main settings tabs */}
      <div className="flex bg-bg-base p-1.5 rounded-xl border border-border/80 max-w-xs">
        <button 
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'general' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Preferences
        </button>
        <button 
          onClick={() => setActiveTab('api')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'api' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          API Integrations
        </button>
      </div>

      {/* Tab Interface detail */}
      <div className="glass p-6 rounded-3xl min-h-[300px]">
        <AnimatePresence mode="wait">
          
          {/* General Preferences */}
          {activeTab === 'general' && (
            <motion.div 
              key="general"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="pb-2 border-b border-border/60">
                <h3 className="font-bold text-md text-white">General Preferences</h3>
                <p className="text-[11px] text-text-secondary mt-0.5">Control regional formats, currency displays, and transaction fees speeds.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Currency selector */}
                <div className="p-4.5 rounded-xl border border-border bg-bg-base/30 space-y-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="text-brand w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">Default Payout Currency</span>
                      <span className="text-[10px] text-text-secondary block mt-0.5">Choose primary denomination code.</span>
                    </div>
                  </div>

                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'PKR')}
                    className="bg-bg-card border border-border rounded-xl px-3 py-1.5 font-bold text-white cursor-pointer outline-none focus:border-brand"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="PKR">PKR (₨)</option>
                  </select>
                </div>

                {/* Language selector */}
                <div className="p-4.5 rounded-xl border border-border bg-bg-base/30 space-y-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="text-brand w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">System Translation Locale</span>
                      <span className="text-[10px] text-text-secondary block mt-0.5">Primary language file for pages.</span>
                    </div>
                  </div>

                  <select 
                    value={prefLang} 
                    onChange={(e) => {
                      setPrefLang(e.target.value);
                      triggerToast(`System language shifted to ${e.target.value === 'EN' ? 'English' : 'Urdu'}.`);
                    }}
                    className="bg-bg-card border border-border rounded-xl px-3 py-1.5 font-bold text-white cursor-pointer outline-none focus:border-brand"
                  >
                    <option value="EN">English (EN)</option>
                    <option value="UR">Urdu (اردو)</option>
                  </select>
                </div>

                {/* Gas fee tier */}
                <div className="p-4.5 rounded-xl border border-border bg-bg-base/30 space-y-3 flex items-center justify-between col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <Settings className="text-brand w-5 h-5 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">Network Gas Settlement Speed</span>
                      <span className="text-[10px] text-text-secondary block mt-0.5">Speed category for internal ledger transfers.</span>
                    </div>
                  </div>

                  <div className="flex bg-bg-base p-1 rounded-xl border border-border">
                    <button 
                      onClick={() => { setPrefFee('standard'); triggerToast('Transfer speed: Standard.'); }}
                      className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all ${
                        prefFee === 'standard' ? 'bg-brand text-black' : 'text-text-secondary hover:text-white'
                      }`}
                    >
                      STANDARD
                    </button>
                    <button 
                      onClick={() => { setPrefFee('speed'); triggerToast('Transfer speed: Instant Express.'); }}
                      className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all ${
                        prefFee === 'speed' ? 'bg-brand text-black animate-pulse' : 'text-text-secondary hover:text-white'
                      }`}
                    >
                      INSTANT GAS (+0.1%)
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* API Keys Configuration */}
          {activeTab === 'api' && (
            <motion.div 
              key="api"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="pb-2 border-b border-border/60">
                <h3 className="font-bold text-md text-white">Institutional Developer API Access</h3>
                <p className="text-[11px] text-text-secondary mt-0.5">Integrate trading terminals using secure programmatic secret tokens.</p>
              </div>

              {/* Generate new key form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs bg-bg-base/20 border border-border p-4.5 rounded-2xl">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Key Identifier Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Algo Bot Payouts" 
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full bg-bg-base border border-border rounded-xl py-2.5 px-3 outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Ip Restriction (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 192.168.1.1 (comma separated)" 
                      value={ipRestrict}
                      onChange={(e) => setIpRestrict(e.target.value)}
                      className="w-full bg-bg-base border border-border rounded-xl py-2.5 px-3 outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>
                </div>

                {/* Scopes checklist */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <label className="text-text-secondary font-semibold block mb-1">Access Scope Permissions</label>
                    
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-white select-none">
                      <input 
                        type="checkbox" 
                        checked={readScope}
                        onChange={() => setReadScope(!readScope)}
                        className="accent-brand" 
                      />
                      <span>Read Balances & history</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-white select-none">
                      <input 
                        type="checkbox" 
                        checked={writeScope}
                        onChange={() => setWriteScope(!writeScope)}
                        className="accent-brand" 
                      />
                      <span>Execute Withdrawals & Trades</span>
                    </label>
                  </div>

                  <button 
                    onClick={handleGenerateKey}
                    className="w-full bg-brand text-black font-extrabold text-xs py-3 rounded-xl hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Generate API Key
                  </button>
                </div>
              </div>

              {/* List of active keys */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-text-secondary uppercase tracking-wider pl-1">Active Credentials</h4>
                {keys.length === 0 ? (
                  <p className="text-xs text-text-secondary pl-1">No active API keys found.</p>
                ) : (
                  keys.map((k) => (
                    <div key={k.id} className="flex justify-between items-center bg-bg-base/30 border border-border p-3.5 rounded-xl text-xs">
                      <div className="flex items-center gap-3">
                        <Key className="text-brand w-5 h-5 shrink-0 animate-pulse" />
                        <div>
                          <span className="font-bold text-white block">{k.name}</span>
                          <span className="text-[10px] text-text-secondary block mt-0.5">
                            Client Key: <strong className="text-white font-mono">{k.key.substring(0, 16)}...</strong> • Scope: <strong className="text-brand">{k.scopes.join(', ')}</strong> • Created: {k.created}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleRemoveKey(k.id)}
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

        </AnimatePresence>
      </div>

      {/* Secret Key Display Modal */}
      <AnimatePresence>
        {generatedKey && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-base border border-border/80 rounded-3xl max-w-md w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="p-5 border-b border-border/60 bg-bg-card/10 flex justify-between items-center">
                <span className="font-bold text-sm text-white flex items-center gap-1.5"><Lock size={16} className="text-brand" /> Secret Credentials Generated</span>
                <button onClick={() => setGeneratedKey(null)} className="p-1 hover:bg-white/5 rounded">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5 text-xs">
                
                <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-xl text-amber-500 flex items-start gap-2.5 leading-normal">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5">WARNING: Copy values immediately!</p>
                    <p>For your security, these secret credentials are displayed only ONCE. They cannot be retrieved after closing this window.</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-secondary font-semibold uppercase">API Client Key</span>
                    <div className="flex bg-bg-base border border-border rounded-xl p-3 items-center justify-between">
                      <span className="font-mono text-white font-bold select-all overflow-x-auto no-scrollbar">{generatedKey.key}</span>
                      <button 
                        onClick={() => copyToClipboard(generatedKey.key, 'key')}
                        className="text-text-secondary hover:text-brand p-1 transition-colors"
                      >
                        {copiedKey ? <Check size={14} className="text-brand" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-text-secondary font-semibold uppercase">API Secret Token</span>
                    <div className="flex bg-bg-base border border-border rounded-xl p-3 items-center justify-between">
                      <span className="font-mono text-white font-bold select-all overflow-x-auto no-scrollbar">{generatedSecret}</span>
                      <button 
                        onClick={() => copyToClipboard(generatedSecret, 'secret')}
                        className="text-text-secondary hover:text-brand p-1 transition-colors"
                      >
                        {copiedSecret ? <Check size={14} className="text-brand" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setGeneratedKey(null)}
                  className="w-full bg-brand text-black font-extrabold text-xs py-3.5 rounded-xl hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all uppercase tracking-wider"
                >
                  I have saved credentials
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Toast */}
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
