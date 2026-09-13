// src/components/home/HeroSection.tsx - 6 STARS HOSPITALITY Premier Hero Section
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BedDouble, CalendarCheck, ShieldCheck, Sparkles, Wifi, Mountain } from 'lucide-react';
import { HERO_IMAGE, BRAND_LOGO, getSafeImageUrl } from '../../services/imageManifest';

export const HeroSection: React.FC = () => {
  const heroImageUrl = getSafeImageUrl(HERO_IMAGE.relativePath);
  const logoUrl = getSafeImageUrl(BRAND_LOGO.relativePath);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] lg:min-h-[96vh] flex flex-col justify-between overflow-hidden bg-brand-navy-950">
      {/* 1. Local hospitality ambience image from the public image library */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={heroImageUrl}
          alt={HERO_IMAGE.alt}
          width={HERO_IMAGE.width}
          height={HERO_IMAGE.height}
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center sm:object-[center_48%] transform transition-transform duration-1000 ease-out"
        />
        {/* Subtle Luxury Contrast Overlay - Preserves image sharpness while ensuring AAA text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/60 to-brand-navy-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-950/80 via-transparent to-brand-navy-950/70" />
      </div>

      {/* 2. Main Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-24 pb-16 sm:pt-32 sm:pb-20 text-center flex-1 flex flex-col items-center justify-center">
        {/* Hospitality Crest & Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-navy-950/75 border border-brand-gold-500/40 shadow-2xl mb-6 backdrop-blur-md"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden bg-[#FAF6EE] p-0.5 border border-brand-gold-400/50 shrink-0">
            <img
              src={logoUrl}
              alt="6 STARS HOSPITALITY Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[11px] sm:text-xs uppercase font-semibold tracking-[0.25em] text-brand-gold-400">
            The Centaurus • Islamabad
          </span>
        </motion.div>

        {/* Clear Hospitality Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.12] mb-6 max-w-4xl"
        >
          Luxury Living Above <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#F7E7B4] via-[#D4AF37] to-[#C5A059] bg-clip-text text-transparent">
            Islamabad
          </span>
        </motion.h1>

        {/* Short Supporting Sentence */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-200 font-light max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm"
        >
          Experience refined comfort, exceptional views, and effortless hospitality at 6 Star Centaurus Apartments.
        </motion.p>

        {/* Primary and Secondary Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto mb-12"
        >
          <a
            href="#properties"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('properties');
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-heading font-bold text-sm tracking-wide text-brand-navy-950 bg-luxury-gold-gradient hover:brightness-110 active:scale-95 shadow-xl shadow-brand-gold-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BedDouble className="w-4 h-4" />
            <span>View Apartments</span>
          </a>

          <a
            href="/#/quote"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-heading font-semibold text-sm tracking-wide text-white bg-white/10 hover:bg-white/20 border border-white/25 active:scale-95 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 text-brand-gold-400" />
            <span>Request a Quote</span>
          </a>
        </motion.div>
      </div>

      {/* 3. Subtle Bottom Hospitality Highlights Bar */}
      <div className="relative z-10 border-t border-white/10 bg-brand-navy-950/80 backdrop-blur-md py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-brand-gold-400 shrink-0" />
            <span className="font-medium">24/7 VIP Concierge</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <Mountain className="w-4 h-4 text-brand-gold-400 shrink-0" />
            <span className="font-medium">Margalla Hills Panorama</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <Wifi className="w-4 h-4 text-brand-gold-400 shrink-0" />
            <span className="font-medium">High-Speed Business Wi-Fi</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-brand-gold-400 shrink-0" />
            <span className="font-medium">100% Power & Elite Security</span>
          </div>
        </div>
      </div>
    </section>
  );
};
