'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { Business } from '@/lib/data';
import { useBusinessStore } from '@/lib/BusinessStore';
import { SearchBar } from '@/components/ui/Table';
import { CheckCircle, XCircle, Mail, Phone, MapPin, Building2 } from 'lucide-react';

type Tab = 'pending' | 'rejected';

export default function ApplicationsPage() {
  const { businesses, updateBusiness } = useBusinessStore();
  const [tab, setTab]     = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [reviewTarget, setReviewTarget] = useState<Business | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Business | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [approveTarget, setApproveTarget] = useState<Business | null>(null);
  const [toast, setToast] = useState<{ type: 'approve' | 'reject'; name: string } | null>(null);

  const q = search.toLowerCase();
  const matches = (b: Business) =>
    b.name.toLowerCase().includes(q) ||
    b.email.toLowerCase().includes(q) ||
    b.contactName.toLowerCase().includes(q);

  const pending  = businesses.filter(b => b.status === 'pending'  && matches(b));
  const rejected = businesses.filter(b => b.status === 'rejected' && matches(b));

  const showToast = (type: 'approve' | 'reject', name: string) => {
    setToast({ type, name });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = () => {
    if (!approveTarget) return;
    updateBusiness(approveTarget.id, { status: 'active', createdAt: new Date().toISOString().split('T')[0] });
    showToast('approve', approveTarget.name);
    setApproveTarget(null);
    setReviewTarget(null);
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    const today = new Date().toISOString().split('T')[0];
    updateBusiness(rejectTarget.id, {
      status: 'rejected',
      rejectedAt: today,
      rejectionReason: rejectNote.trim() || undefined,
    });
    showToast('reject', rejectTarget.name);
    setRejectTarget(null);
    setRejectNote('');
    setReviewTarget(null);
    setTab('rejected');
  };

  return (
    <>
      <TopBar
        title="Business Applications"
        subtitle={`${pending.length} pending · ${rejected.length} rejected`}
      />
      <div className="p-6 space-y-5">

        {/* Search + Tabs — single row */}
        <div className="flex items-center gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or contact…" />
          <div className="flex items-center gap-1 p-1 bg-white border border-[#ebebeb] rounded-full flex-shrink-0">
          {([
            { value: 'pending', label: 'Pending', count: pending.length },
            { value: 'rejected', label: 'Rejected', count: rejected.length },
          ] as { value: Tab; label: string; count: number }[]).map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-[500] transition-colors cursor-pointer flex items-center gap-1.5 ${
                tab === t.value ? 'bg-[#222222] text-white' : 'text-[#6a6a6a] hover:text-[#222222] hover:bg-[#f2f2f2]'
              }`}
            >
              {t.label}
              <span className={`text-[11px] ${tab === t.value ? 'opacity-70' : 'opacity-60'}`}>{t.count}</span>
            </button>
          ))}
          </div>
          <span className="text-[13px] text-[#929292] ml-auto">
            {(tab === 'pending' ? pending : rejected).length} results
          </span>
        </div>

        {/* Pending tab */}
        {tab === 'pending' && (
          pending.length === 0 ? (
            <div className="bg-white border border-[#ebebeb] rounded-[14px] px-6 py-20 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#e6f4e6] flex items-center justify-center">
                <CheckCircle size={22} className="text-[#008a05]" />
              </div>
              <p className="text-[16px] font-[600] text-[#222222]">All caught up!</p>
              <p className="text-[13px] text-[#929292] max-w-xs">No pending applications. New submissions will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pending.map(app => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  onReview={() => setReviewTarget(app)}
                  onApprove={() => setApproveTarget(app)}
                  onReject={() => { setRejectTarget(app); setRejectNote(''); }}
                />
              ))}
            </div>
          )
        )}

        {/* Rejected tab */}
        {tab === 'rejected' && (
          rejected.length === 0 ? (
            <div className="bg-white border border-[#ebebeb] rounded-[14px] px-6 py-20 flex flex-col items-center gap-3 text-center">
              <p className="text-[16px] font-[600] text-[#222222]">No rejected applications</p>
              <p className="text-[13px] text-[#929292] max-w-xs">Rejected applications will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {rejected.map(app => (
                <RejectedCard key={app.id} app={app} onReview={() => setReviewTarget(app)} />
              ))}
            </div>
          )
        )}

      </div>

      {/* Review detail modal */}
      {reviewTarget && (
        <Modal
          open={!!reviewTarget}
          onClose={() => setReviewTarget(null)}
          title="Application Details"
          size="lg"
          footer={
            reviewTarget.status === 'rejected' ? (
              <button
                onClick={() => setReviewTarget(null)}
                className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] cursor-pointer"
              >
                Close
              </button>
            ) : (
              <>
                <Button variant="secondary" size="sm" icon={<XCircle size={14} />} onClick={() => setRejectTarget(reviewTarget)}>
                  Reject
                </Button>
                <Button size="sm" icon={<CheckCircle size={14} />} onClick={() => setApproveTarget(reviewTarget)}>
                  Approve
                </Button>
              </>
            )
          }
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[20px] font-[600] ${reviewTarget.status === 'rejected' ? 'bg-[#f2f2f2] text-[#929292]' : 'bg-[#ede5f7] text-[#6C3BAA]'}`}>
                {reviewTarget.name[0]}
              </div>
              <div>
                <p className="text-[20px] font-[600] text-[#222222]">{reviewTarget.name}</p>
                <p className="text-[14px] text-[#929292]">
                  Applied {reviewTarget.appliedAt}
                  {reviewTarget.rejectedAt && ` · Rejected ${reviewTarget.rejectedAt}`}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Contact Name', value: reviewTarget.contactName },
                { label: 'Email', value: reviewTarget.email },
                { label: 'Phone', value: reviewTarget.phone },
                { label: 'Address', value: reviewTarget.address },
              ].map(f => (
                <div key={f.label} className={f.label === 'Address' ? 'col-span-2' : ''}>
                  <p className="text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px] mb-1">{f.label}</p>
                  <p className="text-[15px] text-[#222222]">{f.value}</p>
                </div>
              ))}
            </div>
            {reviewTarget.status === 'rejected' && reviewTarget.rejectionReason && (
              <div className="flex items-start gap-2.5 bg-[#fde8e3] border border-[#c13515]/20 rounded-[12px] px-4 py-3">
                <XCircle size={15} className="text-[#c13515] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-[700] text-[#c13515] uppercase tracking-[0.32px] mb-0.5">Rejection Reason</p>
                  <p className="text-[14px] text-[#c13515]/90">{reviewTarget.rejectionReason}</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Approve confirm */}
      <ConfirmModal
        open={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={handleApprove}
        title="Approve Application"
        variant="warning"
        confirmLabel="Yes, Approve"
        message={
          <>
            Approving <strong>{approveTarget?.name}</strong> will create their business account and send them a confirmation email.
          </>
        }
      />

      {/* Reject modal */}
      <Modal
        open={!!rejectTarget}
        onClose={() => { setRejectTarget(null); setRejectNote(''); }}
        title="Reject Application"
        size="sm"
        footer={
          <>
            <button
              onClick={() => { setRejectTarget(null); setRejectNote(''); }}
              className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#c13515] hover:bg-[#b32505] rounded-[12px] cursor-pointer"
            >
              Reject Application
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[14px] text-[#3f3f3f]">
            Rejecting <strong>{rejectTarget?.name}</strong> will notify the applicant by email. Please provide a reason (optional).
          </p>
          <Textarea
            label="Rejection reason (optional)"
            placeholder="e.g. Could not verify business registration number…"
            value={rejectNote}
            onChange={e => setRejectNote(e.target.value)}
          />
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-[14px] text-white shadow-dropdown text-[14px] font-[500] ${
          toast.type === 'approve' ? 'bg-[#008a05]' : 'bg-[#c13515]'
        }`}>
          {toast.type === 'approve' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          <strong>{toast.name}</strong> {toast.type === 'approve' ? 'approved successfully.' : 'has been rejected.'}
        </div>
      )}
    </>
  );
}

function ApplicationCard({ app, onReview, onApprove, onReject }: {
  app: Business;
  onReview: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="bg-white border border-[#ebebeb] rounded-[14px] p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-[#ede5f7] flex items-center justify-center text-[16px] font-[600] text-[#6C3BAA] flex-shrink-0">
          {app.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-[600] text-[#222222]">{app.name}</p>
          <p className="text-[13px] text-[#929292]">Applied {app.appliedAt}</p>
        </div>
        <Badge variant="pending">Pending</Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[14px] text-[#3f3f3f]">
          <Mail size={14} className="text-[#6a6a6a] flex-shrink-0" />
          {app.email}
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#3f3f3f]">
          <Phone size={14} className="text-[#6a6a6a] flex-shrink-0" />
          {app.phone}
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#3f3f3f]">
          <MapPin size={14} className="text-[#6a6a6a] flex-shrink-0" />
          {app.address}
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#3f3f3f]">
          <Building2 size={14} className="text-[#6a6a6a] flex-shrink-0" />
          Contact: {app.contactName}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-[#ebebeb]">
        <button onClick={onReview} className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-[600] bg-[#f2f2f2] text-[#222222] border border-[#c1c1c1] hover:bg-[#e8e8e8] transition-colors cursor-pointer">
          View Details
        </button>
        <div className="flex-1" />
        <Button size="sm" variant="secondary" icon={<XCircle size={14} />} onClick={onReject}>Reject</Button>
        <Button size="sm" icon={<CheckCircle size={14} />} onClick={onApprove}>Approve</Button>
      </div>
    </div>
  );
}

function RejectedCard({ app, onReview }: { app: Business; onReview: () => void }) {
  return (
    <div className="bg-white border border-[#ebebeb] rounded-[14px] p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[16px] font-[600] text-[#929292] flex-shrink-0">
          {app.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-[600] text-[#222222]">{app.name}</p>
          <p className="text-[13px] text-[#929292]">Applied {app.appliedAt}{app.rejectedAt && ` · Rejected ${app.rejectedAt}`}</p>
        </div>
        <Badge variant="rejected">Rejected</Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[14px] text-[#3f3f3f]">
          <Mail size={14} className="text-[#6a6a6a] flex-shrink-0" />
          {app.email}
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#3f3f3f]">
          <Phone size={14} className="text-[#6a6a6a] flex-shrink-0" />
          {app.phone}
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#3f3f3f]">
          <MapPin size={14} className="text-[#6a6a6a] flex-shrink-0" />
          {app.address}
        </div>
        <div className="flex items-center gap-2 text-[14px] text-[#3f3f3f]">
          <Building2 size={14} className="text-[#6a6a6a] flex-shrink-0" />
          Contact: {app.contactName}
        </div>
      </div>

      {app.rejectionReason && (
        <div className="flex items-start gap-2.5 bg-[#fde8e3] border border-[#c13515]/20 rounded-[12px] px-4 py-3">
          <XCircle size={14} className="text-[#c13515] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-[700] text-[#c13515] uppercase tracking-[0.32px] mb-0.5">Rejection reason</p>
            <p className="text-[13px] text-[#c13515]/90">{app.rejectionReason}</p>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-[#ebebeb]">
        <button onClick={onReview} className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-[600] bg-[#f2f2f2] text-[#222222] border border-[#c1c1c1] hover:bg-[#e8e8e8] transition-colors cursor-pointer">
          View Details
        </button>
      </div>
    </div>
  );
}
