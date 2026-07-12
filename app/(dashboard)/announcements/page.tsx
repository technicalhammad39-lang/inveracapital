'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  Megaphone, 
  Calendar, 
  Tag, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Coins,
  Settings
} from 'lucide-react';

interface Notice {
  id: string;
  tag: 'System' | 'Strategy' | 'Security' | 'Referral';
  title: string;
  desc: string;
  content: string;
  date: string;
  important: boolean;
}

const mockNotices: Notice[] = [
  {
    id: 'n-1',
    tag: 'Strategy',
    title: 'Elite VIP Fund Strategy Lockups Expanded',
    desc: 'Newly updated Elite VIP yields compound yields up to 2.8% daily.',
    content: 'We have updated the lockup contracts for the Elite VIP Fund, adding compound options directly. Users locking capital for 90 days will now earn 2.8% daily settlements, with payouts paid every 24 hours starting July 12.',
    date: 'Jul 10, 2026',
    important: true
  },
  {
    id: 'n-2',
    tag: 'System',
    title: 'Database Sync and Node Upgrades maintenance',
    desc: 'Scheduled ledger maintenance on July 12 at 02:00 GMT.',
    content: 'Our core database nodes will undergo scheduled maintenance to expand RPC API capacity for institutional traders. Transfer services and deposit verification might experience brief 5-minute lags. Payout credits will continue without interruption.',
    date: 'Jul 08, 2026',
    important: false
  },
  {
    id: 'n-3',
    tag: 'Security',
    title: 'Enhanced 2FA controls for withdrawal dispatches',
    desc: 'Google Authenticator checking required for all transfers above $1,000.',
    content: 'To secure client holdings from fraudulent sessions, withdrawals exceeding $1,000.00 equivalent now require immediate verification checks using a Google Authenticator code in addition to your Withdrawal PIN.',
    date: 'Jul 05, 2026',
    important: true
  },
  {
    id: 'n-4',
    tag: 'Referral',
    title: 'Double Commission Campaign launches for Gold partners',
    desc: 'Enjoy Gold Referral tier payout bonuses of 1.5x speed throughout this week.',
    content: 'Invite new stakers and enjoy double bonuses! For the next 7 days, Gold Partners will earn 1.5x commission payouts across Level 1, 2, and 3 referral sign-ups.',
    date: 'Jul 01, 2026',
    important: false
  }
];

export default function AnnouncementsPage() {
  const { formatCurrency } = useCurrency();
  const [activeTag, setActiveTag] = useState('All');
  const [expandedNotice, setExpandedNotice] = useState<string | null>('n-1'); // Expanded first notice by default

  const toggleNotice = (id: string) => {
    setExpandedNotice(expandedNotice === id ? null : id);
  };

  const filteredNotices = mockNotices.filter(n => activeTag === 'All' || n.tag === activeTag);

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Strategy': return 'bg-brand/10 border-brand/20 text-brand';
      case 'System': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'Security': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'Referral': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      default: return 'bg-border/60 border-border text-text-secondary';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
          Official Notice Board
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Stay updated with system announcements, strategy deployments, and maintenance schedules.</p>
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap gap-2.5">
        {['All', 'Strategy', 'System', 'Security', 'Referral'].map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTag === tag 
                ? 'border-brand bg-brand/5 text-brand shadow-[0_0_12px_rgba(0,255,136,0.08)]' 
                : 'border-border bg-bg-base text-text-secondary hover:border-brand/45 hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="glass p-8 text-center text-xs text-text-secondary rounded-2xl">
            No notices published under the selected category.
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const isOpen = expandedNotice === notice.id;
            return (
              <motion.div 
                key={notice.id}
                layout
                className={`glass rounded-2xl overflow-hidden border transition-colors ${
                  isOpen ? 'border-brand/20 bg-brand/[0.01]' : 'border-border/80'
                }`}
              >
                {/* Header card */}
                <div 
                  onClick={() => toggleNotice(notice.id)}
                  className="p-5 flex justify-between items-center cursor-pointer select-none gap-6"
                >
                  <div className="flex gap-4 items-start pr-6 min-w-0">
                    {/* Icon tag */}
                    <div className="w-10 h-10 rounded-xl bg-bg-base border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone size={16} className="text-brand" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${getTagColor(notice.tag)}`}>
                          {notice.tag}
                        </span>
                        {notice.important && (
                          <span className="text-[8px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            Critical Alert
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-sm text-white truncate">{notice.title}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed truncate">{notice.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] text-text-secondary/70 font-mono hidden sm:inline-block">
                      {notice.date}
                    </span>
                    <button className="text-text-secondary/70 hover:text-brand transition-colors p-1">
                      {isOpen ? <ChevronDown size={16} className="text-brand" /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                </div>

                {/* Content body collapse */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border/40 p-5 bg-bg-base/20 text-xs text-text-secondary leading-relaxed space-y-3"
                    >
                      <p className="text-white font-medium">{notice.content}</p>
                      <div className="flex justify-between items-center pt-3 border-t border-border/30 text-[9px] text-text-secondary/60">
                        <span>Notice ID: {notice.id}</span>
                        <span className="sm:hidden">Published: {notice.date}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
}
