'use client';

import React from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Badge } from '@/components/ui/Badge';
import { useBusinessAuth } from '@/lib/BusinessAuthStore';
import { STUDENTS } from '@/lib/data';
import {
  Users, CheckCircle, XCircle,
  CreditCard, ArrowRight, FileText, Activity, Calendar, PoundSterling,
} from 'lucide-react';
import { useBilling } from '@/lib/BillingStore';
import { STUDENT_PROGRESS } from '@/lib/data';

const RECENT_INVOICES = [
  { number: 'INV-2024-0042', date: 'Apr 2024', amount: '£149.00', status: 'paid' as const },
  { number: 'INV-2024-0031', date: 'Mar 2024', amount: '£149.00', status: 'paid' as const },
  { number: 'INV-2023-0097', date: 'Dec 2023', amount: '£149.00', status: 'overdue' as const },
];

export default function BusinessDashboardPage() {
  const { currentBusiness, hasPaymentMethod } = useBusinessAuth();
  const { studentsThisMonth, runningBalance, perStudentCost, nextBillingLabel, cycleStart } = useBilling();

  const myStudents  = STUDENTS.filter(s => s.businessId === currentBusiness.id);
  const active      = myStudents.filter(s => s.status === 'active');
  const suspended   = myStudents.filter(s => s.status === 'suspended');
  const recentStudents = [...myStudents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const avgScore = myStudents.filter(s => s.mockTestAvg != null).length
    ? Math.round(myStudents.reduce((sum, s) => sum + (s.mockTestAvg ?? 0), 0) / myStudents.length)
    : null;


  const brandColor = currentBusiness.brandColor || '#6C3BAA';

  return (
    <>
      <TopBar
        title={`Welcome back, ${currentBusiness.contactName.split(' ')[0]} 👋`}
        subtitle={currentBusiness.name}
      />

      <div className="p-6 space-y-6">

        {/* ── Payment warning banner ── */}
        {!hasPaymentMethod && (
          <div className="flex items-start gap-4 px-5 py-4 bg-[#fffbeb] border border-[#f59e0b]/30 rounded-[14px]">
            <div className="w-9 h-9 rounded-full bg-[#fef3c7] flex items-center justify-center flex-shrink-0">
              <CreditCard size={17} className="text-[#d97706]" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-[600] text-[#92400e]">Payment method required</p>
              <p className="text-[13px] text-[#78350f]/80 mt-0.5">
                Add a payment method to start adding students to your account.
              </p>
            </div>
            <Link
              href="/business/billing"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#d97706] hover:bg-[#b45309] text-white text-[13px] font-[500] rounded-[8px] transition-colors flex-shrink-0"
            >
              <CreditCard size={13} />
              Add Now
            </Link>
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Students',
              value: myStudents.length,
              sub: `${active.length} active`,
              icon: <Users size={18} />,
              color: '#6C3BAA',
              bg: '#ede5f7',
            },
            {
              label: 'Active',
              value: active.length,
              sub: 'Currently enrolled',
              icon: <CheckCircle size={18} />,
              color: '#008a05',
              bg: '#e6f4e6',
            },
            {
              label: 'Suspended',
              value: suspended.length,
              sub: 'Access paused',
              icon: <XCircle size={18} />,
              color: '#c13515',
              bg: '#fde8e3',
            },
          ].map(card => (
            <div key={card.label} className="bg-white border border-[#ebebeb] rounded-[14px] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-[600] text-[#929292] uppercase tracking-[0.32px]">{card.label}</p>
                <p className="text-[24px] font-[700] text-[#222222] leading-[1.2] mt-0.5">{card.value}</p>
                <p className="text-[12px] text-[#929292] mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Current billing cycle ── */}
        <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#ebebeb]">
            <h2 className="text-[15px] font-[600] text-[#222222]">Current Billing Cycle</h2>
            <p className="text-[12px] text-[#929292] mt-0.5">
              {cycleStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} — {nextBillingLabel}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#ebebeb]">
            {/* Students this month */}
            <div className="px-6 py-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-[10px] bg-[#ede5f7] flex items-center justify-center flex-shrink-0">
                <Users size={18} className="text-[#6C3BAA]" />
              </div>
              <div>
                <p className="text-[12px] font-[600] text-[#929292] uppercase tracking-[0.32px]">Students This Month</p>
                <p className="text-[24px] font-[700] text-[#222222] leading-[1.2]">{studentsThisMonth}</p>
                <p className="text-[12px] text-[#929292]">× £{perStudentCost} per student</p>
              </div>
            </div>

            {/* Running balance */}
            <div className="px-6 py-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-[10px] bg-[#e6f4e6] flex items-center justify-center flex-shrink-0">
                <PoundSterling size={18} className="text-[#008a05]" />
              </div>
              <div>
                <p className="text-[12px] font-[600] text-[#929292] uppercase tracking-[0.32px]">Current Balance</p>
                <p className="text-[24px] font-[700] text-[#222222] leading-[1.2]">£{runningBalance.toFixed(2)}</p>
                <p className="text-[12px] text-[#929292]">Outstanding this cycle</p>
              </div>
            </div>

            {/* Next charge */}
            <div className="px-6 py-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-[10px] bg-[#e0f2f7] flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-[#0891b2]" />
              </div>
              <div>
                <p className="text-[12px] font-[600] text-[#929292] uppercase tracking-[0.32px]">Next Charge</p>
                <p className="text-[16px] font-[700] text-[#222222] leading-[1.3]">{nextBillingLabel}</p>
                <p className="text-[12px] text-[#929292]">Auto-charged via saved card</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two column row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent students — 2/3 width */}
          <div className="lg:col-span-2 bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebebeb]">
              <div className="flex items-center gap-2.5">
                <Activity size={16} className="text-[#929292]" />
                <h2 className="text-[15px] font-[600] text-[#222222]">Recent Students</h2>
              </div>
              <Link href="/business/students" className="flex items-center gap-1 text-[13px] text-[#6C3BAA] hover:underline font-[500]">
                View all <ArrowRight size={13} />
              </Link>
            </div>

            {recentStudents.length === 0 ? (
              <div className="px-6 py-12 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f2f2f2] flex items-center justify-center">
                  <Users size={20} className="text-[#929292]" />
                </div>
                <p className="text-[14px] font-[500] text-[#929292]">No students yet</p>
                <Link href="/business/students" className="text-[13px] text-[#6C3BAA] hover:underline font-[500]">
                  Add your first student →
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                    {['Student', 'Mock Test', 'Hazard', 'Category', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((s, i) => {
                    const prog = STUDENT_PROGRESS.find(p => p.studentId === s.id);
                    const mockAvg = s.mockTestAvg ?? null;
                    const hazardAvg = s.hazardScore ?? null;
                    const catAvg = prog?.categories.length
                      ? Math.round(prog.categories.reduce((sum, c) => sum + Math.round((c.correct / c.total) * 100), 0) / prog.categories.length)
                      : null;
                    const barCol = (v: number) => v >= 80 ? '#008a05' : v >= 60 ? '#c47a00' : '#c13515';
                    const MiniBar = ({ value }: { value: number | null }) =>
                      value != null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 bg-[#f2f2f2] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: barCol(value) }} />
                          </div>
                          <span className="text-[12px] font-[500] w-7 text-right flex-shrink-0" style={{ color: barCol(value) }}>{value}%</span>
                        </div>
                      ) : <span className="text-[12px] text-[#929292]">—</span>;
                    return (
                      <tr key={s.id} className={`${i < recentStudents.length - 1 ? 'border-b border-[#ebebeb]' : ''} hover:bg-[#f9f9f9] transition-colors`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-[700] text-white flex-shrink-0" style={{ backgroundColor: brandColor }}>
                              {s.name[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-[500] text-[#222222] truncate">{s.name}</p>
                              <p className="text-[11px] text-[#929292] truncate">{s.vehicleType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><MiniBar value={mockAvg} /></td>
                        <td className="px-5 py-3.5"><MiniBar value={hazardAvg} /></td>
                        <td className="px-5 py-3.5"><MiniBar value={catAvg} /></td>
                        <td className="px-5 py-3.5">
                          <Badge variant={s.status === 'active' ? 'active' : 'suspended'}>
                            {s.status === 'active' ? 'Active' : 'Suspended'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Right column — 1/3 width */}
          <div className="space-y-4">

            {/* Recent billing */}
            <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb]">
                <h2 className="text-[14px] font-[600] text-[#222222]">Recent Invoices</h2>
                <Link href="/business/billing" className="text-[12px] text-[#6C3BAA] hover:underline font-[500]">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-[#ebebeb]">
                {RECENT_INVOICES.map(inv => (
                  <div key={inv.number} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-[13px] font-[500] text-[#222222]">{inv.number}</p>
                      <p className="text-[11px] text-[#929292]">{inv.date}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] font-[600] text-[#222222]">{inv.amount}</span>
                      <span className={`text-[11px] font-[600] px-2 py-0.5 rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-[#e6f4e6] text-[#008a05]'
                          : 'bg-[#fde8e3] text-[#c13515]'
                      }`}>
                        {inv.status === 'paid' ? 'Paid' : 'Overdue'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
