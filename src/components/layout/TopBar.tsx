'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Building2, ChevronDown, Check } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PORTALS = [
  { value: 'business', label: 'Business', desc: 'Manage students & account', icon: <Building2 size={15} />, href: '/business/students' },
  { value: 'admin',    label: 'Admin',    desc: 'Full platform management',  icon: <ShieldCheck size={15} />, href: '/admin/dashboard' },
];

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = pathname.startsWith('/admin') ? 'admin' : 'business';
  const active = PORTALS.find(p => p.value === current)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#ebebeb] px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="min-w-0">
        <h1 className="text-[20px] font-[600] text-[#222222] leading-[1.20] truncate">{title}</h1>
        {subtitle && <p className="text-[13px] text-[#929292] leading-[1.23] truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {actions}

        {/* Portal switcher */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-2 pl-3 pr-2.5 py-2 rounded-[12px] border border-[#ebebeb] bg-white hover:bg-[#f7f7f7] hover:border-[#c1c1c1] transition-colors cursor-pointer"
          >
            <span className="text-[#6C3BAA]">{active.icon}</span>
            <span className="text-[13px] font-[600] text-[#222222]">{active.label}</span>
            <ChevronDown size={13} className={`text-[#929292] transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-[#ebebeb] rounded-[14px] shadow-dropdown overflow-hidden z-50">
              {PORTALS.map(p => (
                <button
                  key={p.value}
                  onClick={() => { setOpen(false); router.push(p.href); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f7f7f7] transition-colors cursor-pointer text-left"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    current === p.value ? 'bg-[#6C3BAA] text-white' : 'bg-[#f2f2f2] text-[#6a6a6a]'
                  }`}>
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-[600] text-[#222222]">{p.label}</p>
                    <p className="text-[11px] text-[#929292] truncate">{p.desc}</p>
                  </div>
                  {current === p.value && <Check size={14} className="text-[#6C3BAA] flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
