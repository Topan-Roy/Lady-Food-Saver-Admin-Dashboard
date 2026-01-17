import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const initialViolations = [{
  id: 1,
  listing: 'Craft Beer Pack',
  restaurant: 'Downtown Pub',
  issue: 'Alcohol listing in restricted state',
  state: 'UT',
  date: 'Today'
}, {
  id: 2,
  listing: 'Wine Bottle',
  restaurant: 'Italian Bistro',
  issue: 'Missing age verification',
  state: 'NY',
  date: 'Yesterday'
}];

export function Compliance() {
  const [violations, setViolations] = useState(initialViolations);

  const handleRemove = (id: number) => {
    if (confirm('Are you sure you want to remove this violation?')) {
      setViolations(violations.filter(v => v.id !== id));
    }
  };

  const handleWarn = (restaurant: string) => {
    alert(`Warning sent to ${restaurant} regarding compliance violation.`);
  };

  return <AdminLayout>
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Compliance & Safety
          </h1>
          <p className="text-gray-500">
            Monitor alcohol listings and legal requirements
          </p>
        </div>
      </div>

      {/* Notice Card */}
      <Card className="bg-blue-50 border-blue-100">
        <div className="flex gap-4">
          <div className="p-3 bg-blue-100 rounded-lg h-fit text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900">
              Alcohol Compliance Notice
            </h3>
            <p className="text-blue-700 mt-1 text-sm">
              All listings containing alcohol must display the mandatory legal
              notice. The system automatically flags listings with keywords
              like "beer", "wine", "cocktail".
            </p>
          </div>
        </div>
      </Card>

      {/* Violations Table */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Detected Violations
        </h3>
        <Table data={violations} columns={[{
          header: 'Listing',
          accessorKey: 'listing',
          className: 'font-medium'
        }, {
          header: 'Restaurant',
          accessorKey: 'restaurant'
        }, {
          header: 'Issue',
          accessorKey: 'issue',
          className: 'text-red-600'
        }, {
          header: 'State',
          accessorKey: 'state'
        }, {
          header: 'Date',
          accessorKey: 'date'
        }, {
          header: 'Actions',
          cell: (item) => <div className="flex gap-2">
            <Button size="sm" variant="danger" onClick={() => handleRemove(item.id)}>
              Remove
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleWarn(item.restaurant)}>
              Warn
            </Button>
          </div>
        }]} />
      </div>
    </div>
  </AdminLayout>;
}