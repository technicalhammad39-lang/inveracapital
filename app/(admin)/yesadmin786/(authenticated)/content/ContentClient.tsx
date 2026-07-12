'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Megaphone, Send } from 'lucide-react';
import { broadcastAnnouncement } from './actions';

export default function ContentClient() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    link: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to broadcast this to ALL active users?')) return;
    
    setIsProcessing(true);
    const res = await broadcastAnnouncement(formData.title, formData.message, formData.link);
    if (res.success) {
      alert(`Successfully sent to ${res.count} users!`);
      setFormData({ title: '', message: '', link: '' });
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Broadcast Announcements
          </h1>
          <p className="text-text-secondary text-sm font-medium">Send global notifications to all active institutional investors.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0b] rounded-2xl border border-white/10 p-6 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
            <Megaphone className="text-brand w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Create Announcement</h2>
            <p className="text-xs text-text-secondary">This will appear in the notifications center for all users.</p>
          </div>
        </div>

        <form onSubmit={handleBroadcast} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Announcement Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand"
              placeholder="e.g. Platform Upgrade Complete"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Message Body</label>
            <textarea 
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand resize-none custom-scrollbar"
              placeholder="Type your announcement message here..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Call to Action Link (Optional)</label>
            <input 
              type="url" 
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand"
              placeholder="https://inveracapital.com/..."
            />
          </div>

          <button 
            disabled={isProcessing || !formData.title || !formData.message}
            type="submit" 
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand text-black font-extrabold text-sm rounded-xl hover:bg-brand-hover transition-colors shadow-[0_0_15px_rgba(0,255,136,0.2)] disabled:opacity-50"
          >
            <Send size={18} />
            {isProcessing ? 'Broadcasting...' : 'Broadcast to All Users'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
