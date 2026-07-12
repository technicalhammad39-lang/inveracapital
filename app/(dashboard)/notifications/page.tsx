'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  Bell, 
  Check, 
  Trash2, 
  ShieldAlert, 
  Coins, 
  LayoutDashboard, 
  Megaphone,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AlertNotification {
  id: string;
  category: 'System' | 'Security' | 'Wallet' | 'Promo';
  text: string;
  time: string;
  date: string;
  unread: boolean;
}

const initialAlerts: AlertNotification[] = [
  { id: 'n1', category: 'Wallet', text: 'Deposit request of $5,000.00 in USDT successfully processed.', time: '10:45 AM', date: 'Today', unread: true },
  { id: 'n2', category: 'Security', text: 'Account password settings successfully updated from browser.', time: '09:12 AM', date: 'Today', unread: true },
  { id: 'n3', category: 'Wallet', text: 'Daily Compound Yield credit of 2.0% ($200.00) completed.', time: '12:00 PM', date: 'Yesterday', unread: false },
  { id: 'n4', category: 'System', text: 'System Maintenance scheduled for July 12, 02:00 GMT.', time: '18:30 PM', date: 'Jul 08, 2026', unread: false },
  { id: 'n5', category: 'Promo', text: 'Mega Draw Week: Referral Gold partners earn 1.5x commission.', time: '09:00 AM', date: 'Jul 07, 2026', unread: false }
];

export default function NotificationsPage() {
  const { formatCurrency } = useCurrency();
  const [alerts, setAlerts] = useState<AlertNotification[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState<string>('All');
  
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const unreadCount = alerts.filter(a => a.unread).length;

  const markAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, unread: false })));
    triggerToast('All notifications marked as read.');
  };

  const clearAll = () => {
    setAlerts([]);
    triggerToast('Cleared all system notifications.');
  };

  const toggleReadState = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, unread: !a.unread } : a));
  };

  const deleteNotification = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    triggerToast('Notification cleared.');
  };

  // Filter alerts by activeTab
  const filteredAlerts = alerts.filter(a => activeTab === 'All' || a.category === activeTab);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Wallet': return <Coins size={14} className="text-brand" />;
      case 'Security': return <ShieldAlert size={14} className="text-rose-400" />;
      case 'System': return <LayoutDashboard size={14} className="text-blue-400" />;
      case 'Promo': return <Megaphone size={14} className="text-purple-400" />;
      default: return <Bell size={14} className="text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
            Notification Center
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Review, mark, or prune active system and security broadcasts.</p>
        </div>

        {/* Bulk Action buttons */}
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="bg-bg-card border border-border/80 hover:border-brand/40 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all text-white"
            >
              Mark all read
            </button>
          )}
          {alerts.length > 0 && (
            <button 
              onClick={clearAll}
              className="bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-xs font-semibold py-2.5 px-4 rounded-xl text-rose-400 transition-all"
            >
              Clear All Logs
            </button>
          )}
        </div>
      </div>

      {/* Tabs categorization bar */}
      <div className="flex bg-bg-base p-1.5 rounded-xl border border-border/80 max-w-lg">
        {['All', 'Wallet', 'Security', 'System', 'Promo'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === cat ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat} {cat === 'All' && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List of Alerts */}
      <div className="glass p-6 rounded-3xl relative overflow-hidden">
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Bell className="text-text-secondary/30 w-12 h-12 mx-auto animate-bounce" />
              <h3 className="font-bold text-sm text-white">No notifications</h3>
              <p className="text-xs text-text-secondary">Your alerts log is currently clean.</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filteredAlerts.map((alert) => (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`flex justify-between items-center bg-bg-base/30 border p-4 rounded-2xl text-xs transition-all relative group ${
                    alert.unread ? 'border-brand/20 bg-brand/[0.01]' : 'border-border/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5 pr-6">
                    {/* Icon Category indicator */}
                    <div className="w-8 h-8 rounded-full bg-bg-base border border-border flex items-center justify-center shrink-0">
                      {getCategoryIcon(alert.category)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white leading-normal">{alert.text}</span>
                        {alert.unread && (
                          <span className="text-[8px] bg-brand text-black font-extrabold px-1.5 py-0.5 rounded uppercase">New</span>
                        )}
                      </div>
                      <span className="text-[9px] text-text-secondary/70 block">
                        {alert.category} Log • {alert.date} at {alert.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => toggleReadState(alert.id)}
                      className="p-2 hover:bg-white/5 text-text-secondary hover:text-brand border border-border rounded-lg transition-colors"
                      title={alert.unread ? "Mark as Read" : "Mark as Unread"}
                    >
                      <Check size={13} />
                    </button>
                    <button 
                      onClick={() => deleteNotification(alert.id)}
                      className="p-2 hover:bg-rose-500/10 text-text-secondary hover:text-rose-400 border border-border rounded-lg transition-colors"
                      title="Clear Notification"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Confirmation Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-bg-base border border-brand/30 p-4 rounded-xl shadow-[0_10px_35px_rgba(0,255,136,0.15)] flex items-center gap-3 text-xs"
          >
            <CheckCircle2 className="text-brand w-5 h-5 shrink-0" />
            <span className="text-white font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
