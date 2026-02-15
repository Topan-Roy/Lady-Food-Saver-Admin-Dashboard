import { Card } from '../ui/Card';
import { Package, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useGetActivitiesQuery } from '../../redux/features/dashboardApi';
import { formatDistanceToNow } from 'date-fns';

export function ActivityFeed() {
  const { data: activitiesData } = useGetActivitiesQuery({});

  const activities = (activitiesData?.data || []).map((item: any) => {
    let icon = CheckCircle;
    let color = 'bg-green-100 text-green-600';

    if (item.eventType.includes('FAILED')) {
      icon = XCircle;
      color = 'bg-red-100 text-red-600';
    } else if (item.eventType.includes('CREATED')) {
      icon = Package;
      color = 'bg-blue-100 text-blue-600';
    } else if (item.riskLevel !== 'LOW') {
      icon = AlertCircle;
      color = 'bg-orange-100 text-orange-600';
    }

    return {
      id: item._id,
      user: item.userId?.fullName || 'Unknown User',
      role: item.userId?.role || 'System',
      action: item.action,
      target: item.resource || '', // Some items might behave differently
      time: formatDistanceToNow(new Date(item.timestamp), { addSuffix: true }),
      icon,
      color,
      eventType: item.eventType
    };
  });

  return <Card className="border-gray-100/50">
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
    </div>

    <div className="relative pl-14 space-y-6 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-gray-100">
      {activities.length > 0 ? (
        activities.map((item: any) => <div key={item.id} className="relative">
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
        </div>)
      ) : (
        <p className="text-sm text-gray-500">No recent activity.</p>
      )}
    </div>
  </Card>;
}