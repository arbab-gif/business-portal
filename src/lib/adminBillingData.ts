// Admin-side billing data — per-business invoices, alerts, and summaries

export type InvoiceStatus = 'paid' | 'overdue' | 'failed' | 'pending';

export interface AdminInvoice {
  id: string;
  businessId: string;
  number: string;
  date: string;       // yyyy-mm-dd
  dueDate: string;
  students: number;
  amountRaw: number;  // £
  status: InvoiceStatus;
  paidDate?: string;
  failedReason?: string;
}

export type AlertType = 'payment_failed' | 'payment_declined' | 'card_expired' | 'card_expiring' | 'overdue';

export interface BillingAlert {
  id: string;
  businessId: string;
  type: AlertType;
  title: string;
  message: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
}

const PER_STUDENT = 5; // £5 per student

export const ADMIN_INVOICES: AdminInvoice[] = [
  // ── DriveRight Academy (biz-001) ─────────────────────────────────────────
  { id: 'ai-001', businessId: 'biz-001', number: 'INV-2026-0042', date: '2026-04-01', dueDate: '2026-04-14', students: 36, amountRaw: 180, status: 'paid',    paidDate: '2026-04-10' },
  { id: 'ai-002', businessId: 'biz-001', number: 'INV-2026-0031', date: '2026-03-01', dueDate: '2026-03-14', students: 31, amountRaw: 155, status: 'paid',    paidDate: '2026-03-08' },
  { id: 'ai-003', businessId: 'biz-001', number: 'INV-2026-0019', date: '2026-02-01', dueDate: '2026-02-14', students: 33, amountRaw: 165, status: 'paid',    paidDate: '2026-02-11' },
  { id: 'ai-004', businessId: 'biz-001', number: 'INV-2026-0008', date: '2026-01-01', dueDate: '2026-01-14', students: 28, amountRaw: 140, status: 'paid',    paidDate: '2026-01-09' },
  { id: 'ai-005', businessId: 'biz-001', number: 'INV-2025-0097', date: '2025-12-01', dueDate: '2025-12-14', students: 25, amountRaw: 125, status: 'overdue'  },
  { id: 'ai-006', businessId: 'biz-001', number: 'INV-2025-0084', date: '2025-11-01', dueDate: '2025-11-14', students: 30, amountRaw: 150, status: 'paid',    paidDate: '2025-11-07' },

  // ── PassFirst Driving School (biz-002) ───────────────────────────────────
  { id: 'ai-007', businessId: 'biz-002', number: 'INV-2026-0041', date: '2026-04-01', dueDate: '2026-04-14', students: 22, amountRaw: 110, status: 'paid',    paidDate: '2026-04-05' },
  { id: 'ai-008', businessId: 'biz-002', number: 'INV-2026-0029', date: '2026-03-01', dueDate: '2026-03-14', students: 24, amountRaw: 120, status: 'paid',    paidDate: '2026-03-12' },
  { id: 'ai-009', businessId: 'biz-002', number: 'INV-2026-0017', date: '2026-02-01', dueDate: '2026-02-14', students: 20, amountRaw: 100, status: 'paid',    paidDate: '2026-02-09' },
  { id: 'ai-010', businessId: 'biz-002', number: 'INV-2026-0005', date: '2026-01-01', dueDate: '2026-01-14', students: 18, amountRaw: 90,  status: 'paid',    paidDate: '2026-01-11' },
  { id: 'ai-011', businessId: 'biz-002', number: 'INV-2025-0092', date: '2025-12-01', dueDate: '2025-12-14', students: 21, amountRaw: 105, status: 'paid',    paidDate: '2025-12-08' },
  { id: 'ai-012', businessId: 'biz-002', number: 'INV-2025-0079', date: '2025-11-01', dueDate: '2025-11-14', students: 19, amountRaw: 95,  status: 'paid',    paidDate: '2025-11-10' },

  // ── QuickPass Training Ltd (biz-003, suspended) ──────────────────────────
  { id: 'ai-013', businessId: 'biz-003', number: 'INV-2026-0040', date: '2026-04-01', dueDate: '2026-04-14', students: 12, amountRaw: 60,  status: 'failed',  failedReason: 'Card declined — insufficient funds' },
  { id: 'ai-014', businessId: 'biz-003', number: 'INV-2026-0028', date: '2026-03-01', dueDate: '2026-03-14', students: 14, amountRaw: 70,  status: 'overdue'  },
  { id: 'ai-015', businessId: 'biz-003', number: 'INV-2026-0016', date: '2026-02-01', dueDate: '2026-02-14', students: 13, amountRaw: 65,  status: 'paid',    paidDate: '2026-02-10' },
  { id: 'ai-016', businessId: 'biz-003', number: 'INV-2026-0004', date: '2026-01-01', dueDate: '2026-01-14', students: 15, amountRaw: 75,  status: 'paid',    paidDate: '2026-01-13' },
  { id: 'ai-017', businessId: 'biz-003', number: 'INV-2025-0091', date: '2025-12-01', dueDate: '2025-12-14', students: 11, amountRaw: 55,  status: 'paid',    paidDate: '2025-12-07' },
  { id: 'ai-018', businessId: 'biz-003', number: 'INV-2025-0078', date: '2025-11-01', dueDate: '2025-11-14', students: 10, amountRaw: 50,  status: 'paid',    paidDate: '2025-11-09' },

  // ── Elite Driving Academy (biz-007) ──────────────────────────────────────
  { id: 'ai-019', businessId: 'biz-007', number: 'INV-2026-0043', date: '2026-04-01', dueDate: '2026-04-14', students: 58, amountRaw: 290, status: 'paid',    paidDate: '2026-04-03' },
  { id: 'ai-020', businessId: 'biz-007', number: 'INV-2026-0032', date: '2026-03-01', dueDate: '2026-03-14', students: 55, amountRaw: 275, status: 'paid',    paidDate: '2026-03-05' },
  { id: 'ai-021', businessId: 'biz-007', number: 'INV-2026-0021', date: '2026-02-01', dueDate: '2026-02-14', students: 52, amountRaw: 260, status: 'paid',    paidDate: '2026-02-06' },
  { id: 'ai-022', businessId: 'biz-007', number: 'INV-2026-0009', date: '2026-01-01', dueDate: '2026-01-14', students: 50, amountRaw: 250, status: 'paid',    paidDate: '2026-01-07' },
  { id: 'ai-023', businessId: 'biz-007', number: 'INV-2025-0098', date: '2025-12-01', dueDate: '2025-12-14', students: 48, amountRaw: 240, status: 'paid',    paidDate: '2025-12-04' },
  { id: 'ai-024', businessId: 'biz-007', number: 'INV-2025-0085', date: '2025-11-01', dueDate: '2025-11-14', students: 45, amountRaw: 225, status: 'paid',    paidDate: '2025-11-06' },
];

