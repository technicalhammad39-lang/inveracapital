import React from 'react';
import { Activity, Zap } from 'lucide-react';
import Link from 'next/link';

interface PremiumEmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export function PremiumEmptyState({
  title,
  description,
  icon: Icon = Activity,
  ctaText,
  ctaHref,
  className = ''
}: PremiumEmptyStateProps) {
  return (
    <div className={`bg-gradient-to-br from-brand/[0.08] to-transparent border border-brand/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center h-full min-h-[300px] relative overflow-hidden group shadow-[0_0_20px_rgba(0,255,136,0.03)] ${className}`}>
      
      {/* Clean Minimal Illustration (No Box) */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-brand/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <Icon size={48} strokeWidth={1} className="text-text-secondary group-hover:text-white transition-colors duration-500 relative z-10" />
      </div>
      
      <h3 className="text-white font-medium text-lg mb-2 tracking-tight">{title}</h3>
      <p className="text-text-secondary/70 text-sm max-w-[280px] mx-auto mb-8 leading-relaxed font-light">
        {description}
      </p>
      
      {ctaText && ctaHref && (
        <Link 
          href={ctaHref}
          className="text-white text-sm font-medium transition-all flex items-center justify-center gap-2 group/btn"
        >
          {ctaText}
          <div className="relative overflow-hidden w-4 h-4 flex items-center">
            {/* Animated Arrow */}
            <svg 
              className="absolute left-0 w-4 h-4 text-brand transform transition-transform duration-300 group-hover/btn:translate-x-full group-hover/btn:opacity-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <svg 
              className="absolute left-[-100%] w-4 h-4 text-brand transform transition-transform duration-300 group-hover/btn:translate-x-[100%] opacity-0 group-hover/btn:opacity-100"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </Link>
      )}
    </div>
  );
}
