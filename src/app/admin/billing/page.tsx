'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/Table';
import { BUSINESSES } from '@/lib/data';
import {
  ADMIN_INVOICES, BILLING_ALERTS, getBillingSummary,
  type BusinessBillingSummary,
} from '@/lib/adminBillingData';
import {
  PoundSterling, AlertTriangle, XCircle, CheckCircle,
  CreditCard, ChevronRight, Eye, Building2,
} from 'lucide-react';

/* ── helpers ──────────────────────────────────────────────────────────────── */
const fmt  = (n: number) => `£${n.toFixed(2)}`;
const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const STATUS_CFG: Record<string, { label: string; bg: string; text: string }> = {
  paid:    { label: 'Paid',    bg: 'bg-[#e6f4e6]', text: 'text-[#008a05]' },
  overdue: { label: 'Overdue', bg: 'bg-[#fff3cd]', text: 'text-[#c47a00]' },
  failed:  { label: 'Failed',  bg: 'bg-[#fde8e3]', text: 'text-[#c13515]' },
  pending: { label: 'Pending', bg: 'bg-[#f2f2f2]',  text: 'text-[#6a6a6a]' },
};

const ALERT_CFG = {
  payment_failed:   { icon: <XCircle size={15} className="text-[#c13515]" />, bg: 'bg-[#fde8e3]', border: 'border-[#c13515]/20', title: 'text-[#c13515]', msg: 'text-[#7a2008]' },
  payment_declined: { icon: <XCircle size={15} className="text-[#c13515]" />, bg: 'bg-[#fde8e3]', border: 'border-[#c13515]/20', title: 'text-[#c13515]', msg: 'text-[#7a2008]' },
  card_expired:     { icon: <AlertTriangle size={15} className="text-[#c47a00]" />, bg: 'bg-[#fff3cd]', border: 'border-[#c47a00]/20', title: 'text-[#c47a00]', msg: 'text-[#7a4500]' },
  card_expiring:    { icon: <AlertTriangle size={15} className="text-[#c47a00]" />, bg: 'bg-[#fff3cd]', border: 'border-[#c47a00]/20', title: 'text-[#c47a00]', msg: 'text-[#7a4500]' },
  overdue:          { icon: <AlertTriangle size={15} className="text-[#c47a00]" />, bg: 'bg-[#fff3cd]', border: 'border-[#c47a00]/20', title: 'text-[#c47a00]', msg: 'text-[#7a4500]' },
};

