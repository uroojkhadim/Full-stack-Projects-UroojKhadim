// src/context/SiteContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings, Apartment, Category } from '../types';
import { api } from '../services/api';
import { INITIAL_SITE_SETTINGS, INITIAL_APARTMENTS, INITIAL_CATEGORIES } from '../services/mockData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface SiteContextType {
  settings: SiteSettings;
  apartments: Apartment[];
  categories: Category[];
  loading: boolean;
  toasts: ToastState[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [apartments, setApartments] = useState<Apartment[]>(INITIAL_APARTMENTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedSettings, fetchedApartments, fetchedCategories] = await Promise.all([
        api.getSiteSettings(),
        api.getProducts(),
        api.getCategories()
      ]);
      setSettings(fetchedSettings);
      setApartments(fetchedApartments);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to load site data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    const res = await api.updateSiteSettings(newSettings);
    if (res.success) {
      setSettings(prev => ({ ...prev, ...newSettings }));
      addToast('Site settings saved successfully');
      return true;
    } else {
      addToast(res.error || 'Failed to update settings', 'error');
      return false;
    }
  };

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <SiteContext.Provider
      value={{
        settings,
        apartments,
        categories,
        loading,
        toasts,
        addToast,
        removeToast,
        refreshData,
        updateSettings
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
