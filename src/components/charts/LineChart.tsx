import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
interface LineChartProps {
  title: string;
  data: any[];
  height?: number;
}
export function LineChart({
  title,
  data,
  height = 300
}: LineChartProps) {
  return <Card className="flex flex-col h-full">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">Last 8 months revenue</p>
      </div>
      <Select
        className="w-32"
        options={[
          { label: 'This Year', value: 'this' },
          { label: 'Last Year', value: 'last' },
        ]}
        value="this"
        onChange={() => { }}
      />
    </div>
    <div style={{
      height
    }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{
          top: 5,
          right: 20,
          bottom: 5,
          left: 0
        }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
            fill: '#9CA3AF',
            fontSize: 12
          }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{
            fill: '#9CA3AF',
            fontSize: 12
          }} tickFormatter={value => `${value / 1000}k`} />
          <Tooltip contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }} />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line type="monotone" dataKey="income" stroke="#FF6B35" strokeWidth={3} dot={false} activeDot={{
            r: 6,
            fill: '#FF6B35',
            stroke: '#fff',
            strokeWidth: 2
          }} />
          <Line type="monotone" dataKey="expense" stroke="#1F2937" strokeWidth={3} dot={false} activeDot={{
            r: 6,
            fill: '#1F2937',
            stroke: '#fff',
            strokeWidth: 2
          }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  </Card>;
}