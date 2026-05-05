'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ConfirmModal, Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { STUDENTS, Student } from '@/lib/data';
import { useBusinessStore } from '@/lib/BusinessStore';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import {
  ArrowLeft, Mail, Phone, MapPin, Building2, Users,
  AlertTriangle, ShieldOff, ShieldCheck, Clock,
  KeyRound, UserX, UserCheck, Trash2,
} from 'lucide-react';

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { businesses, updateBusiness } = useBusinessStore();
  const business = businesses.find(b => b.id === id);

  // business actions
  const [suspendOpen, setSuspendOpen]     = useState(false);
  const [reinstateOpen, setReinstateOpen] = useState(false);
  const [suspendNote, setSuspendNote]     = useState('');

  // student state — mirroring the all-students list
  const [localStudents, setLocalStudents] = useState<Student[]>(() => STUDENTS);
  const [deleteTarget, setDeleteTarget]         = useState<Student | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Student | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<Student | null>(null);
  const [resetTarget, setResetTarget]           = useState<Student | null>(null);
  const [resetDone, setResetDone]               = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (!business) {
    return (
      <div className="p-6">
        <p className="text-[14px] text-[#929292]">Business not found.</p>
        <Link href="/admin/businesses" className="text-[14px] text-[#6C3BAA] hover:underline mt-2 inline-block">
          ← Back to businesses
        </Link>
      </div>
    );
  }

  const students = localStudents.filter(s => s.businessId === business.id);

  // business handlers
  const handleSuspend = () => {
    updateBusiness(id, { status: 'suspended', suspendedAt: new Date().toISOString().split('T')[0], notes: suspendNote || business?.notes });
    setSuspendOpen(false);
    showToast(`${business?.name} has been suspended.`);
  };

  const handleReinstate = () => {
    updateBusiness(id, { status: 'active', suspendedAt: undefined });
    setReinstateOpen(false);
    showToast(`${business?.name} has been reinstated.`);
  };

  // student handlers
  const handleDelete = () => {
    if (!deleteTarget) return;
    setLocalStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
    showToast(`${deleteTarget.name} permanently deleted.`);
    setDeleteTarget(null);
  };

  const handleDeactivate = () => {
    if (!deactivateTarget) return;
    setLocalStudents(prev => prev.map(s => s.id === deactivateTarget.id ? { ...s, status: 'suspended' as const } : s));
    showToast(`${deactivateTarget.name} has been deactivated.`);
    setDeactivateTarget(null);
  };

  const handleReactivate = () => {
    if (!reactivateTarget) return;
    setLocalStudents(prev => prev.map(s => s.id === reactivateTarget.id ? { ...s, status: 'active' as const } : s));
    showToast(`${reactivateTarget.name} has been reactivated.`);
    setReactivateTarget(null);
  };

  const handleResetPassword = () => {
    setResetDone(true);
  };

  const statusBadge = business.status as 'active' | 'suspended' | 'pending' | 'rejected';

  return (
    <>
      <TopBar
        title={business.name}
        subtitle={`${business.package} · ${students.length} students`}
        actions={
          <DropdownMenu items={[
            ...(business.status === 'active' ? [{
              label: 'Suspend Business',
              icon: <ShieldOff size={14} />,
              onClick: () => setSuspendOpen(true),
              variant: 'warning' as const,
            }] : []),
            ...(business.status === 'suspended' ? [{
              label: 'Reinstate Business',
              icon: <ShieldCheck size={14} />,
              onClick: () => setReinstateOpen(true),
              variant: 'success' as const,
            }] : []),
          ]} align="right" />
        }
      />
      <div className="p-6 space-y-5">

        <Link href="/admin/businesses" className="inline-flex items-center gap-1.5 text-[14px] text-[#6a6a6a] hover:text-[#222222] transition-colors">
          <ArrowLeft size={14} />
          Back to businesses
        </Link>

        {/* Suspension banner */}
        {business.status === 'suspended' && (
          <div className="flex items-start gap-3 bg-[#fff3cd] border border-[#c47a00]/20 rounded-[14px] px-5 py-4">
            <AlertTriangle size={18} className="text-[#c47a00] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-[600] text-[#c47a00]">This business is suspended</p>
              <p className="text-[13px] text-[#c47a00]/80">
                Suspended on {business.suspendedAt}. Students cannot be added until reinstated.
                {business.notes && <> Reason: {business.notes}</>}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-5">

          {/* Business info */}
          <Card>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#ede5f7] flex items-center justify-center text-[22px] font-[600] text-[#6C3BAA]">
                  {business.name[0]}
                </div>
                <div>
                  <h2 className="text-[20px] font-[600] text-[#222222]">{business.name}</h2>
                  <p className="text-[14px] text-[#929292]">Account ID: {business.id}</p>
                </div>
              </div>
              <Badge variant={statusBadge}>{business.status.charAt(0).toUpperCase() + business.status.slice(1)}</Badge>
            </div>

            {/* Row 1: 4 fields side by side */}
            <div className="grid grid-cols-4 gap-x-6 gap-y-5">
              {[
                { icon: <Mail      size={15} />, label: 'Email',        value: business.email },
                { icon: <Phone     size={15} />, label: 'Phone',        value: business.phone },
                { icon: <Building2 size={15} />, label: 'Contact',      value: business.contactName },
                { icon: <Clock     size={15} />, label: 'Member Since', value: business.createdAt || '—' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-[#6a6a6a] mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px]">{item.label}</p>
                    <p className="text-[14px] text-[#222222]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Row 2: Address full width */}
            <div className="flex items-start gap-3 mt-5">
              <span className="text-[#6a6a6a] mt-0.5 flex-shrink-0"><MapPin size={15} /></span>
              <div>
                <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px]">Address</p>
                <p className="text-[14px] text-[#222222]">{business.address}</p>
              </div>
            </div>

            {business.notes && (
              <div className="mt-5 p-4 bg-[#f7f7f7] rounded-[12px]">
                <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px] mb-1">Admin Notes</p>
                <p className="text-[14px] text-[#3f3f3f]">{business.notes}</p>
              </div>
            )}
          </Card>

          {/* Students list */}
          <Card padding="none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb]">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#6a6a6a]" />
                <h3 className="text-[16px] font-[600] text-[#222222]">Students</h3>
                <span className="text-[13px] text-[#929292]">({students.length})</span>
              </div>
            </div>
            {students.length === 0 ? (
              <div className="px-5 py-10 text-center text-[14px] text-[#929292]">No students yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                      {['Student', 'Mock Avg', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((stu, idx) => (
                      <tr key={stu.id} className={`border-b border-[#ebebeb] last:border-b-0 hover:bg-[#f7f7f7] transition-colors ${idx % 2 !== 0 ? 'bg-[#fafafa]' : ''}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[13px] font-[600] text-[#6a6a6a] flex-shrink-0">
                              {stu.name[0]}
                            </div>
                            <div>
                              <p className="text-[14px] font-[500] text-[#222222]">{stu.name}</p>
                              <p className="text-[13px] text-[#929292]">{stu.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {stu.mockTestAvg != null ? (
                            <div className="flex items-center gap-2 min-w-[100px]">
                              <div className="flex-1 h-1.5 bg-[#ebebeb] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${stu.mockTestAvg}%`,
                                    backgroundColor: stu.mockTestAvg >= 80 ? '#008a05' : stu.mockTestAvg >= 60 ? '#c47a00' : '#c13515',
                                  }}
                                />
                              </div>
                              <span className="text-[13px] font-[600] text-[#222222] w-8 text-right">{stu.mockTestAvg}%</span>
                            </div>
                          ) : (
                            <span className="text-[14px] text-[#929292]">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={stu.status === 'active' ? 'active' : 'suspended'}>
                            {stu.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <DropdownMenu items={[
                            { label: 'Reset Password', icon: <KeyRound size={14} />, onClick: () => { setResetTarget(stu); setResetDone(false); } },
                            stu.status === 'active'
                              ? { label: 'Suspend Account', icon: <UserX size={14} />,    onClick: () => setDeactivateTarget(stu), variant: 'warning' as const, dividerBefore: true }
                              : { label: 'Reactivate',      icon: <UserCheck size={14} />, onClick: () => setReactivateTarget(stu), variant: 'success' as const, dividerBefore: true },
                            { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => setDeleteTarget(stu), variant: 'danger' as const, dividerBefore: true },
                          ]} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

        </div>
      </div>

      {/* ── Business: Suspend modal ── */}
      <Modal
        open={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        title="Suspend Business"
        size="sm"
        footer={
          <>
            <button onClick={() => setSuspendOpen(false)} className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSuspend} className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#c47a00] hover:bg-[#a36800] rounded-[12px] cursor-pointer">
              Suspend
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[14px] text-[#3f3f3f]">
            Suspending <strong>{business.name}</strong> will prevent them from adding new students. Existing students are unaffected.
          </p>
          <Textarea label="Reason (optional)" placeholder="e.g. Payment failed…" value={suspendNote} onChange={e => setSuspendNote(e.target.value)} />
        </div>
      </Modal>

      {/* ── Business: Reinstate modal ── */}
      <ConfirmModal
        open={reinstateOpen}
        onClose={() => setReinstateOpen(false)}
        onConfirm={handleReinstate}
        title="Reinstate Business"
        variant="warning"
        confirmLabel="Yes, Reinstate"
        message={<>Reinstating <strong>{business.name}</strong> will restore their ability to add new students. Ensure their payment method is valid.</>}
      />

      {/* ── Student: Delete modal ── */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Permanently Delete Student"
        confirmLabel="Yes, Delete Permanently"
        variant="danger"
        message={
          <>
            This will <strong>permanently delete</strong> {deleteTarget?.name}'s account and all associated data. This action <strong>cannot be undone</strong>.
          </>
        }
      />

      {/* ── Student: Deactivate modal ── */}
      <ConfirmModal
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title="Deactivate Student"
        confirmLabel="Yes, Deactivate"
        variant="warning"
        message={
          <>
            Deactivating <strong>{deactivateTarget?.name}</strong> will revoke their access to the learning app. Their data is preserved and they can be reactivated later.
          </>
        }
      />

      {/* ── Student: Reactivate modal ── */}
      <ConfirmModal
        open={!!reactivateTarget}
        onClose={() => setReactivateTarget(null)}
        onConfirm={handleReactivate}
        title="Reactivate Student"
        confirmLabel="Yes, Reactivate"
        variant="warning"
        message={
          <>
            Reactivating <strong>{reactivateTarget?.name}</strong> will restore their access to the learning app.
          </>
        }
      />

      {/* ── Student: Reset password modal ── */}
      <Modal
        open={!!resetTarget}
        onClose={() => { setResetTarget(null); setResetDone(false); }}
        title="Reset Student Password"
        size="sm"
        footer={
          resetDone ? (
            <button onClick={() => { setResetTarget(null); setResetDone(false); }} className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#6C3BAA] rounded-[12px] cursor-pointer">
              Done
            </button>
          ) : (
            <>
              <button onClick={() => setResetTarget(null)} className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] cursor-pointer">
                Cancel
              </button>
              <button onClick={handleResetPassword} className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#6C3BAA] hover:bg-[#5a3190] rounded-[12px] cursor-pointer">
                Send Reset Email
              </button>
            </>
          )
        }
      >
        {resetDone ? (
          <div className="text-center py-4 space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#e6f4e6] flex items-center justify-center mx-auto">
              <KeyRound size={20} className="text-[#008a05]" />
            </div>
            <p className="text-[15px] font-[500] text-[#222222]">Reset email sent!</p>
            <p className="text-[14px] text-[#6a6a6a]">
              A password reset link has been sent to <strong>{resetTarget?.email}</strong>.
            </p>
          </div>
        ) : (
          <p className="text-[14px] text-[#3f3f3f]">
            A password reset email will be sent to <strong>{resetTarget?.email}</strong>. The student will receive a link to set a new password.
          </p>
        )}
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-[14px] bg-[#222222] text-white shadow-dropdown text-[14px] font-[500]">
          <ShieldCheck size={16} className="text-[#4ade80]" />
          {toast}
        </div>
      )}
    </>
  );
}