/* ── component ────────────────────────────────────────────────────────────── */
export default function AdminBillingPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'issues' | 'clear'>('all');

  // Only show active/suspended businesses (not pending/rejected)
  const billedBusinesses = BUSINESSES.filter(b => b.status === 'active' || b.status === 'suspended');
  const summaries: BusinessBillingSummary[] = billedBusinesses.map(b => getBillingSummary(b.id));

  // ── Aggregate stats ──────────────────────────────────────────────────────
  const totalRevenueThisMonth = ADMIN_INVOICES
    .filter(i => i.status === 'paid' && i.date.startsWith('2026-04'))
    .reduce((s, i) => s + i.amountRaw, 0);

  const totalOutstanding = summaries.reduce((s, b) => s + b.outstanding, 0);
  const failedCount      = summaries.filter(b => b.hasFailedPayment).length;
  const activeCount      = BUSINESSES.filter(b => b.status === 'active').length;
  const alertsCount      = BILLING_ALERTS.length;

  // ── Filter businesses ────────────────────────────────────────────────────
  const filtered = billedBusinesses.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.contactName.toLowerCase().includes(q);
    const sum = getBillingSummary(b.id);
    const hasIssue = sum.hasFailedPayment || sum.hasOverdue;
    const matchFilter = filter === 'all' ? true : filter === 'issues' ? hasIssue : !hasIssue;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <TopBar
        title="Billing & Payments"
        subtitle="Monitor all business accounts, invoices, and payment activity"
      />

      <div className="p-6 space-y-6">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: 'Revenue This Month',
              value: fmt(totalRevenueThisMonth),
              sub: 'April 2026',
              icon: <PoundSterling size={18} />,
              bg: '#e6f4e6', color: '#008a05',
            },
            {
              label: 'Total Outstanding',
              value: fmt(totalOutstanding),
              sub: `Across ${summaries.filter(s => s.outstanding > 0).length} accounts`,
              icon: <AlertTriangle size={18} />,
              bg: '#fff3cd', color: '#c47a00',
            },
            {
              label: 'Failed Payments',
              value: String(failedCount),
              sub: 'Require immediate action',
              icon: <XCircle size={18} />,
              bg: '#fde8e3', color: '#c13515',
            },
            {
              label: 'Active Subscriptions',
              value: String(activeCount),
              sub: 'Businesses billing normally',
              icon: <CheckCircle size={18} />,
              bg: '#ede5f7', color: '#6C3BAA',
            },
          ].map(c => (
            <div key={c.label} className="bg-white border border-[#ebebeb] rounded-[14px] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.bg, color: c.color }}>
                {c.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-[600] text-[#929292] uppercase tracking-[0.32px]">{c.label}</p>
                <p className="text-[22px] font-[700] text-[#222222] leading-[1.2] mt-0.5">{c.value}</p>
                <p className="text-[12px] text-[#929292] mt-0.5">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Billing Alerts ── */}
        {BILLING_ALERTS.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-[#c47a00]" />
              <h2 className="text-[13px] font-[700] text-[#222222] uppercase tracking-[0.4px]">Billing Alerts</h2>
              <span className="w-5 h-5 rounded-full bg-[#fde8e3] text-[#c13515] text-[10px] font-[700] flex items-center justify-center">{alertsCount}</span>
            </div>
            <div className="space-y-2.5">
              {BILLING_ALERTS.map(alert => {
                const cfg = ALERT_CFG[alert.type];
                const biz = BUSINESSES.find(b => b.id === alert.businessId);
                return (
                  <div key={alert.id} className={`flex items-start gap-3 px-4 py-3.5 rounded-[12px] border ${cfg.bg} ${cfg.border}`}>
                    <div className="mt-0.5 flex-shrink-0">{cfg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <p className={`text-[13px] font-[600] ${cfg.title}`}>{alert.title}</p>
                        <span className={`text-[12px] font-[500] ${cfg.title} opacity-80`}>{biz?.name}</span>
                        <span className={`text-[11px] ${cfg.msg} opacity-60 ml-auto flex-shrink-0`}>{fmtDate(alert.date)}</span>
                      </div>
                      <p className={`text-[12px] mt-0.5 leading-[1.6] ${cfg.msg}`}>{alert.message}</p>
                    </div>
                    <Link
                      href={`/admin/businesses/${alert.businessId}?tab=billing`}
                      className={`flex items-center gap-1 text-[12px] font-[600] ${cfg.title} hover:opacity-70 transition-opacity flex-shrink-0 mt-0.5`}
                    >
                      View <ChevronRight size={12} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── All Businesses Billing Table ── */}
        <section>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-[#6a6a6a]" />
              <h2 className="text-[13px] font-[700] text-[#222222] uppercase tracking-[0.4px]">All Accounts</h2>
            </div>
            <SearchBar value={search} onChange={setSearch} placeholder="Search businesses…" />
            <div className="flex items-center gap-1 p-1 bg-white border border-[#ebebeb] rounded-full">
              {([
                { value: 'all',    label: 'All' },
                { value: 'issues', label: 'Has Issues' },
                { value: 'clear',  label: 'Clear' },
              ] as { value: typeof filter; label: string }[]).map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-[500] transition-colors cursor-pointer ${
                    filter === f.value ? 'bg-[#222222] text-white' : 'text-[#6a6a6a] hover:text-[#222222] hover:bg-[#f2f2f2]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <span className="text-[12px] text-[#929292] ml-auto">{filtered.length} accounts</span>
          </div>

          <div className="overflow-x-auto rounded-[14px] border border-[#ebebeb] bg-white">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                  {['Business', 'Package', 'Outstanding', 'Last Payment', 'Billing Status', 'Alerts', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[14px] text-[#929292]">No accounts found.</td>
                  </tr>
                ) : filtered.map((biz, idx) => {
                  const sum = getBillingSummary(biz.id);
                  const sc  = STATUS_CFG[sum.lastInvoiceStatus ?? 'paid'];
                  const hasIssue = sum.hasFailedPayment || sum.hasOverdue;

                  return (
                    <tr key={biz.id} className={`border-b border-[#ebebeb] last:border-b-0 hover:bg-[#fafafa] transition-colors ${idx % 2 !== 0 ? 'bg-[#fafafa]' : ''}`}>
                      {/* Business */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#ede5f7] flex items-center justify-center text-[14px] font-[600] text-[#6C3BAA] flex-shrink-0">
                            {biz.name[0]}
                          </div>
                          <div>
                            <p className="text-[13px] font-[500] text-[#222222]">{biz.name}</p>
                            <p className="text-[12px] text-[#929292]">{biz.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Package */}
                      <td className="px-5 py-3.5">
                        <p className="text-[13px] text-[#222222]">{biz.package}</p>
                        <p className="text-[11px] text-[#929292]">£5 / student</p>
                      </td>
                      {/* Outstanding */}
                      <td className="px-5 py-3.5">
                        <p className={`text-[14px] font-[600] ${sum.outstanding > 0 ? 'text-[#c13515]' : 'text-[#008a05]'}`}>
                          {sum.outstanding > 0 ? fmt(sum.outstanding) : '—'}
                        </p>
                        {sum.outstanding > 0 && (
                          <p className="text-[11px] text-[#c13515]/70">Unpaid balance</p>
                        )}
                      </td>
                      {/* Last payment */}
                      <td className="px-5 py-3.5 text-[13px] text-[#6a6a6a]">
                        {fmtDate(sum.lastPaymentDate)}
                      </td>
                      {/* Billing status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-[600] px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                          {sum.lastInvoiceStatus === 'paid' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                          {sc.label}
                        </span>
                      </td>
                      {/* Alerts */}
                      <td className="px-5 py-3.5">
                        {sum.alertCount > 0 ? (
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-[600] px-2.5 py-1 rounded-full ${hasIssue ? 'bg-[#fde8e3] text-[#c13515]' : 'bg-[#fff3cd] text-[#c47a00]'}`}>
                            <AlertTriangle size={10} />
                            {sum.alertCount} alert{sum.alertCount !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#929292]">None</span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/businesses/${biz.id}?tab=billing`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#dddddd] text-[12px] font-[500] text-[#6a6a6a] hover:text-[#6C3BAA] hover:border-[#6C3BAA] hover:bg-[#faf8ff] transition-colors"
                        >
                          <Eye size={12} /> View Billing
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Recent Transactions ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={14} className="text-[#6a6a6a]" />
            <h2 className="text-[13px] font-[700] text-[#222222] uppercase tracking-[0.4px]">Recent Transactions</h2>
          </div>
          <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                  {['Invoice', 'Business', 'Date', 'Students', 'Amount', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...ADMIN_INVOICES]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 10)
                  .map(inv => {
                    const biz = BUSINESSES.find(b => b.id === inv.businessId);
                    const sc  = STATUS_CFG[inv.status];
                    return (
                      <tr key={inv.id} className="border-b border-[#ebebeb] last:border-b-0 hover:bg-[#fafafa] transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-[6px] bg-[#ede5f7] flex items-center justify-center flex-shrink-0">
                              <CreditCard size={11} className="text-[#6C3BAA]" />
                            </div>
                            <span className="text-[13px] font-[500] text-[#222222]">{inv.number}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[13px] text-[#6a6a6a]">{biz?.name ?? '—'}</td>
                        <td className="px-5 py-3 text-[13px] text-[#6a6a6a] whitespace-nowrap">{fmtDate(inv.date)}</td>
                        <td className="px-5 py-3 text-[13px] text-[#6a6a6a]">{inv.students} × £5</td>
                        <td className="px-5 py-3 text-[13px] font-[600] text-[#222222]">{fmt(inv.amountRaw)}</td>
                        <td className="px-5 py-3">
                          <div>
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-[600] px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                              {inv.status === 'paid' ? <CheckCircle size={9} /> : <AlertTriangle size={9} />}
                              {sc.label}
                            </span>
                            {inv.failedReason && (
                              <p className="text-[10px] text-[#c13515] mt-0.5 max-w-[180px] truncate">{inv.failedReason}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </>
  );
}
