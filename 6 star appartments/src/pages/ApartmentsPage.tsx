// src/pages/ApartmentsPage.tsx - 6 STARS HOSPITALITY Apartments & Suites Discovery
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Apartment } from '../types';
import { ApartmentCard } from '../components/apartments/ApartmentCard';
import { ApartmentFilterBar } from '../components/apartments/ApartmentFilterBar';
import { ApartmentModal } from '../components/apartments/ApartmentModal';
import { Building2, Sparkles, AlertCircle } from 'lucide-react';

export const ApartmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { apartments, categories, loading } = useSite();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedBeds, setSelectedBeds] = useState<number | null>(null);
  const [guestCapacity, setGuestCapacity] = useState<number | null>(null);
  const [durationType, setDurationType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalApartment, setActiveModalApartment] = useState<Apartment | null>(null);

  useEffect(() => {
    const catQuery = searchParams.get('category');
    if (catQuery) {
      setSelectedCategoryId(Number(catQuery));
    }
    const locQuery = searchParams.get('location');
    if (locQuery) {
      setSelectedLocation(locQuery);
    }
  }, [searchParams]);

  const handleSelectCategory = (id: number | null) => {
    setSelectedCategoryId(id);
    if (id) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('category', String(id));
        return next;
      });
    } else {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.delete('category');
        return next;
      });
    }
  };

  const handleReset = () => {
    setSelectedCategoryId(null);
    setSelectedLocation('all');
    setSelectedBeds(null);
    setGuestCapacity(null);
    setDurationType('all');
    setSearchQuery('');
    setSearchParams({});
  };

  const filteredApartments = useMemo(() => {
    return apartments.filter((apt) => {
      if (selectedLocation !== 'all') {
        const aptLoc = (apt.location || '').toLowerCase();
        if (!aptLoc.includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }
      if (selectedCategoryId !== null && apt.category_id !== selectedCategoryId) {
        return false;
      }
      if (selectedBeds !== null && apt.bedrooms !== selectedBeds) {
        return false;
      }
      if (guestCapacity !== null && apt.guest_capacity < guestCapacity) {
        return false;
      }
      if (durationType !== 'all' && apt.price_type !== durationType && durationType !== 'night') {
        // Nightly apartments can also be rented monthly/annually
        return true;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = apt.title.toLowerCase().includes(q);
        const matchesDesc = apt.description.toLowerCase().includes(q);
        const matchesView = apt.view_type.toLowerCase().includes(q);
        const matchesLocation = (apt.location || '').toLowerCase().includes(q);
        const matchesCategory = (apt.category_name || '').toLowerCase().includes(q);
        const matchesAmenity = apt.amenities.some(a => a.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesView && !matchesLocation && !matchesCategory && !matchesAmenity) {
          return false;
        }
      }
      return true;
    });
  }, [apartments, selectedLocation, selectedCategoryId, selectedBeds, guestCapacity, durationType, searchQuery]);

  return (
    <div className="py-14 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/25 text-brand-gold-700 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prime Islamabad Residences</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-brand-navy-950 dark:text-white">
          Apartments & Suites
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 font-light leading-relaxed">
          Discover our curated collection of luxury serviced residences across The Centaurus, Elysium Tower, and F-11 Markaz in Islamabad.
        </p>
      </div>

      {/* Filter Bar */}
      <ApartmentFilterBar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        selectedBeds={selectedBeds}
        onSelectBeds={setSelectedBeds}
        guestCapacity={guestCapacity}
        onSelectGuestCapacity={setGuestCapacity}
        durationType={durationType}
        onSelectDurationType={setDurationType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onReset={handleReset}
      />

      {/* Property Listing Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-500 dark:text-slate-400">
          <Building2 className="w-10 h-10 animate-pulse text-brand-gold-500 mx-auto mb-3" />
          <p className="text-xs">Loading residence collection...</p>
        </div>
      ) : apartments.length === 0 ? (
        <div className="bg-white dark:bg-brand-navy-900 rounded-3xl border border-[#E5DFD5] dark:border-white/10 p-12 text-center max-w-md mx-auto shadow-sm">
          <Building2 className="w-10 h-10 text-brand-gold-500 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-brand-navy-950 dark:text-white mb-2">No Apartments Available</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            There are currently no residential apartments listed. For private off-market bookings or custom executive suites, please contact our concierge desk.
          </p>
          <a
            href="https://wa.me/923120893146"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-luxury-gold-gradient text-brand-navy-950 text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
          >
            WhatsApp Concierge (+92 312 0893146)
          </a>
        </div>
      ) : filteredApartments.length === 0 ? (
        <div className="bg-white dark:bg-brand-navy-900 rounded-3xl border border-[#E5DFD5] dark:border-white/10 p-12 text-center max-w-md mx-auto shadow-sm">
          <AlertCircle className="w-10 h-10 text-brand-gold-500 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-brand-navy-950 dark:text-white mb-2">No Matching Suites Found</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            Please adjust your criteria or clear your filters to view our full collection of residences.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-luxury-gold-gradient text-brand-navy-950 text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredApartments.map((apt) => (
            <ApartmentCard
              key={apt.id}
              apartment={apt}
              onOpenQuickView={(selected) => setActiveModalApartment(selected)}
            />
          ))}
        </div>
      )}

      {/* Hotel / Resort Style Detail Modal */}
      <ApartmentModal
        apartment={activeModalApartment}
        onClose={() => setActiveModalApartment(null)}
      />
    </div>
  );
};
