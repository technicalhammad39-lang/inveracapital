'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  Copy, 
  Users, 
  Network, 
  Award, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  QrCode, 
  Share2, 
  TrendingUp, 
  Trophy, 
  Plus, 
  Minus 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

// Analytics commission and growth data
const commissionHistory = [
  { name: 'Feb', amount: 800 },
  { name: 'Mar', amount: 1500 },
  { name: 'Apr', amount: 1200 },
  { name: 'May', amount: 2400 },
  { name: 'Jun', amount: 4800 },
  { name: 'Jul', amount: 6250 },
];

const teamJoins = [
  { name: 'Jul 04', joins: 3 },
  { name: 'Jul 05', joins: 8 },
  { name: 'Jul 06', joins: 12 },
  { name: 'Jul 07', joins: 5 },
  { name: 'Jul 08', joins: 14 },
  { name: 'Jul 09', joins: 19 },
  { name: 'Jul 10', joins: 24 },
];

// Recursive Node interface for Referral Tree
interface ReferralNode {
  name: string;
  level: number;
  active: boolean;
  team: number;
  earnings: number;
  joined: string;
  children?: ReferralNode[];
}

const initialTreeData: ReferralNode = {
  name: "You (Admin User)",
  level: 0,
  active: true,
  team: 124,
  earnings: 12450,
  joined: "System Root",
  children: [
    {
      name: "Sarah Connor",
      level: 1,
      active: true,
      team: 45,
      earnings: 4500,
      joined: "Mar 10, 2026",
      children: [
        { name: "John Wick", level: 2, active: true, team: 12, earnings: 1800, joined: "Apr 02, 2026" },
        { name: "Bruce Wayne", level: 2, active: false, team: 0, earnings: 0, joined: "May 19, 2026" }
      ]
    },
    {
      name: "Clark Kent",
      level: 1,
      active: true,
      team: 62,
      earnings: 6800,
      joined: "Jan 12, 2026",
      children: [
        { name: "Lois Lane", level: 2, active: true, team: 32, earnings: 3500, joined: "Feb 01, 2026" },
        { name: "Barry Allen", level: 2, active: true, team: 8, earnings: 450, joined: "Jun 14, 2026" }
      ]
    },
    {
      name: "Diana Prince",
      level: 1,
      active: false,
      team: 17,
      earnings: 1150,
      joined: "May 25, 2026"
    }
  ]
};

