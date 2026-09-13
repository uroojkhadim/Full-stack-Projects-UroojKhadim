// src/pages/admin/AdminBlogsPage.tsx - Editorial Management with Pagination & Theme Support
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { BlogPost } from '../../types';
import { formatDate } from '../../utils/formatters';
import { useSite } from '../../context/SiteContext';
import { resolveSafeImagePath } from '../../components/common/OptimizedImage';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminBlogsPage: React.FC = () => {
  const { addToast } = useSite();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(blogs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = blogs.slice(startIndex, startIndex + itemsPerPage);

  const loadBlogs = async () => {
    setLoading(true);
    const list = await api.getBlogs();
    setBlogs(list);
    setLoading(false);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenAdd = () => {
    setEditingBlog({
      title: '',
      category: 'Lifestyle & Living',
      excerpt: '',
      content: '',
      author: '6 Star Concierge Team',
      read_time: '4 min read',
      image: './images/background image.jpeg'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog({ ...blog });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title || !editingBlog?.content) {
      addToast('Please enter article title and content', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.saveBlog(editingBlog);
      if (res.success) {
        addToast(editingBlog.id ? 'Article updated' : 'Article published');
        setModalOpen(false);
        setEditingBlog(null);
        await loadBlogs();
      } else {
        addToast(res.error || 'Failed to save article', 'error');
      }
    } catch {
      addToast('Error saving article', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this publication?')) {
      const res = await api.deleteBlog(id);
      if (res.success) {
        addToast('Article removed');
        await loadBlogs();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-card-foreground dark:text-white">
            Guides & Blog Publishing System
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400">
            Publish market insights, tenant guidelines, and Centaurus lifestyle articles.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-gold-gradient text-charcoal-950 font-bold text-xs shadow-md hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="bg-card dark:bg-charcoal-900 rounded-3xl border border-border dark:border-charcoal-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 dark:bg-charcoal-950 text-muted-foreground dark:text-slate-400 border-b border-border dark:border-charcoal-800">
              <tr>
                <th className="p-4">Publication</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Published Date</th>
                <th className="p-4">Read Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-charcoal-800/60 text-muted-foreground dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading articles...</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-14 text-center">
                    <BookOpen className="w-10 h-10 text-brand-gold-500 mx-auto mb-3 opacity-60" />
                    <p className="text-base font-semibold text-card-foreground dark:text-white">[No articles available]</p>
                    <p className="text-xs text-muted-foreground mt-1">Click "Write New Article" above to publish your first resident guide.</p>
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/40 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveSafeImagePath(b.image || './images/background image.jpeg')}
                          alt=""
                          className="w-12 h-10 object-cover rounded-lg shrink-0 border border-border/40"
                          width={120}
                          height={100}
                        />
                        <div>
                          <div className="font-heading font-bold text-card-foreground dark:text-white text-sm line-clamp-1 max-w-[280px]">
                            {b.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-[280px]">
                            {b.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-brand-gold-500/15 text-brand-gold-600 dark:text-brand-gold-400 border border-brand-gold-500/30">
                        {b.category}
                      </span>
                    </td>
                    <td className="p-4 text-card-foreground dark:text-slate-200 font-medium">{b.author}</td>
                    <td className="p-4 text-muted-foreground dark:text-slate-400">{formatDate(b.created_at)}</td>
                    <td className="p-4 text-muted-foreground dark:text-slate-400">{b.read_time}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 rounded bg-muted dark:bg-charcoal-800 text-muted-foreground hover:text-brand-gold-500 transition-colors"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 rounded bg-muted dark:bg-charcoal-800 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Delete Article"
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
        {blogs.length > itemsPerPage && (
          <div className="p-4 border-t border-border dark:border-charcoal-800 flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400">
            <div>
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, blogs.length)} of {blogs.length} articles
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

      {/* Editor Modal */}
      <AnimatePresence>
        {modalOpen && editingBlog && (
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
                {editingBlog.id ? 'Edit Editorial Publication' : 'Draft New Publication'}
              </h2>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={editingBlog.title || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                      placeholder="e.g. Essential Guide to Centaurus Corporate Living"
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingBlog.category || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                      placeholder="e.g. Lifestyle & Living / Executive Guides"
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Author</label>
                    <input
                      type="text"
                      value={editingBlog.author || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={editingBlog.read_time || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, read_time: e.target.value })}
                      placeholder="e.g. 5 min read"
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Featured Image URL</label>
                    <input
                      type="text"
                      value={editingBlog.image || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                      className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Brief Excerpt</label>
                  <textarea
                    rows={2}
                    value={editingBlog.excerpt || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                    placeholder="Short summary displayed on cards..."
                    className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground dark:text-slate-300 mb-1">Article Content *</label>
                  <textarea
                    rows={8}
                    required
                    value={editingBlog.content || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    placeholder="Full article content (paragraphs separated by blank lines)..."
                    className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl px-3 py-2 text-foreground dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border dark:border-charcoal-800">
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
                    {submitting ? 'Saving...' : 'Save Article'}
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
