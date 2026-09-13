// src/components/home/GallerySection.tsx - 6 STARS HOSPITALITY Curated 20-Image Interactive Gallery
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Filter, 
  Grid, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { ALL_PROJECT_IMAGES, ProjectImageItem, getSafeImageUrl } from '../../services/imageManifest';
import { OptimizedImage } from '../common/OptimizedImage';

type CategoryFilter = 'all' | 'margalla-1bed' | 'centaurus-2bed' | '3bed' | '2plus-study' | '1plus-study' | 'studio' | 'brand';

const GALLERY_IMAGES = ALL_PROJECT_IMAGES.filter(image => image.id !== 'hero-centaurus').slice(0, 20);

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(20);

  const categories: { key: CategoryFilter; label: string; count: number }[] = useMemo(() => {
    const allCategories: { key: CategoryFilter; label: string; count: number }[] = [
      { key: 'all', label: 'All Photos', count: GALLERY_IMAGES.length },
      { key: 'margalla-1bed', label: 'Margalla Facing 1-Bed', count: GALLERY_IMAGES.filter(i => i.category === 'margalla-1bed').length },
      { key: 'centaurus-2bed', label: 'Centaurus 2-Bedroom', count: GALLERY_IMAGES.filter(i => i.category === 'centaurus-2bed').length },
      { key: '3bed', label: '3-Bedroom Suites', count: GALLERY_IMAGES.filter(i => i.category === '3bed').length },
      { key: '2plus-study', label: '2+Study Residences', count: GALLERY_IMAGES.filter(i => i.category === '2plus-study').length },
      { key: '1plus-study', label: '1+Study Apartments', count: GALLERY_IMAGES.filter(i => i.category === '1plus-study').length },
      { key: 'studio', label: 'Studio Suites', count: GALLERY_IMAGES.filter(i => i.category === 'studio').length },
      { key: 'brand', label: 'Brand & Accents', count: GALLERY_IMAGES.filter(i => i.category === 'brand').length },
    ];
    return allCategories.filter(category => category.count > 0);
  }, []);

  // Filtered dataset
  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return GALLERY_IMAGES;
    return GALLERY_IMAGES.filter(img => img.category === activeCategory);
  }, [activeCategory]);

  // Images to show based on visibleCount
  const visibleImages = useMemo(() => {
    return filteredImages.slice(0, visibleCount);
  }, [filteredImages, visibleCount]);

  // Handle category change
  const handleCategoryChange = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setVisibleCount(20);
  };

  // Lightbox Navigation
  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! + 1) % filteredImages.length);
  }, [selectedImageIndex, filteredImages.length]);

  const prevImage = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
  }, [selectedImageIndex, filteredImages.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, nextImage, prevImage]);

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImageIndex]);

  const activeModalImage: ProjectImageItem | null = 
    selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

  return (
    <section id="gallery" className="py-20 lg:py-28 px-4 sm:px-8 bg-[#FAF8F5] dark:bg-brand-navy-950/70 border-b border-[#EAE5DC] dark:border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/30 text-brand-gold-600 dark:text-brand-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Visual Gallery</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy-950 dark:text-white leading-tight">
            Explore 20 Curated Residence Perspectives
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-4 font-normal leading-relaxed">
            Browse a curated selection of bedrooms, luxury living lounges, designer kitchens, and Margalla mountain views. Click any image for high-resolution preview.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-luxury-gold-gradient text-brand-navy-950 shadow-md font-bold'
                    : 'bg-white dark:bg-brand-navy-900 text-slate-700 dark:text-slate-300 border border-[#E5DFD5] dark:border-white/10 hover:border-brand-gold-500/50 hover:bg-slate-50 dark:hover:bg-brand-navy-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-brand-navy-950/20 text-brand-navy-950' : 'bg-slate-200/80 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Responsive Image Grid (2 cols mobile, 3 cols tablet, 4 cols desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {visibleImages.map((img, index) => {
            const safeUrl = getSafeImageUrl(img.relativePath);
            const isLandscape = img.isLandscape;

            return (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: (index % 12) * 0.03 }}
                onClick={() => openLightbox(index)}
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-brand-navy-900 border border-[#E7E1D6] dark:border-white/10 shadow-sm hover:shadow-xl hover:border-brand-gold-500/50 transition-all cursor-pointer aspect-[4/3]"
              >
                <OptimizedImage
                  src={safeUrl}
                  alt={img.alt}
                  aspectRatio="4/3"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={img.width}
                  height={img.height}
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-brand-navy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 sm:p-4 pointer-events-none">
                  <div className="flex justify-end">
                    <span className="p-1.5 rounded-lg bg-brand-navy-950/80 text-brand-gold-400 border border-brand-gold-500/40 shadow-sm">
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold-300 block">
                      {img.categoryLabel}
                    </span>
                    <p className="text-[11px] sm:text-xs font-semibold text-white truncate">
                      {img.title}
                    </p>
                    <span className="text-[9px] text-slate-300">
                      {img.width} × {img.height}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More Button if remaining */}
        {visibleCount < filteredImages.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredImages.length))}
              className="px-8 py-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-white dark:bg-brand-navy-900 text-brand-navy-950 dark:text-white border border-[#E0D9CD] dark:border-brand-gold-500/30 hover:border-brand-gold-500 hover:bg-brand-gold-500/10 transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
            >
              <Grid className="w-4 h-4 text-brand-gold-500" />
              <span>
                Load More Photos ({visibleCount} of {filteredImages.length} Shown)
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal (Enlarged Sharp Preview) */}
      <AnimatePresence>
        {activeModalImage && selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 select-none"
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged Suite Preview"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-bold tracking-widest text-brand-gold-400 bg-brand-gold-500/15 px-3 py-1 rounded-lg border border-brand-gold-500/30">
                  {activeModalImage.categoryLabel}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {selectedImageIndex + 1} of {filteredImages.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-slate-400">
                  {activeModalImage.width} × {activeModalImage.height} px
                </span>
                <button
                  onClick={closeLightbox}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central Stage (Natural Aspect Ratio, Crisp Sharpness, object-contain) */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-brand-navy-950/70 border border-white/20 text-white hover:bg-brand-gold-500 hover:text-brand-navy-950 transition-colors shadow-2xl cursor-pointer"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <motion.div
                key={activeModalImage.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="max-w-5xl max-h-[75vh] sm:max-h-[80vh] w-full h-full flex items-center justify-center p-2"
              >
                <img
                  src={getSafeImageUrl(activeModalImage.relativePath)}
                  alt={activeModalImage.alt}
                  width={activeModalImage.width}
                  height={activeModalImage.height}
                  loading="eager"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all"
                />
              </motion.div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-brand-navy-950/70 border border-white/20 text-white hover:bg-brand-gold-500 hover:text-brand-navy-950 transition-colors shadow-2xl cursor-pointer"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="text-center z-10">
              <h4 className="text-sm sm:text-base font-heading font-bold text-white mb-0.5">
                {activeModalImage.title}
              </h4>
              <p className="text-xs text-slate-300 max-w-xl mx-auto truncate">
                {activeModalImage.alt}
              </p>
              <div className="text-[10px] text-slate-400 mt-1">
                Use Left / Right arrow keys to navigate • Esc to exit
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
