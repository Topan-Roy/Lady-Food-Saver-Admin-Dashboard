import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
}
export function Table<T>({
  data,
  columns,
  isLoading,
  onRowClick
}: TableProps<T>) {
  if (isLoading) {
    return <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-4">
      {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />)}
    </div>;
  }
  return <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {columns.map((col, i) => <th key={i} className={`px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
              {col.header}
            </th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item, rowIdx) => <tr key={rowIdx} className={`hover:bg-gray-50/80 transition-all duration-200 group ${onRowClick ? 'cursor-pointer' : ''}`} onClick={() => onRowClick?.(item)}>
            {columns.map((col, colIdx) => <td key={colIdx} className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap group-hover:text-gray-900 transition-colors">
              {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
            </td>)}
          </tr>)}
        </tbody>
      </table>
    </div>

    {/* Simple Pagination Footer */}
    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing 1 to {data.length} of {data.length} results
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>;
}