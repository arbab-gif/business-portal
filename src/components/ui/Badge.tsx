'use client';

import React from 'react';

type BadgeVariant = 'active' | 'suspended' | 'pending' | 'rejected' | 'inactive' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  active:    'bg-[#e6f4e6] text-[#008a05]',
  suspended: 'bg-[#fff3cd] text-[#c47a00]',
  pending:   'bg-[#e3f0ff] text-[#0066cc]',
  rejected:  'bg-[#fde8e3] text-[#c13515]',
  inactive:  'bg-[#f2f2f2] text-[#6a6a6a]',
  success:   'bg-[#e6f4e6] text-[#008a05]',
  warning:   'bg-[#fff3cd] text-[#c47a00]',
  danger:    'bg-[#fde8e3] text-[#c13515]',
  info:      'bg-[#e3f0ff] text-[#0066cc]',
  neutral:   'bg-[#f2f2f2] text-[#6a6a6a]',
};

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold leading-[1.18] ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusDot({ status }: { status: BadgeVariant }) {
  const dots: Record<BadgeVariant, string> = {
    active:    'bg-[#008a05]',
    suspended: 'bg-[#c47a00]',
    pending:   'bg-[#0066cc]',
    rejected:  'bg-[#c13515]',
    inactive:  'bg-[#929292]',
    success:   'bg-[#008a05]',
    warning:   'bg-[#c47a00]',
    danger:    'bg-[#c13515]',
    info:      'bg-[#0066cc]',
    neutral:   'bg-[#929292]',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${dots[status]}`} />;
}
