import { PER_STUDENT_COST } from './BillingStore';

export interface Invoice {
  id: string;
  number: string;
  date: string;       // ISO yyyy-mm-dd
  dueDate: string;    // ISO yyyy-mm-dd
  amount: string;     // formatted £X.XX
  amountRaw: number;  // numeric pence / pounds
  students: number;
  status: 'paid' | 'overdue';
  paidDate?: string;  // ISO yyyy-mm-dd
}

export const PAST_INVOICES: Invoice[] = [
  { id: 'inv-001', number: 'INV-2026-0042', date: '2026-04-01', dueDate: '2026-04-14', amount: '£180.00', amountRaw: 180, students: 36, status: 'paid',    paidDate: '2026-04-10' },
  { id: 'inv-002', number: 'INV-2026-0031', date: '2026-03-01', dueDate: '2026-03-14', amount: '£155.00', amountRaw: 155, students: 31, status: 'paid',    paidDate: '2026-03-08' },
  { id: 'inv-003', number: 'INV-2026-0019', date: '2026-02-01', dueDate: '2026-02-14', amount: '£165.00', amountRaw: 165, students: 33, status: 'paid',    paidDate: '2026-02-11' },
  { id: 'inv-004', number: 'INV-2026-0008', date: '2026-01-01', dueDate: '2026-01-14', amount: '£140.00', amountRaw: 140, students: 28, status: 'paid',    paidDate: '2026-01-09' },
  { id: 'inv-005', number: 'INV-2025-0097', date: '2025-12-01', dueDate: '2025-12-14', amount: '£125.00', amountRaw: 125, students: 25, status: 'overdue'  },
  { id: 'inv-006', number: 'INV-2025-0084', date: '2025-11-01', dueDate: '2025-11-14', amount: '£150.00', amountRaw: 150, students: 30, status: 'paid',    paidDate: '2025-11-07' },
];

export { PER_STUDENT_COST };
