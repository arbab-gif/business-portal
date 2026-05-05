'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Building2, LogOut, CreditCard } from 'lucide-react';

const NAV = [
  { label: 'Students',         href: '/business/students', icon: <Users size={18} /> },
  { label: 'Profile',          href: '/business/profile',  icon: <Building2 size={18} /> },
  { label: 'Billing & Account', href: '/business/billing',  icon: <CreditCard size={18} /> },
];

export function BusinessSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-56 min-h-screen flex flex-col flex-shrink-0" style={{ backgroundColor: '#6C3BAA' }}>

      {/* Logo — matches admin */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-[12px] flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[16px] font-[600] text-white leading-[1.25]">Business Portal</p>
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

      {/* Footer — matches admin */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-[13px] font-[600]">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-[500] text-white truncate">Sarah Mitchell</p>
            <p className="text-[11px] text-white/50 truncate">admin@driveright.co.uk</p>
          </div>
        </div>
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
