import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { useGetViolationsQuery, useTakeViolationActionMutation } from '../redux/features/compliance';

export function Compliance() {
  const { data, isLoading } = useGetViolationsQuery({ page: 1 });
  const [takeAction] = useTakeViolationActionMutation();

  const handleRemove = async (id: string) => {
    if (confirm('Are you sure you want to remove this violation?')) {
      try {
        await takeAction({ id, action: 'Remove' }).unwrap();
        alert('Violation removed successfully');
      } catch (err) {
        alert('Failed to remove violation');
      }
    }
  };

  const handleWarn = (restaurant: string) => {
    alert(`Warning sent to ${restaurant} regarding compliance violation.`);
  };

  const violations = data?.data?.violations || [];

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
        <Table
          data={violations}
          isLoading={isLoading}
          columns={[{
            header: 'Listing',
            accessorKey: 'Listing',
            className: 'font-medium'
          }, {
            header: 'Restaurant',
            accessorKey: 'Restaurant'
          }, {
            header: 'Issue',
            accessorKey: 'Issue',
            className: 'text-red-600'
          }, {
            header: 'Status',
            accessorKey: 'Status'
          }, {
            header: 'Date',
            cell: (item) => new Date(item.Date).toLocaleDateString()
          }, {
            header: 'Actions',
            cell: (item) => <div className="flex gap-2">
              <Button size="sm" variant="danger" onClick={() => handleRemove(item.id)}>
                Remove
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleWarn(item.Restaurant)}>
                Warn
              </Button>
            </div>
          }]} />
      </div>
    </div>
  </AdminLayout>;
}
