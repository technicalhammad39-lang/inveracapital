'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LifeBuoy, 
  Search, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  Clock,
  Send
} from 'lucide-react';
import clsx from 'clsx';
import { resolveTicket, closeTicket, replyToTicket } from './actions';

export default function SupportClient({ tickets, currentAdminId }: { tickets: any[], currentAdminId: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTickets, setActiveTickets] = useState(tickets);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filtered = activeTickets.filter(t => 
    t.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async (id: string, actionType: 'RESOLVE' | 'CLOSE') => {
    setIsProcessing(id);
    const res = actionType === 'RESOLVE' ? await resolveTicket(id) : await closeTicket(id);
    if (res.success) {
      const newStatus = actionType === 'RESOLVE' ? 'RESOLVED' : 'CLOSED';
      setActiveTickets(activeTickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
      if (selectedTicket?.id === id) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(null);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    
    setIsProcessing('reply');
    const res = await replyToTicket(selectedTicket.id, currentAdminId, replyText);
    
    if (res.success) {
      setReplyText('');
      window.location.reload(); // Quick refresh to get new messages and status
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(null);
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto flex flex-col h-[85vh]">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Support Center
          </h1>
          <p className="text-text-secondary text-sm font-medium">Manage user inquiries and technical support tickets.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search subject or user..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-[#0a0a0b] border border-white/10 hover:border-brand/40 focus:border-brand rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none transition-all text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Ticket List */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/3 bg-[#0a0a0b] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl"
        >
          <div className="overflow-y-auto flex-1 p-2 custom-scrollbar space-y-2">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-text-secondary text-sm">No tickets found.</div>
            ) : filtered.map((ticket) => (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className={clsx(
                  "p-4 rounded-xl cursor-pointer transition-all border",
                  selectedTicket?.id === ticket.id 
                    ? "bg-white/5 border-brand/40" 
                    : "bg-[#131619] border-white/5 hover:border-white/20"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-white truncate pr-2">{ticket.user?.email}</span>
                  <span className={clsx(
                    "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0",
                    ticket.status === 'OPEN' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                    ticket.status === 'IN_PROGRESS' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : 
                    ticket.status === 'RESOLVED' ? "bg-brand/10 text-brand border-brand/20" :
                    "bg-white/5 text-text-secondary border-white/10"
                  )}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white mb-1 truncate">{ticket.subject}</p>
                <div className="flex justify-between items-center text-xs text-text-secondary">
                  <span className={clsx(
                    "font-medium",
                    ticket.priority === 'URGENT' ? 'text-rose-400' :
                    ticket.priority === 'HIGH' ? 'text-amber-400' : ''
                  )}>{ticket.priority} Priority</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ticket Chat/Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-2/3 bg-[#0a0a0b] rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative"
        >
          {selectedTicket ? (
            <>
              <div className="p-6 border-b border-white/10 bg-[#0f1115] shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedTicket.subject}</h2>
                    <p className="text-sm text-text-secondary mt-1">Requested by <span className="text-white">{selectedTicket.user?.email}</span></p>
                  </div>
                  <div className="flex gap-2">
                    {selectedTicket.status !== 'RESOLVED' && selectedTicket.status !== 'CLOSED' && (
                      <button 
                        disabled={isProcessing === selectedTicket.id}
                        onClick={() => handleAction(selectedTicket.id, 'RESOLVE')}
                        className="px-3 py-1.5 bg-brand/10 text-brand text-xs font-bold rounded-lg border border-brand/20 hover:bg-brand/20 transition-colors disabled:opacity-50"
                      >
                        Resolve
                      </button>
                    )}
                    {selectedTicket.status !== 'CLOSED' && (
                      <button 
                        disabled={isProcessing === selectedTicket.id}
                        onClick={() => handleAction(selectedTicket.id, 'CLOSE')}
                        className="px-3 py-1.5 bg-white/5 text-text-secondary text-xs font-bold rounded-lg border border-white/10 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#0a0a0b]">
                {selectedTicket.messages?.map((msg: any) => {
                  const isAdmin = msg.userId === currentAdminId; // simple check, ideally we check role
                  return (
                    <div key={msg.id} className={clsx("flex flex-col max-w-[80%]", isAdmin ? "ml-auto items-end" : "mr-auto items-start")}>
                      <div className="text-[10px] text-text-secondary mb-1 flex gap-2">
                        <span>{isAdmin ? 'You' : selectedTicket.user?.email}</span>
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      <div className={clsx(
                        "p-3 rounded-2xl text-sm",
                        isAdmin ? "bg-brand text-black font-medium rounded-tr-sm" : "bg-[#131619] text-white border border-white/10 rounded-tl-sm"
                      )}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Area */}
              {selectedTicket.status !== 'CLOSED' && (
                <div className="p-4 border-t border-white/10 bg-[#0f1115] shrink-0">
                  <form onSubmit={handleReply} className="flex gap-2">
                    <input 
                      type="text" 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..." 
                      className="flex-1 bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                    />
                    <button 
                      type="submit"
                      disabled={isProcessing === 'reply' || !replyText.trim()}
                      className="px-4 py-2 bg-brand text-black font-extrabold text-sm rounded-xl hover:bg-brand-hover active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)] disabled:opacity-50 flex items-center justify-center shrink-0"
                    >
                      {isProcessing === 'reply' ? <Clock size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-secondary">
              <LifeBuoy size={48} className="mb-4 opacity-20" />
              <p>Select a ticket to view details</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
