// src/components/home/FeaturedApartments.tsx - Featured Apartments & Suites
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { Apartment } from '../../types';
import { ApartmentCard } from '../apartments/ApartmentCard';
import { ApartmentModal } from '../apartments/ApartmentModal';
import { Sparkles, ArrowRight, Building2 } from 'lucide-react';

export const FeaturedApartments: React.FC = () => {
  const { apartments } = useSite();
  const [activeApartment, setActiveApartment] = useState<Apartment | null>(null);

  // Curated selection of premier apartments (up to 6)
  const featured = apartments.slice(0, 6);

  return (
    <section id="properties" className="py-20 lg:py-28 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
        <div>
          <div className="inline-flex items-center gap-2 text-brand-gold-600 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest mb-2 px-3 py-1 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Portfolio</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy-950 dark:text-white leading-tight">
            Luxury Suites & Residences
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl font-normal leading-relaxed">
            Choose from our collection of one-bedroom view apartments, dual-bedroom family suites, and executive corporate penthouses at The Centaurus Islamabad.
          </p>
        </div>

        <Link
          to="/apartments"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-brand-gold-600 dark:text-brand-gold-400 hover:text-brand-gold-500 transition-colors group shrink-0"
        >
          <span>View Complete Catalog</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {featured.length === 0 ? (
        <div className="text-center py-16 bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
          <Building2 className="w-10 h-10 text-brand-gold-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-card-foreground dark:text-white">Residences loading...</p>
        </div>
      ) : (
        /* Responsive Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((apt) => (
            <ApartmentCard
              key={apt.id}
              apartment={apt}
              onOpenQuickView={(selected) => setActiveApartment(selected)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <ApartmentModal
        apartment={activeApartment}
        onClose={() => setActiveApartment(null)}
      />
    </section>
  );
};
