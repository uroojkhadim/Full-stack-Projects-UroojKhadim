// src/pages/admin/AdminShowroomsPage.tsx - Commercial Spaces Management with Pagination & Theme Support
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CommercialSpace } from '../../types';
import { useSite } from '../../context/SiteContext';
import { resolveSafeImagePath } from '../../components/common/OptimizedImage';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Maximize2, 
  MapPin, 
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminShowroomsPage: React.FC = () => {
  const { addToast } = useSite();
  const [spaces, setSpaces] = useState<CommercialSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<CommercialSpace | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [spaceType, setSpaceType] = useState<CommercialSpace['space_type']>('Executive Office');
  const [areaSqft, setAreaSqft] = useState(1500);
  const [floorLocation, setFloorLocation] = useState('14th Floor, Centaurus Corporate Tower');
  const [suitableForStr, setSuitableForStr] = useState('Corporate Headquarters, Diplomatic Missions');
  const [description, setDescription] = useState('');
  const [featuresStr, setFeaturesStr] = useState('100% Uninterrupted Power, High Speed Fiber, 24/7 Security');
  const [pricingType, setPricingType] = useState<CommercialSpace['pricing_type']>('Monthly Rental');
  const [priceEstimate, setPriceEstimate] = useState('Rs. 350,000 / month');
  const [imageUrl, setImageUrl] = useState('./images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg');
  const [status, setStatus] = useState<CommercialSpace['status']>('Available');
  const [submitting, setSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSpaces = async () => {
    setLoading(true);
    const data = await api.getCommercialSpaces();
    setSpaces(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const openCreateModal = () => {
    setEditingSpace(null);
    setTitle('');
    setSpaceType('Executive Office');
    setAreaSqft(1500);
    setFloorLocation('14th Floor, Centaurus Corporate Tower A');
    setSuitableForStr('Multinational Firm, Technology Center, Diplomatic Office');
    setDescription('Grade-A corporate office suite at The Centaurus featuring executive boardroom, private suites, and fiber internet backbone.');
    setFeaturesStr('100% Power Redundancy, Reserved Underground Parking, Keycard Elevators, 24/7 CCTV');
    setPricingType('Monthly Rental');
    setPriceEstimate('Rs. 400,000 / month');
    setImageUrl('./images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM.jpeg');
    setStatus('Available');
    setModalOpen(true);
  };

  const openEditModal = (space: CommercialSpace) => {
    setEditingSpace(space);
    setTitle(space.title);
    setSpaceType(space.space_type);
    setAreaSqft(space.area_sqft);
    setFloorLocation(space.floor_location);
    setSuitableForStr(space.suitable_for.join(', '));
    setDescription(space.description);
    setFeaturesStr(space.features.join(', '));
    setPricingType(space.pricing_type);
    setPriceEstimate(space.price_estimate || '');
    setImageUrl(space.images && space.images.length > 0 ? space.images[0] : './images/background image.jpeg');
    setStatus(space.status);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Please provide a property title', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<CommercialSpace> = {
        title,
        space_type: spaceType,
        area_sqft: Number(areaSqft),
        floor_location: floorLocation,
        suitable_for: suitableForStr.split(',').map(s => s.trim()).filter(Boolean),
        description,
        features: featuresStr.split(',').map(s => s.trim()).filter(Boolean),
        pricing_type: pricingType,
        price_estimate: priceEstimate,
        images: [imageUrl],
        status
      };

      let res;
      if (editingSpace) {
        res = await api.saveCommercialSpace({ ...payload, id: editingSpace.id });
      } else {
        res = await api.saveCommercialSpace(payload);
      }

      if (res.success) {
        addToast(editingSpace ? 'Commercial space updated' : 'Commercial space created');
        setModalOpen(false);
        fetchSpaces();
      } else {
        addToast(res.error || 'Failed to save space', 'error');
      }
    } catch {
      addToast('An error occurred while saving', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this commercial listing?')) {
      const res = await api.deleteCommercialSpace(id);
      if (res.success) {
        addToast('Commercial property removed');
        fetchSpaces();
      } else {
        addToast(res.error || 'Failed to delete', 'error');
      }
    }
  };

  const filteredSpaces = spaces.filter((s) => {
    if (filterType !== 'All' && s.space_type !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.floor_location.toLowerCase().includes(q) ||
        s.suitable_for.some(sf => sf.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSpaces.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSpaces = filteredSpaces.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white">
            Commercial Showrooms & Executive Offices
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400 mt-1">
            Manage prime Centaurus mall retail showrooms and corporate office floor listings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-xs shadow-md hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Commercial Space</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card dark:bg-charcoal-900 p-4 rounded-3xl border border-border dark:border-charcoal-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-muted-foreground dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search commercial spaces by name, floor, or suitable purpose..."
            className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl pl-10 pr-4 py-2 text-xs text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:border-brand-gold-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['All', 'Showroom', 'Executive Office', 'Corporate Suite'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === t
                  ? 'bg-brand-gold-500 text-charcoal-950 font-bold shadow-sm'
                  : 'bg-muted/40 dark:bg-charcoal-950 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table Container */}
      <div className="bg-card dark:bg-charcoal-900 rounded-3xl border border-border dark:border-charcoal-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 dark:bg-charcoal-950 text-muted-foreground dark:text-slate-400 border-b border-border dark:border-charcoal-800">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Type</th>
                <th className="p-4">Floor Location</th>
                <th className="p-4">Area (Sq Ft)</th>
                <th className="p-4">Rate / Pricing</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-charcoal-800/60 text-muted-foreground dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">Loading commercial spaces...</td>
                </tr>
              ) : spaces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-14 text-center">
                    <Briefcase className="w-10 h-10 text-brand-gold-500 mx-auto mb-3 opacity-60" />
                    <p className="text-base font-semibold text-card-foreground dark:text-white">[No showroom or office information available]</p>
                    <p className="text-xs text-muted-foreground mt-1">Click "Add Commercial Space" above to publish a retail or corporate unit.</p>
                  </td>
                </tr>
              ) : paginatedSpaces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No matching commercial spaces found for your filter.
                  </td>
                </tr>
              ) : (
                paginatedSpaces.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/40 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveSafeImagePath(s.images && s.images.length > 0 ? s.images[0] : './images/background image.jpeg')}
                          alt=""
                          className="w-12 h-10 object-cover rounded-lg shrink-0 border border-border/40"
                          width={120}
                          height={100}
                        />
                        <div>
                          <div className="font-heading font-bold text-card-foreground dark:text-white text-sm">{s.title}</div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-[200px]">{s.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-gold-500/10 text-brand-gold-600 dark:text-brand-gold-400 border border-brand-gold-500/20">
                        {s.space_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-card-foreground dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-brand-gold-500" />
                        <span>{s.floor_location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-medium text-card-foreground dark:text-slate-200">
                        <Maximize2 className="w-3 h-3 text-brand-gold-500" />
                        <span>{s.area_sqft.toLocaleString()} sq ft</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-card-foreground dark:text-white">
                      {s.price_estimate || s.pricing_type}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        s.status === 'Available'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded bg-muted dark:bg-charcoal-800 text-muted-foreground hover:text-brand-gold-500 transition-colors"
                          title="Edit Space"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 rounded bg-muted dark:bg-charcoal-800 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Delete Space"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (10 per page) */}
        {filteredSpaces.length > itemsPerPage && (
          <div className="p-4 border-t border-border dark:border-charcoal-800 flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400">
            <div>
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredSpaces.length)} of {filteredSpaces.length} commercial properties
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card dark:bg-charcoal-900 rounded-3xl border border-brand-gold-500/40 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border dark:border-charcoal-800 pb-3">
              <h3 className="font-heading font-extrabold text-xl text-card-foreground dark:text-white">
                {editingSpace ? 'Edit Commercial Space' : 'New Commercial Listing'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-muted-foreground hover:text-card-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Centaurus Concourse Retail Flagship"
                    className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Space Type</label>
                  <select
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value as any)}
                    className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                  >
                    <option value="Showroom">Showroom</option>
                    <option value="Executive Office">Executive Office</option>
                    <option value="Corporate Suite">Corporate Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Area (sq ft)</label>
                  <input
                    type="number"
                    value={areaSqft}
                    onChange={(e) => setAreaSqft(Number(e.target.value))}
                    className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Floor Location</label>
                  <input
                    type="text"
                    value={floorLocation}
                    onChange={(e) => setFloorLocation(e.target.value)}
                    className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Leased">Leased</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Rate / Estimate</label>
                <input
                  type="text"
                  value={priceEstimate}
                  onChange={(e) => setPriceEstimate(e.target.value)}
                  placeholder="e.g. Rs. 450,000 / month"
                  className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Suitable For (comma-separated)</label>
                <input
                  type="text"
                  value={suitableForStr}
                  onChange={(e) => setSuitableForStr(e.target.value)}
                  placeholder="e.g. Retail Brands, Corporate Offices, Diplomatic Missions"
                  className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Features / Inclusions (comma-separated)</label>
                <input
                  type="text"
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  placeholder="e.g. 100% Dual Power, Keycard Elevators, 24/7 Security"
                  className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="./images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM.jpeg"
                  className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border dark:border-charcoal-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-card-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold shadow-md hover:brightness-110"
                >
                  {submitting ? 'Saving...' : 'Save Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
