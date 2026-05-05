'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import {
  FileText, Download, AlertTriangle,
  CheckCircle, ChevronRight, XCircle,
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: string;
  status: 'paid' | 'overdue' | 'pending';
  description: string;
}

interface BillingWarning {
  id: string;
  type: 'payment_failed' | 'card_expired' | 'card_expiring';
  title: string;
  message: string;
  date: string;
}

const INVOICES: Invoice[] = [
  { id: 'inv-001', number: 'INV-2024-0042', date: '2024-04-01', dueDate: '2024-04-15', amount: '£149.00', status: 'paid',    description: 'Monthly Plan — April 2024' },
  { id: 'inv-002', number: 'INV-2024-0031', date: '2024-03-01', dueDate: '2024-03-15', amount: '£149.00', status: 'paid',    description: 'Monthly Plan — March 2024' },
  { id: 'inv-003', number: 'INV-2024-0019', date: '2024-02-01', dueDate: '2024-02-15', amount: '£149.00', status: 'paid',    description: 'Monthly Plan — February 2024' },
  { id: 'inv-004', number: 'INV-2024-0008', date: '2024-01-01', dueDate: '2024-01-15', amount: '£149.00', status: 'paid',    description: 'Monthly Plan — January 2024' },
  { id: 'inv-005', number: 'INV-2023-0097', date: '2023-12-01', dueDate: '2023-12-15', amount: '£149.00', status: 'overdue', description: 'Monthly Plan — December 2023' },
  { id: 'inv-006', number: 'INV-2023-0084', date: '2023-11-01', dueDate: '2023-11-15', amount: '£149.00', status: 'paid',    description: 'Monthly Plan — November 2023' },
];

const WARNINGS: BillingWarning[] = [
  {
    id: 'warn-001',
    type: 'payment_failed',
    title: 'Payment Failed',
    message: 'Your payment of £149.00 on 1 Dec 2023 could not be processed. Please update your payment method to avoid service interruption.',
    date: '1 Dec 2023',
  },
  {
    id: 'warn-002',
    type: 'card_expiring',
    title: 'Card Expiring Soon',
    message: 'Your Visa card ending in 4242 expires in June 2024. Update your payment method to ensure uninterrupted service.',
    date: '15 Apr 2024',
  },
];


const warningConfig: Record<BillingWarning['type'], { icon: React.ReactNode; bg: string; border: string; titleColor: string; msgColor: string }> = {
  payment_failed: {
    icon: <XCircle size={20} className="text-[#c13515] flex-shrink-0 mt-0.5" />,
    bg: 'bg-[#fde8e3]', border: 'border-[#c13515]/20',
    titleColor: 'text-[#c13515]', msgColor: 'text-[#c13515]/80',
  },
  card_expired: {
    icon: <AlertTriangle size={20} className="text-[#c47a00] flex-shrink-0 mt-0.5" />,
    bg: 'bg-[#fff3cd]', border: 'border-[#c47a00]/20',
    titleColor: 'text-[#c47a00]', msgColor: 'text-[#c47a00]/80',
  },
  card_expiring: {
    icon: <AlertTriangle size={20} className="text-[#c47a00] flex-shrink-0 mt-0.5" />,
    bg: 'bg-[#fff3cd]', border: 'border-[#c47a00]/20',
    titleColor: 'text-[#c47a00]', msgColor: 'text-[#c47a00]/80',
  },
};

export default function BillingPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (inv: Invoice) => {
    setDownloading(inv.id);
    setTimeout(() => setDownloading(null), 1200);
  };

  const activeWarnings = WARNINGS;
  const paidCount  = INVOICES.filter(i => i.status === 'paid').length;

  return (
    <>
      <TopBar
        title="Billing & Account"
        subtitle="Invoices, payments and billing alerts"
      />

      <div className="p-6 space-y-6">

        {/* ── Billing Warnings ── */}
        {activeWarnings.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-[#c47a00]" />
              <h2 className="text-[14px] font-[700] text-[#222222] uppercase tracking-[0.32px]">Billing Warnings</h2>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#fde8e3] text-[#c13515] text-[11px] font-[700]">
                {activeWarnings.length}
              </span>
            </div>

            <div className="space-y-3">
              {activeWarnings.map(w => {
                const cfg = warningConfig[w.type];
                return (
                  <div key={w.id} className={`flex items-start gap-4 p-5 rounded-[14px] border ${cfg.bg} ${cfg.border}`}>
                    {cfg.icon}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <p className={`text-[14px] font-[600] ${cfg.titleColor}`}>{w.title}</p>
                        <span className={`text-[12px] ${cfg.msgColor}`}>{w.date}</span>
                      </div>
                      <p className={`text-[13px] mt-1 leading-[1.6] ${cfg.msgColor}`}>{w.message}</p>
                      <button className={`mt-3 inline-flex items-center gap-1.5 text-[13px] font-[600] ${cfg.titleColor} hover:opacity-80 transition-opacity cursor-pointer`}>
                        Update payment method <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Invoice History ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-[#6a6a6a]" />
              <h2 className="text-[14px] font-[700] text-[#222222] uppercase tracking-[0.32px]">Invoice History</h2>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-[#008a05]" />
              <span className="text-[13px] text-[#6a6a6a]">{paidCount} paid invoices</span>
            </div>
          </div>

          <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                  {['Invoice', 'Date', 'Amount', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv, idx) => (
                  <tr
                    key={inv.id}
                    className={`border-b border-[#ebebeb] last:border-b-0 hover:bg-[#f7f7f7] transition-colors ${idx % 2 !== 0 ? 'bg-[#fafafa]' : ''}`}
                  >
                    {/* Invoice number */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[8px] bg-[#ede5f7] flex items-center justify-center flex-shrink-0">
                          <FileText size={14} className="text-[#6C3BAA]" />
                        </div>
                        <span className="text-[13px] font-[600] text-[#222222]">{inv.number}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 text-[13px] text-[#6a6a6a] whitespace-nowrap">
                      {new Date(inv.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-3.5 text-[14px] font-[600] text-[#222222]">{inv.amount}</td>

                    {/* Download */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDownload(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#dddddd] text-[12px] font-[500] text-[#6a6a6a] hover:border-[#6C3BAA] hover:text-[#6C3BAA] hover:bg-[#f7f4fc] transition-colors cursor-pointer"
                      >
                        {downloading === inv.id ? (
                          <>
                            <div className="w-3 h-3 border-2 border-[#6C3BAA] border-t-transparent rounded-full animate-spin" />
                            Downloading…
                          </>
                        ) : (
                          <>
                            <Download size={12} />
                            PDF
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

      </div>
    </>
  );
}
