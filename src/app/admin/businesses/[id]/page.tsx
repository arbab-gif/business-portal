'use client';

import React, { useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ConfirmModal, Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { STUDENTS, STUDENT_PROGRESS, Student } from '@/lib/data';
import { useBusinessStore } from '@/lib/BusinessStore';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import {
  getBusinessInvoices, getBusinessAlerts, getBillingSummary,
} from '@/lib/adminBillingData';
import {
  ArrowLeft, Mail, Phone, MapPin, Building2, Users,
  AlertTriangle, ShieldOff, ShieldCheck, Clock,
  KeyRound, UserX, UserCheck, Trash2, Pencil, Lock, Upload, X,
  CreditCard, CheckCircle, XCircle,
} from 'lucide-react';

const PRESET_COLORS = [
  '#6C3BAA', '#2563eb', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#db2777', '#7c3aed',
  '#3a6b3a', '#8b5e3c', '#e8a020', '#6b1a2a',
  '#8b2a5a', '#e86090', '#4a2a6b', '#5a1a6b',
];
const MAX_LOGO = 2 * 1024 * 1024;

/* ── billing helpers ───────────────────────────────────────────────────────── */
const fmt     = (n: number) => `£${n.toFixed(2)}`;
const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const INV_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  paid:    { label: 'Paid',    bg: 'bg-[#e6f4e6]', text: 'text-[#008a05]' },
  overdue: { label: 'Overdue', bg: 'bg-[#fff3cd]', text: 'text-[#c47a00]' },
  failed:  { label: 'Failed',  bg: 'bg-[#fde8e3]', text: 'text-[#c13515]' },
  pending: { label: 'Pending', bg: 'bg-[#f2f2f2]',  text: 'text-[#6a6a6a]' },
};

const ALERT_CFG = {
  payment_failed:  { bg: 'bg-[#fde8e3]', border: 'border-[#c13515]/20', icon: 'text-[#c13515]' },
  payment_declined:{ bg: 'bg-[#fde8e3]', border: 'border-[#c13515]/20', icon: 'text-[#c13515]' },
  card_expired:    { bg: 'bg-[#fde8e3]', border: 'border-[#c13515]/20', icon: 'text-[#c13515]' },
  overdue:         { bg: 'bg-[#fff3cd]', border: 'border-[#c47a00]/20', icon: 'text-[#c47a00]' },
  card_expiring:   { bg: 'bg-[#fff3cd]', border: 'border-[#c47a00]/20', icon: 'text-[#c47a00]' },
};

