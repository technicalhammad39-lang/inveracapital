import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex overflow-hidden">
      
      {/* Left Side: Premium Branding & Graphics */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-50" />
        
        {/* Glassmorphism Abstract Shapes */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              <span className="text-bg-base font-black text-xl">I</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">INVERA</span>
          </Link>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-6">
            Institutional Grade <br />
            <span className="text-brand">Digital Assets.</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            Secure, scale, and manage your wealth with our enterprise-grade investment platform designed for the modern financial frontier.
          </p>
        </div>

        {/* Footer/Trust Indicators */}
        <div className="relative z-10 flex items-center gap-8 text-sm text-text-secondary font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand" />
            SOC 2 Type II
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand" />
            Bank-Grade Security
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand" />
            $1B+ Managed
          </div>
        </div>
      </div>

      {/* Right Side: Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              <span className="text-bg-base font-black text-lg">I</span>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  );
}
