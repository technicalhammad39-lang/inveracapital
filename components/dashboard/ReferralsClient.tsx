'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { PremiumEmptyState } from '@/components/PremiumEmptyState';
import { 
  Copy, Users, Network, Award, ChevronRight, ChevronDown, 
  Check, TrendingUp, Trophy, Share2, DollarSign, Activity
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ReferralsClient({ 
  dbStats, 
  dbTree, 
  dbLeaderboard,
  dbLogs
}: { 
  dbStats?: any, 
  dbTree?: any[], 
  dbLeaderboard?: any[],
  dbLogs?: any[]
}) {
  const { formatCurrency } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(dbStats?.code ? `${window.location.origin}/ref/${dbStats.code}` : '');
  
  // Tree toggle state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root': true
  });

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(copiedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const RenderTreeNode = ({ node }: { node: any }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedNodes[node.id];

    return (
      <div className="flex flex-col gap-2 relative">
        <div 
          onClick={() => hasChildren && toggleNode(node.id)}
          className={`flex items-center gap-3 bg-bg-base border rounded-xl p-3.5 transition-colors cursor-pointer group select-none ${
            node.active ? 'border-border/80 hover:border-brand/40' : 'border-border/40 opacity-75'
          }`}
        >
          {/* Avatar / Level */}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border border-white/5 ${
            node.level === 1 ? 'bg-brand/20 text-brand' : 
            node.level === 2 ? 'bg-blue-500/10 text-blue-400' : 
            'bg-purple-500/10 text-purple-400'
          }`}>
            {node.avatar || 'L' + node.level}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-white truncate flex items-center gap-2">
              {node.name}
              {!node.active && <span className="text-[9px] bg-rose-500/10 text-rose-500 border border-rose-500/20 font-bold px-1.5 py-0.5 rounded-full uppercase">Inactive</span>}
            </div>
            <div className="text-[10px] text-text-secondary mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
              <span>Invested: <strong className="text-white">{formatCurrency(node.totalInvested)}</strong></span>
              <span>• Team Size: <strong className="text-white">{node.teamSize}</strong></span>
              <span>• Joined: <strong className="text-text-secondary">{node.joined}</strong></span>
            </div>
          </div>

          {hasChildren && (
            <button className="text-text-secondary/70 group-hover:text-brand transition-colors p-1">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="pl-6 border-l border-border/80 ml-4 space-y-3 pt-1">
            {node.children.map((child: any) => (
              <RenderTreeNode key={child.id} node={child} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
          Referral Center
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Build your secondary network tree to secure multi-level commission payouts.</p>
      </div>

      {/* Referral Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Network Count', value: dbStats?.totalTeam || 0, icon: Users },
          { label: 'Active Partners', value: dbStats?.activeTeam || 0, icon: TrendingUp },
          { label: 'Total Earnings', value: dbStats?.totalCommissions || 0, icon: Award, currency: true }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="animated-gradient-border group"
            >
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <span className="text-text-secondary text-[11px] font-bold tracking-wider block uppercase">
                      {stat.label}
                    </span>
                  </div>
                  <Icon className="w-6 h-6 text-brand shrink-0 opacity-80" />
                </div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {stat.currency ? formatCurrency(stat.value) : stat.value}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hero configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Referral Link Copy panel */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h3 className="font-bold text-md text-white">Your Network Link</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="text-xs text-text-secondary leading-relaxed">
                  <strong className="text-white font-bold block mb-1">How to invite your partners:</strong>
                  1. Copy your unique referral code link below.<br/>
                  2. Distribute it to your team partners or post it on social media.<br/>
                  3. When they deposit, <strong className="text-brand font-bold">multi-level commissions</strong> will credit instantly to your referral wallet.
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-bg-base border border-border/80 rounded-xl px-4 py-3 text-xs font-mono text-white overflow-hidden text-ellipsis whitespace-nowrap flex items-center">
                    {copiedLink}
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="bg-brand text-black px-5 rounded-xl font-bold text-xs hover:bg-brand-hover active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 p-4 bg-bg-base/40 border border-border/85 rounded-2xl h-full">
                <div className="w-28 h-28 md:w-36 md:h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                  <QRCode 
                    value={copiedLink} 
                    size={144} 
                    style={{ height: "100%", width: "100%" }}
                    viewBox={`0 0 144 144`}
                  />
                </div>
                <span className="text-[10px] text-text-secondary text-center font-extrabold uppercase tracking-widest">L1 Sign Up QR Link</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analytics Growth Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass p-6 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-center pb-2 border-b border-border/60 mb-4">
            <h3 className="font-bold text-md text-white flex items-center gap-2">
              <Activity size={18} className="text-brand" /> Commission Growth
            </h3>
          </div>
          
          <div className="h-[180px] w-full pr-2">
            {dbStats?.commissionHistory && dbStats.commissionHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dbStats.commissionHistory} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} dx={-10} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: 11, color: '#fff' }}
                  />
                  <Bar dataKey="amount" fill="#00ff88" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">
                Not enough history to generate chart.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Network Tree */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl"
        >
          <div className="flex justify-between items-center pb-4 border-b border-border/60 mb-6">
            <h3 className="font-bold text-md text-white flex items-center gap-2">
              <Network size={18} className="text-brand" /> Interactive Network Tree
            </h3>
            <span className="text-[10px] bg-brand/10 text-brand px-2 py-1 rounded-full uppercase tracking-wider font-bold">
              Levels 1-3
            </span>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {!dbTree || dbTree.length === 0 ? (
              <PremiumEmptyState 
                title="You haven't invited anyone yet"
                description="Share your referral link to start building your network."
                icon={Share2}
              />
            ) : (
              <div className="space-y-4">
                {/* Root Note representation */}
                <div 
                  onClick={() => toggleNode('root')}
                  className="flex items-center gap-3 bg-brand/5 border border-brand/20 rounded-xl p-3.5 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-brand text-black">
                    You
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      My Network Root
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5">
                      {dbStats?.totalTeam || 0} Total Partners
                    </div>
                  </div>
                  <button className="text-brand">
                    {expandedNodes['root'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                </div>

                {expandedNodes['root'] && (
                  <div className="pl-6 border-l border-brand/30 ml-4 space-y-3 pt-1">
                    {dbTree.map((child: any) => (
                      <RenderTreeNode key={child.id} node={child} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Commission Logs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-2xl flex flex-col h-[520px]"
        >
          <div className="flex justify-between items-center pb-4 border-b border-border/60 mb-6 shrink-0">
            <h3 className="font-bold text-md text-white flex items-center gap-2">
              <DollarSign size={18} className="text-brand" /> Commission Revenue Logs
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {!dbLogs || dbLogs.length === 0 ? (
              <PremiumEmptyState 
                title="No commission history yet"
                description="When your referrals invest, commissions will appear here."
                icon={DollarSign}
                className="h-full"
              />
            ) : (
              dbLogs.map((log: any) => (
                <div key={log.id} className="flex justify-between items-center p-3.5 bg-bg-base/40 border border-border/80 rounded-xl hover:border-brand/30 transition-colors group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center border border-brand/20">
                      <Award size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        {log.sourceUser}
                        <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md text-text-secondary">Level {log.level}</span>
                      </div>
                      <div className="text-[10px] text-text-secondary mt-1">{log.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-brand">+{formatCurrency(log.amount)}</div>
                    <div className="text-[9px] text-brand/70 uppercase tracking-widest mt-1">Credited</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Global Leaderboard */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border/60 bg-bg-card/25">
          <h3 className="font-bold text-md text-white flex items-center gap-2">
            <Trophy size={16} className="text-brand" /> Global Referral Leaderboard
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">Top-performing referrers ranking by current cycle volume.</p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left min-w-[800px]">
            <thead className="text-text-secondary bg-bg-base/40 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Partner Name</th>
                <th className="px-6 py-4">Rank Tier</th>
                <th className="px-6 py-4">Network Size</th>
                <th className="px-6 py-4">Net Payout Accrued</th>
                <th className="px-6 py-4 text-right">Commission Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {(dbLeaderboard || []).length > 0 ? (
                dbLeaderboard!.map((ldr) => (
                  <tr key={ldr.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{ldr.rank}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                          {ldr.avatar}
                        </div>
                        <span className="font-bold text-text-primary">{ldr.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ldr.tier.includes('Diamond') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        ldr.tier.includes('Gold') ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {ldr.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{ldr.networkSize} users</td>
                    <td className="px-6 py-4 font-bold text-brand glow-text">{formatCurrency(ldr.earnings)}</td>
                    <td className="px-6 py-4 text-right font-bold text-white">{ldr.rate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <PremiumEmptyState 
                      title="No Leaderboard Data"
                      description="Network rankings will appear once commissions start accumulating."
                      icon={Trophy}
                      className="border-none bg-transparent"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
