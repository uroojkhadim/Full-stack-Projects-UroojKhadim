// src/components/home/CommercialIntroSection.tsx - Commercial Spaces Feature
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { resolveSafeImagePath } from '../common/OptimizedImage';

export const CommercialIntroSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-8 bg-muted/20 dark:bg-brand-navy-900/40 border-y border-border dark:border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Media Display (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="rounded-3xl overflow-hidden border border-brand-gold-500/30 shadow-xl aspect-[4/3] bg-muted dark:bg-brand-navy-950">
              <img
                src={resolveSafeImagePath("./images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM.jpeg")}
                alt="Centaurus Corporate Office & Commercial Space"
                className="w-full h-full object-cover"
                loading="lazy"
                width={1280}
                height={960}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs">
                <span className="font-bold text-white block">Centaurus Commercial & Retail Spaces</span>
                <span className="text-[11px] text-brand-gold-400">Retail Showrooms • Corporate Headquarter Suites</span>
              </div>
            </div>
          </motion.div>

          {/* Right Narrative (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/25 text-brand-gold-600 dark:text-brand-gold-400 text-xs font-semibold uppercase tracking-widest">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Commercial & Retail Portfolio</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground dark:text-white leading-tight">
              Establish Your Flagship Presence at The Centaurus
            </h2>

            <p className="text-sm text-muted-foreground dark:text-slate-300 font-light leading-relaxed">
              In addition to residential serviced living, 6 Stars Hospitality represents distinguished commercial properties at The Centaurus. From high-footfall mall concourse retail showrooms to panoramic corporate headquarters in Corporate Towers A and B.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-muted-foreground dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold-500 shrink-0" />
                <span>Prime glass-frontage retail showrooms inside Islamabad's premier shopping destination.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold-500 shrink-0" />
                <span>Grade-A executive corporate office suites with dedicated elevator banks and executive parking.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-gold-500 shrink-0" />
                <span>Tailored commercial lease terms for multinational brands, consultancies, and private offices.</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/showrooms"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-heading font-bold text-xs tracking-wider uppercase text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-md transition-all group"
              >
                <span>Explore Showrooms & Offices</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
