// src/components/apartments/ApartmentModal.tsx - Resort-Style Property Detail View
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Apartment } from '../../types';
import { useSite } from '../../context/SiteContext';
import { formatCurrency } from '../../utils/formatters';
import { resolveSafeImagePath } from '../common/OptimizedImage';
import { 
  X, 
  Bed, 
  Bath, 
  Users, 
  Maximize2, 
  Check, 
  Calculator, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApartmentModalProps {
  apartment: Apartment | null;
  onClose: () => void;
}

export const ApartmentModal: React.FC<ApartmentModalProps> = ({ apartment, onClose }) => {
  const navigate = useNavigate();
  const { settings } = useSite();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  if (!apartment) return null;

  const images = apartment.images && apartment.images.length > 0 
    ? apartment.images 
    : ['./images/background image.jpeg'];

  const verifiedWhatsapp = settings.whatsapp || '+92 312 0893146';
  const cleanWhatsappNumber = verifiedWhatsapp.replace(/[^0-9]/g, '');

  const handleStartQuote = () => {
    onClose();
    navigate(`/quote?apartment_id=${apartment.id}`);
  };

  const currentRawSrc = images[activeImageIdx];
  const safeImgSrc = resolveSafeImagePath(currentRawSrc);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-white dark:bg-[#0C1424] border border-[#E2DDD5] dark:border-brand-gold-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[92vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/80 dark:bg-brand-navy-950/80 text-brand-navy-950 dark:text-slate-200 hover:bg-brand-gold-500 hover:text-brand-navy-950 transition-all border border-[#E2DDD5] dark:border-white/10 shadow-sm"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1">
            {/* Gallery */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#EDE7DD] dark:bg-brand-navy-950">
              {!imgError ? (
                <img
                  src={safeImgSrc}
                  alt={apartment.title}
                  className="w-full h-full object-cover"
                  width={1600}
                  height={900}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
                  <Building2 className="w-12 h-12 text-brand-gold-500/40 mb-2" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    [Image Not Available]
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* Prev / Next controls */}
              {images.length > 1 && (
                <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    onClick={() => {
                      setImgError(false);
                      setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
                    }}
                    className="pointer-events-auto p-2.5 rounded-full bg-white/80 dark:bg-brand-navy-950/80 text-brand-navy-950 dark:text-white hover:bg-brand-gold-500 hover:text-brand-navy-950 transition-colors border border-white/20 shadow-md"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImgError(false);
                      setActiveImageIdx((prev) => (prev + 1) % images.length);
                    }}
                    className="pointer-events-auto p-2.5 rounded-full bg-white/80 dark:bg-brand-navy-950/80 text-brand-navy-950 dark:text-white hover:bg-brand-gold-500 hover:text-brand-navy-950 transition-colors border border-white/20 shadow-md"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Indicator Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImageIdx === i ? 'w-6 bg-brand-gold-400' : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Title & Price Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EAE5DC] dark:border-white/10 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-brand-gold-500/15 text-brand-gold-700 dark:text-brand-gold-300 border border-brand-gold-500/30 uppercase tracking-widest mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>{apartment.category_name || 'Serviced Residence'}</span>
                  </div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy-950 dark:text-white">
                    {apartment.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-gold-700 dark:text-brand-gold-300 mt-1 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>The Centaurus, Islamabad • {apartment.floor} • {apartment.view_type}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Estimated Rate</span>
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy-950 dark:text-white">
                    {formatCurrency(apartment.price)}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/ {apartment.price_type}</span>
                  </div>
                </div>
              </div>

              {/* Key Specs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF8F5] dark:bg-brand-navy-950/70 p-4 rounded-2xl border border-[#EAE5DC] dark:border-white/10 text-xs">
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-brand-gold-600 dark:text-brand-gold-400 shrink-0" />
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Bedrooms</p>
                    <p className="font-bold text-brand-navy-950 dark:text-white text-sm">{apartment.bedrooms} Master Suite</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-brand-gold-600 dark:text-brand-gold-400 shrink-0" />
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Bathrooms</p>
                    <p className="font-bold text-brand-navy-950 dark:text-white text-sm">{apartment.bathrooms} Marble Bath</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-brand-gold-600 dark:text-brand-gold-400 shrink-0" />
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Guest Capacity</p>
                    <p className="font-bold text-brand-navy-950 dark:text-white text-sm">Up to {apartment.guest_capacity} Guests</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Maximize2 className="w-5 h-5 text-brand-gold-600 dark:text-brand-gold-400 shrink-0" />
                  <div>
                    <p className="text-slate-500 dark:text-slate-400">Floor Space</p>
                    <p className="font-bold text-brand-navy-950 dark:text-white text-sm">{apartment.area_sqft} sq ft</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-heading font-bold text-base text-brand-navy-950 dark:text-white mb-2">
                  Property Summary & Interior Details
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                  {apartment.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-heading font-bold text-base text-brand-navy-950 dark:text-white mb-3">
                  Included Amenities & Services
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {apartment.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-[#FAF8F5] dark:bg-brand-navy-950/50 p-2.5 rounded-xl border border-[#EAE5DC] dark:border-white/5">
                      <div className="w-4 h-4 rounded-full bg-brand-gold-500/20 text-brand-gold-600 dark:text-brand-gold-400 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rental Notice */}
              <div className="bg-[#FAF8F5] dark:bg-brand-navy-950/60 p-4 rounded-xl border border-[#EAE5DC] dark:border-white/5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p><strong className="text-brand-navy-950 dark:text-white">Rental Inclusions:</strong> 24/7 dedicated electricity backup, daily housekeeping, fiber Wi-Fi, and direct Centaurus Mall access.</p>
                <p><strong className="text-brand-navy-950 dark:text-white">Check-in / Check-out:</strong> Standard check-in from 2:00 PM; check-out until 12:00 PM.</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#EAE5DC] dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-brand-gold-600 dark:text-brand-gold-400" />
                  <span>Transparent estimate • Dedicated key handover at The Centaurus</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${cleanWhatsappNumber}?text=Hello%206%20Stars%20Hospitality,%20I%20am%20interested%20in%20reserving%20the%20${encodeURIComponent(apartment.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/10 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Concierge</span>
                  </a>

                  <button
                    onClick={handleStartQuote}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider text-brand-navy-950 bg-luxury-gold-gradient hover:brightness-110 shadow-md transition-all"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Request Quotation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
