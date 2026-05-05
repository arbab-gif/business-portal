'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Building2, Eye, EyeOff, CreditCard, ArrowRight, CheckCircle } from 'lucide-react';

type Role = 'business' | 'admin';
type Step = 'login' | 'payment';

const ROLES: { value: Role; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: 'business',
    label: 'School Business Owner',
    desc: 'Manage your students & account',
    icon: <Building2 size={22} />,
  },
  {
    value: 'admin',
    label: 'Super Admin',
    desc: 'Full platform management',
    icon: <ShieldCheck size={22} />,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole]       = useState<Role>('business');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [step, setStep]       = useState<Step>('login');

  // Payment step
  const [paymentForm, setPaymentForm] = useState({ cardHolder: '', cardNumber: '', expiry: '', cvv: '' });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      setStep('payment');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setPaymentLoading(false);
    setPaymentDone(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push('/business/dashboard');
  };

  const handleSkipPayment = () => {
    router.push('/business/dashboard');
  };

  const selected = ROLES.find(r => r.value === role)!;

  /* ── Payment step ── */
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
        <div className="w-full" style={{ maxWidth: 420 }}>

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[#6C3BAA] rounded-[14px] flex items-center justify-center mb-3">
              <CreditCard size={22} className="text-white" />
            </div>
            <h1 className="text-[22px] font-[600] text-[#222222] leading-[1.18] tracking-[-0.44px]">
              Set Up Payment
            </h1>
            <p className="text-[14px] text-[#929292] mt-1 text-center">
              Add a payment method to start adding students
            </p>
          </div>

          {paymentDone ? (
            <div className="bg-white border border-[#ebebeb] rounded-[14px] p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#e6f4e6] flex items-center justify-center">
                <CheckCircle size={30} className="text-[#008a05]" />
              </div>
              <h2 className="text-[18px] font-[600] text-[#222222]">Payment method saved!</h2>
              <p className="text-[13px] text-[#929292]">Taking you to your portal…</p>
            </div>
          ) : (
            <div className="bg-white border border-[#ebebeb] rounded-[14px] p-8 space-y-5">
              <div>
                <h2 className="text-[20px] font-[600] text-[#222222]">Payment Information</h2>
                <p className="text-[13px] text-[#929292] mt-1">
                  Your card will be charged based on your active plan when students are added.
                </p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-[13px] font-[500] text-[#3f3f3f] mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Mitchell"
                    value={paymentForm.cardHolder}
                    onChange={e => setPaymentForm(p => ({ ...p, cardHolder: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-[500] text-[#3f3f3f] mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={e => setPaymentForm(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))}
                      required
                      maxLength={19}
                      className="w-full pl-10 pr-3 py-2.5 text-[14px] font-mono border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors"
                    />
                    <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929292]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-[500] text-[#3f3f3f] mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentForm.expiry}
                      onChange={e => setPaymentForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                      required
                      maxLength={5}
                      className="w-full px-3 py-2.5 text-[14px] font-mono border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-[500] text-[#3f3f3f] mb-1.5">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={paymentForm.cvv}
                      onChange={e => setPaymentForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      required
                      maxLength={4}
                      className="w-full px-3 py-2.5 text-[14px] font-mono border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors"
                    />
                  </div>
                </div>

                <Button type="submit" fullWidth loading={paymentLoading} className="mt-1">
                  Save & Enter Portal
                </Button>
              </form>

              <div className="border-t border-[#ebebeb] pt-4 text-center">
                <button
                  onClick={handleSkipPayment}
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#929292] hover:text-[#222222] transition-colors cursor-pointer"
                >
                  Skip for now, I'll add this later
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-[12px] text-[#929292] mt-6">
            © 2026 Business Portal. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  /* ── Login step ── */
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
      <div className="w-full" style={{ maxWidth: 420 }}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#6C3BAA] rounded-[14px] flex items-center justify-center mb-3">
            {selected.icon && React.cloneElement(selected.icon as React.ReactElement<{ className?: string }>, { className: 'text-white' })}
          </div>
          <h1 className="text-[22px] font-[600] text-[#222222] leading-[1.18] tracking-[-0.44px]">
            Business Portal
          </h1>
          <p className="text-[14px] text-[#929292] mt-1">{selected.desc}</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {ROLES.map(r => (
            <button
              key={r.value}
              onClick={() => { setRole(r.value); setError(''); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-[14px] border-2 transition-all cursor-pointer text-center ${
                role === r.value
                  ? 'border-[#6C3BAA] bg-[#ede5f7]'
                  : 'border-[#ebebeb] bg-white hover:border-[#c1c1c1] hover:bg-[#f7f7f7]'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                role === r.value ? 'bg-[#6C3BAA] text-white' : 'bg-[#f2f2f2] text-[#6a6a6a]'
              }`}>
                {r.icon}
              </div>
              <div>
                <p className={`text-[14px] font-[600] ${role === r.value ? 'text-[#6C3BAA]' : 'text-[#222222]'}`}>
                  {r.label}
                </p>
                <p className={`text-[11px] mt-0.5 ${role === r.value ? 'text-[#6C3BAA]/70' : 'text-[#929292]'}`}>
                  {r.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Sign in card */}
        <div className="bg-white border border-[#ebebeb] rounded-[14px] p-8 space-y-5">
          <h2 className="text-[20px] font-[600] text-[#222222]">Sign in as {selected.label}</h2>

          {error && (
            <div className="bg-[#fde8e3] border border-[#c13515]/20 rounded-[12px] px-4 py-3 text-[14px] text-[#c13515]">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder={role === 'admin' ? 'admin@portal.com' : 'you@yourbusiness.co.uk'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-[38px] text-[#929292] hover:text-[#222222] transition-colors cursor-pointer"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Button type="submit" fullWidth loading={loading} className="mt-2">
              Sign in
            </Button>
          </form>

          <p className="text-center text-[13px] text-[#929292]">
            Forgot your password?{' '}
            <button className="text-[#6C3BAA] hover:underline font-[500] cursor-pointer">Reset it</button>
          </p>

          {role === 'business' && (
            <p className="text-center text-[13px] text-[#929292] border-t border-[#ebebeb] pt-4">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#6C3BAA] hover:underline font-[500]">Apply here →</Link>
            </p>
          )}
        </div>

        <p className="text-center text-[12px] text-[#929292] mt-6">
          © 2026 Business Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
