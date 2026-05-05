'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Building2, LogOut, CreditCard, LayoutDashboard } from 'lucide-react';
import { useBusinessAuth } from '@/lib/BusinessAuthStore';
import { DrivingLogo } from '@/components/ui/DrivingLogo';

const NAV = [
  { label: 'Dashboard', href: '/business/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Students',  href: '/business/students',  icon: <Users size={18} /> },
  { label: 'Billing',   href: '/business/billing',   icon: <CreditCard size={18} /> },
  { label: 'Profile',   href: '/business/profile',   icon: <Building2 size={18} /> },
];

export function BusinessSidebar() {
  const pathname = usePathname();
  const { currentBusiness } = useBusinessAuth();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const brandColor = currentBusiness.brandColor || '#6C3BAA';

  return (
    <aside className="w-56 min-h-screen flex flex-col flex-shrink-0" style={{ backgroundColor: brandColor }}>

      {/* Business logo / name */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          {/* Always show the Driving Logo SVG in white — sits on the brand-colour background */}
          <div className="w-9 h-9 bg-white/15 rounded-[10px] flex items-center justify-center flex-shrink-0">
            <DrivingLogo size={22} color="white" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-[600] text-white leading-[1.25] truncate">{currentBusiness.name}</p>
            <p className="text-[11px] text-white/50 leading-[1.18]">Student Management</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-[500] leading-[1.43]
              transition-colors duration-150
              ${isActive(item.href)
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'}
            `}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <Link
          href="/login"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
