// src/components/home/CentaurusAdvantage.tsx
import React from 'react';
import { 
  Building2, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  Car, 
  Dumbbell, 
  Utensils, 
  Wifi 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CentaurusAdvantage: React.FC = () => {
  const perks = [
    {
      icon: ShoppingBag,
      title: 'Direct Centaurus Mall Access',
      desc: 'Seamless elevator connection directly into Islamabad’s premier shopping mall, cineplex, and international food court.'
    },
    {
      icon: ShieldCheck,
      title: 'Diplomatic Standard Security',
      desc: 'Three-tier security screening, CCTV surveillance, encrypted floor keycards, and discreet on-floor concierge teams.'
    },
    {
      icon: Zap,
      title: '100% Uninterrupted Power',
      desc: 'Dual industrial-grade generators deliver instant failover power—guaranteeing AC, elevators, and lights run seamlessly.'
    },
    {
      icon: Dumbbell,
      title: 'Centaurus Fitness & Heated Pool',
      desc: 'State-of-the-art cardiovascular and strength machines, steam bath, sauna, and an Olympic-grade indoor heated pool.'
    },
    {
      icon: Car,
      title: 'Valet & Reserved Covered Parking',
      desc: 'Multi-level secure basement parking with complimentary valet service for residents and visiting guests.'
    },
    {
      icon: Wifi,
      title: '100 Mbps Dedicated Fiber Internet',
      desc: 'Enterprise-tier dual-band Wi-Fi engineered for uninterrupted video conferencing, streaming, and remote work.'
    },
    {
      icon: Utensils,
      title: '24/7 In-Suite Dining & Chef Service',
      desc: 'Order fine dining from top Centaurus culinary establishments or request private breakfast prepared in your suite.'
    },
    {
      icon: Building2,
      title: 'Margalla Hills High-Floor Panoramas',
      desc: 'Floor-to-ceiling soundproof glass facades showcasing sunrises over the capital and sunset glows behind Faisal Mosque.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-8 bg-charcoal-900/40 border-y border-charcoal-800/80 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-widest block mb-2">
            The Centaurus Islamabad Advantage
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Unrivaled Amenities & Privileges
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Living at 6 Star Apartments combines the independence and generous floor space of a private residence with the comprehensive amenities of a world-class luxury hotel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-charcoal-900/80 rounded-2xl p-6 border border-charcoal-800/80 hover:border-gold-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center mb-5">
                  <perk.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-base text-white mb-2">
                  {perk.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
