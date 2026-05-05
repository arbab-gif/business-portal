'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  sendWelcomeEmail: boolean;
}

export default function CreateBusinessPage() {
  const [form, setForm] = useState<FormData>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    sendWelcomeEmail: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.businessName.trim()) errs.businessName = 'Business name is required.';
    if (!form.contactName.trim()) errs.contactName = 'Contact name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
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
    setSuccess(true);
  };

  if (success) {
    return (
      <>
        <TopBar title="Create Business Account" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="bg-white border border-[#ebebeb] rounded-[14px] p-10 w-full text-center space-y-4" style={{ maxWidth: 480 }}>
            <div className="w-16 h-16 rounded-full bg-[#e6f4e6] flex items-center justify-center mx-auto">
              <CheckCircle size={28} className="text-[#008a05]" />
            </div>
            <h2 className="text-[22px] font-[600] text-[#222222]">Account Created</h2>
            <p className="text-[14px] text-[#6a6a6a]">
              <strong>{form.businessName}</strong> has been created successfully.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Link href="/admin/businesses">
                <Button variant="secondary" size="sm">View All Businesses</Button>
              </Link>
              <Button size="sm" onClick={() => {
                setSuccess(false);
                setForm({ businessName: '', contactName: '', email: '', phone: '', address: '', notes: '', sendWelcomeEmail: true });
              }}>
                Create Another
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar
        title="Create Business Account"
        subtitle="Manually create a business account, bypassing the registration form"
      />
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-5">

          <Link href="/admin/businesses" className="inline-flex items-center gap-1.5 text-[14px] text-[#6a6a6a] hover:text-[#222222] transition-colors">
            <ArrowLeft size={14} />
            Back to businesses
          </Link>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            <Card>
              <div className="space-y-1 mb-5">
                <h2 className="text-[20px] font-[600] text-[#222222]">Business Details</h2>
                <p className="text-[14px] text-[#6a6a6a]">Enter the training organisation's information.</p>
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
                <div className="sm:col-span-2">
                  <Input
                    label="Address"
                    placeholder="Street, City, Postcode"
                    value={form.address}
                    onChange={set('address')}
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-[20px] font-[600] text-[#222222] mb-4">Additional Notes</h2>
              <Textarea
                label="Internal notes (optional)"
                placeholder="Any notes visible only to admins…"
                value={form.notes}
                onChange={set('notes')}
              />
            </Card>

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
              <Button type="submit" loading={loading}>
                Create Account
              </Button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
