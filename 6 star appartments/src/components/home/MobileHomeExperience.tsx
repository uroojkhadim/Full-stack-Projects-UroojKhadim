import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BedDouble, Building2, CalendarDays, CheckCircle2, Compass, Home, MapPin, MessageCircle, Search, ShieldCheck, UserRound, Wifi } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { formatCurrency } from '../../utils/formatters';
import { resolveSafeImagePath } from '../common/OptimizedImage';
import { HERO_IMAGE, getSafeImageUrl } from '../../services/imageManifest';

const categoryLabels: Record<string, string> = {
  'one-bed-studio-apartment': 'Studio',
  '1-plus-study-apartment': '1+Study',
  '1-bed-margalla-facing': 'Margalla View',
  '2-bed-apartments': '2 Bedroom',
  '2-plus-study-apartment': '2+Study',
  'centaurus-two-bedrooms': 'Centaurus',
  '3-bed-apartment': 'Penthouse',
};

export const MobileHomeExperience: React.FC = () => {
  const { apartments, categories, settings } = useSite();
  const featured = apartments.slice(0, 3);
  const availableCategories = categories.filter(category => (category.product_count ?? 0) > 0).slice(0, 4);

  return (
    <div className="md:hidden bg-[#fbfaf7] pb-20 text-[#102033]">
      <section className="relative -mt-1 overflow-hidden bg-[#0a1626] px-4 pb-4 pt-4">
        <div className="absolute inset-0 opacity-45">
          <img src={getSafeImageUrl(HERO_IMAGE.relativePath)} alt="" className="h-full w-full object-cover" width={HERO_IMAGE.width} height={HERO_IMAGE.height} />
        </div>
        <div className="relative z-10 pt-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#e2bf73]">6 Star Hospitality</p>
          <h1 className="mt-1 max-w-[280px] font-heading text-[27px] font-extrabold leading-[1.05] text-white">Luxury Living Above<br /><span className="text-[#e3bd6b]">Islamabad</span></h1>
          <p className="mt-2 max-w-[300px] text-[11px] leading-relaxed text-white/80">Experience refined comfort, exceptional views, and effortless hospitality at 6 Star Centaurus Apartments.</p>
        </div>
        <div className="relative z-10 mt-4 rounded-xl bg-white p-2.5 shadow-xl">
          <div className="mb-2 flex items-center justify-between border-b border-[#ebe5da] pb-2">
            <div className="flex gap-1 rounded-lg bg-[#f5f2eb] p-1 text-[9px] font-bold"><span className="rounded-md bg-white px-2 py-1 text-[#152439] shadow-sm">Daily Stay</span><span className="px-2 py-1 text-slate-500">Monthly Lease</span></div>
            <span className="text-[9px] font-semibold text-slate-500">Executive House</span>
          </div>
          <Link to="/quote" className="flex items-center gap-2 rounded-lg border border-[#e8e1d5] px-2.5 py-2 text-[10px] text-slate-500"><Building2 className="h-3 w-3 text-[#b08b44]" />Select Tower, Suite Type or Date...<ArrowRight className="ml-auto h-3 w-3" /></Link>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-[9px]">
            <div className="rounded-lg bg-[#f8f6f1] p-2"><span className="block uppercase text-slate-400">Dates</span><strong>Check-in / out</strong></div>
            <div className="rounded-lg bg-[#f8f6f1] p-2"><span className="block uppercase text-slate-400">Residents</span><strong>1 Adult · 1 Child</strong></div>
            <div className="rounded-lg bg-[#f8f6f1] p-2"><span className="block uppercase text-slate-400">View</span><strong>Margalla Preferred</strong></div>
          </div>
          <Link to="/quote" className="mt-2 flex items-center justify-center rounded-lg bg-[#101d2e] py-2.5 text-[10px] font-bold text-white">Check Availability & Rates <ArrowRight className="ml-1.5 h-3 w-3 text-[#e1bd6e]" /></Link>
        </div>
      </section>

      <section className="px-4 pt-5">
        <div className="flex items-end justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#b08b44]">Accommodation</p><h2 className="font-heading text-base font-extrabold">Curated Residence Categories</h2></div><Link to="/apartments" className="text-[9px] font-bold uppercase text-[#b08b44]">View all</Link></div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {availableCategories.map(category => <Link to={`/apartments?category=${category.id}`} key={category.id} className="overflow-hidden rounded-lg border border-[#e5dfd3] bg-white shadow-sm"><img src={resolveSafeImagePath(category.image)} alt={category.name} className="h-16 w-full object-cover" width={240} height={140} /><span className="block truncate px-1.5 py-1.5 text-[8px] font-bold">{categoryLabels[category.slug] || category.name}</span></Link>)}
        </div>
      </section>

      <section className="px-4 pt-7">
        <div className="flex items-end justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#b08b44]">The Centaurus Collection</p><h2 className="font-heading text-base font-extrabold">Featured Serviced Suites & Penthouses</h2></div><Link to="/apartments" className="text-[9px] font-bold uppercase text-[#b08b44]">See all</Link></div>
        <div className="mt-3 space-y-4">
          {featured.map(apartment => <article key={apartment.id} className="overflow-hidden rounded-xl border border-[#e2dbce] bg-white shadow-sm"><Link to={`/apartments/${apartment.id}`}><div className="relative"><img src={resolveSafeImagePath(apartment.images[0])} alt={apartment.title} className="h-40 w-full object-cover" width={1280} height={800} /><span className="absolute left-2 top-2 rounded-md bg-[#0b1828]/85 px-2 py-1 text-[8px] font-bold uppercase text-[#e5c47e]">Tower B · Centaurus Suite</span><span className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[8px] font-bold text-[#152439]">View</span></div></Link><div className="p-3"><div className="flex items-start justify-between gap-3"><div><h3 className="font-heading text-base font-bold leading-tight">{apartment.title}</h3><p className="mt-1 text-[9px] text-slate-500">{apartment.view_type}</p></div><div className="text-right"><strong className="font-heading text-lg">{formatCurrency(apartment.price)}</strong><span className="block text-[8px] text-slate-400">/ {apartment.price_type}</span></div></div><div className="mt-3 grid grid-cols-3 border-y border-[#eee8dd] py-2 text-[8px] text-slate-500"><span>{apartment.bedrooms} BEDROOMS</span><span>{apartment.bathrooms} BATHROOMS</span><span>{apartment.area_sqft} SQ FT</span></div><div className="mt-3 flex gap-2"><Link to={`/apartments/${apartment.id}`} className="flex-1 rounded-md bg-[#101d2e] py-2 text-center text-[9px] font-bold text-white">Reserve Suite</Link><Link to="/quote" className="rounded-md border border-[#dfd6c7] px-3 py-2 text-[9px] font-bold">Quote</Link></div></div></article>)}
        </div>
      </section>

      <section className="mt-7 bg-[#f3f0e9] px-4 py-5"><p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#b08b44]">Hospitality Excellence</p><div className="flex items-center justify-between"><h2 className="font-heading text-base font-extrabold">6-Star Hospitality Standards</h2><ShieldCheck className="h-5 w-5 text-[#b08b44]" /></div><div className="mt-3 grid grid-cols-2 gap-2">{[['24/7 Concierge', 'Dedicated guest support'], ['Private Access', 'Direct mall connection'], ['Margalla Views', 'Panoramic city stays'], ['VIP Inclusions', 'Power, Wi-Fi & care']].map(([title, text]) => <div key={title} className="rounded-lg border border-[#e4ded2] bg-white p-2.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#b08b44]" /><h3 className="mt-1 text-[9px] font-bold">{title}</h3><p className="mt-0.5 text-[8px] leading-tight text-slate-500">{text}</p></div>)}</div></section>

      <section className="px-4 py-6"><p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#b08b44]">The Centaurus Complex</p><h2 className="font-heading text-base font-extrabold">Tower Locations</h2><div className="mt-3 grid grid-cols-2 gap-2">{['Tower A', 'Tower B', 'Tower C', 'Centaurus Mall'].map((tower, index) => <div key={tower} className="relative overflow-hidden rounded-lg"><img src={resolveSafeImagePath(featured[index % Math.max(featured.length, 1)]?.images[0] || '/images/background image.jpeg')} alt={tower} className="h-20 w-full object-cover brightness-75" width={500} height={300} /><span className="absolute bottom-2 left-2 text-[9px] font-bold text-white">{tower}</span></div>)}</div></section>

      <section className="mx-4 mb-5 rounded-xl border border-[#e4ddd0] bg-white p-3 shadow-sm"><p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#b08b44]">Dedicated Concierge & Booking Desk</p><div className="mt-2 flex gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eadfca] text-[#88652a]"><UserRound className="h-6 w-6" /></div><div><h2 className="font-heading text-sm font-bold">Meet our hospitality team</h2><p className="mt-1 text-[9px] leading-relaxed text-slate-500">Corporate & Diplomatic Stay Specialists. We make every arrival effortless.</p></div></div><a href={`https://wa.me/${(settings.whatsapp || '+923120893146').replace(/[^0-9]/g, '')}`} className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-[#101d2e] py-2 text-[9px] font-bold text-white"><MessageCircle className="h-3 w-3 text-[#e1bd6e]" /> Book VIP Concierge Stay</a></section>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-[#ded7ca] bg-white/95 px-2 py-2 shadow-[0_-4px_20px_rgba(15,27,42,0.08)] backdrop-blur"><Link to="/" className="flex flex-col items-center gap-0.5 text-[#a47c35]"><Home className="h-4 w-4" /><span className="text-[8px] font-bold">Suites</span></Link><Link to="/apartments" className="flex flex-col items-center gap-0.5 text-slate-500"><Search className="h-4 w-4" /><span className="text-[8px] font-bold">Search</span></Link><Link to="/quote" className="flex flex-col items-center gap-0.5 text-slate-500"><CalendarDays className="h-4 w-4" /><span className="text-[8px] font-bold">Booking</span></Link><a href="#contact" className="flex flex-col items-center gap-0.5 text-slate-500"><Compass className="h-4 w-4" /><span className="text-[8px] font-bold">Explore</span></a></nav>
    </div>
  );
};
