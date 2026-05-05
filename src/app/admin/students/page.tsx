'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/Table';
import { ConfirmModal, Modal } from '@/components/ui/Modal';
import { STUDENTS, Student } from '@/lib/data';
import { KeyRound, UserX, UserCheck, Trash2 } from 'lucide-react';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import Link from 'next/link';

type FilterStatus = 'all' | 'active' | 'suspended';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Student | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<Student | null>(null);
  const [resetTarget, setResetTarget] = useState<Student | null>(null);
  const [resetDone, setResetDone] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.businessName.toLowerCase().includes(q);
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
    showToast(`${deleteTarget.name} permanently deleted.`);
    setDeleteTarget(null);
  };

  const handleDeactivate = () => {
    if (!deactivateTarget) return;
    setStudents(prev => prev.map(s => s.id === deactivateTarget.id ? { ...s, status: 'suspended' as const } : s));
    showToast(`${deactivateTarget.name} has been suspended.`);
    setDeactivateTarget(null);
  };

  const handleReactivate = () => {
    if (!reactivateTarget) return;
    setStudents(prev => prev.map(s => s.id === reactivateTarget.id ? { ...s, status: 'active' as const } : s));
    showToast(`${reactivateTarget.name} has been reactivated.`);
    setReactivateTarget(null);
  };

  const handleResetPassword = () => {
    setResetDone(true);
  };

  return (
    <>
      <TopBar
        title="All Students"
        subtitle={`${students.filter(s => s.status === 'active').length} active · ${students.filter(s => s.status === 'suspended').length} suspended`}
      />
      <div className="p-6 space-y-5">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search students, business…" />
          <div className="flex items-center gap-1 p-1 bg-white border border-[#ebebeb] rounded-full">
            {([
              { value: 'all', label: 'All', count: students.length },
              { value: 'active', label: 'Active', count: students.filter(s => s.status === 'active').length },
              { value: 'suspended', label: 'Suspended', count: students.filter(s => s.status === 'suspended').length },
            ] as { value: FilterStatus; label: string; count: number }[]).map(f => (
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
          <span className="text-[13px] text-[#929292] ml-auto">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-[14px] border border-[#ebebeb] bg-white">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                {['Student', 'Business', 'Mock Avg', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-[14px] text-[#929292]">No students found.</td></tr>
              ) : (
                filtered.map((stu, idx) => (
                  <tr key={stu.id} className={`border-b border-[#ebebeb] last:border-b-0 hover:bg-[#f7f7f7] transition-colors ${idx % 2 !== 0 ? 'bg-[#fafafa]' : ''}`}>
                    <td className="px-4 py-3.5">
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
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/businesses/${stu.businessId}`} className="text-[14px] text-[#6C3BAA] hover:underline">
                        {stu.businessName}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
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
                    <td className="px-4 py-3.5">
                      <Badge variant={stu.status === 'active' ? 'active' : 'suspended'}>
                        {stu.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <DropdownMenu items={[
                        { label: 'Reset Password', icon: <KeyRound size={14} />, onClick: () => { setResetTarget(stu); setResetDone(false); } },
                        stu.status === 'active'
                          ? { label: 'Suspend Account', icon: <UserX size={14} />,    onClick: () => setDeactivateTarget(stu), variant: 'warning' as const, dividerBefore: true }
                          : { label: 'Reactivate',      icon: <UserCheck size={14} />, onClick: () => setReactivateTarget(stu), variant: 'success' as const, dividerBefore: true },
                        { label: 'Delete', icon: <Trash2 size={14} />, onClick: () => setDeleteTarget(stu), variant: 'danger' as const, dividerBefore: true },
                      ]} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


      </div>

      {/* Delete modal */}
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

      {/* Suspend modal */}
      <ConfirmModal
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title="Suspend Student"
        confirmLabel="Yes, Suspend"
        variant="warning"
        message={
          <>
            Suspending <strong>{deactivateTarget?.name}</strong> will revoke their access to the learning app. Their data is preserved and they can be reactivated later.
          </>
        }
      />

      {/* Reactivate modal */}
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

      {/* Reset password modal */}
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
              <button onClick={handleResetPassword} className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#6C3BAA] hover:bg-[#e00b41] rounded-[12px] cursor-pointer">
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
          {toast}
        </div>
      )}
    </>
  );
}
