// src/components/home/FinalConversionSection.tsx - Final Conversion Section
import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const FinalConversionSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl overflow-hidden border border-brand-gold-500/40 bg-gradient-to-br from-brand-navy-900 via-brand-navy-950 to-brand-navy-900 p-8 sm:p-16 text-center shadow-2xl text-white"
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold-500/15 border border-brand-gold-500/30 text-brand-gold-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>6 Stars Hospitality</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white leading-tight">
            Planning Your Stay at The Centaurus?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            Whether arriving for a short diplomatic mission, leisure family vacation, or long-term corporate assignment, our team will configure the ideal residence for your dates.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <Link
              to="/quote"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-heading font-bold text-xs tracking-wider uppercase text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-xl shadow-brand-gold-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Get Instant Quotation</span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-brand-gold-400" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
