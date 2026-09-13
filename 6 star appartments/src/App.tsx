import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider } from './context/AuthContext';
import { GuestAuthProvider } from './context/GuestAuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { ScrollToTop } from './components/common/ScrollToTop';

// Graceful Luxury Error Boundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('6 STARS Hospitality application notice:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-2xl bg-card border border-border shadow-2xl">
            <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-brand-gold-500/10 border border-brand-gold-500/30 flex items-center justify-center text-brand-gold-500 text-2xl font-serif font-bold">
              6★
            </div>
            <h1 className="text-xl font-serif font-bold text-card-foreground mb-2">Welcome to 6 STARS HOSPITALITY</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We encountered a brief hiccup loading this view. Please refresh your browser or contact our 24/7 concierge directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-brand-gold-500 text-brand-navy-950 font-semibold rounded-lg hover:bg-brand-gold-400 transition-colors text-sm shadow-md"
              >
                Refresh View
              </button>
              <a
                href="https://wa.me/923120893146"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-muted transition-colors text-sm"
              >
                WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Luxury Brand Suspense Fallback Loader
const LuxurySuspenseFallback: React.FC = () => {
  return (
    <div 
      className="min-h-[70vh] w-full flex flex-col items-center justify-center p-8 text-center bg-background transition-colors"
      role="status" 
      aria-live="polite" 
      aria-label="Loading page content"
    >
      <div className="relative mb-5">
        <div className="h-16 w-16 rounded-2xl overflow-hidden bg-[#FAF6EE] p-1 border border-brand-gold-500/50 shadow-xl flex items-center justify-center">
          <img 
            src="./images/logo/WhatsApp Image 2026-09-08 at 6.45.07 PM.jpeg" 
            alt="6 STARS HOSPITALITY" 
            className="w-full h-full object-contain"
            width={64}
            height={64}
          />
        </div>
        <div className="absolute -inset-2 rounded-2xl border-2 border-brand-gold-500/20 border-t-brand-gold-500 animate-spin pointer-events-none" />
      </div>
      <div className="font-serif text-lg font-bold text-foreground tracking-wide">6 STARS HOSPITALITY</div>
      <div className="text-[11px] uppercase tracking-[0.25em] text-brand-gold-600 dark:text-brand-gold-400 mt-1 font-medium">
        The Centaurus • Islamabad
      </div>
    </div>
  );
};

// Public Client Pages (Statically Imported for Zero-Latency First Paint & Unbreakable Reliability)
import { HomePage } from './pages/HomePage';
import { ApartmentsPage } from './pages/ApartmentsPage';
import { ApartmentDetailPage } from './pages/ApartmentDetailPage';
import { QuotationPage } from './pages/QuotationPage';
import { ShowroomsPage } from './pages/ShowroomsPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { GuestAccountPage } from './pages/GuestAccountPage';

// Route Code Splitting - Admin Management Pages
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminLoginPage = React.lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminApartmentsPage = React.lazy(() => import('./pages/admin/AdminApartmentsPage').then(m => ({ default: m.AdminApartmentsPage })));
const AdminShowroomsPage = React.lazy(() => import('./pages/admin/AdminShowroomsPage').then(m => ({ default: m.AdminShowroomsPage })));
const AdminQuotesPage = React.lazy(() => import('./pages/admin/AdminQuotesPage').then(m => ({ default: m.AdminQuotesPage })));
const AdminBlogsPage = React.lazy(() => import('./pages/admin/AdminBlogsPage').then(m => ({ default: m.AdminBlogsPage })));
const AdminInquiriesPage = React.lazy(() => import('./pages/admin/AdminInquiriesPage').then(m => ({ default: m.AdminInquiriesPage })));
const AdminMediaPage = React.lazy(() => import('./pages/admin/AdminMediaPage').then(m => ({ default: m.AdminMediaPage })));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

// Public Layout Wrapper with Navbar & Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-brand-gold-500 selection:text-brand-navy-950 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LuxurySuspenseFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <GuestAuthProvider>
            <SiteProvider>
            <HashRouter>
              <ScrollToTop />
              <ToastContainer />
              <Suspense fallback={<LuxurySuspenseFallback />}>
                <Routes>
                  {/* Public Client Application */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/apartments" element={<ApartmentsPage />} />
                    <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
                    <Route path="/quote" element={<QuotationPage />} />
                    <Route path="/showrooms" element={<ShowroomsPage />} />
                    <Route path="/blogs" element={<BlogPage />} />
                    <Route path="/blogs/:slug" element={<BlogPostPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/account" element={<GuestAccountPage />} />
                  </Route>

                  {/* Admin Management System */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="apartments" element={<AdminApartmentsPage />} />
                    <Route path="showrooms" element={<AdminShowroomsPage />} />
                    <Route path="quotes" element={<AdminQuotesPage />} />
                    <Route path="blogs" element={<AdminBlogsPage />} />
                    <Route path="inquiries" element={<AdminInquiriesPage />} />
                    <Route path="media" element={<AdminMediaPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            </HashRouter>
            </SiteProvider>
          </GuestAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
