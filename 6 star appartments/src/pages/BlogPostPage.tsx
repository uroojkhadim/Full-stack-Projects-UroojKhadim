// src/pages/BlogPostPage.tsx - 6 STARS HOSPITALITY Publication Detail Page
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BlogPost } from '../types';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';
import { resolveSafeImagePath } from '../components/common/OptimizedImage';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Share2, 
  Calculator, 
  BookOpen, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';
import { useSite } from '../context/SiteContext';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings, addToast } = useSite();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      api.getBlogBySlug(slug).then((res) => {
        setBlog(res);
        setLoading(false);
      });
      api.getBlogs().then((all) => {
        setRelatedBlogs(all.filter(b => b.slug !== slug).slice(0, 2));
      });
    }
  }, [slug]);

  if (loading) {
    return <div className="py-24 text-center text-muted-foreground dark:text-slate-400">Loading guide...</div>;
  }

  if (!blog) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 bg-card dark:bg-charcoal-900 rounded-3xl border border-border dark:border-charcoal-800 p-8 shadow-xl">
        <BookOpen className="w-12 h-12 text-brand-gold-500 mx-auto mb-4" />
        <h2 className="font-heading font-bold text-2xl text-card-foreground dark:text-white mb-2">Article Not Found</h2>
        <p className="text-sm text-muted-foreground dark:text-slate-400 mb-6">The requested publication could not be found.</p>
        <Link to="/blogs" className="px-6 py-2.5 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-sm shadow-md">
          Return to All Articles
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Article link copied to clipboard!');
  };

  const verifiedWhatsapp = (settings.whatsapp || '923120893146').replace(/[^0-9]/g, '');

  return (
    <div className="py-12 px-4 sm:px-8 max-w-4xl mx-auto min-h-screen">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-brand-gold-500 dark:text-slate-400 dark:hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-card-foreground dark:text-slate-400 dark:hover:text-white bg-card dark:bg-charcoal-900 px-3.5 py-1.5 rounded-xl border border-border dark:border-charcoal-800 transition-colors shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5 text-brand-gold-500" />
          <span>Share Article</span>
        </button>
      </div>

      <article className="space-y-8">
        {/* Category & Title */}
        <div>
          <span className="px-3 py-1 rounded-md text-xs font-bold bg-brand-gold-500/15 text-brand-gold-600 dark:text-brand-gold-400 border border-brand-gold-500/30 uppercase tracking-wider">
            {blog.category}
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-card-foreground dark:text-white mt-4 mb-4 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-gold-500" />
              {blog.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-gold-500" />
              {blog.read_time}
            </span>
            <span>•</span>
            <span>{formatDate(blog.created_at)}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-muted dark:bg-charcoal-950 border border-border dark:border-charcoal-800 shadow-xl">
          <img
            src={resolveSafeImagePath(blog.image)}
            alt={blog.title}
            className="w-full h-full object-cover"
            width={1600}
            height={900}
          />
        </div>

        {/* Article Body */}
        <div className="prose dark:prose-invert max-w-none text-card-foreground dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6 pt-2">
          {blog.content.split('\n\n').map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Trust Note */}
        <div className="p-4 rounded-2xl bg-muted/40 dark:bg-charcoal-900/60 border border-border dark:border-charcoal-800 flex items-center gap-3 text-xs text-muted-foreground dark:text-slate-400">
          <ShieldCheck className="w-5 h-5 text-brand-gold-500 shrink-0" />
          <span>
            Published by 6 STARS HOSPITALITY Editorial Desk. All apartments and residences referenced are located at The Centaurus, Islamabad.
          </span>
        </div>

        {/* Related Guides Section */}
        {relatedBlogs.length > 0 && (
          <div className="pt-10 border-t border-border dark:border-charcoal-800">
            <h3 className="font-heading font-bold text-xl text-card-foreground dark:text-white mb-6">
              Related Centaurus Living Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blogs/${rel.slug}`}
                  className="bg-card dark:bg-charcoal-900 p-5 rounded-2xl border border-border dark:border-charcoal-800 hover:border-brand-gold-500/40 transition-all group flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="text-[11px] font-bold text-brand-gold-600 dark:text-brand-gold-400 uppercase tracking-wider block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="font-heading font-bold text-base text-card-foreground dark:text-white group-hover:text-brand-gold-500 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-brand-gold-600 dark:text-brand-gold-400 font-semibold mt-4">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Dual Action Banner */}
        <div className="bg-card dark:bg-charcoal-900 rounded-3xl p-8 border border-brand-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 shadow-xl">
          <div>
            <h3 className="font-heading font-bold text-xl text-card-foreground dark:text-white mb-1">
              Interested in Residing at The Centaurus?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400">
              Calculate an immediate quotation or speak with our concierge desk on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/quote"
              className="px-5 py-3 rounded-xl text-xs font-bold text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-md transition-all flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Instant Quotation</span>
            </Link>

            <a
              href={`https://wa.me/${verifiedWhatsapp}?text=Hello%206%20Stars%20Hospitality,%20I%20read%20your%20article%20'${encodeURIComponent(blog.title)}'%20and%20would%20like%20more%20information.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};
