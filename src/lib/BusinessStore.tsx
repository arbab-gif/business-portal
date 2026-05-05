'use client';

import React, { createContext, useContext, useState } from 'react';
import { BUSINESSES, Business } from './data';

interface BusinessStoreCtx {
  businesses: Business[];
  updateBusiness: (id: string, patch: Partial<Business>) => void;
}

const BusinessStore = createContext<BusinessStoreCtx | null>(null);

export function BusinessStoreProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>(BUSINESSES);

  const updateBusiness = (id: string, patch: Partial<Business>) =>
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b));

  return (
    <BusinessStore.Provider value={{ businesses, updateBusiness }}>
      {children}
    </BusinessStore.Provider>
  );
}

export function useBusinessStore() {
  const ctx = useContext(BusinessStore);
  if (!ctx) throw new Error('useBusinessStore must be used inside BusinessStoreProvider');
  return ctx;
}
