// src/components/home/AmenitiesSection.tsx - 6 STARS HOSPITALITY Services & Amenities Section
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BellRing, 
  Briefcase, 
  UtensilsCrossed, 
  Sparkles, 
  ShoppingBag, 
  Car,
  CheckCircle2
} from 'lucide-react';
import { SERVICES_IMAGES, getSafeImageUrl } from '../../services/imageManifest';
import { OptimizedImage } from '../common/OptimizedImage';

export const AmenitiesSection: React.FC = () => {
  const services = [
    {
      id: 'concierge',
      icon: BellRing,
      title: '24/7 Dedicated Concierge',
      desc: 'Round-the-clock front desk care, effortless key handover, luggage assistance, and customized city recommendations.',
      image: getSafeImageUrl(SERVICES_IMAGES.concierge.relativePath),
      alt: SERVICES_IMAGES.concierge.alt,
      features: ['Personalized Check-in', 'Luggage Care', 'Local Dining Bookings']
    },
    {
      id: 'workspaces',
      icon: Briefcase,
      title: 'Executive Business Workspaces',
      desc: 'Dedicated ergonomic work desks with 100 Mbps fiber connectivity, tailored for corporate executives and diplomats.',
      image: getSafeImageUrl(SERVICES_IMAGES.workspace.relativePath),
      alt: SERVICES_IMAGES.workspace.alt,
      features: ['Dual-Band Fiber Wi-Fi', 'Quiet Study Zone', 'Universal Power Outlets']
    },
    {
      id: 'dining',
      icon: UtensilsCrossed,
      title: 'Gourmet Kitchens & Dining',
      desc: 'Fully equipped modern kitchen with microwave, refrigerator, stove, cookware, and formal dining salons.',
      image: getSafeImageUrl(SERVICES_IMAGES.kitchenDining.relativePath),
      alt: SERVICES_IMAGES.kitchenDining.alt,
      features: ['Full Kitchenette', 'Cookware & Tableware', 'Coffee & Tea Setup']
    },
    {
      id: 'housekeeping',
      icon: Sparkles,
      title: 'Daily Housekeeping & Linen Care',
      desc: 'Five-star daily housekeeping, fresh sanitized linens, plush cotton towels, and premium bathroom amenities.',
      image: getSafeImageUrl(SERVICES_IMAGES.housekeeping.relativePath),
      alt: SERVICES_IMAGES.housekeeping.alt,
      features: ['Daily Suite Cleaning', 'Fresh Linen Rotation', 'Eco-Luxury Toiletries']
    },
    {
      id: 'mall-access',
      icon: ShoppingBag,
      title: 'Direct Centaurus Mall VIP Access',
      desc: 'Private high-speed elevators taking you directly inside The Centaurus Mall, gourmet food courts, and boutique shopping.',
      image: getSafeImageUrl(SERVICES_IMAGES.mallAccess.relativePath),
      alt: SERVICES_IMAGES.mallAccess.alt,
      features: ['Enclosed Mall Access', 'Hypermarket & Pharmacy', 'Cinema & Entertainment']
    },
    {
      id: 'transfers',
      icon: Car,
      title: 'Airport Chauffeur & Valet Parking',
      desc: 'Seamless Islamabad International Airport pickup assist, reserved secure basement parking, and 24/7 valet service.',
      image: getSafeImageUrl(SERVICES_IMAGES.chauffeur.relativePath),
      alt: SERVICES_IMAGES.chauffeur.alt,
      features: ['Reserved Basement Bay', 'Valet Parking Assist', 'Airport Transfer Booking']
    }
  ];

  return (
    <section id="services" className="py-20 lg:py-28 px-4 sm:px-8 bg-white dark:bg-brand-navy-900/40 border-b border-[#EAE5DC] dark:border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/30 text-brand-gold-600 dark:text-brand-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hospitality Services & Inclusions</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy-950 dark:text-white leading-tight">
            Tailored Services for an Effortless Stay
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-4 font-normal leading-relaxed">
            Every guest at 6 Stars Hospitality enjoys comprehensive hotel services combined with the independence and freedom of private apartment living.
          </p>
        </div>

        {/* 6 Attractive Service Cards with Local Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-[#FAF8F5] dark:bg-brand-navy-950/80 rounded-2xl overflow-hidden border border-[#E7E1D6] dark:border-white/10 shadow-sm hover:shadow-xl hover:border-brand-gold-500/40 transition-all flex flex-col group"
              >
                {/* Image Showcase */}
                <div className="relative overflow-hidden aspect-[16/10] bg-slate-200 dark:bg-slate-800">
                  <OptimizedImage
                    src={item.image}
                    alt={item.alt}
                    aspectRatio="16/9"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width={1600}
                    height={1000}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Floating Icon Badge */}
                  <div className="absolute top-3.5 left-3.5 w-10 h-10 rounded-xl bg-brand-navy-950/90 border border-brand-gold-500/50 text-brand-gold-400 flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-brand-navy-950 dark:text-white mb-2 group-hover:text-brand-gold-600 dark:group-hover:text-brand-gold-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>

                  {/* Quick Feature Checklist */}
                  <div className="pt-4 border-t border-[#EAE5DC] dark:border-white/10 space-y-1.5">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
