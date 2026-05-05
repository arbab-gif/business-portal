'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
}

const sizeWidths = { sm: 420, md: 560, lg: 720 };

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-[14px] flex flex-col"
        style={{ width: '100%', maxWidth: sizeWidths[size], maxHeight: '90vh', boxShadow: 'rgba(0,0,0,0.12) 0 2px 16px 0, rgba(0,0,0,0.04) 0 0 0 1px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ebebeb]">
          <h2 className="text-[21px] font-[700] text-[#222222] leading-[1.43]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f2f2f2] transition-colors text-[#6a6a6a] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#ebebeb] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
}

export function ConfirmModal({
  open, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'danger', loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[14px] font-[500] text-[#222222] border border-[#dddddd] rounded-[12px] hover:bg-[#f7f7f7] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 text-[14px] font-[500] text-white rounded-[12px] transition-colors cursor-pointer disabled:opacity-60 ${
              variant === 'danger' ? 'bg-[#c13515] hover:bg-[#b32505]' : 'bg-[#c47a00] hover:bg-[#a36800]'
            }`}
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-[16px] text-[#3f3f3f] leading-[1.5]">{message}</p>
    </Modal>
  );
}
