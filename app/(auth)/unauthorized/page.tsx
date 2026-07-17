'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ShieldX, ArrowLeft, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Ambient Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center"
      >
        
        {/* Animated Graphic */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center relative backdrop-blur-sm shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ShieldX size={56} className="text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            </motion.div>
          </div>
        </div>

        {/* Messaging */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
          Access Denied
        </h2>
        <p className="text-text-secondary text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
          You do not have the required security clearance to access this area. If you believe this is an error, please contact your system administrator.
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
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 text-black hover:bg-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.2)] font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Authenticate
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
