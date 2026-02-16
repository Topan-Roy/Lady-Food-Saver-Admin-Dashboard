import React from 'react';
import { X } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: ModalProps) {
  if (!isOpen) return null;
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 md:inset-0"
    onClick={onClose}
  >
    <div
      className={`relative w-full ${sizeClasses[size]} max-h-full rounded-xl bg-white shadow-2xl`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4 md:p-5">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <button onClick={onClose} type="button" className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900">
          <X className="h-5 w-5" />
          <span className="sr-only">Close modal</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 space-y-4">{children}</div>
    </div>
  </div>;
}