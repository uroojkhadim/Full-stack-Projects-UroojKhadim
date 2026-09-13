// src/components/home/LuxuryIntroSection.tsx - 6 STARS HOSPITALITY About & Core Values Section
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bed, Clock, Sparkle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { ABOUT_IMAGES, getSafeImageUrl } from '../../services/imageManifest';
import { OptimizedImage } from '../common/OptimizedImage';

export const LuxuryIntroSection: React.FC = () => {
  const livingRoomUrl = getSafeImageUrl(ABOUT_IMAGES.livingRoom.relativePath);
  const margallaViewUrl = getSafeImageUrl(ABOUT_IMAGES.margallaView.relativePath);

  const benefits = [
    {
      icon: Bed,
      title: 'Supreme Comfort',
      description: 'Handcrafted plush king bedding, ergonomic furniture, and acoustic double glazing ensuring undisturbed tranquility.'
    },
    {
      icon: Clock,
      title: 'Bespoke 24/7 Service',
      description: 'Dedicated front-desk concierge, valet parking, luggage handling, and room assistance available around the clock.'
    },
    {
      icon: Sparkle,
      title: 'Impeccable Cleanliness',
      description: 'Daily five-star housekeeping, fresh organic linens, sparkling sanitized bathrooms, and spotless kitchenettes.'
    },
    {
      icon: ShoppingBag,
      title: 'Centaurus Convenience',
      description: 'Direct high-speed elevator connection into The Centaurus Mall, international dining, cinema, and grocery market.'
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-28 px-4 sm:px-8 bg-[#FAF8F5] dark:bg-brand-navy-950/60 border-b border-[#EAE5DC] dark:border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Narrative (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/30 text-brand-gold-600 dark:text-brand-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About 6 Stars Hospitality</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy-950 dark:text-white leading-[1.18]">
              A Refined Sanctuary in the Heart of Islamabad
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Located within the iconic towers of <strong className="text-brand-navy-950 dark:text-white font-semibold">The Centaurus, Islamabad</strong>, 6 Stars Hospitality is dedicated to delivering an elevated residential experience. We blend the attentive, round-the-clock service of a five-star hotel with the privacy, spaciousness, and authentic warmth of an impeccably appointed luxury home.
            </p>

            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Whether you are in the federal capital for a diplomatic mission, corporate executive assignment, or a rejuvenating family vacation, our fully serviced residences provide an oasis of elegance overlooking the Margalla Hills.
            </p>

            {/* Core Benefits Grid: Comfort, Service, Cleanliness, Convenience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white dark:bg-brand-navy-900/80 border border-[#E7E1D6] dark:border-white/10 shadow-sm hover:shadow-md hover:border-brand-gold-500/40 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-gold-500/15 text-brand-gold-600 dark:text-brand-gold-400 flex items-center justify-center mb-2.5 group-hover:bg-brand-gold-500 group-hover:text-brand-navy-950 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-brand-navy-950 dark:text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Visual Composition (6 cols) - 2 Relevant Local Images */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="grid grid-cols-12 gap-4">
              {/* Primary Image: Centaurus Executive Lounge (1600x1200) */}
              <div className="col-span-12 sm:col-span-8 relative rounded-2xl overflow-hidden border border-[#E0D9CD] dark:border-white/10 shadow-xl group">
                <OptimizedImage
                  src={livingRoomUrl}
                  alt={ABOUT_IMAGES.livingRoom.alt}
                  aspectRatio="4/3"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={1600}
                  height={1200}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gold-300">Executive Living</span>
                  <p className="text-xs font-semibold">Designer Lounges & Dining</p>
                </div>
              </div>

              {/* Secondary Image: Margalla Panoramic Bedroom (4032x3024) */}
              <div className="col-span-12 sm:col-span-4 flex flex-col justify-between gap-4">
                <div className="relative rounded-2xl overflow-hidden border border-[#E0D9CD] dark:border-white/10 shadow-lg aspect-[4/3] sm:aspect-[3/4] group">
                  <OptimizedImage
                    src={margallaViewUrl}
                    alt={ABOUT_IMAGES.margallaView.alt}
                    aspectRatio="3/4"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width={4032}
                    height={3024}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gold-300">Margalla Views</span>
                    <p className="text-xs font-semibold">Floor-to-Ceiling Glass</p>
                  </div>
                </div>

                {/* Quick Trust Stat Card */}
                <div className="p-4 rounded-2xl bg-brand-navy-950 text-white border border-brand-gold-500/30 shadow-md flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-brand-gold-400 shrink-0" />
                  <div>
                    <div className="text-base font-bold font-heading text-brand-gold-400">100% Uninterrupted</div>
                    <p className="text-[11px] text-slate-300">Full backup power & dual security</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
