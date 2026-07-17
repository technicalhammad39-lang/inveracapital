'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Mail, CheckCircle2, AlertCircle, Save, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Assuming we'll create these actions next
import { saveSmtpSettings, testSmtpSettings, getSmtpSettings } from '@/app/actions/adminEmailActions';

const smtpSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.number().min(1, 'Port is required'),
  user: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  encryption: z.enum(['tls', 'ssl', 'none']),
  senderName: z.string().min(1, 'Sender Name is required'),
  senderEmail: z.string().email('Valid Sender Email is required'),
});

type SmtpForm = z.infer<typeof smtpSchema>;

export default function AdminSmtpSettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [isTesting, setIsTesting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SmtpForm>({
    resolver: zodResolver(smtpSchema)
  });

  useEffect(() => {
    async function loadSettings() {
      const data = await getSmtpSettings();
      if (data) {
        reset({
          host: data.host,
          port: data.port,
          user: data.user,
          password: data.password,
          encryption: data.encryption as 'tls' | 'ssl' | 'none',
          senderName: data.senderName,
          senderEmail: data.senderEmail,
        });
      }
    }
    loadSettings();
  }, [reset]);

  const onSubmit = (data: SmtpForm) => {
    setSuccess(null);
    setError(null);
    startTransition(async () => {
      const res = await saveSmtpSettings(data);
      if (res.error) setError(res.error);
      else setSuccess('SMTP Settings saved securely to database.');
    });
  };

  const handleTest = async () => {
    setIsTesting(true);
    setError(null);
    setSuccess(null);
    const res = await testSmtpSettings();
    if (res.error) setError(res.error);
    else setSuccess('Test email sent successfully! Your SMTP configuration is working perfectly.');
    setIsTesting(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <Mail size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SMTP Configuration</h1>
          <p className="text-text-secondary text-sm">Manage the dynamic email transport system.</p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-brand/10 border border-brand/20 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-brand/90">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-rose-200">{error}</p>
        </div>
      )}

      <div className="bg-bg-card border border-white/5 rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">SMTP Host</label>
              <input
                {...register('host')}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 focus:ring-1 focus:ring-brand/50 outline-none"
                placeholder="smtp.mailgun.org"
              />
              {errors.host && <p className="mt-1 text-xs text-rose-400">{errors.host.message}</p>}
            </div>
            
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">SMTP Port</label>
              <input
                {...register('port', { valueAsNumber: true })}
                type="number"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 focus:ring-1 focus:ring-brand/50 outline-none"
                placeholder="587"
              />
              {errors.port && <p className="mt-1 text-xs text-rose-400">{errors.port.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">SMTP Username</label>
              <input
                {...register('user')}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 focus:ring-1 focus:ring-brand/50 outline-none"
              />
              {errors.user && <p className="mt-1 text-xs text-rose-400">{errors.user.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">SMTP Password</label>
              <input
                {...register('password')}
                type="password"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 focus:ring-1 focus:ring-brand/50 outline-none"
              />
              {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Encryption</label>
              <select
                {...register('encryption')}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 focus:ring-1 focus:ring-brand/50 outline-none appearance-none"
              >
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Sender Name</label>
              <input
                {...register('senderName')}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 focus:ring-1 focus:ring-brand/50 outline-none"
                placeholder="Invera Capital"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Sender Email Address</label>
              <input
                {...register('senderEmail')}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand/50 focus:ring-1 focus:ring-brand/50 outline-none"
                placeholder="noreply@inveracapital.com"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-brand text-bg-base font-bold py-3.5 rounded-xl hover:bg-brand-hover transition-all disabled:opacity-70"
            >
              {isPending ? 'Saving...' : <><Save size={18} /> Save Settings</>}
            </button>
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3.5 rounded-xl hover:bg-white/10 transition-all disabled:opacity-70"
            >
              {isTesting ? 'Sending Test...' : <><Send size={18} /> Send Test Email</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
