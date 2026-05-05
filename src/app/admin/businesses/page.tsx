'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/Table';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { Business, BusinessStatus } from '@/lib/data';
import { useBusinessStore } from '@/lib/BusinessStore';
import { Plus, Eye, ShieldOff, ShieldCheck } from 'lucide-react';

const STATUS_FILTERS: { label: string; value: BusinessStatus | 'all' }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Active',    value: 'active'    },
  { label: 'Suspended', value: 'suspended' },
];

export default function BusinessesPage() {
  const { businesses, updateBusiness } = useBusinessStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<BusinessStatus | 'all'>('all');

  const [suspendTarget, setSuspendTarget]   = useState<Business | null>(null);
  const [suspendNote, setSuspendNote]       = useState('');
  const [reinstateTarget, setReinstateTarget] = useState<Business | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = businesses.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.contactName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all'
      ? (b.status === 'active' || b.status === 'suspended')
      : b.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleSuspend = () => {
    if (!suspendTarget) return;
    updateBusiness(suspendTarget.id, {
      status: 'suspended',
      suspendedAt: new Date().toISOString().split('T')[0],
      notes: suspendNote || suspendTarget.notes,
    });
    showToast(`${suspendTarget.name} has been suspended.`);
    setSuspendTarget(null);
    setSuspendNote('');
  };

  const handleReinstate = () => {
    if (!reinstateTarget) return;
    updateBusiness(reinstateTarget.id, { status: 'active', suspendedAt: undefined });
    showToast(`${reinstateTarget.name} has been reinstated.`);
    setReinstateTarget(null);
  };

  return (
    <>
      <TopBar
        title="All Businesses"
        subtitle={`${businesses.filter(b => b.status === 'active').length} active · ${businesses.filter(b => b.status === 'pending').length} pending`}
        actions={
          <Link href="/admin/businesses/create">
            <Button size="sm" icon={<Plus size={15} />}>Create Account</Button>
          </Link>
        }
      />
      <div className="p-6 space-y-5">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search businesses…" />
          <div className="flex items-center gap-1 p-1 bg-white border border-[#ebebeb] rounded-full">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-[500] transition-colors cursor-pointer ${
                  filter === f.value ? 'bg-[#222222] text-white' : 'text-[#6a6a6a] hover:text-[#222222] hover:bg-[#f2f2f2]'
                }`}
              >
                {f.label}
                {f.value !== 'all' && (
                  <span className="ml-1.5 text-[11px] opacity-70">
                    {businesses.filter(b => b.status === f.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <span className="text-[13px] text-[#929292] ml-auto">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-[14px] border border-[#ebebeb] bg-white">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                {['Business', 'Contact', 'Students', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[14px] text-[#929292]">No businesses found.</td>
                </tr>
              ) : (
                filtered.map((biz, idx) => (
                  <tr key={biz.id} className={`border-b border-[#ebebeb] last:border-b-0 hover:bg-[#f7f7f7] transition-colors ${idx % 2 !== 0 ? 'bg-[#fafafa]' : ''}`}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#ede5f7] flex items-center justify-center text-[14px] font-[600] text-[#6C3BAA] flex-shrink-0">
                          {biz.name[0]}
                        </div>
                        <div>
                          <p className="text-[14px] font-[500] text-[#222222]">{biz.name}</p>
                          <p className="text-[13px] text-[#929292]">{biz.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[14px] text-[#222222]">{biz.contactName}</p>
                      <p className="text-[13px] text-[#929292]">{biz.phone}</p>
                    </td>
                    <td className="px-4 py-3.5 text-[14px] text-[#222222] font-[500]">{biz.studentCount}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={biz.status as 'active' | 'suspended' | 'pending' | 'rejected'}>
                        {biz.status.charAt(0).toUpperCase() + biz.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <DropdownMenu items={[
                        { label: 'View Details', icon: <Eye size={14} />, onClick: () => window.location.href = `/admin/businesses/${biz.id}` },
                        ...(biz.status === 'active' ? [{
                          label: 'Suspend',
                          icon: <ShieldOff size={14} />,
                          onClick: () => { setSuspendTarget(biz); setSuspendNote(''); },
                          variant: 'warning' as const,
                          dividerBefore: true,
                        }] : []),
                        ...(biz.status === 'suspended' ? [{
                          label: 'Reinstate',
                          icon: <ShieldCheck size={14} />,
                          onClick: () => setReinstateTarget(biz),
                          variant: 'success' as const,
                          dividerBefore: true,
                        }] : []),
                      ]} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Suspend modal */}
      <Modal
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        title="Suspend Business"
        size="sm"
        footer={
          <>
            <button onClick={() => setSuspendTarget(null)} className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] cursor-pointer">Cancel</button>
            <button onClick={handleSuspend} className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#c47a00] hover:bg-[#a36800] rounded-[12px] cursor-pointer">Suspend</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-[#fff8e1] border border-[#c47a00]/20 rounded-[12px]">
            <ShieldOff size={18} className="text-[#c47a00] flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#c47a00]/80 leading-[1.6]">
              Suspending <strong>{suspendTarget?.name}</strong> will prevent them from adding new students. Existing students are unaffected.
            </p>
          </div>
          <Textarea label="Reason (optional)" placeholder="e.g. Payment failed…" value={suspendNote} onChange={e => setSuspendNote(e.target.value)} />
        </div>
      </Modal>

      {/* Reinstate modal */}
      <ConfirmModal
        open={!!reinstateTarget}
        onClose={() => setReinstateTarget(null)}
        onConfirm={handleReinstate}
        title="Reinstate Business"
        variant="warning"
        confirmLabel="Yes, Reinstate"
        message={<>Reinstating <strong>{reinstateTarget?.name}</strong> will restore their ability to add new students.</>}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-[14px] bg-[#222222] text-white shadow-lg text-[14px] font-[500]">
          <ShieldCheck size={16} className="text-[#4ade80]" />
          {toast}
        </div>
      )}
    </>
  );
}
