'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  LifeBuoy, 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  User, 
  X,
  Clock,
  Sparkles
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Pending Staff' | 'Resolved';
  date: string;
  messages: { sender: 'user' | 'agent'; text: string; time: string }[];
}

const initialTickets: Ticket[] = [
  {
    id: 'TKT-9024',
    subject: 'Delayed Crypto USDT Deposit verification',
    category: 'Wallet Payouts',
    priority: 'High',
    status: 'Pending Staff',
    date: 'Today, 10:45 AM',
    messages: [
      { sender: 'user', text: 'I submitted my deposit voucher for $5k, but it has not been verified yet.', time: '10:45 AM' },
      { sender: 'agent', text: 'Thank you for contacting Invera Support. We have received your voucher. Our audit department is checking the TRC20 hash blocks. Please stand by.', time: '10:50 AM' }
    ]
  },
  {
    id: 'TKT-4512',
    subject: 'KYC Level 2 Utility Statement Approval',
    category: 'Verification KYC',
    priority: 'Medium',
    status: 'Resolved',
    date: 'Jul 05, 2026',
    messages: [
      { sender: 'user', text: 'I uploaded my utility bill for address proof. How long does it take?', time: '11:30 AM' },
      { sender: 'agent', text: 'Your utility bill verification is approved. Your account status is now Level 2 verified.', time: '14:20 PM' }
    ]
  }
];

const faqs: FaqItem[] = [
  { q: 'How long do deposit settlements take to confirm?', a: 'Crypto deposits confirm within 3 block cycles (approx. 5 minutes). Bank and mobile wallet receipts are verified by human auditors within 15-30 minutes.' },
  { q: 'What is the minimum lockup size for investments?', a: 'The entry threshold starts at $1,000.00 for the Institutional Alpha plan, which yields 1.5% daily interest over 30 Days.' },
  { q: 'How does the multi-tier referral system pay commissions?', a: 'Commissions clear instantly into your Referral Wallet. Level 1 pays 7%, Level 2 pays 3%, and Level 3 pays 1% of your referrals stake values.' },
  { q: 'Are withdrawal gas fees charged?', a: 'Standard users incur a gas fee corresponding to their withdrawal gateway (approx. 1%). VIP members (Gold Tier and higher) enjoy free gas withdrawals.' }
];

