'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/Card';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { SearchBar } from '@/components/ui/Table';
import { useBusinessAuth } from '@/lib/BusinessAuthStore';
import { useBilling } from '@/lib/BillingStore';
import { STUDENTS, STUDENT_PROGRESS, Student } from '@/lib/data';
import Link from 'next/link';
import {
  UserPlus, UserX, UserCheck, Trash2, Users,
  CheckCircle, XCircle, Pencil, KeyRound, Eye,
  CreditCard, AlertTriangle,
} from 'lucide-react';
import { DropdownMenu } from '@/components/ui/DropdownMenu';

type Filter = 'all' | 'active' | 'suspended';

interface NewStudentForm {
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
}

const VEHICLE_TYPES = [
  { value: 'Car',                     label: 'Car' },
  { value: 'Motorbike',               label: 'Motorbike' },
  { value: 'HGV',                     label: 'HGV' },
  { value: 'CPC Certification',       label: 'CPC Certification' },
  { value: 'HGV + CPC Certification', label: 'HGV + CPC Certification' },
];

const emptyForm: NewStudentForm = { name: '', email: '', phone: '', vehicleType: 'Car' };

export default function BusinessStudentsPage() {
  const router = useRouter();
  const { currentBusiness, hasPaymentMethod, setPaymentMethodAdded } = useBusinessAuth();
  const { addStudentCharge } = useBilling();

  // Local mutable copy
  const [students, setStudents] = useState<Student[]>(
    STUDENTS.filter(s => s.businessId === currentBusiness.id)
  );

  const [filter, setFilter]               = useState<Filter>('all');
  const [search, setSearch]               = useState('');

  // Payment gate
  const [paymentOpen, setPaymentOpen]     = useState(false);
  const [paymentPending, setPaymentPending] = useState(false); // true = open add-student after payment
  const [paymentForm, setPaymentForm]     = useState({ cardHolder: '', cardNumber: '', expiry: '', cvv: '' });
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Modals
  const [addOpen, setAddOpen]             = useState(false);
  const [addForm, setAddForm]             = useState<NewStudentForm>(emptyForm);
  const [addErrors, setAddErrors]         = useState<Partial<Record<keyof NewStudentForm, string>>>({});
  const [addLoading, setAddLoading]       = useState(false);

  const [deactivateTarget, setDeactivateTarget] = useState<Student | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget]   = useState<Student | null>(null);

  // edit
  const [editTarget, setEditTarget]       = useState<Student | null>(null);
  const [editForm, setEditForm]           = useState({ name: '', email: '', vehicleType: '' });
  const [editLoading, setEditLoading]     = useState(false);

  // reset password
  const [resetTarget, setResetTarget]     = useState<Student | null>(null);
  const [resetDone, setResetDone]         = useState(false);
  const [resetLoading, setResetLoading]   = useState(false);

  const [toast, setToast]                 = useState<{ msg: string; ok: boolean } | null>(null);

  /* ─── payment helpers ─── */
  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handleOpenAddStudent = () => {
    if (!hasPaymentMethod) {
      setPaymentPending(true);
      setPaymentOpen(true);
    } else {
      setAddOpen(true);
      setAddForm(emptyForm);
      setAddErrors({});
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setPaymentLoading(false);
    setPaymentMethodAdded();
    setPaymentOpen(false);
    showToast('Payment method added successfully.');
    if (paymentPending) {
      setPaymentPending(false);
      setTimeout(() => { setAddOpen(true); setAddForm(emptyForm); setAddErrors({}); }, 300);
    }
  };

  /* ─── helpers ─── */
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  };

  const setField = (f: keyof NewStudentForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setAddForm(p => ({ ...p, [f]: e.target.value }));

  /* ─── derived ─── */
  const counts = {
    all:       students.length,
    active:    students.filter(s => s.status === 'active').length,
    suspended: students.filter(s => s.status === 'suspended').length,
  };
  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return (
      (filter === 'all' || s.status === filter) &&
      (s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
    );
  });

  /* ─── actions ─── */
  const validateAdd = () => {
    const errs: Partial<NewStudentForm> = {};
    if (!addForm.name.trim())  errs.name  = 'Name is required.';
    if (!addForm.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email)) errs.email = 'Enter a valid email.';
    if (!addForm.phone.trim()) errs.phone = 'Phone is required.';
    return errs;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateAdd();
    if (Object.keys(errs).length) { setAddErrors(errs); return; }
    setAddErrors({});
    setAddLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const newStudent: Student = {
      id: `stu-new-${Date.now()}`,
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      businessId: currentBusiness.id,
      businessName: currentBusiness.name,
      status: 'active',
      vehicleType: addForm.vehicleType,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStudents(prev => [newStudent, ...prev]);
    addStudentCharge(newStudent.name);
    setAddLoading(false);
    setAddOpen(false);
    setAddForm(emptyForm);
    showToast(`${newStudent.name} added successfully.`);
  };

  const handleDeactivate = () => {
    if (!deactivateTarget) return;
    setStudents(prev => prev.map(s => s.id === deactivateTarget.id ? { ...s, status: 'suspended' as const } : s));
    showToast(`${deactivateTarget.name} suspended.`, false);
    setDeactivateTarget(null);
  };

  const handleReactivate = () => {
    if (!reactivateTarget) return;
    setStudents(prev => prev.map(s => s.id === reactivateTarget.id ? { ...s, status: 'active' as const } : s));
    showToast(`${reactivateTarget.name} reactivated.`);
    setReactivateTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
    showToast(`${deleteTarget.name} removed.`, false);
    setDeleteTarget(null);
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setStudents(prev => prev.map(s => s.id === editTarget.id
      ? { ...s, name: editForm.name.trim(), email: editForm.email.trim(), vehicleType: editForm.vehicleType }
      : s
    ));
    setEditLoading(false);
    setEditTarget(null);
    showToast(`${editForm.name.trim()} updated.`);
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setResetLoading(false);
    setResetDone(true);
  };

  /* ─── render ─── */
  return (
    <>
      <TopBar
        title="Student Management"
        subtitle={`${counts.active} active · ${counts.suspended} suspended`}
        actions={
          <Button size="sm" icon={<UserPlus size={14} />} onClick={handleOpenAddStudent}>
            Add Student
          </Button>
        }
      />


      <div className="p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Total Students"  value={counts.all}      subtitle={`${counts.active} active`}       icon={<Users size={18} />}       color="primary" />
          <StatCard title="Active"          value={counts.active}   subtitle="Currently enrolled"              icon={<CheckCircle size={18} />} color="success" />
          <StatCard title="Suspended"       value={counts.suspended} subtitle="Access suspended"               icon={<XCircle size={18} />}     color="danger"  />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search students…" />
          <div className="flex items-center gap-1 p-1 bg-white border border-[#ebebeb] rounded-full">
            {([
              { value: 'all',       label: 'All',       count: counts.all },
              { value: 'active',    label: 'Active',    count: counts.active },
              { value: 'suspended', label: 'Suspended', count: counts.suspended },
            ] as { value: Filter; label: string; count: number }[]).map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-[500] transition-colors cursor-pointer flex items-center gap-1.5 ${
                  filter === f.value ? 'bg-[#222222] text-white' : 'text-[#6a6a6a] hover:text-[#222222] hover:bg-[#f2f2f2]'
                }`}
              >
                {f.label}
                <span className={`text-[11px] ${filter === f.value ? 'opacity-70' : 'opacity-60'}`}>{f.count}</span>
              </button>
            ))}
          </div>
          <span className="text-[13px] text-[#929292] ml-auto">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-6 py-20 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f2f2f2] flex items-center justify-center">
                <Users size={20} className="text-[#929292]" />
              </div>
              <p className="text-[15px] font-[600] text-[#222222]">No students found</p>
              <p className="text-[13px] text-[#929292]">Try adjusting your search or add a new student.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                  {['Student', 'Vehicle Type', 'Mock Test', 'Hazard', 'Category', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
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
                        <div className="w-16 h-1.5 bg-[#f2f2f2] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: barCol(value) }} />
                        </div>
                        <span className="text-[12px] font-[500] w-7 text-right flex-shrink-0" style={{ color: barCol(value) }}>{value}%</span>
                      </div>
                    ) : <span className="text-[13px] text-[#929292]">—</span>;

                  return (
                    <tr key={s.id} className={`${i < filtered.length - 1 ? 'border-b border-[#ebebeb]' : ''} hover:bg-[#f7f7f7] transition-colors`}>

                      {/* Student */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[13px] font-[600] text-[#6a6a6a] flex-shrink-0">
                            {s.name[0]}
                          </div>
                          <div>
                            <p className="text-[14px] font-[500] text-[#222222]">{s.name}</p>
                            <p className="text-[12px] text-[#929292]">{s.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle Type */}
                      <td className="px-5 py-4 text-[14px] text-[#3f3f3f]">{s.vehicleType}</td>

                      {/* Mock Test */}
                      <td className="px-5 py-4"><MiniBar value={mockAvg} /></td>

                      {/* Hazard */}
                      <td className="px-5 py-4"><MiniBar value={hazardAvg} /></td>

                      {/* Category */}
                      <td className="px-5 py-4"><MiniBar value={catAvg} /></td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <Badge variant={s.status === 'active' ? 'active' : 'suspended'}>
                          {s.status === 'active' ? 'Active' : 'Suspended'}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <DropdownMenu items={[
                          { label: 'View Details',    icon: <Eye size={14} />,       onClick: () => router.push(`/business/students/${s.id}`) },
                          { label: 'Edit',            icon: <Pencil size={14} />,    onClick: () => { setEditTarget(s); setEditForm({ name: s.name, email: s.email, vehicleType: s.vehicleType }); } },
                          { label: 'Reset Password',  icon: <KeyRound size={14} />,  onClick: () => { setResetTarget(s); setResetDone(false); } },
                          s.status === 'active'
                            ? { label: 'Suspend Account', icon: <UserX size={14} />, onClick: () => setDeactivateTarget(s), variant: 'warning', dividerBefore: true }
                            : { label: 'Reactivate',      icon: <UserCheck size={14} />, onClick: () => setReactivateTarget(s), variant: 'success', dividerBefore: true },
                          { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => setDeleteTarget(s), variant: 'danger', dividerBefore: true },
                        ]} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Payment Method Modal ── */}
      <Modal
        open={paymentOpen}
        onClose={() => { if (!paymentLoading) { setPaymentOpen(false); setPaymentPending(false); } }}
        title="Add Payment Method"
        size="sm"
        footer={
          <>
            <button
              onClick={() => { setPaymentOpen(false); setPaymentPending(false); }}
              disabled={paymentLoading}
              className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              form="payment-form"
              type="submit"
              disabled={paymentLoading}
              className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#6C3BAA] hover:bg-[#5a3190] rounded-[12px] cursor-pointer disabled:opacity-60 transition-colors"
            >
              {paymentLoading ? 'Saving…' : 'Save Card'}
            </button>
          </>
        }
      >
        <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-4" noValidate>
          <div className="flex items-start gap-3 p-3.5 bg-[#ede5f7] border border-[#6C3BAA]/20 rounded-[12px]">
            <AlertTriangle size={15} className="text-[#6C3BAA] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#6C3BAA]/80 leading-[1.6]">
              {paymentPending
                ? 'A payment method is required before adding students. Your card will be charged based on your active plan.'
                : 'Your card will be charged based on your active plan when students are added.'}
            </p>
          </div>
          <div>
            <label className="block text-[13px] font-[500] text-[#3f3f3f] mb-1.5">Cardholder Name</label>
            <input
              type="text"
              placeholder="e.g. Sarah Mitchell"
              value={paymentForm.cardHolder}
              onChange={e => setPaymentForm(p => ({ ...p, cardHolder: e.target.value }))}
              required
              className="w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-[13px] font-[500] text-[#3f3f3f] mb-1.5">Card Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentForm.cardNumber}
                onChange={e => setPaymentForm(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                required
                maxLength={19}
                className="w-full pl-10 pr-3 py-2.5 text-[14px] font-mono border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors"
              />
              <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929292]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-[500] text-[#3f3f3f] mb-1.5">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={paymentForm.expiry}
                onChange={e => setPaymentForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                required
                maxLength={5}
                className="w-full px-3 py-2.5 text-[14px] font-mono border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] font-[500] text-[#3f3f3f] mb-1.5">CVV</label>
              <input
                type="password"
                placeholder="•••"
                value={paymentForm.cvv}
                onChange={e => setPaymentForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                required
                maxLength={4}
                className="w-full px-3 py-2.5 text-[14px] font-mono border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* ── Add Student Modal ── */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Student"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setAddOpen(false)}
              className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] cursor-pointer"
            >
              Cancel
            </button>
            <button
              form="add-student-form"
              type="submit"
              disabled={addLoading}
              className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#6C3BAA] hover:bg-[#5a3190] rounded-[12px] cursor-pointer disabled:opacity-60 transition-colors"
            >
              {addLoading ? 'Adding…' : 'Add Student'}
            </button>
          </>
        }
      >
        <form id="add-student-form" onSubmit={handleAddSubmit} className="space-y-4" noValidate>
          <Input
            label="Full Name *"
            placeholder="e.g. James Carter"
            value={addForm.name}
            onChange={setField('name')}
            error={addErrors.name}
          />
          <Input
            label="Email Address *"
            type="email"
            placeholder="student@email.com"
            value={addForm.email}
            onChange={setField('email')}
            error={addErrors.email}
          />
          <Input
            label="Phone Number *"
            type="tel"
            placeholder="+44 7700 900000"
            value={addForm.phone}
            onChange={setField('phone')}
            error={addErrors.phone}
          />
          <Select
            label="Vehicle Type"
            options={VEHICLE_TYPES}
            value={addForm.vehicleType}
            onChange={setField('vehicleType')}
          />
        </form>
      </Modal>

      {/* ── Suspend Confirm ── */}
      <ConfirmModal
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title="Suspend Student"
        variant="warning"
        confirmLabel="Yes, Suspend"
        message={<>Suspending <strong>{deactivateTarget?.name}</strong> will remove their access. You can reactivate them at any time.</>}
      />

      {/* ── Reactivate Confirm ── */}
      <ConfirmModal
        open={!!reactivateTarget}
        onClose={() => setReactivateTarget(null)}
        onConfirm={handleReactivate}
        title="Reactivate Student"
        variant="warning"
        confirmLabel="Yes, Reactivate"
        message={<>Reactivating <strong>{reactivateTarget?.name}</strong> will restore their access to the platform.</>}
      />

      {/* ── Delete Confirm ── */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        variant="danger"
        confirmLabel="Yes, Delete"
        message={<>Permanently deleting <strong>{deleteTarget?.name}</strong> cannot be undone. All their data will be removed.</>}
      />

      {/* ── Edit Student Modal ── */}
      <Modal
        open={!!editTarget}
        onClose={() => !editLoading && setEditTarget(null)}
        title="Edit Student"
        size="sm"
        footer={
          <>
            <button onClick={() => setEditTarget(null)} disabled={editLoading} className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] cursor-pointer disabled:opacity-50">Cancel</button>
            <button onClick={handleEditSave} disabled={editLoading} className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#6C3BAA] hover:bg-[#5a3190] rounded-[12px] cursor-pointer disabled:opacity-60 transition-colors">
              {editLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} placeholder="Student full name" />
          <Input label="Email Address" type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} placeholder="student@email.com" />
          <Select label="Vehicle Type" value={editForm.vehicleType} onChange={e => setEditForm(p => ({ ...p, vehicleType: e.target.value }))} options={VEHICLE_TYPES} />
        </div>
      </Modal>

      {/* ── Reset Password Modal ── */}
      <Modal
        open={!!resetTarget}
        onClose={() => !resetLoading && (setResetTarget(null), setResetDone(false))}
        title="Reset Student Password"
        size="sm"
        footer={
          resetDone ? (
            <button onClick={() => { setResetTarget(null); setResetDone(false); }} className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#6C3BAA] rounded-[12px] cursor-pointer">Done</button>
          ) : (
            <>
              <button onClick={() => setResetTarget(null)} disabled={resetLoading} className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] cursor-pointer disabled:opacity-50">Cancel</button>
              <button onClick={handleResetPassword} disabled={resetLoading} className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#6C3BAA] hover:bg-[#5a3190] rounded-[12px] cursor-pointer disabled:opacity-60 transition-colors">
                {resetLoading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </>
          )
        }
      >
        {resetDone ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#e6f4e6] flex items-center justify-center">
              <CheckCircle size={28} className="text-[#008a05]" />
            </div>
            <p className="text-[15px] font-[600] text-[#222222]">Reset link sent!</p>
            <p className="text-[13px] text-[#929292]">A password reset email was sent to <span className="font-[500] text-[#222222]">{resetTarget?.email}</span></p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-[#ede5f7] border border-[#6C3BAA]/20 rounded-[12px]">
              <KeyRound size={17} className="text-[#6C3BAA] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#6C3BAA]/80 leading-[1.6]">A password reset link will be sent to the student's email. The link expires in 24 hours.</p>
            </div>
            <div className="p-3.5 bg-[#f9f9f9] border border-[#ebebeb] rounded-[10px] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ede5f7] flex items-center justify-center text-[14px] font-[700] text-[#6C3BAA] flex-shrink-0">{resetTarget?.name[0]}</div>
              <div>
                <p className="text-[14px] font-[600] text-[#222222]">{resetTarget?.name}</p>
                <p className="text-[13px] text-[#929292]">{resetTarget?.email}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-[14px] text-white shadow-dropdown text-[14px] font-[500] ${
          toast.ok ? 'bg-[#008a05]' : 'bg-[#c13515]'
        }`}>
          {toast.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </>
  );
}
