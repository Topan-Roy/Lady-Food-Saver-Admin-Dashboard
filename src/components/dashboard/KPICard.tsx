import React from 'react';
import { Card } from '../ui/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color?: 'orange' | 'blue' | 'green' | 'purple';
}
export function KPICard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = 'orange'
}: KPICardProps) {
  const colors = {
    orange: 'bg-orange-50 text-[#E4983A]',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  };
  return <Card className="flex flex-col justify-between h-full hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 border-gray-100/50 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3.5 rounded-2xl ${colors[color]} bg-opacity-50 ring-1 ring-inset ring-black/5 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/10' : 'bg-red-50 text-red-700 ring-1 ring-red-600/10'}`}>
        {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
        {change}
      </div>
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
    </div>
  </Card>;
}