export default function SupportPage() {
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Ticket system states
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  
  // Submit new ticket states
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [cat, setCat] = useState('Wallet Payouts');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [message, setMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Chat text state
  const [chatText, setChatText] = useState('');

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    const newTkt: Ticket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category: cat,
      priority,
      status: 'Open',
      date: 'Just now',
      messages: [
        { sender: 'user', text: message, time: 'Just now' }
      ]
    };

    setTickets([newTkt, ...tickets]);
    setFormSuccess(true);
    setSubject('');
    setMessage('');
    setTimeout(() => {
      setFormSuccess(false);
      setShowNewTicketForm(false);
    }, 2000);
  };

  const handleSendChatMessage = () => {
    if (!chatText || !activeTicket) return;
    
    const updatedMessages = [
      ...activeTicket.messages,
      { sender: 'user' as const, text: chatText, time: 'Just now' }
    ];

    const updatedTicket = {
      ...activeTicket,
      status: 'Open' as const,
      messages: updatedMessages
    };

    // Update list of tickets
    setTickets(tickets.map(t => t.id === activeTicket.id ? updatedTicket : t));
    setActiveTicket(updatedTicket);
    setChatText('');

    // Simulate Agent reply
    setTimeout(() => {
      const finalMessages = [
        ...updatedMessages,
        { sender: 'agent' as const, text: 'Our staff will review your message shortly. Thank you.', time: 'Just now' }
      ];
      const finalTicket = {
        ...updatedTicket,
        status: 'Pending Staff' as const,
        messages: finalMessages
      };
      setTickets(prevTickets => prevTickets.map(t => t.id === activeTicket.id ? finalTicket : t));
      if (activeTicket.id === finalTicket.id) {
        setActiveTicket(finalTicket);
      }
    }, 2000);
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
            Help Desk Center
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Submit support tickets, chat with advisors, or search knowledge base answers.</p>
        </div>

        <button 
          onClick={() => setShowNewTicketForm(true)}
          className="bg-brand text-black font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-brand-hover transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} /> Open Support Ticket
        </button>
      </div>

      {/* Grid FAQ & Ticket List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Knowledge Base FAQs Accordion (left) */}
        <div className="glass p-6 rounded-3xl lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-md text-white flex items-center gap-2">
              <HelpCircle size={18} className="text-brand" /> Knowledge Base & FAQ
            </h3>
            
            {/* FAQ Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search articles e.g. deposit, lockups..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bg-base border border-border rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:border-brand transition-colors text-white"
              />
            </div>
          </div>

          {/* Accordion FAQ items */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <p className="text-xs text-text-secondary py-4 text-center">No FAQ articles match your query.</p>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div key={idx} className="border border-border/80 rounded-2xl overflow-hidden bg-bg-base/20 transition-all">
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center p-4 text-left text-xs font-bold text-white hover:text-brand transition-colors outline-none"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronDown size={14} className="text-brand" /> : <ChevronRight size={14} />}
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4 text-xs text-text-secondary leading-relaxed border-t border-border/30 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tickets log & Chat Panel (right) */}
        <div className="glass p-6 rounded-3xl space-y-6">
          <div className="pb-2 border-b border-border/60">
            <h3 className="font-bold text-md text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-brand animate-pulse" /> Active Care Tickets
            </h3>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div 
                key={t.id}
                onClick={() => setActiveTicket(t)}
                className="p-3.5 rounded-xl border border-border bg-bg-base/30 hover:border-brand/40 cursor-pointer transition-all space-y-2"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-brand font-bold">{t.id}</span>
                  <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider ${
                    t.status === 'Resolved' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-white truncate">{t.subject}</h4>
                <div className="flex justify-between items-center text-[9px] text-text-secondary/70">
                  <span>Priority: <strong className="text-white">{t.priority}</strong></span>
                  <span>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* New Ticket Form Overlay */}
      <AnimatePresence>
        {showNewTicketForm && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-base border border-border/80 rounded-3xl max-w-md w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="p-5 border-b border-border/60 flex items-center justify-between bg-bg-card/10">
                <span className="font-bold text-sm text-white flex items-center gap-1.5"><Plus size={16} className="text-brand" /> Create Care Ticket</span>
                <button onClick={() => setShowNewTicketForm(false)} className="p-1 hover:bg-white/5 text-text-secondary hover:text-white rounded">
                  <X size={18} />
                </button>
              </div>

              {formSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <CheckCircle2 size={36} className="text-brand mx-auto animate-bounce" />
                  <h3 className="font-bold text-md text-white">Ticket successfully generated!</h3>
                  <p className="text-xs text-text-secondary">Our customer advisors will verify your ticket thread.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="p-6 space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Subject Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Specify issue title..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-bg-base border border-border rounded-xl py-3 px-4 outline-none focus:border-brand text-white font-bold transition-colors" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-text-secondary font-semibold">Ticket Category</label>
                      <select 
                        value={cat}
                        onChange={(e) => setCat(e.target.value)}
                        className="w-full bg-bg-base border border-border rounded-xl py-3 px-3 outline-none focus:border-brand text-white font-semibold cursor-pointer"
                      >
                        <option>Wallet Payouts</option>
                        <option>Verification KYC</option>
                        <option>Investment Plan</option>
                        <option>General Support</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-text-secondary font-semibold">Priority Level</label>
                      <select 
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full bg-bg-base border border-border rounded-xl py-3 px-3 outline-none focus:border-brand text-white font-semibold cursor-pointer"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-secondary font-semibold">Explain message query</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Write message details..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-bg-base border border-border rounded-xl py-3 px-4 outline-none focus:border-brand text-white font-medium resize-none transition-colors"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-brand text-black font-extrabold text-xs py-3.5 rounded-xl hover:bg-brand-hover shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all uppercase tracking-wider"
                  >
                    Submit Ticket Request
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ticket Chat History Modal */}
      <AnimatePresence>
        {activeTicket && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-base border border-border/80 rounded-3xl max-w-md w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] h-[500px] flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-4.5 border-b border-border/60 flex items-center justify-between bg-bg-card/10">
                <div>
                  <span className="font-mono text-[9px] text-brand font-bold block">{activeTicket.id}</span>
                  <span className="font-bold text-xs text-white block truncate max-w-[250px]">{activeTicket.subject}</span>
                </div>
                <button onClick={() => setActiveTicket(null)} className="p-1 hover:bg-white/5 rounded">
                  <X size={18} />
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-bg-base/30">
                {activeTicket.messages.map((msg, i) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div 
                      key={i} 
                      className={`flex gap-2.5 max-w-[80%] ${
                        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 ${
                        isUser ? 'bg-brand/10 border-brand/20 text-brand' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      }`}>
                        {isUser ? <User size={12} /> : <LifeBuoy size={12} />}
                      </div>

                      <div className={`p-3 rounded-2xl text-[11px] leading-relaxed ${
                        isUser ? 'bg-brand/5 border border-brand/20 text-brand rounded-tr-none' : 'bg-bg-card border border-border text-white rounded-tl-none'
                      }`}>
                        <p>{msg.text}</p>
                        <span className="text-[8px] text-text-secondary/60 block text-right mt-1">{msg.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-border/60 bg-bg-base flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type support reply..."
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  className="bg-bg-card border border-border rounded-xl px-4 py-2.5 outline-none focus:border-brand text-xs text-white flex-1"
                />
                <button 
                  onClick={handleSendChatMessage}
                  className="bg-brand text-black p-2.5 rounded-xl hover:bg-brand-hover transition-colors flex items-center justify-center shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
