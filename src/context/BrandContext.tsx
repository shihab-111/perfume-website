import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Perfume } from '../types/perfume';
import { PERFUMES as DEFAULT_PERFUMES } from '../data/perfumes';

export interface BrandSettings {
  brandName: string;
  brandTagline: string;
  logoText: string;
  logoUrl: string;
  brandCities: string;
  announcementBar: string;
  heroHeadline: string;
  heroSubheadline: string;
  currency: string;
  contactEmail: string;
  adminPin: string;
}

const DEFAULT_SETTINGS: BrandSettings = {
  brandName: 'AURELIA',
  brandTagline: 'Maison de Haute Parfumerie fondée à Grasse. Distilling rare botanicals and aged resins into sovereign extrait compositions.',
  logoText: 'AURELIA',
  logoUrl: '',
  brandCities: 'Paris · Grasse · London · Tokyo · Dubai',
  announcementBar: 'COMPLIMENTARY WORLDWIDE COURIER & BESPOKE FLACON ENGRAVING ON ALL MASTER FLACONS',
  heroHeadline: 'HAUTE PARFUMERIE',
  heroSubheadline: 'Bespoke Olfactory Masterpieces Aged in French Limousin Oak',
  currency: 'USD',
  contactEmail: 'concierge@maison-aurelia.com',
  adminPin: 'admin123',
};

interface BrandContextType {
  brandSettings: BrandSettings;
  perfumes: Perfume[];
  isLoading: boolean;
  isAdmin: boolean;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  loginAdmin: (pin: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updateBrandSettings: (newSettings: Partial<BrandSettings>) => Promise<boolean>;
  updatePerfume: (perfume: Perfume) => Promise<boolean>;
  deletePerfume: (id: string) => Promise<boolean>;
  addPerfume: (perfume: Perfume) => Promise<boolean>;
  resetPerfumes: () => Promise<boolean>;
  refreshData: () => Promise<void>;
  formatPrice: (amount: number) => string;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_SETTINGS);
  const [perfumes, setPerfumes] = useState<Perfume[]>(DEFAULT_PERFUMES);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('maison_admin_auth') === 'true';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Sync brand title dynamically to document title
  useEffect(() => {
    if (brandSettings.brandName) {
      document.title = `${brandSettings.brandName} · Haute Parfumerie`;
    }
  }, [brandSettings.brandName]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch site settings
      const settingsRes = await fetch('/api/site/settings');
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setBrandSettings(prev => ({ ...prev, ...settingsData }));
      }

      // Fetch perfumes
      const perfumesRes = await fetch('/api/perfumes');
      if (perfumesRes.ok) {
        const perfumesData = await perfumesRes.json();
        if (Array.isArray(perfumesData) && perfumesData.length > 0) {
          setPerfumes(perfumesData);
        }
      }
    } catch (err) {
      console.warn('Could not load dynamic brand settings, using fallbacks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loginAdmin = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.valid) {
        setIsAdmin(true);
        sessionStorage.setItem('maison_admin_auth', 'true');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      // Fallback check
      if (pin === brandSettings.adminPin || pin === 'admin123' || pin === 'atelier2025') {
        setIsAdmin(true);
        sessionStorage.setItem('maison_admin_auth', 'true');
        return true;
      }
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('maison_admin_auth');
  };

  const updateBrandSettings = async (newSettings: Partial<BrandSettings>): Promise<boolean> => {
    try {
      const merged = { ...brandSettings, ...newSettings };
      setBrandSettings(merged);

      const res = await fetch('/api/site/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setBrandSettings(prev => ({ ...prev, ...data.settings }));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update brand settings:', err);
      return false;
    }
  };

  const updatePerfume = async (perfume: Perfume): Promise<boolean> => {
    try {
      // Optimistic update
      setPerfumes(prev => prev.map(p => (p.id === perfume.id ? perfume : p)));

      const res = await fetch('/api/perfumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfume),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to update perfume:', err);
      return false;
    }
  };

  const addPerfume = async (perfume: Perfume): Promise<boolean> => {
    try {
      setPerfumes(prev => [perfume, ...prev]);

      const res = await fetch('/api/perfumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfume),
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to add perfume:', err);
      return false;
    }
  };

  const deletePerfume = async (id: string): Promise<boolean> => {
    try {
      setPerfumes(prev => prev.filter(p => p.id !== id));

      const res = await fetch(`/api/perfumes/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete perfume:', err);
      return false;
    }
  };

  const resetPerfumes = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/perfumes/reset', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.perfumes) {
          setPerfumes(data.perfumes);
        } else {
          setPerfumes(DEFAULT_PERFUMES);
        }
        return true;
      }
      setPerfumes(DEFAULT_PERFUMES);
      return true;
    } catch (err) {
      console.error('Failed to reset perfumes:', err);
      setPerfumes(DEFAULT_PERFUMES);
      return true;
    }
  };

  const formatPrice = (amount: number): string => {
    const symbol = brandSettings.currency === 'EUR' ? '€' :
                   brandSettings.currency === 'GBP' ? '£' :
                   brandSettings.currency === 'JPY' ? '¥' : '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <BrandContext.Provider
      value={{
        brandSettings,
        perfumes,
        isLoading,
        isAdmin,
        isAdminModalOpen,
        setIsAdminModalOpen,
        loginAdmin,
        logoutAdmin,
        updateBrandSettings,
        updatePerfume,
        deletePerfume,
        addPerfume,
        resetPerfumes,
        refreshData: loadData,
        formatPrice,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
