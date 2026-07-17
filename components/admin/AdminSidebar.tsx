'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Gift, 
  Users, 
  ArrowDownToLine,
  ArrowUpFromLine,
  Lock,
  FileText,
  LifeBuoy,
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  LineChart,
  Network,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

// Admin Sidebar Groups
const groups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/yesadmin786', icon: LayoutDashboard },
      { name: 'Analytics', href: '/yesadmin786/analytics', icon: LineChart },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Users', href: '/yesadmin786/users', icon: Users },
      { name: 'Investments', href: '/yesadmin786/investments', icon: TrendingUp },
      { name: 'Lottery', href: '/yesadmin786/lottery', icon: Gift },
      { name: 'Referrals & Rewards', href: '/yesadmin786/referrals', icon: Network },
      { name: 'Role Mgmt', href: '/yesadmin786/roles', icon: ShieldCheck },
    ]
  },
  {
    title: 'Finance & Compliance',
    items: [
      { name: 'Deposits', href: '/yesadmin786/deposits', icon: ArrowDownToLine },
      { name: 'Withdrawals', href: '/yesadmin786/withdrawals', icon: ArrowUpFromLine },
      { name: 'KYC & Verification', href: '/yesadmin786/kyc', icon: ShieldCheck },
      { name: 'Financial Control', href: '/yesadmin786/finance', icon: DollarSign },
      { name: 'Audit Logs', href: '/yesadmin786/audit', icon: FileText },
    ]
  },
  {
    title: 'System & Support',
    items: [
      { name: 'Support Tickets', href: '/yesadmin786/support', icon: LifeBuoy },
      { name: 'Email Center', href: '/yesadmin786/email', icon: FileText },
      { name: 'Newsletter', href: '/yesadmin786/newsletter', icon: FileText },
      { name: 'Content Mgmt', href: '/yesadmin786/content', icon: FileText },
      { name: 'Security Logs', href: '/yesadmin786/security', icon: Lock },
      { name: 'System Settings', href: '/yesadmin786/settings', icon: Settings },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    if (saved) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('admin-sidebar-collapsed', String(newState));
  };

  if (!mounted) {
    return (
      <div className="w-64 border-r border-border h-screen bg-bg-base/80 hidden lg:block shrink-0" />
    );
  }

  return (
    <motion.div 
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="border-r border-border h-screen sticky top-0 bg-gradient-to-b from-bg-base/95 to-bg-card/95 backdrop-blur-xl flex flex-col pt-6 pb-4 px-3 hidden lg:flex shrink-0 z-40 overflow-hidden"
    >
      {/* Premium Logo & Collapse Control */}
      <div className={clsx(
        "flex items-center px-2 mb-8 transition-all duration-300",
        isCollapsed ? "flex-col gap-4 justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.4)] flex items-center justify-center relative group shrink-0">
            <ShieldCheck size={18} className="text-black group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-0 right-0 animate-ping" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold tracking-wider bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent"
            >
              ADMIN
            </motion.span>
          )}
        </div>
        
        {/* Collapse Button beside Logo */}
        <button 
          onClick={toggleCollapse}
          className="text-text-secondary hover:text-text-primary p-1.5 hover:bg-white/5 rounded-lg transition-colors"
          title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List - Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto no-scrollbar hover:custom-scrollbar space-y-6 pr-1">
        {groups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!isCollapsed && (
              <motion.h4 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest px-3 mb-2"
              >
                {group.title}
              </motion.h4>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/yesadmin786' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link key={item.name} href={item.href} className="relative block group">
                    {/* Active Background Slide */}
                    {isActive && (
                      <div className="absolute inset-0 bg-brand/10 rounded-xl border border-brand/20 transition-all duration-300" />
                    )}

                    {/* Left Active Line Accent */}
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-brand rounded-r-md shadow-[0_0_8px_rgba(0,255,136,0.8)] transition-all duration-300" />
                    )}

                    <div className={clsx(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      isActive ? "text-brand font-semibold" : "text-text-secondary group-hover:text-text-primary group-hover:bg-white/[0.02]"
                    )}>
                      <Icon 
                        size={19} 
                        className={clsx(
                          "transition-transform duration-300 group-hover:scale-105 shrink-0",
                          isActive ? "text-brand drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]" : "text-text-secondary group-hover:text-white"
                        )} 
                      />
                      {!isCollapsed && (
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[13px]"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Area */}
      <div className="mt-auto pt-4 border-t border-border/60 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-rose-400 hover:bg-rose-500/5 transition-colors text-left">
          <LogOut size={19} className={clsx(isCollapsed && "mx-auto")} />
          {!isCollapsed && <span className="text-[13px] font-medium">Exit Admin Mode</span>}
        </button>
      </div>
    </motion.div>
  );
}
