import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Card } from '../ui/Card';

interface LineChartProps {
  title: string;
  data: any[];
  height?: number;
  lines?: { key: string; color: string; name?: string }[];
  variant?: 'line' | 'area';
}

export function LineChart({
  title,
  data,
  height = 300,
  lines = [
    { key: 'income', color: '#E4983A', name: 'Income' },
    { key: 'expense', color: '#1F2937', name: 'Expense' }
  ],
  variant = 'line'
}: LineChartProps) {
  return <Card className="flex flex-col h-full">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
    </div>
    <div style={{
      height
    }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        {variant === 'area' ? (
          <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <defs>
              {lines.map((line) => (
                <linearGradient key={line.key} id={`color${line.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={line.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={line.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            {lines.map((line) => (
              <Area
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#color${line.key})`}
              />
            ))}
          </AreaChart>
        ) : (
          <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: line.color, stroke: '#fff', strokeWidth: 2 }}
              />
            ))}
          </RechartsLineChart>
        )}
      </ResponsiveContainer>
    </div>
  </Card>;
}
