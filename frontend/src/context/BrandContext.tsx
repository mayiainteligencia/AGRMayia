import React, { createContext, useContext, useState, useEffect } from 'react';

export type BrandMode = 'normal' | 'hidden' | 'alianza';

interface BrandContextType {
  brandHidden: boolean;
  brandMode: BrandMode;
  toggleBrand: () => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const STORAGE_KEY_BRAND_HIDDEN = 'agrobotanical_brand_hidden';

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandMode, setBrandMode] = useState<BrandMode>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY_BRAND_HIDDEN);
      return v === 'hidden' || v === 'alianza' ? v : 'normal';
    } catch {
      return 'normal';
    }
  });

  // Doble clic cicla: logo → oculto → alianza AGR × Northbay → logo
  const toggleBrand = () => {
    setBrandMode(prev => {
      const next: BrandMode = prev === 'normal' ? 'hidden' : prev === 'hidden' ? 'alianza' : 'normal';
      try {
        localStorage.setItem(STORAGE_KEY_BRAND_HIDDEN, next);
      } catch {
        // storage disabled fallback
      }
      return next;
    });
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_BRAND_HIDDEN) {
        setBrandMode(e.newValue === 'hidden' || e.newValue === 'alianza' ? e.newValue : 'normal');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <BrandContext.Provider value={{ brandHidden: brandMode === 'hidden', brandMode, toggleBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error('useBrand debe ser usado dentro de BrandProvider');
  }
  return ctx;
};
