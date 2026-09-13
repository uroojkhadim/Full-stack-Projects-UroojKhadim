// src/pages/ApartmentDetailPage.tsx - 6 STARS HOSPITALITY Residence Specification & Gallery
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Apartment } from '../types';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { resolveSafeImagePath } from '../components/common/OptimizedImage';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  Compass, 
  Check, 
  Calculator, 
  MessageSquare, 
  Phone, 
  ArrowLeft,
  ShieldCheck,
  Building2,
  Share2
} from 'lucide-react';

export const ApartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apartments, settings, addToast } = useSite();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (id) {
      const numId = Number(id);
      const found = apartments.find(a => a.id === numId || a.slug === id);
      if (found) {
        setApartment(found);
      } else {
        api.getProductById(numId).then(res => {
          if (res) setApartment(res);
        });
      }
    }
  }, [id, apartments]);

  if (!apartment) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 rounded-3xl p-8 shadow-xl">
        <Building2 className="w-12 h-12 text-brand-gold-500 animate-pulse mx-auto mb-4" />
        <h2 className="font-heading font-bold text-2xl text-card-foreground dark:text-white mb-2">Residence Not Found</h2>
        <p className="text-sm text-muted-foreground dark:text-slate-400 mb-6">The requested apartment unit could not be located.</p>
        <Link to="/apartments" className="px-6 py-2.5 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-sm shadow-md">
          Return to Apartments
        </Link>
      </div>
    );
  }

  const images = apartment.images && apartment.images.length > 0 
    ? apartment.images 
    : ['./images/background image.jpeg'];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Direct apartment link copied to clipboard!');
  };

  const verifiedWhatsapp = (settings.whatsapp || '923120893146').replace(/[^0-9]/g, '');
  const verifiedHotline = settings.phone_primary || '+92 312 0893146';

  return (
    <div className="py-10 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-brand-gold-500 dark:text-slate-400 dark:hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Residences</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-card-foreground dark:text-slate-400 dark:hover:text-white bg-card dark:bg-charcoal-900 px-3 py-1.5 rounded-lg border border-border dark:border-charcoal-800 transition-colors shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5 text-brand-gold-500" />
          <span>Share Suite</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Media Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-muted dark:bg-charcoal-950 border border-border dark:border-charcoal-800 shadow-xl">
            <img
              src={resolveSafeImagePath(images[activeImageIdx])}
              alt={apartment.title}
              className="w-full h-full object-cover"
              width={1600}
              height={1000}
            />
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold text-brand-gold-300 border border-brand-gold-500/30">
              {apartment.category_name}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIdx === idx 
                      ? 'border-brand-gold-500 scale-[1.02] shadow-md' 
                      : 'border-border dark:border-charcoal-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={resolveSafeImagePath(img)} alt="" className="w-full h-full object-cover" width={320} height={200} />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Overview */}
          <div className="bg-card dark:bg-charcoal-900/60 rounded-3xl p-6 sm:p-8 border border-border dark:border-charcoal-800 mt-6 space-y-6 shadow-sm">
            <div>
              <h3 className="font-heading font-bold text-xl text-card-foreground dark:text-white mb-3">Residence Overview</h3>
              <p className="text-sm text-muted-foreground dark:text-slate-300 leading-relaxed">
                {apartment.description}
              </p>
            </div>

            <div className="pt-6 border-t border-border dark:border-charcoal-800">
              <h3 className="font-heading font-bold text-lg text-card-foreground dark:text-white mb-4">Included Amenities & Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {apartment.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-muted-foreground dark:text-slate-300 bg-muted/40 dark:bg-charcoal-950/60 p-2.5 rounded-xl border border-border dark:border-charcoal-800">
                    <div className="w-4 h-4 rounded-full bg-brand-gold-500/20 text-brand-gold-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border dark:border-charcoal-800">
              <h3 className="font-heading font-bold text-lg text-card-foreground dark:text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold-500" />
                <span>The Centaurus Privileges</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground dark:text-slate-300">
                <div className="p-3 rounded-xl bg-muted/40 dark:bg-charcoal-950/60 border border-border dark:border-charcoal-800">
                  <p className="font-bold text-card-foreground dark:text-white mb-0.5">100% Dual Generator Redundancy</p>
                  <p className="text-[11px] text-muted-foreground dark:text-slate-400">Zero blackout downtime for AC, elevators, and appliances.</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 dark:bg-charcoal-950/60 border border-border dark:border-charcoal-800">
                  <p className="font-bold text-card-foreground dark:text-white mb-0.5">Multi-Tier Security & Biometrics</p>
                  <p className="text-[11px] text-muted-foreground dark:text-slate-400">24/7 guarded barriers, keycard elevators, and surveillance.</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 dark:bg-charcoal-950/60 border border-border dark:border-charcoal-800">
                  <p className="font-bold text-card-foreground dark:text-white mb-0.5">Direct Enclosed Mall Access</p>
                  <p className="text-[11px] text-muted-foreground dark:text-slate-400">Step straight into international retail and dining from your elevator.</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 dark:bg-charcoal-950/60 border border-border dark:border-charcoal-800">
                  <p className="font-bold text-card-foreground dark:text-white mb-0.5">Health Club & Heated Pool</p>
                  <p className="text-[11px] text-muted-foreground dark:text-slate-400">Complimentary guest access to premium fitness facilities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Specifications & Booking Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card dark:bg-charcoal-900 rounded-3xl p-6 sm:p-8 border border-brand-gold-500/30 shadow-xl sticky top-28">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white mb-1">
              {apartment.title}
            </h1>
            <p className="text-xs text-brand-gold-600 dark:text-brand-gold-400 font-semibold uppercase tracking-wider mb-6">
              The Centaurus • {apartment.floor}
            </p>

            {/* Price Badge */}
            <div className="bg-muted/40 dark:bg-charcoal-950 p-4 rounded-2xl border border-border dark:border-charcoal-800 mb-6 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-muted-foreground dark:text-slate-400">Rate Starting From</span>
                <div className="font-heading font-extrabold text-3xl text-card-foreground dark:text-white">
                  {formatCurrency(apartment.price)}
                  <span className="text-xs font-normal text-muted-foreground dark:text-slate-400 ml-1">/ {apartment.price_type}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                Ready For Move-in
              </span>
            </div>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-xs text-muted-foreground dark:text-slate-300">
              <div className="bg-muted/40 dark:bg-charcoal-950 p-3 rounded-xl border border-border dark:border-charcoal-800 flex items-center gap-2.5">
                <Bed className="w-4 h-4 text-brand-gold-500 shrink-0" />
                <div>
                  <p className="text-muted-foreground dark:text-slate-400 text-[11px]">Bedrooms</p>
                  <p className="font-bold text-card-foreground dark:text-white">{apartment.bedrooms} Bed</p>
                </div>
              </div>

              <div className="bg-muted/40 dark:bg-charcoal-950 p-3 rounded-xl border border-border dark:border-charcoal-800 flex items-center gap-2.5">
                <Bath className="w-4 h-4 text-brand-gold-500 shrink-0" />
                <div>
                  <p className="text-muted-foreground dark:text-slate-400 text-[11px]">Bathrooms</p>
                  <p className="font-bold text-card-foreground dark:text-white">{apartment.bathrooms} Bath</p>
                </div>
              </div>

              <div className="bg-muted/40 dark:bg-charcoal-950 p-3 rounded-xl border border-border dark:border-charcoal-800 flex items-center gap-2.5">
                <Maximize2 className="w-4 h-4 text-brand-gold-500 shrink-0" />
                <div>
                  <p className="text-muted-foreground dark:text-slate-400 text-[11px]">Floor Area</p>
                  <p className="font-bold text-card-foreground dark:text-white">{apartment.area_sqft} sq ft</p>
                </div>
              </div>

              <div className="bg-muted/40 dark:bg-charcoal-950 p-3 rounded-xl border border-border dark:border-charcoal-800 flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-brand-gold-500 shrink-0" />
                <div>
                  <p className="text-muted-foreground dark:text-slate-400 text-[11px]">Orientation</p>
                  <p className="font-bold text-card-foreground dark:text-white truncate">{apartment.view_type}</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Link
                to={`/quote?apartment_id=${apartment.id}`}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Instant Quotation</span>
              </Link>

              <a
                href={`https://wa.me/${verifiedWhatsapp}?text=Hello%206%20Stars%20Hospitality,%20I%20am%20interested%20in%20the%20${encodeURIComponent(apartment.title)}%20at%20The%20Centaurus.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-semibold text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Reservation Desk</span>
              </a>

              <a
                href={`tel:${verifiedHotline.replace(/\s+/g, '')}`}
                className="w-full py-2.5 rounded-xl font-medium text-xs text-muted-foreground hover:text-card-foreground dark:text-slate-300 dark:hover:text-white bg-muted/40 dark:bg-charcoal-950 border border-border dark:border-charcoal-800 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-brand-gold-500" />
                <span>Call Hotline: {verifiedHotline}</span>
              </a>
            </div>

            <div className="mt-6 pt-4 border-t border-border dark:border-charcoal-800 flex items-center gap-2 text-xs text-muted-foreground dark:text-slate-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <span>Includes 24/7 Power, WiFi & Mall Direct Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
