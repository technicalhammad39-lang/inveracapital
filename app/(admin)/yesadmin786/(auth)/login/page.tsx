'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, User, KeyRound, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { adminLogin } from '@/app/actions/adminActions';

export default function AdminLogin() {
  const router = useRouter();
  const [role, setRole] = useState('super_admin');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('invera@admin.com');
  const [password, setPassword] = useState('HammadCEO.786');
  const [error, setError] = useState('');

  const roles = [
    { id: 'super_admin', label: 'Super Admin', color: 'text-brand' },
    { id: 'finance', label: 'Finance Manager', color: 'text-blue-400' },
    { id: 'support', label: 'Support Agent', color: 'text-purple-400' },
    { id: 'compliance', label: 'Compliance Officer', color: 'text-amber-400' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await adminLogin(email, role, password);
    
    if (res.success) {
      router.push('/yesadmin786');
      router.refresh();
    } else {
      setError(res.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-hover shadow-[0_0_30px_rgba(0,255,136,0.3)] flex items-center justify-center mx-auto mb-6 relative group">
            <ShieldCheck size={32} className="text-black" />
            <div className="absolute w-2 h-2 bg-white rounded-full top-0 right-0 animate-ping" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">INVERA CAPITAL</h1>
          <p className="text-brand font-semibold text-sm tracking-widest uppercase mt-2">Institutional Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="glass p-8 rounded-3xl space-y-6 shadow-2xl border border-border/80">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Authorized Role</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={clsx(
                      "p-3 rounded-xl border text-xs font-bold transition-all text-left",
                      role === r.id 
                        ? "bg-brand/10 border-brand/50 shadow-[0_0_15px_rgba(0,255,136,0.15)] text-white" 
                        : "bg-bg-base/50 border-border/60 text-text-secondary hover:border-brand/30"
                    )}
                  >
                    <span className={clsx("block mb-1", role === r.id ? r.color : "text-text-secondary")}>
                      {r.id === 'super_admin' && <ShieldCheck size={14} />}
                      {r.id === 'finance' && <Lock size={14} />}
                      {r.id === 'support' && <User size={14} />}
                      {r.id === 'compliance' && <KeyRound size={14} />}
                    </span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Admin Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-base border border-border/80 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-brand focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] outline-none transition-all text-white font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Secure Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-bg-base border border-border/80 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-brand focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] outline-none transition-all text-white font-medium tracking-widest"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-rose-500 text-xs font-bold text-center bg-rose-500/10 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-brand text-black font-extrabold text-sm rounded-xl hover:bg-brand-hover active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                AUTHENTICATE SESSION
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <p className="text-[10px] text-text-secondary/60 text-center uppercase tracking-widest mt-6">
            Protected by Invera Enterprise Security
          </p>
        </form>
      </motion.div>
    </div>
  );
}
