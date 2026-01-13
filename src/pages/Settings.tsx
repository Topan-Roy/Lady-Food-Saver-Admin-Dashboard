import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Bell, Shield, Globe, CreditCard } from 'lucide-react';
export function Settings() {
  return <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage platform configuration</p>
        </div>

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

        {/* Notifications */}
        <Card>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
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
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer bg-[#FF6B35]">
                    <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm"></span>
                  </div>
                </div>)}
          </div>
        </Card>

        {/* Admin Roles */}
        <Card>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Admin Roles</h3>
              <p className="text-sm text-gray-500">
                Manage team access and permissions.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">Super Admin</p>
                <p className="text-xs text-gray-500">
                  Full access to all systems
                </p>
              </div>
              <Button size="sm" variant="secondary">
                Edit
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-bold text-gray-900">Moderator</p>
                <p className="text-xs text-gray-500">
                  Can approve/reject listings and reviews
                </p>
              </div>
              <Button size="sm" variant="secondary">
                Edit
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>;
}