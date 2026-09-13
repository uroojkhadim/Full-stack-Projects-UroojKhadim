// src/components/apartments/ApartmentFilterBar.tsx - Minimal Luxury Filter System
import React from 'react';
import { Category } from '../../types';
import { Search, RotateCcw, MapPin } from 'lucide-react';

interface ApartmentFilterBarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  selectedBeds: number | null;
  onSelectBeds: (beds: number | null) => void;
  guestCapacity: number | null;
  onSelectGuestCapacity: (capacity: number | null) => void;
  durationType: string;
  onSelectDurationType: (type: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

export const ApartmentFilterBar: React.FC<ApartmentFilterBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  selectedLocation,
  onSelectLocation,
  selectedBeds,
  onSelectBeds,
  guestCapacity,
  onSelectGuestCapacity,
  durationType,
  onSelectDurationType,
  searchQuery,
  onSearchChange,
  onReset,
}) => {
  const hasActiveFilters = 
    selectedLocation !== 'all' ||
    selectedCategoryId !== null || 
    selectedBeds !== null || 
    guestCapacity !== null || 
    durationType !== 'all' || 
    Boolean(searchQuery.trim());

  return (
    <div className="bg-white dark:bg-brand-navy-900/90 rounded-2xl border border-[#E5DFD5] dark:border-brand-gold-500/20 p-5 shadow-sm dark:shadow-2xl mb-12 space-y-4 transition-colors">
      {/* Location Filter Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] uppercase font-bold text-brand-gold-600 dark:text-brand-gold-400 tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <MapPin className="w-3.5 h-3.5" /> Destination:
        </span>
        {['all', 'The Centaurus', 'Elysium Tower', 'F-11 Markaz'].map((loc) => {
          const isSelected = selectedLocation === loc;
          const label = loc === 'all' ? 'All Locations' : loc;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => onSelectLocation(loc)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide shrink-0 transition-all ${
                isSelected
                  ? 'bg-brand-gold-500 text-brand-navy-950 shadow-sm font-bold'
                  : 'bg-[#FAF7F2] text-slate-700 hover:text-brand-navy-950 border border-[#E2DDD5] dark:bg-brand-navy-950 dark:text-slate-300 dark:hover:text-white dark:border-white/10 dark:hover:border-brand-gold-500/40'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Search Input & Quick Controls */}
      <div className="flex flex-col lg:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-brand-gold-600 dark:text-brand-gold-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by suite title, Margalla view, floor, or amenity..."
            className="w-full bg-[#FAF7F2] dark:bg-brand-navy-950 border border-[#E2DDD5] dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-brand-navy-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 transition-colors font-light"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
          {/* Bedrooms Filter */}
          <select
            value={selectedBeds ?? ''}
            onChange={(e) => onSelectBeds(e.target.value ? Number(e.target.value) : null)}
            className="bg-[#FAF7F2] dark:bg-brand-navy-950 border border-[#E2DDD5] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-brand-navy-900 dark:text-slate-200 focus:outline-none focus:border-brand-gold-500"
          >
            <option value="">All Bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
          </select>

          {/* Guest Capacity Filter */}
          <select
            value={guestCapacity ?? ''}
            onChange={(e) => onSelectGuestCapacity(e.target.value ? Number(e.target.value) : null)}
            className="bg-[#FAF7F2] dark:bg-brand-navy-950 border border-[#E2DDD5] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-brand-navy-900 dark:text-slate-200 focus:outline-none focus:border-brand-gold-500"
          >
            <option value="">Any Capacity</option>
            <option value="2">Up to 2 Guests</option>
            <option value="4">Up to 4 Guests</option>
            <option value="6">Up to 6 Guests</option>
          </select>

          {/* Rental Duration Filter */}
          <select
            value={durationType}
            onChange={(e) => onSelectDurationType(e.target.value)}
            className="bg-[#FAF7F2] dark:bg-brand-navy-950 border border-[#E2DDD5] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-brand-navy-900 dark:text-slate-200 focus:outline-none focus:border-brand-gold-500"
          >
            <option value="all">Any Duration</option>
            <option value="night">Nightly / Short Stay</option>
            <option value="month">Monthly Executive</option>
            <option value="year">Annual Corporate</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="p-2 rounded-xl bg-[#FAF7F2] dark:bg-brand-navy-950 text-slate-600 dark:text-slate-400 hover:text-brand-gold-600 dark:hover:text-brand-gold-400 border border-[#E2DDD5] dark:border-white/10 transition-colors shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[#EAE5DC] dark:border-white/5">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase shrink-0 transition-all ${
            selectedCategoryId === null
              ? 'bg-luxury-gold-gradient text-brand-navy-950 shadow-sm font-bold'
              : 'bg-[#FAF7F2] text-slate-700 hover:text-brand-navy-950 border border-[#E2DDD5] dark:bg-brand-navy-950 dark:text-slate-400 dark:hover:text-white dark:border-white/5'
          }`}
        >
          All Suites ({categories.length})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase shrink-0 transition-all ${
              selectedCategoryId === cat.id
                ? 'bg-luxury-gold-gradient text-brand-navy-950 shadow-sm font-bold'
                : 'bg-[#FAF7F2] text-slate-700 hover:text-brand-navy-950 border border-[#E2DDD5] dark:bg-brand-navy-950 dark:text-slate-400 dark:hover:text-white dark:border-white/5'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};
