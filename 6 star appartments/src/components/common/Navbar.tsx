// src/components/common/Navbar.tsx - 6 STARS HOSPITALITY Official Luxury Header & Navigation
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { ThemeToggle } from './ThemeToggle';
import { 
  Phone, 
  MapPin, 
  Menu, 
  X, 
  CalendarCheck, 
  MessageSquare, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_LOGO, getSafeImageUrl } from '../../services/imageManifest';

export const Navbar: React.FC = () => {
  const { settings } = useSite();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scrollspy detection on homepage
      if (location.pathname === '/') {
        const sections = ['home', 'about', 'services', 'properties', 'gallery', 'contact'];
        const scrollPosition = window.scrollY + 120;
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Exact navigation items required: Home, About, Services, Properties/Rooms, Gallery, Contact
  const navItems = [
    { label: 'Home', target: 'home', path: '/#home' },
    { label: 'About', target: 'about', path: '/#about' },
    { label: 'Services', target: 'services', path: '/#services' },
    { label: 'Properties', target: 'properties', path: '/#properties' },
    { label: 'Gallery', target: 'gallery', path: '/#gallery' },
    { label: 'Contact', target: 'contact', path: '/#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(target);
        setMobileMenuOpen(false);
      }
    } else {
      // Navigate to homepage with anchor
      navigate(`/#${target}`);
      setMobileMenuOpen(false);
    }
  };

  const verifiedPhone = settings.phone_primary || '+92 312 0893146';
  const verifiedWhatsapp = settings.whatsapp || '+92 312 0893146';
  const cleanWhatsappNumber = verifiedWhatsapp.replace(/[^0-9]/g, '');

  const logoUrl = BRAND_LOGO ? getSafeImageUrl(BRAND_LOGO.relativePath) : '/images/logo/WhatsApp%20Image%202026-09-08%20at%206.45.07%20PM.jpeg';

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Luxury Contact & Location Strip */}
      <div className="bg-[#FAF7F2] text-[#0A1322] border-b border-[#E7E2D8] dark:bg-brand-navy-950 dark:text-slate-300 dark:border-white/5 text-[11px] py-1.5 px-4 sm:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-brand-gold-600 dark:text-brand-gold-400 font-semibold tracking-wide">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10.5px] sm:text-[11px]">The Centaurus, Jinnah Avenue, Sector F-8/4, Islamabad</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <a 
              href={`tel:${verifiedPhone.replace(/\s+/g, '')}`} 
              className="hidden sm:flex items-center gap-1.5 hover:text-brand-gold-600 dark:hover:text-brand-gold-400 transition-colors font-medium"
            >
              <Phone className="w-3 h-3 text-brand-gold-600 dark:text-brand-gold-400" />
              <span>{verifiedPhone}</span>
            </a>

            <span className="hidden sm:inline text-slate-300 dark:text-white/20">|</span>

            <a 
              href={`https://wa.me/${cleanWhatsappNumber}?text=Hello%206%20Stars%20Hospitality,%20I%20would%20like%20to%20inquire%20about%20your%20Centaurus%20apartments.`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:opacity-80 font-semibold transition-opacity"
            >
              <MessageSquare className="w-3 h-3" />
              <span className="tracking-wider uppercase text-[10px]">WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Responsive Header */}
      <nav 
        className={`w-full transition-all duration-300 px-4 sm:px-8 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-brand-navy-950/95 backdrop-blur-md shadow-md border-b border-[#E5DFD5] dark:border-brand-gold-500/20 py-2.5' 
            : 'bg-[#FAF8F5]/92 dark:bg-brand-navy-900/85 backdrop-blur-md border-b border-[#EAE5DC] dark:border-white/5 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Elegant Hospitality Logo Area */}
          <Link 
            to="/" 
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-3 group shrink-0" 
            aria-label="6 STARS HOSPITALITY Home"
          >
            <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-xl overflow-hidden bg-[#FAF6EE] p-0.5 border border-brand-gold-500/50 shadow-md group-hover:border-brand-gold-500 transition-all shrink-0 flex items-center justify-center">
              <img 
                src={logoUrl} 
                alt="6 STARS HOSPITALITY Official Logo" 
                className="w-full h-full object-contain"
                width={52}
                height={52}
                loading="eager"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-heading font-extrabold text-base sm:text-lg tracking-wider text-brand-navy-950 dark:text-white group-hover:text-brand-gold-600 dark:group-hover:text-brand-gold-300 transition-colors">
                  6 STARS
                </span>
                <span className="hidden sm:inline font-heading font-light text-base sm:text-lg tracking-widest text-brand-gold-600 dark:text-brand-gold-400">
                  HOSPITALITY
                </span>
              </div>
              <p className="hidden sm:block text-[9px] uppercase font-semibold tracking-[0.22em] text-slate-500 dark:text-slate-400">
                The Centaurus • Islamabad
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Home, About, Services, Properties, Gallery, Contact */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === '/' ? activeSection === item.target : false;

              return (
                <a
                  key={item.target}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.target)}
                  className={`px-3.5 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all relative cursor-pointer ${
                    active
                      ? 'text-brand-gold-600 dark:text-brand-gold-400 font-bold bg-brand-gold-500/10'
                      : 'text-brand-navy-900 hover:text-brand-gold-600 dark:text-slate-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-brand-gold-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Actions: Theme Toggle & Clear Booking/Inquiry Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Clear Booking or Inquiry Button */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider bg-luxury-gold-gradient text-brand-navy-950 shadow-md hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book / Inquire</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-brand-navy-900 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 border border-[#E2DDD5] dark:border-white/10 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-brand-gold-500" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Luxury Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-x-0 top-[92px] bottom-0 bg-[#FAF8F5]/98 dark:bg-brand-navy-950/98 backdrop-blur-2xl border-t border-[#E5DFD5] dark:border-brand-gold-500/20 p-6 flex flex-col justify-between overflow-y-auto z-50 shadow-2xl"
          >
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between px-2 mb-3">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-brand-gold-600 dark:text-brand-gold-400">
                  Navigation
                </span>
                <ThemeToggle showLabel />
              </div>

              {navItems.map((item) => {
                const active = location.pathname === '/' ? activeSection === item.target : false;

                return (
                  <a
                    key={item.target}
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item.target)}
                    className={`block px-4 py-3 rounded-xl font-heading text-sm tracking-wide transition-all cursor-pointer ${
                      active
                        ? 'bg-brand-gold-500/15 text-brand-gold-600 dark:text-brand-gold-400 font-bold border border-brand-gold-500/30'
                        : 'text-brand-navy-900 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}

              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="flex items-center justify-between p-3.5 rounded-xl font-heading font-bold text-xs tracking-wider uppercase text-brand-navy-950 bg-luxury-gold-gradient shadow-md mt-4 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" />
                  <span>Reserve / Inquire Suite</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Bottom Contact in Mobile Menu */}
            <div className="pt-6 mt-6 border-t border-[#E5DFD5] dark:border-white/10 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 text-brand-gold-600 dark:text-brand-gold-400 font-medium">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>The Centaurus, Jinnah Avenue, Islamabad</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <a 
                  href={`tel:${verifiedPhone.replace(/\s+/g, '')}`} 
                  className="flex items-center gap-2 font-semibold text-brand-navy-950 dark:text-white"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-gold-600 dark:text-brand-gold-400" />
                  <span>{verifiedPhone}</span>
                </a>

                <a 
                  href={`https://wa.me/${cleanWhatsappNumber}?text=Hello%206%20Stars%20Hospitality`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

