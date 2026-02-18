import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) {
  return <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>}
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>}
      <input className={`block w-full h-11 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#E4983A] focus:ring-[#E4983A] sm:text-sm transition-all duration-200 ${icon ? 'pl-10' : 'pl-4'} ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`} {...props} />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>;
}
