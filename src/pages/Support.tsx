import React, { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SupportChatModal } from '../components/modals/SupportChatModal';
const initialTickets = [{
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
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'Medium', user: '', type: 'Customer' });

  const openChat = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleResolveTicket = () => {
    if (selectedTicket) {
      setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'Resolved' } : t));
      setIsModalOpen(false);
    }
  };

  const handleCreateTicket = () => {
    const ticket = {
      id: `TKT-${Math.floor(Math.random() * 10000)}`,
      subject: newTicket.subject,
      user: newTicket.user || 'Admin User',
      type: newTicket.type,
      status: 'Open',
      priority: newTicket.priority,
      date: 'Just now'
    };
    setTickets([ticket, ...tickets]);
    setIsCreateModalOpen(false);
    setNewTicket({ subject: '', priority: 'Medium', user: '', type: 'Customer' });
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
        cell: (item) => <Badge variant="outline">{item.type}</Badge>
      }, {
        header: 'User',
        accessorKey: 'user'
      }, {
        header: 'Priority',
        cell: (item) => <span className={`font-medium ${item.priority === 'High' ? 'text-red-600' : item.priority === 'Medium' ? 'text-yellow-600' : 'text-blue-600'}`}>
          {item.priority}
        </span>
      }, {
        header: 'Status',
        cell: (item) => <Badge variant={item.status === 'Resolved' ? 'success' : item.status === 'Open' ? 'error' : 'warning'}>
          {item.status}
        </Badge>
      }, {
        header: 'Date',
        accessorKey: 'date'
      }, {
        header: 'Actions',
        cell: (item) => <Button size="sm" variant="secondary" onClick={() => openChat(item)}>
          View
        </Button>
      }]} />
    </div >

    <SupportChatModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      ticket={selectedTicket}
      onResolve={handleResolveTicket}
    />

    {/* Create Ticket Modal */}
    {
      isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[500px] max-w-full">
            <h3 className="text-lg font-bold mb-4">Create New Ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  className="w-full border rounded-lg p-2"
                  value={newTicket.subject}
                  onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Issue summary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">User Type</label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={newTicket.type}
                    onChange={e => setNewTicket({ ...newTicket, type: e.target.value })}
                  >
                    <option value="Customer">Customer</option>
                    <option value="Restaurant">Restaurant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={newTicket.priority}
                    onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTicket}>Create Ticket</Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  </AdminLayout >;
}