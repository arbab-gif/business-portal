'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { useBusinessAuth } from '@/lib/BusinessAuthStore';
import { DrivingLogo } from '@/components/ui/DrivingLogo';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { currentBusiness } = useBusinessAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = pathname.startsWith('/admin') ? 'admin' : 'business';
  const brandColor = currentBusiness.brandColor || '#6C3BAA';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const PORTALS = [
    {
      value: 'business',
      label: 'School Business Owner',
      desc: currentBusiness.name,
      /* trigger button icon — DrivingLogo in brand colour on white bg */
      icon: <DrivingLogo size={16} color={brandColor} />,
      href: '/business/dashboard',
    },
    {
      value: 'admin',
      label: 'Super Admin',
      desc: 'Full platform management',
      icon: <ShieldCheck size={15} />,
      href: '/admin/dashboard',
    },
  ];

  const active = PORTALS.find(p => p.value === current)!;

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
            <span style={{ color: brandColor }}>{active.icon}</span>
            <span className="text-[13px] font-[600] text-[#222222]">{active.label}</span>
            <ChevronDown size={13} className={`text-[#929292] transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-[#ebebeb] rounded-[14px] shadow-dropdown overflow-hidden z-50">
              {PORTALS.map(p => {
                const isActive = current === p.value;
                return (
                  <button
                    key={p.value}
                    onClick={() => { setOpen(false); router.push(p.href); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f7f7f7] transition-colors cursor-pointer text-left"
                  >
                    {/* Avatar circle */}
                    {p.value === 'business' ? (
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isActive ? brandColor : brandColor + '20',
                          outline: isActive ? `2px solid ${brandColor}` : 'none',
                          outlineOffset: 1,
                        }}
                      >
                        <DrivingLogo size={20} color={isActive ? 'white' : brandColor} />
                      </div>
                    ) : (
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-[#6C3BAA] text-white' : 'bg-[#f2f2f2] text-[#6a6a6a]'
                      }`}>
                        {p.icon}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-[600] text-[#222222]">{p.label}</p>
                      <p className="text-[11px] text-[#929292] truncate">{p.desc}</p>
                    </div>
                    {isActive && <Check size={14} style={{ color: brandColor }} className="flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
