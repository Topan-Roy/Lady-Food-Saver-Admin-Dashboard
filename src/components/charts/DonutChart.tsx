import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
interface DonutChartProps {
  title: string;
  data: any[];
  height?: number;
  showFilter?: boolean;
}

const COLORS = ['#E4983A', '#FDBA74', '#1F2937', '#9CA3AF'];

export function DonutChart({
  title,
  data,
  height = 300,
  showFilter = false
}: DonutChartProps) {
  return <Card className="flex flex-col h-full">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {showFilter && (
        <Select
          className="w-32"
          options={[{ label: 'This Month', value: 'month' }]}
          value="month"
          onChange={() => { }}
        />
      )}
    </div>
    <div style={{
      height
    }} className="w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{
            paddingTop: '20px'
          }} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-8">
        {/* Optional center content could go here */}
      </div>
    </div>
  </Card>;
}
