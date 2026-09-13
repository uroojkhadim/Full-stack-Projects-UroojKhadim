import { Apartment, Category, SiteSettings, BlogPost, Quotation, Inquiry, CommercialSpace, MediaItem } from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  brand_name: '6 STARS HOSPITALITY',
  property_name: '6 Star Centaurus Apartments',
  tagline: 'Exceptional Stays • Memorable Experiences',
  phone_primary: '+92 312 0893146',
  phone_secondary: '+92 312 0893146',
  whatsapp: '+92 312 0893146',
  email: 'concierge@6starhospitality.com',
  quote_notice: 'All digital calculations are formal estimated quotations. Reservations are confirmed by our concierge team upon verification of guest credentials and key handover at reception.',
  showrooms: [
    {
      name: 'The Centaurus Residence Suite & Commercial Gallery',
      tag: 'Flagship Showroom & Viewing Suite',
      address: 'Tower B, 18th Floor, The Centaurus, Jinnah Avenue, Sector F-8/4, Islamabad',
      phone: '+92 312 0893146',
      email: 'centaurus@6starhospitality.com',
      hours: 'Monday – Sunday: 09:00 AM – 10:00 PM',
      map_url: 'https://maps.google.com/?q=The+Centaurus+Mall+Islamabad'
    },
    {
      name: 'Elysium Tower Executive Suite & Leasing Lounge',
      tag: 'Executive Boulevard Suite',
      address: 'Elysium Tower, Jinnah Avenue (Opposite Centaurus), Islamabad',
      phone: '+92 312 0893146',
      email: 'elysium@6starhospitality.com',
      hours: 'Monday – Saturday: 09:00 AM – 08:00 PM',
      map_url: 'https://maps.google.com/?q=Elysium+Tower+Islamabad'
    },
    {
      name: 'F-11 Markaz Corporate Branch & Resident Desk',
      tag: 'Boutique Commercial Desk',
      address: 'Executive Plaza, F-11 Markaz, Islamabad',
      phone: '+92 312 0893146',
      email: 'f11@6starhospitality.com',
      hours: 'Monday – Saturday: 10:00 AM – 07:00 PM',
      map_url: 'https://maps.google.com/?q=F-11+Markaz+Islamabad'
    }
  ],
  social_links: {
    facebook: 'https://facebook.com/6starshospitality',
    instagram: 'https://instagram.com/6starshospitality',
    whatsapp: 'https://wa.me/923120893146',
    tiktok: 'https://tiktok.com/@6starshospitality',
    linkedin: 'https://linkedin.com/company/6starshospitality'
  },
  seo_settings: {
    meta_title: '6 STARS HOSPITALITY — Centaurus Apartments & Commercial Spaces Islamabad',
    meta_description: 'Book luxury serviced apartments and prime commercial showrooms at The Centaurus, Elysium Tower, and F-11 Markaz Islamabad. Uninterrupted power, elite security, and five-star hospitality.',
    keywords: 'Centaurus apartments Islamabad, luxury apartments Centaurus, serviced apartments Islamabad, Elysium tower rentals, F11 Markaz apartments, Centaurus commercial showrooms, Islamabad corporate leases'
  }
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'One Bed Studio Apartment',
    slug: 'one-bed-studio-apartment',
    description: 'Cozy, elegantly appointed studio residences ideal for solo executives or short corporate stays in the capital.',
    image: '/images/One bed studio apartment/WhatsApp Image 2026-09-06 at 11.07.00 PM.jpeg',
    product_count: 1
  },
  {
    id: 2,
    name: '1+Study Apartment',
    slug: '1-plus-study-apartment',
    description: 'Spacious 1-bedroom luxury suite equipped with a dedicated executive study workstation and high-speed fiber connectivity.',
    image: '/images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM.jpeg',
    product_count: 1
  },
  {
    id: 3,
    name: '1 Bed Margalla Facing',
    slug: '1-bed-margalla-facing',
    description: 'Breathtaking high-floor 1-bedroom apartment overlooking the majestic Margalla Hills and Faisal Mosque skyline.',
    image: '/images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.32 PM.jpeg',
    product_count: 1
  },
  {
    id: 4,
    name: '2 Bed Apartments',
    slug: '2-bed-apartments',
    description: 'Refined two-bedroom luxury residences crafted for families and extended corporate stays requiring total comfort.',
    image: '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg',
    product_count: 1
  },
  {
    id: 5,
    name: '2+Study Apartment',
    slug: '2-plus-study-apartment',
    description: 'Deluxe dual-bedroom apartment featuring an independent conference study nook and open living salon.',
    image: '/images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.27 PM.jpeg',
    product_count: 1
  },
  {
    id: 6,
    name: 'Centaurus Two Bedrooms',
    slug: 'centaurus-two-bedrooms',
    description: 'Signature Centaurus tower residences boasting designer furnishings, high ceilings, and floor-to-ceiling glass.',
    image: '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.04 PM.jpeg',
    product_count: 1
  },
  {
    id: 7,
    name: '3 Bed Executive Penthouse',
    slug: '3-bed-apartment',
    description: 'Grand three-bedroom luxury penthouse with expansive terrace, chef kitchen, and 360-degree panoramic city vistas.',
    image: '/images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.02 PM.jpeg',
    product_count: 1
  }
];

