// src/types/index.ts - Strict TypeScript Definitions for 6 STARS HOSPITALITY

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  product_count?: number;
}

export interface Apartment {
  id: number;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  price_type: 'night' | 'month' | 'year';
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  guest_capacity: number;
  view_type: string;
  floor: string;
  location?: 'The Centaurus' | 'Elysium Tower' | 'F-11 Markaz';
  status: 'available' | 'reserved';
  is_featured: number | boolean;
  amenities: string[];
  images: string[];
  created_at?: string;
}

export interface CommercialSpace {
  id: number;
  title: string;
  slug: string;
  space_type: 'Showroom' | 'Executive Office' | 'Corporate Suite' | 'Retail Space';
  area_sqft: number;
  floor_location: string;
  suitable_for: string[];
  description: string;
  features: string[];
  pricing_type: 'Price upon Request' | 'Custom Lease' | 'Monthly Rental';
  price_estimate?: string;
  images: string[];
  status: 'Available' | 'Leased';
}

export interface Showroom {
  name: string;
  tag: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  map_url: string;
}

export interface MediaItem {
  id: number;
  title: string;
  url: string;
  category: 'Apartments' | 'Suites' | 'Showrooms' | 'Offices' | 'Articles' | 'General';
  size_kb: number;
  dimensions?: string;
  uploaded_at: string;
}

export interface SiteSettings {
  brand_name: string;
  property_name: string;
  site_name?: string;
  tagline: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp: string;
  email: string;
  quote_notice: string;
  showrooms: Showroom[];
  social_links?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    tiktok?: string;
    linkedin?: string;
  };
  seo_settings?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string;
  };
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  read_time: string;
  created_at: string;
}

export interface QuotationAddOn {
  id?: string;
  name: string;
  price?: number;
}

export interface Quotation {
  id: number;
  quote_number: string;
  customer_name: string;
  email?: string;
  phone: string;
  check_in_date?: string;
  check_out_date?: string;
  apartment_id: number;
  apartment_title: string;
  duration_type: 'night' | 'month' | 'year';
  duration_count: number;
  guests: number;
  additional_requirements?: string[];
  add_ons?: (string | QuotationAddOn)[];
  base_price: number;
  add_ons_price: number;
  tax_amount: number;
  total_price: number;
  notes?: string;
  status: 'New' | 'Reviewing' | 'Quoted' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending' | 'Contacted' | 'Archived';
  created_at: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  inquiry_type: 'Apartment Rental' | 'Suite Rental' | 'Showroom Inquiry' | 'Office Inquiry' | 'General Inquiry';
  subject: string;
  message: string;
  status: 'New' | 'In Progress' | 'Responded' | 'Closed' | 'Replied' | 'Archived';
  created_at: string;
}

export interface GuestUser {
  id: number;
  google_sub: string;
  name: string;
  email: string;
  picture?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  id?: number;
  token?: string;
  user?: AdminUser;
}
