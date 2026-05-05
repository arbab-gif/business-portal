import { Sidebar } from '@/components/layout/Sidebar';
import { BusinessStoreProvider } from '@/lib/BusinessStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <BusinessStoreProvider>
      <div className="flex min-h-screen bg-[#f7f7f7]">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </BusinessStoreProvider>
  );
}
