// src/components/home/TestimonialsSection.tsx
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'His Excellency J. Sterling',
      role: 'Diplomatic Mission Chief',
      content: 'Our delegation spent three weeks in the Margalla-facing two-bedroom suite. The level of security, cleanliness, and discrete concierge assistance exceeded our expectations. Truly 6-star standards.',
      stars: 5,
      location: 'London, UK'
    },
    {
      name: 'Adnan & Farida Hashmi',
      role: 'Overseas Pakistani Family',
      content: 'Traveling with children from Canada, having direct elevator access to the Centaurus Mall and play area while staying in an immaculate 3-bed penthouse was paradise. The backup generators never flickered once.',
      stars: 5,
      location: 'Toronto, Canada'
    },
    {
      name: 'Kamran Siddiqui',
      role: 'Multinational Tech VP',
      content: 'The 1+Study apartment is the finest executive setup in Islamabad. High-speed uninterrupted fiber WiFi, quiet workstation, and 18th-floor city views made remote meetings effortless.',
      stars: 5,
      location: 'Dubai, UAE'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-gold-400 text-xs font-bold uppercase tracking-widest block mb-2">
          Guest Experiences
        </span>
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Trusted by Diplomats, Families & Executives
        </h2>
        <p className="text-sm text-slate-400 mt-3">
          Discover why discerning guests choose 6 Star Apartments for their temporary and long-term residences in Islamabad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((rev, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-charcoal-900/80 rounded-2xl p-6 sm:p-8 border border-charcoal-800 relative flex flex-col justify-between"
          >
            <Quote className="w-10 h-10 text-gold-500/20 absolute top-6 right-6" />

            <div>
              <div className="flex items-center gap-1 text-gold-400 mb-4">
                {[...Array(rev.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400" />
                ))}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                "{rev.content}"
              </p>
            </div>

            <div className="pt-4 border-t border-charcoal-800">
              <h4 className="font-heading font-bold text-white text-base">
                {rev.name}
              </h4>
              <p className="text-xs text-gold-400 font-medium">
                {rev.role} • <span className="text-slate-400">{rev.location}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
