import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Calendar as CalendarComponent } from './Calendar';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type FilterRange = 'today' | 'week' | 'month' | 'year' | 'custom';

interface GlobalFilterProps {
    onFilterChange: (range: FilterRange, customDates?: { start: Date; end: Date }) => void;
    className?: string;
}

export function GlobalFilter({ onFilterChange, className }: GlobalFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState<FilterRange>('week');
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // New state for advanced picker
    const [filterType, setFilterType] = useState<'single' | 'range'>('range');
    const [singleDate, setSingleDate] = useState<Date | undefined>(undefined);
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date | null } | undefined>(undefined);

    const ranges: { label: string; value: FilterRange }[] = [
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' },
        { label: 'This Year', value: 'year' },
        { label: 'Custom Range', value: 'custom' },
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                if (selectedRange !== 'custom') setShowCustomPicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedRange]);

    const handleRangeSelect = (range: FilterRange) => {
        setSelectedRange(range);
        if (range === 'custom') {
            setShowCustomPicker(true);
        } else {
            setIsOpen(false);
            setShowCustomPicker(false);
            onFilterChange(range);
        }
    };

    const handleApplyCustom = () => {
        if (filterType === 'single' && singleDate) {
            onFilterChange('custom', { start: singleDate, end: singleDate });
            setIsOpen(false);
        } else if (filterType === 'range' && dateRange?.from && dateRange?.to) {
            onFilterChange('custom', { start: dateRange.from, end: dateRange.to });
            setIsOpen(false);
        }
    };

    const getActiveLabel = () => {
        if (selectedRange === 'custom') {
            if (filterType === 'single' && singleDate) {
                return format(singleDate, 'MMM d, yyyy');
            }
            if (filterType === 'range' && dateRange?.from && dateRange?.to) {
                return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`;
            }
        }
        return ranges.find(r => r.value === selectedRange)?.label || 'Select Filter';
    };

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-3 rounded-2xl shadow-sm hover:border-[#FF6B35] hover:shadow-md transition-all group"
            >
                <div className="p-1.5 bg-orange-50 rounded-lg group-hover:bg-[#FF6B35] transition-colors">
                    <Calendar className="h-4 w-4 text-[#FF6B35] group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold text-gray-700">{getActiveLabel()}</span>
                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                    {!showCustomPicker ? (
                        <div className="p-2">
                            {ranges.map((range) => (
                                <button
                                    key={range.value}
                                    onClick={() => handleRangeSelect(range.value)}
                                    className={cn(
                                        "flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200",
                                        selectedRange === range.value
                                            ? "bg-[#FF6B35] text-white shadow-lg shadow-orange-500/20"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    {range.label}
                                    {selectedRange === range.value && <Check className="h-4 w-4 text-white" />}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 text-base">Select Date</h3>
                                <button
                                    onClick={() => setShowCustomPicker(false)}
                                    className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                                >
                                    <ChevronDown className="h-4 w-4 rotate-90" />
                                </button>
                            </div>

                            {/* Type Toggle */}
                            <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
                                <button
                                    onClick={() => setFilterType('single')}
                                    className={cn(
                                        "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                                        filterType === 'single' ? "bg-white text-[#FF6B35] shadow-sm" : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    Single Date
                                </button>
                                <button
                                    onClick={() => setFilterType('range')}
                                    className={cn(
                                        "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                                        filterType === 'range' ? "bg-white text-[#FF6B35] shadow-sm" : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    Date Range
                                </button>
                            </div>

                            <div className="flex justify-center">
                                <CalendarComponent
                                    mode={filterType}
                                    selected={filterType === 'single' ? singleDate : dateRange}
                                    onSelect={(val) => {
                                        if (filterType === 'single') setSingleDate(val as Date);
                                        else setDateRange(val as { from: Date; to: Date | null });
                                    }}
                                    className="border-none shadow-none p-0 w-full"
                                />
                            </div>

                            <button
                                disabled={filterType === 'single' ? !singleDate : (!dateRange?.from || !dateRange?.to)}
                                onClick={handleApplyCustom}
                                className="w-full bg-[#FF6B35] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-[#E85A2D] hover:shadow-orange-500/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
                            >
                                Apply Filter
                            </button>
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
}
