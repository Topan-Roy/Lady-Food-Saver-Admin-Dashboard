import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { InvoiceModal } from '../components/modals/InvoiceModal';
import { ArrowLeft, Printer, User, Store } from 'lucide-react';
import { useGetOrderDetailsQuery } from '../redux/features/dashboardApi';
import { format } from 'date-fns';

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showInvoice, setShowInvoice] = useState(false);

  const { data: orderData, isLoading, isError } = useGetOrderDetailsQuery(id);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E4983A]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (isError || !orderData?.success || !orderData.order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
          <p className="text-gray-500 mt-2">The order you're looking for doesn't exist or there was an error.</p>
          <Button className="mt-6" onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const { order } = orderData;

  const getStatusVariant = (status: string) => {
    status = status.toLowerCase();
    if (status === 'completed' || status === 'order delivered') return 'success';
    if (status === 'pending' || status === 'preparing' || status === 'order placed') return 'warning';
    if (status === 'cancelled') return 'error';
    return 'info';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(-1)}>
            Back to Orders
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" leftIcon={<Printer className="h-4 w-4" />} onClick={() => setShowInvoice(true)}>
              Print Invoice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.orderId}
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy \u2022 hh:mm a')}
                  </p>
                </div>
                <Badge variant={getStatusVariant(order.status)} className="text-lg px-4 py-1 capitalize">
                  {order.status}
                </Badge>
              </div>

              <div className="space-y-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          ${item.pricePerItem.toLocaleString()} per item
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      ${item.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-6 pt-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>State Tax</span>
                  <span>${order.pricing.stateTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee</span>
                  <span>${order.pricing.platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span className="text-[#E4983A]">${order.pricing.total.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <Card title="Order Timeline">
              <div className="space-y-6 ml-2">
                {order.timeline.map((step: any, i: number) => (
                  <div key={i} className="relative pl-8 border-l-2 border-gray-200 last:border-0 pb-6 last:pb-0">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[#E4983A]" />
                    <p className="font-medium text-gray-900 leading-none capitalize">
                      {step.status}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(step.time), 'hh:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Customer Details">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-[#E4983A]">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {order.customer.name}
                  </p>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>{order.customer.email}</p>
                <p>{order.customer.phone}</p>
              </div>
            </Card>

            <Card title="Restaurant Details">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {order.restaurant.name}
                  </p>
                  <p className="text-sm text-gray-500">Restaurant</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>{order.restaurant.address}</p>
              </div>
            </Card>
          </div>
        </div>

        <InvoiceModal
          isOpen={showInvoice}
          onClose={() => setShowInvoice(false)}
          orderData={{
            id: order.orderId,
            customer: order.customer.name,
            restaurant: order.restaurant.name,
            date: format(new Date(order.createdAt), 'MMM dd, yyyy'),
            items: order.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.pricePerItem
            })),
            subtotal: order.pricing.subtotal,
            tax: order.pricing.stateTax,
            total: order.pricing.total
          }}
        />
      </div>
    </AdminLayout>
  );
}
