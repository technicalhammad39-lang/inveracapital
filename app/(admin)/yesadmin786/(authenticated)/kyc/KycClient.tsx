'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  Eye,
  FileText
} from 'lucide-react';
import clsx from 'clsx';
import { updateKycStatus } from './actions';

export default function KycClient({ kycRecords }: { kycRecords: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRecords, setActiveRecords] = useState(kycRecords);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [viewDoc, setViewDoc] = useState<string | null>(null);

  const filtered = activeRecords.filter(k => 
    k.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    k.documentType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this KYC document?`)) return;
    setIsProcessing(id);
    const res = await updateKycStatus(id, status);
    if (res.success) {
      setActiveRecords(activeRecords.map(k => k.id === id ? { ...k, status } : k));
    } else {
      alert(`Error: ${res.error}`);
    }
    setIsProcessing(null);
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            KYC Verification
          </h1>
          <p className="text-text-secondary text-sm font-medium">Review identity documents and verify institutional investors.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search user or document type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-[#0a0a0b] border border-white/10 hover:border-brand/40 focus:border-brand rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none transition-all text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0b] border border-white/10 rounded-xl text-sm font-semibold text-white hover:bg-white/5 transition-colors">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0b] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0f1115]">
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Document Type</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Submission Date</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-secondary">No KYC records found.</td>
                </tr>
              ) : filtered.map((k) => (
                <tr key={k.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{k.user?.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-white uppercase bg-white/5 px-2 py-1 rounded">{k.documentType}</span>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(k.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={clsx(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border",
                      k.status === 'APPROVED' ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : 
                      k.status === 'PENDING' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                      "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {k.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setViewDoc(k.documentUrl)}
                        className="p-1.5 text-text-secondary hover:text-white hover:bg-white/10 rounded-lg transition-colors" 
                        title="View Document"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {k.status === 'PENDING' && (
                        <>
                          <button 
                            disabled={isProcessing === k.id}
                            onClick={() => handleStatusUpdate(k.id, 'APPROVED')}
                            className="p-1.5 text-text-secondary hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors disabled:opacity-50" 
                            title="Approve KYC"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            disabled={isProcessing === k.id}
                            onClick={() => handleStatusUpdate(k.id, 'REJECTED')}
                            className="p-1.5 text-text-secondary hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Reject KYC"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Document View Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-[#0a0a0b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-white font-bold">Document Viewer</h3>
              <button onClick={() => setViewDoc(null)} className="text-text-secondary hover:text-white">Close</button>
            </div>
            <div className="p-6 flex justify-center items-center min-h-[400px] bg-[#131619]">
               {viewDoc.startsWith('http') || viewDoc.startsWith('/') ? (
                 <img src={viewDoc} alt="Document" className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-xl" />
               ) : (
                 <div className="text-center text-text-secondary">
                   <FileText size={48} className="mx-auto mb-4 opacity-50" />
                   <p>No valid preview available for this document.</p>
                   <p className="text-xs mt-2 font-mono bg-white/5 inline-block px-2 py-1 rounded">{viewDoc}</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
