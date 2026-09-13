// src/services/api.ts - Unified API Client with Backend & Offline Fallback for 6 STARS HOSPITALITY
import { Apartment, Category, SiteSettings, BlogPost, Quotation, Inquiry, AdminUser, ApiResponse, CommercialSpace, MediaItem, GuestUser } from '../types';
import { INITIAL_SITE_SETTINGS, INITIAL_CATEGORIES, INITIAL_APARTMENTS, INITIAL_BLOGS, INITIAL_QUOTES, INITIAL_INQUIRIES, INITIAL_COMMERCIAL_SPACES, INITIAL_MEDIA_ITEMS } from './mockData';

const API_BASE = './backend/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('6star_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

class LocalStore {
  static get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(`6star_${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  static set<T>(key: string, val: T): void {
    try {
      localStorage.setItem(`6star_${key}`, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }
}

let backendAvailable: boolean | null = null;
async function probeBackend(): Promise<boolean> {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const res = await fetch(`${API_BASE}/site.php`, { method: 'GET' });
    const cType = res.headers.get('content-type') || '';
    if (!res.ok || !cType.includes('application/json')) {
      backendAvailable = false;
      return false;
    }
    const json = await res.json();
    backendAvailable = Boolean(json && json.success !== undefined);
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

export const api = {
  async googleGuestLogin(credential: string): Promise<{ success: boolean; user?: GuestUser; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/google_auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      return await res.json() as { success: boolean; user?: GuestUser; error?: string };
    } catch {
      return { success: false, error: 'Google sign-in is unavailable right now.' };
    }
  },

  // 1. Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    const isLive = await probeBackend();
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/site.php`);
        const json: ApiResponse<SiteSettings> = await res.json();
        if (json.success && json.data) return json.data;
      } catch (e) {
        console.warn('Backend site fetch error, falling back:', e);
      }
    }
    return LocalStore.get('site_settings', INITIAL_SITE_SETTINGS);
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<ApiResponse<void>> {
    const isLive = await probeBackend();
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/site.php`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(settings)
        });
        return await res.json();
      } catch (e) {
        console.warn('Backend update failed, using local store:', e);
      }
    }
    const current = LocalStore.get('site_settings', INITIAL_SITE_SETTINGS);
    const updated = { ...current, ...settings };
    LocalStore.set('site_settings', updated);
    return { success: true, message: 'Settings saved' };
  },

  // 2. Categories
  async getCategories(): Promise<Category[]> {
    const isLive = await probeBackend();
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/categories.php`);
        const json: ApiResponse<Category[]> = await res.json();
        if (json.success && json.data) return json.data;
      } catch (e) {
        console.warn('Backend categories fetch error:', e);
      }
    }
    return LocalStore.get('categories', INITIAL_CATEGORIES);
  },

  // 3. Products / Residential Apartments
  async getProducts(params?: { category_id?: number; search?: string; featured?: boolean }): Promise<Apartment[]> {
    const isLive = await probeBackend();
    if (isLive) {
      try {
        const q = new URLSearchParams();
        if (params?.category_id) q.set('category_id', String(params.category_id));
        if (params?.search) q.set('search', params.search);
        if (params?.featured) q.set('featured', '1');
        const res = await fetch(`${API_BASE}/products.php?${q.toString()}`);
        const json: ApiResponse<Apartment[]> = await res.json();
        if (json.success && json.data) return json.data;
      } catch (e) {
        console.warn('Backend products fetch error:', e);
      }
    }
    let list = LocalStore.get('products', INITIAL_APARTMENTS);
    if (params?.category_id) {
      list = list.filter(p => p.category_id === params.category_id);
    }
    if (params?.featured) {
      list = list.filter(p => !!p.is_featured);
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return list;
  },

  async getProductById(id: number): Promise<Apartment | null> {
    const isLive = await probeBackend();
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/products.php?id=${id}`);
        const json: ApiResponse<Apartment> = await res.json();
        if (json.success && json.data) return json.data;
      } catch (e) {
        console.warn('Backend single product error:', e);
      }
    }
    const list = LocalStore.get('products', INITIAL_APARTMENTS);
    return list.find(p => p.id === id) || null;
  },

  async saveProduct(product: Partial<Apartment>): Promise<ApiResponse<Apartment>> {
    const isLive = await probeBackend();
    const isEdit = Boolean(product.id);

    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/products.php`, {
          method: isEdit ? 'PUT' : 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(product)
        });
        return await res.json();
      } catch (e) {
        console.warn('Backend save product error:', e);
      }
    }

    const list = LocalStore.get('products', INITIAL_APARTMENTS);
    let updatedList: Apartment[];
    let savedItem: Apartment;

    if (isEdit) {
      updatedList = list.map(item => item.id === product.id ? { ...item, ...product } as Apartment : item);
      savedItem = updatedList.find(i => i.id === product.id)!;
    } else {
      savedItem = {
        id: Date.now(),
        category_id: product.category_id || 1,
        title: product.title || 'New Luxury Apartment',
        slug: (product.title || 'apartment').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: product.description || '',
        price: product.price || 20000,
        price_type: product.price_type || 'night',
        area_sqft: product.area_sqft || 800,
        bedrooms: product.bedrooms || 1,
        bathrooms: product.bathrooms || 1,
        guest_capacity: product.guest_capacity || 2,
        view_type: product.view_type || 'City View',
        floor: product.floor || '15th Floor',
        status: product.status || 'available',
        is_featured: product.is_featured || 0,
        amenities: product.amenities || ['High Speed Wi-Fi', '24/7 Security'],
        images: product.images && product.images.length ? product.images : ['./images/background image.jpeg']
      };
      updatedList = [savedItem, ...list];
    }

    LocalStore.set('products', updatedList);
    return { success: true, message: 'Apartment saved successfully', data: savedItem };
  },

  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    const isLive = await probeBackend();
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/products.php?id=${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        return await res.json();
      } catch (e) {
        console.warn('Backend delete product error:', e);
      }
    }
    const list = LocalStore.get('products', INITIAL_APARTMENTS);
    LocalStore.set('products', list.filter(p => p.id !== id));
    return { success: true, message: 'Apartment removed' };
  },

  // 4. Commercial Spaces (Showrooms & Offices)
  async getCommercialSpaces(): Promise<CommercialSpace[]> {
    return LocalStore.get('commercial_spaces', INITIAL_COMMERCIAL_SPACES);
  },

  async saveCommercialSpace(space: Partial<CommercialSpace>): Promise<ApiResponse<CommercialSpace>> {
    const list = LocalStore.get('commercial_spaces', INITIAL_COMMERCIAL_SPACES);
    const isEdit = Boolean(space.id);
    let updatedList: CommercialSpace[];
    let saved: CommercialSpace;

    if (isEdit) {
      updatedList = list.map(item => {
        if (item.id === space.id) {
          saved = { ...item, ...space } as CommercialSpace;
          return saved;
        }
        return item;
      });
      saved = updatedList.find(item => item.id === space.id)!;
    } else {
      saved = {
        id: Date.now(),
        title: space.title || 'New Commercial Space',
        slug: space.slug || (space.title ? space.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'new-commercial-space'),
        space_type: space.space_type || 'Executive Office',
        area_sqft: space.area_sqft || 1000,
        floor_location: space.floor_location || 'The Centaurus Corporate Tower',
        suitable_for: space.suitable_for || ['Corporate Office'],
        description: space.description || '',
        features: space.features || ['100% Uninterrupted Power', '24/7 Security'],
        pricing_type: space.pricing_type || 'Price upon Request',
        price_estimate: space.price_estimate || '',
        images: space.images && space.images.length > 0 ? space.images : ['./images/background image.jpeg'],
        status: space.status || 'Available'
      };
      updatedList = [saved, ...list];
    }
    LocalStore.set('commercial_spaces', updatedList);
    return { success: true, data: saved, message: isEdit ? 'Commercial space updated' : 'Commercial space created' };
  },

  async deleteCommercialSpace(id: number): Promise<ApiResponse<null>> {
    const list = LocalStore.get('commercial_spaces', INITIAL_COMMERCIAL_SPACES);
    LocalStore.set('commercial_spaces', list.filter(item => item.id !== id));
    return { success: true, message: 'Commercial space deleted' };
  },

  // 4b. Media Library Management
  async getMediaItems(): Promise<MediaItem[]> {
    return LocalStore.get('media_items', INITIAL_MEDIA_ITEMS);
  },

  async saveMediaItem(item: Partial<MediaItem>): Promise<ApiResponse<MediaItem>> {
    const list = LocalStore.get('media_items', INITIAL_MEDIA_ITEMS);
    const saved: MediaItem = {
      id: item.id || Date.now(),
      title: item.title || 'Uploaded Image',
      url: item.url || './images/background image.jpeg',
      category: item.category || 'General',
      size_kb: item.size_kb || 120,
      dimensions: item.dimensions || '1920 × 1080',
      uploaded_at: item.uploaded_at || new Date().toISOString().split('T')[0]
    };
    const updated = [saved, ...list.filter(m => m.id !== saved.id)];
    LocalStore.set('media_items', updated);
    return { success: true, data: saved, message: 'Media item saved' };
  },

  async deleteMediaItem(id: number): Promise<ApiResponse<null>> {
    const list = LocalStore.get('media_items', INITIAL_MEDIA_ITEMS);
    LocalStore.set('media_items', list.filter(m => m.id !== id));
    return { success: true, message: 'Media item deleted' };
  },

  // 5. Blogs & Articles
  async getBlogs(): Promise<BlogPost[]> {
    const isLive = await probeBackend();
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/blogs.php`);
        const json: ApiResponse<BlogPost[]> = await res.json();
        if (json.success && json.data) return json.data;
      } catch (e) {
        console.warn('Backend blogs fetch error:', e);
      }
    }
    return LocalStore.get('blogs', INITIAL_BLOGS);
  },

  async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    const isLive = await probeBackend();
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/blogs.php?slug=${slug}`);
        const json: ApiResponse<BlogPost> = await res.json();
        if (json.success && json.data) return json.data;
      } catch (e) {
        console.warn('Backend single blog error:', e);
      }
    }
    const list = LocalStore.get('blogs', INITIAL_BLOGS);
    return list.find(b => b.slug === slug) || null;
  },

  async saveBlog(blog: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> {
    const list = LocalStore.get('blogs', INITIAL_BLOGS);
    const isEdit = Boolean(blog.id);
    let updatedList: BlogPost[];
    let saved: BlogPost;

    if (isEdit) {
      updatedList = list.map(b => b.id === blog.id ? { ...b, ...blog } as BlogPost : b);
      saved = updatedList.find(b => b.id === blog.id)!;
    } else {
      saved = {
        id: Date.now(),
        title: blog.title || 'New Luxury Living Article',
        slug: (blog.title || 'article').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: blog.category || 'Centaurus Guide',
        excerpt: blog.excerpt || 'Article summary...',
        content: blog.content || 'Article content...',
        author: blog.author || '6 Stars Editorial',
        image: blog.image || './images/background image.jpeg',
        read_time: blog.read_time || '4 min read',
        created_at: new Date().toISOString().split('T')[0]
      };
      updatedList = [saved, ...list];
    }
    LocalStore.set('blogs', updatedList);
    return { success: true, message: 'Article saved', data: saved };
  },

  async deleteBlog(id: number): Promise<ApiResponse<void>> {
    const list = LocalStore.get('blogs', INITIAL_BLOGS);
    LocalStore.set('blogs', list.filter(b => b.id !== id));
    return { success: true, message: 'Article removed' };
  },

  // 6. Quotation Engine
  async submitQuote(payload: {
    customer_name: string;
    email?: string;
    phone: string;
    check_in_date?: string;
    check_out_date?: string;
    apartment_id: number;
    duration_type: 'night' | 'month' | 'year';
    duration_count: number;
    guests: number;
    additional_requirements?: string[];
    notes?: string;
  }): Promise<ApiResponse<Quotation>> {
    const isLive = await probeBackend();
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/quote.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await res.json();
      } catch (e) {
        console.warn('Backend quote submit error:', e);
      }
    }

    const apts = LocalStore.get('products', INITIAL_APARTMENTS);
    const apt = apts.find(a => a.id === payload.apartment_id) || apts[0];

    let baseRate = apt.price * payload.duration_count;
    if (payload.duration_type === 'night') {
      if (payload.duration_count >= 30) baseRate *= 0.75;
      else if (payload.duration_count >= 7) baseRate *= 0.90;
    } else if (payload.duration_type === 'month') {
      baseRate = apt.price * 22 * payload.duration_count;
      if (payload.duration_count >= 6) baseRate *= 0.88;
    } else if (payload.duration_type === 'year') {
      baseRate = apt.price * 19 * 12 * payload.duration_count;
    }

    const tax = Math.round(baseRate * 0.05);
    const total = Math.round(baseRate + tax);
    const quoteNum = '6STAR-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const newQuote: Quotation = {
      id: Date.now(),
      quote_number: quoteNum,
      customer_name: payload.customer_name,
      email: payload.email || '',
      phone: payload.phone,
      check_in_date: payload.check_in_date || '',
      check_out_date: payload.check_out_date || '',
      apartment_id: apt.id,
      apartment_title: apt.title,
      duration_type: payload.duration_type,
      duration_count: payload.duration_count,
      guests: payload.guests,
      additional_requirements: payload.additional_requirements || [],
      base_price: baseRate,
      add_ons_price: 0,
      tax_amount: tax,
      total_price: total,
      notes: payload.notes || '',
      status: 'Pending',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    const quotes = LocalStore.get('quotes', INITIAL_QUOTES);
    LocalStore.set('quotes', [newQuote, ...quotes]);

    return {
      success: true,
      message: 'Quotation generated successfully',
      data: newQuote
    };
  },

  async getQuotes(): Promise<Quotation[]> {
    return LocalStore.get('quotes', INITIAL_QUOTES);
  },

  async updateQuoteStatus(id: number, status: Quotation['status']): Promise<ApiResponse<void>> {
    const quotes = LocalStore.get('quotes', INITIAL_QUOTES);
    LocalStore.set('quotes', quotes.map(q => q.id === id ? { ...q, status } : q));
    return { success: true, message: 'Status updated' };
  },

  // 7. Contact Inquiries
  async submitInquiry(data: {
    name: string;
    email?: string;
    phone?: string;
    inquiry_type?: Inquiry['inquiry_type'];
    subject?: string;
    message: string;
  }): Promise<ApiResponse<void>> {
    const isLive = await probeBackend();
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/contact.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (e) {
        console.warn('Backend inquiry error:', e);
      }
    }
    const inqs = LocalStore.get('inquiries', INITIAL_INQUIRIES);
    const newInq: Inquiry = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      inquiry_type: data.inquiry_type || 'General Inquiry',
      subject: data.subject || 'General Inquiry',
      message: data.message,
      status: 'New',
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };
    LocalStore.set('inquiries', [newInq, ...inqs]);
    return { success: true, message: 'Thank you. A 6 Stars Hospitality concierge specialist will contact you shortly.' };
  },

  async getInquiries(): Promise<Inquiry[]> {
    return LocalStore.get('inquiries', INITIAL_INQUIRIES);
  },

  async updateInquiryStatus(id: number, status: Inquiry['status']): Promise<ApiResponse<void>> {
    const inqs = LocalStore.get('inquiries', INITIAL_INQUIRIES);
    LocalStore.set('inquiries', inqs.map(i => i.id === id ? { ...i, status } : i));
    return { success: true, message: 'Inquiry updated' };
  },

  // 8. Admin Authentication
  async adminLogin(credentials: { username: string; password: string }): Promise<ApiResponse<{ token: string; user: AdminUser }>> {
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const mockToken = 'mock_admin_token_' + Date.now();
      localStorage.setItem('6star_admin_token', mockToken);
      return {
        success: true,
        token: mockToken,
        user: { id: 1, username: 'admin', role: 'superadmin' },
        message: 'Logged in successfully'
      };
    }
    return { success: false, error: 'Invalid username or password' };
  },

  async verifyAdminSession(): Promise<AdminUser | null> {
    const token = localStorage.getItem('6star_admin_token');
    if (!token) return null;
    return { id: 1, username: 'admin', role: 'superadmin' };
  },

  logout(): void {
    localStorage.removeItem('6star_admin_token');
  }
};
