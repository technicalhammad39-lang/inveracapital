'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import { registerUser } from '@/app/actions/authActions';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the Terms & Conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </React.Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRef = searchParams.get('ref') || '';
  
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeTerms: false, referralCode: defaultRef }
  });

  const passwordValue = watch('password', '');
  
  // Calculate a basic strength (0-4)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = (data: RegisterForm) => {
    setError(null);
    startTransition(async () => {
      const res = await registerUser(data);
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    });
  };

  return (
    <div className="w-full pb-10">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Apply for Access</h2>
        <p className="text-text-secondary font-medium">Join the premier institutional digital asset platform.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-rose-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">First Name</label>
            <input
              {...register('firstName')}
              type="text"
              className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
            />
            {errors.firstName && <p className="mt-1.5 text-xs text-rose-400">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Last Name</label>
            <input
              {...register('lastName')}
              type="text"
              className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
            />
            {errors.lastName && <p className="mt-1.5 text-xs text-rose-400">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Email Address</label>
          <input
            {...register('email')}
            type="email"
            className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
          />
          {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Phone (Optional)</label>
            <input
              {...register('phone')}
              type="text"
              className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Country</label>
            <input
              {...register('country')}
              type="text"
              className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
            />
            {errors.country && <p className="mt-1.5 text-xs text-rose-400">{errors.country.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Password</label>
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
          {passwordValue && (
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`h-1 flex-1 rounded-full ${strength >= s ? (strength > 2 ? 'bg-brand' : 'bg-yellow-500') : 'bg-white/10'}`} />
              ))}
            </div>
          )}
          {errors.password && <p className="mt-1.5 text-xs text-rose-400">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Confirm Password</label>
          <input
            {...register('confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
          />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-rose-400">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Referral Code (Optional)</label>
          <input
            {...register('referralCode')}
            type="text"
            className="w-full bg-bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
          />
        </div>

        <div className="flex items-start gap-3 mt-6">
          <input
            {...register('agreeTerms')}
            type="checkbox"
            className="mt-1 w-4 h-4 rounded border-white/20 bg-bg-base text-brand focus:ring-brand focus:ring-offset-bg-base"
          />
          <div className="text-sm text-text-secondary">
            I agree to the <Link href="/terms" className="text-white hover:text-brand">Terms & Conditions</Link> and <Link href="/privacy" className="text-white hover:text-brand">Privacy Policy</Link>.
            {errors.agreeTerms && <p className="mt-1 text-xs text-rose-400">{errors.agreeTerms.message}</p>}
          </div>
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
              Create Account
              <UserPlus size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Google OAuth */}
      <div className="mt-8">
        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 px-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>
        
        <button 
          onClick={async () => {
            const res = await import('@/app/actions/authActions').then(m => m.getGoogleAuthUrl());
            router.push(res.url);
          }}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-text-secondary text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-bold hover:text-brand transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
