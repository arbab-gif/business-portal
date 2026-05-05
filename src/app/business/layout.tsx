import React from 'react';
import { BusinessAuthProvider } from '@/lib/BusinessAuthStore';
import { BillingProvider } from '@/lib/BillingStore';
import { BusinessSidebar } from '@/components/layout/BusinessSidebar';

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <BusinessAuthProvider>
      <BillingProvider>
        <div className="flex min-h-screen bg-[#f7f7f7]">
          <BusinessSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </BillingProvider>
    </BusinessAuthProvider>
  );
}
