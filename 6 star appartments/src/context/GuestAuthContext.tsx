import React, { createContext, useContext, useEffect, useState } from 'react';
import { GuestUser } from '../types';
import { api } from '../services/api';

interface GuestAuthContextValue {
  user: GuestUser | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const GuestAuthContext = createContext<GuestAuthContextValue | undefined>(undefined);
const STORAGE_KEY = '6star_guest_user';

export const GuestAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GuestUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const configured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const signInWithGoogle = async (credential: string) => {
    setLoading(true);
    const result = await api.googleGuestLogin(credential);
    setLoading(false);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user));
      return { success: true };
    }
    return { success: false, error: result.error || 'Google sign-in could not be completed.' };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <GuestAuthContext.Provider value={{ user, loading, configured, signInWithGoogle, logout }}>
      {children}
    </GuestAuthContext.Provider>
  );
};

export const useGuestAuth = () => {
  const context = useContext(GuestAuthContext);
  if (!context) throw new Error('useGuestAuth must be used within GuestAuthProvider');
  return context;
};
