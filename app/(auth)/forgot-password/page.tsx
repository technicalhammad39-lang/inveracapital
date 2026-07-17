'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { requestPasswordReset } from '@/app/actions/authActions';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema)
  });

  const onSubmit = (data: ForgotForm) => {
    setError(null);
    startTransition(async () => {
      const res = await requestPasswordReset(data.email);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    });
  };

  if (success) {
    return (
      <div className="w-full text-center">
        <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">Check your email</h2>
        <p className="text-text-secondary font-medium mb-8">
          We've sent a password reset link to your email address. The link will expire in 1 hour.
        </p>
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-brand font-bold hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link 
        href="/login" 
        className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm font-bold mb-8"
      >
        <ArrowLeft size={16} />
        Back to Login
      </Link>

      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Reset Password</h2>
        <p className="text-text-secondary font-medium">Enter your email and we'll send you a reset link.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-rose-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              className="w-full bg-bg-card border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
              placeholder="john@example.com"
            />
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-rose-400">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full relative flex items-center justify-center gap-2 bg-brand text-bg-base font-bold py-3.5 px-4 rounded-xl hover:bg-brand-hover transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-bg-base/30 border-t-bg-base rounded-full animate-spin" />
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>
    </div>
  );
}
