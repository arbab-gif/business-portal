'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { STUDENTS, STUDENT_PROGRESS, Student } from '@/lib/data';
import {
  ArrowLeft, CheckCircle, XCircle, TrendingUp,
  ClipboardList, AlertTriangle, BookOpen, Target,
  Mail, Calendar, Package,
  Trash2, UserX, UserCheck, KeyRound,
} from 'lucide-react';

type Tab = 'mock' | 'hazard' | 'categories';

const MOCK_PASS   = 43; const MOCK_TOTAL   = 50;
const HAZARD_PASS = 44; const HAZARD_TOTAL = 75;

const pct        = (n: number, total: number) => Math.round((n / total) * 100);
const scoreColor = (score: number, pass: number) =>
  score >= pass ? '#008a05' : score >= pass * 0.85 ? '#c47a00' : '#c13515';

export default function AdminStudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('mock');

  const [student, setStudent] = useState<Student | undefined>(
    () => STUDENTS.find(s => s.id === id)
  );

  // reset password
  const [resetOpen, setResetOpen]       = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent]       = useState(false);

  // suspend account
  const [suspendOpen, setSuspendOpen]     = useState(false);
  const [suspendLoading, setSuspendLoading] = useState(false);

  // delete
  const [deleteOpen, setDeleteOpen]       = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const progress = STUDENT_PROGRESS.find(p => p.studentId === id);

  if (!student) {
    return (
      <>
        <TopBar title="Student Not Found" />
        <div className="p-6">
          <Link href="/admin/students" className="inline-flex items-center gap-1.5 text-[14px] text-[#6C3BAA] hover:underline">
            <ArrowLeft size={14} /> Back to Students
          </Link>
        </div>
      </>
    );
  }

  const mockTests   = (progress?.mockTests   ?? []).slice(0, 10);
  const hazardTests = (progress?.hazardTests ?? []).slice(0, 10);
  const categories  = (progress?.categories  ?? []).slice(0, 10);

  const latestMock      = mockTests[0]?.score ?? null;
  const mockAvg         = mockTests.length ? Math.round(mockTests.reduce((s, t) => s + t.score, 0) / mockTests.length) : null;
  const mockPassCount   = mockTests.filter(t => t.passed).length;
  const mockPassRate    = mockTests.length ? Math.round((mockPassCount / mockTests.length) * 100) : null;
  const latestHazard    = hazardTests[0]?.score ?? null;
  const hazardPassCount = hazardTests.filter(t => t.passed).length;

  const TABS: { value: Tab; label: string; count: number }[] = [
    { value: 'mock',       label: 'Mock Test Results',  count: mockTests.length },
    { value: 'hazard',     label: 'Hazard Perception',  count: hazardTests.length },
    { value: 'categories', label: 'Category Summary',   count: categories.length },
  ];

  const handleResetPassword = async () => {
    setResetLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setResetLoading(false);
    setResetSent(true);
  };

  const handleSuspendToggle = async () => {
    setSuspendLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const newStatus = student.status === 'active' ? 'suspended' : 'active';
    setStudent(prev => prev ? { ...prev, status: newStatus as 'active' | 'suspended' } : prev);
    setSuspendLoading(false);
    setSuspendOpen(false);
    showToast(
      newStatus === 'suspended' ? `${student.name} account suspended.` : `${student.name} account reactivated.`,
      newStatus === 'active'
    );
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setDeleteLoading(false);
    setDeleteOpen(false);
    router.push('/admin/students');
  };

  return (
    <>
      <TopBar title={`${student.name} — Detail`} subtitle="Admin view · Full student record" />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-[10px] shadow-lg text-white text-[13px] font-[500] ${toast.ok ? 'bg-[#1a1a1a]' : 'bg-[#c13515]'}`}>
          {toast.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <div className="p-6 space-y-5">

        {/* Back */}
        <Link href="/admin/students" className="inline-flex items-center gap-1.5 text-[14px] text-[#6a6a6a] hover:text-[#222222] transition-colors">
          <ArrowLeft size={14} /> Back to Students
        </Link>

        {/* Header + Account Details — single container */}
        <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
          <div className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#ede5f7] flex items-center justify-center text-[20px] font-[700] text-[#6C3BAA] flex-shrink-0">
              {student.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-[20px] font-[600] text-[#222222]">{student.name}</p>
                <Badge variant={student.status === 'active' ? 'active' : 'suspended'}>
                  {student.status === 'active' ? 'Active' : 'Suspended'}
                </Badge>
              </div>
              <p className="text-[14px] text-[#929292] mt-0.5">{student.email} · {student.vehicleType}</p>
            </div>
            <DropdownMenu items={[
              { label: 'Reset Password', icon: <KeyRound size={14} />,  onClick: () => { setResetSent(false); setResetOpen(true); } },
              student.status === 'active'
                ? { label: 'Suspend Account', icon: <UserX size={14} />,    onClick: () => setSuspendOpen(true), variant: 'warning' as const, dividerBefore: true }
                : { label: 'Reactivate',      icon: <UserCheck size={14} />, onClick: () => setSuspendOpen(true), variant: 'success' as const, dividerBefore: true },
              { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => setDeleteOpen(true), variant: 'danger' as const, dividerBefore: true },
            ]} />
          </div>

          <div className="border-t border-[#ebebeb]" />

          <div className="p-5">
            <h2 className="text-[13px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px] mb-4">Account Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {[
                { icon: <Mail     size={14} className="text-[#6a6a6a]" />, label: 'Email',        value: student.email },
                { icon: <Package  size={14} className="text-[#6a6a6a]" />, label: 'Vehicle Type', value: student.vehicleType },
                { icon: <Calendar size={14} className="text-[#6a6a6a]" />, label: 'Enrolled',     value: student.createdAt },
                { icon: <Calendar size={14} className="text-[#6a6a6a]" />, label: 'Last Active',  value: student.lastActive ?? '—' },
              ].map(d => (
                <div key={d.label} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">{d.icon}</div>
                  <div>
                    <p className="text-[11px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px] mb-0.5">{d.label}</p>
                    <p className="text-[14px] text-[#222222]">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Latest Mock Score',   value: latestMock   != null ? `${latestMock}/${MOCK_TOTAL}`     : '—', sub: latestMock   != null ? (latestMock   >= MOCK_PASS   ? 'Pass' : 'Fail') : 'No data', ok: latestMock   != null && latestMock   >= MOCK_PASS,   icon: <ClipboardList size={18} />, color: 'primary' },
            { label: 'Mock Test Avg',       value: mockAvg      != null ? `${pct(mockAvg, MOCK_TOTAL)}%`    : '—', sub: mockAvg      != null ? `${mockAvg}/${MOCK_TOTAL} avg`                    : 'No data', ok: mockAvg      != null && mockAvg      >= MOCK_PASS,   icon: <TrendingUp    size={18} />, color: 'warning' },
            { label: 'Mock Pass Rate',      value: mockPassRate != null ? `${mockPassRate}%`                : '—', sub: `${mockPassCount} of ${mockTests.length} passed`,                                   ok: mockPassRate != null && mockPassRate >= 50,            icon: <Target        size={18} />, color: 'success' },
            { label: 'Latest Hazard Score', value: latestHazard != null ? `${latestHazard}/${HAZARD_TOTAL}` : '—', sub: latestHazard != null ? (latestHazard >= HAZARD_PASS ? 'Pass' : 'Fail') : 'No data', ok: latestHazard != null && latestHazard >= HAZARD_PASS, icon: <AlertTriangle size={18} />, color: 'danger'  },
          ].map(card => (
            <div key={card.label} className="bg-white border border-[#ebebeb] rounded-[14px] p-5 flex items-start justify-between">
              <div>
                <p className="text-[13px] font-[500] text-[#6a6a6a] mb-1">{card.label}</p>
                <p className="text-[26px] font-[700] text-[#222222] leading-none">{card.value}</p>
                <p className={`text-[12px] mt-1.5 font-[500] ${card.ok ? 'text-[#008a05]' : 'text-[#929292]'}`}>{card.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${{
                primary: 'bg-[#ede5f7] text-[#6C3BAA]',
                warning: 'bg-[#fff3cd] text-[#c47a00]',
                success: 'bg-[#e6f4e6] text-[#008a05]',
                danger:  'bg-[#fde8e3] text-[#c13515]',
              }[card.color]}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white border border-[#ebebeb] rounded-full w-fit">
          {TABS.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-[500] transition-colors cursor-pointer flex items-center gap-1.5 ${
                tab === t.value ? 'bg-[#222222] text-white' : 'text-[#6a6a6a] hover:text-[#222222] hover:bg-[#f2f2f2]'
              }`}
            >
              {t.label} <span className={`text-[11px] ${tab === t.value ? 'opacity-70' : 'opacity-60'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Mock Test Results */}
        {tab === 'mock' && (
          <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#ebebeb] flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-[600] text-[#222222]">Mock Test Results</h2>
                <p className="text-[12px] text-[#929292] mt-0.5">Pass mark: {MOCK_PASS}/{MOCK_TOTAL} · Last {mockTests.length} attempts</p>
              </div>
              <div className="flex items-center gap-3 text-[12px]">
                <span className="flex items-center gap-1 text-[#008a05] font-[500]"><CheckCircle size={12} /> {mockPassCount} passed</span>
                <span className="flex items-center gap-1 text-[#c13515] font-[500]"><XCircle size={12} /> {mockTests.length - mockPassCount} failed</span>
              </div>
            </div>
            {mockTests.length === 0 ? (
              <div className="px-5 py-16 text-center text-[14px] text-[#929292]">No mock test data yet.</div>
            ) : (
              <div className="px-5 py-5 space-y-3.5">
                {mockTests.map((t, i) => {
                  const p = pct(t.score, MOCK_TOTAL); const col = scoreColor(t.score, MOCK_PASS);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-[#f2f2f2] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p}%`, backgroundColor: col }} />
                      </div>
                      <span className="text-[13px] font-[600] w-14 text-right flex-shrink-0" style={{ color: col }}>{t.score}/{MOCK_TOTAL}</span>
                      <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-[600] flex-shrink-0 ${t.passed ? 'bg-[#e6f4e6] text-[#008a05]' : 'bg-[#fde8e3] text-[#c13515]'}`}>
                        {t.passed ? <CheckCircle size={10} /> : <XCircle size={10} />} {t.passed ? 'Pass' : 'Fail'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Hazard Perception */}
        {tab === 'hazard' && (
          <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#ebebeb] flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-[600] text-[#222222]">Hazard Perception Results</h2>
                <p className="text-[12px] text-[#929292] mt-0.5">Pass mark: {HAZARD_PASS}/{HAZARD_TOTAL} · Last {hazardTests.length} attempts</p>
              </div>
              <div className="flex items-center gap-3 text-[12px]">
                <span className="flex items-center gap-1 text-[#008a05] font-[500]"><CheckCircle size={12} /> {hazardPassCount} passed</span>
                <span className="flex items-center gap-1 text-[#c13515] font-[500]"><XCircle size={12} /> {hazardTests.length - hazardPassCount} failed</span>
              </div>
            </div>
            {hazardTests.length === 0 ? (
              <div className="px-5 py-16 text-center text-[14px] text-[#929292]">No hazard test data yet.</div>
            ) : (
              <div className="px-5 py-5 space-y-3.5">
                {hazardTests.map((t, i) => {
                  const p = pct(t.score, HAZARD_TOTAL); const col = scoreColor(t.score, HAZARD_PASS);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-[#f2f2f2] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p}%`, backgroundColor: col }} />
                      </div>
                      <span className="text-[13px] font-[600] w-14 text-right flex-shrink-0" style={{ color: col }}>{t.score}/{HAZARD_TOTAL}</span>
                      <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-[600] flex-shrink-0 ${t.passed ? 'bg-[#e6f4e6] text-[#008a05]' : 'bg-[#fde8e3] text-[#c13515]'}`}>
                        {t.passed ? <CheckCircle size={10} /> : <XCircle size={10} />} {t.passed ? 'Pass' : 'Fail'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Category Summary */}
        {tab === 'categories' && (
          <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#ebebeb]">
              <h2 className="text-[16px] font-[600] text-[#222222]">Category Summary</h2>
              <p className="text-[12px] text-[#929292] mt-0.5">Performance breakdown across all question categories</p>
            </div>
            {categories.length === 0 ? (
              <div className="px-5 py-16 text-center text-[14px] text-[#929292]">No category data yet.</div>
            ) : (
              <div className="p-5 space-y-4">
                {categories.map(cat => {
                  const p = pct(cat.correct, cat.total); const col = p >= 80 ? '#008a05' : p >= 60 ? '#c47a00' : '#c13515';
                  return (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen size={13} className="text-[#6a6a6a] flex-shrink-0" />
                          <span className="text-[14px] font-[500] text-[#222222]">{cat.category}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-[13px] text-[#929292]">{cat.correct}/{cat.total} correct</span>
                          <span className="text-[14px] font-[700] w-10 text-right" style={{ color: col }}>{p}%</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-[#f2f2f2] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p}%`, backgroundColor: col }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Reset Password Modal ── */}
      <Modal open={resetOpen} onClose={() => !resetLoading && setResetOpen(false)} title="Reset Student Password" size="sm"
        footer={
          resetSent
            ? <Button onClick={() => setResetOpen(false)}>Done</Button>
            : <><Button variant="secondary" onClick={() => setResetOpen(false)} disabled={resetLoading}>Cancel</Button><Button onClick={handleResetPassword} loading={resetLoading} className="flex items-center gap-1.5"><KeyRound size={14} /> Send Reset Link</Button></>
        }
      >
        {resetSent ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#e6f4e6] flex items-center justify-center"><CheckCircle size={28} className="text-[#008a05]" /></div>
            <p className="text-[16px] font-[600] text-[#222222]">Reset link sent!</p>
            <p className="text-[13px] text-[#929292] mt-1">Sent to <span className="font-[500] text-[#222222]">{student.email}</span></p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-[#ede5f7] border border-[#6C3BAA]/20 rounded-[12px]">
              <KeyRound size={18} className="text-[#6C3BAA] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#6C3BAA]/80 leading-[1.6]">A password reset link will be sent to the student's email. Expires in 24 hours.</p>
            </div>
            <div className="p-3.5 bg-[#f9f9f9] border border-[#ebebeb] rounded-[10px] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ede5f7] flex items-center justify-center text-[15px] font-[700] text-[#6C3BAA] flex-shrink-0">{student.name[0]}</div>
              <div><p className="text-[14px] font-[600] text-[#222222]">{student.name}</p><p className="text-[13px] text-[#929292]">{student.email}</p></div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Suspend Account Modal ── */}
      <Modal open={suspendOpen} onClose={() => !suspendLoading && setSuspendOpen(false)} title={student.status === 'active' ? 'Suspend Account' : 'Reactivate Account'} size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSuspendOpen(false)} disabled={suspendLoading}>Cancel</Button>
            <Button
              variant={student.status === 'active' ? 'secondary' : 'primary'}
              onClick={handleSuspendToggle}
              loading={suspendLoading}
              className={student.status === 'active' ? '!text-[#c47a00] !border-[#c47a00]/40' : ''}
            >
              {student.status === 'active' ? 'Yes, Suspend' : 'Yes, Reactivate'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className={`flex items-start gap-3 p-4 rounded-[12px] border ${student.status === 'active' ? 'bg-[#fff8e1] border-[#c47a00]/20' : 'bg-[#e6f4e6] border-[#008a05]/20'}`}>
            {student.status === 'active'
              ? <UserX size={18} className="text-[#c47a00] flex-shrink-0 mt-0.5" />
              : <UserCheck size={18} className="text-[#008a05] flex-shrink-0 mt-0.5" />}
            <p className={`text-[13px] leading-[1.6] ${student.status === 'active' ? 'text-[#c47a00]' : 'text-[#008a05]'}`}>
              {student.status === 'active'
                ? 'Suspending this account will block the student from accessing the platform. You can reactivate at any time.'
                : 'Reactivating this account will restore the student\'s full access to the platform.'}
            </p>
          </div>
          <div className="p-3.5 bg-[#f9f9f9] border border-[#ebebeb] rounded-[10px] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ede5f7] flex items-center justify-center text-[15px] font-[700] text-[#6C3BAA] flex-shrink-0">{student.name[0]}</div>
            <div><p className="text-[14px] font-[600] text-[#222222]">{student.name}</p><p className="text-[13px] text-[#929292]">{student.email}</p></div>
            <Badge variant={student.status === 'active' ? 'active' : 'suspended'} className="ml-auto">{student.status}</Badge>
          </div>
        </div>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal open={deleteOpen} onClose={() => !deleteLoading && setDeleteOpen(false)} title="Delete Student" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleteOpen(false)} disabled={deleteLoading}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={deleteLoading}>Delete Student</Button></>}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-[#fde8e3] border border-[#c13515]/20 rounded-[12px]">
            <Trash2 size={18} className="text-[#c13515] flex-shrink-0 mt-0.5" />
            <div><p className="text-[14px] font-[600] text-[#c13515] mb-1">This action cannot be undone</p><p className="text-[13px] text-[#c13515]/80 leading-[1.6]">All progress data and account information will be permanently removed.</p></div>
          </div>
          <div className="p-3.5 bg-[#f9f9f9] border border-[#ebebeb] rounded-[10px] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ede5f7] flex items-center justify-center text-[15px] font-[700] text-[#6C3BAA] flex-shrink-0">{student.name[0]}</div>
            <div><p className="text-[14px] font-[600] text-[#222222]">{student.name}</p><p className="text-[13px] text-[#929292]">{student.email} · {student.vehicleType}</p></div>
          </div>
        </div>
      </Modal>
    </>
  );
}
