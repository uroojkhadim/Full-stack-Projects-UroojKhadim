// src/components/apartments/ApartmentCard.tsx - 6 STARS HOSPITALITY Luxury Property Card
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Apartment } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { resolveSafeImagePath } from '../common/OptimizedImage';
import { 
  Bed, 
  Users, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Calculator, 
  Eye, 
  Sparkles,
  Check,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ApartmentCardProps {
  apartment: Apartment;
  onOpenQuickView?: (apartment: Apartment) => void;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onOpenQuickView }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const images = apartment.images && apartment.images.length > 0 
    ? apartment.images 
    : ['./images/background image.jpeg'];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setImgError(false);
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setImgError(false);
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentRawSrc = images[currentImgIndex];
  const safeImgSrc = resolveSafeImagePath(currentRawSrc);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group bg-white dark:bg-[#0C1424] rounded-2xl overflow-hidden border border-[#E5DFD5] dark:border-brand-gold-500/20 hover:border-brand-gold-500/50 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-2xl flex flex-col justify-between hover:-translate-y-1"
    >
      {/* Property Image Gallery Preview */}
      <div>
        <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE7DD] dark:bg-brand-navy-950">
          {!imgError ? (
            <img
              src={safeImgSrc}
              alt={apartment.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              width={1280}
              height={800}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
              <Building2 className="w-8 h-8 text-brand-gold-500/40 mb-1" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                [Image Not Available]
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Category Pill */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-brand-navy-950/85 text-brand-gold-300 border border-brand-gold-500/30 backdrop-blur-md uppercase tracking-wider">
              {apartment.category_name || 'Serviced Residence'}
            </span>
          </div>

          {/* Featured Tag */}
          {Boolean(apartment.is_featured) && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-luxury-gold-gradient text-brand-navy-950 shadow-md">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </div>
          )}

          {/* Floor & Orientation Info */}
          <div className="absolute bottom-3 left-3.5 right-3.5 z-10 flex items-center justify-between text-xs text-white pointer-events-none">
            <span className="bg-brand-navy-950/80 px-2 py-0.5 rounded text-[10px] border border-white/10 font-medium">
              {apartment.floor}
            </span>
            <span className="bg-brand-navy-950/80 px-2.5 py-0.5 rounded text-[10px] border border-brand-gold-500/30 text-brand-gold-300 font-medium truncate max-w-[170px]">
              {apartment.view_type}
            </span>
          </div>

          {/* Photo Navigation arrows if multiple */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={prevImage}
                className="p-1.5 rounded-full bg-brand-navy-950/80 text-white hover:bg-brand-gold-500 hover:text-brand-navy-950 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="p-1.5 rounded-full bg-brand-navy-950/80 text-white hover:bg-brand-gold-500 hover:text-brand-navy-950 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h3 className="font-heading font-bold text-lg text-brand-navy-950 dark:text-white group-hover:text-brand-gold-600 dark:group-hover:text-brand-gold-300 transition-colors mb-2 leading-snug">
            {apartment.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {apartment.description}
          </p>

          {/* Specs Bar (Bedrooms, Capacity, Area) */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-[#EAE5DC] dark:border-white/10 mb-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-brand-gold-600 dark:text-brand-gold-400" />
              <span>{apartment.bedrooms} Bed{apartment.bedrooms > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-gold-600 dark:text-brand-gold-400" />
              <span>Up to {apartment.guest_capacity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-brand-gold-600 dark:text-brand-gold-400" />
              <span>{apartment.area_sqft} sqft</span>
            </div>
          </div>

          {/* Key Amenities Preview */}
          <div className="space-y-1 mb-4">
            {apartment.amenities.slice(0, 2).map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <Check className="w-3 h-3 text-brand-gold-600 dark:text-brand-gold-400 shrink-0" />
                <span className="truncate">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing and Action Buttons */}
      <div className="p-5 pt-0">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Estimated Rate</span>
            <div className="font-heading font-extrabold text-xl text-brand-navy-950 dark:text-white">
              {formatCurrency(apartment.price)}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/ {apartment.price_type}</span>
            </div>
          </div>

          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded uppercase tracking-wider">
            Available
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenQuickView ? onOpenQuickView(apartment) : null}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-brand-navy-900 dark:text-slate-200 bg-[#F4EFE7] dark:bg-brand-navy-950/70 hover:bg-[#EDE5DA] dark:hover:bg-brand-navy-800 border border-[#E2DDD5] dark:border-white/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-brand-gold-600 dark:text-brand-gold-400" />
            <span>View Details</span>
          </button>

          <Link
            to={`/quote?apartment_id=${apartment.id}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-brand-navy-950 bg-luxury-gold-gradient hover:brightness-110 shadow-sm transition-all"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Request Quote</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
