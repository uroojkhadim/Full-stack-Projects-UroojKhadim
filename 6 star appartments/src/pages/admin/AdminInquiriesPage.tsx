// src/pages/admin/AdminInquiriesPage.tsx - Client Inquiries Pipeline with Pagination & Theme Support
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Inquiry } from '../../types';
import { formatDate } from '../../utils/formatters';
import { useSite } from '../../context/SiteContext';
import { 
  MessageSquare, 
  Search, 
  Mail, 
  Phone, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export const AdminInquiriesPage: React.FC = () => {
  const { addToast } = useSite();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadInquiries = async () => {
    setLoading(true);
    const list = await api.getInquiries();
    setInquiries(list);
    setLoading(false);
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id: number, status: Inquiry['status']) => {
    const res = await api.updateInquiryStatus(id, status);
    if (res.success) {
      addToast(`Status marked as ${status}`);
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
      if (activeInquiry && activeInquiry.id === id) {
        setActiveInquiry({ ...activeInquiry, status });
      }
    }
  };

  const statusColors: Record<string, string> = {
    New: 'border-amber-500/60 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    'In Progress': 'border-blue-500/60 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    Responded: 'border-emerald-500/60 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    Closed: 'border-slate-500/60 text-slate-600 dark:text-slate-300 bg-slate-500/10',
    Replied: 'border-emerald-500/60 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    Archived: 'border-slate-500/60 text-slate-500 bg-slate-500/10'
  };

  const statuses = ['All', 'New', 'In Progress', 'Responded', 'Closed'];

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter !== 'All') {
      if (statusFilter === 'Responded' && inq.status === 'Replied') return true;
      if (inq.status !== statusFilter) return false;
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        inq.name.toLowerCase().includes(s) ||
        (inq.phone && inq.phone.includes(s)) ||
        (inq.email && inq.email.toLowerCase().includes(s)) ||
        inq.subject.toLowerCase().includes(s) ||
        inq.message.toLowerCase().includes(s)
      );
    }
    return true;
  });

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInquiries = filteredInquiries.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white">
            Client Inquiries & Messages
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400 mt-1">
            General questions, commercial lease consultations, and private residence tour requests.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card dark:bg-charcoal-900 p-4 rounded-3xl border border-border dark:border-charcoal-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted-foreground dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by name, contact, subject, or message..."
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
                <th className="p-4">Client Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Message Snippet</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-charcoal-800/60 text-muted-foreground dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">Loading inquiries...</td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-14 text-center">
                    <MessageSquare className="w-10 h-10 text-brand-gold-500 mx-auto mb-3 opacity-60" />
                    <p className="text-base font-semibold text-card-foreground dark:text-white">[No inquiries recorded yet]</p>
                    <p className="text-xs text-muted-foreground mt-1">Inquiries submitted via the Contact or Showrooms page will appear here.</p>
                  </td>
                </tr>
              ) : paginatedInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No matching inquiries found for your filter.
                  </td>
                </tr>
              ) : (
                paginatedInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-muted/40 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="p-4 font-bold text-card-foreground dark:text-white">{inq.name}</td>
                    <td className="p-4">
                      {inq.phone && (
                        <div className="flex items-center gap-1.5 text-card-foreground dark:text-slate-300">
                          <Phone className="w-3 h-3 text-brand-gold-500" />
                          <span>{inq.phone}</span>
                        </div>
                      )}
                      {inq.email && (
                        <div className="flex items-center gap-1.5 text-muted-foreground dark:text-slate-400 text-[11px]">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{inq.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-card-foreground dark:text-slate-200 truncate max-w-[180px]">{inq.subject}</td>
                    <td className="p-4 text-muted-foreground dark:text-slate-400 line-clamp-1 max-w-[220px]">{inq.message}</td>
                    <td className="p-4 text-muted-foreground dark:text-slate-400 whitespace-nowrap">{formatDate(inq.created_at)}</td>
                    <td className="p-4">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-background dark:bg-charcoal-950 border cursor-pointer focus:outline-none ${
                          statusColors[inq.status] || 'border-border text-card-foreground'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Responded">Responded</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setActiveInquiry(inq)}
                        className="p-1.5 rounded-lg bg-muted dark:bg-charcoal-950 hover:bg-muted/80 dark:hover:bg-charcoal-700 text-muted-foreground hover:text-card-foreground transition-colors"
                        title="View Full Inquiry"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (10 per page) */}
        {filteredInquiries.length > itemsPerPage && (
          <div className="p-4 border-t border-border dark:border-charcoal-800 flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400">
            <div>
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredInquiries.length)} of {filteredInquiries.length} inquiries
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

      {/* Inquiry View Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card dark:bg-charcoal-900 rounded-3xl border border-brand-gold-500/40 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border dark:border-charcoal-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-600 dark:text-brand-gold-400">Inquiry Details</span>
                <h3 className="font-heading font-extrabold text-xl text-card-foreground dark:text-white">
                  {activeInquiry.subject}
                </h3>
              </div>
              <button
                onClick={() => setActiveInquiry(null)}
                className="p-1.5 text-muted-foreground hover:text-card-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-muted/40 dark:bg-charcoal-950 p-4 rounded-2xl border border-border dark:border-charcoal-800 space-y-1.5 text-xs">
              <p><span className="text-muted-foreground dark:text-slate-400">From:</span> <strong className="text-card-foreground dark:text-white">{activeInquiry.name}</strong></p>
              <p><span className="text-muted-foreground dark:text-slate-400">Phone:</span> <strong className="text-card-foreground dark:text-white">{activeInquiry.phone || 'None'}</strong></p>
              <p><span className="text-muted-foreground dark:text-slate-400">Email:</span> <strong className="text-card-foreground dark:text-white">{activeInquiry.email || 'None'}</strong></p>
              <p><span className="text-muted-foreground dark:text-slate-400">Received:</span> <span className="text-card-foreground dark:text-slate-300">{formatDate(activeInquiry.created_at)}</span></p>
            </div>

            <div className="p-4 bg-muted/20 dark:bg-charcoal-950/60 rounded-2xl border border-border dark:border-charcoal-800 text-xs text-card-foreground dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {activeInquiry.message}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {activeInquiry.phone && (
                <a
                  href={`https://wa.me/${activeInquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Guest</span>
                </a>
              )}
              <button
                onClick={() => setActiveInquiry(null)}
                className="px-4 py-2 rounded-xl bg-muted text-card-foreground font-semibold text-xs border border-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
