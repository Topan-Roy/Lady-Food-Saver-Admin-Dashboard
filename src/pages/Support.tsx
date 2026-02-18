import { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SupportChatModal } from '../components/modals/SupportChatModal';
import { useGetSupportTicketsQuery } from '../redux/features/chat';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicket {
  id: string; // display ticketId
  _id: string; // internal mongodb id
  subject: string;
  userId: string; // user id from api
  userType: string; // type from api
  status: string;
  priority: string;
  date: string;
  description: string;
}

export function Support() {
  const { data: ticketsResponse, isLoading } = useGetSupportTicketsQuery({});
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tickets: SupportTicket[] = (ticketsResponse?.data || []).map((t: any) => ({
    id: t.ticketId,
    _id: t._id,
    subject: t.subject,
    userId: t.userId,
    userType: t.userType,
    status: t.status,
    priority: t.priority,
    date: formatDistanceToNow(new Date(t.createdAt), { addSuffix: true }),
    description: t.description
  }));

  const openChat = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleResolveTicket = () => {
    // This will be implemented with a mutation later if needed
    setIsModalOpen(false);
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

      <Table
        isLoading={isLoading}
        data={tickets}
        columns={[{
          header: 'Ticket ID',
          accessorKey: 'id',
          className: 'font-medium'
        }, {
          header: 'Subject',
          accessorKey: 'subject'
        }, {
          header: 'User Type',
          cell: (item: SupportTicket) => <Badge variant="outline">{item.userType}</Badge>
        }, {
          header: 'User',
          accessorKey: 'userId'
        }, {
          header: 'Priority',
          cell: (item: SupportTicket) => <span className={`font-medium ${item.priority === 'High' ? 'text-red-600' : item.priority === 'Medium' ? 'text-yellow-600' : 'text-blue-600'}`}>
            {item.priority}
          </span>
        }, {
          header: 'Status',
          cell: (item: SupportTicket) => <Badge variant={item.status === 'Resolved' ? 'success' : item.status === 'Open' ? 'error' : 'warning'}>
            {item.status}
          </Badge>
        }, {
          header: 'Date',
          accessorKey: 'date'
        }, {
          header: 'Actions',
          cell: (item: SupportTicket) => <Button size="sm" variant="secondary" onClick={() => openChat(item)}>
            View
          </Button>
        }]} />
    </div>

    <SupportChatModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      ticket={selectedTicket}
      onResolve={handleResolveTicket}
    />
  </AdminLayout>;
}