// src/pages/admin/AdminSettingsPage.tsx - Global Site Settings & Multi-Location Showrooms
import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { SiteSettings, Showroom } from '../../types';
import { Save, Plus, Trash2, Share2, Search } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, addToast } = useSite();
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await updateSettings(formData);
    if (ok) {
      addToast('Site settings updated successfully');
    }
    setSubmitting(false);
  };

  const handleShowroomChange = (index: number, field: keyof Showroom, val: string) => {
    const updated = [...formData.showrooms];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, showrooms: updated });
  };

  const addShowroom = () => {
    const newRoom: Showroom = {
      name: 'New Showroom / Office',
      tag: 'Branch Office',
      address: 'The Centaurus, Islamabad, Pakistan',
      phone: '+92 312 0893146',
      email: 'info@6starapartments.com',
      hours: 'Mon - Sun: 09:00 AM - 09:00 PM',
      map_url: 'https://maps.google.com'
    };
    setFormData({ ...formData, showrooms: [...formData.showrooms, newRoom] });
  };

  const removeShowroom = (index: number) => {
    setFormData({
      ...formData,
      showrooms: formData.showrooms.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white">
          Dynamic Site Settings & Showrooms
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400">
          Configure contact hotlines, WhatsApp numbers, showroom addresses, and quotation client policies.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Brand & Contact */}
        <div className="bg-card dark:bg-charcoal-900 rounded-3xl p-6 sm:p-8 border border-border dark:border-charcoal-800 shadow-sm space-y-4">
          <h2 className="font-heading font-bold text-lg text-card-foreground dark:text-white mb-2">
            Brand Identity & Global Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Brand Name</label>
              <input
                type="text"
                value={formData.brand_name || formData.site_name || ''}
                onChange={(e) => setFormData({ ...formData, brand_name: e.target.value, site_name: e.target.value })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Property Name</label>
              <input
                type="text"
                value={formData.property_name || ''}
                onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Primary Hotline (+92 312 0893146)</label>
              <input
                type="text"
                value={formData.phone_primary}
                onChange={(e) => setFormData({ ...formData, phone_primary: e.target.value })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Secondary Hotline</label>
              <input
                type="text"
                value={formData.phone_secondary}
                onChange={(e) => setFormData({ ...formData, phone_secondary: e.target.value })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Concierge Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1 text-xs">Quotation Client Notice & Inclusions</label>
            <textarea
              rows={3}
              value={formData.quote_notice}
              onChange={(e) => setFormData({ ...formData, quote_notice: e.target.value })}
              className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-xs text-foreground dark:text-white resize-none"
            />
          </div>
        </div>

        {/* Social Media & Channels */}
        <div className="bg-card dark:bg-charcoal-900 rounded-3xl p-6 sm:p-8 border border-border dark:border-charcoal-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="w-5 h-5 text-brand-gold-500" />
            <h2 className="font-heading font-bold text-lg text-card-foreground dark:text-white">
              Social Media & Public Channels
            </h2>
          </div>
          <p className="text-xs text-muted-foreground dark:text-slate-400">
            Configure direct links for footer and contact touchpoints across all guest channels.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Facebook URL</label>
              <input
                type="url"
                placeholder="https://facebook.com/..."
                value={formData.social_links?.facebook || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, facebook: e.target.value }
                })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Instagram URL</label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                value={formData.social_links?.instagram || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, instagram: e.target.value }
                })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">WhatsApp Direct Link</label>
              <input
                type="text"
                placeholder="https://wa.me/923120893146"
                value={formData.social_links?.whatsapp || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, whatsapp: e.target.value }
                })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">TikTok Profile URL</label>
              <input
                type="url"
                placeholder="https://tiktok.com/@..."
                value={formData.social_links?.tiktok || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, tiktok: e.target.value }
                })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">LinkedIn Corporate Page</label>
              <input
                type="url"
                placeholder="https://linkedin.com/company/..."
                value={formData.social_links?.linkedin || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, linkedin: e.target.value }
                })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* SEO & Search Metadata */}
        <div className="bg-card dark:bg-charcoal-900 rounded-3xl p-6 sm:p-8 border border-border dark:border-charcoal-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5 text-brand-gold-500" />
            <h2 className="font-heading font-bold text-lg text-card-foreground dark:text-white">
              SEO & Search Metadata
            </h2>
          </div>
          <p className="text-xs text-muted-foreground dark:text-slate-400">
            Define canonical meta titles, descriptions, and search indexing keywords for Google and search engine rankings.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Default Meta Title</label>
              <input
                type="text"
                value={formData.seo_settings?.meta_title || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  seo_settings: { ...formData.seo_settings, meta_title: e.target.value }
                })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>

            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Meta Description (150-160 characters recommended)</label>
              <textarea
                rows={2}
                value={formData.seo_settings?.meta_description || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  seo_settings: { ...formData.seo_settings, meta_description: e.target.value }
                })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-muted-foreground dark:text-slate-300 font-semibold mb-1">Search Keywords (comma-separated)</label>
              <input
                type="text"
                value={formData.seo_settings?.keywords || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  seo_settings: { ...formData.seo_settings, keywords: e.target.value }
                })}
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Multi-Location Showrooms */}
        <div className="bg-card dark:bg-charcoal-900 rounded-3xl p-6 sm:p-8 border border-border dark:border-charcoal-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-lg text-card-foreground dark:text-white">
                Showrooms & Physical Viewing Offices
              </h2>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Manage multiple location addresses shown across the public site.</p>
            </div>

            <button
              type="button"
              onClick={addShowroom}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted dark:bg-charcoal-800 hover:bg-muted/80 text-brand-gold-600 dark:text-gold-400 text-xs font-semibold border border-border dark:border-charcoal-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Showroom</span>
            </button>
          </div>

          <div className="space-y-5">
            {formData.showrooms.map((room, idx) => (
              <div key={idx} className="bg-muted/30 dark:bg-charcoal-950 p-5 rounded-2xl border border-border dark:border-charcoal-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-border dark:border-charcoal-800 pb-2">
                  <span className="font-bold text-brand-gold-600 dark:text-gold-400">Showroom #{idx + 1}</span>
                  {formData.showrooms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeShowroom(idx)}
                      className="text-red-500 hover:text-red-400 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground dark:text-slate-400 mb-1">Showroom / Suite Name</label>
                    <input
                      type="text"
                      value={room.name}
                      onChange={(e) => handleShowroomChange(idx, 'name', e.target.value)}
                      className="w-full bg-background dark:bg-charcoal-900 border border-input dark:border-charcoal-700 rounded-lg px-3 py-1.5 text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground dark:text-slate-400 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={room.tag}
                      onChange={(e) => handleShowroomChange(idx, 'tag', e.target.value)}
                      className="w-full bg-background dark:bg-charcoal-900 border border-input dark:border-charcoal-700 rounded-lg px-3 py-1.5 text-foreground dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-muted-foreground dark:text-slate-400 mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={room.address}
                      onChange={(e) => handleShowroomChange(idx, 'address', e.target.value)}
                      className="w-full bg-background dark:bg-charcoal-900 border border-input dark:border-charcoal-700 rounded-lg px-3 py-1.5 text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground dark:text-slate-400 mb-1">Phone</label>
                    <input
                      type="text"
                      value={room.phone}
                      onChange={(e) => handleShowroomChange(idx, 'phone', e.target.value)}
                      className="w-full bg-background dark:bg-charcoal-900 border border-input dark:border-charcoal-700 rounded-lg px-3 py-1.5 text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground dark:text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={room.email}
                      onChange={(e) => handleShowroomChange(idx, 'email', e.target.value)}
                      className="w-full bg-background dark:bg-charcoal-900 border border-input dark:border-charcoal-700 rounded-lg px-3 py-1.5 text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground dark:text-slate-400 mb-1">Visiting Hours</label>
                    <input
                      type="text"
                      value={room.hours}
                      onChange={(e) => handleShowroomChange(idx, 'hours', e.target.value)}
                      className="w-full bg-background dark:bg-charcoal-900 border border-input dark:border-charcoal-700 rounded-lg px-3 py-1.5 text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-muted-foreground dark:text-slate-400 mb-1">Map Navigation Link</label>
                    <input
                      type="text"
                      value={room.map_url}
                      onChange={(e) => handleShowroomChange(idx, 'map_url', e.target.value)}
                      className="w-full bg-background dark:bg-charcoal-900 border border-input dark:border-charcoal-700 rounded-lg px-3 py-1.5 text-foreground dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-sm shadow-md hover:brightness-110 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
