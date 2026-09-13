// src/components/home/HomeArticlesSection.tsx - Guides & Articles Homepage Section
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { BlogPost } from '../../types';
import { resolveSafeImagePath } from '../common/OptimizedImage';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomeArticlesSection: React.FC = () => {
  const [articles, setArticles] = useState<BlogPost[]>([]);

  useEffect(() => {
    api.getBlogs().then((data) => {
      setArticles(data.slice(0, 3));
    });
  }, []);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 text-brand-gold-600 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Editorial & Insights</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground dark:text-white">
            Guides & Articles
          </h2>
          <p className="text-sm text-muted-foreground dark:text-slate-300 mt-2 max-w-xl font-light">
            Helpful insights on living in Islamabad, corporate housing leasing options, and getting the most from The Centaurus.
          </p>
        </div>

        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-brand-gold-600 dark:text-brand-gold-400 hover:text-brand-gold-500 transition-colors group"
        >
          <span>Explore All Articles</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article, idx) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-card dark:bg-brand-navy-900/70 rounded-2xl overflow-hidden border border-border dark:border-white/5 hover:border-brand-gold-500/30 transition-all duration-300 shadow-md flex flex-col group"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-muted dark:bg-brand-navy-950">
              <img
                src={resolveSafeImagePath(article.image)}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                width={1280}
                height={800}
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1 rounded text-[10px] font-bold text-brand-gold-300 border border-brand-gold-500/30 backdrop-blur-md uppercase tracking-wider">
                {article.category}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground dark:text-slate-400 mb-2">
                  <Clock className="w-3.5 h-3.5 text-brand-gold-500" />
                  <span>{article.read_time}</span>
                </div>

                <h3 className="font-heading font-bold text-base text-card-foreground dark:text-white group-hover:text-brand-gold-500 transition-colors mb-2 leading-snug">
                  <Link to={`/blogs/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-xs text-muted-foreground dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 font-light">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-border dark:border-white/10">
                <Link
                  to={`/blogs/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold-600 dark:text-brand-gold-400 group-hover:text-brand-gold-500 transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
