import React from 'react';
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className = ''
}: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };
  return <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-100 ${sizes[size]} ${className}`}>
      {src ? <img src={src} alt={alt} className="h-full w-full object-cover" /> : <span className="font-medium text-gray-600">{fallback}</span>}
    </div>;
}