export const INITIAL_APARTMENTS: Apartment[] = [
  {
    id: 1,
    category_id: 1,
    category_name: 'One Bed Studio Apartment',
    category_slug: 'one-bed-studio-apartment',
    title: 'Signature 1-Bed Studio Suite',
    slug: 'signature-1-bed-studio-suite',
    description: 'Ultra-chic modern studio apartment at The Centaurus. Features king plush bedding, smart entertainment system, kitchenette with premium appliances, marble ensuite bath, and sweeping city views.',
    price: 18000,
    price_type: 'night',
    area_sqft: 650,
    bedrooms: 1,
    bathrooms: 1,
    guest_capacity: 2,
    view_type: 'Islamabad City Skyline',
    floor: '14th Floor',
    location: 'The Centaurus',
    status: 'available',
    is_featured: 1,
    amenities: [
      'High Speed Fiber Wi-Fi',
      'Smart 4K TV with Streaming',
      '24/7 Concierge & Security',
      '100% Uninterrupted Power',
      'Direct Elevator to Centaurus Mall',
      'Daily Housekeeping',
      'Fully Equipped Modern Kitchenette'
    ],
    images: [
      '/images/One bed studio apartment/WhatsApp Image 2026-09-06 at 11.07.00 PM.jpeg',
      '/images/One bed studio apartment/WhatsApp Image 2026-09-06 at 11.07.00 PM (1).jpeg',
      '/images/One bed studio apartment/WhatsApp Image 2026-09-06 at 11.07.00 PM (2).jpeg',
      '/images/One bed studio apartment/WhatsApp Image 2026-09-06 at 11.06.59 PM.jpeg'
    ]
  },
  {
    id: 2,
    category_id: 2,
    category_name: '1+Study Apartment',
    category_slug: '1-plus-study-apartment',
    title: 'Executive 1+Study Luxury Residence',
    slug: 'executive-1-study-luxury-residence',
    description: 'Tailored for traveling executives, diplomats, and corporate professionals. Comes with a separate quiet study zone, ergonomic leather chair, high-speed workstation, plush king master bedroom, and bespoke lounge.',
    price: 24000,
    price_type: 'night',
    area_sqft: 880,
    bedrooms: 1,
    bathrooms: 1.5,
    guest_capacity: 2,
    view_type: 'Jinnah Avenue & Blue Area',
    floor: '17th Floor',
    location: 'Elysium Tower',
    status: 'available',
    is_featured: 1,
    amenities: [
      'Dedicated Executive Study',
      'High-Speed Fiber Wi-Fi 100 Mbps',
      'Complimentary Covered Parking',
      'Access to Heated Swimming Pool',
      'Fitness Gym Access',
      '24/7 Generator Power Backup',
      'Smart Keycard Floor Access'
    ],
    images: [
      '/images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM.jpeg',
      '/images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM (1).jpeg',
      '/images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM (2).jpeg',
      '/images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.08 PM.jpeg'
    ]
  },
  {
    id: 3,
    category_id: 3,
    category_name: '1 Bed Margalla Facing',
    category_slug: '1-bed-margalla-facing',
    title: 'Margalla Hills Panorama 1-Bed Residence',
    slug: 'margalla-hills-panorama-1-bed',
    description: 'Immerse in nature without leaving luxury behind. Floor-to-ceiling glass windows open directly to the lush Margalla Hills national park and the sunset over Islamabad. Includes custom furnishings and deep-soak bathtub.',
    price: 26000,
    price_type: 'night',
    area_sqft: 820,
    bedrooms: 1,
    bathrooms: 1,
    guest_capacity: 2,
    view_type: 'Direct Margalla Hills & Faisal Mosque',
    floor: '21st Floor',
    location: 'The Centaurus',
    status: 'available',
    is_featured: 1,
    amenities: [
      'Margalla Panoramic View',
      'Floor-to-Ceiling Windows',
      'Espresso Coffee Bar',
      'Custom Furnishings',
      '24/7 In-Room Dining Access',
      'Heated Pool Access',
      'Soundproof Acoustic Glazing'
    ],
    images: [
      '/images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.32 PM.jpeg',
      '/images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.34 PM.jpeg',
      '/images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.32 PM (1).jpeg',
      '/images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.33 PM.jpeg'
    ]
  },
  {
    id: 4,
    category_id: 4,
    category_name: '2 Bed Apartments',
    category_slug: '2-bed-apartments',
    title: 'Royal 2-Bedroom Family Residence',
    slug: 'royal-2-bedroom-family-residence',
    description: 'A spacious haven of comfort with two master suites, lavish living and dining room, granite gourmet kitchen, and twin luxury baths. Ideal for discerning families and extended luxury stays.',
    price: 38000,
    price_type: 'night',
    area_sqft: 1450,
    bedrooms: 2,
    bathrooms: 2,
    guest_capacity: 4,
    view_type: 'Dual Aspect: City & Hills',
    floor: '16th Floor',
    location: 'The Centaurus',
    status: 'available',
    is_featured: 1,
    amenities: [
      'Two Independent Master Suites',
      'Full Gourmet Kitchen',
      'Washer & Dryer in Unit',
      'Private High-Speed Elevator Access',
      'Dedicated Reserved Covered Parking',
      'Baby Cot upon Prior Request',
      'Centaurus Mall Enclosed Connection'
    ],
    images: [
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg',
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.02 PM.jpeg',
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.04 PM.jpeg',
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.07 PM.jpeg'
    ]
  },
  {
    id: 5,
    category_id: 5,
    category_name: '2+Study Apartment',
    category_slug: '2-plus-study-apartment',
    title: 'Prestige 2+Study Diplomatic Suite',
    slug: 'prestige-2-study-diplomatic-suite',
    description: 'Equipped with 2 royal bedrooms, a private conference study, oversized salon, and laundry pantry. Favored by corporate delegations and long-term expatriates requiring privacy and comfort.',
    price: 44000,
    price_type: 'night',
    area_sqft: 1650,
    bedrooms: 2,
    bathrooms: 2.5,
    guest_capacity: 4,
    view_type: 'Margalla Hills & Boulevard',
    floor: '19th Floor',
    location: 'Elysium Tower',
    status: 'available',
    is_featured: 0,
    amenities: [
      'Executive Study / Conference Nook',
      '2 Master King Bedrooms',
      'Expansive Living Salon',
      'Fiber Wi-Fi 100 Mbps',
      'Complimentary Chauffeur Booking Assist',
      'Premium Toiletries',
      '24/7 Concierge on Duty'
    ],
    images: [
      '/images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.27 PM.jpeg',
      '/images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.26 PM.jpeg',
      '/images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.28 PM.jpeg',
      '/images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.29 PM.jpeg'
    ]
  },
  {
    id: 6,
    category_id: 6,
    category_name: 'Centaurus Two Bedrooms',
    category_slug: 'centaurus-two-bedrooms',
    title: 'Centaurus Tower Two-Bedroom Grand Suite',
    slug: 'centaurus-tower-two-bedroom-grand-suite',
    description: 'The signature standard of Centaurus Tower living. Featuring ultra-contemporary decor, ambient recessed LED chandeliers, custom velvet sofas, and floor-to-ceiling glass showcasing the capital.',
    price: 42000,
    price_type: 'night',
    area_sqft: 1500,
    bedrooms: 2,
    bathrooms: 2,
    guest_capacity: 4,
    view_type: 'Jinnah Avenue & Skyline View',
    floor: '22nd Floor',
    location: 'The Centaurus',
    status: 'available',
    is_featured: 1,
    amenities: [
      'Direct Mall Access',
      'Smart Ambient Lighting & Curtains',
      'Double-Door Refrigerator',
      'Rain Shower & Soaking Tub',
      '24/7 Security & Video Intercom',
      'Dedicated Basement Car Parking'
    ],
    images: [
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.04 PM.jpeg',
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.10 PM.jpeg',
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.13 PM.jpeg',
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.35 PM.jpeg'
    ]
  },
  {
    id: 7,
    category_id: 7,
    category_name: '3 Bed Executive Penthouse',
    category_slug: '3-bed-apartment',
    title: 'Imperial 3-Bedroom Sky Penthouse',
    slug: 'imperial-3-bedroom-sky-penthouse',
    description: 'Unmatched grandeur spanning 2,200 sqft. Three lavish bedrooms with marble ensuites, chef kitchen, grand dining hall for 8 guests, and an open balcony offering 360-degree vistas across Islamabad.',
    price: 65000,
    price_type: 'night',
    area_sqft: 2200,
    bedrooms: 3,
    bathrooms: 3.5,
    guest_capacity: 6,
    view_type: '360° Margalla Hills & City Skyline',
    floor: '23rd Floor',
    location: 'The Centaurus',
    status: 'available',
    is_featured: 1,
    amenities: [
      'Top Floor Penthouse Level',
      'Private Panoramic Balcony',
      'Chef-Grade Complete Kitchen',
      'Formal Dining Table for 8',
      'Jacuzzi Tub in Master Ensuite',
      'Dedicated Concierge Support',
      'Complimentary Valet Parking for 2 Cars'
    ],
    images: [
      '/images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.02 PM.jpeg',
      '/images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.03 PM (1).jpeg',
      '/images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.04 PM.jpeg',
      '/images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.04 PM (1).jpeg'
    ]
  },
  {
    id: 8,
    category_id: 4,
    category_name: '2 Bed Apartments',
    category_slug: '2-bed-apartments',
    title: 'F-11 Markaz Boutique Serviced Suite',
    slug: 'f11-markaz-boutique-serviced-suite',
    description: 'Boutique serviced luxury apartment situated in the vibrant F-11 Markaz hub. Steps from gourmet bistros, cafes, and business offices. Features designer styling, quiet residential comfort, and dedicated concierge.',
    price: 32000,
    price_type: 'night',
    area_sqft: 1350,
    bedrooms: 2,
    bathrooms: 2,
    guest_capacity: 4,
    view_type: 'F-11 Boulevard & Margalla Sunset',
    floor: '5th Floor',
    location: 'F-11 Markaz',
    status: 'available',
    is_featured: 1,
    amenities: [
      'Prime F-11 Markaz Location',
      'Walk to Cafes & Supermarkets',
      'Dual Master King Suites',
      'High-Speed Fiber Internet',
      'Uninterrupted Generator Backup',
      'Secure Electronic Entry',
      'Housekeeping on Request'
    ],
    images: [
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg',
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.02 PM.jpeg',
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.04 PM.jpeg',
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.07 PM.jpeg'
    ]
  }
];

