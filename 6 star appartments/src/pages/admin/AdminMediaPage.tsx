// src/pages/admin/AdminMediaPage.tsx - Media Asset Library with Pagination & Theme Support
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MediaItem } from '../../types';
import { useSite } from '../../context/SiteContext';
import { resolveSafeImagePath } from '../../components/common/OptimizedImage';
import { 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Trash2, 
  Copy, 
  X, 
  Maximize2, 
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const { addToast } = useSite();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Upload Form
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<MediaItem['category']>('Apartments');
  const [newDimensions, setNewDimensions] = useState('1600 × 1200');
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchMedia = async () => {
    setLoading(true);
    const data = await api.getMediaItems();
    setMediaItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    addToast('Media asset URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      addToast('Please provide an asset title and image URL', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.saveMediaItem({
        title: newTitle,
        url: newUrl,
        category: newCategory,
        dimensions: newDimensions,
        size_kb: 140
      });

      if (res.success) {
        addToast('Asset registered in Media Library');
        setUploadModalOpen(false);
        setNewTitle('');
        setNewUrl('');
        fetchMedia();
      } else {
        addToast(res.error || 'Failed to save media', 'error');
      }
    } catch {
      addToast('An error occurred while uploading media', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (window.confirm('Delete this media asset?')) {
      const res = await api.deleteMediaItem(id);
      if (res.success) {
        addToast('Media asset removed');
        if (previewItem?.id === id) setPreviewItem(null);
        fetchMedia();
      } else {
        addToast('Failed to delete media asset', 'error');
      }
    }
  };

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredMedia.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMedia = filteredMedia.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const categories = ['All', 'Apartments', 'Suites', 'Showrooms', 'Offices', 'Articles', 'General'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white">
            Media Library
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400 mt-1">
            Organize high-resolution photography for residences, penthouses, commercial concourse showrooms, and articles.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by title or keyword..."
            className="w-full bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 rounded-xl pl-10 pr-4 py-2 text-xs text-foreground dark:text-white placeholder-muted-foreground focus:outline-none focus:border-brand-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-gold-500 text-charcoal-950 font-bold shadow-sm'
                  : 'bg-card dark:bg-charcoal-900 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white border border-border dark:border-charcoal-800'
              }`}
            >
              {cat === 'All' ? `All Media (${mediaItems.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="py-20 text-center text-muted-foreground dark:text-slate-400">Loading media library...</div>
      ) : mediaItems.length === 0 ? (
        <div className="bg-card dark:bg-charcoal-900 rounded-3xl p-14 text-center border border-border dark:border-charcoal-800 shadow-sm">
          <ImageIcon className="w-12 h-12 text-brand-gold-500 mx-auto mb-3 opacity-60" />
          <h3 className="font-heading font-bold text-lg text-card-foreground dark:text-white">[No media assets available]</h3>
          <p className="text-xs text-muted-foreground mt-1">Click "Add Media Asset" above to catalog photos and layout specs.</p>
        </div>
      ) : paginatedMedia.length === 0 ? (
        <div className="bg-card dark:bg-charcoal-900 rounded-3xl p-12 text-center border border-border dark:border-charcoal-800">
          <p className="text-xs text-muted-foreground">No media assets match your search filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedMedia.map((item) => (
              <div
                key={item.id}
                className="bg-card dark:bg-charcoal-900/90 rounded-2xl overflow-hidden border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all shadow-sm flex flex-col group"
              >
                <div 
                  onClick={() => setPreviewItem(item)}
                  className="relative aspect-[16/11] overflow-hidden bg-muted dark:bg-charcoal-950 cursor-pointer"
                >
                  <img
                    src={resolveSafeImagePath(item.url)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width={1280}
                    height={880}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-brand-gold-400" />
                      <span>Preview</span>
                    </span>
                  </div>

                  <div className="absolute top-2.5 left-2.5 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-brand-gold-300 border border-brand-gold-500/30">
                    {item.category}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 px-2 py-0.5 rounded text-[10px] text-slate-300 border border-white/10">
                    {item.size_kb} KB
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-xs text-card-foreground dark:text-white line-clamp-1 mb-1" title={item.title}>
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground truncate" title={item.url}>
                      {item.url}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-border dark:border-charcoal-800 flex items-center justify-between">
                    <button
                      onClick={() => handleCopyUrl(item)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-brand-gold-500 transition-colors"
                      title="Copy path to clipboard"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-brand-gold-500" />
                          <span>Copy Path</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                      title="Delete Media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Bar (12 per page) */}
          {filteredMedia.length > itemsPerPage && (
            <div className="p-4 bg-card dark:bg-charcoal-900 rounded-2xl border border-border dark:border-charcoal-800 flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400">
              <div>
                Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredMedia.length)} of {filteredMedia.length} assets
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg bg-muted dark:bg-charcoal-950 text-card-foreground dark:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-border dark:border-charcoal-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-semibold text-card-foreground dark:text-white">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-1.5 rounded-lg bg-muted dark:bg-charcoal-950 text-card-foreground dark:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-border dark:border-charcoal-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card dark:bg-charcoal-900 rounded-3xl border border-brand-gold-500/40 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border dark:border-charcoal-800 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-card-foreground dark:text-white">
                Register Media Asset
              </h3>
              <button onClick={() => setUploadModalOpen(false)} className="p-1.5 text-muted-foreground hover:text-card-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Margalla View Living Room Suite"
                  className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Relative Image Path / URL *</label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="./images/Centaurus two bedrooms apartment/..."
                  className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                  >
                    <option value="Apartments">Apartments</option>
                    <option value="Suites">Suites</option>
                    <option value="Showrooms">Showrooms</option>
                    <option value="Offices">Offices</option>
                    <option value="Articles">Articles</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border dark:border-charcoal-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-card-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold shadow-md hover:brightness-110"
                >
                  {submitting ? 'Registering...' : 'Save Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Size Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
          <div className="relative max-w-4xl w-full bg-card dark:bg-charcoal-900 rounded-3xl overflow-hidden border border-brand-gold-500/40 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-[16/10] bg-black">
              <img
                src={resolveSafeImagePath(previewItem.url)}
                alt={previewItem.title}
                className="w-full h-full object-contain"
                width={1600}
                height={1200}
              />
            </div>
            <div className="p-5 flex items-center justify-between border-t border-border dark:border-charcoal-800">
              <div>
                <h3 className="font-heading font-bold text-base text-card-foreground dark:text-white">{previewItem.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{previewItem.url} • {previewItem.dimensions}</p>
              </div>
              <button
                onClick={() => handleCopyUrl(previewItem)}
                className="px-4 py-2 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-xs"
              >
                Copy Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
