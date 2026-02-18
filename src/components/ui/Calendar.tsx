import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CalendarProps {
    mode?: 'single' | 'range';
    selected?: Date | { from: Date; to: Date | null };
    onSelect?: (date: Date | { from: Date; to: Date | null }) => void;
    className?: string;
}

export function Calendar({ mode = 'single', selected, onSelect, className }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const handleDateClick = (date: Date) => {
        if (mode === 'single') {
            onSelect?.(date);
        } else {
            const currentRange = (selected as { from: Date; to: Date | null }) || { from: null, to: null };
            if (!currentRange.from || (currentRange.from && currentRange.to)) {
                onSelect?.({ from: date, to: null });
            } else {
                if (date < currentRange.from) {
                    onSelect?.({ from: date, to: currentRange.from });
                } else {
                    onSelect?.({ from: currentRange.from, to: date });
                }
            }
        }
    };

    const isSelected = (date: Date) => {
        if (mode === 'single') {
            return selected && isSameDay(date, selected as Date);
        } else {
            const range = selected as { from: Date; to: Date | null };
            return (range?.from && isSameDay(date, range.from)) || (range?.to && isSameDay(date, range.to));
        }
    };

    const isInRange = (date: Date) => {
        if (mode !== 'range') return false;
        const range = selected as { from: Date; to: Date | null };
        if (!range?.from || !range?.to) return false;
        return isWithinInterval(date, { start: range.from, end: range.to });
    };

    return (
        <div className={cn("p-4 bg-white rounded-2xl shadow-sm border border-gray-100", className)}>
            <div className="flex items-center justify-between mb-4 px-2">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-bold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy')}
                </span>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-xs font-bold text-gray-400 p-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((date, i) => {
                    const isSelectedDay = isSelected(date);
                    const isRangeDay = isInRange(date);
                    const isCurrentMonth = isSameMonth(date, currentMonth);

                    return (
                        <button
                            key={i}
                            onClick={() => handleDateClick(date)}
                            disabled={!isCurrentMonth} // Optional: disable or style differently
                            className={cn(
                                "h-9 w-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all relative z-10",
                                !isCurrentMonth && "text-gray-300 opacity-50",
                                isCurrentMonth && !isSelectedDay && !isRangeDay && "text-gray-700 hover:bg-gray-50 hover:text-[#E4983A]",
                                isSelectedDay && "bg-[#E4983A] text-white shadow-lg shadow-orange-500/30 font-bold",
                                isRangeDay && !isSelectedDay && "bg-orange-50 text-[#E4983A] rounded-none first:rounded-l-xl last:rounded-r-xl"
                            )}
                        >
                            {format(date, 'd')}
                        </button>
                    )
                })}
            </div>
        </div>
    );
}
