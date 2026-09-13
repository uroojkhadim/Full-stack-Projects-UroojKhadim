import React, { useEffect, useRef, useState } from 'react';
import { LogIn, LogOut, UserCircle, X } from 'lucide-react';
import { useGuestAuth } from '../../context/GuestAuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void; auto_select?: boolean; cancel_on_tap_outside?: boolean }) => void;
          renderButton: (element: HTMLElement, options: { type: string; theme: string; size: string; text: string; shape: string; width: number }) => void;
          prompt: () => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GuestAuthPanelProps {
  open: boolean;
  onClose: () => void;
}

export const GuestAuthPanel: React.FC<GuestAuthPanelProps> = ({ open, onClose }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { configured, loading, signInWithGoogle } = useGuestAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !configured || !buttonRef.current) return;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    let attempts = 0;
    const setup = () => {
      const google = window.google;
      if (!google || !buttonRef.current) {
        if (attempts++ < 20) window.setTimeout(setup, 250);
        return;
      }
      buttonRef.current.replaceChildren();
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async response => {
          const result = await signInWithGoogle(response.credential);
          if (result.success) onClose();
          else setError(result.error || 'Google sign-in could not be completed.');
        },
        cancel_on_tap_outside: true
      });
      google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 320
      });
      google.accounts.id.prompt();
    };
    setup();
    return () => window.google?.accounts.id.cancel();
  }, [configured, onClose, open, signInWithGoogle]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-navy-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Guest sign in">
      <div className="w-full max-w-md rounded-3xl border border-brand-gold-500/30 bg-card p-6 shadow-2xl dark:bg-brand-navy-900 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold-600 dark:text-brand-gold-400">Guest access</span>
            <h2 className="mt-1 font-heading text-2xl font-extrabold text-card-foreground dark:text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground dark:text-slate-300">Sign in securely to keep your quotation and booking details together.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-muted-foreground hover:bg-muted" aria-label="Close sign in"><X className="h-5 w-5" /></button>
        </div>

        {configured ? (
          <>
            <div ref={buttonRef} className="flex min-h-11 justify-center" />
            {loading && <p className="mt-3 text-center text-xs text-muted-foreground">Verifying your Google account securely...</p>}
            {error && <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-300">{error}</p>}
            <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground">Google handles your authentication. This website never receives or stores your Google password.</p>
          </>
        ) : (
          <div className="rounded-2xl border border-brand-gold-500/25 bg-brand-gold-500/10 p-4 text-sm text-card-foreground dark:text-slate-200">
            Google sign-in is ready but not configured for this deployment. Add <code>VITE_GOOGLE_CLIENT_ID</code> to the environment and restart the app.
          </div>
        )}
      </div>
    </div>
  );
};

export const GuestAccountMenu: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => {
  const { user, logout } = useGuestAuth();
  if (!user) return <button onClick={onSignIn} className="hidden sm:flex items-center gap-1.5 rounded-xl border border-brand-gold-500/40 px-3 py-2 text-xs font-bold text-brand-navy-950 dark:text-white" aria-label="Sign in"><LogIn className="h-3.5 w-3.5" /> Sign in</button>;
  return (
    <div className="hidden sm:flex items-center gap-2">
      {user.picture ? <img src={user.picture} alt="" className="h-8 w-8 rounded-full" width={32} height={32} /> : <UserCircle className="h-8 w-8 text-brand-gold-500" />}
      <button onClick={logout} className="text-xs font-semibold text-muted-foreground hover:text-red-500" title="Logout"><LogOut className="h-4 w-4" /></button>
    </div>
  );
};
