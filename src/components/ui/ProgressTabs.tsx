'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, BookOpen } from 'lucide-react';

export interface MockTestResult  { date: string; score: number; passed: boolean; studentName?: string; }
export interface HazardResult    { date: string; score: number; passed: boolean; studentName?: string; }
export interface CategoryResult  { category: string; correct: number; total: number; }

interface Props {
  mockTests:   MockTestResult[];
  hazardTests: HazardResult[];
  categories:  CategoryResult[];
  mockTotal?:  number;  // max score (default 50)
  mockPass?:   number;  // pass mark (default 43)
  hazardTotal?: number; // max score (default 75)
  hazardPass?:  number; // pass mark (default 44)
}

type Tab = 'mock' | 'hazard' | 'categories';

const pct        = (n: number, total: number) => Math.round((n / total) * 100);
const scoreColor = (score: number, pass: number) =>
  score >= pass ? '#008a05' : score >= pass * 0.85 ? '#c47a00' : '#c13515';

export function ProgressTabs({
  mockTests,
  hazardTests,
  categories,
  mockTotal   = 50,
  mockPass    = 43,
  hazardTotal = 75,
  hazardPass  = 44,
}: Props) {
  const [tab, setTab] = useState<Tab>('mock');

  const mockPassCount   = mockTests.filter(t => t.passed).length;
  const hazardPassCount = hazardTests.filter(t => t.passed).length;

  const TABS: { value: Tab; label: string; count: number }[] = [
    { value: 'mock',       label: 'Mock Test Results', count: mockTests.length },
    { value: 'hazard',     label: 'Hazard Perception', count: hazardTests.length },
    { value: 'categories', label: 'Category Summary',  count: categories.length },
  ];

  return (
    <div className="space-y-4">

      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#ebebeb] rounded-full w-fit">
        {TABS.map(t => (
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

      {/* ── Mock Test Results ── */}
      {tab === 'mock' && (
        <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#ebebeb] flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-[15px] font-[600] text-[#222222]">Mock Test Results</h2>
              <p className="text-[12px] text-[#929292] mt-0.5">Pass mark: {mockPass}/{mockTotal} · {mockTests.length} attempt{mockTests.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-3 text-[12px]">
              <span className="flex items-center gap-1 text-[#008a05] font-[500]"><CheckCircle size={12} /> {mockPassCount} passed</span>
              <span className="flex items-center gap-1 text-[#c13515] font-[500]"><XCircle size={12} /> {mockTests.length - mockPassCount} failed</span>
            </div>
          </div>
          {mockTests.length === 0 ? (
            <div className="px-5 py-14 text-center text-[14px] text-[#929292]">No mock test data yet.</div>
          ) : (
            <div className="px-5 py-5 space-y-3.5">
              {mockTests.map((t, i) => {
                const p   = pct(t.score, mockTotal);
                const col = scoreColor(t.score, mockPass);
                return (
                  <div key={i} className="flex items-center gap-3">
                    {t.studentName && (
                      <div className="w-6 h-6 rounded-full bg-[#ede5f7] flex items-center justify-center text-[11px] font-[700] text-[#6C3BAA] flex-shrink-0">
                        {t.studentName[0]}
                      </div>
                    )}
                    <span className="text-[12px] text-[#929292] w-20 flex-shrink-0 truncate">{t.date}</span>
                    <div className="flex-1 h-2.5 bg-[#f2f2f2] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: col }} />
                    </div>
                    <span className="text-[13px] font-[600] w-14 text-right flex-shrink-0" style={{ color: col }}>
                      {t.score}/{mockTotal}
                    </span>
                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-[600] flex-shrink-0 ${t.passed ? 'bg-[#e6f4e6] text-[#008a05]' : 'bg-[#fde8e3] text-[#c13515]'}`}>
                      {t.passed ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {t.passed ? 'Pass' : 'Fail'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Hazard Perception ── */}
      {tab === 'hazard' && (
        <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#ebebeb] flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-[15px] font-[600] text-[#222222]">Hazard Perception Results</h2>
              <p className="text-[12px] text-[#929292] mt-0.5">Pass mark: {hazardPass}/{hazardTotal} · {hazardTests.length} attempt{hazardTests.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-3 text-[12px]">
              <span className="flex items-center gap-1 text-[#008a05] font-[500]"><CheckCircle size={12} /> {hazardPassCount} passed</span>
              <span className="flex items-center gap-1 text-[#c13515] font-[500]"><XCircle size={12} /> {hazardTests.length - hazardPassCount} failed</span>
            </div>
          </div>
          {hazardTests.length === 0 ? (
            <div className="px-5 py-14 text-center text-[14px] text-[#929292]">No hazard test data yet.</div>
          ) : (
            <div className="px-5 py-5 space-y-3.5">
              {hazardTests.map((t, i) => {
                const p   = pct(t.score, hazardTotal);
                const col = scoreColor(t.score, hazardPass);
                return (
                  <div key={i} className="flex items-center gap-3">
                    {t.studentName && (
                      <div className="w-6 h-6 rounded-full bg-[#ede5f7] flex items-center justify-center text-[11px] font-[700] text-[#6C3BAA] flex-shrink-0">
                        {t.studentName[0]}
                      </div>
                    )}
                    <span className="text-[12px] text-[#929292] w-20 flex-shrink-0 truncate">{t.date}</span>
                    <div className="flex-1 h-2.5 bg-[#f2f2f2] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: col }} />
                    </div>
                    <span className="text-[13px] font-[600] w-14 text-right flex-shrink-0" style={{ color: col }}>
                      {t.score}/{hazardTotal}
                    </span>
                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-[600] flex-shrink-0 ${t.passed ? 'bg-[#e6f4e6] text-[#008a05]' : 'bg-[#fde8e3] text-[#c13515]'}`}>
                      {t.passed ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {t.passed ? 'Pass' : 'Fail'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Category Summary ── */}
      {tab === 'categories' && (
        <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#ebebeb]">
            <h2 className="text-[15px] font-[600] text-[#222222]">Category Summary</h2>
            <p className="text-[12px] text-[#929292] mt-0.5">Performance breakdown across all question categories</p>
          </div>
          {categories.length === 0 ? (
            <div className="px-5 py-14 text-center text-[14px] text-[#929292]">No category data yet.</div>
          ) : (
            <div className="p-5 space-y-4">
              {categories.map(cat => {
                const p   = pct(cat.correct, cat.total);
                const col = p >= 80 ? '#008a05' : p >= 60 ? '#c47a00' : '#c13515';
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
                      <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: col }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
