import { Card } from '../ui/Card';
import { Package, CheckCircle, Calendar } from 'lucide-react';
const activities = [{
  id: 1,
  user: 'Joe\'s Pizza',
  role: 'Restaurant Partner',
  action: 'listed new surplus inventory',
  target: '5x Spicy Pepperoni Slice',
  time: '11:20 AM',
  icon: Package,
  color: 'bg-orange-100 text-orange-600'
}, {
  id: 2,
  user: 'Alice Brown',
  role: 'Customer',
  action: 'reserved a Surprise Bag from',
  target: 'Sushi World',
  time: '11:00 AM',
  icon: CheckCircle,
  color: 'bg-green-100 text-green-600'
}, {
  id: 3,
  user: 'System Admin',
  role: 'Platform',
  action: 'verified new restaurant application',
  target: 'Burger King (Downtown)',
  time: '10:30 AM',
  icon: CheckCircle,
  color: 'bg-blue-100 text-blue-600'
}];
export function ActivityFeed() {
  return <Card className="border-gray-100/50">
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
    </div>

    <div className="relative pl-14 space-y-6 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-gray-100">
      {activities.map(item => <div key={item.id} className="relative">
        {/* Timeline dot */}
        <div className={`absolute -left-[45px] top-0 p-2 rounded-xl ${item.color} ring-4 ring-white z-10`}>
          <item.icon className="h-4 w-4" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-sm text-gray-900">{item.user}</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
              {item.role}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            {item.action}{' '}
            <span className="text-gray-900 font-semibold">{item.target}</span>
          </p>
          <span className="text-xs font-medium text-gray-400">
            {item.time}
          </span>
        </div>
      </div>)}
    </div>
  </Card>;
}