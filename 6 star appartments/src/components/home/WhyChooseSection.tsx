// src/components/home/WhyChooseSection.tsx - Why Choose 6 Stars Hospitality
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Sofa, 
  Award, 
  ShieldCheck, 
  Briefcase, 
  Users, 
  CalendarRange 
} from 'lucide-react';

export const WhyChooseSection: React.FC = () => {
  const reasons = [
    {
      icon: Compass,
      title: 'Prime Centaurus Location',
      description: 'Tower living in Sector F-8 on Jinnah Avenue, moments from government ministries, the diplomatic enclave, and Islamabad’s premier shopping mall.'
    },
    {
      icon: Sofa,
      title: 'Premium Furnished Apartments',
      description: 'Carefully curated interiors with custom seating, king posturepedic beds, acoustic triple glazing, and Italian designer furnishings.'
    },
    {
      icon: Award,
      title: 'Professional Hospitality',
      description: 'Attentive on-site hospitality desk providing discreet key management, in-room dining coordination, and dedicated concierge assistance.'
    },
    {
      icon: ShieldCheck,
      title: 'Comfort & Uncompromised Privacy',
      description: 'Private high-speed keycard elevator access, 24/7 building security screening, and fully independent quiet residential living.'
    },
    {
      icon: Briefcase,
      title: 'Business-Friendly Stays',
      description: 'Ergonomic study desks, 100 Mbps fiber internet, reliable power backup, and quiet environments suited for high-level meetings.'
    },
    {
      icon: Users,
      title: 'Family-Friendly Accommodation',
      description: 'Expansive 2 and 3-bedroom family suites with dedicated living salons, full dining tables, and safe direct indoor mall access for children.'
    },
    {
      icon: CalendarRange,
      title: 'Flexible Rental Options',
      description: 'Accommodating nightly diplomatic stopovers, multi-week corporate consultancies, or extended multi-month executive leases.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-8 bg-muted/20 dark:bg-brand-navy-900/60 border-y border-border dark:border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-gold-600 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest block mb-2">
            The 6 Stars Standard
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground dark:text-white">
            Why Choose 6 Stars Hospitality
          </h2>
          <p className="text-sm text-muted-foreground dark:text-slate-300 mt-3 font-light leading-relaxed">
            We deliver the independence of private luxury apartment living coupled with the standards, security, and attentive care of five-star hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.slice(0, 6).map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-card dark:bg-brand-navy-950/80 rounded-2xl p-7 border border-border dark:border-brand-gold-500/20 hover:border-brand-gold-500/40 transition-all duration-300 shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-gold-500/10 border border-brand-gold-500/25 text-brand-gold-600 dark:text-brand-gold-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <reason.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-card-foreground dark:text-white mb-2 group-hover:text-brand-gold-500 transition-colors">
                  {reason.title}
                </h3>
                <p className="text-xs text-muted-foreground dark:text-slate-400 leading-relaxed font-light">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 7th Feature Banner: Flexible Rental Options */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 bg-card dark:bg-brand-navy-950/90 rounded-2xl p-6 sm:p-8 border border-brand-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-gold-500/10 border border-brand-gold-500/25 text-brand-gold-600 dark:text-brand-gold-400 flex items-center justify-center shrink-0">
              <CalendarRange className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-card-foreground dark:text-white">
                Flexible Long & Short Term Accommodations
              </h4>
              <p className="text-xs text-muted-foreground dark:text-slate-400 mt-0.5">
                Nightly, monthly corporate leasing, or annual executive contracts available with tiered rate incentives.
              </p>
            </div>
          </div>

          <a
            href="#/quote"
            className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-md transition-all shrink-0"
          >
            Calculate Tariffs
          </a>
        </motion.div>
      </div>
    </section>
  );
};
