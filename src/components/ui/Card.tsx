'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white border border-[#ebebeb] rounded-[14px]
        ${paddingMap[padding]}
        ${hover ? 'hover:shadow-card transition-shadow duration-200 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const colorMap = {
  default: { bg: 'bg-[#f2f2f2]', text: 'text-[#222222]', icon: 'text-[#6a6a6a]' },
  primary: { bg: 'bg-[#ede5f7]', text: 'text-[#6C3BAA]', icon: 'text-[#6C3BAA]' },
  success: { bg: 'bg-[#e6f4e6]', text: 'text-[#008a05]', icon: 'text-[#008a05]' },
  warning: { bg: 'bg-[#fff3cd]', text: 'text-[#c47a00]', icon: 'text-[#c47a00]' },
  danger:  { bg: 'bg-[#fde8e3]', text: 'text-[#c13515]', icon: 'text-[#c13515]' },
};

export function StatCard({ title, value, subtitle, icon, trend, color = 'default' }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-[14px] font-[500] text-[#6a6a6a] leading-[1.43] mb-1">{title}</p>
        <p className="text-[28px] font-[700] text-[#222222] leading-[1.43]">{value}</p>
        {subtitle && <p className="text-[13px] text-[#929292] mt-1">{subtitle}</p>}
        {trend && (
          <p className={`text-[13px] mt-1 font-[500] ${trend.value >= 0 ? 'text-[#008a05]' : 'text-[#c13515]'}`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </p>
        )}
      </div>
      {icon && (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.bg} ${colors.icon}`}>
          {icon}
        </div>
      )}
    </Card>
  );
}