export const INITIAL_COMMERCIAL_SPACES: CommercialSpace[] = [
  {
    id: 101,
    title: 'Prime Centaurus Concourse Retail Showroom',
    slug: 'prime-centaurus-retail-showroom',
    space_type: 'Showroom',
    area_sqft: 1850,
    floor_location: 'Concourse / Mezzanine Level, The Centaurus',
    suitable_for: ['Luxury Fashion Retail', 'Jewelry & Watches', 'Flagship Brand Experience', 'Designer Interior Showroom'],
    description: 'High-visibility commercial showroom located along the primary pedestrian thoroughfare of The Centaurus Mall. Boasts double-height glass frontage, polished terrazzo flooring, and dedicated back-of-house storage.',
    features: [
      '30-Foot Frameless Glass Façade',
      'Heavy Footfall Mall Location',
      'Central Climate Control & HVAC',
      'Dedicated Loading Dock Access',
      'Three-Phase High Capacity Power',
      '24/7 Building Security & CCTV'
    ],
    pricing_type: 'Price upon Request',
    price_estimate: 'Inquire for Custom Commercial Lease Terms',
    images: [
      '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.04 PM.jpeg',
      './images/background image.jpeg'
    ],
    status: 'Available'
  },
  {
    id: 102,
    title: 'Executive Corporate Office Suite — Tower A',
    slug: 'executive-corporate-office-suite-tower-a',
    space_type: 'Executive Office',
    area_sqft: 2400,
    floor_location: '14th Floor, Centaurus Corporate Tower A',
    suitable_for: ['Multinational Headquarters', 'Diplomatic Missions', 'Tech Enterprises', 'Consulting & Legal Practices'],
    description: 'Fully fitted Grade-A corporate office suite featuring an executive boardroom, 4 private partner offices, open collaboration floor, reception lobby, and dedicated kitchenette.',
    features: [
      'Panoramic City & Jinnah Avenue Views',
      'Fiber Optic Redundant Internet Trunk',
      '100% Uninterrupted Dual Generator Backup',
      'Dedicated Keycard Elevator Bank',
      'Reserved Underground Executive Parking',
      'Professional Reception Service'
    ],
    pricing_type: 'Monthly Rental',
    price_estimate: 'Rs. 450,000 / month (Fully Fitted)',
    images: [
      '/images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM.jpeg',
      './images/background image.jpeg'
    ],
    status: 'Available'
  },
  {
    id: 103,
    title: 'Diplomatic Boulevard Private Office Suite — Tower B',
    slug: 'diplomatic-boulevard-office-suite',
    space_type: 'Corporate Suite',
    area_sqft: 1400,
    floor_location: '18th Floor, Centaurus Tower B',
    suitable_for: ['Private Family Offices', 'Investment Consultancies', 'Senior Diplomats', 'Regional Representative Offices'],
    description: 'Exclusive executive floor suite providing unparalleled confidentiality, private conference room, soundproof acoustic glazing, and sweeping vistas of the Margalla Hills.',
    features: [
      'Acoustic Triple Glazed Windows',
      'Executive En-Suite Restroom',
      'Direct Elevator Access to Mall & Dining',
      'Dedicated Concierge & Mail Handling',
      'Valet Service for Corporate Visitors',
      'High-Grade Fire Suppression & Security'
    ],
    pricing_type: 'Custom Lease',
    price_estimate: 'Rs. 280,000 / month (Semi-Furnished)',
    images: [
      '/images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.27 PM.jpeg',
      './images/background image.jpeg'
    ],
    status: 'Available'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 1,
    title: 'The Centaurus Islamabad: The Benchmark for Luxury High-Rise Living in the Capital',
    slug: 'centaurus-islamabad-benchmark-luxury-living',
    category: 'Centaurus Guide',
    excerpt: 'Explore why The Centaurus remains Islamabad’s most distinguished address for serviced residences, seamless security, and elevated lifestyle.',
    content: `Rising dramatically above Jinnah Avenue in Sector F-8, The Centaurus represents the pinnacle of contemporary luxury and architectural sophistication in Islamabad. For international travelers, visiting diplomats, corporate delegations, and families, residing in The Centaurus offers an effortless balance of 5-star hotel conveniences and the spacious privacy of a private residence.

From dedicated high-speed elevators and three-tier security screening to instantaneous dual-generator backup and direct enclosed access to premier retail, supermarkets, and fine dining, every comfort is engineered for peace of mind.

Each apartment managed by 6 STARS HOSPITALITY is finished with hardwood and marble details, custom designer furniture, fully equipped modern kitchens, and expansive floor-to-ceiling glass framing the Margalla Hills and Faisal Mosque.`,
    author: '6 Stars Editorial',
    image: '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.04 PM.jpeg',
    read_time: '4 min read',
    created_at: '2026-09-01'
  },
  {
    id: 2,
    title: 'Short-Stay Serviced Apartments vs Long-Term Corporate Leases: Total Cost Guide',
    slug: 'short-stay-vs-long-term-corporate-leases',
    category: 'Corporate Accommodation',
    excerpt: 'Understanding furnished inclusions, utility continuity, and flexible leasing terms for executives visiting Islamabad.',
    content: `Whether you are arriving in the federal capital for a fortnight project or relocating a family for an annual contract, choosing between daily serviced reservations and extended monthly corporate leases requires analyzing total cost of occupancy.

Traditional residential rentals in Islamabad frequently involve security deposits for utility meters, separate maintenance contracts, and generator fuel surcharges. At 6 Stars Hospitality, our serviced rates integrate complete furnishings, industrial power backup, 100 Mbps fiber internet, and comprehensive housekeeping into one clear monthly invoice.

For stays exceeding 14 nights, our online quotation engine automatically calculates tiered volume privileges.`,
    author: 'Leasing Directorate',
    image: '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.01 PM.jpeg',
    read_time: '5 min read',
    created_at: '2026-08-26'
  },
  {
    id: 3,
    title: 'A Panorama of Tranquility: Living with Unobstructed Views of the Margalla Hills',
    slug: 'living-with-margalla-hills-views',
    category: 'Luxury Stays',
    excerpt: 'Why high-floor Margalla-facing suites remain the most coveted residential orientation in Islamabad.',
    content: `There is a distinctive sense of serenity in watching the morning mist lift over the Margalla Ridge while enjoying breakfast on your private high-floor terrace at The Centaurus.

Our Margalla-facing luxury suites on floors 18 through 23 are designed with soundproof triple-glazing, isolating urban sounds while delivering an uninterrupted living canvas of the national park, Faisal Mosque, and the verdant capital canopy below.`,
    author: 'Hospitality Team',
    image: '/images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.32 PM.jpeg',
    read_time: '3 min read',
    created_at: '2026-08-19'
  },
  {
    id: 4,
    title: 'Why Choose Serviced Apartments Over Standard Hotels in Islamabad',
    slug: 'serviced-apartments-vs-standard-hotels',
    category: 'Hospitality & Stays',
    excerpt: 'Discover why diplomats, business leaders, and visiting families increasingly prefer private serviced apartments over conventional hotel rooms.',
    content: `While five-star hotel rooms offer luxury, they often confine guests to a single room without separate living quarters, kitchens, or privacy for hosting visitors. 

6 Star Centaurus Apartments provide expansive 1, 2, and 3-bedroom residences ranging from 800 to 2,800 square feet. Guests enjoy dedicated master bedrooms, fully equipped chef's kitchens with induction cooktops, separate formal dining spaces, in-unit laundry, and round-the-clock hotel-grade concierge and housekeeping services—delivering the true freedom of home alongside five-star hospitality.`,
    author: '6 Stars Editorial',
    image: '/images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.02 PM.jpeg',
    read_time: '4 min read',
    created_at: '2026-08-12'
  },
  {
    id: 5,
    title: 'The Centaurus Lifestyle: Shopping, Dining, & Security Under One Roof',
    slug: 'centaurus-lifestyle-shopping-dining-security',
    category: 'Centaurus Guide',
    excerpt: 'An insider look into life inside Islamabad’s iconic triad towers—where world-class dining, retail, and wellness are an elevator ride away.',
    content: `Residing at The Centaurus transcends traditional apartment living. Residents enjoy direct private elevator access to four levels of international retail brands, gourmet restaurants, cafes, and hypermarkets. 

Whether you wish to work out at the high-performance gym, swim in the temperature-controlled pool, or entertain guests at rooftop dining venues, the entire ecosystem is accessible without ever leaving the security perimeter of the building.`,
    author: 'Guest Relations',
    image: '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.04 PM.jpeg',
    read_time: '4 min read',
    created_at: '2026-08-05'
  },
  {
    id: 6,
    title: 'Islamabad High-Rise Living: Uninterrupted Power Backup & Peace of Mind',
    slug: 'islamabad-high-rise-living-power-security',
    category: 'Living Standards',
    excerpt: 'How dual industrial generator redundancy and multi-tiered biometric security guarantee seamless comfort in the capital.',
    content: `In a modern metropolitan city, reliable power and robust personal security are paramount. The Centaurus is engineered with dual heavy-duty synchronized generators that switch on within seconds of any grid interruption, maintaining 100% load including central air conditioning, refrigeration, high-speed elevators, and fiber internet.

With 24/7 dedicated security personnel, CCTV surveillance across every floor and access point, and electronic keycard entry, residents and their families enjoy unmatched safety and uninterrupted peace of mind.`,
    author: 'Engineering Directorate',
    image: '/images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.34 PM.jpeg',
    read_time: '5 min read',
    created_at: '2026-07-28'
  }
];

