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
  '#4a90d9', '#7b7b7b', '#1a1a1a', '#9b9b9b', '#5a7a6b', '#2a8a8a', '#3a5fa0', '#7a9a2a',
  '#3a6b3a', '#8b5e3c', '#e8a020', '#6b1a2a', '#8b2a5a', '#e86090', '#4a2a6b', '#5a1a6b',
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
  const [logoError, setLogoError]     = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2 MB

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
    if (!file.type.startsWith('image/')) {
      setLogoError('Only image files are accepted (PNG, JPG, SVG).');
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      setLogoError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 2 MB.`);
      return;
    }
    setLogoError('');
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
    setLogoError('');
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
                      <p className="text-[12px] text-[#929292]">PNG, JPG or SVG · 512×512px recommended · Max 2 MB</p>
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
                {logoError && (
                  <p className="text-[12px] text-[#c13515] mt-1.5">{logoError}</p>
                )}
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
                <div className="sm:col-span-2">
                  <Input
                    label="Contact Name *"
                    placeholder="e.g. Sarah Mitchell"
                    value={form.contactName}
                    onChange={set('contactName')}
                    error={errors.contactName}
                  />
                </div>
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
                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-[500] text-[#3f3f3f] mb-1.5">Address</label>
                  <textarea
                    rows={3}
                    placeholder="Street, City, Postcode"
                    value={form.address}
                    onChange={set('address')}
                    className="w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] resize-none focus:outline-none focus:border-[#6C3BAA] bg-white placeholder-[#b0b0b0] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* ── Branding ── */}
            <div className="space-y-4">
              <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px]">Branding</p>

              {/* Brand colour */}
              <div>
                <p className="text-[13px] font-[500] text-[#3f3f3f] mb-2">Brand Colour</p>
                <div className="p-4 border border-[#ebebeb] rounded-[12px] bg-[#fafafa] space-y-3">
                  <p className="text-[12px] text-[#929292]">Select from our options, or enter a specific colour value.</p>

                  {/* Preview circle + swatches grid */}
                  <div className="flex items-start gap-4">

                    {/* Large preview circle — click to open native picker */}
                    <div className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => colorInputRef.current?.click()}
                        className="w-14 h-14 rounded-full border-[3px] border-white shadow-md cursor-pointer transition-transform hover:scale-105"
                        style={{ backgroundColor: brandColor }}
                        title="Click to pick a custom colour"
                      />
                      <input
                        ref={colorInputRef}
                        type="color"
                        value={brandColor}
                        onChange={e => applyColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-none"
                      />
                    </div>

                    {/* Swatches — 2 rows of 8 */}
                    <div className="grid grid-cols-8 gap-1.5">
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
                  </div>

                  {/* Hex input */}
                  <div>
                    <input
                      type="text"
                      value={hexInput}
                      onChange={handleHexInput}
                      placeholder="#6C3BAA"
                      maxLength={7}
                      className="w-32 px-3 py-1.5 text-[13px] font-mono border border-[#dddddd] rounded-[8px] focus:outline-none focus:border-[#6C3BAA] bg-white"
                    />
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
