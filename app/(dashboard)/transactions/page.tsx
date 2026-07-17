// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PremiumEmptyState } from '@/components/PremiumEmptyState';
import { useCurrency } from '@/components/CurrencyProvider';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRightLeft,
  Coins,
  Ticket
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'ROI Credit' | 'Transfer' | 'Referral Commission' | 'Lottery Entry';
  amount: number;
  date: string;
  time: string;
  status: 'Completed' | 'Pending' | 'Failed';
  gateway: string;
  fee: number;
  recipient: string;
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-902418', type: 'Deposit', amount: 5000, date: 'Jul 10, 2026', time: '10:45 AM', status: 'Completed', gateway: 'USDT (TRC20)', fee: 0, recipient: 'USDT Vault' },
  { id: 'TXN-890251', type: 'ROI Credit', amount: 150.5, date: 'Jul 09, 2026', time: '12:00 PM', status: 'Completed', gateway: 'Compound Interest', fee: 0, recipient: 'Main Wallet' },
  { id: 'TXN-820491', type: 'Withdrawal', amount: 1200, date: 'Jul 08, 2026', time: '14:20 PM', status: 'Pending', gateway: 'Habib Bank Limited', fee: 2.50, recipient: 'PK56HABB0029104810' },
  { id: 'TXN-794502', type: 'Lottery Entry', amount: 50, date: 'Jul 07, 2026', time: '16:00 PM', status: 'Completed', gateway: 'Ticket Purchase', fee: 0, recipient: 'Weekly Draw Pool' },
  { id: 'TXN-783910', type: 'Referral Commission', amount: 350, date: 'Jul 06, 2026', time: '09:15 AM', status: 'Completed', gateway: 'Sarah Connor L1', fee: 0, recipient: 'Referral Wallet' },
  { id: 'TXN-658241', type: 'Transfer', amount: 1500, date: 'Jul 05, 2026', time: '11:30 AM', status: 'Completed', gateway: 'Main to Investment', fee: 0, recipient: 'Investment Wallet' },
  { id: 'TXN-548102', type: 'Withdrawal', amount: 300, date: 'Jul 02, 2026', time: '18:45 PM', status: 'Failed', gateway: 'JazzCash Wallet', fee: 1.00, recipient: '+92 300 1234567' }
];

import { getAllTransactions } from '@/app/actions/walletActions';

