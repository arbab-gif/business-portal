'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  dividerBefore?: boolean;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  align?: 'left' | 'right';
}

const variantStyles: Record<NonNullable<DropdownItem['variant']>, string> = {
  default: 'text-[#222222] hover:bg-[#f2f2f2]',
  danger:  'text-[#c13515] hover:bg-[#fde8e3]',
  warning: 'text-[#c47a00] hover:bg-[#fff8e1]',
  success: 'text-[#008a05] hover:bg-[#e6f4e6]',
};

export function DropdownMenu({ items, align = 'right' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#ebebeb] text-[#6a6a6a] hover:bg-[#f2f2f2] hover:text-[#222222] transition-colors cursor-pointer"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1.5 z-50 bg-white border border-[#ebebeb] rounded-[12px] py-1.5 min-w-[180px] ${align === 'right' ? 'right-0' : 'left-0'}`}
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          {items.map((item, i) => (
            <React.Fragment key={i}>
              {item.dividerBefore && <div className="my-1.5 border-t border-[#ebebeb]" />}
              <button
                onClick={() => { item.onClick(); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-[500] transition-colors cursor-pointer ${variantStyles[item.variant ?? 'default']}`}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
