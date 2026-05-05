'use client';

import React from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Building2, Users, ClipboardCheck, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { BUSINESSES, STUDENTS, STATS } from '@/lib/data';

export default function DashboardPage() {
  const pending = BUSINESSES.filter(b => b.status === 'pending');
  const recentStudents = STUDENTS.slice(0, 5);

  return (
    <>
      <TopBar title="Dashboard" subtitle="Overview of all businesses and students" />
      <div className="p-6 space-y-6">

        {/* Stats grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Businesses"
            value={STATS.totalBusinesses}
            subtitle="Registered on platform"
            icon={<Building2 size={18} />}
            color="primary"
          />
          <StatCard
            title="Pending Applications"
            value={STATS.pendingApplications}
            subtitle="Awaiting review"
            icon={<ClipboardCheck size={18} />}
            color="warning"
          />
          <StatCard
            title="Total Students"
            value={STATS.totalStudents}
            subtitle="Across all businesses"
            icon={<Users size={18} />}
            color="success"
          />
          <StatCard
            title="Suspended Businesses"
            value={STATS.suspendedBusinesses}
            subtitle="Access restricted"
            icon={<AlertTriangle size={18} />}
            color="danger"
          />
        </div>

        {/* Two-column */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Pending applications */}
          <div className="bg-white border border-[#ebebeb] rounded-[14px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb]">
              <h2 className="text-[16px] font-[600] text-[#222222]">Pending Applications</h2>
              <Link href="/admin/businesses/applications" className="text-[13px] text-[#6C3BAA] hover:underline font-[500] flex items-center gap-1">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            {pending.length === 0 ? (
              <div className="px-5 py-10 text-center text-[14px] text-[#929292]">No pending applications.</div>
            ) : (
              <ul>
                {pending.map((biz, idx) => (
                  <li key={biz.id} className={`flex items-start gap-4 px-5 py-4 ${idx < pending.length - 1 ? 'border-b border-[#ebebeb]' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[14px] font-[600] text-[#6a6a6a] flex-shrink-0">
                      {biz.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-[500] text-[#222222] truncate">{biz.name}</p>
                      <p className="text-[13px] text-[#929292]">{biz.email}</p>
                      <p className="text-[12px] text-[#929292] mt-0.5">Applied {biz.appliedAt}</p>
                    </div>
                    <Link
                      href="/admin/businesses/applications"
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-[600] bg-[#f2f2f2] text-[#222222] border border-[#c1c1c1] hover:bg-[#e8e8e8] transition-colors flex-shrink-0"
                    >
                      View Details
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent students */}
          <div className="bg-white border border-[#ebebeb] rounded-[14px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb]">
              <h2 className="text-[16px] font-[600] text-[#222222]">Recent Students</h2>
              <Link href="/admin/students" className="text-[13px] text-[#6C3BAA] hover:underline font-[500] flex items-center gap-1">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <ul>
              {recentStudents.map((stu, idx) => (
                <li key={stu.id} className={`flex items-center gap-4 px-5 py-3.5 ${idx < recentStudents.length - 1 ? 'border-b border-[#ebebeb]' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[13px] font-[600] text-[#6a6a6a] flex-shrink-0">
                    {stu.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-[500] text-[#222222] truncate">{stu.name}</p>
                    <p className="text-[13px] text-[#929292] truncate">{stu.businessName}</p>
                  </div>
                  <Badge variant={stu.status === 'active' ? 'active' : 'suspended'}>
                    {stu.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* All businesses summary */}
        <div className="bg-white border border-[#ebebeb] rounded-[14px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb]">
            <h2 className="text-[16px] font-[600] text-[#222222]">Business Overview</h2>
            <Link href="/admin/businesses" className="text-[13px] text-[#6C3BAA] hover:underline font-[500] flex items-center gap-1">
              Manage all <ChevronRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                  {['Business', 'Contact', 'Status', 'Students', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[12px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BUSINESSES.filter(b => b.status !== 'rejected').slice(0, 6).map((biz, idx, arr) => (
                  <tr key={biz.id} className={`${idx < arr.length - 1 ? 'border-b border-[#ebebeb]' : ''} hover:bg-[#f7f7f7] transition-colors`}>
                    <td className="px-5 py-3.5">
                      <p className="text-[14px] font-[500] text-[#222222]">{biz.name}</p>
                      <p className="text-[13px] text-[#929292]">{biz.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[14px] text-[#222222]">{biz.contactName}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={biz.status as 'active' | 'suspended' | 'pending'}>{biz.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-[14px] text-[#222222]">{biz.studentCount}</td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/businesses/${biz.id}`} className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-[600] bg-[#f2f2f2] text-[#222222] border border-[#c1c1c1] hover:bg-[#e8e8e8] transition-colors">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
