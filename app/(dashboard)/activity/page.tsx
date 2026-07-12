'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  Activity, 
  Search, 
  Filter, 
  LogIn, 
  ShieldAlert, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Ticket, 
  Users, 
  Award,
  ChevronRight,
  Clock
} from 'lucide-react';

interface ActivityLog {
  id: string;
  category: 'Login' | 'Security' | 'Deposit' | 'Withdrawal' | 'Lottery' | 'Referrals' | 'Rewards';
  title: string;
  desc: string;
  date: string;
  time: string;
  ip: string;
  browser: string;
  status: 'success' | 'warning' | 'info';
}

const mockLogs: ActivityLog[] = [
  { id: 'log1', category: 'Login', title: 'User Login Authorized', desc: 'Successful login session generated for admin@inveracapital.com.', date: 'Jul 10, 2026', time: '09:23 AM', ip: '192.168.12.10', browser: 'Chrome v120 / Windows 11', status: 'success' },
  { id: 'log2', category: 'Deposit', title: 'Deposit Receipt Submitted', desc: 'Voucher receipt for $5,000.00 submitted for verification.', date: 'Jul 10, 2026', time: '10:45 AM', ip: '192.168.12.10', browser: 'Chrome v120 / Windows 11', status: 'info' },
  { id: 'log3', category: 'Security', title: 'Google 2FA Verification', desc: 'Completed login check using 2-factor authentication.', date: 'Jul 10, 2026', time: '09:24 AM', ip: '192.168.12.10', browser: 'Chrome v120 / Windows 11', status: 'success' },
  { id: 'log4', category: 'Rewards', title: 'Daily Bonus claimed', desc: 'Claimed sign-in allowance of $2.00 (Day 3 checkin).', date: 'Jul 10, 2026', time: '10:00 AM', ip: '192.168.12.10', browser: 'Chrome v120 / Windows 11', status: 'success' },
  { id: 'log5', category: 'Withdrawal', title: 'Withdrawal Authorized', desc: 'Withdrawal request of $1,200.00 dispatched to Habib Bank HBL.', date: 'Jul 08, 2026', time: '14:20 PM', ip: '182.29.41.98', browser: 'Safari v17 / iOS 17', status: 'info' },
  { id: 'log6', category: 'Lottery', title: 'Lottery Ticket Acquired', desc: 'Purchased entry ticket TKT-794502 for Weekly Draw.', date: 'Jul 07, 2026', time: '16:00 PM', ip: '192.168.12.10', browser: 'Chrome v120 / Windows 11', status: 'success' },
  { id: 'log7', category: 'Referrals', title: 'Referral Sign-Up Registered', desc: 'New user Lois Lane registered in Level 2 network node.', date: 'Jul 06, 2026', time: '18:12 PM', ip: 'System Contract', browser: 'Automated Node API', status: 'success' },
  { id: 'log8', category: 'Security', title: 'Password update attempt', desc: 'Account password settings successfully updated.', date: 'Jul 05, 2026', time: '11:00 AM', ip: '92.10.45.112', browser: 'Firefox v125 / MacOS', status: 'warning' }
];

export default function ActivityPage() {
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filters logic
  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.ip.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || log.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Login': return <LogIn size={15} />;
      case 'Security': return <ShieldAlert size={15} />;
      case 'Deposit': return <ArrowDownLeft size={15} />;
      case 'Withdrawal': return <ArrowUpRight size={15} />;
      case 'Lottery': return <Ticket size={15} />;
      case 'Referrals': return <Users size={15} />;
      case 'Rewards': return <Award size={15} />;
      default: return <Activity size={15} />;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
          Audit Logs
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Chronological timeline of system logins, wallet movements, and profile modifications.</p>
      </div>

      {/* Filter and search bar */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search Log Title, Description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-base border border-border rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-brand transition-colors text-white"
          />
        </div>

        <div className="flex items-center gap-2 bg-bg-base border border-border px-3 py-1.5 rounded-xl text-xs text-text-secondary w-full md:w-auto">
          <Filter size={12} />
          <span>Category:</span>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent border-none text-white outline-none cursor-pointer font-semibold"
          >
            <option value="All">All Events</option>
            <option value="Login">Logins</option>
            <option value="Security">Security Checks</option>
            <option value="Deposit">Deposits</option>
            <option value="Withdrawal">Withdrawals</option>
            <option value="Lottery">Lottery entries</option>
            <option value="Referrals">Referral Joins</option>
            <option value="Rewards">Rewards Claimed</option>
          </select>
        </div>
      </div>

      {/* Timeline logs */}
      <div className="glass p-6 rounded-3xl relative overflow-hidden">
        <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-0.5 before:bg-border/60">
          {filteredLogs.length === 0 ? (
            <p className="text-xs text-text-secondary text-center py-6">No matching logs found.</p>
          ) : (
            filteredLogs.map((log, index) => (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 relative group"
              >
                {/* Node icon indicator */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 z-10 transition-colors ${
                  log.status === 'success' 
                    ? 'bg-brand/10 border-brand/20 text-brand' 
                    : log.status === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                  {getCategoryIcon(log.category)}
                </div>

                {/* Log details */}
                <div className="flex-1 bg-bg-base/30 border border-border/80 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group-hover:border-brand/35 transition-colors">
                  <div className="space-y-1">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">{log.category} Event</span>
                    <h4 className="font-bold text-xs text-white">{log.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{log.desc}</p>
                    <span className="text-[9px] text-text-secondary/70 flex items-center gap-1 mt-1">
                      <Clock size={11} /> {log.date} at {log.time}
                    </span>
                  </div>

                  <div className="text-right text-[10px] text-text-secondary/80 font-mono space-y-0.5 self-end md:self-auto">
                    <p>IP: {log.ip}</p>
                    <p className="truncate max-w-[150px]" title={log.browser}>{log.browser}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
