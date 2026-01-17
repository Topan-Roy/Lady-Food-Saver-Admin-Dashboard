import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Plus, FileText, Download } from 'lucide-react';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const initialTaxRules = [
  { state: 'New York', rate: '8.875%', status: 'Active', lastUpdated: '2023-10-15' },
  { state: 'California', rate: '7.25%', status: 'Active', lastUpdated: '2023-09-20' },
  { state: 'Texas', rate: '6.25%', status: 'Active', lastUpdated: '2023-11-01' },
  { state: 'Florida', rate: '6.00%', status: 'Active', lastUpdated: '2023-08-12' },
];

export function TaxRules() {
  const [taxRules, setTaxRules] = useState(initialTaxRules);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [taxRate, setTaxRate] = useState('');

  const handleAddTaxRule = () => {
    if (!selectedState || !taxRate) {
      alert('Please select a state and enter a tax rate');
      return;
    }

    const newRule = {
      state: selectedState,
      rate: `${taxRate}%`,
      status: 'Active',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setTaxRules([...taxRules, newRule]);
    setSelectedState('');
    setTaxRate('');
    setShowAddForm(false);
  };

  const handleExport = () => {
    const headers = ['State', 'Tax Rate', 'Status', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...taxRules.map(rule => [rule.state, rule.rate, rule.status, rule.lastUpdated].join(','))
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
    state => !taxRules.find(rule => rule.state === state)
  );

  return <AdminLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Information</h1>
          <p className="text-gray-500">Manage tax rates for US 48 states</p>
        </div>
        <div className="flex gap-3">
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowAddForm(!showAddForm)}>
            Add State Tax
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New State Tax Rule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleAddTaxRule} className="flex-1">
                  Add Rule
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <FileText className="h-6 w-6 text-[#FF6B35]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total States</p>
              <p className="text-2xl font-bold text-gray-900">{taxRules.length}</p>
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
                {taxRules.filter(r => r.status === 'Active').length}
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
              <p className="text-2xl font-bold text-gray-900">{48 - taxRules.length}</p>
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
          className: 'text-[#FF6B35] font-bold'
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
          cell: (item) => (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => {
                const newRate = prompt('Enter new tax rate:', item.rate.replace('%', ''));
                if (newRate) {
                  setTaxRules(taxRules.map(r =>
                    r.state === item.state ? { ...r, rate: `${newRate}%`, lastUpdated: new Date().toISOString().split('T')[0] } : r
                  ));
                }
              }}>
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => {
                if (confirm(`Remove tax rule for ${item.state}?`)) {
                  setTaxRules(taxRules.filter(r => r.state !== item.state));
                }
              }}>
                Remove
              </Button>
            </div>
          )
        }]} />
      </Card>
    </div>
  </AdminLayout>;
}
