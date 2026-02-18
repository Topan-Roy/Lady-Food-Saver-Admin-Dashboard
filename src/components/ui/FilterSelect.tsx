import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Filter } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FilterSelectProps {
    label?: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
    className?: string;
    icon?: React.ElementType;
}

export function FilterSelect({ label, value, options, onChange, className, icon: Icon = Filter }: FilterSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || label || 'Select';

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-2xl shadow-sm hover:border-[#E4983A] hover:shadow-md transition-all group min-w-[200px] justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-orange-50 rounded-lg group-hover:bg-[#E4983A] transition-colors">
                        <Icon className="h-4 w-4 text-[#E4983A] group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                        {label && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>}
                        <span className="text-sm font-bold text-gray-700 block">{selectedLabel}</span>
                    </div>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-3 w-full min-w-[240px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                    <div className="p-2">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200",
                                    value === option.value
                                        ? "bg-[#E4983A] text-white shadow-lg shadow-orange-500/20"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                {option.label}
                                {value === option.value && <Check className="h-4 w-4 text-white" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
