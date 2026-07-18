'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  CheckCircle,
  DollarSign, 
  Eye, 
  Trash2,
  X
} from 'lucide-react';
import clsx from 'clsx';
import { useCurrency } from '@/components/CurrencyProvider';
import { toggleUserStatus, deleteUser } from './actions';

export default function UsersClient({ initialUsers, totalUsers }: { initialUsers: any[], totalUsers: number }) {
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(initialUsers);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setIsProcessing(userId);
    const res = await toggleUserStatus(userId, currentStatus);
    if (res.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: res.newStatus } : u));
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this user? This cannot be undone.')) return;
    setIsProcessing(userId);
    const res = await deleteUser(userId);
    if (res.success) {
      setUsers(users.filter(u => u.id !== userId));
    } else {
      alert(`Error: ${res.error}`);
      setIsProcessing(null);
    }
  };

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustUser, setAdjustUser] = useState<{ id: string, identifier: string } | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustField, setAdjustField] = useState<'balance' | 'totalProfit'>('balance');

  const openAdjustModal = (userId: string, identifier: string) => {
    setAdjustUser({ id: userId, identifier });
    setAdjustAmount('');
    setAdjustReason('');
    setAdjustType('add');
    setAdjustField('balance');
    setAdjustModalOpen(true);
  };

  const submitAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustUser || !adjustAmount || !adjustReason) return;
    
    setIsProcessing(adjustUser.id);
    setAdjustModalOpen(false);
    
    try {
      const m = await import('@/app/actions/adminActions');
      const res = await m.manuallyAdjustWallet(adjustUser.id, adjustAmount, adjustReason, adjustType, adjustField);
      if (res.success) {
        setUsers(users.map(u => {
          if (u.id === adjustUser.id) {
             const amt = Number(adjustAmount);
             const net = adjustType === 'add' ? amt : -amt;
             if (adjustField === 'balance') return { ...u, balance: (u.balance || 0) + net };
             return u;
          }
          return u;
        }));
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
    setIsProcessing(null);
  };


  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            User Management
          </h1>
          <p className="text-text-secondary text-sm font-medium">Control accounts, adjust balances, and monitor KYC compliance.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search username, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-[#0a0a0b] border border-white/10 hover:border-brand/40 focus:border-brand rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none transition-all text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0b] border border-white/10 rounded-xl text-sm font-semibold text-white hover:bg-white/5 transition-colors">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0b] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0f1115]">
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">User Info</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">KYC Level</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Wallet Balance</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Joined Date</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">No users found.</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/20 to-blue-500/20 border border-white/10 flex items-center justify-center font-bold text-white shadow-inner">
                        {user.username ? user.username.substring(0, 2).toUpperCase() : user.email?.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{user.username ? `@${user.username}` : 'No Username'}</p>
                        <p className="text-xs text-text-secondary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={clsx(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border",
                      user.status === 'ACTIVE' ? "bg-brand/10 text-brand border-brand/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {user.kycStatus === 'APPROVED' && <ShieldCheck size={14} className="text-teal-400" />}
                      {user.kycStatus === 'PENDING' && <ShieldAlert size={14} className="text-amber-400" />}
                      {(user.kycStatus === 'UNVERIFIED' || user.kycStatus === 'REJECTED') && <ShieldAlert size={14} className="text-rose-400" />}
                      <span className={clsx(
                        "text-xs font-semibold capitalize",
                        user.kycStatus === 'APPROVED' ? 'text-teal-400' : user.kycStatus === 'PENDING' ? 'text-amber-400' : 'text-rose-400'
                      )}>
                        {user.kycStatus?.toLowerCase()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-white">{formatCurrency(user.balance)}</span>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-1.5 text-text-secondary hover:text-brand hover:bg-brand/10 rounded-lg transition-colors" 
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => openAdjustModal(user.id, user.username || user.email)}
                        disabled={isProcessing === user.id}
                        className="p-1.5 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50" 
                        title="Adjust Balance"
                      >
                        <DollarSign size={16} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        disabled={isProcessing === user.id}
                        className="p-1.5 text-text-secondary hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors disabled:opacity-50" 
                        title={user.status === 'ACTIVE' ? "Suspend User" : "Activate User"}
                      >
                        {user.status === 'ACTIVE' ? <Ban size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={isProcessing === user.id}
                        className="p-1.5 text-text-secondary hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-text-secondary bg-[#0f1115]">
          <p>Showing {filteredUsers.length} of {totalUsers} users</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/5">Next</button>
          </div>
        </div>
      </motion.div>

    {/* Balance Adjustment Modal */}
      <AnimatePresence>
        {adjustModalOpen && adjustUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !isProcessing && setAdjustModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="text-lg font-bold text-white">Adjust User Balance</h3>
                  <p className="text-xs text-text-secondary mt-1">Modifying wallet for {adjustUser.identifier}</p>
                </div>
                <button 
                  onClick={() => setAdjustModalOpen(false)}
                  disabled={!!isProcessing}
                  className="p-2 text-text-secondary hover:text-white bg-white/5 rounded-xl transition-colors disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitAdjustBalance} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={clsx(
                      "p-3 rounded-xl border text-sm font-bold transition-all",
                      adjustType === 'add' 
                        ? "bg-brand/10 border-brand/40 text-brand shadow-[0_0_15px_rgba(0,255,136,0.15)]" 
                        : "bg-black/50 border-white/10 text-text-secondary hover:bg-white/5"
                    )}
                  >
                    Add Funds
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('deduct')}
                    className={clsx(
                      "p-3 rounded-xl border text-sm font-bold transition-all",
                      adjustType === 'deduct' 
                        ? "bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]" 
                        : "bg-black/50 border-white/10 text-text-secondary hover:bg-white/5"
                    )}
                  >
                    Deduct Funds
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Target Wallet</label>
                  <select 
                    value={adjustField}
                    onChange={(e) => setAdjustField(e.target.value as any)}
                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-brand focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] outline-none transition-all text-white font-medium"
                  >
                    <option value="balance">Main Available Balance</option>
                    <option value="totalProfit">Total Profit Earned</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input 
                      type="number" 
                      step="0.01"
                      min="0.01"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-brand focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] outline-none transition-all text-white font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Reason (Audit Log)</label>
                  <textarea 
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="e.g. Correcting deposit error, manual bonus..."
                    className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-brand focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] outline-none transition-all text-white font-medium h-24 resize-none"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={!!isProcessing}
                    className={clsx(
                      "w-full h-12 font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2",
                      adjustType === 'add' 
                        ? "bg-brand text-black hover:bg-brand-hover shadow-[0_0_20px_rgba(0,255,136,0.2)]" 
                        : "bg-rose-500 text-white hover:bg-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                    )}
                  >
                    {isProcessing === adjustUser.id ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>{adjustType === 'add' ? 'Confirm Addition' : 'Confirm Deduction'}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
