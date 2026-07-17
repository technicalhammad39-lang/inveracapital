'use client';

import React, { useState, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { executePasswordReset } from '@/app/actions/authActions';
import Link from 'next/link';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema)
  });

  if (!token) {
    return (
      <div className="w-full text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Invalid Link</h2>
        <p className="text-text-secondary mb-6">This password reset link is invalid or missing the secure token.</p>
        <Link href="/forgot-password" className="text-brand font-bold">Request a new link</Link>
      </div>
    );
  }

  const onSubmit = (data: ResetForm) => {
    setError(null);
    startTransition(async () => {
      const res = await executePasswordReset({ token, newPassword: data.password });
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
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">Password Reset!</h2>
        <p className="text-text-secondary font-medium mb-8">
          Your password has been successfully updated. You can now log in with your new password.
        </p>
        <Link 
          href="/login" 
          className="inline-flex items-center justify-center w-full bg-brand text-bg-base font-bold py-3.5 rounded-xl hover:bg-brand-hover transition-colors"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create New Password</h2>
        <p className="text-text-secondary font-medium">Choose a strong password to secure your account.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-rose-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">New Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-rose-400">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Confirm New Password</label>
          <input
            {...register('confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
          />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-rose-400">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full relative flex items-center justify-center gap-2 bg-brand text-bg-base font-bold py-3.5 px-4 rounded-xl hover:bg-brand-hover transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-bg-base/30 border-t-bg-base rounded-full animate-spin" />
          ) : (
            <>
              Update Password
              <KeyRound size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full text-center text-text-secondary animate-pulse">Loading secure session...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
