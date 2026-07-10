'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Gift, 
  Users, 
  ArrowRightLeft,
  Award,
  Crown,
  User,
  Lock,
  FileText,
  Activity,
  Megaphone,
  Bell,
  LifeBuoy,
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

// Sidebar Groups
const groups = [
  {
    title: 'Core Menu',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Investments', href: '/investments', icon: TrendingUp },
      { name: 'Wallet', href: '/wallet', icon: Wallet },
      { name: 'Lottery', href: '/lottery', icon: Gift },
      { name: 'Referrals', href: '/referrals', icon: Users },
      { name: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
      { name: 'Rewards', href: '/rewards', icon: Award },
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'VIP Status', href: '/vip', icon: Crown },
      { name: 'Document Center', href: '/documents', icon: FileText },
      { name: 'Security Score', href: '/security', icon: Lock },
      { name: 'Activity Logs', href: '/activity', icon: Activity },
    ]
  },
  {
    title: 'Support & Settings',
    items: [
      { name: 'Profile Details', href: '/profile', icon: User },
      { name: 'Help Desk', href: '/support', icon: LifeBuoy },
      { name: 'Alerts Hub', href: '/notifications', icon: Bell },
      { name: 'Official News', href: '/announcements', icon: Megaphone },
      { name: 'Preferences', href: '/settings', icon: Settings },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
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
      className="border-r border-border h-screen sticky top-0 bg-bg-base/90 backdrop-blur-xl flex flex-col pt-6 pb-4 px-3 hidden lg:flex shrink-0 z-40 overflow-hidden"
    >
      {/* Premium Logo */}
      <div className={clsx(
        "flex items-center gap-3 px-2 mb-8 transition-all duration-300",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.4)] flex items-center justify-center relative group shrink-0">
            <div className="w-4 h-4 bg-bg-base rounded-md rotate-45 group-hover:rotate-90 transition-transform duration-300" />
            <div className="absolute w-1.5 h-1.5 bg-brand rounded-full top-0 right-0 animate-ping" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold tracking-wider bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent"
            >
              INVERA
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation List - Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto no-scrollbar hover:custom-scrollbar space-y-6 pr-1">
        {groups.map((group, gIdx) => (
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
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link key={item.name} href={item.href} className="relative block group">
                    {/* Active Background Slide */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-pill"
                          className="absolute inset-0 bg-brand-muted rounded-xl border border-brand/10"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Left Active Line Accent */}
                    {isActive && (
                      <motion.div 
                        layoutId="active-line-accent" 
                        className="absolute left-0 top-2 bottom-2 w-1 bg-brand rounded-r-md shadow-[0_0_8px_rgba(0,255,136,0.8)]"
                      />
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
        <button 
          onClick={toggleCollapse}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/[0.02] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={19} className="mx-auto" /> : (
            <>
              <ChevronLeft size={19} />
              <span className="text-[13px] font-medium">Collapse Menu</span>
            </>
          )}
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-rose-400 hover:bg-rose-500/5 transition-colors text-left">
          <LogOut size={19} className={clsx(isCollapsed && "mx-auto")} />
          {!isCollapsed && <span className="text-[13px] font-medium">Logout Account</span>}
        </button>
      </div>
    </motion.div>
  );
}
