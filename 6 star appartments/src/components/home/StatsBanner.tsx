// src/components/home/StatsBanner.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Maximize2, Layers } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const stats = [
    {
      icon: Award,
      value: '6 Star',
      label: 'Luxury Standard',
      desc: 'Bespoke serviced hospitality tailored for VIPs & diplomats'
    },
    {
      icon: ShieldCheck,
      value: '24/7',
      label: 'Concierge & Power',
      desc: 'Dedicated round-the-clock security and generator backup'
    },
    {
      icon: Maximize2,
      value: '2,200',
      label: 'Max Square Feet',
      desc: 'Expansive studio, 2-bed, and penthouse layouts'
    },
    {
      icon: Layers,
      value: '14th - 23rd',
      label: 'High Floors',
      desc: 'Unobstructed scenic viewpoints above Islamabad'
    }
  ];

  return (
    <section className="bg-charcoal-900/60 border-y border-charcoal-800/80 py-12 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-xl hover:bg-charcoal-800/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 text-gold-400">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                {item.value}
              </div>
              <div className="text-sm font-semibold text-gold-400 mb-1">
                {item.label}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
