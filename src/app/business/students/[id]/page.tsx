'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { Input, Select } from '@/components/ui/Input';
import { STUDENTS, STUDENT_PROGRESS, Student } from '@/lib/data';
import { ProgressTabs } from '@/components/ui/ProgressTabs';
import {
  ArrowLeft, CheckCircle, XCircle, TrendingUp,
  ClipboardList, AlertTriangle, Target,
  Mail, Calendar, Package, Pencil, AlertCircle, Trash2, UserX, UserCheck, KeyRound,
} from 'lucide-react';

const MOCK_PASS   = 43; const MOCK_TOTAL   = 50;
const HAZARD_PASS = 44; const HAZARD_TOTAL = 75;

const pct        = (n: number, total: number) => Math.round((n / total) * 100);

const VEHICLE_TYPES = [
  { value: 'Car',                     label: 'Car' },
  { value: 'Motorbike',               label: 'Motorbike' },
  { value: 'HGV',                     label: 'HGV' },
  { value: 'CPC Certification',       label: 'CPC Certification' },
  { value: 'HGV + CPC Certification', label: 'HGV + CPC Certification' },
];

export default function StudentProgressPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  // local editable copy of the student
  const [student, setStudent] = useState<Student | undefined>(
    () => STUDENTS.find(s => s.id === id)
  );

  // edit modal
  const [editOpen, setEditOpen]   = useState(false);
  const [editForm, setEditForm]   = useState({ name: '', email: '', vehicleType: '' });
  const [editSaving, setEditSaving] = useState(false);

  // vehicle-type confirmation
  const [vtConfirmOpen, setVtConfirmOpen]   = useState(false);
  const [pendingVehicleType, setPendingVehicleType] = useState('');

  // reset password
  const [resetOpen, setResetOpen]       = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent]       = useState(false);

  // deactivate / reactivate
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [statusLoading, setStatusLoading]         = useState(false);

  // delete
  const [deleteOpen, setDeleteOpen]     = useState(false);
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
          <Link href="/business/students" className="inline-flex items-center gap-1.5 text-[14px] text-[#6C3BAA] hover:underline">
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

  /* ── open edit modal ── */
  const openEdit = () => {
    setEditForm({ name: student.name, email: student.email, vehicleType: student.vehicleType });
    setEditOpen(true);
  };

  /* ── save edits ── */
  const handleSave = async () => {
    // if vehicle type changed, ask for confirmation first
    if (editForm.vehicleType !== student.vehicleType) {
      setPendingVehicleType(editForm.vehicleType);
      setVtConfirmOpen(true);
      return;
    }
    await commitSave(editForm.vehicleType);
  };

  const commitSave = async (vehicleType: string) => {
    setEditSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setStudent(prev => prev ? { ...prev, name: editForm.name.trim(), email: editForm.email.trim(), vehicleType } : prev);
    setEditSaving(false);
    setEditOpen(false);
    setVtConfirmOpen(false);
    showToast('Student profile updated successfully.');
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setResetLoading(false);
    setResetSent(true);
  };

  const handleStatusToggle = async () => {
    if (!student) return;
    setStatusLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const newStatus = student.status === 'active' ? 'suspended' : 'active';
    setStudent(prev => prev ? { ...prev, status: newStatus as 'active' | 'suspended' } : prev);
    setStatusLoading(false);
    setStatusConfirmOpen(false);
    showToast(newStatus === 'suspended' ? `${student.name} suspended.` : `${student.name} reactivated.`, newStatus === 'active');
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setDeleteLoading(false);
    setDeleteOpen(false);
    router.push('/business/students');
  };

  return (
    <>
      <TopBar
        title={`${student.name} — Progress`}
        subtitle="View-only · Last 10 results per test type"
      />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-[10px] shadow-lg text-white text-[13px] font-[500] transition-all ${toast.ok ? 'bg-[#1a1a1a]' : 'bg-[#c13515]'}`}>
          {toast.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <div className="p-6 space-y-5">

        {/* Back */}
        <Link
          href="/business/students"
          className="inline-flex items-center gap-1.5 text-[14px] text-[#6a6a6a] hover:text-[#222222] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Students
        </Link>

        {/* Student header + Account Details — single container */}
        <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">

          {/* Top row: avatar, name, actions */}
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
              { label: 'Edit Profile',    icon: <Pencil size={14} />,   onClick: openEdit },
              { label: 'Reset Password', icon: <KeyRound size={14} />,  onClick: () => { setResetSent(false); setResetOpen(true); } },
              student.status === 'active'
                ? { label: 'Suspend Account', icon: <UserX size={14} />,    onClick: () => setStatusConfirmOpen(true), variant: 'warning' as const, dividerBefore: true }
                : { label: 'Reactivate',      icon: <UserCheck size={14} />, onClick: () => setStatusConfirmOpen(true), variant: 'success' as const, dividerBefore: true },
              { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => setDeleteOpen(true), variant: 'danger' as const, dividerBefore: true },
            ]} />
          </div>

          {/* Divider */}
          <div className="border-t border-[#ebebeb]" />

          {/* Account Details */}
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
            { label: 'Latest Mock Score',   value: latestMock   != null ? `${latestMock}/${MOCK_TOTAL}`      : '—', sub: latestMock   != null ? (latestMock   >= MOCK_PASS   ? 'Pass' : 'Fail') : 'No data', ok: latestMock   != null && latestMock   >= MOCK_PASS,   icon: <ClipboardList size={18} />, color: 'primary' },
            { label: 'Mock Test Avg',       value: mockAvg      != null ? `${pct(mockAvg, MOCK_TOTAL)}%`     : '—', sub: mockAvg      != null ? `${mockAvg}/${MOCK_TOTAL} avg`                    : 'No data', ok: mockAvg      != null && mockAvg      >= MOCK_PASS,   icon: <TrendingUp    size={18} />, color: 'warning' },
            { label: 'Mock Pass Rate',      value: mockPassRate != null ? `${mockPassRate}%`                 : '—', sub: `${mockPassCount} of ${mockTests.length} passed`,                                   ok: mockPassRate != null && mockPassRate >= 50,            icon: <Target        size={18} />, color: 'success' },
            { label: 'Latest Hazard Score', value: latestHazard != null ? `${latestHazard}/${HAZARD_TOTAL}`  : '—', sub: latestHazard != null ? (latestHazard >= HAZARD_PASS ? 'Pass' : 'Fail') : 'No data', ok: latestHazard != null && latestHazard >= HAZARD_PASS, icon: <AlertTriangle size={18} />, color: 'danger'  },
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

        <ProgressTabs
          mockTests={mockTests}
          hazardTests={hazardTests}
          categories={categories}
        />

      </div>

      {/* ── Edit Profile Modal ── */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Student Profile"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditOpen(false)} disabled={editSaving}>Cancel</Button>
            <Button onClick={handleSave} loading={editSaving}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Student full name"
          />
          <Input
            label="Email Address"
            type="email"
            value={editForm.email}
            onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
            placeholder="student@email.com"
          />
          <Select
            label="Vehicle Type"
            value={editForm.vehicleType}
            onChange={e => setEditForm(p => ({ ...p, vehicleType: e.target.value }))}
            options={VEHICLE_TYPES}
          />
          {editForm.vehicleType !== student.vehicleType && (
            <div className="flex items-start gap-2.5 p-3 bg-[#fff8e1] border border-[#f0c040] rounded-[10px]">
              <AlertCircle size={15} className="text-[#c47a00] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#c47a00] leading-[1.5]">
                You're changing the vehicle type from <strong>{student.vehicleType}</strong> to <strong>{editForm.vehicleType}</strong>. A confirmation will be required before saving.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* ── Vehicle Type Confirmation Modal ── */}
      <Modal
        open={vtConfirmOpen}
        onClose={() => setVtConfirmOpen(false)}
        title="Confirm Vehicle Type Change"
        footer={
          <>
            <Button variant="secondary" onClick={() => setVtConfirmOpen(false)} disabled={editSaving}>Cancel</Button>
            <Button onClick={() => commitSave(pendingVehicleType)} loading={editSaving}>Yes, Update</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Info banner */}
          <div className="flex items-start gap-3 p-4 bg-[#ede5f7] border border-[#6C3BAA]/20 rounded-[12px]">
            <AlertCircle size={18} className="text-[#6C3BAA] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-[600] text-[#6C3BAA] mb-1">What does this change?</p>
              <p className="text-[13px] text-[#6C3BAA]/80 leading-[1.6]">
                Changing the vehicle type updates which test category this student is assigned to. Their existing progress data (mock tests, hazard tests, category results) was recorded under the previous type and will remain unchanged.
              </p>
            </div>
          </div>

          {/* Before / After */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#f9f9f9] border border-[#ebebeb] rounded-[10px]">
              <p className="text-[11px] font-[700] text-[#929292] uppercase tracking-[0.32px] mb-1">Current Type</p>
              <p className="text-[14px] font-[600] text-[#222222]">{student.vehicleType}</p>
            </div>
            <div className="p-3.5 bg-[#ede5f7] border border-[#6C3BAA]/20 rounded-[10px]">
              <p className="text-[11px] font-[700] text-[#6C3BAA]/60 uppercase tracking-[0.32px] mb-1">New Type</p>
              <p className="text-[14px] font-[600] text-[#6C3BAA]">{pendingVehicleType}</p>
            </div>
          </div>

          <p className="text-[13px] text-[#929292]">Are you sure you want to proceed with this change?</p>
        </div>
      </Modal>

      {/* ── Reset Password Modal ── */}
      <Modal
        open={resetOpen}
        onClose={() => !resetLoading && setResetOpen(false)}
        title="Reset Student Password"
        size="sm"
        footer={
          resetSent ? (
            <Button onClick={() => setResetOpen(false)}>Done</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setResetOpen(false)} disabled={resetLoading}>Cancel</Button>
              <Button onClick={handleResetPassword} loading={resetLoading} className="flex items-center gap-1.5">
                <KeyRound size={14} /> Send Reset Link
              </Button>
            </>
          )
        }
      >
        {resetSent ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#e6f4e6] flex items-center justify-center">
                <CheckCircle size={28} className="text-[#008a05]" />
              </div>
              <div>
                <p className="text-[16px] font-[600] text-[#222222]">Reset link sent!</p>
                <p className="text-[13px] text-[#929292] mt-1">
                  A password reset email has been sent to <span className="font-[500] text-[#222222]">{student.email}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-[#ede5f7] border border-[#6C3BAA]/20 rounded-[12px]">
              <KeyRound size={18} className="text-[#6C3BAA] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#6C3BAA]/80 leading-[1.6]">
                A password reset link will be sent to the student's email address. The link expires in 24 hours.
              </p>
            </div>
            <div className="p-3.5 bg-[#f9f9f9] border border-[#ebebeb] rounded-[10px] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ede5f7] flex items-center justify-center text-[15px] font-[700] text-[#6C3BAA] flex-shrink-0">
                {student.name[0]}
              </div>
              <div>
                <p className="text-[14px] font-[600] text-[#222222]">{student.name}</p>
                <p className="text-[13px] text-[#929292]">{student.email}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Deactivate / Reactivate Modal ── */}
      <Modal
        open={statusConfirmOpen}
        onClose={() => !statusLoading && setStatusConfirmOpen(false)}
        title={student.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setStatusConfirmOpen(false)} disabled={statusLoading}>Cancel</Button>
            <Button
              variant={student.status === 'active' ? 'secondary' : 'primary'}
              onClick={handleStatusToggle}
              loading={statusLoading}
              className={student.status === 'active' ? '!text-[#c47a00] !border-[#c47a00]/40' : ''}
            >
              {student.status === 'active' ? 'Yes, Deactivate' : 'Yes, Reactivate'}
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
                ? 'Deactivating this student will suspend their access. You can reactivate them at any time.'
                : 'Reactivating this student will restore their access immediately.'}
            </p>
          </div>
          <div className="p-3.5 bg-[#f9f9f9] border border-[#ebebeb] rounded-[10px] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ede5f7] flex items-center justify-center text-[15px] font-[700] text-[#6C3BAA] flex-shrink-0">
              {student.name[0]}
            </div>
            <div>
              <p className="text-[14px] font-[600] text-[#222222]">{student.name}</p>
              <p className="text-[13px] text-[#929292]">{student.email}</p>
            </div>
            <Badge variant={student.status === 'active' ? 'active' : 'suspended'} className="ml-auto">
              {student.status}
            </Badge>
          </div>
        </div>
      </Modal>

      {/* ── Delete Student Modal ── */}
      <Modal
        open={deleteOpen}
        onClose={() => !deleteLoading && setDeleteOpen(false)}
        title="Delete Student"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)} disabled={deleteLoading}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteLoading}>Delete Student</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-[#fde8e3] border border-[#c13515]/20 rounded-[12px]">
            <Trash2 size={18} className="text-[#c13515] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-[600] text-[#c13515] mb-1">This action cannot be undone</p>
              <p className="text-[13px] text-[#c13515]/80 leading-[1.6]">
                All progress data, test results, and account information for this student will be permanently removed.
              </p>
            </div>
          </div>
          <div className="p-3.5 bg-[#f9f9f9] border border-[#ebebeb] rounded-[10px] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ede5f7] flex items-center justify-center text-[15px] font-[700] text-[#6C3BAA] flex-shrink-0">
              {student.name[0]}
            </div>
            <div>
              <p className="text-[14px] font-[600] text-[#222222]">{student.name}</p>
              <p className="text-[13px] text-[#929292]">{student.email} · {student.vehicleType}</p>
            </div>
          </div>
          <p className="text-[13px] text-[#929292]">Are you sure you want to delete this student?</p>
        </div>
      </Modal>
    </>
  );
}