export const INITIAL_QUOTES: Quotation[] = [];

export const INITIAL_INQUIRIES: Inquiry[] = [];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 1,
    title: 'Centaurus Triad Towers Façade (Night Horizon)',
    url: './images/background image.jpeg',
    category: 'General',
    size_kb: 45,
    dimensions: '1920 × 1080',
    uploaded_at: '2026-09-01'
  },
  {
    id: 2,
    title: '6 STARS HOSPITALITY Official Emblem & Crest',
    url: './images/logo/WhatsApp Image 2026-09-08 at 6.45.07 PM.jpeg',
    category: 'General',
    size_kb: 258,
    dimensions: '1080 × 1080',
    uploaded_at: '2026-09-08'
  },
  {
    id: 3,
    title: 'Centaurus Two-Bed Suite Living Salon & Chandelier',
    url: '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.04 PM.jpeg',
    category: 'Apartments',
    size_kb: 142,
    dimensions: '1600 × 1200',
    uploaded_at: '2026-09-06'
  },
  {
    id: 4,
    title: 'Margalla Ridge Panoramic High-Floor Master Suite',
    url: '/images/1bed apartment Margla facing/WhatsApp Image 2026-09-06 at 11.07.32 PM.jpeg',
    category: 'Suites',
    size_kb: 138,
    dimensions: '1600 × 1200',
    uploaded_at: '2026-09-06'
  },
  {
    id: 5,
    title: 'Imperial Penthouse Formal Dining & Open Terrace',
    url: '/images/3bed apartment/WhatsApp Image 2026-09-06 at 11.07.02 PM.jpeg',
    category: 'Apartments',
    size_kb: 156,
    dimensions: '1600 × 1200',
    uploaded_at: '2026-09-06'
  },
  {
    id: 6,
    title: 'Centaurus Concourse Flagship Retail Showroom Façade',
    url: '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.10 PM.jpeg',
    category: 'Showrooms',
    size_kb: 135,
    dimensions: '1600 × 1200',
    uploaded_at: '2026-09-06'
  },
  {
    id: 7,
    title: 'Executive Corporate Office Boardroom — Tower A',
    url: '/images/1+study apartment/WhatsApp Image 2026-09-06 at 11.07.07 PM.jpeg',
    category: 'Offices',
    size_kb: 148,
    dimensions: '1600 × 1200',
    uploaded_at: '2026-09-06'
  },
  {
    id: 8,
    title: 'Diplomatic Boulevard Private Office Suite — Tower B',
    url: '/images/2+study apartment/WhatsApp Image 2026-09-06 at 11.07.27 PM.jpeg',
    category: 'Offices',
    size_kb: 144,
    dimensions: '1600 × 1200',
    uploaded_at: '2026-09-06'
  },
  {
    id: 9,
    title: 'Resident Journal: The Centaurus Benchmark Living',
    url: '/images/Centaurus two bedrooms apartment/WhatsApp Image 2026-09-06 at 11.03.13 PM.jpeg',
    category: 'Articles',
    size_kb: 139,
    dimensions: '1600 × 1200',
    uploaded_at: '2026-09-06'
  }
];
