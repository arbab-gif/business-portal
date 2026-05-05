'use client';

import React, { createContext, useContext, useState } from 'react';
import { Business, BUSINESSES } from '@/lib/data';

interface BusinessAuthContextType {
  currentBusiness: Business;
  hasPaymentMethod: boolean;
  setPaymentMethodAdded: () => void;
  updateBusiness: (patch: Partial<Business>) => void;
}

const BusinessAuthContext = createContext<BusinessAuthContextType>({
  currentBusiness: BUSINESSES[0],
  hasPaymentMethod: BUSINESSES[0].hasPaymentMethod ?? false,
  setPaymentMethodAdded: () => {},
  updateBusiness: () => {},
});

export function BusinessAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentBusiness, setCurrentBusiness] = useState<Business>(BUSINESSES[0]);
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean>(
    currentBusiness.hasPaymentMethod ?? false
  );

  const setPaymentMethodAdded = () => setHasPaymentMethod(true);
  const updateBusiness = (patch: Partial<Business>) =>
    setCurrentBusiness(prev => ({ ...prev, ...patch }));

  return (
    <BusinessAuthContext.Provider value={{ currentBusiness, hasPaymentMethod, setPaymentMethodAdded, updateBusiness }}>
      {children}
    </BusinessAuthContext.Provider>
  );
}

export function useBusinessAuth() {
  return useContext(BusinessAuthContext);
}
