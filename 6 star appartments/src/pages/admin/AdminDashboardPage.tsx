// src/pages/admin/AdminDashboardPage.tsx - Executive Admin Overview
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { api } from '../../services/api';
import { Quotation, Inquiry, CommercialSpace } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { 
  Building2, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  ArrowUpRight, 
  Plus, 
  Briefcase,
  Image as ImageIcon,
  Sparkles,
  Eye,
  Printer
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { apartments } = useSite();
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [commercialSpaces, setCommercialSpaces] = useState<CommercialSpace[]>([]);
  const [, setBlogsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      api.getQuotes(),
      api.getInquiries(),
      api.getCommercialSpaces(),
      api.getBlogs()
    ]).then(([qList, iList, cList, bList]) => {
      setQuotes(qList);
      setInquiries(iList);
      setCommercialSpaces(cList);
      setBlogsCount(bList.length);
      setLoading(false);
    });
  }, []);

  const availableApartments = apartments.filter(a => a.status === 'available').length;
  const showroomsCount = commercialSpaces.filter(c => c.space_type === 'Showroom').length;
  const officesCount = commercialSpaces.filter(c => c.space_type.includes('Office') || c.space_type.includes('Suite')).length;
  const pendingQuotes = quotes.filter(q => q.status === 'New' || q.status === 'Reviewing' || q.status === 'Pending').length;
  const newInquiries = inquiries.filter(i => i.status === 'New').length;

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-gold-600 dark:text-brand-gold-400 uppercase tracking-widest block mb-1">
            6 STARS HOSPITALITY Management System
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground dark:text-white">
            Administrative Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400 mt-1">
            Centaurus Mall • Elysium Tower • F-11 Markaz Property Control & Inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/apartments"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-xs shadow-md hover:brightness-110 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Apartment</span>
          </Link>

          <Link
            to="/admin/showrooms"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-700 text-card-foreground dark:text-white font-semibold text-xs hover:bg-muted dark:hover:bg-charcoal-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-brand-gold-500" />
            <span>Add Commercial</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-card dark:bg-charcoal-900/80 p-5 rounded-3xl border border-border dark:border-charcoal-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold-500" />
          <span>Rapid Management Shortcuts</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <Link
            to="/admin/apartments"
            className="p-3 rounded-xl bg-muted/40 dark:bg-charcoal-950/80 hover:bg-muted dark:hover:bg-charcoal-800/80 border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all text-center group"
          >
            <Building2 className="w-4 h-4 text-brand-gold-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-card-foreground dark:text-slate-200 block">Apartments</span>
            <span className="text-[10px] text-muted-foreground dark:text-slate-500">Manage Units</span>
          </Link>

          <Link
            to="/admin/showrooms"
            className="p-3 rounded-xl bg-muted/40 dark:bg-charcoal-950/80 hover:bg-muted dark:hover:bg-charcoal-800/80 border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all text-center group"
          >
            <Briefcase className="w-4 h-4 text-brand-gold-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-card-foreground dark:text-slate-200 block">Commercial</span>
            <span className="text-[10px] text-muted-foreground dark:text-slate-500">Offices & Retail</span>
          </Link>

          <Link
            to="/admin/quotes"
            className="p-3 rounded-xl bg-muted/40 dark:bg-charcoal-950/80 hover:bg-muted dark:hover:bg-charcoal-800/80 border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all text-center group"
          >
            <FileText className="w-4 h-4 text-brand-gold-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-card-foreground dark:text-slate-200 block">Quotations</span>
            <span className="text-[10px] text-amber-500 font-semibold">{pendingQuotes} Pending</span>
          </Link>

          <Link
            to="/admin/inquiries"
            className="p-3 rounded-xl bg-muted/40 dark:bg-charcoal-950/80 hover:bg-muted dark:hover:bg-charcoal-800/80 border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all text-center group"
          >
            <MessageSquare className="w-4 h-4 text-brand-gold-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-card-foreground dark:text-slate-200 block">Inquiries</span>
            <span className="text-[10px] text-emerald-500 font-semibold">{newInquiries} New</span>
          </Link>

          <Link
            to="/admin/blogs"
            className="p-3 rounded-xl bg-muted/40 dark:bg-charcoal-950/80 hover:bg-muted dark:hover:bg-charcoal-800/80 border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all text-center group"
          >
            <BookOpen className="w-4 h-4 text-brand-gold-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-card-foreground dark:text-slate-200 block">Articles</span>
            <span className="text-[10px] text-muted-foreground dark:text-slate-500">Living Guides</span>
          </Link>

          <Link
            to="/admin/media"
            className="p-3 rounded-xl bg-muted/40 dark:bg-charcoal-950/80 hover:bg-muted dark:hover:bg-charcoal-800/80 border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all text-center group"
          >
            <ImageIcon className="w-4 h-4 text-brand-gold-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-card-foreground dark:text-slate-200 block">Media</span>
            <span className="text-[10px] text-muted-foreground dark:text-slate-500">Photo Assets</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card dark:bg-charcoal-900 p-5 rounded-3xl border border-border dark:border-charcoal-800 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Serviced Apartments</span>
            <Building2 className="w-5 h-5 text-brand-gold-500" />
          </div>
          <div className="font-heading font-extrabold text-3xl text-card-foreground dark:text-white">
            {apartments.length}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium">
            {availableApartments} Units Ready for Occupancy
          </p>
        </div>

        <div className="bg-card dark:bg-charcoal-900 p-5 rounded-3xl border border-border dark:border-charcoal-800 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Commercial Spaces</span>
            <Briefcase className="w-5 h-5 text-brand-gold-500" />
          </div>
          <div className="font-heading font-extrabold text-3xl text-card-foreground dark:text-white">
            {commercialSpaces.length}
          </div>
          <p className="text-[11px] text-muted-foreground dark:text-slate-400 mt-1.5">
            {showroomsCount} Retail • {officesCount} Corporate Offices
          </p>
        </div>

        <div className="bg-card dark:bg-charcoal-900 p-5 rounded-3xl border border-border dark:border-charcoal-800 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Quotation Requests</span>
            <FileText className="w-5 h-5 text-brand-gold-500" />
          </div>
          <div className="font-heading font-extrabold text-3xl text-card-foreground dark:text-white">
            {quotes.length}
          </div>
          <p className="text-[11px] text-amber-500 mt-1.5 font-medium">
            {pendingQuotes} Pending Review & Callback
          </p>
        </div>

        <div className="bg-card dark:bg-charcoal-900 p-5 rounded-3xl border border-border dark:border-charcoal-800 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Direct Inquiries</span>
            <MessageSquare className="w-5 h-5 text-brand-gold-500" />
          </div>
          <div className="font-heading font-extrabold text-3xl text-card-foreground dark:text-white">
            {inquiries.length}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium">
            {newInquiries} Awaiting Concierge Response
          </p>
        </div>
      </div>

      {/* Recent Quotation Requests */}
      <div className="bg-card dark:bg-charcoal-900 rounded-3xl border border-border dark:border-charcoal-800 overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 border-b border-border dark:border-charcoal-800 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg text-card-foreground dark:text-white">
              Recent Quotation Inquiries
            </h2>
            <p className="text-xs text-muted-foreground dark:text-slate-400">Generated by visitors via the online quotation engine</p>
          </div>

          <Link to="/admin/quotes" className="text-xs font-semibold text-brand-gold-600 dark:text-brand-gold-400 hover:underline flex items-center gap-1">
            View All Quotes <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 dark:bg-charcoal-950 text-muted-foreground dark:text-slate-400 border-b border-border dark:border-charcoal-800">
              <tr>
                <th className="p-4">Ref #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Apartment</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Total Amount</th>
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
                  <td colSpan={7} className="p-12 text-center">
                    <FileText className="w-8 h-8 text-brand-gold-500 mx-auto mb-2 opacity-60" />
                    <p className="text-sm font-semibold text-card-foreground dark:text-white">[No quotations recorded yet]</p>
                    <p className="text-xs text-muted-foreground mt-1">Quotations generated by guests will appear here in real-time.</p>
                  </td>
                </tr>
              ) : (
                quotes.slice(0, 5).map((q) => (
                  <tr key={q.id} className="hover:bg-muted/40 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-gold-600 dark:text-brand-gold-400">{q.quote_number}</td>
                    <td className="p-4">
                      <div className="font-bold text-card-foreground dark:text-white">{q.customer_name}</div>
                      <div className="text-[11px] text-muted-foreground dark:text-slate-400">{q.phone}</div>
                    </td>
                    <td className="p-4 font-medium text-card-foreground dark:text-slate-200">{q.apartment_title}</td>
                    <td className="p-4">{q.duration_count} {q.duration_type}(s)</td>
                    <td className="p-4 font-bold text-card-foreground dark:text-white">{formatCurrency(q.total_price)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        q.status === 'Confirmed' || q.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/admin/quotes"
                          className="p-1.5 rounded-lg bg-muted dark:bg-charcoal-950 text-muted-foreground hover:text-card-foreground"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <a
                          href={`./backend/api/quote_pdf.php?quote_number=${q.quote_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-muted dark:bg-charcoal-950 text-muted-foreground hover:text-card-foreground"
                          title="Print Spec Sheet"
                        >
                          <Printer className="w-3.5 h-3.5 text-brand-gold-500" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
