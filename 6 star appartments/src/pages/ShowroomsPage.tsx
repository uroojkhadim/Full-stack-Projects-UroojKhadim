// src/pages/ShowroomsPage.tsx - 6 STARS HOSPITALITY Commercial Spaces & Viewing Suites
import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { api } from '../services/api';
import { CommercialSpace } from '../types';
import { resolveSafeImagePath } from '../components/common/OptimizedImage';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Maximize2, 
  Sparkles, 
  Send, 
  ArrowUpRight, 
  MessageSquare,
  CheckCircle2, 
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ShowroomsPage: React.FC = () => {
  const { settings, addToast } = useSite();
  const formRef = useRef<HTMLDivElement>(null);

  const [commercialSpaces, setCommercialSpaces] = useState<CommercialSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Showroom' | 'Executive Office' | 'Corporate Suite'>('All');

  // Consultation & Tour Form State
  const [tourName, setTourName] = useState('');
  const [tourPhone, setTourPhone] = useState('');
  const [tourEmail, setTourEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('Prime Centaurus Concourse Retail Showroom');
  const [tourNotes, setTourNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getCommercialSpaces().then((data) => {
      setCommercialSpaces(data);
      setLoading(false);
    });
  }, []);

  const filteredSpaces = selectedFilter === 'All'
    ? commercialSpaces
    : commercialSpaces.filter(s => s.space_type === selectedFilter);

  const handleInquireSpace = (spaceTitle: string) => {
    setSelectedSpace(spaceTitle);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourName.trim() || !tourPhone.trim()) {
      addToast('Please enter your full name and phone number', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitInquiry({
        name: tourName,
        phone: tourPhone,
        email: tourEmail,
        inquiry_type: selectedSpace.includes('Showroom') ? 'Showroom Inquiry' : 'Office Inquiry',
        subject: `Commercial Space Inquiry: ${selectedSpace} ${companyName ? `(${companyName})` : ''}`,
        message: `Preferred Tour Date: ${tourDate || 'Flexible'}. Company: ${companyName || 'Private Client'}. Notes: ${tourNotes || 'Please contact me with availability and lease terms.'}`
      });

      if (res.success) {
        addToast('Commercial inquiry received! Our senior corporate leasing director will contact you promptly.');
        setTourName('');
        setTourPhone('');
        setTourEmail('');
        setCompanyName('');
        setTourDate('');
        setTourNotes('');
      } else {
        addToast(res.error || 'Failed to submit commercial inquiry', 'error');
      }
    } catch {
      addToast('An error occurred while submitting inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const verifiedWhatsapp = (settings.whatsapp || '923120893146').replace(/[^0-9]/g, '');

  return (
    <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Luxury Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/25 text-brand-gold-600 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Prime Commercial & Corporate Real Estate</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-foreground dark:text-white tracking-tight">
          Showrooms & Executive Offices
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground dark:text-slate-400 mt-3 leading-relaxed">
          Establish your brand flagship or corporate headquarters at <span className="text-foreground dark:text-white font-semibold">The Centaurus Islamabad</span>. Featuring premier high-visibility concourse retail showrooms and Grade-A executive office suites with uninterrupted power and elite hospitality services.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-muted-foreground dark:text-slate-300">
          <span className="px-3 py-1.5 rounded-xl bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 flex items-center gap-2 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="text-card-foreground dark:text-slate-200">100% Industrial Generator Backup</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 flex items-center gap-2 shadow-sm">
            <Building2 className="w-4 h-4 text-brand-gold-500" />
            <span className="text-card-foreground dark:text-slate-200">Prime Concourse & Corporate Towers</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 flex items-center gap-2 shadow-sm">
            <Layers className="w-4 h-4 text-brand-gold-500" />
            <span className="text-card-foreground dark:text-slate-200">Dedicated Executive Elevator Banks</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
        {(['All', 'Showroom', 'Executive Office', 'Corporate Suite'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
              selectedFilter === tab
                ? 'bg-brand-gold-500 text-charcoal-950 shadow-md font-bold'
                : 'bg-card dark:bg-charcoal-900 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white border border-border dark:border-charcoal-800'
            }`}
          >
            {tab === 'All' ? 'All Commercial Spaces' : tab === 'Showroom' ? 'Retail Showrooms' : `${tab}s`}
          </button>
        ))}
      </div>

      {/* Commercial Properties Listings */}
      {loading ? (
        <div className="py-20 text-center text-muted-foreground dark:text-slate-400">Loading commercial properties...</div>
      ) : filteredSpaces.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 rounded-3xl p-8 mb-20 shadow-lg">
          <Briefcase className="w-12 h-12 text-brand-gold-500 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-xl text-card-foreground dark:text-white mb-2">
            [No showroom or office information available]
          </h3>
          <p className="text-xs text-muted-foreground dark:text-slate-400 mb-6">
            There are currently no commercial spaces listed under this filter. Please check another category or contact our corporate leasing team directly.
          </p>
          <button
            onClick={() => setSelectedFilter('All')}
            className="px-5 py-2.5 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-xs"
          >
            View All Spaces
          </button>
        </div>
      ) : (
        <div className="space-y-12 mb-20">
          {filteredSpaces.map((space) => {
            const primaryImage = space.images && space.images.length > 0 
              ? space.images[0] 
              : './images/background image.jpeg';

            return (
              <div
                key={space.id}
                className="bg-card dark:bg-charcoal-900/90 rounded-3xl overflow-hidden border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 group"
              >
                {/* Visual Image Presentation (5 cols) */}
                <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full overflow-hidden bg-muted dark:bg-charcoal-950">
                  <img
                    src={resolveSafeImagePath(primaryImage)}
                    alt={space.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    width={1600}
                    height={1000}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Badges on image */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="px-3 py-1 rounded-md text-xs font-bold bg-black/80 text-brand-gold-300 border border-brand-gold-500/30 backdrop-blur-md uppercase tracking-wider">
                      {space.space_type}
                    </span>
                    <span className="px-3 py-1 rounded-md text-[11px] font-semibold bg-emerald-950/90 text-emerald-400 border border-emerald-800 backdrop-blur-md">
                      {space.status}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-200 bg-black/75 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-brand-gold-400" />
                      <span className="font-bold text-white">{space.area_sqft.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-gold-400" />
                      <span className="truncate">{space.floor_location}</span>
                    </div>
                  </div>
                </div>

                {/* Content Details (7 cols) */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-xs text-brand-gold-600 dark:text-brand-gold-400 font-semibold uppercase tracking-wider block mb-1">
                          {space.floor_location}
                        </span>
                        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white leading-tight">
                          {space.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground dark:text-slate-300 leading-relaxed mt-3 mb-6">
                      {space.description}
                    </p>

                    {/* Suitable For Tags */}
                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold-500" />
                        <span>Ideally Suited For:</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {space.suitable_for.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-muted/60 dark:bg-charcoal-950 text-card-foreground dark:text-slate-200 border border-border dark:border-charcoal-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Commercial Features */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-gold-500" />
                        <span>Commercial Inclusions & Specifications:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {space.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-muted-foreground dark:text-slate-300 bg-muted/30 dark:bg-charcoal-950/60 p-2.5 rounded-xl border border-border dark:border-charcoal-800/80"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing and CTAs */}
                  <div className="pt-6 border-t border-border dark:border-charcoal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-muted-foreground dark:text-slate-400 block uppercase tracking-wider">
                        Commercial Terms / Rate
                      </span>
                      <div className="font-heading font-extrabold text-xl text-card-foreground dark:text-white">
                        {space.price_estimate || space.pricing_type}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      <a
                        href={`https://wa.me/${verifiedWhatsapp}?text=Hello%206%20Stars%20Hospitality,%20I%20am%20interested%20in%20commercial%20leasing%20for%20the%20${encodeURIComponent(space.title)}%20at%20The%20Centaurus.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp Desk</span>
                      </a>

                      <button
                        onClick={() => handleInquireSpace(space.title)}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span>Request Terms / Tour</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Physical Showrooms & Viewing Suites */}
      <div className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-brand-gold-600 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest block mb-1">
            In-Person Experience
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground dark:text-white">
            Visit Our Showroom & Leasing Offices
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400 mt-2">
            Experience our 18th-floor Centaurus viewing suite or consult our executive leasing managers at our Islamabad headquarters.
          </p>
        </div>

        {settings.showrooms.length === 0 ? (
          <div className="text-center py-12 bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 rounded-3xl p-8 max-w-md mx-auto">
            <Building2 className="w-10 h-10 text-brand-gold-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-card-foreground dark:text-white">[No showroom or office information available]</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {settings.showrooms.map((room, idx) => (
              <div
                key={idx}
                className="bg-card dark:bg-charcoal-900/80 rounded-3xl p-6 sm:p-8 border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-brand-gold-500/15 text-brand-gold-600 dark:text-brand-gold-400 border border-brand-gold-500/30 uppercase tracking-wider">
                        {room.tag}
                      </span>
                      <h3 className="font-heading font-extrabold text-2xl text-card-foreground dark:text-white mt-2">
                        {room.name}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-muted dark:bg-charcoal-950 border border-border dark:border-charcoal-800 flex items-center justify-center text-brand-gold-500 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-muted-foreground dark:text-slate-300 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-brand-gold-500 shrink-0 mt-1" />
                      <span>{room.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-brand-gold-500 shrink-0" />
                      <span>{room.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-brand-gold-500 shrink-0" />
                      <span>{room.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-brand-gold-500 shrink-0" />
                      <span>{room.hours}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border dark:border-charcoal-800 flex items-center justify-between">
                  <a
                    href={room.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold-600 dark:text-brand-gold-400 hover:text-brand-gold-500 transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`tel:${room.phone.replace(/\s+/g, '')}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted dark:bg-charcoal-950 text-card-foreground dark:text-white hover:bg-muted/80 dark:hover:bg-charcoal-800 border border-border dark:border-charcoal-700 transition-colors"
                  >
                    Call Office
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule a Private Tour / Commercial Inquiry Form */}
      <div ref={formRef} className="max-w-3xl mx-auto bg-card dark:bg-charcoal-900 rounded-3xl p-8 sm:p-12 border border-brand-gold-500/30 shadow-xl">
        <div className="text-center mb-8">
          <span className="text-brand-gold-600 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest block mb-1">
            VIP Commercial Consultation
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white">
            Schedule a Private Viewing or Commercial Tour
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400 mt-2">
            Walk through our furnished viewing suites, showroom lots, or corporate floors accompanied by a senior leasing specialist.
          </p>
        </div>

        <form onSubmit={handleBookTour} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground dark:text-slate-300 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={tourName}
                onChange={(e) => setTourName(e.target.value)}
                placeholder="e.g. Mr. Malik"
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground dark:text-slate-300 mb-1.5">Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={tourPhone}
                onChange={(e) => setTourPhone(e.target.value)}
                placeholder="+92 312 0893146"
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground dark:text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={tourEmail}
                onChange={(e) => setTourEmail(e.target.value)}
                placeholder="corporate@company.com"
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground dark:text-slate-300 mb-1.5">Company / Brand Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp / Retail Brand"
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground dark:text-slate-300 mb-1.5">Property or Space of Interest</label>
              <select
                value={selectedSpace}
                onChange={(e) => setSelectedSpace(e.target.value)}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white focus:outline-none focus:border-brand-gold-500"
              >
                <optgroup label="Commercial Spaces">
                  {commercialSpaces.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title} ({s.space_type})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Physical Viewing Suites">
                  <option value="The Centaurus Residence Suite (Tower B, 18th Floor)">
                    The Centaurus Residence Suite (Tower B, 18th Floor)
                  </option>
                  <option value="Blue Area Executive Leasing Office">
                    Blue Area Executive Leasing Office
                  </option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground dark:text-slate-300 mb-1.5">Preferred Date & Time</label>
              <input
                type="text"
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                placeholder="e.g. Tomorrow at 3:00 PM"
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground dark:text-slate-300 mb-1.5">Requirements / Notes</label>
            <textarea
              rows={3}
              value={tourNotes}
              onChange={(e) => setTourNotes(e.target.value)}
              placeholder="Specify requirements, expected headcount, fit-out needs, or lease duration..."
              className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-4 py-2.5 text-sm text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-lg shadow-brand-gold-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting Commercial Request...' : 'Schedule Private Viewing / Consultation'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
