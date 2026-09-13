// src/pages/admin/AdminQuotesPage.tsx - Customer Quotations Pipeline with Pagination & Theme Support
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Quotation } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useSite } from '../../context/SiteContext';
import { 
  FileText, 
  Search, 
  Printer, 
  Eye, 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  Building2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export const AdminQuotesPage: React.FC = () => {
  const { addToast } = useSite();
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeQuote, setActiveQuote] = useState<Quotation | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadQuotes = async () => {
    setLoading(true);
    const list = await api.getQuotes();
    setQuotes(list);
    setLoading(false);
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const handleStatusChange = async (id: number, newStatus: Quotation['status']) => {
    try {
      const res = await api.updateQuoteStatus(id, newStatus);
      if (res.success) {
        addToast(`Quotation status updated to ${newStatus}`);
        setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
        if (activeQuote && activeQuote.id === id) {
          setActiveQuote({ ...activeQuote, status: newStatus });
        }
      }
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  const statusColors: Record<string, string> = {
    New: 'border-amber-500/60 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    Reviewing: 'border-blue-500/60 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    Quoted: 'border-indigo-500/60 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
    Confirmed: 'border-emerald-500/60 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    Completed: 'border-slate-500/60 text-slate-600 dark:text-slate-300 bg-slate-500/10',
    Cancelled: 'border-red-500/60 text-red-600 dark:text-red-400 bg-red-500/10',
    Pending: 'border-amber-500/60 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    Contacted: 'border-blue-500/60 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    Archived: 'border-slate-500/60 text-slate-500 bg-slate-500/10'
  };

  const statuses = ['All', 'New', 'Reviewing', 'Quoted', 'Confirmed', 'Completed', 'Cancelled'];

  const filteredQuotes = quotes.filter((q) => {
    if (statusFilter !== 'All') {
      if (statusFilter === 'New' && q.status === 'Pending') return true;
      if (q.status !== statusFilter) return false;
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        q.quote_number.toLowerCase().includes(s) ||
        q.customer_name.toLowerCase().includes(s) ||
        q.phone.includes(s) ||
        q.apartment_title.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuotes = filteredQuotes.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white">
            Customer Quotations Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400 mt-1">
            Track stay requirements, client inquiries, check-in schedules, and issue PDF spec sheets.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card dark:bg-charcoal-900 p-4 rounded-3xl border border-border dark:border-charcoal-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted-foreground dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by quote ref, customer name, phone, or apartment..."
            className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl pl-10 pr-4 py-2 text-xs text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-brand-gold-500 text-charcoal-950 font-bold shadow-sm'
                  : 'bg-muted/40 dark:bg-charcoal-950 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card dark:bg-charcoal-900 rounded-3xl border border-border dark:border-charcoal-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 dark:bg-charcoal-950 text-muted-foreground dark:text-slate-400 border-b border-border dark:border-charcoal-800">
              <tr>
                <th className="p-4">Ref #</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Selected Residence</th>
                <th className="p-4">Duration & Occupancy</th>
                <th className="p-4">Estimated Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-charcoal-800/60 text-muted-foreground dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">Loading quotation records...</td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-14 text-center">
                    <FileText className="w-10 h-10 text-brand-gold-500 mx-auto mb-3 opacity-60" />
                    <p className="text-base font-semibold text-card-foreground dark:text-white">[No quotations recorded yet]</p>
                    <p className="text-xs text-muted-foreground mt-1">Quotations created by customers via the instant calculator will appear here.</p>
                  </td>
                </tr>
              ) : paginatedQuotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No matching quotation requests found for your filter.
                  </td>
                </tr>
              ) : (
                paginatedQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-muted/40 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-gold-600 dark:text-brand-gold-400">
                      {q.quote_number}
                      <span className="block text-[10px] text-muted-foreground font-normal">{formatDate(q.created_at)}</span>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-card-foreground dark:text-white">{q.customer_name}</div>
                      <div className="text-[11px] text-muted-foreground dark:text-slate-400">{q.phone}</div>
                      {q.email && <div className="text-[11px] text-muted-foreground/80 dark:text-slate-500 truncate max-w-[160px]">{q.email}</div>}
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-card-foreground dark:text-slate-200">{q.apartment_title}</div>
                      <div className="text-[10px] text-muted-foreground dark:text-slate-400">The Centaurus Suites</div>
                    </td>

                    <td className="p-4">
                      <div className="text-card-foreground dark:text-slate-200 font-medium">{q.duration_count} {q.duration_type}(s)</div>
                      <div className="text-[11px] text-muted-foreground dark:text-slate-400">{q.guests} Guest(s)</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-card-foreground dark:text-white text-sm">{formatCurrency(q.total_price)}</div>
                    </td>

                    <td className="p-4">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-background dark:bg-charcoal-950 border cursor-pointer focus:outline-none ${
                          statusColors[q.status] || 'border-border text-card-foreground'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveQuote(q)}
                          className="p-1.5 rounded-lg bg-muted dark:bg-charcoal-950 hover:bg-muted/80 dark:hover:bg-charcoal-700 text-muted-foreground hover:text-card-foreground transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={`./backend/api/quote_pdf.php?quote_number=${q.quote_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted dark:bg-charcoal-950 hover:bg-brand-gold-500 hover:text-charcoal-950 text-card-foreground dark:text-slate-300 font-bold transition-all text-[11px] border border-border dark:border-charcoal-800"
                          title="Open printable quotation PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (10 per page) */}
        {filteredQuotes.length > itemsPerPage && (
          <div className="p-4 border-t border-border dark:border-charcoal-800 flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400">
            <div>
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredQuotes.length)} of {filteredQuotes.length} quotations
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg bg-muted dark:bg-charcoal-950 text-card-foreground dark:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-border dark:border-charcoal-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-semibold text-card-foreground dark:text-white">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg bg-muted dark:bg-charcoal-950 text-card-foreground dark:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-border dark:border-charcoal-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quote Details Modal */}
      {activeQuote && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card dark:bg-charcoal-900 rounded-3xl border border-brand-gold-500/40 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border dark:border-charcoal-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 dark:text-brand-gold-400">Quotation Breakdown</span>
                <h3 className="font-heading font-extrabold text-xl text-card-foreground dark:text-white">
                  Ref #{activeQuote.quote_number}
                </h3>
              </div>
              <button
                onClick={() => setActiveQuote(null)}
                className="p-2 text-muted-foreground hover:text-card-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-muted/40 dark:bg-charcoal-950 p-4 rounded-2xl border border-border dark:border-charcoal-800 space-y-2">
                <p className="font-bold text-card-foreground dark:text-white uppercase tracking-wider text-[11px] mb-2">Guest Profile</p>
                <p><span className="text-muted-foreground dark:text-slate-400">Name:</span> <strong className="text-card-foreground dark:text-white">{activeQuote.customer_name}</strong></p>
                <p><span className="text-muted-foreground dark:text-slate-400">Phone:</span> <strong className="text-card-foreground dark:text-white">{activeQuote.phone}</strong></p>
                <p><span className="text-muted-foreground dark:text-slate-400">Email:</span> <strong className="text-card-foreground dark:text-white">{activeQuote.email || 'N/A'}</strong></p>
                <p><span className="text-muted-foreground dark:text-slate-400">Guests:</span> <strong className="text-card-foreground dark:text-white">{activeQuote.guests}</strong></p>
              </div>

              <div className="bg-muted/40 dark:bg-charcoal-950 p-4 rounded-2xl border border-border dark:border-charcoal-800 space-y-2">
                <p className="font-bold text-card-foreground dark:text-white uppercase tracking-wider text-[11px] mb-2">Stay Parameters</p>
                <p><span className="text-muted-foreground dark:text-slate-400">Residence:</span> <strong className="text-card-foreground dark:text-white">{activeQuote.apartment_title}</strong></p>
                <p><span className="text-muted-foreground dark:text-slate-400">Duration:</span> <strong className="text-card-foreground dark:text-white">{activeQuote.duration_count} {activeQuote.duration_type}(s)</strong></p>
                <p><span className="text-muted-foreground dark:text-slate-400">Check-in:</span> <strong className="text-card-foreground dark:text-white">{activeQuote.check_in_date || 'Flexible'}</strong></p>
                <p><span className="text-muted-foreground dark:text-slate-400">Check-out:</span> <strong className="text-card-foreground dark:text-white">{activeQuote.check_out_date || 'Flexible'}</strong></p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 dark:bg-charcoal-950 rounded-2xl border border-border dark:border-charcoal-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-slate-400">Base Tariff:</span>
                <span className="font-semibold text-card-foreground dark:text-white">{formatCurrency(activeQuote.base_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-slate-400">Facility & Utilities (5%):</span>
                <span className="font-semibold text-card-foreground dark:text-white">{formatCurrency(activeQuote.tax_amount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-border dark:border-charcoal-800 text-brand-gold-600 dark:text-brand-gold-400">
                <span>Estimated Total:</span>
                <span>{formatCurrency(activeQuote.total_price)}</span>
              </div>
            </div>

            {activeQuote.notes && (
              <div className="p-3 bg-muted/30 dark:bg-charcoal-950 rounded-xl border border-border dark:border-charcoal-800 text-xs">
                <p className="font-bold text-card-foreground dark:text-white mb-1">Customer Notes:</p>
                <p className="text-muted-foreground dark:text-slate-300 italic">{activeQuote.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <a
                href={`./backend/api/quote_pdf.php?quote_number=${activeQuote.quote_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Spec Sheet</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
