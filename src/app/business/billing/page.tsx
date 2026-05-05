'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { useBusinessAuth } from '@/lib/BusinessAuthStore';
import { PAST_INVOICES, PER_STUDENT_COST } from '@/lib/invoiceData';
import {
  FileText, Download, AlertTriangle, CheckCircle, XCircle,
  ChevronRight, CreditCard, Trash2, Plus, Lock, Star,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface SavedCard {
  id: string;
  brand: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  expiry: string;
  holder: string;
  isDefault: boolean;
}

interface BillingWarning {
  id: string;
  type: 'payment_failed' | 'card_expired' | 'card_expiring';
  title: string;
  message: string;
  date: string;
}

/* ─────────────────────────────────────────────
   Static mock data
───────────────────────────────────────────── */
const WARNINGS: BillingWarning[] = [
  {
    id: 'warn-001', type: 'payment_failed',
    title: 'Payment Failed',
    message: 'Your payment of £125.00 on 1 Dec 2025 could not be processed. Please update your payment method.',
    date: '1 Dec 2025',
  },
  {
    id: 'warn-002', type: 'card_expiring',
    title: 'Card Expiring Soon',
    message: 'Your Visa card ending in 4242 expires in June 2026. Update your payment method to avoid interruption.',
    date: '15 Apr 2026',
  },
];

const WARN_CFG: Record<BillingWarning['type'], { icon: React.ReactNode; bg: string; border: string; title: string; msg: string }> = {
  payment_failed: {
    icon: <XCircle size={16} className="text-[#c13515] flex-shrink-0" />,
    bg: 'bg-[#fde8e3]', border: 'border-[#c13515]/20',
    title: 'text-[#c13515]', msg: 'text-[#7a2008]',
  },
  card_expired: {
    icon: <AlertTriangle size={16} className="text-[#b45309] flex-shrink-0" />,
    bg: 'bg-[#fffbeb]', border: 'border-[#f59e0b]/30',
    title: 'text-[#92400e]', msg: 'text-[#78350f]',
  },
  card_expiring: {
    icon: <AlertTriangle size={16} className="text-[#b45309] flex-shrink-0" />,
    bg: 'bg-[#fffbeb]', border: 'border-[#f59e0b]/30',
    title: 'text-[#92400e]', msg: 'text-[#78350f]',
  },
};

const BRAND_LOGO: Record<SavedCard['brand'], string> = {
  Visa: 'VISA',
  Mastercard: 'MC',
  Amex: 'AMEX',
};

const INITIAL_CARDS: SavedCard[] = [
  { id: 'card-1', brand: 'Visa',       last4: '4242', expiry: '06/26', holder: 'Sarah Mitchell', isDefault: true  },
  { id: 'card-2', brand: 'Mastercard', last4: '8110', expiry: '11/27', holder: 'Sarah Mitchell', isDefault: false },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const fmtCard   = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const fmtExpiry = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function BillingPage() {
  const { currentBusiness } = useBusinessAuth();
  const brandColor = currentBusiness.brandColor || '#6C3BAA';

  /* cards state */
  const [cards, setCards]                 = useState<SavedCard[]>(INITIAL_CARDS);
  const [showModal, setShowModal]         = useState(false);
  const [editCard, setEditCard]           = useState<SavedCard | null>(null); // null = add new
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [saving, setSaving]               = useState(false);
  const [toast, setToast]                 = useState('');

  /* form state */
  const [fHolder, setFHolder] = useState('');
  const [fNumber, setFNumber] = useState('');
  const [fExpiry, setFExpiry] = useState('');
  const [fCvv,    setFCvv]    = useState('');

  const defaultCard = cards.find(c => c.isDefault);

  /* open add */
  const openAdd = () => {
    setEditCard(null);
    setFHolder(''); setFNumber(''); setFExpiry(''); setFCvv('');
    setShowModal(true);
  };

  /* set default */
  const setDefault = (id: string) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
    showToast('Default card updated.');
  };

  /* remove */
  const removeCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setConfirmRemove(null);
    showToast('Card removed.');
  };

  /* save new card */
  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      brand: 'Visa',
      last4: fNumber.replace(/\s/g, '').slice(-4) || '0000',
      expiry: fExpiry,
      holder: fHolder || 'Cardholder',
      isDefault: cards.length === 0,
    };
    setCards(prev => [...prev, newCard]);
    setSaving(false);
    setShowModal(false);
    showToast('Card added successfully.');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  /* label input class */
  const labelCls = 'block text-[11px] font-[700] text-[#929292] uppercase tracking-[0.4px] mb-1.5';
  const inputCls = 'w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] focus:outline-none bg-white transition-colors';

  return (
    <>
      <TopBar title="Billing" subtitle="Transparent, automatic per-student billing" />

      <div className="p-6 space-y-6">

        {/* ── Warnings ── */}
        {WARNINGS.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-[#b45309]" />
              <h2 className="text-[12px] font-[700] text-[#222222] uppercase tracking-[0.5px]">Billing Alerts</h2>
              <span className="w-5 h-5 rounded-full bg-[#fde8e3] text-[#c13515] text-[10px] font-[700] flex items-center justify-center">
                {WARNINGS.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {WARNINGS.map(w => {
                const cfg = WARN_CFG[w.type];
                return (
                  <div key={w.id} className={`flex items-start gap-3 px-4 py-3.5 rounded-[12px] border ${cfg.bg} ${cfg.border}`}>
                    <div className="mt-0.5">{cfg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <p className={`text-[13px] font-[600] ${cfg.title}`}>{w.title}</p>
                        <span className={`text-[11px] ${cfg.msg} opacity-70 flex-shrink-0`}>{w.date}</span>
                      </div>
                      <p className={`text-[12px] mt-0.5 leading-[1.6] ${cfg.msg}`}>{w.message}</p>
                      <button className={`mt-1.5 inline-flex items-center gap-1 text-[12px] font-[600] ${cfg.title} hover:opacity-75 transition-opacity cursor-pointer`}>
                        Resolve <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Payment Methods ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-[#6a6a6a]" />
              <h2 className="text-[12px] font-[700] text-[#222222] uppercase tracking-[0.5px]">Payment Methods</h2>
              {cards.length > 0 && (
                <span className="text-[11px] text-[#929292]">({cards.length} saved)</span>
              )}
            </div>
            {cards.length > 0 && (
              <button
                onClick={openAdd}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[13px] font-[500] text-white cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: brandColor }}
              >
                <Plus size={13} /> Add Card
              </button>
            )}
          </div>

          <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
            {cards.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center gap-3 py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#f2f2f2] flex items-center justify-center">
                  <CreditCard size={20} className="text-[#929292]" />
                </div>
                <div>
                  <p className="text-[14px] font-[600] text-[#222222]">No payment methods saved</p>
                  <p className="text-[13px] text-[#929292] mt-1">Add a card to enable student enrolment and automatic billing.</p>
                </div>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[13px] font-[500] text-white cursor-pointer transition-opacity hover:opacity-90 mt-1"
                  style={{ backgroundColor: brandColor }}
                >
                  <Plus size={14} /> Add Payment Method
                </button>
              </div>
            ) : (
              /* Card list */
              <div className="divide-y divide-[#ebebeb]">
                {cards.map(card => (
                  <div key={card.id} className="flex items-center gap-4 px-5 py-4">
                    {/* Card art */}
                    <div
                      className="w-[52px] h-8 rounded-[6px] flex items-center justify-center flex-shrink-0 text-white text-[10px] font-[800] tracking-wider"
                      style={{
                        background: card.isDefault
                          ? `linear-gradient(135deg, ${brandColor}, ${brandColor}bb)`
                          : 'linear-gradient(135deg, #9ca3af, #6b7280)',
                      }}
                    >
                      {BRAND_LOGO[card.brand]}
                    </div>

                    {/* Card info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-[600] text-[#222222]">
                          {card.brand} •••• {card.last4}
                        </span>
                        {card.isDefault && (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-[600] px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: brandColor }}
                          >
                            <Star size={9} fill="currentColor" /> Default
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#929292] mt-0.5">
                        {card.holder} · Expires {card.expiry}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!card.isDefault && (
                        <button
                          onClick={() => setDefault(card.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#dddddd] text-[12px] font-[500] text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmRemove(card.id)}
                        disabled={cards.length === 1 || (card.isDefault && cards.length > 1)}
                        title={
                          cards.length === 1
                            ? 'At least one payment method is required'
                            : card.isDefault && cards.length > 1
                            ? 'Set another card as default before removing'
                            : ''
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#dddddd] text-[12px] font-[500] text-[#c13515] hover:border-[#c13515] hover:bg-[#fde8e3] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* Default card note */}
          {defaultCard && (
            <p className="flex items-center gap-1.5 text-[12px] text-[#929292] mt-2">
              <Lock size={11} />
              Auto-billing uses your default card ({defaultCard.brand} •••• {defaultCard.last4}).
              Card details are never stored on our servers.
            </p>
          )}
        </section>

        {/* ── Invoice History ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-[#6a6a6a]" />
              <h2 className="text-[12px] font-[700] text-[#222222] uppercase tracking-[0.5px]">Invoice History</h2>
            </div>
          </div>

          <div className="bg-white border border-[#ebebeb] rounded-[14px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#ebebeb] bg-[#f7f7f7]">
                  {['Invoice', 'Date', 'Students', 'Amount', 'Status', ''].map((h, i) => (
                    <th
                      key={i}
                      className={`px-5 py-3 text-[11px] font-[700] text-[#929292] uppercase tracking-[0.4px] ${i === 5 ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAST_INVOICES.map(inv => (
                  <tr key={inv.id} className="border-b border-[#ebebeb] last:border-b-0 hover:bg-[#fafafa] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: brandColor + '15' }}
                        >
                          <FileText size={12} style={{ color: brandColor }} />
                        </div>
                        <span className="text-[13px] font-[500] text-[#222222]">{inv.number}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#6a6a6a] whitespace-nowrap">
                      {new Date(inv.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#6a6a6a]">
                      {inv.students} × £{PER_STUDENT_COST}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-[600] text-[#222222]">{inv.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-[600] px-2.5 py-1 rounded-full ${
                        inv.status === 'paid' ? 'bg-[#e6f4e6] text-[#008a05]' : 'bg-[#fde8e3] text-[#c13515]'
                      }`}>
                        {inv.status === 'paid' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {inv.status === 'paid' ? 'Paid' : 'Overdue'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/business/billing/${inv.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#dddddd] text-[12px] font-[500] text-[#6a6a6a] hover:text-[#222222] hover:border-[#aaaaaa] transition-colors"
                      >
                        <Download size={12} /> Download PDF
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* ══════════════════════════════════════════
          Add Card Modal
      ══════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[400px]">
            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-[#ebebeb]">
              <h3 className="text-[16px] font-[700] text-[#222222]">Add Payment Method</h3>
              <p className="text-[13px] text-[#929292] mt-0.5">Add a new credit or debit card.</p>
            </div>

            {/* Fields */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className={labelCls}>Cardholder Name</label>
                <input
                  type="text"
                  value={fHolder}
                  onChange={e => setFHolder(e.target.value)}
                  placeholder="Sarah Mitchell"
                  className={inputCls}
                  style={{ borderColor: fHolder ? brandColor + '80' : undefined } as React.CSSProperties}
                />
              </div>
              <div>
                <label className={labelCls}>Card Number</label>
                <input
                  type="text"
                  value={fNumber}
                  onChange={e => setFNumber(fmtCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`${inputCls} font-mono`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Expiry</label>
                  <input
                    type="text"
                    value={fExpiry}
                    onChange={e => setFExpiry(fmtExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`${inputCls} font-mono`}
                  />
                </div>
                <div>
                  <label className={labelCls}>CVV</label>
                  <input
                    type="password"
                    value={fCvv}
                    onChange={e => setFCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    className={`${inputCls} font-mono`}
                  />
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-[#b0b0b0]">
                <Lock size={10} /> Encrypted — card details are never stored on our servers.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-[10px] border border-[#dddddd] text-[14px] font-[500] text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-white text-[14px] font-[500] cursor-pointer disabled:opacity-60 transition-opacity hover:opacity-90"
                style={{ backgroundColor: brandColor }}
              >
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  : 'Save Card'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          Confirm Remove Modal
      ══════════════════════════════════════════ */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[360px] p-6">
            <div className="w-11 h-11 rounded-full bg-[#fde8e3] flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-[#c13515]" />
            </div>
            <h3 className="text-[16px] font-[700] text-[#222222]">Remove Card?</h3>
            <p className="text-[13px] text-[#6a6a6a] mt-1.5 leading-[1.6]">
              This card will be permanently removed from your account. This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 py-2.5 rounded-[10px] border border-[#dddddd] text-[14px] font-[500] text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => removeCard(confirmRemove)}
                className="flex-1 py-2.5 rounded-[10px] bg-[#c13515] hover:bg-[#a02a10] text-white text-[14px] font-[500] transition-colors cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-[12px] bg-[#1a1a1a] text-white text-[13px] font-[500] shadow-lg animate-in">
          <CheckCircle size={15} className="text-[#4ade80]" />
          {toast}
        </div>
      )}
    </>
  );
}
