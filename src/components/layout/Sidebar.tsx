'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  Users,
  CreditCard,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'All Businesses',
    href: '/admin/businesses',
    icon: <Building2 size={18} />,
  },
  {
    label: 'Applications',
    href: '/admin/businesses/applications',
    icon: <ClipboardCheck size={18} />,
    badge: 2,
  },
  {
    label: 'All Students',
    href: '/admin/students',
    icon: <Users size={18} />,
  },
  {
    label: 'Billing',
    href: '/admin/billing',
    icon: <CreditCard size={18} />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href ||
    (href !== '/admin/businesses' && href !== '/admin/billing' && pathname.startsWith(href + '/')) ||
    (href === '/admin/businesses' && pathname === '/admin/businesses');

  return (
    <aside className="w-56 min-h-screen flex flex-col flex-shrink-0" style={{ backgroundColor: '#6C3BAA' }}>
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-[12px] flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[16px] font-[600] text-white leading-[1.25]">Super Admin</p>
            <p className="text-[11px] text-white/50 leading-[1.18]">Business Management</p>
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
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className={`text-[10px] font-[700] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                isActive(item.href) ? 'bg-white/30 text-white' : 'bg-white/20 text-white'
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13px] text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
