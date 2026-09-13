// src/pages/HomePage.tsx - 6 STARS HOSPITALITY Official Luxury Home Page
import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { LuxuryIntroSection } from '../components/home/LuxuryIntroSection';
import { AmenitiesSection } from '../components/home/AmenitiesSection';
import { FeaturedApartments } from '../components/home/FeaturedApartments';
import { GallerySection } from '../components/home/GallerySection';
import { ContactSection } from '../components/home/ContactSection';
import { MobileHomeExperience } from '../components/home/MobileHomeExperience';

export const HomePage: React.FC = () => {
  return (
    <div className="relative overflow-hidden scroll-smooth">
      {/* Mobile-first booking experience matching the compact hospitality layout. */}
      <MobileHomeExperience />

      {/* Desktop experience retains the full narrative sections. */}
      <div className="hidden md:block">
        <HeroSection />

        {/* 2. Brand Narrative & Benefits About Section (#about) */}
        <LuxuryIntroSection />

        {/* 3. Tailored Hospitality Services & Amenities (#services) */}
        <AmenitiesSection />

        {/* 4. Curated Properties, Rooms & Suites (#properties) */}
        <FeaturedApartments />

        {/* 5. Curated 20-Image Interactive Gallery with Lightbox (#gallery) */}
        <GallerySection />

        {/* 6. Guest Concierge & Validated Contact Form (#contact) */}
        <ContactSection />
      </div>
    </div>
  );
};
