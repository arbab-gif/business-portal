'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, hint, icon, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[14px] font-[500] text-[#222222] leading-[1.29]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a6a6a]">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`
            w-full bg-white text-[#222222] text-[16px] leading-[1.5]
            border rounded-[12px] px-3 py-[14px] h-14
            placeholder:text-[#929292]
            outline-none transition-colors duration-150
            ${error
              ? 'border-[#c13515] focus:border-[#c13515]'
              : 'border-[#dddddd] focus:border-[#222222] focus:border-2'}
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-[13px] text-[#c13515] leading-[1.23]">{error}</p>}
      {hint && !error && <p className="text-[13px] text-[#6a6a6a] leading-[1.23]">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-[14px] font-[500] text-[#222222] leading-[1.29]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full bg-white text-[#222222] text-[16px] leading-[1.5]
          border rounded-[12px] px-3 py-[14px] h-14
          outline-none transition-colors duration-150 cursor-pointer
          ${error ? 'border-[#c13515]' : 'border-[#dddddd] focus:border-[#222222] focus:border-2'}
          ${className}
        `}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-[13px] text-[#c13515]">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const textId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textId} className="text-[14px] font-[500] text-[#222222] leading-[1.29]">
          {label}
        </label>
      )}
      <textarea
        id={textId}
        className={`
          w-full bg-white text-[#222222] text-[16px] leading-[1.5]
          border rounded-[12px] px-3 py-3 min-h-[100px]
          placeholder:text-[#929292]
          outline-none transition-colors duration-150 resize-y
          ${error ? 'border-[#c13515]' : 'border-[#dddddd] focus:border-[#222222] focus:border-2'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-[13px] text-[#c13515]">{error}</p>}
    </div>
  );
}
