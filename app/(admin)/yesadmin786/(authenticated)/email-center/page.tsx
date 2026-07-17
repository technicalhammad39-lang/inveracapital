'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, History, Search } from 'lucide-react';
// import { getEmailLogs, sendCustomEmail } from '@/app/actions/adminEmailActions';

export default function AdminEmailCenterPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'logs'>('compose');
  const [logs, setLogs] = useState<any[]>([]);

  // useEffect(() => {
  //   if (activeTab === 'logs') {
  //     // fetch logs
  //   }
  // }, [activeTab]);

  return (
    <div className="p-6 pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <Mail size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Email Center</h1>
          <p className="text-text-secondary text-sm">Send mass emails, newsletters, and view delivery logs.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('compose')}
          className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'compose' ? 'bg-brand/10 text-brand' : 'text-text-secondary hover:text-white hover:bg-white/5'
          }`}
        >
          <Send size={16} /> Compose
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'logs' ? 'bg-brand/10 text-brand' : 'text-text-secondary hover:text-white hover:bg-white/5'
          }`}
        >
          <History size={16} /> Delivery Logs
        </button>
      </div>

      {activeTab === 'compose' && (
        <div className="bg-bg-card border border-white/5 rounded-2xl p-6 sm:p-8 max-w-4xl">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">To (Target Group)</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none appearance-none">
                  <option value="ALL">All Users</option>
                  <option value="VERIFIED">Verified Users</option>
                  <option value="VIP">VIP Investors</option>
                  <option value="SUBSCRIBERS">Newsletter Subscribers</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none"
                  placeholder="Invera Update: Q4 Returns"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Message Body (HTML Supported)</label>
              <textarea
                rows={10}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 outline-none font-mono text-sm"
                placeholder="<h1>Hello Investor,</h1><p>Welcome to our latest update...</p>"
              />
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-brand text-bg-base font-bold py-3.5 px-8 rounded-xl hover:bg-brand-hover transition-all"
            >
              <Send size={18} /> Send Campaign
            </button>
          </form>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Delivery Logs</h2>
            <div className="relative w-64">
              <input 
                type="text" 
                placeholder="Search emails..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-brand/50 outline-none"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-text-secondary uppercase tracking-wider">
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Recipient</th>
                  <th className="pb-3 px-4">Subject</th>
                  <th className="pb-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Skeleton Data for now */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-sm text-white">Just now</td>
                  <td className="py-4 px-4 text-sm text-text-secondary">demo@inveracapital.com</td>
                  <td className="py-4 px-4 text-sm text-white">SMTP Configuration Test</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-brand/10 text-brand rounded text-xs font-bold">SENT</span>
                  </td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-sm text-white">1 hr ago</td>
                  <td className="py-4 px-4 text-sm text-text-secondary">john.doe@example.com</td>
                  <td className="py-4 px-4 text-sm text-white">Reset Your Password</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-rose-500/10 text-rose-500 rounded text-xs font-bold">FAILED</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
