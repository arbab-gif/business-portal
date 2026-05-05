'use client';

import React, { createContext, useContext, useState } from 'react';
import { Business, BUSINESSES } from '@/lib/data';

interface BusinessAuthContextType {
  currentBusiness: Business;
}

const BusinessAuthContext = createContext<BusinessAuthContextType>({
  currentBusiness: BUSINESSES[0],
});

export function BusinessAuthProvider({ children }: { children: React.ReactNode }) {
  // Mock: DriveRight Academy is the logged-in business user
  const [currentBusiness] = useState<Business>(BUSINESSES[0]);

  return (
    <BusinessAuthContext.Provider value={{ currentBusiness }}>
      {children}
    </BusinessAuthContext.Provider>
  );
}

export function useBusinessAuth() {
  return useContext(BusinessAuthContext);
}
