// src/components/quote/QuoteCalculator.tsx - 6 STARS HOSPITALITY Conversion-Focused Quotation System
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { Quotation } from '../../types';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { resolveSafeImagePath } from '../common/OptimizedImage';
import { 
  Calculator, 
  Check, 
  Printer, 
  MessageSquare, 
  ShieldCheck, 
  RotateCcw,
  Info,
  CheckCircle2,
  ArrowRight,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuoteCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { apartments, settings, addToast } = useSite();

  const preselectedAptId = searchParams.get('apartment_id');
  const preselectedCatId = searchParams.get('category');
  const preselectedDuration = searchParams.get('duration');

  const [selectedApartmentId, setSelectedApartmentId] = useState<number>(1);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [durationType, setDurationType] = useState<'night' | 'month' | 'year'>(
    (preselectedDuration as 'night' | 'month' | 'year') || 'night'
  );
  const [durationCount, setDurationCount] = useState<number>(3);
  const [guests, setGuests] = useState<number>(2);

  // Additional requirements
  const [additionalRequirements, setAdditionalRequirements] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState('');

  // Customer contact info
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<Quotation | null>(null);

  // Sync preselection
  useEffect(() => {
    if (apartments.length > 0) {
      if (preselectedAptId) {
        const found = apartments.find(a => a.id === Number(preselectedAptId));
        if (found) setSelectedApartmentId(found.id);
      } else if (preselectedCatId) {
        const found = apartments.find(a => a.category_id === Number(preselectedCatId));
        if (found) setSelectedApartmentId(found.id);
      } else if (!selectedApartmentId) {
        setSelectedApartmentId(apartments[0].id);
      }
    }
  }, [apartments, preselectedAptId, preselectedCatId, selectedApartmentId]);

  // Sync date difference to duration count if dates picked
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setDurationCount(diffDays);
        setDurationType('night');
      }
    }
  }, [checkInDate, checkOutDate]);

  const selectedApt = apartments.find(a => a.id === selectedApartmentId) || apartments[0];

  const requirementOptions = [
    'Margalla Hills View Preferred',
    'High Floor Allocation (18th-23rd Floor)',
    'Late Check-in Assistance',
    'Chauffeured Airport Transfer Coordination',
    'Executive Workstation & Ergonomic Chair'
  ];

  const toggleRequirement = (req: string) => {
    setAdditionalRequirements(prev =>
      prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]
    );
  };

  // Pricing calculation
  const baseRate = selectedApt ? selectedApt.price : 20000;
  let subtotal = 0;
  let discountPercentage = 0;

  if (durationType === 'night') {
    subtotal = baseRate * durationCount;
    if (durationCount >= 30) {
      discountPercentage = 25;
      subtotal *= 0.75;
    } else if (durationCount >= 7) {
      discountPercentage = 10;
      subtotal *= 0.90;
    }
  } else if (durationType === 'month') {
    subtotal = baseRate * 22 * durationCount;
    if (durationCount >= 6) {
      discountPercentage = 12;
      subtotal *= 0.88;
    }
  } else if (durationType === 'year') {
    discountPercentage = 20;
    subtotal = baseRate * 19 * 12 * durationCount;
  }

  const facilityTax = Math.round(subtotal * 0.05);
  const estimatedTotal = Math.round(subtotal + facilityTax);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      addToast('Please enter your full name and phone number', 'error');
      return;
    }

    if (!selectedApt) {
      addToast('Please select a valid apartment suite', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitQuote({
        customer_name: customerName,
        phone,
        email,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        apartment_id: selectedApt.id,
        duration_type: durationType,
        duration_count: durationCount,
        guests,
        additional_requirements: additionalRequirements,
        notes: customNotes
      });

      if (res.success && res.data) {
        setGeneratedQuote(res.data);
        addToast('Quotation generated successfully!');
      } else {
        addToast(res.error || 'Failed to submit quote', 'error');
      }
    } catch {
      addToast('An error occurred while generating quote', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    if (generatedQuote) {
      window.open(`./backend/api/quote_pdf.php?quote_number=${generatedQuote.quote_number}`, '_blank');
    } else {
      window.print();
    }
  };

  const verifiedWhatsapp = (settings.whatsapp || '923120893146').replace(/[^0-9]/g, '');

  if (apartments.length === 0) {
    return (
      <div className="bg-card dark:bg-brand-navy-900 border border-border dark:border-white/10 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xl">
        <Building2 className="w-12 h-12 text-brand-gold-500 mx-auto mb-4" />
        <h3 className="font-heading font-bold text-xl text-card-foreground dark:text-white mb-2">
          [No apartments available]
        </h3>
        <p className="text-xs text-muted-foreground dark:text-slate-400 mb-6">
          Our residential suites are currently being updated. Please contact our concierge desk directly at +92 312 0893146 for direct reservations.
        </p>
        <a
          href={`https://wa.me/${verifiedWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg uppercase tracking-wider"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact WhatsApp Concierge</span>
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {generatedQuote ? (
          /* Official Stamped Quotation Confirmation */
          <motion.div
            key="confirmed-quote"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-card dark:bg-brand-navy-900 border border-brand-gold-500/40 rounded-3xl p-6 sm:p-12 shadow-2xl relative space-y-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border dark:border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-brand-gold-500/15 text-brand-gold-600 dark:text-brand-gold-300 border border-brand-gold-500/30 uppercase tracking-widest mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold-500" />
                  <span>Estimated Quotation Generated</span>
                </div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-card-foreground dark:text-white">
                  Quotation Ref #{generatedQuote.quote_number}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400 mt-1">
                  Issued on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • Valid for 14 Calendar Days
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted dark:bg-brand-navy-950 border border-border dark:border-white/10 text-card-foreground dark:text-white hover:bg-muted/80 dark:hover:bg-brand-navy-800 text-xs font-semibold transition-colors"
                >
                  <Printer className="w-4 h-4 text-brand-gold-500" />
                  <span>Print / Save PDF</span>
                </button>

                <a
                  href={`https://wa.me/${verifiedWhatsapp}?text=Hello%206%20Stars%20Hospitality,%20I%20have%20received%20Quotation%20%23${generatedQuote.quote_number}%20for%20${encodeURIComponent(generatedQuote.apartment_title)}%20estimated%20at%20${encodeURIComponent(formatCurrency(generatedQuote.total_price))}.%20Please%20proceed%20with%20booking.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all uppercase tracking-wider"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send to WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Crucial Trust Distinction Box */}
            <div className="p-4 rounded-2xl bg-brand-gold-500/10 border border-brand-gold-500/30 flex items-start gap-3 text-xs text-brand-gold-700 dark:text-brand-gold-200">
              <Info className="w-4 h-4 text-brand-gold-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-brand-gold-600 dark:text-brand-gold-300 font-semibold mb-0.5">Important Booking Distinction:</strong>
                <span>This document represents a formal <strong>Estimated Quotation</strong> based on current tariff rates. Final confirmed booking and key allocation occur upon verification of identity credentials and key handover by our concierge desk at The Centaurus reception.</span>
              </div>
            </div>

            {/* Summary Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-muted-foreground dark:text-slate-300">
              <div className="bg-muted/30 dark:bg-brand-navy-950/80 p-5 rounded-2xl border border-border dark:border-white/10 space-y-2">
                <h4 className="font-heading font-bold text-sm text-brand-gold-600 dark:text-brand-gold-400 mb-3 uppercase tracking-wider">
                  Guest Information
                </h4>
                <p><span className="text-muted-foreground dark:text-slate-400">Guest Name:</span> <strong className="text-card-foreground dark:text-white">{generatedQuote.customer_name}</strong></p>
                <p><span className="text-muted-foreground dark:text-slate-400">Phone / WhatsApp:</span> <strong className="text-card-foreground dark:text-white">{generatedQuote.phone}</strong></p>
                {generatedQuote.email && <p><span className="text-muted-foreground dark:text-slate-400">Email:</span> <strong className="text-card-foreground dark:text-white">{generatedQuote.email}</strong></p>}
                <p><span className="text-muted-foreground dark:text-slate-400">Total Occupants:</span> <strong className="text-card-foreground dark:text-white">{generatedQuote.guests} Guests</strong></p>
                {generatedQuote.check_in_date && (
                  <p><span className="text-muted-foreground dark:text-slate-400">Planned Stay Dates:</span> <strong className="text-card-foreground dark:text-white">{generatedQuote.check_in_date} &rarr; {generatedQuote.check_out_date || 'Flexible'}</strong></p>
                )}
              </div>

              <div className="bg-muted/30 dark:bg-brand-navy-950/80 p-5 rounded-2xl border border-border dark:border-white/10 space-y-2">
                <h4 className="font-heading font-bold text-sm text-brand-gold-600 dark:text-brand-gold-400 mb-3 uppercase tracking-wider">
                  Residence Specifications
                </h4>
                <p><span className="text-muted-foreground dark:text-slate-400">Selected Residence:</span> <strong className="text-card-foreground dark:text-white">{generatedQuote.apartment_title}</strong></p>
                <p><span className="text-muted-foreground dark:text-slate-400">Lease Term:</span> <strong className="text-card-foreground dark:text-white">{generatedQuote.duration_count} {generatedQuote.duration_type}(s)</strong></p>
                <p><span className="text-muted-foreground dark:text-slate-400">Property Location:</span> <span className="text-card-foreground dark:text-white">The Centaurus, Jinnah Avenue, Sector F-8, Islamabad</span></p>
                {generatedQuote.additional_requirements && generatedQuote.additional_requirements.length > 0 && (
                  <div>
                    <span className="text-muted-foreground dark:text-slate-400 block mb-1">Requested Preferences:</span>
                    <ul className="list-disc list-inside text-brand-gold-600 dark:text-brand-gold-300">
                      {generatedQuote.additional_requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="bg-card dark:bg-brand-navy-950/90 rounded-2xl border border-border dark:border-white/10 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-muted/50 dark:bg-brand-navy-950 text-muted-foreground dark:text-slate-400 border-b border-border dark:border-white/10">
                  <tr>
                    <th className="p-4">Description</th>
                    <th className="p-4">Details</th>
                    <th className="p-4 text-right">Estimated Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-white/5 text-muted-foreground dark:text-slate-300">
                  <tr>
                    <td className="p-4 font-bold text-card-foreground dark:text-white">{generatedQuote.apartment_title}</td>
                    <td className="p-4">{generatedQuote.duration_count} {generatedQuote.duration_type}(s) residence tariff</td>
                    <td className="p-4 text-right font-semibold text-card-foreground dark:text-white">{formatCurrency(generatedQuote.base_price)}</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-muted-foreground dark:text-slate-400">Hospitality Services & Utilities (5%)</td>
                    <td className="p-4 text-muted-foreground dark:text-slate-400">Power backup, fiber internet, gym & pool privileges</td>
                    <td className="p-4 text-right font-semibold">{formatCurrency(generatedQuote.tax_amount)}</td>
                  </tr>
                  <tr className="bg-muted/30 dark:bg-brand-navy-950/60 font-heading">
                    <td className="p-4 text-sm sm:text-base font-extrabold text-card-foreground dark:text-white" colSpan={2}>
                      Estimated Total Payable
                    </td>
                    <td className="p-4 text-right text-base sm:text-xl font-extrabold text-brand-gold-600 dark:text-brand-gold-400">
                      {formatCurrency(generatedQuote.total_price)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setGeneratedQuote(null)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-brand-gold-600 dark:text-slate-400 dark:hover:text-brand-gold-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Configure Another Quotation</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Interactive Luxury Reservation & Quotation Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Form Input Controls */}
            <form onSubmit={handleSubmitQuote} className="lg:col-span-7 bg-card dark:bg-brand-navy-900/80 rounded-3xl p-6 sm:p-8 border border-border dark:border-white/10 shadow-xl space-y-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-card-foreground dark:text-white">
                  Request an Official Quotation
                </h2>
                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1 font-light leading-relaxed">
                  Provide your preferred dates, residence category, and requirements to generate a transparent price estimation.
                </p>
              </div>

              {/* 1. Preferred Apartment / Suite */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold-600 dark:text-brand-gold-400 mb-2">
                  1. Preferred Apartment / Suite *
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {apartments.map((apt) => {
                    const isSelected = apt.id === selectedApartmentId;
                    const primaryImg = apt.images && apt.images.length > 0 ? apt.images[0] : './images/background image.jpeg';
                    return (
                      <div
                        key={apt.id}
                        onClick={() => setSelectedApartmentId(apt.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-brand-gold-500/15 border-brand-gold-500 text-card-foreground dark:text-white shadow-md'
                            : 'bg-muted/30 dark:bg-brand-navy-950/60 border-border dark:border-white/5 text-muted-foreground dark:text-slate-300 hover:border-brand-gold-500/40 dark:hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveSafeImagePath(primaryImg)}
                            alt={apt.title}
                            className="w-12 h-10 object-cover rounded-lg shrink-0 border border-border/40"
                            width={120}
                            height={100}
                          />
                          <div>
                            <p className="font-heading font-bold text-sm text-card-foreground dark:text-white">{apt.title}</p>
                            <p className="text-[11px] text-muted-foreground dark:text-slate-400">
                              {apt.bedrooms} Bed • Up to {apt.guest_capacity} Guests • {apt.floor}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-heading font-bold text-sm text-brand-gold-600 dark:text-brand-gold-400">
                            {formatCurrency(apt.price)}
                          </p>
                          <p className="text-[10px] text-muted-foreground dark:text-slate-400">/ {apt.price_type}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Dates & Rental Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold-600 dark:text-brand-gold-400 mb-1.5">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-background dark:bg-brand-navy-950 border border-input dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground dark:text-white focus:outline-none focus:border-brand-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold-600 dark:text-brand-gold-400 mb-1.5">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-background dark:bg-brand-navy-950 border border-input dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground dark:text-white focus:outline-none focus:border-brand-gold-500"
                    />
                  </div>
                </div>
              </div>

              {/* Duration Type & Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold-600 dark:text-brand-gold-400 mb-1.5">
                    Rental Duration Mode
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-muted/40 dark:bg-brand-navy-950 p-1 rounded-xl border border-border dark:border-white/10 text-xs">
                    {[
                      { key: 'night', label: 'Nightly' },
                      { key: 'month', label: 'Monthly' },
                      { key: 'year', label: 'Annual' },
                    ].map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => setDurationType(d.key as any)}
                        className={`py-1.5 rounded-lg font-semibold transition-all ${
                          durationType === d.key
                            ? 'bg-brand-gold-500 text-charcoal-950 font-bold shadow-md'
                            : 'text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold-600 dark:text-brand-gold-400 mb-1.5">
                    Duration: {durationCount} {durationType}(s)
                  </label>
                  <div className="flex items-center gap-3 bg-muted/40 dark:bg-brand-navy-950 px-3.5 py-2 rounded-xl border border-border dark:border-white/10">
                    <input
                      type="range"
                      min="1"
                      max={durationType === 'night' ? 45 : durationType === 'month' ? 12 : 3}
                      value={durationCount}
                      onChange={(e) => setDurationCount(Number(e.target.value))}
                      className="flex-1 accent-brand-gold-500 cursor-pointer"
                    />
                    <span className="font-bold text-card-foreground dark:text-white text-xs shrink-0 min-w-[45px] text-right">
                      {durationCount} {durationType.slice(0, 1).toUpperCase() + durationType.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Number of Guests */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold-600 dark:text-brand-gold-400 mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        guests === num
                          ? 'bg-brand-gold-500 text-charcoal-950 border-brand-gold-500 font-bold shadow-md'
                          : 'bg-muted/30 dark:bg-brand-navy-950 text-muted-foreground dark:text-slate-300 border-border dark:border-white/10 hover:border-brand-gold-500/40'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Additional Requirements Checklist */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold-600 dark:text-brand-gold-400 mb-2">
                  Additional Stay Requirements (Optional)
                </label>
                <div className="space-y-2">
                  {requirementOptions.map((opt) => {
                    const isChecked = additionalRequirements.includes(opt);
                    return (
                      <div
                        key={opt}
                        onClick={() => toggleRequirement(opt)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                          isChecked
                            ? 'bg-brand-gold-500/10 border-brand-gold-500/60 text-card-foreground dark:text-white'
                            : 'bg-muted/20 dark:bg-brand-navy-950/40 border-border/80 dark:border-white/5 text-muted-foreground dark:text-slate-400 hover:border-brand-gold-500/30'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                          isChecked ? 'bg-brand-gold-500 border-brand-gold-500 text-charcoal-950' : 'border-border dark:border-white/20'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Customer Contact Details */}
              <div className="pt-2 border-t border-border dark:border-white/10 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold-600 dark:text-brand-gold-400 mb-1">
                  Contact Information
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-background dark:bg-brand-navy-950 border border-input dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-background dark:bg-brand-navy-950 border border-input dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background dark:bg-brand-navy-950 border border-input dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Additional requests or notes (e.g. flight arrival details)..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full bg-background dark:bg-brand-navy-950 border border-input dark:border-white/10 rounded-xl px-4 py-2 text-xs text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-heading font-bold text-xs tracking-wider uppercase text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-xl shadow-brand-gold-500/20 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Generating Official Quotation...</span>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    <span>Generate Instant Quotation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Right 5 Columns: Sticky Quotation Summary Panel */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              <div className="bg-card dark:bg-brand-navy-900 rounded-3xl p-6 sm:p-8 border border-brand-gold-500/30 shadow-xl space-y-5">
                <div className="border-b border-border dark:border-white/10 pb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold-600 dark:text-brand-gold-400 block mb-1">
                    Live Calculation
                  </span>
                  <h3 className="font-heading font-extrabold text-xl text-card-foreground dark:text-white">
                    Quotation Summary
                  </h3>
                </div>

                {/* Selected Property Preview */}
                {selectedApt && (
                  <div className="flex items-center gap-3 p-3 bg-muted/40 dark:bg-brand-navy-950 rounded-2xl border border-border dark:border-white/5">
                    <img
                      src={resolveSafeImagePath(selectedApt.images[0] || './images/background image.jpeg')}
                      alt={selectedApt.title}
                      className="w-14 h-12 object-cover rounded-xl shrink-0 border border-border/40"
                      width={140}
                      height={120}
                    />
                    <div className="overflow-hidden">
                      <p className="font-heading font-bold text-xs text-card-foreground dark:text-white truncate">{selectedApt.title}</p>
                      <p className="text-[11px] text-brand-gold-600 dark:text-brand-gold-300">{selectedApt.floor} • {selectedApt.view_type}</p>
                    </div>
                  </div>
                )}

                {/* Line Items */}
                <div className="space-y-3 text-xs text-muted-foreground dark:text-slate-300 pb-4 border-b border-border dark:border-white/10">
                  <div className="flex justify-between">
                    <span>Base Residence ({durationCount} {durationType}s)</span>
                    <span className="font-semibold text-card-foreground dark:text-white">{formatCurrency(subtotal)}</span>
                  </div>

                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Extended Stay Privilege Discount</span>
                      <span>-{discountPercentage}% Applied</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Occupancy Allocation</span>
                    <span className="text-card-foreground dark:text-white font-medium">{guests} Guests</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground dark:text-slate-400">
                    <span>Facility & Backup Utilities Charge (5%)</span>
                    <span>{formatCurrency(facilityTax)}</span>
                  </div>
                </div>

                {/* Estimated Total */}
                <div className="flex items-baseline justify-between py-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground dark:text-slate-400 block">
                      Estimated Total
                    </span>
                    <span className="text-[11px] text-muted-foreground/70 dark:text-slate-500">Includes all utilities & power</span>
                  </div>
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-gold-600 dark:text-brand-gold-400">
                    {formatCurrency(estimatedTotal)}
                  </div>
                </div>

                {/* Trust Notice */}
                <div className="p-3.5 bg-muted/40 dark:bg-brand-navy-950/80 rounded-xl border border-border dark:border-white/5 text-[11px] text-muted-foreground dark:text-slate-400 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-gold-500 shrink-0 mt-0.5" />
                  <span>
                    Rates are formal estimates. Zero payment required until arrival verification at The Centaurus.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
