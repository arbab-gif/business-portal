'use client';

import React, { useState, useRef } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CheckCircle, ArrowLeft, Mail, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PRESET_COLORS = [
  '#6C3BAA', '#2563eb', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#db2777', '#7c3aed',
  '#3a6b3a', '#8b5e3c', '#e8a020', '#6b1a2a',
  '#8b2a5a', '#e86090', '#4a2a6b', '#5a1a6b',
];

const MAX_LOGO = 2 * 1024 * 1024;

interface FormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

const EMPTY_FORM: FormData = { businessName: '', contactName: '', email: '', phone: '', address: '' };

export default function CreateBusinessPage() {
  const router = useRouter();
  const [form, setForm]     = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast]   = useState('');

  /* branding */
  const [brandColor,    setBrandColor]    = useState('#6C3BAA');
  const [hexInput,      setHexInput]      = useState('#6C3BAA');
  const [hexError,      setHexError]      = useState('');
  const [logoPreview,   setLogoPreview]   = useState<string | null>(null);
  const [logoDragging,  setLogoDragging]  = useState(false);
  const [logoError,     setLogoError]     = useState('');

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  /* logo helpers */
  const applyLogo = (file: File) => {
    if (!file.type.startsWith('image/')) { setLogoError('Only image files are accepted.'); return; }
    if (file.size > MAX_LOGO) { setLogoError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 2 MB.`); return; }
    setLogoError('');
    const reader = new FileReader();
    reader.onload = e => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };
  const removeLogo = () => { setLogoPreview(null); setLogoError(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

  /* colour helpers */
  const applyColor = (hex: string) => { setBrandColor(hex); setHexInput(hex); setHexError(''); };
  const handleHex  = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) { setBrandColor(val); setHexError(''); }
    else setHexError('Enter a valid hex colour (e.g. #6C3BAA)');
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.businessName.trim()) errs.businessName = 'Business name is required.';
    if (!form.contactName.trim())  errs.contactName  = 'Contact name is required.';
    if (!form.email.trim())        errs.email        = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.phone.trim())        errs.phone        = 'Phone number is required.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setToast(`${form.businessName} has been created successfully.`);
    setTimeout(() => router.push('/admin/businesses'), 2000);
  };

  const labelCls = 'block text-[12px] font-[600] text-[#929292] uppercase tracking-[0.32px] mb-1.5';
  const inputCls = 'w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors';

  return (
    <>
      <TopBar
        title="Create Business Account"
        subtitle="Manually create a business account, bypassing the registration form"
      />
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-5">

          <Link href="/admin/businesses" className="inline-flex items-center gap-1.5 text-[14px] text-[#6a6a6a] hover:text-[#222222] transition-colors">
            <ArrowLeft size={14} /> Back to businesses
          </Link>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* ── Business Details ── */}
            <Card>
              <div className="space-y-1 mb-5">
                <h2 className="text-[20px] font-[600] text-[#222222]">Business Details</h2>
                <p className="text-[14px] text-[#6a6a6a]">Enter the training organisation's information.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Business Name *" placeholder="e.g. DriveRight Academy" value={form.businessName} onChange={set('businessName')} error={errors.businessName} />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Contact Name *" placeholder="e.g. Sarah Mitchell" value={form.contactName} onChange={set('contactName')} error={errors.contactName} />
                </div>
                <Input label="Email Address *" type="email" placeholder="admin@example.co.uk" value={form.email} onChange={set('email')} error={errors.email} />
                <Input label="Phone Number *" type="tel" placeholder="+44 20 7123 4567" value={form.phone} onChange={set('phone')} error={errors.phone} />
                <div className="sm:col-span-2">
                  <label className={labelCls}>Address</label>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={set('address')}
                    placeholder="Street, City, Postcode"
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
            </Card>

            {/* ── Branding ── */}
            <Card>
              <div className="space-y-1 mb-5">
                <h2 className="text-[20px] font-[600] text-[#222222]">Branding</h2>
                <p className="text-[14px] text-[#6a6a6a]">Set the business logo and brand colour.</p>
              </div>

              <div className="space-y-5">

                {/* Logo upload */}
                <div>
                  <label className={labelCls}>Business Logo</label>
                  <div className="flex items-start gap-4">
                    {logoPreview ? (
                      <div className="relative flex-shrink-0">
                        <img src={logoPreview} alt="logo" className="w-20 h-20 rounded-[14px] object-cover border-2 border-[#ebebeb]" />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#c13515] text-white flex items-center justify-center shadow cursor-pointer hover:bg-[#a02a10] transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); setLogoDragging(true); }}
                        onDragLeave={() => setLogoDragging(false)}
                        onDrop={e => { e.preventDefault(); setLogoDragging(false); const f = e.dataTransfer.files?.[0]; if (f) applyLogo(f); }}
                        className={`w-20 h-20 rounded-[14px] flex flex-col items-center justify-center gap-1 border-2 border-dashed cursor-pointer transition-colors flex-shrink-0 ${logoDragging ? 'border-[#6C3BAA] bg-[#ede5f7]' : 'border-[#dddddd] hover:border-[#6C3BAA] hover:bg-[#faf8ff]'}`}
                        style={{ backgroundColor: logoDragging ? undefined : brandColor + '10' }}
                      >
                        <Upload size={16} style={{ color: brandColor }} />
                        <span className="text-[10px] font-[600]" style={{ color: brandColor }}>Upload</span>
                      </div>
                    )}
                    <div className="min-w-0 pt-1">
                      <p className="text-[13px] text-[#6a6a6a] leading-[1.6]">
                        PNG, JPG or SVG · 512×512px recommended · Max 2 MB
                      </p>
                      {!logoPreview && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 text-[13px] font-[500] cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ color: brandColor }}
                        >
                          Choose file
                        </button>
                      )}
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) applyLogo(f); }} />
                  {logoError && <p className="text-[12px] text-[#c13515] mt-1.5">{logoError}</p>}
                </div>

                {/* Brand colour */}
                <div>
                  <label className={labelCls}>Brand Colour</label>
                  <div className="p-4 border border-[#ebebeb] rounded-[12px] bg-[#fafafa] space-y-3">
                    <p className="text-[12px] text-[#929292]">Select from our options, or enter a specific colour value.</p>
                    <div className="flex items-start gap-4">
                      {/* Large colour circle */}
                      <div className="relative flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => colorInputRef.current?.click()}
                          className="w-14 h-14 rounded-full border-[3px] border-white shadow-md cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: brandColor }}
                        />
                        <input ref={colorInputRef} type="color" value={brandColor} onChange={e => applyColor(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-none" />
                      </div>
                      {/* Preset swatches */}
                      <div className="grid grid-cols-8 gap-1.5">
                        {PRESET_COLORS.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => applyColor(c)}
                            title={c}
                            className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110"
                            style={{ backgroundColor: c, outline: brandColor.toLowerCase() === c.toLowerCase() ? `3px solid ${c}` : 'none', outlineOffset: 2 }}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Hex input */}
                    <div>
                      <input
                        type="text"
                        value={hexInput}
                        onChange={handleHex}
                        placeholder="#6C3BAA"
                        maxLength={7}
                        className="w-32 px-3 py-1.5 text-[13px] font-mono border border-[#dddddd] rounded-[8px] focus:outline-none focus:border-[#6C3BAA] bg-white"
                      />
                      {hexError && <p className="text-[12px] text-[#c13515] mt-1">{hexError}</p>}
                    </div>
                  </div>
                </div>

              </div>
            </Card>

            {/* ── Email notice ── */}
            <div className="flex items-center gap-3 p-4 bg-[#ede5f7] border border-[#6C3BAA]/20 rounded-[12px]">
              <Mail size={16} className="text-[#6C3BAA] flex-shrink-0" />
              <p className="text-[13px] text-[#6C3BAA]">
                Login credentials will be automatically sent to the contact email once the account is created.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link href="/admin/businesses">
                <Button variant="secondary" size="md" type="button">Cancel</Button>
              </Link>
              <Button type="submit" loading={loading}>Create Account</Button>
            </div>

          </form>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-[12px] bg-[#1a1a1a] text-white text-[13px] font-[500] shadow-lg">
          <CheckCircle size={15} className="text-[#4ade80]" />
          {toast}
        </div>
      )}
    </>
  );
}
