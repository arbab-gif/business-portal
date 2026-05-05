'use client';

import React, { useState, useRef } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { useBusinessAuth } from '@/lib/BusinessAuthStore';
import {
  Pencil, X, Upload, CheckCircle,
} from 'lucide-react';

const PRESET_COLORS = [
  '#6C3BAA', '#2563eb', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#db2777', '#7c3aed',
  '#3a6b3a', '#8b5e3c', '#e8a020', '#6b1a2a',
  '#8b2a5a', '#e86090', '#4a2a6b', '#5a1a6b',
];

const MAX_LOGO = 2 * 1024 * 1024;

export default function BusinessProfilePage() {
  const { currentBusiness, updateBusiness } = useBusinessAuth();

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  // form fields
  const [name,        setName]        = useState(currentBusiness.name);
  const [contactName, setContactName] = useState(currentBusiness.contactName);
  const [email]                       = useState(currentBusiness.email); // read-only
  const [phone,       setPhone]       = useState(currentBusiness.phone);
  const [address,     setAddress]     = useState(currentBusiness.address);
  const [brandColor,  setBrandColor]  = useState(currentBusiness.brandColor || '#6C3BAA');
  const [hexInput,    setHexInput]    = useState(currentBusiness.brandColor || '#6C3BAA');
  const [hexError,    setHexError]    = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(currentBusiness.logoUrl ?? null);
  const [logoDragging,setLogoDragging]= useState(false);
  const [logoError,   setLogoError]   = useState('');

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const applyLogo = (file: File) => {
    if (!file.type.startsWith('image/')) { setLogoError('Only image files are accepted.'); return; }
    if (file.size > MAX_LOGO) { setLogoError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 2 MB.`); return; }
    setLogoError('');
    const reader = new FileReader();
    reader.onload = e => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };
  const removeLogo = () => { setLogoPreview(null); setLogoError(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const applyColor = (hex: string) => { setBrandColor(hex); setHexInput(hex); setHexError(''); };
  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) { setBrandColor(val); setHexError(''); }
    else setHexError('Enter a valid hex colour (e.g. #6C3BAA)');
  };

  const handleCancel = () => {
    setName(currentBusiness.name);
    setContactName(currentBusiness.contactName);
    setPhone(currentBusiness.phone);
    setAddress(currentBusiness.address);
    setBrandColor(currentBusiness.brandColor || '#6C3BAA');
    setHexInput(currentBusiness.brandColor || '#6C3BAA');
    setLogoPreview(currentBusiness.logoUrl ?? null);
    setLogoError('');
    setHexError('');
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateBusiness({
      name:        name.trim(),
      contactName: contactName.trim(),
      phone:       phone.trim(),
      address:     address.trim(),
      brandColor,
      logoUrl:     logoPreview ?? undefined,
    });
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const bc       = currentBusiness.brandColor || '#6C3BAA';
  const labelCls = 'block text-[12px] font-[600] text-[#929292] uppercase tracking-[0.32px] mb-1.5';
  const inputCls = 'w-full px-3 py-2.5 text-[14px] border border-[#dddddd] rounded-[10px] focus:outline-none focus:border-[#6C3BAA] bg-white transition-colors';
  const fieldLbl = 'block text-[11px] font-[700] text-[#929292] uppercase tracking-[0.4px] mb-0.5';
  const fieldVal = 'text-[14px] text-[#222222]';

  return (
    <>
      <TopBar
        title="Business Profile"
        subtitle="Your account information"
        actions={
          !editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-[#dddddd] text-[13px] font-[500] text-[#3f3f3f] hover:border-[#6C3BAA] hover:text-[#6C3BAA] hover:bg-[#faf8ff] transition-colors cursor-pointer"
            >
              <Pencil size={13} /> Edit Profile
            </button>
          ) : undefined
        }
      />

      <div className="p-6 flex flex-col items-center">
        <div className="w-full max-w-[640px] space-y-5">

          {/* ── Business Details card ── */}
          <div className="bg-white border border-[#ebebeb] rounded-[16px] overflow-hidden">
            <div className="px-6 pt-6 pb-5">
              <h2 className="text-[20px] font-[600] text-[#222222]">Business Details</h2>
              <p className="text-[13px] text-[#6a6a6a] mt-0.5">
                {editing ? "Update your organisation's information." : "Your organisation's information."}
              </p>
            </div>

            <div className="px-6 pb-6 space-y-4">
              {editing ? (
                <>
                  <div>
                    <label className={labelCls}>Business Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="e.g. DriveRight Academy" />
                  </div>
                  <div>
                    <label className={labelCls}>Contact Name</label>
                    <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} className={inputCls} placeholder="e.g. Sarah Mitchell" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className={`${inputCls} bg-[#f7f7f7] text-[#929292] cursor-not-allowed pr-24`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-[600] text-[#929292] bg-[#ebebeb] px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Account
                        </span>
                      </div>
                      <p className="text-[11px] text-[#929292] mt-1">Email is linked to your account and cannot be changed here.</p>
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+44 20 7123 4567" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Address</label>
                    <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)} className={`${inputCls} resize-none`} placeholder="Street, City, Postcode" />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <p className={fieldLbl}>Business Name</p>
                      <p className={fieldVal}>{currentBusiness.name || '—'}</p>
                    </div>
                    <div>
                      <p className={fieldLbl}>Contact Name</p>
                      <p className={fieldVal}>{currentBusiness.contactName || '—'}</p>
                    </div>
                    <div>
                      <p className={fieldLbl}>Email Address</p>
                      <p className={fieldVal}>{currentBusiness.email || '—'}</p>
                    </div>
                    <div>
                      <p className={fieldLbl}>Phone Number</p>
                      <p className={fieldVal}>{currentBusiness.phone || '—'}</p>
                    </div>
                  </div>
                  <div>
                    <p className={fieldLbl}>Address</p>
                    <p className={fieldVal}>{currentBusiness.address || '—'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Branding card ── */}
          <div className="bg-white border border-[#ebebeb] rounded-[16px] overflow-hidden">
            <div className="px-6 pt-6 pb-5">
              <h2 className="text-[20px] font-[600] text-[#222222]">Branding</h2>
              <p className="text-[13px] text-[#6a6a6a] mt-0.5">
                {editing ? 'Set the business logo and brand colour.' : 'Your business logo and brand colour.'}
              </p>
            </div>

            <div className="px-6 pb-6 space-y-5">
              {editing ? (
                <>
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
                        <p className="text-[13px] text-[#6a6a6a] leading-[1.6]">PNG, JPG or SVG · 512×512px recommended · Max 2 MB</p>
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
                        <div className="relative flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => colorInputRef.current?.click()}
                            className="w-14 h-14 rounded-full border-[3px] border-white shadow-md cursor-pointer transition-transform hover:scale-105"
                            style={{ backgroundColor: brandColor }}
                          />
                          <input ref={colorInputRef} type="color" value={brandColor} onChange={e => applyColor(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-none" />
                        </div>
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

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f2f2f2]">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-5 py-2.5 rounded-[10px] border border-[#dddddd] text-[14px] font-[500] text-[#6a6a6a] hover:bg-[#f7f7f7] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-white text-[14px] font-[500] transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-60"
                      style={{ backgroundColor: bc }}
                    >
                      {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </>
              ) : (
                /* View mode */
                <div className="flex items-start gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {currentBusiness.logoUrl ? (
                      <img src={currentBusiness.logoUrl} alt={currentBusiness.name} className="w-20 h-20 rounded-[14px] object-cover border-2 border-[#ebebeb]" />
                    ) : (
                      <div
                        className="w-20 h-20 rounded-[14px] flex items-center justify-center text-[28px] font-[700] text-white"
                        style={{ backgroundColor: bc }}
                      >
                        {currentBusiness.name[0]}
                      </div>
                    )}
                    <p className={`${fieldLbl} mt-3`}>Logo</p>
                  </div>
                  {/* Colour */}
                  <div>
                    <p className={fieldLbl}>Brand Colour</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-12 h-12 rounded-full border-[3px] border-white shadow-md flex-shrink-0" style={{ backgroundColor: bc }} />
                      <p className="text-[15px] font-[600] text-[#222222] font-mono">{bc.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Save toast ── */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-[12px] bg-[#1a1a1a] text-white text-[13px] font-[500] shadow-lg">
          <CheckCircle size={15} className="text-[#4ade80]" />
          Profile updated successfully.
        </div>
      )}
    </>
  );
}
