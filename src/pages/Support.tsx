import React, { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SupportChatModal } from '../components/modals/SupportChatModal';
import { MessageSquare } from 'lucide-react';
const tickets = [{
  id: 'TKT-1024',
  subject: 'Refund Request for Order #123',
  user: 'Alice Brown',
  type: 'Customer',
  status: 'Open',
  priority: 'High',
  date: '2 hours ago'
}, {
  id: 'TKT-1023',
  subject: 'Cannot update menu items',
  user: 'Joe Smith',
  type: 'Restaurant',
  status: 'In Progress',
  priority: 'Medium',
  date: '5 hours ago'
}, {
  id: 'TKT-1022',
  subject: 'Account verification issue',
  user: 'New Pizza Place',
  type: 'Restaurant',
  status: 'Resolved',
  priority: 'Low',
  date: '1 day ago'
}];
export function Support() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openChat = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };
  return <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Support Tickets
            </h1>
            <p className="text-gray-500">
              Manage customer and restaurant inquiries
            </p>
          </div>
          <Button leftIcon={<MessageSquare className="h-4 w-4" />}>
            Create Ticket
          </Button>
        </div>

        <Table data={tickets} columns={[{
        header: 'Ticket ID',
        accessorKey: 'id',
        className: 'font-medium'
      }, {
        header: 'Subject',
        accessorKey: 'subject'
      }, {
        header: 'User Type',
        cell: item => <Badge variant="outline">{item.type}</Badge>
      }, {
        header: 'User',
        accessorKey: 'user'
      }, {
        header: 'Priority',
        cell: item => <span className={`font-medium ${item.priority === 'High' ? 'text-red-600' : item.priority === 'Medium' ? 'text-yellow-600' : 'text-blue-600'}`}>
                  {item.priority}
                </span>
      }, {
        header: 'Status',
        cell: item => <Badge variant={item.status === 'Resolved' ? 'success' : item.status === 'Open' ? 'error' : 'warning'}>
                  {item.status}
                </Badge>
      }, {
        header: 'Date',
        accessorKey: 'date'
      }, {
        header: 'Actions',
        cell: item => <Button size="sm" variant="secondary" onClick={() => openChat(item)}>
                  View
                </Button>
      }]} />
      </div>

      <SupportChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} ticket={selectedTicket} />
    </AdminLayout>;
}