'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  ChevronDown, 
  User, 
  Search, 
  Settings, 
  HelpCircle, 
  Shield, 
  LogOut, 
  Check, 
  Languages, 
  SunMoon, 
  Menu, 
  X,
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Gift,
  Users,
  ArrowRightLeft,
  Award,
  Crown,
  FileText,
  Activity,
  Megaphone,
  LifeBuoy,
  Lock
} from 'lucide-react';
import { useCurrency } from './CurrencyProvider';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function TopNav() {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  
  // Dropdown States
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Preference States
  const [activeLang, setActiveLang] = useState('EN');
  const [activeTheme, setActiveTheme] = useState('Emerald Dark');

  // Simulated Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Your deposit of $5,000.00 is completed.', time: '2 mins ago', unread: true },
    { id: 2, text: 'Daily ROI of 2.0% ($200.00) credited.', time: '2 hours ago', unread: true },
    { id: 3, text: 'New referral signed up: John Wick.', time: '1 day ago', unread: false },
    { id: 4, text: 'Mega Lottery ticket purchased successfully.', time: '2 days ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Close menus on click outside
  const currencyRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Investments', href: '/investments', icon: TrendingUp },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Lottery', href: '/lottery', icon: Gift },
    { name: 'Referrals', href: '/referrals', icon: Users },
    { name: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
    { name: 'Rewards', href: '/rewards', icon: Award },
    { name: 'VIP Membership', href: '/vip', icon: Crown },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Security Center', href: '/security', icon: Lock },
    { name: 'Activity Logs', href: '/activity', icon: Activity },
    { name: 'Support', href: '/support', icon: LifeBuoy },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Announcements', href: '/announcements', icon: Megaphone },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <header className="h-20 border-b border-border bg-bg-base/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 md:px-8">
      {/* Left Search Bar / Mobile toggle */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>

        <div className="relative max-w-xs md:max-w-md w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search transactions, tickets, nodes..." 
            className="w-full bg-bg-card/40 border border-border/80 hover:border-brand/35 focus:border-brand focus:shadow-[0_0_15px_rgba(0,255,136,0.1)] rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none transition-all placeholder:text-text-secondary"
          />
        </div>
      </div>

      {/* Right Navigation Utilities */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center justify-center p-2 text-text-secondary hover:text-brand hover:bg-white/5 rounded-lg transition-all"
            title="Language"
          >
            <Languages size={19} />
          </button>
          
          <AnimatePresence>
            {langOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-36 bg-bg-base border border-border rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-1"
              >
                {[
                  { code: 'EN', name: 'English' },
                  { code: 'UR', name: 'Urdu (اردو)' },
                  { code: 'ES', name: 'Spanish' },
                  { code: 'ZH', name: 'Chinese' }
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setActiveLang(l.code); setLangOpen(false); }}
                    className={clsx(
                      "w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between",
                      activeLang === l.code ? "bg-brand/10 text-brand font-semibold" : "text-text-secondary hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>{l.name}</span>
                    {activeLang === l.code && <Check size={14} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Currency Selector */}
        <div className="relative" ref={currencyRef}>
          <button 
            onClick={() => setCurrencyOpen(!currencyOpen)}
            className="flex items-center gap-1.5 bg-bg-card border border-border/80 hover:border-brand/40 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:bg-bg-card-hover"
          >
            <span className="text-brand">{currency}</span>
            <ChevronDown className={clsx("w-3.5 h-3.5 text-text-secondary transition-transform duration-200", currencyOpen && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {currencyOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-32 bg-bg-base border border-border rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-1"
              >
                {[
                  { code: 'USD', name: 'USD ($)' },
                  { code: 'PKR', name: 'PKR (₨)' }
                ].map((curr) => (
                  <button 
                    key={curr.code}
                    onClick={() => { setCurrency(curr.code as 'USD' | 'PKR'); setCurrencyOpen(false); }}
                    className={clsx(
                      "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between",
                      currency === curr.code ? "bg-brand/10 text-brand font-semibold" : "text-text-secondary hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>{curr.name}</span>
                    {currency === curr.code && <Check size={14} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 text-text-secondary hover:text-brand hover:bg-white/5 rounded-lg transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full shadow-[0_0_8px_rgba(0,255,136,0.8)] animate-pulse"></span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-80 bg-bg-base border border-border rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden z-50 flex flex-col"
              >
                <div className="p-4 border-b border-border/80 flex items-center justify-between">
                  <span className="font-bold text-sm">Notifications ({unreadCount})</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-xs text-brand hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar divide-y divide-border/50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-text-secondary">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={clsx(
                          "p-3.5 text-xs transition-colors relative group",
                          n.unread ? "bg-brand/[0.02]" : ""
                        )}
                      >
                        <div className="flex gap-2 justify-between">
                          <div className="space-y-1 pr-4">
                            <p className={clsx(
                              "text-text-primary leading-relaxed",
                              n.unread ? "font-medium" : "text-text-secondary"
                            )}>
                              {n.text}
                            </p>
                            <span className="text-[10px] text-text-secondary/60">{n.time}</span>
                          </div>
                          
                          <button 
                            onClick={() => deleteNotification(n.id)}
                            className="text-text-secondary/50 hover:text-rose-400 p-0.5 self-start rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        {n.unread && (
                          <span className="absolute top-4 right-3 w-1.5 h-1.5 bg-brand rounded-full" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-border/80 text-center bg-bg-card/10">
                  <Link 
                    href="/notifications" 
                    onClick={() => setNotifOpen(false)}
                    className="text-xs text-brand hover:underline font-semibold block w-full"
                  >
                    View All Activity
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-4 border-l border-border hover:opacity-90 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-text-primary">Admin User</div>
              <div className="text-[9px] text-brand tracking-widest uppercase font-bold mt-0.5">VIP Gold</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(0,255,136,0.1)]">
              <User className="w-4.5 h-4.5 text-brand" />
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-56 bg-bg-base border border-border rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden z-50 p-1"
              >
                {/* Profile Header */}
                <div className="p-3 border-b border-border/60 mb-1">
                  <p className="text-xs font-bold text-text-primary">Admin User</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">admin@inveracapital.com</p>
                </div>

                {/* Dropdown Items */}
                <Link 
                  href="/profile" 
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                >
                  <User size={14} className="text-brand" />
                  <span>My Profile Details</span>
                </Link>

                <Link 
                  href="/security" 
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Shield size={14} className="text-brand" />
                  <span>Security & 2FA</span>
                </Link>

                <Link 
                  href="/support" 
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
                >
                  <HelpCircle size={14} className="text-brand" />
                  <span>Help Center & FAQ</span>
                </Link>

                <div className="border-t border-border/60 my-1"></div>

                {/* Themes and Settings Mock */}
                <div className="px-3 py-2 text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  Preferences
                </div>
                
                <div className="px-3 py-1.5 flex items-center justify-between text-xs text-text-secondary">
                  <span className="flex items-center gap-2"><SunMoon size={14} /> Theme</span>
                  <select 
                    value={activeTheme} 
                    onChange={(e) => setActiveTheme(e.target.value)}
                    className="bg-bg-card border border-border rounded text-[10px] py-0.5 px-1 focus:border-brand outline-none"
                  >
                    <option>Emerald Dark</option>
                    <option>Cyber Lime</option>
                    <option>Slate Dark</option>
                  </select>
                </div>

                <div className="border-t border-border/60 my-1"></div>

                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-lg transition-colors text-left">
                  <LogOut size={14} />
                  <span>Sign Out Account</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Sidebar content */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-bg-base border-r border-border z-50 p-5 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center">
                    <div className="w-4 h-4 bg-bg-base rounded-md rotate-45" />
                  </div>
                  <span className="text-md font-bold tracking-wider">INVERA MOBILE</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-text-secondary hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation links scrolling */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;

                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={clsx(
                        "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        isActive ? "bg-brand/10 text-brand border border-brand/20" : "text-text-secondary hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Icon size={18} className={isActive ? "text-brand" : "text-text-secondary"} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border mt-auto">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/5 transition-colors text-left text-sm font-medium">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}
