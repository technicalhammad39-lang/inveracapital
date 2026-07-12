'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/components/CurrencyProvider';
import { DocumentVector } from '@/components/CustomIllustrations';
import { 
  FileText, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  FileCheck,
  Building,
  ShieldAlert,
  ChevronRight,
  Eye,
  CheckCircle2
} from 'lucide-react';

export default function DocumentsPage() {
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'kyc' | 'statements' | 'vouchers' | 'tax'>('kyc');

  // KYC States
  const [kycStatus, setKycStatus] = useState<'unverified' | 'pending' | 'verified'>('verified');
  
  // Document downloads simulation
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const triggerDownload = (fileName: string) => {
    setDownloadingFile(fileName);
    setTimeout(() => {
      setDownloadingFile(null);
      setDownloadToast(`Document "${fileName}" downloaded successfully as PDF.`);
      setTimeout(() => setDownloadToast(null), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
          Document Center
        </h1>
        <p className="text-text-secondary mt-1 text-sm">Submit verification files, download monthly statements, or access tax reports.</p>
      </div>

      {/* Tabs navigation */}
      <div className="flex bg-bg-base p-1.5 rounded-xl border border-border/80 max-w-lg">
        <button 
          onClick={() => setActiveTab('kyc')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'kyc' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          KYC Verify
        </button>
        <button 
          onClick={() => setActiveTab('statements')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'statements' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Statements
        </button>
        <button 
          onClick={() => setActiveTab('vouchers')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'vouchers' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Voucher Ledger
        </button>
        <button 
          onClick={() => setActiveTab('tax')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'tax' ? 'bg-brand text-black shadow-md' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Tax Docs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Side Vector (decoration) */}
        <div className="glass p-6 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
          <div className="absolute inset-0 bg-brand/5 blur-3xl pointer-events-none" />
          <DocumentVector className="w-40 h-40 animate-pulse-slow" />
          <div className="space-y-1 relative z-10">
            <h3 className="font-extrabold text-sm text-white">Vault Encrypted Secure</h3>
            <p className="text-[10px] text-text-secondary">AES-256 standard cryptographic file locks active.</p>
          </div>
        </div>

        {/* Tab Interface detail (right panel spans 2 columns) */}
        <div className="glass p-6 rounded-3xl lg:col-span-2 flex flex-col justify-between h-full">
          <AnimatePresence mode="wait">
            
            {/* KYC Center */}
            {activeTab === 'kyc' && (
              <motion.div 
                key="kyc"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-2 border-b border-border/60">
                  <h3 className="font-bold text-md text-white">Identity & Utility verification</h3>
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider border ${
                    kycStatus === 'verified' ? 'bg-brand/10 border-brand/20 text-brand' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {kycStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-bg-base/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">1. Identity Verification</span>
                      <CheckCircle2 className="text-brand w-4.5 h-4.5" />
                    </div>
                    <p className="text-[10px] text-text-secondary leading-relaxed">International Passport or National Identity Cards.</p>
                    <div className="text-[10px] text-brand font-bold bg-brand/5 border border-brand/15 px-2 py-1 rounded inline-block">
                      Verified (Reference ID: H84A9)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-bg-base/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">2. Address utility check</span>
                      <CheckCircle2 className="text-brand w-4.5 h-4.5" />
                    </div>
                    <p className="text-[10px] text-text-secondary leading-relaxed">Recent bank records, electric, or gas billing receipts.</p>
                    <div className="text-[10px] text-brand font-bold bg-brand/5 border border-brand/15 px-2 py-1 rounded inline-block">
                      Verified (Reference ID: J19B4)
                    </div>
                  </div>
                </div>

                <div className="bg-brand/5 border border-brand/20 p-4 rounded-xl text-xs text-brand flex items-start gap-2.5">
                  <CheckCircle className="shrink-0 mt-0.5 w-4.5 h-4.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5">KYC Verified Tier 2 Account Status</p>
                    <p className="text-text-secondary leading-normal">You have cleared all verification controls. Account withdrawal ceilings expanded.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Statements List */}
            {activeTab === 'statements' && (
              <motion.div 
                key="statements"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="pb-2 border-b border-border/60 mb-2">
                  <h3 className="font-bold text-md text-white">Monthly Portfolios Statements</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Verified financial audit records of asset settlements.</p>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  {[
                    { name: 'Invera_Statement_June_2026.pdf', size: '1.2 MB', date: 'Jul 01, 2026' },
                    { name: 'Invera_Statement_May_2026.pdf', size: '1.1 MB', date: 'Jun 01, 2026' },
                    { name: 'Invera_Statement_April_2026.pdf', size: '1.3 MB', date: 'May 01, 2026' }
                  ].map((stmt) => (
                    <div key={stmt.name} className="flex justify-between items-center bg-bg-base/30 border border-border p-3 rounded-xl hover:border-brand/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-brand shrink-0" />
                        <div>
                          <span className="font-bold text-xs text-white block truncate max-w-[220px]">{stmt.name}</span>
                          <span className="text-[9px] text-text-secondary block mt-0.5">{stmt.size} • Uploaded: {stmt.date}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => triggerDownload(stmt.name)}
                        disabled={downloadingFile === stmt.name}
                        className="p-2 hover:bg-white/5 text-text-secondary hover:text-brand border border-border rounded-lg transition-all"
                      >
                        {downloadingFile === stmt.name ? (
                          <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin block" />
                        ) : <Download size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Voucher Ledgers */}
            {activeTab === 'vouchers' && (
              <motion.div 
                key="vouchers"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="pb-2 border-b border-border/60 mb-2">
                  <h3 className="font-bold text-md text-white">Deposit & Withdrawal Receipt Vouchers</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Voucher attachments submitted or dispatched during cash flows.</p>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  {[
                    { name: 'Deposit_Slip_TXN-902418.png', type: 'Deposit Voucher', date: 'Today, 10:45 AM' },
                    { name: 'Withdrawal_Receipt_TXN-820491.pdf', type: 'Withdrawal Receipt', date: 'Jul 08, 2026' }
                  ].map((vch) => (
                    <div key={vch.name} className="flex justify-between items-center bg-bg-base/30 border border-border p-3 rounded-xl hover:border-brand/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileCheck size={16} className="text-brand shrink-0" />
                        <div>
                          <span className="font-bold text-xs text-white block truncate max-w-[220px]">{vch.name}</span>
                          <span className="text-[9px] text-text-secondary block mt-0.5">{vch.type} • Processed: {vch.date}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => triggerDownload(vch.name)}
                        disabled={downloadingFile === vch.name}
                        className="p-2 hover:bg-white/5 text-text-secondary hover:text-brand border border-border rounded-lg transition-all"
                      >
                        {downloadingFile === vch.name ? (
                          <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin block" />
                        ) : <Download size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tax Documents */}
            {activeTab === 'tax' && (
              <motion.div 
                key="tax"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="pb-2 border-b border-border/60 mb-2">
                  <h3 className="font-bold text-md text-white">Annual Financial Tax audit Statements</h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Compliant 1099-B and institutional tax returns.</p>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  {[
                    { name: 'Invera_Annual_Tax_1099B_2025.pdf', size: '2.5 MB', date: 'Jan 15, 2026' }
                  ].map((tax) => (
                    <div key={tax.name} className="flex justify-between items-center bg-bg-base/30 border border-border p-3 rounded-xl hover:border-brand/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <Building size={16} className="text-brand shrink-0" />
                        <div>
                          <span className="font-bold text-xs text-white block truncate">{tax.name}</span>
                          <span className="text-[9px] text-text-secondary block mt-0.5">{tax.size} • Audited: {tax.date}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => triggerDownload(tax.name)}
                        disabled={downloadingFile === tax.name}
                        className="p-2 hover:bg-white/5 text-text-secondary hover:text-brand border border-border rounded-lg transition-all"
                      >
                        {downloadingFile === tax.name ? (
                          <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin block" />
                        ) : <Download size={14} />}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Confirms toast notifications */}
      <AnimatePresence>
        {downloadToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-bg-base border border-brand/30 p-4 rounded-xl shadow-[0_10px_35px_rgba(0,255,136,0.15)] flex items-center gap-3 text-xs"
          >
            <CheckCircle2 className="text-brand w-5 h-5 shrink-0" />
            <span className="text-white font-medium">{downloadToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
