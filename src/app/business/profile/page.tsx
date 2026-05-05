'use client';

import React from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { useBusinessAuth } from '@/lib/BusinessAuthStore';
import { Mail, Phone, MapPin, User, Palette } from 'lucide-react';

export default function BusinessProfilePage() {
  const { currentBusiness } = useBusinessAuth();
  const brandColor = currentBusiness.brandColor || '#6C3BAA';

  return (
    <>
      <TopBar title="Business Profile" subtitle="Your account information" />
      <div className="p-6 max-w-2xl space-y-5">

        {/* ── Logo + Business Name ── */}
        <div className="bg-white border border-[#ebebeb] rounded-[14px] p-6 flex items-center gap-5">
          {currentBusiness.logoUrl ? (
            <img
              src={currentBusiness.logoUrl}
              alt={currentBusiness.name}
              className="w-20 h-20 rounded-[14px] object-cover flex-shrink-0 border border-[#ebebeb]"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-[14px] flex items-center justify-center text-[28px] font-[700] text-white flex-shrink-0"
              style={{ backgroundColor: brandColor }}
            >
              {currentBusiness.name[0]}
            </div>
          )}
          <div>
            <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px] mb-1">Business Name</p>
            <h1 className="text-[22px] font-[600] text-[#222222] leading-[1.2]">{currentBusiness.name}</h1>
          </div>
        </div>

        {/* ── Contact Details ── */}
        <div className="bg-white border border-[#ebebeb] rounded-[14px] p-6 space-y-5">
          <h2 className="text-[14px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">Contact Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: <User  size={15} />, label: 'Contact Name', value: currentBusiness.contactName },
              { icon: <Mail  size={15} />, label: 'Email Address', value: currentBusiness.email },
              { icon: <Phone size={15} />, label: 'Phone Number',  value: currentBusiness.phone },
              { icon: <MapPin size={15} />, label: 'Address',      value: currentBusiness.address },
            ].map(d => (
              <div key={d.label} className="flex items-start gap-3">
                <span className="text-[#6a6a6a] mt-0.5 flex-shrink-0">{d.icon}</span>
                <div>
                  <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px] mb-0.5">{d.label}</p>
                  <p className="text-[14px] text-[#222222]">{d.value || '—'}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ── Branding ── */}
        <div className="bg-white border border-[#ebebeb] rounded-[14px] p-6 space-y-5">
          <h2 className="text-[14px] font-[700] text-[#6a6a6a] uppercase tracking-[0.32px]">Branding</h2>

          <div className="flex flex-col sm:flex-row gap-6">

            {/* Logo preview */}
            <div className="flex-1">
              <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px] mb-3">Business Logo</p>
              {currentBusiness.logoUrl ? (
                <img
                  src={currentBusiness.logoUrl}
                  alt="Logo"
                  className="w-20 h-20 object-contain rounded-[12px] border border-[#ebebeb] bg-[#fafafa]"
                />
              ) : (
                <div className="w-20 h-20 rounded-[12px] flex items-center justify-center text-[24px] font-[700] text-white" style={{ backgroundColor: brandColor }}>
                  {currentBusiness.name[0]}
                </div>
              )}
              {!currentBusiness.logoUrl && (
                <p className="text-[12px] text-[#929292] mt-2">No logo uploaded</p>
              )}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-[#ebebeb]" />

            {/* Brand colour */}
            <div className="flex-1">
              <p className="text-[12px] font-[700] text-[#929292] uppercase tracking-[0.32px] mb-3">Brand Colour</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-[12px] border border-black/5 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: brandColor }}
                />
                <div>
                  <p className="text-[15px] font-[600] text-[#222222] font-mono">{brandColor.toUpperCase()}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Palette size={11} className="text-[#929292]" />
                    <p className="text-[12px] text-[#929292]">Primary brand colour</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