export default function BusinessDetailPage() {
  const { id }           = useParams<{ id: string }>();
  const searchParams     = useSearchParams();
  const initialTab       = searchParams.get('tab') === 'billing' ? 'billing' : 'overview';

  const { businesses, updateBusiness } = useBusinessStore();
  const business = businesses.find(b => b.id === id);

  /* ── tab state ── */
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'billing'>(initialTab as 'overview' | 'students' | 'billing');

  /* ── business actions ── */
  const [suspendOpen,   setSuspendOpen]   = useState(false);
  const [reinstateOpen, setReinstateOpen] = useState(false);
  const [suspendNote,   setSuspendNote]   = useState('');

  /* ── student state ── */
  const [localStudents, setLocalStudents]       = useState<Student[]>(() => STUDENTS);
  const [deleteTarget,    setDeleteTarget]       = useState<Student | null>(null);
  const [deactivateTarget,setDeactivateTarget]  = useState<Student | null>(null);
  const [reactivateTarget,setReactivateTarget]  = useState<Student | null>(null);
  const [resetTarget,     setResetTarget]        = useState<Student | null>(null);
  const [resetDone,       setResetDone]          = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  /* ── edit modal state ── */
  const [editOpen,      setEditOpen]    = useState(false);
  const [saving,        setSaving]      = useState(false);
  const [eName,         setEName]       = useState('');
  const [eContact,      setEContact]    = useState('');
  const [ePhone,        setEPhone]      = useState('');
  const [eAddress,      setEAddress]    = useState('');
  const [eColor,        setEColor]      = useState('#6C3BAA');
  const [eHexInput,     setEHexInput]   = useState('#6C3BAA');
  const [eHexError,     setEHexError]   = useState('');
  const [eLogo,         setELogo]       = useState<string | null>(null);
  const [eLogoDragging, setELogoDragging] = useState(false);
  const [eLogoError,    setELogoError]  = useState('');

  const eFileRef  = useRef<HTMLInputElement>(null);
  const eColorRef = useRef<HTMLInputElement>(null);

  const applyELogo = (file: File) => {
    if (!file.type.startsWith('image/')) { setELogoError('Only image files are accepted.'); return; }
    if (file.size > MAX_LOGO) { setELogoError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 2 MB.`); return; }
    setELogoError('');
    const reader = new FileReader();
    reader.onload = e => setELogo(e.target?.result as string);
    reader.readAsDataURL(file);
  };
  const removeELogo  = () => { setELogo(null); setELogoError(''); if (eFileRef.current) eFileRef.current.value = ''; };
  const applyEColor  = (hex: string) => { setEColor(hex); setEHexInput(hex); setEHexError(''); };
  const handleEHex   = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) { setEColor(val); setEHexError(''); }
    else setEHexError('Enter a valid hex colour (e.g. #6C3BAA)');
  };

  const openEdit = () => {
    if (!business) return;
    setEName(business.name);
    setEContact(business.contactName);
    setEPhone(business.phone);
    setEAddress(business.address);
    setEColor(business.brandColor || '#6C3BAA');
    setEHexInput(business.brandColor || '#6C3BAA');
    setELogo(business.logoUrl ?? null);
    setEHexError('');
    setELogoError('');
    setEditOpen(true);
  };
  const cancelEdit = () => setEditOpen(false);
  const saveEdit   = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    updateBusiness(id, {
      name:       eName.trim(),
      contactName: eContact.trim(),
      phone:      ePhone.trim(),
      address:    eAddress.trim(),
      brandColor: eColor,
      logoUrl:    eLogo ?? undefined,
    });
    setSaving(false);
    setEditOpen(false);
    showToast('Business profile updated.');
  };

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

  /* ── billing data ── */
  const invoices = getBusinessInvoices(business.id);
  const alerts   = getBusinessAlerts(business.id);
  const summary  = getBillingSummary(business.id);

  /* ── business handlers ── */
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

  /* ── student handlers ── */
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

  const handleResetPassword = () => { setResetDone(true); };

  const statusBadge = business.status as 'active' | 'suspended' | 'pending' | 'rejected';

  /* ── tabs config ── */
  const TABS = [
    { key: 'overview',  label: 'Overview' },
    { key: 'students',  label: `Students (${students.length})` },
    { key: 'billing',   label: 'Billing' },
  ] as const;

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
              </p>
            </div>
          </div>
        )}

        {/* ── Tab bar ── */}
        <div className="flex items-center gap-1 border-b border-[#ebebeb]">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-[14px] font-[500] border-b-2 -mb-px transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-[#6C3BAA] text-[#6C3BAA]'
                  : 'border-transparent text-[#6a6a6a] hover:text-[#222222]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <Card>
              {/* Card header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#ede5f7] flex items-center justify-center text-[22px] font-[600] text-[#6C3BAA] flex-shrink-0">
                    {business.name[0]}
                  </div>
                  <div>
                    <h2 className="text-[20px] font-[600] text-[#222222]">{business.name}</h2>
                    <p className="text-[13px] text-[#929292]">Account ID: {business.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={statusBadge}>{business.status.charAt(0).toUpperCase() + business.status.slice(1)}</Badge>
                  <button
                    onClick={openEdit}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] border border-[#dddddd] text-[13px] font-[500] text-[#3f3f3f] hover:border-[#6C3BAA] hover:text-[#6C3BAA] hover:bg-[#faf8ff] transition-colors cursor-pointer"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                </div>
              </div>

              {/* View mode */}
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
              <div className="flex items-start gap-3 mt-5">
                <span className="text-[#6a6a6a] mt-0.5 flex-shrink-0"><MapPin size={15} /></span>
                <div>
                  <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px]">Address</p>
                  <p className="text-[14px] text-[#222222]">{business.address}</p>
                </div>
              </div>
            </Card>

            {/* Billing summary card */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-[#6a6a6a]" />
                  <h3 className="text-[16px] font-[600] text-[#222222]">Billing Summary</h3>
                </div>
                <button
                  onClick={() => setActiveTab('billing')}
                  className="text-[13px] font-[500] text-[#6C3BAA] hover:underline cursor-pointer"
                >
                  View full billing →
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Paid', value: fmt(summary.totalPaid), color: '#008a05' },
                  { label: 'Outstanding', value: fmt(summary.outstanding), color: summary.outstanding > 0 ? '#c13515' : '#222222' },
                  { label: 'Last Payment', value: fmtDate(summary.lastPaymentDate), color: '#222222' },
                  { label: 'Alerts', value: String(summary.alertCount), color: summary.alertCount > 0 ? '#c47a00' : '#222222' },
                ].map(item => (
                  <div key={item.label} className="bg-[#f7f7f7] rounded-[12px] px-4 py-3">
                    <p className="text-[11px] font-[700] text-[#929292] uppercase tracking-[0.32px] mb-1">{item.label}</p>
                    <p className="text-[18px] font-[700]" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── STUDENTS TAB ── */}
        {activeTab === 'students' && (
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
                      {['Student', 'Overall Progress', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(stu => {
                      const prog   = STUDENT_PROGRESS.find(p => p.studentId === stu.id);
                      const catAvg = prog?.categories.length
                        ? Math.round(prog.categories.reduce((s, c) => s + Math.round((c.correct / c.total) * 100), 0) / prog.categories.length)
                        : null;
                      const scores  = [stu.mockTestAvg ?? null, stu.hazardScore ?? null, catAvg].filter((v): v is number => v !== null);
                      const overall = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
                      const barCol  = (v: number) => v >= 80 ? '#008a05' : v >= 60 ? '#c47a00' : '#c13515';

                      return (
                        <tr key={stu.id} className="border-b border-[#ebebeb] last:border-b-0 hover:bg-[#f7f7f7] transition-colors">
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
                            {overall != null ? (
                              <div className="flex items-center gap-3">
                                <div className="w-28 h-2 bg-[#f2f2f2] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${overall}%`, backgroundColor: barCol(overall) }} />
                                </div>
                                <span className="text-[13px] font-[600] w-8 flex-shrink-0" style={{ color: barCol(overall) }}>{overall}%</span>
                              </div>
                            ) : (
                              <span className="text-[13px] text-[#929292]">—</span>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* ── BILLING TAB ── */}
        {activeTab === 'billing' && (
          <div className="space-y-5">

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Paid', value: fmt(summary.totalPaid), sub: 'All time', icon: <CheckCircle size={18} className="text-[#008a05]" />, bg: 'bg-[#e6f4e6]' },
                { label: 'Outstanding', value: fmt(summary.outstanding), sub: summary.outstanding > 0 ? 'Requires attention' : 'All clear', icon: <XCircle size={18} className={summary.outstanding > 0 ? 'text-[#c13515]' : 'text-[#6a6a6a]'} />, bg: summary.outstanding > 0 ? 'bg-[#fde8e3]' : 'bg-[#f2f2f2]' },
                { label: 'Active Alerts', value: String(summary.alertCount), sub: summary.alertCount > 0 ? 'Needs review' : 'No issues', icon: <AlertTriangle size={18} className={summary.alertCount > 0 ? 'text-[#c47a00]' : 'text-[#6a6a6a]'} />, bg: summary.alertCount > 0 ? 'bg-[#fff3cd]' : 'bg-[#f2f2f2]' },
              ].map(item => (
                <Card key={item.label}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${item.bg} rounded-[10px] flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px]">{item.label}</p>
                      <p className="text-[22px] font-[700] text-[#222222] leading-tight">{item.value}</p>
                      <p className="text-[12px] text-[#929292] mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} className="text-[#c47a00]" />
                  <h3 className="text-[16px] font-[600] text-[#222222]">Payment Alerts</h3>
                </div>
                <div className="space-y-3">
                  {alerts.map(alert => {
                    const cfg = ALERT_CFG[alert.type] ?? ALERT_CFG.overdue;
                    return (
                      <div key={alert.id} className={`flex items-start gap-3 ${cfg.bg} border ${cfg.border} rounded-[12px] px-4 py-3`}>
                        <AlertTriangle size={16} className={`${cfg.icon} flex-shrink-0 mt-0.5`} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-[600] text-[#222222]">{alert.title}</p>
                          <p className="text-[13px] text-[#3f3f3f] mt-0.5">{alert.message}</p>
                          <p className="text-[12px] text-[#929292] mt-1">{fmtDate(alert.date)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Invoice history */}
            <Card padding="none">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-[#ebebeb]">
                <CreditCard size={16} className="text-[#6a6a6a]" />
                <h3 className="text-[16px] font-[600] text-[#222222]">Invoice History</h3>
                <span className="text-[13px] text-[#929292]">({invoices.length})</span>
              </div>
              {invoices.length === 0 ? (
                <div className="px-5 py-10 text-center text-[14px] text-[#929292]">No invoices found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                        {['Invoice', 'Date', 'Due Date', 'Students', 'Amount', 'Status', ''].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(inv => {
                        const cfg = INV_STATUS[inv.status] ?? INV_STATUS.pending;
                        return (
                          <tr key={inv.id} className="border-b border-[#ebebeb] last:border-b-0 hover:bg-[#f7f7f7] transition-colors">
                            <td className="px-5 py-3.5">
                              <p className="text-[14px] font-[500] text-[#222222]">{inv.number}</p>
                            </td>
                            <td className="px-5 py-3.5 text-[14px] text-[#3f3f3f]">{fmtDate(inv.date)}</td>
                            <td className="px-5 py-3.5 text-[14px] text-[#3f3f3f]">{fmtDate(inv.dueDate)}</td>
                            <td className="px-5 py-3.5 text-[14px] text-[#3f3f3f]">{inv.students}</td>
                            <td className="px-5 py-3.5 text-[14px] font-[600] text-[#222222]">{fmt(inv.amountRaw)}</td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1 text-[12px] font-[600] px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                                {cfg.label}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              {inv.status === 'paid' && inv.paidDate && (
                                <p className="text-[12px] text-[#929292]">Paid {fmtDate(inv.paidDate)}</p>
                              )}
                              {inv.failedReason && (
                                <p className="text-[12px] text-[#c13515]">{inv.failedReason}</p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

      </div>

      {/* ── Edit Business modal ── */}
      <Modal
        open={editOpen}
        onClose={cancelEdit}
        title="Edit Business Info"
        size="md"
        footer={
          <>
            <button onClick={cancelEdit} disabled={saving} className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] cursor-pointer disabled:opacity-50">
              Cancel
            </button>
            <button onClick={saveEdit} disabled={saving} className="px-5 py-2.5 text-[14px] font-[500] text-white bg-[#6C3BAA] hover:bg-[#5a3190] rounded-[12px] cursor-pointer disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-[700] text-[#929292] uppercase tracking-[0.4px] mb-1.5">Business Name</label>
              <input type="text" value={eName} onChange={e => setEName(e.target.value)} className="w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-[700] text-[#929292] uppercase tracking-[0.4px] mb-1.5">Contact Name</label>
              <input type="text" value={eContact} onChange={e => setEContact(e.target.value)} className="w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-[700] text-[#929292] uppercase tracking-[0.4px] mb-1.5">Phone Number</label>
              <input type="tel" value={ePhone} onChange={e => setEPhone(e.target.value)} className="w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-[700] text-[#929292] uppercase tracking-[0.4px] mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={business.email}
                  readOnly
                  className="w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] bg-[#f7f7f7] text-[#929292] cursor-not-allowed pr-24"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-[600] text-[#929292] bg-[#ebebeb] px-2 py-0.5 rounded-full uppercase tracking-wide">
                  <Lock size={9} /> Account
                </span>
              </div>
              <p className="text-[11px] text-[#929292] mt-1">Email is tied to the account login and cannot be changed.</p>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-[700] text-[#929292] uppercase tracking-[0.4px] mb-1.5">Address</label>
            <textarea rows={2} value={eAddress} onChange={e => setEAddress(e.target.value)} className="w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors resize-none" />
          </div>

          {/* ── Branding ── */}
          <div className="pt-3 border-t border-[#f2f2f2]">
            <p className="text-[11px] font-[700] text-[#929292] uppercase tracking-[0.5px] mb-3">Branding</p>
            <div className="space-y-4">

              {/* Logo */}
              <div>
                <label className="block text-[11px] font-[700] text-[#929292] uppercase tracking-[0.4px] mb-1.5">Business Logo</label>
                <div className="flex items-start gap-4">
                  {eLogo ? (
                    <div className="relative flex-shrink-0">
                      <img src={eLogo} alt="logo" className="w-16 h-16 rounded-[12px] object-cover border-2 border-[#ebebeb]" />
                      <button type="button" onClick={removeELogo} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#c13515] text-white flex items-center justify-center shadow cursor-pointer hover:bg-[#a02a10] transition-colors">
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => eFileRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setELogoDragging(true); }}
                      onDragLeave={() => setELogoDragging(false)}
                      onDrop={e => { e.preventDefault(); setELogoDragging(false); const f = e.dataTransfer.files?.[0]; if (f) applyELogo(f); }}
                      className={`w-16 h-16 rounded-[12px] flex flex-col items-center justify-center gap-1 border-2 border-dashed cursor-pointer transition-colors flex-shrink-0 ${eLogoDragging ? 'border-[#6C3BAA] bg-[#ede5f7]' : 'border-[#dddddd] hover:border-[#6C3BAA] hover:bg-[#faf8ff]'}`}
                      style={{ backgroundColor: eLogoDragging ? undefined : eColor + '10' }}
                    >
                      <Upload size={14} style={{ color: eColor }} />
                      <span className="text-[9px] font-[600]" style={{ color: eColor }}>Upload</span>
                    </div>
                  )}
                  <div className="pt-1 min-w-0">
                    <p className="text-[12px] text-[#6a6a6a]">PNG, JPG or SVG · Max 2 MB</p>
                    {!eLogo && (
                      <button type="button" onClick={() => eFileRef.current?.click()} className="mt-1.5 text-[12px] font-[500] cursor-pointer hover:opacity-80" style={{ color: eColor }}>
                        Choose file
                      </button>
                    )}
                    {eLogoError && <p className="text-[11px] text-[#c13515] mt-1">{eLogoError}</p>}
                  </div>
                </div>
                <input ref={eFileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) applyELogo(f); }} />
              </div>

              {/* Brand colour */}
              <div>
                <label className="block text-[11px] font-[700] text-[#929292] uppercase tracking-[0.4px] mb-1.5">Brand Colour</label>
                <div className="p-3 border border-[#ebebeb] rounded-[10px] bg-[#fafafa] space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <button type="button" onClick={() => eColorRef.current?.click()} className="w-10 h-10 rounded-full border-[3px] border-white shadow-md cursor-pointer transition-transform hover:scale-105" style={{ backgroundColor: eColor }} />
                      <input ref={eColorRef} type="color" value={eColor} onChange={e => applyEColor(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-none" />
                    </div>
                    <div className="grid grid-cols-8 gap-1.5">
                      {PRESET_COLORS.map(c => (
                        <button key={c} type="button" onClick={() => applyEColor(c)} title={c}
                          className="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110"
                          style={{ backgroundColor: c, outline: eColor.toLowerCase() === c.toLowerCase() ? `3px solid ${c}` : 'none', outlineOffset: 2 }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <input type="text" value={eHexInput} onChange={handleEHex} placeholder="#6C3BAA" maxLength={7}
                      className="w-28 px-2.5 py-1.5 text-[12px] font-mono border border-[#dddddd] rounded-[8px] focus:outline-none focus:border-[#6C3BAA] bg-white"
                    />
                    {eHexError && <p className="text-[11px] text-[#c13515] mt-1">{eHexError}</p>}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Modal>

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
            This will <strong>permanently delete</strong> {deleteTarget?.name}&apos;s account and all associated data. This action <strong>cannot be undone</strong>.
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
