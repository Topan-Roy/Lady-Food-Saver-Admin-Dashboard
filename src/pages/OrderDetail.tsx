import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { InvoiceModal } from '../components/modals/InvoiceModal';
import { ArrowLeft, Printer, User, Store } from 'lucide-react';
export function OrderDetail() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [showInvoice, setShowInvoice] = useState(false);
  const order = {
    id: id || 'ORD-1025',
    date: 'Oct 24, 2023 at 2:30 PM',
    status: 'Completed',
    paymentMethod: 'Credit Card (**** 4242)',
    subtotal: '$17.97',
    fee: '$1.50',
    tax: '$0.85',
    total: '$20.32',
    customer: {
      name: 'Dana White',
      email: 'dana@example.com',
      phone: '+1 (555) 987-6543'
    },
    customerName: 'Dana White',
    restaurant: {
      name: "Joe's Pizza",
      address: '123 Main St, New York, NY'
    },
    items: [{
      name: 'Salmon Sushi Roll',
      qty: 2,
      price: '$5.99',
      total: '$11.98'
    }, {
      name: 'Miso Soup',
      qty: 1,
      price: '$5.99',
      total: '$5.99'
    }]
  };
  return <AdminLayout>
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
                  Order #{order.id}
                </h1>
                <p className="text-gray-500 mt-1">{order.date}</p>
              </div>
              <Badge variant="success" className="text-lg px-4 py-1">
                {order.status}
              </Badge>
            </div>

            <div className="space-y-4">
              {order.items.map((item, i) => <div key={i} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500">
                    {item.qty}x
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.price} per item
                    </p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">
                  {item.total}
                </span>
              </div>)}
            </div>

            <div className="border-t border-gray-100 mt-6 pt-6 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>State Tax</span>
                <span>{order.tax}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee</span>
                <span>{order.fee}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                <span>Total</span>
                <span className="text-[#FF6B35]">{order.total}</span>
              </div>
            </div>
          </Card>

          <Card title="Order Timeline">
            <div className="space-y-6 ml-2">
              {[{
                title: 'Picked Up',
                time: '3:15 PM',
                active: true
              }, {
                title: 'Ready For Pickup',
                time: '2:55 PM',
                active: true
              }, {
                title: 'Food Preparing',
                time: '2:35 PM',
                active: true
              }, {
                title: 'Order Placed',
                time: '2:30 PM',
                active: true
              }].map((step, i) => <div key={i} className="relative pl-8 border-l-2 border-gray-200 last:border-0">
                <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full ${step.active ? 'bg-[#FF6B35]' : 'bg-gray-300'}`} />
                <p className="font-medium text-gray-900 leading-none">
                  {step.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">{step.time}</p>
              </div>)}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Customer Details">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-[#FF6B35]">
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
          id: order.id,
          customer: order.customerName,
          restaurant: order.restaurant.name,
          date: order.date,
          items: order.items.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: parseFloat(item.price.replace('$', ''))
          })),
          subtotal: parseFloat(order.subtotal.replace('$', '')),
          tax: parseFloat(order.fee.replace('$', '')),
          total: parseFloat(order.total.replace('$', ''))
        }}
      />
    </div>
  </AdminLayout>;
}