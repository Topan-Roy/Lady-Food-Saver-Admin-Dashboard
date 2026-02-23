import { useState, useRef, useEffect } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Bell, CreditCard, Trash2, Edit2, Plus, Image as ImageIcon, BarChart3 } from 'lucide-react';
import { getAppLogo, setAppLogo, resetAppLogo } from '../utils/logo';
import { useGetPublicConfigQuery, useUpdateLogoMutation, useGetPlatformFeeQuery, useUpdatePlatformFeeMutation, useGetPaymentMethodsQuery, useAddPaymentMethodMutation, useUpdatePaymentMethodMutation, useDeletePaymentMethodMutation, useUpdateUserDistributionMutation } from '../redux/features/setting';
import { useSelector } from 'react-redux';

export function Settings() {
  const { user } = useSelector((state: any) => state.auth);
  const { data: methodsResponse, isLoading: isMethodsLoading } = useGetPaymentMethodsQuery({});
  const [addPaymentMethod, { isLoading: isAddingMethod }] = useAddPaymentMethodMutation();
  const [updatePaymentMethod, { isLoading: isUpdatingMethod }] = useUpdatePaymentMethodMutation();
  const [deletePaymentMethod, { isLoading: isDeletingMethod }] = useDeletePaymentMethodMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [formData, setFormData] = useState({
    cardholderName: '',
    type: 'VISA',
    last4: '',
    expiry: '',
    isDefault: false
  });

  const { data: configData } = useGetPublicConfigQuery({});
  const [updateLogo, { isLoading: isUpdatingLogo }] = useUpdateLogoMutation();
  const [updateUserDistribution, { isLoading: isUpdatingDistribution }] = useUpdateUserDistributionMutation();

  const { data: feeData } = useGetPlatformFeeQuery({});
  const [updatePlatformFee, { isLoading: isUpdatingFee }] = useUpdatePlatformFeeMutation();

  const [platformFee, setPlatformFee] = useState('0.50');
  const [currentLogo, setCurrentLogo] = useState(getAppLogo());
  const [showUserDistribution, setShowUserDistribution] = useState(() => {
    return localStorage.getItem('show_user_distribution') !== 'false';
  });
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('notification_settings');
    return saved ? JSON.parse(saved) : {
      'Email Notifications': true,
      'Push Notifications': true,
      'SMS Alerts': false,
    };
  });

  const toggleNotification = (key: string) => {
    setNotificationSettings((prev: any) => {
      const newValue = !prev[key];
      const newState = { ...prev, [key]: newValue };
      localStorage.setItem('notification_settings', JSON.stringify(newState));

      // Show alert for Email and SMS as requested
      if (key === 'Email Notifications' || key === 'SMS Alerts') {
        alert(`${key} ${newValue ? 'enabled successfully' : 'disabled successfully'}`);
      }

      return newState;
    });
  };

  useEffect(() => {
    if (configData?.data?.app_logo) {
      setCurrentLogo(configData.data.app_logo);
      setAppLogo(configData.data.app_logo);
    }
    // Handle the nested structure for permissions
    const permissions = configData?.data?.restaurant_dashboard_permissions;
    if (permissions?.showUserDistributionByCity !== undefined) {
      setShowUserDistribution(permissions.showUserDistributionByCity);
    }
  }, [configData]);

  useEffect(() => {
    if (feeData?.data?.value) {
      setPlatformFee(feeData.data.value.toString());
    }
  }, [feeData]);

  const handleUpdateFee = async () => {
    try {
      await updatePlatformFee({
        value: parseFloat(platformFee),
        type: 'fixed' // Defaulting to fixed as seen in example
      }).unwrap();
      alert('Platform fee updated successfully');
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update platform fee');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Step 1: Upload to ImgBB
        const formData = new FormData();
        formData.append('image', file);

        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const uploadResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image to storage');
        }

        const uploadData = await uploadResponse.json();
        const logoUrl = uploadData.data.url;

        // Step 2: Update logo in our database
        await updateLogo({ logoUrl }).unwrap();

        setCurrentLogo(logoUrl);
        setAppLogo(logoUrl);
      } catch (err: any) {
        console.error('Logo upload failed:', err);
        alert(err?.data?.message || err?.message || 'Failed to update logo');
      } finally {
        if (logoInputRef.current) {
          logoInputRef.current.value = '';
        }
      }
    }
  };

  const handleResetLogo = async () => {
    if (window.confirm('Reset logo to default?')) {
      try {
        const defaultLogo = '/logo.png';
        await updateLogo({ logoUrl: defaultLogo }).unwrap();

        resetAppLogo();
        setCurrentLogo(defaultLogo);
        alert('Logo reset successfully');
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to reset logo');
      }
    }
  };

  const handleToggleUserDistribution = async () => {
    const newValue = !showUserDistribution;
    try {
      await updateUserDistribution(newValue).unwrap();
      setShowUserDistribution(newValue);
      localStorage.setItem('show_user_distribution', String(newValue));
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update user distribution permission');
    }
  };

  const handleOpenModal = (method?: any) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        cardholderName: method.cardholderName || '',
        type: method.brand?.toUpperCase() || 'VISA',
        last4: method.last4,
        expiry: method.expiryDate,
        isDefault: method.isDefault
      });
    } else {
      setEditingMethod(null);
      setFormData({
        cardholderName: '',
        type: 'VISA',
        last4: '',
        expiry: '',
        isDefault: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.cardholderName || !formData.last4 || !formData.expiry) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingMethod) {
        await updatePaymentMethod({
          id: editingMethod._id,
          cardholderName: formData.cardholderName,
          expiryDate: formData.expiry
        }).unwrap();
        alert('Payment method updated successfully');
      } else {
        await addPaymentMethod({
          userId: user?.id || user?._id,
          cardholderName: formData.cardholderName,
          brand: formData.type.charAt(0).toUpperCase() + formData.type.slice(1).toLowerCase(),
          last4: formData.last4,
          expiryDate: formData.expiry,
          isDefault: formData.isDefault
        }).unwrap();
        alert('Payment method added successfully');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to save payment method');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await deletePaymentMethod(id).unwrap();
        alert('Payment method deleted successfully');
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete payment method');
      }
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
              <Button
                onClick={() => logoInputRef.current?.click()}
                disabled={isUpdatingLogo}
              >
                {isUpdatingLogo ? 'Uploading...' : 'Upload New Logo'}
              </Button>
              <Button variant="outline" onClick={handleResetLogo} disabled={isUpdatingLogo}>
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
            <Input
              label="Fee Amount ($)"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value.replace(/[^0-9.]/g, ''))}
            />
          </div>
          <Button onClick={handleUpdateFee} disabled={isUpdatingFee}>
            {isUpdatingFee ? 'Saving...' : 'Save Changes'}
          </Button>
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
          {isMethodsLoading ? (
            <div className="text-center py-4">Loading payment methods...</div>
          ) : (methodsResponse?.data?.methods || []).map((method: any) => (
            <div key={method._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group hover:border-[#E4983A]/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-10 w-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                  <span className={`font-black text-xs italic ${method.brand?.toUpperCase() === 'VISA' ? 'text-blue-800' : 'text-red-600'}`}>
                    {method.brand?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{method.brand} ending in {method.last4}</p>
                  <p className="text-xs text-gray-500">Expires {method.expiryDate} {method.isDefault && '• Default'}</p>
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
                  onClick={() => handleDelete(method._id)}
                  disabled={isDeletingMethod}
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
            {!editingMethod && (
              <Input
                label="Cardholder Name"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              />
            )}
            {editingMethod && (
              <Input
                label="Cardholder Name"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Card Type</label>
                <select
                  className="w-full h-11 px-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#E4983A] outline-none transition-all font-medium disabled:opacity-50"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  disabled={!!editingMethod}
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
                disabled={!!editingMethod}
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
                    className="w-5 h-5 rounded border-2 border-gray-200 text-[#E4983A] focus:ring-[#E4983A] disabled:opacity-50"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    disabled={!!editingMethod}
                  />
                  <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Set as Default</span>
                </label>
              </div>
            </div>
            <div className="pt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isAddingMethod || isUpdatingMethod}>
                {isAddingMethod || isUpdatingMethod ? 'Saving...' : (editingMethod ? 'Update' : 'Add')} Method
              </Button>
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
              disabled={isUpdatingDistribution}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none focus:ring-2 focus:ring-[#E4983A] focus:ring-offset-2 ${showUserDistribution ? 'bg-[#E4983A]' : 'bg-gray-200'
                } ${isUpdatingDistribution ? 'opacity-50 ' : ''}`}
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
          {Object.entries(notificationSettings).map(([item, isActive]) => (
            <div key={item} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-gray-700 font-medium">{item}</span>
              <button
                onClick={() => toggleNotification(item)}
                className={`relative inline-block w-12 h-6 transition-colors duration-300 ease-in-out rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E4983A] focus:ring-offset-2 ${isActive ? 'bg-[#E4983A]' : 'bg-gray-200'
                  }`}
              >
                <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ease-in-out shadow-sm ${isActive ? 'left-7' : 'left-1'
                  }`}></span>
              </button>
            </div>
          ))}
        </div>
      </Card>


    </div>
  </AdminLayout>;
}