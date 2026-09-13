import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Mail, UserCircle, CalendarCheck } from 'lucide-react';
import { useGuestAuth } from '../context/GuestAuthContext';

export const GuestAccountPage: React.FC = () => {
  const { user, logout } = useGuestAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-4 py-12 sm:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold-600 dark:text-brand-gold-400">Guest account</span>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-foreground dark:text-white sm:text-5xl">Your stay dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground dark:text-slate-300">Keep your guest details close while our concierge team confirms your apartment and stay requirements.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_1.3fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-charcoal-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-4">
            {user.picture ? <img src={user.picture} alt="" className="h-16 w-16 rounded-full" width={64} height={64} /> : <UserCircle className="h-16 w-16 text-brand-gold-500" />}
            <div><h2 className="font-heading text-xl font-bold text-card-foreground dark:text-white">{user.name}</h2><p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3.5 w-3.5" />{user.email}</p></div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="mt-8 flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-500"><LogOut className="h-4 w-4" /> Sign out</button>
        </section>
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm dark:border-charcoal-800 dark:bg-charcoal-900">
          <div className="flex items-center gap-3"><CalendarCheck className="h-5 w-5 text-brand-gold-500" /><h2 className="font-heading text-xl font-bold text-card-foreground dark:text-white">My bookings</h2></div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground dark:text-slate-300">Your confirmed stays and quotation requests will appear here after the concierge team connects them to your account.</p>
          <Link to="/quote" className="mt-6 inline-flex items-center rounded-xl bg-luxury-gold-gradient px-4 py-2.5 text-xs font-bold text-brand-navy-950">Create a quotation</Link>
        </section>
      </div>
    </div>
  );
};
