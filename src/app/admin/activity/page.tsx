'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/Table';
import { CheckCircle, XCircle, ShieldOff, ShieldCheck, KeyRound, UserX, Trash2, UserPlus } from 'lucide-react';

type ActionType = 'approve' | 'reject' | 'suspend' | 'reinstate' | 'reset_password' | 'deactivate' | 'delete' | 'create';

interface ActivityEntry {
  id: string;
  action: ActionType;
  targetName: string;
  targetType: 'business' | 'student';
  performedBy: string;
  timestamp: string;
  notes?: string;
}

const ACTIVITY: ActivityEntry[] = [
  { id: 'act-001', action: 'approve', targetName: 'DriveRight Academy', targetType: 'business', performedBy: 'Super Admin', timestamp: '2024-04-26 14:32', notes: 'Verified business registration.' },
  { id: 'act-002', action: 'reset_password', targetName: 'Alex Johnson', targetType: 'student', performedBy: 'Super Admin', timestamp: '2024-04-25 10:15' },
  { id: 'act-003', action: 'suspend', targetName: 'QuickPass Training Ltd', targetType: 'business', performedBy: 'Super Admin', timestamp: '2024-03-10 09:00', notes: 'Payment failed. Card declined.' },
  { id: 'act-004', action: 'deactivate', targetName: 'Olivia Davis', targetType: 'student', performedBy: 'Super Admin', timestamp: '2024-03-15 16:44' },
  { id: 'act-005', action: 'reject', targetName: 'HighwayCode Pros', targetType: 'business', performedBy: 'Super Admin', timestamp: '2024-03-06 11:20', notes: 'Could not verify business registration number.' },
  { id: 'act-006', action: 'create', targetName: 'Elite Driving Academy', targetType: 'business', performedBy: 'Super Admin', timestamp: '2023-11-05 13:00', notes: 'Manually created — referred by partnership team.' },
  { id: 'act-007', action: 'reinstate', targetName: 'PassFirst Driving School', targetType: 'business', performedBy: 'Super Admin', timestamp: '2024-02-20 08:30', notes: 'New card added. Payment confirmed.' },
  { id: 'act-008', action: 'delete', targetName: 'Tom Sample (test)', targetType: 'student', performedBy: 'Super Admin', timestamp: '2024-04-01 17:10', notes: 'Test account cleanup.' },
];

const ACTION_META: Record<ActionType, { label: string; icon: React.ReactNode; color: string; badgeVariant: 'active' | 'suspended' | 'pending' | 'rejected' | 'inactive' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  approve:        { label: 'Approved',          icon: <CheckCircle size={14} />,  color: 'text-[#008a05]', badgeVariant: 'success' },
  reject:         { label: 'Rejected',          icon: <XCircle size={14} />,      color: 'text-[#c13515]', badgeVariant: 'danger' },
  suspend:        { label: 'Suspended',         icon: <ShieldOff size={14} />,    color: 'text-[#c47a00]', badgeVariant: 'warning' },
  reinstate:      { label: 'Reinstated',        icon: <ShieldCheck size={14} />,  color: 'text-[#008a05]', badgeVariant: 'success' },
  reset_password: { label: 'Password Reset',    icon: <KeyRound size={14} />,     color: 'text-[#0066cc]', badgeVariant: 'info' },
  deactivate:     { label: 'Deactivated',       icon: <UserX size={14} />,        color: 'text-[#c47a00]', badgeVariant: 'warning' },
  delete:         { label: 'Deleted',           icon: <Trash2 size={14} />,       color: 'text-[#c13515]', badgeVariant: 'danger' },
  create:         { label: 'Account Created',   icon: <UserPlus size={14} />,     color: 'text-[#ff385c]', badgeVariant: 'pending' },
};

export default function ActivityPage() {
  const [search, setSearch] = useState('');
  const filtered = ACTIVITY.filter(a =>
    a.targetName.toLowerCase().includes(search.toLowerCase()) ||
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    a.performedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopBar title="Activity Log" subtitle="All admin actions and changes" />
      <div className="p-6 space-y-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search activity…" />
        <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                {['Action', 'Target', 'Type', 'Performed by', 'Date', 'Notes'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[14px] text-[#929292]">No activity found.</td></tr>
              ) : (
                filtered.map((entry, idx) => {
                  const meta = ACTION_META[entry.action];
                  return (
                    <tr key={entry.id} className={`border-b border-[#ebebeb] last:border-b-0 ${idx % 2 !== 0 ? 'bg-[#fafafa]' : ''}`}>
                      <td className="px-4 py-3.5">
                        <div className={`flex items-center gap-2 font-[500] text-[14px] ${meta.color}`}>
                          {meta.icon} {meta.label}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[14px] text-[#222222] font-[500]">{entry.targetName}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={entry.targetType === 'business' ? 'info' : 'neutral'}>
                          {entry.targetType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-[14px] text-[#6a6a6a]">{entry.performedBy}</td>
                      <td className="px-4 py-3.5 text-[13px] text-[#929292] whitespace-nowrap">{entry.timestamp}</td>
                      <td className="px-4 py-3.5 text-[13px] text-[#929292] max-w-[200px] truncate">{entry.notes ?? '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