export const BILLING_ALERTS: BillingAlert[] = [
  {
    id: 'ba-001', businessId: 'biz-003',
    type: 'payment_failed',
    title: 'Payment Failed',
    message: 'Invoice INV-2026-0040 (£60.00) could not be processed — card declined due to insufficient funds.',
    date: '2026-04-14',
    severity: 'high',
  },
  {
    id: 'ba-002', businessId: 'biz-003',
    type: 'overdue',
    title: 'Invoice Overdue',
    message: 'Invoice INV-2026-0028 (£70.00) is 45 days overdue. Account remains suspended until balance is cleared.',
    date: '2026-03-14',
    severity: 'high',
  },
  {
    id: 'ba-003', businessId: 'biz-001',
    type: 'overdue',
    title: 'Invoice Overdue',
    message: 'Invoice INV-2025-0097 (£125.00) is past its due date of 14 Dec 2025. Please follow up with the account holder.',
    date: '2025-12-14',
    severity: 'medium',
  },
  {
    id: 'ba-004', businessId: 'biz-002',
    type: 'card_expiring',
    title: 'Card Expiring Soon',
    message: 'Payment card on file for PassFirst Driving School expires in June 2026. Prompt the business to update their card.',
    date: '2026-04-15',
    severity: 'low',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getBusinessInvoices(businessId: string): AdminInvoice[] {
  return ADMIN_INVOICES.filter(i => i.businessId === businessId);
}

export function getBusinessAlerts(businessId: string): BillingAlert[] {
  return BILLING_ALERTS.filter(a => a.businessId === businessId);
}

export interface BusinessBillingSummary {
  businessId: string;
  totalPaid: number;
  outstanding: number;
  lastInvoiceStatus: InvoiceStatus | null;
  lastPaymentDate: string | null;
  alertCount: number;
  hasFailedPayment: boolean;
  hasOverdue: boolean;
}

export function getBillingSummary(businessId: string): BusinessBillingSummary {
  const invoices = getBusinessInvoices(businessId);
  const alerts   = getBusinessAlerts(businessId);
  const paid     = invoices.filter(i => i.status === 'paid');
  const unpaid   = invoices.filter(i => i.status !== 'paid');
  const sorted   = [...invoices].sort((a, b) => b.date.localeCompare(a.date));
  const lastPaid = [...paid].sort((a, b) => (b.paidDate ?? '').localeCompare(a.paidDate ?? ''))[0];

  return {
    businessId,
    totalPaid:         paid.reduce((s, i) => s + i.amountRaw, 0),
    outstanding:       unpaid.reduce((s, i) => s + i.amountRaw, 0),
    lastInvoiceStatus: sorted[0]?.status ?? null,
    lastPaymentDate:   lastPaid?.paidDate ?? null,
    alertCount:        alerts.length,
    hasFailedPayment:  invoices.some(i => i.status === 'failed') || alerts.some(a => a.type === 'payment_failed' || a.type === 'payment_declined'),
    hasOverdue:        invoices.some(i => i.status === 'overdue') || alerts.some(a => a.type === 'overdue'),
  };
}

export { PER_STUDENT };
