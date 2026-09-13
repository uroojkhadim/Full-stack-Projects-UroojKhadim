// src/pages/admin/AdminApartmentsPage.tsx - Residence Catalog Management with Pagination & Theme Support
import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext';
import { api } from '../../services/api';
import { Apartment } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { resolveSafeImagePath } from '../../components/common/OptimizedImage';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Building2, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminApartmentsPage: React.FC = () => {
  const { apartments, categories, refreshData, addToast } = useSite();

  const [editingApartment, setEditingApartment] = useState<Partial<Apartment> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(apartments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApartments = apartments.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAdd = () => {
    setEditingApartment({
      category_id: categories[0]?.id || 1,
      title: '',
      description: '',
      price: 25000,
      price_type: 'night',
      area_sqft: 850,
      bedrooms: 1,
      bathrooms: 1,
      view_type: 'Margalla Hills View',
      floor: '18th Floor',
      status: 'available',
      is_featured: 1,
      amenities: ['High Speed Fiber WiFi', '24/7 Power Backup', 'Centaurus Mall Access', 'Daily Housekeeping'],
      images: ['./images/background image.jpeg']
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (apt: Apartment) => {
    setEditingApartment({ ...apt });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApartment?.title || !editingApartment?.price) {
      addToast('Please enter title and price', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.saveProduct(editingApartment);
      if (res.success) {
        addToast(editingApartment.id ? 'Residence updated successfully' : 'New residence added');
        setModalOpen(false);
        setEditingApartment(null);
        await refreshData();
      } else {
        addToast(res.error || 'Failed to save residence', 'error');
      }
    } catch {
      addToast('An error occurred while saving residence', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this residence permanently?')) {
      const res = await api.deleteProduct(id);
      if (res.success) {
        addToast('Residence deleted successfully');
        await refreshData();
      } else {
        addToast('Failed to delete residence', 'error');
      }
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && editingApartment) {
      const current = editingApartment.amenities || [];
      setEditingApartment({
        ...editingApartment,
        amenities: [...current, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    if (editingApartment) {
      const current = editingApartment.amenities || [];
      setEditingApartment({
        ...editingApartment,
        amenities: current.filter((_, i) => i !== index)
      });
    }
  };

  const addImage = () => {
    if (newImageUrl.trim() && editingApartment) {
      const current = editingApartment.images || [];
      setEditingApartment({
        ...editingApartment,
        images: [...current, newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    if (editingApartment) {
      const current = editingApartment.images || [];
      setEditingApartment({
        ...editingApartment,
        images: current.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white">
            Apartments & Suites Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400">
            Manage apartment categories, pricing, room specifications, and media galleries.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-xs shadow-md hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Residence</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-card dark:bg-charcoal-900 rounded-3xl border border-border dark:border-charcoal-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 dark:bg-charcoal-950 text-muted-foreground dark:text-slate-400 border-b border-border dark:border-charcoal-800">
              <tr>
                <th className="p-4">Residence</th>
                <th className="p-4">Category</th>
                <th className="p-4">Specs</th>
                <th className="p-4">Orientation / Floor</th>
                <th className="p-4">Price (PKR)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-charcoal-800 text-muted-foreground dark:text-slate-300">
              {apartments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-14 text-center">
                    <Building2 className="w-10 h-10 text-brand-gold-500 mx-auto mb-3 opacity-60" />
                    <p className="text-base font-semibold text-card-foreground dark:text-white">[No apartments available]</p>
                    <p className="text-xs text-muted-foreground mt-1">Click "Add New Residence" above to create an apartment listing.</p>
                  </td>
                </tr>
              ) : (
                paginatedApartments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-muted/40 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveSafeImagePath(apt.images[0] || './images/background image.jpeg')}
                          alt=""
                          className="w-12 h-10 object-cover rounded-lg shrink-0 border border-border/40"
                          width={120}
                          height={100}
                        />
                        <div>
                          <div className="font-heading font-bold text-card-foreground dark:text-white text-sm">{apt.title}</div>
                          {Boolean(apt.is_featured) && (
                            <span className="text-[10px] text-brand-gold-600 dark:text-brand-gold-400 font-bold uppercase tracking-wider">
                              ★ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground dark:text-slate-300">{apt.category_name}</td>
                    <td className="p-4">
                      {apt.bedrooms} Bed • {apt.bathrooms} Bath • {apt.area_sqft} sqft
                    </td>
                    <td className="p-4">
                      <p className="text-card-foreground dark:text-white font-medium">{apt.floor}</p>
                      <p className="text-[11px] text-muted-foreground dark:text-slate-400 truncate max-w-[150px]">{apt.view_type}</p>
                    </td>
                    <td className="p-4 font-bold text-brand-gold-600 dark:text-brand-gold-400">
                      {formatCurrency(apt.price)}
                      <span className="text-[10px] text-muted-foreground dark:text-slate-400 block font-normal">/ {apt.price_type}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        apt.status === 'available'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(apt)}
                          className="p-1.5 rounded bg-muted dark:bg-charcoal-800 text-muted-foreground hover:text-brand-gold-500 hover:bg-muted/80 transition-colors"
                          title="Edit Apartment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="p-1.5 rounded bg-muted dark:bg-charcoal-800 text-muted-foreground hover:text-red-500 hover:bg-muted/80 transition-colors"
                          title="Delete Apartment"
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
        {apartments.length > itemsPerPage && (
          <div className="p-4 border-t border-border dark:border-charcoal-800 flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400">
            <div>
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, apartments.length)} of {apartments.length} residences
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

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {modalOpen && editingApartment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-card dark:bg-charcoal-900 border border-brand-gold-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-card-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-heading font-extrabold text-xl text-card-foreground dark:text-white mb-6">
                {editingApartment.id ? 'Edit Residence Specifications' : 'Add New Residence'}
              </h2>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Category & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Category</label>
                    <select
                      value={editingApartment.category_id}
                      onChange={(e) => setEditingApartment({ ...editingApartment, category_id: Number(e.target.value) })}
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={editingApartment.title || ''}
                      onChange={(e) => setEditingApartment({ ...editingApartment, title: e.target.value })}
                      placeholder="e.g. Signature Margalla View Suite"
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    />
                  </div>
                </div>

                {/* Pricing & Area */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={editingApartment.price || 0}
                      onChange={(e) => setEditingApartment({ ...editingApartment, price: Number(e.target.value) })}
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Price Type</label>
                    <select
                      value={editingApartment.price_type}
                      onChange={(e) => setEditingApartment({ ...editingApartment, price_type: e.target.value as any })}
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    >
                      <option value="night">Per Night</option>
                      <option value="month">Per Month</option>
                      <option value="year">Per Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Area (sq ft)</label>
                    <input
                      type="number"
                      value={editingApartment.area_sqft || 0}
                      onChange={(e) => setEditingApartment({ ...editingApartment, area_sqft: Number(e.target.value) })}
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Status</label>
                    <select
                      value={editingApartment.status}
                      onChange={(e) => setEditingApartment({ ...editingApartment, status: e.target.value as any })}
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                {/* Rooms, Floor, Views */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={editingApartment.bedrooms || 1}
                      onChange={(e) => setEditingApartment({ ...editingApartment, bedrooms: Number(e.target.value) })}
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={editingApartment.bathrooms || 1}
                      onChange={(e) => setEditingApartment({ ...editingApartment, bathrooms: Number(e.target.value) })}
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Floor</label>
                    <input
                      type="text"
                      value={editingApartment.floor || ''}
                      onChange={(e) => setEditingApartment({ ...editingApartment, floor: e.target.value })}
                      placeholder="e.g. 18th Floor"
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">View Type</label>
                    <input
                      type="text"
                      value={editingApartment.view_type || ''}
                      onChange={(e) => setEditingApartment({ ...editingApartment, view_type: e.target.value })}
                      placeholder="e.g. Margalla Hills View"
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingApartment.description || ''}
                    onChange={(e) => setEditingApartment({ ...editingApartment, description: e.target.value })}
                    className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white resize-none"
                  />
                </div>

                {/* Amenities List */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Amenities</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingApartment.amenities?.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-muted dark:bg-charcoal-950 text-card-foreground dark:text-slate-300 border border-border dark:border-charcoal-800"
                      >
                        <span>{amenity}</span>
                        <button type="button" onClick={() => removeAmenity(idx)} className="text-red-400 hover:text-red-300">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Add an amenity (e.g. Smart 4K TV)"
                      className="flex-1 bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={addAmenity}
                      className="px-4 py-2 bg-muted hover:bg-muted/80 text-card-foreground rounded-xl text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Images List */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1">Images</label>
                  <div className="flex flex-wrap gap-3 mb-2">
                    {editingApartment.images?.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-16 rounded-lg overflow-hidden border border-border dark:border-charcoal-700 group">
                        <img src={resolveSafeImagePath(img)} alt="" className="w-full h-full object-cover" width={320} height={200} />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Image URL or relative path (e.g. ./images/Centaurus two bedrooms apartment/...)"
                      className="flex-1 bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="px-4 py-2 bg-muted hover:bg-muted/80 text-card-foreground rounded-xl text-xs font-semibold"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={Boolean(editingApartment.is_featured)}
                    onChange={(e) => setEditingApartment({ ...editingApartment, is_featured: e.target.checked ? 1 : 0 })}
                    className="rounded border-input text-brand-gold-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="is_featured" className="text-xs font-semibold text-card-foreground dark:text-white cursor-pointer">
                    Feature on Homepage (Signature Collection)
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-charcoal-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-muted text-card-foreground text-xs font-semibold hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-luxury-gold-gradient text-charcoal-950 text-xs font-bold shadow-md hover:brightness-110"
                  >
                    {submitting ? 'Saving...' : 'Save Residence'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
