'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-[#6C3BAA] text-white hover:bg-[#e00b41] disabled:bg-[#ffd1da] disabled:cursor-not-allowed',
  secondary: 'bg-white text-[#222222] border border-[#222222] hover:bg-[#f7f7f7] disabled:opacity-50 disabled:cursor-not-allowed',
  tertiary:  'bg-transparent text-[#222222] hover:underline disabled:opacity-50 disabled:cursor-not-allowed',
  danger:    'bg-[#c13515] text-white hover:bg-[#b32505] disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:     'bg-transparent text-[#222222] hover:bg-[#f2f2f2] disabled:opacity-50 disabled:cursor-not-allowed',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-[14px] px-4 py-2 h-9',
  md: 'text-[16px] px-6 py-[14px] h-12',
  lg: 'text-[16px] px-8 py-4 h-14',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-[500] rounded-[12px]
        transition-colors duration-150 cursor-pointer select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
}
