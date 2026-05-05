'use client';

import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export function Table<T>({ columns, data, keyExtractor, onRowClick, emptyMessage = 'No records found.', loading }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-[#ebebeb] bg-white">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px] leading-[1.33] ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-[14px] text-[#929292]">
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-[#6C3BAA]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading…
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-[14px] text-[#929292]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-[#ebebeb] last:border-b-0
                  transition-colors duration-100
                  ${onRowClick ? 'cursor-pointer hover:bg-[#f7f7f7]' : ''}
                  ${idx % 2 === 0 ? '' : 'bg-[#fafafa]'}
                `}
              >
                {columns.map(col => (
                  <td key={col.key} className={`px-4 py-3.5 text-[14px] text-[#222222] leading-[1.43] ${col.className || ''}`}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929292]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2.5 h-[42px] w-full min-w-[240px] text-[14px] text-[#222222] bg-white border border-[#dddddd] rounded-full outline-none focus:border-[#222222] focus:border-2 placeholder:text-[#929292] transition-colors"
      />
    </div>
  );
}
