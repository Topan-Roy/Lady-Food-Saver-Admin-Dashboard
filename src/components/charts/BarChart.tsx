import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface BarChartProps {
  title: string;
  data: any[];
  height?: number;
}
export function BarChart({
  title,
  data,
  height = 300
}: BarChartProps) {
  return <Card className="flex flex-col h-full">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
    <div style={{
      height
    }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{
          top: 5,
          right: 0,
          bottom: 5,
          left: -20
        }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
            fill: '#9CA3AF',
            fontSize: 12
          }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{
            fill: '#9CA3AF',
            fontSize: 12
          }} />
          <Tooltip cursor={{
            fill: '#F3F4F6'
          }} contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }} />
          <Bar
            dataKey="value"
            fill="#FF6B35"
            radius={[8, 8, 0, 0]}
            barSize={40}
            activeBar={{
              fill: '#E85A2D'
            }}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  </Card>;
}