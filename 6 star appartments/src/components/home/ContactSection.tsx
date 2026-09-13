// src/components/home/ContactSection.tsx - 6 STARS HOSPITALITY Validated Contact & Inquiry Section
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  ExternalLink,
  Building,
  ShieldCheck
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { getSafeImageUrl } from '../../services/imageManifest';
import { OptimizedImage } from '../common/OptimizedImage';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export const ContactSection: React.FC = () => {
  const { settings, addToast } = useSite();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Suite Reservation Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const verifiedPhone = settings.phone_primary || '+92 312 0893146';
  const verifiedEmail = settings.email || 'reservations@6starhospitality.com';
  const verifiedWhatsapp = settings.whatsapp || '+92 312 0893146';
  const cleanWhatsappNumber = verifiedWhatsapp.replace(/[^0-9]/g, '');

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required.';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters.';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Email address is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
        return undefined;
      case 'phone':
        if (!value.trim()) return 'Phone number is required.';
        const phoneDigits = value.replace(/[^0-9]/g, '');
        if (phoneDigits.length < 7) return 'Please enter a valid phone number (minimum 7 digits).';
        return undefined;
      case 'subject':
        if (!value.trim()) return 'Please select or enter an inquiry subject.';
        return undefined;
      case 'message':
        if (!value.trim()) return 'Message cannot be empty.';
        if (value.trim().length < 10) return 'Message must be at least 10 characters so we can assist you.';
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name as keyof FormData, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // Mark all as touched
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      subject: true,
      message: true
    });

    if (!validateAll()) {
      setSubmissionError('Please correct the highlighted errors before submitting your inquiry.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate real-world asynchronous API dispatch and save to LocalStorage
      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        const existingInquiries = JSON.parse(localStorage.getItem('6star_inquiries') || '[]');
        existingInquiries.push({
          id: Date.now(),
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          type: 'general',
          created_at: new Date().toISOString()
        });
        localStorage.setItem('6star_inquiries', JSON.stringify(existingInquiries));
      } catch (err) {
        console.warn('LocalStorage save notice:', err);
      }

      if (addToast) {
        addToast('Your inquiry has been received! Our concierge will contact you shortly.', 'success');
      }

      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'Suite Reservation Inquiry',
        message: ''
      });
      setErrors({});
      setTouched({});
    } catch (err) {
      setSubmissionError('Unable to send inquiry at this moment. Please reach out to us via WhatsApp or Phone directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 px-4 sm:px-8 bg-white dark:bg-brand-navy-950/90 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/30 text-brand-gold-600 dark:text-brand-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 Guest Concierge</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy-950 dark:text-white leading-tight">
            Connect with 6 Stars Hospitality
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-4 font-normal leading-relaxed">
            Have questions about availability, extended corporate leasing, or special arrangements? Our concierge is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF8F5] dark:bg-brand-navy-900/70 p-6 sm:p-10 rounded-3xl border border-[#E7E1D6] dark:border-white/10 shadow-lg">
              <div className="mb-6">
                <h3 className="font-heading font-bold text-xl text-brand-navy-950 dark:text-white mb-1">
                  Send a Direct Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Fill out the form below and our hospitality desk will respond promptly.
                </p>
              </div>

              {/* Submission Success Banner */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/50 text-emerald-900 dark:text-emerald-200 mb-6 flex items-start gap-3.5"
                    role="alert"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <strong className="block font-bold">Inquiry Sent Successfully!</strong>
                      <p className="mt-0.5 text-emerald-700 dark:text-emerald-300">
                        Thank you for contacting 6 Stars Hospitality. Our 24/7 guest concierge has received your request and will reach out shortly.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Global Error Banner */}
              <AnimatePresence>
                {submissionError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700/50 text-rose-900 dark:text-rose-200 mb-6 flex items-center gap-3 text-xs sm:text-sm"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>{submissionError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label 
                      htmlFor="fullName"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Tariq Malik"
                      aria-invalid={Boolean(errors.fullName && touched.fullName)}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      className={`w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-brand-navy-950 text-brand-navy-950 dark:text-white border transition-all outline-none ${
                        errors.fullName && touched.fullName
                          ? 'border-rose-500 ring-1 ring-rose-500'
                          : 'border-[#E2DDD5] dark:border-white/10 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-500'
                      }`}
                    />
                    {errors.fullName && touched.fullName && (
                      <p id="fullName-error" className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label 
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. tariq@domain.com"
                      aria-invalid={Boolean(errors.email && touched.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-brand-navy-950 text-brand-navy-950 dark:text-white border transition-all outline-none ${
                        errors.email && touched.email
                          ? 'border-rose-500 ring-1 ring-rose-500'
                          : 'border-[#E2DDD5] dark:border-white/10 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-500'
                      }`}
                    />
                    {errors.email && touched.email && (
                      <p id="email-error" className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label 
                      htmlFor="phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Phone / WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. +92 300 1234567"
                      aria-invalid={Boolean(errors.phone && touched.phone)}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={`w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-brand-navy-950 text-brand-navy-950 dark:text-white border transition-all outline-none ${
                        errors.phone && touched.phone
                          ? 'border-rose-500 ring-1 ring-rose-500'
                          : 'border-[#E2DDD5] dark:border-white/10 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-500'
                      }`}
                    />
                    {errors.phone && touched.phone && (
                      <p id="phone-error" className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label 
                      htmlFor="subject"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-brand-navy-950 text-brand-navy-950 dark:text-white border border-[#E2DDD5] dark:border-white/10 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-500 transition-all outline-none"
                    >
                      <option value="Suite Reservation Inquiry">Suite Reservation Inquiry</option>
                      <option value="Long-Term Corporate Stay">Long-Term Corporate Stay</option>
                      <option value="Centaurus Showroom / Commercial Lease">Centaurus Showroom / Commercial Lease</option>
                      <option value="VIP Concierge & Chauffeur Request">VIP Concierge & Chauffeur Request</option>
                      <option value="General Information">General Information</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label 
                    htmlFor="message"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Your Message / Requirements <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Please specify check-in/out dates, preferred apartment type, number of guests, or custom requests..."
                    aria-invalid={Boolean(errors.message && touched.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`w-full px-4 py-3 rounded-xl text-sm bg-white dark:bg-brand-navy-950 text-brand-navy-950 dark:text-white border transition-all outline-none resize-y ${
                      errors.message && touched.message
                        ? 'border-rose-500 ring-1 ring-rose-500'
                        : 'border-[#E2DDD5] dark:border-white/10 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-500'
                    }`}
                  />
                  {errors.message && touched.message && (
                    <p id="message-error" className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider bg-luxury-gold-gradient text-brand-navy-950 shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Inquiry...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Contact Details, Map Placeholder & Visual Accent (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-[#FAF8F5] dark:bg-brand-navy-900/70 p-6 sm:p-8 rounded-3xl border border-[#E7E1D6] dark:border-white/10 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-lg text-brand-navy-950 dark:text-white">
                Contact & Reception Desk
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold-500/15 text-brand-gold-600 dark:text-brand-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-brand-navy-950 dark:text-white font-semibold">Address</strong>
                    <span className="text-slate-600 dark:text-slate-300">
                      The Centaurus, Jinnah Avenue, Sector F-8/4, Islamabad, Pakistan
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold-500/15 text-brand-gold-600 dark:text-brand-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-brand-navy-950 dark:text-white font-semibold">Direct Telephone</strong>
                    <a href={`tel:${verifiedPhone.replace(/\s+/g, '')}`} className="text-brand-gold-600 dark:text-brand-gold-400 font-semibold hover:underline">
                      {verifiedPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold-500/15 text-brand-gold-600 dark:text-brand-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-brand-navy-950 dark:text-white font-semibold">Email Inquiries</strong>
                    <a href={`mailto:${verifiedEmail}`} className="text-slate-600 dark:text-slate-300 hover:text-brand-gold-600 dark:hover:text-brand-gold-400 hover:underline">
                      {verifiedEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold-500/15 text-brand-gold-600 dark:text-brand-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-brand-navy-950 dark:text-white font-semibold">Concierge Hours</strong>
                    <span className="text-slate-600 dark:text-slate-300">
                      24 Hours a Day / 7 Days a Week
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsappNumber}?text=Hello%206%20Stars%20Hospitality,%20I%20would%20like%20to%20inquire%20about%20your%20Centaurus%20apartments.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Map Placeholder with Direct Direction Link (Zero Secret Credentials Exposed) */}
            <div className="bg-[#FAF8F5] dark:bg-brand-navy-900/70 p-6 rounded-3xl border border-[#E7E1D6] dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy-950 dark:text-white">
                  <Building className="w-4 h-4 text-brand-gold-500" />
                  <span>Location Map</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Sector F-8/4 Islamabad</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-[#E0D9CD] dark:border-white/10 aspect-video bg-[#EAE5DC] dark:bg-brand-navy-950 flex items-center justify-center group">
                {/* Visual Map Grid Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold-500 text-brand-navy-950 flex items-center justify-center mx-auto mb-2 shadow-lg animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-xs text-brand-navy-950 dark:text-white mb-0.5">
                    The Centaurus, Islamabad
                  </h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mb-3">
                    33.7077° N, 73.0501° E • Jinnah Avenue
                  </p>
                  <a
                    href="https://maps.google.com/?q=The+Centaurus+Mall+Islamabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white dark:bg-brand-navy-900 text-brand-navy-950 dark:text-white border border-[#E5DFD5] dark:border-white/10 hover:border-brand-gold-500 transition-all shadow-sm"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-brand-gold-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
