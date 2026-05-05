'use client';

import React, { createContext, useContext, useState } from 'react';

export const PER_STUDENT_COST = 5; // £5 per student

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfNextMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}
function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

interface BillingEntry {
  studentName: string;
  addedAt: string; // ISO
  cost: number;
}

interface BillingContextType {
  // current cycle
  studentsThisMonth: number;
  runningBalance: number;
  perStudentCost: number;
  cycleStart: Date;
  nextBillingDate: Date;
  nextBillingLabel: string;   // "1st June 2026"
  billingEntries: BillingEntry[];
  // actions
  addStudentCharge: (studentName: string) => void;
  resetCycle: () => void;
}

const now = new Date();

const BillingContext = createContext<BillingContextType>({
  studentsThisMonth: 0,
  runningBalance: 0,
  perStudentCost: PER_STUDENT_COST,
  cycleStart: startOfMonth(now),
  nextBillingDate: startOfNextMonth(now),
  nextBillingLabel: '',
  billingEntries: [],
  addStudentCharge: () => {},
  resetCycle: () => {},
});

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [cycleStart]       = useState(() => startOfMonth(new Date()));
  const [nextBillingDate]  = useState(() => startOfNextMonth(new Date()));
  const [billingEntries, setBillingEntries] = useState<BillingEntry[]>([]);

  const studentsThisMonth = billingEntries.length;
  const runningBalance    = studentsThisMonth * PER_STUDENT_COST;

  const nextDay = nextBillingDate.getDate();
  const nextBillingLabel = `${ordinal(nextDay)} ${nextBillingDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`;

  const addStudentCharge = (studentName: string) => {
    setBillingEntries(prev => [
      ...prev,
      { studentName, addedAt: new Date().toISOString(), cost: PER_STUDENT_COST },
    ]);
  };

  const resetCycle = () => setBillingEntries([]);

  return (
    <BillingContext.Provider value={{
      studentsThisMonth,
      runningBalance,
      perStudentCost: PER_STUDENT_COST,
      cycleStart,
      nextBillingDate,
      nextBillingLabel,
      billingEntries,
      addStudentCharge,
      resetCycle,
    }}>
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  return useContext(BillingContext);
}
