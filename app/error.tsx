'use client'; // Error components must be Client Components

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ServerCrash, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Ambient Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center"
      >
        
        {/* Animated Error Graphic */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center relative">
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ServerCrash size={48} className="text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]" />
            </motion.div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-bg-base border border-border flex items-center justify-center">
              <ShieldAlert size={20} className="text-amber-400" />
            </div>
          </div>
        </div>

        {/* Messaging */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          System Exception
        </h2>
        <p className="text-text-secondary text-sm md:text-base mb-8 leading-relaxed">
          An unexpected server error occurred while processing your request. Our engineering team has been notified.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <button 
            onClick={() => reset()}
            className="w-full sm:flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} className="text-text-secondary" />
            Retry Request
          </button>
          
          <Link 
            href="/"
            className="w-full sm:flex-1 px-6 py-3 rounded-xl bg-brand text-black hover:bg-brand-hover shadow-[0_0_20px_rgba(0,255,136,0.2)] font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Dashboard
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-8">
          <Link href="/support" className="text-xs text-text-secondary hover:text-brand transition-colors underline underline-offset-4">
            Contact Technical Support
          </Link>
        </div>

      </motion.div>

    </div>
  );
}
