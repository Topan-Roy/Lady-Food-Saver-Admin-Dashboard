import { useState, useRef } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Bell, CreditCard, Trash2, Edit2, Plus, Image as ImageIcon, BarChart3 } from 'lucide-react';
import { getAppLogo, setAppLogo, resetAppLogo } from '../utils/logo';

export function Settings() {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'VISA', last4: '4242', expiry: '12/24', isDefault: true },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: 'VISA',
    last4: '',
    expiry: '',
    isDefault: false
  });
  const [currentLogo, setCurrentLogo] = useState(getAppLogo());
  const [showUserDistribution, setShowUserDistribution] = useState(() => {
    return localStorage.getItem('show_user_distribution') !== 'false';
  });
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAppLogo(dataUrl);
        setCurrentLogo(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    if (window.confirm('Reset logo to default?')) {
      resetAppLogo();
      setCurrentLogo(getAppLogo());
    }
  };

  const handleToggleUserDistribution = () => {
    const newValue = !showUserDistribution;
    setShowUserDistribution(newValue);
    localStorage.setItem('show_user_distribution', String(newValue));
  };

  const handleOpenModal = (method?: any) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        type: method.type,
        last4: method.last4,
        expiry: method.expiry,
        isDefault: method.isDefault
      });
    } else {
      setEditingMethod(null);
      setFormData({
        type: 'VISA',
        last4: '',
        expiry: '',
        isDefault: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.last4 || !formData.expiry) {
      alert('Please fill in all fields');
      return;
    }

    if (editingMethod) {
      setPaymentMethods(paymentMethods.map(m =>
        m.id === editingMethod.id ? { ...m, ...formData } : m
      ));
    } else {
      const newMethod = {
        id: Date.now(),
        ...formData
      };
      setPaymentMethods([...paymentMethods, newMethod]);
    }

    if (formData.isDefault) {
      // Logic to make others not default if needed, 
      // but for simplicity we just set this one.
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(m => m.id !== id));
    }
  };

  return <AdminLayout>
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage platform configuration</p>
      </div>

      {/* Logo Management */}
      <Card>
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2 bg-orange-50 rounded-lg text-[#E4983A]">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Logo Management</h3>
            <p className="text-sm text-gray-500">
              Update your platform logo across all pages and invoices.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 group hover:border-[#E4983A] transition-colors relative">
            <img src={currentLogo} alt="Current Logo" className="w-full h-full object-contain p-2" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-[10px] text-white font-bold uppercase">Current</p>
            </div>
          </div>
          <div className="space-y-3">
            <input
              type="file"
              ref={logoInputRef}
              onChange={handleLogoUpload}
              className="hidden"
              accept="image/*"
            />
            <div className="flex gap-3">
              <Button onClick={() => logoInputRef.current?.click()}>
                Upload New Logo
              </Button>
              <Button variant="outline" onClick={handleResetLogo}>
                Reset to Default
              </Button>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              Recommended: Square SVG or PNG with transparent background.
            </p>
          </div>
        </div>
      </Card>

      {/* Platform Fees */}
      <Card>
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Platform Fees</h3>
            <p className="text-sm text-gray-500">
              Set the transaction fee applied to every order.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-end">
          <div className="w-48">
            <Input label="Fee Amount ($)" defaultValue="0.50" />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card>
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Payment Methods</h3>
            <p className="text-sm text-gray-500">
              Manage your connected payment methods.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {paymentMethods.map(method => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-[#E4983A]/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-10 w-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                  <span className={`font-black text-xs italic ${method.type === 'VISA' ? 'text-blue-800' : 'text-red-600'}`}>
                    {method.type}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{method.type} ending in {method.last4}</p>
                  <p className="text-xs text-gray-500">Expires {method.expiry} {method.isDefault && '• Default'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-[#E4983A] bg-white shadow-sm"
                  onClick={() => handleOpenModal(method)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-500 bg-white shadow-sm"
                  onClick={() => handleDelete(method.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full border-dashed border-2 py-6 rounded-2xl group hover:border-[#E4983A] hover:bg-orange-50 transition-all"
            onClick={() => handleOpenModal()}
          >
            <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Add New Payment Method
          </Button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMethod ? "Edit Payment Method" : "Add Payment Method"}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Card Type</label>
                <select
                  className="w-full h-11 px-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#E4983A] outline-none transition-all font-medium"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="VISA">VISA</option>
                  <option value="MASTERCARD">MASTERCARD</option>
                  <option value="AMEX">AMEX</option>
                </select>
              </div>
              <Input
                label="Last 4 Digits"
                placeholder="4242"
                maxLength={4}
                value={formData.last4}
                onChange={(e) => setFormData({ ...formData, last4: e.target.value.replace(/\D/g, '') })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              />
              <div className="flex items-end pb-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-200 text-[#E4983A] focus:ring-[#E4983A]"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  />
                  <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Set as Default</span>
                </label>
              </div>
            </div>
            <div className="pt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingMethod ? 'Update' : 'Add'} Method</Button>
            </div>
          </div>
        </Modal>

      </Card>

      {/* Restaurant Dashboard Permissions */}
      <Card>
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Restaurant Dashboard Permissions</h3>
            <p className="text-sm text-gray-500">
              Control which data and cards are visible to restaurant owners in their dashboard.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all">
            <div>
              <p className="font-bold text-gray-900">User distribution by City</p>
              <p className="text-xs text-gray-500">Show analytics regarding customer locations to restaurant owners.</p>
            </div>
            <button
              onClick={handleToggleUserDistribution}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none focus:ring-2 focus:ring-[#E4983A] focus:ring-offset-2 ${showUserDistribution ? 'bg-[#E4983A]' : 'bg-gray-200'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${showUserDistribution ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2 bg-orange-50 rounded-lg text-[#E4983A]">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-500">
              Configure how you receive alerts.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {['Email Notifications', 'Push Notifications', 'SMS Alerts'].map(item => <div key={item} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-gray-700 font-medium">{item}</span>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer bg-[#E4983A]">
              <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm"></span>
            </div>
          </div>)}
        </div>
      </Card>


    </div>
  </AdminLayout>;
}