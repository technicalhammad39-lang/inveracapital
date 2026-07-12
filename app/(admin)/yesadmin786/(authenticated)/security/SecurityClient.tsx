'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Search, Filter, History } from 'lucide-react';
import clsx from 'clsx';

export default function SecurityClient({ logs }: { logs: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = logs.filter(log => 
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.admin?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.targetType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Security & Audit Logs
          </h1>
          <p className="text-text-secondary text-sm font-medium">Monitor admin activity and critical system changes.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search action or admin..." 
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0b] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0f1115]">
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Date & Time</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Admin</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Action</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Target Type</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Target ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary">
                    <History size={48} className="mx-auto mb-3 opacity-20" />
                    No audit logs found.
                  </td>
                </tr>
              ) : filtered.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{log.admin?.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-semibold text-white">{log.action}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-text-secondary">
                      {log.targetType}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-mono text-text-secondary truncate block max-w-[150px]" title={log.targetId}>
                      {log.targetId}
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
