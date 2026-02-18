import { useState, useMemo } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Plus, FileText, Download, Loader2, Save, Trash2, AlertCircle } from 'lucide-react';
import {
  useGetTaxAnalyticsQuery,
  useUpdateTaxRuleMutation,
  useDeleteTaxRuleMutation,
  useCreateTaxRuleMutation
} from '@/redux/features/tax';
import { format } from 'date-fns';

const STATE_CODES: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
};

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export function TaxRules() {
  const { data: apiResponse, isLoading } = useGetTaxAnalyticsQuery(undefined);
  const [updateTaxRule, { isLoading: isUpdating }] = useUpdateTaxRuleMutation();
  const [deleteTaxRule, { isLoading: isDeleting }] = useDeleteTaxRuleMutation();
  const [createTaxRule, { isLoading: isCreating }] = useCreateTaxRuleMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [taxRate, setTaxRate] = useState('');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTax, setEditTax] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const taxRules = useMemo(() => {
    if (!apiResponse?.data?.StateTexRules) return [];
    return apiResponse.data.StateTexRules.map((item: any) => ({
      id: item.id,
      state: item.state,
      rate: item.TaxRules,
      status: item.Status,
      lastUpdated: item.LastUpdated ? format(new Date(item.LastUpdated), 'MMM dd, yyyy') : 'N/A'
    }));
  }, [apiResponse]);

  const stats = useMemo(() => {
    if (!apiResponse?.data?.['Tax information']) {
      return { total: 0, active: 0, remaining: 51 };
    }
    const info = apiResponse.data['Tax information'];
    return {
      total: info.ToralStates || 0,
      active: info.Active || 0,
      remaining: info.RemainingStates || 0
    };
  }, [apiResponse]);

  const handleAddTaxRule = async () => {
    if (!selectedState || !taxRate) {
      alert('Please select a state and enter a tax rate');
      return;
    }

    try {
      await createTaxRule({
        name: selectedState,
        code: STATE_CODES[selectedState] || selectedState.substring(0, 2).toUpperCase(),
        tax: taxRate,
        isActive: true
      }).unwrap();

      setSelectedState('');
      setTaxRate('');
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to create tax rule:", error);
      alert("Failed to add tax rule");
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditTax(item.rate.replace('%', ''));
    setEditIsActive(item.status === 'Active');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      await updateTaxRule({
        id: editingItem.id,
        tax: editTax,
        isActive: editIsActive
      }).unwrap();
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update tax rule:", error);
      alert("Failed to update tax rule");
    }
  };

  const openDeleteModal = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteTaxRule(itemToDelete.id).unwrap();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete tax rule:", error);
      alert("Failed to delete tax rule");
    }
  };

  const handleExport = () => {
    const headers = ['State', 'Tax Rate', 'Status', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...taxRules.map((rule: any) => [rule.state, rule.rate, rule.status, rule.lastUpdated].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tax-rules.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const availableStates = US_STATES.filter(
    (state: string) => !taxRules.find((rule: any) => rule.state === state)
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 text-[#E4983A] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return <AdminLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Information</h1>
          <p className="text-gray-500">Manage tax rates for US {stats.total} states</p>
        </div>
        {/* <div className="flex gap-3">
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddForm(!showAddForm)}>
            Add State Tax
          </Button>
        </div> */}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Tax Rule: ${editingItem?.state}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
            <Input
              type="number"
              step="0.01"
              value={editTax}
              onChange={(e) => setEditTax(e.target.value)}
              placeholder="e.g., 9.25"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E4983A]"></div>
              </label>
              <span className="text-sm font-medium text-gray-700">
                {editIsActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} leftIcon={isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Remove Tax Rule"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Are you sure?</h4>
              <p className="text-sm text-gray-500 mt-1">
                This action will permanently remove the tax rule for <span className="font-bold text-gray-900">{itemToDelete?.state}</span>. This cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
              onClick={handleConfirmDelete}
              leftIcon={isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Form */}
      {/* {showAddForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New State Tax Rule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#E4983A]/20 focus:border-[#E4983A] transition-all"
                >
                  <option value="">Select State</option>
                  {availableStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="e.g., 7.25"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#E4983A]/20 focus:border-[#E4983A] transition-all"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={handleAddTaxRule}
                  className="flex-1"
                  disabled={isCreating}
                  leftIcon={isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                >
                  {isCreating ? 'Adding...' : 'Add Rule'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={isCreating}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )} */}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <FileText className="h-6 w-6 text-[#E4983A]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total States</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.active}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining States</p>
              <p className="text-2xl font-bold text-gray-900">{stats.remaining}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">State Tax Rules</h3>
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />} onClick={handleExport}>
            Export
          </Button>
        </div>
        <Table data={taxRules} columns={[{
          header: 'State',
          accessorKey: 'state',
          className: 'font-medium'
        }, {
          header: 'Tax Rate',
          accessorKey: 'rate',
          className: 'text-[#E4983A] font-bold'
        }, {
          header: 'Status',
          cell: (item: any) => <Badge variant={item.status === 'Active' ? 'success' : 'default'}>
            {item.status}
          </Badge>
        }, {
          header: 'Last Updated',
          accessorKey: 'lastUpdated'
        }, {
          header: 'Actions',
          cell: (item: any) => (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => openEditModal(item)}>
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => openDeleteModal(item)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Remove
              </Button>
            </div>
          )
        }]} />
      </Card>
    </div>
  </AdminLayout>;
}
