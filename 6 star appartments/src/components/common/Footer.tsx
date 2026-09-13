// src/components/common/Footer.tsx - 6 STARS HOSPITALITY Official Luxury Footer
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  X
} from 'lucide-react';
import { BRAND_LOGO, getSafeImageUrl } from '../../services/imageManifest';
import { AnimatePresence, motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const { settings } = useSite();
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const primaryLinks = [
    { label: 'Home', path: '/#home', target: 'home' },
    { label: 'About', path: '/#about', target: 'about' },
    { label: 'Services', path: '/#services', target: 'services' },
    { label: 'Properties & Rooms', path: '/#properties', target: 'properties' },
    { label: 'Gallery (132 Photos)', path: '/#gallery', target: 'gallery' },
    { label: 'Contact Concierge', path: '/#contact', target: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    const el = document.getElementById(target);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const verifiedPhone = settings.phone_primary || '+92 312 0893146';
  const verifiedEmail = settings.email || 'reservations@6starhospitality.com';
  const verifiedWhatsapp = settings.whatsapp || '+92 312 0893146';
  const cleanWhatsappNumber = verifiedWhatsapp.replace(/[^0-9]/g, '');

  const logoUrl = BRAND_LOGO ? getSafeImageUrl(BRAND_LOGO.relativePath) : '/images/logo/WhatsApp%20Image%202026-09-08%20at%206.45.07%20PM.jpeg';

  return (
    <footer className="bg-[#FAF7F2] text-[#334155] border-t border-[#E5DFD5] dark:bg-brand-navy-950 dark:text-slate-400 dark:border-brand-gold-500/20 pt-16 pb-12 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E5DFD5] dark:border-white/10">
          {/* Brand & Description (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#FAF6EE] p-0.5 border border-brand-gold-500/50 shadow-md shrink-0 flex items-center justify-center">
                <img 
                  src={logoUrl} 
                  alt="6 STARS HOSPITALITY Official Logo" 
                  className="w-full h-full object-contain"
                  width={48}
                  height={48}
                  loading="lazy"
                />
              </div>

              <div>
                <span className="font-heading font-extrabold text-base tracking-wider text-brand-navy-950 dark:text-white block">
                  6 STARS HOSPITALITY
                </span>
                <p className="text-[10px] text-brand-gold-600 dark:text-brand-gold-400 uppercase tracking-widest font-bold">
                  The Centaurus • Islamabad
                </p>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-w-md pr-4">
              Distinguished luxury serviced residences, executive study suites, and commercial leasing at The Centaurus, Islamabad. Delivering five-star hospitality standards, 100% uninterrupted power, and total privacy for visiting dignitaries, corporate delegations, and international travelers.
            </p>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com/6starshospitality"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white dark:bg-brand-navy-900 border border-[#E0D9CD] dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-gold-600 dark:hover:text-brand-gold-400 hover:border-brand-gold-500 transition-all shadow-sm"
                aria-label="Follow 6 STARS HOSPITALITY on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/6starshospitality"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white dark:bg-brand-navy-900 border border-[#E0D9CD] dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-gold-600 dark:hover:text-brand-gold-400 hover:border-brand-gold-500 transition-all shadow-sm"
                aria-label="Follow 6 STARS HOSPITALITY on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/6starshospitality"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white dark:bg-brand-navy-900 border border-[#E0D9CD] dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-brand-gold-600 dark:hover:text-brand-gold-400 hover:border-brand-gold-500 transition-all shadow-sm"
                aria-label="Connect with 6 STARS HOSPITALITY on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${cleanWhatsappNumber}?text=Hello%206%20Stars%20Hospitality`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 transition-all text-[11px] font-semibold"
                aria-label="Chat with Concierge on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="font-heading font-bold text-brand-gold-600 dark:text-brand-gold-400 tracking-widest uppercase text-xs mb-4">
              Website Navigation
            </h4>
            <ul className="space-y-2.5">
              {primaryLinks.map((link) => (
                <li key={link.target}>
                  <a
                    href={link.path}
                    onClick={(e) => handleLinkClick(e, link.target)}
                    className="text-slate-700 hover:text-brand-gold-600 dark:text-slate-300 dark:hover:text-brand-gold-400 transition-colors font-medium cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading font-bold text-brand-gold-600 dark:text-brand-gold-400 tracking-widest uppercase text-xs mb-4">
              Centaurus Hospitality Desk
            </h4>

            <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-brand-gold-600 dark:text-brand-gold-400 shrink-0 mt-0.5" />
              <span>The Centaurus, Jinnah Avenue, Sector F-8/4, Islamabad, Pakistan</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-brand-gold-600 dark:text-brand-gold-400 shrink-0" />
              <a 
                href={`tel:${verifiedPhone.replace(/\s+/g, '')}`} 
                className="hover:text-brand-gold-600 dark:hover:text-brand-gold-400 transition-colors font-semibold"
              >
                {verifiedPhone}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <a 
                href={`https://wa.me/${cleanWhatsappNumber}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
              >
                WhatsApp: {verifiedWhatsapp}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-brand-gold-600 dark:text-brand-gold-400 shrink-0" />
              <a href={`mailto:${verifiedEmail}`} className="hover:text-brand-gold-600 dark:hover:text-brand-gold-400 transition-colors">
                {verifiedEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-gold-600 dark:text-brand-gold-500" />
            <span>&copy; {new Date().getFullYear()} 6 STARS HOSPITALITY. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors underline-offset-2 hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300 dark:text-white/10">|</span>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors underline-offset-2 hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-slate-300 dark:text-white/10">|</span>
            <Link to="/contact" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
              Concierge Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Privacy Policy / Terms Modal Placeholder */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-brand-navy-950 p-6 sm:p-8 rounded-3xl border border-[#E2DDD5] dark:border-white/10 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setLegalModal(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-heading font-bold text-xl text-brand-navy-950 dark:text-white mb-2">
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <p className="text-xs text-brand-gold-600 dark:text-brand-gold-400 font-semibold uppercase tracking-wider mb-4">
                6 STARS HOSPITALITY • The Centaurus Islamabad
              </p>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
                {legalModal === 'privacy' ? (
                  <>
                    <p>
                      At 6 STARS HOSPITALITY, we respect your privacy and are committed to safeguarding your personal information. When you submit inquiries or reserve serviced apartments at The Centaurus, we collect your name, contact details, and stay preferences solely to coordinate your reservation and personalized concierge services.
                    </p>
                    <p>
                      We never sell, distribute, or lease your personal information to third parties. All inquiries and transaction data are handled under strict confidentiality protocols.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      All reservations and stays at 6 STARS HOSPITALITY serviced apartments at The Centaurus are governed by our guest agreement. Check-in is conducted with valid national or diplomatic identification at our 24/7 reception.
                    </p>
                    <p>
                      Guests enjoy complimentary high-speed Wi-Fi, daily housekeeping, 100% uninterrupted power backup, and basement parking. Quiet hours are observed between 11:00 PM and 07:00 AM to preserve tranquility for all residents.
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5DFD5] dark:border-white/10 flex justify-end">
                <button
                  onClick={() => setLegalModal(null)}
                  className="px-5 py-2 rounded-xl bg-brand-gold-500 text-brand-navy-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};
