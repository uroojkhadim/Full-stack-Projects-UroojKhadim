// src/pages/ContactPage.tsx - 6 STARS HOSPITALITY Official Contact & Reservations Desk
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { api } from '../services/api';
import { Inquiry } from '../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Building2,
  Calculator,
  ArrowUpRight
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, addToast } = useSite();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<Inquiry['inquiry_type']>('Apartment Rental');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const verifiedPhone = settings.phone_primary || '+92 312 0893146';
  const verifiedWhatsapp = settings.whatsapp || '+92 312 0893146';
  const cleanWhatsappNumber = verifiedWhatsapp.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      addToast('Please enter your name and message', 'error');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      addToast('Please provide an email or phone number for reply', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitInquiry({
        name,
        email,
        phone,
        inquiry_type: inquiryType,
        subject: subject || `${inquiryType} Inquiry from ${name}`,
        message
      });

      if (res.success) {
        addToast(res.message || 'Inquiry submitted successfully! A concierge manager will contact you.');
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        setInquiryType('Apartment Rental');
      } else {
        addToast(res.error || 'Failed to send inquiry', 'error');
      }
    } catch {
      addToast('An error occurred while submitting message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/25 text-brand-gold-700 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Concierge & Reservations</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-brand-navy-950 dark:text-white tracking-tight">
          Contact 6 Stars Hospitality
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
          Our dedicated concierge desk is available 24/7 to arrange residential viewings, manage corporate bookings, and prepare immediate lease quotations for The Centaurus.
        </p>
      </div>

      {/* Direct Quick Action CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-14">
        <a
          href={`tel:${verifiedPhone.replace(/\s+/g, '')}`}
          className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-[#E5DFD5] dark:border-charcoal-800 hover:border-brand-gold-500/50 transition-all flex items-center justify-center gap-3 text-brand-navy-950 dark:text-white group shadow-sm dark:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-charcoal-950 border border-[#E2DDD5] dark:border-charcoal-700 flex items-center justify-center text-brand-gold-600 dark:text-gold-400 group-hover:scale-105 transition-transform">
            <Phone className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Direct Call</span>
            <span className="text-sm font-bold text-brand-navy-950 dark:text-white group-hover:text-brand-gold-600 dark:group-hover:text-gold-400 transition-colors">Call Now</span>
          </div>
        </a>

        <a
          href={`https://wa.me/${cleanWhatsappNumber}?text=Hello%206%20Stars%20Hospitality,%20I%20would%20like%20to%20inquire%20about%20your%20Centaurus%20apartments.`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-emerald-500/30 hover:border-emerald-500 transition-all flex items-center justify-center gap-3 text-brand-navy-950 dark:text-white group shadow-sm dark:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-950 border border-emerald-500/30 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider font-semibold">Instant Chat</span>
            <span className="text-sm font-bold text-brand-navy-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">WhatsApp Us</span>
          </div>
        </a>

        <Link
          to="/quote"
          className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-brand-gold-500/30 hover:border-brand-gold-500 transition-all flex items-center justify-center gap-3 text-brand-navy-950 dark:text-white group shadow-sm dark:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-gold-500/10 border border-brand-gold-500/30 flex items-center justify-center text-brand-gold-600 dark:text-gold-400 group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[11px] text-brand-gold-600 dark:text-gold-400 block uppercase tracking-wider font-semibold">Instant Computation</span>
            <span className="text-sm font-bold text-brand-navy-950 dark:text-white group-hover:text-brand-gold-600 dark:group-hover:text-gold-300 transition-colors">Get Instant Quotation</span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        {/* Contact Info & Locations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-charcoal-900/80 rounded-3xl p-6 sm:p-8 border border-[#E5DFD5] dark:border-charcoal-800 shadow-sm dark:shadow-xl space-y-6">
            <h3 className="font-heading font-bold text-xl text-brand-navy-950 dark:text-white">
              Direct Contact Information
            </h3>

            <div className="space-y-4 text-sm">
              <a 
                href={`tel:${verifiedPhone.replace(/\s+/g, '')}`}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-charcoal-950/60 border border-[#E2DDD5] dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-colors"
              >
                <Phone className="w-5 h-5 text-brand-gold-600 dark:text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Primary VIP Hotline</p>
                  <p className="font-bold text-brand-navy-950 dark:text-white text-base">{verifiedPhone}</p>
                  <p className="text-[11px] text-brand-gold-600 dark:text-gold-400/80 font-medium">Available 24/7 for Reservations</p>
                </div>
              </a>

              <a 
                href={`https://wa.me/${cleanWhatsappNumber}?text=Hello%206%20Stars%20Hospitality,%20I%20would%20like%20to%20connect%20with%20your%20reception.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-charcoal-950/60 border border-emerald-500/30 hover:border-emerald-500 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">WhatsApp Concierge Desk</p>
                  <p className="font-bold text-brand-navy-950 dark:text-white text-base">{verifiedWhatsapp}</p>
                </div>
              </a>

              {settings.email && (
                <a 
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-charcoal-950/60 border border-[#E2DDD5] dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-colors"
                >
                  <Mail className="w-5 h-5 text-brand-gold-600 dark:text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Official Inquiries Email</p>
                    <p className="font-bold text-brand-navy-950 dark:text-white">{settings.email}</p>
                  </div>
                </a>
              )}
            </div>

            <div className="pt-6 border-t border-[#EAE5DC] dark:border-charcoal-800 space-y-4">
              <div>
                <h4 className="font-heading font-semibold text-sm text-brand-navy-950 dark:text-white mb-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-brand-gold-600 dark:text-gold-400" />
                  <span>The Centaurus Residence Suite</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tower B, 18th Floor, The Centaurus, Jinnah Avenue, Sector F-8/4, Islamabad, Pakistan.
                </p>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-sm text-brand-navy-950 dark:text-white mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-gold-600 dark:text-gold-400" />
                  <span>Corporate Viewing Lounge</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Elysium Tower, Jinnah Avenue (Opposite The Centaurus), Islamabad.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Inquiry Form with 5 Dropdown Options (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-charcoal-900 rounded-3xl p-6 sm:p-10 border border-[#E5DFD5] dark:border-gold-500/30 shadow-sm dark:shadow-2xl">
          <div className="mb-6">
            <span className="text-brand-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Priority Assistance
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy-950 dark:text-white">
              Send an Inquiry to Our Concierge
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Complete the inquiry details below. A senior hospitality manager will respond promptly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full bg-[#FAF7F2] dark:bg-charcoal-950 border border-[#E2DDD5] dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-brand-navy-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 312 0893146"
                  className="w-full bg-[#FAF7F2] dark:bg-charcoal-950 border border-[#E2DDD5] dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-brand-navy-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF7F2] dark:bg-charcoal-950 border border-[#E2DDD5] dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-brand-navy-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
                />
              </div>

              {/* Exact Required 5-item Dropdown */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Inquiry Type *</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value as Inquiry['inquiry_type'])}
                  className="w-full bg-[#FAF7F2] dark:bg-charcoal-950 border border-[#E2DDD5] dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-brand-navy-950 dark:text-white focus:outline-none focus:border-brand-gold-500"
                >
                  <option value="Apartment Rental">Apartment Rental</option>
                  <option value="Suite Rental">Suite Rental</option>
                  <option value="Showroom Inquiry">Showroom Inquiry</option>
                  <option value="Office Inquiry">Office Inquiry</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject / Specific Requirement</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Two-bedroom Margalla suite for 10 nights"
                className="w-full bg-[#FAF7F2] dark:bg-charcoal-950 border border-[#E2DDD5] dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-brand-navy-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message / Stay Parameters *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please state expected arrival dates, number of guests, or specific commercial lease requirements..."
                className="w-full bg-[#FAF7F2] dark:bg-charcoal-950 border border-[#E2DDD5] dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-brand-navy-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-brand-navy-950 bg-luxury-gold-gradient hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Inquiry...' : 'Submit Priority Inquiry'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Styled Location & Map Section */}
      <div className="bg-white dark:bg-charcoal-900/90 rounded-3xl overflow-hidden border border-[#E5DFD5] dark:border-charcoal-800 shadow-sm dark:shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-brand-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Geographic Prime Location
            </span>
            <h3 className="font-heading font-extrabold text-2xl text-brand-navy-950 dark:text-white">
              The Centaurus Islamabad Location
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Intersection of Jinnah Avenue and Faisal Avenue, Sector F-8/4, Islamabad.
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=The+Centaurus+Mall+Islamabad"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-brand-navy-950 dark:text-gold-400 bg-[#FAF7F2] dark:bg-charcoal-950 border border-[#E2DDD5] dark:border-gold-500/30 hover:border-brand-gold-500 transition-all shrink-0 self-start sm:self-auto"
          >
            <span>Open in Google Maps App</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Embedded Map Frame */}
        <div className="relative aspect-[16/7] min-h-[300px] rounded-2xl overflow-hidden border border-[#E5DFD5] dark:border-charcoal-800 bg-[#FAF7F2] dark:bg-charcoal-950">
          <iframe
            title="The Centaurus Islamabad Location Map"
            src="https://maps.google.com/maps?q=The+Centaurus+Mall+Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 opacity-90 hover:opacity-100 transition-opacity"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
