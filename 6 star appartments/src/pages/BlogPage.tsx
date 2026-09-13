// src/pages/BlogPage.tsx - 6 STARS HOSPITALITY Editorial & Living Guides
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';
import { resolveSafeImagePath } from '../components/common/OptimizedImage';
import { BookOpen, Clock, ArrowRight, User, Calculator, Building2 } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    api.getBlogs().then(data => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const categories = Array.from(new Set(blogs.map(b => b.category)));

  // Featured article is either the first or specifically selected
  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const remainingBlogs = blogs.length > 0 ? blogs.slice(1) : [];

  const filteredBlogs = selectedCategory 
    ? blogs.filter(b => b.category === selectedCategory) 
    : remainingBlogs;

  return (
    <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/25 text-brand-gold-600 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Hospitality, Lifestyle & Living Guides</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-foreground dark:text-white tracking-tight">
          Centaurus Living & Resident Guides
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground dark:text-slate-400 mt-3 leading-relaxed">
          Authoritative editorial guides on serviced apartments, long-term corporate leasing, diplomatic accommodations, and high-rise living standards in Islamabad.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground dark:text-slate-400">Loading articles...</div>
      ) : blogs.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto bg-card dark:bg-charcoal-900 border border-border dark:border-charcoal-800 rounded-3xl p-8 mb-20 shadow-lg">
          <BookOpen className="w-12 h-12 text-brand-gold-500 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-xl text-card-foreground dark:text-white mb-2">
            [No articles available]
          </h3>
          <p className="text-xs text-muted-foreground dark:text-slate-400 mb-6">
            Our editorial publications and resident guides are being updated. Please check back shortly or explore our residential suites.
          </p>
          <Link
            to="/apartments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-xs shadow-md"
          >
            <Building2 className="w-4 h-4" />
            <span>Explore Apartments</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Featured Guide at Top (Shown when 'All Articles' is selected) */}
          {!selectedCategory && featuredBlog && (
            <div className="mb-16">
              <div className="bg-card dark:bg-charcoal-900/90 rounded-3xl overflow-hidden border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 group">
                <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px] overflow-hidden bg-muted dark:bg-charcoal-950">
                  <img
                    src={resolveSafeImagePath(featuredBlog.image)}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    width={1600}
                    height={900}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute top-4 left-4 bg-brand-gold-500 text-charcoal-950 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider shadow-lg">
                    Featured Guide
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground dark:text-slate-400 mb-3">
                      <span className="text-brand-gold-600 dark:text-brand-gold-400 font-bold uppercase tracking-wider">
                        {featuredBlog.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-gold-500" />
                        {featuredBlog.read_time}
                      </span>
                      <span>•</span>
                      <span>{formatDate(featuredBlog.created_at)}</span>
                    </div>

                    <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white group-hover:text-brand-gold-500 transition-colors leading-snug">
                      <Link to={`/blogs/${featuredBlog.slug}`}>
                        {featuredBlog.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-muted-foreground dark:text-slate-300 leading-relaxed mt-4 line-clamp-4">
                      {featuredBlog.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-border dark:border-charcoal-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-slate-300">
                      <div className="w-8 h-8 rounded-full bg-muted dark:bg-charcoal-950 border border-border dark:border-charcoal-700 flex items-center justify-center text-brand-gold-500">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground dark:text-white">{featuredBlog.author}</p>
                        <p className="text-[11px] text-muted-foreground dark:text-slate-400">Hospitality Directorate</p>
                      </div>
                    </div>

                    <Link
                      to={`/blogs/${featuredBlog.slug}`}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  selectedCategory === null
                    ? 'bg-brand-gold-500 text-charcoal-950 shadow-md font-bold'
                    : 'bg-card dark:bg-charcoal-900 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white border border-border dark:border-charcoal-800'
                }`}
              >
                All Articles ({blogs.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-brand-gold-500 text-charcoal-950 shadow-md font-bold'
                      : 'bg-card dark:bg-charcoal-900 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white border border-border dark:border-charcoal-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredBlogs.map((post) => (
              <article
                key={post.id}
                className="bg-card dark:bg-charcoal-900/80 rounded-3xl overflow-hidden border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all shadow-lg flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted dark:bg-charcoal-950">
                  <img
                    src={resolveSafeImagePath(post.image)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    width={1280}
                    height={800}
                    loading="lazy"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-black/80 px-2.5 py-1 rounded text-[11px] font-bold text-brand-gold-300 border border-brand-gold-500/30 backdrop-blur-md">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground dark:text-slate-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-gold-500" />
                        {post.read_time}
                      </span>
                      <span>•</span>
                      <span>{formatDate(post.created_at)}</span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-card-foreground dark:text-white group-hover:text-brand-gold-500 transition-colors mb-2.5 leading-snug">
                      <Link to={`/blogs/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-muted-foreground dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border dark:border-charcoal-800 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground dark:text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-gold-500" />
                      {post.author}
                    </span>

                    <Link
                      to={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold-600 dark:text-brand-gold-400 group-hover:text-brand-gold-500 transition-colors"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* Conversion Banner linking to Quotation and Apartments */}
      <div className="bg-card dark:bg-charcoal-900 rounded-3xl p-8 sm:p-12 border border-brand-gold-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <span className="text-brand-gold-600 dark:text-brand-gold-400 text-xs font-bold uppercase tracking-widest block mb-1">
            Experience 6 Stars Hospitality
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white mb-2">
            Planning Your Stay at The Centaurus?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-300 leading-relaxed">
            Browse our 7 luxury furnished layout categories or calculate an instant customized quotation tailored to your arrival date, guest headcount, and lease duration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0 w-full md:w-auto">
          <Link
            to="/quote"
            className="flex-1 md:flex-initial px-6 py-3.5 rounded-xl text-sm font-bold text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Instant Quotation</span>
          </Link>

          <Link
            to="/apartments"
            className="flex-1 md:flex-initial px-6 py-3.5 rounded-xl text-sm font-semibold text-card-foreground dark:text-white bg-muted dark:bg-charcoal-950 hover:bg-muted/80 dark:hover:bg-charcoal-800 border border-border dark:border-charcoal-700 transition-all flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4 text-brand-gold-500" />
            <span>View Apartments</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
