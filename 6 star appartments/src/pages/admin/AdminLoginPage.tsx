// src/pages/admin/AdminLoginPage.tsx - Administrative Portal Authentication
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Lock, User, ArrowRight, Eye, EyeOff, HelpCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login({ username, password });
    if (res.success) {
      if (rememberMe) {
        localStorage.setItem('6star_remember_admin', 'true');
      }
      navigate('/admin');
    } else {
      setError(res.error || 'Invalid credentials. Please verify your administrative access.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-card rounded-3xl border border-brand-gold-500/40 p-8 sm:p-10 shadow-2xl relative">
        {/* Official Brand Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-brand-navy-950 border border-brand-gold-500/30 p-2 mx-auto flex items-center justify-center mb-4 shadow-xl">
            <img
              src="./images/logo/WhatsApp Image 2026-09-08 at 6.45.07 PM.jpeg"
              alt="6 STARS HOSPITALITY"
              className="w-full h-full object-contain"
              width={96}
              height={96}
            />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-card-foreground">
            6 STARS HOSPITALITY
          </h1>
          <p className="text-xs text-brand-gold-600 dark:text-brand-gold-400 font-semibold uppercase tracking-widest mt-1">
            Executive Administrative Control
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-6 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1.5">Administrative ID / Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username or email"
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground dark:text-white focus:outline-none focus:border-brand-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground dark:text-slate-300 mb-1.5">Security Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background dark:bg-charcoal-950 border border-input dark:border-charcoal-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-foreground dark:text-white focus:outline-none focus:border-brand-gold-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground dark:text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-input text-brand-gold-500 focus:ring-0 cursor-pointer"
              />
              <span>Remember session</span>
            </label>

            <button
              type="button"
              onClick={() => setForgotModal(true)}
              className="text-brand-gold-600 dark:text-brand-gold-400 hover:underline font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <div className="p-3 bg-muted/40 dark:bg-charcoal-950 rounded-xl border border-border dark:border-charcoal-800 text-[11px] text-muted-foreground dark:text-slate-400 mt-2">
            <span className="text-brand-gold-600 dark:text-brand-gold-400 font-semibold">Demo Credentials:</span> Username: <code className="text-foreground dark:text-white">admin</code> | Password: <code className="text-foreground dark:text-white">admin123</code>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 shadow-lg shadow-brand-gold-500/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{submitting ? 'Verifying Security Token...' : 'Access Administration Panel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-brand-gold-600 dark:hover:text-brand-gold-400 transition-colors">
            &larr; Return to Public Website
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card dark:bg-charcoal-900 rounded-3xl p-6 sm:p-8 border border-brand-gold-500/30 max-w-md w-full shadow-2xl space-y-4 text-center">
            <HelpCircle className="w-10 h-10 text-brand-gold-500 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-card-foreground dark:text-white">Administrative Password Recovery</h3>
            <p className="text-xs text-muted-foreground dark:text-slate-400 leading-relaxed">
              For security compliance, credentials can be reset by contacting the Chief Information Officer or via master server access:
            </p>
            <div className="bg-muted/40 dark:bg-charcoal-950 p-3.5 rounded-2xl border border-border dark:border-charcoal-800 text-xs text-muted-foreground dark:text-slate-300 text-left space-y-1">
              <p><span className="text-muted-foreground">Security Email:</span> security@6starhospitality.com</p>
              <p><span className="text-muted-foreground">Helpline:</span> +92 312 0893146</p>
              <p><span className="text-muted-foreground">Default Recovery:</span> admin / admin123</p>
            </div>
            <button
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-charcoal-950 bg-luxury-gold-gradient hover:brightness-110 transition-all"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
