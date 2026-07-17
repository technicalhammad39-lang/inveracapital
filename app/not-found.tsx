'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Search, ArrowLeft, Home, Compass } from 'lucide-react';
import clsx from 'clsx';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Ambient Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center"
      >
        
        {/* Animated 404 Graphic */}
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex items-center justify-center"
          >
            <Compass size={120} className="text-brand drop-shadow-[0_0_30px_rgba(0,255,136,0.3)] mb-4" strokeWidth={1} />
          </motion.div>
          <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent drop-shadow-2xl">
            404
          </h1>
        </div>

        {/* Messaging */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Route Not Found
        </h2>
        <p className="text-text-secondary text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
          The destination you requested cannot be located within the current platform architecture. It may have been relocated or restricted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <Link 
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand text-black hover:bg-brand-hover shadow-[0_0_20px_rgba(0,255,136,0.2)] font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Return to Dashboard
          </Link>
        </div>

        {/* Search Helper */}
        <div className="mt-16 w-full max-w-md mx-auto relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand transition-colors">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search platform resources..." 
            className="w-full bg-[#0a0a0b] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-text-secondary/50 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all shadow-inner"
          />
        </div>

      </motion.div>

    </div>
  );
}
