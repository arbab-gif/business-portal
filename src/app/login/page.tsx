'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Building2, Eye, EyeOff } from 'lucide-react';

type Role = 'business' | 'admin';

const ROLES: { value: Role; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: 'business',
    label: 'Business',
    desc: 'Manage your students & account',
    icon: <Building2 size={22} />,
  },
  {
    value: 'admin',
    label: 'Admin',
    desc: 'Full platform management',
    icon: <ShieldCheck size={22} />,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('business');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    router.push(role === 'admin' ? '/admin/dashboard' : '/business/dashboard');
  };

  const selected = ROLES.find(r => r.value === role)!;

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

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