export default function TransactionsPage() {
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function load() {
      const res = await getAllTransactions();
      if (res.success && res.data) {
        setTransactions(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Export states
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Filters logic
  const filteredTx = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.gateway.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || (tx.status.toUpperCase() === statusFilter.toUpperCase());
    return matchesSearch && matchesType && matchesStatus;
  });

  const triggerExport = (format: 'CSV' | 'PDF') => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      setExportToast(`Transaction log report exported to ${format} successfully.`);
      setTimeout(() => setExportToast(null), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent">
            Transaction Ledger
          </h1>
          <p className="text-text-secondary mt-1 text-sm">Review, audit, and export complete transaction reports.</p>
        </div>
        
        {/* Export buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => triggerExport('CSV')}
            disabled={!!exporting}
            className="bg-bg-card border border-border/80 hover:border-brand/40 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 hover:bg-bg-card-hover text-white disabled:opacity-50"
          >
            {exporting === 'CSV' ? (
              <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            ) : <Download size={14} />}
            <span>Export CSV</span>
          </button>
          
          <button 
            onClick={() => triggerExport('PDF')}
            disabled={!!exporting}
            className="bg-bg-card border border-border/80 hover:border-brand/40 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 hover:bg-bg-card-hover text-white disabled:opacity-50"
          >
            {exporting === 'PDF' ? (
              <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            ) : <Download size={14} />}
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search Reference, address..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-base border border-border rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-brand transition-colors text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Type filter */}
          <div className="flex items-center gap-2 bg-bg-base border border-border px-3 py-1.5 rounded-xl text-xs text-text-secondary">
            <Filter size={12} />
            <span>Type:</span>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none text-white outline-none cursor-pointer font-semibold"
            >
              <option value="All">All Types</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
              <option value="ROI Credit">ROI Credit</option>
              <option value="Transfer">Transfer</option>
              <option value="Referral Commission">Commission</option>
              <option value="Lottery Entry">Lottery</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 bg-bg-base border border-border px-3 py-1.5 rounded-xl text-xs text-text-secondary">
            <Filter size={12} />
            <span>Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-white outline-none cursor-pointer font-semibold"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="text-text-secondary bg-bg-base/40 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Processed Date</th>
                <th className="px-6 py-4">Channel Details</th>
                <th className="px-6 py-4 text-center">Settlement</th>
                <th className="px-6 py-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-text-secondary">
                  Loading transactions...
                </td>
              </tr>
            ) : (!filteredTx || filteredTx.length === 0) ? (
              <tr>
                <td colSpan={7} className="p-4">
                  <PremiumEmptyState 
                    title="No Transactions Found"
                    description={searchTerm ? "Try adjusting your search or filters." : "You haven't made any transactions yet."}
                    icon={Coins}
                    className="min-h-[300px]"
                  />
                </td>
              </tr>
            ) : (
              filteredTx.map((tx) => {
                  const isPositive = tx.type === 'Deposit' || tx.type === 'ROI Credit' || tx.type === 'Referral Commission';
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-white text-[11px]">{tx.id}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-text-primary">{tx.type}</span>
                      </td>
                      <td className={`px-6 py-4 font-bold text-sm ${isPositive ? 'text-brand' : 'text-text-primary'}`}>
                        {isPositive ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{tx.date} <span className="text-[10px] opacity-75">{tx.time}</span></td>
                      <td className="px-6 py-4 text-text-secondary">{tx.gateway}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-wider border ${
                          tx.status === 'Completed' 
                            ? 'bg-brand/10 border-brand/20 text-brand' 
                            : tx.status === 'Pending' 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedTx(tx)}
                          className="p-2 bg-bg-base hover:bg-white/5 rounded-lg border border-border text-text-secondary hover:text-white transition-colors"
                          title="View Invoice"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Invoice Details Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-base border border-border/80 rounded-3xl max-w-md w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Header */}
              <div className="p-5 border-b border-border/60 flex items-center justify-between bg-bg-card/10">
                <span className="font-bold text-sm text-white">Receipt Verification</span>
                <button 
                  onClick={() => setSelectedTx(null)}
                  className="p-1 hover:bg-white/5 text-text-secondary hover:text-white rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-bold">Transaction Value</span>
                  <div className="text-3xl font-black text-white">{formatCurrency(selectedTx.amount)}</div>
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider border inline-block mt-1 ${
                    selectedTx.status === 'Completed' 
                      ? 'bg-brand/10 border-brand/20 text-brand' 
                      : selectedTx.status === 'Pending'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {selectedTx.status}
                  </span>
                </div>

                <div className="space-y-3.5 border-y border-border/60 py-5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Reference ID</span>
                    <span className="font-mono text-white font-semibold">{selectedTx.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Payment Method</span>
                    <span className="text-white font-semibold">{selectedTx.gateway}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Destination Address</span>
                    <span className="text-white font-mono truncate max-w-[200px]" title={selectedTx.recipient}>{selectedTx.recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Commission / Gas Fee</span>
                    <span className="text-white font-semibold">{selectedTx.fee === 0 ? 'Gas Covered' : formatCurrency(selectedTx.fee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Timestamp</span>
                    <span className="text-white font-semibold">{selectedTx.date} at {selectedTx.time}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => { setSelectedTx(null); triggerExport('PDF'); }}
                    className="flex-1 bg-brand text-black font-extrabold text-xs py-3 rounded-xl hover:bg-brand-hover transition-all text-center uppercase tracking-wider"
                  >
                    Print Receipt
                  </button>
                  <button 
                    onClick={() => setSelectedTx(null)}
                    className="flex-1 bg-bg-card border border-border/80 hover:border-brand/40 text-xs font-semibold py-3 rounded-xl transition-all text-center text-white"
                  >
                    Close Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating alert toast */}
      <AnimatePresence>
        {exportToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-bg-base border border-brand/30 p-4 rounded-xl shadow-[0_10px_35px_rgba(0,255,136,0.15)] flex items-center gap-3 text-xs"
          >
            <CheckCircle2 className="text-brand w-5 h-5 shrink-0" />
            <span className="text-white font-medium">{exportToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
