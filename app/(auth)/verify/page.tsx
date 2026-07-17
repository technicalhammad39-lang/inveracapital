'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { verifyEmailAddress } from '@/app/actions/authActions';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing from the URL.');
      return;
    }

    const verify = async () => {
      const res = await verifyEmailAddress(token);
      if (res.error) {
        setStatus('error');
        setErrorMessage(res.error);
      } else {
        setStatus('success');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="w-full text-center">
      {status === 'loading' && (
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Verifying Email...</h2>
          <p className="text-text-secondary">Please wait while we confirm your email address.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center animate-fade-in-up">
          <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,136,0.2)]">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">Email Verified!</h2>
          <p className="text-text-secondary font-medium mb-8 max-w-sm mx-auto">
            Your email address has been successfully verified. Your account is now fully active.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center gap-2 w-full max-w-xs bg-brand text-bg-base font-bold py-3.5 rounded-xl hover:bg-brand-hover transition-colors group"
          >
            Continue to Dashboard
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center animate-fade-in-up">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-6">
            <XCircle size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">Verification Failed</h2>
          <p className="text-rose-200 font-medium mb-8 max-w-sm mx-auto bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
            {errorMessage}
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center w-full max-w-xs bg-white/5 border border-white/10 text-white font-bold py-3.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            Return to Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="w-full text-center text-text-secondary animate-pulse">Loading secure session...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
