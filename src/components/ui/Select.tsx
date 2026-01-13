import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    label: string;
    value: string;
}

interface SelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function Select({ options, value, onChange, placeholder = 'Select option', className = '' }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full h-11 px-4 bg-gray-50/50 border ${isOpen ? 'border-[#FF6B35] ring-4 ring-[#FF6B35]/5 bg-white' : 'border-gray-200'} rounded-xl text-sm font-medium text-gray-700 hover:bg-white hover:border-gray-300 transition-all duration-200`}
            >
                <span className={!selectedOption ? 'text-gray-400' : ''}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 py-1.5 animate-in fade-in zoom-in duration-200">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors ${option.value === value
                                ? 'bg-gray-50 text-[#FF6B35] font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className={`w-1 h-1 rounded-full mr-2 transition-transform duration-200 ${option.value === value ? 'bg-[#FF6B35] scale-100' : 'bg-transparent scale-0'}`} />
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
