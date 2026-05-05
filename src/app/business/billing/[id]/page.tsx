'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useBusinessAuth } from '@/lib/BusinessAuthStore';
import { PAST_INVOICES, PER_STUDENT_COST } from '@/lib/invoiceData';
import { DrivingLogo } from '@/components/ui/DrivingLogo';
import { ArrowLeft, Printer, CheckCircle, XCircle } from 'lucide-react';

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentBusiness } = useBusinessAuth();

  const inv = PAST_INVOICES.find(i => i.id === id);
  if (!inv) notFound();

  const brandColor   = currentBusiness.brandColor || '#6C3BAA';
  const isPaid       = inv.status === 'paid';

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const subtotal = inv.amountRaw;
  const vat      = 0;
  const total    = subtotal + vat;

  return (
    <>
      {/* ── Toolbar (hidden on print) ── */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-[#ebebeb] px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href="/business/billing"
          className="flex items-center gap-2 text-[13px] font-[500] text-[#6a6a6a] hover:text-[#222222] transition-colors"
        >
          <ArrowLeft size={15} /> Back to Billing
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-[12px] font-[600] px-3 py-1 rounded-full ${
              isPaid ? 'bg-[#e6f4e6] text-[#008a05]' : 'bg-[#fde8e3] text-[#c13515]'
            }`}
          >
            {isPaid ? <CheckCircle size={11} /> : <XCircle size={11} />}
            {isPaid ? 'Paid' : 'Overdue'}
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-[10px] text-white text-[13px] font-[500] transition-colors cursor-pointer"
            style={{ backgroundColor: brandColor }}
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* ── Invoice sheet ── */}
      <div className="min-h-screen bg-[#f5f5f5] print:bg-white py-10 print:py-0 px-4 print:px-0">
        <div className="mx-auto max-w-[760px] bg-white rounded-[20px] print:rounded-none shadow-lg print:shadow-none overflow-hidden">

          {/* ── Colour bar ── */}
          <div className="h-2 w-full" style={{ backgroundColor: brandColor }} />

          {/* ── Header ── */}
          <div className="px-12 pt-10 pb-8 flex items-start justify-between gap-6">
            {/* Left — brand */}
            <div className="flex items-center gap-3">
              {currentBusiness.logoUrl ? (
                <img src={currentBusiness.logoUrl} alt={currentBusiness.name} className="w-12 h-12 rounded-[12px] object-cover" />
              ) : (
                <div
                  className="w-12 h-12 rounded-[12px] flex items-center justify-center"
                  style={{ backgroundColor: brandColor }}
                >
                  <DrivingLogo size={26} color="white" />
                </div>
              )}
              <div>
                <p className="text-[18px] font-[700] text-[#1a1a1a] leading-[1.2]">{currentBusiness.name}</p>
                <p className="text-[12px] text-[#929292] mt-0.5">{currentBusiness.email}</p>
                <p className="text-[12px] text-[#929292]">{currentBusiness.phone}</p>
              </div>
            </div>

            {/* Right — invoice title */}
            <div className="text-right">
              <p className="text-[32px] font-[800] tracking-tight" style={{ color: brandColor }}>INVOICE</p>
              <p className="text-[14px] font-[600] text-[#1a1a1a] mt-1">{inv.number}</p>
            </div>
          </div>

          {/* ── Address + meta grid ── */}
          <div className="px-12 pb-8 grid grid-cols-2 gap-8">
            {/* From */}
            <div>
              <p className="text-[10px] font-[700] uppercase tracking-[0.6px] mb-2" style={{ color: brandColor }}>From</p>
              <p className="text-[13px] font-[600] text-[#1a1a1a]">{currentBusiness.name}</p>
              <p className="text-[12px] text-[#6a6a6a] mt-0.5 leading-[1.7] whitespace-pre-line">{currentBusiness.address || '—'}</p>
            </div>

            {/* Invoice details */}
            <div className="space-y-2">
              {[
                { label: 'Invoice No.',  value: inv.number },
                { label: 'Issue Date',   value: fmt(inv.date) },
                { label: 'Due Date',     value: fmt(inv.dueDate) },
                ...(inv.paidDate ? [{ label: 'Paid On', value: fmt(inv.paidDate) }] : []),
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <span className="text-[12px] text-[#929292] font-[500]">{row.label}</span>
                  <span className="text-[12px] font-[600] text-[#1a1a1a]">{row.value}</span>
                </div>
              ))}
              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 text-[12px] font-[600] px-3 py-1 rounded-full ${
                    isPaid ? 'bg-[#e6f4e6] text-[#008a05]' : 'bg-[#fde8e3] text-[#c13515]'
                  }`}
                >
                  {isPaid ? <CheckCircle size={11} /> : <XCircle size={11} />}
                  {isPaid ? 'Paid' : 'Overdue'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Line items ── */}
          <div className="mx-12 mb-8 rounded-[14px] overflow-hidden border border-[#ebebeb]">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: brandColor }}>
                  {['Description', 'Qty', 'Unit Price', 'Amount'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-[700] uppercase tracking-[0.4px] text-white">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#ebebeb]">
                  <td className="px-5 py-4">
                    <p className="text-[14px] font-[600] text-[#1a1a1a]">Student Portal Access</p>
                    <p className="text-[12px] text-[#929292] mt-0.5">
                      Monthly subscription —{' '}
                      {new Date(inv.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-[14px] text-[#1a1a1a]">{inv.students}</td>
                  <td className="px-5 py-4 text-[14px] text-[#1a1a1a]">£{PER_STUDENT_COST}.00</td>
                  <td className="px-5 py-4 text-[14px] font-[600] text-[#1a1a1a]">{inv.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Totals ── */}
          <div className="px-12 pb-10 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#6a6a6a]">Subtotal</span>
                <span className="font-[500] text-[#1a1a1a]">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#6a6a6a]">VAT (0%)</span>
                <span className="font-[500] text-[#1a1a1a]">£{vat.toFixed(2)}</span>
              </div>
              <div className="h-px bg-[#ebebeb] my-1" />
              <div className="flex justify-between text-[15px] font-[700]">
                <span style={{ color: brandColor }}>Total</span>
                <span style={{ color: brandColor }}>£{total.toFixed(2)}</span>
              </div>
              {isPaid && inv.paidDate && (
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#008a05]">Paid on {fmt(inv.paidDate)}</span>
                  <CheckCircle size={13} className="text-[#008a05]" />
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-12 py-6 border-t border-[#ebebeb] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <DrivingLogo size={18} color={brandColor} />
              <span className="text-[12px] text-[#929292]">{currentBusiness.name} · Student Portal</span>
            </div>
            <p className="text-[11px] text-[#c0c0c0]">Thank you for your business.</p>
          </div>

          {/* ── Bottom colour bar ── */}
          <div className="h-1.5 w-full" style={{ backgroundColor: brandColor }} />
        </div>
      </div>
    </>
  );
}
