// src/components/admin/AdminLayout.tsx - 6 STARS HOSPITALITY Executive Admin Layout
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase,
  FileText, 
  MessageSquare, 
  BookOpen, 
  Image as ImageIcon,
  Settings, 
  LogOut, 
  ExternalLink,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { adminUser, isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-muted-foreground flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-brand-gold-500 animate-spin mr-3" />
        <span>Authenticating Admin Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Apartments & Suites', path: '/admin/apartments', icon: Building2 },
    { label: 'Showrooms & Offices', path: '/admin/showrooms', icon: Briefcase },
    { label: 'Quotations', path: '/admin/quotes', icon: FileText },
    { label: 'Guides & Articles', path: '/admin/blogs', icon: BookOpen },
    { label: 'Contact Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-navy-950 p-1 border border-brand-gold-500/40 shrink-0">
            <img
              src="./images/logo/WhatsApp Image 2026-09-08 at 6.45.07 PM.jpeg"
              alt="6 STARS"
              className="w-full h-full object-contain"
              width={32}
              height={32}
            />
          </div>
          <span className="font-heading font-extrabold text-sm text-card-foreground">6 STARS ADMIN</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-muted text-card-foreground border border-border"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside className={`
        ${mobileOpen ? 'block' : 'hidden'} md:flex
        w-full md:w-64 bg-card border-r border-border flex-col justify-between shrink-0 z-40
      `}>
        <div>
          {/* Brand Crest Header */}
          <div className="p-5 border-b border-border hidden md:flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-navy-950 p-1 border border-brand-gold-500/40 shrink-0 shadow-md">
                <img
                  src="./images/logo/WhatsApp Image 2026-09-08 at 6.45.07 PM.jpeg"
                  alt="6 STARS HOSPITALITY"
                  className="w-full h-full object-contain"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <span className="font-heading font-extrabold text-sm text-card-foreground block leading-tight">6 STARS ADMIN</span>
                <p className="text-[10px] text-brand-gold-600 dark:text-brand-gold-400 font-semibold uppercase tracking-wider">Hospitality Control</p>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const active = item.path === '/admin' 
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-gold-500 text-charcoal-950 font-bold shadow-sm'
                      : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/60'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User & Actions */}
        <div className="p-4 border-t border-border space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-card-foreground hover:bg-muted transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-gold-500" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-gold-500/15 border border-brand-gold-500/40 flex items-center justify-center text-xs font-bold text-brand-gold-600 dark:text-brand-gold-400">
                A
              </div>
              <div className="text-xs">
                <p className="font-bold text-card-foreground">{adminUser?.username || 'Administrator'}</p>
                <p className="text-[10px] text-brand-gold-600 dark:text-brand-gold-400 capitalize">{adminUser?.role || 'Superadmin'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto max-w-7xl w-full">
        <React.Suspense fallback={
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full border-2 border-brand-gold-500 border-t-transparent animate-spin mb-3" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Loading Executive Module...</p>
          </div>
        }>
          <Outlet />
        </React.Suspense>
      </main>
    </div>
  );
};
