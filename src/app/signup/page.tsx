'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowLeft, Building2, Upload, X } from 'lucide-react';

interface FormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

const empty: FormData = { businessName: '', contactName: '', email: '', phone: '', address: '' };

const PRESET_COLORS = [
  '#6C3BAA', '#2563eb', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#db2777', '#7c3aed',
];

export default function SignupPage() {
  const [form, setForm]       = useState<FormData>(empty);
  const [errors, setErrors]   = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // logo
  const [logoFile, setLogoFile]       = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoDragging, setLogoDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // brand colour
  const [brandColor, setBrandColor] = useState('#6C3BAA');
  const [hexInput, setHexInput]     = useState('#6C3BAA');
  const [hexError, setHexError]     = useState('');
  const colorInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  /* ── Logo helpers ── */
  const applyLogo = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = e => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyLogo(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setLogoDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyLogo(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Colour helpers ── */
  const applyColor = (hex: string) => {
    setBrandColor(hex);
    setHexInput(hex);
    setHexError('');
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setBrandColor(val);
      setHexError('');
    } else {
      setHexError('Enter a valid hex colour (e.g. #6C3BAA)');
    }
  };

  /* ── Validation & submit ── */
  const validate = () => {
    const errs: Partial<FormData> = {};
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
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
        <div className="bg-white border border-[#ebebeb] rounded-[14px] p-10 w-full text-center space-y-4" style={{ maxWidth: 480 }}>
          <div className="w-16 h-16 rounded-full bg-[#e6f4e6] flex items-center justify-center mx-auto">
            <CheckCircle size={28} className="text-[#008a05]" />
          </div>
          <h2 className="text-[22px] font-[600] text-[#222222]">Application Submitted</h2>
          <p className="text-[14px] text-[#6a6a6a]">
            Thanks, <strong>{form.contactName}</strong>! Your application for <strong>{form.businessName}</strong> has been received. We'll review it and email you within 2–3 business days.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button variant="secondary" size="sm">Back to Sign in</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = form.businessName.trim() ? form.businessName.trim()[0].toUpperCase() : <Building2 size={22} className="text-white" />;

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
      <div className="w-full" style={{ maxWidth: 560 }}>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-3" style={{ backgroundColor: brandColor }}>
            {logoPreview
              ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover rounded-[14px]" />
              : <Building2 size={22} className="text-white" />
            }
          </div>
          <h1 className="text-[22px] font-[500] text-[#222222] leading-[1.18] tracking-[-0.44px]">Business Portal</h1>
          <p className="text-[14px] text-[#929292] mt-1">Apply for a business account</p>
        </div>

        <div className="bg-white border border-[#ebebeb] rounded-[14px] p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-[600] text-[#222222]">Create Account</h2>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] text-[#6a6a6a] hover:text-[#222222] transition-colors">
              <ArrowLeft size={13} />
              Sign in
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* ── Business details ── */}
            <div className="space-y-4">
              <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px]">Business Details</p>

              {/* Logo upload — first field */}
              <div>
                <p className="text-[13px] font-[500] text-[#3f3f3f] mb-2">Business Logo</p>
                {logoPreview ? (
                  <div className="flex items-center gap-4 p-4 border border-[#ebebeb] rounded-[12px] bg-[#fafafa]">
                    <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-contain rounded-[10px] border border-[#ebebeb] bg-white" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-[500] text-[#222222] truncate">{logoFile?.name}</p>
                      <p className="text-[12px] text-[#929292]">{logoFile ? (logoFile.size / 1024).toFixed(0) + ' KB' : ''}</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#fde8e3] text-[#929292] hover:text-[#c13515] transition-colors cursor-pointer flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={e => { e.preventDefault(); setLogoDragging(true); }}
                    onDragLeave={() => setLogoDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-[12px] cursor-pointer transition-colors ${
                      logoDragging
                        ? 'border-[#6C3BAA] bg-[#f0ebfa]'
                        : 'border-[#dddddd] hover:border-[#6C3BAA] hover:bg-[#faf8ff]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#ede5f7] flex items-center justify-center">
                      <Upload size={16} className="text-[#6C3BAA]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-[500] text-[#222222]">
                        {logoDragging ? 'Drop to upload' : 'Click or drag & drop'}
                      </p>
                      <p className="text-[12px] text-[#929292]">PNG, JPG or SVG · Max 2 MB</p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Business Name *"
                    placeholder="e.g. DriveRight Academy"
                    value={form.businessName}
                    onChange={set('businessName')}
                    error={errors.businessName}
                  />
                </div>
                <Input
                  label="Contact Name *"
                  placeholder="e.g. Sarah Mitchell"
                  value={form.contactName}
                  onChange={set('contactName')}
                  error={errors.contactName}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="admin@example.co.uk"
                  value={form.email}
                  onChange={set('email')}
                  error={errors.email}
                />
                <Input
                  label="Phone Number *"
                  type="tel"
                  placeholder="+44 20 7123 4567"
                  value={form.phone}
                  onChange={set('phone')}
                  error={errors.phone}
                />
                <Input
                  label="Address"
                  placeholder="Street, City, Postcode"
                  value={form.address}
                  onChange={set('address')}
                />
              </div>
            </div>

            {/* ── Branding ── */}
            <div className="space-y-4">
              <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px]">Branding</p>

              {/* Brand colour */}
              <div>
                <p className="text-[13px] font-[500] text-[#3f3f3f] mb-2">Brand Colour</p>
                <div className="p-4 border border-[#ebebeb] rounded-[12px] bg-[#fafafa] space-y-3">

                  {/* Preview swatch */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-[10px] flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: brandColor }}
                    />
                    <div className="flex-1">
                      <p className="text-[13px] font-[500] text-[#222222]">Selected colour</p>
                      <p className="text-[12px] text-[#929292] font-mono">{brandColor.toUpperCase()}</p>
                    </div>
                    {/* Native colour picker trigger */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => colorInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-[8px] border border-[#dddddd] text-[12px] font-[500] text-[#6a6a6a] hover:border-[#6C3BAA] hover:text-[#6C3BAA] hover:bg-[#f7f4fc] transition-colors cursor-pointer"
                      >
                        Custom
                      </button>
                      <input
                        ref={colorInputRef}
                        type="color"
                        value={brandColor}
                        onChange={e => applyColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => applyColor(c)}
                        title={c}
                        className="w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 flex-shrink-0"
                        style={{
                          backgroundColor: c,
                          outline: brandColor.toLowerCase() === c.toLowerCase() ? `3px solid ${c}` : 'none',
                          outlineOffset: 2,
                        }}
                      />
                    ))}
                  </div>

                  {/* Hex input */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-[6px] flex-shrink-0" style={{ backgroundColor: brandColor }} />
                      <input
                        type="text"
                        value={hexInput}
                        onChange={handleHexInput}
                        placeholder="#6C3BAA"
                        maxLength={7}
                        className="flex-1 px-3 py-1.5 text-[13px] font-mono border border-[#dddddd] rounded-[8px] focus:outline-none focus:border-[#6C3BAA] bg-white"
                      />
                    </div>
                    {hexError && <p className="text-[12px] text-[#c13515] mt-1">{hexError}</p>}
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Submit Application
            </Button>
          </form>

          <p className="text-center text-[13px] text-[#929292]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#6C3BAA] hover:underline font-[500]">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-[12px] text-[#929292] mt-6">
          © 2026 Business Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