export default function ReferralsPage() {
  const { formatCurrency } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState('https://inveracapital.com/ref/adminVIP24');
  const [showQr, setShowQr] = useState(false);

  // Tree toggle state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "You (Admin User)": true,
    "Sarah Connor": false,
    "Clark Kent": false
  });

  const toggleNode = (name: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(copiedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Recursive Tree Node Renderer Component
  const RenderTreeNode = ({ node }: { node: ReferralNode }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedNodes[node.name];

    return (
      <div className="flex flex-col gap-2 relative">
        <div 
          onClick={() => hasChildren && toggleNode(node.name)}
          className={`flex items-center gap-3 bg-bg-base border rounded-xl p-3.5 transition-colors cursor-pointer group select-none ${
            node.active ? 'border-border/80 hover:border-brand/40' : 'border-border/40 opacity-75'
          }`}
        >
          {/* Level indicators */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
            node.level === 0 ? 'bg-brand/20 text-brand' : node.level === 1 ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
          }`}>
            L{node.level}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-white truncate flex items-center gap-2">
              {node.name}
              {node.level === 0 && <span className="text-[8px] bg-brand text-black font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Root</span>}
            </div>
            <div className="text-[10px] text-text-secondary mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
              <span>Earnings: <strong className="text-white">{formatCurrency(node.earnings)}</strong></span>
              <span>• Team Size: <strong className="text-white">{node.team}</strong></span>
              <span>• Joined: <strong className="text-text-secondary">{node.joined}</strong></span>
            </div>
          </div>

          {hasChildren && (
            <button className="text-text-secondary/70 group-hover:text-brand transition-colors p-1">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
        </div>

        {/* Render child nodes recursively */}
        {hasChildren && isExpanded && (
          <div className="pl-6 border-l border-border/80 ml-4 space-y-3 pt-1">
            {node.children!.map((child) => (
              <RenderTreeNode key={child.name} node={child} />
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

      {/* 3 Referral Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Network Count', value: 124, badge: 'Total Enrolled', icon: Users, isPositive: true },
          { label: 'Active Partners', value: 89, badge: 'Yield Deployers', icon: TrendingUp, isPositive: true },
          { label: 'Total Earnings', value: 12450, badge: 'Commission Payout', icon: Award, isPositive: true, currency: true }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="animated-gradient-border group cursor-pointer"
            >
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <span className="text-text-secondary text-[10px] font-bold tracking-wider block uppercase">
                      {stat.label}
                    </span>
                    <span className="bg-brand/10 text-brand border border-brand/25 shadow-[0_0_10px_rgba(0,255,136,0.05)] text-[9px] font-extrabold px-2 py-0.5 rounded-full inline-block tracking-wider uppercase">
                      {stat.badge}
                    </span>
                  </div>
                  <Icon className="w-5 h-5 text-brand transition-transform duration-300 shrink-0" />
                </div>

                <div className="flex items-end justify-between pt-2">
                  <div className="space-y-1.5">
                    <div className="text-2xl font-extrabold text-white tracking-tight">
                      {stat.currency ? formatCurrency(stat.value) : stat.value}
                    </div>
                  </div>
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
              
              {/* Left Column: Link Copier & Instructions */}
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

              {/* Right Column: QR Code Display directly */}
              <div className="flex flex-col items-center gap-2 p-3 bg-bg-base/40 border border-border/85 rounded-2xl">
                <svg className="w-24 h-24 bg-white p-2 rounded-xl" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#fff" />
                  <rect x="5" y="5" width="20" height="20" fill="#000" />
                  <rect x="9" y="9" width="12" height="12" fill="#fff" />
                  <rect x="75" y="5" width="20" height="20" fill="#000" />
                  <rect x="79" y="9" width="12" height="12" fill="#fff" />
                  <rect x="5" y="75" width="20" height="20" fill="#000" />
                  <rect x="9" y="79" width="12" height="12" fill="#fff" />
                  <rect x="35" y="5" width="10" height="30" fill="#000" />
                  <rect x="55" y="15" width="15" height="10" fill="#000" />
                  <rect x="30" y="45" width="40" height="15" fill="#000" />
                  <rect x="15" y="35" width="10" height="25" fill="#000" />
                  <rect x="75" y="40" width="20" height="30" fill="#000" />
                  <rect x="40" y="70" width="25" height="20" fill="#000" />
                </svg>
                <span className="text-[9px] text-text-secondary text-center font-bold">L1 Sign Up QR Link</span>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Milestone VIP details */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass p-6 rounded-2xl text-center flex flex-col justify-between items-center"
        >
          <div className="space-y-4 w-full">
            <Award size={48} className="text-brand animate-pulse mx-auto" />
            
            <div>
              <h3 className="font-extrabold text-lg text-white">Gold Partner</h3>
              <p className="text-xs text-text-secondary">Active Network Commission Tier</p>
            </div>

            <div className="space-y-2 pt-2 text-xs w-full">
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="text-text-secondary">Level 1 Commission</span>
                <span className="font-bold text-brand">7% Payout</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="text-text-secondary">Level 2 Commission</span>
                <span className="font-bold text-brand">3% Payout</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                <span className="text-text-secondary">Level 3 Commission</span>
                <span className="font-bold text-brand">1% Payout</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-1.5 mt-6">
            <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand h-full" style={{ width: '70%' }} />
            </div>
            <div className="flex justify-between text-[9px] font-semibold text-text-secondary">
              <span>Progress to Platinum Partner</span>
              <span className="text-white">89/120 Active Ref</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Network Tree & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Network Tree Expandable */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl"
        >
          <div className="flex justify-between items-center pb-2 border-b border-border/60 mb-6">
            <h3 className="font-bold text-md text-white flex items-center gap-2">
              <Network size={18} className="text-brand" /> Interactive Network Tree
            </h3>
          </div>
          
          <div className="space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
            <RenderTreeNode node={initialTreeData} />
          </div>
        </motion.div>

        {/* Analytics Charts */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-border/60 mb-4">
              <h3 className="font-bold text-md text-white flex items-center gap-2">
                <Trophy size={18} className="text-brand" /> Commission Revenue Logs
              </h3>
            </div>
            
            <div className="h-[180px] w-full pr-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commissionHistory} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
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
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center pt-4 border-t border-border/60 mb-3 text-xs">
              <span className="font-bold text-white">Daily Network Growth joins</span>
              <span className="text-brand font-bold">+24 Today</span>
            </div>
            
            <div className="h-[100px] w-full pr-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={teamJoins}>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: 11, color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="joins" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referrals leaderboard */}
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
          <table className="w-full text-xs text-left min-w-[600px]">
            <thead className="text-text-secondary bg-bg-base/40 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Rank position</th>
                <th className="px-6 py-4">Partner Name</th>
                <th className="px-6 py-4">Rank Tier</th>
                <th className="px-6 py-4">Active Team size</th>
                <th className="px-6 py-4">Net Payout Accrued</th>
                <th className="px-6 py-4 text-right">Commission Multiplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                { rank: '🥇 1st', name: 'John Wick', tier: 'Diamond Partner', team: 420, earnings: 45000, rate: '12%' },
                { rank: '🥈 2nd', name: 'Sarah Connor', tier: 'Gold Partner', team: 124, earnings: 12450, rate: '7%' },
                { rank: '🥉 3rd', name: 'Clark Kent', tier: 'Gold Partner', team: 92, earnings: 9200, rate: '7%' },
                { rank: '4th', name: 'Diana Prince', tier: 'Silver Partner', team: 45, earnings: 3800, rate: '5%' }
              ].map((ldr) => (
                <tr key={ldr.name} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{ldr.rank}</td>
                  <td className="px-6 py-4 font-bold text-text-primary">{ldr.name}</td>
                  <td className="px-6 py-4 text-text-secondary">{ldr.tier}</td>
                  <td className="px-6 py-4 font-bold text-white">{ldr.team} partners</td>
                  <td className="px-6 py-4 font-bold text-brand">{formatCurrency(ldr.earnings)}</td>
                  <td className="px-6 py-4 text-right font-bold text-brand">{ldr.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
