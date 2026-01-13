import React from 'react';
import { Card } from '../ui/Card';
import { Package, CheckCircle, Calendar } from 'lucide-react';
const activities = [{
  id: 1,
  user: 'Sylvester Quilt',
  role: 'Inventory Manager',
  action: 'updated inventory',
  target: '10 units of "Organic Chicken Breast"',
  time: '11:20 AM',
  icon: Package,
  color: 'bg-orange-100 text-orange-600'
}, {
  id: 2,
  user: 'Maria Kings',
  role: 'Kitchen Admin',
  action: 'marked order #ORD1028 as',
  target: 'completed',
  time: '11:00 AM',
  icon: CheckCircle,
  color: 'bg-green-100 text-green-600'
}, {
  id: 3,
  user: 'William Smith',
  role: 'Receptionist',
  action: 'added new reservation for',
  target: '4 guests at 7:00 PM',
  time: '10:30 AM',
  icon: Calendar,
  color: 'bg-blue-100 text-blue-600'
}];
export function ActivityFeed() {
  return <Card className="border-gray-100/50">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
      <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded transition-colors">•••</button>
    </div>

    <div className="relative pl-10 space-y-3 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-gray-100">
      {activities.map(item => <div key={item.id} className="relative">
        {/* Timeline dot */}
        <div className={`absolute -left-[35px] top-0 p-2 rounded-xl ${item.color} ring-4 ring-white z-10`}>
          <item.icon className="h-4 w-4" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-bold text-sm text-gray-900">{item.user}</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
              {item.role}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-1.5">
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