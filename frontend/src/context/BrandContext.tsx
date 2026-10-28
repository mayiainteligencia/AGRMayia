import React, { createContext, useContext, useState, useEffect } from 'react';

interface BrandContextType {
  brandHidden: boolean;
  toggleBrand: () => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const STORAGE_KEY_BRAND_HIDDEN = 'agrobotanical_brand_hidden';

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandHidden, setBrandHidden] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_BRAND_HIDDEN) === 'true';
    } catch {
      return false;
    }
  });

  const toggleBrand = () => {
    setBrandHidden(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_BRAND_HIDDEN, next ? 'true' : 'false');
      } catch {
        // storage disabled fallback
      }
      return next;
    });
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_BRAND_HIDDEN) {
        setBrandHidden(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <BrandContext.Provider value={{ brandHidden, toggleBrand }}>
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
