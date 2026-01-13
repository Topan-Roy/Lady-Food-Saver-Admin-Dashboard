import React, { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AddTaxRuleModal } from '../components/modals/AddTaxRuleModal';
import { EditTaxRuleModal } from '../components/modals/EditTaxRuleModal';
import { Plus } from 'lucide-react';
const taxRules = [{
  state: 'New York',
  rate: '8.875%',
  status: 'Active',
  lastUpdated: '2023-10-15'
}, {
  state: 'California',
  rate: '7.25%',
  status: 'Active',
  lastUpdated: '2023-09-20'
}, {
  state: 'Texas',
  rate: '6.25%',
  status: 'Active',
  lastUpdated: '2023-11-01'
}, {
  state: 'Florida',
  rate: '6.00%',
  status: 'Inactive',
  lastUpdated: '2023-08-12'
}];
export function TaxRules() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const openEditModal = (rule: any) => {
    setSelectedRule(rule);
    setIsEditModalOpen(true);
  };
  return <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tax Rules</h1>
            <p className="text-gray-500">Manage state-based tax rates</p>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsAddModalOpen(true)}>
            Add State Rule
          </Button>
        </div>

        <Table data={taxRules} columns={[{
        header: 'State',
        accessorKey: 'state',
        className: 'font-medium'
      }, {
        header: 'Tax Rate',
        accessorKey: 'rate'
      }, {
        header: 'Status',
        cell: item => <Badge variant={item.status === 'Active' ? 'success' : 'default'}>
                  {item.status}
                </Badge>
      }, {
        header: 'Last Updated',
        accessorKey: 'lastUpdated'
      }, {
        header: 'Actions',
        cell: item => <Button size="sm" variant="secondary" onClick={() => openEditModal(item)}>
                  Edit
                </Button>
      }]} />
      </div>

      <AddTaxRuleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditTaxRuleModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} rule={selectedRule} />
    </AdminLayout>;
}